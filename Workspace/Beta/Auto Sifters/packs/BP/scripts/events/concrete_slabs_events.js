//@ts-check
import { BlockPermutation, EquipmentSlot, Player, world } from "@minecraft/server";
import { watchFor, chatLog, globals, alertLog, pack } from '../settings.js';
import { PlayerLib } from "../commonLib/playerClass.js";
import {
    slabTypeIDSansHeight,
    slabTypeIDHeight,
    placeBlock,
    placeDw623Slab,
    getPerpendicularFace,
    replaceDw623Slab
} from "../fn-stable.js";
import { SlabBeforeEventData } from "./SlabEventDataClass.js";
//=============================================================================
/*
    Written By:     "https://github.com/DrinkWater623"

    Last Update:    20241209 - created*/

//==============================================================================
/**
 * 
 * @param {SlabBeforeEventData} event 
 * @param {boolean} [debug=false] 
 * @returns 
 */
export function concrete_slabs_playerPlaceOrIntersectBlock_Handler (event, debug = false) {

    if (!event.player || !event.player.isValid())
        return false;    

    chatLog.send(event.player, '', debug);
    chatLog.log(`\n§gRedirect§b Concrete Slabs beforePlayerInteractWithBlock:§r `, debug);
    chatLog.send(event.player, `  ==> §aog Event ${event.placeBlockEvent ? 'Place Block' : 'Interact'}`, debug);

    // Nothing
    if (!event.itemTyeId)
        return false;

    //Touched Concrete Slab in same family and same facing for possible combine
    const slabFamily = event.itemFamily;

    if (event.touchBlock.typeId.startsWith(event.itemFamily) &&
        event.blockFaceTrait == event.touchFace) {
        return placeAdjacentSameFamilySameFaceSlab(event, debug);
    }

    // concrete-slab
    if (debug)
        if (watchFor.customConcreteSlabInfo.some(p => p.typeId == event.touchBlock.typeId)) {
            world.sendMessage('  ==> Another dw623 concrete slab');
        }
        else {
            world.sendMessage('  ==> Regular-ish Block');
        }

    /*
        if middle of grid, then goes on flat, like block is defined
        so let block handle it
        grid is 3x4
        002
        012
        222        
    */
    //==================================
    //reasons to use Blocks Permutations 
    //==================================
    // touch point is in middle
    if (event.middle_g4) {
        chatLog.log('§dMiddle of Grid - return to BP');
        return false;
    }
    //TODO: fix for if touchBlock is a vanilla slab
    //check for states for mc slabs
    //==================================
    //ok...
    return placeAdjacentOtherBlock(event, debug);
}
//==============================================================================
/**
 * 
 * @param {SlabBeforeEventData} event 
 * @param {boolean} debug 
 */
function placeAdjacentSameFamilySameFaceSlab (event, debug = false) {

    if (!event.player || !event.player.isValid())
        return false;

    if (debug) world.sendMessage(`\n§d* placeAdjacentSameFamilySameFaceSlab()`);

    const blockFaceTrait = event.blockFaceTrait
    //===============================================================
    // Same Face
    //===============================================================

    const currentSlabHeight = slabTypeIDHeight(event.touchBlock.typeId);
    const heldSlabHeight = slabTypeIDHeight(event.itemTyeId);

    chatLog.log(`  ==> Slab Height: ${currentSlabHeight}`, debug);
    chatLog.log(`  ==> Held Slab Height: ${heldSlabHeight}`, debug);

    const newHeight = currentSlabHeight + heldSlabHeight;
    if (newHeight <= 16) {
        chatLog.log(`  §b==> Try to Combine to ${newHeight}`, debug);

        let success = false;
        if (newHeight == 16) {
            const newBlockTypeId = event.itemFamily.replace(globals.mainNameSpace, globals.minecraftNameSpace).replace('_slab', '');
            success = placeBlock(event.touchBlock, newBlockTypeId);
        }
        else {
            const newSlabTypeId = `${event.itemFamily}_${newHeight}`;
            const newSlabPermutation = BlockPermutation.resolve(newSlabTypeId, { 'minecraft:block_face': event.blockFaceTrait });
            success = replaceDw623Slab(event.touchBlock, newSlabTypeId, event.blockFaceTrait);
        }

        if (success) {
            chatLog.success(`  ==> Placement Success`, debug);
            event.ogEvent.cancel = true;
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
function placeAdjacentOtherBlock (event, debug = false) {
    if (!event.player || !event.player.isValid())
        return false;

    chatLog.send(event.player, `\n§d* placeAdjacentOtherBlock()`, debug);

    const newBlock = event.newBlock;
    if (!newBlock) {
        chatLog.send(event.player, `  ==> Failed Getting Adjacent Block`, debug);
        return false;
    }

    if (newBlock.typeId != globals.mcAir) {
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
        chatLog.send(event.player, `  §b==> Opposite or Same Face: ${event.blockFaceTrait} / ${event.touchFace}`, debug);

        //if opposite, check grid for other types of placement
        if (event.blockFaceTrait != event.touchFace ||
            event.touchBlock.typeId.startsWith(globals.minecraftNameSpace)
        ) {
            const grid = event.grid_4x4;
            //since on backside, see if need to be perpendicular
            if (grid.y == 0)
                newBlockFace = 'down';
            else if (grid.y == 3)
                newBlockFace = 'up';
            else if (grid.x == 0)
                newBlockFace = getPerpendicularFace(event.touchFace, 0);
            else if (grid.x == 3)
                newBlockFace = getPerpendicularFace(event.touchFace, 1);

            if (event.blockFaceTrait != event.touchFace)
                chatLog.send(event.player, `  §b==> Opposite Face (${newBlockFace}) chosen`, debug);
            else
                chatLog.send(event.player, `  §f==> MC Block (${newBlockFace}) chosen`, debug);
        }
        else
            chatLog.send(event.player, `  §b==> Same Face`, debug);
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
        chatLog.send(event.player, `  §2==> New Block will be on Block Face ${newBlockFace}`, debug);
        event.ogEvent.cancel = true;
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