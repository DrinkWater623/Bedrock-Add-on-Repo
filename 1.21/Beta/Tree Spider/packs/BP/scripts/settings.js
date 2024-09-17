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
    commandPrefix: "ts:"
};
//==============================================================================
//Change this to change the entity
export const dev = {
    debugChatCmds: true,
    debugEntityActivity: false,
    debugEntityAlert: true,
    debugGamePlay: true,
    //--
    debugPackLoad: false,
    debugSubscriptions: false,
    debugLoadAndSpawn: true,
    //---
    debugScoreboardName: 'tree_spider_debug', //`Debug_${pack.packName.replaceAll(' ', '_').toLowerCase()}`,
    debugScoreboardDisplayName: '§aTree Spider §6Debug',    
    debugScoreboard: world.scoreboard.getObjective(`tree_spider_debug`),
    //---
    debugTimeCountersOn: false,
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