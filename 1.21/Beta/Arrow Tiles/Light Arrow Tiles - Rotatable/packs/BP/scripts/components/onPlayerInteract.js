//import { world } from '@minecraft/server';
import { DirectionInfo } from '../library/direction_info.js';
import { McDebug } from '../library/McDebug.js';

/**
 * Rotation is still influenced by which way the player is facing
 * to keep it more vanilla
 * 
 * another option would just be to have it rotate in a clockwise 
 * regardless of where player is facing
 */
//=============================================================================
const numOfDirections = 4;
const dirInfo = new DirectionInfo(numOfDirections);
//=============================================================================
export function rotateOnPlayerFacing (event) {
    const bug = new McDebug(false);
    //bug.log("\n\n\n\n\n", event.player);
    //bug.listArray(dirInfo.info,e.player)
    const currentPermutation = event.block.permutation;
    bug.log("§6Current Block States", event.player);
    bug.listBlockStates(currentPermutation, event.player);

    const staticStateBlockFace = currentPermutation.getState("minecraft:block_face"); //face of block arrow is on, not just touched
    const oldStatePlayerFacing = currentPermutation.getState("minecraft:cardinal_direction");
    const oldStateVerticalHalf = currentPermutation.getState("minecraft:vertical_half");

    // const faceLocation = e.faceLocation;  Not useful
    // bug.log("§2Face Location", e.player);
    // bug.listObjectInnards(faceLocation, e.player);

    const newPlayerFacingDirInfo = dirInfo.angleObject_get(event.player?.getRotation().y);
    //bug.log(`§bNew Player Facing Dir Info (${newPlayerFacingDirInfo.angle})§r:`
    //    + `\n==> dir: ${newPlayerFacingDirInfo.direction}`
    //    + `\n==> left: ${newPlayerFacingDirInfo.left90}`
    //    + `\n==> right: ${newPlayerFacingDirInfo.right90}`
    //    + `\n==> opposite: ${newPlayerFacingDirInfo.opposite}`, event.player);


    let newBlockPermutation = {};

    if ([ "down", "up" ].includes(staticStateBlockFace)) {
        //bug.log("§dArrow is Up/Down", event.player);

        //simple - turn cardinal direction state                    
        if (oldStatePlayerFacing === newPlayerFacingDirInfo.direction.toLowerCase()) return; //no change
        newBlockPermutation = currentPermutation.withState("minecraft:cardinal_direction", newPlayerFacingDirInfo.direction.toLowerCase());
    }
    else {
        bug.log("Arrow is on a wall", event.player);

        const newArrowFaceTouched = event.face;
        //bug.log(`§aArrow Face Touched: ${newArrowFaceTouched}`, event.player);

        //block in on wall, so different logic 
        const staticBlockFaceDirInfo = dirInfo.directionOject_get(staticStateBlockFace);
        //bug.log(`§cStatic Block Face Dir Info (${staticBlockFaceDirInfo.angle})§r:`
        //    + `\n==> dir: ${staticBlockFaceDirInfo.direction}`
        //    + `\n==> left: ${staticBlockFaceDirInfo.left90}`
        //    + `\n==> right: ${staticBlockFaceDirInfo.right90}`
        //    + `\n==> opposite: ${staticBlockFaceDirInfo.opposite}`, event.player);

        const oldPlayerFacingDirInfo = dirInfo.directionOject_get(oldStatePlayerFacing);
        //bug.log(`§bOld Player Facing Dir Info (${oldPlayerFacingDirInfo.angle})§r:`
        //    + `\n==> dir: ${oldPlayerFacingDirInfo.direction}`
        //    + `\n==> left: ${oldPlayerFacingDirInfo.left90}`
        //    + `\n==> right: ${oldPlayerFacingDirInfo.right90}`
        //    + `\n==> opposite: ${oldPlayerFacingDirInfo.opposite}`, event.player);

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
                //bug.log("§dFacing same wayish as before", event.player);

                if ([ staticBlockFaceDirInfo.direction, staticBlockFaceDirInfo.opposite ].includes(newPlayerFacingDirInfo.direction)) {
                    //bug.log("§dFacing Block as before", event.player);
                    //flip vertical half for 2D up(north)/down(south)
                    newBlockPermutation = currentPermutation.withState("minecraft:vertical_half", oldStateVerticalHalf === "top" ? "bottom" : "top");
                }
                else if (oldPlayerFacingDirInfo.direction === newPlayerFacingDirInfo.opposite) {
                    // flip right/left
                    //bug.log("§dFacing Opposite Sideways", event.player);
                    newBlockPermutation = currentPermutation.withState("minecraft:cardinal_direction", newPlayerFacingDirInfo.direction.toLowerCase());
                }
                else {
                    //bug.log("§c No Change", event.player);
                    return;
                }
            }
            else {
                // 90 degree turned

                //am I facing block now?
                if ([ staticBlockFaceDirInfo.direction, staticBlockFaceDirInfo.opposite ].includes(newPlayerFacingDirInfo.direction)) {
                    //bug.log("§dFacing Block now", event.player);
                    //change to facing block and up/down will adjust to what the vertical half was when placed
                    newBlockPermutation = currentPermutation.withState("minecraft:cardinal_direction", staticBlockFaceDirInfo.opposite.toLowerCase());
                }
                else {
                    //bug.log("§dNot Facing Block now", event.player);
                    newBlockPermutation = currentPermutation.withState("minecraft:cardinal_direction", newPlayerFacingDirInfo.direction.toLowerCase());
                }
            }
        }
    }

    // bug.log("§gProposed Block States:", event.player);
    // bug.listBlockStates(newBlockPermutation, event.player);

    event.block.setPermutation(newBlockPermutation);

    // bug.log("§aNew Block States:", event.player);
    // bug.listBlockStates(event.block.permutation, event.player);
}
//=============================================================================
export function rotateClockwise (event) {   
    const bug = new McDebug(false);
    bug.log("\n\n\n\n\n", event.player);

    //bug.listArray(dirInfo.info,e.player)
    const currentPermutation = event.block.permutation;
    bug.log("§6Current Block States", event.player);
    bug.listBlockStates(currentPermutation, event.player);

    const staticStateBlockFace = currentPermutation.getState("minecraft:block_face"); //face of block arrow is on, not just touched

    const oldStateCardinalDirection = currentPermutation.getState("minecraft:cardinal_direction");
    const oldCardinalDirectionDirInfo = dirInfo.directionOject_get(oldStateCardinalDirection);
    bug.log(`§bOld Cardinal Dir Info (${oldCardinalDirectionDirInfo.angle})§r:`
        + `\n==> dir: ${oldCardinalDirectionDirInfo.direction}`
        + `\n==> left: ${oldCardinalDirectionDirInfo.left90}`
        + `\n==> right: ${oldCardinalDirectionDirInfo.right90}`
        + `\n==> opposite: ${oldCardinalDirectionDirInfo.opposite}`, event.player);

    const oldStateVerticalHalf = currentPermutation.getState("minecraft:vertical_half");

    let newBlockPermutation = {};

    if ([ "down", "up" ].includes(staticStateBlockFace)) {
        //bug.log("§dArrow is Up/Down", event.player);
        newBlockPermutation = currentPermutation.withState("minecraft:cardinal_direction", oldCardinalDirectionDirInfo.right90.toLowerCase());
    }
    else {
        //bug.log("Arrow is on a wall", event.player);

        //block in on wall, so different logic 
        const staticBlockFaceDirInfo = dirInfo.directionOject_get(staticStateBlockFace);
        bug.log(`§cStatic Block Face Dir Info (${staticBlockFaceDirInfo.angle})§r:`
            + `\n==> dir: ${staticBlockFaceDirInfo.direction}`
            + `\n==> left: ${staticBlockFaceDirInfo.left90}`
            + `\n==> right: ${staticBlockFaceDirInfo.right90}`
            + `\n==> opposite: ${staticBlockFaceDirInfo.opposite}`, event.player);

        // top to right
        if (oldCardinalDirectionDirInfo.direction === staticBlockFaceDirInfo.opposite && oldStateVerticalHalf === "top"
        ) {
            newBlockPermutation = currentPermutation.withState("minecraft:cardinal_direction", staticBlockFaceDirInfo.left90.toLowerCase());
        }
        //right to bottom
        else if (oldCardinalDirectionDirInfo.direction === staticBlockFaceDirInfo.left90){
            newBlockPermutation = currentPermutation
                .withState("minecraft:vertical_half", "bottom")
                .withState("minecraft:cardinal_direction", staticBlockFaceDirInfo.opposite.toLowerCase());
        }
        // down to left
        else if (oldCardinalDirectionDirInfo.direction === staticBlockFaceDirInfo.opposite && oldStateVerticalHalf === "bottom"
        ) {
            newBlockPermutation = currentPermutation.withState("minecraft:cardinal_direction", staticBlockFaceDirInfo.right90.toLowerCase());
        }
        //left to top
        else if (oldCardinalDirectionDirInfo.direction === staticBlockFaceDirInfo.right90){
            newBlockPermutation = currentPermutation
                .withState("minecraft:vertical_half", "top")
                .withState("minecraft:cardinal_direction", staticBlockFaceDirInfo.opposite.toLowerCase());
    
        }
    }

    // bug.log("§gProposed Block States:", event.player);
    // bug.listBlockStates(newBlockPermutation, event.player);

    event.block.setPermutation(newBlockPermutation);

    // bug.log("§aNew Block States:", event.player);
    // bug.listBlockStates(event.block.permutation, event.player);
}  