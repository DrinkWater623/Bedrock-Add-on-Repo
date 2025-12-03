//@ts-check
import {   Dimension, ItemStack, system } from "@minecraft/server";
import {  lootTableItems } from '../settings.js';
//=============================================================================
/** @typedef {import("@minecraft/server").Vector2} Vector2 */
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** @typedef {import("@minecraft/server").VectorXZ} VectorXZ */
//==============================================================================
var itemTestDone = true;
//==============================================================================
/**
 * 
 * @param {Dimension} dim 
 * @param {Vector3} loc 
 */
function* testLootJob (dim, loc) {

    for (const loot of lootTableItems) {
        const i = new ItemStack(loot.typeId, 1);
        dim.spawnItem(i, loc);
        yield;
    }
}
/**
 * 
 * @param {Dimension} dimension 
 * @param {Vector3} location 
 */
export function run_testLoot(dimension,location){
    if (!itemTestDone) {
        itemTestDone = true;        
        location.y += 2;
        system.runJob(testLootJob(dimension, location));
    }
}