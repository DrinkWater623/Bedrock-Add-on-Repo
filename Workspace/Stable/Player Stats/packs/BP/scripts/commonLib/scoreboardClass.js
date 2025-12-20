//@ts-check
import { system, world, DisplaySlotId, TicksPerSecond } from '@minecraft/server';
import { worldRun } from './worldRunLib.js';
import { globalConstantsLib } from './globalConstantsClass.js';
//===================================================================
export class ScoreboardLib {

    //===================================================================
    /**
         * 
         * @param {string} scoreboardName 
         * @param {string} entryName 
         * @param {string} [verb='add']
         * @param {number} [qty=0]
         * @param {number} [tickDelay=1]  
         */
    static do (scoreboardName, entryName, verb = 'add', qty = 0, tickDelay = 1) {

        if (!entryName) return false;
        if (![ 'add', 'remove', 'set' ].includes(verb)) return false;

        const sb = world.scoreboard.getObjective(scoreboardName);
        if (!sb) return false;

        const cmd = `scoreboard players ${verb}  ${entryName}  ${scoreboardName}  ${qty}`;
        //console.warn(`COMMAND: §a${cmd}`)
        return worldRun(cmd, 'overworld', tickDelay);
    }
    //===================================================================
    /**
     * 
     * @param {string} scoreboardName 
     * @param {string} entryName 
     * @param {number} qty
     * @param {number} [tickDelay=1]  
     */
    static add (scoreboardName, entryName, qty = 0, tickDelay = 1) {
        return ScoreboardLib.do(scoreboardName, entryName, 'add', qty, tickDelay);
    }
    //===================================================================
    /**
     * 
     * @param {string} scoreboardName 
     * @param {string} entryName 
     * @param {number} qty 
     * @param {number} [tickDelay=1] 
     */
    static sub (scoreboardName, entryName, qty = 0, tickDelay = 1) {
        return ScoreboardLib.do(scoreboardName, entryName, 'remove', qty, tickDelay);
    }
    //===================================================================
    /**
     * 
     * @param {string} scoreboardName 
     * @param {string} entryName 
     * @param {number} qty 
     */
    static set (scoreboardName, entryName, qty = 0, tickDelay = 1) {
        return ScoreboardLib.do(scoreboardName, entryName, 'set', qty, tickDelay);
    }
    //===================================================================
    /**
     * 
     * @param {string} scoreboardName 
     * @param {string} entryName 
     * @param {number} [tickDelay=1] 
     */
    static reset (scoreboardName, entryName, tickDelay = 1) {
        const sb = world.scoreboard.getObjective(scoreboardName);
        if (!sb || !entryName) return false;
        if (!sb.hasParticipant(entryName)) return;

        system.runTimeout(() => { sb.removeParticipant(entryName); }, tickDelay);
        return true;
    }
    /**
     * 
     * @param {string} scoreboardName
     */
    static resetAll (scoreboardName) {
        const sb = world.scoreboard.getObjective(scoreboardName);
        if (!sb) return false;

        const players = sb.getParticipants();
        players.forEach(p => { sb.removeParticipant(p); });
        return true;
    }
    /**
     * 
     * @param {string} scoreboardName
     */
    static resetAllPlayers (scoreboardName) {
        const sb = world.scoreboard.getObjective(scoreboardName);
        if (!sb) return false;

        const players = sb.getParticipants();
        system.run(() => { players.filter(p => p.type === 'Player').forEach(p => { sb.removeParticipant(p.displayName); }); });
        return true;
    }
    /**
     * 
     * @param {string} scoreboardName
     */
    static setZeroAll (scoreboardName) {
        const sb = world.scoreboard.getObjective(scoreboardName);
        if (!sb) return false;

        const players = sb.getParticipants();
        system.run(() => { players.forEach(p => { sb.setScore(p, 0); }); });

    }
    //===================================================================
    /**
     * 
     * @param {string} scoreboardName
     */
    static delete (scoreboardName) {
        const sb = world.scoreboard.getObjective(scoreboardName);
        if (!sb) return false;

        world.scoreboard.removeObjective(scoreboardName);
    }
    //===================================================================
    /**
    * 
    * @param {string} scoreboardName 
    */
    static sideBar_set (scoreboardName) {
        const sb = world.scoreboard.getObjective(scoreboardName);
        if (!sb) return false;
        system.run(() => { world.scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.Sidebar, { objective: sb }); });
        return true;
    }
    static sideBar_clear () {
        world.scoreboard.clearObjectiveAtDisplaySlot(DisplaySlotId.Sidebar);
        return true;
    }
    //===================================================================
    /**
     * 
     * @param {string} scoreboardName 
     * @param {string} displayName 
     */
    static create (scoreboardName, displayName = '') {
        if (!world.scoreboard.getObjective(scoreboardName))
            world.scoreboard.addObjective(scoreboardName, displayName || scoreboardName);
        return world.scoreboard.getObjective(scoreboardName);
    }
    //===================================================================
    /**
     * 
     * @param {string} scoreboardName 
     * @param {string} entryName 
     * @param {number} addAmount 
     * @param {number} tickInterval 
     * @returns 
     */
    static tickCounterStart (scoreboardName, entryName, addAmount = 1, tickInterval = 1) {
        if (!scoreboardName || !entryName) return 0;
        ScoreboardLib.create(scoreboardName);

        let job = 0;
        system.runTimeout(() => {

            const sb = world.scoreboard.getObjective(scoreboardName);
            if (sb) {
                job = system.runInterval(() => {
                    sb.addScore(entryName, addAmount);
                }, tickInterval);
            }
        }, 0);
        // const cmd = `scoreboard players add  ${playerName}  ${scoreboardName} ${addAmount}`;
        return job;
    }
    //===================================================================
    /**
     * 
     * @param {string} scoreboardName 
     * @param {string} entryName 
     * @returns 
     */
    static secondsCounterStart (scoreboardName, entryName) {
        return ScoreboardLib.tickCounterStart(scoreboardName, entryName, 1, TicksPerSecond);
    }
    //===================================================================
    /**
     * 
     * @param {string} scoreboardName 
     * @param {string} entryName 
     * @returns 
     */
    static minutesCounterStart (scoreboardName, entryName) {
        return ScoreboardLib.tickCounterStart(scoreboardName, entryName, 1, TicksPerSecond * 60);
    }
    //===================================================================
    /**
     * 
     * @param {string} scoreboardName 
     * @param {string} entryName 
     * @returns 
     */
    static hoursCounterStart (scoreboardName, entryName) {
        return ScoreboardLib.tickCounterStart(scoreboardName, entryName, 1, TicksPerSecond * 60 * 60);
    }
    //===================================================================
    /**
     * 
     * @param {string} scoreboardName
     * @param {string} [initialsWhich='tsmhd']  t,s,m,h,d (t=ticks, m=minutes, guess the rest)
     * @returns 
     */
    static systemTimeCountersStart (scoreboardName, initialsWhich = 'tsmhd') {
        if (!scoreboardName) return 0;
        ScoreboardLib.create(scoreboardName);

        let job = 0;
        const interval = initialsWhich.includes('t') ? 1 : initialsWhich.includes('s') ? TicksPerSecond : initialsWhich.includes('m') ? globalConstantsLib.TicksPerMinute : globalConstantsLib.TicksPerHour;
        system.runTimeout(() => {
            const sb = world.scoreboard.getObjective(scoreboardName);
            if (sb) {
                const tickOffset = system.currentTick;
                job = system.runInterval(() => {
                    if (initialsWhich.includes('t')) sb.setScore('System Ticks', system.currentTick - tickOffset);
                    if (initialsWhich.includes('s')) sb.setScore('System Seconds', Math.trunc((system.currentTick - tickOffset) / TicksPerSecond));
                    if (initialsWhich.includes('m')) sb.setScore('System Minutes', Math.trunc((system.currentTick - tickOffset) / globalConstantsLib.TicksPerMinute));
                    if (initialsWhich.includes('h')) sb.setScore('System Hours', Math.trunc((system.currentTick - tickOffset) / globalConstantsLib.TicksPerHour));
                    if (initialsWhich.includes('d')) sb.setScore('System Days', Math.trunc((system.currentTick - tickOffset) / globalConstantsLib.TicksPerDay));
                }, interval);
            }
        }, 0);
        // const cmd = `scoreboard players add  ${playerName}  ${scoreboardName} ${addAmount}`;
        return job;
    }
}