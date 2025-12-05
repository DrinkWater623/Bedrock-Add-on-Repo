//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
import { Direction, world } from "@minecraft/server";
import { FaceLocationGrid, Vector2Lib, rotationToCardinalDirection} from "./common-stable/tools/vectorClass.js";
import { alertLog, chatLog, dev, pack, watchFor } from './settings.js';
import { placeDw623Slab } from "./fn-stable.js";
import { mcNameSpace } from "./common-data/globalConstantsLib.js";
//=============================================================================
export function beforeEvents_playerPlaceBlock_subscribe () {
    //This event is still beta as of 1.21.50
    alertLog.success('Subscribing to§r world.beforeEvents.playerPlaceBlock - §6Beta', dev.debugSubscriptions);

    world.beforeEvents.playerPlaceBlock.subscribe((event) => {
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
        const playerFacing = rotationToCardinalDirection(event.player.getRotation().y)
        if (playerFacing==event.face.toLowerCase())
            return
        
        const faceLocationInfo = new FaceLocationGrid(event.faceLocation, event.face);
        const grid = faceLocationInfo.grid(3);

        // Keep as dead center or if they are sneaking and y=1
        if (grid.y == 1 || event.player.isSneaking) {
            chatLog.log('Placing Vertically', dev.debugSlabPlaceEvents);
            event.cancel = true;
            const newSlabId = blockTypeId.replace(mcNameSpace, pack.packNameSpace + 'vertical_');
            placeDw623Slab(event.block, newSlabId, event.face.toLowerCase(), true,'',blockTypeId);
        }
        else chatLog.log(`not right face location ${Vector2Lib.toString(grid,0,true)}`, dev.debugSlabPlaceEvents);
    });
}
//=============================================================================
// End of File
//=============================================================================