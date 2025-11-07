/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: MIT
URL: https://github.com/DrinkWater623
========================================================================
Change Log
    20251102 - Created
========================================================================*/
//@ts-check
import { MinecraftBlockTypes, MinecraftItemTypes } from "./vanilla-data.js";
//=============================================================================
const vanillaBlocks = Object.values(MinecraftBlockTypes);
/** 
 * @constant
 * @type {string[]}
*/
export const vanillaItems = Object.values(MinecraftItemTypes).filter(b => !vanillaBlocks.includes(b));

export const vanillaTools = vanillaItems.filter(item => {
    if (item.endsWith('_axe')) return true;
    if (item.endsWith('_hoe')) return true;
    if (item.endsWith('_pickaxe')) return true;
    if (item.endsWith('_shovel')) return true;
    if (item.endsWith('_sword')) return true;

    if (item.endsWith(':bow')) return true;
    if (item.endsWith(':crossbow')) return true;
    if (item.endsWith(':mace')) return true;
    if (item.endsWith(':shears')) return true;
    if (item.endsWith(':trident')) return true;

    return false;
});
//==================================================================== 
export const hoes=vanillaTools.filter(item => item.endsWith('_hoe'))
export const shovels=vanillaTools.filter(item => item.endsWith('_shovel'))
export const swords=vanillaTools.filter(item => item.endsWith('_sword'))
//====================================================================
export const vanillaWeapons = vanillaTools.filter(item => {
    if (item.endsWith('_sword')) return true;
    if (item.endsWith(':bow')) return true;
    if (item.endsWith(':crossbow')) return true;
    if (item.endsWith(':mace')) return true;
    if (item.endsWith(':trident')) return true;

    return false;
});
//====================================================================
export const vanillaClothes = vanillaItems.filter(item => {
    if (item.endsWith('_boots')) return true;
    if (item.endsWith('_chestplate')) return true;
    if (item.endsWith('_helmet')) return true;
    if (item.endsWith('_leggings')) return true;

    return false;
});
//=============================================================================
// End of File
//=============================================================================