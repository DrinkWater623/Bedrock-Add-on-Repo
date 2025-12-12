// main.js Tree Spider
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
pack.isBeta=true
const msg = `Add-on - §6Beta ${devDebug.debugOn ? '§4(debug mode)' : ''}`;
alertLog.log(`§6Installing ${msg}`, devDebug.debugOn);
subscriptionsStable();
subscriptionsBeta();
alertLog.success(`Installed ${msg}`, pack.isLoadAlertsOn);
//==============================================================================
// End of File
//==============================================================================
