//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20250116 - reOrg
========================================================================*/
import { alertLog, pack, dev } from './settings.js';
import { main_stable } from './main-stable.js';
import { world } from '@minecraft/server';
import { beforeEvents_playerPlaceBlock } from './events-beta/playerPlaceBlock.js';
//==============================================================================
function main_beta () {    
    alertLog.success(`§aInstalling Add-on ${pack.packName} - §6Beta ${dev.debug ? '§c(Debug Mode)' : ''}`, pack.isLoadAlertsOn || dev.debugPackLoad);
    
    world.beforeEvents.playerPlaceBlock.subscribe((event) => {
        beforeEvents_playerPlaceBlock(event);
    });
    alertLog.success('Subscribed to§r world.beforeEvents.playerPlaceBlock - §6Beta', dev.debugSubscriptions);

}
//==============================================================================
dev.anyOn();
pack.hasChatCmd = 0;
pack.isStable = 0;
//==============================================================================
alertLog.log(`§bCalling main_stable()  §c(Debug Mode)`, dev.debugPackLoad);
main_stable();
alertLog.log(`§6Calling main_beta()  §c(Debug Mode)`, dev.debugPackLoad);
main_beta();
//==============================================================================
