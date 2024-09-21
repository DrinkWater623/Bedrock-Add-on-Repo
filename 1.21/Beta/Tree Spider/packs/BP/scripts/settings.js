//@ts-check
import { world } from "@minecraft/server";
import { ConsoleAlert ,ChatMsg} from "./commonLib/consoleClass";
//==============================================================================
/**
 *  Owner is to edit this file as needed
 */
//==============================================================================
export const pack = {
    packName: 'Tree Spider',
    isLoadAlertsOn: false,    
    hasChatCmd: -1 ,
    commandPrefix: "ts:",
    //-- Dynamic Properties --
    lastActiveTick:'lastActiveTick',
    lastWebActivityTick:'lastWebActivityTick',
    websCreated:'websCreated'
};
//==============================================================================
//Change this to change the entity
export const dev = {
    debugChatCmds: false,
    debugGamePlay: true,
    debugEntityActivity: false,
    debugEntityAlert: true,
    debugBabyActivity: false,
    debugBabyAlert: true,
    //--
    debugPackLoad: false,
    debugSubscriptions: false,
    debugLoadAndSpawn: false,
    //---
    debugScoreboardName: 'tree_spider_debug', 
    debugScoreboardDisplayName: '§aTree Spider §6Debug',    
    debugScoreboard: world.scoreboard.getObjective(`tree_spider_debug`),
    //---
    debugBabyScoreboardName: 'baby_tree_spider_debug', 
    debugBabyScoreboardDisplayName: '§bBaby §aTree Spider §6Debug',    
    debugBabyScoreboard: world.scoreboard.getObjective(`baby_tree_spider_debug`),
    //---
    debugTimeCountersOn: false,
    debugTimers: 'smh',
    debugTimeCountersRunId:0
};
//==============================================================================
//for this pack, this is works when debugEntityAlert or debugGamePlay are true
// export const gamePlay = {    
//     commandPrefix: "ts:"
// };
//==============================================================================
//Change this to change the entity
export const watchFor = {
    typeId: "dw623:tree_spider",
    family: "tree_spider",
    display: "Tree Spider",
    egg_typeId: "dw623:tree_spider_egg_sac",
    despawnEventName:'despawn_me',
    replaceEventName:'replace_me',
    stalledCheckInterval : 5,
    stalledCheckStartDelay : 10,
    explosiveProjectiles: [  ],
    validated: false,  //TODO: - validate exists when pack loaded
    scoreboardName: 'tree_spider_monitor', 
    scoreboardDisplayName: '§aTree Spider §bMonitor',    
    scoreboard: world.scoreboard.getObjective(`tree_spider_monitor`)

};
//==============================================================================
export const alertLog = new ConsoleAlert(`§d${pack.packName}§r`)
export const chatLog = new ChatMsg(`§b${pack.packName}§r`)