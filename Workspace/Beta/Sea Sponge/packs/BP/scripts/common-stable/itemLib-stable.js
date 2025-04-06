//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20250105a - Created
========================================================================*/
import { Block, ItemStack, system } from "@minecraft/server";
//=============================================================================
//==============================================================================
/**
 * 
 * @param {Block} block 
 * @param {string } lootTypeID
 * @param {number} [count=1] 
 * @returns 
 */
export function spawnLoot (block, lootTypeID, count = 1) {
    if (count < 1) return;

    let itemStack = new ItemStack(lootTypeID, count);
    system.run(() => {
        block.dimension.spawnItem(itemStack, block.center());
    })
}
//==============================================================================
// End of File
//==============================================================================