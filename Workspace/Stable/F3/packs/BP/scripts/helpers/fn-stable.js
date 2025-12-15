//@ts-check
import { world, Player } from "@minecraft/server";
import { alertLog } from "../settings.js";
//==============================================================================
const debug = new Debug("F3", true, world);
//==================================================================
//==================================================================
/**
 * 
 * @param {Player} player 
 */
export function playerF3Initialize (player) {
    //@ts-ignore
    if (!player.f3) {
        //@ts-ignore
        player.f3 = new Map();
        alertLog.success(`Player ${player.name} initialized with F3 Map Object`, dev.debugPlayerLoadSpawn);
    }
}
//==================================================================
/**
 * @param { Player } player 
 * @param { string } mapKey 
 * @param { object } mapObject 
 */
export function playerF3Add (player, mapKey, mapObject, show = false) {
    if (player.isValid()) {

        playerF3Initialize(player);

        //@ts-ignore
        player.f3.set(mapKey, mapObject);

        if (show) {
            debug.listObjectInnards(mapObject, player, mapKey, true);
        }
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
    player.sendMessage('\n\n');
    debug.listObjectInnards(f3_info, world, mapKey, true);
    player.sendMessage('\n\n');
}
//==============================================================================
/**
 * 
 * @param {Player} player 
 */
export function playerBlockViewShow (player) {
    const { x, y, z } = player.getHeadLocation();
    const blockRay =
        player.dimension.getBlockFromRay(
            { x, y: y + 0.1, z },
            player.getViewDirection(),
            { maxDistance: 16, includeLiquidBlocks: true, includePassableBlocks: true }
        );
    if (blockRay) {
        const { block, face, faceLocation } = blockRay;
        
    }
}