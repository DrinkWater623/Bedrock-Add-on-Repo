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
import { alertLog, chatLog, pack, watchFor, dynamicVars } from './settings.js';
import { enterWeb, expandWeb, placeWeb, newEgg, lastTickRegister, stalledEntityCheckAndFix, welcomeBack } from './fn-stable.js';
import { Ticks } from "./common-data/globalConstantsLib.js";
import { DynamicPropertyLib } from "./common-stable/dynamicPropertyClass.js";
import { Vector3Lib } from "./common-stable/vectorClass.js";
import { registerCustomCommands } from "./chatCmds.js";
import * as debug from "./fn-debug.js";
//==============================================================================
/** The function type subscribe expects. */
/** @typedef {Parameters<typeof world.afterEvents.entityDie.subscribe>[0]} AfterEntityDieHandler */
/** @typedef {Parameters<typeof world.afterEvents.entityRemove.subscribe>[0]} AfterEntityRemovedHandler */
/** @typedef {Parameters<typeof world.beforeEvents.entityRemove.subscribe>[0]} BeforeEntityRemovedHandler */
/** The stored handle type (Bedrock returns the function reference). */
/** @typedef {ReturnType<typeof world.afterEvents.entityDie.subscribe>} AfterEntityDieHandle */
/** @typedef {ReturnType<typeof world.afterEvents.entityRemove.subscribe>} AfterEntityRemovedHandle */
/** @typedef {ReturnType<typeof world.beforeEvents.entityRemove.subscribe>} BeforeEntityRemovedHandle */
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

            /** @type {AfterEntityDieHandler} */
            const fn = (event) => {
                var entity = event.deadEntity;
                var whyDied = event.damageSource.cause;
                var msg = '';

                if (whyDied == 'suffocation') {
                    var dimension = entity.dimension;
                    var location = entity.location;

                    if (dimension != null && location != null) {
                        var inBlock = dimension.getBlock(location)?.typeId;
                        msg = `Spider Suffocated in§c block: ${inBlock} @ ${Vector3Lib.toString(location, 1, true)}`;
                    }
                    else {
                        msg = `Spider Suffocated (cannot get block)`;
                    }
                }
                else {
                    msg = `Spider Died - ${whyDied}`;
                }

                world.sendMessage(msg);
                if (debug.dev.debugScoreboard)
                    system.runTimeout(() => { debug.debugScoreboards.sbStatsScoreboard?.addScore('§cDied', 1); }, 1);
            };

            this.handler = world.afterEvents.entityDie.subscribe(fn, { entityTypes: [ watchFor.typeId ] });
            this.on = true;
            alertLog.success("§aInstalled afterEvents.entityDie §c(debug mode)", debug.dev.debugSubscriptions);
        },
        unsubscribe () {
            if (!this.on) return;

            if (this.handler) {
                world.afterEvents.entityDie.unsubscribe(this.handler);
                this.handler = null;
                alertLog.success("§aUninstalled afterEvents.entityDie)", debug.dev.debugSubscriptions);
            }
            this.on = false;
        }
    },
    afterEntityRemove: {
        on: false,
        /** @type {AfterEntityRemovedHandle | null} */
        handler: null,

        subscribe () {
            if (this.on) return;

            /** @type {AfterEntityRemovedHandler} */
            const fn = (event) => {
                system.runTimeout(() => {
                    debug.debugScoreboards.sbStatsScoreboard?.addScore('§cRemoved', 1);
                }, 1);
            };

            this.handler = world.afterEvents.entityRemove.subscribe(fn, { entityTypes: [ watchFor.typeId ] });
            this.on = true;
            alertLog.success("§aInstalled afterEvents.entityRemove §c(debug mode)", debug.dev.debugSubscriptions);
        },
        unsubscribe () {
            if (!this.on) return;

            if (this.handler) {
                world.afterEvents.entityRemove.unsubscribe(this.handler);
                this.handler = null;
                alertLog.success("§aUninstalled afterEvents.entityRemove)", debug.dev.debugSubscriptions);
            }
            this.on = false;
        }
    },
    beforeEntityRemove: {
        on: false,
        /** @type {BeforeEntityRemovedHandle | null} */
        handler: null,

        subscribe () {
            if (this.on) return;

            /** @type {BeforeEntityRemovedHandler} */
            const fn = (event) => {
                // Note: "removed" doesn't necessarily mean "died"
                if (event.removedEntity && event.removedEntity.typeId === watchFor.typeId)
                    if (debug.debugScoreboards.sbStatsScoreboard && debug.debugScoreboards.sbStatsScoreboard.isValid)
                        system.runTimeout(() => {
                            debug.debugScoreboards.sbStatsScoreboard?.removeParticipant(event.removedEntity);
                        }, 1);
            };
            this.handler = world.beforeEvents.entityRemove.subscribe(fn);
            this.on = true;
            alertLog.success("§aInstalled beforeEvents.entityRemove §c(debug mode)", debug.dev.debugSubscriptions);
        },
        unsubscribe () {
            if (!this.on) return;

            if (this.handler) {
                world.beforeEvents.entityRemove.unsubscribe(this.handler);
                this.handler = null;
                alertLog.success("§aUninstalled beforeEvents.entityRemove)", debug.dev.debugSubscriptions);
            }
            this.on = false;
        }
    },
    allOff () {
        this.afterEntityDie.unsubscribe();
        this.afterEntityRemove.unsubscribe();
        this.beforeEntityRemove.unsubscribe();
    },
    allOn () {
        this.afterEntityDie.subscribe();
        this.afterEntityRemove.subscribe();
        this.beforeEntityRemove.subscribe();
    },
    setup () {        
        if (debug.dev.debugScoreboardsAllow) {
            debug.debugScoreboardSetups();            
            this.afterEntityRemove.subscribe();
            if (debug.dev.debugLoadAndSpawn) this.beforeEntityRemove.subscribe();
        }
        this.afterEntityDie.subscribe();
    }
};
//==============================================================================
// Rest of functions are one time calls
//==============================================================================
function afterEvents_worldLoad () {

    world.afterEvents.worldLoad.subscribe((event) => {

        if (pack.allowDebugOverride) {
            debug.dev.anyOn();
            if (debug.dev.debug == false) debug.dev.allOff();
        }
        else {
            debug.getDebugDynamicVars();
        }

        alertLog.success(`§aInstalling Add-on ${pack.packName} - ${pack.beta ? '§6Beta' : '§bStable'}  ${debug.dev.debug ? '§c(Debug Mode)' : ''}`, debug.dev.debugPackLoad || pack.isLoadAlertsOn);

        if (debug.dev.debug) {
            debugSubscriptions.setup();
        }

        //Start testing for stalled entities every x min after y delay 
        system.runTimeout(() => {
            system.runInterval(() => {
                stalledEntityCheckAndFix();
            }, Ticks.perMinute * watchFor.stalledCheckRunInterval);
        }, Ticks.perMinute * watchFor.stalledCheckRunInterval);

        alertLog.success("§aFinished afterEvents.worldLoad §c(debug mode)", debug.dev.debugSubscriptions);
    });
}
//==============================================================================
function afterEvents_entityLoad () {

    world.afterEvents.entityLoad.subscribe((event) => {
        if (event.entity && event.entity.typeId === watchFor.typeId) {
            welcomeBack(event.entity);
        }
    });
}
//==============================================================================
/**
 * @summary enterWeb/expandWeb/placeWeb
 */
function afterEvents_scriptEventReceive () {

    system.afterEvents.scriptEventReceive.subscribe((event) => {
        const { id, message, sourceEntity: entity } = event;

        if (!entity) return;
        if (![ watchFor.typeId, watchFor.egg_typeId ].includes(entity.typeId)) return;
        if (!id) return;

        if (id.startsWith(watchFor.family)) {
            if (id === `${watchFor.family}:placeWeb`) { placeWeb(entity); return; }
            if (id === `${watchFor.family}:enterWeb`) { enterWeb(entity, message == 'baby' ? true : false); return; }
            if (id === `${watchFor.family}:expandWeb`) { expandWeb(entity); return; }
            if (id === `${watchFor.family}:layEgg`) { DynamicPropertyLib.add(entity, dynamicVars.eggsLaid, 1); return; }
            if (id === `${watchFor.family}:newEgg`) { newEgg(entity); return; }
        }

        if (id.startsWith('register')) {
            lastTickRegister(entity);
        }

        if (!debug.dev.debug) return;

        if (id === 'registerSB:EntityAlert') { debug.debugScoreboards.sbStatsScoreboard?.addScore(message, 1); return; }

        //no sb for message after this point - add entity id to message
        const note = `${entity.nameTag || entity.id} ${message} @ ${Vector3Lib.toString(entity.location, 0, true)}`;

        //This one has Reached Goal - so proof, it did something
        if (id === 'register:EntityActivity') { chatLog.log(note, debug.dev.debugEntityActivity); return; }

        if (id === 'chatOnly:EntityActivity') { chatLog.log(note, debug.dev.debugEntityActivity); return; }
        //Not used for anything yet...
        if (id === 'chatOnly:GamePlay') { chatLog.log(note, debug.dev.debugGamePlay); return; }
        if (id === 'debug:Stick') { chatLog.log(note, true); return; }

        //if (dev.debugEntityActivity ||debug.dev.debugEntityAlert ||debug.dev.debugGamePlay)
        chatLog.error(`Unhandled Entity JSON Communication:\nId: ${id}\nMessage: ${note}`, true);
    });
}
//==============================================================================
function beforeEvents_startup () {

    system.beforeEvents.startup.subscribe((event) => {
        const ccr = event.customCommandRegistry;
        registerCustomCommands(ccr);
    });
}
//==============================================================================
export function subscriptionsStable () {
    beforeEvents_startup();

    afterEvents_worldLoad();

    //Re-Inits - the ticks of the entity
    afterEvents_entityLoad();

    afterEvents_scriptEventReceive();
}
//==============================================================================
// End of File