//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20251023 - Update and sep out debug-only stuff and add the stable stuff
========================================================================*/
import { Entity, system, Block } from "@minecraft/server";
import { alertLog, watchFor, dynamicVars, entityEvents } from './settings.js';
import { Vector3Lib } from './common-stable/vectorClass.js';
import { DynamicPropertyLib } from "./common-stable/dynamicPropertyClass.js";
import { EntityLib } from "./common-stable/entityClass.js";
import { worldRun } from "./common-stable/runCommandClass.js";
import { airBlock } from "./common-data/block-data.js";
import * as debug from "./fn-debug.js";
import { makeRandomName } from "./common-other/randomNames.js";
//==============================================================================
const debugFunctions = false;
//==============================================================================
/** cache once (watchFor is stable) */
const AIR_BLOCK = airBlock;
const HOME_ID = watchFor.home_typeId;
/** @type {ReadonlySet<string>} */ const LEAVES = new Set(watchFor.target_leaves);
/** @type {ReadonlySet<string>} */ const LOGS = new Set(watchFor.target_logs);
/** @type {(id: string) => boolean} */
const isValidNeighborId = (id) => id === HOME_ID || LEAVES.has(id) || LOGS.has(id);
//===================================================================
/**
 * @param {Entity} entity 
 * @returns {boolean}
 */
function isInWeb (entity) {
    const { dimension, location } = entity;
    const inBlock = dimension.getBlock(location);
    if (!inBlock) return false;
    if (inBlock.typeId === HOME_ID) return true;
    return false;
}
//==============================================================================
/**
 * @param {Entity} entity 
 */
export function welcomeBack (entity) {

    //entity.nameTag || entity
    webActivityRegister(entity);
    DynamicPropertyLib.add(entity, dynamicVars.websCreated, 0);  //initializes if undefined
    DynamicPropertyLib.add(entity, dynamicVars.eggsLaid, 0);
}
//===================================================================
/** 
 *  Returns adjacent air block that has non-air block above it
 * @param {Block} block 
 * @returns {Block | undefined}
 * @summary Returns block of adjacent air
 */
function closestExpandableWebLocation (block) {

    //order changed for preference
    const neighbors = [
        block.east(),
        block.west(),
        block.north(),
        block.south(),
        block.above(),
        block.below()
    ];

    for (const nb of neighbors) {
        const id = nb?.typeId;
        if (id && id === airBlock) {
            const above = nb.above();
            if (above && above.typeId !== airBlock) return nb;
        }
    }

    //Found None
    return;
}
//===================================================================
/**
 * Returns adjacent web (any side at 1 block) or a web straight above within `numberOfBlocksMax`,
 * scanning upward only through air. Stops if a non-air, non-web block is hit.
 
 * @param {Block} block 
 * @param {number} numberOfBlocksMax 
 * @returns {Block | undefined}
 * @summary Returns block of adjacent web or web (number of blocks) above
 */
function closestWeb (block, numberOfBlocksMax = 8) {

    const neighbors = [
        block.above(),
        block.below(),
        block.east(),
        block.west(),
        block.north(),
        block.south(),
    ];

    for (const nb of neighbors) {
        const id = nb?.typeId;
        if (id && id === HOME_ID) return nb;
    }

    //now above only
    if (numberOfBlocksMax <= 1) return;

    //ChatGPT - Look above starting at 2nd block, until max is reached, as long as block is air
    let up = block.above(); // 1 above (already checked in neighbors)
    if (!up) return;

    for (let i = 2; i <= numberOfBlocksMax; i++) {
        up = up.above();
        if (!up) break;

        const id = up.typeId;
        if (id === HOME_ID) return up;                 // found web
        if (id !== AIR_BLOCK) break;             // blocked by something else
    }

    //Found None
    return;
}
//===================================================================
/**
 * @param {Entity} entity 
 * @param {boolean} isBaby 
 * @returns {boolean} 
 */
export function enterWeb (entity, isBaby = false) {
    const { dimension, location } = entity;
    const inBlock = dimension.getBlock(location);

    if (!inBlock) return false;

    webActivityRegister(entity);
    let webBlock = inBlock.typeId == HOME_ID ? inBlock : closestWeb(inBlock, 8);

    if (!webBlock) {
        system.runTimeout(() => {
            isBaby ? entity.triggerEvent(entityEvents.baby_wanderEventName) : entity.triggerEvent(entityEvents.wanderEventName);
        }, 1);
        return false;
    }

    const alertMsg = inBlock.typeId == HOME_ID ? `§b${entity.nameTag || entity.id} Already in Web @ ${Vector3Lib.toString(location, 0, true)} - enterWeb()` : `§b${entity.nameTag || entity.id} Entering Web @ ${Vector3Lib.toString(webBlock.location, 0, true)}`;
    alertLog.log(alertMsg, debug.dev.debugEntityAlert);

    teleportAndCenter(entity, webBlock); //1 tick out
    system.runTimeout(() => {
        system.runTimeout(() => {
            isBaby ? entity.triggerEvent(entityEvents.baby_stayInWebEventName) : entity.triggerEvent(entityEvents.stayInWebEventName);
            //Log
            system.runTimeout(() => {
                if (isInWeb(entity)) {
                    if (debug.dev.debugEntityActivity) debug.debugScoreboards.sbStatsScoreboard?.addScore(debug.debugScoreboards.enterWeb, 1);
                    DynamicPropertyLib.add(entity, dynamicVars.websEntered, 1);
                }
                else {
                    alertLog.warn(`${entity.nameTag || entity.id} May Have Entered Web @ ${Vector3Lib.toString(webBlock.location, 0, true)}`, debug.dev.debugEntityAlert);
                }
            }, 1);
        }, 1);
    }, 2);

    return true;
}
//===================================================================
/**
 * @param {Entity} entity 
 * @returns {boolean}
 */
export function expandWeb (entity) {
    const { dimension, location } = entity;
    const inBlock = dimension.getBlock(location);
    if (!inBlock) return false;

    if (inBlock.typeId !== HOME_ID) {
        webActivityRegister(entity);
        system.runTimeout(() => {
            entity.triggerEvent(entityEvents.wanderEventName);
        }, 1);
        return false;
    }

    const newWeb = closestExpandableWebLocation(inBlock);
    if (!newWeb) {
        webActivityRegister(entity);
        system.runTimeout(() => {
            entity.triggerEvent(entityEvents.wanderEventName);
        }, 1);
        return false;
    }

    setWebAndEnter(entity, newWeb); // 3 ticks

    //Log
    system.runTimeout(() => {
        if (isInWeb(entity)) {
            entity.nameTag;
            alertLog.success(`${entity.nameTag || entity.id} Expanded Web @ ${Vector3Lib.toString(newWeb.location, 0, true)}`, debug.dev.debugEntityAlert);
            if (debug.dev.debugEntityActivity) debug.debugScoreboards.sbStatsScoreboard?.addScore(debug.debugScoreboards.expandWeb, 1);
            DynamicPropertyLib.add(entity, dynamicVars.websExpanded, 1);
        }
        else {
            alertLog.warn(`${entity.nameTag || entity.id} May Have Expanded Web @ ${Vector3Lib.toString(newWeb.location, 0, true)}`, debug.dev.debugEntityAlert);
        }
    }, 4);

    return true;
}
//==============================================================================
/**
 * @param {Entity} entity 
 * @returns {boolean}
 */
export function placeWeb (entity) {
    //this cannot be called unless spider is next to a target block, so place in air if cannot determine
    const { dimension, location } = entity;
    const inBlock = dimension.getBlock(location);

    if (!inBlock) { return false; }

    if (inBlock.typeId == HOME_ID) {
        webActivityRegister(entity);
        system.run(() => {
            entity.teleport(inBlock.center());
            entity.triggerEvent(entityEvents.stayInWebEventName);
        });
        return true;
    }

    //has to be in air now... AND    
    //I do not want diagonal webs, so reset to wander if a valid target block is not adjacent
    if (inBlock.typeId !== airBlock || !targetBlockAdjacent(inBlock)) {
        webActivityRegister(entity);
        system.run(() => entity.triggerEvent(entityEvents.wanderEventName));
        return false;
    }

    //Place Web
    setWebAndEnter(entity, inBlock.location); // 3 ticks

    //Log
    system.runTimeout(() => {
        if (isInWeb(entity)) {
            alertLog.success(`${entity.nameTag || entity.id} Placed New Web @ ${Vector3Lib.toString(inBlock.location, 0, true)}`, debug.dev.debugEntityAlert);
            if (debug.dev.debugEntityActivity) debug.debugScoreboards.sbStatsScoreboard?.addScore(debug.debugScoreboards.newWeb, 1);
            DynamicPropertyLib.add(entity, dynamicVars.websCreated, 1);
        }
        else {
            alertLog.warn(`${entity.nameTag || entity.id} May have Placed New Web @ ${Vector3Lib.toString(inBlock.location, 0, true)}`, debug.dev.debugEntityAlert);
        }
    }, 4);

    return true;
}
//===================================================================
/** 
 * @param {Block} block 
 * @returns {boolean} 
 */
function targetBlockAdjacent (block) {

    const neighbors = [
        block.above(),
        block.below(),
        block.east(),
        block.west(),
        block.north(),
        block.south(),
    ];

    for (const nb of neighbors) {
        const id = nb?.typeId;
        if (id && isValidNeighborId(id)) return true;
    }
    return false;
}
//===================================================================
/**
 * @param {Block} block
 * @returns {boolean}  
 */
export function webAdjacent (block) {

    const neighbors = [
        block.above(),
        block.below(),
        block.east(),
        block.west(),
        block.north(),
        block.south(),
    ];

    for (const nb of neighbors) {
        const id = nb?.typeId;
        if (id && id === HOME_ID) return true;
    }
    return false;
}
//===================================================================
/**
 * 
 * @param {Entity} entity 
 * @param {import("@minecraft/server").Vector3} location 
 */
export function setWebAndEnter (entity, location) {
    //...and stay

    system.runTimeout(() => {

        entity.dimension.setBlockType(location, HOME_ID);
        DynamicPropertyLib.add(entity, dynamicVars.websCreated, 1);
        webActivityRegister(entity);

        system.runTimeout(() => {
            teleportAndCenter(entity, location);

            system.runTimeout(() => {
                entity.triggerEvent(entityEvents.stayInWebEventName);
            }, 1);
        }, 1);
    }, 1);
}
//===================================================================
/**
 * 
 * @param {Entity} entity 
 */
export function newEgg (entity) {
    const dimension = entity.dimension;
    const inBlock = dimension.getBlock(entity.location);

    if (!inBlock) { return; }

    system.runTimeout(() => {
        if (debug.dev.debugEntityActivity)
            debug.debugScoreboards.sbStatsScoreboard?.addScore(debug.debugScoreboards.layEgg, 1);

        if (entity.isValid) entity.teleport(inBlock.center());
    }, 1);
}
//===================================================================
/**
 * 
 * @param {Entity} entity 
 * @param {import("@minecraft/server").Vector3} location 
 */
export function teleportAndCenter (entity, location) {
    system.runTimeout(() => {
        centerAlign(entity);
        entity.teleport((location));
        system.runTimeout(() => { centerAlign(entity); }, 1);
    }, 1);
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
 * @summary Used to determine if Spider Entity is stalled, so it can be replaced later
 * @param {Entity} entity 
 */
export function webActivityRegister (entity) {
    entity.setDynamicProperty(dynamicVars.lastWebActivityTick, system.currentTick);
    entity.setDynamicProperty(dynamicVars.lastActiveTick, system.currentTick);
    entity.setDynamicProperty(dynamicVars.lastLocation, entity.location);
}
//===================================================================
/**
 * @summary Used to determine if Spider Entity is stalled, so it can be replaced later
 * @param {Entity} entity 
 */
export function activityRegister (entity) {
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
    //const debug = true;
    const entities = EntityLib.getAllEntities({ type: watchFor.typeId });
    if (entities.length === 0) return;

    let killDelay = debug.dev.debugEntityAlert ? (20 * 60 * 1) : 0;
    //take out babies
    entities.filter(e => { return !e.hasComponent('minecraft:is_baby'); }).forEach(e => {

        //is NameTagged?
        const nameTag = e.nameTag;
        let markVar = e.getComponent('minecraft:mark_variant')?.value;
        if (typeof markVar == 'undefined') markVar = -1;
        const { location } = e;
        const lastLocation = DynamicPropertyLib.getVector(e, dynamicVars.lastLocation);
        //const inBlock = EntityLib.currentBlock(e);

        let lastActiveTick = DynamicPropertyLib.getNumber(e, dynamicVars.lastActiveTick);
        const deltaTicks = system.currentTick - lastActiveTick;
        DynamicPropertyLib.add(e, dynamicVars.aliveTicks, deltaTicks);

        if (lastLocation) {
            //Did spider move?
            if (!(lastLocation.x == location.x && lastLocation.y == location.y && lastLocation.z == location.z)) {
                //if it moved, it is active - remember in web, collision is OFF, so cannot be moved by accident
                activityRegister(e);
                return;
            }
        }

        const isPet = e.hasComponent('minecraft:persistent');

        if (lastActiveTick) {
            const deltaMinutes = Math.trunc(((deltaTicks) / 20) / 60);

            if (deltaMinutes > watchFor.assumedStalledIfOver) {
                const inBlock = EntityLib.currentBlock(e);
                let msg;

                if (inBlock && inBlock.typeId == HOME_ID) {

                    msg = `§4${nameTag || e.id} Stalled in Web (${deltaMinutes}m - mv=${markVar}) @ ${Vector3Lib.toString(location, 0, true)} - Sending Wander Event `;
                    alertLog.warn(msg, debug.dev.debug);
                    system.runTimeout(() => {
                        e.setDynamicProperty(dynamicVars.lastWebActivityTick, system.currentTick);
                        e.triggerEvent(entityEvents.wanderEventName);
                    }, 1);
                    return;
                }

                msg = `§4${nameTag ? nameTag : watchFor.display} Stalled (${deltaMinutes}m)  (${e.id}) @ ${Vector3Lib.toString(location, 0, true)} - Replacing `;
                alertLog.warn(msg, debug.dev.debug);

                if (isPet) {
                    //summon one with same name
                    killDelay = 1;
                    debug.debugScoreboards.sbStatsScoreboard?.addScore(debug.debugScoreboards.stalled, 1);
                    const cmd = `summon ${watchFor.typeId} ${Vector3Lib.toString(location, 1, false, ' ')} 0 0 minecraft:entity_spawned "${nameTag}"`;
                    system.runTimeout(() => {
                        if (e.isValid) {
                            alertLog.warn(`Replacing stalled pet spider ${e.nameTag} (${deltaMinutes} min)`, debug.dev.debug);
                            worldRun(cmd, e.dimension.id, 1);
                            if (entityEvents.replaceEventName)
                                e.triggerEvent(entityEvents.replaceEventName);
                            else
                                e.kill();
                        }
                    }, killDelay);
                }
                else {
                    debug.debugScoreboards.sbStatsScoreboard?.addScore(debug.debugScoreboards.stalled, 1);
                    system.runTimeout(() => {
                        if (e.isValid)
                            if (entityEvents.replaceEventName) {
                                alertLog.warn(`Replacing stalled spider (${deltaMinutes} min)`, debug.dev.debug);
                                e.triggerEvent(entityEvents.replaceEventName);
                            }
                            else {
                                alertLog.warn(`Replacing/kill stalled spider (${deltaMinutes} min)`, debug.dev.debug);
                                const cmd = `summon ${watchFor.typeId} ${Vector3Lib.toString(location, 1, false, ' ')} 0 0 minecraft:entity_spawned`;
                                worldRun(cmd, e.dimension.id, 1);
                                e.kill();
                            }
                    }, killDelay);
                }
                return;
            }
        }

        const lastWebTick = DynamicPropertyLib.getNumber(e, dynamicVars.lastWebActivityTick);
        if (lastWebTick && !nameTag) { // something wrong or nothing for spider to use is around, may as well not be there
            const deltaMinutes = Math.trunc(((system.currentTick - lastWebTick) / 20) / 60);

            if (deltaMinutes > (watchFor.assumeNoWebsPossibleIfOver)) {

                if (!!killDelay) {
                    const msg = `No Web Activity (${deltaMinutes}m) (${e.id}) @ ${Vector3Lib.toString(location, 0, true)} - Despawning in 1 minute`;
                    alertLog.warn(msg, debug.dev.debug);
                }

                system.runTimeout(() => {
                    if (entityEvents.despawnEventName && e.isValid)
                        e.triggerEvent(entityEvents.despawnEventName);
                    else
                        e.kill();
                }, killDelay);

                return;
            }
        }
    });
}
//===================================================================

// --- Helper: Tree Spider–style names ---
// Favor sibilants, light vowels, and -y/-ie endings. You can override anything via `overrides`.
export function makeSpiderName (overrides = {}) {
    return makeRandomName({
        consonants: [ 's', 'z', 'ph', 'sh', 'ch', 'th', 'f', 'v', 'h', 'l', 'r', 'n', 'm', 'k', 'g', 't', 'd', 'w' ],
        vowels: [ 'i', 'e', 'y', 'a', 'o' ],
        formulas: {
            'cvc': 2,
            'cvvc': 2,
            'cvcv': 2,
            'cvwcie': 4,
            'cvwcy': 4,
            'cvcy': 4,
            'cvcie': 4,
            'vcv': 2,
            'vcvc': 2,
            'vcvcy': 3,
            'vcvcie': 3,
            'cvckie': 2,
            'cvcky': 2
        },
        ...overrides
    });
}

// Example:
// console.log(makeSpiderName()); // e.g., "Sivie", "Zely", "Shiri"
// End of File

