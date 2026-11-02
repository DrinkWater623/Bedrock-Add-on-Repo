//@ts-check
import { world } from "@minecraft/server";
import { ConsoleAlert, ChatMsg } from "./commonLib/consoleClass";
import { ScoreboardLib } from "./commonLib/scoreboardClass";
//==============================================================================
/**
 *  Owner is to edit this file as needed
 */
//==============================================================================
export const pack = {
    packName: 'Player Stats',
    isLoadAlertsOn: false,
    hasChatCmd: -1,
    commandPrefix: "ps:",
    statUpdateIntervalTicks: 20,
    AfkMinutesAllowed: 120
};
//-- Dynamic Properties --
export const dynamicVars = {
    //Ticks
    aliveTicks: 'aliveTicks',
    lastDimension: 'lastDimension',
    lastLocation: 'lastLocation',
    lastActiveTick: 'lastActiveTick',
    AFKTicks: 'AFKTicks',    
    //Player
    player_id:'player_id',
    isWorldOwner: 'isWorldOwner',
    isWorldOP: 'isWorldOP',
    isAFK: 'isAFK',
    loginCount:'loginCount'
};

//==============================================================================
//TODO: test, will this work to create them upon first initialize and get IDs when world initializes
export const scoreboards = {
    playerIDs: {
        ptr: ScoreboardLib.create('ps_player_id',"Player IDs"),
        name: 'ps_player_id',
    },
    loginCount: {
        ptr: ScoreboardLib.create('ps_player_login_count',"Player Logins"),
        name: 'ps_player_login_count',
    },
    playerDeaths: {
        ptr: ScoreboardLib.create('ps_player_death_count',"Player Deaths"),
        name: 'ps_player_death_count'
    },
    pvpDeathCount: {
        ptr: ScoreboardLib.create('ps_pvp_death_count',"PVP Death Count"),
        name: 'ps_pvp_death_count'
    },
    pvpKillCount: {
        ptr: ScoreboardLib.create('ps_pvp_kill_count',"PVP Kill Count"),
        name: 'ps_pvp_kill_count'
    },    
    pvmPlayerDeathCount:{
        ptr: ScoreboardLib.create('ps_pvm_player_death_count',"PVM Player Deaths"),
        name: 'ps_pvm_player_death_count'
    },
    pvmPlayerKillCount: {
        ptr: ScoreboardLib.create('ps_pvm_player_kill_count',"PVM Player Kills"),
        name: 'ps_pvm_player_kill_count'
    },
    //by family, not id
    pvmMonsterDeathCount: {
        ptr: ScoreboardLib.create('ps_pvm_monster_death_count',"PVM Monster Deaths"),
        name: 'ps_pvm_monster_death_count'
    },
    pvmMonsterKillCount: {
        ptr: ScoreboardLib.create('ps_pvm_monster_kill_count',"PVM Monster Kills"),
        name: 'ps_pvm_monster_kill_count'
    }
};
//==============================================================================
//Change this to change the entity
export const dev = {
    debugChatCmds: false,
    debugGamePlay: true,
    debugEntityActivity: false,
    debugEntityAlert: false,
    //--before turn off testing, get despawn position to see if distance is why
    debugPackLoad: false,
    debugSubscriptions: false,
    debugLoadAndSpawn: false,
    //---
    debugScoreboardName: 'tree_spider_debug',
    debugScoreboardDisplayName: '§aTree Spider §6Debug',
    debugScoreboard: world.scoreboard.getObjective(`tree_spider_debug`),
    //---
    debugTimeCountersOn: false,
    debugTimers: 'mh', //was smh, but don't need seconds
    debugTimeCountersRunId: 0
};


//==============================================================================
export const alertLog = new ConsoleAlert(`§d${pack.packName}§r`);
export const chatLog = new ChatMsg(`§b${pack.packName}§r`);