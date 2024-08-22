//@ts-check
import { world, system, Player} from "@minecraft/server";
import * as gVar from './globalVars.js';

//==============================================================================
/**
 * @param {number} [numOfLines=40] 
 * @param {world|Player } chatSend
*/
export function spamEmptyLines (numOfLines = 40, chatSend = world) {
    let msg = "";
    for (let i = 0; i < numOfLines; i++) msg += "\n";
    chatSend.sendMessage(msg);
};
//==============================================================================
/**
 * @param { import("@minecraft/server").Vector3 } location
 */
export function vector3Msg (location) {
    return `${Math.floor(location.x)}, ${Math.floor(location.y)}, ${Math.floor(location.z)}`;
}
//==============================================================================
/**
 * @param { string } [family]
 */
export function killLoop (family = 'monster') {
    const entities = getAllEntities({ type: gVar.watchFor.family });

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
 */
export function getAllEntities (queryOption) {
    const entities = world.getDimension("overworld").getEntities(queryOption);
    world.getDimension("nether").getEntities(queryOption).forEach(entity => entities.push(entity));
    world.getDimension("the_end").getEntities(queryOption).forEach(entity => entities.push(entity));
    return entities;
}
/**
 * @param {string} [title=""] 
 * @param { import("@minecraft/server").Entity[] } entities
 * @param {world|Player} [chatSend=world] 
 */
export function listEntities (title = "", entities = [], chatSend = world) {
    let msg = "";
    msg = title;
    entities.forEach((entity, i) => {
        msg += `\n#${i + 1} -${entity.nameTag ? ' ' + entity.nameTag : ''} @ ${entity.dimension.id.replace("minecraft:", '')} ${vector3Msg(entity.location)}`;
    });
    msg += "\n\n";
    chatSend.sendMessage(msg);
}
//==============================================================================