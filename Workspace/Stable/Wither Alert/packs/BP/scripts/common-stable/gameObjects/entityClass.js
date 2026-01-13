// entityClass.js
// @ts-check
/* =====================================================================
Copyright (C) 2026 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T.
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20251024 - Add event trigger
    20251107 - Refactor get players and entities and add for each dimension
    20251203 - Relocated
    20260111 - added class EntityFloatingItems
========================================================================*/
import { world, system, Player, Entity, Block, Dimension, EntityTypes } from "@minecraft/server";
import { rndInt } from "../tools/mathLib.js";
import { Vector3Lib as vec3 } from '../tools/vectorClass.js';
import { mcNameSpace } from "../../common-data/globalConstantsLib.js";
import { addNameSpace, dedupeArrayInPlace } from "../tools/objects.js";
//==============================================================================
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** @typedef {import("@minecraft/server").EntityQueryOptions} EntityQueryOptions */
//==============================================================================
export class Entities {
    //==============================================================================
    /**
     * True only for a *real, currently-valid* Player reference (no ghosts).
     *
     * @param {any} value
     * @returns {boolean}
     */
    static isValid (value) {
        if (value == null) return false;

        const t = typeof value;
        if (t !== "object" && t !== "function") return false;

        try {
            /** @type {any} */
            const v = value;

            // Kill ghost refs first
            if (typeof v.isValid !== "boolean") return false;

            // Sanity checks: avoid plain-object imposters
            // entity??if (typeof v.getComponent !== "function") return false;

            return v.isValid;
        } catch {
            return false;
        }
    }
    //==============================================================================
    /**
     * True only for a *real, currently-valid* Player reference (no ghosts).
     *
     * @param {Player | Entity | null} entity
     * @returns {string|null}
     */
    static name_get (entity) {
        if (!entity) return null;

        try {
            /** @type {any} */
            if (entity.isValid && entity.nameTag) return entity.nameTag;
            return entity.typeId;
        } catch {
            return null;
        }
    }
    //==============================================================================
    /**
     * 
     * @param {Entity} entity 
     * @param {string} trigger 
     * @param {number} [tickDelay=0] 
     */
    static eventTrigger (entity, trigger, tickDelay = 0) {
        if (entity.isValid)
            system.runTimeout(() => {
                system.run(() => { entity.triggerEvent(trigger); });
            }, tickDelay);
    }
    //==============================================================================
    /**
     * 
     * @param {Entity} entity 
     * @param {number} max 
     * @returns {Entity[]}
     */
    static closestPlayers (entity, max = 1, distance = 8) {
        if (max < 1) max = Infinity;
        if (distance < 0) distance = 0;
        if (max == Infinity && distance == Infinity) {
            max = 1;
            distance = 8;
        }

        return entity.dimension.getPlayers({ "closest": max, "location": entity.location, "maxDistance": distance });
    }
    //==============================================================================
    /**
     * @param { string } [family]
     */
    static killLoop (family = 'monster') {
        const entities = this.getAllEntities({ type: family });

        entities.forEach((e, i) => {
            system.runTimeout(() => {
                // TODO: capture fails                 
                if (e.isValid) { e.kill(); }
            }, (i + 1) * 5);
        });
    }
    //==============================================================================
    /**     
     * @param { EntityQueryOptions | undefined} queryOptions 
     * @returns {Entity[]}
     */
    static getEndEntities (queryOptions = {}) {
        return world.getDimension("the_end").getEntities(queryOptions);
    }
    //==============================================================================
    /**     
     * @param { EntityQueryOptions | undefined} queryOptions 
     * @returns {Entity[]}
     */
    static getNetherEntities (queryOptions = {}) {
        return world.getDimension("nether").getEntities(queryOptions);
    }
    //==============================================================================
    /**
     * @param { EntityQueryOptions | undefined} queryOptions      
     * @returns {Entity[]}
     */
    static getOverworldEntities (queryOptions = {}) {
        return world.getDimension("overworld").getEntities(queryOptions);
    }
    //==============================================================================
    /**
     * @param { EntityQueryOptions | undefined} queryOptions 
     * @returns {Entity[]}
     */
    static getAllEntities (queryOptions = {}) {
        const entities = this.getOverworldEntities(queryOptions);
        this.getEndEntities(queryOptions).forEach(entity => entities.push(entity));
        this.getNetherEntities(queryOptions).forEach(entity => entities.push(entity));
        return entities;
    }
    //==============================================================================
    //==============================================================================
    /**     
     * @param { EntityQueryOptions | undefined} queryOptions 
     * @returns {Player[]}
     */
    static getEndPlayers (queryOptions = {}) {
        return world.getDimension("the_end").getPlayers(queryOptions);
    }
    //==============================================================================
    /**     
     * @param { EntityQueryOptions | undefined} queryOptions 
     * @returns {Player[]}
     */
    static getNetherPlayers (queryOptions = {}) {
        return world.getDimension("nether").getPlayers(queryOptions);
    }
    //==============================================================================
    /**
     * @param { EntityQueryOptions | undefined} queryOptions      
     * @returns {Player[]}
     */
    static getOverworldPlayers (queryOptions = {}) {
        return world.getDimension("overworld").getPlayers(queryOptions);
    }
    //==============================================================================
    /**   
     * @param { EntityQueryOptions | undefined} queryOptions  
     * @returns {Player[]}
     */
    static getAllPlayers (queryOptions = {}) {
        const players = this.getOverworldPlayers(queryOptions);
        this.getEndPlayers(queryOptions).forEach(entity => players.push(entity));
        this.getNetherPlayers(queryOptions).forEach(entity => players.push(entity));
        return players;
    }
    //==============================================================================
    /**
     * @param {string} [title=""] 
     * @param {Entity[] } entities
     * @param {world|Player} [displayTo=world] 
     */
    static listEntities (title = "", entities = [], displayTo = world) {
        if (displayTo instanceof Player && !displayTo.isValid)
            return;

        let msg = "";
        msg = title;
        entities.forEach((entity, i) => {
            msg += `\n#${i + 1} -${entity.nameTag ? ' ' + entity.nameTag : ''} @ ${entity.dimension.id.replace("minecraft:", '')} ${vec3.toString(entity.location, 0, true, ', ')}`;
        });
        msg += "\n\n";
        displayTo.sendMessage(msg);
    }
    //==============================================================================
    /**
     * @param { Entity } entity
     * @returns {Block | undefined}
     */
    static currentBlock (entity) {
        if (!entity || !entity.isValid) return undefined;
        return entity.dimension.getBlock(entity.location);
    }
    //==============================================================================
    /**
     * @param { Entity } entity
     * @returns {number | undefined}
     */
    static markVariant_get (entity) {
        if (!entity || !entity.isValid) return undefined;
        return entity.getComponent('minecraft:mark_variant')?.value;
    }
    //==============================================================================
    /**
     * @param { Entity } entity
     * @returns {number | undefined}
     */
    static variant_get (entity) {
        if (!entity || !entity.isValid) return undefined;
        return entity.getComponent('minecraft:variant')?.value;
    }
    //==============================================================================
    /**
     * @param { Entity } entity
     * @returns {string[] }
     */
    static families_get (entity) {
        if (!entity || !entity.isValid) return [];
        return entity.getComponent('minecraft:type_family')?.getTypeFamilies() || [];
    }
    //==============================================================================
    /**
     * @param { Entity } entity
     * @param { string } familyQuery
     * @returns {boolean}
     */
    static isFamily (entity, familyQuery) {
        if (!entity || !entity.isValid) return false;
        const families = entity.getComponent('minecraft:type_family')?.getTypeFamilies();
        return families?.includes(familyQuery) || false;
    }
    //==============================================================================
    /**
     * @param {Entity} entity  
     * @param {number} [tickDelay=0] 
     */
    static centerAlign (entity, tickDelay = 0) {
        if (!entity.isValid) return;
        system.runTimeout(() => {
            const locationCenter = entity.dimension.getBlock(entity.location)?.center();
            if (locationCenter) entity.teleport(locationCenter);
        }, tickDelay);
    }
    //==============================================================================
    /** 
     * @param {Entity} entity 
     * @param {Vector3} location
     * @param {number} [tickDelay=0]  
     */
    static teleportAndCenter (entity, location, tickDelay = 0) {
        system.runTimeout(() => {
            //this.centerAlign(entity, 0); //why? this
            entity.teleport((location));
            system.runTimeout(() => { this.centerAlign(entity); }, 1);
        }, tickDelay);
    }
}
/**
 * Spawn an entity after a random tick delay if the chunk is loaded.
 * @param {Dimension | undefined} dimension
 * @param {Vector3 | undefined} location
 * @param {string} typeId
 * @param {number} [min=1]
 * @param {number} [max=100]
 */
export function spawnEntityAfterRandomTicks (dimension, location, typeId, min = 1, max = 100) {
    if (!location) return;
    if (!dimension || !dimension.isChunkLoaded(location)) return;

    const delay = rndInt(Math.max(0, min), Math.max(min, max));
    system.runTimeout(() => {
        if (dimension.isChunkLoaded(location)) {
            // @ts-ignore spawnEntity exists at runtime
            dimension.spawnEntity(typeId, location);
        }
    }, delay);
}
//===================================================================
/**
 * @param {string} entityTypeId 
 * @param {Dimension} dimension 
 * @param {Vector3 } location 
 * @param {number} [minEntities=1] 
 * @param {number} [maxEntities=1] 
 * @param {number} [minTickDelay=1] 
 * @param {number} [maxTickDelay=1] 
 * @param {string} [event="minecraft:entity_spawned"] 
 * @param {string} [varyForBlockFace=''] 
 * @returns {number} qtySpawnedSuccessfully;
 */
export function spawnEntityAtLocation (entityTypeId, dimension, location, minEntities = 1, maxEntities = 1, minTickDelay = 1, maxTickDelay = 1, event = "", varyForBlockFace = '') {
    if (!location) return 0;
    if (!dimension || !dimension.isChunkLoaded(location)) return 0;

    if (maxEntities < 1 || minEntities > maxEntities) maxEntities = minEntities;
    if (maxTickDelay < minTickDelay) maxTickDelay = minTickDelay;

    const options = { initialPersistence: true };
    // @ts-ignore
    if (event) options.spawnEvent = event;

    let max = minEntities === maxEntities ? minEntities : rndInt(minEntities, maxEntities);
    let qtySpawnedSuccessfully = 0;
    for (let i = 0; i < max; i++) {
        if (i > 0 && varyForBlockFace) {
            //TODO: update location string per the blockFace to a random area inside block location
        }

        // @ts-ignore spawnEntity exists at runtime        
        const entity = dimension.spawnEntity(entityTypeId, location, options);
        if (entity) qtySpawnedSuccessfully++;
    }

    return qtySpawnedSuccessfully;
}
//===================================================================
export class EntityTypeIds {
    //================================================================================================
    // Cached Sets and Arrays - Built below
    static #validEntityTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #validVanillaEntityTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #validCustomEntityTypeIdSet = /** @type {Set<string> | null} */ (null);

    static #validEntityTypeIds = /** @type {string[] | null} */ (null);
    static #validVanillaEntityTypeIds = /** @type {string[] | null} */ (null);
    static #validCustomEntityTypeIds = /** @type {string[] | null} */ (null);

    static #validNonPlaceableEntityTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #validNonPlaceableEntityTypeIds = /** @type {string[] | null} */ (null);
    //================================================================================================
    /**
     * Cached set of item type ids available in this world.
     * (Includes whatever the world has registered — vanilla + any custom types it exposes.)
     * @returns {Set<string>}
     */
    static getValidEntityTypeIdSet () {
        if (!this.#validEntityTypeIdSet) {
            this.#validEntityTypeIdSet = new Set(EntityTypes.getAll().map(e => e.id));
        }
        return this.#validEntityTypeIdSet;
    }
    /**
     * Cached set of item type ids available in this world.
     * (Includes whatever the world has registered — vanilla + any custom types it exposes.)
     * @returns {string[]}
     */
    static getValidEntityTypeIds () {
        if (!this.#validEntityTypeIds) {
            this.#validEntityTypeIds = Array.from(this.getValidEntityTypeIdSet());
        }
        return this.#validEntityTypeIds;
    }
    /**
     * Cached set of item type ids available in this world.
     * @returns {Set<string>}
     */
    static getValidVanillaEntityTypeIdSet () {
        if (!this.#validVanillaEntityTypeIdSet) {
            this.#validVanillaEntityTypeIdSet = new Set(Array.from(this.getValidEntityTypeIdSet()).filter(b => b.startsWith(mcNameSpace)));
        }
        return this.#validVanillaEntityTypeIdSet;
    }
    /**
    * Cached set of item type ids available in this world.
    * @returns {string[]}
    */
    static getValidVanillaEntityTypeIds () {
        if (!this.#validVanillaEntityTypeIds) {
            this.#validVanillaEntityTypeIds = Array.from(this.getValidVanillaEntityTypeIdSet());
        }
        return this.#validVanillaEntityTypeIds;
    }
    /**
     * Cached set of item type ids available in this world.
     * @returns {Set<string>}
     */
    static getValidCustomEntityTypeIdSet () {
        if (!this.#validCustomEntityTypeIdSet) {
            this.#validCustomEntityTypeIdSet = new Set(Array.from(this.getValidEntityTypeIdSet()).filter(b => !b.startsWith(mcNameSpace)));
        }
        return this.#validCustomEntityTypeIdSet;
    }
    /**
    * Cached set of item type ids available in this world.
    * @returns {string[]}
    */
    static getValidCustomEntityTypeIds () {
        if (!this.#validCustomEntityTypeIds) {
            this.#validCustomEntityTypeIds = Array.from(this.getValidCustomEntityTypeIdSet());
        }
        return this.#validCustomEntityTypeIds;
    }
    /**
     * Cached set of item type ids available in this world.
     * @returns {Set<string>}
     */
    static getValidNonPlaceableEntityTypeIdSet () {
        if (!this.#validNonPlaceableEntityTypeIdSet) {
            this.#validNonPlaceableEntityTypeIdSet = new Set(Array.from(this.getValidEntityTypeIdSet()));
        }
        return this.#validNonPlaceableEntityTypeIdSet;
    }
    /**
     * Cached set of item type ids available in this world.
     * @returns {string[]}
     */
    static getValidNonPlaceableEntityTypeIds () {
        if (!this.#validNonPlaceableEntityTypeIds) {
            this.#validNonPlaceableEntityTypeIds = Array.from(this.getValidNonPlaceableEntityTypeIdSet());
        }
        return this.#validNonPlaceableEntityTypeIds;
    }
    //=============
    /* Utilities */
    //=============
    /**
     * @param {string} typeId
     * @returns {boolean}
     */
    static isValidEntityTypeId (typeId) {
        return this.getValidEntityTypeIdSet().has(typeId);
    }
    /**
     * 
     * @param {Entity} obj_1 
     * @param {Entity} obj_2 
     * @returns {boolean}
     */
    static isSameEntity (obj_1, obj_2) {
        if (!this.isValidEntityTypeId(obj_1.typeId)) return false;
        if (!this.isValidEntityTypeId(obj_2.typeId)) return false;
        return (obj_1.typeId == obj_2.typeId);
    }
    //================================================================================================
    /**
     * Normalize ids in-place (optional namespacing) + de-dupe.
     * Your rule: if verify is true, namespacing must be true.
     *
     * @param {string[]} a
     * @param {{ addNamespace?: boolean, verify?: boolean, removeEmpty?: boolean }} [opts]
     * @returns {string[]}
     */
    static normalizeEntityIdsInPlace (a, opts = {}) {
        const verify = opts.verify ?? false;
        const addNamespace = (opts.addNamespace ?? true) || verify;
        const removeEmpty = opts.removeEmpty ?? true;

        // One pass: trim + optional removeEmpty + optional namespace
        let w = 0;
        for (let i = 0; i < a.length; i++) {
            let s = String(a[ i ] ?? "").trim();
            if (removeEmpty && !s) continue;
            if (addNamespace) s = addNameSpace(s); // or addNameSpaceInPlace if you prefer two-pass
            if (verify) { if (!this.getValidCustomEntityTypeIdSet().has(s)) continue; }

            a[ w++ ] = s;
        }
        a.length = w;

        dedupeArrayInPlace(a);

        return a;
    }
    /**
     * Filter invalid ids in-place using current-world registry.
     * @param {string[]} a
     * @returns {string[]}
     */
    static filterValidEntityTypeIdsInPlace (a) {
        this.normalizeEntityIdsInPlace(a, { addNamespace: true, verify: false, removeEmpty: true });
        return this.purgeInvalidEntityTypeIdsInPlace_auto(a);
    }
    /**
     * Purge invalid item typeIds in-place (FAST).
     * Does NOT normalize, namespace, or dedupe.
     *
     * @param {string[]} a
     * @param {Set<string>} validSet  // usually Entities.getValidEntityTypeIdSet()
     * @returns {string[]} same array instance
     */
    static purgeInvalidEntityTypeIdsInPlace (a, validSet) {
        let w = 0;
        for (let r = 0; r < a.length; r++) {
            const id = a[ r ];
            if (validSet.has(id)) a[ w++ ] = id;
        }
        a.length = w;
        return a;
    }
    /**
     * Purge invalid item typeIds in-place (FAST).
     * Uses cached valid set.
     *
     * @param {string[]} a
     * @returns {string[]}
     */
    static purgeInvalidEntityTypeIdsInPlace_auto (a) {
        return this.purgeInvalidEntityTypeIdsInPlace(a, this.getValidEntityTypeIdSet());
    }
    //==============================================================================  
    static listCustomEntities () {
        const entityList = this.getValidCustomEntityTypeIds();

        for (const b of entityList) {
            // do whatever you want here:
            // - emit(b)
            // - console.warn(b)
            // - build a report
            console.warn("Custom Entity:", b);
        }

        return entityList;
    }
}
export class EntityFloatingItems {
    /**
    * @param { import("@minecraft/server").Dimension } dimension
    * @param { Vector3 } location
    * @param {number} [closest=1728] 
    * @param {number} [maxDistance=32] 
    * @return { Entity[] }
    */
    static floatingItems (dimension, location, closest = 1728, maxDistance = 32) {
        //this is more like item stacks
        if (dimension.isChunkLoaded(location)) {

            const queryOptions = {
                location: location,
                type: "item",
                closest: !!closest ? closest : 27 * 64,
                maxDistance: !!maxDistance ? maxDistance : 32
            };
            //console.warn ('running dimension.getEntities(queryOptions)')
            const itemList = dimension.getEntities(queryOptions);
            //console.warn(`Item count = ${itemList.length}`)

            return itemList;
        }
        return [];
    }
    /**
    * @param { import("@minecraft/server").Dimension } dimension
    * @param { Vector3 } location
    * @param {number} [closest=1728] 
    * @param {number} [maxDistance=32] 
    * @return { number }
    */
    static floatingItemCount (dimension, location, closest = 1728, maxDistance = 32) {
        //this is more like item stacks
        if (dimension.isChunkLoaded(location))
            return this.floatingItems(dimension, location, closest, maxDistance).length;
        
        return 0;
    }

}