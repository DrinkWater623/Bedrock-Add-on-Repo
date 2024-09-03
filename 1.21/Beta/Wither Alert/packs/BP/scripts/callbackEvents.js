//@ts-check
//==============================================================================
import {
    world, system,
    EntityDieAfterEvent,
    EntityLoadAfterEvent,
    EntityRemoveBeforeEvent,
    EntitySpawnAfterEvent,
    ExplosionAfterEvent,
    WorldInitializeAfterEvent
} from "@minecraft/server";

import { Vector3Lib as vec3 } from './commonLib/vectorClass.js';
import { Entities } from './commonLib/entityClass.js';
import { watchFor, dev, alertLog, chatLog } from './settings.js';
import * as subscriptions from './subscribes.js';
import * as wf from './watchLoop.js';
const reloadTime = 10;
//==============================================================================
const default_entityDie_after = world.afterEvents.entityDie.subscribe((x) => { }, { entityTypes: [ "minecraft:wither_skull" ] });
const default_entityRemove_before = world.beforeEvents.entityRemove.subscribe((x) => { });
export const callBacks = {
    /**
     * @type {{on: boolean, ptr: (arg: EntityDieAfterEvent) => void, options:import("@minecraft/server").EntityEventOptions }} entityDie_after
     */
    entityDie_after: { on: false, ptr: default_entityDie_after, options: { entityTypes: [ watchFor.typeId ] } },

    /**
     * @type {{on: boolean, ptr: (arg: EntityRemoveBeforeEvent) => void}} entityRemove_before
     */
    entityRemove_before: { on: false, ptr: default_entityRemove_before }
};
//==============================================================================
export function callBacks_activate () {
    const debugMsg = dev.debugSubscriptions || dev.debugCallBackEvents || dev.debugAll

    if (!callBacks.entityDie_after.on) {
        chatLog.success("§9Activating entityDie_after subscription",debugMsg);
        callBacks.entityDie_after.on = true;
        world.afterEvents.entityDie.subscribe(callBacks.entityDie_after.ptr, callBacks.entityDie_after.options);
    }

    if (!callBacks.entityRemove_before.on) {
        chatLog.success("§9Activating entityRemove_before subscription",debugMsg);
        callBacks.entityRemove_before.on = true;
        world.beforeEvents.entityRemove.subscribe(callBacks.entityRemove_before.ptr);
    }
}
export function callBacks_deactivate () {
    const debugMsg = dev.debugSubscriptions || dev.debugCallBackEvents || dev.debugAll

    if (callBacks.entityDie_after.on) {
        chatLog.success("§9De-Activating entityDie_after subscription",debugMsg);
        callBacks.entityDie_after.on = false;
        world.afterEvents.entityDie.unsubscribe(callBacks.entityDie_after.ptr);
    }

    if (callBacks.entityRemove_before.on) {
        chatLog.success("§9De-Activating entityRemove_before subscription",debugMsg);
        callBacks.entityRemove_before.on = false;
        world.beforeEvents.entityRemove.unsubscribe(callBacks.entityRemove_before.ptr);
    }
}
//==============================================================================
/**
* @param { EntityDieAfterEvent } event
*/
export function entityDie_after_fn (event) {

    const debugMsg = dev.debugEntityAlert || dev.debugCallBackEvents || dev.debugAll
    chatLog.success(`§9afterEvents.entityDie - id:${event.deadEntity.id} - saved id:${world.getDynamicProperty("deadEntityId")}`,debugMsg);

    if (world.getDynamicProperty("deadEntityId") == event.deadEntity.id) {
        const damager = event.damageSource?.damagingEntity;

        world.setDynamicProperty("deadEntityId", 0);
        //Get data saved in the removedEntity beforeEvent - because is undefined in the entityDie afterEvent
        const entityName = world.getDynamicProperty("deadEntityName");
        const entityDimensionId = world.getDynamicProperty("deadEntityDimensionId");

        let msg = `§gA ${watchFor.display} Died`;

        //Note: entity.dimension is not working here - get error.
        const entityLocation = world.getDynamicProperty("deadEntityLocation");
        if (typeof entityLocation == 'object') {
            if (entityDimensionId) msg += ` @ ${entityDimensionId} ${vec3.toString(entityLocation, 0, true)}`;
        }

        if (damager && damager.typeId === "minecraft:player") msg += `\n§aKilled by ${damager.nameTag}`;
        if (entityName) msg += `\n§dRest in Peace ${entityName}`;
        world.sendMessage(msg);
    }
    else chatLog.log(`§cAfterEvents.entityDie - id:${event.deadEntity.id} - saved id:${world.getDynamicProperty("deadEntityId")}`,debugMsg);

}
//==============================================================================
/**
* @param { EntityRemoveBeforeEvent } event
*/
export function entityRemove_before_fn (event) {

    if (event.removedEntity.typeId === watchFor.typeId) {
        const debugMsg = dev.debugEntityAlert || dev.debugCallBackEvents || dev.debugAll
        const entity = event.removedEntity;

        chatLog.success(`beforeEvents.entityRemove - id:${entity.id}`,debugMsg);
        //This info is lost in the afterEvent where I need it, so saving it in the before
        world.setDynamicProperty("deadEntityDimensionId", entity.dimension.id.replace("minecraft:", ""));
        world.setDynamicProperty("deadEntityLocation", entity.location);
        world.setDynamicProperty("deadEntityName", entity.nameTag);
        world.setDynamicProperty("deadEntityId", entity.id);
        entity[ "myVar" ] = 623;
    }
}
//==============================================================================
/**
* @param { EntityLoadAfterEvent } event
*/
export function entityLoad_after_fn (event) {

    if (event.entity.typeId === watchFor.typeId) {
        const debugMsg = dev.debugEntityAlert || dev.debugCallBackEvents || dev.debugAll

        chatLog.success("afterEvents.entityLoad",debugMsg);

        world.sendMessage(`§bA ${watchFor.display} Loaded @ ${vec3.toString(event.entity.location, 0, true, ', ')}`);

        system.runTimeout(() => {
            wf.startWatchLoop("entityLoad");
        }, 1);
    }
}
//==============================================================================
/**
* @param { EntitySpawnAfterEvent } event
*/
export function entitySpawn_after_fn (event) {
    
    if (event.entity.typeId === watchFor.typeId) {
        const debugMsg = dev.debugEntityAlert || dev.debugCallBackEvents || dev.debugAll
        chatLog.log("§9afterEvents.entitySpawn",debugMsg);

        const entity = event.entity;
        let msg = `§bA ${watchFor.display} was ${event.cause} @ ${vec3.toString(entity.location, 0, true)}`;

        //Who is near by - they own it
        if (!entity.nameTag) {

            const players = entity.dimension.getPlayers(
                {
                    closest: 1 //,                        maxDistance: 15
                }
            );

            //world.sendMessage(`players.length= ${players.length}`);
            if (players.length) {
                const closest = players[ 0 ].name;
                msg += ` by ${closest}`;

                system.runTimeout(() => {
                    entity.nameTag = `${closest}'s Pet`;
                }, 1);
            }
        }

        world.sendMessage(msg);
        system.runTimeout(() => {
            wf.startWatchLoop("entitySpawn");
        }, 1);
    }
}
//==============================================================================
//FIXME:  I should not need this.... fix code so that the normal ways are captured just fine
/**
* @param { ExplosionAfterEvent } event
*/
export function explosion_after_fn (event) {

    //projectiles are entities, so the explosion comes from them and not main entity
    //wither's thing is wither_skull &

    const entity = event.source;

    if (entity) {
        //world.sendMessage(entity.typeId);
        if (watchFor.explosiveProjectiles.includes(entity.typeId) && !world.getDynamicProperty('isEntityAlive')) {

            const entities = Entities.getAllEntities({ type: watchFor.family });
            if (entities.length) {
                const msg = `§bA ${watchFor.display} Explosion Occurred.  Re-Activating Alert System`;
                world.sendMessage(msg);
                system.runTimeout(() => {
                    wf.startWatchLoop("explosion");
                }, 1);
            }
        }
    }
}
//==============================================================================
/**
* @param { WorldInitializeAfterEvent } event
*/
export function worldInitialize_after_fn (event) {
    const debugMsg = dev.debugPackLoad || dev.debugCallBackEvents || dev.debugAll

    alertLog.success("§6WorldInitialize.after.subscribe Step 0",debugMsg);
    //-----------------------------------------------------
    //setup to capture
    system.runTimeout(() => {
        alertLog.success("§fWorldInitialize.after.Step 1 - subscribe to entity remove/die", debugMsg);

        subscriptions.entityRemove_before_sub();
        subscriptions.entityDie_after_sub();

        //turn right back off if alert is not on
        if (!world.getDynamicProperty('isEntityAlive'))
            system.runTimeout(() => {
                alertLog.success("§6WorldInitialize.after.Step 2 - callBacks_deactivate()", debugMsg);
                callBacks_deactivate();
            }, 1);
    }, 1);

    //now this should only be turned on and off by the startWatchLoop/watchLoop
    //-----------------------------------------------------
    system.runTimeout(() => {
        alertLog.success("§fWorldInitialize.after.Initialize Step 3", debugMsg);
        let timer = 1;

        if (world.getDynamicProperty('isEntityAlive')) {
            world.sendMessage('\n'.repeat(5));
            chatLog.success("§aWorld is Re-Initialized via Script Re-Load");

            //reset - so it can be reChecked
            world.setDynamicProperty('isEntityAlive', false);

            //this gives it time to activate on it's own for explosions
            //Note: this will only be used if a /reload happens, else entityLoad will pick up
            //because over 100-200 ticks until chunk loads when world starts, whereas reload is faster
            system.runTimeout(() => {
                alertLog.success("§fWorldInitialize.after.Initialize Step 3a", debugMsg);
                //if nothing else re-activated it, go check myself - direct to watchLoop
                if (!world.getDynamicProperty('isEntityAlive')) {
                    world.sendMessage(`§bChecking for ${watchFor.display}...`);
                    wf.watchLoop("worldInitialize");
                }
            }, reloadTime);

            timer += reloadTime;
        }
        else alertLog.log("§cAlert Not On - so No WorldInitialize.after.Step 3a",debugMsg);

        world.setDynamicProperty('isEntityAlive', false);

        system.runTimeout(() => {
            alertLog.success("§fWorldInitialize.after.Initialize Step 3b",debugMsg);
            subscriptions.entityLoad_after_sub();
            subscriptions.entitySpawn_after_sub();
        }, timer);

    }, 3);
}