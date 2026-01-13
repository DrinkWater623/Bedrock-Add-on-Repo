//subscribes.js    After-Life
//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
import { world, system, Player, TicksPerSecond } from "@minecraft/server";
//shared
import { PlayerSubscriptions, SystemSubscriptions } from "./common-stable/subscriptions/index.js";
import { DynamicPropertyLib, Vector3Lib, worldRun } from "./common-stable/tools/index.js";
import { FillCommand } from "./common-stable/structures/fillCommand.js";
//local
import { dimensionSuffix, playerAliveTicksCounterJob, updateAllPlayerStats, updatePlayerStats } from './helpers/fn-stable.js';
import { alertLog, dynamicVars, pack, packDisplayName } from './settings.js';
import { registerCustomCommands } from "./chatCmds.js";
import * as bot from "./helpers/deathBot.js";
import { dev } from "./debug.js";
import { BlockTypeIds } from "./common-data/BlockTypeIds.js";
//==============================================================================
/** @typedef {Parameters<typeof world.afterEvents.entityDie.subscribe>[0]} AfterPlayerDieHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerSpawn.subscribe>[0]} AfterPlayerSpawnHandler */
// System
/** @typedef {Parameters<typeof system.afterEvents.scriptEventReceive.subscribe>[0]} AfterScriptEventReceiveHandler */
/** @typedef {Parameters<typeof system.beforeEvents.startup.subscribe>[0]} BeforeStartupHandler */

//==============================================================================
/** @type {AfterPlayerSpawnHandler} */
const onAfterPlayerSpawn = (event) => {
    const player = event.player;

    if (pack.debugOn) {
        const eventName = 'afterPlayerSpawn';
        const msg = `${dev.alertLabel(eventName)} ${event.player.name} ${event.initialSpawn ? '(§aFirst Time§r)' : ''} @  ${dev.vectorStr(event.player.location)}`;
        dev.alertPlayerEventLog(eventName, msg);
    }

    if (player.isValid) {
        //Initialize
        DynamicPropertyLib.addNumber(player, dynamicVars.firstTick, 0);

        //Session
        if (event.initialSpawn) system.runTimeout(() => { playerAliveTicksCounterJob(player); }, TicksPerSecond);

        //First Time Load (Ever)
        if (DynamicPropertyLib.getNumber(player, dynamicVars.firstTick) == 0) {
            const nowTick = system.currentTick + 1;

            player.setDynamicProperty(dynamicVars.deathMsgWaiting, false);
            player.setDynamicProperty(dynamicVars.deathCounter, 0);
            player.setDynamicProperty(dynamicVars.aliveTicks, 1);
            player.setDynamicProperty(dynamicVars.longestTicksAlive, 1);
            player.setDynamicProperty(dynamicVars.firstTick, nowTick);
            player.setDynamicProperty(dynamicVars.lastDeathTick, nowTick);

            dev.alertPlayerEventLog('afterPlayerSpawn', `${player.nameTag}'s Dynamic Vars set for first time`);
            //TODO: add message to player on what to do
            return;
        }
        //Not First Time
        else {
            const deathMsgWaiting = DynamicPropertyLib.getBoolean(player, dynamicVars.deathMsgWaiting);
            let deathError = false;
            if (deathMsgWaiting) {
                let dimensionId = DynamicPropertyLib.getString(player, dynamicVars.deathDimension);

                if (dimensionId) {
                    dimensionId = dimensionSuffix(dimensionId);
                    const deathCoords = DynamicPropertyLib.getVector(player, dynamicVars.deathCoordinates);
                    if (deathCoords) {
                        let msg = "* §gYou last ";
                        //msg += event.initialSpawn ? `last  ` : `just `;  BUG - this subscription runs twice with and will not align if they did not respawn - so forget the customization
                        msg += `§cDied§g in the ${dimensionId} `;
                        //@ts-ignore
                        msg += `§a@§g ${Vector3Lib.toString(player.getDynamicProperty(dynamicVars.deathCoordinates))}`;
                        msg += "\n§r» Type §aal:where anytime to see it again";
                    }
                    else deathError = true;
                }
                else deathError = true;

                if (deathError) {
                    var msg =
                        `§c* Death Coordinates are Missing`
                        + `\n§aAlert ${pack.reportBugs} if you continue to see this error`
                        + `\n§e==> afterEvents.playerSpawn: ${player.nameTag}`
                        + `\n§e==> deathMsgWaiting: ${deathMsgWaiting}`
                        + `\n§e==> event.initialSpawn: ${event.initialSpawn}`;
                    alertLog.error(msg);
                }
                else system.runTimeout(() => { player.sendMessage(`\n\n${msg}\n\n`); }, 40);

                player.setDynamicProperty(dynamicVars.deathMsgWaiting, false);
            }
            updateAllPlayerStats();
            return;
        }
    }
};
//==============================================================================
/** @type {AfterPlayerDieHandler} */
const onAfterPlayerDie = (event) => {
    const player = event.deadEntity;
    if (!(player instanceof Player) || !player.isValid) return;

    const dimension = player.dimension;
    const location = player.location;
    const deathTick = system.currentTick;
    if (pack.debugOn) {
        const eventName = 'afterPlayerDie';
        let msg = `${dev.alertLabel(eventName)} ${event.deadEntity.nameTag ? event.deadEntity.nameTag : event.deadEntity.typeId}`;
        msg += ` (§l${event.deadEntity.isValid ? '§aValid' : '§cInvalid'}§r)`;
        msg += `  |  ${dev.fieldLabel('Cause')} ${event.damageSource.cause} ${event.damageSource.damagingEntity ? `  |  ${dev.fieldLabel('By')} ` + (event.damageSource.damagingEntity && event.damageSource.damagingEntity.isValid && event.damageSource.damagingEntity.nameTag ? event.damageSource.damagingEntity.nameTag : event.damageSource.damagingEntity.typeId) : ''}`;
        dev.alertPlayerEventLog(eventName, msg);
    }

    // this is not done right now, must be in  queue because if you hard exit game instead
    // it does not save the vars, if you select exit game, it does

    updatePlayerStats(player);
    DynamicPropertyLib.increment(player, dynamicVars.deathCounter);
    player.setDynamicProperty(dynamicVars.deathMsgWaiting, true);
    player.setDynamicProperty(dynamicVars.deathDimension, dimension.id);
    player.setDynamicProperty(dynamicVars.deathCoordinates, location);
    player.setDynamicProperty(dynamicVars.lastDeathTick, deathTick);
    system.runTimeout(() => {
        player.setDynamicProperty(dynamicVars.aliveTicks, 1);
        //updateAllPlayerStats();
    }, 1);
    //TODO: add other death Counters Here --maybe death by different sources... for fun        

    if (world.gameRules.keepInventory) return; //Nothing to do

    //====================================
    // Launch a death bot at that location
    //====================================
    //Initial protection of items - fingers crosses
    if (!dimension.isChunkLoaded(location)) return;

    system.run(() => {
        bot.launchDeathBots(dimension, location, player.name);
        player.sendMessage(`\n\n*§6Death-Bot Launched to §cDeath Coords§r (${Vector3Lib.toString(location, 0, true)})§6 to try to grab/hold your stuff`);
    });
    /*
    //test scattering of stuff
    blockExplosion
    entityExplosion
    flyIntoWall        
    wither

    fallingBlock ? dripstone ? test
    void ?? not in normal game, but test in the end if fall... TODO:
    */

    let radius = 3;
    // Protective bubble - for player to TP into when command is used to get back to last location
    const bubbleCenter = Vector3Lib.truncate({ x: location.x, y: location.y + 2, z: location.z });
    switch (event.damageSource.cause) {
        case 'drowning': 
            FillCommand.waterBubble(dimension, bubbleCenter, radius);
            break;
        case 'lava': 
            FillCommand.lavaBubble(dimension, bubbleCenter, radius);
            break;
        case 'freezing':
            FillCommand.powderSnowBubble(dimension, bubbleCenter, radius);
        case 'suffocation':
            const bubbleMaterial = 'minecraft:light_gray_stained_glass'
            const replacePool=BlockTypeIds.getNaturalGravityBlockTypeIds()
            FillCommand.bubble(dimension, bubbleCenter, radius, bubbleMaterial, replacePool)
            break;
        default:
            break;
    }
    //LET'S SEE IF THE BOT CAN HANDLE THE LAVA ALONE
    //let fillArea = ``;
    //let command = ``;
    //let xz = 5;
    //xz = 1;
    //fillArea = `${location.x - xz} ${location.y - 1} ${location.z - xz} ${location.x + xz} ${location.y} ${location.z + xz}`;
    //command = `fill ${fillArea} water replace lava`;
    //worldRun(command, dimension);
    //xz = 16;
    //fillArea = `${location.x - xz} ${location.y - 2} ${location.z - xz} ${location.x + xz} ${location.y + 2} ${location.z + xz}`;
    //command = `fill ${fillArea} flowing_water replace lava`;
    //worldRun(command, dimension, 1, location);
    //command = `fill ${fillArea} flowing_water replace flowing_lava`;
    //worldRun(command, dimension, 1, location);
    
    /*
    blockExplosion
    drowning
    entityExplosion
    fallingBlock
    flyIntoWall
    freezing
    lava
    suffocation
    void
    wither
    P
    anvil
    P
    P
    campfire
    P
    charging
    P
    contact
    P
    dehydration
    P
    entityAttack
    P
    P
    fall
    P
    P
    fire
    P
    fireTick
    P
    fireworks
    P
    P
    P
    P
    lightning
    P
    maceSmash
    P
    magic
    P
    magma
    P
    none
    P
    override
    P
    piston
    P
    projectile
    P
    ramAttack
    P
    selfDestruct
    P
    sonicBoom
    P
    soulCampfire
    P
    stalactite
    P
    stalagmite
    P
    starve
    P
    P
    temperature
    P
    thorns
    P
    P
    */
};
//==============================================================================
/** @type {AfterScriptEventReceiveHandler} */
const onAfterScriptEventReceive = (event) => {
    const { id, message } = event;
    if (!id.startsWith('dw623:death_bot')) return;

    if (id === 'dw623:death_bot_debug') {
        let msg = `currentTick: ${system.currentTick}`;
        if (message && ![ 'null', 'none', 'noMsg' ].includes(message)) msg += `: ${message}`;
        dev.alertLog(`§bTick:§r ${system.currentTick} §6(scriptEvent) ==>§r ${msg}`,dev.isDebugEntityObject('death_bot'));
    }
};
/** @type {BeforeStartupHandler} */
const onBeforeStartup = (event) => {
    const ccr = event.customCommandRegistry;
    dev.alertFunctionKey('onBeforeStartup');
    registerCustomCommands(ccr);
};
//==============================================================================
const playerSubs = new PlayerSubscriptions(packDisplayName, dev.isDebugFunction('subscriptionsPlayers'));
const systemSubs = new SystemSubscriptions(packDisplayName, dev.isDebugFunction('subscriptionsSystem'));
//==============================================================================
export function subscriptionsStable () {
    const _name = 'subscriptionsStable';
    dev.alertFunctionKey(_name, true);

    systemSubs.register({
        afterScriptEventReceive: onAfterScriptEventReceive,
        beforeStartup: onBeforeStartup
    });

    playerSubs.register({
        afterPlayerDie: onAfterPlayerDie,
        afterPlayerSpawn: onAfterPlayerSpawn
    });

    world.afterEvents.worldLoad.subscribe((event) => {
        pack.worldLoaded = true;

        system.runTimeout(() => {
            // validate death-bot 
        }, 60);

    });
}
//==============================================================================
// End of File
//==============================================================================