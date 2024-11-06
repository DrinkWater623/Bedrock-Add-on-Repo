//@ts-check
import { system, world } from '@minecraft/server';
import { alertLog } from '../settings';
//===================================================================
/**
 * 
 * @param {string} command 
 * @param {string} [dimension='overworld'] 
 * @param {number} tickDelay
 * 
 */
export function worldRun (command, dimension = 'overworld', tickDelay = 0) {

    if (!command) return false;

    const dimensionObj = world.getDimension(dimension);
    if (!dimensionObj) {
        alertLog.error(`Invalid Dimension: ${dimension}`, true);
        return false;
    }

    // if (tickDelay < 0) tickDelay = 0 ---test first

    system.runTimeout(() => {
        try {
            dimensionObj.runCommand(command);
        } catch (error) {
            alertLog.error(`§b*worldRun() - §6command:§r ${command}\n§cError:§e${error}`,true);            
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
 * 
 */
export function worldRunInterval (command, dimension = 'overworld', tickInterval = 1) {

    if (!command) return;

    const dimensionObj = world.getDimension(dimension);
    if (!dimensionObj) {
        alertLog.error(`Invalid Dimension: ${dimension}`, true);
        return;
    }

    if (tickInterval < 1) tickInterval = 1;
    const callback = system.runInterval(() => {
        try {
            dimensionObj.runCommand(command);
        } catch (error) {
            alertLog.error(`§b*worldRun() - §6command:§r ${command}\n§cError:§e${error}`,true);            
        }
    }, Math.abs(tickInterval));
    return callback;

}