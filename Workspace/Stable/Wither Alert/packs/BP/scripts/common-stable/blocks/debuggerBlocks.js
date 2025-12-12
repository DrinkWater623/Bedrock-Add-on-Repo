// debugger-Class.js
// @ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 20250116 - Add Block from Ray Cast if different from View
            20251203 - Relocated
            20251207 - Relocated and renamed
            20251210 - Separated and fixed
========================================================================*/
import { BlockPermutation, Player, World, Block, Direction } from '@minecraft/server';
// shared
import { Vector2Lib, Vector3Lib } from '../tools/vectorClass.js';
import { FaceLocationGrid, } from "./blockFace.js";
import { Debugger } from '../tools/debuggerClass.js';
//==============================================================================
/** @typedef {import("@minecraft/server").Vector2} Vector2 */
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** @typedef {import("@minecraft/server").VectorXZ} VectorXZ */
//=============================================================================
// For Debugging
/**
 * Creates a new Debug object
 * @class
 */
export class DebuggerBlocks extends Debugger {
    /**
     * 
     * @param {BlockPermutation} permutation 
     * @param {World|Player} chatSend 
     * @param {string} title 
     * @param {boolean} override
     */
    listBlockStates (permutation, chatSend = this.chatSend, title = "Block States:", override = false) {
        if (override || this.debugOn) {
            const states = permutation?.getAllStates();
            if (!states) {
                this.log("Zero Block States", chatSend);
                return;
            }

            this.listObjectInnards(states, chatSend = this.chatSend, title);
        }
    };
    /**
     * 
     * @param {Block} block 
     * @param {World|Player} chatSend 
     * @param {string} title 
     * @param {boolean} override
     */
    blockInfo (block, chatSend = this.chatSend, title = "§eBlock Info:", override = false) {
        if (override || this.debugOn) {
            if (title) this.logPlain(title, chatSend);
            this.logPlain(`==> §aBlock typeId:§r ${block.typeId}`); //TODO: get display name from vanilla data
            this.logPlain(`==> §bBlock Location.:§r ${Vector3Lib.toString(block.location, 0, true, ',')}`);
            this.logPlain(`==> §bBlock Center :§r ${Vector3Lib.toString(block.center(), 1, true, ',')}`);
            this.blockPermutationInfo(block.permutation, chatSend, `${title} - Permutation`, true);

            //FIXME:  is this needed...
            //const item = block.getItemStack()
            //if (item) this.itemInfo(item,chatSend,`${title} - ItemStack`,true)
        }
    };
    /**
     * 
     * @param {Direction} blockFace 
     * @param {Vector3} faceLocation
     * @param {Player} player
     * @param {number[]} [grids=[3]]  
     */
    blockFaceLocationInfo (blockFace, faceLocation, player, grids = [ 3 ], override = false) {
        if (override || this.debugOn) {
            const grid = new FaceLocationGrid(faceLocation, blockFace, player, false);

            this.logPlain(`==> faceLocation: ${Vector3Lib.toString(faceLocation, 0, true)}`);
            for (let i = 2; i <= 16; i++) {
                if (grids.includes(i)) {
                    const subGrid = grid.grid(i);
                    const touched = subGrid.x + (i * subGrid.y);
                    this.logPlain(`==> grid-${i}: ${Vector2Lib.toString(subGrid)} / touched: ${touched}`);
                }
            }
        }
    };
    /**
     * 
     * @param {BlockPermutation} permutation 
     * @param {World|Player} chatSend 
     * @param {string} title 
     * @param {boolean} override
     */
    blockPermutationInfo (permutation, chatSend = this.chatSend, title = "§eBlock Permutation Info:", override = false) {
        if (override || this.debugOn) {
            const tags = permutation.getTags();
            const states = permutation.getAllStates();

            if (tags.length || states.length) {
                if (title) this.logPlain(title, chatSend);
                this.logPlain(`==> §bBlock Permutation type.id:§r ${permutation.type.id}`);
                if (tags.length) this.listArray(tags, chatSend, "§e==* permutation.getTags():");
                if (states.length) this.listObjectInnards(states, chatSend, "§e==* permutation.getAllStates():");
            }
        }
    };
}
/**
 * 
 * @param {number} angle angle in degrees
 * @param {boolean} cardinal NSEW only : default true
 * @returns {string} direction words
 */
function y_rotationName (angle = 0, cardinal = true) {
    const dirs = [ "S", "S W", "W", "N W", "N", "N E", "E", "S E", "S" ];
    const divisor = cardinal ? 4 : 8;
    let dir = Math.round(angle / (360 / divisor));
    if (dir < 0) dir += divisor;
    const text = dirs[ dir ]
        .replace("N", "north")
        .replace("S", "south")
        .replace("E", "east")
        .replace("W", "west")
        .replace(" ", "-");
    return text;
}