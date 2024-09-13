//@ts-check
import { system, Entity } from "@minecraft/server";
import { BlockLib as BlockLib } from './commonLib/blockClass.js'; //beta parts used
import { ScoreboardLib } from "./commonLib/scoreboardClass.js";
import { Vector3Lib } from './commonLib/vectorClass.js';
import { dev, chatLog } from './settings.js';
import { setWebAndEnter, teleportAndCenter } from "./fn-stable.js";
//===================================================================
/**
 * 
 * @param {Entity} entity 
 */
export function enterWeb (entity) {
    const dimension = entity.dimension;
    const inBlock = dimension.getBlock(entity.location);
    //chatLog.log(`§a*enterWeb() @ ${Vector3Lib.toString(entity.location)} ${inBlock ? 'inBlock: ' + inBlock.typeId : ''}`, dev.debugEntityAlert);

    if (!inBlock) { chatLog.error('Cannot NOT be in a block, even air', dev.debugEntityAlert); return; }
    if (inBlock.typeId == 'minecraft:web') { system.run(()=>{entity.teleport(inBlock.center())}); return; }

    const blockLocations = BlockLib.blocksAround_locations(entity.dimension, entity.location, 2, { includeTypes: [ "minecraft:web" ] });
    if (blockLocations.length === 0) return;

    //for now just go into [0]
    chatLog.success('Entered Web', dev.debugEntityAlert);
    ScoreboardLib.add(dev.debugScoreboardName, 'enteredWeb', 1);
    system.runTimeout(() => { teleportAndCenter(entity, blockLocations[ Math.trunc(blockLocations.length / 2) ]); }, 1);
}
//===================================================================
/**
 * 
 * @param {Entity} entity 
 */
export function expandWeb (entity) {
    const dimension = entity.dimension;
    const inBlock = dimension.getBlock(entity.location);
    chatLog.log(`§a*expandWeb() @ ${Vector3Lib.toString(entity.location)} ${inBlock ? 'inBlock: ' + inBlock.typeId : ''}`, dev.debugEntityAlert);

    if (inBlock && inBlock.typeId != 'minecraft:web') return;

    let blockLocations = BlockLib.blocksAround_locations(entity.dimension, entity.location, 1, { includeTypes: [ "minecraft:air" ] });
    if (blockLocations.length === 0) {
        blockLocations = BlockLib.blocksAround_locations(entity.dimension, entity.location, 2, { includeTypes: [ "minecraft:air" ] });
        if (blockLocations.length === 0) {
            //FIXME: if up in tree - not out this far
            blockLocations = BlockLib.blocksAround_locations(entity.dimension, entity.location, 3, { includeTypes: [ "minecraft:air" ] });
        };
        if (blockLocations.length === 0) return;
    };

    chatLog.success(`Expanded Web @ ${Vector3Lib.toString(blockLocations[ 0 ], 0, true)}`, dev.debugEntityAlert);
    ScoreboardLib.add(dev.debugScoreboardName, 'expandWeb', 1);
    setWebAndEnter(entity, blockLocations[ 0 ]);
}
