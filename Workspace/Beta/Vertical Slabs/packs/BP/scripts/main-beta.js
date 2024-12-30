//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
import { alertLog, pack, dev } from './settings.js';
import { main_stable } from './main-stable.js';
import * as subs_beta from './subscribes-beta.js';
//==============================================================================
function main_beta () {    
    subs_beta.beforeEvents_playerPlaceBlock_subscribe();
    alertLog.success(`§aInstalling Add-on ${pack.packName} - §6Beta ${dev.debug ? '§c(Debug Mode)' : ''}`, pack.isLoadAlertsOn || dev.debugPackLoad);
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
