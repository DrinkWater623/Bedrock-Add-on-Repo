//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
import {
    world,
    EntityDieAfterEvent,
    EntityRemoveBeforeEvent
} from "@minecraft/server";
import { Vector3Lib as vec3 } from './common-stable/tools/vectorClass.js';
import { watchFor, dev, chatLog } from './settings.js';
//==============================================================================
const reloadTime = 10;
//==============================================================================
const default_entityDie_after = world.afterEvents.entityDie.subscribe((x) => { }, { entityTypes: [ "minecraft:wither_skull" ] });
const default_entityRemove_before = world.beforeEvents.entityRemove.subscribe((x) => { });
//==============================================================================
export const callBacks = {
    /**
     * @type {{on: boolean, ptr: (arg: EntityDieAfterEvent) => void, options:import("@minecraft/server").EntityEventOptions }} entityDie_after
     */
    entityDie_after: { 
        on: false, 
        ptr: default_entityDie_after, 
        options: { entityTypes: [ watchFor.typeId ] } 
    },

    /**
     * @type {{on: boolean, ptr: (arg: EntityRemoveBeforeEvent) => void}} entityRemove_before
     */
    entityRemove_before: { 
        on: false, 
        ptr: default_entityRemove_before 
    }
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