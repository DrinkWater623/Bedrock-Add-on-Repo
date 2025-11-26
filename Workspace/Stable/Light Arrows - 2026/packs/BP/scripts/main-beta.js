// main-beta.js
// @ts-check
//==============================================================================
// Local
import { devDebug } from './helpers/fn-debug.js';
import { alertLog, pack } from './settings.js';
//import { subscriptionsBeta } from './.subscribes-beta.js';
import { subscriptionsStable } from './subscribes.js';
//==============================================================================
pack.beta = true;
//==============================================================================
subscriptionsStable();
//subscriptionsBeta();
//==============================================================================
devDebug.anyOn();
const msg=`§aInstalling Add-on ${pack.packName} - §6Beta} ${devDebug.debugOn ? '§4(debug mode)' : ''}`
alertLog.success(msg, devDebug.debugOn || pack.isLoadAlertsOn);
subscriptionsStable();
//==============================================================================
// End of File