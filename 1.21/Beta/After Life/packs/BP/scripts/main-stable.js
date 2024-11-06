//@ts-check
import { dev, pack, alertLog } from './settings.js';
import * as subs from './subscribes.js';
//==============================================================================
export function main_stable () {

    if (pack.hasChatCmd === -1) // no beta
        alertLog.success(`§aInstalling Add-on ${pack.packName} - §bStable ${pack.isLoadAlertsOn ? '§c(Debug Mode)' : ''}`, dev.debugPackLoad || pack.isLoadAlertsOn);
    
    subs.afterEvents_playerSpawn();
    subs.afterEvents_entityDie();    
}
//==============================================================================
