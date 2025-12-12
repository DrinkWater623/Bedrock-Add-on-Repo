// scoreboardLib.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T
URL: https://github.com/DrinkWater623
========================================================================
Change Log:
    20251027 - add for display to list
    20251028 - fix .create
    20251030 - refactor everything and move timers to own file
    20251207 - converted DebugScoreboards for general use and added to this file
========================================================================*/
import { Entity, system, world, DisplaySlotId, ScoreboardObjective, ScoreboardIdentity, ScoreboardIdentityType } from '@minecraft/server';
import { Ticks } from "../../common-data/globalConstantsLib.js";
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
/** ---------------------------------------------------------------------------
 * Types 
 * ------------------------------------------------------------------------- */
/** Bases a job should run against:
 *  - "*"  → one timer per known base
 *  - string[] → one timer per listed base
 */
/** @typedef {"*" | string[]} JobBases */

/** A registered interval job descriptor. */
/** @typedef {{ 
 * on: boolean,
 * id: string, 
 * bases: JobBases, 
 * fn: () => void, 
 * interval: number }} IntervalJob */

/** ---------------------------------------------------------------------------
 * Small utilities
 * ------------------------------------------------------------------------- */

/**
 * Convert `snake_case` or `with_underscores` to Title Case.
 * @param {string} s
 * @returns {string}
 */
const toTitle = (s) =>
    s.replace(/_/g, " ")
        .split(" ")
        .filter(Boolean)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

/**
 * Clamp to a non-negative integer number of ticks.
 * @param {number} n
 * @returns {number}
 */
const ticks = (n) => Math.max(0, Math.floor(n ?? 0));

/** ---------------------------------------------------------------------------
* Class - Container for Project/Add-on Scoreboards and interval jobs related to SB
 * ------------------------------------------------------------------------- */
export class Scoreboards {
    /**
     * @param {boolean} startOn        - initial debug flag
     * @param {string} namePfx         - scoreboard name prefix (e.g., "dw623:tree_spider")
     * @param {string} [displayPfx]    - optional display prefix; if omitted it’s derived from `namePfx`
     */
    constructor(startOn, namePfx, displayPfx) {
    /** @public */ this.scoreboardsOn = !!startOn;
    /** @public */ this.namePfx = namePfx;

        if (displayPfx) {
      /** @public */ this.displayPfx = displayPfx;
        } else {
            const base = namePfx.includes(":") ? namePfx.split(":")[ 1 ] : namePfx;
      /** @public */ this.displayPfx = `§a${toTitle(base)}§6§l`;
        }

    /** @type {Map<string, ScoreboardObjective>} */ this._sbByBase = new Map();     // base(lc) → objective
    /** @type {Map<string, string>}            */ this._sbNameByBase = new Map();    // base(lc) → canonical name
    /** @type {Map<string, string>}            */ this._entryMap = new Map();        // entryKey → pretty label
    /** @type {string[]}                       */ this._bases = [];                  // ordered bases as provided

    /** @type {Map<string, IntervalJob>}       */ this._jobs = new Map();            // jobId → job
    /** @type {Map<string, number[]>}          */ this._runIdsByJobId = new Map();   // jobId → active runInterval ids

    /** Built-in time counter job config */
    /** @public */ this.timeCounterLabel = "§vMinutes";
    /** @public */ this.timeCounterIntervalTicks = Ticks.perMinute; // 1 minute default
    /** @private */ this._timeJobId = "__time__";
    }

    /* ─────────────────────────── Lifecycle / config ───────────────────────── */

    /**
     * Toggle debug. When set to false, all counters stop and any shown UI is hidden.
     * @param {boolean} on
     * @returns {void}
     */
    setScoreboardsOn (on) {
        const wasOn = this.scoreboardsOn;
        this.scoreboardsOn = !!on;
        if (wasOn && !this.scoreboardsOn) {
            this.countersOff();
            this.hide();
        }
    }

    /**
     * Create (or recreate) scoreboards for bases and optionally install entry labels.
     * Safe to call multiple times.
     * @param {{ bases: string[], entries?: Record<string,string>, reCreate?: boolean }} cfg
     * @returns {void}
     */
    setup (cfg) {
        if (!cfg?.bases?.length) return;
        this._bases = cfg.bases.slice();
        for (const b of this._bases) this.getScoreboard(b, !!cfg.reCreate);
        if (cfg.entries) this.addEntries(cfg.entries);
    }

    /**
     * Add or overwrite multiple entry labels.
     * @param {Record<string, string>} map
     * @returns {void}
     */
    addEntries (map) {
        for (const [ k, v ] of Object.entries(map)) this._entryMap.set(k, v);
    }

    /**
     * Add or overwrite a single entry label.
     * @param {string} entryKey
     * @param {string} label
     * @returns {void}
     */
    setEntry (entryKey, label) { this._entryMap.set(entryKey, label); }

    /**
     * Add a new base and ensure its scoreboard exists immediately.
     * @param {string} baseName
     * @param {boolean} [reCreate=false]
     * @returns {ScoreboardObjective}
     */
    addBase (baseName, reCreate = false) {
        if (!this._bases.includes(baseName)) this._bases.push(baseName);
        return this.getScoreboard(baseName, reCreate);
    }

    /**
     * Get a copy of the current base list.
     * @returns {string[]}
     */
    bases () { return this._bases.slice(); }

    /* ───────────────────────────── Scoreboards ────────────────────────────── */

    /**
     * Ensure a scoreboard for `baseName` exists and return it.
     * If it doesn’t exist (or `reCreate` is true), it will be (re)created.
     * @param {string} baseName
     * @param {boolean} [reCreate=false]
     * @returns {ScoreboardObjective}
     */
    getScoreboard (baseName, reCreate = false) {
        const key = String(baseName).toLowerCase();
        const existing = this._sbByBase.get(key);
        if (existing && existing.isValid && !reCreate) return existing;

        const name = `${this.namePfx}_${key}`;
        const display = `${this.displayPfx} ${baseName}`;
        const sb = ScoreboardLib.create(name, display, reCreate);

        this._sbByBase.set(key, sb);
        this._sbNameByBase.set(key, name);
        return sb;
    }

    /**
     * Get the canonical scoreboard name for a base. Ensures the scoreboard exists.
     * @param {string} baseName
     * @returns {string}
     */
    getScoreboardName (baseName) {
        const key = String(baseName).toLowerCase();
        this.getScoreboard(baseName);
        return /** @type {string} */ (this._sbNameByBase.get(key));
    }

    /* ─────────────────────── Increments / entry labels ────────────────────── */

    /**
     * Resolve an entry key to a label. Falls back to the literal key.
     * @param {string} entryKey
     * @returns {string}
     */
    _label (entryKey) { return this._entryMap.get(entryKey) ?? String(entryKey); }

    /**
     * Increment an entry on the scoreboard for `baseName`.
     * The scoreboard is auto-created if missing.
     * @param {string} baseName
     * @param {string} entryKey
     * @param {number} [by=1]
     * @param {number} [tickDelay=0]
     * @returns {boolean}
     */
    increment (baseName, entryKey, by = 1, tickDelay = 0) {
        if (!this.scoreboardsOn) return false;
        const sb = this.getScoreboard(baseName);
        const label = this._label(entryKey);
        const run = () => { if (sb.isValid) sb.addScore(label, by); };
        const d = ticks(tickDelay);
        d > -1 ? system.runTimeout(run, d) : run();
        return true;
    }

    /**
     * Increment the same entry across multiple bases.
     * @param {string[]} baseNames
     * @param {string} entryKey
     * @param {number} [by=1]
     * @param {number} [tickDelay=0]
     * @returns {boolean} true if at least one increment happened
     */
    incrementMany (baseNames, entryKey, by = 1, tickDelay = 0) {
        let ok = false;
        for (const b of baseNames) { ok = this.increment(b, entryKey, by, tickDelay) || ok; }
        return ok;
    }

    /**
     * Increment an entry on the scoreboard for `baseName`.
     * The scoreboard is auto-created if missing.
     * @param {string} baseName
     * @param {string} entryKey
     * @param {number} [to=1]
     * @param {number} [tickDelay=0]
     * @returns {boolean}
     */
    set (baseName, entryKey, to = 1, tickDelay = 0) {
        if (!this.scoreboardsOn) return false;
        const sb = this.getScoreboard(baseName);
        const label = this._label(entryKey);
        const run = () => { if (sb.isValid) sb.setScore(label, to); };
        const d = ticks(tickDelay);
        d > 0 ? system.runTimeout(run, d) : run();
        return true;
    }
    //add setMany if ever needed
    /* ────────────────────────── Interval job system ───────────────────────── */

    /**
     * Register or update a generic interval job.
     * Jobs run only while `countersOn()` is in effect.
     * If a job with the same id exists, it is replaced; any running timers
     * for that id are cleared before the new ones start.
     * @param {string} jobId
     * @param {() => void} fn
     * @param {number} intervalTicks
     * @param {JobBases} [bases="*"] - "*" to run once per known base, or a list of specific bases
     * @returns {void}
     */
    registerIntervalJob (jobId, fn, intervalTicks, bases = "*") {
        const job = /** @type {IntervalJob} */ ({
            id: jobId,
            bases,
            fn,
            interval: ticks(intervalTicks),
        });
        this._jobs.set(jobId, job);
        // If jobs are running already, restart this one now.
        if (this._isAnyJobRunning()) this._restartJob(jobId);
    }

    /**
     * Unregister a job and stop its timers (if any).
     * @param {string} jobId
     * @returns {void}
     */
    unregisterIntervalJob (jobId) {
        this._stopJob(jobId);
        this._jobs.delete(jobId);
    }

    /**
     * Enable or disable the built-in time counter job.
     * When enabled, every interval it increments `timeCounterLabel` across all bases.
     * @param {boolean} enable
     * @returns {void}
     */
    enableTimeCounter (enable) {
        if (enable) {
            this.registerIntervalJob(this._timeJobId, () => {
                this.incrementMany(this._bases, this.timeCounterLabel, 1);
            }, this.timeCounterIntervalTicks, [ this._bases[ 0 ] ]);
        } else {
            this.unregisterIntervalJob(this._timeJobId);
        }
    }

    /**
     * Start all registered jobs (including the time counter if enabled).
     * Safe to call multiple times; running jobs won’t duplicate.
     * @returns {void}
     */
    countersOn () {
        if (!this.scoreboardsOn) return;
        for (const jobId of this._jobs.keys()) this._restartJob(jobId);
    }

    /**
     * Stop all running jobs (time + custom).
     * @returns {void}
     */
    countersOff () {
        for (const [ jobId, ids ] of this._runIdsByJobId.entries()) {
            for (const id of ids) system.clearRun(id);
            this._runIdsByJobId.set(jobId, []);
        }
    }

    /**
     * @private
     * @returns {boolean} true if any job currently has active runInterval ids
     */
    _isAnyJobRunning () {
        for (const arr of this._runIdsByJobId.values()) if (arr.length) return true;
        return false;
    }

    /**
     * @private
     * Stop timers for a single job id.
     * @param {string} jobId
     * @returns {void}
     */
    _stopJob (jobId) {
        const ids = this._runIdsByJobId.get(jobId);
        if (ids && ids.length) {
            for (const id of ids) system.clearRun(id);
            ids.length = 0;
        }
    }

    /**
     * @private
     * (Re)start one job’s timers immediately if debugging is on.
     * @param {string} jobId
     * @returns {void}
     */
    _restartJob (jobId) {
        // stop existing timers for this job
        this._stopJob(jobId);
        if (!this.scoreboardsOn) return;

        const job = this._jobs.get(jobId);
        if (!job || job.interval <= 0) return;

        /** @type {number[]} */
        const runIds = [];

        /**
         * Start one interval timer for a base (used for "*" and for explicit lists).
         * @param {string} _base
         * @returns {number}
         */
        const start = (_base) => system.runInterval(() => {
            if (!this.scoreboardsOn) return;
            job.fn();
        }, job.interval);

        if (job.bases === "*") {
            for (const base of this._bases) runIds.push(start(base));
        } else {
            for (const base of job.bases) runIds.push(start(base));
        }
        this._runIdsByJobId.set(jobId, runIds);
    }

    /* ─────────────────────────────── Visibility ───────────────────────────── */

    /**
     * Show a scoreboard in the sidebar. Accepts:
     *  - a base name (e.g., "Stats")
     *  - a canonical scoreboard name
     *  - a ScoreboardObjective instance
     * @param {string | ScoreboardObjective} sbOrBase
     * @param {number} [tickDelay=0]
     * @returns {void}
     */
    show (sbOrBase, tickDelay = 0) {
        if (!this.scoreboardsOn) return;
        const d = ticks(tickDelay);

        /** @type {string | ScoreboardObjective} */
        let target = sbOrBase;
        if (typeof sbOrBase === "string") {
            const key = sbOrBase.toLowerCase();
            target = this._sbByBase.get(key) ?? sbOrBase; // base → obj, else treat as canonical name
        }
        ScoreboardLib.sideBar_set(target, d);
    }

    /**
     * Clear sidebar/list if any of our scoreboards is showing.
     * @param {number} [tickDelay=0]
     * @returns {void}
     */
    hide (tickDelay = 0) {
        const ids = new Set(this._bases.map(b => this.getScoreboardName(b)));
        const side = ScoreboardLib.sideBar_query();
        const list = ScoreboardLib.list_query();
        const d = ticks(tickDelay);
        if (side?.isValid && ids.has(side.id)) ScoreboardLib.sideBar_clear(d);
        if (list?.isValid && ids.has(list.id)) ScoreboardLib.list_clear(d);
    }

    /* ─────────────────────────────── Utilities ─────────────────────────────── */

    /**
     * Set all scores to zero on provided bases (or on all known bases if omitted).
     * @param {string[]} [bases]
     * @returns {void}
     */
    zero (bases) {
        const targets = bases?.length ? bases : this._bases;
        for (const b of targets) {
            const sb = this.getScoreboard(b);
            if (sb?.isValid) ScoreboardLib.setZeroAll(sb);
        }
    }

    /**
     * (Re)create one or more bases’ scoreboards.
     * @param {{ bases?: string[], reCreate?: boolean }} [cfg]
     * @returns {void}
     */
    reset (cfg) {
        const targets = cfg?.bases?.length ? cfg.bases : this._bases;
        for (const b of targets) this.getScoreboard(b, !!cfg?.reCreate);
    }
}
//===================================================================
//End of File
