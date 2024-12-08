//@ts-check
import { alertLog, pack, dev } from './settings.js';
import { main_stable } from './main-stable.js';
//TODO: delete after never needing to be beta
//==============================================================================
function main_beta () {    

}
//==============================================================================
alertLog.success(`§aInstalling Add-on ${pack.packName} - §6Beta Chat Commands and Block Volume ${pack.isLoadAlertsOn ? '§c(Debug Mode)' : ''}`, pack.isLoadAlertsOn || dev.debugPackLoad);
pack.hasChatCmd = 1;
//==============================================================================
alertLog.log(`§bCalling main_stable()  §c(Debug Mode)`, dev.debugPackLoad);
main_stable();
alertLog.log(`§6Calling main_beta()  §c(Debug Mode)`, dev.debugPackLoad);
main_beta();
//==============================================================================
