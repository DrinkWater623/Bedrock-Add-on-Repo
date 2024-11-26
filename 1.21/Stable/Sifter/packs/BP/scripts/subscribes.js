//@ts-check
import { BlockPermutation, system, world } from "@minecraft/server";
import { dev, alertLog, watchFor, chatLog, globals } from './settings.js';
import { Vector3Lib } from "./commonLib/vectorClass.js";
//==============================================================================
const debug = dev.debugSubscriptions;
//==============================================================================
export function beforeEvents_worldInitialize () {
    world.beforeEvents.worldInitialize.subscribe((event) => {

        //This will catch gravity blocks that fall on the sifters
        event.blockComponentRegistry.registerCustomComponent(
            "dw623:sifter_query",
            {
                onTick: e => {
                    const block = e.block;
                    const blockAbove = block.above(1);
                    if (blockAbove) {
                        const vanillaBlocks = watchFor.autoSiftBlocks.filter(f => f.minecraft.startsWith('minecraft:')).map(b => b.minecraft);
                        if (vanillaBlocks.includes(blockAbove.typeId)) {
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
                            block.dimension.setBlockType(block.location, newBlock);
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
        event.blockComponentRegistry.registerCustomComponent(
            "dw623:short_blocks", {
            onTick: e => {
                const block = e.block;
                const blockBelow = block.below(1);
                //has to be a block below...technically
                if (blockBelow) {

                    //gravity
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

                    //Sifter
                    if (watchFor.sifterBlocks.includes(blockBelow.typeId)) {
                        //convert back to sift:...with correct height permutation                       
                        const shortBlockFilter = watchFor.shortBlocks.filter(b => b.typeId.includes(block.typeId));
                        if (shortBlockFilter.length) {
                            const shortBlockInfo = shortBlockFilter[ 0 ];
                            const newBlockPermutation = BlockPermutation.resolve(shortBlockInfo.siftBlockTypeId, { "int:y_level": shortBlockInfo.height });

                            system.run(() => {
                                block.setPermutation(newBlockPermutation);
                            });
                        }
                    }
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
            if (watchFor.sifterBlocks.includes(blockBelow.typeId)) {
                // sift:
                if (watchFor.autoSiftBlocks.map(b => b.minecraft).includes(block.typeId)) {
                    const newBlock = block.typeId.replace("minecraft:", globals.autoSiftBlockNameSpace);

                    system.run(() => {
                        block.dimension.setBlockType(block.location, newBlock);
                    });
                }
                // short:
                const shortBlockFilter = watchFor.shortBlocks.filter(b => b.typeId.includes(block.typeId));
                if (shortBlockFilter.length) {
                    const shortBlockInfo = shortBlockFilter[ 0 ];
                    const newBlockPermutation = BlockPermutation.resolve(shortBlockInfo.siftBlockTypeId, {"int:y_level": shortBlockInfo.height });

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