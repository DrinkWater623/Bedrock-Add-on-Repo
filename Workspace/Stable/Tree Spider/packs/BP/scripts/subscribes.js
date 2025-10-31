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
import { world, system, EntityInitializationCause } from "@minecraft/server";
import { alertLog, pack, watchFor, dynamicVars } from './settings.js';
import { enterWeb, expandWeb, placeWeb, newEgg, lastTickRegister, stalledEntityCheckAndFix, welcomeBack, makeSpiderName } from './fn-stable.js';
import { Ticks } from "./common-data/globalConstantsLib.js";
import { DynamicPropertyLib } from "./common-stable/dynamicPropertyClass.js";
import { Vector3Lib } from "./common-stable/vectorClass.js";
import { registerCustomCommands } from "./chatCmds.js";
import * as debug from "./fn-debug.js";

import { ScoreboardLib } from "./common-stable/scoreboardClass.js";
//==============================================================================
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
const debugFunctions = false;
const debugSubscribes = true;
//==============================================================================
// This part was created this way, so that I can subscribe/unsubscribe via commands - used only for debug/testing
export const debugSubscriptions = {
    // There is also an afterEvents.entitySpawn, but it has beta elements, so still in beta files - may delete, not useful
    afterEntityDie: {
        on: false,
        /** @type {AfterEntityDieHandle | null} */
        handler: null,

        subscribe () {
            if (this.on) return;
            alertLog.log("* debugSubscriptions.afterEntityDie.subscribe ()", debugFunctions);

            /** @type {AfterEntityDieHandler} */
            const fn = (event) => {
                const entity = event.deadEntity;
                const entityName = entity.nameTag;
                const whyDied = event.damageSource.cause;
                var msg = '';

                msg = `§9§lSpider ${entityName ? entityName : "No-Name"} Died via §c${whyDied}`;
                alertLog.log(msg, debug.dev.debug);

                system.runTimeout(() => {
                    debug.debugScoreboards.sbStatsScoreboard?.addScore(debug.debugScoreboards.died, 1);
                    debug.debugScoreboards.sbEntitiesScoreboard?.removeParticipant(entity);
                    if (entityName)
                        debug.debugScoreboards.sbEntitiesScoreboard?.removeParticipant(entityName);
                }, 1);
            };

            this.handler = world.afterEvents.entityDie.subscribe(fn, { entityTypes: [ watchFor.typeId ] });
            this.on = true;
            alertLog.success("§aInstalled afterEvents.entityDie §4(debug mode)", debugSubscribes);
        },
        unsubscribe () {
            alertLog.warn("* debugSubscriptions.afterEntityDie.unsubscribe ()", debugFunctions);
            if (!this.on) return;

            if (this.handler) {
                world.afterEvents.entityDie.unsubscribe(this.handler);
                this.handler = null;
                alertLog.success("§aUninstalled afterEvents.entityDie)", debugSubscribes);
            }
            this.on = false;
        }
    },
    afterEntityLoad: {
        on: false,
        /** @type {AfterEntityLoadHandle | null} */
        handler: null,

        subscribe () {
            if (this.on) return;
            alertLog.log("* debugSubscriptions.afterEntityLoad.subscribe ()", debugFunctions);

            /** @type {AfterEntityLoadHandler} */
            const fn = (event) => {
                if (!event.entity) return;
                if (event.entity.typeId !== watchFor.typeId) return;

                const entity = event.entity;

                lastTickRegister(entity); //This is the most needed part...
                DynamicPropertyLib.add(entity, dynamicVars.entityLoads, 1);

                system.run(() => {
                    if (entity.typeId == watchFor.typeId && !entity.nameTag) {
                        const myName = makeSpiderName();
                        if (myName) {
                            entity.nameTag = myName;
                            alertLog.log(`§aNamed §l${myName}§r in §aAfterEvents.entityLoad`, debugFunctions);
                        }
                    }
                    if (debug.dev.debug)
                        system.runTimeout(() => {
                            debug.debugScoreboards.sbEntitiesScoreboard?.addScore(entity.nameTag || entity, 1);
                            const spiderLocation = entity.location;
                            alertLog.log(`§eEntity Loaded in Biome ${entity.dimension.getBiome(spiderLocation).id}: §l${entity.nameTag}§r§6  @ ${Vector3Lib.toString(spiderLocation, 0, true)} - afterEvents.entityLoad()`);
                        }, 1);
                });
            };

            this.handler = world.afterEvents.entityLoad.subscribe(fn);
            this.on = true;
            alertLog.success("§aInstalled afterEvents.afterEntityLoad §4(debug mode)", debugSubscribes);
        },
        unsubscribe () {
            alertLog.warn("* debugSubscriptions.afterEntityLoad.unsubscribe ()", debugFunctions);
            if (!this.on) return;

            if (this.handler) {
                world.afterEvents.entityLoad.unsubscribe(this.handler);
                this.handler = null;
                alertLog.success("§aUninstalled afterEvents.afterEntityLoad)", debugSubscribes);
            }
            this.on = false;
        }
    },
    afterEntityRemove: {
        on: false,
        /** @type {AfterEntityRemovedHandle | null} */
        handler: null,

        subscribe () {
            alertLog.log("* debugSubscriptions.afterEntityRemove.subscribe ()", debugFunctions);
            if (this.on) return;

            /** @type {AfterEntityRemovedHandler} */
            const fn = (event) => {

                system.runTimeout(() => {
                    debug.debugScoreboards.sbStatsScoreboard?.addScore(debug.debugScoreboards.removed, 1);
                    debug.debugScoreboards.sbEntitiesScoreboard?.removeParticipant(event.removedEntityId);
                }, 1);
            };

            this.handler = world.afterEvents.entityRemove.subscribe(fn, { entityTypes: [ watchFor.typeId ] });
            this.on = true;
            alertLog.success("§aInstalled afterEvents.entityRemove §4(debug mode)", debugSubscribes);
        },
        unsubscribe () {
            alertLog.log("* debugSubscriptions.afterEntityRemove.unsubscribe ()", debugFunctions);
            if (!this.on) return;

            if (this.handler) {
                world.afterEvents.entityRemove.unsubscribe(this.handler);
                this.handler = null;
                alertLog.success("§aUninstalled afterEvents.entityRemove)", debugSubscribes);
            }
            this.on = false;
        }
    },
    afterEntitySpawn: {
        on: false,
        /** @type {AfterEntitySpawnHandle | null} */
        handler: null,

        subscribe () {
            if (this.on) return;

            /** @type {AfterEntitySpawnHandler} */
            const fn = (event) => {
                if (!event.entity) return;
                if (event.entity.typeId !== watchFor.typeId) return;

                const entity = event.entity;

                lastTickRegister(entity); //This is the most needed part...

                //initializes if undefined
                DynamicPropertyLib.add(entity, dynamicVars.websCreated, 0);
                DynamicPropertyLib.add(entity, dynamicVars.websEntered, 0);
                DynamicPropertyLib.add(entity, dynamicVars.websExpanded, 0);
                DynamicPropertyLib.add(entity, dynamicVars.eggsLaid, 0);
                DynamicPropertyLib.add(entity, dynamicVars.entityBorn, 0);
                DynamicPropertyLib.add(entity, dynamicVars.entityLoads, 0);
                DynamicPropertyLib.add(entity, dynamicVars.entitySpawns, 0);

                system.run(() => {
                    if (entity.typeId == watchFor.typeId && !entity.nameTag) {
                        const myName = makeSpiderName();
                        if (myName) {
                            entity.nameTag = myName;
                            alertLog.log(`§aNamed §l${myName}§r in §aAfterEvents.entitySpawn`, debugFunctions);
                        }
                    }
                    if (debug.dev.debug)
                        system.runTimeout(() => {
                            debug.debugScoreboards.sbEntitiesScoreboard?.addScore(entity.nameTag || entity, 1);

                            const spiderLocation = entity.location;
                            alertLog.log(`§aEntity Spawned (${event.cause}) in Biome ${entity.dimension.getBiome(spiderLocation).id}: §l${entity.nameTag}§r§6 @ ${Vector3Lib.toString(spiderLocation, 0, true)}`);

                            if (event.cause === EntityInitializationCause.Born) {
                                debug.debugScoreboards.sbStatsScoreboard?.addScore(debug.debugScoreboards.born, 1);
                                DynamicPropertyLib.add(entity, dynamicVars.entityBorn, 1);
                            }
                            else if (event.cause === EntityInitializationCause.Loaded) {
                                debug.debugScoreboards.sbStatsScoreboard?.addScore(debug.debugScoreboards.loaded, 1);
                                DynamicPropertyLib.add(entity, dynamicVars.entityLoads, 1);
                            }
                            else if (event.cause === EntityInitializationCause.Spawned) {
                                debug.debugScoreboards.sbStatsScoreboard?.addScore(debug.debugScoreboards.spawned, 1);
                                DynamicPropertyLib.add(entity, dynamicVars.entitySpawns, 1);
                            }
                        }, 1);
                });
            };

            this.handler = world.afterEvents.entitySpawn.subscribe(fn);
            this.on = true;
            alertLog.success("§aInstalled afterEvents.entitySpawn §4(debug mode)", debugSubscribes);
        },
        unsubscribe () {
            if (!this.on) return;

            if (this.handler) {
                world.afterEvents.entitySpawn.unsubscribe(this.handler);
                this.handler = null;
                alertLog.success("§aUninstalled afterEvents.entitySpawn)", debugSubscribes);
            }
            this.on = false;
        }
    },
    beforeEntityRemove: {
        on: false,
        /** @type {BeforeEntityRemovedHandle | null} */
        handler: null,

        subscribe () {
            alertLog.log("* debugSubscriptions.beforeEntityRemove.subscribe ()", debugFunctions);
            if (this.on) return;

            /** @type {BeforeEntityRemovedHandler} */
            const fn = (event) => {
                // Note: "removed" doesn't necessarily mean "died"
                if (event.removedEntity && event.removedEntity.typeId === watchFor.typeId)
                    system.runTimeout(() => {
                        if (event.removedEntity.isValid) {
                            if (event.removedEntity.nameTag) debug.debugScoreboards.sbEntitiesScoreboard?.removeParticipant(event.removedEntity.nameTag);
                            debug.debugScoreboards.sbEntitiesScoreboard?.removeParticipant(event.removedEntity);
                            ScoreboardLib.decrement(debug.debugScoreboards.sbStatsName, debug.debugScoreboards.adultSpiders, 1);
                        }
                    }, 1);
            };
            this.handler = world.beforeEvents.entityRemove.subscribe(fn);
            this.on = true;
            alertLog.success("§aInstalled beforeEvents.entityRemove §4(debug mode)", debugSubscribes);
        },
        unsubscribe () {
            alertLog.log("* debugSubscriptions.beforeEntityRemove.unsubscribe ()", debugFunctions);
            if (!this.on) return;

            if (this.handler) {
                world.beforeEvents.entityRemove.unsubscribe(this.handler);
                this.handler = null;
                alertLog.success("§aUninstalled beforeEvents.entityRemove)", debugSubscribes);
            }
            this.on = false;
        }
    },
    allOff () {
        this.afterEntityDie.unsubscribe();
        this.afterEntityLoad.unsubscribe();
        this.afterEntityRemove.unsubscribe();
        this.afterEntitySpawn.unsubscribe();
        this.beforeEntityRemove.unsubscribe();
    },
    allOn () {
        this.afterEntityDie.subscribe();
        this.afterEntityLoad.subscribe();
        this.afterEntityRemove.subscribe();
        this.afterEntitySpawn.subscribe();
        this.beforeEntityRemove.subscribe();
    },
    setup () {
        alertLog.log("* const debugSubscriptions.setup ()", debugFunctions);
        this.afterEntityDie.subscribe();
        //this.afterEntityLoad.subscribe();
        this.afterEntityRemove.subscribe();
        //this.afterEntitySpawn.subscribe();
        this.beforeEntityRemove.subscribe();
    }
};
//==============================================================================
// Rest of functions are one time calls
//==============================================================================
function afterEvents_worldLoad () {
    alertLog.log('§v* function afterEvents_worldLoad()', debugFunctions);

    world.afterEvents.worldLoad.subscribe((event) => {
        pack.worldLoaded = true;

        if (debug.dev.debug) {
            debug.debugScoreboardSetups();
        }

        //Start testing for stalled entities every x min after y delay 
        system.runTimeout(() => {
            system.runInterval(() => {
                stalledEntityCheckAndFix();
            }, Ticks.perMinute * watchFor.stalledCheckRunInterval);
        }, Ticks.perMinute * watchFor.stalledCheckRunInterval);

        alertLog.log('§8x function afterEvents_worldLoad()', debugFunctions);

    });
}

//==============================================================================
/**
 * @summary events from scriptevent command in the spider entity json
 */
function afterEvents_scriptEventReceive () {
    alertLog.log('§v* function afterEvents_scriptEventReceive()', debugFunctions);

    system.afterEvents.scriptEventReceive.subscribe((event) => {
        const { id, message, sourceEntity: entity } = event;

        if (!entity) return;
        if (![ watchFor.typeId, watchFor.egg_typeId ].includes(entity.typeId)) return;

        if (entity.typeId == watchFor.typeId && !entity.nameTag) {
            system.run(() => {
                const myName = makeSpiderName();
                if (myName) {
                    entity.nameTag = myName;
                    //alertLog.success(`Named §l${myName}§r §gin scriptEventReceive §d(${message})`, debug.dev.debug);
                }
            });
        }

        //activity on other scoreboard
        if (entity.typeId == watchFor.typeId) {
            system.runTimeout(() => {
                if (entity.isValid && entity.nameTag)
                    debug.debugScoreboards.sbEntitiesScoreboard?.addScore(entity.nameTag, 1);
            }, 5);
        }

        if (!id) return;

        if (id.startsWith(watchFor.family)) {
            if (id === `${watchFor.family}:placeWeb`) { placeWeb(entity); return; }
            if (id === `${watchFor.family}:enterWeb`) { enterWeb(entity, message == 'baby' ? true : false); return; }
            if (id === `${watchFor.family}:expandWeb`) { expandWeb(entity); return; }
            if (id === `${watchFor.family}:layEgg`) { DynamicPropertyLib.add(entity, dynamicVars.eggsLaid, 1); return; }
            if (id === `${watchFor.family}:newEgg`) { newEgg(entity); return; }
        }

        lastTickRegister(entity);

        if (!debug.dev.debug) return;

        const spiderLocation = entity.location;

        if (id.startsWith('registerSB')) {
            if (id === 'registerSB:NewEntity') {

                if (message == 'born') {
                    DynamicPropertyLib.add(entity, dynamicVars.entityBorn, 0);
                    const sbEntry = debug.debugScoreboards.born;
                    debug.debugScoreboards.sbStatsScoreboard?.addScore(sbEntry, 1);

                    if (debug.dev.debug)
                        system.runTimeout(() => {
                            alertLog.log(`§bNew Baby Born§r in Biome ${entity.dimension.getBiome(spiderLocation).id}: §l${entity.nameTag}§r§6  @ ${Vector3Lib.toString(spiderLocation, 0, true)}`);
                        }, 1);
                    return;
                }

                if (message == 'spawned') {
                    DynamicPropertyLib.add(entity, dynamicVars.entitySpawns, 0);
                    const sbEntry = debug.debugScoreboards.spawned;
                    debug.debugScoreboards.sbStatsScoreboard?.addScore(sbEntry, 1);

                    if (debug.dev.debug)
                        system.runTimeout(() => {
                            alertLog.log(`§aNew Adult Spawned§r in Biome ${entity.dimension.getBiome(spiderLocation).id}: §l${entity.nameTag}§r§6  @ ${Vector3Lib.toString(spiderLocation, 0, true)} - scriptEventReceive ()`);
                        }, 1);
                    return;
                }
                return;
            }

            if (id === 'registerSB:GrowUp') {
                alertLog.log(`§eBaby Spider Grew Up: ${entity.nameTag} (event)`, debug.dev.debugEntityAlert);
                debug.debugScoreboards.sbStatsScoreboard?.addScore(debug.debugScoreboards.growUp, 1);
                return;
            }
        }

        const note = `${entity.nameTag || entity.id} ${message} @ ${Vector3Lib.toString(spiderLocation, 0, true)} (event)`;

        if (id.startsWith('chatOnly:')) {
            alertLog.log(note, debug.dev.debugEntityAlert);
            return;
        }

        alertLog.error(`Unhandled Entity JSON Communication:\nId: ${id}\nMessage: ${note}`);
    });

    alertLog.log('§8x function afterEvents_scriptEventReceive()', debugFunctions);
}
//==============================================================================
function beforeEvents_startup () {
    alertLog.log('§v* function beforeEvents_startup()', debugFunctions);

    system.beforeEvents.startup.subscribe((event) => {
        const ccr = event.customCommandRegistry;
        registerCustomCommands(ccr);
    });

    alertLog.log('§8x function beforeEvents_startup()', debugFunctions);
}
//==============================================================================
export function subscriptionsStable () {
    alertLog.log('§v* function subscriptionsStable ()', debugFunctions);

    beforeEvents_startup();

    afterEvents_worldLoad();

    if (debug.dev.debug)
        debugSubscriptions.setup();

    afterEvents_scriptEventReceive();

    alertLog.log('§8x function subscriptionsStable ()', debugFunctions);
}
//==============================================================================
// End of File