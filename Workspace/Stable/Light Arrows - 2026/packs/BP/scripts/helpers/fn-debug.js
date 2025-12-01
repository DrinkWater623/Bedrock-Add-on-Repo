// fn-debug.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T. (https://www.gnu.org/licenses/gpl-3.0.html)
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20251129 
========================================================================*/
// Minecraft

// Shared

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
 * @property {boolean} debugBlockSubscriptions 
 * @property {boolean} watchLightBar 
 * @property {boolean} watchMiniBlock 
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
    debugOn: true,
    debugSubscriptionsOn: false,
    debugFunctionsOn: false,
    debugBlockSubscriptions: true,    
    watchLightBar: true,    
    watchMiniBlock: true,    
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