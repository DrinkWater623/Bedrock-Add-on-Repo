// fn-debug.js  Wandering Trader Guild
//@ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T.
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20251204 - not really needed for this addon - so minimal stuff 
========================================================================*/
// Local
import { alertLog } from './settings.js';
//==============================================================================
// JSDoc Makes the squiggly red lines go away....
//==============================================================================
/** Core shape without index signature. */
//==============================================================================
/**
 * @typedef DevObject
 * @property {boolean} debugOn
 * @property {boolean} debugSubscriptionsOn
 * @property {boolean} debugFunctionsOn
 * @property {boolean} entityNaming
 * @property {boolean} entityTimers
 * @property {() => void} allOff
 * @property {() => void} allOn
 * @property {() => void} anyOn * 
 */
//==============================================================================
const debugFunctions = false; //for the devDebug object

//==============================================================================
/** @type {DevObject} */
export const devDebug = {
    // Customize this to the project
    // flags
    debugOn: false,
    debugSubscriptionsOn: false,
    debugFunctionsOn: false,
    entityNaming:true,
    entityTimers:true,

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