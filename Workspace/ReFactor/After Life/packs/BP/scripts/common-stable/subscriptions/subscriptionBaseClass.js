// subscriptionBaseClass.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T.
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20251208 - DW623    - Refactored and add in stable stuff and update to api 2.0 and move debug-only stuff out
    20251102 - DW623    - Refactored and created basic structure of the classes
    20251202 - Chatty   - DRY subscribe/unsubscribe via SubscriptionEntry base
    20251207 - Chatty   - Had Chatty add subscribeWithOptions
    20251215 - DW623    - Fixed missing above option
========================================================================*/
import { ConsoleAlert } from "../tools/messageLib.js"
const masterDebugOn = false;
//==============================================================================
/**
 * Common base for any subscription group (player, system, entity, world, etc.)
 */
class SubscriptionOwner {
    /**
     * @param {string} ownerName
     * @param {string} packName
     * @param {boolean} [debug=false]
     */
    constructor(ownerName, packName, debug = false) {
        /** @type {string} */
        this._name = ownerName;
        /** @type {ConsoleAlert} */
        this.alertLog = new ConsoleAlert(`${packName}§r`);
        /** @type {boolean} */
        this.debugAll = debug || masterDebugOn;

        /**
         * All subscription entries owned by this group.
         * @type {SubscriptionEntry<any, any,any>[]}
         */
        this._entries = [];
    }

    /**
     * Unsubscribe everything in this subscription group.
     * Useful when the pack fails validation and you want to free resources.
     * @param {boolean} [debug=false]
     */
    unsubscribeAll(debug = false) {
        // This is safe even if some are already off; each entry checks its own `on` flag.
        for (const entry of this._entries) {
            entry.unsubscribe(debug);
        }
    }
}
//==============================================================================
// Generic subscription entry (DRY subscribe/unsubscribe logic)
/**
 * @template {Function} HandlerFn
 * @template Handle
 * @template [Options=undefined]
 */
class SubscriptionEntry {
    /**
     * 
     * @param {SubscriptionOwner} owner
     * @param {string} keyName
     * @param {{ subscribe(fn: HandlerFn, options?: Options): Handle; unsubscribe(handle: Handle): void }} eventSignal
     * @param {string} [label] Optional label for logging; defaults to "ownerName.keyName"
     */
    constructor(owner, keyName, eventSignal, label) {
        /** @type {string} */
        this._name = `${owner._name}.${keyName}`;
        /** @type {string} */
        this._subscription = label ?? this._name;

        /** @type {SubscriptionOwner} */
        this._owner = owner;

        /** @type {{ subscribe(fn: HandlerFn, options?: Options): Handle; unsubscribe(handle: Handle): void }} */
        this.eventSignal = eventSignal;

        /** @type {ConsoleAlert} */
        this.alertLog = owner.alertLog;

        /** @type {boolean} */
        this.debugMe = owner.debugAll;

        /** @type {boolean} */
        this.on = false;
        /** @type {Handle | null} */
        this.handler = /** @type {Handle | null} */ (null);

        // 🔗 Register with the owner so unsubscribeAll() can reach us.
        this._owner._entries.push(this);
    }

    /**
     * Internal helper so subscribe + subscribeWithOptions share logic.
     * @param {HandlerFn} fn
     * @param {Options | undefined} options
     * @param {boolean} [alert=false]
     */
    _doSubscribe(fn, options, alert = false) {
        const debugMe = alert || this.debugMe;
        //this.alertLog.log(`* ${this._name}.subscribe ()`, debugMe);

        if (this.on) return;
        if (!fn) return;
                
        if(options)
            this.handler = this.eventSignal.subscribe(fn, options);
        else
            this.handler = this.eventSignal.subscribe(fn);

        this.on = true;
        this.alertLog.success(`§6Subscribed to §a${this._subscription}${options ? '§d with Options':''}`, debugMe);
    }

    /**
     * Subscribe without options (normal case).
     * @param {HandlerFn} fn
     * @param {boolean} [alert=false]
     */
    subscribe(fn, alert = false) {
        this._doSubscribe(fn, /** @type {Options | undefined} */ (undefined), alert);
    }
    /**
     * Subscribe with options for events that support them.
     * @param {HandlerFn} fn
     * @param {Options} options
     * @param {boolean} [alert=false]
     */
    subscribeWithOptions(fn, options, alert = false) {
        this._doSubscribe(fn, options, alert);
    }

    /**
     * @param {boolean} [alert=false]
     */
    unsubscribe(alert = false) {
        const debugMe = alert || this.debugMe;
        this.alertLog.warn(`* ${this._name}.unsubscribe ()`, debugMe);

        if (!this.on) return;

        if (this.handler) {
            this.eventSignal.unsubscribe(this.handler);
            this.handler = null;
            this.alertLog.success(`§aUnsubscribed to ${this._subscription}`, debugMe);
        }
        this.on = false;
    }
}


//==============================================================================
// Exports (if you want to use them from other files)
//==============================================================================
export {
    SubscriptionOwner,
    SubscriptionEntry
};
//==============================================================================
// End of File
//==============================================================================
