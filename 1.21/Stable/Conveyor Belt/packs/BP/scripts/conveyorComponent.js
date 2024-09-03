// @ts-check
/**
 * TODO: To Do List:
 * 
 *      1) which is better high friction or speed effect
 *      2) Can speed effect be less than one second... 
 *      3) will movement look smooth if TP'd
 *      4) what does knockback look like
 *      5) slowness if facing wrong direction, how much to apply and still allow movement
 * 
 */
//==============================================================================
import { world, Player, Block, Entity, system } from "@minecraft/server";
//import { MinecraftEffectTypes } from '@minecraft/vanilla-data';
import { DirectionInfo } from './direction_info.js';
import { Vector3Lib as vec3 } from './vectorClass.js';
const dirInfo = new DirectionInfo(4);
//==============================================================================
//Local
const debug = false;
const debugMsg = function (msg = "", preFormatting = "") { if (debug && msg) world.sendMessage(`${preFormatting}@${system.currentTick}: §cDebug Log:§r ${msg}`); };
