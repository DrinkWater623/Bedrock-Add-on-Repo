// settings.js  Wither ALert
//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
import { world } from "@minecraft/server";
// Shared
import { ConsoleAlert, ChatMsg } from "./common-stable/tools/messageLib";
import { Scoreboards } from "./common-stable/tools/scoreboardLib";
//==============================================================================
/**
 *  Owner is to edit this file as needed
 */
//==============================================================================
export const pack = {
    packName: 'Wither Alert',
    about: 'Lets you know who and when a wither was spawned and tracks it.',
    devUrl: 'https://github.com/DrinkWater623',
    reportBugs: 'pinkSalt623@gmail.com',

    beta: false,
    worldLoaded: false,
    isLoadAlertsOn: true,
    isWitherAlertSystemOn: false, //turned on when a wither shows up
    isWithersAllowed: true, // admin can turn this off, and it will be killed upon load/spawn
    cmdNameSpace: "wa",

    gamePlay: {
        cmdNameSpace: "wa:",
        boostsAllowed: false,
        boostTicks: 7200,
        boostTicksMin: 1200,
        boostTicksMax: 1200 * 20
    }
};
//==============================================================================
export const packDisplayName = `§d${pack.packName}§r`;
export const alertLog = new ConsoleAlert(packDisplayName);
export const chatLog = new ChatMsg(packDisplayName);
//==============================================================================
//Change this to change the entity
export const dynamicVars = {
    allowed:`isWithersAllowed`,
    spawned:`Total_Spawned`
};
//==============================================================================
//Change this to change the entity
export const watchFor = {
    typeId: "minecraft:wither",
    validated: false, //Note: this is checked each load - so don't bother tryna trick it, unless you do it in code
    family: "wither",
    display: "Wither",
    onPlace: "minecraft:wither_skull",
    placedOnBlock: "minecraft:soul_sand",
    blocks: {
        onPlace: "minecraft:wither_skull",
        placedOnBlock: "minecraft:soul_sand",
    },
    explosiveProjectiles: [ "minecraft:wither_skull", "minecraft:wither_skull_dangerous" ],
    //watchForExplosion: true,

    intervalTimer: 400, // = 30 * 20, //Time between Location Alerts when Withers
    intervalMin: 100,
    intervalMax: (24000 / 4),

    scoreboards: new Scoreboards(false, pack.cmdNameSpace, `${packDisplayName}§l`),

    /** Initialize scoreboards + jobs (call once after world load) */
    sb_setup () {
        const cfg = {
            bases: [ "Active", "Responsible","History","Hunters" ], //or history retrieved from DVs
            entries: {
                // Ctr entries
                loaded: "§aLoaded",
                removed: "§6Removed",
                died: "§cDied",
                killed: "§cKilled"
            }
        };

        this.scoreboards.setup(cfg);

        // Time counter when withers alive - check after world is loaded... then event signals take over
        //this.scoreboards.enableTimeCounter(true);        
        // this.scoreboards.registerIntervalJob(
        //     "entityCounter",
        //     () => { if (this.debugOn) thisAddOn_EntityCounts(); },
        //     Ticks.perMinute / 6,
        //     [ "Ctrs" ]
        // );        

        // Start all registered jobs        
        //this.scoreboards.countersOn();
        //this.scoreboards.show("Active");
    }
};
//==============================================================================
//Change this to ...
export const gamePlay = {
    cmdNameSpace: "wa:",
    boostsAllowed: false,
    boostTicks: 7200,
    boostTicksMin: 1200,
    boostTicksMax: 1200 * 20
};

//==============================================================================
