//@ts-check
//==============================================================================

import { Block, BlockPermutation, Player, PlayerPlaceBlockBeforeEvent, world } from "@minecraft/server";
import { watchFor } from "../settings";
import { GetBlockState, GetBlockStates, PlaceBlock } from "../common-stable/blockLib-stable";
import { spawnLoot } from "../common-stable/itemLib-stable";
import { waterBlock } from "../common-data/block-data";
import { FaceLocationGrid, Vector2Lib } from "../common-stable/tools/vectorClass";
import { PlayerLib } from "../common-stable/playerClass";

//==============================================================================
/**
 * 
 * @param {PlayerPlaceBlockBeforeEvent} event 
 */
export function block_placeBeforeHandler (event) {
    // reasons to skip
    if (!event.player || !event.block || !event.permutationBeingPlaced) return;
    if (event.permutationBeingPlaced.type.id == watchFor.sea_sponge_stump_loot) {
        placeStumps(event);
        return;
    }
}
//==============================================================================
/**
 * 
 * @param {PlayerPlaceBlockBeforeEvent} event 
 */
function placeStumps (event) {
    event.cancel = true;

    if (event.block.typeId != waterBlock) {
        return;
    }

    if (PlayerLib.mainHandItemCount(event.player) < 3) {
        return;
    }

    //check block below
    const blockBelow = event.block.below(1);
    if (!blockBelow) {
        return;
    }

    //TODO: program for v3 later
    let blockVersionToPlace = watchFor.sea_sponge_blocks.indexOf((blockBelow.typeId));

    let blockToPlace = '';
    let stateName = '';

    if (blockVersionToPlace == -1) {
        //not stacking
        if (!blockBelow.isSolid) return;

        blockVersionToPlace = 1;
        blockToPlace = watchFor.sea_sponge_blocks[ blockVersionToPlace ];
        stateName = watchFor.sea_sponge_states[ blockVersionToPlace ];
    }
    else if (blockVersionToPlace < 2) {
        blockToPlace = watchFor.sea_sponge_blocks[ blockVersionToPlace ];
        stateName = watchFor.sea_sponge_states[ blockVersionToPlace ];

        //make sure full sea sponge is below
        if (blockVersionToPlace == 0) {
            const isStem = GetBlockState.boolean(blockBelow, stateName);
            if (!isStem) return;
        }
        else {
            const stemLevel = GetBlockState.number(blockBelow, stateName);
            if (stemLevel != 3) return;
        }

        //v3
    }

    // for now, all or nothing    
    const stateValue = blockVersionToPlace == 0 ? true : 0; //v3

    PlaceBlock.withState(event.block, blockToPlace, stateName, stateValue, 'pop');
    PlayerLib.mainHandRemoveSome(event.player,3,false);
}


