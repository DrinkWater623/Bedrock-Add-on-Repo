// runJobs.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T
URL: https://github.com/DrinkWater623
========================================================================
Change Log    
    20251102 - DW623 - created
    20251203 - Relocated
========================================================================*/
import { system ,world,Dimension} from '@minecraft/server';
// Shared
import {  rndInt } from "./mathLib.js";
//local 

import { alertLog } from "../../settings.js";  //every add-on of mine, has a settings file
//==============================================================================
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
//===================================================================
/**
 * 
 * @param {string} command 
 * @param {string | Dimension} [dimension='overworld'] 
 * @param {number} tickDelay
 * @param {Vector3 | undefined} [locationPreCheck=null] 
 * 
 */
export function worldRun (command, dimension = 'overworld', tickDelay = 0, locationPreCheck = undefined) {

    if (!command) return false;

    const dimensionObj = typeof dimension == 'string' ? world.getDimension(dimension) : dimension;
    if (!dimensionObj) return false;

    //TODO: if (tickDelay < 0) tickDelay = 0 ---test first

    system.runTimeout(() => {
        if (locationPreCheck) if (!dimensionObj.isChunkLoaded(locationPreCheck)) return;

        try {
            dimensionObj.runCommand(command);
        } catch (error) {
            alertLog.error(`§b*worldRun() - §6command:§r ${command}\n§cError:§e${error}`, true);
        }
    }, tickDelay);

    return true;
}
//===================================================================
/**
 * 
 * @param {string} command 
 * @param {string} [dimension='overworld'] 
 * @param {number} tickInterval
 * @returns 
 * 
 */
export function worldRunInterval (command, dimension = 'overworld', tickInterval = 1) {

    if (!command) return false;

    const dimensionObj = world.getDimension(dimension);
    if (!dimensionObj) return false;

    if (tickInterval < 1) tickInterval = 1;
    const callback = system.runInterval(() => {
        try {
            dimensionObj.runCommand(command);
        } catch (error) {
            alertLog.error(`§b*worldRun() - §6command:§r ${command}\n§cError:§e${error}`, true);
        }
    }, Math.abs(tickInterval));
    return callback;

}
//===================================================================
// //===================================================================
/**
 * Run a callback once after a random tick delay.
 * @param {() => void} fn
 * @param {number} [min=1]
 * @param {number} [max=20]
 * @returns {number} runId (from system.runTimeout)
 */
export function systemRunTimeoutRandom (fn, min = 1, max = 20) {
    const lo = Math.max(0, Math.floor(Math.min(min, max)));
    const hi = Math.max(lo, Math.floor(Math.max(min, max)));
    const delay = rndInt(lo, hi);
    return system.runTimeout(fn, delay);
}
//===================================================================
/**
 * Run a callback repeatedly at random intervals.
 * Returns a cancel function.
 * @param {() => void} fn
 * @param {number} [min=20]
 * @param {number} [max=100]
 * @param {{ times?: number }} [opts]  // times: how many executions (Infinity by default)
 * @returns {() => void} cancel
 */
export function systemRunIntervalRandom (fn, min = 20, max = 100, opts) {
    const lo = Math.max(0, Math.floor(Math.min(min, max)));
    const hi = Math.max(lo, Math.floor(Math.max(min, max)));
    let left = opts?.times ?? Infinity;
    /** @type {{ cancelled: boolean }} */
    const state = { cancelled: false };

    const tick = () => {
        if (state.cancelled || left-- <= 0) return;
        try { fn(); } finally {
            if (!state.cancelled && left > 0) {
                system.runTimeout(tick, rndInt(lo, hi));
            }
        }
    };
    system.runTimeout(tick, rndInt(lo, hi));

    return () => { state.cancelled = true; };
}
//===================================================================
// End of File