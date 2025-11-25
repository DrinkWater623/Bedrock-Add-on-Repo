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
 * @property {boolean} watchEntityPopulation
 * @property {boolean} watchEntityStalls
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
const markVariantLegend = new Map([
    [ 1, "lf logs" ],
    [ 2, "lf logs" ],
    [ 3, "lf leaves" ],
    [ 4, "lf leaves" ],
    [ 5, "lf nature" ],
    [ 6, "lf nature" ],
    [ 7, "lf webs" ],
    [ 8, "lf webs" ],
    [ 9, "lf fire flies" ],
    [ 10, "eating" ],
    [ 11, "wandering" ],
    [ 12, "chilling" ],
]);
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
    watchEntityEating: true,
    watchEntityIssues: false,
    watchEntityPopulation: false,
    watchEntityStalls: true,
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
            bases: [ "Ctrs", "Stats", "Deaths", "Actions" ],
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

        /*this.dsb.registerIntervalJob(
            "hourlyChime",
            () => { alertLog.log(now(),this.debugOn); },
            Ticks.minecraftHour,
            [ "Ctrs" ]
        );*/

        /*this.dsb.registerIntervalJob(
            "newDay",
            () => { alertLog.log(`New Minecraft Day`,this.debugOn); },
            Ticks.minecraftDay,
            [ "Ctrs" ]
        );*/

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

    const spiders_all = EntityLib.getAllEntities({ type: watchFor.spider_typeId });
    //const loaded = spiders_all.filter(e => { return e.dimension.isChunkLoaded(e.location); });
    //const unLoaded = spiders_all.filter(e => { return !e.dimension.isChunkLoaded(e.location); });
    const hungry = spiders_all.filter(e => { return e.hasTag('hungry'); });
    const satiated = spiders_all.filter(e => { return e.hasTag('satiated'); });

    system.runTimeout(() => {
        const spiders_adult = spiders_all.filter(e => { return e.isValid && !e.hasComponent('minecraft:is_baby'); });
        devDebug.dsb.set('ctrs', 'adultSpiders', spiders_adult.length, 1);
        devDebug.dsb.set('ctrs', 'babySpiders', spiders_all.length - spiders_adult.length, 1);
        devDebug.dsb.set('ctrs', 'eggsInWebs', eggCount, 1);
        devDebug.dsb.set('ctrs', 'flies', flyCount, 1);
        devDebug.dsb.set('ctrs', 'fireflies', fireflyCount, 1);
        //devDebug.dsb.set('ctrs', 'chunkLoaded', loaded.length, 1);
        //devDebug.dsb.set('ctrs', 'chunkUnloaded', unLoaded.length, 1);
        devDebug.dsb.set('ctrs', 'hungry', hungry.length, 1);
        devDebug.dsb.set('ctrs', 'satiated', satiated.length, 1);
    }, 1);

    devDebug.dsb.zero([ "actions" ]);
    spiders_all.forEach(e => {
        const mv = e.getComponent("mark_variant");
        if (mv?.isValid) {
            const action = markVariantLegend.get(mv.value);
            if (action) devDebug.dsb.increment('actions', action);
        }
    });
    devDebug.dsb.set('actions', 'hungry', hungry.length, 1);
    devDebug.dsb.set('actions', 'satiated', satiated.length, 1);
}
//==============================================================================
// End of File
//====================================================================