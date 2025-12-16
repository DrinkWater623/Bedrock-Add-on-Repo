// entitySubs.js
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
    20251216 - DW623 - Added the rests and Event Options and renamed
========================================================================*/
// Minecraft
import { world } from "@minecraft/server";
// Shared
import { SubscriptionEntry, SubscriptionOwner } from "./subscriptionBaseClass.js";
//==============================================================================
/** @typedef {import("@minecraft/server").EntityEventOptions} EntityEventOptions */
//==============================================================================
// Typedefs for handlers (function type subscribe expects).
//  Entities
/** @typedef {Parameters<typeof world.afterEvents.entityDie.subscribe>[0]} AfterEntityDieHandler */
/** @typedef {Parameters<typeof world.afterEvents.entityHealthChanged.subscribe>[0]} AfterEntityHealthChangedHandler */
/** @typedef {Parameters<typeof world.afterEvents.entityHitBlock.subscribe>[0]} AfterEntityHitBlockHandler */
/** @typedef {Parameters<typeof world.afterEvents.entityHitEntity.subscribe>[0]} AfterEntityHitEntityHandler */
/** @typedef {Parameters<typeof world.afterEvents.entityHurt.subscribe>[0]} AfterEntityHurtHandler */
/** @typedef {Parameters<typeof world.afterEvents.entityLoad.subscribe>[0]} AfterEntityLoadHandler */
/** @typedef {Parameters<typeof world.afterEvents.entityRemove.subscribe>[0]} AfterEntityRemovedHandler */
/** @typedef {Parameters<typeof world.afterEvents.entitySpawn.subscribe>[0]} AfterEntitySpawnHandler */
/** @typedef {Parameters<typeof world.beforeEvents.entityRemove.subscribe>[0]} BeforeEntityRemovedHandler */

/** @typedef {Parameters<typeof world.afterEvents.playerInteractWithEntity.subscribe>[0]} AfterPlayerInteractWithEntityHandler */
/** @typedef {Parameters<typeof world.beforeEvents.playerInteractWithEntity.subscribe>[0]} BeforePlayerInteractWithEntityHandler */


//==============================================================================
// Typedefs for stored handles (Bedrock returns the function reference).
//  Entities
/** @typedef {ReturnType<typeof world.afterEvents.entityDie.subscribe>} AfterEntityDieHandle */
/** @typedef {ReturnType<typeof world.afterEvents.entityHealthChanged.subscribe>} AfterEntityHealthChangedHandle */
/** @typedef {ReturnType<typeof world.afterEvents.entityHitBlock.subscribe>} AfterEntityHitBlockHandle */
/** @typedef {ReturnType<typeof world.afterEvents.entityHitEntity.subscribe>} AfterEntityHitEntityHandle */
/** @typedef {ReturnType<typeof world.afterEvents.entityHurt.subscribe>} AfterEntityHurtHandle */
/** @typedef {ReturnType<typeof world.afterEvents.entityLoad.subscribe>} AfterEntityLoadHandle */
/** @typedef {ReturnType<typeof world.afterEvents.entityRemove.subscribe>} AfterEntityRemovedHandle */
/** @typedef {ReturnType<typeof world.afterEvents.entitySpawn.subscribe>} AfterEntitySpawnHandle */
/** @typedef {ReturnType<typeof world.beforeEvents.entityRemove.subscribe>} BeforeEntityRemovedHandle */

/** @typedef {ReturnType<typeof world.afterEvents.playerInteractWithEntity.subscribe>} AfterPlayerInteractWithEntityHandle */
/** @typedef {ReturnType<typeof world.beforeEvents.playerInteractWithEntity.subscribe>} BeforePlayerInteractWithEntityHandle */
//==============================================================================
export class EntitySubscriptions extends SubscriptionOwner {
    /**
     * @param {string} packName
     * @param {boolean} [debug=false]
     */
    constructor(packName, debug = false) {
        super("entitySubscriptions", packName, debug);

        /**
         * @type {SubscriptionEntry<AfterEntityDieHandler, AfterEntityDieHandle,EntityEventOptions>}
         */
        this.afterEntityDie = new SubscriptionEntry(
            this,
            "afterEntityDie",
            world.afterEvents.entityDie
        );
        /** @type {SubscriptionEntry<AfterEntityHealthChangedHandler, AfterEntityHealthChangedHandle,EntityEventOptions>} */
        this.afterEntityHealthChanged = new SubscriptionEntry(
            this,
            "afterEntityHealthChanged",
            world.afterEvents.entityHealthChanged
        );
        /** @type {SubscriptionEntry<AfterEntityHitBlockHandler, AfterEntityHitBlockHandle,EntityEventOptions>} */
        this.afterEntityHitBlock = new SubscriptionEntry(
            this,
            "afterEntityHitBlock",
            world.afterEvents.entityHitBlock
        );
        /** @type {SubscriptionEntry<AfterEntityHitEntityHandler, AfterEntityHitEntityHandle,EntityEventOptions>} */
        this.afterEntityHitEntity = new SubscriptionEntry(
            this,
            "afterEntityHitEntity",
            world.afterEvents.entityHitEntity
        );
        /**
         * @type {SubscriptionEntry<AfterEntityHurtHandler, AfterEntityHurtHandle,EntityEventOptions>}
         */
        this.afterEntityHurt = new SubscriptionEntry(
            this,
            "afterEntityHurt",
            world.afterEvents.entityHurt
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
         * @type {SubscriptionEntry<AfterEntityRemovedHandler, AfterEntityRemovedHandle,EntityEventOptions>}
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
        /** @type {SubscriptionEntry<AfterPlayerInteractWithEntityHandler, AfterPlayerInteractWithEntityHandle>} */
        this.afterPlayerInteractWithEntity = new SubscriptionEntry(
            this,
            "afterPlayerInteractWithEntity",
            world.afterEvents.playerInteractWithEntity
        );
        /** @type {SubscriptionEntry<BeforePlayerInteractWithEntityHandler, BeforePlayerInteractWithEntityHandle>} */
        this.beforePlayerInteractWithEntity = new SubscriptionEntry(
            this,
            "beforePlayerInteractWithEntity",
            world.beforeEvents.playerInteractWithEntity
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
     *   afterEntityDie?:           AfterEntityDieHandler,
     *   afterEntityHealthChanged?: AfterEntityHealthChangedHandler     , 
     *   afterEntityHitBlock?:      AfterEntityHitBlockHandler     , 
     *   afterEntityHitEntity?:     AfterEntityHitEntityHandler     , 
     *   afterEntityHurt?:          AfterEntityHurtHandler,
     *   afterEntityLoad?:          AfterEntityLoadHandler,
     *   afterEntityRemoved?:       AfterEntityRemovedHandler,
     *   afterEntitySpawn?:         AfterEntitySpawnHandler,
     *   afterPlayerInteractWithEntity?: AfterPlayerInteractWithEntityHandler,
     *   beforePlayerInteractWithEntity?: BeforePlayerInteractWithEntityHandler,
     *   beforeEntityRemoved?:      BeforeEntityRemovedHandler
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
        if (handlers.afterEntityHealthChanged) {
            this.afterEntityHealthChanged.subscribe(
                handlers.afterEntityHealthChanged,
                debug
            );
        }
        if (handlers.afterEntityHitBlock) {
            this.afterEntityHitBlock.subscribe(
                handlers.afterEntityHitBlock,
                debug
            );
        }
        if (handlers.afterEntityHitEntity) {
            this.afterEntityHitEntity.subscribe(
                handlers.afterEntityHitEntity,
                debug
            );
        }
        if (handlers.afterEntityHurt) {
            this.afterEntityHurt.subscribe(
                handlers.afterEntityHurt,
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
        if (handlers.afterPlayerInteractWithEntity) {
            this.afterPlayerInteractWithEntity.subscribe(
                handlers.afterPlayerInteractWithEntity,
                debug
            );
        }
        if (handlers.beforePlayerInteractWithEntity) {
            this.beforePlayerInteractWithEntity.subscribe(
                handlers.beforePlayerInteractWithEntity,
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
function not_used_Entity_Subs () {
    world.afterEvents.entityDie.subscribe((ev) => { });
    world.afterEvents.entityHealthChanged.subscribe((ev) => { });
    world.afterEvents.entityHitBlock.subscribe((ev) => { });
    world.afterEvents.entityHitEntity.subscribe((ev) => { });
    world.afterEvents.entityHurt.subscribe((ev) => { });
    world.afterEvents.entityLoad.subscribe((ev) => { });
    world.afterEvents.entitySpawn.subscribe((ev) => { });

    world.afterEvents.entityRemove.subscribe((ev) => { });
    world.beforeEvents.entityRemove.subscribe((ev) => { });

    world.afterEvents.playerInteractWithEntity.subscribe((ev) => { });
    world.beforeEvents.playerInteractWithEntity.subscribe((ev) => { });
}
//==============================================================================
// End of File
//==============================================================================
