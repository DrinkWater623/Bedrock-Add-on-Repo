// shelterBuilder.js
// @ts-check

/*
  Generic, safe-ish shelter builder.

  Core safety rule:
  - Never overwrite player valuables (chests, shulkers, etc.).
  - We reserve and operate using a placeholder block (default: minecraft:allow)
    and only replace that placeholder later.

  IMPORTANT:
  - "keep" only places blocks into air.
  - To convert *natural* terrain into placeholder safely, provide a good
    protectedReplaceList (blocks you consider safe to overwrite).

  This file is intended to be reusable across add-ons.
  The caller supplies materials as either:
    - a single string blockId
    - or an array of string blockIds (random choice)

  Dependencies:
  - system (for runTimeout)
  - worldRun, isOnlyAirBetweenY (your existing shared utilities)
  - Blocks.normalizeBlockIdsInPlace (optional but recommended)
*/

import { system } from "@minecraft/server";
import { Blocks } from "../gameObjects/blockLib.js";
import { worldRun } from "../tools/runJobs.js";
import { isOnlyAirBetweenY } from "../tools/biomeLib.js";

/** @typedef {import("@minecraft/server").Dimension} Dimension */
/** @typedef {import("@minecraft/server").Vector3} Vector3 */

/**
 * @typedef {string | string[]} MaterialChoice
 */

/**
 * @typedef {Object} ShelterOptions
 * @property {number} [length=9]
 * @property {number} [height=9]
 * @property {number|"auto"} [stories="auto"]
 * @property {number} [basementDepth=0]
 * @property {boolean} [windows=true]
 * @property {boolean} [roof=true]
 * @property {boolean} [campfire=false]
 * @property {boolean} [elevators=true]
 * @property {number} [outsideClearSpace=0]
 * @property {string} [placeholderBlockId="minecraft:allow"]
 */

/**
 * @typedef {Object} ShelterMaterials
 * @property {MaterialChoice} wall
 * @property {MaterialChoice} [floor]
 * @property {MaterialChoice} [roof]            // defaults to floor (or wall)
 * @property {MaterialChoice} [window]          // default: "minecraft:glass_pane"
 * @property {MaterialChoice} [lamp]            // default: "minecraft:torch"
 * @property {MaterialChoice} [campfire]        // default: "minecraft:campfire"
 * @property {MaterialChoice} [climb]           // string | string[] | "any" is handled via climbCandidates
 * @property {string[]} [climbCandidates]       // used only when climb is "any" or omitted
 */

/**
 * @typedef {Object} ShelterSafety
 * @property {string[]} [protectedReplaceList]  // blocks considered safe to overwrite (converted to placeholder)
 */

/**
 * @typedef {Object} BuildSpec
 * @property {ShelterMaterials} materials
 * @property {ShelterSafety} [safety]
 */

// -----------------------------
// Tiny helpers
// -----------------------------

/** @param {unknown} v @returns {v is string[]} */
function isStringArray (v) {
    return Array.isArray(v) && v.every(s => typeof s === "string");
}

/** @param {unknown} v @returns {v is string} */
function isString (v) {
    return typeof v === "string";
}

/** @param {string[]} arr @returns {string|undefined} */
function pickRandom (arr) {
    if (!arr.length) return undefined;
    const idx = Math.floor(Math.random() * arr.length);
    return arr[ idx ];
}

/**
 * Resolve a material choice:
 * - string => that string
 * - string[] => random item, optionally excluding some
 *
 * @param {MaterialChoice|undefined} choice
 * @param {string} fallback
 * @param {string[]} [exclude]
 */
function resolveChoice (choice, fallback, exclude = []) {
    if (!choice) return fallback;
    if (isString(choice)) return choice;
    if (isStringArray(choice)) {
        const filtered = exclude.length ? choice.filter(x => !exclude.includes(x)) : choice;
        return pickRandom(filtered) ?? pickRandom(choice) ?? fallback;
    }
    return fallback;
}

/**
 * Normalize block IDs in place if Blocks.normalizeBlockIdsInPlace exists.
 * This lets callers pass ids with or without namespace.
 *
 * @param {string[]} ids
 */
function normalizeInPlace (ids) {
    if (!ids?.length) return;
    try {
        Blocks.normalizeBlockIdsInPlace(ids, { verify: false, removeEmpty: true, addNamespace: true });
    } catch {
        // If Blocks isn't available in some environment, silently skip.
    }
}

// -----------------------------
// Direction state helpers for ladders/vines
// -----------------------------

/** @typedef {{ inner: number, outer: number }} BlockData */
/** @typedef {{ NW: BlockData, NE: BlockData, SW: BlockData, SE: BlockData }} DirTable */
/** @typedef {{ get(d?: string): string }} DirHelper */

/**
 * @param {string} stateName
 * @param {DirTable} table
 * @returns {DirHelper}
 */
function makeDirStateHelper (stateName, table) {
    const re = /^(nw|ne|sw|se)(i|o)?$/;
    return {
        get (d = "") {
            const d1 = d.trim().toLowerCase();
            const m = re.exec(d1);
            if (!m) return "";
            const dir = m[ 1 ];
            const io = m[ 2 ] ?? "o";

            /** @type {BlockData} */
            const s =
                dir === "nw" ? table.NW :
                    dir === "ne" ? table.NE :
                        dir === "sw" ? table.SW :
                            table.SE;

            const n = io === "i" ? s.inner : s.outer;
            return `["${stateName}"=${n}]`;
        },
    };
}

const vineDirectionBits = makeDirStateHelper("vine_direction_bits", {
    NW: { inner: 6, outer: 9 },
    SE: { inner: 9, outer: 6 },
    SW: { inner: 3, outer: 12 },
    NE: { inner: 12, outer: 3 },
});

const ladderFacingDirection = makeDirStateHelper("facing_direction", {
    NW: { inner: 5, outer: 4 },
    SE: { inner: 4, outer: 5 },
    SW: { inner: 2, outer: 3 },
    NE: { inner: 3, outer: 2 },
});

/** @type {Record<string, DirHelper>} */
const directionStateByType = {
    "minecraft:vine": vineDirectionBits,
    "minecraft:ladder": ladderFacingDirection,
};

/** @param {string} typeId @param {string} d */
function getDirState (typeId, d) {
    const helper = directionStateByType[ typeId ];
    if (!helper) return "";
    return helper.get(d);
}

// -----------------------------
// Default safety: a minimal, vanilla-ish "safe to overwrite" set.
// (Callers should extend/replace this to match their gameplay expectations.)
// -----------------------------

/** @type {string[]} */
const DEFAULT_PROTECTED_REPLACE = [
    "minecraft:air",
    "minecraft:cave_air",
    "minecraft:grass_block",
    "minecraft:dirt",
    "minecraft:coarse_dirt",
    "minecraft:podzol",
    "minecraft:rooted_dirt",
    "minecraft:mud",
    "minecraft:clay",
    "minecraft:sand",
    "minecraft:red_sand",
    "minecraft:gravel",
    "minecraft:stone",
    "minecraft:cobblestone",
    "minecraft:deepslate",
    "minecraft:tuff",
    "minecraft:calcite",
    "minecraft:andesite",
    "minecraft:diorite",
    "minecraft:granite",
    "minecraft:snow",
    "minecraft:snow_block",
    "minecraft:ice",
    "minecraft:packed_ice",
    "minecraft:water",
    "minecraft:flowing_water",
    "minecraft:seagrass",
    "minecraft:tall_seagrass",
    "minecraft:grass",
    "minecraft:tall_grass",
    "minecraft:fern",
    "minecraft:large_fern",
    "minecraft:dead_bush",
];

normalizeInPlace(DEFAULT_PROTECTED_REPLACE);

// -----------------------------
// BuildQueue: simple command sequencing
// -----------------------------

class BuildQueue {
    /** @param {Dimension} dimension @param {Vector3} origin @param {number} [tickStart=1] */
    constructor(dimension, origin, tickStart = 1) {
        this.dimension = dimension;
        this.origin = origin;
        this.tick = tickStart;
    }
    /** @param {string} cmd */
    run (cmd) {
        worldRun(cmd, this.dimension, this.tick, this.origin);
        this.tick++;
    }
    /** @param {string} cmd */
    runSameTick (cmd) {
        worldRun(cmd, this.dimension, this.tick, this.origin);
    }
}

// -----------------------------
// Main builder
// -----------------------------

export class ShelterBuilder {
    /**
     * @param {Dimension} dimension
     * @param {Vector3} center
     * @param {ShelterOptions} [opts]
     */
    constructor(dimension, center, opts = {}) {
        this.dimension = dimension;

        const x = Math.floor(center.x);
        const y = Math.floor(center.y);
        const z = Math.floor(center.z);
        this.center = { x, y, z };

        this.length = opts.length ?? 9;
        this.height = opts.height ?? 9;

        this.storiesOpt = opts.stories ?? "auto";
        this.basementDepth = opts.basementDepth ?? 0;

        this.windows = opts.windows ?? true;
        this.roof = opts.roof ?? true;
        this.campfireOn = opts.campfire ?? false;
        this.elevators = opts.elevators ?? true;
        this.outsideClearSpace = opts.outsideClearSpace ?? 0;

        this.placeholder = opts.placeholderBlockId ?? "minecraft:allow";

        // fallback defaults if callers omit materials
        this.fallbackWall = "minecraft:cobblestone";
        this.fallbackFloor = "minecraft:oak_planks";
        this.fallbackLamp = "minecraft:torch";
        this.fallbackWindow = "minecraft:glass_pane";
        this.fallbackCampfire = "minecraft:campfire";

        // climb defaults
        this.defaultClimbCandidates = [
            "minecraft:scaffolding",
            "minecraft:ladder",
            "minecraft:vine",
        ];
    }

    /**
     * Build a shelter.
     *
     * @param {BuildSpec} spec
     */
    build (spec) {
        const { materials } = spec;

        // --- normalize any arrays the caller supplies
        /** @type {string[]} */
        const wallPool = isStringArray(materials.wall) ? [ ...materials.wall ] : [];
        /** @type {string[]} */
        const floorPool = isStringArray(materials.floor) ? [ ...materials.floor ] : [];
        /** @type {string[]} */
        const roofPool = isStringArray(materials.roof) ? [ ...materials.roof ] : [];
        /** @type {string[]} */
        const windowPool = isStringArray(materials.window) ? [ ...materials.window ] : [];
        /** @type {string[]} */
        const lampPool = isStringArray(materials.lamp) ? [ ...materials.lamp ] : [];
        /** @type {string[]} */
        const campfirePool = isStringArray(materials.campfire) ? [ ...materials.campfire ] : [];
        /** @type {string[]} */
        const climbPool = isStringArray(materials.climb) ? [ ...materials.climb ] : [];

        normalizeInPlace(wallPool);
        normalizeInPlace(floorPool);
        normalizeInPlace(roofPool);
        normalizeInPlace(windowPool);
        normalizeInPlace(lampPool);
        normalizeInPlace(campfirePool);
        normalizeInPlace(climbPool);

        // --- safety list
        const protectedReplaceList = spec.safety?.protectedReplaceList
            ? [ ...spec.safety.protectedReplaceList ]
            : [ ...DEFAULT_PROTECTED_REPLACE ];

        normalizeInPlace(protectedReplaceList);

        // --- derive bounds
        const { x, y, z } = this.center;
        const halfLength = Math.ceil(this.length / 2);

        const xWall1 = x - halfLength;
        const xWall2 = x + halfLength;
        const zWall1 = z - halfLength;
        const zWall2 = z + halfLength;

        const yFloor = y - 1;
        const yCeiling = y + this.height - 1;
        const yBottom = yFloor - Math.max(0, this.basementDepth);

        const xCenter = Math.floor((xWall1 + xWall2) / 2);
        const zCenter = Math.floor((zWall1 + zWall2) / 2);

        const corners = {
            NW: { x: xWall1, y: yFloor, z: zWall1 },
            NE: { x: xWall2, y: yFloor, z: zWall1 },
            SW: { x: xWall1, y: yFloor, z: zWall2 },
            SE: { x: xWall2, y: yFloor, z: zWall2 },
        };

        // --- resolve final materials
        // wall is required
        const wallMaterial = resolveChoice(
            isStringArray(materials.wall) ? wallPool : materials.wall,
            this.fallbackWall
        );

        // floor defaults to wall if omitted
        const floorMaterial = resolveChoice(
            isStringArray(materials.floor) ? floorPool : materials.floor,
            wallMaterial,
            [ wallMaterial ]
        );

        // roof defaults to floor (or wall)
        const roofMaterial = resolveChoice(
            isStringArray(materials.roof) ? roofPool : materials.roof,
            floorMaterial
        );

        const windowMaterial = resolveChoice(
            isStringArray(materials.window) ? windowPool : materials.window,
            this.fallbackWindow
        );

        const lamp = resolveChoice(
            isStringArray(materials.lamp) ? lampPool : materials.lamp,
            this.fallbackLamp
        );

        const campfireBlock = resolveChoice(
            isStringArray(materials.campfire) ? campfirePool : materials.campfire,
            this.fallbackCampfire
        );

        // climb logic
        const climbCandidates = (materials.climbCandidates?.length ? [ ...materials.climbCandidates ] : [ ...this.defaultClimbCandidates ]);
        normalizeInPlace(climbCandidates);

        let chosenClimb = "";
        if (materials.climb === "any" || !materials.climb) {
            chosenClimb = pickRandom(climbCandidates) ?? "";
        } else if (isString(materials.climb)) {
            chosenClimb = materials.climb;
        } else if (isStringArray(materials.climb)) {
            chosenClimb = pickRandom(climbPool) ?? "";
        }

        // Optional: avoid ladder/vine on slabs because attachment can be weird
        if (wallMaterial.endsWith("slab") && (chosenClimb.endsWith(":ladder") || chosenClimb.endsWith(":vine"))) {
            const alt = climbCandidates.filter(x => x !== "minecraft:ladder" && x !== "minecraft:vine");
            chosenClimb = pickRandom(alt) ?? chosenClimb;
        }

        const isWaterElevator = chosenClimb.endsWith("water");
        const isLadderElevator = chosenClimb.endsWith("ladder");
        const isHangingElevator = chosenClimb.endsWith("weeping_vines") || chosenClimb.endsWith("glow_berries");

        // ---- PHASE 1: reserve + convert protected blocks to placeholder + carve interior
        const q1 = new BuildQueue(this.dimension, this.center, 1);

        // Reserve volume WITHOUT overwriting valuables
        q1.run(`fill ${xWall1} ${yBottom} ${zWall1} ${xWall2} ${yCeiling} ${zWall2} ${this.placeholder} keep`);

        // Ceiling lamp
        q1.run(`fill ${xCenter} ${yCeiling} ${zCenter} ${xCenter} ${yCeiling} ${zCenter} ${lamp} replace ${this.placeholder}`);

        if (this.campfireOn) {
            q1.run(`fill ${xCenter} ${yCeiling + 1} ${zCenter} ${xCenter} ${yCeiling + 1} ${zCenter} ${campfireBlock} keep`);
        }

        // Convert protected blocks to placeholder inside
        for (const block of protectedReplaceList) {
            q1.run(`fill ${xWall1} ${yBottom} ${zWall1} ${xWall2} ${yCeiling} ${zWall2} ${this.placeholder} replace ${block}`);

            // Optional outside clearing: only removes protected blocks
            if (this.outsideClearSpace > 0) {
                const s = this.outsideClearSpace;
                q1.run(`fill ${xWall1 - s} ${yFloor + 1} ${zWall1 - s} ${xWall2 + s} ${yCeiling + s} ${zWall2 + s} air replace ${block}`);
            }
        }

        // Carve interior (including basement air space)
        q1.run(`fill ${xWall1 + 1} ${yBottom + 1} ${zWall1 + 1} ${xWall2 - 1} ${yCeiling - 1} ${zWall2 - 1} air replace ${this.placeholder}`);

        // Prep elevator spaces BEFORE we do checks
        if (this.elevators && chosenClimb) {
            this._prepElevatorSpaces(q1, {
                corners,
                yFloor,
                yCeiling,
                floorMaterial,
                lamp,
                protectedReplaceList,
                isWaterElevator,
                isHangingElevator,
            });
        }

        // ---- PHASE 2: after blocks have updated, do air-column checks + place elevators + floors/windows/roof + final walls
        system.runTimeout(() => {
            const q2 = new BuildQueue(this.dimension, this.center, 1);

            if (this.elevators && chosenClimb) {
                this._placeElevatorsWithChecks(q2, {
                    corners,
                    yFloor,
                    yCeiling,
                    wallMaterial,
                    chosenClimb,
                    isWaterElevator,
                    isLadderElevator,
                });
            }

            // Roof (replace placeholder only)
            if (this.roof) {
                q2.run(`fill ${xWall1 + 1} ${yCeiling} ${zWall1 + 1} ${xWall2 - 1} ${yCeiling} ${zWall2 - 1} ${roofMaterial} replace ${this.placeholder}`);
            }

            // Floors + windows
            this._buildFloorsAndWindows(q2, {
                xWall1, xWall2, zWall1, zWall2,
                xCenter, zCenter,
                yFloor, yCeiling,
                floorMaterial, lamp,
                windowMaterial,
            });

            // Final outer walls: replace remaining placeholder only
            q2.run(`fill ${xWall1} ${yBottom} ${zWall1} ${xWall2} ${yCeiling} ${zWall2} ${wallMaterial} replace ${this.placeholder}`);
        }, q1.tick);
    }

    /**
     * Prep holes/columns so later air-column checks can succeed.
     *
     * @param {BuildQueue} q
     * @param {{
     *  corners: {NW: Vector3, NE: Vector3, SW: Vector3, SE: Vector3},
     *  yFloor: number,
     *  yCeiling: number,
     *  floorMaterial: string,
     *  lamp: string,
     *  protectedReplaceList: string[],
     *  isWaterElevator: boolean,
     *  isHangingElevator: boolean,
     * }} p
     */
    _prepElevatorSpaces (q, p) {
        const { corners, yFloor, yCeiling, floorMaterial, lamp, protectedReplaceList, isWaterElevator, isHangingElevator } = p;

        const newFloorCheck = isWaterElevator ? yFloor : yFloor + 1;
        const newCeilCheck = yCeiling + 2;

        // Clear outside corner columns
        for (const c of Object.values(corners)) {
            q.run(`fill ${c.x} ${newFloorCheck} ${c.z} ${c.x} ${newCeilCheck} ${c.z} air replace ${this.placeholder}`);
        }

        // Clear 1-block holes in the ceiling on inside-corners
        q.run(`fill ${corners.NW.x + 1} ${yCeiling} ${corners.NW.z + 1} ${corners.NW.x + 1} ${yCeiling} ${corners.NW.z + 1} air replace ${this.placeholder}`);
        q.run(`fill ${corners.SE.x - 1} ${yCeiling} ${corners.SE.z - 1} ${corners.SE.x - 1} ${yCeiling} ${corners.SE.z - 1} air replace ${this.placeholder}`);
        q.run(`fill ${corners.SW.x + 1} ${yCeiling} ${corners.SW.z - 1} ${corners.SW.x + 1} ${yCeiling} ${corners.SW.z - 1} air replace ${this.placeholder}`);
        q.run(`fill ${corners.NE.x - 1} ${yCeiling} ${corners.NE.z + 1} ${corners.NE.x - 1} ${yCeiling} ${corners.NE.z + 1} air replace ${this.placeholder}`);

        // Water elevators need drain holes at floor level (inside + outside corners)
        if (isWaterElevator) {
            // Inside floor holes
            q.run(`fill ${corners.NW.x + 1} ${yFloor} ${corners.NW.z + 1} ${corners.NW.x + 1} ${yFloor} ${corners.NW.z + 1} air replace ${this.placeholder}`);
            q.run(`fill ${corners.SE.x - 1} ${yFloor} ${corners.SE.z - 1} ${corners.SE.x - 1} ${yFloor} ${corners.SE.z - 1} air replace ${this.placeholder}`);
            q.run(`fill ${corners.SW.x + 1} ${yFloor} ${corners.SW.z - 1} ${corners.SW.x + 1} ${yFloor} ${corners.SW.z - 1} air replace ${this.placeholder}`);
            q.run(`fill ${corners.NE.x - 1} ${yFloor} ${corners.NE.z + 1} ${corners.NE.x - 1} ${yFloor} ${corners.NE.z + 1} air replace ${this.placeholder}`);

            // Outside floor holes
            q.run(`fill ${corners.NW.x} ${yFloor} ${corners.NW.z} ${corners.NW.x} ${yFloor} ${corners.NW.z} air replace ${this.placeholder}`);
            q.run(`fill ${corners.SE.x} ${yFloor} ${corners.SE.z} ${corners.SE.x} ${yFloor} ${corners.SE.z} air replace ${this.placeholder}`);
            q.run(`fill ${corners.SW.x} ${yFloor} ${corners.SW.z} ${corners.SW.x} ${yFloor} ${corners.SW.z} air replace ${this.placeholder}`);
            q.run(`fill ${corners.NE.x} ${yFloor} ${corners.NE.z} ${corners.NE.x} ${yFloor} ${corners.NE.z} air replace ${this.placeholder}`);

            // Optional: place lamps under drain holes, but ONLY if below is protected-replace
            const newFloor = yFloor - 1;
            const spots = [
                { x: corners.NW.x, z: corners.NW.z },
                { x: corners.SE.x, z: corners.SE.z },
                { x: corners.SW.x, z: corners.SW.z },
                { x: corners.NE.x, z: corners.NE.z },
                { x: corners.NW.x + 1, z: corners.NW.z + 1 },
                { x: corners.SE.x - 1, z: corners.SE.z - 1 },
                { x: corners.SW.x + 1, z: corners.SW.z - 1 },
                { x: corners.NE.x - 1, z: corners.NE.z + 1 },
            ];

            for (const block of protectedReplaceList) {
                for (const s of spots) {
                    q.run(`fill ${s.x} ${newFloor} ${s.z} ${s.x} ${newFloor} ${s.z} ${lamp} replace ${block}`);
                }
            }
        }

        // Hanging elevators need a ceiling anchor block above
        if (isHangingElevator) {
            const anchorY = yCeiling + 3;
            const anchors = [
                { x: corners.NW.x + 1, z: corners.NW.z + 1 },
                { x: corners.SE.x - 1, z: corners.SE.z - 1 },
                { x: corners.SW.x + 1, z: corners.SW.z - 1 },
                { x: corners.NE.x - 1, z: corners.NE.z + 1 },
                { x: corners.NW.x, z: corners.NW.z },
                { x: corners.SE.x, z: corners.SE.z },
                { x: corners.SW.x, z: corners.SW.z },
                { x: corners.NE.x, z: corners.NE.z },
            ];
            for (const a of anchors) {
                q.run(`setblock ${a.x} ${anchorY} ${a.z} ${floorMaterial} keep`);
            }
        }
    }

    /**
     * Place elevators after air-column checks.
     *
     * @param {BuildQueue} q
     * @param {{
     *  corners: {NW: Vector3, NE: Vector3, SW: Vector3, SE: Vector3},
     *  yFloor: number,
     *  yCeiling: number,
     *  wallMaterial: string,
     *  chosenClimb: string,
     *  isWaterElevator: boolean,
     *  isLadderElevator: boolean,
     * }} p
     */
    _placeElevatorsWithChecks (q, p) {
        const { corners, yFloor, yCeiling, wallMaterial, chosenClimb, isWaterElevator, isLadderElevator } = p;

        const newFloorPlace = isWaterElevator ? yCeiling : yFloor + 1;
        const newCeilPlace = (isWaterElevator || isLadderElevator) ? yCeiling : yCeiling + 2;

        const newFloorCheck = isWaterElevator ? yFloor : yFloor + 1;
        const newCeilCheck = yCeiling + 2;

        const inside = {
            NW: { x: corners.NW.x + 1, z: corners.NW.z + 1, d: "nwi" },
            SE: { x: corners.SE.x - 1, z: corners.SE.z - 1, d: "sei" },
            SW: { x: corners.SW.x + 1, z: corners.SW.z - 1, d: "swi" },
            NE: { x: corners.NE.x - 1, z: corners.NE.z + 1, d: "nei" },
        };

        const outside = {
            NW: { x: corners.NW.x, z: corners.NW.z, d: "nwo" },
            SE: { x: corners.SE.x, z: corners.SE.z, d: "seo" },
            SW: { x: corners.SW.x, z: corners.SW.z, d: "swo" },
            NE: { x: corners.NE.x, z: corners.NE.z, d: "neo" },
        };

        // Inside columns
        for (const p2 of Object.values(inside)) {
            const ok = isOnlyAirBetweenY(this.dimension, p2.x, p2.z, newFloorCheck, newCeilCheck);
            if (ok) {
                q.run(`fill ${p2.x} ${newFloorPlace} ${p2.z} ${p2.x} ${newCeilPlace} ${p2.z} ${chosenClimb} ${getDirState(chosenClimb, p2.d)}`);
            }
        }

        // Outside columns: allow placeholder & wall material to count as air-ish for the check
        for (const p2 of Object.values(outside)) {
            const ok = isOnlyAirBetweenY(this.dimension, p2.x, p2.z, newFloorCheck, newCeilCheck, {
                airTypeIds: [ "minecraft:air", "minecraft:cave_air", this.placeholder, wallMaterial ],
            });
            if (ok) {
                q.run(`fill ${p2.x} ${newFloorPlace} ${p2.z} ${p2.x} ${newCeilPlace} ${p2.z} ${chosenClimb} ${getDirState(chosenClimb, p2.d)}`);
            }
        }
    }

    /**
     * Floors + windows for multi-story shelters.
     *
     * @param {BuildQueue} q
     * @param {{
     *  xWall1: number, xWall2: number,
     *  zWall1: number, zWall2: number,
     *  xCenter: number, zCenter: number,
     *  yFloor: number, yCeiling: number,
     *  floorMaterial: string,
     *  lamp: string,
     *  windowMaterial: string,
     * }} p
     */
    _buildFloorsAndWindows (q, p) {
        const {
            xWall1, xWall2, zWall1, zWall2,
            xCenter, zCenter,
            yFloor, yCeiling,
            floorMaterial, lamp,
            windowMaterial,
        } = p;

        const FLOOR_STEP = 4;
        const WINDOW_OFFSET = 2;

        const maxStoriesByHeight = Math.max(1, Math.floor(this.height / FLOOR_STEP));
        const stories =
            this.storiesOpt === "auto"
                ? maxStoriesByHeight
                : Math.max(1, Math.min(maxStoriesByHeight, this.storiesOpt));

        /** @param {number} yLevel */
        const installFloor = (yLevel) => {
            q.run(`fill ${xCenter} ${yLevel} ${zCenter} ${xCenter} ${yLevel} ${zCenter} ${lamp} keep`);
            q.run(`fill ${xWall1 + 2} ${yLevel} ${zWall1 + 2} ${xWall2 - 2} ${yLevel} ${zWall2 - 2} ${floorMaterial} replace ${this.placeholder}`);
        };

        /** @param {number} yLevel */
        const installWindows = (yLevel) => {
            if (yLevel + 1 >= yCeiling) return;

            q.run(`fill ${xCenter - 1} ${yLevel} ${zWall1} ${xCenter + 1} ${yLevel + 1} ${zWall1} ${windowMaterial} replace ${this.placeholder}`);
            q.run(`fill ${xCenter - 1} ${yLevel} ${zWall2} ${xCenter + 1} ${yLevel + 1} ${zWall2} ${windowMaterial} replace ${this.placeholder}`);

            q.run(`fill ${xWall1} ${yLevel} ${zCenter - 1} ${xWall1 - 1} ${yLevel + 1} ${zCenter + 1} ${windowMaterial} replace ${this.placeholder}`);
            q.run(`fill ${xWall2} ${yLevel} ${zCenter - 1} ${xWall2 + 1} ${yLevel + 1} ${zCenter + 1} ${windowMaterial} replace ${this.placeholder}`);
        };

        // Floors above ground
        for (let s = 2; s <= stories; s++) {
            const yLevel = yFloor + (s - 1) * FLOOR_STEP;
            if (yLevel >= yCeiling) break;

            installFloor(yLevel);
            if (this.windows) installWindows(yLevel + WINDOW_OFFSET);
        }
    }
}

/*
USAGE EXAMPLE:

import { ShelterBuilder } from "./shelterBuilder.js";

const b = new ShelterBuilder(player.dimension, player.location, {
  length: 9,
  height: 9,
  stories: 2,
  basementDepth: 0,
  windows: true,
  roof: true,
  elevators: true,
  outsideClearSpace: 4,
  placeholderBlockId: "minecraft:allow",
});

b.build({
  materials: {
    wall: ["cobblestone", "stone_bricks"],
    floor: "oak_planks",
    roof: "spruce_planks",
    window: ["glass_pane", "white_stained_glass_pane"],
    lamp: ["torch", "lantern"],
    climb: "any",
    climbCandidates: ["scaffolding", "ladder", "vine"],
  },
  safety: {
    protectedReplaceList: [
      // extend/override for your add-on:
      "dirt", "grass_block", "stone", "sand", "gravel"
    ]
  }
});
*/
