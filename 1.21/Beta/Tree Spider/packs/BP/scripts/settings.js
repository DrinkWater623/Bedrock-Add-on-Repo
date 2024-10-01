//@ts-check
import { world } from "@minecraft/server";
import { ConsoleAlert, ChatMsg } from "./commonLib/consoleClass";
//==============================================================================
/**
 *  Owner is to edit this file as needed
 */
//==============================================================================
export const pack = {
    packName: 'Tree Spider',
    isLoadAlertsOn: false,
    hasChatCmd: -1,
    commandPrefix: "ts:",   
};
export const dynamicVars = {
       //-- Dynamic Properties --
    aliveTicks: 'aliveTicks',
    lastActiveTick: 'lastActiveTick',
    lastWebActivityTick: 'lastWebActivityTick',
    lastLocation: 'lastLocation',
    websCreated: 'websCreated'
};
//==============================================================================
//Change this to change the entity
export const dev = {
    debugChatCmds: false,
    debugGamePlay: true,
    debugEntityActivity: false,
    debugEntityAlert: false,
    //--
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
export const entityEvents = {
    despawnEventName: 'despawn_me',
    replaceEventName: 'replace_me',
    stayInWebEventName: 'stay_in_web_start',
    wanderEventName: 'wander_around_start'    
};
//==============================================================================
//Change this to change the entity
export const watchFor = {
    typeId: "dw623:tree_spider",
    family: "tree_spider",
    display: "Tree Spider",
    egg_typeId: "dw623:tree_spider_egg_sac",
    home_typeId:'minecraft:web',
    despawnEventName: 'despawn_me',
    replaceEventName: 'replace_me',
    stayInWebEventName: 'stay_in_web_start',
    wanderEventName: 'wander_around_start',
    stalledCheckRunInterval: 4,
    assumedStalledIfOver: 5,
    assumeNoWebsPossibleIfOver: 23,
    explosiveProjectiles: [],
    validated: false,  //TODO: - validate exists when pack loaded, if not, turn everything OFF
    scoreboardName: 'tree_spider_monitor',
    scoreboardDisplayName: '§aTree Spider §bMonitor',
    scoreboard: world.scoreboard.getObjective(`tree_spider_monitor`),
    target_logs: [
        "minecraft:mangrove_roots", "minecraft:acacia_log", "minecraft:birch_log",
        "minecraft:cherry_log", "minecraft:dark_oak_log", "minecraft:jungle_log",
        "minecraft:mangrove_log", "minecraft:oak_log", "minecraft:spruce_log",
        "minecraft:warped_stem", "minecraft:crimson_stem", "minecraft:mushroom_stem"
    ],
    target_leaves: [
        "minecraft:warped_wart_block", "minecraft:shroomlight", "minecraft:nether_wart_block",
        "minecraft:acacia_leaves", "minecraft:birch_leaves", "minecraft:cherry_leaves", "minecraft:jungle_leaves",
        "minecraft:dark_oak_leaves", "minecraft:mangrove_leaves", "minecraft:oak_leaves", "minecraft:spruce_leaves",
        "minecraft:azalea", "minecraft:azalea_leaves", "minecraft:azalea_leaves_flowered"
    ],
    target_nature: [
        "minecraft:sunflower", "minecraft:lilac", "minecraft:rose_bush", "minecraft:peony",
        "minecraft:large_fern", "minecraft:tall_grass", "minecraft:sweet_berry_bush",
        "minecraft:pointed_dripstone",
        "minecraft:brown_mushroom_block", "minecraft:red_mushroom_block",
        "minecraft:big_drip_leaf"
    ]
};
//==============================================================================
export const alertLog = new ConsoleAlert(`§d${pack.packName}§r`);
export const chatLog = new ChatMsg(`§b${pack.packName}§r`);