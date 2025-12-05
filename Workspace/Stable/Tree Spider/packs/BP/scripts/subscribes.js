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
import { alertLog, pack, watchFor, entityDynamicVars, packDisplayName } from './settings.js';
import { registerCustomCommands } from "./chatCmds.js";
import { rattleEntityFromBlockWithItem, validNatureBlockForSpiders } from './helpers/fn-blocks.js';
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
//TODO: move to watchFor object in settings
/** @type {string[]} */
const watchForBlockTypes_spiders = [
    watchFor.spider_home_typeId,
    watchFor.spider_foodBlock_typeId,
    "minecraft:cauldron",
    ...watchFor.target_leaves,
    ...watchFor.target_nature,
    ...stairBlocks,
];
/** @type {string[]} */
const watchForBlockTypes_flies = [
    watchFor.fly_home_typeId,
    ...watchFor.fly_food_blocks
];
const watchForBlockTypes = [ ...watchForBlockTypes_spiders ]
    .concat(watchForBlockTypes_flies);
//==============================================================================
/** @type {AfterEntityDieHandler} */
const onAfterEntityDie_debug = (event) => {
    const entity = event.deadEntity;
    const { nameTag, dimension, location } = entity;
    const whyDied = event.damageSource.cause;
    const msg = `§r§l${nameTag ? nameTag : "No-Name"}§r §c Died via ${whyDied} @ ${Vector3Lib.toString(location, 0, true)} -§r afterEvents.entityDie ()`;
    alertLog.warn(msg, watchEntitySubscriptions);
    system.runTimeout(() => {
        const x = `die: §c${whyDied}`;
        devDebug.dsb.increment('deaths', x);
        devDebug.dsb.increment('stats', x);
    }, 1);
};
//==============================================================================
/** @type {AfterEntityLoadHandler} */
const onAfterEntityLoad = (event) => {
    const entity = event.entity;

    if (!entity || !entity.isValid) return;
    if (entity.typeId !== watchFor.spider_typeId) return;

    const { dimension, location, nameTag } = entity;

    if (nameTag) {
        //means re-load???
        system.runTimeout(() => {
            lastTickAndLocationRegister(entity); //This is the most needed part...
            if (watchEntitySubscriptions) {
                DynamicPropertyLib.add(entity, entityDynamicVars.entityLoads, 1);
                devDebug.dsb.increment('stats', 'loaded');
                const msg = `§l${nameTag}§r §eLoaded in Biome ${dimension.getBiome(location).id} @ ${Vector3Lib.toString(location, 0, true)} §r()`;
                alertLog.log(msg, watchEntitySubscriptions);
            }
            const isBaby = entity.hasComponent('minecraft:is_baby');
            if (entity.isValid) entity.triggerEvent(isBaby ? entityScriptEvents.baby_spider_loadedEventName : entityScriptEvents.spider_loadedEventName);
        }, 1);
    }
};
//==============================================================================
/** @type {AfterEntitySpawnHandler} */
const onAfterEntitySpawn_debug = (event) => {
    const entity = event.entity;
    if (!entity) return;
    if (entity.typeId !== watchFor.spider_typeId) return;

    const { dimension, location, nameTag } = entity;

    system.runTimeout(() => {
        const msg = `§aEntity Spawned (${event.cause}) in Biome ${dimension.getBiome(location).id}: §l${nameTag}§r§6 @ ${Vector3Lib.toString(location, 0, true)}`;
        alertLog.log(msg, watchEntitySubscriptions);

        if (event.cause === EntityInitializationCause.Born) {
            devDebug.dsb.increment('stats', 'born', 1, 1);
            DynamicPropertyLib.add(entity, entityDynamicVars.entityBorn, 1);
        }
        else if (event.cause === EntityInitializationCause.Loaded) {
            devDebug.dsb.increment('stats', 'loaded', 1, 1);
            DynamicPropertyLib.add(entity, entityDynamicVars.entityLoads, 1);
        }
        else if (event.cause === EntityInitializationCause.Spawned) {
            devDebug.dsb.increment('stats', 'spawned');
            DynamicPropertyLib.add(entity, entityDynamicVars.entitySpawns, 1);
        }
    }, 1);
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
//move to fn-entities later?
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
/** @type {BeforeEntityRemovedHandler} */
const onBeforeEntityRemoved_debug = (event) => {
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
};
//==============================================================================
//move to fn-entities later?
function validateEntityFiles (debugMe = false) {
    const _name = 'function validateEntityFiles';
    alertLog.log(`§v* ${_name} ()`, debugFunctionsOn);

    //find any player and get a location at head    
    const players = world.getAllPlayers();
    const anyPlayer = players.length ? players[ 0 ] : null;

    const dimension = anyPlayer ? anyPlayer.dimension : world.getDimension("overworld");
    const location = anyPlayer ? anyPlayer.location : world.getDefaultSpawnLocation();
    location.y += 24;

    watchFor.validated = true;
    watchFor.packEntityList().forEach(typeId => {
        pack.validatedEntities.set(typeId, false);

        //@ts-expect-error
        const entity = dimension.spawnEntity(typeId, location, { initialPersistence: true, spawnEvent: entityScriptEvents.entity_validatedEventName });
        if (entity) {
            alertLog.success(`Entity spawn validated for typeId: ${typeId} - isValid: ${entity.isValid}`, debugMe);
            pack.validatedEntities.set(typeId, true);
            system.runTimeout(() => {
                if (entity.isValid) {
                    //entity.applyImpulse({x:0,y:10,z:0})
                    entity.remove();
                }
            }, 10);
        }
        else {
            watchFor.validated = false;
            alertLog.error(`Entity spawn failed for typeId: ${typeId}`, debugOn);
        }
    });

    if (!watchFor.validated) {
        alertLog.error(`A ${pack.packName} §lAdd-on entity file is broken or missing. Please fix the issue before using this pack.`);
        entitySubs.unsubscribeAll(debugSubscriptionsOn || watchEntitySubscriptions);
        playerSubs.unsubscribeAll(debugSubscriptionsOn || watchPlayerActions);
        systemSubs.unsubscribeAll(debugSubscriptionsOn);
        devDebug.allOff();
        return;
    }

    //OKAY to install interval Jobs now
    system.runTimeout(() => {
        if (watchFor.stalledCheckRunInterval) {
            alertLog.log(`Starting stalled spider check every ${watchFor.stalledCheckRunInterval} minutes`, debugMe);
            system.runInterval(() => {
                stalledSpiderCheckAndFix();
            }, Ticks.perMinute * Math.abs(watchFor.stalledCheckRunInterval));
        }
        else alertLog.warn(`Stalled spider check interval is set to 0 - not running check`, debugMe);

        if (watchFor.flyPopulationCheckRunInterval) {
            alertLog.log(`Starting fly population check every ${watchFor.flyPopulationCheckRunInterval} minutes`, debugMe);
            system.runInterval(() => {
                flyPopulationCheck();
            }, Ticks.perMinute * Math.abs(watchFor.flyPopulationCheckRunInterval));
        }
        else alertLog.warn(`Fly population check interval is set to 0 - not running check`, debugMe);

        if (watchFor.spiderPopulationCheckRunInterval) {
            alertLog.log(`Starting spider population check every ${watchFor.spiderPopulationCheckRunInterval} minutes`, debugMe);
            system.runInterval(() => {
                spiderPopulationCheck();
            }, Ticks.perMinute * Math.abs(watchFor.spiderPopulationCheckRunInterval));
        }
        else alertLog.warn(`Spider population check interval is set to 0 - not running check`, debugMe);

        if (watchFor.eatFireFliesOnlyAtNight) {
            alertLog.log(`Starting daytime removal of Fire Flies minecraft hour`, debugMe);
            system.runInterval(() => {
                const hourOfDay = getWorldTime().hours;
                if (hourOfDay > 7 && hourOfDay < 15) {
                    const fireflies = EntityLib.getAllEntities({ type: watchFor.firefly_typeId });
                    if (fireflies.length) { fireflies.forEach(e => { if (e.isValid) e.remove(); }); }
                }
            }, Ticks.minecraftHour * 1);
        }
        else alertLog.log(`Fireflies allowed in daytime`, debugMe);

    }, 5);
}
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
            devDebug.dsb.setDebug(true);
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