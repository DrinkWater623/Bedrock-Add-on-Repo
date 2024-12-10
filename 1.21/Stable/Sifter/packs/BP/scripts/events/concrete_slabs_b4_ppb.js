//@ts-check
import { BlockPermutation, EquipmentSlot, Player, world } from "@minecraft/server";
import { watchFor, chatLog, globals } from '../settings.js';
import { PlayerLib } from "../commonLib/playerClass.js";
import { Vector2Lib } from "../commonLib/vectorClass.js";
import {
    slabTypeIDSansHeight,
    slabTypeIDHeight,
    placeBlock,
    placeDw623Slab,
    getAdjacentBlock,
    getPerpendicularFace,
    replaceDw623Slab
} from "../fn-stable.js";
import { PlayerPlaceOrInteractBeforeEventData } from "./BlockEventDataClass.js";
//=============================================================================
/*
    Written By:     "https://github.com/DrinkWater623"

    Last Update:    20241209 - created
*/

//==============================================================================
/**
 * 
 * @param {PlayerPlaceOrInteractBeforeEventData} event 
 * @returns 
 */
export function concrete_slabs_playerPlaceBlock_Handler (event) {
    const debug = true;

    if (!event.player || !event.player.isValid())
        return false;

    const stateName = 'minecraft:block_face';
    const traitsBlockFace = event.touchBlockStates[ stateName ].toString();
    event.keyMap.set('blockFaceTrait', traitsBlockFace);

    if (debug) {
        // for debugging

        world.sendMessage(`\n`)
        chatLog.log(`\n§gRedirect§b Concrete Slabs beforePlayerInteractWithBlock:§r
    ==> Block: ${event.touchBlock.typeId} (${traitsBlockFace}) 
    ==> Holding: ${event.itemCount} ${event.itemTyeID} ${event.touchFace}
    ==> Vertical Half: ${event.verticalHalf} 
    ==> Horizontal Half: ${event.horizontalHalf}
    `
            , debug
        );
    }

    // Nothing
    if (!event.itemTyeID)
        return false;

    //Touched Concrete Slab in same family and same facing for possible combine
    const slabFamily = slabTypeIDSansHeight(event.itemTyeID);
    event.keyMap.set('slabFamily', slabFamily);

    if (event.touchBlock.typeId.startsWith(slabFamily)) {
        if(debug) world.sendMessage(`  ==> §bSame Slab Family: ${slabFamily}`);

        if (traitsBlockFace == event.touchFace) {
            if(debug) world.sendMessage(`  ==> §bSame Face: true\n`);
            return placeAdjacentSameFamilySlab(event, debug);
        }
        else {
            if(debug) world.sendMessage(`  ==> §bDifferent Face: true\n`);
            return placeAdjacentOtherBlock(event, debug);
        }
    }

    // concrete-slab
    if (watchFor.customConcreteSlabInfo.some(p => p.typeId == event.touchBlock.typeId)) {
        if(debug) world.sendMessage('  ==> Different dw623 concrete slab\n');
        return placeAdjacentOtherBlock(event, debug);

    }

    //can only be... 
    if(debug) world.sendMessage('  ==> Regular-ish Block\n');
    return placeAdjacentOtherBlock(event, debug);
}
//==============================================================================
/**
 * 
 * @param {Player} player 
 * @returns 
 */
function mainHandCount (player) {
    const equipment = player.getComponent('equippable');
    if (!equipment)
        return 0;

    const selectedItem = equipment.getEquipment(EquipmentSlot.Mainhand);
    if (!selectedItem)
        return 0;

    return selectedItem.amount;
}
//==============================================================================
/**
 * 
 * @param {PlayerPlaceOrInteractBeforeEventData} event 
 * @param {boolean} debug 
 */
function placeAdjacentSameFamilySlab (event, debug = false) {

    if (!event.player || !event.player.isValid())
        return false;

    if (debug) world.sendMessage(`\n§d* placeAdjacentSameFamilySlab()`);

    const blockFaceTrait = event.keyMap.get('blockFaceTrait');
    const slabFamily = event.keyMap.get('slabFamily');
    //===============================================================
    // Same Face
    //===============================================================
    if (blockFaceTrait == event.touchFace) {
        const currentSlabHeight = slabTypeIDHeight(event.touchBlock.typeId);
        const heldSlabHeight = slabTypeIDHeight(event.itemTyeID);

        chatLog.log(`  ==> Slab Height: ${currentSlabHeight}`, debug);
        chatLog.log(`  ==> Held Slab Height: ${heldSlabHeight}`, debug);

        const newHeight = currentSlabHeight + heldSlabHeight;
        if (newHeight <= 16) {
            chatLog.log(`  §b==> Try to Combine to ${newHeight}`, debug);

            let success = false;
            if (newHeight == 16) {
                const newBlockTypeId = slabFamily.replace(globals.mainNameSpace, globals.minecraftNameSpace).replace('_slab', '');
                success = placeBlock(event.touchBlock, newBlockTypeId);
            }
            else {
                const newSlabTypeId = `${slabFamily}_${newHeight}`;
                const newSlabPermutation = BlockPermutation.resolve(newSlabTypeId, { 'minecraft:block_face': blockFaceTrait });
                success = replaceDw623Slab(event.touchBlock, newSlabTypeId, blockFaceTrait);
            }

            if (success) {
                chatLog.success(`  ==> Placement Success`, debug);
                PlayerLib.mainHandRemoveOne(event.player, false);
                return true;
            }
            else {
                chatLog.warn(`  ==> Block Not Placed`, debug);
                return false;
            }
        }
        else {
            chatLog.warn(`  ==> Too Big to Combine to ${newHeight}`);
            return false;
        }
    }
    //===============================================================
    // The Rest - if not caught outside this call or over combined 16
    //===============================================================    
    return placeAdjacentOtherBlock(event, debug);
}
//==============================================================================
/**
 * 
 * @param {PlayerPlaceOrInteractBeforeEventData} event 
 * @param {boolean} debug 
 */
function placeAdjacentOtherBlock (event, debug = false) {
    if (!event.player || !event.player.isValid())
        return false;

    if (debug) world.sendMessage(`\n§d* placeAdjacentOtherBlock()`);

    const blockFaceTrait = event.keyMap.get('blockFaceTrait');

    const newBlock = getAdjacentBlock(event.touchBlock, event.touchFace, debug);
    if (!newBlock) {
        chatLog.error(`  ==> Failed Getting Adjacent Block`, debug);
        return false;
    }

    let newBlockFace;
    //===============================================================
    // Opposites - just place block normally
    //===============================================================
    if (
        ([ 'up', 'down' ].includes(blockFaceTrait) && [ 'up', 'down' ].includes(event.touchFace)) ||
        ([ 'north', 'south' ].includes(blockFaceTrait) && [ 'north', 'south' ].includes(event.touchFace)) ||
        ([ 'east', 'west' ].includes(blockFaceTrait) && [ 'east', 'west' ].includes(event.touchFace))
    ) {
        if (debug) world.sendMessage(`  §b==> Opposite or Same Face: b: ${blockFaceTrait} vs t: ${event.touchFace} `);

        //if opposite, check grid for other types of placement
        if (blockFaceTrait != event.touchFace) {

            //FIXME:  something not right

            const grid4 = event.grid_4x4; 
            if (debug) world.sendMessage(`  §b==> Diff: Grid-4: ${Vector2Lib.toString(grid4, 0, true)}`);
            //since on backside, see if need to be perpendicular
            if (grid4.y == 0)
                newBlockFace = 'down';
            else if (grid4.y == 3)
                newBlockFace = 'up';
            else if (grid4.x == 0)
                newBlockFace = getPerpendicularFace(event.touchFace, 0);
            else if (grid4.x == 3)
                newBlockFace = getPerpendicularFace(event.touchFace, 1);
            else
                newBlockFace = event.touchFace;

            if (debug) world.sendMessage(`  §b==> New Block Face: ${newBlockFace}`);
        }
        else
            newBlockFace = event.touchFace;
    }
    //===============================================================
    // Sides
    //===============================================================
    else {
        if (debug) world.sendMessage(`  §b==> Perpendicular Face`);
        newBlockFace = blockFaceTrait;
    }
    //Interact on side part?  Add next to (eventFace side), same permutation (currentBlockFace)    

    const success = placeDw623Slab(newBlock, event.itemTyeID, newBlockFace, true, debug);
    if (success) {
        PlayerLib.mainHandRemoveOne(event.player, false);
        return true;
    }
    else {
        chatLog.warn(`xxx> Block Not Placed`, debug);
        return false;
    }
}
//==============================================================================
// End of File
//==============================================================================