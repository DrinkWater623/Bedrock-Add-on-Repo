// devLib.js
// @ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
 Notes to self: 
    I may get rid of Subscriptions object because the below objects in the parent class 
    have ALL of the subscriptions as entries (OCD one night) and the user (me) can use them the same way
    this.blocks = new DebuggerBlocks(pack_name, on && focus.includes('blocks'));
    this.items = new DebuggerItems(pack_name, on && focus.includes('items'));
    this.players = new DebuggerPlayers(pack_name, on && focus.includes('players'));
    this.entities = new DebuggerEntities(pack_name, on && focus.includes('entities'));

    the objects in the child class are really meant for watching the event for a particular object type
    and being able to turn on and off easily without looking through the scripts
    as long as I am consistent about usage and do not do band-aid adhoc alerts here and there
========================================================================
Change Log: 
    20251213 - Created
    20251214 - Added better tracking of on/off states
    20251214b- Chatty helped me fix red squiggles from JSDoc
    20251214c- Fixed allOff and anyOn
    20251216 - Chatty helped me with toggle_events
    20251216 - Added buildWatchingObjectEvents
    20251217 - Added isDebugEventObject
========================================================================*/
import { ChatMsg, ConsoleAlert } from '../tools/messageLib.js';
import { objectEntries_any_booleans_opts, objectEntries_set_booleans_opts, objectKeysWhereBooleanOpts, booleanKeyExist, readBooleanKey } from "../tools/objects.js";
import { DebuggerBlocks } from './debuggerBlocks.js';
import { DebuggerEntities } from './debuggerEntities.js';
import { DebuggerItems } from './debuggerItems.js';
import { DebuggerPlayers } from './debuggerPlayers.js';
/**
 * @typedef {Record<string, boolean>} DebugFlagMap
 * @typedef {DebugFlagMap & { debugFunctionsOn: boolean }} DebugFunctionsFlags
 * @typedef {DebugFlagMap & { debugSubscriptionsOn: boolean }} DebugSubscriptionsFlags
 * @typedef {DebugFlagMap & { debugEventsOn: boolean }} DebugEventsFlags
 * @typedef {DebugFlagMap} DebugEventsWatchingFlags
 */
//=============================================================================
// For Debugging
//==============================================================================
/**
 * Creates a new Debugger object
 * @class
 */
export class Dev {
    /**
    * @constructor
    * @param {string} pack_name 
    * @param {boolean} [on=true] - default true
    * @param {string[]} [focus=[]] - default []
    */
    constructor(pack_name, on = false, focus = []) {
        //basic
        this.pack_name = pack_name;
        this.debugOn = on;

        //User Defined when creating Expanded Dev class
        //so can turn on/off groups of debug info
        /** @type {DebugFunctionsFlags} */
        this.debugFunctions = { debugFunctionsOn: false };

        /** @type {DebugSubscriptionsFlags} */
        this.debugSubscriptions = { debugSubscriptionsOn: false };

        /** @type {Record<string, boolean>} */
        this.debugObjectTypes = {};

        /** @type {DebugEventsWatchingFlags} */
        this.debugEventTypes = {};

        /** @type {DebugEventsFlags} */
        this.debugEvents = { debugEventsOn: false };

        this.focus = focus;
        this.blocks = new DebuggerBlocks(pack_name, on && focus.includes('blocks'));
        this.items = new DebuggerItems(pack_name, on && focus.includes('items'));
        this.players = new DebuggerPlayers(pack_name, on && focus.includes('players'));
        this.entities = new DebuggerEntities(pack_name, on && focus.includes('entities'));
        //this.blocks.events.

        this.alertLog = new ConsoleAlert(pack_name);
        this.chatLog = new ChatMsg(pack_name);
    }
    allOff () {
        if (this.anyOn()) {
            this.alertFunction(`dev.allOff`);
            this.blocks.allOff();
            this.items.allOff();
            this.players.allOff();
            this.entities.allOff();
            this.allThisOff(this);
            return !this.anyOn();
        }
        else return true;
    }
    /**
    * 
    * @param {object} objectToTurnOff 
    * @returns 
    */
    allThisOff (objectToTurnOff) {
        objectEntries_set_booleans_opts(
            /** @type {Record<string, unknown>} */(objectToTurnOff),
            false,
            { dive: true }
        );
    }
    //Maybe take out, should probably not be used EVER -- too much, too many
    allOn () {
        console.warn(`${this.pack_name}: §a* function dev.allOn ()`);
        let noChange = this.debugOn;
        for (const [ k, v ] of Object.entries(this)) {
            if (typeof v === "boolean") {
                noChange = noChange && v;
                // @ts-expect-error index write on object literal
                this[ k ] = /** @type {unknown} */ (true);
            }
        }
        this.debugOn = true;
        if (this.focus.includes('blocks')) this.blocks.on();
        if (this.focus.includes('items')) this.items.on();
        if (this.focus.includes('players')) this.players.on();
        if (this.focus.includes('entities')) this.entities.on();
    }
    anyOn () {
        this.debugOn = false;

        //Leave as this instead of call to anyThisOn, no recursion should be needed
        //If ever, then can change it, but try not to assign deep level boolean in base
        let any = false;
        for (const [ , v ] of Object.entries(this)) {
            if (typeof v === "boolean") {
                any = any || v;
                if (any) break;
            }
        }
        //needs to  do so that internal master flag is set
        any = this.anyFunctionsOn() || any;
        any = this.anySubscriptionsOn() || any;
        any = this.anyEventsOn() || any;

        //user can set any of these flags to use in project - but no master flags
        if (!any)
            any = this.blocks.anyOn() ||
                this.items.anyOn() ||
                this.players.anyOn() ||
                this.entities.anyOn();

        this.debugOn = any;
        return any;
    }
    /**common-stable/debug/devLib.js
     * 
     * @param {object} objectToCheck 
     * @returns {boolean}
     */
    anyThisOn (objectToCheck) {
        return objectEntries_any_booleans_opts(
                /** @type {Record<string, unknown>} */(objectToCheck),
            { dive: true }
        );
    }
    anyEventsOn () {
        this.debugEvents.debugEventsOn = false;
        const any = this.anyThisOn(this.debugEvents);
        this.debugEvents.debugEventsOn = any;
        this.debugOn = any || this.debugOn;
        return any;
    }
    anyFunctionsOn () {
        this.debugFunctions.debugFunctionsOn = false;
        const any = this.anyThisOn(this.debugFunctions);
        this.debugFunctions.debugFunctionsOn = any;
        this.debugOn = any || this.debugOn;
        return any;
    }
    anySubscriptionsOn () {
        this.debugSubscriptions.debugSubscriptionsOn = false;
        const any = this.anyThisOn(this.debugSubscriptions);
        this.debugSubscriptions.debugSubscriptionsOn = any;
        this.debugOn = any || this.debugOn;
        return any;
    }
    /**
    * Logs the start of a function if debugFunctionsOn is true.
    * @param {string} funcName - The name of the function.
    * @param {boolean} [start=true] 
    */
    alertFunction (funcName, start = true) {
        this.alertLog.log(`§6${start ? '**' : 'xx'} function ${funcName}()`, this.debugFunctions.debugFunctionsOn);
    }
    /**
     * Alerts when a subscription is successfully made.
     * @param {string} subName - The name of the subscription.
     */
    alertSubscriptionSuccess (subName) {
        this.alertLog.success(`Subscribed to ${subName}`, this.debugSubscriptions.debugSubscriptionsOn);
    }
    /**
     * 
     * @param {string} eventType 
     * @param {string} objectType 
     * @returns {boolean}
     */
    isDebugEventObject (eventType, objectType) {

        const et = readBooleanKey(this.debugEventTypes, eventType);
        if (et === undefined) return false;

        const ot = readBooleanKey(this.debugObjectTypes, objectType);
        if (ot === undefined) return false;       

        return et && ot
    }
    global_update () {
        const derived = this.buildWatchingObjectEvents(this.debugEventTypes, this.debugObjectTypes);

        const eventNames = objectKeysWhereBooleanOpts(this.debugEvents);

        // Optional: strict mode — detect removed keys / drift
        for (const k of eventNames) {
            if (k === "debugEventsOn") continue;
            if (!(k in derived)) {
                throw new Error(`Dev/global_update: derived key missing: ${k}`);
            }
        }

        Object.assign(this.debugEvents, derived);
        this.anyOn();
    }
    /**
    *
    * @param {Record<string,unknown>} map 
    * @param {"eventType" | "objectType"} matchBy
    * @param {string} key
    * @param {boolean} alert 
    * @returns {void}
    */
    keySuggestion (map, matchBy, key, alert) {
        const suggestions = objectKeysWhereBooleanOpts(map, { filterStartsWith: key });
        this.alertLog.log(`§cUnknown ${matchBy}: ${key}§r` +
            (suggestions.length ? ` §7Did you mean: ${suggestions.join(", ")}§r` : ""),
            alert
        );
    }
    /**
     * Toggle either an event watcher (affects `${event}_*`)
     * or an object type (affects `*_${objectType}`),
     * while keeping naming convention `${event}_${objectType}`.
     *
     * @param {"eventType" | "objectType"} matchBy
     * @param {string} key
     * @param {boolean} toggle
     * @param {boolean} [alert=false]
     * @returns {void}
     */
    set_EventWatch (matchBy, key, toggle, alert = false) {
        if (typeof toggle !== "boolean") return;
        const map = matchBy === "eventType" ? this.debugEventTypes : this.debugObjectTypes;

        if (readBooleanKey(map, key) === undefined) {
            this.keySuggestion(map, matchBy, key, alert);
            return;
        }

        map[ key ] = toggle;
        this.global_update();

        this.alertLog.log(
            `§6${matchBy} ${key} is now ${toggle ? "§aOn" : "§cOff"}§r`,
            alert
        );
    }
    /**
     * @param {"eventType" | "objectType"} matchBy
     * @param {string} key
     * @param {boolean} [alert=false]
     * @returns {void}
     */
    toggle_EventWatch (matchBy, key, alert = false) {
        const map = matchBy === "eventType" ? this.debugEventTypes : this.debugObjectTypes;

        const cur = readBooleanKey(map, key);
        if (cur === undefined) {
            this.keySuggestion(map, matchBy, key, alert);
            return;
        }

        this.set_EventWatch(matchBy, key, !cur, alert);
    }
    /**
     * @param {string} toggleKey
     * @param {boolean} [toggle]
     * @param {boolean} [alert=false]
     * @returns {void}
     */
    objectType_set (toggleKey, toggle = this.debugObjectTypes?.[ toggleKey ], alert = false) {
        this.set_EventWatch("objectType", toggleKey, toggle, alert);
    }
    /**
     * Toggle a debugObjectTypes entry and sync derived `${event}_${objectType}` flags.
     *
     * @param {string} toggleKey
     * @param {boolean} [alert=false]
     * @returns {void}
     */
    objectType_toggle (toggleKey, alert = false) {
        this.toggle_EventWatch("objectType", toggleKey, alert);
    }
    /**
     * @param {string} toggleKey
     * @param {boolean} [toggle]
     * @param {boolean} [alert=false]
     * @returns {void}
     */
    eventType_set (toggleKey, toggle = this.debugEventTypes?.[ toggleKey ], alert = false) {
        this.set_EventWatch("eventType", toggleKey, toggle, alert);
    }
    /**
     * Toggle a debugObjectTypes entry and sync derived `${event}_${suffix}` flags.
     *
     * @param {string} toggleKey
     * @param {boolean} [alert=false]
     * @returns {void}
     */
    eventType_toggle (toggleKey, alert = false) {
        this.toggle_EventWatch("eventType", toggleKey, alert);
    }

    //==============================================================================
    /**
     * Builds `${event}_${suffix}` flags from the AND of the two source maps.
     *
     * @param {Record<string, boolean>} watchingEvents
     * @param {Record<string, boolean>} watchingObjectTypes
     * @returns {Record<string, boolean>}
     */
    buildWatchingObjectEvents (watchingEvents, watchingObjectTypes) {
        /** @type {Record<string, boolean>} */
        const out = {};

        const eventNames = objectKeysWhereBooleanOpts(watchingEvents);
        const typeNames = objectKeysWhereBooleanOpts(watchingObjectTypes);

        for (const eventName of eventNames) {
            for (const suffix of typeNames) {
                out[ `${eventName}_${suffix}` ] =
                    watchingEvents[ eventName ] && watchingObjectTypes[ suffix ];
            }
        }

        return out;
    }
};
export class DevBlocks extends Dev {
    /**
    * @constructor
    * @param {string} pack_name 
    * @param {boolean} [on=true] - default true
    */
    constructor(pack_name, on = true) {
        super(pack_name, on, [ 'blocks' ]);
    }
}
export class DevBlocksAndItems extends Dev {
    /**
    * @constructor
    * @param {string} pack_name 
    * @param {boolean} [on=true] - default true
    */
    constructor(pack_name, on = true) {
        super(pack_name, on, [ 'blocks', 'items' ]);
    }
}
export class DevItems extends Dev {
    /**
    * @constructor
    * @param {string} pack_name 
    * @param {boolean} [on=true] - default true
    */
    constructor(pack_name, on = true) {
        super(pack_name, on, [ 'items' ]);
    }
}
export class DevPlayers extends Dev {
    /**
    * @constructor
    * @param {string} pack_name 
    * @param {boolean} [on=true] - default true
    */
    constructor(pack_name, on = true) {
        super(pack_name, on, [ 'players' ]);
    }
}
export class DevEntities extends Dev {
    /**
    * @constructor
    * @param {string} pack_name 
    * @param {boolean} [on=true] - default true
    */
    constructor(pack_name, on = true) {
        super(pack_name, on, [ 'entities' ]);
    }
} export class DevAll extends Dev {
    /**
    * @constructor
    * @param {string} pack_name 
    * @param {boolean} [on=true] - default true
    */
    constructor(pack_name, on = true) {
        super(pack_name, on, [ 'blocks', 'items', 'players', 'entities' ]);
    }
}   