//entities.js F3
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
//Shared
import { EntitySubscriptions } from "../common-stable/subscriptions/index.js";
import { Entities } from "../common-stable/gameObjects/index.js";
import { round, Vector3Lib } from "../common-stable/tools/index.js";
//Local
import { packDisplayName,  } from '../settings.js';
import { dev } from "../debug.js";
//==============================================================================
//import { ScoreboardLib } from "./common-stable/scoreboardClass.js";

//==============================================================================
/** The function type subscribe expects. */
//  Entities
/** @typedef {Parameters<typeof world.afterEvents.entityDie.subscribe>[0]} AfterEntityDieHandler */
/** @typedef {Parameters<typeof world.afterEvents.entityHitEntity.subscribe>[0]} AfterEntityHitEntityHandler */
/** @typedef {Parameters<typeof world.afterEvents.entityLoad.subscribe>[0]} AfterEntityLoadHandler */
/** @typedef {Parameters<typeof world.afterEvents.entityRemove.subscribe>[0]} AfterEntityRemovedHandler */
/** @typedef {Parameters<typeof world.afterEvents.entitySpawn.subscribe>[0]} AfterEntitySpawnHandler */
/** @typedef {Parameters<typeof world.afterEvents.entityHurt.subscribe>[0]} AfterEntityHurtHandler */
/** @typedef {Parameters<typeof world.beforeEvents.entityRemove.subscribe>[0]} BeforeEntityRemovedHandler */
//==============================================================================
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
//==============================================================================
/** @type {AfterEntityDieHandler} */
const onAfterEntityDie = (event) => {
    //Can subscribe with Options
    const eventName = 'afterEntityDie';
    const msg = `${dev.alertLabel(eventName)} §c${ event.deadEntity.typeId}§r via ${event.damageSource.cause}}`;
    dev.alertEntityEventLog(eventName, msg);
};
//==============================================================================
/** @type {AfterEntityHitEntityHandler} */
const onAfterEntityHitEntity = (event) => {
    //Can subscribe with Options
   // if (dev.entityWatchList.includes(event.damagingEntity.typeId) || dev.entityWatchList.includes(event.hitEntity.typeId)) {
        const eventName = 'afterEntityHitEntity';
        const damagingEntityName = Entities.name_get(event.damagingEntity) ?? 'Unknown'
        const hitEntityName = Entities.name_get(event.hitEntity) ?? 'Unknown'
        let msg = `${dev.alertLabel(eventName)} ${damagingEntityName} ${dev.fieldLabel('Hit')} ${hitEntityName} @ ${dev.vectorStr(event.damagingEntity.location)}`;
        dev.alertEntityEventLog(eventName, msg);
    //}
};
//==============================================================================
/** @type {AfterEntityHurtHandler} */
const onAfterEntityHurt = (event) => {
    //Can subscribe with Options
    if (dev.entityWatchList.includes(event.hurtEntity.typeId) || (event.damageSource.damagingEntity && dev.entityWatchList.includes(event.damageSource.damagingEntity.typeId))) {
        const eventName = 'afterEntityHurt';
        const hurtEntityName = Entities.name_get(event.hurtEntity) ?? 'Unknown'
        const damagingEntityName = Entities.name_get(event.damageSource.damagingEntity ?? null) ?? 'Unknown'
        let msg = `${dev.alertLabel(eventName)} ${hurtEntityName} | ${dev.fieldLabel('Damage')} ${round(event.damage)}`;
        msg += `  |  ${dev.fieldLabel('Cause')} ${event.damageSource.cause} ${dev.fieldLabel('By')} ${damagingEntityName} `
        dev.alertEntityEventLog(eventName, msg);
    }
};
//==============================================================================
/** @type {AfterEntityLoadHandler} */
const onAfterEntityLoad = (event) => {
    if (!event.entity.isValid || !dev.entityWatchList.includes(event.entity.typeId)) return;
    
    const eventName = 'afterEntityLoad';
    const msg = `${dev.alertLabel(eventName)} ${event.entity.typeId} @ ${dev.vectorStr(event.entity.location)}`;
    dev.alertEntityEventLog(eventName, msg);
};
//==============================================================================
/** @type {AfterEntitySpawnHandler} */
const onAfterEntitySpawn = (event) => {
    if (!event.entity.isValid || !dev.entityWatchList.includes(event.entity.typeId)) return;

    const eventName = 'afterEntitySpawn';
    const msg = `${dev.alertLabel(eventName)} ${event.entity.typeId} (§d${event.cause}§r) @ ${dev.vectorStr(event.entity.location)}`;
    dev.alertEntityEventLog(eventName, msg);
};
//==============================================================================
const entitySubs = new EntitySubscriptions(packDisplayName, dev.isDebugFunction('subscriptionsEntities'));
//==============================================================================
export function subscriptionsEntities () {
    const _name = 'subscriptionsEntities';
    dev.alertFunctionKey(_name, true);

    entitySubs.register({
        afterEntityDie: onAfterEntityDie,
        afterEntityHitEntity: onAfterEntityHitEntity,
        afterEntityHurt: onAfterEntityHurt,
        afterEntityLoad: onAfterEntityLoad,
        afterEntitySpawn: onAfterEntitySpawn,
    });
}
//==============================================================================
// End of File
//==============================================================================