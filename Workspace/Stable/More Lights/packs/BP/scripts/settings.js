// settings.js  More Lights Minecraft Bedrock Add-on
// @ts-check

import { ChatMsg, ConsoleAlert } from "./common-stable/tools/messageLib";

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
    isLoadAlertsOn: true,

    debugOn: true //Do Not change by code... the MASTER SWITCH to start world with/without debugging enabled
};
//==============================================================================
export const packDisplayName = `§f${pack.packName}§r`;
export const alertLog = new ConsoleAlert(packDisplayName);
export const chatLog = new ChatMsg(packDisplayName);
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
    soundProfiles: new Map(),
    /**
     * 
     * @param {string} typeId 
     */
    typeIdStrip (typeId) {
        return;
    },
    //For onPlace custom components.  Some blocks do not need this, so not listed
   /* arrowBlocks () {
        return this.aBlockList('arrow');
    },
    barBlocks () {
        return this.aBlockList('bar');
    },
    mini_blocks () {
        return this.aBlockList('mini_block');
    },*/
    blocksTypeList(){return ['arrow','bar','mini_block','mini_dot','mini_puck'];},
    
    /**@param {string} name */
    aBlockList (name) {
        return this.materialList.map(m => pack.namespace + ':' + m + `_${name}`);
    },
    
    /** @returns {Array<[string, string[]]>} */
    onPlaceBlockGroups () {
        return this.blocksTypeList().map(blockType => [blockType, this.aBlockList(blockType)]);
    },

    /**@returns{string[]} */
    _onPlaceBlockList () {
        return this.blocksTypeList().flatMap(blockType => this.aBlockList(blockType));
    },
    /**@type {string[]} */
    onPlaceBlockList:[],

    customItemList: [
        "dw623:light_arrow_template"
    ]
};
watchFor.onPlaceBlockList=[...watchFor._onPlaceBlockList()]
watchFor.onPlaceBlockList.filter(v => v.includes('glowstone')).forEach((v) => { watchFor.soundProfiles.set(v, 'dig,stone'); });
watchFor.onPlaceBlockList.filter(v => v.includes('sea_lantern')).forEach((v) => { watchFor.soundProfiles.set(v, 'dig,stone'); });
watchFor.onPlaceBlockList.filter(v => v.includes('shroomlight')).forEach((v) => { watchFor.soundProfiles.set(v, 'dig,shroomlight'); });
watchFor.onPlaceBlockList.filter(v => v.includes('_froglight')).forEach((v) => { watchFor.soundProfiles.set(v, 'break.froglight'); });
//==============================================================================
// End of File
//==============================================================================
