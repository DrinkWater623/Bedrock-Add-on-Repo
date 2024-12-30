//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
import { main_stable } from './main-stable.js';
import { dev } from './settings.js';
//==============================================================================
if (dev.debug) dev.allDebug()
main_stable();