//@ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: MIT
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20250109 - ReDone
========================================================================
*/
import { TicksPerSecond } from "@minecraft/server";
import { ConsoleAlert, ChatMsg } from "./common-stable/consoleClass";
//==============================================================================
/**
 *  World Owner is to edit this file as needed
 */
//==============================================================================
export const pack = {
    packName: 'Actionbar Compass',
    isBeta: false,
    isLoadAlertsOn: true,
    gameRuleShowCoordinates: false, //turn to true to override
    hasChatCmd: -1,
    cmdNameSpace: "abc",
    alert: "https://github.com/DrinkWater623",
    worldLoaded: 0,
    loadDelay: TicksPerSecond * 5,
    tickDelay: 15,
    dynamicProperty: 'isInstalled',
    tags: {
        compassTag: "abc:compassTag",
        xyzTag: "abc:xyzTag",
        velocityTag: "abc:velTag"
    },
    colors: {
        compass: '§6',
        velocity: '§e',
        x: '§g',
        y: '§d',
        z: '§b'
    },
    newPlayer_Settings: {
        auto_on: {
            compass: true,
            xyz: true,
            velocity: false
        }
    }
};
//==============================================================================
export const alertLog = new ConsoleAlert(`§d${pack.packName}§r`);
export const chatLog = new ChatMsg(`§b${pack.packName}§r`);
//=============================================================================
// End of File
//=============================================================================
