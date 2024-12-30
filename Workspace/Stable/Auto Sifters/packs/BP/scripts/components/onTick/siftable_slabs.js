//@ts-check
import { Block, BlockComponentTickEvent, BlockPermutation, system } from "@minecraft/server";
import { watchFor } from '../../settings.js';
import {    
    slabTypeIDSansHeight,
    slabTypeIDHeight
} from "../../fn-stable.js";
import { airBlock } from "../../common-data/globalConstantsLib.js";
//==============================================================================
/**
 * 
 * @param {BlockComponentTickEvent} e 
 * @returns 
 */
export function siftable_slabs_onTick (e) {
    const debug = false;

    const block = e.block;
    const blockBelow = e.block.below(1);
    //has to be a block below...technically
    if (!blockBelow) return;

    //full block check - convert back to minecraft version
    // if (block.typeId.endsWith('_16'))
    //     chatLog.log('16-a', false);

    //check for water around concrete powder
    if (e.block.typeId.includes('concrete_powder')) {
        if (concretePowderWaterCheck(block, blockBelow)) {
            return;
        }
    }

    //gravity - pass thru - move down
    if (watchFor.fallThruBlocks.includes(blockBelow.typeId)) {
        blockMoveDownOne(e.block, blockBelow);
    }
    else {
        blockCombineWithBlockBelow(e.block, blockBelow);
    }
}
//==============================================================================
//  Support Function, only used in this JS
//==============================================================================

/**
 * 
 * @param {Block} block 
 * @param {Block} blockBelow
 */
function concretePowderWaterCheck (block, blockBelow) {

    const locations = [
        blockBelow,
        block.above(1),
        block.east(1),
        block.west(1),
        block.north(1),
        block.south(1)
    ];

    locations.forEach(neighborBlock => {
        if (neighborBlock && watchFor.waterBlocks.includes(neighborBlock.typeId)) {
            concretePowderConvert(block);
            return true;
        }
    });

    return false;
}
/**
 * 
 * @param {Block} block  
 */
function concretePowderConvert (block) {
    if (!block.isValid()) return;

    const newBlockTypeId = block.typeId.replace('_powder', '');
    const newSlabPermutation = BlockPermutation.resolve(newBlockTypeId, { 'minecraft:block_face': 'up' });
    system.run(() => { block.setPermutation(newSlabPermutation); });
}
//==============================================================================
/**
 * 
 * @param {Block} block 
 * @param {Block} blockBelow
 */
function blockMoveDownOne (block, blockBelow) {
    system.run(() => {
        blockBelow.setType(block.typeId);
        system.runTimeout(() => { block.setType(airBlock); }, 1);
    });
}
//==============================================================================
/**
 * 
 * @param {Block} block 
 * @param {Block} blockBelow
 */
function blockCombineWithBlockBelow (block, blockBelow) {
    const blockFilter = watchFor.customSiftableBlockInfo.filter(b => b.typeId == block.typeId);
    if (!blockFilter || !blockFilter.length)
        return;

    const slabInfo = blockFilter[ 0 ];
    if (!slabInfo)
        return;

    const baseSlabTypeId = slabTypeIDSansHeight(block.typeId);
    if (slabInfo.height == 16) {
        // if sifter not below me, convert back to minecraft version
        // because I am normal height        
        if (watchFor.sifterBlocks.includes(blockBelow.typeId))
            return;

        //if another block like me, slab is below me, do not change
        if (blockBelow.typeId != block.typeId &&
            blockBelow.typeId.startsWith(baseSlabTypeId))
            return;

        //I can change now
        system.run(() => {
            block.setType(slabInfo.minecraft);
        });
    }
    //if I am not a full block, can I combine with block above me?
    else if (slabInfo.height < 16) {

        //should always be unless at top of the world... TODO: check for top of the world
        const blockAbove = block.above(1);

        if (blockAbove) {
            let totalHeight = 0;            
            //is a block like me above me?
            if (blockAbove.typeId.startsWith(baseSlabTypeId)) {                
                totalHeight = slabInfo.height + slabTypeIDHeight(blockAbove.typeId);
            }
            //is a base block like me above me?
            else if (blockAbove.typeId == slabInfo.minecraft) {
                totalHeight = slabInfo.height + 16;
            }
            else
                return;

            let newTypeID_1 = "";
            let newTypeID_2 = "";

            if (totalHeight <= 16) {
                newTypeID_1 = `${baseSlabTypeId}_${totalHeight}`;
                newTypeID_2 = airBlock;
            }
            else {
                if (blockBelow && watchFor.sifterBlocks.includes(blockBelow.typeId))
                    newTypeID_1 = `${baseSlabTypeId}_16`;
                else
                    newTypeID_1 = slabInfo.minecraft;

                newTypeID_2 = `${baseSlabTypeId}_${totalHeight - 16}`;
            }
            system.run(() => {
                blockAbove.setType(newTypeID_2);
                block.setType(newTypeID_1);
            });

            return;
        }
    }
}
//==============================================================================
// End of File
//==============================================================================