//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
import { dev, pack, alertLog } from './settings.js';
import * as subs from './subscribes.js';
//==============================================================================
export function main_stable () {

    if (pack.hasChatCmd == -1) { // no beta
        pack.hasChatCmd = 0;
        alertLog.success(`§aInstalling Add-on ${pack.packName} - §bStable ${dev.debugPackLoad ? '§c(Debug Mode)' : ''}`, dev.debugPackLoad || pack.isLoadAlertsOn);
    }
    subs.beforeEvents_worldInitialize_subscribe();
    subs.beforeEvents_playerInteractWithBlock_subscribe();
}
//==============================================================================
