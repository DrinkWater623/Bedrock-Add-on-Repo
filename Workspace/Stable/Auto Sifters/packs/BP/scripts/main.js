//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: MIT
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
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