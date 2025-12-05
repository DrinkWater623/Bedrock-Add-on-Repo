// settings.js  Wandering Trader Guild
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
import { ConsoleAlert,ChatMsg } from "./common-stable/tools/messageLib";
//==============================================================================
/**
 *  Owner is to edit this file as needed - Note: debug vars in fn-debug
 */
//==============================================================================
export const pack = {
    packName: 'Wandering Trader Guild',
    about:'Just some guys tryna make a few bucks with some great deals.  §l§aHave some money ready!',
    devUrl:'https://github.com/DrinkWater623',
    reportBugs:'pinkSalt623@gmail.com',
    beta: false,
    worldLoaded: false,
    cmdNameSpace: "wtg:", 
    isLoadAlertsOn: true
};
//==============================================================================
export const packDisplayName = `§a${pack.packName}§r`
export const alertLog = new ConsoleAlert(packDisplayName);
export const chatLog = new ChatMsg(packDisplayName);
//==============================================================================
export const watchFor = {    
};
//==============================================================================
// End of File
//==============================================================================
