//@ts-check
import { BlockComponentPlayerPlaceBeforeEvent, system, Direction } from "@minecraft/server";
//==============================================================================
import { alertLog, chatLog, watchFor } from "./settings.js";
import { Vector2Lib, Vector3Lib } from "./common-stable/vectorClass.js";
import { FaceLocationGrid, } from "./common-stable/blockFace.js";
import { DynamicPropertyLib } from "./common-stable/dynamicPropertyClass.js";
import { devDebug } from "./helpers/fn-debug.js";
//==============================================================================
/**
 * @typedef {'north' | 'south' | 'east' | 'west'} BlockSides  
 * @typedef {'up'|'down'|'north'|'south'|'east'|'west'} BlockFaces
 * @typedef {'Up'|'Down'|'North'|'South'|'East'|'West'} BlockFacesTitle
 **/
//==============================================================================
/**
 * 
 * @param {BlockComponentPlayerPlaceBeforeEvent} event 
 */
export function lightArrow_onPlace (event) {
    const debug = false;
    const player = event.player;
    if (!player || !player.isValid) return;

    const { block: inBlock, face: onBlockFace } = event;
    if (!inBlock.isValid) return;

    const { typeId, location, dimension } = inBlock;
    const itemStackBlock = event.permutationToPlace.type.id;
    if (!watchFor.arrowBlocks().includes(itemStackBlock)) return;

    const lastItemStack = DynamicPropertyLib.getString(player, 'dw623:lastInteractItemStack');
    if (itemStackBlock !== lastItemStack) {
        chatLog.warn(`itemStackBlock (${itemStackBlock}) !== lastItemStack (${lastItemStack})`, devDebug.debugBlockSubscriptions);
        return;
    }

    const interactBlockLocation = DynamicPropertyLib.getVector(player, 'dw623:lastInteractBlockLocation');
    if (!interactBlockLocation) {
        chatLog.warn(`lastInteractBlockLocation is missing`, devDebug.debugBlockSubscriptions);
        return;
    }
    else if (!Vector3Lib.isAdjacent(location, interactBlockLocation)) {
        chatLog.warn(`location (${Vector3Lib.toString(location, 1, true)}) is not adjacent to lastBlockLocation (${Vector3Lib.toString(interactBlockLocation, 1, true)})`, devDebug.debugBlockSubscriptions);
        return;
    }

    const interactBlock = inBlock.dimension.getBlock(interactBlockLocation);
    if (!interactBlock) {
        chatLog.warn(`interactBlock disappeared`, devDebug.debugBlockSubscriptions);
        return;
    }
    const interactBlockLocationStr = Vector3Lib.toString(interactBlock.location, 1, true);

    const faceLocation = DynamicPropertyLib.getVector(player, 'dw623:lastInteractFaceLocation');
    if (!faceLocation) {
        chatLog.warn(`faceLocation  is missing`);
        return;
    }
    const faceLocationStr = Vector3Lib.toString(faceLocation, 1, true);

    const grid = new FaceLocationGrid(faceLocation, onBlockFace, player, true);
    const grid3 = grid.grid(3);
    const touched = grid.getEdgeName(3);

    chatLog.log(`
        \n§cBeforeOnPlayerPlace (cc) Info§r
        \nInteract Block: ${interactBlock.typeId} @ ${interactBlockLocationStr}
        \nItemStack Block: ${itemStackBlock}
        \nFace: ${event.face}
        \nFace Location (from Interact): ${faceLocationStr}
        \nFace Grid3: ${Vector2Lib.toString(grid3, 0, true)} = ${touched}                   
    `);

    if ([ 'Up', "Down" ].includes(event.face)) return;
    if (grid3.y !== 1) return; //middle row
    if (grid3.x == 1) return; //middle column up/down
    if (![ 'north', 'south', 'east', 'west' ].includes(touched)) return;

    //reset position    
    const states = event.permutationToPlace.getAllStates();
    for (const key in states) { chatLog.log(`§estate: ${key}: §b${states[ key ]}`, devDebug.debugBlockSubscriptions); }
    let newPermutation = event.permutationToPlace.withState('minecraft:cardinal_direction', touched);
    event.cancel = true;
    system.run(() => {
        dimension.setBlockPermutation(location, newPermutation);
    });
}
//==============================================================================
/**
 * 
 * @param {BlockComponentPlayerPlaceBeforeEvent} event 
 */
export function lightBar_onPlace (event) {
    const debug = false;
    const player = event.player;
    if (!player || !player.isValid) return;

    const { block: inBlock, face: onBlockFace } = event;
    if (!inBlock.isValid) return;

    const { typeId, location, dimension } = inBlock;
    const itemStackBlock = event.permutationToPlace.type.id;
    if (!watchFor.barBlocks().includes(itemStackBlock)) return;

    const lastItemStack = DynamicPropertyLib.getString(player, 'dw623:lastInteractItemStack');
    if (itemStackBlock !== lastItemStack) {
        chatLog.warn(`itemStackBlock (${itemStackBlock}) !== lastItemStack (${lastItemStack})`, devDebug.debugBlockSubscriptions);
        return;
    }

    const interactBlockLocation = DynamicPropertyLib.getVector(player, 'dw623:lastInteractBlockLocation');
    if (!interactBlockLocation) {
        chatLog.warn(`lastInteractBlockLocation is missing`, devDebug.debugBlockSubscriptions);
        return;
    }
    else if (!Vector3Lib.isAdjacent(location, interactBlockLocation)) {
        chatLog.warn(`location (${Vector3Lib.toString(location, 1, true)}) is not adjacent to lastBlockLocation (${Vector3Lib.toString(interactBlockLocation, 1, true)})`, devDebug.debugBlockSubscriptions);
        return;
    }

    const interactBlock = inBlock.dimension.getBlock(interactBlockLocation);
    if (!interactBlock) {
        chatLog.warn(`interactBlock disappeared`, devDebug.debugBlockSubscriptions);
        return;
    }
    const interactBlockLocationStr = Vector3Lib.toString(interactBlock.location, 1, true);

    const faceLocation = DynamicPropertyLib.getVector(player, 'dw623:lastInteractFaceLocation');
    if (!faceLocation) {
        chatLog.warn(`faceLocation  is missing`, devDebug.debugBlockSubscriptions);
        return;
    }
    const faceLocationStr = Vector3Lib.toString(faceLocation, 1, true);

    const grid = new FaceLocationGrid(faceLocation, onBlockFace, player, false);
    const grid3 = grid.grid(3);
    const grid6 = grid.grid(6);
    const grid8 = grid.grid(8);
    const touched3 = grid3.x + (3 * grid3.y);
    const touched6 = grid6.x + (6 * grid6.y);
    const touched8 = grid8.x + (8 * grid8.y);
    const edge3 = grid.getEdgeName(3);   
    const edge6 = grid.getEdgeName(6);   
    const edge8 = grid.getEdgeName(8);   

    chatLog.log(`\n§1****************************************
§aLight Bar (cc) Info§r
§1****************************************
        \n§rItemStack Block: ${itemStackBlock}
        \n§rInteract Block: §1${interactBlock.typeId}§r @ ${interactBlockLocationStr}  §dFace Loc: ${faceLocationStr}
        \n§rPlayer:  Geo ${Vector3Lib.toString(grid.playerLocation, 0, true)} - Facing: §b${grid.playerCardinalDirection}
        \n§rBlock Face: ${onBlockFace} - §6as ${grid.blockFace}
        \n§rFace Grid-3: ${Vector2Lib.toString(grid3, 0, true)}§r Grid-3 #: §d${touched3}§r - §d${edge3}
        \n§rFace Grid-6: ${Vector2Lib.toString(grid6, 0, true)}§r Grid-6 #: §d${touched6}§r - §d${edge6}
        \n§rFace Grid-8: ${Vector2Lib.toString(grid8, 0, true)}§r Grid-8 #: §d${touched8}§r - §d${edge8}
    `,devDebug.watchMiniBlock);

    let lightBarPosition = -1
    // if (grid3.x == 2 && grid3.y == 2) return; // center - default
    // if (grid3.x == 2 && grid3.y == 2) return; // center - default

    // if (grid3.x == 1) return; //middle column up/down
    // if (![ 'north', 'south', 'east', 'west' ].includes(touched3)) return;

    // //reset position    
    // const states = event.permutationToPlace.getAllStates();
    // for (const key in states) { chatLog.log(`§estate: ${key}: §b${states[ key ]}`, devDebug.debugBlockSubscriptions); }
    // let newPermutation = event.permutationToPlace.withState('minecraft:cardinal_direction', touched3);
    // event.cancel = true;
    // system.run(() => {
    //     dimension.setBlockPermutation(location, newPermutation);
    // });
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
    const debug = false;
    const player = event.player;
    if (!player || !player.isValid) return;

    const { block: inBlock, face: onBlockFace } = event;
    if (!inBlock.isValid) return;

    const { typeId, location, dimension } = inBlock;
    const itemStackBlock = event.permutationToPlace.type.id;
    if (!watchFor.miniBlocks().includes(itemStackBlock)) return;

    const lastItemStack = DynamicPropertyLib.getString(player, 'dw623:lastInteractItemStack');
    if (itemStackBlock !== lastItemStack) {
        chatLog.warn(`itemStackBlock (${itemStackBlock}) !== lastItemStack (${lastItemStack})`, devDebug.debugBlockSubscriptions);
        return;
    }

    const interactBlockLocation = DynamicPropertyLib.getVector(player, 'dw623:lastInteractBlockLocation');
    if (!interactBlockLocation) {
        chatLog.warn(`lastInteractBlockLocation is missing`, devDebug.debugBlockSubscriptions);
        return;
    }
    else if (!Vector3Lib.isAdjacent(location, interactBlockLocation)) {
        chatLog.warn(`location (${Vector3Lib.toString(location, 1, true)}) is not adjacent to lastBlockLocation (${Vector3Lib.toString(interactBlockLocation, 1, true)})`, devDebug.debugBlockSubscriptions);
        return;
    }

    const interactBlock = inBlock.dimension.getBlock(interactBlockLocation);
    if (!interactBlock) {
        chatLog.warn(`interactBlock disappeared`, devDebug.debugBlockSubscriptions);
        return;
    }
    const interactBlockLocationStr = Vector3Lib.toString(interactBlock.location, 1, true);

    const faceLocation = DynamicPropertyLib.getVector(player, 'dw623:lastInteractFaceLocation');
    if (!faceLocation) {
        chatLog.warn(`faceLocation  is missing`);
        return;
    }
    const faceLocationStr = Vector3Lib.toString(faceLocation, 2, true);

    const grid = new FaceLocationGrid(faceLocation, onBlockFace, player, false);
    const grid3 = grid.grid(3);
    const touched = grid3.x + (3 * grid3.y);
    const edge = grid.getEdgeName(3);   

    chatLog.log(`\n§1****************************************
§aBeforeOnPlayerPlace (cc) Info§r
§1****************************************
        \n§rItemStack Block: ${itemStackBlock}
        \n§rInteract Block: §1${interactBlock.typeId}§r @ ${interactBlockLocationStr}  §dFace Loc: ${faceLocationStr}
        \n§rPlayer:  Geo ${Vector3Lib.toString(grid.playerLocation, 0, true)} - Facing: §b${grid.playerCardinalDirection}
        \n§rBlock Face: ${onBlockFace} - §6as ${grid.blockFace}
        \n§rFace Grid3: ${Vector2Lib.toString(grid3, 0, true)} 
        \n§rGrid #: §d${touched}§r - §d${edge} - §rNew deltas: x=${grid.xDelta}, y=${grid.yDelta}
    `,devDebug.watchMiniBlock);

    if (touched === 4) return; // defined center per permutations - and first in state list

    //reset position    
    // const states = event.permutationToPlace.getAllStates();
    //for (const key in states) { chatLog.log(`§estate: ${key}: §b${states[ key ]}`, devDebug.watchBlockSubscriptions); }
    //@ts-ignore
    let newPermutation = event.permutationToPlace.withState('dw623:mini_block_position_geo', touched);
    event.cancel = true;
    system.run(() => {
        dimension.setBlockPermutation(location, newPermutation);
        //FIXME: sound
    });
}
//==============================================================================
// End of File
//==============================================================================