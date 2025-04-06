//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20250116 - reOrg
========================================================================*/
import { world } from '@minecraft/server';
import { dev, pack, alertLog, watchFor } from './settings.js';
import { beforeEvents_worldInitialize } from './events/worldInitialize.js';
//==============================================================================
export function main_stable () {

    if (pack.isStable == 1) {
        dev.anyOn(); 
        alertLog.success(`§aInstalling Add-on ${pack.packName} - §bStable ${dev.debug ? '§c(Debug Mode)' : ''}`, dev.debugPackLoad || pack.isLoadAlertsOn);
    }

    alertLog.success('Subscribing to§r world.beforeEvents.worldInitialize - §bStable', dev.debugSubscriptions);
    world.beforeEvents.worldInitialize.subscribe((event) => {
        beforeEvents_worldInitialize(event)
    });

    alertLog.success(`Vanilla Slab Count: ${watchFor.vanillaSlabs.length}`, dev.debug);
}
//==============================================================================
