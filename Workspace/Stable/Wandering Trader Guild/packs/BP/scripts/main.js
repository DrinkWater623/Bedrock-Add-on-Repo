// main.js Wandering Trader Guild
// @ts-check
/**
 * Change Log:
 *  20251203 - Created
 *  20260804 - Update for 1.26.10
 * 
 */
//==============================================================================
// Local
import { dev } from "./debug.js";
import { alertLog, pack } from './settings.js';
import { subscriptionsStable } from './subscribes.js';
//==============================================================================
dev.anyOn();
const msg = `Add-on - §bStable ${dev.debugOn ? '§4(debug mode)' : ''}`;
dev._controlLog(`§6Installing ${msg}`, pack.debugOn);
subscriptionsStable();
alertLog.success(`Installed ${msg}`, pack.isLoadAlertsOn && !pack.debugOn);
//==============================================================================
// End of File
//==============================================================================
