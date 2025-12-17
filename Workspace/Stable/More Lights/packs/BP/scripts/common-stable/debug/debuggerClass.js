// debuggerClass.js  Parent Class
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
    20251216 - Chatty refactoring help
========================================================================*/
import { world, system } from '@minecraft/server';
import { objectEntries_any_booleans_opts, objectEntries_set_booleans_opts } from "../tools/objects.js";
import { listArray, listObjectInnards } from '../tools/objects.js';
//=============================================================================
/**
 * @typedef {{ before: boolean, after: boolean }} BeforeAfter
 * @typedef {Record<string, boolean>} DebugFlagMap
 * @typedef {DebugFlagMap & { debugCustomComponentsOn: boolean }} DebugCustomComponentsFlags
 * @typedef {Record<string, boolean | BeforeAfter>}  DebugEventsFlags
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
    off () { this.debugOn = false; this.alertWarn(`§c${this.constructor.name} OFF§r`, true); }
    on () { this.debugOn = true; this.alertSuccess(`§a${this.constructor.name} ON§r`, true); }
    toggle () { if (this.debugOn) this.off(); else this.on(); }
    isDebug () { return this.debugOn; }
    /**
     * 
     * @param {Record<string, unknown>} objectToCheck 
     * @returns {boolean}
     */
    anyThisOn (objectToCheck, dive = true) {
        return objectEntries_any_booleans_opts(objectToCheck, { dive: dive, value: true });
    }

    anyOn () {
        this.debugOn = false;
        this.anyEventsOn();
        this.anyCustomComponentsOn();
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
        this.customComponents.debugCustomComponentsOn = any;
        this.debugOn = any || this.debugOn;
        return any;
    }
    allOff () {
        objectEntries_set_booleans_opts(this.events, false, { dive: true });
        objectEntries_set_booleans_opts(this.customComponents, false, { dive: true });
        this.debugOn = false;
        this.anyOn();
        return !this.debugOn;
    }
    /**
    * 
    * @param {Record<string, unknown>} objectToTurnOff
    * @param {boolean} [dive=true] 
    * @returns 
    */
    allThisOff (objectToTurnOff, dive = true) {
        objectEntries_set_booleans_opts(objectToTurnOff, false, { dive: dive });
        this.anyOn();
    }
    //--------------------------------------
    #msgPrefix () { return `Pack: ${this.pack_name}: Day: ${world.getDay()} @ Tick: ${system.currentTick}`; }
    /**
     * @param {string} msg 
     */
    alertError (msg, override = false) {
        this.error(`${this.#msgPrefix()}: §cError:§r ${msg}`, override);
    }
    /**
     * @param {string} msg
     * @param {boolean} override Override debugOn setting - Display anyway 
     */
    alertLog (msg, override = false) {
        this.log(`${this.#msgPrefix()}: §lLog:§r ${msg}`, override);
    }
    /**
     * @param {string} msg
     * @param {boolean} override Override debugOn setting - Display anyway 
     */
    alertSuccess (msg, override = false) {
        this.log(`${this.#msgPrefix()}: §aSuccess:§r ${msg}`, override);
    }
    /**
     * @param {string} msg
     * @param {boolean} override Override debugOn setting - Display anyway 
     */
    alertWarn (msg, override = false) {
        this.log(`${this.#msgPrefix()}: §6Warning:§r ${msg}`, override);
    }
    /**
     * 
     * @param {string} msg 
     * @param {boolean} override Override debugOn setting - Display anyway
     */
    error (msg, override = false) {
        if (!msg.includes('§')) msg = `§c${msg}§r`;
        if (override || this.debugOn) console.error(msg);
    }
    /**
     * 
     * @param {string} msg 
     * @param {boolean} override Override debugOn setting - Display anyway
     */
    log (msg, override = false) {
        if (override || this.debugOn) console.warn(msg);
    }
    /**
     * 
     * @param {string} msg 
     * @param {boolean} override Override debugOn setting - Display anyway
     */
    success (msg, override = false) {
        if (!msg.includes('§')) msg = `§a${msg}§r`;
        if (override || this.debugOn) console.warn(msg);
    }
    /**
     * 
     * @param {unknown} object 
     * @param {string} title 
     * @param {boolean} override
     */
    listObjectInnards (object, title = "Key-Value List:", override = false) {
        if (!(override || this.debugOn)) return;
        for (const line of listObjectInnards(object, { title })) this.log(line, override);
    }
    /**
     * 
     * @param {*[]} array 
     * @param {string} title
     * @param {boolean} override 
     */
    listArray (array, title = "Array List:", override = false) {
        if (!(override || this.debugOn)) return;
        for (const line of listArray(array, { title })) this.log(line, override);
    }
}
//==============================================================================
