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
export class Block_Events {
    /**
   * @param {{ alertLog: Function, alertWarn?: Function, alertSuccess?: Function, alertError: Function }} emitters
   */
    constructor(emitters) {
        this.dev =emitters;
    }

    /**
     * 
     * @param {*} lastInteractInfo 
     * @param {string} itemTypeId 
     * @param {Block} newBlock 
     * @returns {string}
     */
    verifyLastInteractInfoRelated (lastInteractInfo, itemTypeId, newBlock) {
        //todo: add opts {emit and debug} return boolean  or return obj {valid and msg}
        let msg = '\n§dVerifying Last Player Block Interact Dynamic Properties';

        if (lastInteractInfo.tick === 0) {
            msg += `\n§c==> Missing lastInteractInfo`;
            return msg;
        }

        //1st check for staleness
        const currentTick = system.currentTick;
        if (currentTick - lastInteractInfo.tick > 1) {
            msg += `\n§c==> lastInteractInfo is stale. currentTick:${currentTick} - lastTick:${lastInteractInfo.tick}>5`;
            return msg;
        }

        //2nd check for missing info
        if (!lastInteractInfo.faceLocation) {
            msg += '\n§c==> Missing faceLocation';
            return msg;
        }
        if (!lastInteractInfo.blockLocation) {
            msg += '\n§c==> Missing blockLocation';
            return msg;
        }
        if (!newBlock.dimension.isChunkLoaded(lastInteractInfo.blockLocation)) {
            msg += '\n§c==> Chunk is not loaded';
            return msg;
        }
        if (!newBlock.dimension.getBlock(lastInteractInfo.blockLocation)) {
            msg += '\n§c==> Cannot get block';
            return msg;
        }

        //3nd check for item type match    
        if (itemTypeId !== lastInteractInfo.itemTypeId) {
            msg += `\n§c==> itemStackBlock (${itemTypeId}) !== lastItemStack (${lastInteractInfo.itemTypeId})`;
            return msg;
        }

        //3rd check for adjacency
        if (!Vector3Lib.isAdjacent(newBlock.location, lastInteractInfo.blockLocation)) {
            msg += `\n§c==> location (${Vector3Lib.toString(newBlock.location, 1, true)}) is not adjacent to lastBlockLocation (${Vector3Lib.toString(lastInteractInfo.blockLocation, 1, true)})`;
            return msg;
        }
        //That is all that matters to accept the LastInteract info as related to this place event   
        return msg += '\n§aVerified';
    }
    //==============================================================================
    //  onPlace by block style
    //==============================================================================
    /**
    Built for a blocks that will change rotation via Regolith jsonte filter definition:
    data: {
    "rotations_view_1":[
        {"id":0 ,"type":"floor"   ,"blockFace":"up"   ,"playerFace":"north" ,"position":"up"    ,"rotation":[0,0,0] },
        {"id":0 ,"type":"floor"   ,"blockFace":"up"   ,"playerFace":"west"  ,"position":"up"    ,"rotation":[0,90,0]},
        {"id":0 ,"type":"floor"   ,"blockFace":"up"   ,"playerFace":"south" ,"position":"up"    ,"rotation":[0,180,0]},
        {"id":0 ,"type":"floor"   ,"blockFace":"up"   ,"playerFace":"east"  ,"position":"up"    ,"rotation":[0,-90,0]},

        {"id":1 ,"type":"ceiling"     ,"blockFace":"down"   ,"playerFace":"north" ,"position":"up"  ,"rotation":[0,0,180]},
        {"id":1 ,"type":"ceiling"     ,"blockFace":"down"   ,"playerFace":"west"  ,"position":"up"  ,"rotation":[0,-90,180]},
        {"id":1 ,"type":"ceiling"     ,"blockFace":"down"   ,"playerFace":"south" ,"position":"up"  ,"rotation":[180,0,0]},
        {"id":1 ,"type":"ceiling"     ,"blockFace":"down"   ,"playerFace":"east"  ,"position":"up"  ,"rotation":[0,90,180]},

        //in 2D  where blockFace=PlayerFacing - down 
        {"id":3 ,"type":"side"  ,"blockFace":"south"    ,"playerFace":"north"   ,"position":"up"    ,"rotation":[90,0,0]}, //90,0 0
        {"id":3 ,"type":"side"  ,"blockFace":"south"    ,"playerFace":"west"    ,"position":"left"  ,"rotation":[90,0,90]}, //yes
        {"id":3 ,"type":"side"  ,"blockFace":"south"    ,"playerFace":"east"    ,"position":"right" ,"rotation":[90,0,270]}, //yes 90,0,270
        {"id":3 ,"type":"side"  ,"blockFace":"south"    ,"playerFace":"south"   ,"position":"down"  ,"rotation":[90,0,180]}, //90,0,180

        {"id":2 ,"type":"side"  ,"blockFace":"north"    ,"playerFace":"south"   ,"position":"up"    ,"rotation":[90,180,0]},   // & 270,0,90
        {"id":2 ,"type":"side"  ,"blockFace":"north"    ,"playerFace":"east"    ,"position":"left"  ,"rotation":[90,180,270]},  // & 270, 0 ,180
        {"id":2 ,"type":"side"  ,"blockFace":"north"    ,"playerFace":"west"    ,"position":"right" ,"rotation":[90,180,90]},   // & 270,0,90
        {"id":2 ,"type":"side"  ,"blockFace":"north"    ,"playerFace":"north"   ,"position":"down"  ,"rotation":[90,180,180]},   // & 270,0,0

        {"id":4 ,"type":"side"  ,"blockFace":"west"     ,"playerFace":"east"   ,"position":"up"    ,"rotation":[0,270,90]},
        {"id":4 ,"type":"side"  ,"blockFace":"west"     ,"playerFace":"north"  ,"position":"left"  ,"rotation":[0,0,90]},
        {"id":4 ,"type":"side"  ,"blockFace":"west"     ,"playerFace":"south"  ,"position":"right" ,"rotation":[0,180,90]},
        {"id":4 ,"type":"side"  ,"blockFace":"west"     ,"playerFace":"west"   ,"position":"down"  ,"rotation":[0,90,90]},

        {"id":5 ,"type":"side"  ,"blockFace":"east"     ,"playerFace":"west"   ,"position":"up"    ,"rotation":[0,90,-90]}, //yes
        {"id":5 ,"type":"side"  ,"blockFace":"east"     ,"playerFace":"south"  ,"position":"left"  ,"rotation":[0,180,270]}, //0,180,270
        {"id":5 ,"type":"side"  ,"blockFace":"east"     ,"playerFace":"north"  ,"position":"right" ,"rotation":[0,0,-90]},  //yes
        {"id":5 ,"type":"side"  ,"blockFace":"east"     ,"playerFace":"east"   ,"position":"down"  ,"rotation":[0,-90,-90] } //correct
        
    ],
    "rotations_view_2":[
        //n,s,e,w keys are which way is the top of the picture - block face is side of other block
        {"id":0 ,"type":"floor"  ,"blockFace":"up"   ,"north":[0,0,0]   ,"south":[0,180,0]  ,"west":[0,90,0]    ,"east":[0,-90,0]},
        {"id":1 ,"type":"ceiling","blockFace":"down" ,"north":[0,0,180] ,"south":[180,0,0]  ,"west":[0,-90,180] ,"east":[0,90,180]},

        //in 2D  up=north, down=south, left-west, right=east -- opposite is player facing facing that blockFace
        {"id":2 ,"type":"side"  ,"blockFace":"north"    ,"opposite":"south" ,"up":[90,180,0]    ,"left":[90,180,270]    ,"right":[90,180,90]   ,"down":[90,180,180]  },
        {"id":3 ,"type":"side"  ,"blockFace":"south"    ,"opposite":"north" ,"up":[90,0,0]      ,"left":[90,0,90]       ,"right":[90,0,270]    ,"down":[90,0,180]   },
        {"id":4 ,"type":"side"  ,"blockFace":"west"     ,"opposite":"east"  ,"up":[0,-90,90]    ,"left":[0,0,90]        ,"right":[0,180,90]    ,"down":[0,90,90]   },
        {"id":5 ,"type":"side"  ,"blockFace":"east"     ,"opposite":"west"  ,"up":[0,90,-90]    ,"left":[0,180,270]     ,"right":[0,0,-90]     ,"down":[0,-90,-90] }        
    ],
    }
    "$scope":{
        "ceiling_floor": "{{rotations_view_1.filter(x => x.id <= 1)}}",
        "vertical_half": "{{rotations_view_2.filter(x => x.type =='side')}}",  // initial placement     
        "vertical_side": "{{rotations_view_1.filter(x => x.type =='side' && (x.position == 'left' || x.position == 'right'))}}"
    },
    {
        "{{#ceiling_floor}}":{
            "condition": "query.block_state('minecraft:block_face') == '{{blockFace}}' && q.block_state('minecraft:cardinal_direction') == '{{playerFace}}'",
            "components": {"minecraft:transformation":{"rotation": "{{rotation}}"      }}
        }                    
    },
    //wall - point up and down
    {
        "{{#vertical_half}}":[
            {
                "condition": "query.block_state('minecraft:block_face') == '{{blockFace}}' && q.block_state('minecraft:cardinal_direction') == '{{opposite}}' && q.block_state('minecraft:vertical_half') == 'top'",
                "components": {"minecraft:transformation":{"rotation": "{{up}}"  }}
            },
            {
                "condition": "query.block_state('minecraft:block_face') == '{{blockFace}}' && q.block_state('minecraft:cardinal_direction') == '{{opposite}}' && q.block_state('minecraft:vertical_half') == 'bottom'",
                "components": {"minecraft:transformation":{"rotation": "{{down}}" }}
            }
        ]
    },
    //wall - point sideways
    {
        "{{#vertical_side}}":{
            "condition": "query.block_state('minecraft:block_face') == '{{blockFace}}' && q.block_state('minecraft:cardinal_direction') == '{{playerFace}}'",
            "components": {"minecraft:transformation":{"rotation": "{{rotation}}"      }}
        }                    
    }                    
     */
    /**
     * 
     * Changes cardinal rotation when player touches left/right edge center of block so that above rotation works in block file
     * 
     * @param {BlockComponentPlayerPlaceBeforeEvent} event 
     * @param {boolean} [debugOn=false] 
     * @returns {boolean}
     */
    onPlace_block_rotation_arrow (event, debugOn=false) {
        const player = event.player;
        if (!player || !player.isValid) return false;
        if (!event.block.isValid) return false;        
        
        const { block: newBlock, face: touchedBlockFace, permutationToPlace: old_permutation } = event;
        const itemTypeId = old_permutation.type.id;
        const lastInteractInfo = DynamicPropertyLib.onPlayerInteractWithBlockBeforeEventInfo_get(player, false);
        let msg = `§6§lonPlace-${itemTypeId}:§r in ${lastInteractInfo.blockTypeId} face=${touchedBlockFace} in ${event.dimension.id} §d(Tick:${system.currentTick})`;

        const verifiedMsg = this.verifyLastInteractInfoRelated(lastInteractInfo, itemTypeId, newBlock);
        if (!verifiedMsg.endsWith('Verified')) {
            msg += `\n§cxx> verifyLastInteractInfoRelated failed: ${verifiedMsg}`;
            this.dev.alertError(msg);
            return false;
        }
        //---------------------------------------------------------------------------------
        /* these are verified above, but for the JSDoc, need to show in here */
        const touchedBlockFaceLocation = lastInteractInfo.faceLocation;
        if (!touchedBlockFaceLocation) return false;
        const touchedBlockLocation = lastInteractInfo.blockLocation;
        if (!touchedBlockLocation) return false;
        const touchedBlock = newBlock.dimension.getBlock(touchedBlockLocation);
        if (!touchedBlock) return false;
        //---------------------------------------------------------------------------------
        if (debugOn) { msg += Blocks.blockPermutationInfo_show(old_permutation, '§6onPlace-permutation§r', true) ?? ''; }
        const grid = new FaceLocationGrid(touchedBlockFaceLocation, touchedBlockFace, touchedBlockLocation, false);
        const grid3 = grid.grid(3);
        // const touchedGridPtr = grid3.x + (3 * grid3.y);
        const touchedEdgeName = grid.getEdgeName(3);
        if (debugOn) { msg += grid.blockFaceLocationInfo_show([ 2, 3, 4 ], true) ?? ''; }

        //if no rotation needed
        if (
            [ 'Up', "Down" ].includes(touchedBlockFace) ||
            grid3.y !== 1 ||
            grid3.x == 1 ||
            ![ 'north', 'south', 'east', 'west' ].includes(touchedEdgeName)
        ) {
            if (debugOn) {
                msg += `\n\n§6No new permutation needed`;
                msg += `\n§bUp/Down:§r ${[ 'Up', "Down" ].includes(touchedBlockFace)}`;
                msg += `\n§bx == 1:§r ${grid3.x == 1}`;
                msg += `\n§by != 1:§r ${grid3.y !== 1}`;
                msg += `\n§b![ 'north', 'south', 'east', 'west' ].includes(${touchedEdgeName}):§r ${![ 'north', 'south', 'east', 'west' ].includes(touchedEdgeName)}`;
                this.dev.alertLog(msg,debugOn);
            }
            return true;
        }

        //reset permutation position    
        const blockStateName = 'minecraft:cardinal_direction';
        let newPermutation = old_permutation.withState(blockStateName, touchedEdgeName);
        event.cancel = true;
        system.run(() => {
            msg += `\n§aSetting block state = ${blockStateName} to ${touchedEdgeName} on face=${event.face}`;
            newBlock.dimension.setBlockPermutation(newBlock.location, newPermutation);
            if (debugOn) {
                system.runTimeout(() => {
                    msg += Blocks.blockPermutationInfo_show(newPermutation, '\n§aNew Block-permutation§r', true);
                    this.dev.alertLog(msg,debugOn);
                }, 1);
            }
        });
        return true;
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