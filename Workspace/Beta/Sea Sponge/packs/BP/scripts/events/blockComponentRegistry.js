//@ts-check
/*
    To work out.... water logged...

*/
import { Block, BlockPermutation, ItemStack, system, WorldInitializeBeforeEvent } from "@minecraft/server";
//==============================================================================
import { alertLog, dev, globals, watchFor } from "../settings.js";
import { GetBlockState, PlaceBlock } from "../common-stable/blockLib-stable.js";
import { waterBlock } from "../common-data/globalConstantsLib.js";
import { harvestAll } from "./blockBreakBeforeHandler.js";
import { fallThruBlocks, waterBlocks } from "../common-data/block-data.js";
import { PlayerLib } from "../common-stable/playerClass.js";
import { ChatMsg } from "../common-stable/consoleClass.js";
//==============================================================================
const growthChance = dev.debugGrowth ? globals.randomTickChanceDebug : globals.randomTickChance;
const debugMsg = new ChatMsg('Sea Sponges - Custom Components')

/**
 * 
 * @param {WorldInitializeBeforeEvent} event 
 */
export function block_registerCustomComponents (event) {
    const debug = false;
    //====================================================
    alertLog.success("Subscribing to§r blockComponentRegistry for dw623:checkFloorAndWater", dev.debugSubscriptions);
    event.blockComponentRegistry.registerCustomComponent(
        "dw623:checkFloorAndWater",
        {
            onTick: e => {
                checkFloorAndWater(e.block);
            }
        }
    );
    //====================================================
    alertLog.success("Subscribing to§r blockComponentRegistry for dw623:wet_sea_sponge_chanceGrow", dev.debugSubscriptions);
    event.blockComponentRegistry.registerCustomComponent(
        "dw623:wet_sea_sponge_chanceGrow",
        {
            onRandomTick: e => {
                if (Math.random() < growthChance) {
                    if (e.block.typeId == watchFor.sea_sponge_blocks[ 0 ]) {
                        grow_v1(e.block);
                        return;
                    }
                    if (e.block.typeId == watchFor.sea_sponge_blocks[ 1 ]) {
                        grow_v2(e.block);
                        return;
                    }
                    if (e.block.typeId == watchFor.sea_sponge_blocks[ 2 ]) {
                        grow_v3(e.block);
                        return;
                    }
                }
            }
        }
    );
    //====================================================
    /*  NO FUCKING PLAYER OBJECT in Event - so cannot use
    alertLog.success("Subscribing to§r blockComponentRegistry for dw623:sea_sponge_stump_place", dev.debugSubscriptions);
    event.blockComponentRegistry.registerCustomComponent(
        "dw623:sea_sponge_stump_place",
        {
            onPlace: e => {
                placeStumps(e.block, e.previousBlock);
            }
        });
    */
}

//==============================================================================
/**
 * 
 * @param {Block} block
 */
function grow_v1 (block) {

    //Get Block State
    const blockStateName = watchFor.sea_sponge_states[ 0 ];
    const blockState = GetBlockState.boolean(block, blockStateName, true);

    //isStump, reset state to true
    if (blockState == false) {
        const newPermutation = block.permutation.withState(blockStateName, true);
        PlaceBlock.permutation(block, newPermutation, 'pop');
        return;
    }

    //not isStump, add block on top, if water
    const blockAbove = block.above(1);
    if (blockAbove && blockAbove.typeId == waterBlock) {
        const newPermutation = block.permutation.withState(blockStateName, true);
        PlaceBlock.permutation(blockAbove, newPermutation, 'pop');
        return;
    }
}
//==============================================================================
/**
 * 
 * @param {Block} block 
 */
function grow_v2 (block) {

    //Get Block State
    const blockStateName = watchFor.sea_sponge_states[ 1 ];
    const blockState = GetBlockState.number(block, blockStateName, true);

    //0-2 reset state
    if (blockState < 3) {
        const newPermutation = block.permutation.withState(blockStateName, blockState + 1);
        PlaceBlock.permutation(block, newPermutation, 'pop');

        return;
    }
    //3, add block on top, if water
    if (blockState == 3) {
        const blockAbove = block.above(1);
        if (blockAbove && blockAbove.typeId == waterBlock) {
            const newPermutation = block.permutation.withState(blockStateName, 1);
            PlaceBlock.permutation(blockAbove, newPermutation, 'pop');
        }
        return;
    }
}
//==============================================================================
/**
 * 
 * @param {Block} block 
 */
function grow_v3 (block) { }
//==============================================================================
/**
 * 
 * @param {Block} block 
 */
function checkFloorAndWater (block) {

    //a water block should be next to sea sponge block
    let adjacentWater = false;
    if (block.isWaterlogged)
        adjacentWater = true;
    else {
        const blockNorth = block.north(1);
        const blockSouth = block.south(1);
        const blockEast = block.east(1);
        const blockWest = block.west(1);
        const blockAbove = block.above(1);

        if (blockNorth && (waterBlocks.includes(blockNorth.typeId) || watchFor.sea_sponge_blocks.includes(blockNorth.typeId)))
            adjacentWater = true;
        else if (blockSouth && (waterBlocks.includes(blockSouth.typeId) || watchFor.sea_sponge_blocks.includes(blockSouth.typeId)))
            adjacentWater = true;
        else if (blockEast && (waterBlocks.includes(blockEast.typeId) || watchFor.sea_sponge_blocks.includes(blockEast.typeId)))
            adjacentWater = true;
        else if (blockWest && (waterBlocks.includes(blockWest.typeId) || watchFor.sea_sponge_blocks.includes(blockWest.typeId)))
            adjacentWater = true;
        else if (blockAbove && (waterBlocks.includes(blockAbove.typeId) || watchFor.sea_sponge_blocks.includes(blockAbove.typeId)))
            adjacentWater = true;

        //block.setWaterlogged(true);
    }

    if (!adjacentWater) {
        debugMsg.warn (`No Adjacent Water`,dev.debugCheck)
        harvestAll(block);
        return;
    }
    //=========================================================================
    //has block below it
    const blockBelow = block.below(1);
    if (!blockBelow) {
        harvestAll(block);
        return;
    }

    if (fallThruBlocks.includes(blockBelow.typeId)) {
        harvestAll(block);
        return;
    }
}
//==============================================================================
// End of File
//==============================================================================