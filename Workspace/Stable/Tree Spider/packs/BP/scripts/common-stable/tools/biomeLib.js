// biomeLib.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20251109 - created
========================================================================*/
import {Player,  Block, Dimension } from "@minecraft/server";
// Shared

// Local
//========================================================================
/**
 * 
 * @param {string} biomeId 
 */
function isForest (biomeId) {

    if (biomeId.includes('cave')) return false;
    if (biomeId.includes('underground')) return false;
    if (biomeId.includes('deep_dark')) return false;

    if (biomeId.includes('forest')) return true;
    if (biomeId.includes('jungle')) return true;
    if (biomeId.includes('savanna')) return true;
    if (biomeId.includes('hills')) return true;
    if (biomeId.includes('mountain')) return true;
    if (biomeId.includes('tiaga')) return true;
    if (biomeId.includes('bamboo')) return true;
    if (biomeId.includes('swamp')) return true;
    if (biomeId.includes('garden')) return true;

    return false;
}
//========================================================================
/**
 * 
 * @param {Player|Block} obj 
 */
export function isInForest (obj) {
    if(!obj.isValid) return false
    return isForest(obj.dimension.getBiome(obj.location).id);
}
//========================================================================
/**
 * 
 * @param {Player} p 
 */
export function isOutside (p) {
    if (!p.isValid) return false;

    const { dimension } = p;

    const inBlock = dimension.getBlock(p.location);
    if (!inBlock || !inBlock.isValid) return false;
    const playerFeetLocation = inBlock.center();

    /*
    Since getTopmostBlock returns the top most SOLID block, meaning it does not count leaves and water and webs (yay)
    I can use it to determine outside-ish
    */
    const topSolidBlock = dimension.getTopmostBlock(playerFeetLocation);
    if (!topSolidBlock) return false;

    if ([ 'overworld', 'the_end' ].includes(dimension.id)) {
        if (topSolidBlock.location.y <= playerFeetLocation.y) return true;
        //maybe under a tree, so more checking, if it was a log
        if (!topSolidBlock.typeId.includes('log')) return false;
    }
    //NOT FINISHED with the logic to make it solid.  parm should be dimension,location to check, not player FIXME:
    // so I can call it to check the 3x3 space around the player recursively if space does not have something in it.
    //FIXME:  should check a 3x3 area, in case outside, but under something
    if (dimension.id === 'overworld') return false;


    return true;
}
//========================================================================
// End of File
//========================================================================