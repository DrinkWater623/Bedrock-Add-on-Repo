//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: MIT
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20250109
========================================================================*/
import { world,  Player } from "@minecraft/server";
import { main_stable } from './main-stable';
import { alertLog, dev, pack } from "./settings";
import { chatCmdProcess } from "./chatCmds-beta";
//=========================================================
function main_beta () {

    pack.isBeta = true;
    pack.hasChatCmd = 1;
    world.beforeEvents.chatSend.subscribe((event) => {
        if (event.sender instanceof Player)
            if (event.message.startsWith(pack.commandPrefix)) {
                const message = event.message.toLowerCase().replace(pack.commandPrefix, '');
                event.cancel=true;
                chatCmdProcess(event.sender, message);
            }
    });

    alertLog.success(`§aInstalled Add-on ${pack.packName} - §6Beta ${dev.debug ? '§c(Debug Mode)' : ''}`, dev.debugPackLoad || pack.isLoadAlertsOn);
}
//=========================================================
main_beta();
main_stable();
//=============================================================================
// End of File
//=============================================================================

