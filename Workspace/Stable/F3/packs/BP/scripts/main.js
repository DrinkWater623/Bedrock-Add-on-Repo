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
//==============================================================================
const msg = `Add-on - §aStable ${dev.debugOn ? '§4(debug mode)' : ''}`;
dev.alertLog(`§6Installing ${msg}`, dev.debugOn);
subscriptionsStable();
alertLog.success(`Installed ${msg}`, pack.isLoadAlertsOn);
//==============================================================================
// End of File
//==============================================================================
