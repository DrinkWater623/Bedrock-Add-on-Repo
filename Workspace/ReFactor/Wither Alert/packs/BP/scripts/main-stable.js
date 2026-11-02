//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
import {  EntityTypes } from "@minecraft/server";
import { watchFor, dev, pack, alertLog, chatLog, gamePlay } from './settings.js';
import * as subs from './subscribes.js';
//==============================================================================
/**
 * List of properties
 * 
 * isInitialized
 * watchForEntity
 * isWatching         system can be turned off - default true
 * debugOn            world messages for testing ? maybe should always be false and need to be turned on by op
 * alertsOn           other messages for initialization - default true
 */
//==============================================================================
export function main_stable () {
    const debugMsg = pack.isLoadAlertsOn || dev.debugPackLoad || dev.debugAll;
    alertLog.success(`main_stable (): WatchFor=(${watchFor.typeId}), pack.isAlertSystemOn=${pack.isWitherAlertSystemOn}`, dev.debugPackLoad || dev.debugAll);

    watchFor.validated = EntityTypes.getAll().map(eObj => eObj.id).includes(watchFor.typeId);
    pack.isEntityAlertSystemOn = watchFor.validated;

    if (watchFor.validated) {
        subs.worldInitialize_before();

        if (pack.isWitherAlertSystemOn) {
            alertLog.success(`§aInstalling §bStable§r §aAdd-on`, debugMsg);            
            subs.worldInitialize_after();
            subs.explosion_after_sub();
        }
        else {
            if (pack.hasChatCmd === -1) pack.hasChatCmd = 0;

            let msg = `§6Alert system is §cOFF!§r`;
            if (pack.hasChatCmd)
                msg += `  §bOP, use command §a${gamePlay.commandPrefix}on§b turn turn back §aON§r`;
            else
                msg += ` This is the stable version and it should not be off.  Get the beta version to fix.`;

            alertLog.warn(msg, true);
        }
    }
    else {
        alertLog.error(`§6Pack will not load because the defined entity is invalid: §c${watchFor.typeId}.  Update scripts/settings.js with a valid entity.`, true);
    }

}
//==============================================================================
//Note: any non-obj code (loose) run where this is imported... be mindful
//console.error('§cI should never see this message in main-stable.js')