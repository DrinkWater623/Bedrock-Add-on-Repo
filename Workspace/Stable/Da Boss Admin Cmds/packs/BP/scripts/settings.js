// settings.js  Da Boss Admin Cmds
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T.
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20251203 - Created
========================================================================*/
// Shared
import { ConsoleAlert,ChatMsg } from "./common-stable/tools/index";
//==============================================================================
/**
 *  Owner is to edit this file as needed - Note: debug vars in fn-debug
 */
//==============================================================================
export const pack = {
    packName: 'Da Boss - Admin Cmds',

    about:'Some cmds for convenience',
    devUrl:'https://github.com/DrinkWater623',
    reportBugs:'pinkSalt623@gmail.com',

    isBeta: false,
    worldLoaded: false,
    cmdNameSpace: "da_boss", 
    isLoadAlertsOn: true,

    debugOn: false //Do Not change by code... the MASTER SWITCH to start world with/without debugging enabled
};
//==============================================================================
export const packDisplayName = `§6${pack.packName}§r`
export const alertLog = new ConsoleAlert(packDisplayName);
export const chatLog = new ChatMsg(packDisplayName);
//==============================================================================
export const watchFor = {    
};
//==============================================================================
// End of File
//==============================================================================
