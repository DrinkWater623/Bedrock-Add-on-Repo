//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241230 - Created
========================================================================*/
import { Block, BlockPermutation, Direction, EquipmentSlot, Player, system } from "@minecraft/server";

/**
 * 
 * @param {Block} block 
 * @param {Direction | string} blockFace 
 * @returns {Block | undefined}
 */
export function getAdjacentBlock (block, blockFace, opposite = false, debug = false) {

    if (!block || !block.isValid()) {
        return undefined;
    }

    blockFace = blockFace.toLowerCase();

    switch (blockFace) {
        case 'below':
        case 'down':
            return opposite ? block.above(1) : block.below(1);
            break;
        case 'above':
        case 'up':
            return opposite ? block.below(1) : block.above(1);
            break;
        case 'north':
            return opposite ? block.south(1) : block.north(1);
            break;
        case 'south':
            return opposite ? block.north(1) : block.south(1);
            break;
        case 'east':
            return opposite ? block.west(1) : block.east(1);
            break;
        case 'west':
            return opposite ? block.east(1) : block.west(1);
            break;
        default:
            return undefined;
    }
}
//==============================================================================
/**
 * 
 * @param {Block} block
 * @param {string} stateName
 * @param {('string'|'number'|'boolean')} expectedType 
 * @param {boolean} [fail=true]   
 * @returns 
 */
export function getBlockState (block, stateName, expectedType, fail = true) {

    if (!block || !block.isValid()) {
        if (fail)
            throw new Error("Invalid Block");

        return;
    }

    const stateValue = block.permutation.getState(stateName);
    let errMsg = '';
    if (!stateValue) {
        errMsg = `${block.typeId} is missing valid ${stateName} state`;
    }
    else if (typeof stateValue != expectedType)
        errMsg = `${block.typeId} ${stateName} trait is not a string: ${stateValue}`;

    if (errMsg) {
        if (fail)
            throw new Error(errMsg);

        return undefined;
    }

    return stateValue;
}