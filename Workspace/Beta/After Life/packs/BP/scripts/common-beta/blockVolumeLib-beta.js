//@ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20251026 - move stable stuff out
========================================================================*/
import { Dimension, system, Block } from "@minecraft/server";
import { Blocks } from "../common-stable/gameObjects/blockLib";
//=============================================================================
/** @typedef {import("@minecraft/server").Vector2} Vector2 */
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** @typedef {import("@minecraft/server").VectorXZ} VectorXZ */
//=========================================================================
/**
 * @param {Dimension} dimension  
 * @param {Vector3} location 
 * @param {number} radius
 * @param {string} fillWithBlockTypeId 
 * @param {import("@minecraft/server").BlockFilter} [replaceFilter] 
 * @filter example: { includeTypes: [ "minecraft:air" ] } 
 */
export function fillCommand (dimension, location, radius, fillWithBlockTypeId, replaceFilter = {}) {
    const blocks = Blocks.blocksAround(dimension, location, radius, replaceFilter);
    if (blocks.length == 0) return;

    //TODO: confirm block typeId
    const myJob = fillCommandGenerator(blocks, fillWithBlockTypeId);
    system.runJob(myJob);
}
//=========================================================================
/**
* @param {Dimension} dimension  
* @param {Vector3} location 
* @param {number} radius
* @param {import("@minecraft/server").BlockFilter} replaceFilter
* @filter example: { includeTypes: [ "minecraft:air" ] } 
* @param {string} fillWith 
*/
export function replace (dimension, location, radius, replaceFilter, fillWith,) {
    fillCommand(dimension, location, radius, fillWith, replaceFilter);
}
//=============================================================================-
/**
 * 
 * @param {Block[]} blocks 
 * @param {string} setBlockTypeId
 */
function* fillCommandGenerator (blocks, setBlockTypeId) {
    for (const block of blocks) {
        block.setType(setBlockTypeId);
        yield;
    }
}