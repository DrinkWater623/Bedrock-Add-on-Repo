//@ts-check
import { BlockComponentPlayerPlaceBeforeEvent, system } from "@minecraft/server";
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

    const { typeId, location } = inBlock;
    const itemStackBlock = event.permutationToPlace.type.id;
    if (!watchFor.blockList().includes(itemStackBlock)) return;

    const lastItemStack = DynamicPropertyLib.getString(player, 'dw623:lastInteractItemStack');
    if (itemStackBlock !== lastItemStack) {
        chatLog.warn(`itemStackBlock (${itemStackBlock}) !== lastItemStack (${lastItemStack})`, devDebug.watchBlockSubscriptions);
        return;
    }

    const interactBlockLocation = DynamicPropertyLib.getVector(player, 'dw623:lastInteractBlockLocation');
    if (!interactBlockLocation) {
        chatLog.warn(`lastInteractBlockLocation is missing`, devDebug.watchBlockSubscriptions);
        return;
    }
    else if (!Vector3Lib.isAdjacent(location, interactBlockLocation)) {
        chatLog.warn(`location (${Vector3Lib.toString(location, 1, true)}) is not adjacent to lastBlockLocation (${Vector3Lib.toString(interactBlockLocation, 1, true)})`, devDebug.watchBlockSubscriptions);
        return;
    }

    const interactBlock = inBlock.dimension.getBlock(interactBlockLocation);
    if (!interactBlock) {
        chatLog.warn(`interactBlock disappeared`, devDebug.watchBlockSubscriptions);
        return;
    }
    const interactBlockLocationStr = Vector3Lib.toString(interactBlock.location, 1, true);

    const faceLocation = DynamicPropertyLib.getVector(player, 'dw623:lastInteractFaceLocation');
    if (!faceLocation) {
        chatLog.warn(`faceLocation  is missing`);
        return;
    }
    const faceLocationStr = Vector3Lib.toString(faceLocation, 1, true);

    const grid = new FaceLocationGrid(faceLocation, onBlockFace, true);
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
    for (const key in states) { chatLog.log(`§estate: ${key}: §b${states[ key ]}`, devDebug.watchBlockSubscriptions); }
    let newPermutation = event.permutationToPlace.withState('minecraft:cardinal_direction', touched);
    event.cancel = true;
    system.run(() => {        
        player.dimension.setBlockPermutation(inBlock.location, newPermutation);
    });
}
//==============================================================================
// End of File
//==============================================================================