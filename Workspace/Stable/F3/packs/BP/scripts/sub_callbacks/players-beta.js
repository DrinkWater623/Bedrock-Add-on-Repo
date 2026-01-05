// players-beta.js  F3 Testing Bedrock Add-on
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20251231 - created
========================================================================*/
import { world } from "@minecraft/server";
//Shared
import { BetaSubscriptions, PlayerSubscriptions } from "../common-stable/subscriptions/index.js";
import { DynamicPropertyLib } from "../common-stable/tools/index.js";
//Local
import { packDisplayName, watchFor } from '../settings.js';
import { dev } from "../debug.js";
//==============================================================================
/** The function type subscribe expects. */
//  Players
/** @typedef {Parameters<typeof world.beforeEvents.playerPlaceBlock.subscribe>[0]} BeforePlayerPlaceBlockHandler */
//==============================================================================
//==============================================================================
const debugSubscriptions = dev.isDebugFunction('subscriptions');

//const myBlockGroups = watchFor.onPlaceBlockGroups();
//==============================================================================
/** @type {BeforePlayerPlaceBlockHandler} */
const onBeforePlayerPlaceBlock = (event) => {
    if(!dev.blockWatchList.includes(event.permutationToPlace.type.id)) return
    const { block } = event;
    if (!block.isValid) return;
    const { typeId, dimension, location } = block;
    //const locationCtr = Vector3Lib.toCenter(location); 
};
//==============================================================================
const playerSubs = new BetaSubscriptions(packDisplayName, dev.isDebugFunction('subscriptionsPlayersBeta'));
export function subscriptionsPlayersBeta () {
    const _name = 'subscriptionsPlayersBeta';
    dev.alertFunctionKey(_name, true);

    playerSubs.register({
        beforePlayerPlaceBlock: onBeforePlayerPlaceBlock
    });
}
//==============================================================================
// End of File
//==============================================================================