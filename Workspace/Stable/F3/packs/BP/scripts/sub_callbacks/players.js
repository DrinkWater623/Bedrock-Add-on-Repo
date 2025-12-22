// players.js F3
//@ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Change Log:
    20251219 - Created
========================================================================*/
import { world, system } from "@minecraft/server";
//Shared
import { airBlock } from "../common-data/index.js";
import { DynamicPropertyLib } from "../common-stable/tools/index.js";
import { PlayerSubscriptions } from "../common-stable/subscriptions/index.js";
import { Vector3Lib } from "../common-stable/tools/index.js";
//Local
import { alertLog, pack, packDisplayName, toggles, watchFor } from '../settings.js';
import { dev } from "../debug.js";
//==============================================================================
//import { ScoreboardLib } from "./common-stable/scoreboardClass.js";

//==============================================================================
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** The function type subscribe expects. */
//  Blocks
/** @typedef {Parameters<typeof world.beforeEvents.playerInteractWithBlock.subscribe>[0]} BeforePlayerInteractWithBlockHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerBreakBlock.subscribe>[0]} AfterPlayerBreakBlockHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerPlaceBlock.subscribe>[0]} AfterPlayerPlaceBlockHandler */
//==============================================================================
const debugOn = false || dev.debugOn;
const myBlockGroups = watchFor.onPlaceBlockList(); //TODO : put back
//==============================================================================
/** @type {AfterPlayerBreakBlockHandler} */
const onAfterPlayerBreakBlock = (event) => {
    if (!watchFor.onBreakBlockList.includes(event.brokenBlockPermutation.type.id)) return;

    const { block, dimension, brokenBlockPermutation, itemStackBeforeBreak } = event;
    const blockTypeId = brokenBlockPermutation.type.id;
    const location = block.location;
};
//==============================================================================
/** @type {AfterPlayerPlaceBlockHandler} */
const onAfterPlayerPlaceBlock = (event) => {
    if (!watchFor.onPlaceBlockList().includes(event.block.typeId)) return;

    const { block } = event;
    if (!block.isValid) return;
    const { typeId, dimension, location } = block;
    const locationCtr = Vector3Lib.toCenter(location);
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
    if (!watchFor.onPlaceBlockList().includes(event.itemStack.typeId)) return;

    const eventType = 'beforePlayerInteractWithBlock';
    const itemStack = event.itemStack;
    const alert = myBlockGroups.some(([ objType, list ]) => dev.isDebugEventObject(eventType, objType) && list.includes(itemStack.typeId));
    const x = event.blockFace
    DynamicPropertyLib.onPlayerInteractWithBlockBeforeEventInfo_set(
        event,
        [], // block list not used here, this is the block touched.  Not cared about
        watchFor.onPlaceBlockList(),
        alert
    );
};
//==============================================================================
export const playerSubs = new PlayerSubscriptions(packDisplayName, true);
//==============================================================================
export function subscriptionsPlayers () {
    const _name = 'function subscriptionsPlayers';
    alertLog.log(`§v* ${_name} ()`, dev.debugFunctions.debugFunctionsOnOn);

    playerSubs.register({
        afterPlayerBreakBlock: onAfterPlayerBreakBlock,
        afterPlayerPlaceBlock: onAfterPlayerPlaceBlock,
        beforePlayerInteractWithBlock: onBeforePlayerInteractWithBlock
    });   
}
//==============================================================================
// End of File
//==============================================================================