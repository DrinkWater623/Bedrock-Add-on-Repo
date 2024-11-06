//@ts-check
import { Entity, system, Block, world } from "@minecraft/server";
import { dev, chatLog, watchFor, dynamicVars, entityEvents } from './settings.js';
import { Vector3Lib } from './commonLib/vectorClass.js';
import { ScoreboardLib } from "./commonLib/scoreboardClass.js";
import { DynamicPropertyLib } from "./commonLib/dynamicPropertyClass.js";
import { EntityLib } from "./commonLib/entityClass.js";
import { worldRun } from "./commonLib/runCommandClass.js";
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
    //TODO: this section is incomplete, but usable.  I want web on top of tall plants, so will need beta block volume to find best target top
    const { dimension, location } = entity;
    const inBlock = dimension.getBlock(location);
    chatLog.log(`§d*placeWeb (${entity.nameTag || entity.id}) @ ${Vector3Lib.toString(location)} ${inBlock ? 'inBlock: ' + inBlock.typeId : ''}`, dev.debugEntityActivity);

    if (!inBlock) {
        chatLog.error('Cannot NOT be in a block, even air', dev.debugEntityActivity);
        system.run(() => {
            entity.triggerEvent(entityEvents.wanderEventName);
        });
        return;
    }

    if (inBlock.typeId == watchFor.home_typeId) {
        system.run(() => {
            chatLog.success(`${entity.nameTag || entity.id} Already in Web @ ${Vector3Lib.toString(location, 0, true)} - placeWeb()`, dev.debugEntityAlert);
            entity.teleport(inBlock.center());
            entity.triggerEvent(entityEvents.stayInWebEventName);
        });
        return true;
    }

    //I do not want diagonal webs, so reset to wander if a valid target block is not adjacent
    if (!targetBlockAdjacent(inBlock)) {
        webRegister(entity);
        system.run(() => entity.triggerEvent(entityEvents.wanderEventName));
        return false;
    }

    //const rotation = Math.trunc(((Math.trunc(entity.getRotation().y) + 360) % 360) / 90);
    let webLocationOffset = location;
    let resolved = false; //(inBlock && inBlock.typeId == 'minecraft:air');

    //Redundant for now, until do the code to look
    if (!resolved && inBlock) {
        if (inBlock.typeId.endsWith('_leaves')) {
            //random chance on replace block
            resolved = true;
        }
        else if (
            inBlock.typeId.endsWith('large_fern') ||
            inBlock.typeId.endsWith('tall_grass') ||
            inBlock.typeId.endsWith('lilac') ||
            inBlock.typeId.endsWith('rose_bush') ||
            inBlock.typeId.endsWith('peony') ||
            inBlock.typeId.endsWith('rose_bush') ||
            inBlock.typeId.endsWith('sunflower')
        ) {
            //TODO: get address and move 1 above upper Y
            resolved = true;
        }
        //one block tall
        else if (
            inBlock.typeId.endsWith('sweet_berry_bush') ||
            inBlock.typeId.endsWith('pointed_dripstone')
        ) {
            //TODO: dripstone, find point or stone  berry-bush, find top
            resolved = true;
        }
        //Does not matter
        else if ([
            'minecraft:air'
            , 'minecraft:short_grass'
            , 'minecraft:fern'
            , 'minecraft:vines'
            , 'minecraft:vine'
        ].includes(inBlock.typeId)) {
            //TODO: if next to the above, use that... so need block volume to search - may need to move leaves out of nature and use mark_variant to see what looking for
            resolved = true;
        }
    }

    //Place Web
    if (resolved) {
        chatLog.success(`${entity.nameTag || entity.id} Placed Web @ ${Vector3Lib.toString(webLocationOffset, 0, true)}`, dev.debugEntityActivity);
        setWebAndEnter(entity, webLocationOffset, 'placedWeb');
        return true;
    }

    system.run(() => {
        entity.triggerEvent(entityEvents.wanderEventName);
    });
}
//===================================================================
/**
 * 
 * @param {Block} block 
 */
function targetBlockAdjacent (block) {

    //check that target block is adjacent and not diag
    let otherBlock = block.above()?.typeId;
    if (otherBlock) {
        if (watchFor.target_leaves.includes(otherBlock)) return true;
        if (watchFor.target_nature.includes(otherBlock)) return true;
    }

    otherBlock = block.below()?.typeId;
    if (otherBlock) {
        if (watchFor.target_leaves.includes(otherBlock)) return true;
        if (watchFor.target_nature.includes(otherBlock)) return true;
    }

    otherBlock = block.east()?.typeId;
    if (otherBlock) {
        if (watchFor.target_leaves.includes(otherBlock)) return true;
        if (watchFor.target_nature.includes(otherBlock)) return true;
    }

    otherBlock = block.west()?.typeId;
    if (otherBlock) {
        if (watchFor.target_leaves.includes(otherBlock)) return true;
        if (watchFor.target_nature.includes(otherBlock)) return true;
    }

    otherBlock = block.north()?.typeId;
    if (otherBlock) {
        if (watchFor.target_leaves.includes(otherBlock)) return true;
        if (watchFor.target_nature.includes(otherBlock)) return true;
    }

    otherBlock = block.south()?.typeId;
    if (otherBlock) {
        if (watchFor.target_leaves.includes(otherBlock)) return true;
        if (watchFor.target_nature.includes(otherBlock)) return true;
    }

    return false;
}
//===================================================================
/**
 * 
 * @param {Block} block 
 */
export function webAdjacent (block) {
    const webBlock = watchFor.home_typeId;
    //check that target block is adjacent and not diag
    let otherBlock = block.above()?.typeId;
    if (otherBlock && otherBlock == webBlock) return true;

    otherBlock = block.below()?.typeId;
    if (otherBlock && otherBlock == webBlock) return true;

    otherBlock = block.east()?.typeId;
    if (otherBlock && otherBlock == webBlock) return true;

    otherBlock = block.west()?.typeId;
    if (otherBlock && otherBlock == webBlock) return true;

    otherBlock = block.north()?.typeId;
    if (otherBlock && otherBlock == webBlock) return true;

    otherBlock = block.south()?.typeId;
    if (otherBlock && otherBlock == webBlock) return true;

    return false;
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
        entity.dimension.setBlockType(location, watchFor.home_typeId);

        if (dev.debugEntityActivity)
            dev.debugScoreboard?.addScore(sbEntry, 1);
        else
            dev.debugScoreboard?.addScore('§dNew Web', 1);

        DynamicPropertyLib.add(entity, dynamicVars.websCreated, 1);
        webRegister(entity);

        teleportAndCenter(entity, location);
        entity.triggerEvent(entityEvents.stayInWebEventName);
        //system.runTimeout(() => { }, 1);
    });
}
//===================================================================
/**
 * 
 * @param {Entity} entity 
 */
export function newEgg (entity) {
    const dimension = entity.dimension;
    const inBlock = dimension.getBlock(entity.location);

    if (!inBlock) { chatLog.error('Cannot NOT be in a block, even air', dev.debugEntityActivity); return; }

    system.runTimeout(() => {
        if (dev.debugGamePlay || dev.debugEntityActivity || dev.debugEntityAlert)
            dev.debugScoreboard?.addScore('§eEggs Laid', 1);

        if (entity.isValid()) entity.teleport(inBlock.center());
    }, 1);
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
export function lastTickRegister (entity) {
    entity.setDynamicProperty(dynamicVars.lastActiveTick, system.currentTick);
    entity.setDynamicProperty(dynamicVars.lastLocation, entity.location);
}
//===================================================================
/**
 * 
 * @param {Entity} entity 
 */
export function webRegister (entity) {
    entity.setDynamicProperty(dynamicVars.lastWebActivityTick, system.currentTick);
    entity.setDynamicProperty(dynamicVars.lastActiveTick, system.currentTick);
    entity.setDynamicProperty(dynamicVars.lastLocation, entity.location);
}
//===================================================================
/**
 * Find all stalled tree spiders
 * Current tick .... 5 min off from Last Updated Tick
 */
export function stalledEntityCheckAndFix () {
    //this sb keeps the last activity tick.. so if diff is over 5 min, it is stalled or out of range    

    const entities = EntityLib.getAllEntities({ type: watchFor.typeId });
    if (entities.length === 0) return;

    let killDelay = dev.debugEntityAlert ? (20 * 60 * 1) : 0;
    //take out babies
    entities.filter(e => { return !e.hasComponent('minecraft:is_baby'); }).forEach(e => {

        //is NameTagged?
        const nameTag = e.nameTag;
        let markVar = e.getComponent('minecraft:mark_variant')?.value;
        if (typeof markVar == 'undefined') markVar = -1;
        const { location } = e;
        const lastLocation = DynamicPropertyLib.getVector(e, dynamicVars.lastLocation);
        const inBlock = EntityLib.currentBlock(e);

        let lastActiveTick = DynamicPropertyLib.getNumber(e, dynamicVars.lastActiveTick);
        if (lastLocation) {
            if (lastLocation.x == location.x && lastLocation.y == location.y && lastLocation.z == location.z)
                lastActiveTick = DynamicPropertyLib.getNumber(e, dynamicVars.lastActiveTick);
            else {
                //if it moved, it is active - remember in web, collision is OFF, so cannot be moved by accident
                DynamicPropertyLib.setVector(e, dynamicVars.lastLocation, location);
                e.setDynamicProperty(dynamicVars.lastActiveTick, system.currentTick);
                lastActiveTick = 0;
            }
        }
        else DynamicPropertyLib.setVector(e, dynamicVars.lastLocation, location);

        if (lastActiveTick) {
            const deltaTicks = system.currentTick - lastActiveTick;
            const deltaMinutes = Math.trunc(((deltaTicks) / 20) / 60);

            DynamicPropertyLib.add(e, dynamicVars.aliveTicks, deltaTicks);

            if (deltaMinutes > watchFor.assumedStalledIfOver) {
                const inBlock = EntityLib.currentBlock(e);
                let msg;

                if (inBlock && inBlock.typeId == watchFor.home_typeId) {

                    msg = `§4${nameTag || e.id} Stalled (${deltaMinutes}m - mv=${markVar}) @ ${Vector3Lib.toString(location, 0, true)} - Sending Wander Event `;
                    chatLog.warn(msg, dev.debugGamePlay || dev.debugEntityAlert || dev.debugEntityActivity);
                    system.run(() => {
                        e.setDynamicProperty(dynamicVars.lastWebActivityTick, system.currentTick);
                        e.triggerEvent(entityEvents.wanderEventName);
                    });
                    return;
                }

                msg = `§4${nameTag ? nameTag : watchFor.display} Stalled (${deltaMinutes}m)  (${e.id}) @ ${Vector3Lib.toString(location, 0, true)} - Replacing `;
                chatLog.warn(msg, dev.debugGamePlay || dev.debugEntityAlert || dev.debugEntityActivity);

                if (nameTag) {
                    //summon one with same name
                    killDelay = 1;
                    dev.debugScoreboard?.addScore('§4Stalled Named Spiders', 1);
                    const cmd = `summon ${watchFor.typeId} ${Vector3Lib.toString(location, 1, false, ' ')} 0 0 minecraft:entity_spawned "${nameTag}"`;
                    system.runTimeout(() => {
                        worldRun(cmd, e.dimension.id, 1);
                        if (entityEvents.replaceEventName && e.isValid()) e.triggerEvent(entityEvents.replaceEventName);
                        //else e.kill();
                    }, killDelay);
                }
                else {
                    //FIXME:spiders keep dying at
                    world.sendMessage('killing stalled spider')
                    dev.debugScoreboard?.addScore('§4Stalled Spiders', 1);
                    system.runTimeout(() => {
                        if (entityEvents.replaceEventName && e.isValid()) e.triggerEvent(entityEvents.replaceEventName);
                        //else e.kill();
                    }, killDelay);
                }

                return;
            }
        }

        const lastWebTick = DynamicPropertyLib.getNumber(e, dynamicVars.lastWebActivityTick);
        if (lastWebTick && !nameTag) { // something wrong or nothing for spider to use is around, may as well not be there
            const deltaMinutes = Math.trunc(((system.currentTick - lastWebTick) / 20) / 60);
            if (deltaMinutes > (watchFor.assumeNoWebsPossibleIfOver)) {
                //dev.debugScoreboard?.addScore('§cNo-Webs spiders', 1);

                const msg = `No Web Activity (${deltaMinutes}m) (${e.id}) @ ${Vector3Lib.toString(location, 0, true)} - Despawning in 1 minute`;
                if (!!killDelay) chatLog.warn(msg, true);
 //FIXME:spiders keep dying at
 world.sendMessage('killing non web-making spider')
                system.runTimeout(() => {
                    if (entityEvents.despawnEventName && e.isValid()) e.triggerEvent(entityEvents.despawnEventName);
                    //else e.kill();
                }, killDelay);

                return;
            }
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

    if (override || dev.debugGamePlay || dev.debugEntityActivity || dev.debugEntityAlert) {

        const eggCount = EntityLib.getAllEntities({ type: watchFor.egg_typeId }).length;
        if (eggCount) system.run(() => {
            const msg = "§gEggs in Webs";
            dev.debugScoreboard?.setScore(msg, eggCount);
        });

        const entities_all = EntityLib.getAllEntities({ type: watchFor.typeId });
        //const entities_all = world.getDimension("overworld").getEntities({ type: watchFor.typeId });
        if (entities_all.length === 0) return;

        system.runTimeout(() => {

            const entities = entities_all.filter(e => { return !e.hasComponent('minecraft:is_baby'); });
            dev.debugScoreboard?.setScore("§6Adult spiders", entities.length);

            const babyMsg = "§bBaby spiders";
            if (entities.length === 0) {
                dev.debugScoreboard?.setScore(babyMsg, entities_all.length);
            }
            else if (entities_all.length - entities.length) {
                dev.debugScoreboard?.setScore(babyMsg, entities_all.length - entities.length);
            }

        }, 1);
    }
}
//===================================================================
