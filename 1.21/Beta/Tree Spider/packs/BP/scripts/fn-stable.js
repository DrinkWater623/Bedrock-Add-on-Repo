//@ts-check
import { world, Entity, system } from "@minecraft/server";
import { dev, chatLog, watchFor } from './settings.js';
import { Vector3Lib } from './commonLib/vectorClass.js';
import { ScoreboardLib } from "./commonLib/scoreboardClass.js";
//==============================================================================
/**
 * 
 * @param {Entity} entity 
 */
export function newSpawn (entity) {
    const { location } = entity;
    chatLog.success(`New ${watchFor.display} (${entity.id}) Spawn @ ${Vector3Lib.toString(location)}`, dev.debugEntityAlert);
    dev.debugScoreboard?.addScore('spawned spiders', 1)    
}
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
        ScoreboardLib.add(dev.debugScoreboardName, 'placedWeb', 1);
        setWebAndEnter(entity, webLocationOffset);
    }
}
//===================================================================
/**
 * 
 * @param {Entity} entity 
 * @param {import("@minecraft/server").Vector3} location 
 */
export function setWebAndEnter (entity, location) {
    system.run(() => {
        entity.dimension.setBlockType(location, 'minecraft:web');
        addOneToDynamicWebCount(entity);
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
// export function entityCleanUp (entity) { //TODO: the code if needed
//     system.run(() => {
//         if (watchFor.scoreboard && watchFor.scoreboard.isValid())
//             watchFor.scoreboard.setScore(entity, system.currentTick);
//     });
// }
//===================================================================
/**
 * 
 * @param {Entity} entity 
 */
export function entityActivityUpdate (entity) {
    system.run(() => {
        if (watchFor.scoreboard && watchFor.scoreboard.isValid())
            watchFor.scoreboard.setScore(entity, system.currentTick);
    });
}
//===================================================================
/**
 * Find all stalled tree spiders
 * Current tick .... 5 min off from Last Updated Tick
 */
export function stalledEntityFix () {
    //this scoreboard keeps the last activity tick.. so if diff is over 5 min, it is stalled or out of range
    const sb = watchFor.scoreboard;
    if (!sb) return; 

    counts();

    const entities = world.getDimension("overworld").getEntities({ type: watchFor.typeId });
    dev.debugScoreboard?.setScore("spiders", entities.length);
    if (entities.length === 0) return;

    dev.debugScoreboard?.addScore('stalled spiders', 0);

    //take out babies
    entities.filter(e => { return !e.hasComponent('minecraft:is_baby'); }).forEach(e => {
        if (sb.hasParticipant(e)) {
            const lastTick = sb.getScore(e);

            if (lastTick) {
                const deltaMinutes = Math.trunc(((system.currentTick - lastTick) / 20) / 60);
                if (deltaMinutes > 4) {
                    dev.debugScoreboard?.addScore('stalled spiders', 1);
                    sb.setScore(e, -1);
                    const { location } = e;

                    const killDelay = dev.debugEntityAlert ? (20 * 60 * 1) : 0;
                    const msg = `Stalled ${watchFor.display} (${e.id}) @ ${Vector3Lib.toString(location, 0, true)} - Replacing in 1 minute`;
                    chatLog.warn(msg, !!killDelay);

                    system.runTimeout(() => {
                        if (watchFor.replaceEventName && e.isValid()) e.triggerEvent(watchFor.replaceEventName);
                        else e.kill();
                    }, killDelay);
                }
            }
        }
        else {
            entityActivityUpdate(e);
        }
    });

    //dev.debugScoreboard?.setScore("spiders", entities.length)
}
//===================================================================
export function timersToggle () {

    if (dev.debugTimeCountersOn) {
        dev.debugTimeCountersOn = false;
        if (dev.debugTimeCountersRunId) system.clearRun(dev.debugTimeCountersRunId);
    }
    else {
        dev.debugTimeCountersOn = true;
        ScoreboardLib.systemTimeCountersStart(dev.debugScoreboardName);
    }
}
//===================================================================
export function counts (override = false) {

    if (override || dev.debugEntityActivity || dev.debugEntityAlert || dev.debugGamePlay) {
        const entities_all = world.getDimension("overworld").getEntities({ type: watchFor.typeId });

        system.runTimeout(() => {            
            if (entities_all.length === 0) {
                dev.debugScoreboard?.setScore("adult spiders", 0);
                dev.debugScoreboard?.setScore("baby spiders", 0);
                return;
            }

            const entities = entities_all.filter(e => { return !e.hasComponent('minecraft:is_baby'); });
            dev.debugScoreboard?.setScore("adult spiders", entities.length);

            if (entities.length === 0) {
                dev.debugScoreboard?.setScore("baby spiders", entities_all.length);
                return;
            }

            dev.debugScoreboard?.setScore("baby spiders", entities_all.length - entities.length);

            let webCount = 0;
            entities.forEach(e => {
                const myWebs = e.getDynamicProperty('webs');
                if (myWebs && typeof myWebs == 'number') webCount += myWebs;
            });

            dev.debugScoreboard?.setScore('webs', webCount);
        }, 1);
    }
}
//===================================================================
/**
 * 
 * @param {Entity} entity 
 */
function addOneToDynamicWebCount (entity) {
    const propId = 'webs';
    const myCount = entity.getDynamicProperty(propId);
    if (!myCount || !(typeof myCount === 'number')) entity.setDynamicProperty(propId, 1);
    else entity.setDynamicProperty(propId, myCount + 1);
}