//@ts-check
import { system, world, DisplaySlotId, DimensionType } from '@minecraft/server';
import { worldRun, worldRunInterval } from './runCommandClass.js';
//===================================================================
export class ScoreboardLib {

    //===================================================================
    /**
         * 
         * @param {string} scoreboardName 
         * @param {string} playerName 
         * @param {string} [verb='add']
         * @param {number} [qty=0]
         * @param {number} [tickDelay=1]  
         */
    static do (scoreboardName, playerName, verb = 'add', qty = 0, tickDelay = 1) {

        if (!playerName) return false;
        if (![ 'add', 'remove', 'set' ].includes(verb)) return false;

        const sb = world.scoreboard.getObjective(scoreboardName);
        if (!sb) return false;

        const cmd = `scoreboard players ${verb}  ${playerName}  ${scoreboardName}  ${qty}`;
        //console.warn(`COMMAND: §a${cmd}`)
        return worldRun(cmd, 'overworld', tickDelay);
    }
    //===================================================================
    /**
     * 
     * @param {string} scoreboardName 
     * @param {string} playerName 
     * @param {number} qty
     * @param {number} [tickDelay=1]  
     */
    static add (scoreboardName, playerName, qty = 0, tickDelay = 1) {
        return ScoreboardLib.do(scoreboardName, playerName, 'add', qty, tickDelay);
    }
    //===================================================================
    /**
     * 
     * @param {string} scoreboardName 
     * @param {string} playerName 
     * @param {number} qty 
     * @param {number} [tickDelay=1] 
     */
    static sub (scoreboardName, playerName, qty = 0, tickDelay = 1) {
        return ScoreboardLib.do(scoreboardName, playerName, 'remove', qty, tickDelay);
    }
    //===================================================================
    /**
     * 
     * @param {string} scoreboardName 
     * @param {string} playerName 
     * @param {number} qty 
     */
    static set (scoreboardName, playerName, qty = 0, tickDelay = 1) {
        return ScoreboardLib.do(scoreboardName, playerName, 'set', qty, tickDelay);
    }
    //===================================================================
    /**
     * 
     * @param {string} scoreboardName 
     * @param {string} playerName 
     * @param {number} [tickDelay=1] 
     */
    static reset (scoreboardName, playerName, tickDelay = 1) {
        const sb = world.scoreboard.getObjective(scoreboardName);
        if (!sb || !playerName) return false;
        if (!sb.hasParticipant(playerName)) return;

        system.runTimeout(() => { sb.removeParticipant(playerName); }, tickDelay);
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
    /**
     * 
     * @param {string} scoreboardName
     */
    //===================================================================
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
        world.scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.Sidebar, { objective: sb });
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
        return true;
    }
    //===================================================================
    /**
     * 
     * @param {string} scoreboardName 
     * @param {string} playerName 
     * @param {number} addAmount 
     * @param {number} tickInterval 
     * @returns 
     */
    static tickCounterStart (scoreboardName, playerName, addAmount = 1, tickInterval = 1) {
        if (!scoreboardName || !playerName) return 0;
        ScoreboardLib.create(scoreboardName);
        
        let job=0;
        system.runTimeout(() => {

            const sb = world.scoreboard.getObjective(scoreboardName);
            if (sb) {
                job = system.runInterval(() => {
                    sb.addScore(playerName, addAmount);
                }, tickInterval);                
            }
        }, 0);
        // const cmd = `scoreboard players add  ${playerName}  ${scoreboardName} ${addAmount}`;
        return job;
    }
}