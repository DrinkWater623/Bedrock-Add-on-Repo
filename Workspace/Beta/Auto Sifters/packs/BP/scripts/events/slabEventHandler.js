//@ts-check
import { BlockPermutation, world } from "@minecraft/server";
import { chatLog, globals, alertLog,pack } from '../settings.js';
import { PlayerLib } from "../commonLib/playerClass.js";
import {    
    placeBlock,
    placeDw623Slab,
    getPerpendicularFace,
    replaceDw623Slab
} from "../fn-stable.js";
import { SlabBeforeEventData } from "../class/SlabEventDataClass.js";
//=============================================================================
/*
    Written By:     "https://github.com/DrinkWater623"

    Last Update:    20241217 - Lotsa Stuff
*/
//==============================================================================
/**
 * 
 * @param {SlabBeforeEventData} event 
 * @param {boolean} [debug=false] 
 * @returns 
 */
export function slabEventHandler (event, debug = false) {

    if (
        (!event.player || !event.player.isValid()) ||
        !event.itemTyeId ||
        (!event.touchBlockHeight && !event.itemHeight)
    )
        return false;

    chatLog.send(event.player, `\n§v§lEvent Redirected to §b§lDW623 Slab Event Handler for §f§l ${event.placeBlockEvent ? 'beforeEvents.playerPlaceBlock' : 'beforeEvents.playerInteractWithBlock'}\n`, debug);

    if (
        event.touchBlockFamily == event.itemFamily &&
        event.blockFaceTrait == event.touchFace &&
        event.middle_g4
    ) {
        if (event.touchBlockHeight + event.itemHeight > 16)
            return false;

        return placeCombinableSlab(event, debug);
    }

    // concrete-slab
    // if (debug)
    //     if (watchFor.customConcreteSlabInfo.some(p => p.typeId == event.touchBlock.typeId)) {
    //         world.sendMessage('  ==> Another dw623 concrete slab');
    //     }
    //     else {
    //         world.sendMessage('  ==> Regular-ish Block');
    //     }

    //==================================
    //reasons to use Block's Permutations 
    //==================================
    // touch point is in middle
    if (event.middle_g4) {
        chatLog.log('§dMiddle of Touched Face Grid - Let BP Do it',debug);
        return false;
    }
    //TODO: fix for if touchBlock is a vanilla slab
    //check for states for mc slabs
    //==================================
    //ok...
    return placeAdjacentSlab(event, debug);
}
//==============================================================================
/**
 * 
 * @param {SlabBeforeEventData} event 
 * @param {boolean} debug 
 */
function placeCombinableSlab (event, debug = false) {

    if (!event.player || !event.player.isValid())
        return false;

    if (debug) world.sendMessage(`\n§d* placeCombinableSlab()`);

    const blockFaceTrait = event.blockFaceTrait;
    //===============================================================
    // Same Face
    //===============================================================

    const currentSlabHeight = event.touchBlockHeight; //slabTypeIDHeight(event.touchBlock.typeId);
    const heldSlabHeight = event.itemHeight; //slabTypeIDHeight(event.itemTyeId);

    // chatLog.log(`  ==> Slab Height: ${currentSlabHeight}`, debug);
    // chatLog.log(`  ==> Held Slab Height: ${heldSlabHeight}`, debug);

    const newHeight = currentSlabHeight + heldSlabHeight;
    if (newHeight <= 16) {
        chatLog.log(`  §b==> Try to Combine to ${newHeight}`, debug);

        let success = false;
        if (newHeight == 16) {
            const newBlockTypeId = event.itemFamily.replace(pack.packNameSpace, globals.mcNameSpace).replace('_slab', '');
            success = placeBlock(event.touchBlock, newBlockTypeId);
        }
        else {
            const newSlabTypeId = `${event.itemFamily}_${newHeight}`;            
            success = replaceDw623Slab(event.touchBlock, newSlabTypeId, event.blockFaceTrait);
        }

        if (success) {
            chatLog.success(`  ==> Placement Success`, debug);
            event.cancel = true;
            PlayerLib.mainHandRemoveOne(event.player, false);
            return true;
        }
        else {
            alertLog.warn(`  ==> Block Not Placed`, debug);
            return false;
        }
    }
    else {
        chatLog.warn(`  ==> Too Big to Combine to ${newHeight}`);
        //technically cannot connect to other block, so has to go flat
        //use block's permutations
        return false; //placeAdjacentOtherBlock(event, debug);
    }
}
//==============================================================================
/**
 * 
 * @param {SlabBeforeEventData} event 
 * @param {boolean} debug 
 */
function placeAdjacentSlab (event, debug = false) {
    if (!event.player || !event.player.isValid())
        return false;

    chatLog.send(event.player, `\n§d* placeAdjacentSlab()`, debug);

    const newBlock = event.newBlock;
    if (!newBlock) {
        chatLog.send(event.player, `  ==> Failed Getting Adjacent Block`, debug);
        return false;
    }

    if (!newBlock.isAir) {
        chatLog.send(event.player, `  ==> New Block Space Must be Air`, debug);
        return false;
    }

    let newBlockFace = event.touchFace;
    //===============================================================
    // Opposites - just place block normally
    //===============================================================
    //remember vanilla or non slab blocks s/b same side faces
    //this will catch those and other slabs where interact is back side of block
    //other side cannot connect, so the special placement will not be allowed
    //player will have to work out a way to place the block... only touching can do the sideways stuff
    //which means this is where you stop opposite face on things like lanterns ??I think TODO:
    if (
        ([ 'up', 'down' ].includes(event.blockFaceTrait) && [ 'up', 'down' ].includes(event.touchFace)) ||
        ([ 'north', 'south' ].includes(event.blockFaceTrait) && [ 'north', 'south' ].includes(event.touchFace)) ||
        ([ 'east', 'west' ].includes(event.blockFaceTrait) && [ 'east', 'west' ].includes(event.touchFace))
    ) {
        chatLog.send(event.player, `  §f==> Opposite or Same Face: §a${event.blockFaceTrait} / ${event.touchFace}`, debug);

        //if opposite, check grid for other types of placement
        // if (event.blockFaceTrait != event.touchFace || event.touchBlock.typeId.startsWith(globals.mcNameSpace)) {
            
            const grid = event.grid_4x4;
            const flat=[ 'up', 'down' ].includes(event.touchFace)
            //since on backside, see if need to be perpendicular
            if (grid.y == 0)
                newBlockFace = flat ? 'south' : 'down';
            else if (grid.y == 3)
                newBlockFace = flat ? 'north' : 'up';
            else if (grid.x == 0)
                newBlockFace = flat ? 'east' : getPerpendicularFace(event.touchFace, 0);
            else if (grid.x == 3)
                newBlockFace = flat ? 'west' : getPerpendicularFace(event.touchFace, 1);

            chatLog.send(event.player, `  §f==> Placed Block Face Trait will be §a${newBlockFace}`, debug);
        // }
        // else
        //     chatLog.send(event.player, `  §b==> Same Face`, debug);
    }
    //===============================================================
    // Sides
    //===============================================================
    else {
        chatLog.send(event.player, `  §b==> Perpendicular Face: ${event.blockFaceTrait} against ${event.touchFace}`, debug);
        newBlockFace = event.blockFaceTrait;
    }
    //Interact on side part?  Add next to (eventFace side), same permutation (currentBlockFace)    

    if (placeDw623Slab(newBlock, event.itemTyeId, newBlockFace, true, debug)) {        
        event.cancel = true;
        PlayerLib.mainHandRemoveOne(event.player, false);
        return true;
    }
    else {
        world.sendMessage(`3`);
        chatLog.send(event.player, `§c  xxx> Block Placement Failed`, debug);
        return false;
    }
}
//==============================================================================
// End of File
//==============================================================================