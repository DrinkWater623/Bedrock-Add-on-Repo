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
import { Block, BlockComponentPlayerPlaceBeforeEvent, BlockPermutation, BlockVolume, Dimension, Direction, Player, system } from "@minecraft/server";
import { blocksDotJson } from "../../common-data/blocks.json";
import { woodBlocks } from "../../common-data/block-data";
import { sound_definitions } from "../../common-data/sound_definitions";
import { Vector2Lib, Vector3Lib } from "../tools/vectorClass";
import { DynamicPropertyLib } from "../tools/dynamicPropertyClass.js";
import { emitObjectInnards, listArray, listObjectInnards } from "../tools/objects";
import { FaceLocationGrid } from "./blockFace";
//=============================================================================
/** @typedef {import("@minecraft/server").Vector2} Vector2 */
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** @typedef {import("@minecraft/server").VectorXZ} VectorXZ */
/** @typedef {boolean | number | string} PermStateValue     */

//=============================================================================
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
            sound = Blocks.sound_get(typeId, soundsLike);

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
            sound = Blocks.sound_get(permutation.type.id, soundsLike);
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
export class Permutations {
    /**
     * @param {BlockPermutation | Block} input
     * @param {string} stateName
     * @returns {boolean|number|string|undefined}
     */
    static getState (input, stateName) {
        const perm = this.toPerm(input);
        if (!perm) return undefined;
        return /** @type {any} */ (perm).getState(stateName);
    }
    /**
    * @param {BlockPermutation | Block} input
    * @param {string} stateName
    * @param {boolean} defaultValue      
    * @returns {boolean}
    */
    static getBooleanState (input, stateName, defaultValue = false) {
        const retValue = this.getState(input, stateName);
        if (typeof retValue != 'boolean') return defaultValue;
        return retValue;
    }
    /**
    * @param {BlockPermutation | Block} input
    * @param {string} stateName
    * @param {number} defaultValue      * 
    * @returns {number}
    */
    static getNumberState (input, stateName, defaultValue = 0) {
        const retValue = this.getState(input, stateName);
        if (typeof retValue != 'number') return defaultValue;
        return retValue;
    }
    /**
    * @param {BlockPermutation | Block} input
    * @param {string} stateName
    * @param {string} defaultValue      * 
    * @returns {string}
    */
    static getStringState (input, stateName, defaultValue = '') {
        const retValue = this.getState(input, stateName);
        if (typeof retValue != 'string') return defaultValue;
        return retValue;
    }
    /**
     * @param {BlockPermutation | Block} input
     * @returns {Record<string,string|number|boolean> | undefined}
     */
    static getStates (input) {
        const perm = this.toPerm(input);
        if (!perm) return undefined;
        return perm?.getAllStates();
    }
    /**
    * @param {BlockPermutation | Block} input
    * @param {string} [title=''] 
    * @param {(...data: any[]) => void} [emit=console.warn] 
    * @returns {void}
    */
    static listStates (input, title = '', emit = console.warn) {
        const states = this.getStates(input);
        if (!states) return;
        emitObjectInnards(emit, states, { title, showTypes: true, sortKeys: true, indent: "==> " });
    }
    /**
     * @param {BlockPermutation | Block} input
     * @returns {string[] | undefined}
     */
    static getTags (input) {
        const perm = this.toPerm(input);
        return perm?.getTags();
    }
    /**
     * @param {BlockPermutation | Block} input
     * @param {string} state
     * @returns {boolean}
     */
    static hasState (input, state) {
        //can be boolean and false may trigger false negative, so use undefined
        return typeof this.getState(input, state) !== 'undefined';
    }
    /**
     * @param {BlockPermutation | Block} input
     * @param {string} tag
     * @returns {boolean}
     */
    static hasTag (input, tag) {
        const tags = this.getTags(input);
        if (!tags) return false;
        return tags.includes(tag);
    }
    /**
     * @param {BlockPermutation | Block} input
     * @returns {BlockPermutation | undefined}
     */
    static toPerm (input) {
        if (input instanceof Block) return input.permutation;
        return input;
    }
    /**
     * @param {BlockPermutation | Block} input
     * @param {string} stateName
     * @param {PermStateValue} value
     * @returns {BlockPermutation | undefined}
     */
    static withState (input, stateName, value) {
        const perm = this.toPerm(input);
        if (!perm) return undefined;
        return /** @type {any} */ (perm).withState(stateName, value);
    }

    /**
     * Apply multiple states by chaining withState calls.
     *
     * @param {BlockPermutation | Block} input
     * @param {Record<string, PermStateValue>} states
     * @returns {BlockPermutation | undefined}
     */
    static withStates (input, states) {
        let perm = this.toPerm(input);
        if (!perm) return undefined;

        for (const [ stateName, value ] of Object.entries(states)) {
            perm = /** @type {any} */ (perm).withState(stateName, value);
        }
        return perm;
    }
}
export class Blocks {
    /**
     * 
     * @param {Block} block 
     * @param {Direction | string} blockFace
     * @param {boolean} [opposite=false] 
     * @param {boolean} [debug=false]  
     * @returns {Block | undefined}
     */
    static adjacentBlock_get (block, blockFace, opposite = false, debug = false) {
        if (this.isInValid(block)) return undefined;

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
    /**
     * @param {any} input 
     * @returns 
     */
    static isBlock (input) { return (input)?.permutation !== undefined; }

    /**
     * @param {Block} block 
     * @returns {boolean}
     */
    static isValid (block) {
        return !(!block || !block.isValid);
    }
    /**
     * @param {Block} block 
     * @returns {boolean}
     */
    static isInValid (block) {
        return !this.isValid(block);
    }
    /**
     * 
     * @param {Block} block 
     * @param {string} typeId 
     * @param {string} [sound='']
     * @param {string} [soundsLike='']  
     * @returns {boolean}
     */
    static setTypeId (block, typeId, sound = '?', soundsLike = '') {

        if (!block.isValid) return false;

        if (sound == '?')
            sound = this.sound_get(typeId, soundsLike);

        system.run(() => {
            if (sound) block.dimension.playSound(sound, block.location);
            block.setType(typeId);
        });

        return true;
    }
    /**
     * 
     * @param {string} typeId 
     * @param {string} [soundsLike=''] 
     * @param {boolean} [debug=false] 
     * @returns {string}
     */
    static sound_get (typeId, soundsLike = '', debug = false) {
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
                    return placeSound;
                }

                placeSound = 'block.' + foundBlock.sound + '.place';
                if (sound_definitions[ placeSound ]) {
                    return placeSound;
                }

                //test one to change
                placeSound = 'dig.' + foundBlock.sound;
                if (sound_definitions[ placeSound ]) {
                    return placeSound;
                }

                placeSound = 'block.' + foundBlock.sound + '.dig';
                if (sound_definitions[ placeSound ]) {
                    return placeSound;
                }

                placeSound = 'hit.' + foundBlock.sound;
                if (sound_definitions[ placeSound ]) {
                    ;
                    return placeSound;
                }

                placeSound = 'break.' + foundBlock.sound;
                if (sound_definitions[ placeSound ]) {
                    return placeSound;
                }

                placeSound = 'use.' + foundBlock.sound;
                if (sound_definitions[ placeSound ]) {
                    return placeSound;
                }

            }
        }

        if (woodBlocks.includes(typeId)) {

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
    /**
    * @param {Block} block      
    * @param {string} title 
    * @param {boolean} [returnOnly=false] 
    * @returns {string|void}    */
    static blockInfo_show (block, title = "§dBlock Info:", returnOnly = false) {
        if (!block.isValid) return;

        let msg = '';
        if (title) msg = title;
        msg += `\n==> §aBlock typeId:§r ${block.typeId}`; //TODO: get display name from vanilla data
        msg += `\n==> §bBlock Location.:§r ${Vector3Lib.toString(block.location, 0, true, ',')}`;
        msg += `\n==> §bBlock Center :§r ${Vector3Lib.toString(block.center(), 1, true, ',')}`;

        msg += this.blockPermutationInfo_show(block.permutation, `${title} - Permutation`, true);

        //FIXME:  is this needed...  test later to see the info in there
        //const item = block.getItemStack()
        //if (item) this.itemInfo(item,chatSend,`${title} - ItemStack`,true)
        if (returnOnly) return msg;
        console.warn(msg);
    }
    /**
     * @param {Block | BlockPermutation} input       
     * @param {string} title 
    * @param {boolean} [returnOnly=false] 
    * @returns {string|void}
     */
    static blockPermutationInfo_show (input, title = "§eBlock Permutation Info:", returnOnly = false) {

        const permutation = input instanceof Block ? input.permutation : input;
        const tags = permutation.getTags();
        const states = permutation.getAllStates();
        let msg = '';

        if (!(tags.length || states.length)) return;

        if (title) msg += title;
        msg += `\n${title ? '==> ' : ''}§bBlock Permutation type.id:§r ${input.type.id}`;

        if (tags.length)
            tags.forEach((v, i) => { msg += `\n==> §bTag[${i}]:§r ${v}`; });

        if (states.length)
            Object.entries(states).forEach(([ k, v ]) => { msg += `\n==> §bState:§r ${k} = ${v}`; });

        if (returnOnly) return msg;
        console.warn(msg);
    }
}