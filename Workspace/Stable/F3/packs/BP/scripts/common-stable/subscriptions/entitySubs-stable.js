// entitySubs-stable.js
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
                        Isolate Entity subs to own file

TODO: add bulk register - see playerSubs
========================================================================*/
// Minecraft
import { world } from "@minecraft/server";
// Shared
import { SubscriptionEntry, SubscriptionOwner } from "./subscriptionBaseClass.js";
//==============================================================================
// Typedefs for handlers (function type subscribe expects).
//  Entities
/** @typedef {Parameters<typeof world.afterEvents.entityDie.subscribe>[0]} AfterEntityDieHandler */
/** @typedef {Parameters<typeof world.afterEvents.entityLoad.subscribe>[0]} AfterEntityLoadHandler */
/** @typedef {Parameters<typeof world.afterEvents.entityRemove.subscribe>[0]} AfterEntityRemovedHandler */
/** @typedef {Parameters<typeof world.afterEvents.entitySpawn.subscribe>[0]} AfterEntitySpawnHandler */
/** @typedef {Parameters<typeof world.beforeEvents.entityRemove.subscribe>[0]} BeforeEntityRemovedHandler */
//==============================================================================
// Typedefs for stored handles (Bedrock returns the function reference).
//  Entities
/** @typedef {ReturnType<typeof world.afterEvents.entityDie.subscribe>} AfterEntityDieHandle */
/** @typedef {ReturnType<typeof world.afterEvents.entityLoad.subscribe>} AfterEntityLoadHandle */
/** @typedef {ReturnType<typeof world.afterEvents.entityRemove.subscribe>} AfterEntityRemovedHandle */
/** @typedef {ReturnType<typeof world.afterEvents.entitySpawn.subscribe>} AfterEntitySpawnHandle */
/** @typedef {ReturnType<typeof world.beforeEvents.entityRemove.subscribe>} BeforeEntityRemovedHandle */
//==============================================================================
export class EntitySubscriptions extends SubscriptionOwner {
    /**
     * @param {string} packName
     * @param {boolean} [debug=false]
     */
    constructor(packName, debug = false) {
        super("entitySubscriptions", packName, debug);

        /**
         * @type {SubscriptionEntry<AfterEntityDieHandler, AfterEntityDieHandle>}
         */
        this.afterEntityDie = new SubscriptionEntry(
            this,
            "afterEntityDie",
            world.afterEvents.entityDie
        );

        /**
         * @type {SubscriptionEntry<AfterEntityLoadHandler, AfterEntityLoadHandle>}
         */
        this.afterEntityLoad = new SubscriptionEntry(
            this,
            "afterEntityLoad",
            world.afterEvents.entityLoad
        );

        /**
         * @type {SubscriptionEntry<AfterEntityRemovedHandler, AfterEntityRemovedHandle>}
         */
        this.afterEntityRemoved = new SubscriptionEntry(
            this,
            "afterEntityRemoved",
            world.afterEvents.entityRemove
        );

        /**
         * @type {SubscriptionEntry<AfterEntitySpawnHandler, AfterEntitySpawnHandle>}
         */
        this.afterEntitySpawn = new SubscriptionEntry(
            this,
            "afterEntitySpawn",
            world.afterEvents.entitySpawn
        );

        /**
         * @type {SubscriptionEntry<BeforeEntityRemovedHandler, BeforeEntityRemovedHandle>}
         */
        this.beforeEntityRemoved = new SubscriptionEntry(
            this,
            "beforeEntityRemoved",
            world.beforeEvents.entityRemove
        );
    }
    /**
     * Optional bulk registration helper.
     * Only keys you provide are subscribed.
     * 
     * @param {{
     *   afterEntityDie?: AfterEntityDieHandler,
     *   afterEntityLoad?: AfterEntityLoadHandler,
     *   afterEntityRemoved?:AfterEntityRemovedHandler,
     *   afterEntitySpawn?:AfterEntitySpawnHandler,
     *   beforeEntityRemoved?:BeforeEntityRemovedHandler
     * }} handlers
     * @param {boolean} [debug=false]
     */
    register (handlers, debug = false) {
        if (handlers.afterEntityDie) {
            this.afterEntityDie.subscribe(
                handlers.afterEntityDie,
                debug
            );
        }
        if (handlers.afterEntityLoad) {
            this.afterEntityLoad.subscribe(
                handlers.afterEntityLoad,
                debug
            );
        }
        if (handlers.afterEntityRemoved) {
            this.afterEntityRemoved.subscribe(
                handlers.afterEntityRemoved,
                debug
            );
        }
        if (handlers.afterEntitySpawn) {
            this.afterEntitySpawn.subscribe(
                handlers.afterEntitySpawn,
                debug
            );
        }
        if (handlers.beforeEntityRemoved) {
            this.beforeEntityRemoved.subscribe(
                handlers.beforeEntityRemoved,
                debug
            );
        }
    }
}
//==============================================================================
//Example with bulk register
// const playerSubs = new PlayerSubscriptions("§6My pack", true);

// /** @type {BeforePlayerInteractWithBlockHandler} */
// const myInteractFunction = (event) => {
//     // ...
// };

// /** @type {AfterPlayerBreakBlockHandler} */
// const myBreakFunction = (event) => {
//     // ...
// };

// playerSubs.register({
//     beforeInteractWithBlock: myInteractFunction,
//     afterPlayerBreakBlock:  myBreakFunction
// });
//==============================================================================
// End of File
//==============================================================================
