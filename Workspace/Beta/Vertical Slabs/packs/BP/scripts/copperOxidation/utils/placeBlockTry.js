//@ts-check
//========================================================================
// Mine
//========================================================================
import { BlockComponentPlayerInteractEvent, Player, Block, ContainerSlot } from "@minecraft/server";
//========================================================================

/**
     * 
     * @param {BlockComponentPlayerInteractEvent} event 
     * @param {ContainerSlot} mainhand 
     * @returns 
*/
export function placeBlockEventHandler (event, mainhand) {
    const { player, block, dimension, face, faceLocation } = event;

    if (!player) return;
    if (!block || !block.isValid()) return;
    if (!mainhand.hasItem()) return;

    

}
