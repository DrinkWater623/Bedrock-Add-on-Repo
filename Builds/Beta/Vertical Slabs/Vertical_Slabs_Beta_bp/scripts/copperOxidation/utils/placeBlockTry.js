//@ts-check
//========================================================================
// Mine
//========================================================================
import { BlockComponentPlayerInteractEvent, Player, Block, ContainerSlot, world } from "@minecraft/server";
import { getAdjacentBlock } from "../../common-stable/blockLib-stable";
import { Vector3Lib } from "../../common-stable/tools/vectorClass";
import { airBlock } from "../../common-data/globalConstantsLib";
//========================================================================

/**
     * 
     * @param {BlockComponentPlayerInteractEvent} event 
     * @param {ContainerSlot} mainhand 
     * @returns 
*/
export function placeBlockEventHandler (event, mainhand) {

    return;

    // may have to move all of the custom component for Interaction to the main one
    // else I have to write all the sound and block place events for EVERY F'N Block
    /*
    const { player, block, dimension, face, faceLocation } = event;

    if (!player) return;
    if (!block || !block.isValid()) return;
    if (!mainhand.hasItem()) return;

    const x = getAdjacentBlock(block, face);
    if (!x || x.typeId != airBlock) return;    

    try {
        x.setType(mainhand.typeId);
    }
    catch { }
    */
}
