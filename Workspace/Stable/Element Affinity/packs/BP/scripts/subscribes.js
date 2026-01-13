// subscribes.js Element-Affinity Bedrock Add-on
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20260111 - Created    
========================================================================*/
import { world, system } from "@minecraft/server";
//Shared
import { SystemSubscriptions } from "./common-stable/subscriptions/index.js";
//Local
import { pack, packDisplayName } from './settings.js';
import { registerCustomCommands } from "./chatCmds.js";
import { dev } from "./debug.js";
import { subscriptionsItems } from "./sub_callbacks/items.js";
import { subscriptionsPlayers } from "./sub_callbacks/players.js";
import { subscriptionsEntities } from "./sub_callbacks/entities.js";

//==============================================================================
/** The function type subscribe expects. */
//  Blocks
/** @typedef {Parameters<typeof world.beforeEvents.playerInteractWithBlock.subscribe>[0]} BeforePlayerInteractWithBlockHandler */
// System
/** @typedef {Parameters<typeof system.beforeEvents.startup.subscribe>[0]} BeforeStartupHandler */
//==============================================================================
//==============================================================================
const debugSubscriptions = dev.isDebugFunction('subscriptions');
const systemSubs = new SystemSubscriptions(packDisplayName, debugSubscriptions);
//==============================================================================
/** @type {BeforeStartupHandler} */
const onBeforeStartup = (event) => {
    const ccr = event.customCommandRegistry;
    dev.alertFunctionKey('onBeforeStartup');
    registerCustomCommands(ccr); 
};
//==============================================================================
export function subscriptionsStable () {
    const _name = 'subscriptionsStable';
    const tickStart = system.currentTick;
    dev.alertFunctionKey(_name, true);

    systemSubs.beforeStartup.subscribe(onBeforeStartup, dev.isDebugFunction('alertSystemSubs'));

    if (dev.isDebugFunction('alertPlayerSubs')) subscriptionsPlayers(); else dev.alertLog('§6§lPlayer Subs Skipped', true);
    if (dev.isDebugFunction('alertItemSubs')) subscriptionsItems(); else dev.alertLog('§6§lItem Subs Skipped', true);
    if (dev.isDebugFunction('alertEntitySubs')) subscriptionsEntities(); else dev.alertLog('§6§lEntity Subs Skipped', true);

    world.afterEvents.worldLoad.subscribe((event) => {
        pack.worldLoaded = true;
        dev.alertSystemEventLog('afterWorldLoad', `§c§lThe world is loaded§r @ §bDelta Ticks:§r ${system.currentTick - tickStart}`);
        // MAKE CHAT COMMAND FOR THESE CUSTOM ONES and blocks too ItemTypeIds.listCustomNonBlocks()
    });
}
//==============================================================================
// End of File
//==============================================================================