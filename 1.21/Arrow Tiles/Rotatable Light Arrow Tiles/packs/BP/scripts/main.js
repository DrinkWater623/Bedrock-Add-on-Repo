import { world, system } from '@minecraft/server';
import { DirectionInfo } from './direction_info.js';
import { McDebug } from './McDebug.js';

const bug = new McDebug(true);
//=============================================================================
const numOfDirections = 4;
const dirInfo = new DirectionInfo(numOfDirections);
//=============================================================================
world.beforeEvents.worldInitialize.subscribe((event) => {
    event.blockTypeRegistry.registerCustomComponent(
        "dw623:rotate_arrow_tile_components",
        {
            onPlayerInteract: e => {

                bug.log("\n\n\n\n\n",e.player)
                //bug.listArray(dirInfo.info,e.player)
                const currentPermutation = e.block.permutation;
                bug.log("§6Current Block States", e.player);
                bug.listBlockStates(currentPermutation, e.player);

                const staticStateBlockFace = currentPermutation.getState("minecraft:block_face"); //face of block arrow is on, not just touched
                //Get Players Facing
                const oldStatePlayerFacing = currentPermutation.getState("minecraft:cardinal_direction");
                const oldStateVerticalHalf = currentPermutation.getState("minecraft:vertical_half");

                // const faceLocation = e.faceLocation;
                // bug.log("§2Face Location", e.player);
                // bug.listObjectInnards(faceLocation, e.player);

                const newPlayerFacingDirInfo = dirInfo.angleObject_get(e.player?.getRotation().y);
                bug.log(`§bNew Player Facing Dir Info (${newPlayerFacingDirInfo.angle})§r:
                    ==> dir: ${newPlayerFacingDirInfo.direction} 
                    ==> left: ${newPlayerFacingDirInfo.left90}
                    ==> right: ${newPlayerFacingDirInfo.right90}
                    ==> opposite: ${newPlayerFacingDirInfo.opposite}`, e.player);


                let newBlockPermutation = {};

                if ([ "down", "up" ].includes(staticStateBlockFace)) {
                    bug.log("§dArrow is Up/Down", e.player);

                    //simple - turn cardinal direction state                    
                    if (oldStatePlayerFacing === newPlayerFacingDirInfo.direction.toLowerCase()) return; //no change
                    newBlockPermutation = currentPermutation.withState("minecraft:cardinal_direction", newPlayerFacingDirInfo.direction.toLowerCase());
                    //TODO: add for opposite side arrow touch
                }
                else {
                    //TODO: make work when player is on other side, since block can be removed

                    bug.log("Arrow is on a wall", e.player);

                    const newArrowFaceTouched = e.face;
                    bug.log(`§aArrow Face Touched: ${newArrowFaceTouched}`, e.player);

                    //block in on wall, so different logic 
                    const staticBlockFaceDirInfo = dirInfo.directionOject_get(staticStateBlockFace);
                    bug.log(`§cStatic Block Face Dir Info (${staticBlockFaceDirInfo.angle})§r:
                        ==> dir: ${staticBlockFaceDirInfo.direction} 
                        ==> left: ${staticBlockFaceDirInfo.left90}
                        ==> right: ${staticBlockFaceDirInfo.right90}
                        ==> opposite: ${staticBlockFaceDirInfo.opposite}`, e.player);

                    const oldPlayerFacingDirInfo = dirInfo.directionOject_get(oldStatePlayerFacing);
                    bug.log(`§bOld Player Facing Dir Info (${oldPlayerFacingDirInfo.angle})§r:
                        ==> dir: ${oldPlayerFacingDirInfo.direction} 
                        ==> left: ${oldPlayerFacingDirInfo.left90}
                        ==> right: ${oldPlayerFacingDirInfo.right90}
                        ==> opposite: ${oldPlayerFacingDirInfo.opposite}`, e.player);

                    /**
                     *      staticBlockFaceDirInfo.direction, // behind block
                            staticBlockFaceDirInfo.opposite   // in front of block
                     */
                    //top
                    if (newArrowFaceTouched === "Up") {
                        newBlockPermutation = currentPermutation
                            .withState("minecraft:vertical_half", "top")
                            .withState("minecraft:cardinal_direction", staticBlockFaceDirInfo.opposite.toLowerCase());
                    }
                    //bottom
                    else if (newArrowFaceTouched === "Down") {
                        newBlockPermutation = currentPermutation
                            .withState("minecraft:vertical_half", "bottom")
                            .withState("minecraft:cardinal_direction", staticBlockFaceDirInfo.opposite.toLowerCase());
                    }
                    //sides
                    else if ([ staticBlockFaceDirInfo.left90, staticBlockFaceDirInfo.right90 ].includes(newArrowFaceTouched)) {
                        newBlockPermutation = currentPermutation.withState("minecraft:cardinal_direction", newArrowFaceTouched.toLowerCase());
                    }
                    //front/back
                    else {
                        if ([ oldPlayerFacingDirInfo.direction, oldPlayerFacingDirInfo.opposite ].includes(newPlayerFacingDirInfo.direction)) {
                            bug.log("§dFacing same wayish as before",e.player)

                            if ([ staticBlockFaceDirInfo.direction, staticBlockFaceDirInfo.opposite ].includes(newPlayerFacingDirInfo.direction)) {
                                bug.log("§dFacing Block as before",e.player)
                                //flip vertical half for 2D up(north)/down(south)
                                newBlockPermutation = currentPermutation.withState("minecraft:vertical_half", oldStateVerticalHalf === "top" ? "bottom" : "top");
                            }
                            else if(oldPlayerFacingDirInfo.direction === newPlayerFacingDirInfo.opposite){
                                // flip right/left
                                bug.log("§dFacing Opposite Sideways",e.player)
                                newBlockPermutation = currentPermutation.withState("minecraft:cardinal_direction", newPlayerFacingDirInfo.direction.toLowerCase());
                            }
                            else {
                                bug.log("§c No Change",e.player);
                                return;
                            }
                        }
                        else {
                            // 90 degree turned

                            //am I facing block now?
                            if ([ staticBlockFaceDirInfo.direction, staticBlockFaceDirInfo.opposite ].includes(newPlayerFacingDirInfo.direction)) {
                                bug.log("§dFacing Block now",e.player)
                                //change to facing block and up/down will adjust to what the vertical half was when placed
                                newBlockPermutation = currentPermutation.withState("minecraft:cardinal_direction", staticBlockFaceDirInfo.opposite.toLowerCase());
                            }
                            else {
                                bug.log("§dNot Facing Block now",e.player)
                                newBlockPermutation = currentPermutation.withState("minecraft:cardinal_direction", newPlayerFacingDirInfo.direction.toLowerCase());
                            }
                        }
                    }           
                }

                bug.log("§gProposed Block States:", e.player);
                bug.listBlockStates(newBlockPermutation, e.player);
                e.block.setPermutation(newBlockPermutation);
                bug.log("§aNew Block States:", e.player);
                bug.listBlockStates(e.block.permutation, e.player);
            }
        }
    );
});
//=============================================================================