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
import { system, Block, Dimension } from "@minecraft/server";
//Shared
import { airBlock } from "../common-data/block-data.js";
import * as vanillaBlocks from "../common-data/block-data.js";
import { spawnEntityAfterRandomTicks, spawnEntityAtLocation } from "../common-stable/entityClass.js";
import { chance } from "../common-other/mathLib.js";
import { GetBlock, isValidBlock } from "../common-stable/blockLib-stable.js";
//Local
import { watchFor, alertLog } from '../settings.js';


//===================================================================
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** @typedef {Block | undefined} PossibleBlock*/
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
const allowedFlyHangoutNatureBlocks = [
    'minecraft:web',
    'minecraft:composter',
    'minecraft:sweet_berry_bush',
];
//===================================================================
/**
 * @param {string | undefined} blockTypeId 
 * @returns {boolean} 
 */
export function validNatureBlockForFiles (blockTypeId) {

    if (!blockTypeId) return false;

    if (allowedFlyHangoutNatureBlocks.includes(blockTypeId)) return true;

    //if any custom
    /**@type {string[]} */
    const suffixList = [];

    suffixList.forEach(itemSfx => {
        if (blockTypeId.endsWith((`_${itemSfx}`))) return true;
    });

    return false;
}
//===================================================================
/**
 * @param {string | undefined} blockTypeId 
 * @returns {boolean} 
 */
export function validNatureBlockForSpiders (blockTypeId) {

    if (!blockTypeId) return false;

    if (allowedSpiderHangoutNatureBlocks.includes(blockTypeId)) return true;

    //if any custom
    const suffixList = [
        'leaves', 'saplings', 'bush', 'litter' //?? web - would there be custom webs?
    ];

    suffixList.forEach(itemSfx => {
        if (blockTypeId.endsWith((`_${itemSfx}`))) return true;
    });

    return false;
}
/**
 * @param {string} typeId
 * @param {Dimension} dimension
 * @param {Vector3} location
 * @param {number} [spawnChance=1]  
 * @param {{ minTicks: number; maxTicks: number; }} [opts={minTicks:0,maxTicks:1}] 
 */
export function spiderSpawnFromValidNatureBlock (typeId, dimension, location, spawnChance = 1, opts = { minTicks: 0, maxTicks: 1 }) {

    if (!chance(spawnChance)) { return; }
    if (!validNatureBlockForSpiders(typeId)) { return; }
    if (!dimension.isChunkLoaded(location)) { return; };

    const minTicks = 0 || opts?.minTicks;
    const maxTicks = 0 || opts?.maxTicks;

    spawnEntityAfterRandomTicks(dimension, location, watchFor.typeId, minTicks, maxTicks);
}
//===================================================================
//===================================================================


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
//====================================================================
/**
 * 
 * @param {Block | undefined} blockHit 
 * @param {string} itemUsed
 * @param {string} blockFace
 */
export function rattleEntityFromBlockWithItem (blockHit, itemUsed, blockFace) {
    if (!blockHit || !blockHit.isValid) return;
    alertLog.log('>> rattleEntityFromBlockWithItem');
    const blockTypeID = blockHit.typeId;
    const aboveBlock = blockHit.above();
    const aboveBlockList = [
        "minecraft:composter",
        "minecraft:cauldron"
    ];

    //=======
    //Spiders
    //=======
    if (itemUsed == "dw623:dead_fly_ball_stick") {
        //TODO: add chance
        system.runTimeout(() => {
            alertLog.log('beforeEvents_playerInteractWithBlock (dead_fly_ball_stick)');
            spiderSpawnFromValidNatureBlock(blockHit.typeId, blockHit.dimension, blockHit.location, 0.30, { minTicks: 30, maxTicks: 80 });
        }, 1);
        return;
    }

    //======
    //Both - may need this one to be in subs to take itemStack
    //======
    if (itemUsed == "dw623:bottle_of_flies") {
        system.runTimeout(() => {
            alertLog.log('beforeEvents_playerInteractWithBlock (bottle_of_flies)');

            const block = GetBlock.adjacent(blockHit, blockFace);
            if (!block || !block.isAir) return;

            //TODO: add glass break sound

            if (blockTypeID === watchFor.home_typeId) {
                spawnEntityAtLocation(watchFor.typeId, block.dimension, block.location, 1, 1, 20, 100);
            }

            //TODO: need to vary location in web for flies
            spawnEntityAtLocation(watchFor.fly_typeId, block.dimension, block.location, 5, 10, 20, 100);
        }, 1);
        return;
    }
    //======
    //Flies
    //======
    if (aboveBlockList.includes(blockHit.typeId))
        if (!aboveBlock || !aboveBlock.isValid || aboveBlock.typeId !== airBlock) return;

    if (itemUsed == "dw623:rotten_flesh_kabob") {
        //TODO: add chance
        system.runTimeout(() => {
            alertLog.log('beforeEvents_playerInteractWithBlock (rotten_flesh_kabob)');
            if (aboveBlockList.includes(blockHit.typeId)) {
                if (aboveBlock) spawnEntityAtLocation(watchFor.fly_typeId, aboveBlock.dimension, aboveBlock.location, 1, 3, 20, 100);
                return;
            }

            //FIXME: need to adjust for face hit, if composter - on top, or leaves, do face
        }, 1);
        return;
    }


}
// End of File
//===================================================================