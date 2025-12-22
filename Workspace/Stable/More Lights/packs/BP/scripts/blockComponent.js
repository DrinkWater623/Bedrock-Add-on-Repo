// blockComponents.js  More Lights Minecraft Bedrock Add-on
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T. (https://www.gnu.org/licenses/gpl-3.0.html)
URL: https://github.com/DrinkWater623
========================================================================
TODO: 
    confirm newBlock is one of these canPlaceInBlocks - may not be needed, just because of how placing works, like grass can be replaced
    move the other 2 template code to Block_Events
// ========================================================================
Change Log:
    20251217 - Updated debug alerts 
========================================================================*/
import { BlockComponentPlayerPlaceBeforeEvent, system, Block, world } from "@minecraft/server";
//==============================================================================
import { pack, packDisplayName, watchFor } from "./settings.js";
import { dev, emitters } from "./debug.js";
import { Block_Events, Blocks, FaceLocationGrid, Players } from "./common-stable/gameObjects/index.js";
import { Vector3Lib, DynamicPropertyLib } from "./common-stable/tools/index.js";
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
const blockEvents = new Block_Events(emitters);
//also need to not allow some blocks - may have something developed already 
//or it is in the block json ???
//==============================================================================
/**
 * Has its only Function Alert in dev
 * @param {*} lastInteractInfo 
 * @param {string} itemTypeId 
 * @param {Block} newBlock 
 * @returns 
 */
function verifyLastInteractInfoRelated (lastInteractInfo, itemTypeId, newBlock) {
    const _name = 'verifyLastInteractInfoRelated';
    dev.alertFunctionKey(_name, true);
    const alert = dev.isDebugFunction(_name);

    function errMsg (msg = '') {
        dev.alertError(`${alert ? '' : _name + ': '}xx> ${msg}`, pack.debugOn);
    }
    if (lastInteractInfo.tick === 0) { errMsg(`Missing lastInteractInfo`); return false; }

    //1st check for staleness
    const currentTick = system.currentTick;
    if (currentTick - lastInteractInfo.tick > 5) {
        errMsg(`xx> lastInteractInfo is stale. currentTick:${currentTick} - lastTick:${lastInteractInfo.tick}>5`);
        return false;
    }

    //2nd check for missing info
    if (!lastInteractInfo.faceLocation) { errMsg('Missing faceLocation'); return false; }
    if (!lastInteractInfo.blockLocation) { errMsg('Missing blockLocation'); return false; }
    if (!newBlock.dimension.isChunkLoaded(lastInteractInfo.blockLocation)) { dev.alertError('xx> Chunk is not loaded'); return false; }
    if (!newBlock.dimension.getBlock(lastInteractInfo.blockLocation)) { dev.alertError('xx> Cannot get block'); return false; }

    //3nd check for item type match    
    if (itemTypeId !== lastInteractInfo.itemTypeId) {
        errMsg(`itemStackBlock (${itemTypeId}) !== lastItemStack (${lastInteractInfo.itemTypeId})`);
        return false;
    }

    //3rd check for adjacency
    if (!Vector3Lib.isAdjacent(newBlock.location, lastInteractInfo.blockLocation)) {
        errMsg(`location (${Vector3Lib.toString(newBlock.location, 1, true)}) is not adjacent to lastBlockLocation (${Vector3Lib.toString(lastInteractInfo.blockLocation, 1, true)})`);
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
    if (Players.isInvalid(player)) return;
    if (Blocks.isInValid(event.block)) return;
    if (!watchFor.arrowBlocks().includes(event.permutationToPlace.type.id)) return;

    const eventType = 'onPlace';
    const objectType = 'arrow';
    const alert = dev.isDebugBlockObjectEvent(objectType, eventType);
    blockEvents.onPlace_block_rotation_arrow(event, alert);
    return;
}
//==============================================================================
/** 
 * @param {BlockComponentPlayerPlaceBeforeEvent} event 
 */
export function lightBar_onPlace (event) {
    const player = event.player;
    if (!player || Players.isInvalid(player)) return;
    if (!watchFor.barBlocks().includes(event.permutationToPlace.type.id)) return;
    if (!event.block.isValid) return;

    const eventType = 'onPlace';
    const objectType = 'bar';
    const alert = dev.isDebugBlockObjectEvent(objectType, eventType);
    const packName = packDisplayName;

    const { block: newBlock, face: touchedBlockFace, permutationToPlace: old_permutation } = event;
    const itemTypeId = event.permutationToPlace.type.id;
    const lastInteractInfo = DynamicPropertyLib.onPlayerInteractWithBlockBeforeEventInfo_get(player, false);
    let msg = `§b${eventType}-${itemTypeId}:§r on ${event.block.typeId} face=${event.face} in ${event.dimension.id}}`;

    if (!verifyLastInteractInfoRelated(lastInteractInfo, itemTypeId, newBlock)) { dev.alertError('verifyLastInteractInfoRelated failed', alert); return; }
    const verifiedMsg = blockEvents.verifyLastInteractInfoRelated(lastInteractInfo, itemTypeId, newBlock);
    if (!verifiedMsg.endsWith('Verified')) {
        msg += '\n§cxx> verifyLastInteractInfoRelated failed';
        if (alert) console.error(`${packName}:${msg}`);
        return;
    }
    //---------------------------------------------------------------------------------
    // these are verified above, but for the JSDoc, need to show in here
    const touchedBlockFaceLocation = lastInteractInfo.faceLocation;
    if (!touchedBlockFaceLocation) return;
    const touchedBlockLocation = lastInteractInfo.blockLocation;
    if (!touchedBlockLocation) return;
    const touchedBlock = newBlock.dimension.getBlock(touchedBlockLocation);
    if (!touchedBlock) return;
    //---------------------------------------------------------------------------------
    if (alert) {
        msg += Blocks.blockPermutationInfo_show(old_permutation, '§6onPlace-permutation§r', true) ?? msg;
    }
    const grid = new FaceLocationGrid(touchedBlockFaceLocation, touchedBlockFace, touchedBlockLocation, false);
    const grid3 = grid.grid(3);
    const touchedGridPtr = grid3.x + (3 * grid3.y);
    let permutationPtr = bestTouchedPoint_bar(grid);
    //above is perfect for walls.... off for up.down
    //needs a 180 adjustment, luckily numbered so that is easy to do
    //not needed, adjusted updown to use south, which is 180 deg
    // if ([ 'up', 'down' ].includes(touchedBlockFace)) {
    //     if ([ 0, 1, 2, 3 ].includes(permutationPtr)) {
    //         permutationPtr = (permutationPtr + 2) % 4;
    //     }
    // }

    if (alert) {
        msg += grid.blockFaceLocationInfo_show([ 3, 4, 5, 6, 7, 8 ], true);
        msg += `\n§bBet Ptr:§r ${permutationPtr}`;
    }

    // confirm not already correct state
    const blockStateName = 'dw623:position_ptr';
    //@ts-ignore
    const currentPositionPtr = event.permutationToPlace.getState(blockStateName);
    if (permutationPtr === currentPositionPtr) {
        msg += `\n\n§6No new permutation needed:§b Grid Ptr = §r${permutationPtr} `;
        if (alert) console.warn(`${packName}:${msg}`);
        return;
    }

    //Update permutation
    //@ts-ignore
    let newPermutation = event.permutationToPlace.withState(blockStateName, permutationPtr);
    event.cancel = true;
    system.run(() => {
        msg += `\n§aSetting block state = ${blockStateName} to ${permutationPtr}`;
        newBlock.dimension.setBlockPermutation(newBlock.location, newPermutation);
        //FIXME: sound
        if (alert) {
            system.runTimeout(() => {
                msg += Blocks.blockPermutationInfo_show(newPermutation, '\n§aNew Block-permutation§r', true);
                console.warn(`${packName}:${msg}`);
            }, 1);
        }
    });
}
/**
 * 
 * @param {FaceLocationGrid} grid 
 * @returns {number}
 */
function bestTouchedPoint_bar (grid) {
    const debug = dev.debugEvents.onPlace_bar;

    const grid7 = grid.grid(7);
    //Edge edges
    if (grid7.x == 0) return 0;
    if (grid7.y == 0) return 1;
    if (grid7.x == 6) return 2;
    if (grid7.y == 6) return 3;
    console.warn('not edge-edge');

    const grid5 = grid.grid(5);
    //Dead Center 
    if (grid7.x == 3 && grid7.y == 3) return 4;
    if (grid5.x == 2 && grid5.y == 2) return 5;
    console.warn('not Dead Center');

    const grid3 = grid.grid(3);
    //Dead-ish Center     
    if ([ 1, 2, 4, 5 ].includes(grid7.x) && grid3.y == 1) return 4;
    if ([ 1, 2, 4, 5 ].includes(grid7.y) && grid3.x == 1) return 5;
    console.warn('not Dead-ish Center');

    //around the center
    if (grid3.x == 1 && [ 1, 3 ].includes(grid5.y)) return 4;
    if (grid3.y == 1 && [ 1, 3 ].includes(grid5.x)) return 5;
    console.warn('not around the center');

    const grid4 = grid.grid(4);
    if (grid4.x == 0 && ![ 0, 4 ].includes(grid5.y)) return 0;
    if (grid4.y == 0 && ![ 0, 4 ].includes(grid5.x)) return 1;
    if (grid4.x == 3 && ![ 0, 4 ].includes(grid5.y)) return 2;
    if (grid4.y == 3 && ![ 0, 4 ].includes(grid5.x)) return 3;
    console.warn('did not use grid 4');

    /*
    "grid":0 ,"geo_sfx":"east_ns" 	
    "grid":1 ,"geo_sfx":"south_ew" 
    "grid":2 ,"geo_sfx":"west_ns"  
    "grid":3 ,"geo_sfx":"north_ew" 
    "grid":4 ,"geo_sfx":"center_ew"
    "grid":5 ,"geo_sfx":"center_ns"
     */

    //rest of sides default
    if (grid3.x == 0) return 0;
    if (grid3.y == 0) return 1;
    if (grid3.x == 2) return 2;
    if (grid3.y == 2) return 3;
    console.warn('default selected');

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
    if (!player || Players.isInvalid(player)) return;
    if (!watchFor.miniBlocks().includes(event.permutationToPlace.type.id)) return;
    if (!event.block.isValid) return;

    const eventType = 'onPlace';
    const objectType = 'mini_block';
    const alert = dev.isDebugBlockObjectEvent(objectType, eventType);
    const packName = packDisplayName;

    const { block: newBlock, face: touchedBlockFace, permutationToPlace: old_permutation } = event;
    const itemTypeId = event.permutationToPlace.type.id;
    const lastInteractInfo = DynamicPropertyLib.onPlayerInteractWithBlockBeforeEventInfo_get(player, false);
    let msg = `§b${eventType}-${itemTypeId}:§r on ${event.block.typeId} face=${event.face} in ${event.dimension.id}}`;

    if (!verifyLastInteractInfoRelated(lastInteractInfo, itemTypeId, newBlock)) { dev.alertError('verifyLastInteractInfoRelated failed', alert); return; }
    const verifiedMsg = blockEvents.verifyLastInteractInfoRelated(lastInteractInfo, itemTypeId, newBlock);
    if (!verifiedMsg.endsWith('Verified')) {
        msg += '\n§cxx> verifyLastInteractInfoRelated failed';
        if (alert) console.error(`${packName}:${msg}`);
        return;
    }
    //---------------------------------------------------------------------------------
    // these are verified above, but for the JSDoc, need to show in here
    const touchedBlockFaceLocation = lastInteractInfo.faceLocation;
    if (!touchedBlockFaceLocation) return;
    const touchedBlockLocation = lastInteractInfo.blockLocation;
    if (!touchedBlockLocation) return;
    const touchedBlock = newBlock.dimension.getBlock(touchedBlockLocation);
    if (!touchedBlock) return;
    //---------------------------------------------------------------------------------
    if (alert) {
        msg += Blocks.blockPermutationInfo_show(old_permutation, '§6onPlace-permutation§r', true) ?? msg;
    }
    const grid = new FaceLocationGrid(touchedBlockFaceLocation, touchedBlockFace, touchedBlockLocation, false);
    const grid3 = grid.grid(3);
    const touchedGridPtr = grid3.x + (3 * grid3.y);
    //const touchedEdgeName = grid.getEdgeName(3);

    if (alert) {
        msg += grid.blockFaceLocationInfo_show([ 2, 3, 4 ], true);
    }

    // confirm not already correct state
    const blockStateName = 'dw623:mini_block_position_ptr';
    //@ts-ignore
    const currentPositionPtr = event.permutationToPlace.getState(blockStateName);
    if (touchedGridPtr === currentPositionPtr) {
        msg += `\n\n§6No new permutation needed:§b Grid Ptr = §r${touchedGridPtr} `;
        if (alert) console.warn(`${packName}:${msg}`);
        return;
    }

    //Update permutation
    //@ts-ignore
    let newPermutation = event.permutationToPlace.withState(blockStateName, touchedGridPtr);
    event.cancel = true;
    system.run(() => {
        msg += `\n§aSetting block state = ${blockStateName} to ${touchedGridPtr}`;
        newBlock.dimension.setBlockPermutation(newBlock.location, newPermutation);
        //FIXME: sound
        if (alert) {
            system.runTimeout(() => {
                msg += Blocks.blockPermutationInfo_show(newPermutation, '\n§aNew Block-permutation§r', true);
                console.warn(`${packName}:${msg}`);
            }, 1);
        }
    });
}
//==============================================================================
// End of File
//==============================================================================