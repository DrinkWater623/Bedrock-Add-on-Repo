//fn-stable.js    After-Life
//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
import { Entity, system, world, Player, World, TicksPerSecond } from "@minecraft/server";
import { dynamicVars } from '../settings.js';
import { DynamicPropertyLib } from "../common-stable/tools/dynamicPropertyClass.js";
import { dev } from "../debug.js";

//=============================================================================
//=============================================================================
/** @typedef {import("@minecraft/server").Vector2} Vector2 */
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** @typedef {import("@minecraft/server").VectorXZ} VectorXZ */
//==============================================================================
export const dimensionSuffix = (dimensionId = "") => { return dimensionId.replace('minecraft:', '').replace('the_', ''); };
//==============================================================================
/**
 * 
 * @param {Player} player 
 */
export function updatePlayerStats (player) {
    //update stats
    if (player.isValid) {
        const aliveTIcks = DynamicPropertyLib.getNumber(player, dynamicVars.aliveTicks);
        if (aliveTIcks > DynamicPropertyLib.getNumber(player, dynamicVars.longestTicksAlive)) {
            player.setDynamicProperty(dynamicVars.longestTicksAlive, aliveTIcks);
        }
    }
}
export function updateAllPlayerStats () {
    //update stats
    const players = world.getAllPlayers();
    for (const player of players) {
        updatePlayerStats(player);
    }
}
//==============================================================================
/**
 * 
 * @param {Player} player 
 */
export function playerAliveTicksCounterJob (player) {
    const thisJob =
        system.runInterval(() => {
            if (player.isValid)
                DynamicPropertyLib.addNumber(player, dynamicVars.aliveTicks, TicksPerSecond);
            else {
                //cancel this job
                system.clearRun(thisJob);
            }
        }, TicksPerSecond);
}
//==============================================================================
/**
* @param {world|Player } toWho
* @param {boolean} [onlyIfIsValid=false]
*/
export function defaultChatSendToWho (toWho, onlyIfIsValid = false) {
    if (toWho instanceof Player && (toWho.isValid || !onlyIfIsValid)) return toWho;
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
 * @param {Vector3} location 
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