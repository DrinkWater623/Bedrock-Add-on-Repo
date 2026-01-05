// settings.js  F3
//@ts-check
import { world } from "@minecraft/server";
import { ConsoleAlert, ChatMsg } from "./common-stable/tools/messageLib";
//==============================================================================
/**
 *  Owner is to edit this file as needed
 */
//==============================================================================
export const pack = {
    packName: 'F3 Testing',

    about: 'Testing for Subscription Events and Custom Components',
    devUrl: 'https://github.com/DrinkWater623',
    reportBugs: 'pinkSalt623@gmail.com',

    isBeta: false,
    worldLoaded: false,
    namespace: "dw623",
    cmdNameSpace: "f3",
    isLoadAlertsOn: true,

    debugOn: true //important - do not release Add-ons with this true, except for F3, as it was meant for debugging only
};
//==============================================================================
export const packDisplayName = `§6${pack.packName}§r`;
//Non Dev version
export const alertLog = new ConsoleAlert(packDisplayName);
export const chatLog = new ChatMsg(packDisplayName);
//==============================================================================
export const watchFor = {

    //s/b same as jsonte data - add new versions here and in regolith/jsonte data for vanilla materials
    materialList: [
        "bedrock"
    ],
    soundProfiles: new Map(),

    //For onPlace custom components.  Some blocks do not need this, so not listed   
    blocksTypeList () { return [ 'arrow', 'bar', 'mini_block', 'mini_dot', 'mini_puck' ]; },

    /**@param {string} name */
    aBlockList (name) {
        return this.materialList.map(m => pack.namespace + ':' + m + `_${name}`);
    },

    /** @returns {Array<[string, string[]]>} */
    onPlaceBlockGroups () {
        return this.blocksTypeList().map(blockType => [ blockType, this.aBlockList(blockType) ]);
    },

    /**@returns{string[]} */
    _onPlaceBlockList () {
        return this.blocksTypeList().flatMap(blockType => this.aBlockList(blockType));
    },
    /**@type {string[]} */
    blockWatchList: [],

    entityWatchList: [
        'minecraft:player',

        //Air
        'minecraft:arrow', //projectile
        'minecraft:phantom',
        'minecraft:ghast',
        'minecraft:wither',

        //Fire
        'minecraft:blaze',
        'minecraft:magma',
        //'minecraft:creeper',
        
        //Water
        'minecraft:drowned',
        'minecraft:guardian',
        'minecraft:pufferfish',

        //Earth (undead)
        'minecraft:skeleton',
        'minecraft:husk',
        'minecraft:zombie',
        'minecraft:zombie_villager'
    ],

    customItemList: [
        "dw623:light_arrow_template"
    ]
};
watchFor.blockWatchList = [ ...watchFor._onPlaceBlockList() ];
watchFor.blockWatchList.filter(v => v.includes('bedrock')).forEach((v) => { watchFor.soundProfiles.set(v, 'dig,stone'); });
//watchFor.onUseBlockAsItemList = [...watchFor.onPlaceBlockList()];
//==============================================================================
export const toggles = {
    //entities
    ed_aft: false,
    el_aft: false,
    es_aft: false,
    //Player Interact With Block
    piwb_b4: false,
    piwb_aft: false,
    //Player Break Block
    pbb_b4: false,
    pbb_aft: false,
    //Player Place Block
    ppb_b4: false, //beta

    //Player Interact With Entity
    piwe_b4: false,

    blockView: false
};