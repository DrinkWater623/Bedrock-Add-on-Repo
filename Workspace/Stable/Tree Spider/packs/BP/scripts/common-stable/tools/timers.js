// timers.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Description: 
    Scoreboard based timers and counters
    Anything related to time
========================================================================
Change Log:    
    20251030 - separate out to own file
    20251110 - Added getWorldTime
    20251118 - Fixed return jobs for intervals
========================================================================*/
import { world, system, ScoreboardObjective, TicksPerSecond } from '@minecraft/server';
import { ScoreboardLib } from './scoreboardClass.js';
import { Ticks } from '../../common-data/globalConstantsLib.js';
import { alertLog } from '../../settings.js';
//===================================================================
export class ScoreboardTimers {
    //===================================================================
    /**
     * 
     * @param {string | ScoreboardObjective} scoreboard
     * @param {string} entryName 
     * @param {number} addAmount 
     * @param {number} tickInterval 
     * @returns {number}
     */
    static tickCounterStart (scoreboard, entryName, addAmount = 1, tickInterval = 1) {
        if (!entryName) return 0;
        let sb = ScoreboardLib.getScoreboard(scoreboard);
        if (!sb) { if (typeof scoreboard == 'string') sb = ScoreboardLib.create(scoreboard); }
        if (!sb || !sb.isValid) return 0;

        const job = system.runInterval(() => {
            if (sb && sb.isValid) sb.addScore(entryName, addAmount);
        }, tickInterval);

        return job;
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {string} entryName 
     * @returns {number}
     */
    static secondsCounterStart (scoreboard, entryName) {
        return ScoreboardTimers.tickCounterStart(scoreboard, entryName, 1, TicksPerSecond);
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {string} entryName 
     * @returns {number}
     */
    static minutesCounterStart (scoreboard, entryName) {
        return ScoreboardTimers.tickCounterStart(scoreboard, entryName, 1, TicksPerSecond * 60);
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {string} entryName 
     * @returns 
     */
    static hoursCounterStart (scoreboard, entryName) {
        return ScoreboardTimers.tickCounterStart(scoreboard, entryName, 1, TicksPerSecond * 60 * 60);
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {string} [initialsWhich='tsmhd']  t,s,m,h,d (t=ticks, m=minutes, guess the rest)
     * @returns {number}
     */
    static systemTimeCountersStart (scoreboard, initialsWhich = 'tsmhd') {
        let sb = ScoreboardLib.getScoreboard(scoreboard);
        if (!sb) { if (typeof scoreboard == 'string') sb = ScoreboardLib.create(scoreboard); }
        if (!sb || !sb.isValid) return 0;

        const interval = initialsWhich.includes('t') ? 1 : initialsWhich.includes('s') ? TicksPerSecond : initialsWhich.includes('m') ? Ticks.perMinute : Ticks.perHour;
        const tickOffset = system.currentTick;

        const job = system.runInterval(() => {
            if (sb && sb.isValid) {
                if (initialsWhich.includes('t')) sb.setScore('System Ticks', system.currentTick - tickOffset);
                if (initialsWhich.includes('s')) sb.setScore('System Seconds', Math.trunc((system.currentTick - tickOffset) / Ticks.perSecond));
                if (initialsWhich.includes('m')) sb.setScore('System Minutes', Math.trunc((system.currentTick - tickOffset) / Ticks.perMinute));
                if (initialsWhich.includes('h')) sb.setScore('System Hours', Math.trunc((system.currentTick - tickOffset) / Ticks.perHour));
                if (initialsWhich.includes('d')) sb.setScore('System Days', Math.trunc((system.currentTick - tickOffset) / Ticks.perDay));
            }
        }, interval);

        return job;
    }
}
//====================================================================
export function getWorldTime () {
    const daytime = world.getTimeOfDay() + 6000;    
    const datetime = new Date(daytime * 3.6 * 1000);
    return { hours: datetime.getHours(), minutes: datetime.getMinutes() };
}
//===================================================================
//End of File
//===================================================================