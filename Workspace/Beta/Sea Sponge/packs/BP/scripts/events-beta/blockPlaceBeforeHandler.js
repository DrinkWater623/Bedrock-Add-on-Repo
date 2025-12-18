//@ts-check
//==============================================================================

import { PlayerPlaceBlockBeforeEvent } from "@minecraft/server";
import { watchFor } from "../settings";
import {  PlaceBlock,spawnLoot,PlayerLib, Permutations } from "../common-stable/gameObjects/index.js";
import { waterBlock } from "../common-data/index";
//==============================================================================
/**
 * 
 * @param {PlayerPlaceBlockBeforeEvent} event 
 */
export function block_placeBeforeHandler (event) {
    // reasons to skip
    if (!event.player || !event.block || !event.permutationToPlace) return;
    if (event.permutationToPlace.type.id == watchFor.sea_sponge_stump_loot) {
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
            const isStem = Permutations.getBooleanState(blockBelow, stateName);
            if (!isStem) return;
        }
        else {
            const stemLevel = Permutations.getNumberState(blockBelow, stateName);
            if (stemLevel != 3) return;
        }

        //v3
    }

    // for now, all or nothing    
    const stateValue = blockVersionToPlace == 0 ? true : 0; //v3

    PlaceBlock.withState(event.block, blockToPlace, stateName, stateValue, 'pop');
    PlayerLib.mainHandRemoveSome(event.player,3,false);
}


