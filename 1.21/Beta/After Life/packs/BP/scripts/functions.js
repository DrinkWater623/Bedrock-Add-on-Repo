//@ts-check
import { world, system, Player, World } from "@minecraft/server";
//==============================================================================
const alert = "https://github.com/DrinkWater623";
//==============================================================================
/**
* @param { import("@minecraft/server").Player } player
* @param {number} [numberOfLines=40] 
* @param {number} [tickDelay=1] 
*/
export function clearPlayerChatWindow (player, numberOfLines = 40, tickDelay = 1) {
    if (!defaultChatSend(player, true)) return;
    sendMessageLater("\n".repeat(numberOfLines), player, tickDelay);
}
/**
 * @param {number} [numberOfLines=40]
 * @param {number} [tickDelay=1] 
*/
export function clearWorldChatWindow (numberOfLines = 40, tickDelay = 1) {
    sendMessageLater("\n".repeat(numberOfLines), world, tickDelay);
}
//==============================================================================
export const dimensionSuffix = (dimensionId = "") => { return dimensionId.replace('minecraft:', '').replace('the_', ''); };
//==============================================================================
/**
* @param {world|Player } chatSend
* @param {boolean} [onlyIfIsValid=false]
*/
export function defaultChatSend (chatSend, onlyIfIsValid = false) {
    if (chatSend instanceof Player && (chatSend.isValid() || !onlyIfIsValid)) return chatSend;
    if (chatSend instanceof World) return chatSend;
    if (onlyIfIsValid) return false;
    return world;
}
/**
 * @param {string} message 
 * @param {world|Player } [chatSend=world]
*/
export function sendMessageLater (message, chatSend=world, tickDelay = 1) {
    if (!defaultChatSend(chatSend)) return;
    system.runTimeout(() => { chatSend.sendMessage(`${message}`); }, tickDelay);
}
/**
 * @param {string} message
 * @param { import("@minecraft/server").Player } player
 * @param {number} [tickDelay=1] 
*/
export function sendPlayerMessageLater (message, player, tickDelay = 1) {
    if (!defaultChatSend(player, true)) return;
    system.runTimeout(() => { player.sendMessage(`${message}`); }, tickDelay);
}
//==============================================================================
/**
* @param { import("@minecraft/server").Vector3 } location
*/
export const vector3ToString = (location) => { 
    return `${Math.floor(location.x)}, ${Math.floor(location.y)}, ${Math.floor(location.z)}`; 
}
//==============================================================================
/**
 * @param { import("@minecraft/server").EntityQueryOptions } queryOption
 */
export function getAllEntities (queryOption) {
    const entities = world.getDimension("overworld").getEntities(queryOption);
    world.getDimension("nether").getEntities(queryOption).forEach(e => entities.push(e));
    world.getDimension("the_end").getEntities(queryOption).forEach(e => entities.push(e));
    return entities;
}