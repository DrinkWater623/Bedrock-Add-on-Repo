//@ts-check
import {  ContainerSlot, GameMode, Player } from "@minecraft/server";

/** @returns Whether the item stack was successfully decremented. */
/**
 * 
 * @param {Player} player 
 * @param {ContainerSlot} slot 
 * @param {*} options 
 * @returns 
 */
export function decrementStack (player, slot, options={ ignoreGameMode: false }) {
    if (!options?.ignoreGameMode && player.getGameMode() === GameMode.creative)
        return false;

    if (slot.amount > 1) slot.amount--;
    else slot.setItem(undefined);

    return true;
}
