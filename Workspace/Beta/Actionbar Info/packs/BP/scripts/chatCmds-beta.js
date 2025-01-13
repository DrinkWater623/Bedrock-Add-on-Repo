//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20250109
========================================================================*/
import { Player, world } from "@minecraft/server";
import { chatLog, pack } from "./settings";
import { showAngleInfo, showCoordsToggle, tagHelp, tagToggle } from "./functions";
//=============================================================================
/**
 * 
 * @param {Player} player 
 * @param {string} message 
 */
export function chatCmdProcess (player, message) {

    if (message == '?') {
        tagHelp(player);
        return;
    }
    else if(message=='ulcc' && player.isOp()) {
        showCoordsToggle();
        return
    }
    else if(message=='f3') {
        showAngleInfo(player);
        return
    }
    else if (message == 'face' || message == 'compass') {
        tagToggle(player, pack.tags.facingTag, "Facing-Direction");
        return;
    }
    else if (message == 'xyz') {
        tagToggle(player, pack.tags.xyzTag, "XYZ-Geo");
        return;
    }
    else if (message == 'vel') {
        tagToggle(player, pack.tags.velocityTag, "Velocity");
        return;
    }
    else if (message == 'view') {
        tagToggle(player, pack.tags.viewTag, "View-Direction");
        return;
    }

    chatLog.error("Invalid Chat Command", true, player);
}
//=============================================================================
// End of File
//=============================================================================
