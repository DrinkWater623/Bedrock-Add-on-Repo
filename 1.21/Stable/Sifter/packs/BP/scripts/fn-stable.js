//@ts-check
import { Entity, system, world, Player, World, TicksPerSecond } from "@minecraft/server";
import { dev, chatLog, dynamicVars } from './settings.js';
import { DynamicPropertyLib } from "./commonLib/dynamicPropertyClass.js";

//==============================================================================
export const dimensionSuffix = (dimensionId = "") => { return dimensionId.replace('minecraft:', '').replace('the_', ''); };
//==============================================================================

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
//===================================================================