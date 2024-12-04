//@ts-check
import {
    PlayerInteractWithBlockBeforeEvent,
    PlayerInteractWithBlockAfterEvent,
    system
} from "@minecraft/server";
import { Vector3Lib } from './commonLib/vectorClass.js';
import { playerF3Add, playerF3Show } from "./fn-stable.js";


//==============================================================================
/**
 * 
 * @param {PlayerInteractWithBlockBeforeEvent | PlayerInteractWithBlockAfterEvent} event 
 */
export function playerInteractWithBlock_save (event) {
    const { player, block, blockFace, faceLocation, itemStack, isFirstEvent } = event;

    if (isFirstEvent && player.isValid() && block.isValid()) {

        playerF3Add(player, 'last_playerInteractWithBlock',
            {
                block: block.typeId,
                blockFace: blockFace,
                blockCenter: Vector3Lib.toString(block.center(), 2, true),
                faceLocation: Vector3Lib.toString(faceLocation, 2, true),
                //where on block (out from center)
                vectorDelta: Vector3Lib.toString(Vector3Lib.delta(faceLocation, block.center(), 2),2,true),
                itemUsed: itemStack?.typeId
            },
            true);
        player.sendMessage('\n');
    }
}

/*
{   beforeOnPlayerPlace: e => {
                const info = angles.angleObject_get(e.player.getRotation().y);
                info.blockFace = e.face
                info.wall =  ["Down","Up"].includes(info.blockFace) ? false : true;
                info.permutation_id = input.id
                info.permutation_horizontal_half = 0;

                if (info.wall) {
                    info.permutation_id = 8

                    if (info.blockFace == info.opposite){
                        //default
                    }
                    else {
                        let blockFaceOpposite = angles.directionOpposite_get(info.blockFace);

                        if (blockFaceOpposite == info.veeringDirection) {  // 45 degrees
                        info.permutation_horizontal_half = info.veeringDirection == info.left45 ? -1 : 1;
                        }
                        else if (blockFaceOpposite == info.right90) { //90 degrees
                            info.horizontal_half = -1;
                        }
                        else if (blockFaceOpposite == info.left90) { //90 degrees
                            info.horizontal_half = 1;
                        }
                    }
                }

                e.player.sendMessage(`onBlockFace=${info.blockFace}`);
                e.player.sendMessage(`playerFacing ${playerFacingInfo}`);
        }}
*/
//==============================================================================