//from Minecraft
import { ItemUseBeforeEvent } from "@minecraft/server";
//from code
import { McDebug } from '../library/McDebug.js';
//State
// export function mimicOnItemUse_wand_test_og_item_use_b4 (event) {
//     //ctd:wand_test_og_item_use_b4
//     if (!(event instanceof ItemUseBeforeEvent)) return;
//     const bug = new McDebug(true, player);

//     const player = event.source;
//     //I there a target
//     if (player.target?.typeId) {
//         bug.log(`target typeId: ${player.target.typeId}`);
//     }
//     else {
//         //What is player looking at?
//         const blockHit = player.getBlockFromViewDirection({ maxDistance: 7 });
//         if (blockHit.block) {
//             bug.log("* ItemUseBeforeEvent - Custom tool");
//             bug.blockInfo(blockHit.block, player,"§6Block-Hit Info");
//         }
//     }
// }