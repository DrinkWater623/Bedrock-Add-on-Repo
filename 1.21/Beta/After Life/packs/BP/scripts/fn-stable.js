//@ts-check
import { Entity, system, Block, world, Player, World } from "@minecraft/server";
import { dev, chatLog, watchFor, dynamicVars, entityEvents } from './settings.js';
import { Vector3Lib } from './commonLib/vectorClass.js';
import { ScoreboardLib } from "./commonLib/scoreboardClass.js";
import { DynamicPropertyLib } from "./commonLib/dynamicPropertyClass.js";
import { EntityLib } from "./commonLib/entityClass.js";
import { worldRun } from "./commonLib/runCommandClass.js";
//==============================================================================
export const dimensionSuffix = (dimensionId = "") => { return dimensionId.replace('minecraft:', '').replace('the_', ''); };
//==============================================================================
/**
 * 
 * @param {Player|World} who 
 * @returns 
 */
export function debugDynamicPropertiesList (who = world) {
    if (!dev.debug) return;
    if (!defaultChatSendToWho((who), true)) return;

    let msg = "";
    const list = who.getDynamicPropertyIds();
    if (list.length) {
        msg = `\n\n* §aDynamic Properties: ${list.length}§b`;

        list.forEach((id) => {
            const value = who.getDynamicProperty(id);
            msg += `\n${id}: ${who.getDynamicProperty(id)}`;

        });
    }
    else msg = `§cThere are no Dynamic Properties for ${who instanceof Player ? who.nameTag : "the world"}`;

    sendMessageLater(msg, who, 1);
}
//==============================================================================
/**
* @param { import("@minecraft/server").Player } player
* @param {number} [numberOfLines=40] 
* @param {number} [tickDelay=1] 
*/
export function clearPlayerChatWindow (player, numberOfLines = 40, tickDelay = 1) {
    if (!defaultChatSendToWho(player, true)) return;
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
/**
* @param {world|Player } toWho
* @param {boolean} [onlyIfIsValid=false]
*/
export function defaultChatSendToWho (toWho, onlyIfIsValid = false) {
    if (toWho instanceof Player && (toWho.isValid() || !onlyIfIsValid)) return toWho;
    if (toWho instanceof World) return toWho;
    if (onlyIfIsValid) return false;
    return world;
}
//==============================================================================
/**
 * @param {string} message 
 * @param {world|Player } [chatSend=world]
*/
export function sendMessageLater (message, chatSend = world, tickDelay = 1) {
    if (!defaultChatSendToWho(chatSend)) return;
    system.runTimeout(() => { chatSend.sendMessage(`${message}`); }, tickDelay);
}
//==============================================================================
/**
 * @param {string} message
 * @param { import("@minecraft/server").Player } player
 * @param {number} [tickDelay=1] 
*/
export function sendPlayerMessageLater (message, player, tickDelay = 1) {
    if (!defaultChatSendToWho(player, true)) return;
    system.runTimeout(() => { player.sendMessage(`${message}`); }, tickDelay);
}
//==============================================================================
/**
 * 
 * @param {Entity} entity 
 * @param {import("@minecraft/server").Vector3} location 
 */
export function teleportAndCenter (entity, location) {
    system.runTimeout(() => {
        entity.teleport((location));
        system.runTimeout(() => { centerAlign(entity); }, 1);
    }, 1);
}
//===================================================================
/**
 * 
 * @param {Entity} entity  
 */
export function centerAlign (entity) {
    const center = entity.dimension.getBlock(entity.location)?.center();
    if (center) entity.teleport(center);
}
//===================================================================