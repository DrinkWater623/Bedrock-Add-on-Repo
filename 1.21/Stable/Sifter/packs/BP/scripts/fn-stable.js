//@ts-check
import { Block, Dimension, ItemStack, system, } from "@minecraft/server";
import { chatLog, globals, lootTableItems, watchFor } from './settings.js';
//==============================================================================
const mcAir = "minecraft:air";
var itemTestDone = true;
//==============================================================================
/**
 * 
 * @param {Block} block 
 * @param {Block} blockBelow
 */
export function concretePowderWaterCheck (block, blockBelow) {

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

    const newBlockTypeId = block.typeId.replace(globals.shortBlockNameSpace, globals.mainNameSpace).replace('_powder', '');
    system.run(() => {
        block.setType(newBlockTypeId);
    });
}
//==============================================================================
/**
 * 
 * @param {Block} block 
 * @param {Block} [blockAbove]
 */
export function sifterSift (block, blockAbove) {
    if (!block.isValid()) return;
    if (!blockAbove) blockAbove = block.above(1);
    if (!blockAbove || blockAbove.typeId == mcAir) return;

    //short gravity slab
    const blockFilter = watchFor.shortGravityBlocks.filter(b => b.typeId == blockAbove.typeId);
    if (!blockFilter || !blockFilter[ 0 ]) {
        return;
    }

    const blockInfo = blockFilter[ 0 ];

    block.dimension.playSound(blockInfo.sound, block.location, { pitch: 1, volume: 1 });

    let particleLocation = block.bottomCenter();
    particleLocation.y += blockInfo.height / 16;
    block.dimension.spawnParticle("minecraft:dust_plume", particleLocation);

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
//==============================================================================
/**
 * 
 * @param {Block} block 
 * @param {Block} blockAbove
 */
export function sifterConvertAndSift (block, blockAbove) {

    if (watchFor.vanillaGravityBlocks.includes(blockAbove.typeId)) {
        const convertedBlockTypeId = blockAbove.typeId.replace("minecraft:", globals.shortBlockNameSpace) + '_16';
        //TODO: confirm valid block in game
        if (watchFor.shortGravityBlocks.filter(b => b.typeId == convertedBlockTypeId).length) {
            system.run(() => {
                blockAbove.setType(convertedBlockTypeId);

                //do not send blockAbove, as it was changed last tick
                system.runTimeout(() => { sifterSift(block); }, 1);
            });
        }
    }
}
//==============================================================================
function lootSelector (typeId = "", height = 0) {

    const lootPool = lootTableItems
        .filter(a => height >= a.minHeight)
        .filter(no => !no.blocksNotAllowed.some(p => typeId.includes(p)))
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
//==============================================================================
function dustBlockSelector (typeId = "") {

    let base = "";
    if (typeId.includes("mud")) {
        return "dw623:mud_ball";
    }

    if (typeId.includes("snow")) {
        return "minecraft:snowball";
    }

    if (typeId.includes("gravel")) {
        base = "gravel";
    }
    else if (typeId.includes("sand")) {
        if (typeId.includes("soul_sand"))
            base = "soul_sand";
        else
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
//==============================================================================
/**
 * 
 * @param {Block} block 
 * @param {Block} blockBelow
 */
export function gravityBlockMoveDownOne (block, blockBelow) {
    system.run(() => {
        blockBelow.setType(block.typeId);
        system.runTimeout(() => { block.setType(mcAir); }, 1);
    });
}
//==============================================================================
/**
 * 
 * @param {Block} block 
 * @param {Block} blockBelow
 */
export function gravityBlockCombine (block, blockBelow) {
    const blockFilter = watchFor.shortGravityBlocks.filter(b => b.typeId == block.typeId);
    if (!blockFilter || !blockFilter.length) return;
    const blockInfo = blockFilter[ 0 ];
    if (!blockInfo) return;

    if (blockInfo.height == 16) {
        // if sifter not below me, convert back to minecraft version
        // because I am normal height        
        if (watchFor.sifterBlocks.includes(blockBelow.typeId))
            return;

        //if another block like me, short is below me, do not change
        if (blockBelow.typeId != block.typeId &&
            blockBelow.typeId.startsWith(blockInfo.nameSpace + blockInfo.base))
            return;

        //I can change now
        const mcBlockTypeId = `minecraft:${blockInfo.base}`;
        system.run(() => {
            block.setType(mcBlockTypeId);
        });
    }
    //if I am not a full block, can I combine with block above me?
    else if (blockInfo.height < 16) {

        //should always be unless at top of the world... TODO: check for top of the world
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
                if (blockBelow && watchFor.sifterBlocks.includes(blockBelow.typeId))
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