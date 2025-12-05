//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
/**
 * This is made specifically to gether info needed to process slabs and tiles
 * before interacting with/placing
 * that can be placed vertically , etc...
 */
import { Block, BlockPermutation, Direction, ItemStack, Player } from "@minecraft/server";
import { chatLog, pack } from '../settings.js';
import { FaceLocationGrid, Vector2Lib, Vector3Lib } from "../common-stable/tools/vectorClass.js";
import { getAdjacentBlock, getBlockState, slabTypeIDHeight, slabTypeIDSansHeight } from "../fn-stable.js";
//=============================================================================
/** @typedef {import("@minecraft/server").Vector2} Vector2 */
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** @typedef {import("@minecraft/server").VectorXZ} VectorXZ */
//=============================================================================
/*
    Written By:     "https://github.com/DrinkWater623"

    Reason: I need to see which is better for placing a custom slab that
            is smoother. Currently the Interact version double places then removes 
            with the cancel.  Not sure who is placing, removing.
            If I use the interact, then I have to cancel the placing and
            cancel subsequent interacts via isFirst...
            So long story short, how I get the info from each event is slight
            different, so I created this to pull/hold from either and will use that
            for each test.

    Last Update:    20241209 - created
                    20241215 - Oh, forgot to fill this in.. big WIP
*/
//==============================================================================
/**
 * Technically do not need to combine events anymore since just using Interact
 * works best... but keeping as is, in case I need to test with PlaceBlock
 */
//==============================================================================
export class SlabBeforeEventData {

    /**
     * @param {Player} player 
     * @param {ItemStack} itemStack 
     * @param {Block} block 
     * @param {string} blockFace 
     * @param {Vector3} faceLocation 
     * @param {string} eventTypeId 
     */
    constructor(player, itemStack, block, blockFace, faceLocation, eventTypeId, debug = false) {
        this.placeBlockEvent = eventTypeId == 'PlayerPlaceBlockBeforeEvent';
        this.cancel = false;

        this.player = player;
        //-----------------------------------
        // Item held , being placed, mail hand
        //-----------------------------------
        // since this is made for my slabs, naming convention should be dw623...slab (_# or plain)  
        // not tile, tiles/wallpaper are only for block-face placement
        this.itemStack = itemStack;
        this.itemTyeId = this.itemStack.typeId;
        this.itemCount = this.itemStack.amount;

        //because this is handling also for placing item on top or bottom of slab, like lantern/torch        

        if (this.itemTyeId.startsWith('dw623:') && this.itemTyeId.includes('_slab_')) {
            this.itemFamily = slabTypeIDSansHeight(this.itemTyeId);
            this.itemHeight = slabTypeIDHeight((this.itemTyeId));

            // My Slabs use minecraft:block_face
            // If I ever make a purely vanilla one, then there will be another handler for that.
            const tempPermutation = BlockPermutation.resolve(this.itemTyeId);

            if (!tempPermutation.getState('minecraft:block_face')) {
                throw new Error('ItemStack is missing state (block trait) minecraft:block_face');
            }
        }
        else {
            this.itemFamily = '';
            this.itemHeight = 0;
        }
        //since my slabs.. should have correct block trait

        //---------------------------------------------------------
        // The block that was interacted with to start either event
        //--------------------------------------------------------- 
        this.touchBlock = block;

        this.touchFace = blockFace;

        if (this.touchBlock.typeId.startsWith(pack.packNameSpace) && this.touchBlock.typeId.includes('_slab_')) {
            //if (watchFor.customConcreteSlabInfo.some(p => p.typeId == this.touchBlock.typeId)) {
            this.touchBlockFamily = slabTypeIDSansHeight(this.touchBlock.typeId);
            this.touchBlockHeight = slabTypeIDHeight((this.touchBlock.typeId));
        }
        else {
            this.touchBlockFamily = '';
            this.touchBlockHeight = 0;
        }

        //How is the current block oriented via permutations
        //if my slab
        this.blockFaceTrait = this.touchFace;
        let bf = getBlockState(block, 'minecraft:block_face', 'string', false);

        if (bf && typeof bf == 'string') {
            this.blockFaceTrait = bf;
        }
        //mc slab
        else {
            let vh = getBlockState(block, 'minecraft:vertical_half', 'string', false);
            if (vh && typeof vh == 'string') {
                this.blockFaceTrait = vh == 'top' ? "down" : 'up';
            }
        }

        //getAllStates(): Record<string, string | number | boolean>
        this.touchBlockStates = this.touchBlock.permutation.getAllStates();

        //Block where item or new block should go
        this.newBlock =
            this.placeBlockEvent ?
                block :
                getAdjacentBlock(block, blockFace, false, debug) ?? block;

        //--------------
        // Point touched
        //--------------
        const faceLocationInfo = new FaceLocationGrid(faceLocation, this.touchFace);
        this.verticalHalf = faceLocationInfo.verticalHalf == 0 ? 'top' : 'bottom';
        this.horizontalHalf = faceLocationInfo.horizontalHalf == 0 ? 'left' : 'right';
        this.grid_4x4 = faceLocationInfo.grid(4);
        this.middle_g4 = [ 1, 2 ].includes(this.grid_4x4.x) && [ 1, 2 ].includes(this.grid_4x4.y);

        if (debug)
            this.#infoShow();
    }
    #infoShow () {
        this.player.sendMessage('\n');
        //-------------
        chatLog.log("§dTouched Block Info");
        if (this.touchBlockFamily) {
            this.player.sendMessage(`  ==>§a Family:§6 ${this.touchBlockFamily} `);
            this.player.sendMessage(`  ==>§b Height:§6 ${this.touchBlockHeight} `);
        }
        else
            this.player.sendMessage(`  ==>§a Block:§6 ${this.touchBlock.typeId} `);

        this.player.sendMessage(`  ==>§e Where:§6 ${this.touchFace} face  §b ver/hor:§r ${this.verticalHalf}-${this.horizontalHalf}`);
        //this.player.sendMessage(`  ==>§b Grid(3x3): ${Vector2Lib.toString(this.grid_3x3, 0, true)}`);
        this.player.sendMessage(`  ==>§b Grid(4x4): ${Vector2Lib.toString(this.grid_4x4, 0, true)}`);

        if (Object.keys(this.touchBlockStates).length > 0) {
            this.player.sendMessage(`  ==>§d Block States :`);
            for (const [ key, value ] of Object.entries(this.touchBlockStates)) {
                this.player.sendMessage(`  =====>§f ${key}:§6 ${value}`);
            }
        }

        this.player.sendMessage('\n');
        chatLog.log("§dItem Held Info");
        if (this.itemTyeId != this.itemFamily) {
            this.player.sendMessage(`  ==>§a Family :§6 ${this.itemFamily}`);
            this.player.sendMessage(`  ==>§b Height :§f ${this.itemHeight}`);
        }
        else
            this.player.sendMessage(`  ==>§a Item In Hand :§f ${this.itemCount} §6${this.itemTyeId}`);

        this.player.sendMessage('\n');
        chatLog.log("§dGeo Location");
        this.player.sendMessage(`  ==>§b Touched Block: ${Vector3Lib.toString(this.touchBlock.location, 0, true, ',')}`);
        this.player.sendMessage(`  ==>§a New Block Space: ${Vector3Lib.toString(this.newBlock.location, 0, true, ',')}`);
        this.player.sendMessage(`  ==>§e In space where new block would go:§6 ${this.newBlock.typeId}`);
    }
}
//=============================================================================
// End of File
//=============================================================================