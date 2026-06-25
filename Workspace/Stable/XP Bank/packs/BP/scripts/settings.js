// settings.js  XP Bank
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
import { ConsoleAlert, ChatMsg } from "./common-stable/tools/index";
//==============================================================================
/**
 *  Owner is to edit this file as needed - Note: debug vars in fn-debug
 */
//==============================================================================
export const pack = {
    packName: 'XP Bank',
    debugOn: false, //Do Not change by code... the MASTER SWITCH to start world with/without debugging enabled

    about: 'Save / Auto-Save / Restore your XP Levels',
    devUrl: 'https://github.com/DrinkWater623',
    reportBugs: 'pinkSalt623@gmail.com',

    isBeta: false,
    worldLoaded: false, //updated automatically
    cmdNameSpace: "xp_bank",
    isLoadAlertsOn: true,
    

    //later make this dynamic for world, owner can change in settings menu
    xpInterest: {
        on: true,
        xpInterestMinRate: 0.05,
        xpInterestMaxRate: 0.20

        //note: increment - spawn or x minutes or minecraft day, etc. - later add to settings menu
    },
    
    dvNames: {
        initialized: 'initialized',
        isAuto: 'isAutoSaver',
        autoSaveOver: 'autoSaveOver',
        autoSaveInc: 'autoSaveMinuteIncrement',
        xpBalance: 'xpBalance'
    }
};
//==============================================================================
export const packDisplayName = `§a${pack.packName}§r`;
export const alertLog = new ConsoleAlert(packDisplayName);
export const chatLog = new ChatMsg(packDisplayName);
//==============================================================================
export const watchFor = {
};
//==============================================================================
// End of File
//==============================================================================
