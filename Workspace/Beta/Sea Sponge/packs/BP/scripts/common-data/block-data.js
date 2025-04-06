/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: MIT
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20250103 - Created
========================================================================*/
//@ts-check
import { MinecraftBlockTypes, MinecraftItemTypes } from "./vanilla-data.js";
//=============================================================================
export const airBlock = 'minecraft:air';
export const lavaBlock = "minecraft:lava";
export const lavaBlocks = [
    "minecraft:lava",
    "minecraft:flowing_lava"
];
export const waterBlock = 'minecraft:water';
export const waterBlocks = [
    "minecraft:water",
    "minecraft:flowing_water"
];
export const fallThruBlocks = [airBlock].concat(lavaBlocks.concat(waterBlocks))

//=============================================================================
/** 
 * @constant
 * @type {string[]}
*/
export const vanillaItems = Object.values(MinecraftItemTypes);
/** 
 * @constant
 * @type {string[]}
*/
export const vanillaBlocks = Object.values(MinecraftBlockTypes).filter(b => vanillaItems.includes(b));
export const woodTypes = vanillaBlocks
    .filter(block => block.endsWith('_planks'))
    .map(s => s.replace('minecraft:', '').replace('_planks', ''));

/** 
 * @constant
 * @type {string[]}
*/
export const woodBlocks = vanillaBlocks
    .filter(blockName => {
        return blockName.endsWith('_button') ||
            blockName.endsWith('_door') ||
            blockName.endsWith('_fence') ||
            blockName.endsWith('_fence_gate') ||
            blockName.endsWith('_hanging_sign') ||
            blockName.endsWith('_hyphae') ||
            blockName.endsWith('_log') ||
            blockName.endsWith('_planks') ||
            blockName.endsWith('_pressure_plate') ||
            blockName.endsWith('_sign') ||
            blockName.endsWith('_slab') ||
            blockName.endsWith('_stairs') ||
            blockName.endsWith('_stem') ||
            blockName.endsWith('_wood');
    })
    .filter(blockName => {
        const words = blockName.split('_');
        return woodTypes.some(
            woodType => {
                blockName.startsWith('minecraft:' + woodType + '_') ||
                    blockName.startsWith('minecraft:' + 'stripped' + woodType + '_');
            });
    });
//=============================================================================
// End of File
//=============================================================================