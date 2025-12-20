// fn-entities.js  Tree Spiders
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
import { Entity, system, Block, GameMode, Player } from "@minecraft/server";
// Shared Stable
import { airBlock, leafBlocks, Ticks } from "../common-data/index.js";
import { closestAdjacentBlockTypeId, isBlockAdjacentToTypeId, EntityLib, spawnEntityAtLocation } from "../common-stable/gameObjects/index.js";
import { makeRandomName, rndInt, chance, Vector3Lib, isInForest, isOutside, getWorldTime, DynamicPropertyLib } from "../common-stable/tools/index.js";
// Local
import { targetBlockAdjacent } from "./fn-blocks.js";
import { alertLog, pack, watchFor, entityDynamicVars } from '../settings.js';
import { devDebug } from "../debug.js";
//==============================================================================
const debugFunctions = false || devDebug.debugFunctionsOn;
const debugOn = devDebug.debugOn;
//==============================================================================
//==============================================================================
/** cache once (watchFor is stable) */
const AIR_BLOCK = airBlock;
const HOME_ID = watchFor.spider_home_typeId;
//const ENTITY_BORN_EVENT = "minecraft:entity_born";
const ENTITY_SPAWNED_EVENT = "minecraft:entity_spawned";
const FIREFLY_PARTICLE = 'minecraft:firefly_particle';
const XP_ORB = "minecraft:xp_orb";
const leaves = [ ...leafBlocks ];
export const entityScriptEvents = {
    //All
    despawnEventName: 'despawn_me',
    replaceEventName: 'replace_me',
    spider_loadedEventName: 'dw623:spider_loaded',
    //Babies
    baby_stayInWebEventName: 'dw623:baby_stay_in_web_start',
    baby_wanderEventName: 'dw623:baby_wander_around_start',
    baby_spider_loadedEventName: 'dw623:baby_spider_loaded',
    baby_lookForWebEventName: 'dw623:baby_look_for_web_start',
    //Adults
    catchAndEatFireFlies: 'dw623:catch_and_eat_fireflies',
    //eatFireFliesInDaylightEventName: 'dw623:catch_and_eat_fireflies_daytime',
    entity_validatedEventName: 'dw623:entity_validation',
    spider_hungryEventName: 'dw623:hungry_start',
    lookForWebEventName: 'dw623:look_for_web_nearest_start',
    stayInWebEventName: 'dw623:stay_in_web_start',
    wanderEventName: 'dw623:wander_around_start'
};
//===================================================================
class Web {
    //===================================================================
    /**
     * @summary Used to determine if Spider Entity is stalled, so it can be replaced later
     * @param {Entity} entity
     * @param {number} [tickDelay=0]   
     */
    static activityRegister (entity, tickDelay = 0) {
        system.runTimeout(() => {
            if (!entity.isValid) return;
            entity.setDynamicProperty(entityDynamicVars.lastWebActivityTick, system.currentTick);
            entity.setDynamicProperty(entityDynamicVars.lastActiveTick, system.currentTick);
            entity.setDynamicProperty(entityDynamicVars.lastLocation, entity.location);
        }, tickDelay);
    }
    /**
     * Returns adjacent web (any side at 1 block) or a web straight above within `numberOfBlocksMax`,
     * scanning upward only through air. Stops if a non-air, non-web block is hit.
    
     * @param {Block} block 
     * @param {number} numberOfBlocksAboveMax 
     * @returns {Block | undefined}
     * @summary Returns block of adjacent web or web (number of blocks) above
     */
    static closestAdjacentWeb (block, numberOfBlocksAboveMax = 8) {

        const try1 = closestAdjacentBlockTypeId(block, HOME_ID);
        if (try1) return try1;

        //try 2
        //now above only
        if (numberOfBlocksAboveMax <= 1) return;

        //ChatGPT - Look above starting at 2nd block, until max is reached, as long as block is air
        let up = block.above(); // 1 above (already checked in neighbors)
        if (!up) return;

        for (let i = 2; i <= numberOfBlocksAboveMax; i++) {
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
    //TODO: refactor for move to block lib
    /** 
     *  Returns adjacent air block that has non-air block above it
     * @param {Block} block 
     * @returns {Block | undefined}
     * @summary Returns block of adjacent air
     */
    static closestExpandableWebLocation (block) {

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
     * @param {Entity} entity 
     * @returns {boolean}
     */
    static insideWebBlock (entity) {
        if (!entity.isValid) return false;

        const { dimension, location } = entity;
        const inBlock = dimension.getBlock(location);

        if (!inBlock) return false;
        if (inBlock.typeId === HOME_ID) return true;

        return false;
    }
    //===================================================================
    /**
     * @param {Block} block
     * @returns {boolean}  
     */
    static isAdjacent (block) {
        return isBlockAdjacentToTypeId(block, HOME_ID);
    }
    //===================================================================
    /**
     * @param {Entity} entity 
     * @param {boolean} isBaby 
     * @returns {boolean} 
     */
    static enterWeb (entity, isBaby = false) {
        const { dimension, location } = entity;
        const locationStr = Vector3Lib.toString(location, 0, true);
        const inBlock = dimension.getBlock(location);

        if (!inBlock) return false;

        Web.activityRegister(entity);
        let webBlock = inBlock.typeId == HOME_ID ? inBlock : Web.closestAdjacentWeb(inBlock, 8);

        if (!webBlock) {
            system.runTimeout(() => {
                if (entity.isValid)
                    isBaby ? entity.triggerEvent(entityScriptEvents.baby_wanderEventName) : entity.triggerEvent(entityScriptEvents.wanderEventName);
            }, 1);
            return false;
        }

        const alertMsg = inBlock.typeId == HOME_ID ? `§l${entity.nameTag || entity.id}§r §bAlready in Web @ ${locationStr} - enterWeb()` : `§l${entity.nameTag || entity.id}§r§b Entering Web @ ${Vector3Lib.toString(webBlock.location, 0, true)}`;
        alertLog.log(alertMsg, devDebug.watchEntityEvents);

        EntityLib.teleportAndCenter(entity, webBlock); //1 tick out
        system.runTimeout(() => {
            system.runTimeout(() => {
                if (entity.isValid)
                    isBaby ? entity.triggerEvent(entityScriptEvents.baby_stayInWebEventName) : entity.triggerEvent(entityScriptEvents.stayInWebEventName);
                //Log
                system.runTimeout(() => {
                    if (entity.isValid && Web.insideWebBlock(entity)) {
                        DynamicPropertyLib.increment(entity, entityDynamicVars.websEntered);
                        if (devDebug.watchEntityGoals) devDebug.dsb.increment('stats', 'enterWeb');
                    }
                    else {
                        alertLog.warn(`${entity.nameTag || entity.id} May Have Entered Web @ ${Vector3Lib.toString(webBlock.location, 0, true)}`, debugOn);
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
    static expandWeb (entity) {
        const { dimension, location } = entity;
        const inBlock = dimension.getBlock(location);
        if (!inBlock) return false;

        if (inBlock.typeId !== HOME_ID) {
            Web.activityRegister(entity);
            system.runTimeout(() => {
                if (entity.isValid) entity.triggerEvent(entityScriptEvents.wanderEventName);
            }, 1);
            return false;
        }

        const newWeb = Web.closestExpandableWebLocation(inBlock);
        if (!newWeb) {
            Web.activityRegister(entity);
            system.runTimeout(() => {
                if (entity.isValid) entity.triggerEvent(entityScriptEvents.wanderEventName);
            }, 1);
            return false;
        }

        this.setWebAndEnter(entity, newWeb); // 3 ticks

        //Log
        system.runTimeout(() => {
            if (Web.insideWebBlock(entity)) {
                entity.nameTag;
                alertLog.success(`${entity.nameTag || entity.id} Expanded Web @ ${Vector3Lib.toString(newWeb.location, 0, true)}`, devDebug.watchEntityEvents);
                DynamicPropertyLib.increment(entity, entityDynamicVars.websExpanded);
                if (debugOn) {
                    devDebug.dsb.increment('ctrs', 'webs');
                    if (devDebug.watchEntityGoals)
                        devDebug.dsb.increment('stats', 'expandWeb');
                    else
                        devDebug.dsb.increment('stats', 'newWeb');
                }
            }
            else {
                alertLog.warn(`${entity.nameTag || entity.id} May Have Expanded Web @ ${Vector3Lib.toString(newWeb.location, 0, true)}`, debugOn);
            }
        }, 4);

        return true;
    }
    //==============================================================================
    /**
     * @param {Entity} entity 
     * @returns {boolean}
     */
    static placeWeb (entity) {
        //this cannot be called unless spider is next to a target block, so place in air if cannot determine
        const { dimension, location } = entity;
        const inBlock = dimension.getBlock(location);

        if (!inBlock) { return false; }

        if (inBlock.typeId == HOME_ID) {
            Web.activityRegister(entity);
            system.run(() => {
                entity.teleport(inBlock.center());
                if (entity.isValid) entity.triggerEvent(entityScriptEvents.stayInWebEventName);
            });
            return true;
        }

        //has to be in air now... AND    
        //I do not want diagonal webs, so reset to wander if a valid target block is not adjacent
        if (inBlock.typeId !== airBlock || !targetBlockAdjacent(inBlock)) {
            Web.activityRegister(entity);
            system.run(() => { if (entity.isValid) entity.triggerEvent(entityScriptEvents.wanderEventName); });
            return false;
        }

        //Place Web
        this.setWebAndEnter(entity, inBlock.location); // 3 ticks

        //Log
        system.runTimeout(() => {
            if (Web.insideWebBlock(entity)) {
                alertLog.log(`§l${entity.nameTag || entity.id}§r §5Placed New Web @ ${Vector3Lib.toString(inBlock.location, 0, true)}`, devDebug.watchEntityEvents);
                DynamicPropertyLib.increment(entity, entityDynamicVars.websCreated);
                if (debugOn) {
                    devDebug.dsb.increment('ctrs', 'webs');
                    devDebug.dsb.increment('stats', 'newWeb');
                }
            }
            else {
                alertLog.warn(`§l${entity.nameTag || entity.id}§r §6May have Placed New Web @ ${Vector3Lib.toString(inBlock.location, 0, true)}`, debugOn);
            }
        }, 4);

        return true;
    }
    //===================================================================
    /**
     * @param {Entity} entity 
     * @param {Vector3} location 
     */
    static setWebAndEnter (entity, location) {
        //...and stay

        system.runTimeout(() => {

            entity.dimension.setBlockType(location, HOME_ID);
            DynamicPropertyLib.increment(entity, entityDynamicVars.websCreated);
            Web.activityRegister(entity);

            system.runTimeout(() => {
                EntityLib.teleportAndCenter(entity, location, 0);
                system.runTimeout(() => {
                    if (entity.isValid) entity.triggerEvent(entityScriptEvents.stayInWebEventName);
                }, 1);
            }, 1);
        }, 1);
    }
}
//==============================================================================
/**
 * @param {Entity} entity 
 */
function welcomeBack (entity) {

    //entity.nameTag || entity
    Web.activityRegister(entity);
    DynamicPropertyLib.addNumber(entity, entityDynamicVars.websCreated, 0);  //initializes if undefined
    DynamicPropertyLib.addNumber(entity, entityDynamicVars.eggsLaid, 0);
}
//===================================================================
/**
 * @param {Entity} entity 
 * @returns
 */
export function fireFlyFood (entity) {
    if (!entity.isValid) return;

    const { dimension, location, nameTag } = entity;
    const locationStr = Vector3Lib.toString(location, 2, true);
    alertLog.success(`§l${nameTag}§r is §aEating Now§r @ ${locationStr}`, devDebug.watchEntityEating);

    //spawn fireflies
    const fireflyLocation = { x: location.x, y: location.y + 3, z: location.z };
    spawnEntityAtLocation(watchFor.firefly_typeId, dimension, fireflyLocation, 1, 3, 1, 300, ENTITY_SPAWNED_EVENT);

    //const hourOfDay = getWorldTime().hours;
    entity.triggerEvent(entityScriptEvents.catchAndEatFireFlies);

    const minutesInTicks = Ticks.perMinute * rndInt(2, 5);
    for (let i = 0; i <= minutesInTicks; i += 1) {

        //randomly add to i so that it is not a consistent jumping
        i += rndInt(20, 100);

        system.runTimeout(() => {
            if (!entity.isValid) return;

            const inBlock = dimension.getBlock(location);
            if (!inBlock || inBlock.typeId === AIR_BLOCK) return;

            const aboveBlock = dimension.getBlock(location)?.above();
            if (!aboveBlock || aboveBlock.typeId === AIR_BLOCK) return;

            const topMostBlock = dimension.getTopmostBlock(aboveBlock.location);
            if (!topMostBlock) return;

            // Outside-ish or space overhead
            if (topMostBlock.location.y > aboveBlock.location.y + 4 || topMostBlock.location.y <= inBlock.location.y) {
                const locationStr = Vector3Lib.toString(location, 2, true);
                const v3 = Vector3Lib.randomVectorImpulseCapped(0.375, 1.25, { allowNegativeXZ: true, decimals: 2 });
                const v3Str = Vector3Lib.toString(v3, 2, true);

                //alertLog.log(`${nameTag} impulse from ${locationStr} is ${v3Str}`, debugOn);
                dimension.spawnParticle(FIREFLY_PARTICLE, location);
                entity.applyImpulse(v3);
                //entity.applyImpulse({ x: 0.25, y: 0.75, z: 0 });

                if (watchFor.orbChance()) {
                    system.runTimeout(() => {
                        if (entity.isValid) dimension.spawnEntity(XP_ORB, entity.location); //may need to put into a delay, so it captures him up
                    }, Math.round(10 * v3.y));
                }
            }
        }, i);

    } //loop

    //now go home
    system.runTimeout(() => {
        if (entity.isValid) {
            if (debugOn) devDebug.dsb.increment('stats', 'satiated');
            entity.addTag('satiated');
            entity.removeTag('hungry');
        }
        //entity.triggerEvent(entityEvents.lookForWebEventName);
    }, minutesInTicks + (20 * 3));
}

//===================================================================
/**
 * @param {Entity} entity 
 */
function newEgg (entity) {
    if (!entity.isValid) return;

    const inBlock = entity.dimension.getBlock(entity.location);
    if (!inBlock || !inBlock.isValid) return;

    devDebug.dsb.increment('stats', 'layEgg');
    system.runTimeout(() => { EntityLib.centerAlign(entity); }, 1);
}
//===================================================================
/**
 * @param {Entity} entity
 * @param {number} [tickDelay=0]  
 */
function lastLocationRegister (entity, tickDelay = 0) {
    system.runTimeout(() => {
        if (!entity.isValid) return;
        entity.setDynamicProperty(entityDynamicVars.lastLocation, entity.location);
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
        entity.setDynamicProperty(entityDynamicVars.lastActiveTick, system.currentTick);
        entity.setDynamicProperty(entityDynamicVars.lastLocation, entity.location);
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
    const lastLocation = DynamicPropertyLib.getVector(entity, entityDynamicVars.lastLocation);

    if (!lastLocation) {
        entity.setDynamicProperty(entityDynamicVars.lastLocation, location);
        return true;
    }

    if ((lastLocation.x == location.x && lastLocation.y == location.y && lastLocation.z == location.z))
        return false;

    //if it moved, it is active - remember in web, collision is OFF, so cannot be moved by accident
    lastTickAndLocationRegister(entity);
    entity.setDynamicProperty('isStalled', false);
    entity.setDynamicProperty('isUnloaded', false);

    return true;

}
//===================================================================
/**
 * 
 * @param {Entity} entity 
 */
function clearBadHungerIndicators (entity) {
    if (!entity || !entity.isValid) return;

    const hourOfDay = getWorldTime().hours;

    if (hourOfDay > 6 && hourOfDay < 18) {
        const satiated = entity.hasTag('satiated');
        const hungry = entity.hasTag('hungry');

        if (satiated) entity.removeTag('satiated');
        if (hungry) entity.removeTag('hungry');
    } // add 
}
//===================================================================
/**
 * 
 * @param {Entity} entity 
 * @param {number} [hungerChance=0.5] 
 * @param {boolean} [debug=false] 
 */
function setHungerChance (entity, hungerChance = 0.5, debug = false) {
    if (!entity || !entity.isValid) return;
    if (entity.typeId !== watchFor.spider_typeId) return;
    const { location, nameTag } = entity;

    alertLog.log(`* setHungerChance (${nameTag}, ${hungerChance})`, debugFunctions);
    if (!chance(hungerChance)) return;
    if (entity.hasTag('satiated')) return;
    if (entity.hasTag('hungry')) return;

    const locationStr = Vector3Lib.toString(location, 0, true);
    system.runTimeout(() => {
        if (entity.isValid) {
            devDebug.dsb.increment("stats", 'hungry');
            alertLog.log(`§l${nameTag} is §cHungry Now§r @ ${locationStr}`, debug);
            entity.addTag('hungry');
            entity.triggerEvent(entityScriptEvents.spider_hungryEventName);
        }
    }, rndInt(1, 20));

}
//===================================================================
/**
 * Find all stalled tree spiders
 * Current tick .... 5 min off from Last Updated Tick
 */
export function flyPopulationCheck () {
    let fliesKilled = false;

    const flies = EntityLib.getAllEntities({ families: [ "dw623" ], type: watchFor.fly_typeId });
    if (flies.length > 0) {
        flies.forEach(e => {
            if (e.isValid) {
                const firstTick = DynamicPropertyLib.getNumber(e, 'firstLifeCycleTIck');
                if (firstTick == 0) {
                    e.setDynamicProperty('firstLifeCycleTIck', system.currentTick);
                }
                else {
                    const delta = system.currentTick - firstTick;
                    if (delta > watchFor.flyLifeCycleTicks()) {
                        fliesKilled = true;
                        system.runTimeout(() => { if (e.isValid) e.kill(); }, rndInt(20, 100));
                    }
                }
            }
        });
    }
    else
        alertLog.warn(`§lNo Flies - Cannot do Life Cycles`, devDebug.watchEntityPopulation);


    system.runTimeout(() => {
        // via Spiders
        const spiders = EntityLib.getAllEntities({ families: [ "dw623" ], type: watchFor.spider_typeId });
        // .filter(e => { e.isValid; })
        // .filter(e => { e.dimension.isChunkLoaded(e.location); });

        if (spiders.length === 0) {
            alertLog.warn(`§lNo Loaded Spiders - Cannot do a Fly Population Check - will run a Spider Population Check Now`, devDebug.watchEntityPopulation);
            spiderPopulationCheck();
            return;
        }

        spiders.forEach(e => {
            if (e.isValid) {
                hasMovedRegister(e);
                const { dimension, location, nameTag } = e;
                const entitySearchOptions = {
                    families: [ "dw623" ],
                    type: watchFor.fly_typeId,
                    location: location,
                    maxDistance: 16
                };
                const flies = dimension.getEntities(entitySearchOptions);

                if (flies.length === 0) { //spawn some in
                    alertLog.log(`§l${nameTag} - §6Low fly count = ${flies.length} - Spawning some in`, devDebug.watchEntityPopulation);
                    const maxFlies = rndInt(2, 5);
                    spawnEntityAtLocation(watchFor.fly_typeId, dimension, location, maxFlies / 2, maxFlies, 5, 300, ENTITY_SPAWNED_EVENT);
                }
            }
        });
    }, fliesKilled ? 600 : 1);
}
//===================================================================
/**
 * 
 * @param {Player} player 
 */
function spawnSpidersAroundPlayerIfNeeded (player) {
    if (!player.isValid || player.dimension.id !== 'overworld') return;

    const { dimension, location } = player;
    const entitySearchOptions = {
        type: watchFor.spider_typeId,
        location: location,
        maxDistance: watchFor.spiderPopulationRadius()
    };
    const closeSpiders = dimension.getEntities(entitySearchOptions);

    let min = watchFor.spiderPopulationMinimum();
    if (closeSpiders.length < min) {
        devDebug.dsb.increment('stats', 'Spiders Added');
        min = min - closeSpiders.length;
        alertLog.warn(`§lSpawning missing spiders around ${player.name}`, devDebug.watchEntityPopulation);
        spawnEntityAtLocation(watchFor.spider_typeId, dimension, location, Math.ceil(min / 2), min + 1, 5, 1200);
    }
}
//===================================================================
export function spiderPopulationCheck () {

    const players = EntityLib.getOverworldPlayers();

    players.forEach(p => {
        system.runTimeout(() => {
            if (p.isValid &&
                p.location.y >= 60 &&
                (p.isOnGround || p.getGameMode() === GameMode.Creative) &&
                isOutside(p) &&
                isInForest(p)
            ) {
                spawnSpidersAroundPlayerIfNeeded(p);
            }
        }, rndInt(10, 20));
    });
}
//===================================================================
/**
 * @param {Entity} entity 
 */
function entityStallCheck_lastTick (entity) {
    if (!entity.isValid) return;

    const { dimension, location, nameTag } = entity;
    const locationStr = Vector3Lib.toString(location, 0, true);

    if (!dimension.isChunkLoaded(location)) {
        const isUnloaded = DynamicPropertyLib.getBoolean(entity, 'isUnloaded');
        if (!isUnloaded) {
            //report once
            entity.setDynamicProperty('isUnloaded', true);
            alertLog.warn(`§l${nameTag}§r§c is in an unLoaded Chunk §r@ ${locationStr}`, devDebug.watchEntityEvents);
            //devDebug.dsb.increment('stats', 'chunkUnloaded');
        }
        return;
    }

    let lastActiveTick = DynamicPropertyLib.getNumber(entity, entityDynamicVars.lastActiveTick);
    const deltaTicks = system.currentTick - lastActiveTick;
    DynamicPropertyLib.addNumber(entity, entityDynamicVars.aliveTicks, deltaTicks);

    if (!lastActiveTick) {
        lastTickAndLocationRegister(entity);
        return;
    }
    const deltaMinutes = Math.trunc((deltaTicks / 20) / 60);
    if (deltaMinutes < watchFor.assumedStalledIfOver) return;

    const alreadyStalled = DynamicPropertyLib.getBoolean(entity, 'isStalled');

    if (alreadyStalled) {
        if (debugOn) {
            devDebug.dsb.increment('stats', 'killed');
            const msg = `§r§l${nameTag}§r§v is Stalled (${deltaMinutes}m) @ ${locationStr} - §l§cKilled`;
            alertLog.warn(msg, devDebug.watchEntityStalls);
        }
        entity.kill();
        return;
    }

    const msg = `§r§l${nameTag}§r§v is Stalled (${deltaMinutes}m) @ ${locationStr} - §cGo Check Why`;
    alertLog.warn(msg, devDebug.watchEntityStalls);

    system.runTimeout(() => {
        if (entity.isValid) {
            devDebug.dsb.increment('stats', 'stalled');
            entity.setDynamicProperty('isStalled', true);
            entity.triggerEvent(entity.hasComponent('is_baby') ? entityScriptEvents.baby_wanderEventName : entityScriptEvents.wanderEventName);
            system.runTimeout(() => {
                if (entity.isValid) {
                    entity.applyImpulse({ x: rndInt(-8, 8), y: rndInt(1, 8), z: rndInt(-8, 8) });
                    const msg = `§r§l${nameTag}§r§v got Impulsed to fix stall (stuck in one spot)`;
                    alertLog.log(msg, devDebug.watchEntityStalls);
                    system.runTimeout(() => {
                        if (hasMovedRegister(entity)) {
                            const msg = `§r§l${nameTag}'s§r§v stall was fixed`;
                            alertLog.success(msg, devDebug.watchEntityStalls);
                        }
                        else if (entity.isValid) {
                            const msg = `§r§l${nameTag}'s§r§v stall was not fixed`;
                            alertLog.warn(msg, devDebug.watchEntityStalls);
                        }
                    }, 100);
                }
            }, 5);
        }
    }, 1);
}
//===================================================================
export function stalledSpiderCheckAndFix () {

    const entities = EntityLib.getAllEntities({ type: watchFor.spider_typeId });
    if (entities.length === 0) {
        spiderPopulationCheck();
        return;
    }

    entities.filter(e => { return !e.hasComponent('minecraft:is_baby'); }).forEach(e => {
        if (hasMovedRegister(e)) return;
        clearBadHungerIndicators(e);
        entityStallCheck_lastTick(e);
    });
}
//===================================================================
// --- Helper: Tree Spider–style names ---
// Favor sibilants, light vowels, and -y/-ie endings. You can override anything via `overrides`.
function makeSpiderName (overrides = {}) {
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
function makeSpiderEggName (overrides = {}) {
    // i.e. like eggBert
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
/**
 * @summary Process the event/messages passed from the entity itself - called from the subscribe with a one tick delay already
 * @param {Entity} entity 
 * @param {string} id 
 * @param {string} message 
 * @returns 
 */
export function entityEventProcess (entity, id, message) {
    if (id === 'entity:validation') alertLog.log(`Entity Event Received: ${id} : ${message}`, debugFunctions);
    if (!entity || !entity.isValid) return;

    const { typeId } = entity;

    if (id === 'entity:validation') {
        alertLog.success(`Validated ${message}`, devDebug.watchEntitySubscriptions);
        pack.validatedEntities.set(typeId, true);
        return;
    }

    const { dimension, location } = entity;
    let { nameTag } = entity;
    const locationStr = Vector3Lib.toString(location, 0, true);

    if (typeId == watchFor.spider_typeId) {
        hasMovedRegister(entity);

        if (!nameTag && (watchFor.allowFakeNameTags || debugOn)) {
            nameTag = makeSpiderName() || 'Lil Tree Spider';
            entity.nameTag = nameTag;
        }

        if (id === 'spider:forceHunger') {
            alertLog.warn(`§l${nameTag}§r messageId ${id} @ ${locationStr}`, debugOn);
            if (!entity.hasTag('hungry')) {
                alertLog.warn(`§l${nameTag}§r is being forced to eat @ ${locationStr}`, debugOn);
                entity.addTag('hungry');
                setHungerChance(entity, 1, debugOn);
            }
            return;
        }
    }
    else if (typeId == watchFor.egg_typeId) {

        if (!nameTag && (watchFor.allowFakeNameTags || debugOn)) {
            nameTag = makeSpiderEggName();
            if (nameTag && entity.isValid) entity.nameTag = nameTag; else return;
        }
    }
    else if (typeId === watchFor.fly_typeId) {
        if (id === 'debugLogEvent:NewFly' && devDebug.watchEntityEvents) devDebug.dsb.increment('stats', 'newFlies');
        return;
    }
    else if (typeId === watchFor.firefly_typeId) {
        if (id === 'debugLogEvent:NewFireFly' && debugOn) devDebug.dsb.increment('stats', 'newFireflies');
        return;
    }

    if (!id) return; //This should not happen... but just in case
    //check hunger tag TODO: make babies eat too....
    clearBadHungerIndicators(entity);

    //Main Events
    if (id.startsWith('mainEvent')) {

        if (id === `mainEvent:enterWeb`) { Web.enterWeb(entity, message == 'baby' ? true : false); return; }
        if (id === `mainEvent:expandWeb`) { Web.expandWeb(entity); return; }
        if (id === `mainEvent:placeWeb`) { Web.placeWeb(entity); return; }
        if (id === `mainEvent:newEgg`) { newEgg(entity); return; }
        if (id === `mainEvent:layEgg`) { DynamicPropertyLib.addNumber(entity, entityDynamicVars.eggsLaid, 1); return; }
        if (id === `mainEvent:eatFireflies`) {
            alertLog.log(`§l${nameTag}§r §aFound a Firefly Bush§r @ ${locationStr}`, devDebug.watchEntityEating);
            fireFlyFood(entity);
            return;
        }

        if (id == ('mainEvent:hungryEnd')) {
            alertLog.warn(`§l${nameTag} §cCould not find food before daybreak§r @ ${locationStr}`, devDebug.watchEntityEating);
            if (entity.isValid) {
                const triggerEvent = entity.hasComponent('is_baby') ? entityScriptEvents.baby_lookForWebEventName : entityScriptEvents.lookForWebEventName;
                entity.triggerEvent(triggerEvent);
            }
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

        alertLog.log(`§5Other (${id}:${message}) for ${nameTag}  @ ${locationStr}`, devDebug.watchEntityGoals);
        return;
    }//subEvent

    //---------------------------------------------------
    //Create hungry spiders if not in main/sub goals above
    //---------------------------------------------------
    if (id.startsWith('lookEvent:wander')) {
        if (entity.typeId == watchFor.spider_typeId) {
            const hourOfDay = getWorldTime().hours;
            if (hourOfDay <= 5 || hourOfDay >= 18)
                if (!entity.hasTag('hungry'))
                    if (!entity.hasTag('satiated'))
                        setHungerChance(entity, watchFor.hungryChance(), devDebug.watchEntityEating);
        }
        alertLog.log(`§l${nameTag}§r is wandering around) @ ${locationStr} `, devDebug.watchEntityEvents);
        return;
    }
    //----------------------
    if (!debugOn) return;
    if (!entity.isValid) return; // yeah they do become invalid in the middle of things and cause an error
    //----------------------    

    //other look for events
    if (id.startsWith('lookEvent')) {
        alertLog.log(`§l${nameTag}§r is looking for ${message}) @ ${locationStr} `, devDebug.watchEntityEvents);
        return;
    }

    if (id.startsWith('debugLogEvent')) {
        if (id === 'debugLogEvent:NewEntity') {
            if (message == 'born') {
                DynamicPropertyLib.increment(entity, entityDynamicVars.entityBorn);
                devDebug.dsb.increment('stats', 'born');
                alertLog.log(`§bNew Baby Born§r in Biome ${dimension.getBiome(location).id}: §l${nameTag}§r§6  @ ${locationStr}`, devDebug.watchEntityEvents || devDebug.watchEntityGoals);
                return;
            }

            if (message == 'spawned') {
                DynamicPropertyLib.increment(entity, entityDynamicVars.entitySpawns);
                devDebug.dsb.increment('stats', 'spawned');
                alertLog.log(`§aNew Adult Spawned§r in Biome ${dimension.getBiome(location).id}: §l${nameTag}§r§6  @ ${locationStr} - scriptEventReceive ()`, devDebug.watchEntityEvents || devDebug.watchEntityGoals);
                return;
            }
        }

        if (message === 'puberty') {
            devDebug.dsb.increment('stats', 'grewUp');
            if (devDebug.watchEntityEvents) {
                alertLog.log(`§l${nameTag}§r §bGrew Up @ ${locationStr}`);
            }
            return;
        }
    }

    if (id.startsWith('alertEvent')) {
        if (message == 'despawn_me') {
            alertLog.warn(`§l${nameTag}§r is running event despawn_me @ ${locationStr}`, debugOn);
            return;
        }

        if (message == 'replace_me') {
            alertLog.warn(`§l${nameTag}§r is running event replace_me @ ${locationStr}`, debugOn);
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
        alertLog.log(`§l${nameTag}§r says §v${message}§r @ ${locationStr}`, debugOn);
        return;
    }

    const note = `${nameTag} ${message} @ ${locationStr} (event)`;
    alertLog.error(`Unhandled Entity JSON Communication:\nId: ${id}\nMessage: ${note}`, debugOn);
    return;
}
//====================================================================
// End of File
//====================================================================