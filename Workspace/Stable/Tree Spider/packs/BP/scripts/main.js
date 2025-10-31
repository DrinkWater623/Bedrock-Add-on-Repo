//@ts-check
/**
 * This is called only if beta is not used, 
 */
import { alertLog,  pack  } from './settings.js';
import * as debug from "./fn-debug.js";
import { subscriptionsStable } from './subscribes.js';
//==============================================================================
debug.dev.anyOn();
alertLog.success(`§aInstalling Add-on ${pack.packName} - ${pack.beta ? '§6Beta' : '§bStable'}  ${debug.dev.debug ? '§4(debug mode)' : ''}`, debug.dev.debugPackLoad || pack.isLoadAlertsOn);
subscriptionsStable();
//==============================================================================
// End of File