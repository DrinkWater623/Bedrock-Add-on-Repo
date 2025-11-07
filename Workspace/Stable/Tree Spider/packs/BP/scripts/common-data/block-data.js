//block-data.js
// @ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: MIT
URL: https://github.com/DrinkWater623
========================================================================
Change Log
    20250103 - Created
========================================================================
TODO: add more types as I need them or think of them   
========================================================================*/
import { MinecraftBlockTypes, MinecraftItemTypes } from "./vanilla-data.js";
//==========================================================================
//fallThruBlocks
//=============================================================================
export const airBlock = 'minecraft:air';

export const lavaBlock = "minecraft:lava";
export const lavaBlocks = [
    lavaBlock,
    "minecraft:flowing_lava"
];

export const waterBlock = 'minecraft:water';
export const waterBlocks = [
    waterBlock,
    "minecraft:flowing_water"
]
    ;
export const fallThruBlocks = [ airBlock ].concat(lavaBlocks.concat(waterBlocks));
//=============================================================================
// Vanilla blocks that have a carry Vanilla Item (some are missing tho, I think)
//=============================================================================
/** 
 * @constant
 * @type {string[]}
*/
const vanillaItems = Object.values(MinecraftItemTypes);
/** 
 * @constant
 * @type {string[]}
*/
export const vanillaBlocks = Object.values(MinecraftBlockTypes).filter(b => vanillaItems.includes(b));
//=============================================================================
// All about Wood
//=============================================================================
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
            blockName.endsWith('_standing_sign') ||
            blockName.endsWith('_wall_sign') ||
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
// Gravity Blocks - they fall on you
//=============================================================================
export const gravityBlocks = vanillaBlocks
    .filter(blockName => {
        return blockName.endsWith('_concrete_powder') ||
            blockName.endsWith(':gravel') ||
            blockName.endsWith(':red_sand') ||
            blockName.endsWith(':sand');
    });
//=============================================================================
// regular tree leaves and stuff
//=============================================================================
export const leafBlocks = vanillaBlocks
    .filter(blockName => {return blockName.endsWith('_leaves');});

export const saplingBlocks = vanillaBlocks
    .filter(blockName => {return blockName.endsWith('_sapling');});
//=============================================================================
export const tallNatureBlocks = [
    "minecraft:rose_bush",
    "minecraft:lilac",
    "minecraft:peony",
    "minecraft:sugar_cane",
    "minecraft:sunflower",
    "minecraft:torchflower",
    "minecraft:tall_grass",
    "minecraft:tall_dry_grass",
    'minecraft:large_fern'
]
// End of File
//=============================================================================