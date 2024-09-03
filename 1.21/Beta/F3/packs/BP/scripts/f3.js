//@ts-check
import {
    world,
    // system,
    // Block,
    // ItemStack,
    Player,
    PlayerInteractWithBlockBeforeEvent,
    PlayerInteractWithBlockAfterEvent,
    PlayerBreakBlockBeforeEvent,
    PlayerBreakBlockAfterEvent
} from "@minecraft/server";
import { Vector3Lib as vec3 } from './commonLib/vectorClass.js';
import { Debug } from './commonLib/mcDebugClass.js';
//==============================================================================
const debug = new Debug("F3", true, world);
export const toggles = {
    //Player Interact With Block
    piwb_b4: false,
    piwb_aft: false,
    //Player Break Block
    pbb_b4: false,
    pbb_aft: false,
    //Player Place Block
    ppb_b4: false, //beta

    //Player Interact With Entity
    piwe_b4: false
};
//==================================================================
//==================================================================
/**
 * 
 * @param {Player} player 
 */
function playerF3Initialize (player) {
    //@ts-ignore
    if (!player.f3) player.f3 = new Map();
}
//==================================================================
/**
 * @param { Player } player 
 * @param { string } mapKey 
 * @param { object } mapObject 
 */
export function playerF3Add (player, mapKey, mapObject) {
    if (player.isValid()) {

        playerF3Initialize(player);

        //@ts-ignore
        player.f3.set(mapKey, mapObject);
    }
}
//==================================================================
/**
 * @param { Player } player 
 * @param { string } mapKey F3 Map Key
 * @returns {object} F3 map Object
 */
export function playerF3Get (player, mapKey) {
    if (player.isValid()) {
        playerF3Initialize(player);
        //@ts-ignore
        if (player.f3.has(mapKey)) return player.f3.get(mapKey, mapObject);
    }
    return {};
}
//==================================================================
/**
 * @param { Player } player 
 * @param { string } mapKey F3 Map Key
 * @returns {object} F3 map Object
 */
export function playerF3Show (player, mapKey) {
    const f3_info = playerF3Get(player, mapKey);
    if (!f3_info) {
        world.sendMessage(`no f3 info: ${mapKey}`);
        return;
    }

    debug.listObjectInnards(f3_info, world, mapKey, true);
}
//==================================================================
/**
 * 
 * @param {PlayerInteractWithBlockBeforeEvent | PlayerInteractWithBlockAfterEvent} event 
 */
export function playerInteractWithBlock_save (event) {
    const { player, block, blockFace, faceLocation, itemStack } = event;

    if (player.isValid() && block.isValid()) {

        playerF3Add(player, 'last_playerInteractWithBlock',
            {
                block: block,
                blockFace: blockFace,
                faceLocation: vec3.round(faceLocation, 1),
                vectorDelta: vec3.delta(faceLocation, block.center(), 1), //where on block (out from center)
                itemUsed: itemStack?.typeId
            });
    }
}
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
