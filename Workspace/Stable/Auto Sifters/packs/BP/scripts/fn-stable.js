//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
import { Block, BlockPermutation } from "@minecraft/server";
import { chatLog} from "./settings.js";
import { blocksDotJson } from "./common-data/blocks.json.js";
import { fallThruBlocks } from "./common-data/globalConstantsLib.js";
import { endsWithNumber, getLastWord, minusLastWord } from "./common-stable/tools/stringLib.js";
import { GetBlockState, PlaceBlock } from "./common-stable/blockLib-stable.js";
//==============================================================================
/**
 * 
 * @param {string} typeID 
 * @returns {string}
 */
function baseBlockTypeIDFromSlab (typeID) {
    return typeID.split("_slab_", 1)[ 0 ];
}
//==============================================================================
//==============================================================================
/**
 * 
 * @param {Block} block 
 * @returns 
 */
export function getDw623SlabBlockFace (block) {

    if (!block || !block.isValid()) {
        throw new Error("Invalid Block");
    }

    const stateName = 'minecraft:block_face';
    const currentBlockFace = GetBlockState.string(block,stateName,true)    

    if (!"up.down.north.south.east.west".includes(currentBlockFace))
        throw new Error(`§rdw623 Slab ${stateName} trait has invalid (n.s.e.w) value: ${currentBlockFace}`);

    return currentBlockFace;
}
//==============================================================================
/**
 * 
 * @param {Block} block 
 * @param {string} newTypeId 
 * @param {string} blockFace 
 * @param {boolean} airOnly 
 */
export function placeDw623Slab (block, newTypeId, blockFace, airOnly = true) {

    if (airOnly && !fallThruBlocks.includes(block.typeId)) {        
        return false;
    }

    return replaceDw623Slab(block, newTypeId, blockFace);
}
//==============================================================================
/**
 * 
 * @param {Block} block 
 * @param {string} newTypeId 
 * @param {string} blockFace 
 */
export function replaceDw623Slab (block, newTypeId, blockFace) {
    //const verticalHalf = blockFace=='up' ? 'bottom':'top'
    const newSlabPermutation = BlockPermutation.resolve(newTypeId, { 'minecraft:block_face': blockFace });
    return PlaceBlock.permutation(block, newSlabPermutation);
}
//==============================================================================
/**
 * 
 * @param {string} typeID 
 * @returns {string}
 */
export function slabTypeIDSansHeight (typeID) {
    if (endsWithNumber(typeID)) {
        return minusLastWord(typeID, '_');
    }
    else {
        return typeID;
    }
}
//==============================================================================
/**
 * 
 * @param {string} typeID 
 * @returns {number}
 */
export function slabTypeIDHeight (typeID) {
    if (endsWithNumber(typeID)) {
        const lastWord = getLastWord(typeID, '_');
        return parseInt(lastWord) ?? 0;
    }
    else
        return 0;
}
//==============================================================================
// End of File
//==============================================================================