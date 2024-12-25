//@ts-check
import { dev, pack, alertLog, watchFor } from './settings.js';
//import * as subs from './subscribes.js';
//==============================================================================
export function main_stable () {

    if (pack.isStable == 1) {
        dev.anyOn(); // no beta        
        alertLog.success(`§aInstalling Add-on ${pack.packName} - §bStable ${dev.debug ? '§c(Debug Mode)' : ''}`, dev.debugPackLoad || pack.isLoadAlertsOn);
    }

    //subs.beforeEvents_playerInteractWithBlock_subscribe();

    alertLog.success(`Slab Count: ${watchFor.vanillaSlabs.length}`, dev.debug)
}
//==============================================================================
