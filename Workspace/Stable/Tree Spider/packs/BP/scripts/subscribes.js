//subscribes.js
//@ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20251023 - add in stable stuff and update to api 2.0 and move debug-only stuff out
========================================================================*/
import { world, system, EntityInitializationCause, Player } from "@minecraft/server";
//Shared
import { Ticks } from "./common-data/globalConstantsLib.js";
import { chance, rndInt } from "./common-other/mathLib.js";
import { DynamicPropertyLib } from "./common-stable/dynamicPropertyClass.js";
import { spawnEntityAtLocation } from "./common-stable/entityClass.js";
import { Vector3Lib } from "./common-stable/vectorClass.js";
//Local
import { alertLog, pack, watchFor, dynamicVars, thisPackEntities } from './settings.js';
import { registerCustomCommands } from "./chatCmds.js";
import { spiderSpawnFromValidNatureBlock, rattleEntityFromBlockWithItem, validNatureBlockForSpiders } from './helpers/fn-blocks.js';
import { devDebug } from "./helpers/fn-debug.js";
import { entityEventProcess, lastTickAndLocationRegister, stalledSpiderCheckAndFix, flyPopulationCheck, spiderPopulationCheck, } from './helpers/fn-entities.js';
import { validLongToolForInteractToShakeSpidersOut } from './helpers/fn-items.js';
import { airBlock } from "./common-data/block-data.js";
//import { ScoreboardLib } from "./common-stable/scoreboardClass.js";

//==============================================================================
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** The function type subscribe expects. */
/** @typedef {Parameters<typeof world.afterEvents.entityDie.subscribe>[0]} AfterEntityDieHandler */
/** @typedef {Parameters<typeof world.afterEvents.entityLoad.subscribe>[0]} AfterEntityLoadHandler */
/** @typedef {Parameters<typeof world.afterEvents.entityRemove.subscribe>[0]} AfterEntityRemovedHandler */
/** @typedef {Parameters<typeof world.afterEvents.entitySpawn.subscribe>[0]} AfterEntitySpawnHandler */
/** @typedef {Parameters<typeof world.beforeEvents.entityRemove.subscribe>[0]} BeforeEntityRemovedHandler */
/** The stored handle type (Bedrock returns the function reference). */
/** @typedef {ReturnType<typeof world.afterEvents.entityDie.subscribe>} AfterEntityDieHandle */
/** @typedef {ReturnType<typeof world.afterEvents.entityLoad.subscribe>} AfterEntityLoadHandle */
/** @typedef {ReturnType<typeof world.afterEvents.entityRemove.subscribe>} AfterEntityRemovedHandle */
/** @typedef {ReturnType<typeof world.afterEvents.entitySpawn.subscribe>} AfterEntitySpawnHandle */
/** @typedef {ReturnType<typeof world.beforeEvents.entityRemove.subscribe>} BeforeEntityRemovedHandle */
//==============================================================================
const debugFunctionsOn = false;
const debugSubscriptionsOn = false || devDebug.debugOn;
//==============================================================================
// This part was created this way, so that I can subscribe/unsubscribe via commands/flags
// Used only for debug/testing
const entityDebugSubscriptions = {
    // There is also an afterEvents.entitySpawn, but it has beta elements, so still in beta files - may delete, not useful
    afterEntityDie: {
        on: false,
        /** @type {AfterEntityDieHandle | null} */
        handler: null,

        subscribe () {
            if (this.on) return;
            alertLog.log("* entityDebugSubscriptions.afterEntityDie.subscribe ()", debugFunctionsOn);

            /** @type {AfterEntityDieHandler} */
            const fn = (event) => {
                const entity = event.deadEntity;
                const { nameTag, dimension, location } = entity;
                const whyDied = event.damageSource.cause;
                const msg = `§r§l${nameTag ? nameTag : "No-Name"}§r §c Died via ${whyDied} @ ${Vector3Lib.toString(location, 0, true)} -§r afterEvents.entityDie ()`;
                alertLog.warn(msg, devDebug.watchEntitySubscriptions);
                system.runTimeout(() => {
                    const x = `die: §c${whyDied}`;
                    devDebug.dsb.increment('deaths', x);
                    devDebug.dsb.increment('stats', x);
                }, 1);
            };

            this.handler = world.afterEvents.entityDie.subscribe(fn, { entityTypes: [ watchFor.typeId ] });
            this.on = true;
            alertLog.success("§aInstalled afterEvents.entityDie §4(debug mode)", debugSubscriptionsOn);
        },
        unsubscribe () {
            alertLog.warn("* entityDebugSubscriptions.afterEntityDie.unsubscribe ()", debugFunctionsOn);
            if (!this.on) return;

            if (this.handler) {
                world.afterEvents.entityDie.unsubscribe(this.handler);
                this.handler = null;
                alertLog.success("§aUninstalled afterEvents.entityDie)", debugSubscriptionsOn);
            }
            this.on = false;
        }
    },
    beforeEntityRemove: {
        on: false,
        /** @type {BeforeEntityRemovedHandle | null} */
        handler: null,

        subscribe () {
            alertLog.log("* entityDebugSubscriptions.beforeEntityRemove.subscribe ()", debugFunctionsOn);
            if (this.on) return;

            /** @type {BeforeEntityRemovedHandler} */
            const fn = (event) => {
                // Note: "removed" doesn't necessarily mean "died"
                if (!event.removedEntity || event.removedEntity.typeId !== watchFor.typeId) return;

                const entity = event.removedEntity;
                const { nameTag, dimension, location } = entity;
                const isUnLoaded = DynamicPropertyLib.getBoolean(entity, 'isUnloaded');
                const isStalled = DynamicPropertyLib.getBoolean(entity, 'isStalled');

                system.runTimeout(() => {
                    devDebug.dsb.incrementMany([ 'deaths', 'stats' ], 'removed', 1, 1);


                    //TODO:  see if I can get my coordinates and do the math for how far away these are  --  too many removes right after spawn
                    // See if can find out WHY despawning soo much
                    const players = world.getAllPlayers();
                    let delta = '';
                    if (players) {
                        const playerLocation = players[ 0 ].location;
                        delta = `§bClosest Player x: ${Math.round(Math.abs(location.x - playerLocation.x))}, y:${Math.round(Math.abs(location.y - playerLocation.y))}, z:${Math.round(Math.abs(location.z - playerLocation.z))}`;
                    }

                    const msg = `§l${nameTag}§r §6Removed @ ${Vector3Lib.toString(location, 0, true)} ${delta}§r(${isUnLoaded ? '' : ' loaded'}(${isStalled ? ' stalled' : ''})- beforeEvents.entityRemove()`;
                    alertLog.log(msg, devDebug.watchEntitySubscriptions);

                }, 1);
            };
            this.handler = world.beforeEvents.entityRemove.subscribe(fn);
            this.on = true;
            alertLog.success("§aInstalled beforeEvents.entityRemove §4(debug mode)", debugSubscriptionsOn);
        },
        unsubscribe () {
            alertLog.log("* entityDebugSubscriptions.beforeEntityRemove.unsubscribe ()", debugFunctionsOn);
            if (!this.on) return;

            if (this.handler) {
                world.beforeEvents.entityRemove.unsubscribe(this.handler);
                this.handler = null;
                alertLog.success("§aUninstalled beforeEvents.entityRemove)", debugSubscriptionsOn);
            }
            this.on = false;
        }
    },
    allOff () {
        alertLog.log("* const entityDebugSubscriptions.allOff ()");
        this.afterEntityDie.unsubscribe();
        //this.afterEntityRemove.unsubscribe();
        //this.afterEntitySpawn.unsubscribe();
        this.beforeEntityRemove.unsubscribe();
    },
    allOn () {
        alertLog.log("* const entityDebugSubscriptions.allOn ()");
        this.afterEntityDie.subscribe();
        //this.afterEntityRemove.subscribe();
        //this.afterEntitySpawn.subscribe();
        this.beforeEntityRemove.subscribe();
    },
    setup () {
        alertLog.log("* const entityDebugSubscriptions.setup ()", debugFunctionsOn);
        this.afterEntityDie.subscribe();
        //this.afterEntityRemove.subscribe(); //not needed and redundant to beforeEntityRemove
        //this.afterEntitySpawn.subscribe(); // this is called load/born/spawn  - events are taking care of born/spawn
        this.beforeEntityRemove.subscribe();
    }
};
const entitySubscriptions = {
    //TODO: have event wander start for spiders
    afterEntityLoad: {
        on: false,
        /** @type {AfterEntityLoadHandle | null} */
        handler: null,

        subscribe () {
            if (this.on) return;
            alertLog.log("* entityDebugSubscriptions.afterEntityLoad.subscribe ()", debugFunctionsOn);

            /** @type {AfterEntityLoadHandler} */
            const fn = (event) => {
                const entity = event.entity;

                if (!entity || !entity.isValid) return;
                if (entity.typeId !== watchFor.typeId) return;

                const { dimension, location, nameTag } = entity;

                if (nameTag) {
                    //means re-load???
                    system.runTimeout(() => {
                        lastTickAndLocationRegister(entity); //This is the most needed part...
                        DynamicPropertyLib.add(entity, dynamicVars.entityLoads, 1);
                        if (devDebug.debugOn) {
                            devDebug.dsb.increment('stats', 'loaded');
                            const msg = `§l${nameTag}§r §eLoaded in Biome ${dimension.getBiome(location).id} @ ${Vector3Lib.toString(location, 0, true)} §r- afterEvents.entityLoad()`;
                            alertLog.log(msg, devDebug.watchEntitySubscriptions);
                        }
                    }, 1);
                }
            };

            this.handler = world.afterEvents.entityLoad.subscribe(fn);
            this.on = true;
            alertLog.success("§aInstalled afterEvents.afterEntityLoad §4(debug mode)", debugSubscriptionsOn);
        },
        unsubscribe () {
            alertLog.warn("* entityDebugSubscriptions.afterEntityLoad.unsubscribe ()", debugFunctionsOn);
            if (!this.on) return;

            if (this.handler) {
                world.afterEvents.entityLoad.unsubscribe(this.handler);
                this.handler = null;
                alertLog.success("§aUninstalled afterEvents.afterEntityLoad)", debugSubscriptionsOn);
            }
            this.on = false;
        }
    },
    //Not Used - because redundant = and every entity when more efficient for scriptEvent inside entity to do it
    //But keep in case they ever get rid of scriptEvent... we will need this for debugging and naming
    afterEntitySpawn: {
        on: false,
        /** @type {AfterEntitySpawnHandle | null} */
        handler: null,

        subscribe () {
            if (this.on) return;

            /** @type {AfterEntitySpawnHandler} */
            const fn = (event) => {
                const entity = event.entity;
                if (!entity) return;
                if (entity.typeId !== watchFor.typeId) return;

                const { dimension, location, nameTag } = entity;

                system.runTimeout(() => {

                    alertLog.log(`§aEntity Spawned (${event.cause}) in Biome ${dimension.getBiome(location).id}: §l${nameTag}§r§6 @ ${Vector3Lib.toString(location, 0, true)}`, devDebug.watchEntitySubscriptions || devDebug.watchEntityGoals);

                    if (event.cause === EntityInitializationCause.Born) {
                        devDebug.dsb.increment('stats', 'born', 1, 1);
                        DynamicPropertyLib.add(entity, dynamicVars.entityBorn, 1);
                    }
                    else if (event.cause === EntityInitializationCause.Loaded) {
                        devDebug.dsb.increment('stats', 'loaded', 1, 1);
                        DynamicPropertyLib.add(entity, dynamicVars.entityLoads, 1);
                    }
                    else if (event.cause === EntityInitializationCause.Spawned) {
                        devDebug.dsb.increment('stats', 'spawned');
                        DynamicPropertyLib.add(entity, dynamicVars.entitySpawns, 1);
                    }
                }, 1);
            };

            this.handler = world.afterEvents.entitySpawn.subscribe(fn);
            this.on = true;
            alertLog.success("§aInstalled afterEvents.entitySpawn §4(debug mode)", debugSubscriptionsOn);
        },
        unsubscribe () {
            if (!this.on) return;

            if (this.handler) {
                world.afterEvents.entitySpawn.unsubscribe(this.handler);
                this.handler = null;
                alertLog.success("§aUninstalled afterEvents.entitySpawn)", debugSubscriptionsOn);
            }
            this.on = false;
        }
    },
    allOff () {
        alertLog.log("* const entityDebugSubscriptions.allOff ()", debugFunctionsOn);
        this.afterEntityLoad.unsubscribe();
        this.afterEntitySpawn.unsubscribe();
    },
    allOn () {
        alertLog.log("* const entityDebugSubscriptions.allOn ()", debugFunctionsOn);
        this.afterEntityLoad.subscribe();
        //this.afterEntitySpawn.subscribe();
    },
    setup () {
        alertLog.log("* const entityDebugSubscriptions.setup ()", debugFunctionsOn);
        this.afterEntityLoad.subscribe();
        //this.afterEntitySpawn.subscribe(); // this is called load/born/spawn  - events are taken care of born/spawn
    }
};
//==============================================================================
// Rest of subscriptions are one time setups
//==============================================================================
function afterEvents_worldLoad () {
    alertLog.log('§v* function afterEvents_worldLoad()', debugFunctionsOn);

    world.afterEvents.worldLoad.subscribe((event) => {
        pack.worldLoaded = true;

        //TODO:Make sure entity exists in world - catch of entity json is broken
        /*
        summon a test entity, test for it, then kill it
        set watchFor.validated
        */
        watchFor.validated = true;
        if (!watchFor.validated) {
            alertLog.error(`A ${pack.packName} Add-on entity file is broken`);
            return;
        }

        if (devDebug.debugOn) {
            devDebug.dsb.setDebug(true);
            devDebug.dsb_setup();
        }

        //Start testing for stalled entities every x min after y delay 
        if (watchFor.stalledCheckRunInterval) {
            system.runTimeout(() => {
                system.runInterval(() => {
                    stalledSpiderCheckAndFix();
                }, Ticks.perMinute * watchFor.stalledCheckRunInterval);
            }, Ticks.perMinute * watchFor.stalledCheckRunInterval);
        }

        if (watchFor.flyPopulationCheckRunInterval) {
            system.runTimeout(() => {
                system.runInterval(() => {
                    flyPopulationCheck();
                }, Ticks.perMinute * watchFor.flyPopulationCheckRunInterval);
            }, rndInt(Ticks.perMinute, Ticks.perMinute * watchFor.flyPopulationCheckRunInterval));
        }

        if (watchFor.spiderPopulationCheckRunInterval) {
            system.runTimeout(() => {
                system.runInterval(() => {
                    spiderPopulationCheck();
                }, Ticks.perMinute * watchFor.spiderPopulationCheckRunInterval);
            }, rndInt(Ticks.perSecond, Ticks.perMinute * watchFor.spiderPopulationCheckRunInterval));
        }

        alertLog.log('§8x function afterEvents_worldLoad()', debugFunctionsOn);
    });
}
//==============================================================================
/**
 * @summary events from scriptevent command in the spider entity json
 */
function afterEvents_scriptEventReceive () {
    alertLog.log('§v* function afterEvents_scriptEventReceive()', debugFunctionsOn);

    system.afterEvents.scriptEventReceive.subscribe((event) => {
        const { id, message, sourceEntity: entity } = event;

        if (!entity || !entity.isValid) return;
        if (!thisPackEntities.includes(entity.typeId)) return;

        system.runTimeout(() => {
            entityEventProcess(entity, id, message);
        }, 1);
    });

    alertLog.log('§8x function afterEvents_scriptEventReceive()', debugFunctionsOn);
}
//==============================================================================
function beforeEvents_startup () {
    alertLog.log('§v* function beforeEvents_startup()', debugFunctionsOn);

    system.beforeEvents.startup.subscribe((event) => {
        const ccr = event.customCommandRegistry;
        registerCustomCommands(ccr);
    });

    alertLog.log('§8x function beforeEvents_startup()', debugFunctionsOn);
}
//==============================================================================
//==============================================================================
function beforeEvents_playerInteractWithBlock () {
    
    world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
        event.cancel = false;
        if (!event.isFirstEvent) return;
        alertLog.log('>> world.beforeEvents.playerInteractWithBlock.subscribe((event)',debugSubscriptionsOn);
        const { block, itemStack } = event;
        if (!itemStack || !block) return;

        if (watchFor.customItemList.includes(itemStack.typeId)) {
            rattleEntityFromBlockWithItem(block, itemStack.typeId, event.blockFace);
            return;
        }

        //Add Other stuff if needed
        return;
    });
}
//==============================================================================
function afterEvents_playerPlaceBlock () {
    world.afterEvents.playerPlaceBlock.subscribe((event) => {

        if (!chance(0.50)) return;
        const { block } = event;
        if (!block.isValid) return;
        const { typeId, dimension, location } = block;
        const locationCtr = Vector3Lib.toCenter(location);

        if (typeId === 'minecraft:web') {
            const entityId = chance(0.5) ? watchFor.typeId : watchFor.egg_typeId;
            const max = entityId == watchFor.egg_typeId ? 1 : 2;
            spawnEntityAtLocation(entityId, dimension, locationCtr, 1, max, 40, 100);
            return;
        }

        if (typeId === 'minecraft:composter') {
            const above = block.above();
            if (!above || !above.isValid || above.typeId !== airBlock) return;
            spawnEntityAtLocation(watchFor.fly_typeId, dimension, locationCtr, 3, 6, 40, 200);
            return;
        }

        if (typeId === 'dw623:rotten_flesh_block') {
            //TODO: needs to be block face location
            const above = block.above();
            if (!above || !above.isValid || above.typeId !== airBlock) return;
            spawnEntityAtLocation(watchFor.fly_typeId, dimension, locationCtr, 1, 2, 40, 200);
            return;
        }
        //========================    Less Likely
        if (!chance(0.75)) return;
        //========================    Less Likely

        if (typeId === 'minecraft:cauldron') {
            const above = block.above();
            if (!above || !above.isValid || above.typeId !== airBlock) return;
            const entityId = chance(0.6) ? watchFor.typeId : watchFor.fly_typeId;
            const maxEntities = entityId===watchFor.typeId ? 1 : 3
            spawnEntityAtLocation(entityId, dimension, locationCtr, 1, maxEntities, 40, 200);
            return;
        }

        if (validNatureBlockForSpiders(typeId)) {         
            spawnEntityAtLocation(watchFor.typeId, dimension, locationCtr, 1, 1, 40, 200);            
            return;
        }
    });
}
//==============================================================================
export function subscriptionsStable () {
    alertLog.log('§v* function subscriptionsStable ()', debugFunctionsOn);

    beforeEvents_startup();
    afterEvents_worldLoad();

    //This is vital to outside tree_spider.json
    afterEvents_scriptEventReceive();

    entitySubscriptions.setup();
    if (devDebug.debugOn) entityDebugSubscriptions.setup();

    //TODO: test
    //Chance to have spiders/spider-egg spawn if firefly_bush
    //Chance to have flies spawn if composter
    afterEvents_playerPlaceBlock();

    //FIXME:Interact with certain blocks with a stick can have a spider scurry out of it
    // not working or maybe is, cannot swing, so looks weird, have to make own things to do this.
    //afterEvents_playerInteractWithBlock();
    beforeEvents_playerInteractWithBlock();

    alertLog.log('§8x function subscriptionsStable ()', debugFunctionsOn);
}
//==============================================================================
// End of File
//==============================================================================