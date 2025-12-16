//subscribes.js
//@ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20251023 - add in stable stuff and update to api 2.0 and move debug-only stuff out
========================================================================*/
import { world, system } from "@minecraft/server";
//Shared
import { PlayerSubscriptions } from "./common-stable/subscriptions/playerSubs.js";
import { SystemSubscriptions } from "./common-stable/subscriptions/systemSubs.js";
import { DynamicPropertyLib } from "./common-stable/tools/dynamicPropertyClass.js";
//Local
import { pack, packDisplayName, watchFor } from './settings.js';
import { dev } from "./debug.js";
import { lightArrow_onPlace, lightBar_onPlace, lightMiniBlock_onPlace } from "./blockComponent.js";
import { registerCustomCommands } from "./chatCmds.js";
//==============================================================================
/** The function type subscribe expects. */
//  Blocks
/** @typedef {Parameters<typeof world.beforeEvents.playerInteractWithBlock.subscribe>[0]} BeforePlayerInteractWithBlockHandler */
// Items
/** @typedef {Parameters<typeof world.beforeEvents.itemUse.subscribe>[0]} BeforeItemUseHandler */
// System
/** @typedef {Parameters<typeof system.beforeEvents.startup.subscribe>[0]} BeforeStartupHandler */
//==============================================================================
//==============================================================================
const playerSubs = new PlayerSubscriptions(packDisplayName, dev.debugSubscriptions.debugSubscriptionsOn);
const systemSubs = new SystemSubscriptions(packDisplayName, dev.debugSubscriptions.debugSubscriptionsOn);
//==============================================================================
/** @type {BeforeStartupHandler} */
const onBeforeStartup = (event) => {
    const ccr = event.customCommandRegistry;
    registerCustomCommands(ccr);

    event.blockComponentRegistry.registerCustomComponent(
        'dw623:on_place_arrow', { beforeOnPlayerPlace: e => { lightArrow_onPlace(e); } }
    );

    event.blockComponentRegistry.registerCustomComponent(
        'dw623:on_place_bar', { beforeOnPlayerPlace: e => { lightBar_onPlace(e); } }
    );

    event.blockComponentRegistry.registerCustomComponent(
        'dw623:on_place_mini_block', { beforeOnPlayerPlace: e => { lightMiniBlock_onPlace(e); } }
    );
};
//==============================================================================
/**
 * Captures the faceLocation information for the placeBlock event to use for permutations. 
 * Maybe one day they will add that property to the placeBlock event directly.
 * 
 * Alter and add your block lists in settings.js watchFor as needed
 *  @type {BeforePlayerInteractWithBlockHandler} 
 * */
const onBeforePlayerInteractWithBlock = (event) => {
    event.cancel = false;
    if (!event.isFirstEvent) return;

    const debug = dev.debugEvents.beforePlayerInteractWithBlock

    DynamicPropertyLib.onPlayerInteractWithBlockBeforeEventInfo_set(
        event,
        [], // block list not used here, this is the block touched.  Not cared about
        watchFor.onUseBlockAsItemList,
        debug
    );
};
//==============================================================================
export function subscriptionsStable () {
    const _name = 'subscriptionsStable';
    dev.alertFunction(_name, true);

    //2 ways to do it.  Use register for bulk tho
    systemSubs.register({ beforeStartup: onBeforeStartup });
    playerSubs.beforePlayerInteractWithBlock.subscribe(onBeforePlayerInteractWithBlock);

    world.afterEvents.worldLoad.subscribe((event) => {
        pack.worldLoaded = true;
        dev.alertSubscriptionSuccess(`world.afterEvents.worldLoad`);
    });

    dev.alertFunction(_name, false);
}
//==============================================================================
// End of File
//==============================================================================