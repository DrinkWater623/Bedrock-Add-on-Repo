// fn-blocks.js  Tree Spiders
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
import { spawnEntityAfterRandomTicks, spawnEntityAtLocation } from "../common-stable/entities/entityClass.js";
import { chance } from "../common-stable/tools/mathLib.js";
import { GetBlock, isValidBlock } from "../common-stable/blocks/blockLib-stable.js";
//Local
import { watchFor, alertLog } from '../settings.js';
import { devDebug } from "./fn-debug.js";

//===================================================================
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** @typedef {Block | undefined} PossibleBlock*/
/** The function type subscribe expects. */
//===================================================================
const debugFunctionsOn = false;
const watchPlayerActions = devDebug.watchPlayerActions;
//===================================================================
const AIR_BLOCK = airBlock;
const HOME_ID = watchFor.spider_home_typeId;

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
    watchFor.spider_home_typeId,
    watchFor.spider_foodBlock_typeId, //firefly bush
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

    spawnEntityAfterRandomTicks(dimension, location, watchFor.spider_typeId, minTicks, maxTicks);
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
 * @param {string} blockFaceHit
 * @param {number} [initialChance=1] 
 */
export function rattleEntityFromBlockWithItem (blockHit, itemUsed, blockFaceHit, initialChance = 1) {
    if (!blockHit || !blockHit.isValid) return;

    const _name = 'rattleEntityFromBlockWithItem';
    const debugMe = watchPlayerActions;

    const blockHitTypeID = blockHit.typeId;
    alertLog.log(`>> ${_name} (${blockHitTypeID}, ${itemUsed}, blockFaceHit = ${blockFaceHit}, initialChance = ${initialChance})`, debugMe);

    const blockHitDim = blockHit.dimension;
    const blockHitLoc = blockHit.location;
    const aboveBlock = blockHit.above();


    const containerBlockList = [
        "minecraft:composter",
        "minecraft:cauldron"
    ];

    //======
    //Both - may need this one to be in subs to take itemStack
    //======
    if (itemUsed == "dw623:bottle_of_flies") {
        system.runTimeout(() => {
            const adjacentBlock = GetBlock.adjacent(blockHit, blockFaceHit);
            if (!adjacentBlock || !adjacentBlock.isAir) return;

            adjacentBlock.dimension.playSound("random.glass", adjacentBlock.location);

            if (blockHitTypeID === watchFor.spider_home_typeId) {
                spawnEntityAtLocation(watchFor.spider_typeId, adjacentBlock.dimension, adjacentBlock.location, 1, 1, 20, 100);
            }

            //TODO: need to vary location in web for flies
            spawnEntityAtLocation(watchFor.fly_typeId, adjacentBlock.dimension, adjacentBlock.location, 5, 10, 20, 100);
        }, 1);
        return;
    }

    //The rest can use initialChance
    if (initialChance < 1) if (!chance(initialChance)) return;

    if (containerBlockList.includes(blockHitTypeID)) {
        if (!aboveBlock || !aboveBlock.isValid || aboveBlock.typeId !== airBlock) {
            alertLog.warn(`xx ${_name} - Top of block is not AIR`, debugMe);
            return;
        };
        
        blockFaceHit = 'up';
    }

    //=======
    //Spiders
    //=======
    if (itemUsed == "dw623:dead_fly_ball_stick") {
        //TODO: add chance
        system.runTimeout(() => {
            spiderSpawnFromValidNatureBlock(blockHit.typeId, blockHit.dimension, blockHit.location, 0.30, { minTicks: 30, maxTicks: 80 });
        }, 1);
        return;
    }

    //======
    //Flies
    //======    

    if (itemUsed == "dw623:rotten_flesh_kabob") {
        //TODO: add chance
        system.runTimeout(() => {
            if (containerBlockList.includes(blockHit.typeId)) {
                if (aboveBlock) spawnEntityAtLocation(watchFor.fly_typeId, aboveBlock.dimension, aboveBlock.location, 1, 3, 20, 100);
                return;
            }

            //FIXME: need to adjust for face hit, if composter - on top, or leaves, do face
        }, 1);
        return;
    }

    alertLog.warn(`xx ${_name} - Action not defined for Item`, debugMe);
}
//===================================================================
// End of File
//===================================================================