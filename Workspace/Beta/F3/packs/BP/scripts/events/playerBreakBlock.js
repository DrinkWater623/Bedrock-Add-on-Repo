//@ts-check
import {
    world,
    PlayerBreakBlockBeforeEvent,
    PlayerBreakBlockAfterEvent
} from "@minecraft/server";
import { Debug } from '../common-stable/mcDebugClass.js';
import {  toggles } from "../settings.js";
//==============================================================================
const debug = new Debug("F3", true, world);
//==================================================================
//==================================================================
/**
 * @param {PlayerBreakBlockBeforeEvent} event 
 */
export function playerBreakBlock_before_show (event) {

    if (toggles.pbb_b4 && event.player.isValid()) {
        const { block, player, itemStack } = event;

        debug.log('\n\n§a*****  Player Break Block Before Event  *****\n');
        //block info includes permutation and tags
        debug.blockInfo(block, world, "\n§d* pbb_b4-Block Info", true);

        if (itemStack)
            debug.itemInfo(itemStack, world, "\n§d* pbb_b4-ItemStack used to break block", true);

        debug.playerInfo(player, world, "\n§d* pbb_b4-Player's View", true, 'view');
    }
};
//==============================================================================
/**
 * @param {PlayerBreakBlockAfterEvent} event 
 */
export function playerBreakBlock_after_show (event) {

    if (toggles.pbb_aft && event.player.isValid()) {
        const { block, brokenBlockPermutation, itemStackAfterBreak, itemStackBeforeBreak, player } = event;

        debug.log('\n\n§a*****  Player Break Block After Event  *****\n');
        debug.blockInfo(block, world, "§d* pbb_aft-Block Info", true);

        debug.blockPermutationInfo(brokenBlockPermutation, world, "\n§d* pbb_aft - Broken Block Permutation", true);

        if (player.getGameMode() != 'creative') {

            let isItem = true;

            if (itemStackBeforeBreak && itemStackAfterBreak)
                if (itemStackBeforeBreak.typeId == itemStackAfterBreak.typeId)
                    if (itemStackAfterBreak.getComponents().length == 0)
                        isItem = false;

            if (itemStackBeforeBreak && isItem)
                debug.itemInfo(itemStackBeforeBreak, world, "\n§d* pbb_aft-  ItemStack Used to Break Block Before Break", true);

            if (itemStackAfterBreak)
                debug.itemInfo(itemStackAfterBreak, world, "\n§d* pbb_aft - ItemStack Used to Break Block Break", true);
        }

        debug.playerInfo(player, world, "\n§d* pbb_aft - Player's View", true, 'view');
    }
}
//==============================================================================