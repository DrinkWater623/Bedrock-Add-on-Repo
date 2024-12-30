//@ts-check
import { alertLog, pack, dev } from './settings.js';
import { main_stable } from './main-stable.js';
import * as subsBeta from './subscribes-beta.js';
//==============================================================================
function main_beta () {
    subsBeta.afterEvents_scriptEventReceive();

    if (dev.debug)
        subsBeta.chatSend();

    subsBeta.afterEvents_entitySpawn();
    
    // 4 Block Volume
    alertLog.success(`§aInstalling Add-on ${pack.packName} - §6Beta ${dev.debug ? '§c(Debug Mode)' : ''}`, pack.isLoadAlertsOn || dev.debugPackLoad);
}
//==============================================================================
pack.beta = true;
dev.anyOn();
//==============================================================================
alertLog.log(`§bCalling main_stable()  §c(Debug Mode)`, dev.debugPackLoad);
main_stable();
alertLog.log(`§6Calling main_beta()  §c(Debug Mode)`, dev.debugPackLoad);
main_beta();
//==============================================================================
