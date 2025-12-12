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
//Enums
import { EntityInitializationCause } from "@minecraft/server";
//Shared
import { Ticks } from "./common-data/globalConstantsLib.js";
import { chance } from "./common-stable/tools/mathLib.js";
import { Vector3Lib } from "./common-stable/tools/vectorClass.js";
import { DynamicPropertyLib } from "./common-stable/tools/dynamicPropertyClass.js";
import { EntityLib, spawnEntityAtLocation } from "./common-stable/entities/entityClass.js";
import { EntitySubscriptions } from "./common-stable/subscriptions/entitySubs-stable.js";
import { PlayerSubscriptions } from "./common-stable/subscriptions/playerSubs-stable.js";
import { SystemSubscriptions } from "./common-stable/subscriptions/systemSubs-stable.js";
//Local
import { alertLog, pack, packDisplayName, toggles } from './settings.js';
import { registerCustomCommands } from "./chatCmds.js";
import { devDebug } from "./helpers/fn-debug.js";
import { entityEventProcess, lastTickAndLocationRegister, stalledSpiderCheckAndFix, flyPopulationCheck, spiderPopulationCheck, entityScriptEvents, } from './helpers/fn-entities.js';
import { airBlock, stairBlocks } from "./common-data/block-data.js";
import { getWorldTime } from "./common-stable/tools/timers.js";
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
const debugOn = false || devDebug.debugOn;
const debugFunctionsOn = false || devDebug.debugFunctionsOn;
const debugSubscriptionsOn = devDebug.debugSubscriptionsOn;
const watchEntitySubscriptions = devDebug.watchEntitySubscriptions;
const watchPlayerActions = devDebug.watchPlayerActions;
//==============================================================================
/** @type {AfterEntityDieHandler} */
const onAfterEntityDie = (event) => {
    if (!toggles.ed_aft) return;

    const entity = event.deadEntity;
    const { location } = entity;
    const whyDied = event.damageSource.cause;
    const msg = `§c${entity.typeId}§r §c Died via ${whyDied} @ ${Vector3Lib.toString(location, 0, true)} -§v afterEvents.entityDie`;
    alertLog.warn(msg, watchEntitySubscriptions);
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
    if (!chance(0.15)) return; //25% chance to spawn pests

    const { block, dimension, brokenBlockPermutation, itemStackBeforeBreak } = event;
    const blockTypeId = brokenBlockPermutation.type.id;
    const location = block.location;


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
//==============================================================================
/** @type {AfterPlayerPlaceBlockHandler} */
const onAfterPlayerPlaceBlock = (event) => {
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
//==============================================================================
/** @type {AfterScriptEventReceiveHandler} */
const onAfterScriptEventReceive = (event) => {
    const { id, message, sourceEntity: entity } = event;

    if (!entity || !entity.isValid) {
        return;
    };
    if (!watchFor.packEntityList().includes(entity.typeId)) {
        return;
    };

    system.runTimeout(() => {
        entityEventProcess(entity, id, message);
    }, 1);
};
//==============================================================================
/** @type {BeforeEntityRemovedHandler} */
const onBeforeEntityRemoved = (event) => {
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
        alertLog.log(msg, watchEntitySubscriptions);

    }, 1);
};
//==============================================================================
/** @type {BeforePlayerInteractWithBlockHandler} */
const onBeforePlayerInteractWithBlock = (event) => {
    event.cancel = false;

    if (!event.isFirstEvent) return;
    const { block, itemStack } = event;
    if (!itemStack || !block) return;

    if (watchFor.customItemList.includes(itemStack.typeId)) {
        rattleEntityFromBlockWithItem(block, itemStack.typeId, event.blockFace, 0.6);
        return;
    }

    //Add Other stuff if needed
    return;
};
//==============================================================================
/** @type {BeforeStartupHandler} */
const onBeforeStartup = (event) => {
    const ccr = event.customCommandRegistry;
    registerCustomCommands(ccr);

     event.blockComponentRegistry.registerCustomComponent(
        'dw623:on_place_arrow', { beforeOnPlayerPlace: e => { lightArrow_onPlace(e); } }
    );

    event.blockComponentRegistry.registerCustomComponent(
        'dw623:on_place_bar', { beforeOnPlayerPlace: e => { lightBar_onPlace(e); } }
    );

    event.blockComponentRegistry.registerCustomComponent(
        'dw623:on_place_mini_block', { beforeOnPlayerPlace: e => { lightMiniBlock_onPlace(e); } }
    );
};
//==============================================================================
const entitySubs = new EntitySubscriptions(packDisplayName, debugSubscriptionsOn);
const playerSubs = new PlayerSubscriptions(packDisplayName, debugSubscriptionsOn);
const systemSubs = new SystemSubscriptions(packDisplayName, debugSubscriptionsOn);
//==============================================================================
export function subscriptionsStable () {
    const _name = 'function subscriptionsStable';
    alertLog.log(`§v* ${_name} ()`, debugFunctionsOn);

    systemSubs.register({
        afterScriptEventReceive: onAfterScriptEventReceive,
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
        alertLog.success(`Subscribed to world.afterEvents.worldLoad`, debugSubscriptionsOn);

        if (debugOn) {
            entitySubs.register({
                afterEntityDie: onAfterEntityDie_debug,
                //afterEntitySpawn:onAfterEntitySpawn_debug,  redundant but keep code
                beforeEntityRemoved: onBeforeEntityRemoved_debug
            }, debugSubscriptionsOn);
            devDebug.dsb.setScoreboardsOn(true);
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