//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20251023 - move stable stuff out
========================================================================*/
import { system, world, EntityInitializationCause } from "@minecraft/server";
import { alertLog, watchFor, chatLog } from './settings.js';
import { Vector3Lib } from "./common-stable/vectorClass.js";
import { EntityLib } from "./common-stable/entityClass.js";
import { DynamicPropertyLib } from "./common-stable/dynamicPropertyClass.js";
import { BiomeLib } from "./common-beta/biomeLib.js";
import { registerCustomCommandsBeta } from "./chatCmds-beta.js";
import * as debug from "./fn-debug.js";
//==============================================================================
/** The function type subscribe expects. */
/** @typedef {Parameters<typeof world.afterEvents.entitySpawn.subscribe>[0]} AfterEntitySpawnHandler */
/** The stored handle type (Bedrock returns the function reference). */
/** @typedef {ReturnType<typeof world.afterEvents.entitySpawn.subscribe>} AfterEntitySpawnHandle */
//==============================================================================
// This part was created this way, so that I can subscribe/unsubscribe via commands - used only for debug/testing
export const debugSubscriptionsBeta = {
    // There is also an afterEvents.entitySpawn, but it has beta elements, so still in beta files - may delete, not useful
    // Beta: getCurrentBiomeList
    afterEntitySpawn: {
        on: false,
        /** @type {AfterEntitySpawnHandle | null} */
        handler: null,

        subscribe () {
            if (this.on) return;

            /** @type {AfterEntitySpawnHandler} */
            const fn = (event) => {
                if (event.entity && event.entity.typeId === watchFor.typeId) {
                    const entity = event.entity;
                    const inBlock = EntityLib.currentBlock(entity);
                    const onBlock = inBlock?.below();
                    if (!entity.getDynamicProperty("spawns")) {

                        //because I cannot get the Spawn Rules to do what I want... 
                        //I want to be able to spawn in short grass, and such, just not on air/grass_block
                        //FIXME: this is where the limits apply - to make not spawn on plain grass block
                        //if (inBlock?.typeId=="minecraft:air" && onBlock?.typeId=="minecraft:grass_block") {
                        //    entity.triggerEvent(entityEvents.despawnEventName)
                        //    return
                        //}

                        //in beta because of Biome Check
                        if (debug.dev.debugLoadAndSpawn && event.cause == EntityInitializationCause.Spawned) {
                            const biome = BiomeLib.getCurrentBiomeList(entity).replaceAll('minecraft:', '');
                            const msg = `§g${entity.nameTag || entity.id} Loaded @ ${Vector3Lib.toString(entity.location, 0, true)} §bin ${inBlock?.typeId.replace('minecraft:', '') || '?'} §don ${onBlock?.typeId.replace('minecraft:', '') || '?'} §6in Biomes: ${biome || '?'}`;
                            alertLog.success(msg, true);
                            chatLog.success(msg, true);
                        }
                    }
                    else {
                        DynamicPropertyLib.add(entity, "spawns", 1);
                        if (debug.dev.debugLoadAndSpawn && event.cause == EntityInitializationCause.Spawned) {
                            const biome = BiomeLib.getCurrentBiomeList(entity).replaceAll('minecraft:', '');
                            const msg = `§g${entity.nameTag || entity.id} Re-Loaded @ ${Vector3Lib.toString(entity.location, 0, true)} §bin ${inBlock?.typeId.replace('minecraft:', '') || '?'} §don ${onBlock?.typeId.replace('minecraft:', '') || '?'} §6in Biomes: ${biome || '?'}`;
                            alertLog.success(msg, true);
                            chatLog.success(msg, true);
                        }
                    }
                }
            };

            this.handler = world.afterEvents.entitySpawn.subscribe(fn,);
            this.on = true;
            alertLog.success("§aInstalled afterEvents.entitySpawn Beta §c(debug mode)", debug.dev.debugSubscriptions);
        },
        unsubscribe () {
            if (!this.on) return;

            if (this.handler) {
                world.afterEvents.entitySpawn.unsubscribe(this.handler);
                this.handler = null;
                alertLog.success("§aUninstalled afterEvents.entitySpawn)", debug.dev.debugSubscriptions);
            }
            this.on = false;
        }
    },
    setup () {

    },
    allOff () {
        this.afterEntitySpawn.unsubscribe();
    }
    ,
    allOn () {
        this.afterEntitySpawn.subscribe();
    }
};
//==============================================================================
// Rest of functions are one time calls
//==============================================================================
function beforeEvents_startup_beta () {

    system.beforeEvents.startup.subscribe((event) => {
        const ccr = event.customCommandRegistry;
        registerCustomCommandsBeta(ccr);
    });
}
//==============================================================================
export function subscriptionsBeta () {

    beforeEvents_startup_beta();

    if (debug.dev.debugEntityActivity)
        debugSubscriptionsBeta.afterEntitySpawn.subscribe();
}
//==============================================================================
// End of File