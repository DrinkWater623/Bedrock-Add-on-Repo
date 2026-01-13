// deathBot.js  After-Life
// @ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
import { system, Dimension, EntityInventoryComponent } from "@minecraft/server";
import { chatLog, watchFor } from "../settings";
import { sendPlayerMessageLater } from "./fn-stable";
import { dev } from "../debug.js";
import { EntityFloatingItems } from "../common-stable/gameObjects/entityClass.js";
import { DynamicPropertyLib } from "../common-stable/tools/dynamicPropertyClass.js";

//=============================================================================
/** @typedef {import("@minecraft/server").Vector2} Vector2 */
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** @typedef {import("@minecraft/server").VectorXZ} VectorXZ */
//==============================================================================
const deathBotIdentifier = watchFor.death_bot;
const entityObject = 'death_bot';
const debug = dev.isDebugEntityObject(entityObject);
const eventName = 'afterPlayerDie';
//==============================================================================
/**
* @param { Dimension } dimension
* @param { Vector3 } location
* @param { string }  playerNameTag
*/
export function launchDeathBots (dimension, location, playerNameTag) {
    dev.alertFunctionKey('launchDeathBots');

    if (!dimension.isChunkLoaded(location)) {
        dev.alertWarn('(launchDeathBots) Chunk is not loaded, cannot save anything', debug);
        return;
    }

    // 1st.  It will launch another if more stuff
    launchDeathBot(dimension, location, playerNameTag, 1);

    //should be no more than 2 bots... a player can only hold so much.
    // let botCount = 2; //Math.ceil(itemCount / 27);
    // if (botCount > 9) botCount = 9;
    // for (let i = 1; i <= botCount; i++) {
    //     if (i = 1) launchDeathBot(dimension, location, playerNameTag, i);
    //     else
    //         system.runTimeout(() => {
    //             launchDeathBot(dimension, location, playerNameTag, i);
    //         }, ((i - 1) * 4));
    // }
}
/**
* @param { import("@minecraft/server").Dimension } dimension
* @param { Vector3 } location
* @param { string }  playerNameTag
* @param { number } botNumber
*/
function launchDeathBot (dimension, location, playerNameTag, botNumber = 0) {
    dev.alertLog(`§bTick:§r ${system.currentTick} §6==>§r launchDeathBot(${playerNameTag}, botNumber: ${botNumber})`, debug);

    if (botNumber > 2) return; //something else going on, a player cannot hold more that 2 bots of stuff

    if (!dimension.isChunkLoaded(location)) {
        dev.alertWarn('(launchDeathBot) Chunk is not loaded, cannot save anything', debug);
        return;
    }

    const botName = `§cDeath-Bot Container #${botNumber}:§r\n ${playerNameTag}`;
    //@ts-ignore
    const bot = dimension.spawnEntity(deathBotIdentifier, location);
    bot.nameTag = botName;
    bot.addTag(playerNameTag);
    bot.setDynamicProperty("botNumber", botNumber);
    bot.setDynamicProperty("ownerNameTag", playerNameTag);
    bot.setDynamicProperty("ownerDimension", dimension.id);
    bot.setDynamicProperty("ownerLocation", location);
    //TODO: Player combo lock

    //Progressive TP of stuff, so closest stuff is first, then venture out by 5 blocks
    let tickPtr=2
    for (let i = tickPtr; i <= 5; i++) {
        console.warn(`§bTick:§r ${system.currentTick} §6==> for i = ${i}`);
        system.runTimeout(() => {
            const cmd = `tp @e[r=${5 + ((i - 1) * 5)},type=item] @s`;
            dev.alertLog(`§bTick:§r ${system.currentTick} §6==>§r death-bot #${botNumber} ${i}) ${cmd}`, debug);
            bot.dimension.runCommand(cmd,);
        }, i);
    }

    //more items - which should be close now... call next one if so?
    tickPtr=61
    system.runTimeout(() => {
        const itemCount = EntityFloatingItems.floatingItemCount(dimension, location, 10, 3);
        if (itemCount > 0) {
            launchDeathBot(bot.dimension, bot.location, playerNameTag, botNumber + 1);
        }
    }, tickPtr);

    if (debug) {
        system.runTimeout(() => {
            botContainerReport(bot);
        }, 10);
        system.runTimeout(() => {
            botContainerReport(bot);
        }, 20);
        system.runTimeout(() => {
            botContainerReport(bot);
        }, 40);
        system.runTimeout(() => {
            botContainerReport(bot);
        }, tickPtr);
    }
}
/**
* @param { import("@minecraft/server").Entity } bot
*/
function botContainerReport (bot) {
    if (!bot.isValid) return;
    const container = bot.getComponent(EntityInventoryComponent.componentId)?.container;
    if (!container) return; //report error

    if (container.emptySlotsCount === 27) {
        bot.nameTag = `§aEmpty Container§r\n${bot.getDynamicProperty("ownerNameTag")}`;
        return;
    }

    const botNumber = DynamicPropertyLib.getNumber(bot, 'botNumber');
    //report here 
    dev.alertLog(`§bTick:§r ${system.currentTick} §6==>§r Container Report #${botNumber}`, debug);
    const itemMap = new Map();
    for (let i = 0; i < 27; i++) {
        //@ts-ignore
        if (container.getItem[ i ]) {
            const slot = container.getSlot(i);
            const itemName = slot.typeId;
            let count = slot.amount;
            if (itemMap.has(itemName)) { count += itemMap.get(itemName); }
            itemMap.set(itemName, count);
        }
    }
    if (itemMap.size > 0) {
        let msg = `§aRetrieved Item List (Death Bot #${botNumber}):§r`;
        itemMap.forEach((v, k) => { msg += `\n§a=====>§r ${v} - ${k}`; });
        dev.alertLog(`§bTick:§r ${system.currentTick} §6==>§r ${msg}`, debug);
    }
}
//============================================================================================================================
