// settings.js After-Life
// @ts-check
/* =====================================================================
Copyright (C) 2026 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T.
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
import { ConsoleAlert, ChatMsg } from "./common-stable/tools/index.js";
//==============================================================================
/**
 *  Owner is to edit this file as needed
 */
//==============================================================================
export const pack = {
    packName: 'After-Life',
    about: 'Testing for Subscription Events and Custom Components',
    devUrl: 'https://github.com/DrinkWater623',
    reportBugs: 'pinkSalt623@gmail.com',

    isBeta: false,
    worldLoaded: false,
    namespace: "dw623",
    cmdNameSpace: "al",
    isLoadAlertsOn: true,

    debugOn: true //important - do not release Add-ons with this true, except for F3, as it was meant for debugging only
};
//==============================================================================
export const packDisplayName = `§b${pack.packName}§r`;
//Non Dev version
export const alertLog = new ConsoleAlert(packDisplayName);
export const chatLog = new ChatMsg(packDisplayName);
//==============================================================================
export const dynamicVars = {
    //-- Dynamic Properties --
    aliveTicks: 'aliveTicks',
    firstTick: 'firstTick',
    deathCoordinates: 'deathCoordinates',
    deathCounter: 'deathCounter',
    deathDimension: 'deathDimension',
    deathMsgWaiting: 'deathMsgWaiting',
    //deathTick: 'deathTick',
    lastDeathTick:'lastDeathTick',
    longestTicksAlive:'longestTicksAlive'    
};
//==============================================================================
//TODO: have this pack be the death counter for players
export const watchFor = {
    typeId: "minecraft:player",
    family: "player",
    display: "After Life",    
    //scoreboardName: 'after_life_monitor',
    //scoreboardDisplayName: '§aAfter Life §bMonitor',
    //scoreboard: world.scoreboard.getObjective(`after_life_monitor`) ,
    death_bot:`${pack.namespace}:death_bot`
};
//==============================================================================
