//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
import { dev, pack, alertLog, watchFor } from './settings.js';
import { beforeEvents_worldInitialize } from './subscribes.js';
//==============================================================================
export function main_stable () {

    if (pack.isStable == 1) {
        dev.anyOn(); // no beta        
        alertLog.success(`§aInstalling Add-on ${pack.packName} - §bStable ${dev.debug ? '§c(Debug Mode)' : ''}`, dev.debugPackLoad || pack.isLoadAlertsOn);
    }  

    beforeEvents_worldInitialize()
    
    alertLog.success(`Slab Count: ${watchFor.vanillaSlabs.length}`, dev.debug)
}
//==============================================================================
