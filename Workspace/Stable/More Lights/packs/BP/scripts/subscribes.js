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
import { BlockSubscriptions,ItemSubscriptions,PlayerSubscriptions,SystemSubscriptions } from "./common-stable/subscriptions/index.js";
import { DynamicPropertyLib } from "./common-stable/tools/index.js";
//Local
import { lightArrow_onPlace, lightBar_onPlace, lightMiniBlock_onPlace } from "./blockComponent.js";
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
const blockSubs = new BlockSubscriptions(packDisplayName, dev.debugSubscriptions.debugSubscriptionsOn);
const itemSubs = new ItemSubscriptions(packDisplayName, dev.debugSubscriptions.debugSubscriptionsOn);
const playerSubs = new PlayerSubscriptions(packDisplayName, dev.debugSubscriptions.debugSubscriptionsOn);
const systemSubs = new SystemSubscriptions(packDisplayName, dev.debugSubscriptions.debugSubscriptionsOn);
const myItemStackWatch = watchFor.onPlaceBlockList();
//const myArrows = watchFor.arrowBlocks();
//const myMiniBlocks = watchFor.miniBlocks();
//const myBars = watchFor.barBlocks();
const myBlockGroups = watchFor.blockGroups();
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
    if (!event.itemStack) return;
    if (!myItemStackWatch.includes(event.itemStack.typeId)) return;

    const eventType = 'beforePlayerInteractWithBlock';
    const itemStack = event.itemStack;
    const alert = myBlockGroups.some(([ objType, list ]) => dev.isDebugEventObject(eventType, objType) && list.includes(itemStack.typeId));

    DynamicPropertyLib.onPlayerInteractWithBlockBeforeEventInfo_set(
        event,
        [], // block list not used here, this is the block touched.  Not cared about
        myItemStackWatch,
        alert
    );
};
/**@type {AfterItemCompleteUseHandler} */
const onAfterItemCompleteUse = (event) => {
    if (!(event.source instanceof Player)) return;
    if (!myItemStackWatch.includes(event.itemStack.typeId)) return;

    const itemStack = event.itemStack;
    const eventType = 'afterItemCompleteUse';
    const alert = myBlockGroups.some(([ objType, list ]) => dev.isDebugEventObject(eventType, objType) && list.includes(itemStack.typeId));

    const msg = `§b${eventType}:§r typeId=${itemStack.typeId}  useDuration=${event.useDuration}`;
    dev.alertLog.log(msg, alert);
};

/**@type {AfterItemReleaseUseHandler} */
const onAfterItemReleaseUse = (event) => {
    if (!(event.source instanceof Player)) return;
    if (!event.itemStack) return;
    if (!myItemStackWatch.includes(event.itemStack.typeId)) return;

    const itemStack = event.itemStack;
    const eventType = 'afterItemReleaseUse';
    const alert = myBlockGroups.some(([ objType, list ]) => dev.isDebugEventObject(eventType, objType) && list.includes(itemStack.typeId));

    const msg = `§b${eventType}:§r typeId=${itemStack.typeId}  useDuration=${event.useDuration}`;
    dev.alertLog.log(msg, alert);
};
/**@type {AfterItemStartUseHandler} */
const onAfterItemStartUse = (event) => {
    if (!(event.source instanceof Player)) return;
    if (!myItemStackWatch.includes(event.itemStack.typeId)) return;

    const itemStack = event.itemStack;
    const eventType = 'afterItemStartUse';
    const alert = myBlockGroups.some(([ objType, list ]) => dev.isDebugEventObject(eventType, objType) && list.includes(itemStack.typeId));

    const msg = `§b${eventType}:§r typeId=${event.itemStack.typeId}`;
    dev.alertLog.log(msg, alert);
};
/**@type {AfterItemStartUseOnHandler} */
const onAfterItemStartUseOn = (event) => {
    if (!(event.source instanceof Player)) return;
    if (!event.itemStack) return;
    if (!myItemStackWatch.includes(event.itemStack.typeId)) return;

    const eventType = 'afterItemStartUseOn';
    const itemStack = event.itemStack;
    const alert = myBlockGroups.some(([ objType, list ]) => dev.isDebugEventObject(eventType, objType) && list.includes(itemStack.typeId));

    const msg = `§b${eventType}:§r typeId=${event.itemStack.typeId}  blockFace=${event.blockFace} on  block=${event.block.typeId}`;
    dev.alertLog.log(msg, alert);
};
/**@type {AfterItemStopUseHandler} */
const onAfterItemStopUse = (event) => {
    if (!(event.source instanceof Player)) return;
    if (!event.itemStack) return;
    if (!myItemStackWatch.includes(event.itemStack.typeId)) return;

    const eventType = 'afterItemStopUse';
    const itemStack = event.itemStack;
    const alert = myBlockGroups.some(([ objType, list ]) => dev.isDebugEventObject(eventType, objType) && list.includes(itemStack.typeId));

    const msg = `§b${eventType}:§r typeId=${event.itemStack.typeId}  useDuration=${event.useDuration}`;
    dev.alertLog.log(msg, alert);
};alert
/**@type {AfterItemStopUseOnHandler} */
const onAfterItemStopUseOn = (event) => {
    if (!(event.source instanceof Player)) return;
    if (!event.itemStack) return;
    if (!myItemStackWatch.includes(event.itemStack.typeId)) return;

    const itemStack = event.itemStack;
    const eventType = 'afterItemStopUseOn';
    const alert = myBlockGroups.some(([ objType, list ]) => dev.isDebugEventObject(eventType, objType) && list.includes(itemStack.typeId));

    const msg = `§b${eventType}:§r typeId=${event.itemStack.typeId} on block=${event.block.typeId}`;
    dev.alertLog.log(msg, alert);
};
/**@type {BeforeItemUseHandler} */
const onBeforeItemUse = (event) => {
    if (!(event.source instanceof Player)) return;
    if (!myItemStackWatch.includes(event.itemStack.typeId)) return;

    const itemStack = event.itemStack;
    const eventType = 'beforeItemUse';
    const alert = myBlockGroups.some(([ objType, list ]) => dev.isDebugEventObject(eventType, objType) && list.includes(itemStack.typeId));

    const msg = `§b${eventType}:§r typeId=${event.itemStack.typeId}`;
    dev.alertLog.log(msg, alert);
};
//==============================================================================
export function subscriptionsStable () {
    const _name = 'subscriptionsStable';
    dev.alertFunction(_name, true);

    //2 ways to do it.  Use register for bulk tho
    //blockSubs.register({})
    systemSubs.register({ beforeStartup: onBeforeStartup });
    itemSubs.register({
        afterItemCompleteUse: onAfterItemCompleteUse,
        afterItemReleaseUse: onAfterItemReleaseUse,
        afterItemStopUse: onAfterItemStopUse,
        afterItemStopUseOn: onAfterItemStopUseOn,
        afterItemStartUse: onAfterItemStartUse,
        afterItemStartUseOn: onAfterItemStartUseOn,
        beforeItemUse: onBeforeItemUse,
    });
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
/* Save just in case
    const debug =
        (dev.isDebugEventObject(eventType, 'arrow') && myArrows.includes(event.itemStack.typeId)) ||
        (dev.isDebugEventObject(eventType, 'bar') && myBars.includes(event.itemStack.typeId)) ||
        (dev.isDebugEventObject(eventType, 'mini_block') && myMiniBlocks.includes(event.itemStack.typeId));
 */