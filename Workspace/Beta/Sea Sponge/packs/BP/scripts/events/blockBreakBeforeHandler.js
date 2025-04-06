//@ts-check
//==============================================================================

import { Block, BlockPermutation, Player, PlayerBreakBlockBeforeEvent, world } from "@minecraft/server";
import { watchFor } from "../settings";
import { GetBlockState, GetBlockStates, PlaceBlock } from "../common-stable/blockLib-stable";
import { spawnLoot } from "../common-stable/itemLib-stable";
import { waterBlock } from "../common-data/block-data";
import { FaceLocationGrid, Vector2Lib } from "../common-stable/vectorClass";

//==============================================================================
/**
 * 
 * @param {PlayerBreakBlockBeforeEvent} event 
 */
export function block_breakBeforeHandler (event) {

    // reasons to skip
    if (!event.player || !event.block) return;
    if (!watchFor.sea_sponge_blocks.includes(event.block.typeId)) {
        const blockAbove=event.block.above(1)
        if(blockAbove && watchFor.sea_sponge_blocks.includes(blockAbove.typeId))
            harvestAll(blockAbove)
        return;
    }

    /*
        Only shears can snip parts and leave stumps
        All other tools break the blocks into parts - no stumps
        Unless stumps were all tht was left

        v3 is the only one that needs script to handle the loot count
        unless loot can read states.
    */

    event.cancel = true;
    if (event.itemStack && event.itemStack.typeId == 'minecraft:shears') {

        if (event.block.typeId == watchFor.sea_sponge_blocks[ 2 ]) {
            harvestOneLevelOneStem(event);
            return;
        }

        //Only v1 and v2
        harvestOneLevel(event.block);
        return;
    }
    else {
        harvestAll(event.block, false);
        return;
    }
}
//==============================================================================
/**
 * 
 * @param {Block} block 
 *
 */
function harvestOneLevel (block) {
    let lootId=''
    let lootCount=0
    var newPermutation= block.permutation;

    //v1
    if (block.typeId == watchFor.sea_sponge_blocks[ 0 ]) {
        const blockStateName = watchFor.sea_sponge_states[ 0 ];
        const stems = GetBlockState.boolean(block, blockStateName, true);

        if (stems) {
            newPermutation = block.permutation.withState(blockStateName, false);
            lootId = watchFor.sea_sponge_stem_loot[0];
            lootCount=3
        }
    }

    //v2
    else if (block.typeId == watchFor.sea_sponge_blocks[ 1 ]) {
        const blockStateName = watchFor.sea_sponge_states[ 1 ];
        let stemLevel = GetBlockState.number(block, blockStateName, true);

        if (stemLevel > 0) {
            stemLevel -= 1;
            const newPermutation = block.permutation.withState(blockStateName, stemLevel);
            lootId =  watchFor.sea_sponge_stem_loot[1];
            lootCount=3                        
        }
    }

    if(lootCount>0){
        PlaceBlock.permutation(block, newPermutation, 'shear');
        spawnLoot(block, lootId, lootCount);
        return;
    }
    else{
        lootId = watchFor.sea_sponge_stump_loot;
        PlaceBlock.typeId(block, waterBlock, 'shear');
        spawnLoot(block, lootId, 3);
    }
}
//==============================================================================
/**
 * 
 * @param {Block} block
 * @param {boolean} giveStumps
 *
 */
export function harvestAll (block, giveStumps = false) {
    let stemItem = '';
    let stemCount = 0;
    let stumpCount = 3;

    //v1
    if (block.typeId == watchFor.sea_sponge_blocks[ 0 ]) {
        const blockStateName = watchFor.sea_sponge_states[ 0 ];
        const isStems = GetBlockState.boolean(block, blockStateName, true);
        stemItem = watchFor.sea_sponge_stem_loot[ 0 ];
        if (isStems) stemCount = 3;
    }
    //v2
    else if (block.typeId == watchFor.sea_sponge_blocks[ 1 ]) {
        const blockStateName = watchFor.sea_sponge_states[ 1 ];
        let stemLevel = GetBlockState.number(block, blockStateName, true);
        stemItem = watchFor.sea_sponge_stem_loot[ 1 ];
        stemCount = stemLevel * 3;
    }
    //v3
    else if (block.typeId == watchFor.sea_sponge_blocks[ 2 ]) {
        const blockStateMap = GetBlockStates.numbers(block);
        if (!blockStateMap) return;

        stemItem = watchFor.sea_sponge_stem_loot[ 2 ];
        let stemCount = 0;
        let stem_1 = parseInt(blockStateMap.get(watchFor.sea_sponge_states_v3[ 0 ]));
        let stem_2 = parseInt(blockStateMap.get(watchFor.sea_sponge_states_v3[ 1 ]));
        let stem_3 = parseInt(blockStateMap.get(watchFor.sea_sponge_states_v3[ 2 ]));
        if (stem_1 > 0) stemCount = stem_1;
        if (stem_2 > 0) stemCount += stem_2;
        if (stem_3 > 0) stemCount += stem_3;
        if (stem_1 == -1) stumpCount--;
        if (stem_2 == -1) stumpCount--;
        if (stem_3 == -1) stumpCount--;
    }

    PlaceBlock.typeId(block, waterBlock, 'shear');
    spawnLoot(block, stemItem, stemCount);

    if (giveStumps && stumpCount > 0)
        spawnLoot(block, watchFor.sea_sponge_stump_loot, stumpCount);
}
//==============================================================================
/*
    "int:stem_1":[ 3,2,1,0,-1 ], --North side
    "int:stem_2":[ 3,2,1,0,-1 ], -- west side  ==confirm from block bench view
    "int:stem_3":[ 3,2,1,0,-1 ]  -- east /south
*/
//==============================================================================
//for V3 - shears
/**
 * @param {PlayerBreakBlockBeforeEvent} event 
 */
function harvestOneLevelOneStem (event) {
    if (!event.player || !event.block || !event.itemStack) return;
    // make sure only v3
    if (event.block.typeId != watchFor.sea_sponge_blocks[ 2 ]) return;

    const blockStateMap = GetBlockStates.numbers(event.block);
    if (!blockStateMap) return;

    const stemItem = watchFor.sea_sponge_stem_loot[ 2 ];
    let stem_1 = parseInt(blockStateMap.get(watchFor.sea_sponge_states_v3[0]));
    let stem_2 = parseInt(blockStateMap.get(watchFor.sea_sponge_states_v3[1]));
    let stem_3 = parseInt(blockStateMap.get(watchFor.sea_sponge_states_v3[2]));

    let stemCount = 0;
    if (stem_1 > 0) stemCount = stem_1;
    if (stem_2 > 0) stemCount += stem_2;
    if (stem_3 > 0) stemCount += stem_3;

    let stumpCount = 3;
    if (stem_1 == -1) stumpCount--;
    if (stem_2 == -1) stumpCount--;
    if (stem_3 == -1) stumpCount--;

    if (stemCount = 0) {
        PlaceBlock.typeId(event.block, waterBlock, 'shear');

        if (stumpCount > 0)
            spawnLoot(event.block, watchFor.sea_sponge_stump_loot, stumpCount);

        return;
    }

    /* 
    TODO:
        since no face location, determine which way player is facing
        AND LOOKING relative to the block and use as blockFace
        will need to determine which stem is to be affected
    */
    const blockView = event.player.getBlockFromViewDirection({ maxDistance: 7, includeTypes: [ watchFor.sea_sponge_blocks[ 2 ] ] });
    if (!blockView) return;
    
    //is Same Block
    const block = event.block;
    if (block.location.x != blockView.block.location.x) {
        world.sendMessage('Not same x');
        return;
    }
    if (block.location.y != blockView.block.location.y) {
        world.sendMessage('Not same y');
        return;
    }
    if (block.location.z != blockView.block.location.z) {
        world.sendMessage('Not same z');
        return;
    }

    //TODO: see y level?
    const faceGridInfo = new FaceLocationGrid(blockView.faceLocation, blockView.face, false, event.player);
    const grid = faceGridInfo.grid((3));
    world.sendMessage(`Touched: ${Vector2Lib.toString(grid, 0, true, ',')}`);

}//==============================================================================
