// settings.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: MIT
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20250109 - ReDone
========================================================================
*/
import { TicksPerSecond } from "@minecraft/server";
import { ConsoleAlert, ChatMsg } from "./common-stable/tools/messageLib";
//==============================================================================
/**
 *  World Owner is to edit this file as needed
 */
//==============================================================================
export const pack = {
    packName: 'Actionbar Compass',

    about: 'Directional compass shown in the action bar above health/hunger bars.  \nYou can toggle it on and off and add xyz coordinates and/or velocity.\nTo see all of the commands start typing abc:',
    devUrl: 'https://github.com/DrinkWater623',
    reportBugs: 'pinkSalt623@gmail.com',

    isBeta: false,
    isLoadAlertsOn: true,
    gameRuleShowCoordinates: false, //turn to true to override    
    cmdNameSpace: "abc",
    worldLoaded: 0,
    loadDelay: TicksPerSecond * 5,
    tickDelay: 16,
    dynamicProperty: 'isInstalled',
    tags: {
        initializedTag: "abc:initializedTag",
        compassTag: "abc:compassTag",
        xyzTag: "abc:xyzTag",
        velocityTag: "abc:velTag"
    },
    colors: {
        compass: '§6',
        velocity: '§e',
        x: '§a',
        y: '§c',
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
export const packDisplayName = `§d${pack.packName}§r`;
export const alertLog = new ConsoleAlert(packDisplayName);
export const chatLog = new ChatMsg(packDisplayName);
//=============================================================================
// End of File
//=============================================================================
