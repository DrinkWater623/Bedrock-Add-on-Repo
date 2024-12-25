//@ts-check
/**
 * Created by https://github.com/DrinkWater623
 * 
 * Change Log
 *  20240827 - Created - to hold functions related to entities
 *  20240903 - added closestPlayers
 *  20241009 - Added getAllEntities()
 *  20241211 - Made sure everyone had same file (b)
 */
//==============================================================================
import { world, system, Player, Entity, Block } from "@minecraft/server";
import { Vector3Lib as vec3 } from './vectorClass.js';
//==============================================================================
export class EntityLib {
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
                if (e.isValid()) { e.kill(); }
            }, (i + 1) * 5);
        });
    }
    //==============================================================================
    /**
     * @param { import("@minecraft/server").EntityQueryOptions } queryOption
     * @returns {Entity[]}
     */
    static getAllEntities (queryOption) {
        const entities = world.getDimension("overworld").getEntities(queryOption);
        world.getDimension("nether").getEntities(queryOption).forEach(entity => entities.push(entity));
        world.getDimension("the_end").getEntities(queryOption).forEach(entity => entities.push(entity));
        return entities;
    }
    //==============================================================================
    /**     
     * @returns {Player[]}
     */
    static getAllPlayers () {
        const entities = world.getDimension("overworld").getPlayers();
        world.getDimension("nether").getPlayers().forEach(entity => entities.push(entity));
        world.getDimension("the_end").getPlayers().forEach(entity => entities.push(entity));
        return entities;
    }
    //==============================================================================
    /**
     * @param {string} [title=""] 
     * @param {Entity[] } entities
     * @param {world|Player} [displayTo=world] 
     */
    static listEntities (title = "", entities = [], displayTo = world) {
        if (displayTo instanceof Player && !displayTo.isValid())
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
        if (!entity || !entity.isValid()) return undefined;
        return entity.dimension.getBlock(entity.location);
    }
    //==============================================================================
    /**
     * @param { Entity } entity
     * @returns {number | undefined}
     */
    static markVariant_get (entity) {
        if (!entity || !entity.isValid()) return undefined;
        return entity.getComponent('minecraft:mark_variant')?.value;
    }
    //==============================================================================
    /**
     * @param { Entity } entity
     * @returns {number | undefined}
     */
    static variant_get (entity) {
        if (!entity || !entity.isValid()) return undefined;
        return entity.getComponent('minecraft:variant')?.value;
    }
    //==============================================================================
    /**
     * @param { Entity } entity
     * @returns {string[] }
     */
    static families_get (entity) {
        if (!entity || !entity.isValid()) return [];
        return entity.getComponent('minecraft:type_family')?.getTypeFamilies() || [];
    }
    //==============================================================================
    /**
     * @param { Entity } entity
     * @param { string } familyQuery
     * @returns {boolean}
     */
    static isFamily (entity, familyQuery) {
        if (!entity || !entity.isValid()) return false;
        const families = entity.getComponent('minecraft:type_family')?.getTypeFamilies();
        return families?.includes(familyQuery) || false;
    }
}