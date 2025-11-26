// fn-debug.js
//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20251108 
========================================================================*/
// Minecraft
import { system } from "@minecraft/server";
// Shared
import { Ticks } from "../common-data/globalConstantsLib.js";
// Local
import { alertLog, pack, watchFor } from '../settings.js';
//==============================================================================
// JSDoc Makes the squiggly red lines go away....
//==============================================================================
//==============================================================================
/** Core shape without index signature. */
//==============================================================================
/**
 * @typedef DevObject
 * @property {boolean} debugOn
 * @property {boolean} debugSubscriptionsOn
 * @property {boolean} debugFunctionsOn
 * @property {boolean} watchBlockSubscriptions *
 * @property {boolean} watchPlayerActions
 * @property {boolean} watchTempIssues
 * @property {() => void} allOff
 * @property {() => void} allOn
 * @property {() => void} anyOn 
 */
//==============================================================================
const debugFunctions = false; //for the devDebug object
//==============================================================================
//==============================================================================
/** @type {DevObject} */
export const devDebug = {
    // Customize this to the project
    // flags
    debugOn: false,
    debugSubscriptionsOn: false,
    debugFunctionsOn: true,
    watchBlockSubscriptions: false,    
    watchPlayerActions: false,
    watchTempIssues: false,

    allOff () {
        alertLog.log("* function dev.allOff ()");
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
        alertLog.log("* function dev.allOn ()", true);
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
        alertLog.log("* function dev.anyOn ()", debugFunctions);
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