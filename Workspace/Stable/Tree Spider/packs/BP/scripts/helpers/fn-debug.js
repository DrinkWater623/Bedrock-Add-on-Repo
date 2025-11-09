// fn-debug.js
//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20251108 
========================================================================*/
// Minecraft
import { ScoreboardObjective, system, TicksPerSecond } from "@minecraft/server";
// Shared
import { Ticks } from "../common-data/globalConstantsLib.js";
import { EntityLib } from "../common-stable/entityClass.js";
import { ScoreboardLib } from "../common-stable/scoreboardClass.js";
import { ScoreboardTimers } from "../common-stable/timers.js";
// Local
import { alertLog, chatLog, pack, watchFor } from '../settings.js';
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
 *  debugOn: boolean;
 *  debugSubscriptionsOn: boolean;
 *  debugFunctionsOn: boolean;
 *  watchEntityGoals: boolean;
 *  watchEntityEvents: boolean; 
 *  watchEntitySubscriptions: boolean; 
 *  watchEntityEating: boolean;   
 *  watchEntityIssues: boolean;   
 *  allOff(this: Dev): void;
 *  allOn(this: Dev): void;
 *  anyOn(this: Dev): void;
 * }} DevObject */;

/** @typedef {{
 * ScoreboardList: sbListObject[]; 
 * sbStatsScoreboard: ScoreboardObjective | undefined;
 * sbStatsName: string;
 * sbCtrsScoreboard: ScoreboardObjective | undefined;
 * sbCtrsName: string;
 * sbDeathsScoreboard: ScoreboardObjective | undefined;
 * sbDeathsName: string;
 * baseName:string
 * baseDisplay:string
 * timeCountersOn: boolean;
 * timers: string;
 * entityCountersRunId: number; 
 * timeCountersRunId: number; 
 * adultSpiders: string;
 * babySpiders: string;
 * eggsInWebs: string;
 * newFlies: string;
 * flies: string;
 * webs: string;
 * born:string;
 * spawned:string; 
 * loaded:string; 
 * growUp:string; 
 * died: string;
 * removed: string;
 * stalled:string; 
 * newWeb:string;
 * expandWeb:string;
 * enterWeb: string;
 * layEgg:string;
 * createAllScoreboardObjectives(this: DebugScoreboards, reCreate: boolean): void;
 * countersOff(this: DebugScoreboards): void;
 * countersOn(this: DebugScoreboards): void;
 * ifNoReasonForScoreBoardToShow(this: DebugScoreboards): void; 
 * reset(this: DebugScoreboards, all: boolean): void;
 * setup(this: DebugScoreboards):void;
 * showThisSB(this:DebugScoreboards,sb:ScoreboardObjective | string): void;
 * show(this:DebugScoreboards): void; 
 * unShow(this:DebugScoreboards): void;
 * zero(this: DebugScoreboards, all: boolean): void;
 * }} DebugScoreboardsObject */;

//==============================================================================
/** Allow bracket indexing like dev[key]. */
//==============================================================================
/** @typedef {DevObject & Record<string, unknown>} Dev */
/** @typedef {DebugScoreboardsObject & Record<string, unknown>} DebugScoreboards */
//==============================================================================
const debugFunctions = false;
//==============================================================================
export const devDebug =
/** @type {Dev} */ ({
        debugOn: true,
        // -- Debug areas of concern for messages, else scoreboards should have most info
        debugSubscriptionsOn: true,
        debugFunctionsOn: false,
        watchEntityGoals: false,
        watchEntityEvents: false,
        watchEntitySubscriptions: true,
        watchEntityEating: true,
        watchEntityIssues: true,

        /** @this {Dev} */
        allOff () {
            alertLog.log("* function dev.allOff ()", debugFunctions);
            let noChange = true && !this.debugOn;

            for (const [ k, v ] of Object.entries(this)) {
                if (typeof v === 'boolean') {
                    noChange = noChange && !v;
                    this[ k ] = /** @type {unknown} */ (false);
                }
            }

            this.debugOn = false;
            if (pack.worldLoaded && !noChange) debugVarChange();
        },

        /** @this {Dev} */
        allOn () {
            alertLog.log("* function dev.allOn ()", true);
            let noChange = true && this.debugOn;

            for (const [ k, v ] of Object.entries(this)) {
                if (typeof v === 'boolean') {
                    noChange = noChange && v;
                    this[ k ] = /** @type {unknown} */ (true);
                }
            }
            this.debugOn = true;
            if (pack.worldLoaded && !noChange) debugVarChange();
        },

        /** @this {Dev} */
        anyOn () {
            alertLog.log("* function dev.anyOn ()", debugFunctions);

            let any = false;
            for (const [ k, v ] of Object.entries(this)) {
                if (typeof v === 'boolean') {
                    any = any || v;
                }
            }
            this.debugOn = any;
        }
    });
//==============================================================================
export const debugScoreboards =
/** @type {DebugScoreboards} */ ({

        /** @type sbListObject[] */
        ScoreboardList: [],

        //scoreboards here
        /** @type ScoreboardObjective | undefined; */
        sbStatsScoreboard: undefined,
        sbStatsName: '',
        sbCtrsScoreboard: undefined,
        sbCtrsName: '',
        sbDeathsScoreboard: undefined,
        sbDeathsName: '',

        //To build the name and display-name of the scoreboards
        baseName: pack.fullNameSpace,
        baseDisplay: '§aTree Spider§6',

        //sb Timers Jobs
        timeCountersOn: false,
        timers: 'mh', // was smh, but don't need seconds
        entityCountersRunId: 0,
        timeCountersRunId: 0,

        //sb Stat Entries
        adultSpiders: "ctr: §aAdult spiders",
        babySpiders: "ctr: §bBaby spiders",
        eggsInWebs: "ctr: §gEggs in Webs",
        newFlies: "ety: §cNew Flies",
        flies: "ctr: §cFlies",
        webs: "ctr: §l§fWebs",

        born: "ety: §bBorn", //
        spawned: "ety: §aSpawned", //
        loaded: "ety: §2Loaded",
        growUp: "ety: §3Puberty",
        died: 'ety: §cDied',
        removed: 'ety: §6Removed', //
        stalled: 'ety: §tStalled',

        newWeb: 'webs: §5New',
        expandWeb: 'webs: §uExpand',
        enterWeb: 'webs: §9Entered',
        layEgg: 'eggs: §gLaid',

        createAllScoreboardObjectives (reCreate = false) {
            alertLog.log(`* function debugScoreboards.createAllScoreboardObjectives (reCreate = ${reCreate})`, debugFunctions);

            if (reCreate) this.ScoreboardList = [];

            for (const [ k, v ] of Object.entries(this)) {

                if (k.startsWith('sb') && k.endsWith('Scoreboard') && (reCreate || typeof v === 'undefined')) {
                    const base = k.replace('sb', '').replace('Scoreboard', '');
                    const name = this.baseName + '_' + base.toLowerCase();
                    const displayName = this.baseDisplay + ' ' + base;
                    const sb = ScoreboardLib.create(name, displayName, reCreate);

                    const data = {
                        varName: k.replace('Scoreboard', 'Name'),
                        base: base,
                        name: name,
                        display: displayName,
                        sbId: sb
                    };
                    this.ScoreboardList.push(data);
                    this[ data.varName ] = name;
                    this[ k ] = sb;

                    alertLog.log(`Created SB #${this.ScoreboardList.length}: ${data.varName} §b${sb.id}§r as ${sb.displayName}`, devDebug.debugFunctionsOn);
                }
            }
        },
        countersOff () {
            alertLog.log("* debugScoreboards.countersOff ()", debugFunctions);

            //--- Timers and where
            if (this.timeCountersRunId > 0) {
                system.clearRun(this.timeCountersRunId);
                this.timeCountersRunId = 0;
                alertLog.success("Scoreboard timers turned off", debugFunctions);
            }

            if (this.entityCountersRunId > 0) {
                system.clearRun(this.entityCountersRunId);
                this.entityCountersRunId = 0;
                alertLog.success("Entity Counters turned off", debugFunctions);
            }
        },
        countersOn () {
            alertLog.log("* debugScoreboards.countersOn ()", debugFunctions);
            if (!this.sbStatsScoreboard) return;

            //--- Timers and where
            system.runInterval(() => {
                if (this.sbStatsScoreboard) this.sbStatsScoreboard.addScore('§vMinutes', 1);
            }, Ticks.perMinute);

            //FIXME:
            /*if (this.timeCountersRunId == 0) {
                alertLog.warn("Trying Timer Job");
                this.timeCountersRunId = ScoreboardTimers.systemTimeCountersStart(this.sbStatsName, this.timers);
                if (this.timeCountersRunId) alertLog.success("Timer Job is there");
                if (!this.timeCountersRunId) alertLog.error("Timer Job is still 0");
                if (this.timeCountersRunId) alertLog.success("Scoreboard timers turned on", debugFunctions);
            }*/

            if (!this.entityCountersRunId) {
                system.runTimeout(() => {
                    this.entityCountersRunId = system.runInterval(() => { thisAddOn_EntityCounts(); }, Ticks.perMinute / 6);
                }, TicksPerSecond * 6);
                alertLog.success("Entity Counters turned on", debugFunctions);
            }
        },
        ifNoReasonForScoreBoardToShow () {
            if (!devDebug.debugOn) this.unShow();
        },
        reset (all = false) {
            //TODO: Confirm
            alertLog.log("* function debugScoreboards.resetAll ()", debugFunctions);
            if (all) {
                this.countersOff();
                this.createAllScoreboardObjectives(true);
                this.countersOn();
                this.show();
            }
            else {
                const side = ScoreboardLib.sidBar_query();

                this.ScoreboardList
                    .filter(f => {
                        if (all) return true;
                        if (!side || !side.isValid) return false;
                        return f.name === side.id;
                    })
                    .forEach(sb => {
                        ScoreboardLib.create(sb.name, sb.display, true);
                        alertLog.success(`Recreated Scoreboard ${sb.display}`, debugFunctions);
                    });
            }
        },
        setup (reCreate = false) {
            alertLog.log("* function debugScoreboards.setup ()", debugFunctions);

            this.createAllScoreboardObjectives(reCreate);

            if (devDebug.debugOn) {
                this.countersOn();
                this.showThisSB(this.sbStatsName);
            }
            else
                this.ifNoReasonForScoreBoardToShow();

        },
        /**
         * @param {string | ScoreboardObjective} sb 
         * @param {*} tickDelay 
         */
        showThisSB (sb, tickDelay = 0) {
            if (sb) ScoreboardLib.sideBar_set(sb, tickDelay);
        },
        show (tickDelay = 0) {
            if (this.sbStatsScoreboard) ScoreboardLib.sideBar_set(this.sbStatsScoreboard, tickDelay);
        },
        unShow (tickDelay = 0) {
            if (!this.sbCtrsScoreboard && !this.sbStatsScoreboard) return;
            const side = ScoreboardLib.sidBar_query();
            const list = ScoreboardLib.list_query();

            if (side && side.isValid) {
                if ([ this.sbEntitiesName, this.sbStatsName ].includes(side.id))
                    ScoreboardLib.sideBar_clear(tickDelay);
            }

            if (list && list.isValid) {
                if ([ this.sbEntitiesName, this.sbStatsName ].includes(list.id))
                    ScoreboardLib.list_clear(tickDelay);
            }
        },
        zero (all = false) {
            alertLog.log("* function debugScoreboards.zero ()", debugFunctions);

            const side = ScoreboardLib.sidBar_query();

            this.ScoreboardList
                .filter(sb => {
                    if (all) return true;
                    if (!side || !side.isValid) return false;
                    return sb.name === side.id;
                })
                .forEach(sb => {
                    ScoreboardLib.setZeroAll(sb.sbId);
                    alertLog.success(`Zeroed Scoreboard ${sb.display}`, debugFunctions);
                });
        }
    });

//==============================================================================
export function debugScoreboardSetups (resetAll = true) {
    alertLog.log("* function debugScoreboardSetups ()", debugFunctions);

    debugScoreboards.createAllScoreboardObjectives(resetAll);

    if (devDebug.debugOn) {
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
function thisAddOn_EntityCounts (override = false) {

    const fireflyCount = EntityLib.getAllEntities({ type: watchFor.firefly_typeId }).length;

    const flyCount = EntityLib.getAllEntities({ type: watchFor.fly_typeId }).length;
    //if (flyCount) system.run(() => {    });

    const eggCount = EntityLib.getAllEntities({ type: watchFor.egg_typeId }).length;
    //if (eggCount) system.run(() => {    });

    const entities_all = EntityLib.getAllEntities({ type: watchFor.typeId });

    system.runTimeout(() => {
        const entities = entities_all.filter(e => { return e.isValid && !e.hasComponent('minecraft:is_baby'); });
        const loaded = entities.filter(e => { return e.dimension.isChunkLoaded(e.location); });
        const unLoaded = entities.filter(e => { return !e.dimension.isChunkLoaded(e.location); });
        debugScoreboards.sbCtrsScoreboard?.setScore(debugScoreboards.adultSpiders, entities.length);
        debugScoreboards.sbCtrsScoreboard?.setScore(debugScoreboards.babySpiders, entities_all.length - entities.length);
        debugScoreboards.sbCtrsScoreboard?.setScore(debugScoreboards.eggsInWebs, eggCount);
        debugScoreboards.sbCtrsScoreboard?.setScore(debugScoreboards.flies, flyCount);
        debugScoreboards.sbCtrsScoreboard?.setScore('ctr: §lFire flies', fireflyCount);
        debugScoreboards.sbCtrsScoreboard?.setScore('ctr: §aLoaded', loaded.length);
        debugScoreboards.sbCtrsScoreboard?.setScore('ctr: §jUnLoaded', unLoaded.length);
    }, 1);

}
//==============================================================================
export function debugVarChange () {
    //Not knowing what the change is, so do not do too much
    alertLog.log("* function debugVarChange ()", debugFunctions);

    devDebug.anyOn();

    if (devDebug.debugOn) {
        if (debugScoreboards.ScoreboardList.length == 0) {
            debugScoreboardSetups();
        }
    }
    else {
        debugScoreboards.unShow();
        //debugScoreboards.countersOff();
    }
}
//==============================================================================
// End of File
