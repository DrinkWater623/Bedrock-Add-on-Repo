//@ts-check
import { BlockComponentPlayerPlaceBeforeEvent, system, Direction, Block } from "@minecraft/server";
//==============================================================================
import { watchFor } from "./settings.js";
import { dev } from "./debug.js";
import { FaceLocationGrid } from "./common-stable/blocks/blockFace.js";
import { Vector2Lib, Vector3Lib } from "./common-stable/tools/vectorClass.js";
import { DynamicPropertyLib } from "./common-stable/tools/dynamicPropertyClass.js";
import { airBlock,waterBlocks } from "./common-data/block-data.js";
//==============================================================================
/**
 * @typedef {'north' | 'south' | 'east' | 'west'} BlockSides  
 * @typedef {'up'|'down'|'north'|'south'|'east'|'west'} BlockFaces
 * @typedef {'Up'|'Down'|'North'|'South'|'East'|'West'} BlockFacesTitle
 **/
//==============================================================================
const canPlaceInBlocks = [...airBlock,...waterBlocks]
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
    const { typeId, location, dimension } = newBlock;
    const currentTick = system.currentTick;

    if (lastInteractInfo.tick === 0) {
        dev.alertLog.error(`No lastInteractInfo found`, debug);
        return false;
    }
     //1st check for staleness
    if (currentTick - lastInteractInfo.tick > 5) {
        dev.alertLog.error(`lastInteractInfo is stale. currentTick:${currentTick} - lastTick:${lastInteractInfo.tick}>5`, debug);
        return false;
    }

    const touchedBlockFaceLocation = lastInteractInfo.faceLocation 
    if(!touchedBlockFaceLocation) return false;
    const touchedBlockLocation = lastInteractInfo.blockLocation
    if(!touchedBlockLocation) return false
    if(! dimension.isChunkLoaded(touchedBlockLocation)) return false
    const touchedBlock = dimension.getBlock(touchedBlockLocation);
    if(!touchedBlock) return false

    
    //2nd check for item type match    
    if (itemTypeId !== lastInteractInfo.itemTypeId) {
        dev.alertLog.error(`itemStackBlock (${itemTypeId}) !== lastItemStack (${lastInteractInfo.itemTypeId})`, debug);
        return false;
    }
    //3rd check for adjacency
    if (!lastInteractInfo.blockLocation) {
        dev.alertLog.error(`lastInteractInfo.blockLocation is missing`, debug);
        return false;
    }
    else if (!Vector3Lib.isAdjacent(location, lastInteractInfo.blockLocation)) {
        dev.alertLog.error(`location (${Vector3Lib.toString(location, 1, true)}) is not adjacent to lastBlockLocation (${Vector3Lib.toString(lastInteractInfo.blockLocation, 1, true)})`, debug);
        return false;
    }
    //That is all that matters to accept the LastInteract info as related to this place event

    const interactBlock = dimension.getBlock(lastInteractInfo.blockLocation);
    if (!interactBlock) {
        dev.alertLog.warn(`interactBlock disappeared`, debug);
        return false;
    }
    
    if (!lastInteractInfo.faceLocation) {
        dev.alertLog.warn(`faceLocation  is missing`, debug);
        return false;
    }

    return true;
}
//==============================================================================
/**
 * 
 * @param {BlockComponentPlayerPlaceBeforeEvent} event 
 */
export function lightArrow_onPlace (event) {
    const debug = dev.debugEvents.onPlace_arrow;
    const player = event.player;
    if (!player || !player.isValid) return;

    const { block: newBlock, face: touchedBlockFace } = event;
    if (!newBlock.isValid) return;
    //TODO: confirm newBlock is one of these canPlaceInBlocks - may not be needed, just because of how placing works, like grass can be replaced

    const itemTypeId = event.permutationToPlace.type.id;
    if (!watchFor.arrowBlocks().includes(itemTypeId)) return;
    
    const lastInteractInfo = DynamicPropertyLib.onPlayerInteractWithBlockBeforeEventInfo_get(player,dev.debugEvents.beforePlayerInteractWithBlock_arrow);
    const verify = verifyLastInteractInfoRelated(lastInteractInfo, itemTypeId, newBlock, debug);
    if (!verify) return;

    //---------------------------------------------------------------------------------
    // these are verified above, but for the JSDoc, need to show in here
    const touchedBlockFaceLocation = lastInteractInfo.faceLocation 
    if(!touchedBlockFaceLocation) return
    const touchedBlockLocation = lastInteractInfo.blockLocation
    if(!touchedBlockLocation) return
    const touchedBlock = newBlock.dimension.getBlock(touchedBlockLocation);
    if(!touchedBlock) return
    //---------------------------------------------------------------------------------

    //const interactBlockLocationStr = Vector3Lib.toString(touchedBlockLocation, 1, true);
    //const faceLocationStr = Vector3Lib.toString(touchedBlockFaceLocation, 1, true);

    const grid = new FaceLocationGrid(touchedBlockFaceLocation, touchedBlockFace, player, true, dev.debugFunctions.FaceLocationGrid);
    const grid3 = grid.grid(3);
    const touched = grid.getEdgeName(3);

    dev.blocks.blockFaceLocationInfo(touchedBlockFace,touchedBlockFaceLocation,player,[3,4,5,6],debug)
    dev.blocks.blockPermutationInfo(event.permutationToPlace,'onPlace-permutation',debug)
    // dev.alertLog.log(`
    //     \n§cBeforeOnPlayerPlace (cc) Info§r
    //     \nItemStack Block: ${itemTypeId}
    //     \nFace: ${event.face}
    //     \nFace Location (from Interact): ${faceLocationStr}
    //     \nFace Grid3: ${Vector2Lib.toString(grid3, 0, true)} = ${touched}                   
    // `);
    if ([ 'Up', "Down" ].includes(event.face)) return;
    if (grid3.y !== 1) return; //middle row
    if (grid3.x == 1) return; //middle column up/down
    if (![ 'north', 'south', 'east', 'west' ].includes(touched)) return;    
    dev.alertLog.log('§aNew Permutation Configured')
    //reset position    
    let newPermutation = event.permutationToPlace.withState('minecraft:cardinal_direction', touched);
    event.cancel = true;
    system.run(() => {
        newBlock.dimension.setBlockPermutation(newBlock.location, newPermutation);
    });
}

//==============================================================================
/**
 * 
 * @param {BlockComponentPlayerPlaceBeforeEvent} event 
 */
export function lightBar_onPlace (event) {
    const debug = dev.debugEvents.onPlace_bar;
    const player = event.player;
    if (!player || !player.isValid) return;

    const { block: inBlock, face: onBlockFace } = event;
    if (!inBlock.isValid) return;

    const { typeId, location, dimension } = inBlock;
    const itemStackBlock = event.permutationToPlace.type.id;
    if (!watchFor.barBlocks().includes(itemStackBlock)) return;

    const lastItemStack = DynamicPropertyLib.getString(player, 'dw623:lastInteractItemStack');
    if (itemStackBlock !== lastItemStack) {
        dev.alertLog.warn(`itemStackBlock (${itemStackBlock}) !== lastItemStack (${lastItemStack})`, debug);
        return;
    }

    const interactBlockLocation = DynamicPropertyLib.getVector(player, 'dw623:lastInteractBlockLocation');
    if (!interactBlockLocation) {
        dev.alertLog.warn(`lastInteractBlockLocation is missing`, debug);
        return;
    }
    else if (!Vector3Lib.isAdjacent(location, interactBlockLocation)) {
        dev.alertLog.warn(`location (${Vector3Lib.toString(location, 1, true)}) is not adjacent to lastBlockLocation (${Vector3Lib.toString(interactBlockLocation, 1, true)})`, debug);
        return;
    }

    const interactBlock = inBlock.dimension.getBlock(interactBlockLocation);
    if (!interactBlock) {
        dev.alertLog.warn(`interactBlock disappeared`, debug);
        return;
    }
    const interactBlockLocationStr = Vector3Lib.toString(interactBlock.location, 1, true);

    const faceLocation = DynamicPropertyLib.getVector(player, 'dw623:lastInteractFaceLocation');
    if (!faceLocation) {
        dev.alertLog.warn(`faceLocation  is missing`, debug);
        return;
    }
    const grid = new FaceLocationGrid(faceLocation, onBlockFace, player, false, debug);

    if (debug) {
        const faceLocationStr = Vector3Lib.toString(faceLocation, 1, true);

        dev.alertLog.log(`
\n§a**************************************
§cLight Bar (BeforeOnPlayerPlace) Info§r
§a****************************************
§rItemStack Block: ${itemStackBlock}
§rInteract Block: §1${interactBlock.typeId}§r @ ${interactBlockLocationStr}  §dFace Loc: ${faceLocationStr}
§rPlayer:  Geo ${Vector3Lib.toString(grid.playerLocation, 0, true)} - Facing: §b${grid.playerCardinalDirection}
§rBlock Face: ${onBlockFace} - §6as ${grid.blockFace}
        `);
        const states = event.permutationToPlace.getAllStates();
        for (const key in states) { dev.alertLog.log(`§eState: ${key}: §b${states[ key ]}`); }
    }

    let permutationPtr = bestTouchedPoint_bar(grid);
    dev.alertLog.log(`\nPermutation Ptr: §a${permutationPtr}`, debug);

    //@ts-ignore
    let newPermutation = event.permutationToPlace.withState('dw623:position_ptr', permutationPtr.toString());
    event.cancel = true;
    system.run(() => {
        dimension.setBlockPermutation(location, newPermutation);
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
    const debug = dev.debugEvents.onPlace_miniBlock;
    const player = event.player;
    if (!player || !player.isValid) return;

    const { block: inBlock, face: onBlockFace } = event;
    if (!inBlock.isValid) return;

    const { typeId, location, dimension } = inBlock;
    const itemStackBlock = event.permutationToPlace.type.id;
    if (!watchFor.miniBlocks().includes(itemStackBlock)) return;

    const lastItemStack = DynamicPropertyLib.getString(player, 'dw623:lastInteractItemStack');
    if (itemStackBlock !== lastItemStack) {
        dev.alertLog.warn(`itemStackBlock (${itemStackBlock}) !== lastItemStack (${lastItemStack})`, debug);
        return;
    }

    const interactBlockLocation = DynamicPropertyLib.getVector(player, 'dw623:lastInteractBlockLocation');
    if (!interactBlockLocation) {
        dev.alertLog.warn(`lastInteractBlockLocation is missing`, debug);
        return;
    }
    else if (!Vector3Lib.isAdjacent(location, interactBlockLocation)) {
        dev.alertLog.warn(`location (${Vector3Lib.toString(location, 1, true)}) is not adjacent to lastBlockLocation (${Vector3Lib.toString(interactBlockLocation, 1, true)})`, debug);
        return;
    }

    const interactBlock = inBlock.dimension.getBlock(interactBlockLocation);
    if (!interactBlock) {
        dev.alertLog.warn(`interactBlock disappeared`, debug);
        return;
    }
    const interactBlockLocationStr = Vector3Lib.toString(interactBlock.location, 1, true);

    const faceLocation = DynamicPropertyLib.getVector(player, 'dw623:lastInteractFaceLocation');
    if (!faceLocation) {
        dev.alertLog.warn(`faceLocation  is missing`, debug);
        return;
    }
    const grid = new FaceLocationGrid(faceLocation, onBlockFace, player, false, debug);
    const faceLocationStr = Vector3Lib.toString(faceLocation, 2, true);
    const grid3 = grid.grid(3);
    const touched = grid3.x + (3 * grid3.y);

    if (debug) {
        const edge = grid.getEdgeName(3);

        dev.alertLog.log(`
\n§b****************************************
§aMini Block (BeforeOnPlayerPlace) Info§r
§b****************************************
§rItemStack Block: ${itemStackBlock}
§rInteract Block: §1${interactBlock.typeId}§r @ ${interactBlockLocationStr}  §dFace Loc: ${faceLocationStr}
§rPlayer:  Geo ${Vector3Lib.toString(grid.playerLocation, 0, true)} - Facing: §b${grid.playerCardinalDirection}
§rBlock Face: ${onBlockFace} - §6as ${grid.blockFace}
§rFace Grid3: ${Vector2Lib.toString(grid3, 0, true)} 
§rGrid #: §d${touched}§r - §d${edge} - §rNew deltas: x=${grid.xDelta}, y=${grid.yDelta}
    `);
        const states = event.permutationToPlace.getAllStates();
        for (const key in states) { dev.alertLog.log(`§eState: ${key}: §b${states[ key ]}`); }
    }

    if (touched === 4) return; // defined center per permutations - and first in state list
    //@ts-ignore
    let newPermutation = event.permutationToPlace.withState('dw623:mini_block_position_ptr', touched);
    event.cancel = true;
    system.run(() => {
        dimension.setBlockPermutation(location, newPermutation);
        //FIXME: sound
    });
}
//==============================================================================
// End of File
//==============================================================================