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
    20251214 - DW623 - Add more subs
========================================================================*/
// Minecraft
import { world   } from "@minecraft/server";
//beta so wait
//import { EntitySwingSource   } from "@minecraft/server";
// Shared
import { SubscriptionEntry, SubscriptionOwner } from "./subscriptionBaseClass.js";
import { PLAYER_TYPE_ID } from "../../common-data/globalConstantsLib.js";
//==============================================================================
// Event Options
/** @typedef {import("@minecraft/server").BlockEventOptions} BlockEventOptions */
/** @typedef {import("@minecraft/server").HotbarEventOptions} HotbarEventOptions */
/** @typedef {import("@minecraft/server").InventoryItemEventOptions} InventoryItemEventOptions */
/** @typedef {import("@minecraft/server").EntityEventOptions} EntityEventOptions */
/** @typedef {import("@minecraft/server").EntityDataDrivenTriggerEventOptions} EntityDataDrivenTriggerEventOptions */
/** @typedef {import("@minecraft/server").PlayerSwingEventOptions} PlayerSwingEventOptions */

//==============================================================================
// Typedefs for handlers (function type subscribe expects).
//  Player Actions
/** @typedef {Parameters<typeof world.afterEvents.playerBreakBlock.subscribe>[0]} AfterPlayerBreakBlockHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerEmote.subscribe>[0]} AfterPlayerEmoteHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerGameModeChange.subscribe>[0]} AfterPlayerGameModeChangeHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerHotbarSelectedSlotChange.subscribe>[0]} AfterPlayerHotbarSelectedSlotChangeHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerInputModeChange.subscribe>[0]} AfterPlayerInputModeChangeHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerInputPermissionCategoryChange.subscribe>[0]} AfterPlayerInputPermissionCategoryChangeHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerInteractWithBlock.subscribe>[0]} AfterPlayerInteractWithBlockHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerInteractWithEntity.subscribe>[0]} AfterPlayerInteractWithEntityHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerInventoryItemChange.subscribe>[0]} AfterPlayerInventoryItemChangeHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerJoin.subscribe>[0]} AfterPlayerJoinHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerLeave.subscribe>[0]} AfterPlayerLeaveHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerPlaceBlock.subscribe>[0]} AfterPlayerPlaceBlockHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerSpawn.subscribe>[0]} AfterPlayerSpawnHandler */

/** @typedef {Parameters<typeof world.beforeEvents.playerBreakBlock.subscribe>[0]} BeforePlayerBreakBlockHandler */
/** @typedef {Parameters<typeof world.beforeEvents.playerGameModeChange.subscribe>[0]} BeforePlayerGameModeChangeHandler */
/** @typedef {Parameters<typeof world.beforeEvents.playerInteractWithBlock.subscribe>[0]} BeforePlayerInteractWithBlockHandler */
/** @typedef {Parameters<typeof world.beforeEvents.playerInteractWithEntity.subscribe>[0]} BeforePlayerInteractWithEntityHandler */
/** @typedef {Parameters<typeof world.beforeEvents.playerLeave.subscribe>[0]} BeforePlayerLeaveHandler */
//TODO: Test each one for player
/** @typedef {Parameters<typeof world.afterEvents.entityDie.subscribe>[0]} AfterPlayerDieHandler */
/** @typedef {Parameters<typeof world.afterEvents.entityHealthChanged.subscribe>[0]} AfterPlayerHealthChangedHandler */
/** @typedef {Parameters<typeof world.afterEvents.entityHitBlock.subscribe>[0]} AfterPlayerHitBlockHandler */
/** @typedef {Parameters<typeof world.afterEvents.entityHitEntity.subscribe>[0]} AfterPlayerHitEntityHandler */
/** @typedef {Parameters<typeof world.afterEvents.entityHurt.subscribe>[0]} AfterPlayerHurtHandler */

//==============================================================================
// Typedefs for stored handles (Bedrock returns the function reference).
//  Player Actions
/** @typedef {ReturnType<typeof world.afterEvents.playerBreakBlock.subscribe>} AfterPlayerBreakBlockHandle */
/** @typedef {ReturnType<typeof world.afterEvents.playerEmote.subscribe>} AfterPlayerEmoteHandle */
/** @typedef {ReturnType<typeof world.afterEvents.playerGameModeChange.subscribe>} AfterPlayerGameModeChangeHandle */
/** @typedef {ReturnType<typeof world.afterEvents.playerHotbarSelectedSlotChange.subscribe>} AfterPlayerHotbarSelectedSlotChangeHandle */
/** @typedef {ReturnType<typeof world.afterEvents.playerInputModeChange.subscribe>} AfterPlayerInputModeChangeHandle */
/** @typedef {ReturnType<typeof world.afterEvents.playerInputPermissionCategoryChange.subscribe>} AfterPlayerInputPermissionCategoryChangeHandle */
/** @typedef {ReturnType<typeof world.afterEvents.playerInteractWithBlock.subscribe>} AfterPlayerInteractWithBlockHandle */
/** @typedef {ReturnType<typeof world.afterEvents.playerInteractWithEntity.subscribe>} AfterPlayerInteractWithEntityHandle */
/** @typedef {ReturnType<typeof world.afterEvents.playerInventoryItemChange.subscribe>} AfterPlayerInventoryItemChangeHandle */
/** @typedef {ReturnType<typeof world.afterEvents.playerPlaceBlock.subscribe>} AfterPlayerPlaceBlockHandle */
/** @typedef {ReturnType<typeof world.afterEvents.playerJoin.subscribe>} AfterPlayerJoinHandle */
/** @typedef {ReturnType<typeof world.afterEvents.playerLeave.subscribe>} AfterPlayerLeaveHandle */
/** @typedef {ReturnType<typeof world.afterEvents.playerSpawn.subscribe>} AfterPlayerSpawnHandle */

/** @typedef {ReturnType<typeof world.beforeEvents.playerBreakBlock.subscribe>} BeforePlayerBreakBlockHandle */
/** @typedef {ReturnType<typeof world.beforeEvents.playerGameModeChange.subscribe>} BeforePlayerGameModeChangeHandle */
/** @typedef {ReturnType<typeof world.beforeEvents.playerInteractWithBlock.subscribe>} BeforePlayerInteractWithBlockHandle */
/** @typedef {ReturnType<typeof world.beforeEvents.playerInteractWithEntity.subscribe>} BeforePlayerInteractWithEntityHandle */
/** @typedef {ReturnType<typeof world.beforeEvents.playerLeave.subscribe>} BeforePlayerLeaveHandle */

/** @typedef {ReturnType<typeof world.afterEvents.entityDie.subscribe>} AfterPlayerDieHandle */
/** @typedef {ReturnType<typeof world.afterEvents.entityHealthChanged.subscribe>} AfterPlayerHealthChangedHandle */
/** @typedef {ReturnType<typeof world.afterEvents.entityHitBlock.subscribe>} AfterPlayerHitBlockHandle */
/** @typedef {ReturnType<typeof world.afterEvents.entityHitEntity.subscribe>} AfterPlayerHitEntityHandle */
/** @typedef {ReturnType<typeof world.afterEvents.entityHurt.subscribe>} AfterPlayerHurtHandle */
//==============================================================================
const PLAYER_ENTITY_EVENT_OPTION = {entityTypes:[PLAYER_TYPE_ID]}
//==============================================================================
// Player subscriptions
export class PlayerSubscriptions extends SubscriptionOwner {
    /**
     * @param {string} packName
     * @param {boolean} [debug=false]
     */
    constructor(packName, debug = false) {
        super("PlayerSubscriptions", packName, debug);

        /** @type {SubscriptionEntry<AfterPlayerBreakBlockHandler, AfterPlayerBreakBlockHandle, BlockEventOptions>} */
        this.afterPlayerBreakBlock = new SubscriptionEntry(
            this,
            "afterPlayerBreakBlock",
            world.afterEvents.playerBreakBlock
        );
        /** @type {SubscriptionEntry<AfterPlayerEmoteHandler, AfterPlayerEmoteHandle>} */
        this.afterPlayerEmote = new SubscriptionEntry(
            this,
            "afterPlayerEmote",
            world.afterEvents.playerEmote
        );
        /** @type {SubscriptionEntry<AfterPlayerGameModeChangeHandler, AfterPlayerGameModeChangeHandle>} */
        this.afterPlayerGameModeChange = new SubscriptionEntry(
            this,
            "afterPlayerGameModeChange",
            world.afterEvents.playerGameModeChange
        );
        /** @type {SubscriptionEntry<AfterPlayerHotbarSelectedSlotChangeHandler, AfterPlayerHotbarSelectedSlotChangeHandle,HotbarEventOptions>} */
        this.afterPlayerHotbarSelectedSlotChange = new SubscriptionEntry(
            this,
            "afterPlayerHotbarSelectedSlotChange",
            world.afterEvents.playerHotbarSelectedSlotChange
        );
        /** @type {SubscriptionEntry<AfterPlayerInputModeChangeHandler, AfterPlayerInputModeChangeHandle>} */
        this.afterPlayerInputModeChange = new SubscriptionEntry(
            this,
            "afterPlayerInputModeChange",
            world.afterEvents.playerInputModeChange
        );
        /** @type {SubscriptionEntry<AfterPlayerInputPermissionCategoryChangeHandler, AfterPlayerInputPermissionCategoryChangeHandle>} */
        this.afterPlayerInputPermissionCategoryChange = new SubscriptionEntry(
            this,
            "afterPlayerInputPermissionCategoryChange",
            world.afterEvents.playerInputPermissionCategoryChange
        );
        /** @type {SubscriptionEntry<AfterPlayerInteractWithBlockHandler, AfterPlayerInteractWithBlockHandle>} */
        this.afterPlayerInteractWithBlock = new SubscriptionEntry(
            this,
            "afterPlayerInteractWithBlock",
            world.afterEvents.playerInteractWithBlock
        );
        /** @type {SubscriptionEntry<AfterPlayerInteractWithEntityHandler, AfterPlayerInteractWithEntityHandle>} */
        this.afterPlayerInteractWithEntity = new SubscriptionEntry(
            this,
            "afterPlayerInteractWithEntity",
            world.afterEvents.playerInteractWithEntity
        );
        /** @type {SubscriptionEntry<AfterPlayerInventoryItemChangeHandler, AfterPlayerInventoryItemChangeHandle,InventoryItemEventOptions>} */
        this.afterPlayerInventoryItemChange = new SubscriptionEntry(
            this,
            "afterPlayerInventoryItemChange",
            world.afterEvents.playerInventoryItemChange
        );
        /** @type {SubscriptionEntry<AfterPlayerJoinHandler, AfterPlayerJoinHandle>} */
        this.afterPlayerJoin = new SubscriptionEntry(
            this,
            "afterPlayerJoin",
            world.afterEvents.playerJoin
        );
        /** @type {SubscriptionEntry<AfterPlayerLeaveHandler, AfterPlayerLeaveHandle>} */
        this.afterPlayerLeave = new SubscriptionEntry(
            this,
            "afterPlayerLeave",
            world.afterEvents.playerLeave
        );
        /** @type {SubscriptionEntry<AfterPlayerPlaceBlockHandler, AfterPlayerPlaceBlockHandle,BlockEventOptions>} */
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
        //=======
        //Before
        //=======
        /** @type {SubscriptionEntry<BeforePlayerBreakBlockHandler, BeforePlayerBreakBlockHandle ,BlockEventOptions>} */
        this.beforePlayerBreakBlock = new SubscriptionEntry(
            this,
            "beforePlayerBreakBlock",
            world.beforeEvents.playerBreakBlock
        );
        /** @type {SubscriptionEntry<BeforePlayerGameModeChangeHandler, BeforePlayerGameModeChangeHandle>} */
        this.beforePlayerGameModeChange = new SubscriptionEntry(
            this,
            "beforePlayerGameModeChange",
            world.beforeEvents.playerGameModeChange
        );
        /** @type {SubscriptionEntry<BeforePlayerInteractWithBlockHandler, BeforePlayerInteractWithBlockHandle>} */
        this.beforePlayerInteractWithBlock = new SubscriptionEntry(
            this,
            "beforePlayerInteractWithBlock",
            world.beforeEvents.playerInteractWithBlock
        );
        /** @type {SubscriptionEntry<BeforePlayerInteractWithEntityHandler, BeforePlayerInteractWithEntityHandle>} */
        this.beforePlayerInteractWithEntity = new SubscriptionEntry(
            this,
            "beforePlayerInteractWithEntity",
            world.beforeEvents.playerInteractWithEntity
        );
        /** @type {SubscriptionEntry<BeforePlayerLeaveHandler, BeforePlayerLeaveHandle>} */
        this.beforePlayerLeave = new SubscriptionEntry(
            this,
            "beforePlayerLeave",
            world.beforeEvents.playerLeave
        );
        //=================
        //Player as Entity
        //=================
        /** @type {SubscriptionEntry<AfterPlayerDieHandler, AfterPlayerDieHandle,EntityEventOptions>} */
        this.afterPlayerDie = new SubscriptionEntry(
            this,
            "afterPlayerDie",
            world.afterEvents.entityDie
        );
        /** @type {SubscriptionEntry<AfterPlayerHealthChangedHandler, AfterPlayerHealthChangedHandle,EntityEventOptions>} */
        this.afterPlayerHealthChanged = new SubscriptionEntry(
            this,
            "afterPlayerHealthChanged",
            world.afterEvents.entityHealthChanged
        );
        /** @type {SubscriptionEntry<AfterPlayerHitBlockHandler, AfterPlayerHitBlockHandle,EntityEventOptions>} */
        this.afterPlayerHitBlock = new SubscriptionEntry(
            this,
            "afterPlayerHitBlock",
            world.afterEvents.entityHitBlock
        );
        /** @type {SubscriptionEntry<AfterPlayerHitEntityHandler, AfterPlayerHitEntityHandle,EntityEventOptions>} */
        this.afterPlayerHitEntity = new SubscriptionEntry(
            this,
            "afterPlayerHitEntity",
            world.afterEvents.entityHitEntity
        );
        /** @type {SubscriptionEntry<AfterPlayerHurtHandler, AfterPlayerHurtHandle,EntityEventOptions>} */
        this.afterPlayerHurt = new SubscriptionEntry(
            this,
            "afterPlayerHurt",
            world.afterEvents.entityHurt
        );
    }

    /**
     * Optional bulk registration helper.
     * Only keys you provide are subscribed.
     * 
     * @param {{
     *   afterPlayerBreakBlock?: AfterPlayerBreakBlockHandler,
     *   afterPlayerEmote?: AfterPlayerEmoteHandler,
     *   afterPlayerHotbarSelectedSlotChange?: AfterPlayerHotbarSelectedSlotChangeHandler
     *   afterPlayerInputModeChange?: AfterPlayerInputModeChangeHandler
     *   afterPlayerInputPermissionCategoryChange?: AfterPlayerInputPermissionCategoryChangeHandler
     *   afterPlayerInteractWithBlock?: AfterPlayerInteractWithBlockHandler,
     *   afterPlayerInteractWithEntity?: AfterPlayerInteractWithEntityHandler,
     *   afterPlayerInventoryItemChange?: AfterPlayerInventoryItemChangeHandler,
     *   afterPlayerJoin?: AfterPlayerJoinHandler
     *   afterPlayerLeave?: AfterPlayerLeaveHandler
     *   afterPlayerPlaceBlock?: AfterPlayerPlaceBlockHandler,
     *   afterPlayerSpawn?: AfterPlayerSpawnHandler
     *   beforePlayerBreakBlock?: BeforePlayerBreakBlockHandler,
     *   beforePlayerInteractWithBlock?: BeforePlayerInteractWithBlockHandler,
     *   beforePlayerInteractWithEntity?: BeforePlayerInteractWithEntityHandler,
     *   beforePlayerLeave?: BeforePlayerLeaveHandler
     *   afterPlayerDie?: AfterPlayerDieHandler
     *   afterPlayerHealthChanged?: AfterPlayerHealthChangedHandler
     *   afterPlayerHitBlock?: AfterPlayerHitBlockHandler
     *   afterPlayerHitEntity?: AfterPlayerHitEntityHandler
     *   afterPlayerHurt?: AfterPlayerHurtHandler
     * }} handlers
     * @param {boolean} [debug=false]
     */
    register (handlers, debug = false) {
        if (handlers.afterPlayerBreakBlock) {
            this.afterPlayerBreakBlock.subscribe(
                handlers.afterPlayerBreakBlock,
                debug
            );
        }
        if (handlers.afterPlayerEmote) {
            this.afterPlayerEmote.subscribe(
                handlers.afterPlayerEmote,
                debug
            );
        }
        if (handlers.afterPlayerHotbarSelectedSlotChange) {
            this.afterPlayerHotbarSelectedSlotChange.subscribe(
                handlers.afterPlayerHotbarSelectedSlotChange,
                debug
            );
        }
        if (handlers.afterPlayerInputModeChange) {
            this.afterPlayerInputModeChange.subscribe(
                handlers.afterPlayerInputModeChange,
                debug
            );
        }
        if (handlers.afterPlayerInputPermissionCategoryChange) {
            this.afterPlayerInputPermissionCategoryChange.subscribe(
                handlers.afterPlayerInputPermissionCategoryChange,
                debug
            );
        }
        if (handlers.afterPlayerInteractWithBlock) {
            this.afterPlayerInteractWithBlock.subscribe(
                handlers.afterPlayerInteractWithBlock,
                debug
            );
        }
        if (handlers.afterPlayerInteractWithEntity) {
            this.afterPlayerInteractWithEntity.subscribe(
                handlers.afterPlayerInteractWithEntity,
                debug
            );
        }
        if (handlers.afterPlayerInventoryItemChange) {
            this.afterPlayerInventoryItemChange.subscribe(
                handlers.afterPlayerInventoryItemChange,
                debug
            );
        }
        if (handlers.afterPlayerJoin) {
            this.afterPlayerJoin.subscribe(
                handlers.afterPlayerJoin,
                debug
            );
        }
        if (handlers.afterPlayerLeave) {
            this.afterPlayerLeave.subscribe(
                handlers.afterPlayerLeave,
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
        //========
        // Before
        //========
        if (handlers.beforePlayerBreakBlock) {
            this.beforePlayerBreakBlock.subscribe(
                handlers.beforePlayerBreakBlock,
                debug
            );
        }
        if (handlers.beforePlayerInteractWithBlock) {
            this.beforePlayerInteractWithBlock.subscribe(
                handlers.beforePlayerInteractWithBlock,
                debug
            );
        }
        if (handlers.beforePlayerInteractWithEntity) {
            this.beforePlayerInteractWithEntity.subscribe(
                handlers.beforePlayerInteractWithEntity,
                debug
            );
        }
        if (handlers.beforePlayerLeave) {
            this.beforePlayerLeave.subscribe(
                handlers.beforePlayerLeave,
                debug
            );
        }
        //==================
        // Player as Entity
        //==================
        if (handlers.afterPlayerDie) {
            this.afterPlayerDie.subscribeWithOptions(
                handlers.afterPlayerDie,
                PLAYER_ENTITY_EVENT_OPTION,
                debug
            );
        }
        if (handlers.afterPlayerHealthChanged) {
            this.afterPlayerHealthChanged.subscribeWithOptions(
                handlers.afterPlayerHealthChanged,
                PLAYER_ENTITY_EVENT_OPTION,
                debug
            );
        }
        if (handlers.afterPlayerHitBlock) {
            this.afterPlayerHitBlock.subscribeWithOptions(
                handlers.afterPlayerHitBlock,
                PLAYER_ENTITY_EVENT_OPTION,
                debug
            );
        }
        if (handlers.afterPlayerHitEntity) {
            this.afterPlayerHitEntity.subscribeWithOptions(
                handlers.afterPlayerHitEntity,
                PLAYER_ENTITY_EVENT_OPTION,
                debug
            );
        }
        if (handlers.afterPlayerHurt) {
            this.afterPlayerHurt.subscribeWithOptions(
                handlers.afterPlayerHurt,
                PLAYER_ENTITY_EVENT_OPTION,
                debug
            );
        }

    }
}
function notUsed_players_ListOfStable () {
    /**
    interface BlockEventOptions {
        blockTypes?: string[];
        permutations?: BlockPermutation[];
    }

    interface HotbarEventOptions {
        allowedSlots?: number[];
    }

    interface InventoryItemEventOptions {
        allowedSlots?: number[];
        excludeItems?: string[];
        excludeTags?: string[];
        ignoreQuantityChange?: boolean;
        includeItems?: string[];
        includeTags?: string[];
        inventoryType?: PlayerInventoryType;
    }
   */
    world.afterEvents.playerBreakBlock.subscribe((ev) => { }); //options BlockEventOptions
    world.afterEvents.playerEmote.subscribe((ev) => { });
    world.afterEvents.playerGameModeChange.subscribe((ev) => { });
    world.afterEvents.playerHotbarSelectedSlotChange.subscribe((ev) => { }); //options HotbarEventOptions
    world.afterEvents.playerInputModeChange.subscribe((ev) => { });
    world.afterEvents.playerInputPermissionCategoryChange.subscribe((ev) => { });
    world.afterEvents.playerInteractWithBlock.subscribe((ev) => { });
    world.afterEvents.playerInteractWithEntity.subscribe((ev) => { });
    world.afterEvents.playerInventoryItemChange.subscribe((ev) => { }); //options InventoryItemEventOptions
    world.afterEvents.playerJoin.subscribe((ev) => { });
    world.afterEvents.playerLeave.subscribe((ev) => { });
    world.afterEvents.playerPlaceBlock.subscribe((ev) => { }); //options BlockEventOptions
    world.afterEvents.playerSpawn.subscribe((ev) => { });
    //BETA world.afterEvents.playerSwingStart.subscribe((ev) => { });
    //BETA world.afterEvents.playerUseNameTag.subscribe((ev) => { });

    world.beforeEvents.playerBreakBlock.subscribe((ev) => { }); //options BlockEventOptions
    world.beforeEvents.playerGameModeChange.subscribe((ev) => { });
    world.beforeEvents.playerInteractWithBlock.subscribe((ev) => { });
    world.beforeEvents.playerInteractWithEntity.subscribe((ev) => { });
    world.beforeEvents.playerLeave.subscribe((ev) => { });
    //BETA world.beforeEvents.playerPlaceBlock.subscribe((ev) => { });
}
function notUsed_entity_as_player_ListOfStable () {
    //Player as Entity (Test)
    /*interface EntityEventOptions {
        entities?: Entity[];
        entityTypes?: string[];
    }*/
    world.afterEvents.entityDie.subscribe((ev) => { }); //options
    world.afterEvents.entityHealthChanged.subscribe((ev) => { }); //options
    world.afterEvents.entityHitBlock.subscribe((ev) => { }); //options
    world.afterEvents.entityHitEntity.subscribe((ev) => { }); //options
    world.afterEvents.entityHurt.subscribe((ev) => { }); //options
}
//==============================================================================
// End of File
//==============================================================================
