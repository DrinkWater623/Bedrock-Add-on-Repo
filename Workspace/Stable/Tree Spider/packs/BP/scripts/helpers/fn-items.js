// fn-items.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20251023 - add in stable stuff and update to api 2.0 and move debug-only stuff out
========================================================================*/
import { ItemStack } from "@minecraft/server";
//Shared
import * as vanillaItems from "../common-data/item-data.js";
//===================================================================
const allowLongStickLikeTools=[
    "minecraft:bamboo",
    "minecraft:bone",
    "minecraft:stick",
    "minecraft:trident"
].concat(vanillaItems.hoes)
.concat(vanillaItems.shovels)
.concat(vanillaItems.swords)

//===================================================================
/**
 * can stick or long item
 * @param {string} toolTypeId 
 * @returns {boolean} 
 */
export function validLongToolForInteractToShakeSpidersOut (toolTypeId) {
    if (!toolTypeId) return false;

    if(allowLongStickLikeTools.includes(toolTypeId)) return true;

    //if any custom
    const suffixList=[
        'hoe','shovel','sword','trident','stick','torch','arrow','rod'
    ]

    suffixList.forEach(toolSfx => {
        if (toolTypeId.endsWith((`_${toolSfx}`))) return true        
    });

    return false;
}
//===================================================================
// End of File
//===================================================================