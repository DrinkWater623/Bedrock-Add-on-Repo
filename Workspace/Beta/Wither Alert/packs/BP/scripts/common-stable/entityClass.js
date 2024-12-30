//@ts-check
/**
 * Created by 
 * 
 * Change Log
 *  20240827 - Created - to hold functions related to entities
 */
//==============================================================================
import { world, system, Player, Entity } from "@minecraft/server";
import { Vector3Lib as vec3 } from './vectorClass.js';
//==============================================================================
export class Entities {
    //==============================================================================
    /**
     * @param { string } [family]
     */
    static killLoop (family = 'monster') {
        const entities = Entities.getAllEntities({ type: family });

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
     * @param {string} [title=""] 
     * @param {Entity[] } entities
     * @param {world|Player} [chatSend=world] 
     */
    static listEntities (title = "", entities = [], chatSend = world) {
        let msg = "";
        msg = title;
        entities.forEach((entity, i) => {
            msg += `\n#${i + 1} -${entity.nameTag ? ' ' + entity.nameTag : ''} @ ${entity.dimension.id.replace("minecraft:", '')} ${vec3.toString(entity.location,0,true,', ')}`;
        });
        msg += "\n\n";
        chatSend.sendMessage(msg);
    }
}