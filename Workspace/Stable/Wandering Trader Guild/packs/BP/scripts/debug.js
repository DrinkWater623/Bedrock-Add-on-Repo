// debug.js - Wandering Trader Guild
// @ts-check
/* =====================================================================
Copyright (C) 2026 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T. (https://www.gnu.org/licenses/gpl-3.0.html)
URL: https://github.com/DrinkWater623
========================================================================
    TODO:
    Notes to self: 
        the objects in the child class are really meant for watching the event for a particular object type
        and being able to turn on and off easily without looking through the scripts
        as long as I am consistent about usage and do not do band-aid adhoc alerts here and there
========================================================================
Change Log:
    20251129
    20260804 - Update for 1.26.10 
========================================================================*/
import { pack, packDisplayName } from './settings.js';
import { Dev } from './common-stable/debug/index.js';
//import { objectEntries_set_booleans, objectEntries_set_booleans_opts, objectEntries_toggle_booleans, objectEntries_toggle_booleans_opts, objectKeysWhereBoolean } from './common-stable/tools/objects.js';
//==============================================================================
// JSDoc Makes the squiggly red lines go away....
//==============================================================================
/**
 * @typedef {Record<string, boolean>} BooleanMap
 * @typedef {Record<string, BooleanMap>} Boolean2DeepMap
 */
//==============================================================================
/*  Hey YOU... update the 2 "const objects" below and keep your grubby hand out of the Class (if you can)
    Start everything or most everything as false and toggle on via command registry while in game play
    It will be overwhelming if everything is on and you've programmed the debug info for it.
*/
/** @type {Boolean2DeepMap} */
const WATCHING_GAME_OBJECTS = {
    block: {},
    entity: {
        wandering_trader: true,
        wandering_trader_doctor: true,
        wandering_trader_banker: true,
    },
    item: {},
    player: {},
    system: {}
};
/** @type {Boolean2DeepMap} */
const WATCHING_EVENTS = {
    entity: {
        afterEntitySpawn: true,
    },
    player: {},
    system: {}
};
/** @type {BooleanMap} */
const WATCHING_FUNCTIONS = {};
//==============================================================================
/*
Master override - if pack setting does not have debugOn, then turn it all off
That way we can have a master switch
*/
class DevWanderingTraderGuild extends Dev {
    /**
   * @constructor
   * @param {string} pack_name 
   */
    constructor(pack_name) {
        super(pack_name, pack.debugOn);

        if (pack.debugOn) {
            //These Overwrite the samples in the Dev Class
            this.configure(
                {
                    functions: WATCHING_FUNCTIONS,
                    gameObjects: WATCHING_GAME_OBJECTS
                },
                { style: "overwrite" });

            //All events are defined in the Dev class, this just updates flags 
            // and you can add new ones as needed if the parent is not updated  
            this.configure(
                { events: WATCHING_EVENTS },
                { style: "apply", addIfNew: true });
        }
    }
}
//==============================================================================
export const dev = new DevWanderingTraderGuild(packDisplayName);
//==============================================================================
export const emitters = {
    // Console / alert channel (persistent in your console log)
    alertLog: dev.alertLog.bind(dev),
    alertWarn: dev.alertWarn.bind(dev),
    alertSuccess: dev.alertSuccess.bind(dev),
    alertError: dev.alertError.bind(dev),

    // Chat channel (ephemeral)
    chatLog: dev.chatLog.bind(dev),
    chatWarn: dev.chatWarn.bind(dev),
    chatSuccess: dev.chatSuccess.bind(dev),
    chatError: dev.chatError.bind(dev),

    // Neutral "emit" aliases (currently mapped to alerts)
    emit: dev.alertLog.bind(dev),
    emitWarn: dev.alertWarn.bind(dev),
    emitSuccess: dev.alertSuccess.bind(dev),
    emitError: dev.alertError.bind(dev),
};

//==============================================================================
// End of File
//==============================================================================
