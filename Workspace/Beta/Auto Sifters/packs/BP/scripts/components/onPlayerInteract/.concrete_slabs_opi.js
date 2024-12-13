//@ts-check
import { BlockPermutation, system, world, BlockComponentPlayerInteractEvent, EquipmentSlot, Player } from "@minecraft/server";
import { dev, alertLog, watchFor, chatLog, globals } from '../../settings.js';
import { PlayerLib } from "../../commonLib/playerClass.js";
import { FaceLocationGrid } from "../../commonLib/vectorClass.js";
import {
    slabTypeIDSansHeight,
    slabTypeIDHeight,
    placeBlock,
    placeBlockPermutation,
    placeDw623Slab,
    getAdjacentBlock,
    getDw623SlabBlockFace,
    getPerpendicularFace,
    replaceDw623Slab
} from "../../fn-stable.js";
//=============================================================================
/*
    Written By:     "https://github.com/DrinkWater623"

    Last Update:    20241208 - created

    Notes:
    This captures event for player placing blocks.  That event will not fire if using this event.
    So... have to do that stuff, I guess
*/

//==============================================================================
/**
 * 
 * @param {BlockComponentPlayerInteractEvent} e 
 * @returns 
 */
export function concrete_slabs_onPlayerInteract (e) {
    const debug = true;

    if (!e.player || !e.player.isValid())
        return;

    const typeIdMainHand = PlayerLib.mainHandTypeId(e.player);

    const stateName = 'minecraft:block_face';
    const currentBlockFace = getDw623SlabBlockFace(e.block);

    if (debug) {
        const faceLocationInfo = new FaceLocationGrid(e.block, e.faceLocation ?? e.block.location, e.face);
        // for debugging
        chatLog.log(`\n\n§gBlockComponentRegistry§b dw623:concrete_slabs.onPlayerInteract:§r
    ==> Block: ${e.block.typeId} (${currentBlockFace}) -->
    ==> Holding: ${mainHandCount(e.player)} ${typeIdMainHand ?? 'Nothing'} --> ${e.face}
    ==> Vertical Half: ${faceLocationInfo.verticalHalf == 0 ? 'top' : 'bottom'} 
    ==> Horizontal Half: ${faceLocationInfo.horizontalHalf == 0 ? 'left' : 'right'}
    `
            , debug
        );
    }
    // Depends on what is held
    // Nothing
    if (!typeIdMainHand)
        return;

    // Not DW623
    if (!typeIdMainHand.startsWith(globals.mainNameSpace)) {
        chatLog.log('Not a dw623 block', debug);
        holding_other_block(e, typeIdMainHand, debug);
        return;
    }
    //Holding Concrete Slab in same family and same facing for possible combine
    const slabFamily = slabTypeIDSansHeight(e.block.typeId);
    if (typeIdMainHand.startsWith(slabFamily)) {
        chatLog.log(`  ==> §bSame Slab Family: ${slabFamily}`, debug);

        if (currentBlockFace == e.face.toLowerCase()) {
            chatLog.log(`  ==> §bSame Face: true`, debug);
            holding_same_dw623_slab(e, currentBlockFace, typeIdMainHand, slabFamily, debug);
            return;
        }
        else {
            chatLog.log(`  ==> §bDifferent Face: true`, debug);
            holding_other_dw623_slab(e, currentBlockFace, typeIdMainHand, debug);
            return;
        }
    }

    // concrete-slab
    if (watchFor.customConcreteSlabInfo.some(p => p.typeId == typeIdMainHand)) {
        chatLog.log('  ==> Another dw623 concrete slab', debug);
        holding_other_dw623_slab(e, currentBlockFace, typeIdMainHand, debug);
        return;
    }

    //can only be... 
    chatLog.log('  ==> a dw623 block', debug);
    holding_other_dw623_block(e, typeIdMainHand, debug);
}
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
 * @param {BlockComponentPlayerInteractEvent} event 
 * @param {string} currentBlockFace 
 * @param {string} typeIdMainHand 
 * @param {string} slabFamily 
 * @param {boolean} debug 
 */
function holding_same_dw623_slab (event, currentBlockFace, typeIdMainHand, slabFamily, debug = false) {

    if (!event.player || !event.player.isValid())
        return;

    chatLog.log(`* holding_same_dw623_slab(${slabFamily})`, debug);
    const eventFace = event.face.toLowerCase();

    //===============================================================
    // Same Face
    //===============================================================
    if (currentBlockFace == eventFace) {
        const currentSlabHeight = slabTypeIDHeight(event.block.typeId);
        const heldSlabHeight = slabTypeIDHeight(typeIdMainHand);

        chatLog.log(`  ==> Slab Height: ${currentSlabHeight}`, debug);
        chatLog.log(`  ==> Held Slab Height: ${heldSlabHeight}`, debug);

        const newHeight = currentSlabHeight + heldSlabHeight;
        if (newHeight <= 16) {
            chatLog.log(`  §b==> Try to Combine to ${newHeight}`, debug);
            let success = false;
            if (newHeight == 16) {
                const newBlockTypeId = slabFamily.replace(globals.mainNameSpace, globals.minecraftNameSpace).replace('_slab', '');
                success = placeBlock(event.block, newBlockTypeId);
            }
            else {
                const newSlabTypeId = `${slabFamily}_${newHeight}`;
                const newSlabPermutation = BlockPermutation.resolve(newSlabTypeId, { 'minecraft:block_face': currentBlockFace });
                success = replaceDw623Slab(event.block, newSlabTypeId, currentBlockFace);
            }

            if (success) {
                chatLog.success(`  ==> Placement Success`, debug);
                PlayerLib.mainHandRemoveOne(event.player,false);
            }
            else {
                chatLog.warn(`  ==> Block Not Placed`, debug);
            }
            return;
        }
        else {
            chatLog.warn(`  ==> Too Big to Combine to ${newHeight}`);
        }
    }
    //===============================================================
    // The Rest - if not caught outside this call or over combined 16
    //===============================================================    
    holding_other_dw623_slab(event, currentBlockFace, typeIdMainHand, debug);
}
//==============================================================================
/**
 * 
 * @param {BlockComponentPlayerInteractEvent} event 
 * @param {string} currentBlockFace 
 * @param {string} typeIdMainHand 
 * @param {boolean} debug 
 */
function holding_other_dw623_slab (event, currentBlockFace, typeIdMainHand, debug = false) {
    if (!event.player || !event.player.isValid())
        return;

    chatLog.log(`\n* holding_other_dw623_slab()`);
    const eventFace = event.face.toLowerCase();

    const newBlock = getAdjacentBlock(event.block, eventFace, debug);
    if (!newBlock) {
        chatLog.error(`  ==> Failed Getting Adjacent Block`, debug);
        return;
    }

    let newBlockFace;
    //===============================================================
    // Opposites - just place block normally
    //===============================================================
    if (
        ([ 'up', 'down' ].includes(currentBlockFace) && [ 'up', 'down' ].includes(eventFace)) ||
        ([ 'north', 'south' ].includes(currentBlockFace) && [ 'north', 'south' ].includes(eventFace)) ||
        ([ 'east', 'west' ].includes(currentBlockFace) && [ 'east', 'west' ].includes(eventFace))
    ) {
        chatLog.log(`  §b==> Opposite or Same Face`, debug);

        //if opposite, check grid for other types of placement
        if (currentBlockFace != eventFace) {
            const faceLocationInfo = new FaceLocationGrid(event.faceLocation ?? event.block.location, eventFace);
            const grid4 = faceLocationInfo.grid(4);

            //since on backside, see if need to be perpendicular
            if (grid4.y = 0)
                newBlockFace = 'down';
            else if (grid4.y = 3)
                newBlockFace = 'up';
            else if (grid4.x = 0)
                newBlockFace = getPerpendicularFace(eventFace, 0);
            else if (grid4.x = 3)
                newBlockFace = getPerpendicularFace(eventFace, 0);
            else
                newBlockFace = eventFace;
        }
        else
            newBlockFace = eventFace;
    }
    //===============================================================
    // Sides
    //===============================================================
    else {
        chatLog.log(`  §b==> Perpendicular Face`, debug);
        newBlockFace = currentBlockFace;
    }
    //Interact on side part?  Add next to (eventFace side), same permutation (currentBlockFace)    

    const success = placeDw623Slab(newBlock, typeIdMainHand, newBlockFace, true, debug);
    if (success) {
        PlayerLib.mainHandRemoveOne(event.player);
    }
    else {
        chatLog.warn(`  ==> Block Not Placed`, debug);
    }
}
//==============================================================================
/**
 * 
 * @param {BlockComponentPlayerInteractEvent} event 
 * @param {string} typeIdMainHand 
 * @param {boolean} debug 
 */
function holding_other_dw623_block (event, typeIdMainHand, debug = false) {
    if (!event.player || !event.player.isValid())
        return;

    chatLog.log(`* holding_other_dw623_block()`);

    const eventFace = event.face.toLowerCase();
    const newBlock = getAdjacentBlock(event.block, eventFace);
    if (!newBlock) {
        chatLog.error(`  ==> Failed Getting Adjacent Block`, debug);
        return;
    }

    const faceLocationInfo = new FaceLocationGrid(event.block, event.faceLocation ?? event.block.location, eventFace);

    //see if slab (another pack) and has block face state - tree the same
    // I do not have any other slab addons yet - but they should work the same
}
//==============================================================================
/**
 * 
 * @param {BlockComponentPlayerInteractEvent} event 
 * @param {string} typeIdMainHand 
 * @param {boolean} debug 
 */
function holding_other_block (event, typeIdMainHand, debug = false) {
    if (!event.player || !event.player.isValid())
        return;

    chatLog.log(`* holding_other_block()`);

    const eventFace = event.face.toLowerCase();
    const newBlock = getAdjacentBlock(event.block, eventFace);
    if (!newBlock) {
        chatLog.error(`  ==> Failed Getting Adjacent Block`, debug);
        return;
    }

    // see if block held has a "minecraft:vertical_half"
    const faceLocationInfo = new FaceLocationGrid(event.block, event.faceLocation ?? event.block.location, eventFace);

    // upside down bit / weirdo_direction 0,1,2,3
    // determine vanilla or not too

    // hopper facing_direction 0-5

    // chain, lantern, torch, etc...  
    // TODO: see if having this in the event 
    // instead of the custom CC makes this work. 

    //etc....
}
//==============================================================================
// End of File
//==============================================================================