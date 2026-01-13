// settings.js  Element-Affinity
//@ts-check
import { world } from "@minecraft/server";
import { ConsoleAlert, ChatMsg } from "./common-stable/tools/messageLib";
//==============================================================================
/**
 *  Owner is to edit this file as needed
 */
//==============================================================================
export const pack = {
    packName: 'Element-Affinity',

    about: 'Air, Earth, Fire and Water Perks',
    devUrl: 'https://github.com/DrinkWater623',
    reportBugs: 'pinkSalt623@gmail.com',

    isBeta: false,
    worldLoaded: false,
    namespace: "dw623",
    cmdNameSpace: "element",
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
//==============================================================================
