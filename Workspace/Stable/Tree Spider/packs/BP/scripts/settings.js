// settings.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20251024 - move dev to debug and add world dynamic vars
========================================================================*/
import { TicksPerDay } from "@minecraft/server";
// Shared
import { ConsoleAlert, ChatMsg } from "./common-stable/consoleClass";
import { leafBlocks, logBlocks, tallNatureBlocks } from "./common-data/block-data";
//==============================================================================
/**
 *  Owner is to edit this file as needed - Note: debug vars in fn-debug
 */
//==============================================================================
export const pack = {
    packName: 'Tree Spider',
    beta: false,
    worldLoaded: false,
    fullNameSpace: "dw623_tree_spider",
    isLoadAlertsOn: false,
    /* @type {Map<string,boolean>} */
    validatedEntities:new Map(),    
    /* @type {Map<string,boolean>} */
    validatedBlocks:new Map(),    
    /* @type {Map<string,boolean>} */
    validatedItems:new Map()
};
//==============================================================================
export const alertLog = new ConsoleAlert(`§d${pack.packName}§r`);
export const chatLog = new ChatMsg(`§b${pack.packName}§r`);
//==============================================================================
// These are used in subscribes.js and fn-entities,js
export const entityDynamicVars = {
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
    entityBorn: 'entityBorn',
    entityLoads: 'entityLoads',
    entitySpawns: 'entitySpawns'
};
//==============================================================================
//Change this to change the entity
export const watchFor = {
    validated: false,  //TODO: - validate exists when pack loaded, if not, turn everything OFF

    // Spiders
    spider_typeId: "dw623:tree_spider",
    egg_typeId: "dw623:tree_spider_egg_sac",
    spider_home_typeId: 'minecraft:web',
    spider_foodBlock_typeId: 'minecraft:firefly_bush',
    display: "Tree Spider",
    family: "tree_spider",
    allowFakeNameTags: true,
    spiderPopulationCheckRunInterval: 0, //3,
    spiderPopulationRadius: 16,
    spiderPopulationLimit: 5,
    hungryChance: 0.30,
    orbChance: 0.60,
    stalledCheckRunInterval: 3, //set to zero to turn off
    assumedStalledIfOver: 5,

    // Flies
    fly_typeId: "dw623:fly",
    fly_home_typeId: "minecraft:composter",
    fly_food_blocks: [
        "dw623:rotten_flesh_block",
        "minecraft:cane",
        "minecraft:sweet_berry_bush",
        "minecraft:cave_vines_body_with_berries" ],
    flyPopulationCheckRunInterval: 5,
    flyLifeCycleTicks: TicksPerDay * 3, //Life Cycle - 3 wks per Alexa.    

    // Fireflies
    firefly_typeId: "dw623:firefly",
    firefly_home_typeId: 'minecraft:firefly_bush',

    packEntityList () {
        return [
            this.spider_typeId,
            this.egg_typeId,
            this.fly_typeId,
            this.firefly_typeId
        ];
    },

    target_logs: [ "minecraft:mangrove_roots", "minecraft:mushroom_stem", ...logBlocks ],

    target_leaves: [ ...leafBlocks ],

    target_nature: [
        "minecraft:sweet_berry_bush", "minecraft:spore_blossom",
        "minecraft:brown_mushroom_block", "minecraft:red_mushroom_block",
        "minecraft:big_drip_leaf", ...tallNatureBlocks ],

    customItemList: [
        "dw623:bottle_of_flies",        //this gets moved to interact with entity Spider
        "dw623:dead_fly_ball_stick",
        "dw623:rotten_flesh_kabob"
    ]

};
export const thisPackEntities = [
    {entityTypeID:watchFor.spider_typeId,   validated:false},
    {entityTypeID:watchFor.egg_typeId,      validated:false},
    {entityTypeID:watchFor.fly_typeId,      validated:false},
    {entityTypeID:watchFor.firefly_typeId,  validated:false}
];
//==============================================================================
// End of File