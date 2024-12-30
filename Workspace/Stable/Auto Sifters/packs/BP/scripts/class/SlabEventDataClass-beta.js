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
import { BlockPermutation, PlayerInteractWithBlockBeforeEvent, PlayerPlaceBlockBeforeEvent } from "@minecraft/server";
import { chatLog } from '../settings.js';
import {  slabTypeIDHeight, slabTypeIDSansHeight } from "../fn-stable.js";
import { FaceLocationGrid, Vector2Lib, Vector3Lib } from "../common-stable/vectorClass.js";
import { getAdjacentBlock ,getBlockState} from "../common-stable/blockLib-stable.js";
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
     * @remark Events are Stable stable, onlyPlayerPlaceBlockBeforeEventSignal is Beta
     * @param {PlayerPlaceBlockBeforeEvent | PlayerInteractWithBlockBeforeEvent} event
     */
    constructor(event, debug = false) {
        this.ogEvent = event;
        this.placeBlockEvent = (event instanceof PlayerPlaceBlockBeforeEvent);
        this.cancel = false;

        this.player = event.player;
        //-----------------------------------
        // Item held , being placed, mail hand
        //-----------------------------------
        // since this is made for my slabs, naming convention should be dw623...slab (_# or plain)  
        // not tile, tiles/wallpaper are only for block-face placement
        this.itemStack =
            event instanceof PlayerInteractWithBlockBeforeEvent ?
                event.itemStack :
                event.permutationBeingPlaced.getItemStack();

        this.itemTyeId =
            typeof this.itemStack == 'object' ? this.itemStack.typeId : "error";

        this.itemCount = this.itemStack?.amount;

        //because this is handling also for placing item on top or bottom of slab, like lantern/torch
        this.itemFamily = '';
        this.itemHeight = 0;

        if (this.itemTyeId.startsWith('dw623:') && this.itemTyeId.includes('_slab_')) {
            this.itemFamily = slabTypeIDSansHeight(this.itemTyeId);
            this.itemHeight = slabTypeIDHeight((this.itemTyeId));

            //     event.cancel = true;
            //     throw new Error(`This Event is only for dw623 slabs: Block Name Formatted Incorrectly: ${this.itemTyeId}`);
            // }

            // My Slabs use minecraft:block_face
            // If I ever make a purely vanilla one, then there will be another handler for that.
            const tempPermutation = BlockPermutation.resolve(this.itemTyeId);

            if (!tempPermutation.getState('minecraft:block_face')) {
                event.cancel = true;
                throw new Error('ItemStack is missing state (block trait) minecraft:block_face');
            }
        }
        //since my slabs.. should have correct block trait

        //---------------------------------------------------------
        // The block that was interacted with to start either event
        //--------------------------------------------------------- 
        this.touchBlock =
            event instanceof PlayerInteractWithBlockBeforeEvent ?
                event.block :
                getAdjacentBlock(event.block, event.face, true, debug) ?? event.block;
        //should NEVER have to use that 3rd option  - Test making it fail

        this.touchFace = (
            event instanceof PlayerInteractWithBlockBeforeEvent ?
                event.blockFace :
                event.face)
            .toLowerCase();

        if (this.touchBlock.typeId.startsWith('dw623:') && this.touchBlock.typeId.includes('_slab_')) {
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
        let bf = getBlockState(event.block, 'minecraft:block_face', 'string', false);

        if (bf && typeof bf == 'string') {
            this.blockFaceTrait = bf;
        }
        //mc slab
        else {
            let vh = getBlockState(event.block, 'minecraft:vertical_half', 'string', false);
            if (vh && typeof vh == 'string') {
                this.blockFaceTrait = vh == 'top' ? "down" : 'up';
            }
        }

        const bfx = typeof bf == 'string' ? bf : this.touchFace;

        //getAllStates(): Record<string, string | number | boolean>
        this.touchBlockStates = this.touchBlock.permutation.getAllStates();

        //Block where item or new block should go
        this.newBlock =
            event instanceof PlayerInteractWithBlockBeforeEvent ?
                getAdjacentBlock(event.block, event.blockFace, false, debug) ?? event.block :
                event.block;

        this.keyMap = new Map();
        //--------------
        // Point touched
        //--------------
        //this.faceLocation = event.faceLocation;

        //@ts-ignore    
        const faceLocationInfo = new FaceLocationGrid(event.faceLocation, this.touchFace);
        this.verticalHalf = faceLocationInfo.verticalHalf == 0 ? 'top' : 'bottom';
        this.horizontalHalf = faceLocationInfo.horizontalHalf == 0 ? 'left' : 'right';
        //this.grid_2x2 = faceLocationInfo.grid(2);
        //this.grid_3x3 = faceLocationInfo.grid(3);
        this.grid_4x4 = faceLocationInfo.grid(4);
        //this.middle_g3 = this.grid_3x3.x == 2 && this.grid_3x3.y == 2;
        this.middle_g4 = [ 1, 2 ].includes(this.grid_4x4.x) && [ 1, 2 ].includes(this.grid_4x4.y);

        if (debug)
            this.#infoShow();
    }
    #infoShow () {
        this.ogEvent.player.sendMessage('\n');
        //-------------
        chatLog.log("§dTouched Block Info");
        if (this.touchBlockFamily) {
            this.ogEvent.player.sendMessage(`  ==>§a Family:§6 ${this.touchBlockFamily} `);
            this.ogEvent.player.sendMessage(`  ==>§b Height:§6 ${this.touchBlockHeight} `);
        }
        else
            this.ogEvent.player.sendMessage(`  ==>§a Block:§6 ${this.touchBlock.typeId} `);

        this.ogEvent.player.sendMessage(`  ==>§e Where:§6 ${this.touchFace} face  §b ver/hor:§r ${this.verticalHalf}-${this.horizontalHalf}`);
        //this.ogEvent.player.sendMessage(`  ==>§b Grid(3x3): ${Vector2Lib.toString(this.grid_3x3, 0, true)}`);
        this.ogEvent.player.sendMessage(`  ==>§b Grid(4x4): ${Vector2Lib.toString(this.grid_4x4, 0, true)}`);

        if (Object.keys(this.touchBlockStates).length > 0) {
            this.ogEvent.player.sendMessage(`  ==>§d Block States :`);
            for (const [ key, value ] of Object.entries(this.touchBlockStates)) {
                this.ogEvent.player.sendMessage(`  =====>§f ${key}:§6 ${value}`);
            }
        }

        this.ogEvent.player.sendMessage('\n');
        chatLog.log("§dItem Held Info");
        if (this.itemTyeId != this.itemFamily) {
            this.ogEvent.player.sendMessage(`  ==>§a Family :§6 ${this.itemFamily}`);
            this.ogEvent.player.sendMessage(`  ==>§b Height :§f ${this.itemHeight}`);
        }
        else
            this.ogEvent.player.sendMessage(`  ==>§a Item In Hand :§f ${this.itemCount} §6${this.itemTyeId}`);

        this.ogEvent.player.sendMessage('\n');
        chatLog.log("§dGeo Location");
        this.ogEvent.player.sendMessage(`  ==>§b Touched Block: ${Vector3Lib.toString(this.touchBlock.location, 0, true, ',')}`);
        this.ogEvent.player.sendMessage(`  ==>§a New Block Space: ${Vector3Lib.toString(this.newBlock.location, 0, true, ',')}`);
        this.ogEvent.player.sendMessage(`  ==>§e In space where new block would go:§6 ${this.newBlock.typeId}`);
    }
}
//=============================================================================
// End of File
//=============================================================================