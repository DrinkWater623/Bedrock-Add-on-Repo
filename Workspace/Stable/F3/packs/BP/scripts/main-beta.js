// main.js F3
// @ts-check
/**
 * This is called only if beta is not used, 
 */
//==============================================================================
// Local
import { dev } from './debug.js';
import { pack,alertLog } from './settings.js';
import { subscriptionsStable } from './subscribes.js';
import { subscriptionsBeta } from './subscribes-beta.js';
//==============================================================================
const msg = `Add-on - §bBeta ${dev.debugOn ? '§4(debug mode)' : ''}`;
dev._controlLog(`§6Installing ${msg}`, pack.debugOn);
subscriptionsStable();
subscriptionsBeta();
alertLog.success(`Installed ${msg}`, pack.isLoadAlertsOn && !pack.debugOn);
//==============================================================================
// End of File
//==============================================================================
