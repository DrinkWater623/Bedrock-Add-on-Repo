//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20250105f - Added GetBlockState/GetBlock/PlaceBlock Classes
========================================================================*/
import { Block, BlockPermutation, Direction, system } from "@minecraft/server";
import { blocksDotJson } from "../common-data/blocks.json";
import { sound_definitions } from "../common-data/sound_definitions";
import { ChatMsg } from "./consoleClass";
import { woodBlocks } from "../common-data/block-data";
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

        if (!block || !block.isValid()) {
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
     * @param {string} stateName
     * @param {('string'|'number'|'boolean')} expectedType 
     * @param {boolean} [fail=true]   
     * @returns 
     */
    static getBlockState (block, stateName, expectedType, fail = true) {

        if (!block || !block.isValid()) {
            if (fail)
                throw new Error("Invalid Block");

            return;
        }

        const stateValue = block.permutation.getState(stateName);
        let errMsg = '';
        if (!stateValue) {
            errMsg = `${block.typeId} is missing valid ${stateName} state`;
        }
        else if (typeof stateValue != expectedType)
            errMsg = `${block.typeId} ${stateName} trait is not a string: ${stateValue}`;

        if (errMsg) {
            if (fail)
                throw new Error(errMsg);

            return undefined;
        }

        return stateValue;
    }
    //=========================================================================
    /**
     * 
     * @param {Block} block
     * @param {string} stateName
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
     * @param {string} stateName
     * @param {boolean} [fail=true]   
     * @param {string} defaultValue      * 
     * @returns {string}
     */
    static string (block, stateName, fail = true, defaultValue = '') {
        const retValue = GetBlockState.getBlockState(block, stateName, 'number', fail);

        //if not fail, return default value
        if (typeof retValue != 'string')
            return defaultValue;

        return retValue;
    }
    //=========================================================================
    /**
     * 
     * @param {Block} block
     * @param {string} stateName
     * @param {boolean} defaultValue      * 
     * @param {boolean} [fail=true]   
     * @returns {boolean}
     */
    static boolean (block, stateName, fail = true, defaultValue = false) {
        const retValue = GetBlockState.getBlockState(block, stateName, 'number', fail);

        //if not fail, return default value
        if (typeof retValue != 'boolean')
            return defaultValue;

        return retValue;
    }
}
/**
 * 
 * @param {Block} block
 * @param {string} stateName
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
     * @returns {undefined | Map}
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
     * @returns {undefined | Map}
     */
    static numbers (block) {
        return  GetBlockStates.getBlockStates(block, 'number');
    }
    /**
     * 
     * @param {Block} block
     * @returns {undefined | Map}
     */
    static strings (block) {
        return  GetBlockStates.getBlockStates(block, 'string');
    }
    /**
     * 
     * @param {Block} block
     * @returns {undefined | Map}
     */
    static booleans (block) {
        return  GetBlockStates.getBlockStates(block, 'boolean');
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

        if (!block.isValid()) return false;

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
        if (!block.isValid()) return false;

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
     * @param {Object} states
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
     * @param {string} stateName
     * @param {boolean | number | string} stateValue
     * @param {string} [sound='']
     * @param {string} [soundsLike=''] 
     */
    static withState (block, newTypeId, stateName, stateValue, sound = '?', soundsLike = '') {
        const permutation = BlockPermutation.resolve(newTypeId).withState(stateName, stateValue);
        return PlaceBlock.permutation(block, permutation, sound, soundsLike);
    }
}
//==============================================================================
// End of File
//==============================================================================
