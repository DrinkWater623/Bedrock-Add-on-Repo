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
const msg = `Add-on - §bStable ${devDebug.debugOn ? '§4(debug mode)' : ''}`;
alertLog.log(`§6Installing ${msg}`, devDebug.debugOn);
subscriptionsStable();
alertLog.success(`Installed ${msg}`, pack.isLoadAlertsOn);
//==============================================================================
// End of File
//==============================================================================
