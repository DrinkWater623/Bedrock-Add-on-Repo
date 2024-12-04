//@ts-check
/**
 * Notes:  This is only called via manifest when Stable Config is used
 */
//==============================================================================
import { main_stable } from './main-stable.js';
import { alertLog, dev, pack } from './settings.js';
//==============================================================================
if (pack.isBeta == -1) pack.isBeta = 0;
if (pack.hasChatCmd == -1) pack.hasChatCmd = 0;
//==============================================================================
alertLog.log(`§aInstalling Add-on ${pack.packName} - §aStable §c(Debug Mode)`, dev.debugPackLoad);
//==============================================================================
main_stable();
//==============================================================================
alertLog.success(`§aInstalled Add-on ${pack.packName} - §aStable ${dev.debugPackLoad ? '§c(Debug Mode)' : ''}`, pack.isLoadAlertsOn);
