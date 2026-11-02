//@ts-check
import { world, system, TicksPerDay, Player } from "@minecraft/server";
import { dev, alertLog, dynamicVars, scoreboards, pack } from './settings.js';
import { DynamicPropertyLib } from "./commonLib/dynamicPropertyClass.js";
import { EntityLib } from "./commonLib/entityClass.js";
import { round } from "./commonLib/mathClass.js";
import { numberWithSuffix } from "./commonLib/stringClass.js";
//==============================================================================
export function beforeEvents_worldInitialize () {

    alertLog.success("§aInstalling beforeEvents.worldInitialize §c(debug mode)", dev.debugSubscriptions);

    world.beforeEvents.worldInitialize.subscribe((event) => {
        //ensure exists
        DynamicPropertyLib.addNumber(world, dynamicVars.player_id, 0);
    });
}
//==============================================================================
export function afterEvents_worldInitialize () {


    alertLog.success("§aInstalling afterEvents.worldInitialize §c(debug mode)", dev.debugSubscriptions);

    world.afterEvents.worldInitialize.subscribe((event) => {

        system.runInterval(() => {
            updatePlayerStats();
        }, pack.statUpdateIntervalTicks);

    });
}
//==============================================================================
export function afterEvents_entityDie () {
    alertLog.success("§aInstalling afterEvents.entityDie §c(debug mode)", dev.debugSubscriptions);
    world.afterEvents.entityDie.subscribe((event) => {
        const { damageSource, deadEntity } = event;
        const { cause, damagingEntity } = damageSource;

        if (deadEntity && deadEntity.isValid()) {
            if (deadEntity instanceof Player) {
                scoreboards.playerDeaths.ptr?.addScore(deadEntity, 1);

                if (damagingEntity && damagingEntity.isValid()) {
                    if (damagingEntity instanceof Player) {
                        scoreboards.pvpDeathCount.ptr?.addScore(deadEntity, 1);
                        scoreboards.pvpKillCount.ptr?.addScore(damagingEntity, 1);
                    }
                    else if (EntityLib.isFamily(damagingEntity, 'monster')) {
                        scoreboards.pvmPlayerDeathCount.ptr?.addScore(deadEntity, 1);

                        //by family
                        const family = EntityLib.families_get(damagingEntity).filter(f => { ![ 'mob', 'monster' ].includes(f); });
                        family.forEach(f => {
                            scoreboards.pvmMonsterKillCount.ptr?.addScore(f, 1);
                        });
                    }
                }
            }
            else if (EntityLib.isFamily(deadEntity, 'monster')) {

                if (damagingEntity && damagingEntity.isValid() && damagingEntity instanceof Player) {
                    scoreboards.pvmPlayerKillCount.ptr?.addScore(damagingEntity, 1);

                    //by family
                    const family = EntityLib.families_get(deadEntity).filter(f => { ![ 'mob', 'monster' ].includes(f); });
                    family.forEach(f => {
                        scoreboards.pvmMonsterDeathCount.ptr?.addScore(f, 1);
                    });

                }
            }
        }
    });
}
//==============================================================================
export function afterEvents_playerSpawn () {
    world.afterEvents.playerSpawn.subscribe((eventData) => {
        let { player, initialSpawn } = eventData;
        if (initialSpawn) {
            welcomeNewPlayer(player);
        }
        else {
            welcomeBack(player);
        }

        player.setDynamicProperty(dynamicVars.isWorldOP,  PlayerLib.isOp(player));
        DynamicPropertyLib.increment(player, dynamicVars.loginCount);
        player.setDynamicProperty(dynamicVars.lastActiveTick, system.currentTick);
        player.setDynamicProperty(dynamicVars.AFKTicks, 0);
    });
}
//==============================================================================
/**
 * 
 * @param {Player} player 
 */
function welcomeNewPlayer (player) {

    let newID = DynamicPropertyLib.getNumber(world, dynamicVars.player_id);
    if (!newID || typeof newID != 'number') newID = 0;
    newID += 1;

    if (!player.getDynamicProperty(dynamicVars.player_id)) {
        world.setDynamicProperty(dynamicVars.player_id, newID);
        player.setDynamicProperty(dynamicVars.player_id, newID);

        player.setDynamicProperty(dynamicVars.isWorldOwner, (newID == 1));
        player.setDynamicProperty(dynamicVars.lastActiveTick, system.currentTick);

        let msg = `Welcome New Player ${player.nameTag}!`;
        msg += `\nYou are ${numberWithSuffix(newID)} player to Join`;

        system.run(() => { });
    }
}
//==============================================================================
/**
 * 
 * @param {Player} player 
 */
function welcomeBack (player) {

    if (!player.getDynamicProperty(dynamicVars.player_id)) {
        welcomeNewPlayer(player);
        return;
    }

    let msg = `Welcome Back ${+player.nameTag}!`;
    const lastTick = DynamicPropertyLib.getNumber(player, dynamicVars.lastActiveTick) || system.currentTick;
    const awayDays = round((system.currentTick - lastTick) / TicksPerDay, 1);
    if (awayDays > 1) msg += `\nIt has been ${awayDays} Days since we've seen you`;
}
//==============================================================================
export function beforeEvents_playerLeave () {
    world.beforeEvents.playerLeave.subscribe((event) => {

        event.player.setDynamicProperty(dynamicVars.lastActiveTick, system.currentTick);

    });
}
//==============================================================================
function updatePlayerStats () {
    const players = EntityLib.getAllPlayers();
    if (players.length == 0) return;

    players.forEach(player => {

        //check if in AFK suspension mode
        
        player.setDynamicProperty(dynamicVars.lastActiveTick, system.currentTick);

        player.setDynamicProperty(dynamicVars.lastDimension, player.dimension.id);
        player.setDynamicProperty(dynamicVars.lastLocation, player.location);

        const velocity = player.getVelocity();
        if (velocity.x != 0 || velocity.y != 0 || velocity.z != 0)
            player.setDynamicProperty(dynamicVars.AFKTicks, 0);
        else {
            DynamicPropertyLib.addNumber(player, dynamicVars.AFKTicks, pack.statUpdateIntervalTicks);

            //TODO: if afk too long... kick
            //record pre-kick location , so can return player there
        }

    });
}
//==============================================================================
export function afterEvents_scriptEventReceive () {

    alertLog.success("§aInstalling afterEvents.scriptEventReceive §c(Debug Mode)", dev.debugSubscriptions);

    system.afterEvents.scriptEventReceive.subscribe((event) => {
    });
}