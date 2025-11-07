// fn-entities.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20251023 - Update and sep out debug-only stuff and add the stable stuff
========================================================================*/
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
// import { MinecraftEntityTypes, MinecraftEffectTypes } from "@minecraft/vanilla-data";
//==============================================================================
// Minecraft
import { Entity, system, Block, world } from "@minecraft/server";
// Shared
import { airBlock } from "../common-data/block-data.js";
import { Ticks } from "../common-data/globalConstantsLib.js";
import { makeRandomName } from "../common-other/randomNames.js";
import { rndInt, chance } from "../common-other/mathLib.js";
import { Vector3Lib, } from '../common-stable/vectorClass.js';
import { DynamicPropertyLib } from "../common-stable/dynamicPropertyClass.js";
import { EntityLib } from "../common-stable/entityClass.js";
import { worldRun } from "../common-stable/worldRunLib.js"
// Local
import { closestWeb, closestExpandableWebLocation, targetBlockAdjacent } from "./fn-blocks.js";
import { devDebug, debugScoreboards } from "./fn-debug.js";
import { alertLog,  watchFor, dynamicVars, entityEvents } from '../settings.js';
//==============================================================================
const debugFunctions = false;
//==============================================================================
//==============================================================================
/** cache once (watchFor is stable) */
const AIR_BLOCK = airBlock;
const HOME_ID = watchFor.home_typeId;
//===================================================================
/**
 * @param {Entity} entity 
 * @returns {boolean}
 */
function isInWeb (entity) {
    if (!entity.isValid) return false;

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
 * @param {Entity} entity 
 * @returns
 */
function fireFlyFood (entity) {
    if (!entity.isValid) return;

    const { dimension, location, nameTag } = entity;
    const locationStr = Vector3Lib.toString(location, 2, true);
    alertLog.log(`§l${nameTag} is §aEating Now§r @ ${locationStr}`, devDebug.watchEntityEating);

    entity.triggerEvent(entityEvents.eatFireFliesEventName);

    //spawn fireflies
    const fireflyLocation = { x: location.x, y: location.y + 3, z: location.z };
    system.runTimeout(() => {
        const cmd = `summon ${watchFor.firefly_typeId} ${Vector3Lib.toString(fireflyLocation, 1, false, ' ')} 0 0 minecraft:entity_spawned`;
        for (let i = 0; i < 5; i++){
            if (entity.isValid) worldRun(cmd, entity.dimension.id, 1);            
            //dimension.spawnEntity(watchFor.firefly_typeId, fireflyLocation);
        }
    });

    const minutesInTicks = 20 * 60 * rndInt(1, 5);

    for (let i = 0; i <= minutesInTicks; i += 10) {

        //randomly add to i so that it is not a consistent jumping
        i += rndInt(10, 100);

        if (entity.isValid) {
            system.runTimeout(() => {
                //FIXME:  not if in a web... can get stuck... has to have nothing above head.
                const inBlock = dimension.getBlock(location);
                const aboveBlock = dimension.getBlock(location)?.above();

                if (entity.isValid && inBlock && aboveBlock && inBlock.typeId === AIR_BLOCK && aboveBlock.typeId === AIR_BLOCK) {
                    const { dimension, location, nameTag } = entity;
                    const locationStr = Vector3Lib.toString(location, 2, true);
                    const v3 = Vector3Lib.randomVectorImpulseCapped(0.375, 1.25, { allowNegativeXZ: true, decimals: 2 });
                    const v3Str = Vector3Lib.toString(v3, 2, true);

                    //alertLog.log(`${nameTag} impulse from ${locationStr} is ${v3Str}`, devDebug.debugOn);
                    dimension.spawnParticle('minecraft:firefly_particle', location);
                    entity.applyImpulse(v3);
                    //entity.applyImpulse({ x: 0.25, y: 0.75, z: 0 });

                    if (chance(0.40))
                        system.runTimeout(() => {
                            if (entity.isValid)
                                dimension.spawnEntity("minecraft:xp_orb", entity.location); //may need to put into a delay, so it captures him up
                        }, Math.round(10 * v3.y));
                }
            }, i);
        }
    } //loop

    //now go home
    system.runTimeout(() => {
        if (entity.isValid) {
            entity.addTag('satiated');
            entity.removeTag('hungry');
        }
        //entity.triggerEvent(entityEvents.lookForWebEventName);
    }, minutesInTicks + (20 * 3));
}
//===================================================================
/**
 * @param {Entity} entity 
 * @param {boolean} isBaby 
 * @returns {boolean} 
 */
function enterWeb (entity, isBaby = false) {
    const { dimension, location } = entity;
    const locationStr = Vector3Lib.toString(location, 0, true);
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

    const alertMsg = inBlock.typeId == HOME_ID ? `§l${entity.nameTag || entity.id}§r §bAlready in Web @ ${locationStr} - enterWeb()` : `§l${entity.nameTag || entity.id}§r§b Entering Web @ ${Vector3Lib.toString(webBlock.location, 0, true)}`;
    alertLog.log(alertMsg, devDebug.watchEntityEvents);

    teleportAndCenter(entity, webBlock); //1 tick out
    system.runTimeout(() => {
        system.runTimeout(() => {
            isBaby ? entity.triggerEvent(entityEvents.baby_stayInWebEventName) : entity.triggerEvent(entityEvents.stayInWebEventName);
            //Log
            system.runTimeout(() => {
                if (isInWeb(entity)) {
                    if (devDebug.watchEntityEvents || devDebug.watchEntityGoals) debugScoreboards.sbStatsScoreboard?.addScore(debugScoreboards.enterWeb, 1);
                    DynamicPropertyLib.add(entity, dynamicVars.websEntered, 1);
                }
                else {
                    alertLog.warn(`${entity.nameTag || entity.id} May Have Entered Web @ ${Vector3Lib.toString(webBlock.location, 0, true)}`, devDebug.watchEntityEvents);
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
function expandWeb (entity) {
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
            alertLog.success(`${entity.nameTag || entity.id} Expanded Web @ ${Vector3Lib.toString(newWeb.location, 0, true)}`, devDebug.watchEntityEvents);
            debugScoreboards.sbStatsScoreboard?.addScore(debugScoreboards.expandWeb, 1);
            DynamicPropertyLib.add(entity, dynamicVars.websExpanded, 1);
        }
        else {
            alertLog.warn(`${entity.nameTag || entity.id} May Have Expanded Web @ ${Vector3Lib.toString(newWeb.location, 0, true)}`, devDebug.watchEntityEvents);
        }
    }, 4);

    return true;
}
//==============================================================================
/**
 * @param {Entity} entity 
 * @returns {boolean}
 */
function placeWeb (entity) {
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
            alertLog.log(`§l${entity.nameTag || entity.id}§r §5Placed New Web @ ${Vector3Lib.toString(inBlock.location, 0, true)}`, devDebug.watchEntityEvents);
            debugScoreboards.sbStatsScoreboard?.addScore(debugScoreboards.newWeb, 1);
            DynamicPropertyLib.add(entity, dynamicVars.websCreated, 1);
        }
        else {
            alertLog.warn(`§l${entity.nameTag || entity.id}§r §6May have Placed New Web @ ${Vector3Lib.toString(inBlock.location, 0, true)}`, devDebug.watchEntityEvents);
        }
    }, 4);

    return true;
}
//===================================================================
/**
 * @param {Block} block
 * @returns {boolean}  
 */
function webAdjacent (block) {

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
 * @param {Entity} entity 
 * @param {import("@minecraft/server").Vector3} location 
 */
function setWebAndEnter (entity, location) {
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
 * @param {Entity} entity 
 */
function newEgg (entity) {
    const dimension = entity.dimension;
    const inBlock = dimension.getBlock(entity.location);

    if (!inBlock) { return; }

    system.runTimeout(() => {
        debugScoreboards.sbStatsScoreboard?.addScore(debugScoreboards.layEgg, 1);
        if (entity.isValid) entity.teleport(inBlock.center());
    }, 1);
}
//===================================================================
/**
 * 
 * @param {Entity} entity 
 * @param {import("@minecraft/server").Vector3} location 
 */
function teleportAndCenter (entity, location) {
    system.runTimeout(() => {
        centerAlign(entity);
        entity.teleport((location));
        system.runTimeout(() => { centerAlign(entity); }, 1);
    }, 1);
}
//===================================================================
/**
 * @param {Entity} entity  
 */
function centerAlign (entity) {
    if (!entity.isValid) return;
    const center = entity.dimension.getBlock(entity.location)?.center();
    if (center) entity.teleport(center);
}
//===================================================================
/**
 * @param {Entity} entity
 * @param {number} [tickDelay=0]  
 */
function lastLocationRegister (entity, tickDelay = 0) {
    system.runTimeout(() => {
        if (!entity.isValid) return;
        entity.setDynamicProperty(dynamicVars.lastLocation, entity.location);
    }, tickDelay);
}
//===================================================================
/**
 * 
 * @param {Entity} entity
 * @param {number} [tickDelay=0]  
 */
export function lastTickAndLocationRegister (entity, tickDelay = 0) {
    system.runTimeout(() => {
        if (!entity.isValid) return;
        entity.setDynamicProperty(dynamicVars.lastActiveTick, system.currentTick);
        entity.setDynamicProperty(dynamicVars.lastLocation, entity.location);
    }, tickDelay);
}
//===================================================================
/**
 * @summary Used to determine if Spider Entity is stalled, so it can be replaced later
 * @param {Entity} entity
 * @param {number} [tickDelay=0]   
 */
function webActivityRegister (entity, tickDelay = 0) {
    system.runTimeout(() => {
        if (!entity.isValid) return;
        entity.setDynamicProperty(dynamicVars.lastWebActivityTick, system.currentTick);
        entity.setDynamicProperty(dynamicVars.lastActiveTick, system.currentTick);
        entity.setDynamicProperty(dynamicVars.lastLocation, entity.location);
    }, tickDelay);
}
//===================================================================
/**
 * @summary Used to determine if Spider Entity is stalled, so it can be replaced later
 * @param {Entity} entity
 * @param {number} [tickDelay=0]   
 */
function hasMovedRegister (entity, tickDelay = 0) {
    if (!entity.isValid) return;
    const { location } = entity;
    const lastLocation = DynamicPropertyLib.getVector(entity, dynamicVars.lastLocation);

    if (!lastLocation) {
        entity.setDynamicProperty(dynamicVars.lastLocation, location);
        return true;
    }

    if ((lastLocation.x == location.x && lastLocation.y == location.y && lastLocation.z == location.z))
        return false;

    //if it moved, it is active - remember in web, collision is OFF, so cannot be moved by accident
    lastTickAndLocationRegister(entity);
    return true;

}
//===================================================================
/**
 * 
 * @param {Entity} entity 
 */
function clearBadHungerIndicators (entity) {
    if (!entity || !entity.isValid) return;

    const hourOfDay = GetWorldTime().hours;
    const satiated = entity.hasTag('satiated');
    const hungry = entity.hasTag('hungry');

    if (hourOfDay >= 6 && hourOfDay < 18) {
        if (satiated) entity.removeTag('satiated');
        if (hungry) entity.removeTag('hungry');
    } // add 
}
//===================================================================
/**
 * 
 * @param {Entity} entity 
 * @param {number} [hungerChance=0.25] 
 * @param {boolean} [debug=false] 
 */
function setHungerChance (entity, hungerChance = 0.25, debug = false) {
    if (!entity || !entity.isValid) return;

    const { location, nameTag } = entity;
    const locationStr = Vector3Lib.toString(location, 0, true);

    const hourOfDay = GetWorldTime().hours;
    const satiated = entity.hasTag('satiated');
    const hungry = entity.hasTag('hungry');

    if (hourOfDay >= 18 && !satiated && !hungry) {
        if (chance(hungerChance)) {
            alertLog.log(`§l${nameTag} is §cHungry Now§r @ ${locationStr}`, debug);
            entity.addTag('hungry'); //so not all doing it at once
            system.runTimeout(() => {
                entity.triggerEvent('hungry_start');
            }, 10); //<< make this random between how many ticks left before 5am NO.... cause might be doing something important
        }
    }

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

    alertLog.log('§l§6Checking for Stalled Tree Spiders', devDebug.watchEntityIssues);

    entities.filter(e => { return !e.hasComponent('minecraft:is_baby'); }).forEach(e => {
        if (hasMovedRegister(e)) return;

        clearBadHungerIndicators(e);

        entityStallCheck_lastTick(e);
    });
}
//===================================================================
/**
 * 
 * @param {Entity} entity 
 */
function entityStallCheck_lastTick (entity) {

    const { id, dimension, location, nameTag } = entity;

    let markVar = entity.getComponent('minecraft:mark_variant')?.value;
    if (typeof markVar == 'undefined') markVar = -1;

    const locationStr = Vector3Lib.toString(location, 0, true);
    const inBlock = EntityLib.currentBlock(entity);
    let msg = '';

    let lastActiveTick = DynamicPropertyLib.getNumber(entity, dynamicVars.lastActiveTick);
    const deltaTicks = system.currentTick - lastActiveTick;
    DynamicPropertyLib.add(entity, dynamicVars.aliveTicks, deltaTicks);

    //TODO: using name tag is not stopping system from removing it - any fix for this?
    const isPet = entity.hasComponent('minecraft:persistent') || entity.hasTag('pet');

    if (!lastActiveTick || isPet) {
        lastTickAndLocationRegister(entity);
        return;
    }
    const deltaMinutes = Math.trunc((deltaTicks / 20) / 60);

    if (devDebug.watchEntityIssues)
        if (deltaMinutes > (watchFor.assumedStalledIfOver * 0.75) && deltaMinutes < watchFor.assumedStalledIfOver) {
            const msg = `§r§l${nameTag}§r is Pre-Stalled (${deltaMinutes}m)=75% @ ${locationStr} - Killing Soon ${Math.trunc(watchFor.assumedStalledIfOver * 0.25)}m`;
            alertLog.warn(msg);
            return;
        }

    if (deltaMinutes < watchFor.assumedStalledIfOver) return;
    //-----------------------------------------------------------------------
    if (inBlock && inBlock.typeId == HOME_ID) {

        //I am not seeing this message - so maybe this is not a thing, but do not want to NOT do this - just in case
        msg = `§r§l${nameTag}§r §cStalled in Web (${deltaMinutes}m - mv=${markVar}) @ ${locationStr} - Sending Wander Event `;
        alertLog.warn(msg, devDebug.watchEntityIssues);

        system.runTimeout(() => {
            if (entity.isValid) {
                entity.setDynamicProperty(dynamicVars.lastWebActivityTick, system.currentTick);
                entity.triggerEvent(entityEvents.wanderEventName);
            }
        }, 1);

        return;
    }
    //-----------------------------------------------------------------------
    /*
    if (isPet) {
        //summon one with same name
        killDelay = 1;
        debugScoreboards.sbStatsScoreboard?.addScore(debugScoreboards.stalled, 1);
        const cmd = `summon ${watchFor.typeId} ${Vector3Lib.toString(location, 1, false, ' ')} 0 0 minecraft:entity_spawned "${nameTag}"`;
        alertLog.warn(`Replacing stalled pet spider ${nameTag} (${deltaMinutes} min)`, devDebug.watchEntityIssues);
        system.runTimeout(() => {
            if (entity.isValid) {
                worldRun(cmd, entity.dimension.id, 1);
                if (entityEvents.replaceEventName)
                    entity.triggerEvent(entityEvents.replaceEventName);
                else
                    entity.kill();
            }
        }, killDelay);
        return;
    }
    */
    //-----------------------------------------------------------------------
    if (!entity.isValid) return;
    if (devDebug.watchEntityIssues) debugScoreboards.sbStatsScoreboard?.addScore(debugScoreboards.stalled, 1);
    // For now, just kill, no replacing - try to check the pre-stalled ones to see what is wrong... no need for kill msg
    //msg = `§r§l${nameTag ? nameTag : watchFor.display}§r§c Stalled (${deltaMinutes}m) @ ${locationStr} - Fixing `;
    //alertLog.warn(msg, devDebug.watchEntityIssues);
    entity.kill();
    return;

    /*
    //How many spiders in area
    const spiders = dimension.getEntities({ location: location, families: [ "tree_spider" ], maxDistance: watchFor.populationRadius * 2 });
    if (spiders.length >= watchFor.populationLimit || !entityEvents.replaceEventName) {
        entity.kill();
        return;
    }

    alertLog.warn(`§r§l${nameTag || id}§r §6 running event ${entityEvents.replaceEventName} (${deltaMinutes} min)`, devDebug.watchEntityIssues);
    entity.triggerEvent(entityEvents.replaceEventName);

    //See if still valid, if so... kill
    system.runTimeout(() => {
        if (!entity.isValid) return;

        alertLog.warn(`§r§l${nameTag}§r§c is still alive... so killing stalled spider (${deltaMinutes} min)`, devDebug.watchEntityIssues);
        entity.kill();

        if (spiders.length < watchFor.populationLimit) {
            alertLog.log(`§lReplacement Spider Summoned§r @ ${locationStr}`, devDebug.debugOn);
            const cmd = `summon ${watchFor.typeId} ${Vector3Lib.toString(location, 1, false, ' ')} 0 0 minecraft:entity_spawned`;
            worldRun(cmd, dimension.id, 1);
        }
    }, 5 * 20); //5 seconds
    */
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
// --- Helper: Tree Spider–style names ---
// Favor sibilants, light vowels, and -y/-ie endings. You can override anything via `overrides`.
export function makeSpiderEggName (overrides = {}) {
    // i.e. like eggBert, Eggie
    return 'Eg' + makeRandomName({
        consonants: [ 's', 'z', 'f', 'v', 'l', 'r', 'n', 'm', 't', 'd', 'w', 'ph' ],
        vowels: [ 'i', 'e', 'y', 'a', 'o' ],
        formulas: {
            'vv': 3,
            'vc': 3,
            'cvc': 3,
            'cvcv': 3,
            'cvcy': 3,
            'cvcie': 3,
            'vcv': 3,
            'vcvc': 3,
            'vcvcy': 3,
            'vcvcie': 3,
            'vckv': 3
        },
        ...overrides
    }).toLowerCase();
}
//====================================================================
function GetWorldTime () {
    const daytime = world.getTimeOfDay() + 6000;
    const datetime = new Date(daytime * 3.6 * 1000);

    return { hours: datetime.getHours(), minutes: datetime.getMinutes() };
}
export function hourlyChime () {
    const now = () => { return `§l§gTime: ${GetWorldTime().hours}:00`; };
    alertLog.log(`Start ${now()}`, devDebug.debugOn);

    system.runInterval(() => {
        alertLog.log(now(), devDebug.debugOn);
    }, Ticks.minecraftHour);
}
//====================================================================
/**
 * @summary Process the event/messages passed from the entity itself - called from the subscribe with a one tick delay already
 * @param {Entity} entity 
 * @param {string} id 
 * @param {string} message 
 * @returns 
 */
export function entityEventProcess (entity, id, message) {
    if (!entity || !entity.isValid) return;

    const { dimension, typeId, location } = entity;
    let { nameTag } = entity;
    const locationStr = Vector3Lib.toString(location, 0, true);

    if (typeId == watchFor.typeId) {
        hasMovedRegister(entity);

        if (!nameTag && (watchFor.allowFakeNameTags || devDebug.debugOn)) {
            nameTag = makeSpiderName();
            if (nameTag && entity.isValid) entity.nameTag = nameTag; else return;
        }

        //activity on other scoreboard
        if (devDebug.debugOn && nameTag) debugScoreboards.sbEntitiesScoreboard?.addScore(nameTag, 1);
    }
    else if (typeId == watchFor.egg_typeId) {

        if (!nameTag && (watchFor.allowFakeNameTags || devDebug.debugOn)) {
            nameTag = makeSpiderEggName();
            if (nameTag && entity.isValid) entity.nameTag = nameTag; else return;
        }
    }
    else if (typeId === watchFor.fly_typeId) {
        if (id === 'debugLogEvent:NewFly') debugScoreboards.sbStatsScoreboard?.addScore('§l§cNew Fly', 1);
        return;
    }
    else if (typeId === watchFor.firefly_typeId) {
        if (id === 'debugLogEvent:NewFireFly') debugScoreboards.sbStatsScoreboard?.addScore('§lNew Fire Fly', 1);
        return;
    }

    if (!id) return; //This should not happen... but just in case
    //check hunger tag TODO: make babies eat too....
    clearBadHungerIndicators(entity);

    //Main Events
    if (id.startsWith('mainEvent')) {

        if (id === `mainEvent:enterWeb`) { enterWeb(entity, message == 'baby' ? true : false); return; }
        if (id === `mainEvent:expandWeb`) { expandWeb(entity); return; }
        if (id === `mainEvent:placeWeb`) { placeWeb(entity); return; }
        if (id === `mainEvent:newEgg`) { newEgg(entity); return; }
        if (id === `mainEvent:layEgg`) { DynamicPropertyLib.add(entity, dynamicVars.eggsLaid, 1); return; }
        if (id === `mainEvent:eatFireflies`) { fireFlyFood(entity); return; }

        if (id == ('mainEvent:hungryEnd')) {
            alertLog.log(`§l${nameTag} §cCould not find food before daybreak§r @ ${locationStr}`, devDebug.watchEntityEating);
            entity.triggerEvent(entityEvents.lookForWebEventName);
            return;
        }

        alertLog.log(`§5Other (${id}:${message}) for ${nameTag}  @ ${locationStr}`, devDebug.watchEntityGoals);
        return;
    }//mainEvent

    if (id.startsWith('subEvent')) {
        if (id == ('subEvent:lookForFood')) {
            alertLog.log(`§l${nameTag} is looking for fire flies to eat @ ${locationStr}`, devDebug.watchEntityEating);
            return;
        }

        // FIXME: Have not seen this yet
        if (id === `subEvent:named`) {
            alertLog.log(`§l§bRenamed to ${nameTag}`, devDebug.debugOn);
            entity.addTag('pet');
            return;
        }
    }//subEvent

    //---------------------------------------------------
    //Create hungry spiders if not in main/sub goals above
    //---------------------------------------------------
    setHungerChance(entity, watchFor.hungryChance, devDebug.watchEntityEating);
    //----------------------
    if (!devDebug.debugOn) return;
    if (!entity.isValid) return; // yeah they do become invalid in the middle of things and cause an error
    //----------------------    

    if (id.startsWith('lookEvent')) {
        alertLog.log(`§l${nameTag}§r is looking for ${message}) @ ${locationStr} `, devDebug.watchEntityEvents);
        return;
    }

    if (id.startsWith('debugLogEvent')) {
        if (id === 'debugLogEvent:NewEntity') {
            if (message == 'born') {
                const sbEntry = debugScoreboards.born;
                DynamicPropertyLib.add(entity, dynamicVars.entityBorn, 1);
                debugScoreboards.sbStatsScoreboard?.addScore(sbEntry, 1);
                alertLog.log(`§bNew Baby Born§r in Biome ${dimension.getBiome(location).id}: §l${nameTag}§r§6  @ ${locationStr}`, devDebug.watchEntityEvents || devDebug.watchEntityGoals);
                return;
            }

            if (message == 'spawned') {
                const sbEntry = debugScoreboards.spawned;
                DynamicPropertyLib.add(entity, dynamicVars.entitySpawns, 1);
                debugScoreboards.sbStatsScoreboard?.addScore(sbEntry, 1);
                alertLog.log(`§aNew Adult Spawned§r in Biome ${dimension.getBiome(location).id}: §l${nameTag}§r§6  @ ${locationStr} - scriptEventReceive ()`, devDebug.watchEntityEvents || devDebug.watchEntityGoals);
                return;
            }
        }

        if (message == 'puberty' && devDebug.watchEntityEvents) {
            const sbEntry = debugScoreboards.growUp;
            debugScoreboards.sbStatsScoreboard?.addScore(sbEntry, 1);
            alertLog.log(`§l${nameTag}§r §bGrew Up @ ${locationStr}`);
            return;
        }
    }

    if (id.startsWith('alertEvent')) {
        if (message == 'despawn_me') {
            alertLog.warn(`§l${nameTag}§r is running event despawn_me @ ${locationStr}`, devDebug.debugOn);
            return;
        }

        if (message == 'replace_me') {
            alertLog.warn(`§l${nameTag}§r is running event replace_me @ ${locationStr}`, devDebug.debugOn);
            return;
        }

        alertLog.log(`§pOther alertEvent for ${nameTag} (${message})`, devDebug.watchEntityEvents);
        return;
    }

    if (id.startsWith('miscEvent')) {
        alertLog.log(`(Misc Event) for §l${nameTag}§r (§6${message}) @ ${locationStr}`, devDebug.watchEntityEvents);
        return;
    }

    if (id.startsWith('debug:Stick')) {
        alertLog.log(`§l${nameTag}§r says §v${message}§r @ ${locationStr}`, devDebug.debugOn);
        return;
    }

    const note = `${nameTag} ${message} @ ${locationStr} (event)`;
    alertLog.error(`Unhandled Entity JSON Communication:\nId: ${id}\nMessage: ${note}`, devDebug.debugOn);
    return;
}
//====================================================================
// End of File