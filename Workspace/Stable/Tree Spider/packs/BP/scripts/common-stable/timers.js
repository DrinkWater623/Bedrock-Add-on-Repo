// timers.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Change Log:    
    20251030 - separate out to own file
========================================================================*/
import { system, ScoreboardObjective, TicksPerSecond } from '@minecraft/server';
import { ScoreboardLib } from './scoreboardClass.js';
import { Ticks } from '../common-data/globalConstantsLib.js';
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

        let job = 0;
        //FIXME: validate that job can return correctly, like say it is 20 secs out... does this wait???
        system.runTimeout(() => {
            if (sb) {
                job = system.runInterval(() => {
                    if (sb && sb.isValid) sb.addScore(entryName, addAmount);
                }, tickInterval);
            }
        }, 0);

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
     * FIXME: if job can return after a tick delay, add tickDelay parm
     * @param {string | ScoreboardObjective} scoreboard
     * @param {string} [initialsWhich='tsmhd']  t,s,m,h,d (t=ticks, m=minutes, guess the rest)
     * @returns {number}
     */
    static systemTimeCountersStart (scoreboard, initialsWhich = 'tsmhd') {
        let sb = ScoreboardLib.getScoreboard(scoreboard);
        if (!sb) { if (typeof scoreboard == 'string') sb = ScoreboardLib.create(scoreboard); }
        if (!sb || !sb.isValid) return 0;

        let job = 0;
        const interval = initialsWhich.includes('t') ? 1 : initialsWhich.includes('s') ? TicksPerSecond : initialsWhich.includes('m') ? Ticks.perMinute : Ticks.perHour;
        system.runTimeout(() => {
            const tickOffset = system.currentTick;
            job = system.runInterval(() => {
                if (sb && sb.isValid) {
                    if (initialsWhich.includes('t')) sb.setScore('System Ticks', system.currentTick - tickOffset);
                    if (initialsWhich.includes('s')) sb.setScore('System Seconds', Math.trunc((system.currentTick - tickOffset) / Ticks.perSecond));
                    if (initialsWhich.includes('m')) sb.setScore('System Minutes', Math.trunc((system.currentTick - tickOffset) / Ticks.perMinute));
                    if (initialsWhich.includes('h')) sb.setScore('System Hours', Math.trunc((system.currentTick - tickOffset) / Ticks.perHour));
                    if (initialsWhich.includes('d')) sb.setScore('System Days', Math.trunc((system.currentTick - tickOffset) / Ticks.perDay));
                }
            }, interval);
        }, 0);

        return job;
    }
}
//===================================================================
//End of File
