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
import { world, system } from "@minecraft/server";
//Enums
import { EntityInitializationCause } from "@minecraft/server";
//Subscriptions
// import { PlayerBreakBlockAfterEvent, PlayerBreakBlockAfterEventSignal } from "@minecraft/server";
// import { PlayerInteractWithBlockAfterEvent, PlayerInteractWithBlockAfterEventSignal } from "@minecraft/server";
// import { PlayerInteractWithBlockBeforeEvent, PlayerInteractWithBlockBeforeEventSignal } from "@minecraft/server";
//import { PlayerPlaceBlockAfterEvent, PlayerPlaceBlockAfterEventSignal } from "@minecraft/server";
//Shared
import { Ticks } from "./common-data/globalConstantsLib.js";
import { chance } from "./common-other/mathLib.js";
import { DynamicPropertyLib } from "./common-stable/dynamicPropertyClass.js";
import { EntityLib, spawnEntityAtLocation } from "./common-stable/entityClass.js";
import { Vector3Lib } from "./common-other/vectorClass.js";
//Local
import { alertLog, pack, watchFor, entityDynamicVars } from './settings.js';
import { registerCustomCommands } from "./chatCmds.js";
import { rattleEntityFromBlockWithItem, validNatureBlockForSpiders } from './helpers/fn-blocks.js';
import { devDebug } from "./helpers/fn-debug.js";
import { entityEventProcess, lastTickAndLocationRegister, stalledSpiderCheckAndFix, flyPopulationCheck, spiderPopulationCheck, entityScriptEvents, } from './helpers/fn-entities.js';
import { airBlock, stairBlocks } from "./common-data/block-data.js";
import { getWorldTime } from "./common-stable/timers.js";
//import { ScoreboardLib } from "./common-stable/scoreboardClass.js";

//==============================================================================
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** The function type subscribe expects. */
//  Entities
/** @typedef {Parameters<typeof world.afterEvents.entityDie.subscribe>[0]} AfterEntityDieHandler */
/** @typedef {Parameters<typeof world.afterEvents.entityLoad.subscribe>[0]} AfterEntityLoadHandler */
/** @typedef {Parameters<typeof world.afterEvents.entityRemove.subscribe>[0]} AfterEntityRemovedHandler */
/** @typedef {Parameters<typeof world.afterEvents.entitySpawn.subscribe>[0]} AfterEntitySpawnHandler */
/** @typedef {Parameters<typeof world.beforeEvents.entityRemove.subscribe>[0]} BeforeEntityRemovedHandler */
//  Blocks
/** @typedef {Parameters<typeof world.beforeEvents.playerInteractWithBlock.subscribe>[0]} BeforePlayerInteractWithBlockHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerBreakBlock.subscribe>[0]} AfterPlayerBreakBlockHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerPlaceBlock.subscribe>[0]} AfterPlayerPlaceBlockHandler */
// System
/** @typedef {Parameters<typeof system.afterEvents.scriptEventReceive.subscribe>[0]} AfterScriptEventReceiveHandler */
/** @typedef {Parameters<typeof system.beforeEvents.startup.subscribe>[0]} BeforeStartupHandler */

/** The stored handle type (Bedrock returns the function reference). */
//  Entities
/** @typedef {ReturnType<typeof world.afterEvents.entityDie.subscribe>} AfterEntityDieHandle */
/** @typedef {ReturnType<typeof world.afterEvents.entityLoad.subscribe>} AfterEntityLoadHandle */
/** @typedef {ReturnType<typeof world.afterEvents.entityRemove.subscribe>} AfterEntityRemovedHandle */
/** @typedef {ReturnType<typeof world.afterEvents.entitySpawn.subscribe>} AfterEntitySpawnHandle */
/** @typedef {ReturnType<typeof world.beforeEvents.entityRemove.subscribe>} BeforeEntityRemovedHandle */
//  Blocks
/** @typedef {ReturnType<typeof world.beforeEvents.playerInteractWithBlock.subscribe>} BeforePlayerInteractWithBlockHandle */
/** @typedef {ReturnType<typeof world.afterEvents.playerBreakBlock.subscribe>} AfterPlayerBreakBlockHandle */
/** @typedef {ReturnType<typeof world.afterEvents.playerPlaceBlock.subscribe>} AfterPlayerPlaceBlockHandle */
// system
/** @typedef {ReturnType<typeof system.afterEvents.scriptEventReceive.subscribe>} AfterScriptEventReceiveHandle */
/** @typedef {ReturnType<typeof system.beforeEvents.startup.subscribe>} BeforeStartupHandle */

//==============================================================================
const debugOn = false || devDebug.debugOn;
const debugFunctionsOn = false || devDebug.debugFunctionsOn;
const debugSubscriptionsOn = devDebug.debugSubscriptionsOn;
const watchEntitySubscriptions = devDebug.watchEntitySubscriptions;
const watchBlockSubscriptions = devDebug.watchBlockSubscriptions;
const watchPlayerActions = devDebug.watchPlayerActions;
//TODO: convert to using new classes - remember the turn off part too
//==============================================================================
const blockSubscriptions = {
    _name: 'blockSubscriptions',
    //============
    // To override All
    debugMe: false,
    watchMe: false,
    //============
    beforePlayerInteract: {
        _name: 'blockSubscriptions.beforePlayerInteract',
        _subscription: 'world.beforeEvents.playerInteractWithBlock',
        //============
        // To override This
        debugMe: false,
        watchMe: false,
        //============
        on: false,
        /** @type {BeforePlayerInteractWithBlockHandle | null} */
        handler: null,

        subscribe (debug = false, watch = false) {
            const debugMe = debug || this.debugMe;
            const watchMe = watch || this.watchMe;
            alertLog.log(`* ${this._name}.subscribe ()`, debugFunctionsOn);
            if (this.on) return;

            /** @type {BeforePlayerInteractWithBlockHandler} */
            const fn = (event) => {
                event.cancel = false;

                if (!event.isFirstEvent) return;
                const { block, itemStack } = event;
                if (!itemStack || !block) return;
                alertLog.success(`>> ${this._subscription}.subscribe(event) passed isFirstEvent and itemStack tests`, watchMe);

                if (watchFor.customItemList.includes(itemStack.typeId)) {
                    alertLog.success(`>> ${this._subscription}.subscribe(event) passed customItemList test`, watchMe);
                    rattleEntityFromBlockWithItem(block, itemStack.typeId, event.blockFace, 0.6);
                    return;
                }

                //Add Other stuff if needed
                return;
            };

            this.handler = world.beforeEvents.playerInteractWithBlock.subscribe(fn);
            this.on = true;
            alertLog.success(`§aSubscribed to ${this._subscription}`, debugMe);
        },
        unsubscribe () {
            alertLog.warn(`* ${this._name}.unsubscribe ()`);  //Should not happen 
            if (!this.on) return;

            if (this.handler) {
                world.beforeEvents.playerInteractWithBlock.unsubscribe(this.handler);
                this.handler = null;
                alertLog.success(`§aUnsubscribed to ${this._subscription}`);
            }
            this.on = false;
        }
    },
    afterPlayerBreak: {
        _name: 'blockSubscriptions.afterPlayerBreak',
        _subscription: 'world.afterEvents.playerBreakBlock',
        //============
        // To override This
        debugMe: false,
        watchMe: false,
        //============
        on: false,
        /** @type {AfterPlayerBreakBlockHandle | null} */
        handler: null,

        subscribe (debug = false, watch = false) {
            const debugMe = debug || this.debugMe;
            const watchMe = watch || this.watchMe;
            alertLog.log(`* ${this._name}.subscribe ()`, debugFunctionsOn);
            if (this.on) return;

            /** @type {string[]} */
            const watchForBlockTypes_spiders = [
                watchFor.spider_home_typeId,
                watchFor.spider_foodBlock_typeId,
                "minecraft:cauldron",
                ...watchFor.target_leaves,
                ...watchFor.target_nature,
                ...stairBlocks,
            ];

            /** @type {string[]} */
            const watchForBlockTypes_flies = [
                watchFor.fly_home_typeId,
                ...watchFor.fly_food_blocks
            ];

            const watchForBlockTypes = [ ...watchForBlockTypes_spiders ]
                .concat(watchForBlockTypes_flies);

            /** @type {AfterPlayerBreakBlockHandler} */
            const fn = (event) => {
                if (!chance(0.15)) return; //25% chance to spawn pests

                const { block, dimension, brokenBlockPermutation, itemStackBeforeBreak } = event;
                const blockTypeId = brokenBlockPermutation.type.id;
                const location = block.location;

                alertLog.success(`>> ${this._subscription}.subscribe(${brokenBlockPermutation}, ${itemStackBeforeBreak})`, watchMe);

                if (watchForBlockTypes_flies.includes(blockTypeId)) {
                    spawnEntityAtLocation(watchFor.fly_typeId, dimension, location, 1, 3, 1, 10);
                    return;
                }

                if (watchForBlockTypes_spiders.includes(blockTypeId)) {
                    spawnEntityAtLocation(watchFor.spider_typeId, dimension, location, 1, 1, 1, 20);
                    return;
                }
                return;
            };

            this.handler = world.afterEvents.playerBreakBlock.subscribe(fn, { blockTypes: watchForBlockTypes });
            this.on = true;
            alertLog.success(`§aSubscribed to ${this._subscription}`, debugMe);
        },
        unsubscribe () {
            alertLog.warn(`* ${this._name}.unsubscribe ()`);  //Should not happen 
            if (!this.on) return;

            if (this.handler) {
                world.afterEvents.playerBreakBlock.unsubscribe(this.handler);
                this.handler = null;
                alertLog.success(`§aUnsubscribed to ${this._subscription}`);
            }
            this.on = false;
        }
    },
    afterPlayerPlace: {
        _name: 'afterEvents.playerPlaceBlock',
        _subscription: 'world.afterEvents.playerPlaceBlock',
        //============
        // To override ON
        debugMe: false,
        watchMe: false,
        //============
        on: false,
        /** @type {AfterPlayerPlaceBlockHandle | null} */
        handler: null,

        subscribe (debug = false, watch = false) {
            const debugMe = debug || this.debugMe;
            const watchMe = watch || this.watchMe;
            alertLog.log(`* ${this._name}.subscribe ()`, debugFunctionsOn);
            if (this.on) return;

            /** @type {AfterPlayerPlaceBlockHandler} */
            const fn = (event) => {
                if (!chance(0.50)) return;

                const { block } = event;
                if (!block.isValid) return;
                const { typeId, dimension, location } = block;
                const locationCtr = Vector3Lib.toCenter(location);

                if (typeId === watchFor.fly_home_typeId) {
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
                if (chance(0.75)) return;
                //========================    Less Likely
                if (typeId === watchFor.spider_home_typeId) {
                    const entityId = chance(0.5) ? watchFor.spider_typeId : watchFor.egg_typeId;
                    const max = entityId == watchFor.egg_typeId ? 1 : 2;
                    spawnEntityAtLocation(entityId, dimension, locationCtr, 1, max, 40, 100);
                    return;
                }

                if (typeId === 'minecraft:cauldron') {
                    const above = block.above();
                    if (!above || !above.isValid || above.typeId !== airBlock) return;
                    const entityId = chance(0.6) ? watchFor.spider_typeId : watchFor.fly_typeId;
                    const maxEntities = entityId === watchFor.spider_typeId ? 1 : 3;
                    spawnEntityAtLocation(entityId, dimension, locationCtr, 1, maxEntities, 40, 200);
                    return;
                }

                if (validNatureBlockForSpiders(typeId)) {
                    spawnEntityAtLocation(watchFor.spider_typeId, dimension, locationCtr, 1, 1, 40, 200);
                    return;
                }
            };

            this.handler = world.afterEvents.playerPlaceBlock.subscribe(fn);
            this.on = true;
            alertLog.success(`§aSubscribed to ${this._name}`, debugMe);
        },
        unsubscribe () {
            alertLog.warn(`* ${this._name}.unsubscribe ()`);  //Should not happen 
            if (!this.on) return;

            if (this.handler) {
                world.afterEvents.playerPlaceBlock.unsubscribe(this.handler);
                this.handler = null;
                alertLog.success(`§aUnsubscribed to ${this._subscription}`);
                this.on = false;
            }
        }
    },
    allOff () {
        alertLog.log(`* const ${this._name}.allOff ()`, debugFunctionsOn);
        this.beforePlayerInteract.unsubscribe();
        this.afterPlayerBreak.unsubscribe();
        this.afterPlayerPlace.unsubscribe();
    },
    setup (debug = false, watch = false) {
        const debugMe = debug || this.debugMe;
        const watchMe = watch || this.watchMe;
        alertLog.log(`"* const ${this._name}.setup ()"`, debugFunctionsOn);
        this.beforePlayerInteract.subscribe(debugMe, watchMe || watchPlayerActions);
        this.afterPlayerBreak.subscribe(debugMe, watchMe || watchPlayerActions);
        this.afterPlayerPlace.subscribe(debugMe, watchMe || watchPlayerActions);
    }
};
//==============================================================================
const entityDebugSubscriptions = {
    _name: 'entityDebugSubscriptions',
    //============
    // To override
    debugMe: false,
    watchMe: false,
    //============
    // There is also an afterEvents.entitySpawn, but it has beta elements, so still in beta files - may delete, not useful
    afterEntityDie: {
        _name: 'blockSubscriptions.beforePlayerInteract',
        _subscription: 'world.beforeEvents.playerInteractWithBlock',
        //============
        // To override This
        debugMe: false,
        watchMe: false,
        //============
        on: false,
        /** @type {AfterEntityDieHandle | null} */
        handler: null,

        subscribe (debug = false, watch = false) {
            const debugMe = debug || this.debugMe;
            const watchMe = watch || this.watchMe;
            alertLog.log(`* ${this._name}.subscribe ()`, debugFunctionsOn);
            if (this.on) return;

            /** @type {AfterEntityDieHandler} */
            const fn = (event) => {
                const entity = event.deadEntity;
                const { nameTag, dimension, location } = entity;
                const whyDied = event.damageSource.cause;
                const msg = `§r§l${nameTag ? nameTag : "No-Name"}§r §c Died via ${whyDied} @ ${Vector3Lib.toString(location, 0, true)} -§r afterEvents.entityDie ()`;
                alertLog.warn(msg, watch);
                system.runTimeout(() => {
                    const x = `die: §c${whyDied}`;
                    devDebug.dsb.increment('deaths', x);
                    devDebug.dsb.increment('stats', x);
                }, 1);
            };

            this.handler = world.afterEvents.entityDie.subscribe(fn, { entityTypes: [ watchFor.spider_typeId ] });
            this.on = true;
            alertLog.success(`§aSubscribed to ${this._subscription}`, debugMe);
        },
        unsubscribe () {
            alertLog.warn(`* ${this._name}.unsubscribe ()`);  //Should not happen 
            if (!this.on) return;

            if (this.handler) {
                world.afterEvents.entityDie.unsubscribe(this.handler);
                this.handler = null;
                alertLog.success(`§aUnsubscribed to ${this._subscription}`);
            }
            this.on = false;
        }
    },
    //Not Used - because redundant = and every entity when more efficient for scriptEvent inside entity to do it
    //But keep in case they ever get rid of scriptEvent... we will need this for debugging and naming
    afterEntitySpawn: {
        _name: 'entityDebugSubscriptions.afterEntitySpawn',
        _subscription: 'world.afterEvents.entitySpawn',
        //============
        // To override
        debugMe: false,
        watchMe: false,
        //============
        on: false,
        /** @type {AfterEntitySpawnHandle | null} */
        handler: null,

        subscribe (debug = false, watch = false) {
            const debugMe = debug || this.debugMe;
            const watchMe = watch || this.watchMe;
            alertLog.log(`* ${this._name}.subscribe ()`, debugFunctionsOn);
            if (this.on) return;

            /** @type {AfterEntitySpawnHandler} */
            const fn = (event) => {
                const entity = event.entity;
                if (!entity) return;
                if (entity.typeId !== watchFor.spider_typeId) return;

                const { dimension, location, nameTag } = entity;

                system.runTimeout(() => {
                    const msg = `§aEntity Spawned (${event.cause}) in Biome ${dimension.getBiome(location).id}: §l${nameTag}§r§6 @ ${Vector3Lib.toString(location, 0, true)}`;
                    alertLog.log(msg, watchMe);

                    if (event.cause === EntityInitializationCause.Born) {
                        devDebug.dsb.increment('stats', 'born', 1, 1);
                        DynamicPropertyLib.add(entity, entityDynamicVars.entityBorn, 1);
                    }
                    else if (event.cause === EntityInitializationCause.Loaded) {
                        devDebug.dsb.increment('stats', 'loaded', 1, 1);
                        DynamicPropertyLib.add(entity, entityDynamicVars.entityLoads, 1);
                    }
                    else if (event.cause === EntityInitializationCause.Spawned) {
                        devDebug.dsb.increment('stats', 'spawned');
                        DynamicPropertyLib.add(entity, entityDynamicVars.entitySpawns, 1);
                    }
                }, 1);
            };

            this.handler = world.afterEvents.entitySpawn.subscribe(fn);
            this.on = true;
            alertLog.success(`§aSubscribed to ${this._subscription}`, debugMe);
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
    beforeEntityRemove: {
        _name: 'entityDebugSubscriptions.beforeEntityRemove',
        _subscription: 'world.beforeEvents.entityRemove',
        //============
        // To override This
        debugMe: false,
        watchMe: false,
        //============
        on: false,
        /** @type {BeforeEntityRemovedHandle | null} */
        handler: null,

        subscribe (debug = false, watch = false) {
            const debugMe = debug || this.debugMe;
            const watchMe = watch || this.watchMe;
            alertLog.log(`* ${this._name}.subscribe ()`, debugFunctionsOn);
            if (this.on) return;

            /** @type {BeforeEntityRemovedHandler} */
            const fn = (event) => {
                // Note: "removed" doesn't necessarily mean "died"
                if (!event.removedEntity || event.removedEntity.typeId !== watchFor.spider_typeId) return;

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
                        const player = players[ 0 ];
                        if (player && player.isValid) {
                            const playerLocation = players[ 0 ].location;
                            delta = `§bClosest Player x: ${Math.round(Math.abs(location.x - playerLocation.x))}, y:${Math.round(Math.abs(location.y - playerLocation.y))}, z:${Math.round(Math.abs(location.z - playerLocation.z))}`;
                        }
                    }

                    const msg = `§l${nameTag}§r §6Removed @ ${Vector3Lib.toString(location, 0, true)} ${delta}§r(${isUnLoaded ? '' : ' loaded'}(${isStalled ? ' stalled' : ''})- beforeEvents.entityRemove()`;
                    alertLog.log(msg, watchMe);

                }, 1);
            };
            this.handler = world.beforeEvents.entityRemove.subscribe(fn);
            this.on = true;
            alertLog.success(`§aSubscribed to ${this._subscription}`, debugMe);
        },
        unsubscribe () {
            alertLog.warn(`* ${this._name}.unsubscribe ()`);  //Should not happen 
            if (!this.on) return;

            if (this.handler) {
                world.beforeEvents.entityRemove.unsubscribe(this.handler);
                this.handler = null;
                alertLog.success(`§aUnsubscribed to ${this._subscription}`);
            }
            this.on = false;
        }
    },
    allOff () {
        alertLog.log(`* const ${this._name}.allOff ()`, debugFunctionsOn);
        this.afterEntityDie.unsubscribe();
        this.afterEntitySpawn.unsubscribe();
        this.beforeEntityRemove.unsubscribe();
    },
    allOn () {
        alertLog.log(`* const ${this._name}.allOn ()`, debugFunctionsOn);
        this.afterEntityDie.subscribe();
        //this.afterEntitySpawn.subscribe();
        this.beforeEntityRemove.subscribe();
    },
    setup (debug = false, watch = false) {
        alertLog.log(`* const ${this._name}.setup ()`, debugFunctionsOn);
        this.afterEntityDie.subscribe(debug || this.debugMe, watch || this.watchMe);

        //this.afterEntityRemove.subscribe(); //not needed and redundant to beforeEntityRemove
        //this.afterEntitySpawn.subscribe(); // this is called load/born/spawn  - events are taking care of born/spawn

        this.beforeEntityRemove.subscribe(debug || this.debugMe, watch || this.watchMe);
    }
};
//==============================================================================
const entitySubscriptions = {
    _name: 'entitySubscriptions',
    //============
    // To override
    debugMe: false,
    watchMe: false,
    //============    
    afterEntityLoad: {
        _name: 'entitySubscriptions.afterEntityLoad',
        _subscription: 'world.afterEvents.entityLoad',
        //============
        // To override
        debugMe: false,
        watchMe: true,
        //============
        on: false,
        /** @type {AfterEntityLoadHandle | null} */
        handler: null,

        subscribe (debug = false, watch = false) {
            const debugMe = debug || this.debugMe;
            const watchMe = watch || this.watchMe;
            alertLog.log(`* ${this._name}.subscribe ()`, debugFunctionsOn);
            if (this.on) return;

            /** @type {AfterEntityLoadHandler} */
            const fn = (event) => {
                const entity = event.entity;

                if (!entity || !entity.isValid) return;
                if (entity.typeId !== watchFor.spider_typeId) return;

                const { dimension, location, nameTag } = entity;

                if (nameTag) {
                    //means re-load???
                    system.runTimeout(() => {
                        lastTickAndLocationRegister(entity); //This is the most needed part...
                        if (watchMe) {
                            DynamicPropertyLib.add(entity, entityDynamicVars.entityLoads, 1);
                            devDebug.dsb.increment('stats', 'loaded');
                            const msg = `§l${nameTag}§r §eLoaded in Biome ${dimension.getBiome(location).id} @ ${Vector3Lib.toString(location, 0, true)} §r- ${this._subscription}()`;
                            alertLog.log(msg, watchEntitySubscriptions);
                        }
                        const isBaby = entity.hasComponent('minecraft:is_baby');
                        if (entity.isValid) entity.triggerEvent(isBaby ? entityScriptEvents.baby_spider_loadedEventName : entityScriptEvents.spider_loadedEventName);
                    }, 1);
                }
            };

            this.handler = world.afterEvents.entityLoad.subscribe(fn);
            this.on = true;
            alertLog.success(`§aSubscribed to ${this._subscription}`, debugMe);
        },
        unsubscribe () {
            alertLog.warn(`* ${this._name}.unsubscribe ()`);  //Should not happen             
            if (!this.on) return;

            if (this.handler) {
                world.afterEvents.entityLoad.unsubscribe(this.handler);
                this.handler = null;
                alertLog.success(`§aUnsubscribed to ${this._subscription}`);
            }
            this.on = false;
        }
    },
    allOff () {
        alertLog.log(`* const ${this._name}.allOff ()`, debugFunctionsOn);
        this.afterEntityLoad.unsubscribe();
    },
    setup (debug = false, watch = false) {
        const debugMe = debug || this.debugMe;
        const watchMe = watch || this.watchMe;
        alertLog.log(`"* const ${this._name}.setup ()"`, debugFunctionsOn);
        this.afterEntityLoad.subscribe(debugMe, watchMe);
    }
};
//==============================================================================
const systemSubscriptions = {
    _name: 'systemSubscriptions',
    //============
    // To override
    debugMe: false,
    watchMe: false,
    //============        
    afterScriptEvent: {
        _name: 'systemSubscriptions.afterScriptEvent',
        _subscription: 'system.afterEvents.scriptEventReceive',
        //============
        // To override This
        debugMe: false,
        watchMe: false,
        //============
        on: false,
        /** @type {AfterScriptEventReceiveHandle | null} */
        handler: null,

        subscribe (debug = false, watch = false) {
            const debugMe = debug || this.debugMe;
            const watchMe = watch || this.watchMe;
            alertLog.log(`* ${this._name}.subscribe ()`, debugFunctionsOn);
            if (this.on) return;

            /** @type {AfterScriptEventReceiveHandler} */
            const fn = (event) => {
                const { id, message, sourceEntity: entity } = event;

                if (!entity || !entity.isValid) {
                    alertLog.warn(`>> ${this._subscription} event with invalid entity`, debugMe);
                    return;
                };
                if (!watchFor.packEntityList().includes(entity.typeId)) {
                    alertLog.warn(`>> ${this._subscription} event with non-pack entity typeId: ${entity.typeId}`, debugMe);
                    return;
                };

                system.runTimeout(() => {
                    entityEventProcess(entity, id, message);
                }, 1);
            };

            this.handler = system.afterEvents.scriptEventReceive.subscribe(fn);
            this.on = true;
            alertLog.success(`§aSubscribed to ${this._subscription}`, debugMe);
        },
        unsubscribe () {
            alertLog.warn(`* ${this._name}.unsubscribe ()`);  //Should not happen 
            if (!this.on) return;

            if (this.handler) {
                system.afterEvents.scriptEventReceive.unsubscribe(this.handler);
                this.handler = null;
                alertLog.success(`§aUnsubscribed to ${this._subscription}`);
            }
            this.on = false;
        }
    },
    beforeStartup: {
        _name: 'systemSubscriptions.beforeStartup',
        _subscription: 'system.beforeEvents.startup',
        //============
        // To override This
        debugMe: false,
        watchMe: false,
        //============
        on: false,
        /** @type {BeforeStartupHandle | null} */
        handler: null,

        subscribe (debug = false, watch = false) {
            const debugMe = debug || this.debugMe;
            const watchMe = watch || this.watchMe;
            alertLog.log(`* ${this._name}.subscribe ()`, debugFunctionsOn);
            if (this.on) return;

            /** @type {BeforeStartupHandler} */
            const fn = (event) => {
                const ccr = event.customCommandRegistry;
                registerCustomCommands(ccr);
            };

            this.handler = system.beforeEvents.startup.subscribe(fn);
            this.on = true;
            alertLog.success(`§aSubscribed to ${this._subscription}`, debugMe);
        },
        unsubscribe () {
            alertLog.warn(`* ${this._name}.unsubscribe ()`);  //Should not happen 
            if (!this.on) return;

            if (this.handler) {
                system.beforeEvents.startup.unsubscribe(this.handler);
                this.handler = null;
                alertLog.success(`§aUnsubscribed to ${this._subscription}`);
            }
            this.on = false;
        }
    },
    allOff () {
        alertLog.log(`* const ${this._name}.allOff ()`, this.debugMe || debugFunctionsOn);
        this.afterScriptEvent.unsubscribe();
        this.beforeStartup.unsubscribe();
    },
    setup (debug = false, watch = false) {
        const debugMe = debug || this.debugMe;
        const watchMe = watch || this.watchMe;
        alertLog.log(`"* const ${this._name}.setup ()"`, debugFunctionsOn);
        this.afterScriptEvent.subscribe(debugMe, watchMe);
        this.beforeStartup.subscribe(debugMe, watchMe);
    }
};
//==============================================================================
//move to fn-entities later?
function validateEntityFiles (debugMe = false) {
    const _name = 'function validateEntityFiles';
    alertLog.log(`§v* ${_name} ()`, debugFunctionsOn);

    //find any player and get a location at head    
    const players = world.getAllPlayers();
    const anyPlayer = players.length ? players[ 0 ] : null;

    const dimension = anyPlayer ? anyPlayer.dimension : world.getDimension("overworld");
    const location = anyPlayer ? anyPlayer.location : world.getDefaultSpawnLocation();
    location.y += 24;

    watchFor.validated = true;
    watchFor.packEntityList().forEach(typeId => {
        pack.validatedEntities.set(typeId, false);

        //@ts-expect-error
        const entity = dimension.spawnEntity(typeId, location, { initialPersistence: true, spawnEvent: entityScriptEvents.entity_validatedEventName });
        if (entity) {
            alertLog.success(`Entity spawn validated for typeId: ${typeId} - isValid: ${entity.isValid}`, debugMe);
            pack.validatedEntities.set(typeId, true);
            system.runTimeout(() => {
                if (entity.isValid) {
                    //entity.applyImpulse({x:0,y:10,z:0})
                    entity.remove();
                }
            }, 10);
        }
        else {
            watchFor.validated = false;
            alertLog.error(`Entity spawn failed for typeId: ${typeId}`, debugOn);
        }
    });

    if (!watchFor.validated) {
        alertLog.error(`A ${pack.packName} §lAdd-on entity file is broken or missing. Please fix the issue before using this pack.`);
        blockSubscriptions.allOff();
        entitySubscriptions.allOff();
        systemSubscriptions.allOff();
        entityDebugSubscriptions.allOff();
        devDebug.allOff();
        return;
    }

    //OKAY to install interval Jobs now
    system.runTimeout(() => {
        if (watchFor.stalledCheckRunInterval) {
            alertLog.log(`Starting stalled spider check every ${watchFor.stalledCheckRunInterval} minutes`, debugMe);
            system.runInterval(() => {
                stalledSpiderCheckAndFix();
            }, Ticks.perMinute * Math.abs(watchFor.stalledCheckRunInterval));
        }
        else alertLog.warn(`Stalled spider check interval is set to 0 - not running check`, debugMe);

        if (watchFor.flyPopulationCheckRunInterval) {
            alertLog.log(`Starting fly population check every ${watchFor.flyPopulationCheckRunInterval} minutes`, debugMe);
            system.runInterval(() => {
                flyPopulationCheck();
            }, Ticks.perMinute * Math.abs(watchFor.flyPopulationCheckRunInterval));
        }
        else alertLog.warn(`Fly population check interval is set to 0 - not running check`, debugMe);

        if (watchFor.spiderPopulationCheckRunInterval) {
            alertLog.log(`Starting spider population check every ${watchFor.spiderPopulationCheckRunInterval} minutes`, debugMe);
            system.runInterval(() => {
                spiderPopulationCheck();
            }, Ticks.perMinute * Math.abs(watchFor.spiderPopulationCheckRunInterval));
        }
        else alertLog.warn(`Spider population check interval is set to 0 - not running check`, debugMe);

        if (watchFor.eatFireFliesOnlyAtNight) {
            alertLog.log(`Starting daytime removal of Fire Flies minecraft hour`, debugMe);
            system.runInterval(() => {
                const hourOfDay = getWorldTime().hours;
                if (hourOfDay > 7 && hourOfDay < 15) {
                    const fireflies = EntityLib.getAllEntities({ type: watchFor.firefly_typeId });
                    if (fireflies.length) { fireflies.forEach(e => { if (e.isValid) e.remove(); }); }
                }
            }, Ticks.minecraftHour * 1);
        }
        else alertLog.log(`Fireflies allowed in daytime`, debugMe);

    }, 5);
}
//==============================================================================
export function subscriptionsStable () {
    const _name = 'function subscriptionsStable';
    alertLog.log(`§v* ${_name} ()`, debugFunctionsOn);

    systemSubscriptions.beforeStartup.subscribe(debugSubscriptionsOn, false);
    systemSubscriptions.afterScriptEvent.subscribe(debugSubscriptionsOn && watchEntitySubscriptions, watchEntitySubscriptions);
    entitySubscriptions.setup(debugSubscriptionsOn && watchEntitySubscriptions, watchEntitySubscriptions);
    blockSubscriptions.setup(debugSubscriptionsOn && watchBlockSubscriptions, watchBlockSubscriptions);

    world.afterEvents.worldLoad.subscribe((event) => {
        pack.worldLoaded = true;
        alertLog.success(`Subscribed to world.afterEvents.worldLoad`, debugSubscriptionsOn);

        if (debugOn) {
            entityDebugSubscriptions.setup(debugSubscriptionsOn && watchEntitySubscriptions, watchEntitySubscriptions);
            devDebug.dsb.setDebug(true);
            devDebug.dsb_setup();
        }

        system.runTimeout(() => {
            validateEntityFiles(devDebug.watchEntitySubscriptions);
        }, Ticks.perSecond * 60);

    });

    alertLog.log(`'§8x ${_name} ()'`, debugFunctionsOn);
}
//==============================================================================
// End of File
//==============================================================================