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
import { ItemSubscriptions } from "../common-stable/subscriptions/index.js";
//Local
import { packDisplayName, watchFor } from '../settings.js';
import { dev } from "../debug.js";
//==============================================================================
/** The function type subscribe expects. */
// Items
/** @typedef {Parameters<typeof world.afterEvents.itemCompleteUse.subscribe>[0]} AfterItemCompleteUseHandler */
/** @typedef {Parameters<typeof world.afterEvents.itemReleaseUse.subscribe>[0]} AfterItemReleaseUseHandler */
/** @typedef {Parameters<typeof world.afterEvents.itemStartUse.subscribe>[0]} AfterItemStartUseHandler */
/** @typedef {Parameters<typeof world.afterEvents.itemStartUseOn.subscribe>[0]} AfterItemStartUseOnHandler */
/** @typedef {Parameters<typeof world.afterEvents.itemStopUse.subscribe>[0]} AfterItemStopUseHandler */
/** @typedef {Parameters<typeof world.afterEvents.itemStopUseOn.subscribe>[0]} AfterItemStopUseOnHandler */
/** @typedef {Parameters<typeof world.beforeEvents.itemUse.subscribe>[0]} BeforeItemUseHandler */
//==============================================================================
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
//==============================================================================
const myItemStackWatchList = [...dev.blockWatchList,...dev.itemWatchList]
//const myBars = watchFor.barBlocks();
//const myBlockGroups = watchFor.onPlaceBlockGroups();
//==============================================================================
/**@type {AfterItemCompleteUseHandler} */
const onAfterItemCompleteUse = (event) => {
    if (!(event.source instanceof Player)) return;
    if (!myItemStackWatchList.includes(event.itemStack.typeId)) return;

    const eventName = 'afterItemCompleteUse';
    const msg = `${dev.alertLabel(eventName)} ${event.source.name}  ${dev.fieldLabel('Item')} ${event.itemStack.typeId}  ${dev.fieldLabel('Use Duration')} ${event.useDuration}`;
    dev.alertItemEventLog(eventName,msg);
};
/**@type {AfterItemReleaseUseHandler} */
const onAfterItemReleaseUse = (event) => {
    if (!(event.source instanceof Player)) return;
    if (!event.itemStack) return;
    if (!myItemStackWatchList.includes(event.itemStack.typeId)) return;

    const eventName = 'afterItemReleaseUse';
    const msg = `${dev.alertLabel(eventName)} ${event.source.name}  ${dev.fieldLabel('Item')} ${event.itemStack.typeId}  ${dev.fieldLabel('Use Duration')} ${event.useDuration}`;
    dev.alertItemEventLog(eventName,msg);
};
/**@type {AfterItemStartUseHandler} */
const onAfterItemStartUse = (event) => {
    if (!(event.source instanceof Player)) return;
    if (!myItemStackWatchList.includes(event.itemStack.typeId)) return;

    const eventName = 'afterItemStartUse';
    const msg = `${dev.alertLabel(eventName)} ${event.source.name}  ${dev.fieldLabel('Item')} ${event.itemStack.typeId}`;
    dev.alertItemEventLog(eventName,msg);
};
/**@type {AfterItemStartUseOnHandler} */
const onAfterItemStartUseOn = (event) => {
    if (!(event.source instanceof Player)) return;
    if (!event.itemStack) return;
    if (!myItemStackWatchList.includes(event.itemStack.typeId)) return;

    const eventName = 'afterItemStartUseOn';
    const msg = `${dev.alertLabel(eventName)} ${event.source.name} ${dev.fieldLabel('Item')} ${event.itemStack.typeId} on ${dev.fieldLabel('Block')} ${event.block.typeId} (${event.blockFace})`;
    dev.alertItemEventLog(eventName,msg);
};
/**@type {AfterItemStopUseHandler} */
const onAfterItemStopUse = (event) => {
    if (!(event.source instanceof Player)) return;
    if (!event.itemStack) return;
    if (!myItemStackWatchList.includes(event.itemStack.typeId)) return;

    const eventName = 'afterItemStopUse';
    const msg = `${dev.alertLabel(eventName)} ${event.source.name}  ${dev.fieldLabel('Item')} ${event.itemStack.typeId}  ${dev.fieldLabel('Use Duration')} ${event.useDuration}`;
    dev.alertItemEventLog(eventName,msg);
};
/**@type {AfterItemStopUseOnHandler} */
const onAfterItemStopUseOn = (event) => {
    if (!(event.source instanceof Player)) return;
    if (!event.itemStack) return;
    if (!myItemStackWatchList.includes(event.itemStack.typeId)) return;

    const eventName = 'afterItemStopUseOn';
    const msg = `${dev.alertLabel(eventName)}${event.source.name}  ${dev.fieldLabel('Item')} ${event.itemStack.typeId} on ${dev.fieldLabel('Block')} ${event.block.typeId}`;
    dev.alertItemEventLog(eventName,msg);
};
/**@type {BeforeItemUseHandler} */
const onBeforeItemUse = (event) => {
    if (!(event.source instanceof Player)) return;
    if (!myItemStackWatchList.includes(event.itemStack.typeId)) return;

    const eventName = 'beforeItemUse';
    const msg = `${dev.alertLabel(eventName)}${event.source.name}  ${dev.fieldLabel('Item')} ${event.itemStack.typeId}`;
    dev.alertItemEventLog(eventName,msg);
};
//==============================================================================
const itemSubs = new ItemSubscriptions(packDisplayName, dev.isDebugFunction(('subscriptionsItems')));
export function subscriptionsItems () {
    const _name = 'subscriptionsItems';
    dev.alertFunctionKey(_name, true);

    itemSubs.register({
        afterItemCompleteUse: onAfterItemCompleteUse,
        afterItemReleaseUse: onAfterItemReleaseUse,
        afterItemStopUse: onAfterItemStopUse,
        afterItemStopUseOn: onAfterItemStopUseOn,
        afterItemStartUse: onAfterItemStartUse,
        afterItemStartUseOn: onAfterItemStartUseOn,
        beforeItemUse: onBeforeItemUse,
    }, dev.isDebugFunction('alertItemSubs'));
}
//==============================================================================
// End of File
//==============================================================================
/* Save just in case
    const debug =
        (dev.isDebugEventObject(eventName, 'arrow') && myArrows.includes(event.itemStack.typeId)) ||
        (dev.isDebugEventObject(eventName, 'bar') && myBars.includes(event.itemStack.typeId)) ||
        (dev.isDebugEventObject(eventName, 'mini_block') && myMiniBlocks.includes(event.itemStack.typeId));
 */