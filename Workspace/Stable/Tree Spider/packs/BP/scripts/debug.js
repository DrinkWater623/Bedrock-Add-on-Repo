// debug.js - F3 Bedrock Add-on
// @ts-check
/* =====================================================================
Copyright (C) 2026 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T. 
URL: https://github.com/DrinkWater623
========================================================================
    TODO:

    Notes to self: 
        the objects in the child class are really meant for watching the event for a particular object type
        and being able to turn on and off easily without looking through the scripts
        as long as I am consistent about usage and do not do band-aid adhoc alerts here and there
========================================================================
Change Log:
    20260123 - Redid for Tree Spider using the new format
========================================================================*/
// Minecraft
import { Scoreboard, system } from "@minecraft/server";
// Shared
import { Ticks } from "./common-data/index.js";
import { Dev } from './common-stable/debug/index.js';
import { getWorldTime, Scoreboards } from "./common-stable/tools/index.js";
import { Entities } from "./common-stable/gameObjects/index.js";
// Local
import { pack, packDisplayName, watchFor } from './settings.js';
import { flyPopulationCheck } from "./helpers/fn-entities.js";
//==============================================================================
const now = () => { return `§l§gTime: ${getWorldTime().hours}:00`; };
//==============================================================================
// JSDoc Makes the squiggly red lines go away....
//==============================================================================
/**
 * @typedef {Record<string, boolean>} BooleanMap
 * @typedef {Record<string, BooleanMap>} Boolean2DeepMap
 */
//==============================================================================
/*  Hey YOU... update the 2 "const objects" below and keep your grubby hand out of the Class (if you can)
    Start everything or most everything as false and toggle on via command registry while in game play
    It will be overwhelming if everything is on and you've programmed the debug info for it.
*/
/** @type {Boolean2DeepMap} */
const WATCHING_GAME_OBJECTS = {
    //Can be block, item or entity - be mindful of the naming convention so that everything flows
    block: {},
    item: {
        bottle_of_flies: true,
        dead_fly_ball_stick: false,
        rotten_flesh_kabob: false,
    },
    entity: {
        firefly: false,
        fly: false,
        spider: false,
        spiderEgg: false,
    }
};
/** @type {Boolean2DeepMap} */
const WATCHING_EVENTS = {
    item: {
        afterItemCompleteUse: true,
        afterItemReleaseUse: true,
        afterItemStartUse: true,
        afterItemStartUseOn: true,
        afterItemStopUse: true,
        afterItemStopUseOn: true,
        beforeItemUse: true,
    },
    block: {
    },
    entity: {
        afterEntityDie: true,
        afterEntityLoad: true,
        beforeEntityRemoved: true,
        enterWeb: false,
        expandWeb: false,
        placeWeb: false,
        lookFor: false,
        wander: false,
        eating: false,
        newFlies: false,

    },
    player: {
        afterPlayerBreakBlock: false,
        afterPlayerPlaceBlock: false,
        beforePlayerInteractWithBlock: true,
    },
    system: {
        afterWorldLoad: false,
        beforeStartup: false,
        afterScriptEventReceive: true,
    }
};
/** @type {BooleanMap} */
const WATCHING_FUNCTIONS = {
    fireFlyFood: false,
    flyPopulationCheck: false,
    entityStallCheck_lastTick: false,
    entityEventProcess: false,
    rattleEntityFromBlockWithItem: false,
    // world/system
    registerCustomCommands: false,
    registerDebugCommands: false,
    registerBetaCommands: false,

    // Subscription General
    subscriptions: false,
    subscriptionsBeta: false,
    subscriptionsStable: false,
    subscriptionsItems: false,
    subscriptionsEntities: false,
    subscriptionsPlayers: false,
    subscriptionsPlayersBeta: false,
    onBeforeStartup: false,
    //for cmds... so not too many when not focused
    alertBlockSubs: false,
    alertEntitySubs: true,
    alertItemSubs: false,
    alertPlayerSubs: false,
    alertSystemSubs: false,
};
//==============================================================================
/*
Master override - if pack setting does not have debugOn, then turn it all off
That way we can have a master switch
*/
class DevTreeSpider extends Dev {
    /**
   * @constructor
   * @param {string} pack_name 
   */
    constructor(pack_name) {
        super(pack_name, pack.debugOn);

        if (pack.debugOn) {
            //These Overwrite the samples in the Dev Class
            this.configure(
                {
                    functions: WATCHING_FUNCTIONS,
                    gameObjects: WATCHING_GAME_OBJECTS
                },
                { style: "overwrite" });

            //All events are defined in the Dev class, this just updates flags 
            // and you can add new ones as needed if the parent is not updated  
            this.configure(
                { events: WATCHING_EVENTS },
                { style: "apply", addIfNew: true });

            //need to verify these and error if not exist in game (there is an MC obj for this)
            this.entityWatchList = [ ...watchFor.packEntityList() ];

            // ✅ Always constructed (no undefined), start with debug=false; fix display string (no extra quotes)
            //this.dsb = new Scoreboards(false, pack.cmdNameSpace, "§aTree Spider§6§l");
            this.dsb.namePfx = pack.cmdNameSpace;
            this.dsb.displayPfx = "§aTree Spider§6§l";
        }
    }

    /** Initialize scoreboards + jobs (call once after world load) */
    dsb_setup () {

        if (!pack.debugOn) return;

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
        this.dsb.setScoreboardsOn(this.debugOn);
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
        this.alertLog(`Start ${now()}`, this.debugOn);
        thisAddOn_EntityCounts();
        this.dsb.countersOn();
        this.dsb.show("Stats");
    }


}
//==============================================================================
export const dev = new DevTreeSpider(packDisplayName);
export const emitters = {
    // Console / alert channel (persistent in your console log)
    alertLog: dev.alertLog.bind(dev),
    alertWarn: dev.alertWarn.bind(dev),
    alertSuccess: dev.alertSuccess.bind(dev),
    alertError: dev.alertError.bind(dev),

    // Chat channel (ephemeral)
    chatLog: dev.chatLog.bind(dev),
    chatWarn: dev.chatWarn.bind(dev),
    chatSuccess: dev.chatSuccess.bind(dev),
    chatError: dev.chatError.bind(dev),

    // Neutral "emit" aliases (currently mapped to alerts)
    emit: dev.alertLog.bind(dev),
    emitWarn: dev.alertWarn.bind(dev),
    emitSuccess: dev.alertSuccess.bind(dev),
    emitError: dev.alertError.bind(dev),
};
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
/**
 * 
 * @param {boolean} [override =false]
 */
function thisAddOn_EntityCounts (override = false) {
    if (!dev.debugOn) return;
    // if (!dev.dsb || !(dev.dsb instanceof Scoreboard)) return

    const fireflyCount = Entities.getAllEntities({ type: watchFor.firefly_typeId }).length;

    const flyCount = Entities.getAllEntities({ type: watchFor.fly_typeId }).length;
    //if (flyCount) system.run(() => {    });

    const eggCount = Entities.getAllEntities({ type: watchFor.egg_typeId }).length;
    //if (eggCount) system.run(() => {    });

    const spiders_all = Entities.getAllEntities({ type: watchFor.spider_typeId });
    //const loaded = spiders_all.filter(e => { return e.dimension.isChunkLoaded(e.location); });
    //const unLoaded = spiders_all.filter(e => { return !e.dimension.isChunkLoaded(e.location); });
    const hungry = spiders_all.filter(e => { return e.hasTag('hungry'); });
    const satiated = spiders_all.filter(e => { return e.hasTag('satiated'); });



    system.runTimeout(() => {
        const spiders_adult = spiders_all.filter(e => { return e.isValid && !e.hasComponent('minecraft:is_baby'); });
        dev.dsb.set('ctrs', 'adultSpiders', spiders_adult.length, 1);
        dev.dsb.set('ctrs', 'babySpiders', spiders_all.length - spiders_adult.length, 1);
        dev.dsb.set('ctrs', 'eggsInWebs', eggCount, 1);
        dev.dsb.set('ctrs', 'flies', flyCount, 1);
        dev.dsb.set('ctrs', 'fireflies', fireflyCount, 1);
        //devDebug.dsb.set('ctrs', 'chunkLoaded', loaded.length, 1);
        //devDebug.dsb.set('ctrs', 'chunkUnloaded', unLoaded.length, 1);
        dev.dsb.set('ctrs', 'hungry', hungry.length, 1);
        dev.dsb.set('ctrs', 'satiated', satiated.length, 1);
    }, 1);

    dev.dsb.zero([ "actions" ]);
    spiders_all.forEach(e => {
        const mv = e.getComponent("mark_variant");
        if (mv?.isValid) {
            const action = markVariantLegend.get(mv.value);
            if (action) dev.dsb.increment('actions', action);
        }
    });
    dev.dsb.set('actions', 'hungry', hungry.length, 1);
    dev.dsb.set('actions', 'satiated', satiated.length, 1);
}
//==============================================================================
// End of File
//==============================================================================
