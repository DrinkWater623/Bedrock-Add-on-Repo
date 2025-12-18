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
import { BlockPermutation, Player, World, Block, Direction, world } from '@minecraft/server';
// shared
import { Vector2Lib, Vector3Lib } from '../tools/vectorClass.js';
import { Debugger } from './debuggerClass.js';
import { FaceLocationGrid, } from "../gameObjects/blockFace.js";
import { cloneMixedBooleanAfterBeforeFlagMap } from "../tools/objects.js";
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

        Object.assign(this.events, cloneMixedBooleanAfterBeforeFlagMap(BLOCK_EVENTS));
        Object.assign(this.customComponents, BLOCK_COMPONENT_EVENTS);
    }
    //--------------------------------------------------------------------------
    /**
     * @param {BlockPermutation} permutation 
     * @param {string} title 
     * @param {boolean} alert
     */
    listBlockStates (permutation, title = "Block States:", alert = false) {
        if (!(alert || this.debugOn)) return;

        const states = permutation?.getAllStates();
        if (!states) {
            this.log("Zero Block States", true);
            return;
        }

        this.listObjectInnards(states, title, true);
    }
    /**
     * @param {Block} block      
     * @param {string} title 
     * @param {boolean} alert
     */
    blockInfo (block, title = "§eBlock Info:", alert = false) {
        if (!(alert || this.debugOn)) return;

        if (title) this.log(title, true);
        this.log(`==> §aBlock typeId:§r ${block.typeId}`, true); //TODO: get display name from vanilla data
        this.log(`==> §bBlock Location.:§r ${Vector3Lib.toString(block.location, 0, true, ',')}`, true);
        this.log(`==> §bBlock Center :§r ${Vector3Lib.toString(block.center(), 1, true, ',')}`, true);
        this.blockPermutationInfo(block.permutation, `${title} - Permutation`, true);

        //FIXME:  is this needed...  test later to see the info in there
        //const item = block.getItemStack()
        //if (item) this.itemInfo(item,chatSend,`${title} - ItemStack`,true)
    }
    /**
     * @param {Direction} blockFace 
     * @param {Vector3} faceLocation
     * @param {Player} player
     * @param {number[]} [grids=[3]]  
     * @param {boolean} [alert=false] 
     */
    blockFaceLocationInfo (blockFace, faceLocation, player, grids = [ 3 ], alert = false) {
        if (!(alert || this.debugOn)) return;

        const grid = new FaceLocationGrid(faceLocation, blockFace, player, false);

        this.log(`==> faceLocation: ${Vector3Lib.toString(faceLocation, 0, true)}`, true);
        for (let i = 2; i <= 16; i++) {
            if (grids.includes(i)) {
                const subGrid = grid.grid(i);
                const touched = subGrid.x + (i * subGrid.y);
                this.log(`==> grid-${i}: ${Vector2Lib.toString(subGrid)} / touched: ${touched}`, true);
            }
        }
    }
    /**
     * @param {BlockPermutation} permutation       
     * @param {string} title 
     * @param {boolean} alert
     */
    blockPermutationInfo (permutation, title = "§eBlock Permutation Info:", alert = false) {
        if (!(alert || this.debugOn)) return;

        const tags = permutation.getTags();
        const states = permutation.getAllStates();

        if (tags.length || states.length) {
            if (title) this.log(title, true);
            this.log(`==> §bBlock Permutation type.id:§r ${permutation.type.id}`, true);
            if (tags.length) this.listArray(tags, "§e==* permutation.getTags():", true);
            if (states.length) this.listObjectInnards(states, "§e==* permutation.getAllStates():", true);
        }
    }
}
