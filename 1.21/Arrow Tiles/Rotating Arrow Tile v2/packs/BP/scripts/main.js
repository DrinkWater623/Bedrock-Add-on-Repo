// import { world, system } from '@minecraft/server';
import { McDebug } from './McDebug.js';

const bug = new McDebug(true);
//=============================================================================
const numOfDirections = 8;
//=============================================================================
const angleConvert = function (angle = 0) {
    angle = angle % 360;
    return angle < 0 ? angle + 360 : angle;
};
const angleId = function (angle = 0,numOfDirections = 4) {
    const retVal = Math.round(angleConvert(angle) / (360 / numOfDirections));
    return retVal === numOfDirections ? 0 : retVal;
};
const dirState = 'int:direction'
//=============================================================================
world.beforeEvents.worldInitialize.subscribe((event) => {
    event.blockTypeRegistry.registerCustomComponent(
        "dw623:rotating_arrow_tile_components",
        {
            // not a shared component, no need to check for block id = "dw623:rotating_arrow_tile"

            beforeOnPlayerPlace: e => {
                const directionBit = angleId(e.player?.getRotation().y,numOfDirections);
                const newBlockPermutation = e.permutationToPlace.withState(dirState, directionBit);
                e.permutationToPlace = newBlockPermutation;
            },
            onPlayerInteract: e => {               

                if ([ "down", "up" ].includes(e.block.permutation.getState("minecraft:block_face"))) {

                    const newDirectionBit = angleId(e.player?.getRotation().y,numOfDirections);

                    if (e.block.permutation.getState(dirState) === newDirectionBit) return;

                    const newBlockPermutation = e.block.permutation.withState(dirState, newDirectionBit);

                    if (!e.block.trySetPermutation(newBlockPermutation)) {
                        bug.log("trySetPermutation Failed\n§aWanted:", e.player);
                        bug.listBlockStates(newBlockPermutation, e.player);
                        bug.log("§cBlock Still Has:", e.player);
                        bug.listBlockStates(e.block.permutation, e.player);
                    }
                }
                else {
                    let directionBit = e.block.permutation.getState(dirState);

                    if (e.player.isSneaking) directionBit = directionBit === 0 ? (numOfDirections-1) : directionBit - 1;
                    else directionBit = directionBit === (numOfDirections-1) ? 0 : directionBit + 1;

                    const newBlockPermutation = e.block.permutation.withState(dirState, directionBit);

                    if (!e.block.trySetPermutation(newBlockPermutation)) {
                        bug.log("(wall) trySetPermutation Failed\n§aWanted:", e.player);
                        bug.listBlockStates(newBlockPermutation, e.player);
                        bug.log("§cBlock Still Has:", e.player);
                        bug.listBlockStates(e.block.permutation, e.player);
                    }
                }
            }
        }
    );
});
//=============================================================================