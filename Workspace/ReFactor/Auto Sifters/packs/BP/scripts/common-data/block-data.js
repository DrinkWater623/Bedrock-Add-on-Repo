//block-data.js
// @ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: MIT
URL: https://github.com/DrinkWater623
========================================================================
Change Log
    20250103 - Created
    20251118 - Added logs/stairs
    20260104 - Move stuff to cached Class because of using BlockTypes which is not available on before world load
========================================================================
TODO: add more types as I need them or think of them   
========================================================================*/

// NOTE:
// Most block typeId sets/arrays were moved into BlockTypeIds (blockLib.js) as cached collections
// so that importing this module does not require the world registry to be ready.

export const airBlock = 'minecraft:air';

export const lavaBlock = 'minecraft:lava';
export const lavaBlocks = [
    lavaBlock,
    'minecraft:flowing_lava'
];

export const waterBlock = 'minecraft:water';
export const waterBlocks = [
    waterBlock,
    'minecraft:flowing_water'
];
export const fallThruBlocks = [ airBlock ].concat(lavaBlocks.concat(waterBlocks));

//=============================================================================
// End of File
//=============================================================================
