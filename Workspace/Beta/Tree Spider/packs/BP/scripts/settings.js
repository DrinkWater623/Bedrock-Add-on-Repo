// settings.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20251024 - move dev to debug and add world dynamic vars
========================================================================*/
import { ConsoleAlert, ChatMsg } from "./common-stable/consoleClass";
//==============================================================================
/**
 *  Owner is to edit this file as needed - Note: debug vars in fn-debug
 */
//==============================================================================
export const pack = {
    packName: 'Tree Spider',
    beta: false,
    worldLoaded:false,
    fullNameSpace: "dw623_tree_spider",
    isLoadAlertsOn: false        
};
//==============================================================================
export const alertLog = new ConsoleAlert(`§d${pack.packName}§r`);
export const chatLog = new ChatMsg(`§b${pack.packName}§r`);
//==============================================================================
export const dynamicVars = {
    //-- Entity Dynamic Properties --
    aliveTicks: 'aliveTicks',
    lastActiveTick: 'lastActiveTick',
    lastWebActivityTick: 'lastWebActivityTick',
    lastLocation: 'lastLocation',

    // Entity Activity
    websCreated: 'websCreated',
    websExpanded: 'websExpanded',
    websEntered: 'websEntered',
    eggsLaid: 'eggsLaid',
    entityBorn:'entityBorn',
    entityLoads:'entityLoads',
    entitySpawns:'entitySpawns'
};
//==============================================================================
export const entityEvents = {
    despawnEventName: 'despawn_me',
    replaceEventName: 'replace_me',
    stayInWebEventName: 'stay_in_web_start',
    wanderEventName: 'wander_around_start',
    baby_stayInWebEventName: 'baby_stay_in_web_start',
    baby_wanderEventName: 'baby_wander_around_start'
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
    //scoreboardName: 'tree_spider_monitor',
    //scoreboardDisplayName: '§aTree Spider §bMonitor',
    //scoreboard: world.scoreboard.getObjective(`tree_spider_monitor`),
    //TODO: automate the log and leaves list with vanilla-data
    target_logs: [
        "minecraft:mangrove_roots", "minecraft:acacia_log", "minecraft:birch_log",
        "minecraft:cherry_log", "minecraft:dark_oak_log", "minecraft:jungle_log",
        "minecraft:mangrove_log", "minecraft:oak_log", "minecraft:pale_oak_log", "minecraft:spruce_log",
        "minecraft:warped_stem", "minecraft:crimson_stem", "minecraft:mushroom_stem"
    ],
    target_leaves: [
        "minecraft:warped_wart_block", "minecraft:shroomlight", "minecraft:nether_wart_block",
        "minecraft:acacia_leaves", "minecraft:birch_leaves", "minecraft:cherry_leaves", "minecraft:jungle_leaves",
        "minecraft:dark_oak_leaves", "minecraft:mangrove_leaves", "minecraft:oak_leaves", "minecraft:pale_oak_leaves", "minecraft:spruce_leaves",
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
// End of File