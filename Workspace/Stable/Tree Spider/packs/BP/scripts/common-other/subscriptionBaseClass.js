// subscriptionBaseClass.js -- this is centralized so that beta can use it too
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T.
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20251023 - DW623 - Refactored and add in stable stuff and update to api 2.0 and move debug-only stuff out
    20251102 - DW623 - Refactored and created basic structure of the classes
    20251202 - DW623 - DRY subscribe/unsubscribe via SubscriptionEntry base
========================================================================*/
import { alertLog } from "../settings.js";  //every add-on of mine, has a settings file
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
        /** @type {boolean} */
        this.debugAll = debug || masterDebugOn;

        /**
         * All subscription entries owned by this group.
         * @type {SubscriptionEntry<any, any>[]}
         */
        this._entries = [];
    }

    /**
     * Unsubscribe everything in this subscription group.
     * Useful when the pack fails validation and you want to free resources.
     * @param {boolean} [debug=false]
     */
    unsubscribeAll (debug = false) {
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
 */
class SubscriptionEntry {
    /**
    * 
    * @param {SubscriptionOwner} owner
    * @param {string} keyName
    * @param {{ subscribe(fn: HandlerFn): Handle; unsubscribe(handle: Handle): void }} eventSignal
    * @param {string} [label] Optional label for logging; defaults to "ownerName.keyName"
    */
    constructor(owner, keyName, eventSignal, label) {
        /** @type {string} */
        this._name = `${owner._name}.${keyName}`;
        /** @type {string} */
        this._subscription = label ?? this._name;

        /** @type {SubscriptionOwner} */
        this._owner = owner;

        this.eventSignal = eventSignal;
        this.debugMe = owner.debugAll;

        /** @type {boolean} */
        this.on = false;
        /** @type {Handle | null} */
        this.handler = /** @type {Handle | null} */ (null);

        // 🔗 Register with the owner so unsubscribeAll() can reach us.
        this._owner._entries.push(this);
    }

    /**
     * @param {HandlerFn} fn
     * @param {boolean} [debug=false]
     */
    subscribe (fn, debug = false) {
        const debugMe = debug || this.debugMe;
        alertLog.log(`* ${this._name}.subscribe ()`, debugMe);

        if (this.on) return;
        if (!fn) return;

        this.handler = this.eventSignal.subscribe(fn);
        this.on = true;
        alertLog.success(`§aSubscribed to ${this._subscription}`, debugMe);
    }

    /**
     * @param {boolean} [debug=false]
     */
    unsubscribe (debug = false) {
        const debugMe = debug || this.debugMe;
        alertLog.warn(`* ${this._name}.unsubscribe ()`, debugMe);

        if (!this.on) return;

        if (this.handler) {
            this.eventSignal.unsubscribe(this.handler);
            this.handler = null;
            alertLog.success(`§aUnsubscribed to ${this._subscription}`, debugMe);
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
