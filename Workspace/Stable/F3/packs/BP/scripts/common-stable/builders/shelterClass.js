// shelterClass.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T. (https://www.gnu.org/licenses/gpl-3.0.html)
URL: https://github.com/DrinkWater623
========================================================================
TODO: make a real class =>  version 2

// ========================================================================
Change Log:
    20260102 - Created
    20260104 - moved v1 to own shared file in library
========================================================================*/
// Minecraft
import { Dimension, Player, system } from "@minecraft/server";
// Shared.
import { randomArrayItem, randomArrayStringExcept } from "../tools/objects.js";
import { isOnlyAirBetweenY } from "../tools/biomeLib.js";
import { worldRun } from "../tools/runJobs.js";
import { Blocks, BlockTypeIds } from "../gameObjects/index.js";
import { airBlock, fallThruBlocks, lavaBlocks, waterBlocks } from "../../common-data/block-data.js";
//==============================================================================
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/**
 * @typedef {{ inner: number, outer: number }} BlockData
 * @typedef {{ NW: BlockData, NE: BlockData, SW: BlockData, SE: BlockData }} DirTable
 * @typedef {{ get(d?: string): string }} DirHelper
 */
//==============================================================================

//==============================================================================
/**
 * @param {string} stateName
 * @param {DirTable} table
 * @returns {DirHelper}
 */
function makeDirStateHelper (stateName, table) {
    /**
     * Valid inputs:
     *  - "nw", "ne", "sw", "se"
     *  - "nwi" (inner), "nwo" (outer), etc.
     */
    const re = /^(nw|ne|sw|se)(i|o)?$/;

    return {
        /**
         * @param {string} [d=""]
         * @returns {string} blockstate string or ""
         */
        get (d = "") {
            const d1 = d.trim().toLowerCase();
            const m = re.exec(d1);
            if (!m) return "";

            const dir = m[ 1 ];          // "nw" | "ne" | "sw" | "se"
            const io = m[ 2 ] ?? "o";    // default to outer if omitted

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
/**
 * Safe accessor: returns "" if typeId missing OR d invalid.
 *
 * @param {string} typeId
 * @param {string} d
 * @returns {string}
 */
function getDirState (typeId, d) {
    const helper = directionStateByType[ typeId ];
    if (!helper) return "";
    return helper.get(d); // helper.get already returns "" for invalid d
}
//==============================================================================
/**
 *  Add lights
 * @param {string[]} input_materialPool 
 * @param {string} input_climbingMaterial 
 * @param {Dimension} dimension 
 * @param {Vector3} locationCenter 
 * @param {string} lamp
 * @param {number} length 
 * @param {number} height 
 */
export function shelterBuild (input_materialPool, input_climbingMaterial, lamp, dimension, locationCenter, length = 9, height = 9) {

    //if (input_materialPool.length == 0) { return; }

    let { x, y, z } = locationCenter;
    x = Math.floor(x);
    y = Math.floor(y);
    z = Math.floor(z);

    const halfLength = Math.ceil(length / 2);
    let tick = 1;
    let command = '';

    const xWall1 = x - halfLength;
    const xWall2 = x + halfLength;
    const zWall1 = z - halfLength;
    const zWall2 = z + halfLength;
    const yFloor = y - 1;
    const yCeiling = y + height - 1;
    const yFloor2 = yFloor + 4;
    const xCenter = Math.floor(xWall1 + xWall2) / 2;
    const zCenter = Math.floor(zWall1 + zWall2) / 2;    
    const corners = {
        NW_negXZ: { x: xWall1, y: yFloor, z: zWall1 },
        NE_posX_negZ: { x: xWall2, y: yFloor, z: zWall1 },
        SW_negX_posZ: { x: xWall1, y: yFloor, z: zWall2 },
        SE_posXZ: { x: xWall2, y: yFloor, z: zWall2 }
    };
    const replaceAllowList = [
    ...BlockTypeIds.getNaturalOverworldAboveZeroStoneBlockTypeIds(),
    ...fallThruBlocks,
    ...BlockTypeIds.getDirtyBlockTypeIds(),
    'sand', 'gravel', 'red_sand',
    'minecraft:snow_block', 'minecraft:snow', 'minecraft:ice', 'minecraft:powder_snow' //  leave blue and packed ice, these are valuable
];
Blocks.normalizeBlockIdsInPlace(replaceAllowList, { verify: true, removeEmpty: true, addNamespace: true });
    //----------
    // Materials
    //----------
    const wallMaterialPool = input_materialPool
        .filter(b => !b.endsWith('_carpet'));
    Blocks.normalizeBlockIdsInPlace(wallMaterialPool, { addNamespace: true, verify: true, removeEmpty: true });

    /* Make sure no Gravity blocks, carpet or magma */
    const floorMaterialPool = wallMaterialPool
        .filter(b =>
            !BlockTypeIds.getGravityBlockTypeIdSet().has(b) &&
            !fallThruBlocks.includes(b) &&
            !lavaBlocks.includes(b) &&
            !b.includes(':magma')
        );

    const tempMaterial = 'minecraft:allow';
    const defaultMaterial = 'minecraft:cobblestone_slab';
    const default_climbingMaterial = 'minecraft:scaffolding';

    const wallMaterial = randomArrayItem(wallMaterialPool) ?? defaultMaterial;
    const floorMaterial = randomArrayStringExcept(floorMaterialPool, [ wallMaterial ]) ?? defaultMaterial;
    const windowMaterial = randomArrayItem(BlockTypeIds.getGlassPaneBlockTypeIds()) ?? 'glass_pane';
    const climbingMaterial = (
        wallMaterial.endsWith('slab') && (input_climbingMaterial.endsWith(':vine') || input_climbingMaterial.endsWith(':ladder'))
            ? randomArrayStringExcept(BlockTypeIds.getClimbableBlockTypeIds(), [ 'minecraft:vine', 'minecraft:ladder' ])
            : BlockTypeIds.getClimbableBlockTypeIds().includes(input_climbingMaterial) || waterBlocks.includes(input_climbingMaterial)
                ? input_climbingMaterial
                : randomArrayItem(BlockTypeIds.getClimbableBlockTypeIds())
    ) ?? default_climbingMaterial;
    const isWaterElevator = !!climbingMaterial && climbingMaterial.endsWith('water');
    const isLadderElevator = !!climbingMaterial && climbingMaterial.endsWith('ladder');
    const isHangingElevator = !!climbingMaterial && (climbingMaterial.endsWith('weeping_vine') || climbingMaterial.endsWith('glow_berries'));
    //----------------------------------------------------------------------------------------------------
    //First Fill -  with keeping what is still there like chests and stuff
    command = `fill ${xWall1} ${yFloor} ${zWall1}  ${xWall2} ${yCeiling} ${zWall2} ${tempMaterial} keep`;
    worldRun(command, dimension, tick, locationCenter);
    tick++;
    //Ceiling Lamp
    command = `fill ${xCenter} ${yCeiling} ${zCenter}  ${xCenter} ${yCeiling} ${zCenter} ${lamp} replace ${tempMaterial}`;
    worldRun(command, dimension, tick, locationCenter);
    //add campfire on roof
    command = `fill ${xCenter} ${yCeiling + 1} ${zCenter}  ${xCenter} ${yCeiling + 1} ${zCenter} campfire keep`;
    worldRun(command, dimension, tick, locationCenter);
    //----------------------------------------------------------------------------------------------------
    /* Clear natural blocks (non-crafted) - avoids messing up unintended blocks like chests / shulkers */
    replaceAllowList.forEach((block) => {
        //Within the structure - clean up natural blocks
        command = `fill ${xWall1} ${yFloor} ${zWall1}  ${xWall2} ${yCeiling} ${zWall2} ${tempMaterial} replace ${block}`;
        worldRun(command, dimension, tick, locationCenter);

        //clear some of the outside area
        const space = 4;
        command = `fill ${xWall1 - space} ${yFloor + 1} ${zWall1 - space}  ${xWall2 + space} ${yCeiling + space} ${zWall2 + space} air replace ${block}`;
        worldRun(command, dimension, tick, locationCenter);
    });
    tick++;

    //space for water to fall in
    if (isWaterElevator) {
        //space for water to fall INSIDE the shelter
        command = `fill ${corners.NW_negXZ.x + 1} ${yFloor} ${corners.NW_negXZ.z + 1}  ${corners.NW_negXZ.x + 1} ${yFloor} ${corners.NW_negXZ.z + 1} air replace ${tempMaterial}`;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${corners.SE_posXZ.x - 1} ${yFloor} ${corners.SE_posXZ.z - 1}  ${corners.SE_posXZ.x - 1} ${yFloor} ${corners.SE_posXZ.z - 1}  air replace ${tempMaterial}`;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${corners.SW_negX_posZ.x + 1} ${yFloor} ${corners.SW_negX_posZ.z - 1}  ${corners.SW_negX_posZ.x + 1} ${yFloor} ${corners.SW_negX_posZ.z - 1} air replace ${tempMaterial}`;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${corners.NE_posX_negZ.x - 1} ${yFloor} ${corners.NE_posX_negZ.z + 1}  ${corners.NE_posX_negZ.x - 1} ${yFloor} ${corners.NE_posX_negZ.z + 1} air replace ${tempMaterial}`;
        worldRun(command, dimension, tick, locationCenter);

        //space for water to fall OUTSIDE the shelter
        command = `fill ${corners.NW_negXZ.x} ${yFloor} ${corners.NW_negXZ.z}  ${corners.NW_negXZ.x} ${yFloor} ${corners.NW_negXZ.z} air replace ${tempMaterial}`;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${corners.SE_posXZ.x} ${yFloor} ${corners.SE_posXZ.z}  ${corners.SE_posXZ.x} ${yFloor} ${corners.SE_posXZ.z}  air replace ${tempMaterial}`;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${corners.SW_negX_posZ.x} ${yFloor} ${corners.SW_negX_posZ.z}  ${corners.SW_negX_posZ.x} ${yFloor} ${corners.SW_negX_posZ.z} air replace ${tempMaterial}`;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${corners.NE_posX_negZ.x} ${yFloor} ${corners.NE_posX_negZ.z}  ${corners.NE_posX_negZ.x} ${yFloor} ${corners.NE_posX_negZ.z} air replace ${tempMaterial}`;
        worldRun(command, dimension, tick, locationCenter);

        //Add lamp below the space
        replaceAllowList.forEach((block) => {
            let newFloor = yFloor - 1;

            //place a light below OUTSIDE
            command = `fill ${corners.NW_negXZ.x} ${newFloor} ${corners.NW_negXZ.z}  ${corners.NW_negXZ.x} ${newFloor} ${corners.NW_negXZ.z} ${lamp} replace ${block}`;
            worldRun(command, dimension, tick, locationCenter);

            command = `fill ${corners.SE_posXZ.x} ${newFloor} ${corners.SE_posXZ.z}  ${corners.SE_posXZ.x} ${newFloor} ${corners.SE_posXZ.z} ${lamp} replace ${block}`;
            worldRun(command, dimension, tick, locationCenter);

            command = `fill ${corners.SW_negX_posZ.x} ${newFloor} ${corners.SW_negX_posZ.z}  ${corners.SW_negX_posZ.x} ${newFloor} ${corners.SW_negX_posZ.z} ${lamp} replace ${block}`;
            worldRun(command, dimension, tick, locationCenter);

            command = `fill ${corners.NE_posX_negZ.x} ${newFloor} ${corners.NE_posX_negZ.z}  ${corners.NE_posX_negZ.x} ${newFloor} ${corners.NE_posX_negZ.z} ${lamp} replace ${block}`;
            worldRun(command, dimension, tick, locationCenter);

            //place a light below inside
            command = `fill ${corners.NW_negXZ.x + 1} ${newFloor} ${corners.NW_negXZ.z + 1}  ${corners.NW_negXZ.x + 1} ${newFloor} ${corners.NW_negXZ.z + 1} ${lamp} replace ${block}`;
            worldRun(command, dimension, tick, locationCenter);

            command = `fill ${corners.SE_posXZ.x - 1} ${newFloor} ${corners.SE_posXZ.z - 1}  ${corners.SE_posXZ.x - 1} ${newFloor} ${corners.SE_posXZ.z - 1} ${lamp} replace ${block}`;
            worldRun(command, dimension, tick, locationCenter);

            command = `fill ${corners.SW_negX_posZ.x + 1} ${newFloor} ${corners.SW_negX_posZ.z - 1}  ${corners.SW_negX_posZ.x + 1} ${newFloor} ${corners.SW_negX_posZ.z - 1} ${lamp} replace ${block}`;
            worldRun(command, dimension, tick, locationCenter);

            command = `fill ${corners.NE_posX_negZ.x - 1} ${newFloor} ${corners.NE_posX_negZ.z + 1}  ${corners.NE_posX_negZ.x - 1} ${newFloor} ${corners.NE_posX_negZ.z + 1} ${lamp} replace ${block}`;
            worldRun(command, dimension, tick, locationCenter);
        });
        tick++;
    }
    //----------------------------------------------------------------------------------------------------

    //remove inner temp material 
    command = `fill ${xWall1 + 1} ${yFloor + 1} ${zWall1 + 1}  ${xWall2 - 1} ${yCeiling - 1} ${zWall2 - 1} air replace ${tempMaterial}`;
    worldRun(command, dimension, tick, locationCenter);
    tick++;
    //----------------------------------------------------------------------------------------------------
    //in inner-corners, to get to 2nd floor and roof TODO: foolproof, check whole column clear for any
    //count how many,, if none, try center, then one corner in... must be at least one way up
    if (climbingMaterial) {

        let newFloorPlace = isWaterElevator ? yCeiling : yFloor + 1;
        const newCeilPlace = isWaterElevator || isLadderElevator ? yCeiling : yCeiling + 2;

        let newFloorCheck = isWaterElevator ? yFloor : yFloor + 1;
        const newCeilCheck = yCeiling + 2;
        //Prep OUTSIDE Corner - clear it
        command = `fill ${corners.NW_negXZ.x} ${newFloorCheck} ${corners.NW_negXZ.z}  ${corners.NW_negXZ.x} ${newCeilCheck} ${corners.NW_negXZ.z} air replace ${tempMaterial} `;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${corners.SE_posXZ.x} ${newFloorCheck} ${corners.SE_posXZ.z}  ${corners.SE_posXZ.x} ${newCeilCheck} ${corners.SE_posXZ.z} air replace ${tempMaterial} `;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${corners.SW_negX_posZ.x} ${newFloorCheck} ${corners.SW_negX_posZ.z}  ${corners.SW_negX_posZ.x} ${newCeilCheck} ${corners.SW_negX_posZ.z} air replace ${tempMaterial} `;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${corners.NE_posX_negZ.x} ${newFloorCheck} ${corners.NE_posX_negZ.z}  ${corners.NE_posX_negZ.x} ${newCeilCheck} ${corners.NE_posX_negZ.z} air replace ${tempMaterial} `;
        worldRun(command, dimension, tick, locationCenter);

        //Prep INSIDE Ceiling with a hole to get thru.  A trapdoor will be placed above it
        command = `fill ${corners.NW_negXZ.x + 1} ${yCeiling} ${corners.NW_negXZ.z + 1}  ${corners.NW_negXZ.x + 1} ${yCeiling} ${corners.NW_negXZ.z + 1} air replace ${tempMaterial} `;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${corners.SE_posXZ.x - 1} ${yCeiling} ${corners.SE_posXZ.z - 1}  ${corners.SE_posXZ.x - 1} ${yCeiling} ${corners.SE_posXZ.z - 1} air replace ${tempMaterial} `;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${corners.SW_negX_posZ.x + 1} ${yCeiling} ${corners.SW_negX_posZ.z - 1}  ${corners.SW_negX_posZ.x + 1} ${yCeiling} ${corners.SW_negX_posZ.z - 1} air replace ${tempMaterial} `;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${corners.NE_posX_negZ.x - 1} ${yCeiling} ${corners.NE_posX_negZ.z + 1}  ${corners.NE_posX_negZ.x - 1} ${yCeiling} ${corners.NE_posX_negZ.z + 1} air replace ${tempMaterial} `;
        worldRun(command, dimension, tick, locationCenter);

        // Place INSIDE trapdoors while in here - but not all of them should have one - need to test what mobs can fall into?  in none, then take out
        // if (![ 'minecraft:water', 'minecraft:scaffolding', 'minecraft:glow_berries', 'minecraft:weeping_vines' ].includes(climbingMaterial)) {
        //     command = `fill ${corners.negXZ.x + 1} ${yCeiling + 1} ${corners.negXZ.z + 1}  ${corners.negXZ.x + 1} ${yCeiling + 1} ${corners.negXZ.z + 1} ${trapdoor} keep `;
        //     worldRun(command, dimension, tick, locationCenter);

        //     command = `fill ${corners.posXZ.x - 1} ${yCeiling + 1} ${corners.posXZ.z - 1}  ${corners.posXZ.x - 1} ${yCeiling + 1} ${corners.posXZ.z - 1} ${trapdoor} keep `;
        //     worldRun(command, dimension, tick, locationCenter);

        //     command = `fill ${corners.negX_posZ.x + 1} ${yCeiling + 1} ${corners.negX_posZ.z - 1}  ${corners.negX_posZ.x + 1} ${yCeiling + 1} ${corners.negX_posZ.z - 1} ${trapdoor} keep `;
        //     worldRun(command, dimension, tick, locationCenter);

        //     command = `fill ${corners.posX_negZ.x - 1} ${yCeiling + 1} ${corners.posX_negZ.z + 1}  ${corners.posX_negZ.x - 1} ${yCeiling + 1} ${corners.posX_negZ.z + 1} ${trapdoor} keep `;
        //     worldRun(command, dimension, tick, locationCenter);
        // }

        //Overhead holder of hanging blocks, 3 above ceiling block, newCeilCheck is already 2 above 
        if (isHangingElevator) {
            //Inside roof elevator area
            command = `setblock ${corners.NW_negXZ.x + 1}     ${newCeilCheck + 1} ${corners.NW_negXZ.z + 1}      ${floorMaterial} keep`;
            worldRun(command, dimension, tick, locationCenter);
            command = `setblock ${corners.SE_posXZ.x - 1}     ${newCeilCheck + 1} ${corners.SE_posXZ.z - 1}      ${floorMaterial} keep`;
            worldRun(command, dimension, tick, locationCenter);
            command = `setblock ${corners.SW_negX_posZ.x + 1} ${newCeilCheck + 1} ${corners.SW_negX_posZ.z - 1}  ${floorMaterial} keep`;
            worldRun(command, dimension, tick, locationCenter);
            command = `setblock ${corners.NE_posX_negZ.x - 1} ${newCeilCheck + 1} ${corners.NE_posX_negZ.z + 1}  ${floorMaterial} keep`;
            worldRun(command, dimension, tick, locationCenter);
            //Outside roof elevator area
            command = `setblock ${corners.NW_negXZ.x}     ${newCeilCheck + 1} ${corners.NW_negXZ.z}      ${floorMaterial} keep`;
            worldRun(command, dimension, tick, locationCenter);
            command = `setblock ${corners.SE_posXZ.x}     ${newCeilCheck + 1} ${corners.SE_posXZ.z}      ${floorMaterial} keep`;
            worldRun(command, dimension, tick, locationCenter);
            command = `setblock ${corners.SW_negX_posZ.x} ${newCeilCheck + 1} ${corners.SW_negX_posZ.z}  ${floorMaterial} keep`;
            worldRun(command, dimension, tick, locationCenter);
            command = `setblock ${corners.NE_posX_negZ.x} ${newCeilCheck + 1} ${corners.NE_posX_negZ.z}  ${floorMaterial} keep`;
            worldRun(command, dimension, tick, locationCenter);
        }
        tick++;
        //In a sys run because of the block checking.  needs to happen after space is clear for a valid check to return
        system.runTimeout(() => {
            let insideElevators = 0;
            const isVine = !!(climbingMaterial && climbingMaterial.endsWith(':vine'));
            //Place Inside Elevators
            let ok = isOnlyAirBetweenY(dimension, corners.NW_negXZ.x + 1, corners.NW_negXZ.z + 1, newFloorCheck, newCeilCheck);
            if (ok) {
                insideElevators++;
                command = `fill ${corners.NW_negXZ.x + 1} ${newFloorPlace} ${corners.NW_negXZ.z + 1}  ${corners.NW_negXZ.x + 1} ${newCeilPlace} ${corners.NW_negXZ.z + 1} ${climbingMaterial} ${getDirState(climbingMaterial, 'nwi')}`;
                worldRun(command, dimension, tick, locationCenter);
            }
            ok = isOnlyAirBetweenY(dimension, corners.SE_posXZ.x - 1, corners.SE_posXZ.z - 1, newFloorCheck, newCeilCheck);
            if (ok) {
                insideElevators++;
                command = `fill ${corners.SE_posXZ.x - 1} ${newFloorPlace} ${corners.SE_posXZ.z - 1}  ${corners.SE_posXZ.x - 1} ${newCeilPlace} ${corners.SE_posXZ.z - 1}  ${climbingMaterial} ${getDirState(climbingMaterial, 'sei')}`;
                worldRun(command, dimension, tick, locationCenter);
                console.warn('se');
            }
            ok = isOnlyAirBetweenY(dimension, corners.SW_negX_posZ.x + 1, corners.SW_negX_posZ.z - 1, newFloorCheck, newCeilCheck);
            if (ok) {
                insideElevators++; newCeilPlace;
                command = `fill ${corners.SW_negX_posZ.x + 1} ${newFloorPlace} ${corners.SW_negX_posZ.z - 1}  ${corners.SW_negX_posZ.x + 1} ${newCeilPlace} ${corners.SW_negX_posZ.z - 1} ${climbingMaterial} ${getDirState(climbingMaterial, 'swi')}`;
                worldRun(command, dimension, tick, locationCenter);
                console.warn('sw');
            }
            ok = isOnlyAirBetweenY(dimension, corners.NE_posX_negZ.x - 1, corners.NE_posX_negZ.z + 1, newFloorCheck, newCeilCheck);
            if (ok) {
                insideElevators++;
                command = `fill ${corners.NE_posX_negZ.x - 1} ${newFloorPlace} ${corners.NE_posX_negZ.z + 1}  ${corners.NE_posX_negZ.x - 1} ${newCeilPlace} ${corners.NE_posX_negZ.z + 1} ${climbingMaterial} ${getDirState(climbingMaterial, 'nei')}`;
                worldRun(command, dimension, tick, locationCenter);
            }

            //Outside Elevators in corners
            ok = isOnlyAirBetweenY(dimension, corners.NW_negXZ.x, corners.NW_negXZ.z, newFloorCheck, newCeilCheck, { airTypeIds: [ airBlock, tempMaterial, wallMaterial ] });
            if (ok) {
                command = `fill ${corners.NW_negXZ.x} ${newFloorPlace} ${corners.NW_negXZ.z}  ${corners.NW_negXZ.x} ${newCeilPlace} ${corners.NW_negXZ.z} ${climbingMaterial} ${getDirState(climbingMaterial, 'nwo')}`;
                worldRun(command, dimension, tick, locationCenter);
            }
            //else console.warn(`negXZ is not clear for outside ${climbingMaterial}`);
            ok = isOnlyAirBetweenY(dimension, corners.SE_posXZ.x, corners.SE_posXZ.z, newFloorCheck, newCeilCheck, { airTypeIds: [ airBlock, tempMaterial, wallMaterial ] });
            if (ok) {
                command = `fill ${corners.SE_posXZ.x} ${newFloorPlace} ${corners.SE_posXZ.z}  ${corners.SE_posXZ.x} ${newCeilPlace} ${corners.SE_posXZ.z} ${climbingMaterial} ${getDirState(climbingMaterial, 'seo')}`;
                worldRun(command, dimension, tick, locationCenter);
            }
            //else console.warn(`posXZ is not clear for outside ${climbingMaterial}`);
            ok = isOnlyAirBetweenY(dimension, corners.SW_negX_posZ.x, corners.SW_negX_posZ.z, newFloorCheck, newCeilCheck, { airTypeIds: [ airBlock, tempMaterial, wallMaterial ] });
            if (ok) {
                insideElevators++;
                command = `fill ${corners.SW_negX_posZ.x} ${newFloorPlace} ${corners.SW_negX_posZ.z}  ${corners.SW_negX_posZ.x} ${newCeilPlace} ${corners.SW_negX_posZ.z} ${climbingMaterial} ${getDirState(climbingMaterial, 'swo')}`;
                worldRun(command, dimension, tick, locationCenter);
            }
            //else console.warn(`negX_posZ is not clear for outside ${climbingMaterial}`);
            ok = isOnlyAirBetweenY(dimension, corners.NE_posX_negZ.x, corners.NE_posX_negZ.z, newFloorCheck, newCeilCheck, { airTypeIds: [ airBlock, tempMaterial, wallMaterial ] });
            if (ok) {
                insideElevators++;
                command = `fill ${corners.NE_posX_negZ.x} ${newFloorPlace} ${corners.NE_posX_negZ.z}  ${corners.NE_posX_negZ.x} ${newCeilPlace} ${corners.NE_posX_negZ.z} ${climbingMaterial} ${getDirState(climbingMaterial, 'neo')}`;
                worldRun(command, dimension, tick, locationCenter);
            }
            //else console.warn(`posX_negZ is not clear for outside ${climbingMaterial}`);

        }, tick++);
    }

    //1st Floor and Ceiling fill with floor material
    if (wallMaterial !== floorMaterial) {
        // //Floor 1  -TESTING - PUT BACK THO
        // command = `fill ${xWall1 + 1} ${yFloor} ${zWall1 + 1}  ${xWall2 - 1} ${yFloor} ${zWall2 - 1} ${floorMaterial} replace ${tempMaterial}`;
        // worldRun(command, dimension, tick, locationCenter);

        //Roof
        command = `fill ${xWall1 + 1} ${yCeiling} ${zWall1 + 1}  ${xWall2 - 1} ${yCeiling} ${zWall2 - 1} ${floorMaterial} replace ${tempMaterial}`;
        worldRun(command, dimension, tick, locationCenter);
        tick++;
    }

    /**
     * 
     * @param {number} newFloor 
     */
    function installWindows (newFloor) {
        command = `fill ${xCenter - 1} ${newFloor} ${zWall1}  ${xCenter + 1} ${newFloor + 1} ${zWall1} ${windowMaterial}  replace ${tempMaterial}`;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${xCenter - 1} ${newFloor} ${zWall2}  ${xCenter + 1} ${newFloor + 1} ${zWall2} ${windowMaterial}  replace ${tempMaterial}`;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${xWall1} ${newFloor} ${zCenter - 1}  ${xWall1 - 1} ${newFloor + 1} ${zCenter + 1} ${windowMaterial}  replace ${tempMaterial}`;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${xWall2} ${newFloor} ${zCenter - 1}  ${xWall2 + 1} ${newFloor + 1} ${zCenter + 1} ${windowMaterial}  replace ${tempMaterial}`;
        worldRun(command, dimension, tick, locationCenter);

    }
    //Windows -- need on every floor
    //if (windowMaterial) installWindow(yFloor + 2);

    /**
     * 
     * @param {number} newFloor 
     */
    function installAdditionalFloor (newFloor) {
        command = `fill ${xCenter} ${newFloor} ${zCenter}  ${xCenter} ${newFloor} ${zCenter} ${lamp} keep`;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${xWall1 + 2} ${newFloor} ${zWall1 + 2}  ${xWall2 - 2} ${newFloor} ${zWall2 - 2} ${floorMaterial} keep`;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${xWall1 + 2} ${newFloor} ${zWall1 + 2}  ${xWall2 - 2} ${newFloor} ${zWall2 - 2} ${floorMaterial} replace ${tempMaterial}`;
        worldRun(command, dimension, tick, locationCenter);
    }
    // Add as many extra floors as will fit (each floor consumes 4 blocks of height)
    const FLOOR_STEP = 4;
    const WINDOW_OFFSET = 2;
    // start at your 2nd-floor Y (yFloor2), then keep going up by 4
    for (let yLevel = yFloor; yLevel + FLOOR_STEP <= yCeiling; yLevel += FLOOR_STEP) {
        installAdditionalFloor(yLevel);
        if (windowMaterial) installWindows(yLevel + WINDOW_OFFSET);
    }
    tick++;

    // Last - Place real outer walls replacing temp material... that should be all that is left to replace
    command = `fill ${xWall1} ${yFloor} ${zWall1}  ${xWall2} ${yCeiling} ${zWall2} ${wallMaterial} replace ${tempMaterial}`;
    worldRun(command, dimension, tick, locationCenter);
    tick++;

    // system.runTimeout(() => {
    //     const pos = corners.negXZ;
    //     pos.x++;
    //     pos.z++;
    //     const flr = dimension.getBlock(pos);
    //     if (flr && flr.typeId != floorMaterial) console.warn(`floor block is ${flr.typeId}`);
    // }, ++tick);
}
//==============================================================================
