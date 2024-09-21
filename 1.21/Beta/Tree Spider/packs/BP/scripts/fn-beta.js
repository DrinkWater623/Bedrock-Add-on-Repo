//@ts-check
import { system, Entity } from "@minecraft/server";
import { BlockLib as BlockLib } from './commonLib/blockClass.js'; //beta parts used
import { ScoreboardLib } from "./commonLib/scoreboardClass.js";
import { Vector3Lib } from './commonLib/vectorClass.js';
import { dev, chatLog, pack } from './settings.js';
import { setWebAndEnter, teleportAndCenter } from "./fn-stable.js";
//===================================================================
/**
 * 
 * @param {Entity} entity 
 * @param {boolean} isBaby 
 */
export function enterWeb (entity, isBaby = false) {
    const dimension = entity.dimension;
    const inBlock = dimension.getBlock(entity.location);

    if (!inBlock) { chatLog.error('Cannot NOT be in a block, even air', dev.debugEntityActivity); return; }
    if (inBlock.typeId == 'minecraft:web') { system.run(() => { entity.teleport(inBlock.center()); }); return; }

    const blockLocations = BlockLib.blocksAround_locations(entity.dimension, entity.location, 2, { includeTypes: [ "minecraft:web" ] }, false);
    if (blockLocations.length === 0) return;

    entity.setDynamicProperty(pack.lastWebActivityTick, system.currentTick);
    const which = isBaby ? 0 : Math.trunc(blockLocations.length / 2);
    const sb = isBaby ? dev.debugBabyScoreboard : dev.debugScoreboard;
    const activityLog = isBaby ? dev.debugBabyActivity : dev.debugEntityActivity;

    system.runTimeout(() => {
        if (activityLog) {
            chatLog.success('Entered Web', true);
            sb?.addScore('enteredWeb', 1);
        }
        teleportAndCenter(entity, blockLocations[ which ]);
    }, 1);
}
//===================================================================
/**
 * 
 * @param {Entity} entity 
 */
export function expandWeb (entity) {
    const dimension = entity.dimension;
    const inBlock = dimension.getBlock(entity.location);
    chatLog.log(`§a*expandWeb() @ ${Vector3Lib.toString(entity.location)} ${inBlock ? 'inBlock: ' + inBlock.typeId : ''}`, dev.debugEntityActivity);

    if (inBlock && inBlock.typeId != 'minecraft:web') return;

    let blockLocations = BlockLib.blocksAround_locations(entity.dimension, entity.location, 1, { includeTypes: [ "minecraft:air" ] }, true);
    if (blockLocations.length === 0) {
        blockLocations = BlockLib.blocksAround_locations(entity.dimension, entity.location, 2, { includeTypes: [ "minecraft:air" ] }, true);
        // if (blockLocations.length === 0) {
        //      //FIXME: if up in tree - not out this far
        //      blockLocations = BlockLib.blocksAround_locations(entity.dimension, entity.location, 3, { includeTypes: [ "minecraft:air" ] },true);
        //  };
        if (blockLocations.length === 0) return;
    };

    chatLog.success(`Expanded Web @ ${Vector3Lib.toString(blockLocations[ 0 ], 0, true)}`, dev.debugEntityActivity);
    setWebAndEnter(entity, blockLocations[ 0 ], 'expandWeb');
}
