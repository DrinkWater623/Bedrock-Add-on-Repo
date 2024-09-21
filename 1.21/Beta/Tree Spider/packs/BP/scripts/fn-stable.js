//@ts-check
import { world, Entity, system } from "@minecraft/server";
import { dev, chatLog, watchFor, pack } from './settings.js';
import { Vector3Lib } from './commonLib/vectorClass.js';
import { ScoreboardLib } from "./commonLib/scoreboardClass.js";
import { DynamicPropertyLib } from "./commonLib/dynamicPropertyClass.js";
import { EntityLib } from "./commonLib/entityClass.js";
//==============================================================================
/**
 * 
 * @param {Entity} entity 
 */
// export function newSpawn (entity) {
//     const { location } = entity;
//     chatLog.success(`New ${watchFor.display} (${entity.id}) Spawn @ ${Vector3Lib.toString(location)}`, dev.debugEntityAlert);
//     dev.debugScoreboard?.addScore('spawned spiders', 1)    
// }
//==============================================================================
/**
 * 
 * @param {Entity} entity 
 */
export function placeWeb (entity) {
    //this cannot be called unless spider is next to a target block, so place in air if cannot determine
    const dimension = entity.dimension;
    const inBlock = dimension.getBlock(entity.location);
    chatLog.log(`§a*placeWeb() @ ${Vector3Lib.toString(entity.location)} ${inBlock ? 'inBlock: ' + inBlock.typeId : ''}`, dev.debugEntityActivity);

    if (!inBlock) {
        chatLog.error('Cannot NOT be in a block, even air', dev.debugEntityActivity);
        return;
    }

    if (inBlock.typeId == 'minecraft:web') {
        entity.teleport(inBlock.center());
        return;
    }

    const location = entity.location;
    //const rotation = Math.trunc(((Math.trunc(entity.getRotation().y) + 360) % 360) / 90);
    let webLocationOffset = location;
    let resolved = (inBlock && inBlock.typeId == 'minecraft:air');

    //Look Below first.. if grass/fern, default selection
    if (!resolved && inBlock) {
        if (inBlock.typeId.endsWith('fern') ||
            inBlock.typeId.endsWith('short_grass') ||
            inBlock.typeId.endsWith('tall_grass') ||
            inBlock.typeId.endsWith('_bush')
        ) {
            resolved = true;
        }
        else if (inBlock.typeId.endsWith('_leaves')) {
            //random chance on replace block
            resolved = true;
        }
    }

    //Place Web
    if (resolved) {
        chatLog.success(`${entity.id} Placed Web @ ${Vector3Lib.toString(webLocationOffset, 0, true)}`, dev.debugEntityAlert);
        setWebAndEnter(entity, webLocationOffset, 'placedWeb');
    }
}
//===================================================================
/**
 * 
 * @param {Entity} entity 
 * @param {import("@minecraft/server").Vector3} location 
 * @param {string} sbEntry
 */
export function setWebAndEnter (entity, location, sbEntry) {
    system.run(() => {
        entity.dimension.setBlockType(location, 'minecraft:web');

        if (dev.debugEntityActivity) dev.debugScoreboard?.addScore(sbEntry, 1);
        else dev.debugScoreboard?.addScore('§dNew Web', 1),

        DynamicPropertyLib.add(entity, pack.websCreated, 1);
        entity.setDynamicProperty(pack.lastWebActivityTick, system.currentTick);
        entity.setDynamicProperty(pack.lastActiveTick, system.currentTick);

        system.runTimeout(() => { teleportAndCenter(entity, location); }, 1);
    });

}
//===================================================================
/**
 * 
 * @param {Entity} entity 
 * @param {import("@minecraft/server").Vector3} location 
 */
export function teleportAndCenter (entity, location) {
    entity.teleport((location));
    system.runTimeout(() => { centerAlign(entity); }, 1);
}
//===================================================================
/**
 * 
 * @param {Entity} entity  
 */
export function centerAlign (entity) {
    const center = entity.dimension.getBlock(entity.location)?.center();
    if (center) entity.teleport(center);
}
//===================================================================
/**
 * 
 * @param {Entity} entity 
 */
export function entityLastActiveTickUpdate (entity) {
    entity.setDynamicProperty(pack.lastActiveTick, system.currentTick);
    // system.run(() => {
    //     if (watchFor.scoreboard && watchFor.scoreboard.isValid()) {
    //         watchFor.scoreboard.setScore(entity, system.currentTick);
    //     }
    // });
}
//===================================================================
/**
 * Find all stalled tree spiders
 * Current tick .... 5 min off from Last Updated Tick
 */
export function stalledEntityFix () {
    //this sb keeps the last activity tick.. so if diff is over 5 min, it is stalled or out of range
    const sb = watchFor.scoreboard;
    if (!sb) return;

    //counts();

    const entities = EntityLib.getAllEntities({ type: watchFor.typeId });
    if (entities.length === 0) return;

    dev.debugScoreboard?.addScore('§4Stalled spiders', 0);

    //take out babies
    entities.filter(e => { return !e.hasComponent('minecraft:is_baby'); }).forEach(e => {
        if (sb.hasParticipant(e)) {

            const lastTick = DynamicPropertyLib.getNumber(e, pack.lastActiveTick); //sb.getScore(e);
            if (lastTick) {
                const deltaMinutes = Math.trunc(((system.currentTick - lastTick) / 20) / 60);
                if (deltaMinutes > 5) {
                    dev.debugScoreboard?.addScore('§4Stalled spiders', 1);
                    sb.setScore(e, -1);
                    const { location } = e;

                    const killDelay = dev.debugEntityAlert ? (20 * 60 * 1) : 0;
                    const msg = `§4Stalled (over 5m) ${watchFor.display} (${e.id}) @ ${Vector3Lib.toString(location, 0, true)} - Replacing in 1 minute`;
                    chatLog.warn(msg, !!killDelay);

                    system.runTimeout(() => {
                        if (watchFor.replaceEventName && e.isValid()) e.triggerEvent(watchFor.replaceEventName);
                        else e.kill();
                    }, killDelay);
                }
            }

            const lastWebTick = DynamicPropertyLib.getNumber(e, pack.lastWebActivityTick);
            if (lastWebTick) {
                const deltaMinutes = Math.trunc(((system.currentTick - lastTick) / 20) / 60);
                if (lastWebTick > 10) {
                    dev.debugScoreboard?.addScore('§cNon-web spiders', 1);
                    sb.setScore(e, -1);
                    const { location } = e;

                    const killDelay = dev.debugEntityAlert ? (20 * 60 * 1) : 0;
                    const msg = `No Web Activity (over 10m) (${e.id}) @ ${Vector3Lib.toString(location, 0, true)} - Despawning in 1 minute`;
                    chatLog.warn(msg, !!killDelay);

                    system.runTimeout(() => {
                        if (watchFor.replaceEventName && e.isValid()) e.triggerEvent(watchFor.despawnEventName);
                        else e.kill();
                    }, killDelay);
                }
            }
        }
        else {
            entityLastActiveTickUpdate(e);
        }
    });
}
//===================================================================
export function timersToggle () {

    if (dev.debugTimeCountersOn) {
        dev.debugTimeCountersOn = false;
        if (dev.debugTimeCountersRunId) system.clearRun(dev.debugTimeCountersRunId);
        dev.debugTimeCountersRunId = 0;
    }
    else {
        dev.debugTimeCountersOn = true;
        dev.debugTimeCountersRunId = ScoreboardLib.systemTimeCountersStart(dev.debugScoreboardName, dev.debugTimers);
    }
}
//===================================================================
/**
 * 
 * @param {boolean} [override =false]
 */
export function counts (override = false) {

    if (override || dev.debugEntityActivity || dev.debugEntityAlert || dev.debugGamePlay) {
        //const entities_all = EntityLib.getAllEntities({ type: watchFor.typeId });

        const entities_all = world.getDimension("overworld").getEntities({ type: watchFor.typeId });

        system.runTimeout(() => {
            if (entities_all.length === 0) {
                chatLog.warn('No Spiders',dev.debugEntityAlert)
                dev.debugScoreboard?.setScore("§6Adult spiders", 0);
                dev.debugScoreboard?.setScore("§bBaby spiders", 0);
                return;
            }

            const entities = entities_all.filter(e => { return !e.hasComponent('minecraft:is_baby'); });
            dev.debugScoreboard?.setScore("§6Adult spiders", entities.length);

            if (entities.length === 0) {
                chatLog.warn('No Adult Spiders',dev.debugEntityAlert)
                dev.debugScoreboard?.setScore("§bBaby spiders", entities_all.length);
                dev.debugBabyScoreboard?.setScore("§bBaby spiders", entities_all.length);
                return;
            }

            if (entities_all.length - entities.length) {
                dev.debugScoreboard?.setScore("§bBaby spiders", entities_all.length - entities.length);
                dev.debugBabyScoreboard?.setScore("§bBaby spiders", entities_all.length - entities.length);
            } else chatLog.log('No Baby Spiders',dev.debugBabyAlert)

            const webCount = DynamicPropertyLib.sum(entities, pack.websCreated);
            dev.debugScoreboard?.setScore('§5Total Loaded Webs', webCount);
        }, 1);
    }
}
//===================================================================
