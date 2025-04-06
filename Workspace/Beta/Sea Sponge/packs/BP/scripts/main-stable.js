//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
import { world } from '@minecraft/server';
import { dev, pack, alertLog } from './settings.js';
import { block_registerCustomComponents } from './events/blockComponentRegistry.js';
import { block_breakBeforeHandler } from './events/blockBreakBeforeHandler.js';
//==============================================================================
export function main_stable () {

    if (pack.hasChatCmd == -1) { // no beta
        pack.hasChatCmd = 0;
        alertLog.success(`§aInstalling Add-on ${pack.packName} - §bStable ${dev.debugPackLoad ? '§c(Debug Mode)' : ''}`, dev.debugPackLoad || pack.isLoadAlertsOn);
    }

    world.beforeEvents.worldInitialize.subscribe((event) => {
        block_registerCustomComponents(event);
    });

    world.beforeEvents.playerBreakBlock.subscribe((event) => {
        block_breakBeforeHandler(event);
    });

    //before events is beta
    //does not have old permutation - cannot use
    /*
    world.afterEvents.playerPlaceBlock.subscribe(event => {
        
    })
    */
}
//==============================================================================
