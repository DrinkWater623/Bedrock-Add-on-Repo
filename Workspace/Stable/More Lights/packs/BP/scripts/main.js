// main.js More Lights Minecraft Bedrock Add-on
// @ts-check
/**
 * This is called only if beta is not used, 
 */
//==============================================================================
// Local
import { dev } from './debug.js';
import { pack } from './settings.js';
import { subscriptionsStable } from './subscribes.js';
//==============================================================================
const msg = `Add-on - §bStable ${dev.debugOn ? '§4(debug mode)' : ''}`;
dev.alertLog.log(`§6Installing ${msg}`, pack.debugOn);
subscriptionsStable();
dev.alertLog.success(`Installed ${msg}`, pack.isLoadAlertsOn);
//==============================================================================
// End of File
//==============================================================================
