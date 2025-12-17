// blockSubs.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20251215 - DW623 - Created
    20251216 - DW623 - Added the rest and Event Options and renamed
========================================================================*/
// Minecraft
import { world } from "@minecraft/server";
// Shared
import { SubscriptionEntry, SubscriptionOwner } from "./subscriptionBaseClass.js";
//==============================================================================
/** @typedef {import("@minecraft/server").BlockEventOptions} BlockEventOptions */
/** @typedef {import("@minecraft/server").EntityEventOptions} EntityEventOptions */
//==============================================================================
// Typedefs for handlers (function type subscribe expects).
// Block Events
/** @typedef {Parameters<typeof world.afterEvents.blockExplode.subscribe>[0]} AfterBlockExplodeHandler */
/** @typedef {Parameters<typeof world.afterEvents.buttonPush.subscribe>[0]} AfterButtonPushHandler */
/** @typedef {Parameters<typeof world.afterEvents.leverAction.subscribe>[0]} AfterLeverActionHandler */
/** @typedef {Parameters<typeof world.afterEvents.pistonActivate.subscribe>[0]} AfterPistonActivateHandler */
/** @typedef {Parameters<typeof world.afterEvents.pressurePlatePop.subscribe>[0]} AfterPressurePlatePopHandler */
/** @typedef {Parameters<typeof world.afterEvents.pressurePlatePush.subscribe>[0]} AfterPressurePlatePushHandler */
/** @typedef {Parameters<typeof world.afterEvents.targetBlockHit.subscribe>[0]} AfterTargetBlockHitHandler */
/** @typedef {Parameters<typeof world.afterEvents.tripWireTrip.subscribe>[0]} AfterTripWireTripHandler */
// Player/Entity Events on blocks
/** @typedef {Parameters<typeof world.afterEvents.entityHitBlock.subscribe>[0]} AfterEntityHitBlockHandler */
//TODO: add the rest
//==============================================================================
// Typedefs for stored handles (Bedrock returns the function reference).
/** @typedef {ReturnType<typeof world.afterEvents.blockExplode.subscribe>} AfterBlockExplodeHandle */
/** @typedef {ReturnType<typeof world.afterEvents.buttonPush.subscribe>} AfterButtonPushHandle */
/** @typedef {ReturnType<typeof world.afterEvents.leverAction.subscribe>} AfterLeverActionHandle */
/** @typedef {ReturnType<typeof world.afterEvents.pistonActivate.subscribe>} AfterPistonActivateHandle */
/** @typedef {ReturnType<typeof world.afterEvents.pressurePlatePop.subscribe>} AfterPressurePlatePopHandle */
/** @typedef {ReturnType<typeof world.afterEvents.pressurePlatePush.subscribe>} AfterPressurePlatePushHandle */
/** @typedef {ReturnType<typeof world.afterEvents.targetBlockHit.subscribe>} AfterTargetBlockHitHandle */
/** @typedef {ReturnType<typeof world.afterEvents.tripWireTrip.subscribe>} AfterTripWireTripHandle */
// Player/Entity
/** @typedef {ReturnType<typeof world.afterEvents.entityHitBlock.subscribe>} AfterEntityHitBlockHandle */
//==============================================================================
// Player subscriptions
export class BlockSubscriptions extends SubscriptionOwner {
    /**
     * @param {string} packName
     * @param {boolean} [debug=false]
     */
    constructor(packName, debug = false) {
        super("BlockSubscriptions", packName, debug);

        /** @type {SubscriptionEntry<AfterBlockExplodeHandler, AfterBlockExplodeHandle>} */
        this.afterBlockExplode = new SubscriptionEntry(
            this,
            "afterBlockExplode",
            world.afterEvents.blockExplode
        );
        /** @type {SubscriptionEntry<AfterButtonPushHandler, AfterButtonPushHandle>} */
        this.afterButtonPush = new SubscriptionEntry(
            this,
            "afterButtonPush",
            world.afterEvents.buttonPush
        );
        /** @type {SubscriptionEntry<AfterEntityHitBlockHandler, AfterEntityHitBlockHandle,EntityEventOptions>} */
        this.afterEntityHitBlock = new SubscriptionEntry(
            this,
            "afterEntityHitBlock",
            world.afterEvents.entityHitBlock
        );
        /** @type {SubscriptionEntry<AfterLeverActionHandler, AfterLeverActionHandle>} */
        this.afterLeverAction = new SubscriptionEntry(
            this,
            "afterLeverAction",
            world.afterEvents.leverAction
        );

        /** @type {SubscriptionEntry<AfterPistonActivateHandler, AfterPistonActivateHandle>} */
        this.afterPistonActivate = new SubscriptionEntry(
            this,
            "afterPistonActivate",
            world.afterEvents.pistonActivate
        );

        /** @type {SubscriptionEntry<AfterPressurePlatePopHandler, AfterPressurePlatePopHandle>} */
        this.afterPressurePlatePop = new SubscriptionEntry(
            this,
            "afterPressurePlatePop",
            world.afterEvents.pressurePlatePop
        );

        /** @type {SubscriptionEntry<AfterPressurePlatePushHandler, AfterPressurePlatePushHandle>} */
        this.afterPressurePlatePush = new SubscriptionEntry(
            this,
            "afterPressurePlatePush",
            world.afterEvents.pressurePlatePush
        );
        /** @type {SubscriptionEntry<AfterTargetBlockHitHandler, AfterTargetBlockHitHandle>} */
        this.afterTargetBlockHit = new SubscriptionEntry(
            this,
            "afterTargetBlockHit",
            world.afterEvents.targetBlockHit
        );

        /** @type {SubscriptionEntry<AfterTripWireTripHandler, AfterTripWireTripHandle>} */
        this.afterTripWireTrip = new SubscriptionEntry(
            this,
            "afterTripWireTrip",
            world.afterEvents.tripWireTrip
        );

    }
    /**
     * Optional bulk registration helper.
     * Only keys you provide are subscribed.
     * 
     * @param {{
     *   afterBlockExplode?:       AfterBlockExplodeHandler       ,
     *   afterButtonPush?:         AfterButtonPushHandler         ,
     *   afterEntityHitBlock?:     AfterEntityHitBlockHandler     ,     
     *   afterLeverAction?:        AfterLeverActionHandler        ,
     *   afterPistonActivate?:     AfterPistonActivateHandler     ,
     *   afterPressurePlatePop?:   AfterPressurePlatePopHandler   ,
     *   afterPressurePlatePush?:  AfterPressurePlatePushHandler  ,
     *   afterTargetBlockHit?:     AfterTargetBlockHitHandler     ,
     *   afterTripWireTrip?:       AfterTripWireTripHandler      
     * }} handlers
     * @param {boolean} [debug=false]
     */
    register (handlers, debug = false) {
        if (handlers.afterBlockExplode) {
            this.afterBlockExplode.subscribe(
                handlers.afterBlockExplode,
                debug
            );
        }
        if (handlers.afterButtonPush) {
            this.afterButtonPush.subscribe(
                handlers.afterButtonPush,
                debug
            );
        }        
        if (handlers.afterEntityHitBlock) {
            this.afterEntityHitBlock.subscribe(
                handlers.afterEntityHitBlock,
                debug
            );
        }
        if (handlers.afterLeverAction) {
            this.afterLeverAction.subscribe(
                handlers.afterLeverAction,
                debug
            );
        }
        if (handlers.afterPistonActivate) {
            this.afterPistonActivate.subscribe(
                handlers.afterPistonActivate,
                debug
            );
        }
        if (handlers.afterPressurePlatePop) {
            this.afterPressurePlatePop.subscribe(
                handlers.afterPressurePlatePop,
                debug
            );
        }
        if (handlers.afterPressurePlatePush) {
            this.afterPressurePlatePush.subscribe(
                handlers.afterPressurePlatePush,
                debug
            );
        }
        if (handlers.afterTargetBlockHit) {
            this.afterTargetBlockHit.subscribe(
                handlers.afterTargetBlockHit,
                debug
            );
        }
        if (handlers.afterTripWireTrip) {
            this.afterTripWireTrip.subscribe(
                handlers.afterTripWireTrip,
                debug
            );
        }
    }
}
//==============================================================================
function not_used_Block_Subs () {

    world.afterEvents.blockExplode.subscribe((ev) => { });
    world.afterEvents.buttonPush.subscribe((ev) => { });
    world.afterEvents.leverAction.subscribe((ev) => { });
    world.afterEvents.pistonActivate.subscribe((ev) => { });
    world.afterEvents.pressurePlatePop.subscribe((ev) => { });
    world.afterEvents.pressurePlatePush.subscribe((ev) => { });
    world.afterEvents.targetBlockHit.subscribe((ev) => { });
    world.afterEvents.tripWireTrip.subscribe((ev) => { });

    //Players - when player does not matter, it is a specific block
    world.afterEvents.playerBreakBlock.subscribe((ev) => { }); //BlockEventOptions
    world.afterEvents.playerInteractWithBlock.subscribe((ev) => { });
    world.afterEvents.playerPlaceBlock.subscribe((ev) => { }); //BlockEventOptions

    //Entities
    world.afterEvents.entityHitBlock.subscribe((ev) => { }); //Entity Options

    //BETA
    //world.beforeEvents.playerPlaceBlock.subscribe((ev) => { }); //BlockEventOptions

}
//==============================================================================
// End of File
//==============================================================================
