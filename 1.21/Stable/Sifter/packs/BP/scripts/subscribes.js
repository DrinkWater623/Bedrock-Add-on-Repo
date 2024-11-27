//@ts-check
import { Block, BlockPermutation, Dimension, ItemStack, system, world } from "@minecraft/server";
import { dev, alertLog, watchFor, chatLog, globals, lootTableItems } from './settings.js';
import { Vector3Lib } from "./commonLib/vectorClass.js";
var itemTestDone = true;
const mcAir = "minecraft:air";
//==============================================================================
const debug = dev.debugSubscriptions;
//==============================================================================
export function beforeEvents_worldInitialize () {
    world.beforeEvents.worldInitialize.subscribe((event) => {

        //This will catch gravity blocks that fall on the sifters        
        event.blockComponentRegistry.registerCustomComponent(
            "dw623:sifter_query", {

            onTick: e => {
                const block = e.block;
                const blockAbove = block.above(1);
                if (blockAbove) {
                    if (watchFor.vanillaBlocks.includes(blockAbove.typeId)) {
                        const newBlock = blockAbove.typeId.replace("minecraft:", globals.autoSiftBlockNameSpace);
                        system.run(() => {
                            block.dimension.setBlockType(blockAbove.location, newBlock);
                        });
                    }
                }
            }
        }
        );
        //auto sift blocks
        event.blockComponentRegistry.registerCustomComponent(
            "dw623:auto_sift_blocks",
            {
                onTick: e => {

                    // if player destroys sifter while sifting... check for sifter below and destroy block if not there...
                    // or 
                    // convert to a thing of that size... but no, cause I do not have gravity tech yet... 
                    // but can do with code if air/water/lava move down one (make partial blocks not in menu tho)

                    const block = e.block;
                    const blockInfoFilter = watchFor.autoSiftBlocks.filter(b => b.custom == block.typeId);
                    if (!blockInfoFilter) return;

                    var height = block.permutation.getState(globals.autoSiftBlockStateName);
                    //impossible for it to not be a number, but JDoc be like... type?                     
                    // this is an error and should not happen, unless someone renames the block state in the BP files
                    if (typeof height != 'number' || height < 1 || height > 16) {
                        const msg = `${block.typeId}: Missing or invalid block state = int:y_level @ ${Vector3Lib.toString(block.location)}}`;
                        alertLog.error(msg);
                        return;
                    }

                    //is it still on top of a SIFTER?
                    const blockBelow = block.below(1);
                    //No
                    if (!blockBelow || !watchFor.sifterBlocks.includes(blockBelow.typeId)) {
                        // Stop    
                        // convert to the same height short block - the short block will do it's own gravity check

                        const newBlock = block.typeId.replace(globals.autoSiftBlockNameSpace, globals.shortBlockNameSpace) + `_${height}`;
                        system.run(() => {
                            block.setType(newBlock);
                        });

                        return;
                    }

                    //Yes
                    const blockInfo = blockInfoFilter[ 0 ];

                    block.dimension.playSound(blockInfo.sound, block.location, { pitch: 1, volume: 1 });

                    let particleLocation = block.bottomCenter();
                    particleLocation.y += height / 16;
                    block.dimension.spawnParticle("minecraft:dust_plume", particleLocation);

                    //TODO: if height mod 4 = 1 give loot
                    if (height % 4 == 1) {
                        //dimension.spawnItem({}, particleLocation)
                    }

                    if (height == 1) {
                        system.run(() => {
                            block.dimension.setBlockType(block.location, "minecraft:air");
                        });
                    }
                    else {
                        var newPermutation = block.permutation.withState(globals.autoSiftBlockStateName, height - 1);
                        system.run(() => {
                            block.setPermutation(newPermutation);
                        });
                    }
                }
            }
        );
        //====================================================
        event.blockComponentRegistry.registerCustomComponent(
            "dw623:sifter_query_2",
            {
                onTick: e => {
                    const block = e.block;
                    const blockAbove = block.above(1);
                    if (!blockAbove || blockAbove.typeId == 'minecraft:air') return;

                    //minecraft gravity block
                    if (watchFor.vanillaBlocks.includes(blockAbove.typeId)) {
                        const newBlock = blockAbove.typeId.replace("minecraft:", globals.shortBlockNameSpace) + '_16';
                        system.run(() => {
                            blockAbove.setType(newBlock);
                        });
                    }

                    //short gravity slab
                    const blockFilter = watchFor.shortGravityBlocks.filter(b => b.typeId == blockAbove.typeId);
                    if (!blockFilter || !blockFilter[ 0 ]) {
                        return;
                    }

                    const blockInfo = blockFilter[ 0 ];

                    spawnDustBlock(blockAbove, 0.25);
                    spawnRandomLoot(blockAbove, blockInfo.height, 0.10);

                    let newBlockTypeId = "";
                    if (blockInfo.height == 1) {
                        newBlockTypeId = 'minecraft:air';
                    }
                    else {
                        //decrement height
                        newBlockTypeId = `${blockInfo.nameSpace}${blockInfo.base}_${blockInfo.height - 1}`;
                    }

                    system.run(() => {
                        blockAbove.setType(newBlockTypeId);
                    });
                }
            }
        );

        event.blockComponentRegistry.registerCustomComponent(
            "dw623:gravity_block_slabs", {
            onTick: e => {
                const block = e.block;
                const blockBelow = block.below(1);
                //has to be a block below...technically
                if (!blockBelow) return;

                //gravity - pass thru - move down
                if (watchFor.fallThruBlocks.includes(blockBelow.typeId)) {
                    //move block down 1
                    system.run(() => {
                        block.dimension.setBlockType(blockBelow.location, block.typeId);
                    });
                    system.runTimeout(() => {
                        block.dimension.setBlockType(block.location, "minecraft:air");
                    }, 1);
                    return;
                }

                const blockFilter = watchFor.shortGravityBlocks.filter(b => b.typeId == block.typeId);
                if (!blockFilter) return;
                const blockInfo = blockFilter[ 0 ];
                if (!blockInfo) return;

                //if I am not a full block, can I combine with block above me?
                if (blockInfo.height < 16) {

                    const blockAbove = block.above(1);
                    if (blockAbove) {
                        let totalHeight = 0;

                        //is a block like me above me?
                        if (blockAbove.typeId.startsWith(blockInfo.nameSpace + blockInfo.base)) {
                            const blockAboveFilter = watchFor.shortGravityBlocks.filter(b => b.typeId == blockAbove.typeId);
                            if (!blockAboveFilter) return;
                            const blockAboveInfo = blockAboveFilter[ 0 ];
                            if (!blockAboveInfo) return;

                            totalHeight = blockInfo.height + blockAboveInfo.height;
                        }
                        //is a base block like me above me?
                        else if (blockAbove.typeId.startsWith('minecraft:' + blockInfo.base)) {
                            totalHeight = blockInfo.height + 16;
                        }
                        else
                            return;

                        let newTypeID_1 = "";
                        let newTypeID_2 = "";

                        if (totalHeight <= 16) {
                            newTypeID_1 = `${globals.shortBlockNameSpace}${blockInfo.base}_${totalHeight}`;
                            newTypeID_2 = mcAir;
                        }
                        else {
                            if (watchFor.sifterBlocks.includes(blockBelow.typeId))
                                newTypeID_1 = `${globals.shortBlockNameSpace}${blockInfo.base}_16`;
                            else
                                newTypeID_1 = `minecraft:${blockInfo.base}`;

                            newTypeID_2 = `${globals.shortBlockNameSpace}${blockInfo.base}_${totalHeight - 16}`;
                        }
                        system.run(() => {
                            blockAbove.setType(newTypeID_2);
                            block.setType(newTypeID_1);
                        });

                        return;                        
                    }
                }                
            }
        });
    });
}
/**
 * 
 * @param {Dimension} dim 
 * @param {import("@minecraft/server").Vector3} loc 
 */
function* testLootMe (dim, loc) {

    for (const loot of lootTableItems) {
        const i = new ItemStack(loot.typeId, 1);
        dim.spawnItem(i, loc);
        yield;
    }
}
function lootSelector (typeId = "", height = 0) {

    const lootPool = lootTableItems
        .filter(a => height >= a.minHeight)
        .filter(b => b.blocksAllowed[ 0 ] == 'all' || b.blocksAllowed.some(p => typeId.includes(p)));

    if (!lootPool) return "";


    if (lootPool.length == 1) return lootPool[ 0 ].typeId;

    const randomNum = Math.floor(Math.random() * lootPool.length);
    return lootPool[ randomNum ].typeId;
}
/**
 * 
 * @param {Block} block 
 * @param {number} height 
 * @param {number} chance 
 */

function spawnRandomLoot (block, height = 0, chance = 0) {

    if (!itemTestDone) {
        itemTestDone = true;
        const dim = block.dimension;
        const loc = block.center();
        loc.y += 2;
        system.runJob(testLootMe(dim, loc));
    }

    if (Math.random() > chance) return;

    const lootTypeID = lootSelector(block.typeId, height);
    if (lootTypeID) {
        let i = new ItemStack(lootTypeID, 1);
        block.dimension.spawnItem(i, block.center());
    }
}

function dustBlockSelector (typeId = "") {

    let base = "";
    if (typeId.includes("snow")) {
        return "minecraft:snowball";
    }

    if (typeId.includes("gravel")) {
        base = "gravel";
    }
    else if (typeId.includes("sand")) {
        if (typeId.includes("red_sand"))
            base = "red_sand";
        else
            base = "sand";
    }
    else if (typeId.includes("concrete_powder")) {
        //50/50 chance - concrete powder is made out of sand and gravel
        //and makes life easier than every powder dust version
        base = Math.random() < 0.5 ? "gravel" : "sand";
    }
    else
        return "";

    return globals.mainNameSpace + base + "_dust";
}
/**
 * 
 * @param {Block} block 
 * @param {number} chance 
 */
function spawnDustBlock (block, chance = 0) {
    if (Math.random() > chance) return;

    const dustLootTypeId = dustBlockSelector(block.typeId);
    if (dustLootTypeId) {
        let i = new ItemStack(dustLootTypeId, 1);
        block.dimension.spawnItem(i, block.center());
    }
}
//==============================================================================
export function afterEvents_playerPlaceBlock () {
    world.afterEvents.playerPlaceBlock.subscribe((event) => {
        var block = event.block;

        const blockBelow = block.below(1);
        if (blockBelow) {
            if (watchFor.sifterBlocks.includes(blockBelow.typeId)) {
                // sift:
                if (watchFor.autoSiftBlocks.map(b => b.minecraft).includes(block.typeId)) {
                    const newBlock = block.typeId.replace("minecraft:", globals.autoSiftBlockNameSpace);

                    system.run(() => {
                        block.dimension.setBlockType(block.location, newBlock);
                    });
                }
                // shortGravityBlocks:
                const blockFilter = watchFor.shortGravityBlocks.filter(b => b.typeId.includes(block.typeId));
                if (blockFilter.length) {
                    const blockInfo = blockFilter[ 0 ];
                    const newBlockPermutation = BlockPermutation.resolve(blockInfo.siftBlockTypeId, { "int:y_level": blockInfo.height });

                    system.run(() => {
                        block.setPermutation(newBlockPermutation);
                    });
                }
            }
            return;
        }
        // else if (watchFor.manualSiftBlocks.includes(block.typeId)) {
        // const blockBelow = block.below(1);
        // if (blockBelow) {
        // if (watchFor.sifterBlocks.includes(blockBelow.typeId)) {
        // chatLog.log("Manual Siftable Block Placed on Sifter", dev.debugGamePlay);
        // 
        // change to block that auto does one sift w/ rest manual taps
        // }
        // }
        // return;
        // }
    });
}
//==============================================================================

//==============================================================================

//==============================================================================