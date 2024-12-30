//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
import { system, Entity } from "@minecraft/server";
import { dev, chatLog, entityEvents, watchFor } from './settings.js';
import { setWebAndEnter, teleportAndCenter, webAdjacent, webRegister } from "./fn-stable.js";
import { Vector3Lib } from './common-stable/vectorClass.js';
import { blocksAround_locations } from './common-beta/blockVolumeLib-beta.js';
//===================================================================
/**
 * @summary Beta: dimension.getBlocks in blocksAround_locations
 * @param {Entity} entity 
 * @param {boolean} isBaby 
 */
export function enterWeb (entity, isBaby = false) {
    //Beta for dimension.getBlocks in blocksAround_locations
    const { dimension, location } = entity;
    const inBlock = dimension.getBlock(location);
    chatLog.log(`§d*enterWeb (${entity.nameTag || entity.id}) @ ${Vector3Lib.toString(location)} ${inBlock ? 'inBlock: ' + inBlock.typeId : ''}`, dev.debugEntityActivity);

    if (inBlock && inBlock.typeId == watchFor.home_typeId) {
        system.run(() => {
            chatLog.success(`§b${entity.nameTag || entity.id} Already in Web @ ${Vector3Lib.toString(location, 0, true)} - enterWeb()`, dev.debugEntityAlert);
            entity.teleport(inBlock.center());
            isBaby ? entity.triggerEvent('baby_stay_in_web_start') : entity.triggerEvent(entityEvents.stayInWebEventName);
        });
        return true;
    }

    const blockLocations = blocksAround_locations(dimension, location, 2, { includeTypes: [ watchFor.home_typeId ] }, false);
    if (blockLocations.length === 0) {
        system.run(() => {
            isBaby ? entity.triggerEvent('baby_wander_around_start') : entity.triggerEvent(entityEvents.wanderEventName);
        });
        return false;
    }

    const which = isBaby ? 0 : Math.trunc(blockLocations.length / 2);

    system.run(() => {
        webRegister(entity);
        if (dev.debugEntityActivity) {
            chatLog.success(`§b${entity.nameTag || entity.id} Entered Web @ ${Vector3Lib.toString(blockLocations[ which ], 0, true)}`, dev.debugEntityActivity);
            //dev.debugScoreboard?.addScore('enteredWeb', 1);
        }
        teleportAndCenter(entity, blockLocations[ which ]);
        isBaby ? entity.triggerEvent('baby_stay_in_web_start') : entity.triggerEvent(entityEvents.stayInWebEventName);
    });

    return true;
}
//===================================================================
/**
 * @summary Beta: dimension.getBlocks in blocksAround_locations
 * @param {Entity} entity 
 */
export function expandWeb (entity) {
    const { dimension, location } = entity;
    const inBlock = dimension.getBlock(location);
    chatLog.log(`§d*expandWeb (${entity.nameTag || entity.id}) @ ${Vector3Lib.toString(location)} ${inBlock ? 'inBlock: ' + inBlock.typeId : ''}`, dev.debugEntityActivity);

    if (inBlock && inBlock.typeId != watchFor.home_typeId) {
        system.run(() => {
            entity.triggerEvent(entityEvents.wanderEventName);
        });
        return false;
    }

    let blockLocations = blocksAround_locations(dimension, location, 1, { includeTypes: [ "minecraft:air" ] }, true);
    if (blockLocations.length === 0) {
        blockLocations = blocksAround_locations(dimension, location, 2, { includeTypes: [ "minecraft:air" ] }, true);
        if (blockLocations.length === 0) {
            blockLocations = blocksAround_locations(dimension, location, 3, { includeTypes: [ "minecraft:air" ] }, true);
        };
        if (blockLocations.length === 0) {
            system.run(() => {
                entity.triggerEvent(entityEvents.wanderEventName);
            });
            return false;
        }
    };

    const success = blockLocations.some(newLocation => {
        const block = dimension.getBlock(newLocation);

        if (block && webAdjacent(block)) {
            chatLog.success(`§e${entity.nameTag || entity.id} Expanded Web @ ${Vector3Lib.toString(newLocation, 0, true)}`, dev.debugEntityActivity);
            setWebAndEnter(entity, newLocation, 'expandWeb');
            return true;
        }

        return false;
    });

    if (!success) {
        //register anyway then go wander
        system.runTimeout(() => {
            webRegister(entity);
            entity.triggerEvent(entityEvents.wanderEventName);
        }, 1);
    }
}
//===================================================================
/**
 * @summary Beta: dimension.findClosestBiome
 * @param {Entity} entity
 * @returns {string | undefined}
 */

//===================================================================
