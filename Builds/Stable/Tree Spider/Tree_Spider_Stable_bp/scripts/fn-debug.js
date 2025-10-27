//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20251023 - Sep out debug stuff
========================================================================*/
import { system, TicksPerSecond, world } from "@minecraft/server";
import { alertLog, watchFor } from './settings.js';
import { ScoreboardLib } from "./common-stable/scoreboardClass.js";
import { EntityLib } from "./common-stable/entityClass.js";
import { DynamicPropertyLib } from "./common-stable/dynamicPropertyClass.js";
import { Ticks } from "./common-data/globalConstantsLib.js";
//==============================================================================
// JSDoc Makes the squiggly red lines go away....
//==============================================================================
/** @typedef {import("@minecraft/server").ScoreboardObjective} ScoreboardObjective */
//==============================================================================
/** Core shape without index signature. */
//==============================================================================
/** @typedef {{
 *  debug: boolean;
 *  debugGamePlay: boolean;
 *  debugEntityActivity: boolean;
 *  debugEntityAlert: boolean;
 *  debugPackLoad: boolean;
 *  debugSubscriptions: boolean;
 *  debugLoadAndSpawn: boolean;
 *  debugScoreboardsAllow: boolean;
 *  debugScoreboardList: string[]; 
 *  debugTimeCountersOn: boolean;
 *  debugTimers: 'mh' | 'smh';
 *  debugTimeCountersRunId: number;
 *  allOff(this: Dev): void;
 *  allOn(this: Dev): void;
 *  anyOn(this: Dev): void;
 * }} DevCore */;

/** @typedef {{
 * sbEntitiesScoreboard: ScoreboardObjective | undefined;
 * sbEntitiesName: string
 * sbStatsScoreboard: ScoreboardObjective | undefined;
 * sbStatsName: string
 * createAllScoreboardNames(this: DebugScoreboards): void;
 * createAllScoreboardObjectives(this: DebugScoreboards): void;
 * createAll(this: DebugScoreboards): void;
 * }} DebugScoreboardsCore */;
//==============================================================================
/** Allow bracket indexing like dev[key]. */
//==============================================================================
/** @typedef {DevCore & Record<string, unknown>} Dev */
/** @typedef {DebugScoreboardsCore & Record<string, unknown>} DebugScoreboards */
//==============================================================================
export const dynamicVarsDebug = {
    // World Properties
    allowDebug: 'allowDebug',
    allowScoreboards: 'allowScoreboards',
    //Debug Msg Types
    allowMsgsEntityActivity: 'allowMsgsEntityActivity',
    allowMsgsEntityAlert: 'allowMsgsEntityAlert',
    allowMsgsGamePlay: 'debugGamePlay',
    allowMsgsLoadAndSpawn: 'allowMsgsLoadAndSpawn',
    allowMsgsPackLoad: 'allowMsgsPackLoad',
    allowMsgsSubscriptions: 'allowMsgsSubscriptions',
};

export const dev =
/** @type {Dev} */ ({
        debug: false,
        // -- Debug areas of concern
        debugGamePlay: false,
        debugEntityActivity: false,
        debugEntityAlert: false,
        debugPackLoad: false,
        debugSubscriptions: false,
        debugLoadAndSpawn: false,
        // ---
        debugScoreboardsAllow: false,
        debugScoreboardList: [],
        debugScoreboardBaseName: 'dw623_tree_spider',
        debugScoreboardBaseDisplay: '§aTree Spider§6',
        // ---
        debugTimeCountersOn: false,
        debugTimers: 'mh', // was smh, but don't need seconds
        debugTimeCountersRunId: 0,

        /** @this {Dev} */
        allOff () {
            for (const [ k, v ] of Object.entries(this)) {
                if (k.startsWith('debug') && typeof v === 'boolean') {
                    this[ k ] = /** @type {unknown} */ (false);
                }
            }
            // keep the summary flag in sync
            this.debug = false;
            ifNoReasonForScoreBoardToShow();
        },

        /** @this {Dev} */
        allOn () {
            for (const [ k, v ] of Object.entries(this)) {
                if (k.startsWith('debug') && typeof v === 'boolean') {
                    this[ k ] = /** @type {unknown} */ (true);
                }
            }
            this.debug = true;
        },

        /** @this {Dev} */
        anyOn () {
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

        /** @type string[] */
        sbList: [],

        createAllScoreboardNames () {
            for (const [ k, v ] of Object.entries(this)) {
                if (k.startsWith('sb') && k.endsWith('Name') && v === '') {
                    const base = k.replace('sb', '').replace('Name', '');
                    const name = dev.debugScoreboardName + '_' + base.toLowerCase();
                    this[ k ] = name;
                    dev.debugScoreboardList.push(name);
                }
            }
        },
        createAllScoreboardObjectives () {
            for (const [ k, v ] of Object.entries(this)) {
                if (k.startsWith('sb') && k.endsWith('Scoreboard') && typeof v === 'undefined') {
                    const base = k.replace('sb', '').replace('Scoreboard', '');
                    const name = dev.debugScoreboardName + '_' + base.toLowerCase();
                    let sb = world.scoreboard.getObjective(name);

                    if (!sb) {
                        const displayName = dev.debugScoreboardDisplayName + ' ' + base;
                        sb = world.scoreboard.addObjective(name, displayName);
                    }

                    this[ k ] = sb;
                }
            }
        },
        createAll () {
            this.createAllScoreboardNames();
            this.createAllScoreboardObjectives();
        }
    });
//==============================================================================
export function getDebugDynamicVars () {

    if (!DynamicPropertyLib.propertyExists(world, dynamicVarsDebug.allowDebug)) {
        //Initialize to settings
        setDebugDynamicVars();
    }

    dev.debug = DynamicPropertyLib.getBoolean(world, dynamicVarsDebug.allowDebug);
    dev.debugScoreboardsAllow = DynamicPropertyLib.getBoolean(world, dynamicVarsDebug.allowScoreboards);
    dev.debugEntityActivity = DynamicPropertyLib.getBoolean(world, dynamicVarsDebug.allowMsgsEntityActivity);
    dev.debugEntityAlert = DynamicPropertyLib.getBoolean(world, dynamicVarsDebug.allowMsgsEntityAlert);
    dev.debugGamePlay = DynamicPropertyLib.getBoolean(world, dynamicVarsDebug.allowMsgsGamePlay);
    dev.debugLoadAndSpawn = DynamicPropertyLib.getBoolean(world, dynamicVarsDebug.allowMsgsLoadAndSpawn);
    dev.debugPackLoad = DynamicPropertyLib.getBoolean(world, dynamicVarsDebug.allowMsgsPackLoad);
    dev.debugSubscriptions = DynamicPropertyLib.getBoolean(world, dynamicVarsDebug.allowMsgsSubscriptions);

    dev.anyOn();
    if (dev.debug == false) dev.allOff();
}
//==============================================================================
/**
 * @summary Sets Debug Dynamic Vars to what is in dev settings
 */
export function setDebugDynamicVars () {
    dev.anyOn();
    if (dev.debug == false) dev.allOff();

    world.setDynamicProperty(dynamicVarsDebug.allowDebug, dev.debug);
    world.setDynamicProperty(dynamicVarsDebug.allowScoreboards, dev.debugScoreboardsAllow);

    world.setDynamicProperty(dynamicVarsDebug.allowMsgsEntityActivity, dev.debugEntityActivity);
    world.setDynamicProperty(dynamicVarsDebug.allowMsgsEntityAlert, dev.debugEntityAlert);
    world.setDynamicProperty(dynamicVarsDebug.allowMsgsGamePlay, dev.debugGamePlay);
    world.setDynamicProperty(dynamicVarsDebug.allowMsgsLoadAndSpawn, dev.debugLoadAndSpawn);
    world.setDynamicProperty(dynamicVarsDebug.allowMsgsPackLoad, dev.debugPackLoad);
    world.setDynamicProperty(dynamicVarsDebug.allowMsgsSubscriptions, dev.debugSubscriptions);
}
//==============================================================================
export function debugScoreboardSetups () {

    if (!dev.debugScoreboardsAllow) return;

    debugScoreboards.createAll();

    //TODO: move to a function in debugScoreboards
    //clearing scoreboards
    if (dev.debugGamePlay || dev.debugEntityAlert || dev.debugEntityActivity || dev.debugLoadAndSpawn) {
        //list of scoreboards to reset
        const scoreboards = world.scoreboard.getObjectives();
        scoreboards.forEach(sb => {
            if (dev.debugScoreboardList.includes(sb.id)) {
                const participants = sb.getParticipants();
                alertLog.success(`Clearing Scoreboard ${sb.displayName}`, dev.debugPackLoad && (dev.debugEntityActivity || dev.debugEntityAlert));
                participants.forEach(p => { system.run(() => { sb.removeParticipant(p); }); });
            }
        });

        debugTimerSetup();
    }
}
//==============================================================================
function debugTimerSetup () {
    //--- Timers and where
    if (dev.debugGamePlay || dev.debugEntityAlert || dev.debugEntityActivity) {
        dev.debugTimeCountersRunId = ScoreboardLib.systemTimeCountersStart(debugScoreboards.sbStatsName, dev.debugTimers);
        system.runTimeout(() => {
            system.runInterval(() => { treeSpiderEntityCounts(); }, Ticks.perMinute / 6);
            system.runTimeout(() => { ScoreboardLib.sideBar_set(debugScoreboards.sbStatsName); }, TicksPerSecond / 4);
        }, TicksPerSecond * 6);
    }
    else {
        dev.debugTimeCountersRunId = 0;
        system.runTimeout(() => { ScoreboardLib.sideBar_clear(); }, TicksPerSecond / 4);
    }

    dev.debugTimeCountersOn = !!dev.debugTimeCountersRunId;
}
//==============================================================================
export function ifNoReasonForScoreBoardToShow () {
    if (!(dev.debugEntityActivity || dev.debugEntityAlert || dev.debugGamePlay))
        ScoreboardLib.sideBar_clear();
}
//===================================================================
export function timersToggle () {

    if (dev.debugTimeCountersOn) {
        dev.debugTimeCountersOn = false;
        if (dev.debugTimeCountersRunId) system.clearRun(dev.debugTimeCountersRunId);
        dev.debugTimeCountersRunId = 0;
    }
    else {
        if (debugScoreboards.sbStatsScoreboard) {
            dev.debugTimeCountersOn = true;
            dev.debugTimeCountersRunId = ScoreboardLib.systemTimeCountersStart(debugScoreboards.sbStatsName, dev.debugTimers);
        }
    }
}
//===================================================================
/**
 * 
 * @param {boolean} [override =false]
 */
export function treeSpiderEntityCounts (override = false) {

    if (override || dev.debugGamePlay || dev.debugEntityActivity || dev.debugEntityAlert) {

        const eggCount = EntityLib.getAllEntities({ type: watchFor.egg_typeId }).length;
        if (eggCount) system.run(() => {
            const msg = "§gEggs in Webs";
            debugScoreboards.sbStatsScoreboard?.setScore(msg, eggCount);
        });

        const entities_all = EntityLib.getAllEntities({ type: watchFor.typeId });
        //const entities_all = world.getDimension("overworld").getEntities({ type: watchFor.typeId });
        if (entities_all.length === 0) return;

        system.runTimeout(() => {

            const entities = entities_all.filter(e => { return !e.hasComponent('minecraft:is_baby'); });
            debugScoreboards.sbStatsScoreboard?.setScore("§6Adult spiders", entities.length);

            const babyMsg = "§bBaby spiders";
            if (entities.length === 0) {
                debugScoreboards.sbStatsScoreboard?.setScore(babyMsg, entities_all.length);
            }
            else if (entities_all.length - entities.length) {
                debugScoreboards.sbStatsScoreboard?.setScore(babyMsg, entities_all.length - entities.length);
            }
        }, 1);
    }
}
//==============================================================================
// End of File
