//@ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20250116 - reOrg
========================================================================*/
import { Direction, PlayerPlaceBlockBeforeEvent } from "@minecraft/server";
import { FaceLocationGrid, Vector2Lib, rotationToCardinalDirection } from "../common-stable/vectorClass.js";
import { chatLog, dev, pack, watchFor } from '../settings.js';
import { placeDw623Slab } from "../fn-stable.js";
import { mcNameSpace } from "../common-data/globalConstantsLib.js";
//=============================================================================
/**
 * 
 * @param {PlayerPlaceBlockBeforeEvent} event 
 * @returns 
 */
export function beforeEvents_playerPlaceBlock (event) {

    //Note: If I turn this into playerInteract... have to get block in front

    const blockTypeId = event.permutationBeingPlaced.type.id;
    if (!watchFor.vanillaSlabs.includes(blockTypeId)) {
        chatLog.log('not a slab', dev.debugSlabPlaceEvents);
        return;
    }

    //check face
    if (![ Direction.North, Direction.South, Direction.East, Direction.West ].includes(event.face)) {
        chatLog.log('not right face', dev.debugSlabPlaceEvents);
        return;
    }

    //anomaly... if player is facing same way as face... it is an air place.. DO NOT PROCEED - THEY WILL KILL ME
    const playerFacing = rotationToCardinalDirection(event.player.getRotation().y);
    if (playerFacing == event.face.toLowerCase())
        return;

    const faceLocationInfo = new FaceLocationGrid(event.faceLocation, event.face);
    const grid = faceLocationInfo.grid(3);

    // Keep as dead center or if they are sneaking and y=1
    if (grid.y == 1 || event.player.isSneaking) {
        chatLog.log('Placing Vertically', dev.debugSlabPlaceEvents);
        event.cancel = true;
        const newSlabId = blockTypeId.replace(mcNameSpace, pack.packNameSpace + 'vertical_');
        placeDw623Slab(event.block, newSlabId, event.face.toLowerCase(), true, '', blockTypeId);
    }
    else chatLog.log(`not right face location ${Vector2Lib.toString(grid, 0, true)}`, dev.debugSlabPlaceEvents);

}
//=============================================================================
// End of File
//=============================================================================