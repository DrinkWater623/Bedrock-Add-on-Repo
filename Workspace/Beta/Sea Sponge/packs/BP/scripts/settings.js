//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
import { ConsoleAlert, ChatMsg } from "./common-stable/consoleClass";
//==============================================================================
/**
 *  Owner is to edit this file as needed
 */
//==============================================================================
export const pack = {
    packName: 'Sea Sponge',
    packNameSpace: 'dw623:',
    isLoadAlertsOn: true,
    hasChatCmd: -1,
    isStable: 1,
    alert: "https://github.com/DrinkWater623"
};
//==============================================================================
export const alertLog = new ConsoleAlert(`§d${pack.packName}§r`);
export const chatLog = new ChatMsg(`§b${pack.packName}§r`);
//==============================================================================
export const globals = {
    randomTickChance: 0.1,
    randomTickChanceDebug: 1
};
//==============================================================================
export const dev = {
    debug: false,
    debugGamePlay: false,
    debugPackLoad: false,
    debugSubscriptions: false,
    debugGrowth: true,
    debugCheck: true,
    anyOn () {
        this.debug = false;
        for (const key in dev) {
            if (key.startsWith('debug'))
                this.debug = this.debug || dev[ key ];
        }
    }
};
//==============================================================================
export const watchFor = {
    //keep in order
    sea_sponge_blocks: [
        "dw623:sea_sponge_v1",
        "dw623:sea_sponge_v2",
        "dw623:sea_sponge_v3"
    ],
    sea_sponge_states: [
        "bool:stems",
        "int:stems"        
    ],
    sea_sponge_empty: [
        "false",
        "0"        
    ],
    
    sea_sponge_states_v3: [ "int:stem_1", "int:stem_2", "int:stem_3" ],
    //keep in order
    sea_sponge_stem_loot: [
        "dw623:wet_sea_sponge_stem",
        "dw623:wet_sea_sponge_stem_part",
        "dw623:wet_sea_sponge_stem_part"
    ],

    sea_sponge_stump_loot: "dw623:sea_sponge_stump"

};
//==============================================================================

//=============================================================================
// End of File
//=============================================================================