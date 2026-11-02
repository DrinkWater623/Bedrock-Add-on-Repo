// debuggerBlocks.js
// @ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20250116 - Add Block from Ray Cast if different from View
    20251210 - Separated and fixed
    20251213 - Added subscription, event and customComponent properties to toggle and use for debug messages
    20251213b- Convert to console messages only
    20251214 - Better AllOff and AnyOns
    20251216 - More work with Chatty
========================================================================*/
// shared
import { Debugger } from './debuggerClass.js';
//==============================================================================
/** @typedef {import("@minecraft/server").Vector2} Vector2 */
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** @typedef {import("@minecraft/server").VectorXZ} VectorXZ */
//=============================================================================
/**
 * @typedef {{ before: boolean, after: boolean }} BeforeAfter
 * @typedef {Record<string, boolean | BeforeAfter>}  DebugEventsFlags
 * @typedef {Record<string, boolean>} DebugFlagMap
 */
//=============================================================================
/** @type {DebugEventsFlags} */
const BLOCK_EVENTS = {
    afterBlockExplode: false,
    afterButtonPush: false,
    afterEntityHitBlock: false,
    afterLeverAction: false,
    afterPistonActivate: false,
    playerBreakBlock: { before: false, after: false },
    playerInteractWithBlock: { before: false, after: false },
    playerPlaceBlock: { before: false, after: false },
    afterPressurePlatePop: false,
    afterPressurePlatePush: false,
    afterTargetBlockHit: false,
    afterTripWireTrip: false,
};
/** @type {DebugFlagMap} */
const BLOCK_COMPONENT_EVENTS = {
    onBlockBreak: false,
    onEntityFallOn: false,
    onPlace: false,
    onPlayerBreak: false,
    onPlayerInteract: false,
    onPlayerPlaceBefore: false,
    onRedstoneUpdate_beta: false,
    onRandomTick: false,
    onStepOff: false,
    onStepOn: false,
    onTick: false
};
//Object.freeze(BLOCK_COMPONENT_EVENTS);
//Object.freeze(BLOCK_EVENTS);
//=============================================================================
// For Debugging
/**
 * Creates a new Debug object
 * @class
 */
export class DebuggerBlocks extends Debugger {
    /**
        * @constructor
        * @param {string} pack_name 
        * @param {boolean} [on=false] - default false
        */
    constructor(pack_name, on = false) {
        super(pack_name, on);

        Object.assign(this.events, {
            afterBlockExplode: false,
            afterButtonPush: false,
            afterEntityHitBlock: false,
            afterLeverAction: false,
            afterPistonActivate: false,
            playerBreakBlock: { before: false, after: false },
            playerInteractWithBlock: { before: false, after: false },
            playerPlaceBlock: { before: false, after: false },
            afterPressurePlatePop: false,
            afterPressurePlatePush: false,
            afterTargetBlockHit: false,
            afterTripWireTrip: false,
        });
        Object.assign(this.customComponents, {
            onBlockBreak: false,
            onEntityFallOn: false,
            onPlace: false,
            onPlayerBreak: false,
            onPlayerInteract: false,
            onPlayerPlaceBefore: false,
            onRedstoneUpdate_beta: false,
            onRandomTick: false,
            onStepOff: false,
            onStepOn: false,
            onTick: false
        });
    }   
}

