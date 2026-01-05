// blockLib.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T.
URL: https://github.com/DrinkWater623
========================================================================
Change Log:
    20250116a - Added isSameBlock
    20251108 - added isValidBlock and isInValidBlock
    20251202 - fix chatMsg import ref
    20260103 - added a bunch of stuff with Chatty
    20260104 - reOrg
========================================================================*/
import { Block, BlockPermutation, BlockTypes, BlockVolume, Dimension, Direction, system } from "@minecraft/server";
import { blocksDotJson } from "../../common-data/blocks.json";
import { sound_definitions } from "../../common-data/sound_definitions";
import { Vector3Lib } from "../tools/vectorClass";
import { addNameSpace, dedupeArrayInPlace, emitObjectInnards } from "../tools/objects";
import { mcNameSpace } from "../../common-data/globalConstantsLib.js";
//=============================================================================
/** @typedef {import("@minecraft/server").Vector2} Vector2 */
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** @typedef {import("@minecraft/server").VectorXZ} VectorXZ */
/** @typedef {boolean | number | string} PermStateValue     */
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

        if (!block || !block.isValid) return false; // or return;

        typeId = addNameSpace(typeId);

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
        if (!block || !block.isValid) return false;

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
     * @param {Block} block_1 
     * @param {Block} block_2 
     * @returns {boolean}
     */
    static isSameBlock (block_1, block_2) {
        if (!block_1 || !block_1.isValid) return false;
        if (!block_2 || !block_2.isValid) return false;

        if (block_1.typeId != block_2.typeId) return false;

        return Vector3Lib.isSameLocation(block_1.location, block_2.location, false);
    }
    //================================================================================================
    /**
     * Normalize ids in-place (optional namespacing) + de-dupe.
     * Your rule: if verify is true, namespacing must be true.
     *
     * @param {string[]} a
     * @param {{ addNamespace?: boolean, verify?: boolean, removeEmpty?: boolean }} [opts]
     * @returns {string[]}
     */
    static normalizeBlockIdsInPlace (a, opts = {}) {
        const verify = opts.verify ?? false;
        const addNamespace = (opts.addNamespace ?? true) || verify;
        const removeEmpty = opts.removeEmpty ?? true;

        // One pass: trim + optional removeEmpty + optional namespace
        let w = 0;
        for (let i = 0; i < a.length; i++) {
            let s = String(a[ i ] ?? "").trim();
            if (removeEmpty && !s) continue;
            if (addNamespace) s = addNameSpace(s); // or addNameSpaceInPlace if you prefer two-pass
            if (verify) {
                const fixed = BlockTypeIds.coerceToValidTypeId(s);
                if (!fixed) continue;    // remove invalid
                s = fixed;
            }

            a[ w++ ] = s;
        }
        a.length = w;

        dedupeArrayInPlace(a);

        return a;
    }
    /**
     * Filter invalid ids in-place using current-world registry.
     * @param {string[]} a
     * @returns {string[]}
     */
    static filterValidBlockTypeIdsInPlace (a) {
        this.normalizeBlockIdsInPlace(a, { addNamespace: true, verify: false, removeEmpty: true });
        return this.purgeInvalidBlockTypeIdsInPlace_auto(a);
    }
    /**
     * Purge invalid block typeIds in-place (FAST).
     * Does NOT normalize, namespace, or dedupe.
     *
     * @param {string[]} a
     * @param {Set<string>} validSet  // usually Blocks.getValidBlockTypeIdSet()
     * @returns {string[]} same array instance
     */
    static purgeInvalidBlockTypeIdsInPlace (a, validSet) {
        let w = 0;
        for (let r = 0; r < a.length; r++) {
            const id = a[ r ];
            if (validSet.has(id)) a[ w++ ] = id;
        }
        a.length = w;
        return a;
    }
    /**
     * Purge invalid block typeIds in-place (FAST).
     * Uses cached valid set.
     *
     * @param {string[]} a
     * @returns {string[]}
     */
    static purgeInvalidBlockTypeIdsInPlace_auto (a) {
        return this.purgeInvalidBlockTypeIdsInPlace(a, BlockTypeIds.getValidBlockTypeIdSet());
    }

    //================================================================================================
    /**
     * Add slab variants in-place.
     * - only adds if valid (via world registry) when verify=true
     * - includes your plural hack: "_bricks" → "_brick_slab" attempt, etc.
     *
     * @param {string[]} a
     * @param {{ verify?: boolean, pluralHack?: boolean }} [opts]
     * @returns {string[]}
     */
    static addSlabVariantsInPlace (a, opts = {}) {
        const verify = opts.verify ?? true;
        const pluralHack = opts.pluralHack ?? true;

        // 1) Normalize ONLY (no validity policing yet)
        this.normalizeBlockIdsInPlace(a, { addNamespace: true, verify: false, removeEmpty: true });

        // 2) Snapshot raw strings for derivation (may contain invalid ids)
        const sourceRaw = a.slice();

        // 3) Police the live array NOW (coerce + drop invalid) so a is always safe
        if (verify) {
            this.normalizeBlockIdsInPlace(a, { addNamespace: true, verify: true, removeEmpty: true });
        }

        const validSlabSet = verify ? BlockTypeIds.getValidSlabTypeIdSet() : null;
        const existing = new Set(a);

        // Use BOTH raw + coerced sources for derivation
        const sources = verify ? [ sourceRaw, a ] : [ sourceRaw ];

        for (const src of sources) {
            for (const b of src) {
                if (!b || b.endsWith("_slab")) continue;

                /** @type {string[]} */
                const candidates = [ `${b}_slab` ];

                // plural hack: bricks -> brick_slab, tiles -> tile_slab, etc.
                if (pluralHack && b.endsWith("s")) {
                    candidates.push(`${b.slice(0, -1)}_slab`);
                }

                // block hack: purpur_block -> purpur_slab, magma_block -> magma_slab, etc.
                if (b.endsWith("_block")) {
                    candidates.push(`${b.slice(0, -6)}_slab`);
                }

                for (const slabId of candidates) {
                    if (existing.has(slabId)) continue;
                    if (validSlabSet && !validSlabSet.has(slabId)) continue;

                    a.push(slabId);
                    existing.add(slabId);
                }
            }
        }

        dedupeArrayInPlace(a);
        return a;
    }
    //================================================================================================
    /**
    * @param {Block} block      
    * @param {string} title 
    * @param {boolean} [returnOnly=false] 
    * @returns {string|void}    */
    static blockInfo_show (block, title = "§dBlock Info:", returnOnly = false) {
        if (!block || !block.isValid) return;

        let msg = '';
        if (title) msg = title;
        msg += `\n==> §aBlock typeId:§r ${block.typeId}`; //TODO: get display name from vanilla data
        msg += `\n==> §bBlock Location.:§r ${Vector3Lib.toString(block.location, 0, true, ',')}`;
        msg += `\n==> §bBlock Center :§r ${Vector3Lib.toString(block.center(), 1, true, ',')}`;

        msg += this.blockPermutationInfo_show(block.permutation, `${title} - Permutation`, true) ?? '';

        //FIXME:  is this needed...  test later to see the info in there
        //const item = block.getItemStack()
        //if (item) this.itemInfo(item,chatSend,`${title} - ItemStack`,true)
        if (returnOnly) return msg;
        console.warn(msg);
    }
    //================================================================================================
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

        const hasStates = Object.keys(states).length > 0;
        if (!(tags.length || hasStates)) return returnOnly ? "" : undefined;

        let msg = "";
        if (title) msg += title;

        msg += `\n${title ? '==> ' : ''}§bBlock Permutation type.id:§r ${permutation.type.id}`;

        if (tags.length) {
            tags.forEach((v, i) => { msg += `\n==> §bTag[${i}]:§r ${v}`; });
        }

        if (hasStates) {
            Object.entries(states).forEach(([ k, v ]) => { msg += `\n==> §bState:§r ${k} = ${v}`; });
        }

        if (returnOnly) return msg;
        console.warn(msg);
    }
    //================================================================================================
    /**
 * True if every block at (x,z) from yMin..yMax is air.
 * @param {Dimension} dimension
 * @param {number} x
 * @param {number} z
 * @param {number} y1
 * @param {number} y2
 * @param {{ treatCaveAirAsAir?: boolean }} [opts]
 * @returns {boolean}
 */
    static isAirColumnClear (dimension, x, z, y1, y2, opts = {}) {
        const yMin = Math.min(y1, y2);
        const yMax = Math.max(y1, y2);

        const treatCaveAirAsAir = opts.treatCaveAirAsAir ?? true;

        /** @type {Set<string>} */
        const airIds = new Set([ "minecraft:air" ]);
        if (treatCaveAirAsAir) {
            // Only count these if they exist in this world registry
            const valid = BlockTypeIds.getValidBlockTypeIdSet();
            for (const id of [ "minecraft:cave_air", "minecraft:void_air" ]) {
                if (valid.has(id)) airIds.add(id);
            }
        }

        for (let y = yMin; y <= yMax; y++) {
            const b = dimension.getBlock({ x, y, z });
            if (!b || !b.isValid) return false;
            if (!airIds.has(b.typeId)) return false;
        }
        return true;
    }
    /**
     * @param {Block} block 
     * @param {string} blockTypeId 
     * @returns {Block | undefined}
     */
    static closestAdjacentBlockTypeId (block, blockTypeId) {

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
    static isBlockAdjacentToTypeId (homeBlock, lookForTypeId) {

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
    static blocksAround_locations (dimension, location, radius = 1, filter = {}, adjacentOnly = false) {
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
    static blocksAround_typeIds (dimension, location, radius = 1, filter = {}) {
        const blockLocations = this.blocksAround_locations(dimension, location, radius, filter);
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
    static blocksAround_object (dimension, location, radius = 1, filter = {}) {
        const blockLocations = this.blocksAround_locations(dimension, location, radius, filter);
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
    static blocksAround (dimension, location, radius = 1, filter = {}) {
        const blockObjects = this.blocksAround_object(dimension, location, radius, filter);
        if (blockObjects.length === 0) return [];

        const blocks = blockObjects.filter(b => b.block instanceof Block).map(b => b.block);
        return blocks;
    }
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

        blockFace = String(blockFace).toLowerCase();

        switch (blockFace) {
            case 'below':
            case 'down':
                return opposite ? block.above(1) : block.below(1);
            case 'above':
            case 'up':
                return opposite ? block.below(1) : block.above(1);
            case 'north':
                return opposite ? block.south(1) : block.north(1);
            case 'south':
                return opposite ? block.north(1) : block.south(1);
            case 'east':
                return opposite ? block.west(1) : block.east(1);
            case 'west':
                return opposite ? block.east(1) : block.west(1);
            default:
                return undefined;
        }
    }
    /**
     * 
     * @param {string} input_typeId 
     * @param {string} [soundsLike=''] 
     * @param {boolean} [debug=false] 
     * @returns {string}
     */
    static sound_get (input_typeId, soundsLike = '', debug = false) {
        let findSoundForId;

        const typeId = addNameSpace(input_typeId);

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

        if (BlockTypeIds.getWoodenBlockTypeIds().includes(typeId)) {

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
        const vb = blocksDotJson[ base ];
        if (vb) {
            const sound = vb.sound;
            if (sound) return sound;
        }
        return 'hit.stone';
    }
    //==============================================================================
    /**
     * 
     * @param {Block} block 
     * @param {string} typeId 
     * @param {string} [sound='']
     * @param {string} [soundsLike='']  
     * @returns {boolean}
     */
    static setTypeId (block, typeId, sound = '?', soundsLike = '') {

        if (!block || !block.isValid) return false;

        typeId = addNameSpace(typeId);

        if (sound == '?')
            sound = this.sound_get(typeId, soundsLike);

        system.run(() => {
            if (sound) block.dimension.playSound(sound, block.location);
            block.setType(typeId);
        });

        return true;
    }
    //==============================================================================
}
//==============================================================================
export class BlockTypeIds {
    //========================================
    /* Cached Sets and Arrays - Built below */
    //========================================

    // ALL
    static #validBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #validBlockTypeIds = /** @type {string[] | null} */ (null);

    //Vanilla Only
    static #validVanillaBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #validVanillaBlockTypeIds = /** @type {string[] | null} */ (null);

    //Custom from Add-ons
    static #validCustomBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #validCustomBlockTypeIds = /** @type {string[] | null} */ (null);

    //Slabs
    static #validSlabTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #validSlabTypeIds = /** @type {string[] | null} */ (null);
    static #validVanillaSlabTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #validVanillaSlabTypeIds = /** @type {string[] | null} */ (null);

    // Block-data (cached)
    static #climbableBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #climbableBlockTypeIds = /** @type {string[] | null} */ (null);
    static #overworldClimbableBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #overworldClimbableBlockTypeIds = /** @type {string[] | null} */ (null);
    static #netherClimbableBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #netherClimbableBlockTypeIds = /** @type {string[] | null} */ (null);

    // Wood "types" (strings like "oak", "spruce"...)
    static #woodTypeSet = /** @type {Set<string> | null} */ (null);
    static #woodTypes = /** @type {string[] | null} */ (null);
    static #overworldWoodTypeSet = /** @type {Set<string> | null} */ (null);
    static #overworldWoodTypes = /** @type {string[] | null} */ (null);
    static #netherWoodTypeSet = /** @type {Set<string> | null} */ (null);
    static #netherWoodTypes = /** @type {string[] | null} */ (null);

    // Wood blocks
    static #woodenBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #woodenBlockTypeIds = /** @type {string[] | null} */ (null);
    static #overworldWoodenBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #overworldWoodenBlockTypeIds = /** @type {string[] | null} */ (null);
    static #netherWoodenBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #netherWoodenBlockTypeIds = /** @type {string[] | null} */ (null);

    // Nature + misc
    static #gravityBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #gravityBlockTypeIds = /** @type {string[] | null} */ (null);

    static #leafBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #leafBlockTypeIds = /** @type {string[] | null} */ (null);
    static #logBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #logBlockTypeIds = /** @type {string[] | null} */ (null);
    static #saplingBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #saplingBlockTypeIds = /** @type {string[] | null} */ (null);
    static #plankBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #plankBlockTypeIds = /** @type {string[] | null} */ (null);

    // By region
    static #netherLogBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #netherLogBlockTypeIds = /** @type {string[] | null} */ (null);
    static #overworldLogBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #overworldLogBlockTypeIds = /** @type {string[] | null} */ (null);
    static #overworldPlankBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #overworldPlankBlockTypeIds = /** @type {string[] | null} */ (null);
    static #netherPlankBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #netherPlankBlockTypeIds = /** @type {string[] | null} */ (null);

    // Building parts
    static #stairBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #stairBlockTypeIds = /** @type {string[] | null} */ (null);
    static #trapDoorBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #trapDoorBlockTypeIds = /** @type {string[] | null} */ (null);

    // Dirty / nature
    static #tallNatureBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #tallNatureBlockTypeIds = /** @type {string[] | null} */ (null);

    static #naturalOverworldDirtyBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #naturalOverworldDirtyBlockTypeIds = /** @type {string[] | null} */ (null);
    static #naturalNetherDirtyBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #naturalNetherDirtyBlockTypeIds = /** @type {string[] | null} */ (null);
    static #naturalDirtyBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #naturalDirtyBlockTypeIds = /** @type {string[] | null} */ (null);
    static #dirtyBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #dirtyBlockTypeIds = /** @type {string[] | null} */ (null);

    // Glass / terracotta / coral / concrete
    static #glassBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #glassBlockTypeIds = /** @type {string[] | null} */ (null);
    static #glassPaneBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #glassPaneBlockTypeIds = /** @type {string[] | null} */ (null);
    static #glazedTerracottaBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #glazedTerracottaBlockTypeIds = /** @type {string[] | null} */ (null);
    static #terracottaBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #terracottaBlockTypeIds = /** @type {string[] | null} */ (null);
    static #coralBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #coralBlockTypeIds = /** @type {string[] | null} */ (null);
    static #deadCoralBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #deadCoralBlockTypeIds = /** @type {string[] | null} */ (null);
    static #concreteBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #concreteBlockTypeIds = /** @type {string[] | null} */ (null);
    static #concretePowderBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #concretePowderBlockTypeIds = /** @type {string[] | null} */ (null);

    // Stones
    static #naturalOverworldStoneBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #naturalOverworldStoneBlockTypeIds = /** @type {string[] | null} */ (null);
    static #naturalOverworldAboveZeroStoneBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #naturalOverworldAboveZeroStoneBlockTypeIds = /** @type {string[] | null} */ (null);
    static #naturalOverworldBelowZeroStoneBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #naturalOverworldBelowZeroStoneBlockTypeIds = /** @type {string[] | null} */ (null);
    static #naturalNetherStoneBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #naturalNetherStoneBlockTypeIds = /** @type {string[] | null} */ (null);
    static #naturalEndStoneBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #naturalEndStoneBlockTypeIds = /** @type {string[] | null} */ (null);

    static #naturalStoneBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #naturalStoneBlockTypeIds = /** @type {string[] | null} */ (null);

    static #naturalStoneSlabBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #naturalStoneSlabBlockTypeIds = /** @type {string[] | null} */ (null);
    static #naturalOverworldStoneSlabBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #naturalOverworldStoneSlabBlockTypeIds = /** @type {string[] | null} */ (null);
    static #naturalNetherStoneSlabBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #naturalNetherStoneSlabBlockTypeIds = /** @type {string[] | null} */ (null);
    static #naturalEndStoneSlabBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #naturalEndStoneSlabBlockTypeIds = /** @type {string[] | null} */ (null);

    // Misc building collections
    static #coldBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #coldBlockTypeIds = /** @type {string[] | null} */ (null);
    static #underWaterBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #underWaterBlockTypeIds = /** @type {string[] | null} */ (null);
    static #craftedBuildingBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #craftedBuildingBlockTypeIds = /** @type {string[] | null} */ (null);
    static #cookedBuildingBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #cookedBuildingBlockTypeIds = /** @type {string[] | null} */ (null);

    static #autoAliasMap = /** @type {Map<string,string> | null} */ (null);
    //================================================================================================
    /**
     * Cached set of block type ids available in this world.
     * (Includes whatever the world has registered — vanilla + any custom types it exposes.)
     * @returns {Set<string>}
     */
    static getValidBlockTypeIdSet () {
        if (!this.#validBlockTypeIdSet) {
            this.#validBlockTypeIdSet = new Set(BlockTypes.getAll().map(bt => bt.id));
        }
        return this.#validBlockTypeIdSet;
    }
    /**
     * Cached set of block type ids available in this world.
     * (Includes whatever the world has registered — vanilla + any custom types it exposes.)
     * @returns {string[]}
     */
    static getValidBlockTypeIds () {
        if (!this.#validBlockTypeIds) {
            this.#validBlockTypeIds = Array.from(this.getValidBlockTypeIdSet());
        }
        return this.#validBlockTypeIds;
    }
    /**
     * Cached set of block type ids available in this world.
     * @returns {Set<string>}
     */
    static getValidVanillaBlockTypeIdSet () {
        if (!this.#validVanillaBlockTypeIdSet) {
            this.#validVanillaBlockTypeIdSet = new Set(Array.from(this.getValidBlockTypeIdSet()).filter(b => b.startsWith(mcNameSpace)));
        }
        return this.#validVanillaBlockTypeIdSet;
    }
    /**
    * Cached set of block type ids available in this world.
    * @returns {string[]}
    */
    static getValidVanillaBlockTypeIds () {
        if (!this.#validVanillaBlockTypeIds) {
            this.#validVanillaBlockTypeIds = Array.from(this.getValidVanillaBlockTypeIdSet());
        }
        return this.#validVanillaBlockTypeIds;
    }
    /**
     * Cached set of block type ids available in this world.
     * @returns {Set<string>}
     */
    static getValidCustomBlockTypeIdSet () {
        if (!this.#validCustomBlockTypeIdSet) {
            this.#validCustomBlockTypeIdSet = new Set(Array.from(this.getValidBlockTypeIdSet()).filter(b => !b.startsWith(mcNameSpace)));
        }
        return this.#validCustomBlockTypeIdSet;
    }
    /**
    * Cached set of block type ids available in this world.
    * @returns {string[]}
    */
    static getValidCustomBlockTypeIds () {
        if (!this.#validCustomBlockTypeIds) {
            this.#validCustomBlockTypeIds = Array.from(this.getValidCustomBlockTypeIdSet());
        }
        return this.#validCustomBlockTypeIds;
    }
    //================================================================================================
    /**
     * Cached set of block type ids available in this world.
     * (Includes whatever the world has registered — vanilla + any custom types it exposes.)
     * @returns {Set<string>}
     */
    static getValidSlabTypeIdSet () {
        if (!this.#validSlabTypeIdSet) {
            this.#validSlabTypeIdSet = new Set(Array.from(this.getValidBlockTypeIdSet()).filter(b => b.endsWith('_slab')));
        }
        return this.#validSlabTypeIdSet;
    }
    /**
     * Cached set of block type ids available in this world.
     * (Includes whatever the world has registered — vanilla + any custom types it exposes.)
     * @returns {string[]}
     */
    static getValidSlabTypeIds () {
        if (!this.#validSlabTypeIds) {
            this.#validSlabTypeIds = Array.from(this.getValidSlabTypeIdSet());
        }
        return this.#validSlabTypeIds;
    }
    /**
     * Cached set of block type ids available in this world.
     * (Includes whatever the world has registered — vanilla + any custom types it exposes.)
     * @returns {Set<string>}
     */
    static getValidVanillaSlabTypeIdSet () {
        if (!this.#validVanillaSlabTypeIdSet) {
            this.#validVanillaSlabTypeIdSet = new Set(Array.from(this.getValidSlabTypeIdSet()).filter(b => b.startsWith(mcNameSpace)));
        }
        return this.#validVanillaSlabTypeIdSet;
    }
    /**
    * Cached set of block type ids available in this world.
    * (Includes whatever the world has registered — vanilla + any custom types it exposes.)
    * @returns {string[]}
    */
    static getValidVanillaSlabTypeIds () {
        if (!this.#validVanillaSlabTypeIds) {
            this.#validVanillaSlabTypeIds = Array.from(this.getValidVanillaSlabTypeIdSet());
        }
        return this.#validVanillaSlabTypeIds;
    }
    //================================================================================================
    // Cached block-data collections
    //================================================================================================

    /**
     * @returns {Set<string>}
     */
    static getClimbableBlockTypeIdSet () {
        if (!this.#climbableBlockTypeIdSet) {
            const vanillaSet = this.getValidVanillaBlockTypeIdSet();
            const a = [
                'minecraft:flowing_water',
                'minecraft:water',
                'minecraft:ladder',
                'minecraft:scaffolding',
                'minecraft:weeping_vines',
                'minecraft:twisting_vines',
                'minecraft:glow_berries',
                'minecraft:vine'
            ].filter(b => vanillaSet.has(b));

            this.#climbableBlockTypeIds = a;
            this.#climbableBlockTypeIdSet = new Set(a);
        }
        return this.#climbableBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getClimbableBlockTypeIds () {
        if (!this.#climbableBlockTypeIds) {
            this.#climbableBlockTypeIds = Array.from(this.getClimbableBlockTypeIdSet());
        }
        return this.#climbableBlockTypeIds;
    }
    /**
     * @returns {Set<string>}
     */
    static getOverworldClimbableBlockTypeIdSet () {
        if (!this.#overworldClimbableBlockTypeIdSet) {
            const base = this.getClimbableBlockTypeIdSet();
            const a = [
                'minecraft:flowing_water',
                'minecraft:water',
                'minecraft:ladder',
                'minecraft:scaffolding',
                'minecraft:glow_berries',
                'minecraft:vine'
            ].filter(b => base.has(b));

            this.#overworldClimbableBlockTypeIds = a;
            this.#overworldClimbableBlockTypeIdSet = new Set(a);
        }
        return this.#overworldClimbableBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getOverworldClimbableBlockTypeIds () {
        if (!this.#overworldClimbableBlockTypeIds) {
            this.#overworldClimbableBlockTypeIds = Array.from(this.getOverworldClimbableBlockTypeIdSet());
        }
        return this.#overworldClimbableBlockTypeIds;
    }
    /**
     * @returns {Set<string>}
     */
    static getNetherClimbableBlockTypeIdSet () {
        if (!this.#netherClimbableBlockTypeIdSet) {
            const base = this.getClimbableBlockTypeIdSet();
            const a = [
                'minecraft:weeping_vines',
                'minecraft:twisting_vines',
            ].filter(b => base.has(b));

            this.#netherClimbableBlockTypeIds = a;
            this.#netherClimbableBlockTypeIdSet = new Set(a);
        }
        return this.#netherClimbableBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNetherClimbableBlockTypeIds () {
        if (!this.#netherClimbableBlockTypeIds) {
            this.#netherClimbableBlockTypeIds = Array.from(this.getNetherClimbableBlockTypeIdSet());
        }
        return this.#netherClimbableBlockTypeIds;
    }

    //=============================================================================
    // All about Wood
    //=============================================================================

    /**
     * @returns {Set<string>}
     */
    static getWoodTypeSet () {
        if (!this.#woodTypeSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const a = vanillaBlocks
                .filter(block => block.endsWith('_planks'))
                .map(s => s.replace('minecraft:', '').replace('_planks', ''));

            this.#woodTypes = a;
            this.#woodTypeSet = new Set(a);
        }
        return this.#woodTypeSet;
    }
    /**
     * @returns {string[]}
     */
    static getWoodTypes () {
        if (!this.#woodTypes) this.#woodTypes = Array.from(this.getWoodTypeSet());
        return this.#woodTypes;
    }

    /**
     * @returns {Set<string>}
     */
    static getOverworldWoodTypeSet () {
        if (!this.#overworldWoodTypeSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const woodTypes = this.getWoodTypeSet();

            const a = vanillaBlocks
                .filter(block => block.endsWith('_log'))
                .map(s => s.replace('minecraft:', '').replace('_log', ''))
                .filter(s => woodTypes.has(s));

            this.#overworldWoodTypes = a;
            this.#overworldWoodTypeSet = new Set(a);
        }
        return this.#overworldWoodTypeSet;
    }
    /**
     * @returns {string[]}
     */
    static getOverworldWoodTypes () {
        if (!this.#overworldWoodTypes) this.#overworldWoodTypes = Array.from(this.getOverworldWoodTypeSet());
        return this.#overworldWoodTypes;
    }

    /**
     * @returns {Set<string>}
     */
    static getNetherWoodTypeSet () {
        if (!this.#netherWoodTypeSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const woodTypes = this.getWoodTypeSet();

            const a = vanillaBlocks
                .filter(block => block.endsWith('_stem'))
                .map(s => s.replace('minecraft:', '').replace('_stem', ''))
                .filter(s => woodTypes.has(s));

            this.#netherWoodTypes = a;
            this.#netherWoodTypeSet = new Set(a);
        }
        return this.#netherWoodTypeSet;
    }
    /**
     * @returns {string[]}
     */
    static getNetherWoodTypes () {
        if (!this.#netherWoodTypes) this.#netherWoodTypes = Array.from(this.getNetherWoodTypeSet());
        return this.#netherWoodTypes;
    }

    /**
     * @returns {Set<string>}
     */
    static getWoodenBlockTypeIdSet () {
        if (!this.#woodenBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const woodTypes = this.getWoodTypes();

            const a = vanillaBlocks
                .filter(blockName => {
                    return blockName.endsWith('_button') ||
                        blockName.endsWith('_trapdoor') ||
                        blockName.endsWith('_door') ||
                        blockName.endsWith('_fence') ||
                        blockName.endsWith('_fence_gate') ||
                        blockName.endsWith('_hanging_sign') ||
                        blockName.endsWith('_standing_sign') ||
                        blockName.endsWith('_wall_sign') ||
                        blockName.endsWith('_hyphae') ||
                        blockName.endsWith('_log') ||
                        blockName.endsWith('_planks') ||
                        blockName.endsWith('_pressure_plate') ||
                        blockName.endsWith('_sign') ||
                        blockName.endsWith('_slab') ||
                        blockName.endsWith('_stairs') ||
                        blockName.endsWith('_stem') ||
                        blockName.endsWith('_hyphae') ||
                        blockName.endsWith('_wood');
                })
                .filter(blockName => {
                    return woodTypes.some(
                        woodType => {
                            blockName.startsWith('minecraft:' + woodType + '_') ||
                                blockName.startsWith('minecraft:' + 'stripped' + woodType + '_');
                        });
                });

            this.#woodenBlockTypeIds = a;
            this.#woodenBlockTypeIdSet = new Set(a);
        }
        return this.#woodenBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getWoodenBlockTypeIds () {
        if (!this.#woodenBlockTypeIds) this.#woodenBlockTypeIds = Array.from(this.getWoodenBlockTypeIdSet());
        return this.#woodenBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getOverworldWoodenBlockTypeIdSet () {
        if (!this.#overworldWoodenBlockTypeIdSet) {
            const woodenBlocks = this.getWoodenBlockTypeIds();
            const overworldWoodTypes = this.getOverworldWoodTypes();

            const a = woodenBlocks
                .filter(blockName => {
                    return overworldWoodTypes.some(
                        woodType => {
                            blockName.startsWith('minecraft:' + woodType + '_') ||
                                blockName.startsWith('minecraft:' + 'stripped' + woodType + '_');
                        });
                });

            this.#overworldWoodenBlockTypeIds = a;
            this.#overworldWoodenBlockTypeIdSet = new Set(a);
        }
        return this.#overworldWoodenBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getOverworldWoodenBlockTypeIds () {
        if (!this.#overworldWoodenBlockTypeIds) this.#overworldWoodenBlockTypeIds = Array.from(this.getOverworldWoodenBlockTypeIdSet());
        return this.#overworldWoodenBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getNetherWoodenBlockTypeIdSet () {
        if (!this.#netherWoodenBlockTypeIdSet) {
            const woodenBlocks = this.getWoodenBlockTypeIds();
            const netherWoodTypes = this.getNetherWoodTypes();

            const a = woodenBlocks
                .filter(blockName => {
                    return netherWoodTypes.some(
                        woodType => {
                            blockName.startsWith('minecraft:' + woodType + '_') ||
                                blockName.startsWith('minecraft:' + 'stripped' + woodType + '_');
                        });
                });

            this.#netherWoodenBlockTypeIds = a;
            this.#netherWoodenBlockTypeIdSet = new Set(a);
        }
        return this.#netherWoodenBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNetherWoodenBlockTypeIds () {
        if (!this.#netherWoodenBlockTypeIds) this.#netherWoodenBlockTypeIds = Array.from(this.getNetherWoodenBlockTypeIdSet());
        return this.#netherWoodenBlockTypeIds;
    }

    //=============================================================================
    // Gravity Blocks - they fall on you
    //=============================================================================
    /**
     * @returns {Set<string>}
     */
    static getGravityBlockTypeIdSet () {
        if (!this.#gravityBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const a = vanillaBlocks
                .filter(blockName => {
                    return blockName.endsWith('_concrete_powder') ||
                        blockName.endsWith(':gravel') ||
                        blockName.endsWith(':red_sand') ||
                        blockName.endsWith(':suspicious_sand') ||
                        blockName.endsWith(':sand');
                });

            this.#gravityBlockTypeIds = a;
            this.#gravityBlockTypeIdSet = new Set(a);
        }
        return this.#gravityBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getGravityBlockTypeIds () {
        if (!this.#gravityBlockTypeIds) this.#gravityBlockTypeIds = Array.from(this.getGravityBlockTypeIdSet());
        return this.#gravityBlockTypeIds;
    }

    //=============================================================================
    // regular tree leaves and stuff
    //=============================================================================
    /**
     * @returns {Set<string>}
     */
    static getLeafBlockTypeIdSet () {
        if (!this.#leafBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const a = vanillaBlocks
                .filter(blockName => { return blockName.endsWith('_leaves'); })
                .concat([ "minecraft:azalea", "minecraft:azalea_leaves_flowered" ]);

            this.#leafBlockTypeIds = a;
            this.#leafBlockTypeIdSet = new Set(a);
        }
        return this.#leafBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getLeafBlockTypeIds () {
        if (!this.#leafBlockTypeIds) this.#leafBlockTypeIds = Array.from(this.getLeafBlockTypeIdSet());
        return this.#leafBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getLogBlockTypeIdSet () {
        if (!this.#logBlockTypeIdSet) {
            const woodenBlocks = this.getWoodenBlockTypeIds();
            const a = woodenBlocks
                .filter(blockName => { return blockName.endsWith('_log') || blockName.endsWith('_stem'); });

            this.#logBlockTypeIds = a;
            this.#logBlockTypeIdSet = new Set(a);
        }
        return this.#logBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getLogBlockTypeIds () {
        if (!this.#logBlockTypeIds) this.#logBlockTypeIds = Array.from(this.getLogBlockTypeIdSet());
        return this.#logBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getSaplingBlockTypeIdSet () {
        if (!this.#saplingBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const a = vanillaBlocks
                .filter(blockName => { return blockName.endsWith('_sapling'); });

            this.#saplingBlockTypeIds = a;
            this.#saplingBlockTypeIdSet = new Set(a);
        }
        return this.#saplingBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getSaplingBlockTypeIds () {
        if (!this.#saplingBlockTypeIds) this.#saplingBlockTypeIds = Array.from(this.getSaplingBlockTypeIdSet());
        return this.#saplingBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getPlankBlockTypeIdSet () {
        if (!this.#plankBlockTypeIdSet) {
            const woodenBlocks = this.getWoodenBlockTypeIds();
            const a = woodenBlocks
                .filter(blockName => { return blockName.endsWith('_planks'); });

            this.#plankBlockTypeIds = a;
            this.#plankBlockTypeIdSet = new Set(a);
        }
        return this.#plankBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getPlankBlockTypeIds () {
        if (!this.#plankBlockTypeIds) this.#plankBlockTypeIds = Array.from(this.getPlankBlockTypeIdSet());
        return this.#plankBlockTypeIds;
    }

    //=============================================================================
    //  by region
    //=============================================================================
    /**
     * @returns {Set<string>}
     */
    static getNetherLogBlockTypeIdSet () {
        if (!this.#netherLogBlockTypeIdSet) {
            const netherWoodenBlocks = this.getNetherWoodenBlockTypeIds();
            const a = netherWoodenBlocks
                .filter(b => { return b.endsWith('_stem') || b.endsWith('_hyphae'); });

            this.#netherLogBlockTypeIds = a;
            this.#netherLogBlockTypeIdSet = new Set(a);
        }
        return this.#netherLogBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNetherLogBlockTypeIds () {
        if (!this.#netherLogBlockTypeIds) this.#netherLogBlockTypeIds = Array.from(this.getNetherLogBlockTypeIdSet());
        return this.#netherLogBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getOverworldLogBlockTypeIdSet () {
        if (!this.#overworldLogBlockTypeIdSet) {
            const overworldWoodenBlocks = this.getOverworldWoodenBlockTypeIds();
            const a = overworldWoodenBlocks
                .filter(b => { return b.endsWith('_log') || b.endsWith('_wood'); });

            this.#overworldLogBlockTypeIds = a;
            this.#overworldLogBlockTypeIdSet = new Set(a);
        }
        return this.#overworldLogBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getOverworldLogBlockTypeIds () {
        if (!this.#overworldLogBlockTypeIds) this.#overworldLogBlockTypeIds = Array.from(this.getOverworldLogBlockTypeIdSet());
        return this.#overworldLogBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getOverworldPlankBlockTypeIdSet () {
        if (!this.#overworldPlankBlockTypeIdSet) {
            const overworldWoodenBlocks = this.getOverworldWoodenBlockTypeIds();
            const a = overworldWoodenBlocks
                .filter(b => { return b.endsWith('_planks'); });

            this.#overworldPlankBlockTypeIds = a;
            this.#overworldPlankBlockTypeIdSet = new Set(a);
        }
        return this.#overworldPlankBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getOverworldPlankBlockTypeIds () {
        if (!this.#overworldPlankBlockTypeIds) this.#overworldPlankBlockTypeIds = Array.from(this.getOverworldPlankBlockTypeIdSet());
        return this.#overworldPlankBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getNetherPlankBlockTypeIdSet () {
        if (!this.#netherPlankBlockTypeIdSet) {
            const netherWoodenBlocks = this.getNetherWoodenBlockTypeIds();
            const a = netherWoodenBlocks
                .filter(b => { return b.endsWith('_planks'); });

            this.#netherPlankBlockTypeIds = a;
            this.#netherPlankBlockTypeIdSet = new Set(a);
        }
        return this.#netherPlankBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNetherPlankBlockTypeIds () {
        if (!this.#netherPlankBlockTypeIds) this.#netherPlankBlockTypeIds = Array.from(this.getNetherPlankBlockTypeIdSet());
        return this.#netherPlankBlockTypeIds;
    }

    //=============================================================================
    // Stairs + trap doors
    //=============================================================================
    /**
     * @returns {Set<string>}
     */
    static getStairBlockTypeIdSet () {
        if (!this.#stairBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const a = vanillaBlocks
                .filter(blockName => { return blockName.endsWith('_stairs'); });

            this.#stairBlockTypeIds = a;
            this.#stairBlockTypeIdSet = new Set(a);
        }
        return this.#stairBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getStairBlockTypeIds () {
        if (!this.#stairBlockTypeIds) this.#stairBlockTypeIds = Array.from(this.getStairBlockTypeIdSet());
        return this.#stairBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getTrapDoorBlockTypeIdSet () {
        if (!this.#trapDoorBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const a = vanillaBlocks
                .filter(blockName => { return blockName.endsWith('trapdoor'); });

            this.#trapDoorBlockTypeIds = a;
            this.#trapDoorBlockTypeIdSet = new Set(a);
        }
        return this.#trapDoorBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getTrapDoorBlockTypeIds () {
        if (!this.#trapDoorBlockTypeIds) this.#trapDoorBlockTypeIds = Array.from(this.getTrapDoorBlockTypeIdSet());
        return this.#trapDoorBlockTypeIds;
    }

    //=============================================================================
    // Tall nature + dirty blocks
    //=============================================================================
    /**
     * @returns {Set<string>}
     */
    static getTallNatureBlockTypeIdSet () {
        if (!this.#tallNatureBlockTypeIdSet) {
            const vanillaSet = this.getValidVanillaBlockTypeIdSet();
            const a = [
                "minecraft:rose_bush",
                "minecraft:lilac",
                "minecraft:peony",
                "minecraft:sunflower",
                "minecraft:torchflower",
                "minecraft:tall_grass",
                "minecraft:tall_dry_grass",
                'minecraft:large_fern'
            ].filter(b => vanillaSet.has(b));

            this.#tallNatureBlockTypeIds = a;
            this.#tallNatureBlockTypeIdSet = new Set(a);
        }
        return this.#tallNatureBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getTallNatureBlockTypeIds () {
        if (!this.#tallNatureBlockTypeIds) this.#tallNatureBlockTypeIds = Array.from(this.getTallNatureBlockTypeIdSet());
        return this.#tallNatureBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getNaturalOverworldDirtyBlockTypeIdSet () {
        if (!this.#naturalOverworldDirtyBlockTypeIdSet) {
            const vanillaSet = this.getValidVanillaBlockTypeIdSet();
            const a = [
                'minecraft:dirt',
                'minecraft:mud',
                'minecraft:packed_mud',
                'minecraft:farmland',
                'minecraft:dirt_path',
                'minecraft:dirt_with_roots',
                'minecraft:rooted_dirt',
                'minecraft:coarse_dirt',
                'minecraft:grass',
                'minecraft:grass_block',
                'minecraft:podzol',
                'minecraft:mycelium',
            ].filter(b => vanillaSet.has(b));

            this.#naturalOverworldDirtyBlockTypeIds = a;
            this.#naturalOverworldDirtyBlockTypeIdSet = new Set(a);
        }
        return this.#naturalOverworldDirtyBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalOverworldDirtyBlockTypeIds () {
        if (!this.#naturalOverworldDirtyBlockTypeIds) this.#naturalOverworldDirtyBlockTypeIds = Array.from(this.getNaturalOverworldDirtyBlockTypeIdSet());
        return this.#naturalOverworldDirtyBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getNaturalNetherDirtyBlockTypeIdSet () {
        if (!this.#naturalNetherDirtyBlockTypeIdSet) {
            const a = [
                'minecraft:crimson_nylium', 'minecraft:warped_nylium'
            ];

            this.#naturalNetherDirtyBlockTypeIds = a;
            this.#naturalNetherDirtyBlockTypeIdSet = new Set(a);
        }
        return this.#naturalNetherDirtyBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalNetherDirtyBlockTypeIds () {
        if (!this.#naturalNetherDirtyBlockTypeIds) this.#naturalNetherDirtyBlockTypeIds = Array.from(this.getNaturalNetherDirtyBlockTypeIdSet());
        return this.#naturalNetherDirtyBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getNaturalDirtyBlockTypeIdSet () {
        if (!this.#naturalDirtyBlockTypeIdSet) {
            const a = [
                ...this.getNaturalOverworldDirtyBlockTypeIds(),
                ...this.getNaturalNetherDirtyBlockTypeIds()
            ];

            this.#naturalDirtyBlockTypeIds = a;
            this.#naturalDirtyBlockTypeIdSet = new Set(a);
        }
        return this.#naturalDirtyBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalDirtyBlockTypeIds () {
        if (!this.#naturalDirtyBlockTypeIds) this.#naturalDirtyBlockTypeIds = Array.from(this.getNaturalDirtyBlockTypeIdSet());
        return this.#naturalDirtyBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getDirtyBlockTypeIdSet () {
        if (!this.#dirtyBlockTypeIdSet) {
            const vanillaSet = this.getValidVanillaBlockTypeIdSet();

            const a = [
                ...this.getNaturalDirtyBlockTypeIds(),
                'minecraft:mud_bricks',
            ].filter(b => vanillaSet.has(b));

            this.#dirtyBlockTypeIds = a;
            this.#dirtyBlockTypeIdSet = new Set(a);
        }
        return this.#dirtyBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getDirtyBlockTypeIds () {
        if (!this.#dirtyBlockTypeIds) this.#dirtyBlockTypeIds = Array.from(this.getDirtyBlockTypeIdSet());
        return this.#dirtyBlockTypeIds;
    }

    //=============================================================================
    // Glass / Terracotta / Coral / Concrete
    //=============================================================================
    /**
     * @returns {Set<string>}
     */
    static getGlassBlockTypeIdSet () {
        if (!this.#glassBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const a = vanillaBlocks
                .filter(blockName => { return blockName.endsWith('_stained_glass'); })
                .concat('glass');

            this.#glassBlockTypeIds = a;
            this.#glassBlockTypeIdSet = new Set(a);
        }
        return this.#glassBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getGlassBlockTypeIds () {
        if (!this.#glassBlockTypeIds) this.#glassBlockTypeIds = Array.from(this.getGlassBlockTypeIdSet());
        return this.#glassBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getGlassPaneBlockTypeIdSet () {
        if (!this.#glassPaneBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const a = vanillaBlocks.filter(blockName => { return blockName.endsWith('glass_pane'); });

            this.#glassPaneBlockTypeIds = a;
            this.#glassPaneBlockTypeIdSet = new Set(a);
        }
        return this.#glassPaneBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getGlassPaneBlockTypeIds () {
        if (!this.#glassPaneBlockTypeIds) this.#glassPaneBlockTypeIds = Array.from(this.getGlassPaneBlockTypeIdSet());
        return this.#glassPaneBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getGlazedTerracottaBlockTypeIdSet () {
        if (!this.#glazedTerracottaBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const a = vanillaBlocks.filter(blockName => { return blockName.endsWith('_glazed_terracotta'); });

            this.#glazedTerracottaBlockTypeIds = a;
            this.#glazedTerracottaBlockTypeIdSet = new Set(a);
        }
        return this.#glazedTerracottaBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getGlazedTerracottaBlockTypeIds () {
        if (!this.#glazedTerracottaBlockTypeIds) this.#glazedTerracottaBlockTypeIds = Array.from(this.getGlazedTerracottaBlockTypeIdSet());
        return this.#glazedTerracottaBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getTerracottaBlockTypeIdSet () {
        if (!this.#terracottaBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const a = vanillaBlocks
                .filter(blockName => { return blockName.endsWith('_terracotta') && !blockName.endsWith('_glazed_terracotta'); })
                .concat('hardened_clay');

            this.#terracottaBlockTypeIds = a;
            this.#terracottaBlockTypeIdSet = new Set(a);
        }
        return this.#terracottaBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getTerracottaBlockTypeIds () {
        if (!this.#terracottaBlockTypeIds) this.#terracottaBlockTypeIds = Array.from(this.getTerracottaBlockTypeIdSet());
        return this.#terracottaBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getCoralBlockTypeIdSet () {
        if (!this.#coralBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const a = vanillaBlocks.filter(blockName => { return blockName.endsWith('_coral_block') && !blockName.startsWith('dead_'); });

            this.#coralBlockTypeIds = a;
            this.#coralBlockTypeIdSet = new Set(a);
        }
        return this.#coralBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getCoralBlockTypeIds () {
        if (!this.#coralBlockTypeIds) this.#coralBlockTypeIds = Array.from(this.getCoralBlockTypeIdSet());
        return this.#coralBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getDeadCoralBlockTypeIdSet () {
        if (!this.#deadCoralBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const a = vanillaBlocks.filter(blockName => { return blockName.endsWith('_coral_block') && blockName.startsWith('dead_'); });

            this.#deadCoralBlockTypeIds = a;
            this.#deadCoralBlockTypeIdSet = new Set(a);
        }
        return this.#deadCoralBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getDeadCoralBlockTypeIds () {
        if (!this.#deadCoralBlockTypeIds) this.#deadCoralBlockTypeIds = Array.from(this.getDeadCoralBlockTypeIdSet());
        return this.#deadCoralBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getConcreteBlockTypeIdSet () {
        if (!this.#concreteBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const a = vanillaBlocks.filter(blockName => { return blockName.endsWith('_concrete'); });

            this.#concreteBlockTypeIds = a;
            this.#concreteBlockTypeIdSet = new Set(a);
        }
        return this.#concreteBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getConcreteBlockTypeIds () {
        if (!this.#concreteBlockTypeIds) this.#concreteBlockTypeIds = Array.from(this.getConcreteBlockTypeIdSet());
        return this.#concreteBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getConcretePowderBlockTypeIdSet () {
        if (!this.#concretePowderBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const a = vanillaBlocks.filter(blockName => { return blockName.endsWith('_concrete_powder'); });

            this.#concretePowderBlockTypeIds = a;
            this.#concretePowderBlockTypeIdSet = new Set(a);
        }
        return this.#concretePowderBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getConcretePowderBlockTypeIds () {
        if (!this.#concretePowderBlockTypeIds) this.#concretePowderBlockTypeIds = Array.from(this.getConcretePowderBlockTypeIdSet());
        return this.#concretePowderBlockTypeIds;
    }

    //=============================================================================
    // Stones (nature tab)
    //=============================================================================
    /**
     * @returns {Set<string>}
     */
    static getNaturalOverworldStoneBlockTypeIdSet () {
        if (!this.#naturalOverworldStoneBlockTypeIdSet) {
            const vanillaSet = this.getValidVanillaBlockTypeIdSet();
            const a = [
                'minecraft:stone',
                'minecraft:andesite',
                'minecraft:diorite',
                'minecraft:granite',
                'minecraft:tuff',
                'minecraft:deepslate',
                'minecraft:calcite',
            ].filter(b => vanillaSet.has(b));

            this.#naturalOverworldStoneBlockTypeIds = a;
            this.#naturalOverworldStoneBlockTypeIdSet = new Set(a);
        }
        return this.#naturalOverworldStoneBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalOverworldStoneBlockTypeIds () {
        if (!this.#naturalOverworldStoneBlockTypeIds) this.#naturalOverworldStoneBlockTypeIds = Array.from(this.getNaturalOverworldStoneBlockTypeIdSet());
        return this.#naturalOverworldStoneBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getNaturalOverworldAboveZeroStoneBlockTypeIdSet () {
        if (!this.#naturalOverworldAboveZeroStoneBlockTypeIdSet) {
            const base = this.getNaturalOverworldStoneBlockTypeIdSet();
            const a = [
                'minecraft:stone',
                'minecraft:andesite',
                'minecraft:diorite',
                'minecraft:granite',
            ].filter(b => base.has(b));

            this.#naturalOverworldAboveZeroStoneBlockTypeIds = a;
            this.#naturalOverworldAboveZeroStoneBlockTypeIdSet = new Set(a);
        }
        return this.#naturalOverworldAboveZeroStoneBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalOverworldAboveZeroStoneBlockTypeIds () {
        if (!this.#naturalOverworldAboveZeroStoneBlockTypeIds) this.#naturalOverworldAboveZeroStoneBlockTypeIds = Array.from(this.getNaturalOverworldAboveZeroStoneBlockTypeIdSet());
        return this.#naturalOverworldAboveZeroStoneBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getNaturalOverworldBelowZeroStoneBlockTypeIdSet () {
        if (!this.#naturalOverworldBelowZeroStoneBlockTypeIdSet) {
            const base = this.getNaturalOverworldStoneBlockTypeIdSet();
            const a = [
                'minecraft:tuff',
                'minecraft:deepslate',
                'minecraft:calcite',
            ].filter(b => base.has(b));

            this.#naturalOverworldBelowZeroStoneBlockTypeIds = a;
            this.#naturalOverworldBelowZeroStoneBlockTypeIdSet = new Set(a);
        }
        return this.#naturalOverworldBelowZeroStoneBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalOverworldBelowZeroStoneBlockTypeIds () {
        if (!this.#naturalOverworldBelowZeroStoneBlockTypeIds) this.#naturalOverworldBelowZeroStoneBlockTypeIds = Array.from(this.getNaturalOverworldBelowZeroStoneBlockTypeIdSet());
        return this.#naturalOverworldBelowZeroStoneBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getNaturalNetherStoneBlockTypeIdSet () {
        if (!this.#naturalNetherStoneBlockTypeIdSet) {
            const vanillaSet = this.getValidVanillaBlockTypeIdSet();
            const a = [
                'minecraft:blackstone',
                'minecraft:basalt',
                'minecraft:netherrack',
                'minecraft:crimson_nylium',
                'minecraft:warped_nylium',
            ].filter(b => vanillaSet.has(b));

            this.#naturalNetherStoneBlockTypeIds = a;
            this.#naturalNetherStoneBlockTypeIdSet = new Set(a);
        }
        return this.#naturalNetherStoneBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalNetherStoneBlockTypeIds () {
        if (!this.#naturalNetherStoneBlockTypeIds) this.#naturalNetherStoneBlockTypeIds = Array.from(this.getNaturalNetherStoneBlockTypeIdSet());
        return this.#naturalNetherStoneBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getNaturalEndStoneBlockTypeIdSet () {
        if (!this.#naturalEndStoneBlockTypeIdSet) {
            const vanillaSet = this.getValidVanillaBlockTypeIdSet();
            const a = [
                'minecraft:end_stone'
            ].filter(b => vanillaSet.has(b));

            this.#naturalEndStoneBlockTypeIds = a;
            this.#naturalEndStoneBlockTypeIdSet = new Set(a);
        }
        return this.#naturalEndStoneBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalEndStoneBlockTypeIds () {
        if (!this.#naturalEndStoneBlockTypeIds) this.#naturalEndStoneBlockTypeIds = Array.from(this.getNaturalEndStoneBlockTypeIdSet());
        return this.#naturalEndStoneBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getNaturalStoneBlockTypeIdSet () {
        if (!this.#naturalStoneBlockTypeIdSet) {
            const a = [
                ...this.getNaturalOverworldStoneBlockTypeIds(),
                ...this.getNaturalNetherStoneBlockTypeIds(),
                ...this.getNaturalEndStoneBlockTypeIds()
            ];

            this.#naturalStoneBlockTypeIds = a;
            this.#naturalStoneBlockTypeIdSet = new Set(a);
        }
        return this.#naturalStoneBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalStoneBlockTypeIds () {
        if (!this.#naturalStoneBlockTypeIds) this.#naturalStoneBlockTypeIds = Array.from(this.getNaturalStoneBlockTypeIdSet());
        return this.#naturalStoneBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getNaturalStoneSlabBlockTypeIdSet () {
        if (!this.#naturalStoneSlabBlockTypeIdSet) {
            const vanillaSet = this.getValidVanillaBlockTypeIdSet();
            const a = this.getNaturalStoneBlockTypeIds()
                .map(b => `${b}_slab`)
                .filter(b => vanillaSet.has(b));

            this.#naturalStoneSlabBlockTypeIds = a;
            this.#naturalStoneSlabBlockTypeIdSet = new Set(a);
        }
        return this.#naturalStoneSlabBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalStoneSlabBlockTypeIds () {
        if (!this.#naturalStoneSlabBlockTypeIds) this.#naturalStoneSlabBlockTypeIds = Array.from(this.getNaturalStoneSlabBlockTypeIdSet());
        return this.#naturalStoneSlabBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getNaturalOverworldStoneSlabBlockTypeIdSet () {
        if (!this.#naturalOverworldStoneSlabBlockTypeIdSet) {
            const vanillaSet = this.getValidVanillaBlockTypeIdSet();
            const a = this.getNaturalOverworldStoneBlockTypeIds()
                .map(b => `${b}_slab`)
                .filter(b => vanillaSet.has(b));

            this.#naturalOverworldStoneSlabBlockTypeIds = a;
            this.#naturalOverworldStoneSlabBlockTypeIdSet = new Set(a);
        }
        return this.#naturalOverworldStoneSlabBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalOverworldStoneSlabBlockTypeIds () {
        if (!this.#naturalOverworldStoneSlabBlockTypeIds) this.#naturalOverworldStoneSlabBlockTypeIds = Array.from(this.getNaturalOverworldStoneSlabBlockTypeIdSet());
        return this.#naturalOverworldStoneSlabBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getNaturalNetherStoneSlabBlockTypeIdSet () {
        if (!this.#naturalNetherStoneSlabBlockTypeIdSet) {
            const vanillaSet = this.getValidVanillaBlockTypeIdSet();
            const a = this.getNaturalNetherStoneBlockTypeIds()
                .map(b => `${b}_slab`)
                .filter(b => vanillaSet.has(b));

            this.#naturalNetherStoneSlabBlockTypeIds = a;
            this.#naturalNetherStoneSlabBlockTypeIdSet = new Set(a);
        }
        return this.#naturalNetherStoneSlabBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalNetherStoneSlabBlockTypeIds () {
        if (!this.#naturalNetherStoneSlabBlockTypeIds) this.#naturalNetherStoneSlabBlockTypeIds = Array.from(this.getNaturalNetherStoneSlabBlockTypeIdSet());
        return this.#naturalNetherStoneSlabBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getNaturalEndStoneSlabBlockTypeIdSet () {
        if (!this.#naturalEndStoneSlabBlockTypeIdSet) {
            const vanillaSet = this.getValidVanillaBlockTypeIdSet();
            const a = this.getNaturalEndStoneBlockTypeIds()
                .map(b => `${b}_slab`)
                .filter(b => vanillaSet.has(b));

            this.#naturalEndStoneSlabBlockTypeIds = a;
            this.#naturalEndStoneSlabBlockTypeIdSet = new Set(a);
        }
        return this.#naturalEndStoneSlabBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalEndStoneSlabBlockTypeIds () {
        if (!this.#naturalEndStoneSlabBlockTypeIds) this.#naturalEndStoneSlabBlockTypeIds = Array.from(this.getNaturalEndStoneSlabBlockTypeIdSet());
        return this.#naturalEndStoneSlabBlockTypeIds;
    }

    //=============================================================================
    // Underwater blocks (with slab variants)
    //=============================================================================
    /**
     * @returns {Set<string>}
     */
    static getUnderWaterBlockTypeIdSet () {
        if (!this.#underWaterBlockTypeIdSet) {
            const a = [
                'prismarine', 'dark_prismarine', 'prismarine_bricks',
                'clay_block', 'gravel', 'sand',
                ...this.getCoralBlockTypeIds()
            ];

            Blocks.addSlabVariantsInPlace(a, { verify: true });
            this.#underWaterBlockTypeIds = a;
            this.#underWaterBlockTypeIdSet = new Set(a);
        }
        return this.#underWaterBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getUnderWaterBlockTypeIds () {
        if (!this.#underWaterBlockTypeIds) this.#underWaterBlockTypeIds = Array.from(this.getUnderWaterBlockTypeIdSet());
        return this.#underWaterBlockTypeIds;
    }

    //=============================================================================
    // Underwater blocks (with slab variants)
    //=============================================================================
    /**
     * @returns {Set<string>}
     */
    static getColdBlockTypeIdSet () {
        if (!this.#coldBlockTypeIdSet) {
            const a = [
                'minecraft:snow_block',
                'minecraft:snow',
                'minecraft:ice',
                'minecraft:powder_snow',
                'minecraft:packed_ice',
                'minecraft:blue_ice'
            ];

            //doesn't need this right now, but maybe one day
            Blocks.addSlabVariantsInPlace(a, { verify: true });
            this.#coldBlockTypeIds = a;
            this.#coldBlockTypeIdSet = new Set(a);
        }
        return this.#coldBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getColdBlockTypeIds () {
        if (!this.#coldBlockTypeIds) this.#coldBlockTypeIds = Array.from(this.getColdBlockTypeIdSet());
        return this.#coldBlockTypeIds;
    }

    //=============================================================================
    // Crafted / cooked building blocks
    //=============================================================================
    /**
     * @returns {Set<string>}
     */
    static getCraftedBuildingBlockTypeIdSet () {
        if (!this.#craftedBuildingBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();

            const a = vanillaBlocks
                .filter(blockName => {
                    return blockName.endsWith('_tiles') ||
                        blockName.endsWith('_pillar') ||
                        blockName.endsWith('_powder') ||
                        blockName.endsWith('_planks') ||
                        blockName.endsWith('_stairs') ||
                        blockName.endsWith('_slab') ||
                        blockName.endsWith('_quartz_block') ||
                        blockName.endsWith('_bricks');
                })
                .concat([ 'bricks', 'bone_block', 'packed_mud', 'dark_prismarine' ]);

            Blocks.normalizeBlockIdsInPlace(a, { verify: true, addNamespace: true, removeEmpty: true });

            this.#craftedBuildingBlockTypeIds = a;
            this.#craftedBuildingBlockTypeIdSet = new Set(a);
        }
        return this.#craftedBuildingBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getCraftedBuildingBlockTypeIds () {
        if (!this.#craftedBuildingBlockTypeIds) this.#craftedBuildingBlockTypeIds = Array.from(this.getCraftedBuildingBlockTypeIdSet());
        return this.#craftedBuildingBlockTypeIds;
    }

    /**
     * Directly cooked - not added colors (use ..glass to get those)
     * @returns {Set<string>}
     */
    static getCookedBuildingBlockTypeIdSet () {
        if (!this.#cookedBuildingBlockTypeIdSet) {
            const a = [ ...this.getGlazedTerracottaBlockTypeIds() ]
                .concat([
                    'bricks', 'nether_bricks', 'red_nether_bricks',
                    'smooth_stone', 'stone', 'smooth_basalt',
                    'glass', 'dried_kelp_block'
                ])
                .concat(this.getGlazedTerracottaBlockTypeIds());

            Blocks.addSlabVariantsInPlace(a, { verify: true, pluralHack: true });

            this.#cookedBuildingBlockTypeIds = a;
            this.#cookedBuildingBlockTypeIdSet = new Set(a);
        }
        return this.#cookedBuildingBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getCookedBuildingBlockTypeIds () {
        if (!this.#cookedBuildingBlockTypeIds) this.#cookedBuildingBlockTypeIds = Array.from(this.getCookedBuildingBlockTypeIdSet());
        return this.#cookedBuildingBlockTypeIds;
    }

    //================================================================================================
    //Utilities
    /**
     * @param {string} typeId
     * @returns {boolean}
     */
    static isValidTypeId (typeId) {
        return this.getValidBlockTypeIdSet().has(typeId);
    }
    //================================================================================================
    // Aliases - cause I can't remember the proper name
    //================================================================================================
    /**
  * Build a map of "shorthand-ish" ids -> real ids from the world's registered types.
  * Collisions are ignored (if two different real ids want the same alias, we skip that alias).
  *
  * @returns {Map<string,string>}
  */
    static getAutoAliasMap () {
        if (this.#autoAliasMap) return this.#autoAliasMap;

        const valid = this.getValidBlockTypeIdSet();
        /** @type {Map<string,string>} */
        const m = new Map();
        /** @type {Set<string>} */
        const collided = new Set();

        /**
         * @param {string} alias
         * @param {string} real
         */
        const addAlias = (alias, real) => {
            if (valid.has(alias)) return;               // alias already valid; don't override
            if (collided.has(alias)) return;            // already known ambiguous
            const prev = m.get(alias);
            if (!prev) m.set(alias, real);
            else if (prev !== real) { m.delete(alias); collided.add(alias); } // ambiguity
        };

        for (const id of valid) {
            // Only auto-alias vanilla namespace (optional; remove this if you want for custom too)
            // if (!id.startsWith("minecraft:")) continue;

            // *_block -> shorthand
            if (id.endsWith("_block")) {
                addAlias(id.slice(0, -6), id); // remove "_block" (underscore included)
            }


            // *_bricks <-> *_brick
            if (id.endsWith("_bricks")) {
                addAlias(id.slice(0, -1), id); // bricks -> brick
            } else if (id.endsWith("_brick")) {
                addAlias(id + "s", id);        // brick -> bricks
            }

            // *_tiles <-> *_tile
            if (id.endsWith("_tiles")) {
                addAlias(id.slice(0, -1), id); // tiles -> tile
            } else if (id.endsWith("_tile")) {
                addAlias(id + "s", id);        // tile -> tiles
            }
        }

        this.#autoAliasMap = m;
        return m;
    }
    /**
     * Coerce an id into a valid id if possible:
     * - if it's already valid, keep it
     * - else try auto-alias fixups
     * - else return "" (invalid)
     *
     * @param {string} typeId
     * @returns {string}
     */
    static coerceToValidTypeId (typeId) {
        const valid = this.getValidBlockTypeIdSet();
        if (valid.has(typeId)) return typeId;

        const alias = this.getAutoAliasMap().get(typeId);
        if (alias && valid.has(alias)) return alias;

        return "";
    }
}
//==============================================================================
/*  End of File */
//==============================================================================
