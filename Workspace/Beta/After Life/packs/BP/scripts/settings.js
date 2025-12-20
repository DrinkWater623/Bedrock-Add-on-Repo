//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
import { world } from "@minecraft/server";
import { ConsoleAlert, ChatMsg } from "./common-stable/tools/consoleClass";
//==============================================================================
/**
 *  Owner is to edit this file as needed
 */
//==============================================================================
export const pack = {
    packName: 'After Life',
    isLoadAlertsOn: true,
    hasChatCmd: -1,
    commandPrefix: "al:",
    alert: "https://github.com/DrinkWater623"
};
export const dynamicVars = {
    //-- Dynamic Properties --
    aliveTicks: 'aliveTicks',
    firstTick: 'deathCoordinates',
    deathCoordinates: 'deathCoordinates',
    deathCounter: 'deathCounter',
    deathDimension: 'deathDimension',
    deathMsgWaiting: 'deathMsgWaiting',
    //deathTick: 'deathTick',
    lastDeathTick:'lastDeathTick',
    longestTicksAlive:'longestTicksAlive'    
};
//==============================================================================
export const dev = {
    debug: true,
    debugChatCmds: false,
    debugBot: true,
    debugPlayer: true,
    debugGamePlay: false,
    debugEntityEvent: false,
    //--before turn off testing, get despawn position to see if distance is why
    debugPackLoad: false,
    debugSubscriptions: false,
    debugLoadAndSpawn: false
};
//==============================================================================
export const entityEvents = {
    despawnEventName: 'despawn_me',
    replaceEventName: 'replace_me',
    stayInWebEventName: 'stay_in_web_start',
    wanderEventName: 'wander_around_start'
};
//==============================================================================
//TODO: have this pack be the death counter for players
export const watchFor = {
    typeId: "minecraft:player",
    family: "player",
    display: "After Life",    
    scoreboardName: 'after_life_monitor',
    scoreboardDisplayName: '§aAfter Life §bMonitor',
    scoreboard: world.scoreboard.getObjective(`after_life_monitor`) 
};
//==============================================================================
export const alertLog = new ConsoleAlert(`§d${pack.packName}§r`);
export const chatLog = new ChatMsg(`§b${pack.packName}§r`);