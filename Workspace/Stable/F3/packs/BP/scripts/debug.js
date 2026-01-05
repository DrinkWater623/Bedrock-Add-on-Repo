// debug.js - F3 Bedrock Add-on
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T. (https://www.gnu.org/licenses/gpl-3.0.html)
URL: https://github.com/DrinkWater623
========================================================================
    TODO:
    Note: all of this will be moved to the F3 Info Add-on after I have the arrow showing what I want
    I can test objects there better and program for all events in order to deep dive test order of events
    and given event information, so I can finagle what I want when they do not provide it.
    Can't keep a coder with the best ChatGPT down....

    Notes to self: 
        the objects in the child class are really meant for watching the event for a particular object type
        and being able to turn on and off easily without looking through the scripts
        as long as I am consistent about usage and do not do band-aid adhoc alerts here and there
========================================================================
Last Update: 20251129 
========================================================================*/
import { pack, packDisplayName, watchFor } from './settings.js';
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
    //Can be block, item or entity - be mindful of the naming convention so that everything flows
    block: {
        arrow: true,
        bar: false,
        mini_block: false,
        mini_dot: false,
        mini_puck: false,
        panel_13: false
    },
    item: { //block/item in hand
        arrow: true,
        bar: false,
        mini_block: false,
        mini_dot: false,
        mini_puck: false,
        panel_13: false
    },
    entity: {
        creeper: false,
        wither: false
    }
};
/** @type {Boolean2DeepMap} */
const WATCHING_EVENTS = {
    item: {
        afterItemCompleteUse: true,
        afterItemReleaseUse: true,
        afterItemStartUse: true,
        afterItemStartUseOn: true,
        afterItemStopUse: true,
        afterItemStopUseOn: true,
        beforeItemUse: true,
    },
    block: {
        beforePlayerInteractWithBlock: true,
        onPlace: true,
    },
    entity: {
        afterEntityHitEntity: true
    },
    player: {
        afterPlayerBreakBlock: false,
        afterPlayerPlaceBlock: false,
        beforePlayerInteractWithBlock: true,

        afterPlayerDie: true,
        afterPlayerHealthChanged: true,
        afterPlayerHitEntity: true,
        afterPlayerHurt: true,
        afterPlayerJoin: true,
        afterPlayerLeave: true,
        afterPlayerSpawn: true,
        beforePlayerLeave: true,
    },
    system: {
        afterWorldLoad: true,
        beforeStartup: true,
    }
};
/** @type {BooleanMap} */
const WATCHING_FUNCTIONS = {
    // world/system
    registerCustomCommands: false,
    registerDebugCommands: false,
    registerBetaCommands: false,

    // Subscription General
    subscriptions: false,
    subscriptionsBeta: false,
    subscriptionsStable: false,
    subscriptionsItems: false,
    subscriptionsEntities: false,
    subscriptionsPlayers: false,
    subscriptionsPlayersBeta: false,
    onBeforeStartup: false,
    //for cmds... so not too many when not focused
    alertBlockSubs: false,
    alertEntitySubs: true,
    alertItemSubs: false,
    alertPlayerSubs: true,
    alertSystemSubs: false,
    alertElementAddOn:true,

    // specific sets
    alertBlockRotations: false,
    register_about: false,
    register_toggle_arrow: false,
    register_toggle_bar: false,
    register_toggle_mini_block: false,
    register_toggle_mini_dot: false,
    register_toggle_mini_puck: false,
    register_event_player_info: false,
    register_event_afterItemCompleteUse: false,
    register_event_afterItemReleaseUse: false,
    register_event_afterItemStartUse: false,
    register_event_afterItemStartUseOn: false,
    register_event_afterItemStopUse: false,
    register_event_afterItemStopUseOn: false,
    register_event_beforeItemUse: false,

    //Block stuff
    faceLocationGrid: false,
    verifyLastInteractInfoRelated: false,
    bar_onPlace: false
};
//==============================================================================
/*
Master override - if pack setting does not have debugOn, then turn it all off
That way we can have a master switch
*/
class DevF3 extends Dev {
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

            //need to verify these and error if not exist in game (there is an MC obj for this)
            this.blockWatchList = [ ...watchFor._onPlaceBlockList() ];
            this.entityWatchList = [ ...watchFor.entityWatchList ];
        }
    }
}
//==============================================================================
export const dev = new DevF3(packDisplayName);
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
