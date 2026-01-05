// blockComponents.js  F3
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T. (https://www.gnu.org/licenses/gpl-3.0.html)
URL: https://github.com/DrinkWater623
========================================================================
Change Log:
    20251217 - Updated debug alerts 
    20251223 - Updated all 3 to use the Block_Events class
========================================================================*/
import { BlockComponentPlayerPlaceBeforeEvent } from "@minecraft/server";
//==============================================================================
import { watchFor } from "./settings.js";
import { dev, emitters } from "./debug.js";
import { Block_Events } from "./common-stable/gameObjects/index.js";
import { defaultSoundId } from "./common-data/index.js";
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
const blockEvents = new Block_Events(emitters);
//==============================================================================
/**
 * Callback for Custom Component beforeOnPlayerPlace - Arrow Rotation
 * Rotates the arrow in 1 of 4 directions based on where player touched the block
 * when touching the sides.  Up/Down uses different states and player facing
 * @param {BlockComponentPlayerPlaceBeforeEvent} event 
 */
export function arrow_onPlace (event) {
    //TODO: this may not be needed as it cannot get here if not defined in block json
    if (!watchFor.aBlockList('arrow').includes(event.permutationToPlace.type.id)) return;

    const eventType = 'onPlace';
    const objectType = 'arrow';
    const blockStateName='minecraft:cardinal_direction'
    const soundId = watchFor.soundProfiles.get(event.block.typeId) ?? defaultSoundId;
    const debugOn = dev.isDebugBlockObjectEvent(objectType, eventType);

    event.cancel = blockEvents.onPlace_block_rotation_arrow(event, blockStateName, { soundId, debugOn });
    return;
}
//==============================================================================
/** 
 * Callback for Custom Component beforeOnPlayerPlace - 1/9th Bar Rotation
 * Places the bar in 1 of 6 positions around edges / center cross based on where player touched the block
 * @param {BlockComponentPlayerPlaceBeforeEvent} event 
 */
export function bar_onPlace (event) {
    //TODO: this may not be needed as it cannot get here if not defined in block json
    if (!watchFor.aBlockList('bar').includes(event.permutationToPlace.type.id)) return;

    const eventType = 'onPlace';
    const objectType = 'bar';
    const blockStateName='dw623:position_ptr'
    const soundId = watchFor.soundProfiles.get(event.block.typeId) ?? defaultSoundId;
    const debugOn = dev.isDebugBlockObjectEvent(objectType, eventType);

    event.cancel = blockEvents.onPlace_block_rotation_bar(event, blockStateName, { soundId, debugOn });
}
//==============================================================================
/**
 * Callback for Custom Component beforeOnPlayerPlace - 1/27th Mini Block Rotation
 * Places mini block in 1 of 9 tic tac toe spots based on where player touched the block
 * @param {BlockComponentPlayerPlaceBeforeEvent} event 
 * @param {string} objectType 
 * @param {number} rows 
 */
function mini_square_onPlace (event,objectType,rows) {
    //TODO: this may not be needed as it cannot get here if not defined in block json
    if(!watchFor.blocksTypeList().includes(objectType)) throw new Error(`mini_square_onPlace: Invalid objectType '${objectType}' passed.`)  ;
    if (!watchFor.aBlockList(objectType).includes(event.permutationToPlace.type.id)) return;

    const eventType = 'onPlace';    
    const blockStateName='dw623:faceLocationGrid_ptr'
    const soundId = watchFor.soundProfiles.get(event.block.typeId) ?? defaultSoundId;
    const debugOn = dev.isDebugBlockObjectEvent(objectType, eventType);

    event.cancel = blockEvents.onPlace_block_rotation_mini_square(event, rows,blockStateName, { soundId, debugOn });
}
//==============================================================================
/**
 * Callback for Custom Component beforeOnPlayerPlace - 1/27th Mini Block Rotation
 * Places mini block in 1 of 9 3x3 spots based on where player touched the block
 * @param {BlockComponentPlayerPlaceBeforeEvent} event 
 */
export function mini_block_onPlace (event) {
    mini_square_onPlace(event,'mini_block',3);
}
/**
 * Callback for Custom Component beforeOnPlayerPlace - 1/27th Mini Block Rotation
 * Places mini puck in 1 of 16 4x4 spots based on where player touched the block
 * @param {BlockComponentPlayerPlaceBeforeEvent} event 
 */
export function mini_puck_onPlace (event) {
    mini_square_onPlace(event,'mini_puck',4);
}
/**
 * Callback for Custom Component beforeOnPlayerPlace - 1/27th Mini Block Rotation
 * Places mini block in 1 of 64 8x8 spots based on where player touched the block
 * @param {BlockComponentPlayerPlaceBeforeEvent} event 
 */
export function mini_dot_onPlace (event) {
    mini_square_onPlace(event,'mini_dot',4);
}   
//==============================================================================
// End of File
//==============================================================================