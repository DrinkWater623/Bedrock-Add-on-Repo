// main.js Tree Spider
// @ts-check
/**
 * This is called via the manifest only if beta profile is not used
 */
//==============================================================================
// Local
import { alertLog, pack } from './settings.js';
import { subscriptionsStable } from './subscribes.js';
//==============================================================================
const msg = `Add-on - §bStable ${pack.debugOn ? '§4(debug mode)' : ''}`;
alertLog.log(`§6Installing ${msg}`, pack.debugOn);
subscriptionsStable();
alertLog.success(`Installed ${msg}`, pack.isLoadAlertsOn);

//==============================================================================
// End of File
//==============================================================================
