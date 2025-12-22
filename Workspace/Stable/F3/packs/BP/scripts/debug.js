// debug.js - F3
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T. (https://www.gnu.org/licenses/gpl-3.0.html)
URL: https://github.com/DrinkWater623
========================================================================
    Notes to self: 
        the objects in the child class are really meant for watching the event for a particular object type
        and being able to turn on and off easily without looking through the scripts
        as long as I am consistent about usage and do not do band-aid adhoc alerts here and there
========================================================================
Change Log: 
    20251219 - Created
========================================================================*/
import { pack, packDisplayName } from './settings.js';
import { Dev } from './common-stable/debug/index.js';
//==============================================================================
// JSDoc Makes the squiggly red lines go away....
//==============================================================================
/*  Hey YOU... update the 2 "const objects" below and keep your grubby hand out of the Class (if you can)
    Start everything or most everything as false and toggle on via command registry while in game play
    It will be overwhelming if everything is on and you've programmed the debug info for it.
*/
/** @type {Record<string, boolean>} */
const WATCHING_BLOCKS = {
    arrow: true,
    bar: true,
    mini_block: true
};
const WATCHING_ITEMS = {
};
const WATCHING_ENTITIES = {
};
/** @type {Record<string, boolean>} */
const WATCHING_ITEM_EVENTS = {
    //keep to the naming convention
    //subscription events
    afterItemCompleteUse: false,
    afterItemReleaseUse: false,
    afterItemStartUse: false,
    afterItemStartUseOn: false,
    afterItemStopUse: false,
    afterItemStopUseOn: false,
    beforeItemUse: false,
    beforePlayerInteractWithBlock: true,
    //custom component events
    onPlace: true,
};
/** @type {Record<string, boolean>} */
const WATCHING_PLAYER_EVENTS = {
    //keep to the naming convention
    //subscription events
    afterItemCompleteUse: false,
    afterItemReleaseUse: false,
    afterItemStartUse: false,
    afterItemStartUseOn: false,
    afterItemStopUse: false,
    afterItemStopUseOn: false,
    beforeItemUse: false,
    beforePlayerInteractWithBlock: true,
    //custom component events
    onPlace: true,
};
//Auto build the combination of the above 2 objects i.e. beforeItemUse_arrow
//const WATCHING_OBJECT_EVENTS = buildWatchingObjectEvents(WATCHING_EVENTS, WATCHING_OBJECT_TYPES);
/*
Use Subscriptions and Functions for a generic/general non particular object event watching
Turn off and on manually as needed and alter your scripts to use it as needed
May have support functions later - but I do not see any need, unless I want to turn off all entity or all block/item events
(as long as the word is in the name, else I have add them all)
Better yet, use the debuggerBlocks object in the class, it has them ALL
*/
/** @type {Record<string, boolean>} */
const WATCHING_SUBSCRIPTIONS = {
    beforeStartup: false,
    beforePlayerInteractWithBlock: true,
    alertBlockSubs: true,
    alertEntitySubs: false,
    alertItemSubs: false,
    alertPlayerSubs: true,
    alertSystemSubs:true,
};
/** @type {Record<string, boolean>} */
const WATCHING_FUNCTIONS = {
    subscriptionsStable: false,
    registerCommand: false,
    faceLocationGrid: false,
};
// Optional: make your “defaults” truly non-mutable
// Object.freeze(WATCHING_OBJECT_TYPES);
// Object.freeze(WATCHING_EVENTS);
// Object.freeze(WATCHING_OBJECT_EVENTS);

//==============================================================================
class DevF3 extends Dev {
    /**
   * @constructor
   * @param {string} pack_name 
   */
    constructor(pack_name) {
        super(pack_name, pack.debugOn);

        //user alter this in above CONSTS
        Object.assign(this.debugObjectTypes, WATCHING_BLOCKS);
        Object.assign(this.debugEventTypes, WATCHING_ITEM_EVENTS);
        //Object.assign(this.debugEvents, WATCHING_OBJECT_EVENTS);
        Object.assign(this.debugFunctions, WATCHING_FUNCTIONS);
        Object.assign(this.debugSubscriptions, WATCHING_SUBSCRIPTIONS);
        /*
        Master override - if pack setting does not have debugOn, then turn it all off
        That way we can have a master switch
        */
        if (!pack.debugOn)
            this.allOff();
        else
            this.global_update();
    }
}
//==============================================================================
export const dev = new DevF3(packDisplayName);
//==============================================================================
// End of File
//==============================================================================