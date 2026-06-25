//subscribes.js  XP Bank
//@ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T.
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20260304 - Created
========================================================================*/
import { world, system } from "@minecraft/server";
//Shared
import { PlayerSubscriptions, SystemSubscriptions } from "./common-stable/subscriptions/index.js";
//Local
import { alertLog, pack, packDisplayName } from './settings.js';
import { registerCustomCommands } from "./chatCmds.js";
import { dev } from "./debug.js";
// NEW
import { ensurePlayerDefaults, playerIndex,autoSaveIteration } from "./helpers/playerIndex.js";
//==============================================================================
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
// System
/** @typedef {Parameters<typeof system.beforeEvents.startup.subscribe>[0]} BeforeStartupHandler */
// Player
/** @typedef {Parameters<typeof world.afterEvents.playerLeave.subscribe>[0]} AfterPlayerLeaveHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerSpawn.subscribe>[0]} AfterPlayerSpawnHandler */

//==============================================================================
const debugFunctionsOn = false;
const debugSubscriptionsOn = false;
const dvNames = pack.dvNames;
//==============================================================================
/** @type {BeforeStartupHandler} */
const onBeforeStartup = (event) => {
    const ccr = event.customCommandRegistry;
    registerCustomCommands(ccr);
};
//============================================================================
/** @type {AfterPlayerSpawnHandler} */
const onPlayerSpawn = (event) => {
    const { player } = event;
    if (!player.isValid) return;

    // Create defaults once
    const justInitialized = ensurePlayerDefaults(player);
    if (justInitialized) {
        // TODO: send a message to chat about the program
        return;
    }

    // Cache player + DV-derived settings into the runtime index
    const entry = playerIndex.upsertFromSpawn(player);

    // If autosave is enabled, you can optionally force an immediate "check once"
    // (or just let the scheduler pick it up when due).
    // if (entry.isAutoSaver) { ... }
};
//============================================================================
/** @type {AfterPlayerLeaveHandler} */
const onPlayerLeave = (event) => {
    playerIndex.removeFromLeave(event);
};
//==============================================================================
const systemSubs = new SystemSubscriptions(packDisplayName, debugSubscriptionsOn);
const playerSubs = new PlayerSubscriptions(packDisplayName, debugSubscriptionsOn);
//==============================================================================
export function subscriptionsStable () {
    const _name = 'function subscriptionsStable';
    alertLog.log(`§v* ${_name} ()`, debugFunctionsOn);

    systemSubs.register({
        beforeStartup: onBeforeStartup
    });

    playerSubs.register({
        afterPlayerSpawn: onPlayerSpawn,
        afterPlayerLeave: onPlayerLeave
    });

    world.afterEvents.worldLoad.subscribe((event) => {
        pack.worldLoaded = true;
        alertLog.success(`Subscribed to world.afterEvents.worldLoad`, debugSubscriptionsOn);

        //after I have an auto save job / code ready

        system.runInterval(() => {
            autoSaveIteration()
        }, 100); // check due-ness once per 5 seconds
    });
}
//==============================================================================
// End of File
//==============================================================================