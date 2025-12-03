// settings.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20251024 - move dev to debug and add world dynamic vars
    20251202 - fix ref to alertLog and chatLog
========================================================================*/
import { ConsoleAlert } from "./common-other/consoleAlertClass";
import { ChatMsg } from "./common-stable/chatMsgClass";
//==============================================================================
/**
 *  Owner is to edit this file as needed - Note: debug vars in fn-debug
 */
//==============================================================================
export const pack = {
    packName: 'Light Arrows',
    beta: false,
    worldLoaded: false,
    namespace: "dw623",
    isLoadAlertsOn: false
};
//==============================================================================
export const packDisplayName = `§f${pack.packName}§r`
export const alertLog = new ConsoleAlert(packDisplayName);
export const chatLog = new ChatMsg(packDisplayName);
//==============================================================================
// Pack detail data used in the scripts
//==============================================================================
export const watchFor = {

    //s/b same as jsonte data
    materialList: [
        "glowstone",
        "sea_lantern",
        "verdant_froglight",
        "ochre_froglight",
        "pearlescent_froglight",
        "shroomlight"
    ],

    arrowBlocks () {
        return this.materialList.map(m => pack.namespace + ':' + m + '_arrow');
    },
    barBlocks () {
        return this.materialList.map(m => pack.namespace + ':' + m + '_bar');
    },
    miniBlocks () {
        return this.materialList.map(m => pack.namespace + ':' + m + '_mini_block');
    },

    /**@returns{string[]} */
    onPlaceBlockList () {
        const blocks = [
            ...this.arrowBlocks(),
            ...this.barBlocks(),
            ...this.miniBlocks()
        ];
        return blocks;
    },

    customItemList: [
        "dw623:light_arrow_template"
    ]

};
//==============================================================================
// End of File
//==============================================================================
