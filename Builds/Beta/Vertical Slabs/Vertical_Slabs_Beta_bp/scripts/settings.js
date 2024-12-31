//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
import { ConsoleAlert, ChatMsg } from "./common-stable/consoleClass";
import { MinecraftBlockTypes, MinecraftItemTypes } from "./common-data/vanillaData";
//==============================================================================
const vanillaItems = Object.values(MinecraftItemTypes).filter(item => item.endsWith('_slab'));
//==============================================================================
/**
 *  Owner is to edit this file as needed
 */
//==============================================================================
export const pack = {
    packName: 'Vertical Slabs',
    packNameSpace: 'dw623:',
    isLoadAlertsOn: true,
    hasChatCmd: -1,
    isStable: 1,
    alert: "https://github.com/DrinkWater623",
    VanillaOnlySlabPlacement: false
};
//==============================================================================
export const alertLog = new ConsoleAlert(`§d${pack.packName}§r`);
export const chatLog = new ChatMsg(`§b${pack.packName}§r`);
//==============================================================================

//==============================================================================
export const dev = {
    debug: false,
    debugPackLoad: false,
    debugSubscriptions: false,
    debugSlabInteractEvents: false,    
    debugSlabOxidationEvents: false,    
    debugSlabScrapeEvents: false,    
    debugSlabWaxEvents: false,    
    debugSlabPlaceEvents: false,
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
export const watchFor = {
    vanillaSlabs: Object.values(MinecraftBlockTypes)
        .filter(block => block.endsWith('_slab'))
        .filter(b => vanillaItems.includes(b))
};
//=============================================================================
// End of File
//=============================================================================