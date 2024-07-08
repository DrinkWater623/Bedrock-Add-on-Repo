//from Minecraft
import { system, Player, Block, BlockPermutation, PlayerBreakBlockBeforeEvent, PlayerInteractWithBlockAfterEvent } from "@minecraft/server";
//from code
import { McDebug } from '../library/McDebug.js';
//Start
export function ctd_placeEntityTest (block, minedBlockPermutation, player) {
    if (!(block instanceof Block)) return;
    if (!(player instanceof Player)) return;
    if (!(minedBlockPermutation instanceof BlockPermutation)) return;

    const bug = new McDebug(true, player);
    if (bug.debugOn) {

        //now we know the block info is just for air - so no need to see for our purposes
        // bug.log("§6Block Info")
        // b.blockInfo(block, player);
        bug.blockPermutationInfo(minedBlockPermutation, player,"§a" + "minedBlockPermutation Info");
    }   
    let cmd = `summon ctd:test_minion.50 ${block.center().x} ${block.center().y} ${block.center().z} 0 0 minecraft:entity_spawned ctd`;
    system.run(() => {
        player.dimension.runCommand(cmd);
    });
}
