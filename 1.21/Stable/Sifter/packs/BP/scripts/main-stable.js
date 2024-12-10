//@ts-check
import { dev, pack, alertLog } from './settings.js';
import * as subs from './subscribes.js';
//==============================================================================
export function main_stable () {

    if (pack.hasChatCmd == -1) { // no beta
        pack.hasChatCmd = 0;
        alertLog.success(`§aInstalling Add-on ${pack.packName} - §bStable ${pack.isLoadAlertsOn ? '§c(Debug Mode)' : ''}`, dev.debugPackLoad || pack.isLoadAlertsOn);
    }

    subs.beforeEvents_worldInitialize();
}
//==============================================================================
