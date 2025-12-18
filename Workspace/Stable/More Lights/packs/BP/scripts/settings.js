// settings.js  More Lights Minecraft Bedrock Add-on
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T.
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20251024 - move dev to debug and add world dynamic vars
    20251202 - fix ref to alertLog and chatLog
========================================================================
    World Owner is to edit this file as needed 
    Note: debug vars and capabilities are in debug.js
========================================================================*/
export const pack = {
    packName: 'More Lights',

    about: 'Convenient and craft-able light arrows, bars, mini-blocks and other shapes from Vanilla light blocks',
    devUrl: 'https://github.com/DrinkWater623',
    reportBugs: 'pinkSalt623@gmail.com',

    isBeta: false,
    worldLoaded: false,
    namespace: "dw623",
    cmdNameSpace: "lights",
    isLoadAlertsOn: false,

    debugOn: true //Do Not change by code... the MASTER SWITCH to start world with/without debugging enabled
};
//==============================================================================
export const packDisplayName = `§f${pack.packName}§r`;
//export const alertLog = new ConsoleAlert(packDisplayName);
//export const chatLog = new ChatMsg(packDisplayName);
//==============================================================================
// Pack detail data used in the scripts
//==============================================================================
export const watchFor = {

    //s/b same as jsonte data - add new versions here and in regolith/jsonte data for vanilla materials
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

     /** @returns {Array<[string, string[]]>} */
    blockGroups () {
        return [
            [ "arrow", this.arrowBlocks() ],
            [ "bar", this.barBlocks() ],
            [ "mini_block", this.miniBlocks() ]
        ];
    },

    /**@returns{string[]} */
    onPlaceBlockList () {
        return [
            ...this.arrowBlocks(),
            ...this.barBlocks(),
            ...this.miniBlocks()
        ];
    },

    customItemList: [
        "dw623:light_arrow_template"
    ]
};
//==============================================================================
// End of File
//==============================================================================
