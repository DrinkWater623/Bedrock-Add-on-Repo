// main.js More Lights Minecraft Bedrock Add-on
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
const msg = `Add-on - §bStable ${dev.debugOn ? '§4(debug mode)' : ''}`;
dev._controlLog(`§6Installing ${msg}`, pack.debugOn);
subscriptionsStable();
alertLog.success(`Installed ${msg}`, pack.isLoadAlertsOn);
//==============================================================================
// End of File
//==============================================================================
