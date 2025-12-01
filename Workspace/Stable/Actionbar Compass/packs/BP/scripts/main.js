// main.js
// @ts-check
/**
 * This is called only if beta is not used, 
 */
//==============================================================================
// Local
import { alertLog, pack } from './settings.js';
import { subscriptionsStable } from './subscribes.js';
import { devDebug } from "./helpers/fn-debug.js";
//==============================================================================
devDebug.anyOn();
const msg = `§aInstalling Add-on ${pack.packName} - §bStable ${devDebug.debugOn ? '§4(debug mode)' : ''}`;
alertLog.success(msg, devDebug.debugOn || pack.isLoadAlertsOn);
subscriptionsStable();
//==============================================================================
// End of File
//==============================================================================
