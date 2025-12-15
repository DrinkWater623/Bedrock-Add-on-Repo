// devLib.js
// @ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20251213 - Created
    20251214 - Added better tracking of on/off states
    20251214b- Chatty help me fix red squiggles from JSDoc
    20251214c- Fixed allOff and anyOn
========================================================================*/
import { ChatMsg, ConsoleAlert } from '../tools/messageLib.js';
import { DebuggerBlocks } from './debuggerBlocks.js';
import { DebuggerEntities } from './debuggerEntities.js';
import { DebuggerItems } from './debuggerItems.js';
import { DebuggerPlayers } from './debuggerPlayers.js';
/**
 * @typedef {Record<string, boolean>} DebugFlagMap
 * @typedef {DebugFlagMap & { debugFunctionsOn: boolean }} DebugFunctionsFlags
 * @typedef {DebugFlagMap & { debugSubscriptionsOn: boolean }} DebugSubscriptionsFlags
 * @typedef {DebugFlagMap & { debugEventsOn: boolean }} DebugEventsFlags
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

        /** @type {DebugEventsFlags} */
        this.debugEvents = { debugEventsOn: false };

        this.focus = focus;
        this.blocks = new DebuggerBlocks(pack_name, on && focus.includes('blocks'));
        this.items = new DebuggerItems(pack_name, on && focus.includes('items'));
        this.players = new DebuggerPlayers(pack_name, on && focus.includes('players'));
        this.entities = new DebuggerEntities(pack_name, on && focus.includes('entities'));

        this.alertLog = new ConsoleAlert(pack_name);
        this.chatLog = new ChatMsg(pack_name);
    }
    allOff () {
        if (this.anyOn()) {
            this.alertFunction(`dev.allOff`);            
            this.blocks.off();
            this.items.off();
            this.players.off();
            this.entities.off();
            this.allThisOff(this)
            return !this.anyOn()
        }
        else return true
    }
    /**
    * 
    * @param {object} objectToTurnOff 
    * @returns 
    */
    allThisOff (objectToTurnOff) {
        if (this.anyOn()) {
            this.alertFunction(`dev.allThisOff`);
            for (const [ k, v ] of Object.entries(this)) {
                if (typeof v === "boolean") {
                    // @ts-expect-error index write on object literal
                    if (v) this[ k ] = /** @type {unknown} */ (false);
                } else if (typeof v === "object") {
                    this.allThisOff(v);
                }
            }
        }
    }
    //Maybe take out, should probably not be used
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
    /**
     * 
     * @param {object} objectToCheck 
     * @returns {boolean}
     */
    anyThisOn (objectToCheck) {
        let any = false;
        for (const v of Object.values(objectToCheck)) {
            if (typeof v === "boolean") {
                any = any || v;
            } 
            else if (typeof v === "object") {
                any=any || this.anyThisOn(v)                
            }
            if (any) break;
        }
        return any;
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
}
export class DevAll extends Dev {
    /**
    * @constructor
    * @param {string} pack_name 
    * @param {boolean} [on=true] - default true
    */
    constructor(pack_name, on = true) {
        super(pack_name, on, [ 'blocks', 'items', 'players', 'entities' ]);
    }
}   