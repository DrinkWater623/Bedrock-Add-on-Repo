//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
import { world } from "@minecraft/server";
import { chatSend_before_fn, chatSend_after_fn } from './chatCmds-beta.js';
import { alertLog, pack, dev } from './settings.js';
import { main_stable } from './main-stable.js';
//==============================================================================
function main_beta () {
    const debugMsg = pack.isLoadAlertsOn || dev.debugPackLoad || dev.debugAll || dev.debugSubscriptions;

    alertLog.success(`§aActivating Chat Commands§r - §6Beta§r`, debugMsg);
    world.beforeEvents.chatSend.subscribe(
        (event) => { chatSend_before_fn(event); });

    world.afterEvents.chatSend.subscribe(
        (event) => { chatSend_after_fn(event); });
}
//==============================================================================
pack.hasChatCmd=1;
alertLog.warn(`§bCalling main_stable()`,dev.debugPackLoad);
main_stable();
alertLog.warn(`§bCalling main_beta()`,dev.debugPackLoad);
main_beta();
