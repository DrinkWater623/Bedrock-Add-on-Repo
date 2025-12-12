// playerSubs-stable.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20251023 - DW623 - Refactored and add in stable stuff and update to api 2.0 and move debug-only stuff out
    20251102 - DW623 - Refactored and created basic structure of the classes
    20251202 - DW623 - DRY subscribe/unsubscribe via SubscriptionEntry base
                        Players isolated to own file
========================================================================*/
// Minecraft
import { world} from "@minecraft/server";
// Shared
import { SubscriptionEntry, SubscriptionOwner } from "./subscriptionBaseClass.js";
//==============================================================================
// Typedefs for handlers (function type subscribe expects).
//  Player Actions
/** @typedef {Parameters<typeof world.afterEvents.playerBreakBlock.subscribe>[0]} AfterPlayerBreakBlockHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerInteractWithBlock.subscribe>[0]} AfterPlayerInteractWithBlockHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerPlaceBlock.subscribe>[0]} AfterPlayerPlaceBlockHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerSpawn.subscribe>[0]} AfterPlayerSpawnHandler */

/** @typedef {Parameters<typeof world.beforeEvents.playerBreakBlock.subscribe>[0]} BeforePlayerBreakBlockHandler */
/** @typedef {Parameters<typeof world.beforeEvents.playerInteractWithBlock.subscribe>[0]} BeforePlayerInteractWithBlockHandler */
/** @typedef {Parameters<typeof world.beforeEvents.playerLeave.subscribe>[0]} BeforePlayerLeaveHandler */

//==============================================================================
// Typedefs for stored handles (Bedrock returns the function reference).
//  Player Actions
/** @typedef {ReturnType<typeof world.afterEvents.playerBreakBlock.subscribe>} AfterPlayerBreakBlockHandle */
/** @typedef {ReturnType<typeof world.afterEvents.playerInteractWithBlock.subscribe>} AfterPlayerInteractWithBlockHandle */
/** @typedef {ReturnType<typeof world.afterEvents.playerPlaceBlock.subscribe>} AfterPlayerPlaceBlockHandle */
/** @typedef {ReturnType<typeof world.afterEvents.playerSpawn.subscribe>} AfterPlayerSpawnHandle */

/** @typedef {ReturnType<typeof world.beforeEvents.playerBreakBlock.subscribe>} BeforePlayerBreakBlockHandle */
/** @typedef {ReturnType<typeof world.beforeEvents.playerInteractWithBlock.subscribe>} BeforePlayerInteractWithBlockHandle */
/** @typedef {ReturnType<typeof world.beforeEvents.playerLeave.subscribe>} BeforePlayerLeaveHandle */
//==============================================================================
// Player subscriptions
export class PlayerSubscriptions extends SubscriptionOwner {
    /**
     * @param {string} packName
     * @param {boolean} [debug=false]
     */
    constructor(packName, debug = false) {
        super("PlayerSubscriptions", packName, debug);
        
        /** @type {SubscriptionEntry<AfterPlayerBreakBlockHandler, AfterPlayerBreakBlockHandle>} */
        this.afterPlayerBreakBlock = new SubscriptionEntry(
            this,
            "afterPlayerBreakBlock",
            world.afterEvents.playerBreakBlock
        );
        
        /** @type {SubscriptionEntry<AfterPlayerInteractWithBlockHandler, AfterPlayerInteractWithBlockHandle>} */
        this.afterPlayerInteractWithBlock = new SubscriptionEntry(
            this,
            "afterPlayerInteractWithBlock",
            world.afterEvents.playerInteractWithBlock
        );

        /** @type {SubscriptionEntry<AfterPlayerPlaceBlockHandler, AfterPlayerPlaceBlockHandle>} */
        this.afterPlayerPlaceBlock = new SubscriptionEntry(
            this,
            "afterPlayerPlaceBlock",
            world.afterEvents.playerPlaceBlock
        );

         /** @type {SubscriptionEntry<AfterPlayerSpawnHandler, AfterPlayerSpawnHandle>} */
        this.afterPlayerSpawn = new SubscriptionEntry(
            this,
            "afterPlayerSpawn",
            world.afterEvents.playerSpawn
        );

        /** @type {SubscriptionEntry<BeforePlayerInteractWithBlockHandler, BeforePlayerInteractWithBlockHandle>} */
        this.beforePlayerInteractWithBlock = new SubscriptionEntry(
            this,
            "beforePlayerInteractWithBlock",
            world.beforeEvents.playerInteractWithBlock
        );

        /** @type {SubscriptionEntry<BeforePlayerLeaveHandler, BeforePlayerLeaveHandle>} */
        this.beforePlayerLeave= new SubscriptionEntry(
            this,
            "beforePlayerLeave",
            world.beforeEvents.playerLeave
        );
        
    }

    /**
     * Optional bulk registration helper.
     * Only keys you provide are subscribed.
     * 
     * @param {{
     *   afterPlayerBreakBlock?: AfterPlayerBreakBlockHandler,
     *   afterPlayerInteractWithBlock?: AfterPlayerInteractWithBlockHandler,
     *   afterPlayerPlaceBlock?: AfterPlayerPlaceBlockHandler,
     *   afterPlayerSpawn?: AfterPlayerSpawnHandler
     *   beforePlayerBreakBlock?: BeforePlayerBreakBlockHandler,
     *   beforePlayerInteractWithBlock?: BeforePlayerInteractWithBlockHandler,
     *   beforePlayerLeave?: BeforePlayerLeaveHandler
     * }} handlers
     * @param {boolean} [debug=false]
     */
    register(handlers, debug = false) {
        if (handlers.afterPlayerBreakBlock) {
            this.afterPlayerBreakBlock.subscribe(
                handlers.afterPlayerBreakBlock,
                debug
            );
        }
        if (handlers.afterPlayerInteractWithBlock) {
            this.afterPlayerInteractWithBlock.subscribe(
                handlers.afterPlayerInteractWithBlock,
                debug
            );
        }
        if (handlers.afterPlayerPlaceBlock) {
            this.afterPlayerPlaceBlock.subscribe(
                handlers.afterPlayerPlaceBlock,
                debug
            );
        }
        if (handlers.afterPlayerSpawn) {
            this.afterPlayerSpawn.subscribe(
                handlers.afterPlayerSpawn,
                debug
            );
        }
        if (handlers.beforePlayerInteractWithBlock) {
            this.beforePlayerInteractWithBlock.subscribe(
                handlers.beforePlayerInteractWithBlock,
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
