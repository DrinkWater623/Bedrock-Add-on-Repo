// players.js  F3 Testing Bedrock Add-on
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
========================================================================*/
import { EntityComponentTypes, EntityHealthComponent, Player, system, world } from "@minecraft/server";
//Shared
import { Entities } from "../common-stable/gameObjects/index.js";
import { PlayerSubscriptions } from "../common-stable/subscriptions/index.js";
import { DynamicPropertyLib, round } from "../common-stable/tools/index.js";
//Local
import { packDisplayName, watchFor } from '../settings.js';
import { dev } from "../debug.js";
//==============================================================================
/** The function type subscribe expects. */
//  Players
/** @typedef {Parameters<typeof world.afterEvents.playerBreakBlock.subscribe>[0]} AfterPlayerBreakBlockHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerEmote.subscribe>[0]} AfterPlayerEmoteHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerGameModeChange.subscribe>[0]} AfterPlayerGameModeChangeHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerHotbarSelectedSlotChange.subscribe>[0]} AfterPlayerHotbarSelectedSlotChangeHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerInputModeChange.subscribe>[0]} AfterPlayerInputModeChangeHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerInputPermissionCategoryChange.subscribe>[0]} AfterPlayerInputPermissionCategoryChangeHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerInteractWithBlock.subscribe>[0]} AfterPlayerInteractWithBlockHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerInteractWithEntity.subscribe>[0]} AfterPlayerInteractWithEntityHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerInventoryItemChange.subscribe>[0]} AfterPlayerInventoryItemChangeHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerJoin.subscribe>[0]} AfterPlayerJoinHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerLeave.subscribe>[0]} AfterPlayerLeaveHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerPlaceBlock.subscribe>[0]} AfterPlayerPlaceBlockHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerSpawn.subscribe>[0]} AfterPlayerSpawnHandler */

/** @typedef {Parameters<typeof world.beforeEvents.playerBreakBlock.subscribe>[0]} BeforePlayerBreakBlockHandler */
/** @typedef {Parameters<typeof world.beforeEvents.playerGameModeChange.subscribe>[0]} BeforePlayerGameModeChangeHandler */
/** @typedef {Parameters<typeof world.beforeEvents.playerInteractWithBlock.subscribe>[0]} BeforePlayerInteractWithBlockHandler */
/** @typedef {Parameters<typeof world.beforeEvents.playerInteractWithEntity.subscribe>[0]} BeforePlayerInteractWithEntityHandler */
/** @typedef {Parameters<typeof world.beforeEvents.playerLeave.subscribe>[0]} BeforePlayerLeaveHandler */

/** @typedef {Parameters<typeof world.afterEvents.entityDie.subscribe>[0]} AfterPlayerDieHandler */
/** @typedef {Parameters<typeof world.afterEvents.entityHealthChanged.subscribe>[0]} AfterPlayerHealthChangedHandler */
/** @typedef {Parameters<typeof world.afterEvents.entityHitBlock.subscribe>[0]} AfterPlayerHitBlockHandler */
/** @typedef {Parameters<typeof world.afterEvents.entityHitEntity.subscribe>[0]} AfterPlayerHitEntityHandler */
/** @typedef {Parameters<typeof world.afterEvents.entityHurt.subscribe>[0]} AfterPlayerHurtHandler */

//==============================================================================
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
//==============================================================================
const debugSubscriptions = dev.isDebugFunction('subscriptions');
//==============================================================================
/** @type {AfterPlayerBreakBlockHandler} */
const onAfterPlayerBreakBlock = (event) => {
    if (!dev.blockWatchList.includes((event.brokenBlockPermutation.type.id))) return;
//TODO: if earth - double output of ores
    const eventName = 'afterPlayerBreakBlock';
    const alert = dev.isDebugBlockEvent(eventName) || dev.isDebugPlayerEvent(eventName);
    if (alert) {
        const { block, brokenBlockPermutation } = event;
        const blockTypeId = brokenBlockPermutation.type.id;
        const location = block.location;
        const msg = `${dev.alertLabel(eventName)} ${event.player.name}  | ${dev.fieldLabel('Block')}${blockTypeId} @ ${dev.vectorStr(location)}`;
        dev.alertLog(msg, true);
    }
};
//==============================================================================
/** @type {AfterPlayerDieHandler} */
const onAfterPlayerDie = (event) => {
    const eventName = 'afterPlayerDie';
    let msg = `${dev.alertLabel(eventName)} ${event.deadEntity.nameTag ? event.deadEntity.nameTag : event.deadEntity.typeId}`;
    msg += ` (§l${event.deadEntity.isValid ? '§aValid' : '§cInvalid'}§r)`;
    msg += `  |  ${dev.fieldLabel('Cause')} ${event.damageSource.cause} ${event.damageSource.damagingEntity ? `  |  ${dev.fieldLabel('By')} ` + (event.damageSource.damagingEntity && event.damageSource.damagingEntity.isValid && event.damageSource.damagingEntity.nameTag ? event.damageSource.damagingEntity.nameTag : event.damageSource.damagingEntity.typeId) : ''}`;
    dev.alertPlayerEventLog(eventName, msg);
};
//==============================================================================
/** @type {AfterPlayerHealthChangedHandler} */
const onAfterPlayerHealthChanged = (event) => {
    const eventName = 'afterPlayerHealthChanged';
    let msg = `${dev.alertLabel(eventName)} ${event.entity.nameTag} ${dev.fieldLabel('From')} ${round(event.oldValue, 2)} ${dev.fieldLabel('To')} ${round(event.newValue, 2)}`;
    dev.alertPlayerEventLog(eventName, msg);
};
//==============================================================================
/** @type {AfterPlayerHitEntityHandler} */
const onAfterPlayerHitEntity = (event) => {
    const eventName = 'afterPlayerHitEntity';
    let msg = `${dev.alertLabel(eventName)} ${event.damagingEntity.nameTag ?? event.damagingEntity.typeId} ${dev.fieldLabel('Hit')} ${event.hitEntity.nameTag ? event.hitEntity.nameTag : event.hitEntity.typeId}`;
    dev.alertPlayerEventLog(eventName, msg);
};
//==============================================================================
// Idea - damage counter
/** @type {AfterPlayerHurtHandler} */
const onAfterPlayerHurt = (event) => {
    // Fake event with entity option default to Player
    const eventName = 'afterPlayerHurt';
    const player = event.hurtEntity;
    const damagingEntity = event.damageSource.damagingEntity;
    let msg = `${dev.alertLabel(eventName)} ${player.nameTag} | ${dev.fieldLabel('Damage')} ${round(event.damage, 2)}`;
    msg += `  | ${dev.fieldLabel('Cause')} ${event.damageSource.cause} ${dev.fieldLabel('By')} ${Entities.name_get(damagingEntity ?? null) ?? 'Unknown'}`;
    dev.alertPlayerEventLog(eventName, msg);

    if (!damagingEntity || !player.isValid) return;
    if (!dev.isDebugFunction('alertElementAddOn')) return;

    const damagingEntityTypeId = damagingEntity.typeId;
    const element = DynamicPropertyLib.getString(player, 'element');
    if (element == 'air') {
        const list = [
            'minecraft:ghast',
            'minecraft:phantom',
            'minecraft:skeleton',
            'minecraft:stray',
            'minecraft:wither_skeleton',
            'minecraft:wither'
        ];

        if (event.damageSource.cause != 'projectile' && !list.includes(damagingEntityTypeId)) return;
    }
    else if (element == 'earth') {
        const list = [
            'minecraft:zombie',
            'minecraft:skeleton',
            'minecraft:stray',
            'minecraft:husk'
        ];

        if (!list.includes(damagingEntityTypeId)) return;
    }
    else if (element == 'fire') {
        const list = [
            //testing to see
            'minecraft:creeper',
            'minecraft:ghast',
            'minecraft:wither',
            //normal
            'minecraft:blaze',
            'minecraft:magma'
        ];

        if (!list.includes(damagingEntityTypeId)) return;
    }
    else if (element == 'water') {
        const list = [
            'minecraft:drowned',
            'minecraft:pufferfish',
            'minecraft:guardian'
        ];

        if (!list.includes(damagingEntityTypeId)) return;
    }
    else {
        return;
    }

    //Fix Damage Given
    system.run(() => {
        const health = player.getComponent(EntityComponentTypes.Health);
        if (!health) return;
        const oldValue = health.currentValue;
        const newValue = Math.min(oldValue + event.damage + 0.5, health.effectiveMax);
        health.setCurrentValue(newValue);
        console.warn(`§dElement:§r §l${element}§r  |  §cDamaged Health:§r ${oldValue}  |  §aNew Health:§r ${newValue}`);
        //health steal - like thorns
        if (damagingEntity.isValid) {
            const damagingEntityHealth = damagingEntity.getComponent(EntityComponentTypes.Health);
            if (damagingEntityHealth) {
                const oldValue = damagingEntityHealth.currentValue;
                const newValue = oldValue - event.damage - 0.5;
                damagingEntityHealth?.setCurrentValue(newValue);
            }
        }
        const hunger = player.getComponent(EntityComponentTypes.Hunger);
        if (hunger) console.warn(`hunger is ${hunger.currentValue}  max = ${hunger.effectiveMax} `);

        //const breath = player.getComponent(EntityComponentTypes.Breathable);
        //if (breath) console.warn(`airSupply is ${breath.airSupply}  max = ${breath.totalSupply}`);

        const underWater = player.getComponent(EntityComponentTypes.UnderwaterMovement);
        if (underWater) console.warn(`under water movement is ${round(underWater.currentValue, 2)}  max = ${round(underWater.effectiveMax, 2)} `);

    });

};
//==============================================================================
/** @type {AfterPlayerJoinHandler} */
const onAfterPlayerJoin = (event) => {
    const eventName = 'afterPlayerJoin';
    const msg = `${dev.alertLabel(eventName)} ${event.playerName} | ${dev.fieldLabel('Player Id')} ${event.playerId}`;
    dev.alertPlayerEventLog(eventName, msg);
};
//==============================================================================
/** @type {AfterPlayerLeaveHandler} */
const onAfterPlayerLeave = (event) => {
    const eventName = 'afterPlayerLeave';
    const msg = `${dev.alertLabel(eventName)} ${event.playerName} | ${dev.fieldLabel('Player Id')} ${event.playerId}`;
    dev.alertPlayerEventLog(eventName, msg);
};
//==============================================================================
/** @type {BeforePlayerLeaveHandler} */
const onBeforePlayerLeave = (event) => {
    const eventName = 'afterPlayerLeave';
    const msg = `${dev.alertLabel(eventName)} ${event.player.name})`;
    dev.alertPlayerEventLog(eventName, msg);
};
//==============================================================================
/** @type {AfterPlayerSpawnHandler} */
const onAfterPlayerSpawn = (event) => {
    const eventName = 'afterPlayerSpawn';
    const msg = `${dev.alertLabel(eventName)} ${event.player.name} ${event.initialSpawn ? '(§aFirst Time§r)' : ''} @  ${dev.vectorStr(event.player.location)}`;
    dev.alertPlayerEventLog(eventName, msg);
};
//==============================================================================
/**
 * Captures the faceLocation information for the placeBlock event to use for permutations. 
 * Maybe one day they will add that property to the placeBlock event directly.
 * 
 * Alter and add your block lists in settings.js watchFor as needed
 *  @type {BeforePlayerInteractWithBlockHandler} 
 * */
const onBeforePlayerInteractWithBlock = (event) => {
    //TODO: earth can get ore out without breaking - MAY BE TOO OP?????
    //This feeds block component onPlace since it has no face location
    event.cancel = false;
    if (!event.isFirstEvent) return;
    if (!event.itemStack) return;
    if (!event.itemStack.typeId.includes('_ore')) return;   
};
//==============================================================================
const playerSubs = new PlayerSubscriptions(packDisplayName, dev.isDebugFunction('subscriptionsPlayers'));
export function subscriptionsPlayers () {
    const _name = 'subscriptionsPlayers';
    dev.alertFunctionKey(_name, true);

    playerSubs.register({
        afterPlayerBreakBlock: onAfterPlayerBreakBlock,
        afterPlayerDie: onAfterPlayerDie,
        afterPlayerHealthChanged: onAfterPlayerHealthChanged,
        afterPlayerHitEntity: onAfterPlayerHitEntity,
        afterPlayerHurt: onAfterPlayerHurt,
        afterPlayerJoin: onAfterPlayerJoin,
        afterPlayerLeave: onAfterPlayerLeave,
        afterPlayerSpawn: onAfterPlayerSpawn,
        beforePlayerInteractWithBlock: onBeforePlayerInteractWithBlock,
        beforePlayerLeave: onBeforePlayerLeave
    });

}
//==============================================================================
// End of File
//==============================================================================