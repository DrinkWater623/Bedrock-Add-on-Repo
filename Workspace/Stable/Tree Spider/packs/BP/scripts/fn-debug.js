// fn-debug.js
//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20251023 - Sep out debug stuff
========================================================================*/
import { ScoreboardObjective, system, TicksPerSecond, world, DisplaySlotId } from "@minecraft/server";
import { alertLog, chatLog, pack, watchFor } from './settings.js';
import { ScoreboardLib } from "./common-stable/scoreboardClass.js";
import { ScoreboardTimers } from "./common-stable/timers.js";
import { EntityLib } from "./common-stable/entityClass.js";
import { Ticks } from "./common-data/globalConstantsLib.js";
//==============================================================================
// JSDoc Makes the squiggly red lines go away....
//==============================================================================

//==============================================================================
/** Core shape without index signature. */
//==============================================================================
/** @typedef {{
  * base: string;
  * name: string;
  * display: string;
  * sbId: ScoreboardObjective;
  * }} sbListObject */;

/** @typedef {{
 *  debug: boolean;
 *  debugEntityActivity: boolean;
 *  debugEntityAlert: boolean;
 *  debugPackLoad: boolean;
 *  debugSubscriptions: boolean;
 *  debugScoreboardBaseName: string,
 *  debugScoreboardBaseDisplay: string,
 *  debugTimers: 'mh' | 'smh';
 *  debugTimeCountersRunId: number;
 *  allOff(this: Dev): void;
 *  allOn(this: Dev): void;
 *  anyOn(this: Dev): void;
 * }} DevObject */;

/** @typedef {{
 * sbEntitiesScoreboard: ScoreboardObjective | undefined;
 * sbEntitiesName: string
 * sbStatsScoreboard: ScoreboardObjective | undefined;
 * sbStatsName: string;
 * ScoreboardList: sbListObject[]; 
 * adultSpiders: string;
 * babySpiders: string;
 * eggsInWebs: string;
 * born:string;
 * spawned:string; 
 * loaded:string; 
 * growUp:string; 
 * died: string;
 * removed: string;
 * stalled:string;
 * stalledNamed:string; 
 * newWeb:string;
 * expandWeb:string;
 * enterWeb: string;
 * layEgg:string;
 * timeCountersOn: boolean;
 * timers: string;
 * timeCountersRunId: number; 
 * entityCountersRunId: number; 
 * createAllScoreboardObjectives(this: DebugScoreboards, reCreate: boolean): void;
 * countersOff(this: DebugScoreboards): void;
 * countersOn(this: DebugScoreboards): void;
 * ifNoReasonForScoreBoardToShow(this: DebugScoreboards): void; 
 * resetAll(this: DebugScoreboards): void; 
 * show(this:DebugScoreboards): void;
 * showReverse(this:DebugScoreboards): void;
 * unShow(this:DebugScoreboards): void;
 * zeroAll(this: DebugScoreboards): void;
 * }} DebugScoreboardsObject */;

//==============================================================================
/** Allow bracket indexing like dev[key]. */
//==============================================================================
/** @typedef {DevObject & Record<string, unknown>} Dev */
/** @typedef {DebugScoreboardsObject & Record<string, unknown>} DebugScoreboards */
//==============================================================================
const debugFunctions = false;
//==============================================================================
export const dev =
/** @type {Dev} */ ({
        debug: true,
        // -- Debug areas of concern
        debugEntityActivity: true,
        debugEntityAlert: true,
        debugPackLoad: true,
        debugSubscriptions: true,
        // ---
        debugScoreboardBaseName: pack.fullNameSpace,
        debugScoreboardBaseDisplay: '§aTree Spider§6',
        // ---
        debugTimers: 'mh', // was smh, but don't need seconds
        debugTimeCountersRunId: 0,

        /** @this {Dev} */
        allOff () {
            alertLog.log("* function dev.allOff ()", debugFunctions);
            let noChange = true && !this.debug;

            for (const [ k, v ] of Object.entries(this)) {
                if (k.startsWith('debug') && typeof v === 'boolean') {
                    noChange = noChange && !v;
                    this[ k ] = /** @type {unknown} */ (false);
                }
            }

            this.debug = false;
            if (pack.worldLoaded && !noChange) debugVarChange();
        },

        /** @this {Dev} */
        allOn () {
            alertLog.log("* function dev.allOn ()", true);
            let noChange = true && this.debug;

            for (const [ k, v ] of Object.entries(this)) {
                if (k.startsWith('debug') && typeof v === 'boolean') {
                    noChange = noChange && v;
                    this[ k ] = /** @type {unknown} */ (true);
                }
            }
            this.debug = true;
            if (pack.worldLoaded && !noChange) debugVarChange();
        },

        /** @this {Dev} */
        anyOn () {
            alertLog.log("* function dev.anyOn ()", debugFunctions);

            let any = false;
            for (const [ k, v ] of Object.entries(this)) {
                if (k.startsWith('debug') && typeof v === 'boolean') {
                    any = any || v;
                }
            }
            this.debug = any;
        }
    });
//==============================================================================
export const debugScoreboards =
/** @type {DebugScoreboards} */ ({

        /** @type ScoreboardObjective | undefined; */
        sbEntitiesScoreboard: undefined,
        sbEntitiesName: '',

        sbStatsScoreboard: undefined,
        sbStatsName: '',

        /** @type sbListObject[] */
        ScoreboardList: [],

        //sb Stat Entries
        adultSpiders: "ctr: §aAdult spiders",
        babySpiders: "ctr: §bBaby spiders",
        eggsInWebs: "ctr: §gEggs in Webs",
        born: "Entity: §bBorn",
        spawned: "Entity: §aSpawned",
        loaded: "Entity: §2Loaded",
        growUp: "Entity: §2Puberty",
        died: 'Entity: §cDied',
        removed: 'Entity: §4Removed',
        stalled: 'Entity: §pStalled',
        stalledNamed: 'Entity Named: §vStalled',
        newWeb: 'Webs: §fNew',
        expandWeb: 'Webs: §3Expand',
        enterWeb: 'Webs: §dEntered',
        layEgg: 'Eggs: §gLaid',

        //sb Timers Jobs
        timeCountersOn: false,
        timers: 'mh', // was smh, but don't need seconds
        timeCountersRunId: 0,
        entityCountersRunId: 0,

        createAllScoreboardObjectives (reCreate = false) {
            alertLog.log(`* function debugScoreboards.createAllScoreboardObjectives (reCreate = ${reCreate})`, debugFunctions);

            if (reCreate) this.ScoreboardList = [];

            for (const [ k, v ] of Object.entries(this)) {

                if (k.startsWith('sb') && k.endsWith('Scoreboard') && (reCreate || typeof v === 'undefined')) {
                    const base = k.replace('sb', '').replace('Scoreboard', '');
                    const name = dev.debugScoreboardBaseName + '_' + base.toLowerCase();
                    const displayName = dev.debugScoreboardBaseDisplay + ' ' + base;
                    const sb = ScoreboardLib.create(name, displayName, reCreate);

                    this.ScoreboardList.push({
                        base: base,
                        name: name,
                        display: displayName,
                        sbId: sb
                    });

                    this[ k ] = sb;
                }
            }
        },
        countersOff () {
            alertLog.log("* debugScoreboards.countersOff ()", debugFunctions);

            //--- Timers and where
            if (this.timeCountersRunId) {
                system.clearRun(this.timeCountersRunId);
                this.timeCountersRunId = 0;
                alertLog.success("Scoreboard timers turned off", debugFunctions);
            }

            if (this.entityCountersRunId) {
                system.clearRun(this.entityCountersRunId);
                this.entityCountersRunId = 0;
                alertLog.success("Entity Counters turned off", debugFunctions);
            }
        },
        countersOn () {
            alertLog.log("* debugScoreboards.countersOn ()", debugFunctions);
            if (!dev.debug) return;
            if (!dev.debugEntityActivity) return;

            //--- Timers and where
            if (!this.timeCountersRunId) {
                this.timeCountersRunId = ScoreboardTimers.systemTimeCountersStart(debugScoreboards.sbStatsName, dev.debugTimers);
                alertLog.success("Scoreboard timers turned on", debugFunctions);
            }

            if (!this.entityCountersRunId) {
                system.runTimeout(() => {
                    this.entityCountersRunId = system.runInterval(() => { treeSpiderEntityCounts(); }, Ticks.perMinute / 6);
                }, TicksPerSecond * 6);
                alertLog.success("Entity Counters turned on", debugFunctions);
            }
        },
        ifNoReasonForScoreBoardToShow () {
            if (!dev.debug) this.unShow();
        },
        resetAll () {
            //TODO: Confirm
            alertLog.log("* function debugScoreboards.resetAll ()", debugFunctions);
            this.countersOff()
            this.createAllScoreboardObjectives(true)
            this.countersOn()
            this.show();
        },
        show (tickDelay = 0) {
            alertLog.log("* function debugScoreboards.show ()", debugFunctions);

            //if (this.sbStatsScoreboard?.isValid) world.scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.Sidebar, { objective: this.sbStatsScoreboard });
            //if (this.sbEntitiesScoreboard?.isValid) world.scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.List, { objective: this.sbEntitiesScoreboard });

            if (this.sbEntitiesScoreboard) ScoreboardLib.list_set(this.sbEntitiesScoreboard, tickDelay);
            if (this.sbStatsScoreboard) ScoreboardLib.sideBar_set(this.sbStatsScoreboard, tickDelay);
        },
        showReverse (tickDelay = 0) {
            alertLog.log("* function debugScoreboards.showReverse ()", debugFunctions);

            //if (this.sbEntitiesScoreboard?.isValid) world.scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.Sidebar, { objective: this.sbEntitiesScoreboard });
            //if (this.sbStatsScoreboard?.isValid) world.scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.List, { objective: this.sbStatsScoreboard });

            if (this.sbStatsScoreboard) ScoreboardLib.list_set(this.sbStatsScoreboard, tickDelay);
            if (this.sbEntitiesScoreboard) ScoreboardLib.sideBar_set(this.sbEntitiesScoreboard, tickDelay);
        },
        unShow (tickDelay = 0) {
            alertLog.log("* function debugScoreboards.unShow ()", debugFunctions);

            if (!this.sbEntitiesScoreboard || !this.sbStatsScoreboard) return;
            const side = ScoreboardLib.sidBar_query();
            const list = ScoreboardLib.list_query()

            if (side && side.isValid) {
                if ([ this.sbEntitiesName, this.sbStatsName].includes(side.id))
                    ScoreboardLib.sideBar_clear(tickDelay);
            }

            if (list && list.isValid) {
                if ([ this.sbEntitiesName, this.sbStatsName ].includes(list.id))
                    ScoreboardLib.list_clear(tickDelay);
            }
        },
        zeroAll () {
            alertLog.log("* function debugScoreboards.zeroAll ()", debugFunctions);

            this.ScoreboardList.forEach(sb => {
                ScoreboardLib.setZeroAll(sb.sbId);
                alertLog.success(`Zeroed Scoreboard ${sb.display}`, debugFunctions);
            });
        }        
    });

//==============================================================================
export function debugScoreboardSetups (resetAll = true) {
    alertLog.log("* function debugScoreboardSetups ()", debugFunctions);

    debugScoreboards.createAllScoreboardObjectives(resetAll);

    if (dev.debug) {
        debugScoreboards.countersOn();
        debugScoreboards.show();
    }
    else
        debugScoreboards.ifNoReasonForScoreBoardToShow();
}
//===================================================================
/**
 * 
 * @param {boolean} [override =false]
 */
function treeSpiderEntityCounts (override = false) {

    const eggCount = EntityLib.getAllEntities({ type: watchFor.egg_typeId }).length;
    if (eggCount) system.run(() => {
        debugScoreboards.sbStatsScoreboard?.setScore(debugScoreboards.eggsInWebs, eggCount);
    });

    const entities_all = EntityLib.getAllEntities({ type: watchFor.typeId });

    system.runTimeout(() => {
        const entities = entities_all.filter(e => { return e.isValid && !e.hasComponent('minecraft:is_baby'); });
        debugScoreboards.sbStatsScoreboard?.setScore(debugScoreboards.adultSpiders, entities.length);
        debugScoreboards.sbStatsScoreboard?.setScore(debugScoreboards.babySpiders, entities_all.length - entities.length);
    }, 1);

}
//==============================================================================
export function debugVarChange () {
    //Not knowing what the change is, so do not do too much
    alertLog.log("* function debugVarChange ()", debugFunctions);

    dev.anyOn();

    if (dev.debug) {
        if (debugScoreboards.ScoreboardList.length == 0) {
            debugScoreboardSetups();
        }
    }
    else {
        debugScoreboards.unShow();
        debugScoreboards.countersOff();
    }
}
//==============================================================================
// End of File
