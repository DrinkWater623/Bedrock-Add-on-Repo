//subscribes.js Tree Spider
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
import { airBlock } from "./common-data/index.js";
import { DynamicPropertyLib } from "./common-stable/tools/index.js";
import { EntitySubscriptions } from "./common-stable/subscriptions/index.js";
import { PlayerSubscriptions } from "./common-stable/subscriptions/index.js";
import { SystemSubscriptions } from "./common-stable/subscriptions/index.js";
import { Vector3Lib } from "./common-stable/tools/index.js";
//Local
import { alertLog, pack, packDisplayName, toggles, watchFor } from './settings.js';
import { registerCustomCommands } from "./chatCmds.js";
import { arrow_onPlace,bar_onPlace,miniBlock_onPlace } from "./blockComponent.js";
import { dev } from "./debug.js";
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
//  Blocks
/** @typedef {Parameters<typeof world.beforeEvents.playerInteractWithBlock.subscribe>[0]} BeforePlayerInteractWithBlockHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerBreakBlock.subscribe>[0]} AfterPlayerBreakBlockHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerPlaceBlock.subscribe>[0]} AfterPlayerPlaceBlockHandler */
// System
/** @typedef {Parameters<typeof system.afterEvents.scriptEventReceive.subscribe>[0]} AfterScriptEventReceiveHandler */
/** @typedef {Parameters<typeof system.beforeEvents.startup.subscribe>[0]} BeforeStartupHandler */
//==============================================================================
const debugOn = false || dev.debugOn;
const blockList = watchFor.onPlaceBlockList(); //TODO : put back
//==============================================================================
/** @type {AfterEntityDieHandler} */
const onAfterEntityDie = (event) => {
    if (!toggles.ed_aft) return;

    const entity = event.deadEntity;
    const { location } = entity;
    const whyDied = event.damageSource.cause;
    const msg = `§c${entity.typeId}§r §c Died via ${whyDied} @ ${Vector3Lib.toString(location, 0, true)} -§v afterEvents.entityDie`;
    alertLog.warn(msg, dev.entities.events.afterEntityDie);
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
/** @type {AfterPlayerBreakBlockHandler} */
const onAfterPlayerBreakBlock = (event) => {
    if (!watchFor.onBreakBlockList.includes(event.brokenBlockPermutation.type.id)) return;

    const { block, dimension, brokenBlockPermutation, itemStackBeforeBreak } = event;
    const blockTypeId = brokenBlockPermutation.type.id;
    const location = block.location;
};
//==============================================================================
/** @type {AfterPlayerPlaceBlockHandler} */
const onAfterPlayerPlaceBlock = (event) => {
    if (!watchFor.onPlaceBlockList().includes(event.block.typeId)) return;

    const { block } = event;
    if (!block.isValid) return;
    const { typeId, dimension, location } = block;
    const locationCtr = Vector3Lib.toCenter(location);
};
//==============================================================================
/** @type {BeforeEntityRemovedHandler} */
const onBeforeEntityRemoved = (event) => {
    // Note: "removed" doesn't necessarily mean "died"
    if (!event.removedEntity || !watchFor.entityList.includes(event.removedEntity.typeId)) return;

    const entity = event.removedEntity;
    const { nameTag,  location } = entity;

    system.runTimeout(() => {
        const msg = `§l${nameTag}§r §6Removed @ ${Vector3Lib.toString(location, 0, true)} - beforeEvents.entityRemove ()`;
        alertLog.log(msg, dev.entities.events.entityRemove.before);
    }, 1);
};
//==============================================================================
/** @type {BeforePlayerInteractWithBlockHandler} */
const onBeforePlayerInteractWithBlock = (event) => {
    event.cancel = false;
    if (!event.isFirstEvent) return;

    DynamicPropertyLib.onPlayerInteractWithBlockBeforeEventInfo_set(
        event,
        [],
        blockList,
        dev.blocks.events.playerInteractWithBlock.before || dev.players.events.playerInteractWithBlock.before
    );
};
//==============================================================================
/** @type {BeforeStartupHandler} */
const onBeforeStartup = (event) => {
    const ccr = event.customCommandRegistry;
    registerCustomCommands(ccr);

    event.blockComponentRegistry.registerCustomComponent(
        'dw623:on_place_arrow', { beforeOnPlayerPlace: e => { arrow_onPlace(e); } }
    );

    event.blockComponentRegistry.registerCustomComponent(
        'dw623:on_place_bar', { beforeOnPlayerPlace: e => { bar_onPlace(e); } }
    );

    event.blockComponentRegistry.registerCustomComponent(
        'dw623:on_place_mini_block', { beforeOnPlayerPlace: e => { miniBlock_onPlace(e); } }
    );
};
//==============================================================================
const entitySubs = new EntitySubscriptions(packDisplayName, true);
const playerSubs = new PlayerSubscriptions(packDisplayName, true);
const systemSubs = new SystemSubscriptions(packDisplayName, true);
//==============================================================================
export function subscriptionsStable () {
    const _name = 'function subscriptionsStable';
    alertLog.log(`§v* ${_name} ()`, dev.debugFunctionsOn);

    systemSubs.register({        
        beforeStartup: onBeforeStartup
    });

    entitySubs.afterEntityLoad.subscribe(onAfterEntityLoad);

    playerSubs.register({
        afterPlayerBreakBlock: onAfterPlayerBreakBlock,
        afterPlayerPlaceBlock: onAfterPlayerPlaceBlock,
        beforePlayerInteractWithBlock: onBeforePlayerInteractWithBlock
    });

    world.afterEvents.worldLoad.subscribe((event) => {
        pack.worldLoaded = true;
        alertLog.success(`Subscribed to world.afterEvents.worldLoad`, dev.debugSubscriptionsOn);

        if (debugOn) {
            entitySubs.register({
                afterEntityDie: onAfterEntityDie,
                //afterEntitySpawn:onAfterEntitySpawn_debug,  redundant but keep code
                beforeEntityRemoved: onBeforeEntityRemoved
            }, dev.debugSubscriptionsOn);
        }
    });

    alertLog.log(`'§8x ${_name} ()'`, dev.debugFunctionsOn);
}
//==============================================================================
// End of File
//==============================================================================