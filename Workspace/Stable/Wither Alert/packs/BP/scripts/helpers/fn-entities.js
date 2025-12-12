// fn-entities.js  Wither Alert
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20251206 - created 
========================================================================*/
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
// import { MinecraftEntityTypes, MinecraftEffectTypes } from "@minecraft/vanilla-data";
//==============================================================================
// Minecraft
import { Entity, system, Block, GameMode, Player } from "@minecraft/server";
// Shared Data
import { Ticks } from "../common-data/globalConstantsLib.js";
// Shared Other
import { makeRandomName } from "../common-stable/tools/randomNames.js";
import { rndInt, chance } from "../common-stable/tools/mathLib.js";
// Shared Stable
import { DynamicPropertyLib } from "../common-stable/tools/dynamicPropertyClass.js";
import { EntityLib, spawnEntityAtLocation } from "../common-stable/entities/entityClass.js";
import { Vector3Lib, } from '../common-stable/tools/vectorClass.js';
// Local
import { devDebug } from "./fn-debug.js";
import { alertLog, pack, watchFor, entityDynamicVars } from '../settings.js';
//==============================================================================
const debugFunctions = false || devDebug.debugFunctionsOn;
const debugOn = devDebug.debugOn;
//==============================================================================
//==============================================================================

//====================================================================
// End of File
//====================================================================