// globalConstantsLib.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20250105 - reOrg
    20251102 - add minecraft ticks
========================================================================*/
import { TicksPerSecond } from "@minecraft/server";
//import { MinecraftBlockTypes, MinecraftItemTypes } from "./vanilla-data.js";
//========================================================================
export const mcNameSpace = 'minecraft:';
//========================================================================
export class Ticks {
    static perSecond = TicksPerSecond;
    static perMinute = TicksPerSecond * 60;
    static perHour = this.perMinute * 60;
    static perDay = this.perMinute * 24;
    static minecraftDay = this.perMinute * 20 ;
    static minecraftHour = this.minecraftDay / 24;
    static minecraftMinute = this.minecraftDay / 60;
}
//=============================================================================
//these are in ID order
export const colors = [
    "white",
    "orange",
    "magenta",
    "light_blue",
    "yellow",
    "lime",
    "pink",
    "gray",
    "light_gray",
    "cyan",
    "purple",
    "blue",
    "brown",
    "green",
    "red",
    "black"
];
export const chatColorCode = "§";
//using these
//FIXME: later make make sense
export const chatColors = {
    lime: `${chatColorCode}a`,
    blue: `${chatColorCode}b`,
    red: `${chatColorCode}c`,
    magenta: `${chatColorCode}d`,
    yellow: `${chatColorCode}e`,
    white: `${chatColorCode}f`,
    gold: `${chatColorCode}g`,
    black: `${chatColorCode}0`,
    darkBlue: `${chatColorCode}1`,
    green: `${chatColorCode}2`,
    teal: `${chatColorCode}3`,
    darkRed: `${chatColorCode}4`,
    purple: `${chatColorCode}5`,
    orange: `${chatColorCode}6`,
    lightWhite: `${chatColorCode}7`,
    gray: `${chatColorCode}8`,
    indigo: `${chatColorCode}9`,
    bold: `${chatColorCode}l`,
    confuse: `${chatColorCode}k`,
    undo: `${chatColorCode}r`
};
export const brightChatColors = [
    { code: 'a', name: 'green' },
    { code: 'b', name: 'blue' },
    { code: 'c', name: 'red' },
    { code: 'd', name: 'magenta' },
    { code: 'e', name: 'yellow' },
    { code: 'f', name: 'white' },
    { code: 'g', name: 'gold' },
    { code: '6', name: 'orange' },
    { code: '9', name: 'indigo' }
];
export const darkChatColors = [
    { code: '0', name: 'black' },
    { code: '1', name: 'blue' },
    { code: '2', name: 'green' },
    { code: '3', name: 'teal' },
    { code: '4', name: 'red' },
    { code: '5', name: 'purple' },
    { code: '6', name: 'orange' },
    { code: '7', name: 'white' },
    { code: '8', name: 'gray' },
];
/*
Chat test
§a a is for green apple
§b b if for bright blue
§c c is for fresh blood red
§d d is for magenta
§e e is for yellow
§f f is for white
§g g is for gold
§h h is for regular white
§i i is for same as above - must be the end


§0 0 is for black as night
§1 1 is for dark blue
§2 2 is for dark green
§3 3 is for muted teal
§4 4 is for dark blood red
§5 5 is for purple
§6 6 is for my fav orange
§7 7 is for regular white
§8 8 is for gray

§9 9 is for indigo I think
// i is g
§j j is for dark gray
§k k is for obliterate
§l l is for bold

§4 4 is for red same as 4
§m m is for red same as 4, a little more muted

§n n is for muted orange
§o o is for what
§p p is for reg yellow

§2 2 is for green like 2
§q q is for green like 2, but a little less bright

§3 3 is for green like 2
§s s is for same as 3, but a little brighter

§t t is for aqua
§u u is for light purple

§v v is for orange
§w w is for nothing

§x x is for what
§y y is for what
§z z is for what
*/
//=============================================================================
// End of File
//=============================================================================
