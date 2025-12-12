// fn-debug.js Tree Spiders
//@ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20251206 - created 
========================================================================*/
// Minecraft
import { system } from "@minecraft/server";
// Shared
import { Ticks } from "../common-data/globalConstantsLib.js";
import { EntityLib } from "../common-stable/entities/entityClass.js";
// Local
import { alertLog, pack, watchFor } from '../settings.js';
//==============================================================================

//Change this to change the entity
export const dev = {
    debugAll: false,
    debugCallBackEvents: false,
    debugEntityAlert: true,
    debugGamePlay: true,
    debugPackLoad: false,
    debugSubscriptions: false
};
export const devDebug = {
    // Customize this to the project
    // flags
    debugOn: false,
    debugSubscriptionsOn: false,
    debugFunctionsOn: false,    
    watchEntitySubscriptions: false,
    watchPlayerActions: false,
    watchTempIssues: false,

    allOff () {
        let noChange = !this.debugOn;
        for (const [ k, v ] of Object.entries(this)) {
            if (typeof v === "boolean") {
                noChange = noChange && !v;
                // @ts-expect-error index write on object literal
                this[ k ] = /** @type {unknown} */ (false);
            }
        }
        this.debugOn = false;
    },

    allOn () {
        let noChange = this.debugOn;
        for (const [ k, v ] of Object.entries(this)) {
            if (typeof v === "boolean") {
                noChange = noChange && v;
                // @ts-expect-error index write on object literal
                this[ k ] = /** @type {unknown} */ (true);
            }
        }
        this.debugOn = true;
    },

    anyOn () {
        let any = false;
        for (const [ , v ] of Object.entries(this)) {
            if (typeof v === "boolean") any = any || v;
        }
        this.debugOn = any;
    }    
};
//==============================================================================
// End of File
//====================================================================