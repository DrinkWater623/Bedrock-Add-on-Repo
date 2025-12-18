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
import { world, system, EntityTypes, Player } from "@minecraft/server";
//Enums
import { EntityInitializationCause } from "@minecraft/server";
//Shared
import { Vector3Lib } from "./common-stable/tools/vectorClass.js";
import { DynamicPropertyLib } from "./common-stable/tools/dynamicPropertyClass.js";
import { PlayerLib, EntityLib } from "./common-stable/gameObjects/index.js";
import { EntitySubscriptions } from "./common-stable/subscriptions/index.js";
import { PlayerSubscriptions } from "./common-stable/subscriptions/index.js";
import { SystemSubscriptions } from "./common-stable/subscriptions/index.js";
//Local
import { alertLog, pack, watchFor, dynamicVars, packDisplayName, chatLog } from './settings.js';
import { registerCustomCommands } from "./chatCmds.js";
import { watchLoop, startWatchLoop } from "./watchLoop.js";
import { ScoreboardLib } from "./common-stable/tools/scoreboardLib.js";
import { devDebug } from "./debug.js";
//import { entityEventProcess, entityScriptEvents, } from './helpers/fn-entities.js';
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
/** @typedef {Parameters<typeof world.afterEvents.playerInteractWithBlock.subscribe>[0]} AfterPlayerInteractWithBlockHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerPlaceBlock.subscribe>[0]} AfterPlayerPlaceBlockHandler */
/** @typedef {Parameters<typeof world.beforeEvents.playerInteractWithBlock.subscribe>[0]} BeforePlayerInteractWithBlockHandler */
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
//==============================================================================
/** @type {AfterEntityDieHandler} */
const onAfterEntityDie = (event) => {
    const { damageSource, deadEntity } = event;
    const { nameTag, dimension, location, typeId } = deadEntity;

    if (typeId !== watchFor.typeId) return;

    let msg = `§gA ${watchFor.display} named ${nameTag} Died @ ${Vector3Lib.toString(location, 0, true)}`;

    //Give the player credit
    const player = damageSource.damagingEntity;
    if (player instanceof Player && player && player.isValid) {
        const sb = watchFor.scoreboards.getScoreboard("Hunters");
        ScoreboardLib.increment(sb, player);
        msg += `\n§aKilled by ${player.nameTag}`;

        //TODO: say something nice
    }
};
//==============================================================================
/** @type {AfterEntitySpawnHandler} */
const onAfterEntitySpawn = (event) => {
    const spawnTick = system.currentTick;

    const entity = event.entity;
    if (!entity) return;
    if (entity.typeId !== watchFor.typeId) return;

    const { dimension, location, nameTag } = entity;
    const isAllowed = DynamicPropertyLib.getBoolean(world, dynamicVars.allowed);

    if (event.cause === EntityInitializationCause.Spawned) {
        DynamicPropertyLib.increment(world, dynamicVars.spawned);
        watchFor.scoreboards.set('Active', 'Spawned', DynamicPropertyLib.getNumber(world, dynamicVars.spawned), 1);

        system.runTimeout(() => {
            startWatchLoop("entitySpawned");
        }, 1);

        //capture who, by testing last block placements saved with this tick
        //to see who matches
        //send this to an FN

        const players = world.getAllPlayers()
            .filter(p => { return DynamicPropertyLib.propertyExists(p, `${pack.cmdNameSpace}:afterInteract_lastSusInteractTick`); });
    }
    //load assumed - no births - but for code transfer, consider born
    else {
        world.sendMessage(`§bA ${watchFor.display} Loaded @ ${Vector3Lib.toString(event.entity.location, 0, true, ', ')}`);

        system.runTimeout(() => {
            startWatchLoop("entityLoad");
        }, 1);
    }

    if (isAllowed) {
        //TODO: get a name if does not have one, regardless of how came
        const msg = `§c§lWither - ${nameTag} (${event.cause})§r in Biome ${dimension.getBiome(location).id} @ §a${Vector3Lib.toString(location, 0, true)}\nPlease help kill!`;
        chatLog.log(msg, watchEntitySubscriptions);
    }
    else {
        const msg = `§c§lA Wither was ${event.cause}§r in Biome ${dimension.getBiome(location).id} @ §6${Vector3Lib.toString(location, 0, true)}\n§cWithers are not allowed per Admin,§a so it will be immediately killed w/o loot`;
        system.runTimeout(() => {
            if (entity.isValid) entity.remove();
        }, 1);
    }
};
//==============================================================================
/** @type {AfterPlayerInteractWithBlockHandler} */
const onAfterPlayerInteractWithBlock = (event) => {
    if (!event.isFirstEvent) return;

    const player = event.player;
    if (!player || !player.isValid) return;

    const itemStack = event.beforeItemStack;
    if (!itemStack) return;
    const itemStackBlock = itemStack.typeId;

    if (![ watchFor.onPlace, watchFor.placedOnBlock ].includes(itemStackBlock)) {
        player.setDynamicProperty(`${pack.cmdNameSpace}:afterInteract_lastSusTick`, 0);
        player.setDynamicProperty(`${pack.cmdNameSpace}:afterInteract_lastSusItemStack`, '');
        return;
    }

    //save this to player for the custom component to verify/use    
    player.setDynamicProperty(`${pack.cmdNameSpace}:afterInteract_lastSusTick`, system.currentTick);
    player.setDynamicProperty(`${pack.cmdNameSpace}:afterInteract_lastSusItemStack`, itemStackBlock);
    player.setDynamicProperty(`${pack.cmdNameSpace}:afterInteract_lastSusBlockLocation`, event.block.location);
};
//==============================================================================
/** @type {AfterPlayerPlaceBlockHandler} */
const onAfterPlayerPlaceBlock = (event) => {

    const player = event.player;
    if (!player || !player.isValid) return;

    const { block } = event;
    if (![ watchFor.onPlace, watchFor.placedOnBlock ].includes(block.typeId)) {
        player.setDynamicProperty(`${pack.cmdNameSpace}:afterPlace_lastSusTick`, 0);
        player.setDynamicProperty(`${pack.cmdNameSpace}:afterPlace_lastSusItemStack`, '');
        return;
    }

    //save this to player for the custom component to verify/use    
    player.setDynamicProperty(`${pack.cmdNameSpace}:afterPlace_lastSusTick`, system.currentTick);
    player.setDynamicProperty(`${pack.cmdNameSpace}:afterPlace_lastSusItemStack`, block.typeId);

};
//==============================================================================  may not be needed
/** @type {BeforeEntityRemovedHandler} */
const onBeforeEntityRemoved = (event) => {
    // Note: "removed" doesn't necessarily mean "died"
    const entity = event.removedEntity;
    if (!entity || entity.typeId !== watchFor.typeId) return;
    const { nameTag, dimension, location } = entity;

    world.setDynamicProperty("deadEntityDimensionId", dimension.id.replace("minecraft:", ""));
    world.setDynamicProperty("deadEntityLocation", location);
    world.setDynamicProperty("deadEntityName", nameTag);
    world.setDynamicProperty("deadEntityId", entity.id);

    system.runTimeout(() => {
        const msg = `§l${nameTag}§r §6Removed @ ${Vector3Lib.toString(location, 0, true)}`;
        alertLog.log(msg, watchEntitySubscriptions);
    }, 1);
};
//==============================================================================
/** @type {BeforePlayerInteractWithBlockHandler} */
const onBeforePlayerInteractWithBlock = (event) => {
    event.cancel = false;
    if (!event.isFirstEvent) return;

    const player = event.player;
    if (!player || !player.isValid) return;

    const itemStack = event.itemStack;
    if (!itemStack) return;
    const itemStackBlock = itemStack.typeId;
    if (![ watchFor.onPlace, watchFor.placedOnBlock ].includes(itemStackBlock)) return;

    const { block } = event;
    const { location } = block;

    system.run(() => {
        //save this to player for the custom component to verify/use    
        player.setDynamicProperty(`${pack.cmdNameSpace}:beforeInteract_lastSusInteractTick`, system.currentTick);
        player.setDynamicProperty(`${pack.cmdNameSpace}:beforeInteract_lastSusInteractItemStack`, itemStackBlock);
        player.setDynamicProperty(`${pack.cmdNameSpace}:beforeInteract_lastSusInteractBlockLocation`, location);
    });
    return;
};
//==============================================================================
/** @type {BeforeStartupHandler} */
const onBeforeStartup = (event) => {
    const ccr = event.customCommandRegistry;
    registerCustomCommands(ccr);
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
        beforeStartup: onBeforeStartup
    });

    entitySubs.afterEntityDie.subscribeWithOptions(onAfterEntityDie, { entities: [ watchFor.typeId ] });
    entitySubs.register({
        afterEntitySpawn: onAfterEntitySpawn,  //includes load... double make sure, load needs to turn on watch loop
        //TODO: entity remove  ??  message of possible unload
    }, debugSubscriptionsOn);

    playerSubs.register({
        afterPlayerPlaceBlock: onAfterPlayerPlaceBlock,
        beforePlayerInteractWithBlock: onBeforePlayerInteractWithBlock
    });

    world.afterEvents.worldLoad.subscribe((event) => {
        pack.worldLoaded = true;
        alertLog.success(`Subscribed to world.afterEvents.worldLoad`, debugSubscriptionsOn);

        // Does the entity exists at all - if not, 
        watchFor.validated = EntityTypes.getAll().map(eObj => eObj.id).includes(watchFor.typeId);
        pack.isWitherAlertSystemOn = watchFor.validated;

        if (!watchFor.validated) {
            alertLog.error(`§6Pack will function because the defined entity is invalid: §c${watchFor.typeId}.\nUpdate scripts/settings.js with a valid entity.`, true);
            //turn off subscriptions
            entitySubs.unsubscribeAll();
            playerSubs.unsubscribeAll();
            systemSubs.unsubscribeAll();
            return;
        }

        /*
            Check world DV for if a wither was active when last player left
            if so, turn everything on

            Are there withers loaded?  -- let load turn on the system
        */
    });

    alertLog.log(`'§8x ${_name} ()'`, debugFunctionsOn);
}
//==============================================================================
// End of File
//==============================================================================