//@ts-check
import {   Dimension, ItemStack, system } from "@minecraft/server";
import {  lootTableItems } from '../settings.js';
//==============================================================================
var itemTestDone = true;
//==============================================================================
/**
 * 
 * @param {Dimension} dim 
 * @param {import("@minecraft/server").Vector3} loc 
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
 * @param {import("@minecraft/server").Vector3} location 
 */
export function run_testLoot(dimension,location){
    if (!itemTestDone) {
        itemTestDone = true;        
        location.y += 2;
        system.runJob(testLootJob(dimension, location));
    }
}