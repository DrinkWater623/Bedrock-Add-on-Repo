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
import { system } from "@minecraft/server";
// Shared
import { Ticks } from "../common-data/globalConstantsLib.js";
import { EntityLib } from "../common-stable/entityClass.js";
import { DebugScoreboards } from "../common-stable/debugSbClass.js";
import { getWorldTime } from "../common-stable/timers.js";
// Local
import { alertLog, pack, watchFor } from '../settings.js';
//==============================================================================
// JSDoc Makes the squiggly red lines go away....
//==============================================================================
const now = () => { return `§l§gTime: ${getWorldTime().hours}:00`; };
//==============================================================================
/** Core shape without index signature. */
//==============================================================================
/**
 * @typedef DevObject
 * @property {boolean} debugOn
 * @property {boolean} debugSubscriptionsOn
 * @property {boolean} debugFunctionsOn
 * @property {boolean} watchBlockSubscriptions
 * @property {boolean} watchEntityGoals
 * @property {boolean} watchEntityEvents
 * @property {boolean} watchEntitySubscriptions
 * @property {boolean} watchEntityEating
 * @property {boolean} watchEntityIssues
 * @property {boolean} watchPlayerActions
 * @property {boolean} watchTempIssues
 * @property {() => void} allOff
 * @property {() => void} allOn
 * @property {() => void} anyOn
 * @property {DebugScoreboards} dsb
 * @property {(this: DevObject) => void} dsb_setup
 */
//==============================================================================
const debugFunctions = false; //for the devDebug object
//==============================================================================
/** @type {DevObject} */
export const devDebug = {
    // Customize this to the project
    // flags
    debugOn: true,
    debugSubscriptionsOn: false,
    debugFunctionsOn: false,
    watchBlockSubscriptions: false,
    watchEntityGoals: false,
    watchEntityEvents: false,
    watchEntitySubscriptions: false,
    watchEntityEating: false,
    watchEntityIssues: true,
    watchPlayerActions: false,
    watchTempIssues: false,

    allOff () {
        alertLog.log("* function dev.allOff ()");
        let noChange = !this.debugOn;
        for (const [ k, v ] of Object.entries(this)) {
            if (typeof v === "boolean") {
                noChange = noChange && !v;
                // @ts-expect-error index write on object literal
                this[ k ] = /** @type {unknown} */ (false);
            }
        }
        this.debugOn = false;
        // keep dsb in sync
        this.dsb.setDebug(false);
    },

    allOn () {
        alertLog.log("* function dev.allOn ()", true);
        let noChange = this.debugOn;
        for (const [ k, v ] of Object.entries(this)) {
            if (typeof v === "boolean") {
                noChange = noChange && v;
                // @ts-expect-error index write on object literal
                this[ k ] = /** @type {unknown} */ (true);
            }
        }
        this.debugOn = true;
        // keep dsb in sync
        this.dsb.setDebug(true);
    },

    anyOn () {
        alertLog.log("* function dev.anyOn ()", debugFunctions);
        let any = false;
        for (const [ , v ] of Object.entries(this)) {
            if (typeof v === "boolean") any = any || v;
        }
        this.debugOn = any;
        // keep dsb in sync
        this.dsb.setDebug(any);
    },

    // ✅ Always constructed (no undefined), start with debug=false; fix display string (no extra quotes)
    dsb: new DebugScoreboards(false, pack.fullNameSpace, "§aTree Spider§6§l"),

    /** Initialize scoreboards + jobs (call once after world load) */
    dsb_setup () {
        const cfg = {
            bases: [ "Ctrs", "Stats", "Deaths" ],
            entries: {
                // Ctr entries
                adultSpiders: "ctr: §aAdult spiders",
                babySpiders: "ctr: §bBaby spiders",
                eggsInWebs: "ctr: §gEggs in Webs",
                flies: "ctr: §cFlies",
                webs: "ctr: §l§fWebs",
                fireflies: 'ctr: §lFire flies',
                chunkLoaded: 'ctr: §aLoaded',
                chunkUnloaded: 'ctr: §j§lUnLoaded',
                // Stat entries
                layEgg: "eggs: §gLaid",
                born: "ety: §bBorn",
                loaded: "ety: §2Loaded",
                spawned: "ety: §aSpawned",
                grewUp: "ety: §3Puberty",
                newFlies: "ety: §cNew Flies",
                newFireflies: 'ety: §uFireflies',
                newWeb: "webs: §5New",
                expandWeb: "webs: §uExpand",
                enterWeb: "webs: §9Entered",
                stalled: "ety: §tStalled",
                removed: "ety: §6Removed",
                died: "ety: §cDied",
                killed: "ety: §c§lKilled"
            }
        };
        // devDebug.dsb.increment('stats', 'loaded')
        // Sync dsb’s debug with current flag, then set up boards/entries
        this.dsb.setDebug(this.debugOn);
        this.dsb.setup(cfg);

        // Time counter as a registered job
        this.dsb.enableTimeCounter(true);

        // Generic interval job for your entity counts (runs while debugOn true)
        this.dsb.registerIntervalJob(
            "entityCounter",
            () => { if (this.debugOn) thisAddOn_EntityCounts(); },
            Ticks.perMinute / 6,
            [ "Ctrs" ]
        );

        this.dsb.registerIntervalJob(
            "hourlyChime",
            () => { alertLog.log(now(),this.debugOn); },
            Ticks.minecraftHour,
            [ "Ctrs" ]
        );

        // Start all registered jobs
        alertLog.log(`Start ${now()}`, this.debugOn);
        thisAddOn_EntityCounts();
        this.dsb.countersOn();
        this.dsb.show("Stats");
    }
};
//===================================================================
/**
 * 
 * @param {boolean} [override =false]
 */
function thisAddOn_EntityCounts (override = false) {
    if (!devDebug.debugOn) return;

    const fireflyCount = EntityLib.getAllEntities({ type: watchFor.firefly_typeId }).length;

    const flyCount = EntityLib.getAllEntities({ type: watchFor.fly_typeId }).length;
    //if (flyCount) system.run(() => {    });

    const eggCount = EntityLib.getAllEntities({ type: watchFor.egg_typeId }).length;
    //if (eggCount) system.run(() => {    });

    const entities_all = EntityLib.getAllEntities({ type: watchFor.spider_typeId });

    system.runTimeout(() => {
        const entities = entities_all.filter(e => { return e.isValid && !e.hasComponent('minecraft:is_baby'); });
        const loaded = entities.filter(e => { return e.dimension.isChunkLoaded(e.location); });
        const unLoaded = entities.filter(e => { return !e.dimension.isChunkLoaded(e.location); });
        devDebug.dsb.set('ctrs', 'adultSpiders', entities.length, 1);
        devDebug.dsb.set('ctrs', 'adultSpiders', entities.length, 1);
        devDebug.dsb.set('ctrs', 'babySpiders', entities_all.length - entities.length, 1);
        devDebug.dsb.set('ctrs', 'eggsInWebs', eggCount, 1);
        devDebug.dsb.set('ctrs', 'flies', flyCount, 1);
        devDebug.dsb.set('ctrs', 'fireflies', fireflyCount, 1);
        devDebug.dsb.set('ctrs', 'chunkLoaded', loaded.length, 1);
        devDebug.dsb.set('ctrs', 'chunkUnloaded', unLoaded.length, 1);
    }, 1);
}
//==============================================================================
// End of File
//====================================================================

// export function hourlyChime () {
//     alertLog.log(`Start ${now()}`, devDebug.debugOn);
//     system.runInterval(() => {
//         alertLog.log(now(), devDebug.debugOn);
//     }, Ticks.minecraftHour);
// }