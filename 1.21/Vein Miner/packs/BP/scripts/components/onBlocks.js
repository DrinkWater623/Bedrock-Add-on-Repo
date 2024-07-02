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
/*
export function mimicOnBlockMined_wand_test_og_item_use_b4 (event) {
    //ctd:wand_test_og_item_use_b4
    if (!(event instanceof PlayerBreakBlockBeforeEvent)) return;
    const bug = new McDebug(true, event.player);

    //I there a target
    if (bug.debugOn) {        
        bug.log("§d* PlayerBreakBlockBeforeEvent - Custom tool");
        bug.itemInfo(event.itemStack, event.player,"§bItem Info:");
        bug.blockInfo(event.block, event.player,"§6Block Info:");
    }
}
export function mimicOnBlockMined_Axe (event) {
    if (!(event instanceof PlayerBreakBlockBeforeEvent)) return;
    const bug = new McDebug(true, event.player);

    //I there a target
    if (bug.debugOn) {
        bug.log("§d* PlayerBreakBlockBeforeEvent - Axe");
        bug.itemInfo(event.itemStack,event.player,"§bItem Info");
        bug.blockInfo(event.block, event.player,"§6Block Info");
    }
}
export function onPlayerInteractWithBlock (event) {
    if (!(event instanceof PlayerInteractWithBlockAfterEvent)) return;
    const bug = new McDebug(true, event.player);

    bug.log(`§c* PlayerInteractWithBlockAfterEvent`);
    bug.blockInfo(event.block,event.player,"§dInteracted Block Info")

}
    */