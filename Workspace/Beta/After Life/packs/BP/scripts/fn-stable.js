//@ts-check
import { Entity, system, world, Player, World, TicksPerSecond } from "@minecraft/server";
import { dev, chatLog, dynamicVars } from './settings.js';
import { DynamicPropertyLib } from "./commonLib/dynamicPropertyClass.js";

//==============================================================================
export const dimensionSuffix = (dimensionId = "") => { return dimensionId.replace('minecraft:', '').replace('the_', ''); };
//==============================================================================
/**
 * 
 * @param {Player} player 
 */
export function updatePlayerStats (player) {
    var nowTick = system.currentTick;

    //1st join world
    if (DynamicPropertyLib.getNumber(player, dynamicVars.firstTick) == 0) {
        //Initialize
        if (nowTick == 0) nowTick++;
        player.setDynamicProperty(dynamicVars.firstTick, nowTick);
        player.setDynamicProperty(dynamicVars.longestTicksAlive, 1);
        player.setDynamicProperty(dynamicVars.deathMsgWaiting, false);
        DynamicPropertyLib.add(player, dynamicVars.lastDeathTick, nowTick);

        chatLog.player(player, `==> dynamic vars initialized`, dev.debugPlayer && player.isOp());
        return;
    }

    //update stats
    let aliveTIcks = DynamicPropertyLib.getNumber(player, dynamicVars.aliveTicks);
    if (aliveTIcks > DynamicPropertyLib.getNumber(player, dynamicVars.longestTicksAlive)) {
        player.setDynamicProperty(dynamicVars.longestTicksAlive, aliveTIcks);
    }
}
//==============================================================================
/**
 * 
 * @param {Player} player 
 */
export function playerAliveTicksCounterJob (player) {
    const thisJob = system.runInterval(() => {
        if (player.isValid())
            DynamicPropertyLib.add(player, dynamicVars.aliveTicks, TicksPerSecond);
        else {
            //cancel this job
            system.clearRun(thisJob);
        }            
    }, TicksPerSecond);
}
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