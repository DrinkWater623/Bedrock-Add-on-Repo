// scoreboardClass.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Change Log:
    20251027 - add for display to list
    20251028 - fix .create
    20251030 - refactor everything and move timers to own file
========================================================================*/
import { Entity, system, world, DisplaySlotId, ScoreboardObjective, ScoreboardIdentity, ScoreboardIdentityType } from '@minecraft/server';
//===================================================================
/** Type guard: has an isValid:boolean 
 * @param {*} x
 * @returns {boolean}
*/
function hasIsValid (x) {
    return !!x && typeof x === "object"
        && "isValid" in x
        && typeof /** @type {any} */(x).isValid === "boolean";
}
//===================================================================
/**
     * @param {ScoreboardObjective} scoreboard
     * @param {ScoreboardIdentity[]} participants 
     * @param {number} [qty = 0]  
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
function addToParticipants (scoreboard, participants, qty = 0, tickDelay = 0) {
    if (!scoreboard || !scoreboard.isValid) return false;

    if (participants.length) {
        system.runTimeout(() => {
            if (scoreboard.isValid) {
                participants.forEach(p => {
                    if (p.isValid) scoreboard.addScore(p, qty);
                });
            }
        }, tickDelay);
    }

    return true;
}
//===================================================================
/**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {ScoreboardIdentityType} type
     * @param {number} [qty = 0]
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
function addToPerScoreboardIdentityType (scoreboard, type, qty = 0, tickDelay = 0) {
    const sb = ScoreboardLib.getScoreboard(scoreboard);
    if (!sb || !sb.isValid) return false;
    const participants = sb.getParticipants().filter(p => p.type === type);
    return addToParticipants(sb, participants, qty, tickDelay);
}
//===================================================================
/**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {ScoreboardIdentity[]} participants 
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
function removeParticipants (scoreboard, participants, tickDelay = 0) {
    const sb = ScoreboardLib.getScoreboard(scoreboard);
    if (!sb || !sb.isValid) return false;

    if (participants.length) {
        system.runTimeout(() => {
            if (sb.isValid) {
                participants.forEach(p => {
                    if (p.isValid) sb.removeParticipant(p);
                });
            }
        }, tickDelay);
    }

    return true;
}
//===================================================================
/**
    * @param {string | ScoreboardObjective} scoreboard
    *  @param {ScoreboardIdentityType} type
    * @param {number} [tickDelay = 0]  
    * @returns {boolean}
    */
function removePerScoreboardIdentityType (scoreboard, type, tickDelay) {
    const sb = ScoreboardLib.getScoreboard(scoreboard);
    if (!sb) return false;
    const participants = sb.getParticipants().filter(p => p.type === type);
    return removeParticipants(sb, participants, tickDelay);
}
//===================================================================
/**
     * @param {ScoreboardObjective} scoreboard
     * @param {ScoreboardIdentity[]} participants 
     * @param {number} [qty = 0]  
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
function setParticipants (scoreboard, participants, qty = 0, tickDelay = 0) {
    if (!scoreboard || !scoreboard.isValid) return false;

    if (participants.length) {
        system.runTimeout(() => {
            if (scoreboard.isValid) {
                participants.forEach(p => {
                    if (p.isValid) scoreboard.setScore(p, qty);
                });
            }
        }, tickDelay);
    }

    return true;
}
//===================================================================
/**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {ScoreboardIdentityType} type
     * @param {number} [qty = 0]
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
function setPerScoreboardIdentityType (scoreboard, type, qty = 0, tickDelay = 0) {
    const sb = ScoreboardLib.getScoreboard(scoreboard);
    if (!sb || !sb.isValid) return false;
    const participants = sb.getParticipants().filter(p => p.type === type);
    return setParticipants(sb, participants, qty, tickDelay);
}
//===================================================================
/**
     * @param {ScoreboardObjective} scoreboard
     * @param {ScoreboardIdentity[]} participants 
     * @param {number} [qty = 0]  
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
function subFromParticipants (scoreboard, participants, qty = 0, tickDelay = 0) {
    const negQty = 0 - qty;
    return addToParticipants(scoreboard, participants, negQty, tickDelay);
}
//===================================================================
/**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {ScoreboardIdentityType} type
     * @param {number} [qty = 0]
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
function subFromPerScoreboardIdentityType (scoreboard, type, qty = 0, tickDelay = 0) {
    const sb = ScoreboardLib.getScoreboard(scoreboard);
    if (!sb || !sb.isValid) return false;
    const participants = sb.getParticipants().filter(p => p.type === type);
    return subFromParticipants(sb, participants, qty, tickDelay);
}
//===================================================================
/**
    * @param {string | ScoreboardObjective} scoreboard
    * @param {DisplaySlotId} typeId
    * @param {number} [tickDelay = 0]  
    * @returns {boolean}
    */
function displayAtDisplayLotId (scoreboard, typeId, tickDelay = 0) {
    const sb = ScoreboardLib.getScoreboard(scoreboard);
    if (!sb || !sb.isValid) return false;

    system.runTimeout(() => {
        if (sb.isValid)
            world.scoreboard.setObjectiveAtDisplaySlot(typeId, { objective: sb });
    }, tickDelay);

    return true;
}
/**
     * @param {DisplaySlotId} typeId
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
function unDisplayAtDisplayLotId (typeId, tickDelay = 0) {
    const { scoreboard } = world;
    system.runTimeout(() => {
        if (scoreboard.getObjectiveAtDisplaySlot(typeId))
            scoreboard.clearObjectiveAtDisplaySlot(typeId);
    }, tickDelay);

    return true;
}
/**
     * @param {DisplaySlotId} typeId
     * @returns {ScoreboardObjective | undefined}
     */
function queryDisplayLotId (typeId) {
    return world.scoreboard.getObjectiveAtDisplaySlot(typeId)?.objective
}
//===================================================================
export class ScoreboardLib {

    //===================================================================
    /** FIXME:  verify if can use tickDelay or not - this should have a wrapper
     * Cannot do tick delay here because it is returning a ScoreboardObjective
     * Has to be called with sys run
     * @param {string} scoreboardName 
     * @param {string} displayName
     * @param {boolean} [overWrite=false] 
     * @returns {ScoreboardObjective} 
     */
    static create (scoreboardName, displayName = '', overWrite = false) {
        let sb = world.scoreboard.getObjective(scoreboardName);

        if (sb) {
            if (!overWrite && sb.isValid) return sb;
            world.scoreboard.removeObjective(sb);
        }

        sb = world.scoreboard.addObjective(scoreboardName, displayName || scoreboardName);
        return sb;
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
    static delete (scoreboard, tickDelay = 0) {
        const sb = ScoreboardLib.getScoreboard(scoreboard);
        if (!sb || !sb.isValid) return false;

        system.runTimeout(() => {
            if (sb.isValid) world.scoreboard.removeObjective(sb);
        }, tickDelay);

        return true;
    }    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard 
     * @returns {ScoreboardObjective | undefined}
     */
    static getScoreboard (scoreboard) {
        if (!scoreboard) return;

        if (scoreboard instanceof ScoreboardObjective)
            return scoreboard.isValid ? scoreboard : undefined;

        return world.scoreboard.getObjective(scoreboard);
    }
    //===================================================================
    //===================================================================    
    /**
     * 
     * @param {string | ScoreboardObjective} scoreboard 
     * @param {string | Entity | ScoreboardIdentity} entry 
     * @param {number} [qty = 0]
     * @param {number} [tickDelay = 0]
     * @returns {boolean}  
     */
    static add (scoreboard, entry, qty = 0, tickDelay = 0) {
        const sb = ScoreboardLib.getScoreboard(scoreboard);
        if (!sb || !sb.isValid) return false;

        system.runTimeout(() => {
            if (sb.isValid)
                sb.addScore(entry, qty);
        }, tickDelay);
        return true;
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {number} [qty = 0]
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
    static addToAll (scoreboard, qty = 0, tickDelay = 0) {
        const sb = ScoreboardLib.getScoreboard(scoreboard);
        if (!sb || !sb.isValid) return false;
        return addToParticipants(sb, sb.getParticipants(), qty, tickDelay);
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {number} [qty = 0]
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
    static addToAllEntities (scoreboard, qty = 0, tickDelay = 0) {
        return addToPerScoreboardIdentityType(scoreboard, ScoreboardIdentityType.Entity, qty, tickDelay);
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {number} [qty = 0]
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
    static addToAllFakePlayers (scoreboard, qty = 0, tickDelay = 0) {
        return addToPerScoreboardIdentityType(scoreboard, ScoreboardIdentityType.FakePlayer, qty, tickDelay);
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {number} [qty = 0]
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
    static addToAllPlayers (scoreboard, qty = 0, tickDelay = 0) {
        return addToPerScoreboardIdentityType(scoreboard, ScoreboardIdentityType.Player, qty, tickDelay);
    }
    //===================================================================
    //===================================================================    
    /**
     * 
     * @param {string | ScoreboardObjective} scoreboard 
     * @param {string | Entity | ScoreboardIdentity} entry 
     * @param {number} [tickDelay = 0]
     * @returns {boolean}  
     */
    static decrement (scoreboard, entry, tickDelay = 0) {
        return ScoreboardLib.add(scoreboard, entry, -1, tickDelay);
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
    static decrementAll (scoreboard, tickDelay = 0) {
        const sb = ScoreboardLib.getScoreboard(scoreboard);
        if (!sb || !sb.isValid) return false;
        return addToParticipants(sb, sb.getParticipants(), -1, tickDelay);
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
    static decrementAllEntities (scoreboard, tickDelay = 0) {
        return addToPerScoreboardIdentityType(scoreboard, ScoreboardIdentityType.Entity, -1, tickDelay);
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
    static decrementAllFakePlayers (scoreboard, tickDelay = 0) {
        return addToPerScoreboardIdentityType(scoreboard, ScoreboardIdentityType.FakePlayer, -1, tickDelay);
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
    static decrementAllPlayers (scoreboard, qty = 0, tickDelay = 0) {
        return addToPerScoreboardIdentityType(scoreboard, ScoreboardIdentityType.Player, -1, tickDelay);
    }
    //===================================================================
    //===================================================================    
    /**
     * 
     * @param {string | ScoreboardObjective} scoreboard 
     * @param {string | Entity | ScoreboardIdentity} entry 
     * @param {number} [tickDelay = 0]
     * @returns {boolean}  
     */
    static increment (scoreboard, entry, tickDelay = 0) {
        return ScoreboardLib.add(scoreboard, entry, 1, tickDelay);
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
    static incrementAll (scoreboard, tickDelay = 0) {
        const sb = ScoreboardLib.getScoreboard(scoreboard);
        if (!sb || !sb.isValid) return false;
        return addToParticipants(sb, sb.getParticipants(), 1, tickDelay);
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
    static incrementAllEntities (scoreboard, tickDelay = 0) {
        return addToPerScoreboardIdentityType(scoreboard, ScoreboardIdentityType.Entity, 1, tickDelay);
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
    static incrementAllFakePlayers (scoreboard, tickDelay = 0) {
        return addToPerScoreboardIdentityType(scoreboard, ScoreboardIdentityType.FakePlayer, 1, tickDelay);
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
    static incrementAllPlayers (scoreboard, qty = 0, tickDelay = 0) {
        return addToPerScoreboardIdentityType(scoreboard, ScoreboardIdentityType.Player, 1, tickDelay);
    }
    //===================================================================
    //===================================================================
    /**
     * 
     * @param {string | ScoreboardObjective} scoreboard 
     * @param {string | Entity | ScoreboardIdentity} entry 
     * @param {number} [tickDelay = 0] 
     * @returns {boolean}
     */
    static reset (scoreboard, entry, tickDelay = 0) {
        const sb = ScoreboardLib.getScoreboard(scoreboard);
        if (!sb || !entry) return false;
        if (!sb.hasParticipant(entry)) return false;

        system.runTimeout(() => {
            const ok =
                sb.isValid &&
                (
                    typeof entry === "string" ||
                    (hasIsValid(entry) && entry.isValid)
                );

            if (ok) sb.removeParticipant(entry);
        }, tickDelay);

        return true;
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
    static resetAll (scoreboard, tickDelay = 0) {
        const sb = ScoreboardLib.getScoreboard(scoreboard);
        if (!sb) return false;
        return removeParticipants(sb, sb.getParticipants(), tickDelay);
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
    static resetAllPlayers (scoreboard, tickDelay) {
        return removePerScoreboardIdentityType(scoreboard, ScoreboardIdentityType.Player, tickDelay);
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
    static resetAllEntities (scoreboard, tickDelay) {
        return removePerScoreboardIdentityType(scoreboard, ScoreboardIdentityType.Entity, tickDelay);
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
    static resetAllFakePlayers (scoreboard, tickDelay) {
        return removePerScoreboardIdentityType(scoreboard, ScoreboardIdentityType.FakePlayer, tickDelay);
    }
    //===================================================================
    //===================================================================
    /**
      * 
      * @param {string | ScoreboardObjective} scoreboard 
      * @param {string | Entity | ScoreboardIdentity} entry 
      * @param {number} [qty = 0]
      * @param {number} [tickDelay = 0]
      * @returns {boolean}  
      */
    static set (scoreboard, entry, qty = 0, tickDelay = 0) {
        const sb = ScoreboardLib.getScoreboard(scoreboard);
        if (!sb || sb.isValid) return false;

        system.runTimeout(() => {
            if (sb.isValid)
                sb.setScore(entry, qty);
        }, tickDelay);
        return true;
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {number} [qty = 0]
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
    static setAll (scoreboard, qty = 0, tickDelay = 0) {
        const sb = ScoreboardLib.getScoreboard(scoreboard);
        if (!sb) return false;
        return setParticipants(sb, sb.getParticipants(), qty, tickDelay);
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {number} [qty = 0]
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
    static setAllEntities (scoreboard, qty = 0, tickDelay = 0) {
        return setPerScoreboardIdentityType(scoreboard, ScoreboardIdentityType.Entity, qty, tickDelay);
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {number} [qty = 0]
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
    static setAllFakePlayers (scoreboard, qty = 0, tickDelay = 0) {
        return setPerScoreboardIdentityType(scoreboard, ScoreboardIdentityType.FakePlayer, qty, tickDelay);
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {number} [qty = 0]
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
    static setAllPlayers (scoreboard, qty = 0, tickDelay = 0) {
        return setPerScoreboardIdentityType(scoreboard, ScoreboardIdentityType.Player, qty, tickDelay);
    }
    //===================================================================
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
    static setZeroAll (scoreboard, tickDelay = 0) {
        return ScoreboardLib.setAll(scoreboard, 0, tickDelay);
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
    static setZeroAllEntities (scoreboard, tickDelay = 0) {
        return setPerScoreboardIdentityType(scoreboard, ScoreboardIdentityType.Entity, 0, tickDelay);
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
    static setZeroAllFakePlayers (scoreboard, tickDelay = 0) {
        return setPerScoreboardIdentityType(scoreboard, ScoreboardIdentityType.FakePlayer, 0, tickDelay);
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
    static setZeroAllPlayers (scoreboard, tickDelay = 0) {
        return setPerScoreboardIdentityType(scoreboard, ScoreboardIdentityType.Player, 0, tickDelay);
    }
    //===================================================================
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard 
     * @param {string | Entity | ScoreboardIdentity} entry 
     * @param {number} [qty = 0]
     * @param {number} [tickDelay = 0]
     * @returns {boolean}  
     */
    static sub (scoreboard, entry, qty = 0, tickDelay = 0) {
        return ScoreboardLib.add(scoreboard, entry, 0 - qty, tickDelay);
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {number} [qty = 0]
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
    static subFromAll (scoreboard, qty = 0, tickDelay = 0) {
        return ScoreboardLib.addToAll(scoreboard, 0 - qty, tickDelay);
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {number} [qty = 0]
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
    static subFromAllEntities (scoreboard, qty = 0, tickDelay = 0) {
        return addToPerScoreboardIdentityType(scoreboard, ScoreboardIdentityType.Entity, 0 - qty, tickDelay);
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {number} [qty = 0]
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
    static subFromAllFakePlayers (scoreboard, qty = 0, tickDelay = 0) {
        return addToPerScoreboardIdentityType(scoreboard, ScoreboardIdentityType.FakePlayer, 0 - qty, tickDelay);
    }
    //===================================================================
    /**
     * @param {string | ScoreboardObjective} scoreboard
     * @param {number} [qty = 0]
     * @param {number} [tickDelay = 0]  
     * @returns {boolean}
     */
    static subFromAllPlayers (scoreboard, qty = 0, tickDelay = 0) {
        return addToPerScoreboardIdentityType(scoreboard, ScoreboardIdentityType.Player, 0 - qty, tickDelay);
    }
    //===================================================================
    //===================================================================
    //===================================================================
    /**
    * @param {string | ScoreboardObjective} scoreboard
    * @param {number} [tickDelay = 0]  
    * @returns {boolean}
    */
    static belowName_set (scoreboard, tickDelay = 0) {
        return displayAtDisplayLotId(scoreboard, DisplaySlotId.BelowName, tickDelay);
    }
    /**
    * @param {number} [tickDelay = 0]  
    * @returns {boolean}
    */
    static belowName_clear (tickDelay = 0) {
        return unDisplayAtDisplayLotId(DisplaySlotId.BelowName, tickDelay);
    }
    //===================================================================
    /**
    * @param {number} [tickDelay = 0]  
    * @returns {boolean}
    */
    static list_clear (tickDelay = 0) {
        return unDisplayAtDisplayLotId(DisplaySlotId.List, tickDelay);
    }
    /**
    * @param {string | ScoreboardObjective} scoreboard
    * @param {number} [tickDelay = 0]  
    * @returns {boolean}
    */
    static list_set (scoreboard, tickDelay = 0) {
        return displayAtDisplayLotId(scoreboard, DisplaySlotId.List, tickDelay);
    }
    /**
    * @returns {ScoreboardObjective | undefined}
    */
    static list_query () {
        return queryDisplayLotId(DisplaySlotId.List);
    }
    //===================================================================
    /**
    * @param {number} [tickDelay = 0]  
    * @returns {boolean}
    */
    static sideBar_clear (tickDelay = 0) {
        return unDisplayAtDisplayLotId(DisplaySlotId.Sidebar, tickDelay);
    }
    /**
    * @param {string | ScoreboardObjective} scoreboard
    * @param {number} [tickDelay = 0]  
    * @returns {boolean}
    */
    static sideBar_set (scoreboard, tickDelay = 0) {
        return displayAtDisplayLotId(scoreboard, DisplaySlotId.Sidebar, tickDelay);
    }
    /**
    * @returns {ScoreboardObjective | undefined}
    */
    static sideBar_query () {
        return queryDisplayLotId(DisplaySlotId.Sidebar);
    }
}
//===================================================================
//End of File
