//@ts-check
import { Block, BlockPermutation, Dimension, ItemStack, system, world } from "@minecraft/server";
import { dev, alertLog, watchFor, chatLog, globals, lootTableItems } from './settings.js';
import { Vector3Lib } from "./commonLib/vectorClass.js";
import { concretePowderWaterCheck, gravityBlockCombine, gravityBlockMoveDownOne, sifterConvertAndSift, sifterSift } from "./fn-stable.js";

const mcAir = "minecraft:air";
//==============================================================================
const debug = dev.debugSubscriptions;
//==============================================================================
export function beforeEvents_worldInitialize () {
    world.beforeEvents.worldInitialize.subscribe((event) => {

        //====================================================
        event.blockComponentRegistry.registerCustomComponent(
            "dw623:sifter_query",
            {
                onTick: e => {

                    const blockAbove = e.block.above(1);

                    if (!blockAbove || !globals.keyBlockWords.some(word => blockAbove.typeId.includes(word))) {
                        return;
                    }

                    //minecraft gravity block above me? Yes, convert to siftable block
                    if (watchFor.vanillaGravityBlocks.includes(blockAbove.typeId)) {
                        sifterConvertAndSift(e.block, blockAbove);
                    }
                    //go Sift
                    else if (blockAbove.typeId.startsWith(globals.shortBlockNameSpace)) {
                        sifterSift(e.block, blockAbove);
                    }
                }
            }
        );

        event.blockComponentRegistry.registerCustomComponent(
            "dw623:gravity_block_slabs", {
            onTick: e => {
                const block = e.block;
                const blockBelow = e.block.below(1);
                //has to be a block below...technically
                if (!blockBelow) return;

                //full block check - convert back to minecraft version
                if (block.typeId.endsWith('_16'))
                    chatLog.log('16-a',false)

                //check for water around concrete powder
                if (e.block.typeId.includes('concrete_powder')) {
                    if (concretePowderWaterCheck(block, blockBelow)) {
                        return;
                    }
                }

                //gravity - pass thru - move down
                if (watchFor.fallThruBlocks.includes(blockBelow.typeId)) {
                    gravityBlockMoveDownOne(e.block, blockBelow);
                }
                else {
                    gravityBlockCombine(e.block, blockBelow);
                }
            }
        });
    });
}
//==============================================================================
export function afterEvents_playerPlaceBlock () {
    world.afterEvents.playerPlaceBlock.subscribe((event) => {
        var block = event.block;

        const blockBelow = block.below(1);
        if (blockBelow) {

        }
    });
}
//==============================================================================

//==============================================================================

//==============================================================================