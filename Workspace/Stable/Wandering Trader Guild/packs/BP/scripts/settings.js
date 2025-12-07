// settings.js  Wandering Trader Guild
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T.
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20251203 - Created
========================================================================*/
// Shared
import { ConsoleAlert, ChatMsg } from "./common-stable/tools/messageLib";
//==============================================================================
/**
 *  Owner is to edit this file as needed - Note: debug vars in fn-debug
 */
//==============================================================================
export const pack = {
    packName: 'Wandering Trader Guild',
    about: 'Just some guys tryna make a few bucks with some great deals.  §l§aHave some money ready!',
    devUrl: 'https://github.com/DrinkWater623',
    reportBugs: 'pinkSalt623@gmail.com',
    beta: false,
    worldLoaded: false,
    nameSpace: "dw623",
    cmdNameSpace: "wtg",
    isLoadAlertOn: true
};
//==============================================================================
export const packDisplayName = `§a${pack.packName}§r`;
export const alertLog = new ConsoleAlert(packDisplayName);
export const chatLog = new ChatMsg(packDisplayName);
//==============================================================================
const traderList = [
    "doctor"
    , "banker"
    , "fence"
    , "builder"
    , "con_man"
    , "foodie"
    , "gardener"
    , "librarian"
    , "enchantress"
    , "redstoner"
];
export const typeIDPrefix = `${pack.nameSpace}:wandering_`;
export const watchFor = {
    packEntityList: traderList
        .map(x => `${typeIDPrefix}${x}`)
};
/** @type {Record<string, string[]>} */
export const traderJobTitles = {
    doctor: [
        "Village Doctor",
        "Healer",
        "Field Medic",
        "Apothecary"
    ],
    banker: [
        "Banker",
        "Moneylender",
        "Vault Keeper",
        "Coin Master"
    ],
    fence: [
        "Fence",
        "Black Market Dealer",
        "Quiet Middleman",
        "Discreet Trader"
    ],
    builder: [
        "Builder",
        "Stone Mason",
        "Architect",
        "Project Foreman"
    ],
    con_man: [
        "Con Man",
        "Shady Dealer",
        "Smooth Talker",
        "Suspicious Merchant"
    ],
    foodie: [
        "Foodie",
        "Snack Enthusiast",
        "Gourmet Trader",
        "Street Chef"
    ],
    gardener: [
        "Gardener",
        "Herbalist",
        "Seed Collector",
        "Green Thumb"
    ],
    librarian: [
        "Librarian",
        "Archivist",
        "Book Keeper",
        "Scroll Curator"
    ],
    enchantress: [
        "Enchantress",
        "Mystic Crafter",
        "Arcane Artisan",
        "Rune Weaver"
    ],
    redstoner: [
        "Redstoner",
        "Engineer",
        "Tinkerer",
        "Circuit Mage"
    ]
};

//==============================================================================
// End of File
//==============================================================================
