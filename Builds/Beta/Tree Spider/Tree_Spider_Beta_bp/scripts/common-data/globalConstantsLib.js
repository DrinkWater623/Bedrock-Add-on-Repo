/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
//@ts-check
import { TicksPerSecond } from "@minecraft/server";
//========================================================================
// export class globalConstantsLib {
//     static TicksPerMinute = TicksPerSecond * 60;
//     static TicksPerHour = this.TicksPerMinute * 60;
//     static TicksPerDay = this.TicksPerHour * 24;
// }
export class Ticks {
    static perSecond = TicksPerSecond 
    static perMinute = TicksPerSecond * 60;
    static perHour = this.perMinute * 60;
    static perDay = this.perMinute * 24;   
}

export const mcNameSpace = 'minecraft:'
export const airBlock = mcNameSpace + 'air';

export const fallThruBlocks = [
    "minecraft:air",
    "minecraft:lava",
    "minecraft:water",
    "minecraft:flowing_lava",
    "minecraft:flowing_water"
];

export const lavaBlocks = [
    "minecraft:lava",
    "minecraft:flowing_lava"
];

export const waterBlocks = [
    "minecraft:water",
    "minecraft:flowing_water"
];