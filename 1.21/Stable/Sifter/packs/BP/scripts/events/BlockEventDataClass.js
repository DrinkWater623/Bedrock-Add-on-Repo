//@ts-check
import { BlockPermutation, EquipmentSlot, Player, PlayerInteractWithBlockBeforeEvent, PlayerPlaceBlockBeforeEvent, world } from "@minecraft/server";
import { dev, alertLog, watchFor, chatLog, globals } from '../settings.js';
import { PlayerLib } from "../commonLib/playerClass.js";
import { FaceLocationGrid, Vector2Lib } from "../commonLib/vectorClass.js";
import {

    getAdjacentBlock,

    getBlockState
} from "../fn-stable.js";
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
*/
//==============================================================================
/**
 * @summary Beta
 */
//==============================================================================
//need a class to hold the info I need, to be able to test between piwb abd ppb
export class PlayerPlaceOrInteractBeforeEventData {

    /**
     *
     * @param {PlayerPlaceBlockBeforeEvent | PlayerInteractWithBlockBeforeEvent} event
     */
    constructor(event, debug = false) {
        this.player = event.player;

        //-----------------------------------
        //Item held , being placed, mail hand
        //-----------------------------------
        this.itemStack =
            event instanceof PlayerInteractWithBlockBeforeEvent ?
                event.itemStack :
                event.permutationBeingPlaced.getItemStack();

        this.itemTyeID =
            typeof this.itemStack == 'object' ? this.itemStack.typeId : "error";

        this.itemCount = this.itemStack?.amount;

        //possible item permutations
        const tempPermutation = BlockPermutation.resolve(this.itemTyeID);
        this.itemStates = tempPermutation.getAllStates();

        //---------------------------------------------------------
        // The block that was interacted with to start either event
        //---------------------------------------------------------
        this.touchBlock =
            event instanceof PlayerInteractWithBlockBeforeEvent ?
                event.block :
                getAdjacentBlock(event.block, event.face, debug) ?? event.block;
        //should NEVER have to use that 3rd option  - Test making it fail

        this.touchFace = (
            event instanceof PlayerInteractWithBlockBeforeEvent ?
                event.blockFace :
                event.face)
            .toLowerCase();

        //How is the current block oriented via permutations
        //const stateName = 'minecraft:block_face';
        //this.blockFaceTrait = getBlockState(event.block, stateName, 'string', false)?.toString() ?? this.blockFace;
        //getAllStates(): Record<string, string | number | boolean>
        this.touchBlockStates = this.touchBlock.permutation.getAllStates();

        this.keyMap = new Map()
        //--------------
        // Point touched
        //--------------
        this.faceLocation = event.faceLocation;

        const faceLocationInfo = new FaceLocationGrid(this.touchBlock, this.faceLocation, this.touchFace);
        this.verticalHalf = faceLocationInfo.verticalHalf == 0 ? 'top' : 'bottom';
        this.horizontalHalf = faceLocationInfo.horizontalHalf == 0 ? 'left' : 'right';
        this.grid_2x2 = faceLocationInfo.grid(2);
        this.grid_3x3 = faceLocationInfo.grid(3);
        this.grid_4x4 = faceLocationInfo.grid(4);

        if (debug)
            this.infoShow();
    }
    infoShow () {
        world.sendMessage('\n')
        //-------------
        chatLog.log("§bBlock Info");
        world.sendMessage(`  ==>§a Touched Block:§6 ${this.touchBlock.typeId} `);
        world.sendMessage(`  ==>§e Touched Where:§6 ${this.touchFace}-side   §bver/hor: ${this.verticalHalf}-${this.horizontalHalf}`);
        world.sendMessage(`  ==>§b Grid(3x3): ${Vector2Lib.toString(this.grid_3x3,0,true)}`);
        world.sendMessage(`  ==>§b Grid(4x4): ${Vector2Lib.toString(this.grid_4x4,0,true)}`);

        if (Object.keys(this.touchBlockStates).length > 0) {
            world.sendMessage(`  ==>§d Block States :`);
            for (const [ key, value ] of Object.entries(this.touchBlockStates)) {
                world.sendMessage(`  =====>§f ${key}:§6 ${value}`);
            }        
        }
        
        world.sendMessage('\n')
        chatLog.log("§bItem Info");
        world.sendMessage(`  ==>§a Item In Hand :§f ${this.itemCount} §6${this.itemTyeID}`);

        if (Object.keys(this.itemStates).length > 0) {
            world.sendMessage(`  ==>§d Item's Block States (§fDefaults§d):`);
            for (const [ key, value ] of Object.entries(this.itemStates)) {
                world.sendMessage(`  =====>§f ${key}:${value}`);
            }
        }        
    }
}
