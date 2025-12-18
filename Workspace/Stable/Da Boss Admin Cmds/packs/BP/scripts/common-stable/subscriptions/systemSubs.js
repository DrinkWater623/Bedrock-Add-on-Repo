// systemSubs.js
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
                        isolate system subs to own file
    20251216 - DW623 - Added Event Options and renamed
========================================================================*/
// Minecraft
import {  system } from "@minecraft/server";
// Shared
import { SubscriptionEntry, SubscriptionOwner } from "./subscriptionBaseClass.js";
//==============================================================================
/** @typedef {import("@minecraft/server").ScriptEventMessageFilterOptions} ScriptEventMessageFilterOptions */
//==============================================================================
// Typedefs for handlers (function type subscribe expects).
// System
/** @typedef {Parameters<typeof system.afterEvents.scriptEventReceive.subscribe>[0]} AfterScriptEventReceiveHandler */
/** @typedef {Parameters<typeof system.beforeEvents.startup.subscribe>[0]} BeforeStartupHandler */
//==============================================================================
// Typedefs for stored handles (Bedrock returns the function reference).
// System
/** @typedef {ReturnType<typeof system.afterEvents.scriptEventReceive.subscribe>} AfterScriptEventReceiveHandle */
/** @typedef {ReturnType<typeof system.beforeEvents.startup.subscribe>} BeforeStartupHandle */
//==============================================================================
// System subscriptions
export class SystemSubscriptions extends SubscriptionOwner {
    /**
     * @param {string} packName
     * @param {boolean} [debug=false]
     */
    constructor(packName, debug = false) {
        super("systemSubscriptions", packName, debug);

        /**
         * Script event receive
         * @type {SubscriptionEntry<AfterScriptEventReceiveHandler, AfterScriptEventReceiveHandle,ScriptEventMessageFilterOptions>}
         */
        this.afterScriptEventReceive = new SubscriptionEntry(
            this,
            "afterScriptEventReceive",
            system.afterEvents.scriptEventReceive
        );

        /**
         * Before startup
         * @type {SubscriptionEntry<BeforeStartupHandler, BeforeStartupHandle>}
         */
        this.beforeStartup = new SubscriptionEntry(
            this,
            "beforeStartup",
            system.beforeEvents.startup
        );
    }
    /**
     * Optional bulk registration helper.
     * Only keys you provide are subscribed.
     * 
     * @param {{
     *   afterScriptEventReceive?: AfterScriptEventReceiveHandler,
     *   beforeStartup?: BeforeStartupHandler
     * }} handlers
     * @param {boolean} [debug=false]
     */
    register(handlers, debug = false) {
        if (handlers.afterScriptEventReceive) {
            this.afterScriptEventReceive.subscribe(
                handlers.afterScriptEventReceive,
                debug
            );
        }
        if (handlers.beforeStartup) {
            this.beforeStartup.subscribe(
                handlers.beforeStartup,
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
