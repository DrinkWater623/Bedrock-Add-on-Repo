//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
import { ConsoleAlert, ChatMsg } from "./common-stable/consoleClass";
import { MinecraftBlockTypes, MinecraftItemTypes } from "./common-data/vanilla-data";
//==============================================================================
const vanillaItems = Object.values(MinecraftItemTypes).filter(item => item.endsWith('_slab'));
//==============================================================================
/**
 *  Owner is to edit this file as needed
 */
//==============================================================================
export const pack = {
    packName: 'Name of Pack Here',
    packNameSpace: 'dw623:',
    isLoadAlertsOn: true, //this shows a colored console.log message when pack is loaded
    hasChatCmd: -1, // this will be updated by installation of chatCmds module
    isStable: 1,    // if beta, have that module update this 
    alert: "https://github.com/DrinkWater623", //contact info
    //add any other settings here related to the pack
    VanillaOnlySlabPlacement: false
};
//==============================================================================
export const alertLog = new ConsoleAlert(`§d${pack.packName}§r`);
export const chatLog = new ChatMsg(`§b${pack.packName}§r`);
//==============================================================================
export const globals = {    
};
//==============================================================================
export const dev = {
    debug: false,
    debugPackLoad: false,
    debugSubscriptions: false,
    //-------------------------------
    //add custom here
    debugSlabInteractEvents: false,    
    debugSlabPlaceEvents: false,
    //-------------------------------
    anyOn () {
        this.debug=false;
        for (const key in dev) {
            if (key.startsWith('debug'))
                this.debug = this.debug || dev[ key ];
        }
    },
    allDebug () {
        for (const key in dev) {
            if (key.startsWith('debug') && key.length > 'debug'.length)
                dev[ key ] = this.debug;
        }
    },
    allOff () {
        for (const key in dev) {
            if (key.startsWith('debug'))
                dev[ key ] = false;
        }
    },
    allOn () {
        for (const key in dev) {
            if (key.startsWith('debug'))
                dev[ key ] = true;
        }
    }
};
//==============================================================================
//  Use watchFor to define objects related to this pack, that you are monitoring
//==============================================================================
export const watchFor = {
    vanillaSlabs: Object.values(MinecraftBlockTypes)
        .filter(block => block.endsWith('_slab'))
        .filter(b => vanillaItems.includes(b)),

    // woodSlabs: Object.values(MinecraftBlockTypes)
    //     .filter(b => b.endsWith('_planks'))
    //     .map(s => s.replace('_planks', '_slab'))
    //     .filter(i => vanillaItems.includes(i)),

    fallThruBlocks: [
        "minecraft:air",
        "minecraft:lava",
        "minecraft:water",
        "minecraft:flowing_lava",
        "minecraft:flowing_water"
    ]
};
//=============================================================================
// End of File
//=============================================================================