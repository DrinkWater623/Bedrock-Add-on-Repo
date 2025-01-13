//@ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: MIT
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20250109 - ReDone
========================================================================
*/
import { Player } from "@minecraft/server";
import { chatLog, pack } from "./settings";
import { showCoordsToggle, tagHelp, tagToggle } from "./functions";
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
    else if (message == 'compass') {
        tagToggle(player, pack.tags.compassTag, "Compass");
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

    chatLog.error("Invalid Chat Command", true, player);
}
//=============================================================================
// End of File
//=============================================================================
