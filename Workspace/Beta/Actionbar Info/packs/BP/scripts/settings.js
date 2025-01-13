//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20250109
========================================================================*/
import { TicksPerSecond, world } from "@minecraft/server";
import { ConsoleAlert, ChatMsg } from "./common-stable/consoleClass";
import { Debug } from "./common-stable/mcDebugClass";
//==============================================================================
/**
 *  Owner is to edit this file as needed
 */
//==============================================================================
export const pack = {
    packName: 'Actionbar Info',
    isLoadAlertsOn: true,
    isBeta: false,
    hasChatCmd: -1,
    commandPrefix: "ai:",
    alert: "https://github.com/DrinkWater623",
    loadDelay: TicksPerSecond * 6,
    tickDelay: 10,
    dynamicProperty: 'isInstalled',
    tags: {
        facingTag: "ai:facingTag",
        xyzTag: "ai:xyzTag",
        xyzTagExact: "ai:xyzTagExact",
        velocityTag: "ai:velocityTag",
        viewTag: "ai:viewTag"
    },
    gameRuleShowCoordinates: false
};
//==============================================================================
export const dev = {
    debug: true,
    debugChatCmds: false,
    debugPlayer: false,
    debugGamePlay: false,
    //--before turn off testing, get despawn position to see if distance is why
    debugPackLoad: false,
    debugSubscriptions: false,
    debugLoadAndSpawn: false,
    anyOn () {
        this.debug = false;
        for (const key in dev) {
            if (key.startsWith('debug') && typeof dev[ key ] == 'boolean')
                this.debug = this.debug || dev[ key ];
        }
    }
};
//==============================================================================
export const alertLog = new ConsoleAlert(`§d${pack.packName}§r`);
export const chatLog = new ChatMsg(`§b${pack.packName}§r`);
export const debug = new Debug(pack.packName,true,world)
//=============================================================================
// End of File
//=============================================================================
