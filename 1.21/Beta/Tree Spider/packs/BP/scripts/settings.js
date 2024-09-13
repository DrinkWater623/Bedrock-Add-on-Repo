//@ts-check
import { Scoreboard, world } from "@minecraft/server";
import { ConsoleAlert ,ChatMsg} from "./commonLib/consoleClass";
//==============================================================================
/**
 *  Owner is to edit this file as needed
 */
//==============================================================================
export const pack = {
    packName: 'Tree Spider',
    isLoadAlertsOn: false,    
    hasChatCmd: -1 
};
//==============================================================================
//Change this to change the entity
export const dev = {
    debugAll: false,
    debugCallBackEvents: false,
    debugChatCmds: true,
    debugEntityAlert: true,
    debugGamePlay: true,
    debugPackLoad: false,
    debugSubscriptions: false,
    debugScoreboardName: `Debug_${pack.packName.replaceAll(' ', '_').toLowerCase()}`,
    debugScoreboardDisplayName: `§cDebug_${pack.packName.replaceAll(' ', '_').replace('_', '§r §b').replace('_', '§r §a')}`,
    debugScoreboard: world.scoreboard.getObjective(`Debug_${pack.packName.replaceAll(' ', '_').toLowerCase()}`)
};
//==============================================================================
//for this pack, this is works when debugEntityAlert or debugGamePlay are true
export const gamePlay = {    
    commandPrefix: "ts:"
};
//==============================================================================
//Change this to change the entity
export const watchFor = {
    typeId: "dw623:tree_spider",
    family: "tree_spider",
    display: "Tree Spider",
    explosiveProjectiles: [  ],
    validated: false,  //TODO: - validate exists when pack loaded
    intervalTimer: 400, 
    intervalMin: 100,
    intervalMax: (24000 / 4)
};
//==============================================================================
export const alertLog = new ConsoleAlert(`§d${pack.packName}§r`)
export const chatLog = new ChatMsg(`§b${pack.packName}§r`)