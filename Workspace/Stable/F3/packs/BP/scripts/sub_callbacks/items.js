// subscribes.js  F3 Testing Minecraft Bedrock Add-on
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
import { ItemSubscriptions } from "../common-stable/subscriptions/index.js";
//Local
import {  packDisplayName, watchFor } from '../settings.js';
import { dev } from "../debug.js";
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
export const itemSubs = new ItemSubscriptions(packDisplayName, dev.debugSubscriptions.debugSubscriptionsOn);
const myItemStackWatch = watchFor.onPlaceBlockList();
const myBlocks = watchFor.onPlaceBlockList;
//==============================================================================
/**@type {AfterItemCompleteUseHandler} */
const onAfterItemCompleteUse = (event) => {
    if (!(event.source instanceof Player)) return;
    if (!myItemStackWatch.includes(event.itemStack.typeId)) return;

    const itemStack = event.itemStack;
    const eventType = 'afterItemCompleteUse';
    const alert = myBlocks.some(([ objType, list ]) => dev.isDebugEventObject(eventType, objType) && list.includes(itemStack.typeId));

    const msg = `§6§l${eventType}:§r typeId=${itemStack.typeId}  useDuration=${event.useDuration}`;
    dev.alertLog(msg, alert);
};

/**@type {AfterItemReleaseUseHandler} */
const onAfterItemReleaseUse = (event) => {
    if (!(event.source instanceof Player)) return;
    if (!event.itemStack) return;
    if (!myItemStackWatch.includes(event.itemStack.typeId)) return;

    const itemStack = event.itemStack;
    const eventType = 'afterItemReleaseUse';
    const alert = myBlocks.some(([ objType, list ]) => dev.isDebugEventObject(eventType, objType) && list.includes(itemStack.typeId));

    const msg = `§6§l${eventType}§r typeId=${itemStack.typeId}  useDuration=${event.useDuration}`;
    dev.alertLog(msg, alert);
};
/**@type {AfterItemStartUseHandler} */
const onAfterItemStartUse = (event) => {
    if (!(event.source instanceof Player)) return;
    if (!myItemStackWatch.includes(event.itemStack.typeId)) return;

    const itemStack = event.itemStack;
    const eventType = 'afterItemStartUse';
    const alert = myBlocks.some(([ objType, list ]) => dev.isDebugEventObject(eventType, objType) && list.includes(itemStack.typeId));

    const msg = `§6§l${eventType}§r typeId=${event.itemStack.typeId}`;
    dev.alertLog(msg, alert);
};
/**@type {AfterItemStartUseOnHandler} */
const onAfterItemStartUseOn = (event) => {
    if (!(event.source instanceof Player)) return;
    if (!event.itemStack) return;
    if (!myItemStackWatch.includes(event.itemStack.typeId)) return;

    const eventType = 'afterItemStartUseOn';
    const itemStack = event.itemStack;
    const alert = myBlocks.some(([ objType, list ]) => dev.isDebugEventObject(eventType, objType) && list.includes(itemStack.typeId));

    const msg = `§6§l${eventType}:§r typeId=${event.itemStack.typeId}  blockFace=${event.blockFace} on  block=${event.block.typeId}`;
    dev.alertLog(msg, alert);
};
/**@type {AfterItemStopUseHandler} */
const onAfterItemStopUse = (event) => {
    if (!(event.source instanceof Player)) return;
    if (!event.itemStack) return;
    if (!myItemStackWatch.includes(event.itemStack.typeId)) return;

    const eventType = 'afterItemStopUse';
    const itemStack = event.itemStack;
    const alert = myBlocks.some(([ objType, list ]) => dev.isDebugEventObject(eventType, objType) && list.includes(itemStack.typeId));

    const msg = `§6§l${eventType}§r typeId=${event.itemStack.typeId}  useDuration=${event.useDuration}`;
    dev.alertLog(msg, alert);
};
/**@type {AfterItemStopUseOnHandler} */
const onAfterItemStopUseOn = (event) => {
    if (!(event.source instanceof Player)) return;
    if (!event.itemStack) return;
    if (!myItemStackWatch.includes(event.itemStack.typeId)) return;

    const itemStack = event.itemStack;
    const eventType = 'afterItemStopUseOn';
    const alert = myBlocks.some(([ objType, list ]) => dev.isDebugEventObject(eventType, objType) && list.includes(itemStack.typeId));

    const msg = `§6§l${eventType}§r typeId=${event.itemStack.typeId} on block=${event.block.typeId}`;
    dev.alertLog(msg, alert);
};
/**@type {BeforeItemUseHandler} */
const onBeforeItemUse = (event) => {
    if (!(event.source instanceof Player)) return;
    if (!myItemStackWatch.includes(event.itemStack.typeId)) return;

    const itemStack = event.itemStack;
    const eventType = 'beforeItemUse';
    const alert = myBlocks.some(([ objType, list ]) => dev.isDebugEventObject(eventType, objType) && list.includes(itemStack.typeId));

    const msg = `§6§l${eventType}§r typeId=${event.itemStack.typeId}`;
    dev.alertLog(msg, alert);
};
//==============================================================================
export function subscriptionsItems () {
    const _name = 'subscriptionsItems';
    const alert=dev.debugFunctions.subscriptionsItems
    dev.alertFunction(_name, true,alert);

    //2 ways to do it.  Use register for bulk tho

    itemSubs.register({
        afterItemCompleteUse: onAfterItemCompleteUse,
        afterItemReleaseUse: onAfterItemReleaseUse,
        afterItemStopUse: onAfterItemStopUse,
        afterItemStopUseOn: onAfterItemStopUseOn,
        afterItemStartUse: onAfterItemStartUse,
        afterItemStartUseOn: onAfterItemStartUseOn,
        beforeItemUse: onBeforeItemUse,
    },!!dev.debugSubscriptions.alertItemSubs);
}
//==============================================================================
// End of File
//==============================================================================
