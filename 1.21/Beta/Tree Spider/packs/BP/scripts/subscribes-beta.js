//@ts-check
import { world, system, EntityInitializationCause } from "@minecraft/server";
import { alertLog, dev, watchFor, chatLog, entityEvents } from './settings.js';
import { chatSend_before_fn } from './chatCmds-beta.js';
import { enterWeb, expandWeb } from './fn-beta.js';
import { placeWeb, newEgg, lastTickRegister } from './fn-stable.js';
import { Vector3Lib } from "./commonLib/vectorClass.js";
import { EntityLib } from "./commonLib/entityClass.js";
import { DynamicPropertyLib } from "./commonLib/dynamicPropertyClass.js";
import { BiomeLib } from "./commonLib/biomeLib.js";

//==============================================================================
/**
 * @summary Beta
 */
export function chatSend () {
    alertLog.success(`§aInstalling Chat Commands (before)§r - §6Beta  §c(Debug Mode)§r`, dev.debugSubscriptions);
    world.beforeEvents.chatSend.subscribe((event) => {
        chatSend_before_fn(event);
    });
}
//==============================================================================
/**
 * @summary Beta: enterWeb/expandWeb
 */
export function afterEvents_scriptEventReceive () {

    alertLog.success("§aInstalling afterEvents.scriptEventReceive §c(Debug Mode)", dev.debugSubscriptions);

    system.afterEvents.scriptEventReceive.subscribe((event) => {
        const { id, message, sourceEntity: entity } = event;

        if (!entity) return;
        if (![ watchFor.typeId, watchFor.egg_typeId ].includes(entity.typeId)) return;
        if (!id) return;

        if (id.startsWith(watchFor.family)) {
            if (id === `${watchFor.family}:placeWeb`) { placeWeb(entity); return; }
            if (id === `${watchFor.family}:enterWeb`) { enterWeb(entity, message == 'baby' ? true : false); return; }
            if (id === `${watchFor.family}:expandWeb`) { expandWeb(entity); return; }
            if (id === `${watchFor.family}:newEgg`) { newEgg(entity); return; }
        }

        if (id.startsWith('register')) {
            lastTickRegister(entity);
        }

        if (id === 'registerSB:EntityAlert') { dev.debugScoreboard?.addScore(message, 1); return; }

        //no sb for message after this point - add entity id to message
        const note = `${entity.nameTag || entity.id} ${message} @ ${Vector3Lib.toString(entity.location, 0, true)}`;

        //THis one has Reached Goal - so proof, it did something
        if (id === 'register:EntityActivity') { chatLog.log(note, dev.debugEntityActivity); return; }

        if (id === 'chatOnly:EntityActivity') { chatLog.log(note, dev.debugEntityActivity); return; }
        //Not used for anything yet...
        if (id === 'chatOnly:GamePlay') { chatLog.log(note, dev.debugGamePlay); return; }
        if (id === 'debug:Stick') { chatLog.log(note, true); return; }

        //if (dev.debugEntityActivity || dev.debugEntityAlert || dev.debugGamePlay)
        chatLog.error(`Unhandled Entity JSON Communication:\nId: ${id}\nMessage: ${note}`, true);
    });
}
//==============================================================================
/**
 * @summary Beta: getCurrentBiomeList
 */
export function afterEvents_entitySpawn () {
    //Beta until dimension.findClosestBiome is released
    //Load (195 ticks or so )is after Spawn    
    //if (dev.debugLoadAndSpawn) {
    alertLog.success("§aInstalling afterEvents.entitySpawn §c(debug mode : tick scoreboard)", dev.debugSubscriptions);

    world.afterEvents.entitySpawn.subscribe((event) => {
        if (event.entity && event.entity.typeId === watchFor.typeId) {
            const entity = event.entity;
            const inBlock = EntityLib.currentBlock(entity);
            const onBlock = inBlock?.below();
            if (!entity.getDynamicProperty("spawns")) {

                //because I cannot get the Spawn Rules to do what I want... 
                //I want to be able to spawn in short grass, and such, just not on air/grass_block
                if (inBlock?.typeId=="minecraft:air" && onBlock?.typeId=="minecraft:grass_block") {
                    entity.triggerEvent(entityEvents.despawnEventName)
                    return
                }

                //in beta because of Biome Check
                if (dev.debugLoadAndSpawn && event.cause == EntityInitializationCause.Spawned) {
                    const biome = BiomeLib.getCurrentBiomeList(entity).replaceAll('minecraft:', '');
                    const msg = `§g${entity.nameTag || entity.id} Loaded @ ${Vector3Lib.toString(entity.location, 0, true)} §bin ${inBlock?.typeId.replace('minecraft:', '') || '?'} §don ${onBlock?.typeId.replace('minecraft:', '') || '?'} §6in Biomes: ${biome || '?'}`;
                    alertLog.success(msg, true);
                    chatLog.success(msg, true);
                }
            }
            else {
                DynamicPropertyLib.add(entity, "spawns", 1);
                if (dev.debugLoadAndSpawn && event.cause == EntityInitializationCause.Spawned) {
                    const biome = BiomeLib.getCurrentBiomeList(entity).replaceAll('minecraft:', '');
                    const msg = `§g${entity.nameTag || entity.id} Re-Loaded @ ${Vector3Lib.toString(entity.location, 0, true)} §bin ${inBlock?.typeId.replace('minecraft:', '') || '?'} §don ${onBlock?.typeId.replace('minecraft:', '') || '?'} §6in Biomes: ${biome || '?'}`;
                    alertLog.success(msg, true);
                    chatLog.success(msg, true);
                }
            }
        }
    });
}
//==============================================================================