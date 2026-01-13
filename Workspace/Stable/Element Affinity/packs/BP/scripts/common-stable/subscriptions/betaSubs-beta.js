// betaSubs-beta.js  (beta twice because manifest filter deletes -beta files if stable add-on)
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20251216 - DW623 - Created    
========================================================================*/
// Minecraft
import { world } from "@minecraft/server";
// Shared
import { SubscriptionEntry, SubscriptionOwner } from "./subscriptionBaseClass.js";
//==============================================================================
/** @typedef {import("@minecraft/server").BlockEventOptions} BlockEventOptions */
//==============================================================================
// Typedefs for handlers (function type subscribe expects).
/** @typedef {Parameters<typeof world.beforeEvents.playerPlaceBlock.subscribe>[0]} BeforePlayerPlaceBlockHandler */
/*
TODO: add the rest
BETAworld.afterEvents.playerSwingStart.subscribe((ev) => { });
BETAworld.afterEvents.playerUseNameTag.subscribe((ev) => { });
*/
//==============================================================================
// Typedefs for stored handles (Bedrock returns the function reference).
/** @typedef {ReturnType<typeof world.beforeEvents.playerPlaceBlock.subscribe>} BeforePlayerPlaceBlockHandle */
//==============================================================================
// Player subscriptions
export class BetaSubscriptions extends SubscriptionOwner {
    /**
     * @param {string} packName
     * @param {boolean} [debug=false]
     */
    constructor(packName, debug = false) {
        super("BetaSubscriptions", packName, debug);

        /** @type {SubscriptionEntry<BeforePlayerPlaceBlockHandler, BeforePlayerPlaceBlockHandle,BlockEventOptions>} */
        this.beforePlayerPlaceBlock = new SubscriptionEntry(
            this,
            "beforePlayerPlaceBlock",
            world.beforeEvents.playerPlaceBlock
        );
    }
    /**
     * Optional bulk registration helper.
     * Only keys you provide are subscribed.
     * 
     * @param {{
     *   beforePlayerPlaceBlock?:       BeforePlayerPlaceBlockHandler     
     * }} handlers
     * @param {boolean} [debug=false]
     */
    register (handlers, debug = false) {
        if (handlers.beforePlayerPlaceBlock) {
            this.beforePlayerPlaceBlock.subscribe(
                handlers.beforePlayerPlaceBlock,
                debug
            );
        }
    }
}
//==============================================================================
function not_used_Block_Subs () {

    world.beforeEvents.playerPlaceBlock.subscribe((ev) => { });
}
//==============================================================================
// End of File
//==============================================================================
