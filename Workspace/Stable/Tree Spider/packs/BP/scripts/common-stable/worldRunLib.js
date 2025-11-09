// worldRunLib.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T
URL: https://github.com/DrinkWater623
========================================================================
Change Log
    20241229 - DW623 - reOrg and add License
    20251102 - DW623 - Changed Name 
    20251107 - DW623 - fix potential problem with worldRun
========================================================================*/
import { Dimension, system, world } from '@minecraft/server';

// Shared


// Local to project, all my projects have one
// @ts-ignore
import { alertLog } from '../settings';
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
// End of File