// subscribes.js  More Lights Minecraft Bedrock Add-on
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
import { arrow_onPlace as arrow_onPlace, bar_onPlace as bar_onPlace, mini_block_onPlace as mini_block_onPlace, mini_dot_onPlace, mini_puck_onPlace } from "./blockComponent.js";
import { pack, packDisplayName, watchFor } from './settings.js';
import { registerCustomCommands } from "./chatCmds.js";
import { dev } from "./debug.js";
//==============================================================================
/** The function type subscribe expects. */
//  Blocks
/** @typedef {Parameters<typeof world.beforeEvents.playerInteractWithBlock.subscribe>[0]} BeforePlayerInteractWithBlockHandler */
// Items
/** @typedef {Parameters<typeof world.afterEvents.itemCompleteUse.subscribe>[0]} AfterItemCompleteUseHandler */
/** @typedef {Parameters<typeof world.afterEvents.itemReleaseUse.subscribe>[0]} AfterItemReleaseUseHandler */
/** @typedef {Parameters<typeof world.afterEvents.itemStartUse.subscribe>[0]} AfterItemStartUseHandler */
/** @typedef {Parameters<typeof world.afterEvents.itemStartUseOn.subscribe>[0]} AfterItemStartUseOnHandler */
/** @typedef {Parameters<typeof world.afterEvents.itemStopUse.subscribe>[0]} AfterItemStopUseHandler */
/** @typedef {Parameters<typeof world.afterEvents.itemStopUseOn.subscribe>[0]} AfterItemStopUseOnHandler */
/** @typedef {Parameters<typeof world.beforeEvents.itemUse.subscribe>[0]} BeforeItemUseHandler */
// System
/** @typedef {Parameters<typeof system.beforeEvents.startup.subscribe>[0]} BeforeStartupHandler */
//==============================================================================
//==============================================================================
const debugSubscriptions = dev.isDebugFunction('subscriptions');
const blockSubs = new BlockSubscriptions(packDisplayName, debugSubscriptions);
const itemSubs = new ItemSubscriptions(packDisplayName, debugSubscriptions);
const playerSubs = new PlayerSubscriptions(packDisplayName, debugSubscriptions);
const systemSubs = new SystemSubscriptions(packDisplayName, debugSubscriptions);
const myItemStackWatch = watchFor.onPlaceBlockList;
//const myMiniBlocks = watchFor.miniBlocks();
//const myBars = watchFor.barBlocks();
const myBlockGroups = watchFor.onPlaceBlockGroups();
//==============================================================================
/** @type {BeforeStartupHandler} */
const onBeforeStartup = (event) => {
    const ccr = event.customCommandRegistry;
    dev.alertFunctionKey('onBeforeStartup');
    registerCustomCommands(ccr);

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
    if (!event.itemStack) return;
    if (!myItemStackWatch.includes(event.itemStack.typeId)) return;

    const eventType = 'beforePlayerInteractWithBlock';
    const itemStack = event.itemStack;
    const alert = myBlockGroups.some(([ objType, list ]) => dev.isDebugBlockObjectEvent(objType, eventType) && list.includes(itemStack.typeId));
    const x = event.blockFace;
    DynamicPropertyLib.onPlayerInteractWithBlockBeforeEventInfo_set(
        event,
        [], // block list not used here, this is the block touched.  Not cared about
        myItemStackWatch,
        alert
    );
};
//==============================================================================
export function subscriptionsStable () {
    const _name = 'subscriptionsStable';
    const tickStart = system.currentTick;
    dev.alertFunctionKey(_name, true);

    systemSubs.beforeStartup.subscribe(onBeforeStartup, dev.isDebugFunction('alertSystemSubs'));
    playerSubs.beforePlayerInteractWithBlock.subscribe(onBeforePlayerInteractWithBlock, dev.isDebugFunction('alertPlayerSubs'));
    
    world.afterEvents.worldLoad.subscribe((event) => {
        pack.worldLoaded = true;
        dev.alertSystemEventLog('afterWorldLoad', `§c§lThe world is loaded§r @ §bDelta Ticks:§r ${system.currentTick - tickStart}`);
    });
}
//==============================================================================
// End of File
//==============================================================================
/* Save just in case
    const debug =
        (dev.isDebugEventObject(eventType, 'arrow') && myArrows.includes(event.itemStack.typeId)) ||
        (dev.isDebugEventObject(eventType, 'bar') && myBars.includes(event.itemStack.typeId)) ||
        (dev.isDebugEventObject(eventType, 'mini_block') && myMiniBlocks.includes(event.itemStack.typeId));
 */