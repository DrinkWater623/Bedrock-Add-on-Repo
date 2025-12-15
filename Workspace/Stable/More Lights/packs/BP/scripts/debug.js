// debug.js
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
import { pack, packDisplayName } from './settings.js';
import { DevBlocks } from './common-stable/debug/devLib.js';
//==============================================================================
// JSDoc Makes the squiggly red lines go away....
//==============================================================================
class DevMoreLights extends DevBlocks {
    /**
   * @constructor
   * @param {string} pack_name 
   */
    constructor(pack_name) {
        super(pack_name, pack.debugOn);

        Object.assign(this.debugFunctions, {
            faceLocationGrid: true,
        });

        Object.assign(this.debugEvents, this.debugEvents, {

            // Block Component Events
            onPlace_arrow: true,
            onPlace_bar: true,
            onPlace_miniBlock: true,

            //Minecraft Events
            beforePlayerInteractWithBlock_arrow: true,
            beforePlayerInteractWithBlock_bar: true,
            beforePlayerInteractWithBlock_miniBlock: true,

            afterStartUse_arrow: true,
            afterStartUse_bar: true,
            afterStartUse_miniBlock: true,

            beforeUse_arrow: true,
            beforeUse_bar: true,
            beforeUse_miniBlock: true,

            // Summary flags - Auto set
            afterStartUse: false,
            beforePlayerInteractWithBlock: false,
            beforeUse: false,
        });

        Object.assign(this.debugSubscriptions, {
            none: false,
        });
        /*
        Master override - if pack setting does not have debugOn, then turn it all off
        That way can have a master switch
        */
        if (pack.debugOn) this.setupAlerts();
        else this.allOff();
    }
    setupAlerts () {
        this.anyOn();
        this.alertFunction(`setupAlerts`);

        //Check any... for objects expanded above
        this.debugEvents.beforePlayerInteractWithBlock = this.debugEvents.beforePlayerInteractWithBlock_arrow ||
            this.debugEvents.beforePlayerInteractWithBlock_bar ||
            this.debugEvents.beforePlayerInteractWithBlock_miniBlock;

        this.debugEvents.afterStartUse = this.debugEvents.afterStartUse_arrow ||
            this.debugEvents.afterStartUse_bar ||
            this.debugEvents.afterStartUse_miniBlock;

        this.debugEvents.beforeUse = this.debugEvents.beforeUse_arrow ||
            this.debugEvents.beforeUse_bar ||
            this.debugEvents.beforeUse_miniBlock;

        this.debugOn = this.anyOn();
    }
}
//==============================================================================
export const dev = new DevMoreLights(packDisplayName);
//==============================================================================
// End of File
//====================================================================