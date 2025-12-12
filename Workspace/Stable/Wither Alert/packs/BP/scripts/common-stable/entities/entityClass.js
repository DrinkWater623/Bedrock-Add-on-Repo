// entityClass.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20251024 - Add event trigger
    20251107 - Refactor get players and entities and add for each dimension
========================================================================*/
import { world, system, Player, Entity, Block, Dimension } from "@minecraft/server";
import { rndInt } from "./tools/mathLib.js";
import { Vector3Lib as vec3 } from './tools/vectorClass.js';
//import { worldRun } from "./worldRunLib.js";
//==============================================================================
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** @typedef {import("@minecraft/server").EntityQueryOptions} EntityQueryOptions */
//==============================================================================
export class EntityLib {
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