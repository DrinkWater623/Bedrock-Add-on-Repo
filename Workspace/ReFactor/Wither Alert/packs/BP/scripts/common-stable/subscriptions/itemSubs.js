// itemSubs.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20251214 - DW623 - Created
    20251216 - DW623 - Added Event Options and renamed
========================================================================*/
// Minecraft
import { world } from "@minecraft/server";
// Shared
import { SubscriptionEntry, SubscriptionOwner } from "./subscriptionBaseClass.js";
//==============================================================================
// Typedefs for handlers (function type subscribe expects).
//  Player Actions
/** @typedef {Parameters<typeof world.afterEvents.itemCompleteUse.subscribe>[0]} AfterItemCompleteUseHandler */
/** @typedef {Parameters<typeof world.afterEvents.itemReleaseUse.subscribe>[0]} AfterItemReleaseUseHandler */
/** @typedef {Parameters<typeof world.afterEvents.itemStartUse.subscribe>[0]} AfterItemStartUseHandler */
/** @typedef {Parameters<typeof world.afterEvents.itemStartUseOn.subscribe>[0]} AfterItemStartUseOnHandler */
/** @typedef {Parameters<typeof world.afterEvents.itemStopUse.subscribe>[0]} AfterItemStopUseHandler */
/** @typedef {Parameters<typeof world.afterEvents.itemStopUseOn.subscribe>[0]} AfterItemStopUseOnHandler */
/** @typedef {Parameters<typeof world.afterEvents.itemUse.subscribe>[0]} AfterItemUseHandler */
/** @typedef {Parameters<typeof world.beforeEvents.itemUse.subscribe>[0]} BeforeItemUseHandler */

//==============================================================================
// Typedefs for stored handles (Bedrock returns the function reference).
/** @typedef {ReturnType<typeof world.afterEvents.itemCompleteUse.subscribe>} AfterItemCompleteUseHandle */
/** @typedef {ReturnType<typeof world.afterEvents.itemReleaseUse.subscribe>} AfterItemReleaseUseHandle */
/** @typedef {ReturnType<typeof world.afterEvents.itemStartUse.subscribe>} AfterItemStartUseHandle */
/** @typedef {ReturnType<typeof world.afterEvents.itemStartUseOn.subscribe>} AfterItemStartUseOnHandle */
/** @typedef {ReturnType<typeof world.afterEvents.itemStopUse.subscribe>} AfterItemStopUseHandle */
/** @typedef {ReturnType<typeof world.afterEvents.itemStopUseOn.subscribe>} AfterItemStopUseOnHandle */
/** @typedef {ReturnType<typeof world.afterEvents.itemUse.subscribe>} AfterItemUseHandle */
/** @typedef {ReturnType<typeof world.beforeEvents.itemUse.subscribe>} BeforeItemUseHandle */
//==============================================================================
// Player subscriptions
export class ItemSubscriptions extends SubscriptionOwner {
    /**
     * @param {string} packName
     * @param {boolean} [debug=false]
     */
    constructor(packName, debug = false) {
        super("ItemSubscriptions", packName, debug);

        /** @type {SubscriptionEntry<AfterItemCompleteUseHandler, AfterItemCompleteUseHandle>} */
        this.afterItemCompleteUse = new SubscriptionEntry(
            this,
            "afterItemCompleteUse",
            world.afterEvents.itemCompleteUse
        );

        /** @type {SubscriptionEntry<AfterItemReleaseUseHandler, AfterItemReleaseUseHandle>} */
        this.afterItemReleaseUse = new SubscriptionEntry(
            this,
            "afterItemReleaseUse",
            world.afterEvents.itemReleaseUse
        );

        /** @type {SubscriptionEntry<AfterItemStartUseHandler, AfterItemStartUseHandle>} */
        this.afterItemStartUse = new SubscriptionEntry(
            this,
            "afterItemStartUse",
            world.afterEvents.itemStartUse
        );

        /** @type {SubscriptionEntry<AfterItemStartUseOnHandler, AfterItemStartUseOnHandle>} */
        this.afterItemStartUseOn = new SubscriptionEntry(
            this,
            "afterItemStartUseOn",
            world.afterEvents.itemStartUseOn
        );

        /** @type {SubscriptionEntry<AfterItemStartUseHandler, AfterItemStartUseHandle>} */
        this.afterItemStopUse = new SubscriptionEntry(
            this,
            "afterItemStopUse",
            world.afterEvents.itemStopUse
        );

        /** @type {SubscriptionEntry<AfterItemStopUseOnHandler, AfterItemStopUseOnHandle>} */
        this.afterItemStopUseOn = new SubscriptionEntry(
            this,
            "afterItemStopUseOn",
            world.afterEvents.itemStopUseOn
        );
        /** @type {SubscriptionEntry<AfterItemUseHandler, AfterItemUseHandle>} */
        this.afterItemUse = new SubscriptionEntry(
            this,
            "afterItemUse",
            world.afterEvents.itemUse
        );

        /** @type {SubscriptionEntry<BeforeItemUseHandler, BeforeItemUseHandle>} */
        this.beforeItemUse = new SubscriptionEntry(
            this,
            "beforeItemUse",
            world.beforeEvents.itemUse
        );

    }

    /**
     * Optional bulk registration helper.
     * Only keys you provide are subscribed.
     * 
     * @param {{
     *   afterItemCompleteUse?: AfterItemCompleteUseHandler,
     *   afterItemReleaseUse?: AfterItemReleaseUseHandler,
     *   afterItemStartUse?: AfterItemStartUseHandler,
     *   afterItemStartUseOn?: AfterItemStartUseOnHandler
     *   afterItemStopUse?: AfterItemStopUseHandler,
     *   afterItemStopUseOn?: AfterItemStopUseOnHandler
     *   afterItemUse?: AfterItemUseHandler,
     *   beforeItemUse?: BeforeItemUseHandler
     * }} handlers
     * @param {boolean} [debug=false]
     */
    register (handlers, debug = false) {
        if (handlers.afterItemCompleteUse) {
            this.afterItemCompleteUse.subscribe(
                handlers.afterItemCompleteUse,
                debug
            );
        }
        if (handlers.afterItemReleaseUse) {
            this.afterItemReleaseUse.subscribe(
                handlers.afterItemReleaseUse,
                debug
            );
        }
        if (handlers.afterItemStartUse) {
            this.afterItemStartUse.subscribe(
                handlers.afterItemStartUse,
                debug
            );
        }
        if (handlers.afterItemStartUseOn) {
            this.afterItemStartUseOn.subscribe(
                handlers.afterItemStartUseOn,
                debug
            );
        }
        if (handlers.afterItemStopUse) {
            this.afterItemStopUse.subscribe(
                handlers.afterItemStopUse,
                debug
            );
        }
        if (handlers.afterItemStopUseOn) {
            this.afterItemStopUseOn.subscribe(
                handlers.afterItemStopUseOn,
                debug
            );
        }
        if (handlers.afterItemUse) {
            this.beforeItemUse.subscribe(
                handlers.afterItemUse,
                debug
            );
        }
        if (handlers.beforeItemUse) {
            this.beforeItemUse.subscribe(
                handlers.beforeItemUse,
                debug
            );
        }
    }
}
//==============================================================================
function not_used_Item_SUbs () {
    world.afterEvents.itemCompleteUse.subscribe((ev) => { });
    world.afterEvents.itemReleaseUse.subscribe((ev) => { });
    world.afterEvents.itemStartUse.subscribe((ev) => { });
    world.afterEvents.itemStartUseOn.subscribe((ev) => { });
    world.afterEvents.itemStopUse.subscribe((ev) => { });
    world.afterEvents.itemStopUseOn.subscribe((ev) => { });
    world.afterEvents.itemUse.subscribe((ev) => { });
    world.beforeEvents.itemUse.subscribe((ev) => { });
}
//==============================================================================
// End of File
//==============================================================================
