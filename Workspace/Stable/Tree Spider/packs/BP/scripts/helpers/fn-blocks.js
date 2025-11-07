// fn-blocks.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20251023 - add in stable stuff and update to api 2.0 and move debug-only stuff out
========================================================================*/
import { Block } from "@minecraft/server";
//Shared
import { airBlock } from "../common-data/block-data.js";
import * as vanillaBlocks from "../common-data/block-data.js";
import { chance } from "../common-other/mathLib.js";
import { spawnAfterRandomTicks } from "../common-stable/entityClass.js";
//Local
import { watchFor } from '../settings.js';
//===================================================================
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** The function type subscribe expects. */
//===================================================================
const debugFunctionsOn = false;
//===================================================================
const AIR_BLOCK = airBlock;
const HOME_ID = watchFor.home_typeId;

//===================================================================
/** @type {ReadonlySet<string>} */ const LEAVES = new Set(watchFor.target_leaves);
/** @type {ReadonlySet<string>} */ const LOGS = new Set(watchFor.target_logs);
/** @type {(id: string) => boolean} */
const isValidNeighborBlockTypeIdForPlacingWebs = (id) => id === HOME_ID || LEAVES.has(id) || LOGS.has(id);
//===================================================================
const leaves = [ ...vanillaBlocks.leafBlocks ];
const saplings = [ ...vanillaBlocks.saplingBlocks ];
const tallPlants = [ ...vanillaBlocks.tallNatureBlocks ];
//===================================================================
const allowedSpiderHangoutNatureBlocks = [
    watchFor.home_typeId,
    watchFor.food_typeId, //firefly bush
    'minecraft:deadbush',
    'minecraft:mangrove_roots',
].concat(leaves).concat(saplings).concat(tallPlants);
//===================================================================
/**
 * @param {string} blockTypeId 
 * @returns {boolean} 
 */
export function validNatureBlockForSpiders (blockTypeId) {
    if (!blockTypeId) return false;

    if (allowedSpiderHangoutNatureBlocks.includes(blockTypeId)) return true;

    //if any custom
    const suffixList = [
        'leaves', 'saplings', 'bush','litter' //?? web - would there be custom webs?
    ];

    suffixList.forEach(itemSfx => {
        if (blockTypeId.endsWith((`_${itemSfx}`))) return true;
    });

    return false;
}
/**
 * 
 * @param {Block} block
 * @param {number} [spawnChance=1]  
 * @param {{ minTicks: number; maxTicks: number; }} [opts={minTicks:0,maxTicks:1}] 
 */
export function spiderSpawnFromValidNatureBlock (block, spawnChance = 1, opts = { minTicks: 0, maxTicks: 1 }) {
    if (!chance(spawnChance)) return;

    if (!block || !block.isValid) return;
    if (!validNatureBlockForSpiders(block.typeId)) return;

    const minTicks = 0 || opts?.minTicks;
    const maxTicks = 0 || opts?.maxTicks;

    spawnAfterRandomTicks(block.dimension, block.location, watchFor.typeId, minTicks, maxTicks);
}
//===================================================================
//===================================================================
/**
 * Returns adjacent web (any side at 1 block) or a web straight above within `numberOfBlocksMax`,
 * scanning upward only through air. Stops if a non-air, non-web block is hit.

 * @param {Block} block 
 * @param {number} numberOfBlocksAboveMax 
 * @returns {Block | undefined}
 * @summary Returns block of adjacent web or web (number of blocks) above
 */
export function closestWeb (block, numberOfBlocksAboveMax = 8) {

    const neighbors = [
        block.above(),
        block.below(),
        block.east(),
        block.west(),
        block.north(),
        block.south(),
    ];

    for (const nb of neighbors) {
        const id = nb?.typeId;
        if (id && id === HOME_ID) return nb;
    }

    //now above only
    if (numberOfBlocksAboveMax <= 1) return;

    //ChatGPT - Look above starting at 2nd block, until max is reached, as long as block is air
    let up = block.above(); // 1 above (already checked in neighbors)
    if (!up) return;

    for (let i = 2; i <= numberOfBlocksAboveMax; i++) {
        up = up.above();
        if (!up) break;

        const id = up.typeId;
        if (id === HOME_ID) return up;                 // found web
        if (id !== AIR_BLOCK) break;             // blocked by something else
    }

    //Found None
    return;
}
//===================================================================
/** 
 *  Returns adjacent air block that has non-air block above it
 * @param {Block} block 
 * @returns {Block | undefined}
 * @summary Returns block of adjacent air
 */
export function closestExpandableWebLocation (block) {

    //order changed for preference
    const neighbors = [
        block.east(),
        block.west(),
        block.north(),
        block.south(),
        block.above(),
        block.below()
    ];

    for (const nb of neighbors) {
        const id = nb?.typeId;
        if (id && id === airBlock) {
            const above = nb.above();
            if (above && above.typeId !== airBlock) return nb;
        }
    }

    //Found None
    return;
}
//===================================================================
/** 
 * @param {Block} block 
 * @returns {boolean} 
 */
export function targetBlockAdjacent (block) {

    const neighbors = [
        block.above(),
        block.below(),
        block.east(),
        block.west(),
        block.north(),
        block.south(),
    ];

    for (const nb of neighbors) {
        const id = nb?.typeId;
        if (id && isValidNeighborBlockTypeIdForPlacingWebs(id)) return true;
    }
    return false;
}
//===================================================================
// End of File
//===================================================================