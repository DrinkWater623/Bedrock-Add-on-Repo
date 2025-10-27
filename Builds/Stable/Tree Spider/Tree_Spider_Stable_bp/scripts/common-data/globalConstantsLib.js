/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20250105 - reOrg
========================================================================*/
//@ts-check
import { TicksPerSecond } from "@minecraft/server";
import { MinecraftBlockTypes, MinecraftItemTypes } from "./vanilla-data.js";
//========================================================================
export const mcNameSpace = 'minecraft:';
//========================================================================
export class Ticks {
    static perSecond = TicksPerSecond;
    static perMinute = TicksPerSecond * 60;
    static perHour = this.perMinute * 60;
    static perDay = this.perMinute * 24;
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
//=============================================================================
// End of File
//=============================================================================
