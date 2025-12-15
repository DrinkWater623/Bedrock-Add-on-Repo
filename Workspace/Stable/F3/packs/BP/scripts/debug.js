// debug.js Tree Spiders
//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20251108 
========================================================================*/
// Shared
import { DevAll } from './common-stable/debug/devLib.js';
// Local
import {  pack, packDisplayName } from './settings.js';
//==============================================================================
// JSDoc Makes the squiggly red lines go away....
//==============================================================================
class DevF3 extends DevAll {
    /**
   * @constructor
   * @param {string} pack_name 
   */
    constructor(pack_name) {
        super(pack_name, pack.debugOn);

        //Custom to this pack    
        this.watchArrow = true;
        this.watchBar = true;
        this.watchMiniBlock = false;
        this.watchTempIssues = false;

        this.setupAlerts();
    }
    setupAlerts () {
        this.alertFunction(`setupAlerts`);

        //Turn on alerts based on watchFor settings
        this.debugOn = true
        this.debugFunctionsOn = false;
        this.debugSubscriptionsOn = true;

        //trying to capture the order of events and what info I can get and save
        this.blocks.events.playerInteractWithBlock.before=true
        this.players.events.playerInteractWithBlock.before=true
        this.items.events.use.before=true
        this.items.events.afterStartUse=true
        this.items.events.afterStartUseOn=true

        //for all
        this.debugEventsOn = false;
        this.debugCustomEventsOn = false;
        pack.debugOn = this.anyOn();
    }
}
export const dev = new DevF3(packDisplayName);
//==============================================================================
// End of File
//====================================================================