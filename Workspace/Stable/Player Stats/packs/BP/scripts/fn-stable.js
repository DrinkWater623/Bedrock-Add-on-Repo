//@ts-check
import { Entity, system, Block } from "@minecraft/server";
import { dev, dynamicVars } from './settings.js';
import { ScoreboardLib } from "./commonLib/scoreboardClass.js";
//===================================================================
/**
 * 
 * @param {Entity} entity 
 */
export function lastTickRegister (entity) {
    entity.setDynamicProperty(dynamicVars.lastActiveTick, system.currentTick);
    entity.setDynamicProperty(dynamicVars.lastLocation, entity.location);
}
//===================================================================
export function timersToggle () {

    if (dev.debugTimeCountersOn) {
        dev.debugTimeCountersOn = false;
        if (dev.debugTimeCountersRunId) system.clearRun(dev.debugTimeCountersRunId);
        dev.debugTimeCountersRunId = 0;
    }
    else {
        dev.debugTimeCountersOn = true;
        dev.debugTimeCountersRunId = ScoreboardLib.systemTimeCountersStart(dev.debugScoreboardName, dev.debugTimers);
    }
}
//===================================================================
