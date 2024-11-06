//@ts-check
import { world } from "@minecraft/server";
import { ConsoleAlert, ChatMsg } from "./commonLib/consoleClass";
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
    deathDimension: 'deathDimension',
    deathMsgWaiting: 'deathMsgWaiting',
    deathCoordinates: 'deathCoordinates'
};
//==============================================================================
//Change this to change the entity
export const dev = {
    debugChatCmds: false,
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