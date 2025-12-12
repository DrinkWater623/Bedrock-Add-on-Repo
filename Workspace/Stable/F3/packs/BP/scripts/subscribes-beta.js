//subscribes-beta.js F3 Events
//@ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M>I>T> (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20251208 - created
========================================================================*/
import { world, system } from "@minecraft/server";
//Shared
import { chance } from "./common-stable/tools/mathLib.js";
import { Vector3Lib } from "./common-stable/tools/vectorClass.js";
import { DynamicPropertyLib } from "./common-stable/tools/dynamicPropertyClass.js";
import { EntitySubscriptions } from "./common-stable/subscriptions/entitySubs-stable.js";
import { PlayerSubscriptions } from "./common-stable/subscriptions/playerSubs-stable.js";
import { SystemSubscriptions } from "./common-stable/subscriptions/systemSubs-stable.js";
//Local
import { alertLog, pack, packDisplayName } from './settings.js';
import { registerCustomCommands } from "./chatCmds.js";
import { devDebug } from "./helpers/fn-debug.js";
//==============================================================================
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
//==============================================================================
/** The function type subscribe expects. */
//  Players
/** @typedef {Parameters<typeof world.beforeEvents.playerPlaceBlock.subscribe>[0]} BeforePlayerPlaceBlockHandler */
//==============================================================================
const playerSubs = new PlayerSubscriptions(packDisplayName, devDebug.debugSubscriptionsOn);
//==============================================================================
/** @type {BeforePlayerPlaceBlockHandler} */
const onBeforePlayerPlaceBlock = (event) => {
 
    const { block } = event;
    if (!block.isValid) return;
    const { typeId, dimension, location } = block;
    const locationCtr = Vector3Lib.toCenter(location);

 
};
//==============================================================================
export function subscriptionsBeta () {
    //systemSubs.register({});
    //entitySubs.register({});
    playerSubs.register({

    });    
}
//==============================================================================
// End of File
//==============================================================================