// debuggerBlocks.js
// @ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20250116 - Add Block from Ray Cast if different from View
    20251203 - Relocated
    20251207 - Relocated and renamed
    20251210 - Separated and fixed
    20251213 - Added subscription, event and customComponent properties to toggle and use for debug messages
    20251213b- Convert to console messages only
    20251214 - Better AllOff and AnyOns
========================================================================*/
import { BlockPermutation, Player, World, Block, Direction, world } from '@minecraft/server';
// shared
import { Vector2Lib, Vector3Lib } from '../tools/vectorClass.js';
import { Debugger } from './debuggerClass.js';
import { FaceLocationGrid, } from "../blocks/blockFace.js";
//==============================================================================
/** @typedef {import("@minecraft/server").Vector2} Vector2 */
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** @typedef {import("@minecraft/server").VectorXZ} VectorXZ */
//=============================================================================
/*
world.afterEvents.blockExplode.subscribe( (ev) => {});
world.afterEvents.buttonPush.subscribe( (ev) => {});
world.afterEvents.leverAction.subscribe( (ev) => {});
world.afterEvents.pistonActivate.subscribe( (ev) => {});
world.afterEvents.playerBreakBlock.subscribe( (ev) => {});
world.afterEvents.playerInteractWithBlock.subscribe( (ev) => {});
world.afterEvents.playerPlaceBlock.subscribe( (ev) => {});
world.afterEvents.pressurePlatePop.subscribe( (ev) =>{});
world.afterEvents.pressurePlatePush.subscribe( (ev) =>{});
world.afterEvents.targetBlockHit.subscribe( (ev) =>{});
world.afterEvents.tripWireTrip.subscribe( (ev) =>{});
*/
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
            afterLeverAction: false,
            afterPistonActivate: false,
            playerBreakBlock: { before: false, after: false },
            playerInteractWithBlock: { before: false, after: false },
            playerPlaceBlock: { before: false, after: false },
            pressurePlatePopAfter: false,
            pressurePlatePushAfter: false,
            targetBlockHitAfter: false,
            tripWireTripAfter: false,
        });
        Object.assign(this.customComponents, {
            customComponentsOn: false,
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
    //--------------------------------------------------------------------------
    /**
     * 
     * @param {BlockPermutation} permutation 
     * @param {string} title 
     * @param {boolean} override
     */
    listBlockStates (permutation, title = "Block States:", override = false) {
        if (!(override || this.debugOn)) return;

        const states = permutation?.getAllStates();
        if (!states) {
            this.log("Zero Block States", true);
            return;
        }

        this.listObjectInnards(states, title, true);
    };
    /**
     * 
     * @param {Block} block      
     * @param {string} title 
     * @param {boolean} override
     */
    blockInfo (block, title = "§eBlock Info:", override = false) {
        if (!(override || this.debugOn)) return;

        if (title) this.log(title, true);
        this.log(`==> §aBlock typeId:§r ${block.typeId}`, true); //TODO: get display name from vanilla data
        this.log(`==> §bBlock Location.:§r ${Vector3Lib.toString(block.location, 0, true, ',')}`, true);
        this.log(`==> §bBlock Center :§r ${Vector3Lib.toString(block.center(), 1, true, ',')}`, true);
        this.blockPermutationInfo(block.permutation, `${title} - Permutation`, true);

        //FIXME:  is this needed...
        //const item = block.getItemStack()
        //if (item) this.itemInfo(item,chatSend,`${title} - ItemStack`,true)
    };
    /**
     * 
     * @param {Direction} blockFace 
     * @param {Vector3} faceLocation
     * @param {Player} player
     * @param {number[]} [grids=[3]]  
     */
    blockFaceLocationInfo (blockFace, faceLocation, player, grids = [ 3 ], override = false) {
        if (!(override || this.debugOn)) return;

        const grid = new FaceLocationGrid(faceLocation, blockFace, player, false);

        this.log(`==> faceLocation: ${Vector3Lib.toString(faceLocation, 0, true)}`, true);
        for (let i = 2; i <= 16; i++) {
            if (grids.includes(i)) {
                const subGrid = grid.grid(i);
                const touched = subGrid.x + (i * subGrid.y);
                this.log(`==> grid-${i}: ${Vector2Lib.toString(subGrid)} / touched: ${touched}`, true);
            }
        }
    };
    /**
     * 
     * @param {BlockPermutation} permutation       
     * @param {string} title 
     * @param {boolean} override
     */
    blockPermutationInfo (permutation, title = "§eBlock Permutation Info:", override = false) {
        if (!(override || this.debugOn)) return;

        const tags = permutation.getTags();
        const states = permutation.getAllStates();

        if (tags.length || states.length) {
            if (title) this.log(title, true);
            this.log(`==> §bBlock Permutation type.id:§r ${permutation.type.id}`, true);
            if (tags.length) this.listArray(tags, "§e==* permutation.getTags():", true);
            if (states.length) this.listObjectInnards(states, "§e==* permutation.getAllStates():", true);
        }

    };
}
