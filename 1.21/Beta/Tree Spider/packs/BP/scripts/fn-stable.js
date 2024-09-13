//@ts-check
import { Entity, system } from "@minecraft/server";
import { dev, chatLog } from './settings.js';
import { Vector3Lib } from './commonLib/vectorClass.js';
import { ScoreboardLib } from "./commonLib/scoreboardClass.js";
//==============================================================================
/**
 * 
 * @param {Entity} entity 
 */
export function placeWeb (entity) {
    //this cannot be called unless spider is next to a target block, so place in air if cannot determine
    const dimension = entity.dimension;
    const inBlock = dimension.getBlock(entity.location);
    chatLog.log(`§a*placeWeb() @ ${Vector3Lib.toString(entity.location)} ${inBlock ? 'inBlock: ' + inBlock.typeId : ''}`, dev.debugEntityAlert);

    if (!inBlock) {
        chatLog.error('Cannot NOT be in a block, even air', dev.debugEntityAlert);
        return;
    }

    if (inBlock.typeId == 'minecraft:web') {
        //chatLog.warn('Already inside a web - cannot place a web - consider expand instead', dev.debugEntityAlert);
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
        chatLog.success(`Placed Web @ ${Vector3Lib.toString(webLocationOffset, 0, true)}`, dev.debugEntityAlert);
        ScoreboardLib.add(dev.debugScoreboardName, 'placeWeb', 1);
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