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
import { Vector3Lib } from "../common-stable/tools/index.js";
//Local
import { alertLog, pack, packDisplayName, toggles, watchFor } from '../settings.js';
import { dev } from "../debug.js";
//==============================================================================
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
//==============================================================================
const debugOn = false || dev.debugOn;
const myBlockGroups = watchFor.onPlaceBlockList(); //TODO : put back
//==============================================================================
/** @type {AfterEntityDieHandler} */
const onAfterEntityDie = (event) => {
    if (!toggles.ed_aft) return;

    const entity = event.deadEntity;
    const { location } = entity;
    const whyDied = event.damageSource.cause;
    const msg = `§c${entity.typeId}§r §c Died via ${whyDied} @ ${Vector3Lib.toString(location, 0, true)} -§v afterEvents.entityDie`;
    alertLog.warn(msg, dev.debugSubscriptions.afterEntityDie);
};
//==============================================================================
/** @type {AfterEntityLoadHandler} */
const onAfterEntityLoad = (event) => {
    if (!toggles.el_aft) return;

    const entity = event.entity;
    if (!entity || !entity.isValid) return;
    const msg = `§a${entity.typeId}§r loaded @ ${Vector3Lib.toString(entity.location, 0, true)} -§v afterEvents.entityDie`;
    alertLog.log(msg);
};
//==============================================================================
/** @type {AfterEntitySpawnHandler} */
const onAfterEntitySpawn = (event) => {
    if (!toggles.es_aft) return;

    const entity = event.entity;
    if (!entity || !entity.isValid) return;
    const msg = `§a${entity.typeId}§r ${event.cause} @ ${Vector3Lib.toString(entity.location, 0, true)} -§v afterEvents.entityDie`;
    alertLog.log(msg);
};
//==============================================================================
const entitySubs = new EntitySubscriptions(packDisplayName, true);
//==============================================================================
export function subscriptionsEntities () {
    const _name = 'function subscriptionsStable';
    alertLog.log(`§v* ${_name} ()`, dev.debugFunctions.debugFunctionsOnOn);

    entitySubs.afterEntityLoad.subscribe(onAfterEntityLoad);  
}
//==============================================================================
// End of File
//==============================================================================