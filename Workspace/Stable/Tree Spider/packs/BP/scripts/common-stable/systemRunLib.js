// systemRunLib.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T
URL: https://github.com/DrinkWater623
========================================================================
Change Log    
    20251102 - DW623 - created
========================================================================*/
import { system, world } from '@minecraft/server';
// Shared
import { chance, rndInt } from "../common-other/mathLib.js";
//===================================================================
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