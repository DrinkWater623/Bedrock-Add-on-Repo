// blockLib.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Change Log:
    20250116a - Added isSameBlock
    20251108 - added isValidBlock and isInValidBlock
    20251202 - fix chatMsg import ref
========================================================================*/
import { Block, BlockPermutation, BlockVolume, Dimension,Direction, system } from "@minecraft/server";
import { ChatMsg } from "../tools/messageLib";
import { Vector3Lib } from "../tools/vectorClass";
import { blocksDotJson } from "../../common-data/blocks.json";
import { sound_definitions } from "../../common-data/sound_definitions";
import { woodBlocks } from "../../common-data/block-data";
//=============================================================================
/** @typedef {import("@minecraft/server").Vector2} Vector2 */
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** @typedef {import("@minecraft/server").VectorXZ} VectorXZ */
//=============================================================================
/**
     * 
     * @param {Block| undefined } block
     * @returns {boolean} 
     */
export function isInValidBlock(block){
    return !isValidBlock(block)
}
//=============================================================================
/**
     * 
     * @param {Block| undefined} block
     * @returns {boolean} 
     */
export function isValidBlock(block){
    if(!block) return false
    if (!block.isValid) return false
    return true
}
/**
 * @param {Block} block 
 * @param {string} blockTypeId 
 * @returns {Block | undefined}
 */
export function closestAdjacentBlockTypeId (block, blockTypeId) {

    const neighbors = [
        block.above(),
        block.below(),
        block.east(),
        block.west(),
        block.north(),
        block.south(),
    ];

    for (const nb of neighbors) {
        const id = nb?.typeId;
        if (id && id === blockTypeId) return nb;
    }

    //Found None
    return;
}
//===================================================================
/**
 * @param {Block} homeBlock
 * @param {string} lookForTypeId 
 * @returns {boolean}  
 */
export function isBlockAdjacentToTypeId (homeBlock, lookForTypeId) {

    const neighbors = [
        homeBlock.above(),
        homeBlock.below(),
        homeBlock.east(),
        homeBlock.west(),
        homeBlock.north(),
        homeBlock.south(),
    ];

    for (const nb of neighbors) {
        const id = nb?.typeId;
        if (id && id === lookForTypeId) return true;
    }
    return false;
}
//==============================================================================
/**
 * @summary Beta: dimension.getBlocks
 * @param {Dimension} dimension  
 * @param {Vector3} location 
 * @param {number} [radius=1] 
 * @param {import("@minecraft/server").BlockFilter} filter
 * @filter example: { includeTypes: [ "minecraft:air" ] } 
 * @param {boolean} [adjacentOnly=false] 
 * @returns {Vector3[]}
 */
export function blocksAround_locations (dimension, location, radius = 1, filter = {}, adjacentOnly = false) {
    const atBlock = dimension.getBlock(location);
    if (!atBlock) return [];
    if (radius === 0) radius = 1;

    const bottomOffset = atBlock?.offset({ x: radius * -1, y: radius * -1, z: radius * -1 });
    const topOffset = atBlock?.offset({ x: radius, y: radius, z: radius });
    if (!bottomOffset || !topOffset) return [];

    const blockVolumeDef = new BlockVolume(bottomOffset.location, topOffset.location);
    const blockVolumes = dimension.getBlocks(blockVolumeDef, filter, true);

    if (!adjacentOnly) return [ ...blockVolumes.getBlockLocationIterator() ];

    //x or y or z must be the same to be touch a face - plus symbol
    return [ ...blockVolumes.getBlockLocationIterator() ]
        .filter(loc => { return loc.x === atBlock.location.x || loc.y === atBlock.location.y || loc.z === atBlock.location.z; });
}
//=========================================================================
/**
 * @param {Dimension} dimension  
 * @param {Vector3} location 
 * @param {number} [radius=1]
 * @param {import("@minecraft/server").BlockFilter} filter 
 * @filter example: { includeTypes: [ "minecraft:air" ] } 
 * @returns {string[]}
 */
export function blocksAround_typeIds (dimension, location, radius = 1, filter = {}) {
    const blockLocations = blocksAround_locations(dimension, location, radius, filter);
    if (blockLocations.length === 0) return [];

    const blockTypeIds = [];

    for (let i = 0; i < blockLocations.length; i++) {
        const block = dimension.getBlock(blockLocations[ i ]);
        if (block) blockTypeIds.push(block.typeId);
    }

    return blockTypeIds;
}
//=========================================================================
/**
 * @param {Dimension} dimension  
 * @param {Vector3} location 
 * @param {number} [radius=1] 
 * @param {import("@minecraft/server").BlockFilter} filter 
 * @filter example: { includeTypes: [ "minecraft:air" ] }
 * @returns {{block: Block; offset: Vector3; radius: number;}[]}
 */
export function blocksAround_object (dimension, location, radius = 1, filter = {}) {
    const blockLocations = blocksAround_locations(dimension, location, radius, filter);
    if (blockLocations.length === 0) return [];

    const blockObjects = [];

    for (let i = 0; i < blockLocations.length; i++) {
        const block = dimension.getBlock(blockLocations[ i ]);

        if (block) blockObjects.push({
            block: block,
            offset: Vector3Lib.delta(location, block.location, 0, false),
            radius: 0
        });
    }

    blockObjects.forEach(b => { b.radius = Math.max(Math.abs(b.offset.x), Math.abs(b.offset.y), Math.abs(b.offset.z)); });
    return blockObjects;
}
//=========================================================================
/**
 * @param {Dimension} dimension  
 * @param {Vector3} location 
 * @param {number} [radius=1] 
 * @param {import("@minecraft/server").BlockFilter} filter 
 * @filter example: { includeTypes: [ "minecraft:air" ] }
 * @returns {Block[]}
 */
export function blocksAround (dimension, location, radius = 1, filter = {}) {
    const blockObjects = blocksAround_object(dimension, location, radius, filter);
    if (blockObjects.length === 0) return [];

    const blocks = blockObjects.filter(b => b.block instanceof Block).map(b => b.block);
    return blocks;
}
//=============================================================================
export class GetBlock {
    /**
     * 
     * @param {Block} block 
     * @param {Direction | string} blockFace
     * @param {boolean} [opposite=false] 
     * @param {boolean} [debug=false]  
     * @returns {Block | undefined}
     */
    static adjacent (block, blockFace, opposite = false, debug = false) {

        if (!block || !block.isValid) {
            return undefined;
        }

        blockFace = blockFace.toLowerCase();

        switch (blockFace) {
            case 'below':
            case 'down':
                return opposite ? block.above(1) : block.below(1);
                break;
            case 'above':
            case 'up':
                return opposite ? block.below(1) : block.above(1);
                break;
            case 'north':
                return opposite ? block.south(1) : block.north(1);
                break;
            case 'south':
                return opposite ? block.north(1) : block.south(1);
                break;
            case 'east':
                return opposite ? block.west(1) : block.east(1);
                break;
            case 'west':
                return opposite ? block.east(1) : block.west(1);
                break;
            default:
                return undefined;
        }
    }
    //=========================================================================
    /**
     * 
     * @param {string} typeId 
     * @param {string} [soundsLike=''] 
     * @returns {string}
     */
    static sound (typeId, soundsLike = '', debug = false) {
        const debugMsg = new ChatMsg('GetBlock.sound');
        let findSoundForId;

        if (soundsLike && soundsLike.startsWith('minecraft:'))
            findSoundForId = soundsLike.replace('minecraft:', '');
        else if (typeId.startsWith('minecraft:'))
            findSoundForId = typeId.replace('minecraft:', '');

        if (findSoundForId) {
            const foundBlock = blocksDotJson[ findSoundForId ];
            if (foundBlock && foundBlock.sound) {

                let placeSound = 'place.' + foundBlock.sound;
                if (sound_definitions[ placeSound ]) {
                    debugMsg.success(`Sound: ${placeSound}`, debug);
                    return placeSound;
                }

                placeSound = 'block.' + foundBlock.sound + '.place';
                if (sound_definitions[ placeSound ]) {
                    debugMsg.success(`Sound: ${placeSound}`, debug);
                    return placeSound;
                }

                //test one to change
                placeSound = 'dig.' + foundBlock.sound;
                if (sound_definitions[ placeSound ]) {
                    debugMsg.success(`Sound: ${placeSound}`, debug);
                    return placeSound;
                }

                placeSound = 'block.' + foundBlock.sound + '.dig';
                if (sound_definitions[ placeSound ]) {
                    debugMsg.success(`Sound: ${placeSound}`, debug);
                    return placeSound;
                }

                placeSound = 'hit.' + foundBlock.sound;
                if (sound_definitions[ placeSound ]) {
                    debugMsg.success(`Sound: ${placeSound}`, debug);
                    return placeSound;
                }

                placeSound = 'break.' + foundBlock.sound;
                if (sound_definitions[ placeSound ]) {
                    debugMsg.success(`Sound: ${placeSound}`, debug);
                    return placeSound;
                }

                placeSound = 'use.' + foundBlock.sound;
                if (sound_definitions[ placeSound ]) {
                    debugMsg.success(`Sound: ${placeSound}`, debug);
                    return placeSound;
                }

                debugMsg.warn('Did not find normal sound for block', debug);
            }
            else debugMsg.warn('No MC block given', debug);
        }

        if (woodBlocks.includes(typeId)) {
            debugMsg.warn('In woodBlocks', debug);

            if (typeId.includes('crimson') || typeId.includes('warped'))
                return 'place.nether_wood';

            if (typeId.includes('cherry'))
                return 'place.cherry_wood';

            if (typeId.includes('bamboo'))
                return 'place.bamboo_wood';

            return 'dig.wood';
        }
        /*
            dig.wood
            fall.wood
            "hit.wood"
            "land.wood"
            "step.wood"
            "use.wood"
        
            "break.nether_wood" 
            "fall.nether_wood"
            "hit.nether_wood"
            "place.nether_wood"
            "step.nether_wood"    
            
            "break.cherry_wood" 
            "fall.cherry_wood"
            "hit.cherry_wood"
            "place.cherry_wood"
            "step.cherry_wood"
    
            "break.bamboo_wood"
            "fall.bamboo_wood"
            "hit.bamboo_wood"
            "place.bamboo_wood"
            "step.bamboo_wood"
        */
        if (typeId.includes('stone'))
            return 'hit.stone';

        if (typeId.includes('soul_sand'))
            return 'use.soul_sand';

        if (typeId.endsWith('_sand') ||
            typeId.includes('_sand_')
        )
            return 'use.sand';

        if (typeId.includes('wool') ||
            typeId.includes('carpet')
        )
            return 'use.cloth';

        if (typeId.includes('gravel'))
            return 'use.gravel';

        if (typeId.includes('powder_snow'))
            return 'place.powder_snow';

        if (typeId.includes('powder'))
            return 'place.sand';

        if (typeId.includes('snow'))
            return 'use.snow';

        const base = typeId.split(':')[ 1 ];
        if (Object.keys(blocksDotJson).includes(base)) {
            const vb = blocksDotJson[ base ];
            if (vb) {
                const sound = vb.sound;
                if (sound)
                    return sound;
            }
        }

        return 'hit.stone';
    }
}
/**
 * 
 * @param {Block} block 
 * @param {Direction | string} blockFace 
 * @param {boolean} [opposite=false] 
 * @param {boolean} [debug=false] 
 * @returns {Block | undefined}
 */
export function getAdjacentBlock (block, blockFace, opposite = false, debug = false) {
    return GetBlock.adjacent(block, blockFace, opposite, debug);
}
//==============================================================================
export class GetBlockState {

    /**
     * 
     * @param {Block} block
     * @param {keyof import("@minecraft/vanilla-data").BlockStateSuperset} stateName
     * @param {('string'|'number'|'boolean')} expectedType 
     * @param {boolean} [fail=true]   
     * @returns 
     */
    static getBlockStateOLD (block, stateName, expectedType, fail = true) {

        if (!block || !block.isValid) {
            if (fail)
                throw new Error("Invalid Block");

            return;
        }

        const stateValue = block.permutation.getState(stateName);
        let errMsg = '';
        if (typeof stateValue != expectedType)
            errMsg = `${block.typeId} ${stateName} trait is not a ${expectedType}: ${stateValue}`;

        if (errMsg) {
            if (fail)
                throw new Error(errMsg);

            return undefined;
        }

        return stateValue;
    }
    // @ts-check
    /**
     * @param {Block} block
     * @param {keyof import("@minecraft/vanilla-data").BlockStateSuperset} stateName
     * @param {'string'|'number'|'boolean'} expectedType
     * @param {boolean} [fail=true]
     * @returns {string|number|boolean|undefined}
     */
    static getBlockState (block, stateName, expectedType, fail = true) {
        if (!block || !block.isValid) {
            if (fail) throw new Error("Invalid Block");
            return;
        }

        const perm = /** @type {import("@minecraft/server").BlockPermutation} */ (block.permutation);
        /** @type {unknown} */
        const stateValue = perm.getState(stateName);

        if (typeof stateValue !== expectedType) {
            const msg = `${block.typeId} ${String(stateName)} trait is not a ${expectedType}: ${stateValue}`;
            if (fail) throw new Error(msg);
            return undefined;
        }

        return /** @type {any} */ (stateValue);
    }

    //=========================================================================
    /**
     * 
     * @param {Block} block
     * @param {keyof import("@minecraft/vanilla-data").BlockStateSuperset} stateName
     * @param {boolean} [fail=true]   
     * @param {number} defaultValue      * 
     * @returns {number}
     */
    static number (block, stateName, fail = true, defaultValue = 0) {
        const retValue = GetBlockState.getBlockState(block, stateName, 'number', fail);

        //if not fail, return default value
        if (typeof retValue != 'number')
            return defaultValue;

        return retValue;
    }
    //=========================================================================
    /**
     * 
     * @param {Block} block
     * @param {keyof import("@minecraft/vanilla-data").BlockStateSuperset} stateName
     * @param {boolean} [fail=true]   
     * @param {string} defaultValue      * 
     * @returns {string}
     */
    static string (block, stateName, fail = true, defaultValue = '') {
        const retValue = GetBlockState.getBlockState(block, stateName, 'string', fail);

        //if not fail, return default value
        if (typeof retValue != 'string')
            return defaultValue;

        return retValue;
    }
    //=========================================================================
    /**
     * 
     * @param {Block} block
     * @param {keyof import("@minecraft/vanilla-data").BlockStateSuperset} stateName
     * @param {boolean} defaultValue      * 
     * @param {boolean} [fail=true]   
     * @returns {boolean}
     */
    static boolean (block, stateName, fail = true, defaultValue = false) {
        const retValue = GetBlockState.getBlockState(block, stateName, 'boolean', fail);

        //if not fail, return default value
        if (typeof retValue != 'boolean')
            return defaultValue;

        return retValue;
    }
}
/**
 * 
 * @param {Block} block
 * @param {keyof import("@minecraft/vanilla-data").BlockStateSuperset} stateName
 * @param {('string'|'number'|'boolean')} expectedType 
 * @param {boolean} [fail=true]   
 * @returns 
 */
export function getBlockState (block, stateName, expectedType, fail = true) {
    return GetBlockState.getBlockState(block, stateName, expectedType, fail);
}
//==============================================================================
export class GetBlockStates {
    /**
     * 
     * @param {Block} block
     * @param {('string'|'number'|'boolean'|undefined)} [stateValueTypeFilter =undefined]
     * @returns {undefined | Map<any,any>}
     */
    static getBlockStates (block, stateValueTypeFilter = undefined) {
        const blockStates = block.permutation.getAllStates;
        if (!blockStates) return undefined;

        const entries = new Map();
        let ctr = 0;
        for (const [ key, value ] of Object.entries(blockStates)) {

            if (!stateValueTypeFilter || typeof value == stateValueTypeFilter) {
                ctr++;
                entries.set(key, value);
            }
        }

        if (ctr) return entries;
        else return undefined;
    }
    /**
     * 
     * @param {Block} block
     * @returns {undefined | Map<any,number>}
     */
    static numbers (block) {
        return GetBlockStates.getBlockStates(block, 'number');
    }
    /**
     * 
     * @param {Block} block
     * @returns {undefined | Map<any,string>}
     */
    static strings (block) {
        return GetBlockStates.getBlockStates(block, 'string');
    }
    /**
     * 
     * @param {Block} block
     * @returns {undefined | Map<any,boolean>}
     */
    static booleans (block) {
        return GetBlockStates.getBlockStates(block, 'boolean');
    }
}
//==============================================================================
export class PlaceBlock {
    /**
     * 
     * @param {Block} block 
     * @param {string} typeId 
     * @param {string} [sound='']
     * @param {string} [soundsLike='']  
     * @returns {boolean}
     */
    static typeId (block, typeId, sound = '?', soundsLike = '') {

        if (!block.isValid) return false;

        if (sound == '?')
            sound = GetBlock.sound(typeId, soundsLike);

        system.run(() => {
            if (sound) block.dimension.playSound(sound, block.location);
            block.setType(typeId);
        });

        return true;
    }
    //=========================================================================
    /**
     * 
     * @param {Block} block 
     * @param {BlockPermutation} permutation
     * @param {string} [sound='?'] 
     * @param {string} [soundsLike=''] 
     */
    static permutation (block, permutation, sound = '?', soundsLike = '') {
        if (!block.isValid) return false;

        if (sound == '?') {
            sound = GetBlock.sound(permutation.type.id, soundsLike);
        }

        system.run(() => {
            if (sound) block.dimension.playSound(sound, block.location, { volume: 10 });
            block.setPermutation(permutation);
        });

        // TODO:  try????

        return true;
    }
    //=========================================================================
    /**
     * 
     * @param {Block} block 
     * @param {string} newTypeId 
     * @param {Record<string,string | number | boolean>} states
     * @param {string} [sound='']
     * @param {string} [soundsLike=''] 
     */
    static withStates (block, newTypeId, states, sound = '?', soundsLike = '') {
        if (Object.keys(states).length == 0) {
            return PlaceBlock.typeId(block, newTypeId, sound, soundsLike);
        }
        else {
            const permutation = BlockPermutation.resolve(newTypeId, states);
            return PlaceBlock.permutation(block, permutation, sound, soundsLike);
        }
    }
    //=========================================================================
    /**
     * 
     * @param {Block} block 
     * @param {string} newTypeId 
     * @param {keyof import("@minecraft/vanilla-data").BlockStateSuperset} stateName
     * @param {boolean | number | string} stateValue
     * @param {string} [sound='']
     * @param {string} [soundsLike=''] 
     */
    static withState (block, newTypeId, stateName, stateValue, sound = '?', soundsLike = '') {
        const permutation = BlockPermutation.resolve(newTypeId).withState(stateName, stateValue);
        return PlaceBlock.permutation(block, permutation, sound, soundsLike);
    }
}
/**
 * 
 * @param {Block} block_1 
 * @param {Block} block_2 
 * @returns {boolean}
 */
export function isSameBlock (block_1, block_2) {
    if (!block_1.isValid) return false;
    if (!block_2.isValid) return false;

    if (block_1.typeId != block_2.typeId) return false;

    return Vector3Lib.isSameLocation(block_1.location, block_2.location, false);
}
//==============================================================================
// End of File
//==============================================================================
