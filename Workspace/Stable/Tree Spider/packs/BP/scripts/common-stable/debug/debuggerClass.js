// debuggerClass.js
// @ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20250116 - Add Block from Ray Cast if different from View
    20251203 - Relocated
    20251207 - Relocated and renamed
    20251213 - Convert to console messages only
    20251214 - Better AllOff and AnyOns
========================================================================*/
import { world, system } from '@minecraft/server';
/**
 * @typedef {Record<string, boolean>} DebugFlagMap
 * @typedef {DebugFlagMap & { debugCustomComponentsOn: boolean }} DebugCustomComponentsFlags
 * @typedef {DebugFlagMap & {debugEventsOn: boolean }} DebugEventsFlags
 */
//=============================================================================
// For Debugging
/**
 * Creates a new Debugger object
 * @class
 */
export class Debugger {
    /**
     * @constructor
     * @param {string} pack_name 
     * @param {boolean} [on=true] - default true
     */
    constructor(pack_name, on = false) {
        this.pack_name = pack_name;
        this.debugOn = on;

        //More added by class extenders using Object.assign in the constructor
        /** @type {DebugEventsFlags} */
        this.events = { debugEventsOn: false };

        /** @type {DebugCustomComponentsFlags} */
        this.customComponents = { debugCustomComponentsOn: false };
    }
    //--------------------------------------
    off () { this.debugOn = false; this.alertWarn(`§c${this.constructor.name} OFF"`, true); }
    on () { this.debugOn = true; this.alertSuccess(`"§a${this.constructor.name} On`, true); }
    toggle () { if (this.debugOn) this.off(); else this.on(); }
    isDebug () { return this.debugOn; }
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
                any = any || this.anyThisOn(v);
            }
            if (any) break;
        }
        return any;
    }
    anyOn () {
        this.debugOn = false;
        this.anyEventsOn();
        this.anyCustomComponentsOn();
        this.debugOn = this.anyThisOn(this);
        return this.debugOn;
    }
    anyEventsOn () {
        this.events.debugEventsOn = false;
        const any = this.anyThisOn(this.events);
        this.events.debugEventsOn = any;
        this.debugOn = any || this.debugOn;
        return any;
    }
    anyCustomComponentsOn () {
        this.customComponents.debugCustomComponentsOn = false;
        const any = this.anyThisOn(this.customComponents);
        this.customComponents.customComponentsOn = any;
        this.debugOn = any || this.debugOn;
        return any;
    }
    allOff () {
        if (this.anyOn()) {
            this.allThisOff(this.events);
            this.allThisOff(this.customComponents);
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
        if (this.anyOn()) {
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
    //--------------------------------------
    #msgPrefix () { return `Pack: ${this.pack_name}: Day: ${world.getDay()} @ Tick: ${system.currentTick}: `; }
    /**
     * @param {string} msg 
     */
    alertError (msg, override = false) {
        this.error(`${this.#msgPrefix}: §cError:§r ${msg}`, override);
    };
    /**
     * @param {string} msg
     * @param {boolean} override Override debugOn setting - Display anyway 
     */
    alertLog (msg, override = false) {
        this.log(`${this.#msgPrefix}: §lLog:§r ${msg}`, override);
    };
    /**
     * @param {string} msg
     * @param {boolean} override Override debugOn setting - Display anyway 
     */
    alertSuccess (msg, override = false) {
        this.log(`${this.#msgPrefix}: §aSuccess:§r ${msg}`, override);
    };
    /**
     * @param {string} msg
     * @param {boolean} override Override debugOn setting - Display anyway 
     */
    alertWarn (msg, override = false) {
        this.log(`${this.#msgPrefix}: §6Warning:§r ${msg}`, override);
    };
    /**
     * 
     * @param {string} msg 
     * @param {boolean} override Override debugOn setting - Display anyway
     */
    error (msg, override = false) {
        if (!msg.includes('§')) msg = `§c${msg}§r`;
        if (override || this.debugOn) console.error(msg);
    };
    /**
     * 
     * @param {string} msg 
     * @param {boolean} override Override debugOn setting - Display anyway
     */
    log (msg, override = false) {
        if (override || this.debugOn) console.warn(msg);
    };
    /**
     * 
     * @param {string} msg 
     * @param {boolean} override Override debugOn setting - Display anyway
     */
    success (msg, override = false) {
        if (!msg.includes('§')) msg = `§a${msg}§r`;
        if (override || this.debugOn) console.warn(msg);
    };
    /**
     * 
     * @param {Object} object 
     * @param {string} title 
     * @param {boolean} override
     */
    listObjectInnards (object, title = "Key-Value List:", override = false) {
        if (override || this.debugOn) {
            const entries = Object.entries(object);
            this.log(`${title} (${entries.length})`, override);
            for (const [ key, value ] of entries) {
                this.log(`==> ${key}: ${value}`, override);
                if (typeof value == 'object')
                    this.listObjectInnards(value, key, override);
            }
        }
    };
    /**
     * 
     * @param {*[]} array 
     * @param {string} title
     * @param {boolean} override 
     */
    listArray (array, title = "Array List:", override = false) {
        if (override || this.debugOn) {
            this.log(`${title} (${array.length})`, override);
            for (let i = 0; i < array.length; i++) {
                let msg = i.toString() + ' - ';

                if (typeof array[ i ] === 'object') {
                    this.listObjectInnards(array[ i ], '', override);
                    //TODO: account for array object
                }
                else
                    msg += array[ i ].toString();

                this.log(`==> ${msg}`, override);
            }
        }
    };
}
//==============================================================================
