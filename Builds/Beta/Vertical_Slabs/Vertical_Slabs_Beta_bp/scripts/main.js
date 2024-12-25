//@ts-check
/**
 * Notes:  This is beta until world.beforeEvents.chatSend is released to Stable
 * 
 * TODO: popup menu on command 
 */
//==============================================================================
import { main_stable } from './main-stable.js';
import { dev } from './settings.js';
//==============================================================================
if (dev.debug) dev.allDebug()
main_stable();