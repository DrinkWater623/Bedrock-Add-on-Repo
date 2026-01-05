// subscribes.js  F3 Testing Bedrock Add-on
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20251023 - add in stable stuff and update to api 2.0 and move debug-only stuff out
    20251217 - too much to mention - added all the temp subs for tracing events
========================================================================*/
import { world, system, Player } from "@minecraft/server";
//Shared
import { BlockSubscriptions, ItemSubscriptions, PlayerSubscriptions, SystemSubscriptions } from "./common-stable/subscriptions/index.js";
import { DynamicPropertyLib } from "./common-stable/tools/index.js";
//Local
import { arrow_onPlace, bar_onPlace, mini_block_onPlace, mini_dot_onPlace, mini_puck_onPlace } from "./blockComponent.js";
import { pack, packDisplayName, watchFor } from './settings.js';
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

    //Note: onBeforePlayerInteractWithBlock has to be running for onPlace
    //TODO: move it to stand along call and another can be for whatever else.
    event.blockComponentRegistry.registerCustomComponent(
        'dw623:on_place_arrow', { beforeOnPlayerPlace: e => { arrow_onPlace(e); } }
    );

    event.blockComponentRegistry.registerCustomComponent(
        'dw623:on_place_bar', { beforeOnPlayerPlace: e => { bar_onPlace(e); } }
    );

    event.blockComponentRegistry.registerCustomComponent(
        'dw623:on_place_mini_puck', { beforeOnPlayerPlace: e => { mini_puck_onPlace(e); } }
    );

    event.blockComponentRegistry.registerCustomComponent(
        'dw623:on_place_mini_block', { beforeOnPlayerPlace: e => { mini_block_onPlace(e); } }
    );

    event.blockComponentRegistry.registerCustomComponent(
        'dw623:on_place_mini_dot', { beforeOnPlayerPlace: e => { mini_dot_onPlace(e); } }
    );
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
    });
}
//==============================================================================
// End of File
//==============================================================================