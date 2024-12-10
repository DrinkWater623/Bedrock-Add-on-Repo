//@ts-check
import { Block, BlockComponentTickEvent, ItemStack, system } from "@minecraft/server";
import { watchFor, chatLog, globals, lootTableItems } from '../../settings.js';
//==============================================================================
/**
 * 
 * @param {BlockComponentTickEvent} e 
 * @returns 
 */
export function sifter_query_onTick (e) {
    const debug = false;

    const blockAbove = e.block.above(1);

    if (!blockAbove || !globals.keyBlockWords.some(word => blockAbove.typeId.includes(word))) {
        return;
    }

    //Have to make a reason for you to make a better one
    if (e.block.typeId.includes("copper")) {
        if (Math.random() > 0.5) {
            chatLog.log('copper sifter 50% chance wait', debug);
            return;
        }
    }
    else if (e.block.typeId.includes("iron")) {
        if (Math.random() > 0.75) {
            chatLog.log('iron sifter 25% chance wait', debug);
            return;
        }
    }
    else if (e.block.typeId.includes("diamond")) {
        if (Math.random() > 0.90) {
            chatLog.log('diamond sifter 10% chance wait', debug);
            return;
        }
    }

    //2 blocks have to go slower period
    if (blockAbove.typeId.includes("mud") || blockAbove.typeId.includes("soul_sand")) {
        if (Math.random() > 0.4) {
            chatLog.log('mud/soul sand 60% chance wait', debug);
            return;
        }
    }

    //minecraft gravity block above me? Yes, convert to siftable block
    if (watchFor.vanillaSifterBlocks.includes(blockAbove.typeId)) {
        chatLog.log('Vanilla Block On Me', debug);
        sifterConvertAndSift(e.block, blockAbove);
    }
    //go Sift
    else if (watchFor.customSiftableBlocks.includes(blockAbove.typeId)) {
        chatLog.log('Custom Block On Me', debug);
        sifterSift(e.block, blockAbove);
    }
}
//==============================================================================
//  Support Function, only used in this JS
//==============================================================================
/**
 * 
 * @param {Block} block 
 * @param {Block} [blockAbove]
 */
function sifterSift (block, blockAbove) {
    if (!block.isValid()) 
        return;

    if (!blockAbove) 
        blockAbove = block.above(1);

    if (!blockAbove || blockAbove.typeId == globals.mcAir) 
        return;

    //sifting slabs
    const blockFilter = watchFor.customSiftableBlockInfo.filter(b => b.typeId == blockAbove.typeId);
    if (!blockFilter || !blockFilter[ 0 ]) {
        return;
    }

    const blockInfo = blockFilter[ 0 ];

    block.dimension.playSound(blockInfo.sound, block.location, { pitch: 1, volume: 2 });

    let particleLocation = block.bottomCenter();
    particleLocation.y += blockInfo.height / 16;
    block.dimension.spawnParticle("minecraft:dust_plume", particleLocation);

    spawnDustBlock(blockAbove, 0.25);
    spawnRandomLoot(blockAbove, blockInfo.height, 0.10);

    let newBlockTypeId = "";
    if (blockInfo.height == 1) {
        newBlockTypeId = globals.mcAir;
    }
    else {
        //decrement height
        newBlockTypeId = `${blockInfo.typeIdBase}_${blockInfo.height - 1}`;
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
function sifterConvertAndSift (block, blockAbove) {

    if (watchFor.vanillaSifterBlocks.includes(blockAbove.typeId)) {
        const convertedBlockTypeId = blockAbove.typeId.replace(globals.minecraftNameSpace, globals.mainNameSpace) + '_slab_16';
        chatLog.log(`Convert to ${convertedBlockTypeId}`)

        //TODO: confirm valid block in game
        if (watchFor.customSiftableBlocks.includes(convertedBlockTypeId)) {
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
// End of File
//==============================================================================