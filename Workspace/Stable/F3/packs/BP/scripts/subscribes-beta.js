// subscribes-beta.js F3 Events
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M>I>T> (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20251231 - created
========================================================================*/
//import { world, system } from "@minecraft/server";
//Shared
//Local
import { dev } from "./debug.js";
import { subscriptionsPlayersBeta } from "./sub_callbacks/players-beta.js";
//==============================================================================
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
//==============================================================================
/** The function type subscribe expects. */
//==============================================================================
export function subscriptionsBeta () {
    const _name = 'subscriptionsBeta';
    dev.alertFunctionKey(_name, true);

    subscriptionsPlayersBeta()
}
//==============================================================================
// End of File
//==============================================================================