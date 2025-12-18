// blockComponents.js  More Lights Minecraft Bedrock Add-on
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T. (https://www.gnu.org/licenses/gpl-3.0.html)
URL: https://github.com/DrinkWater623
========================================================================
TODO: 
confirm newBlock is one of these canPlaceInBlocks - may not be needed, just because of how placing works, like grass can be replaced
// ========================================================================
Change Log:
    20251217 - Updated debug alerts 
========================================================================*/
import { BlockComponentPlayerPlaceBeforeEvent, system, Block } from "@minecraft/server";
//==============================================================================
import { watchFor } from "./settings.js";
import { dev } from "./debug.js";
import { FaceLocationGrid } from "./common-stable/gameObjects/index.js";
import { Vector2Lib, Vector3Lib,DynamicPropertyLib } from "./common-stable/tools/index.js";
import { airBlock, waterBlocks } from "./common-data/index.js";
//==============================================================================
/**
 * @typedef {'north' | 'south' | 'east' | 'west'} BlockSides  
 * @typedef {'up'|'down'|'north'|'south'|'east'|'west'} BlockFaces
 * @typedef {'Up'|'Down'|'North'|'South'|'East'|'West'} BlockFacesTitle
 **/
//==============================================================================
//TODO:
//There are others of these types (replaceable block), see block info?  
//Maybe get the itemStack of a block and see permutations to get info
const canPlaceInBlocks = [ ...airBlock, ...waterBlocks ];
//also need to not allow some blocks - may have something developed already 
//or it is in the block json ???
//==============================================================================
/**
 * 
 * @param {*} lastInteractInfo 
 * @param {string} itemTypeId 
 * @param {Block} newBlock 
 * @param {boolean} debug 
 * @returns 
 */
function verifyLastInteractInfoRelated (lastInteractInfo, itemTypeId, newBlock, debug) {
    dev.alertLog.log(`§dVerifying lastInteractInfo`, debug);

    if (lastInteractInfo.tick === 0) { dev.alertLog.error(`Missing lastInteractInfo`, debug); return false; }

    //1st check for staleness
    const currentTick = system.currentTick;
    if (currentTick - lastInteractInfo.tick > 5) {
        dev.alertLog.error(`lastInteractInfo is stale. currentTick:${currentTick} - lastTick:${lastInteractInfo.tick}>5`, debug);
        return false;
    }

    //2nd check for missing info
    if (!lastInteractInfo.faceLocation) { dev.alertLog.error('Missing faceLocation'); return false; }
    if (!lastInteractInfo.blockLocation) { dev.alertLog.error('Missing blockLocation'); return false; }
    if (!newBlock.dimension.isChunkLoaded(lastInteractInfo.blockLocation)) { dev.alertLog.error('Chunk is not loaded'); return false; }
    if (!newBlock.dimension.getBlock(lastInteractInfo.blockLocation)) { dev.alertLog.error('Cannot get block'); return false; }

    //3nd check for item type match    
    if (itemTypeId !== lastInteractInfo.itemTypeId) {
        dev.alertLog.error(`itemStackBlock (${itemTypeId}) !== lastItemStack (${lastInteractInfo.itemTypeId})`, debug);
        return false;
    }

    //3rd check for adjacency
    if (!Vector3Lib.isAdjacent(newBlock.location, lastInteractInfo.blockLocation)) {
        dev.alertLog.error(`location (${Vector3Lib.toString(newBlock.location, 1, true)}) is not adjacent to lastBlockLocation (${Vector3Lib.toString(lastInteractInfo.blockLocation, 1, true)})`, debug);
        return false;
    }
    //That is all that matters to accept the LastInteract info as related to this place event   
    return true;
}
//==============================================================================
/**
 * event.permutationToPlace.type.id; is assured because this is a custom component
 * @param {BlockComponentPlayerPlaceBeforeEvent} event 
 */
export function lightArrow_onPlace (event) {
    const player = event.player;
    if (!player || !player.isValid) return;
    if (!watchFor.arrowBlocks().includes(event.permutationToPlace.type.id)) return;
    if (!event.block.isValid) return;

    const eventType = 'onPlace';
    const objectType = 'arrow';
    const alert = dev.isDebugEventObject(eventType, objectType);
    const msg = `§b${eventType}-${objectType}:§r on ${event.block.typeId} face=${event.face} in ${event.dimension.id}}`;
    dev.alertLog.log(msg, alert);

    const { block: newBlock, face: touchedBlockFace } = event;
    const itemTypeId = event.permutationToPlace.type.id;

    const lastInteractInfo = DynamicPropertyLib.onPlayerInteractWithBlockBeforeEventInfo_get(player, dev.debugEvents.beforePlayerInteractWithBlock_arrow);
    if (!verifyLastInteractInfoRelated(lastInteractInfo, itemTypeId, newBlock, alert)) { dev.alertLog.error('verifyLastInteractInfoRelated failed', alert); return; }

    //---------------------------------------------------------------------------------
    // these are verified above, but for the JSDoc, need to show in here
    const touchedBlockFaceLocation = lastInteractInfo.faceLocation;
    if (!touchedBlockFaceLocation) return;
    const touchedBlockLocation = lastInteractInfo.blockLocation;
    if (!touchedBlockLocation) return;
    const touchedBlock = newBlock.dimension.getBlock(touchedBlockLocation);
    if (!touchedBlock) return;
    //---------------------------------------------------------------------------------
    dev.blocks.blockFaceLocationInfo(touchedBlockFace, touchedBlockFaceLocation, player, [ 3, 4, 5, 6 ], alert);
    dev.blocks.blockPermutationInfo(event.permutationToPlace, 'onPlace-permutation', alert);

    const grid = new FaceLocationGrid(touchedBlockFaceLocation, touchedBlockFace, player, true, alert && dev.debugFunctions.FaceLocationGrid);
    const grid3 = grid.grid(3);
    const touchedEdgeName = grid.getEdgeName(3);

    if ([ 'Up', "Down" ].includes(event.face)) return;
    if (grid3.y !== 1) return; //middle row
    if (grid3.x == 1) return; //middle column up/down
    if (![ 'north', 'south', 'east', 'west' ].includes(touchedEdgeName)) return;

    //reset permutation position    
    const blockStateName = 'minecraft:cardinal_direction';
    let newPermutation = event.permutationToPlace.withState(blockStateName, touchedEdgeName);
    event.cancel = true;
    system.run(() => {
        dev.alertLog.success(`Setting block state = ${blockStateName} to ${touchedEdgeName} on face=${event.face}`);
        newBlock.dimension.setBlockPermutation(newBlock.location, newPermutation);
    });
}
//==============================================================================
/** 
 * @param {BlockComponentPlayerPlaceBeforeEvent} event 
 */
export function lightBar_onPlace (event) {
    const player = event.player;
    if (!player || !player.isValid) return;
    if (!watchFor.arrowBlocks().includes(event.permutationToPlace.type.id)) return;
    if (!event.block.isValid) return;

    const eventType = 'onPlace';
    const objectType = 'bar';
    const alert = dev.isDebugEventObject(eventType, objectType);
    const msg = `§b${eventType}-${objectType}:§r on ${event.block.typeId} face=${event.face} in ${event.dimension.id}}`;
    dev.alertLog.log(msg, alert);

    const { block: newBlock, face: touchedBlockFace } = event;
    const itemTypeId = event.permutationToPlace.type.id;

    const lastInteractInfo = DynamicPropertyLib.onPlayerInteractWithBlockBeforeEventInfo_get(player, dev.debugEvents.beforePlayerInteractWithBlock_arrow);
    if (!verifyLastInteractInfoRelated(lastInteractInfo, itemTypeId, newBlock, alert)) { dev.alertLog.error('verifyLastInteractInfoRelated failed', alert); return; }

    //---------------------------------------------------------------------------------
    // these are verified above, but for the JSDoc, need to show in here
    const touchedBlockFaceLocation = lastInteractInfo.faceLocation;
    if (!touchedBlockFaceLocation) return;
    const touchedBlockLocation = lastInteractInfo.blockLocation;
    if (!touchedBlockLocation) return;
    const touchedBlock = newBlock.dimension.getBlock(touchedBlockLocation);
    if (!touchedBlock) return;
    //---------------------------------------------------------------------------------
    dev.blocks.blockFaceLocationInfo(touchedBlockFace, touchedBlockFaceLocation, player, [ 2, 3, 4, 5, 6, 7, 8 ], alert);
    dev.blocks.blockPermutationInfo(event.permutationToPlace, 'onPlace-permutation', alert);

    const grid = new FaceLocationGrid(touchedBlockFaceLocation, touchedBlockFace, player, true, alert && dev.debugFunctions.FaceLocationGrid);
    let permutationPtr = bestTouchedPoint_bar(grid);

    const blockStateName = 'dw623:position_ptr';
    //@ts-ignore
    const currentPositionPtr=event.permutationToPlace.getState(blockStateName)
    if (permutationPtr === currentPositionPtr) return; 

    //@ts-ignore
    let newPermutation = event.permutationToPlace.withState(blockStateName, permutationPtr.toString());
    event.cancel = true;
    system.run(() => {
        dev.alertLog.success(`Setting block state = ${blockStateName} to ${permutationPtr}`);
        newBlock.dimension.setBlockPermutation(newBlock.location, newPermutation);
    });
}
/**
 * 
 * @param {FaceLocationGrid} grid 
 * @returns {number}
 */
function bestTouchedPoint_bar (grid) {
    const debug = dev.debugEvents.onPlace_bar;
    const grid2 = grid.grid(2);
    const grid3 = grid.grid(3);
    const grid4 = grid.grid(4);
    const grid5 = grid.grid(5);
    const grid6 = grid.grid(6);
    const grid7 = grid.grid(7);
    const grid8 = grid.grid(8);

    if (dev.debugEvents.onPlace_bar) {
        const touched2 = grid2.x + (2 * grid2.y);
        const touched3 = grid3.x + (3 * grid3.y);
        const touched4 = grid4.x + (4 * grid4.y);
        const touched5 = grid5.x + (5 * grid5.y);
        const touched6 = grid6.x + (6 * grid6.y);
        const touched7 = grid7.x + (7 * grid7.y);
        const touched8 = grid8.x + (8 * grid8.y);
        const edge2 = grid.getEdgeName(2);
        const edge3 = grid.getEdgeName(3);
        const edge4 = grid.getEdgeName(4);
        const edge5 = grid.getEdgeName(5);
        const edge6 = grid.getEdgeName(6);
        const edge7 = grid.getEdgeName(7);
        const edge8 = grid.getEdgeName(8);

        dev.alertLog.log(`
§rGrid-§b2: ${Vector2Lib.toString(grid2, 0, true)}§r GridPtr-2 #: §d${touched2}§r - §b${edge2}
§rGrid-§a3: ${Vector2Lib.toString(grid3, 0, true)}§r GridPtr-3 #: §a${touched3}§r - §b${edge3}
§rGrid-§b4: ${Vector2Lib.toString(grid4, 0, true)}§r GridPtr-4 #: §d${touched4}§r - §b${edge4}
§rGrid-§a5: ${Vector2Lib.toString(grid5, 0, true)}§r GridPtr-5 #: §a${touched5}§r - §b${edge5}
§rGrid-§b6: ${Vector2Lib.toString(grid6, 0, true)}§r GridPtr-6 #: §d${touched6}§r - §b${edge6}
§rGrid-§a7: ${Vector2Lib.toString(grid7, 0, true)}§r GridPtr-7 #: §a${touched7}§r - §b${edge7}
§rGrid-§b8: ${Vector2Lib.toString(grid8, 0, true)}§r GridPtr-8 #: §d${touched8}§r - §b${edge8}
    `, debug);
    }

    if (grid8.x == 0) return 0;
    if (grid8.y == 0) return 1;
    if (grid8.x == 7) return 2;
    if (grid8.y == 7) return 3;

    if (grid4.x == 0 && grid6.y != 0 && grid6.y != 5) return 0;
    if (grid4.y == 0 && grid6.x != 0 && grid6.x != 5) return 1;
    if (grid4.x == 3 && grid6.y != 0 && grid6.y != 5) return 2;
    if (grid4.y == 3 && grid6.x != 0 && grid6.x != 5) return 3;

    if (grid4.x == 0 && grid6.y == 0) return 1;
    if (grid4.y == 0 && grid6.x == 0) return 2;
    if (grid4.x == 3 && grid6.y == 0) return 3;
    if (grid4.y == 3 && grid6.x == 0) return 0;

    if (grid4.x == 0 && grid6.y == 5) return 3;
    if (grid4.y == 0 && grid6.x == 5) return 2;
    if (grid4.x == 3 && grid6.y == 5) return 1;
    if (grid4.y == 3 && grid6.x == 5) return 0;

    //Dead Center
    if (grid5.x == 2 && grid5.y == 2) return 5;
    if (grid5.y == 2) return 5;
    if (grid5.x == 2) return 4;

    if (grid3.x == 1 && grid3.y == 1) return 4;
    if (grid3.y == 1) return 4;
    if (grid3.x == 1) return 5;

    //s/b center-ish only left
    if (grid5.x != 2 && ![ 0, 2 ].includes(grid3.y)) return 4;
    if (grid5.y != 2 && ![ 0, 2 ].includes(grid3.x)) return 5;

    if (grid5.x != 2 && [ 0, 2 ].includes(grid3.y)) return 5;
    if (grid5.y != 2 && [ 0, 2 ].includes(grid3.x)) return 4;

    //now those 4 corners outside of center
    if (grid3.x == 0) return 0;
    if (grid3.y == 0) return 1;
    if (grid3.x == 2) return 2;
    if (grid3.y == 2) return 3;

    //should not reach here - I hope - FIXME: test this
    dev.alertLog.log(`Default 5 Assigned`, debug);
    return 5;
}
/**
 * @param {number} n 
 * @param {number} max  
 * @returns {number}
 */
function inverse (n, max) {
    return Math.abs(n - max);
};
//==============================================================================
/**
 * 
 * @param {BlockComponentPlayerPlaceBeforeEvent} event 
 */
export function lightMiniBlock_onPlace (event) {
    const player = event.player;
    if (!player || !player.isValid) return;
    if (!watchFor.arrowBlocks().includes(event.permutationToPlace.type.id)) return;
    if (!event.block.isValid) return;

    const eventType = 'onPlace';
    const objectType = 'mini_block';
    const alert = dev.isDebugEventObject(eventType, objectType);
    const msg = `§b${eventType}-${objectType}:§r on ${event.block.typeId} face=${event.face} in ${event.dimension.id}}`;
    dev.alertLog.log(msg, alert);

    const { block: newBlock, face: touchedBlockFace } = event;
    const itemTypeId = event.permutationToPlace.type.id;

    const lastInteractInfo = DynamicPropertyLib.onPlayerInteractWithBlockBeforeEventInfo_get(player, dev.debugEvents.beforePlayerInteractWithBlock_arrow);
    if (!verifyLastInteractInfoRelated(lastInteractInfo, itemTypeId, newBlock, alert)) { dev.alertLog.error('verifyLastInteractInfoRelated failed', alert); return; }

    //---------------------------------------------------------------------------------
    // these are verified above, but for the JSDoc, need to show in here
    const touchedBlockFaceLocation = lastInteractInfo.faceLocation;
    if (!touchedBlockFaceLocation) return;
    const touchedBlockLocation = lastInteractInfo.blockLocation;
    if (!touchedBlockLocation) return;
    const touchedBlock = newBlock.dimension.getBlock(touchedBlockLocation);
    if (!touchedBlock) return;
    //---------------------------------------------------------------------------------
    dev.blocks.blockFaceLocationInfo(touchedBlockFace, touchedBlockFaceLocation, player, [ 3 ], alert);
    dev.blocks.blockPermutationInfo(event.permutationToPlace, 'onPlace-permutation', alert);

    const grid = new FaceLocationGrid(touchedBlockFaceLocation, touchedBlockFace, player, true, alert && dev.debugFunctions.FaceLocationGrid);
    const grid3 = grid.grid(3);
    const touchedGridPtr = grid3.x + (3 * grid3.y);
    
    // confirm not already correct state
    const blockStateName = 'dw623:mini_block_position_ptr';
    //@ts-ignore
    const currentPositionPtr=event.permutationToPlace.getState(blockStateName)
    if (touchedGridPtr === currentPositionPtr) return; 
    
    //Update permutation
    //@ts-ignore
    let newPermutation = event.permutationToPlace.withState(blockStateName, touchedGridPtr);
    event.cancel = true;
    system.run(() => {
        dev.alertLog.success(`Setting block state = ${blockStateName} to ${touchedGridPtr}`,alert);
        newBlock.dimension.setBlockPermutation(newBlock.location, newPermutation);
        //FIXME: sound
    });
}
//==============================================================================
// End of File
//==============================================================================