import { world,Player } from '@minecraft/server';
import { DirectionInfo } from './modules/dir.mjs'

const angles = new DirectionInfo();

world.beforeEvents.worldInitialize.subscribe((event) => {
    event.blockComponentRegistry.registerCustomComponent(
        "dw623:arrow_tile_8_onPlayerPlace", 
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
    )
})
//world.beforeEvents.playerPlaceBlock.subscribe(callback)
