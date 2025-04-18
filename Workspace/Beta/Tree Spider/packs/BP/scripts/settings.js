//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
import { world } from "@minecraft/server";
import { ConsoleAlert, ChatMsg } from "./common-stable/consoleClass";
//==============================================================================
/**
 *  Owner is to edit this file as needed
 */
//==============================================================================
export const pack = {
    packName: 'Tree Spider',
    beta: false,
    isLoadAlertsOn: true,
    hasChatCmd: -1,
    commandPrefix: "ts:"
};
//==============================================================================
export const alertLog = new ConsoleAlert(`§d${pack.packName}§r`);
export const chatLog = new ChatMsg(`§b${pack.packName}§r`);
//==============================================================================
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
    debug: false,
    debugChatCmds: false,
    debugGamePlay: false,
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
    debugTimeCountersRunId: 0,    
    anyOn () {
        this.debug = false;
        for (const key in dev) {
            if (key.startsWith('debug') && typeof dev[ key ] == 'boolean')
                this.debug = this.debug || dev[ key ];
        }
    }
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
    home_typeId: 'minecraft:web',
    stalledCheckRunInterval: 10,
    assumedStalledIfOver: 25,
    assumeNoWebsPossibleIfOver: 60,
    explosiveProjectiles: [],
    validated: false,  //TODO: - validate exists when pack loaded, if not, turn everything OFF
    scoreboardName: 'tree_spider_monitor',
    scoreboardDisplayName: '§aTree Spider §bMonitor',
    scoreboard: world.scoreboard.getObjective(`tree_spider_monitor`),
    //TODO: automate the log and leaves list with vanilla-data
    target_logs: [
        "minecraft:mangrove_roots", "minecraft:acacia_log", "minecraft:birch_log",
        "minecraft:cherry_log", "minecraft:dark_oak_log", "minecraft:jungle_log",
        "minecraft:mangrove_log", "minecraft:oak_log", "minecraft:pale_oak_log","minecraft:spruce_log",
        "minecraft:warped_stem", "minecraft:crimson_stem", "minecraft:mushroom_stem"
    ],
    target_leaves: [
        "minecraft:warped_wart_block", "minecraft:shroomlight", "minecraft:nether_wart_block",
        "minecraft:acacia_leaves", "minecraft:birch_leaves", "minecraft:cherry_leaves", "minecraft:jungle_leaves",
        "minecraft:dark_oak_leaves", "minecraft:mangrove_leaves", "minecraft:oak_leaves", "minecraft:pale_oak_leaves","minecraft:spruce_leaves",
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