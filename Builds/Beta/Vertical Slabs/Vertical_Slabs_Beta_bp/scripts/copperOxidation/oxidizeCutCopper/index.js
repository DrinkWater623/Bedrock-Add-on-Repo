//@ts-check
//========================================================================
// Code Credit: QuazChick
// License: MIT
// url: https://github.com/QuazChick/pillars-addon/tree/main/BP/scripts/src/components/cutCopperPillarOxidation
// Converted from TS with: https://transform.tools/typescript-to-javascript
// Altered for my slabs instead of her pillars
//========================================================================
import { Block, BlockComponentRandomTickEvent, BlockPermutation } from "@minecraft/server";
import { getRelativeOxidationLevels } from "./getRelativeOxidationLevels";
import { blockOxidationLevels } from "./blockOxidationLevels";
import { RelativeOxidationLevel } from "./oxidationLevels";

const slabBlocks = [
    "dw623:vertical_cut_copper_slab",
    "dw623:vertical_exposed_cut_copper_slab",
    "dw623:vertical_weathered_cut_copper_slab",
    "dw623:vertical_oxidized_cut_copper_slab"
];

export const CutCopperOxidationBlockComponent = {
    /**
     * 
     * @param {BlockComponentRandomTickEvent} event 
     */
    onRandomTick: event => {
        
        if (Math.random() >= 0.075) return;
        copperOxidation(event.block);
    }
};

/**
 * 
 * @param {Block} block 
 * @returns 
 */
function copperOxidation (block) {

    

    const currentOxidationLevel = blockOxidationLevels[ block.typeId ];
    if (currentOxidationLevel === undefined) {        
        return;
    }
    

    let total = 0;
    let higher = 0;

    for (const relativeOxidation of getRelativeOxidationLevels(
        block.dimension,
        block.location,
        currentOxidationLevel,
        4
    )) {        
        if (relativeOxidation === RelativeOxidationLevel.Lower) return;
        else if (relativeOxidation === RelativeOxidationLevel.Higher) higher++;

        total++;
    }    

    const c = (higher + 1) / (total + 1);
    const modifier = currentOxidationLevel ? 1 : 0.75;
    const oxidationProbability = modifier * c ** 2;

    if (Math.random() >= oxidationProbability) return;

    const nextOxidationLevel = currentOxidationLevel + 1;

    const newBlock = slabBlocks[ nextOxidationLevel ];

    if (!newBlock) return;

    block.setPermutation(
        BlockPermutation.resolve(newBlock, block.permutation.getAllStates())
    );
}
