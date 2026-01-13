// Block_Events.js  Shared Class
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Change Log:
    20251223 - Moved to own Class File
========================================================================*/
import { Block, BlockPermutation, system } from "@minecraft/server";
import { BlockComponentPlayerPlaceBeforeEvent } from "@minecraft/server";
// Shared
import { DynamicPropertyLib } from "../tools/dynamicPropertyClass.js";
import { Vector3Lib } from "../tools/vectorClass.js";
import { FaceLocationGrid } from "./blockFace.js";
import { Blocks } from "./blockLib.js";
//=============================================================================
/** @typedef {boolean | number | string} BlockStateValueType */
//=============================================================================
export class Block_Events {
    /**
   * @param {{ alertLog: Function, alertWarn: Function, alertSuccess: Function, alertError: Function }} emitters
   */
    constructor(emitters) {
        this.dev = emitters;
    }
    //==============================================================================
    //  Utilities - may move to static class in this file.  
    //==============================================================================
    /*
        Bar Positions: based on these positions
        "grid":0 ,"geo_sfx":"east_ns" 	
        "grid":1 ,"geo_sfx":"south_ew" 
        "grid":2 ,"geo_sfx":"west_ns"  
        "grid":3 ,"geo_sfx":"north_ew" 
        "grid":4 ,"geo_sfx":"center_ew"
        "grid":5 ,"geo_sfx":"center_ns"
            <-x->0
            ____3____  
            |   5    |  ^
            2 4 + 4  0  y
            |   5    |  v
            ----1-----  0

        y moves 0=south - 2=north, x moves 0=east - 2=west  - 1 is center row/column
    */
    /**
     * Finds the best position for the bar based on where touched
     *  
     * @param {FaceLocationGrid} grid 
     * @returns {number}
     */
    bar_gridPositionPtr_get (grid) {
        const grid7 = grid.grid(7);
        //Edge edges
        if (grid7.x == 0) return 0;
        if (grid7.y == 0) return 1;
        if (grid7.x == 6) return 2;
        if (grid7.y == 6) return 3;

        const grid5 = grid.grid(5);
        //Dead Center 
        if (grid7.x == 3 && grid7.y == 3) return 4;
        if (grid5.x == 2 && grid5.y == 2) return 5;

        const grid3 = grid.grid(3);
        //Dead-ish Center     
        if ([ 1, 2, 4, 5 ].includes(grid7.x) && grid3.y == 1) return 4;
        if ([ 1, 2, 4, 5 ].includes(grid7.y) && grid3.x == 1) return 5;

        //around the center
        if (grid3.x == 1 && [ 1, 3 ].includes(grid5.y)) return 4;
        if (grid3.y == 1 && [ 1, 3 ].includes(grid5.x)) return 5;

        const grid4 = grid.grid(4);
        if (grid4.x == 0 && ![ 0, 4 ].includes(grid5.y)) return 0;
        if (grid4.y == 0 && ![ 0, 4 ].includes(grid5.x)) return 1;
        if (grid4.x == 3 && ![ 0, 4 ].includes(grid5.y)) return 2;
        if (grid4.y == 3 && ![ 0, 4 ].includes(grid5.x)) return 3;

        //rest of sides default
        if (grid3.x == 0) return 0;
        if (grid3.y == 0) return 1;
        if (grid3.x == 2) return 2;
        if (grid3.y == 2) return 3;

        return 5;
    }
    /**
     * 
     * @param {*} lastInteractInfo 
     * @param {string} itemTypeId 
     * @param {Block} newBlock 
     * @returns {string}
     */
    lastInteractInfo_verify (lastInteractInfo, itemTypeId, newBlock) {
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
    /**
     * @param {Block} block 
     * @param {BlockPermutation} permutation 
     * @param {string} blockStateName 
     * @param {BlockStateValueType} newBlockState 
     * @param {{soundId?:string,debugOn?:boolean,debugMsg?:string}} [opts={}] 
     */
    newBlockPermutation_setBlock (block, permutation, blockStateName, newBlockState, opts = {}) {
        const { soundId = 'hit.stone', debugOn = false } = opts;
        let { debugMsg = '' } = opts;

        //@ts-ignore
        let newPermutation = permutation.withState(blockStateName, newBlockState);
        system.run(() => {
            debugMsg += `\n§aSetting block state = ${blockStateName} to ${newBlockState}`;
            block.dimension.setBlockPermutation(block.location, newPermutation);
            block.dimension.playSound(soundId, block.location);

            if (debugOn) {
                system.runTimeout(() => {
                    debugMsg += Blocks.blockPermutationInfo_show(newPermutation, '\n§aNew Block-permutation§r', true);
                    this.dev.alertSuccess(debugMsg);
                }, 1);
            }
        });
    }
    //=======================================================================================================
    /*  onPlace custom component by block style - for changing block permutation for rotation on my blocks */
    //=======================================================================================================
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
     * Changes cardinal rotation when player touches left/right edge center of block so that above rotation works in block file
     * This can be used for Arrows, Letters, anything with an orientation like a picture.
     * 
     * @param {BlockComponentPlayerPlaceBeforeEvent} event 
     * @param {string} blockStateName
     * @param {{soundId?:string,debugOn?:boolean}} [opts={}] 
     * @returns {boolean}
     */
    onPlace_block_rotation_arrow (event, blockStateName, opts = {}) {
        const player = event.player;
        if (!player || !player.isValid) return false;
        if (!event.block.isValid) return false;

        const { soundId = 'hit.stone', debugOn = false } = opts;

        const { block: newBlock, face: touchedBlockFace, permutationToPlace: old_permutation } = event;
        const itemTypeId = old_permutation.type.id;
        const lastInteractInfo = DynamicPropertyLib.onPlayerInteractWithBlockBeforeEventInfo_get(player, false);
        let debugMsg = `§6§lonPlace-${itemTypeId}:§r in ${lastInteractInfo.blockTypeId} face=${touchedBlockFace} in ${event.dimension.id} §d(Tick:${system.currentTick})`;

        const verifiedMsg = this.lastInteractInfo_verify(lastInteractInfo, itemTypeId, newBlock);
        if (!verifiedMsg.endsWith('Verified')) {
            debugMsg += `\n§cxx> verifyLastInteractInfoRelated failed: ${verifiedMsg}`;
            this.dev.alertError(debugMsg);
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
        if (debugOn) { debugMsg += Blocks.blockPermutationInfo_show(old_permutation, '§6onPlace-permutation§r', true) ?? ''; }
        const grid = new FaceLocationGrid(touchedBlockFaceLocation, touchedBlockFace, touchedBlockLocation, false);

        //where it is different - starts here
        if (debugOn) { debugMsg += grid.blockFaceLocationInfo_show([ 2, 3, 4 ], true) ?? ''; }

        //if no rotation needed 1
        if ([ 'Up', "Down" ].includes(touchedBlockFace)) {
            debugMsg += `\n\n§6No new permutation needed based on`;
            debugMsg += `\n§bUp/Down:§r ${[ 'Up', "Down" ].includes(touchedBlockFace)}`;
            this.dev.alertLog(debugMsg, debugOn);
            return false;
        }

        //@ts-ignore
        const currentBlockStateValue = event.permutationToPlace.getState(blockStateName);
        if (!currentBlockStateValue) return false;

        const newBlockState = grid.getEdgeName(3);

        //if no rotation needed 2
        if (newBlockState === currentBlockStateValue) {
            debugMsg += `\n\n§6No new permutation needed - Same as default permutation `;
            this.dev.alertLog(debugMsg, debugOn);
            return false;
        }
        //if no rotation needed 3
        if (![ 'north', 'south', 'east', 'west' ].includes(newBlockState)) {
            debugMsg += `\n\n§6No new permutation needed based on`;
            debugMsg += `\n§bUp/Down:§r ${[ 'Up', "Down" ].includes(touchedBlockFace)}`;
            debugMsg += `\n§b![ 'north', 'south', 'east', 'west' ].includes(${newBlockState}):§r ${![ 'north', 'south', 'east', 'west' ].includes(newBlockState)}`;
            this.dev.alertLog(debugMsg, debugOn);
            return false;
        }

        //if no rotation needed 4
        const grid3 = grid.grid(3);
        if (grid3.x == 1 || grid3.y !== 1) {
            debugMsg += `\n\n§6No new permutation needed based on: §bx == 1:§r ${grid3.x == 1} and/or §by != 1:§r ${grid3.y !== 1}`;
            this.dev.alertLog(debugMsg, debugOn);
            return false;
        }

        //update permutation 
        this.newBlockPermutation_setBlock(newBlock, old_permutation, blockStateName, newBlockState, { soundId, debugOn, debugMsg });
        return true;
    }
    /**
    * a Bar is a 1/9 slice of a block.  all 6 geo positions must be used in your block file
    * Changes cardinal rotation when player touches left/right edge center of block so that above rotation works in block file
    * 
    * @param {BlockComponentPlayerPlaceBeforeEvent} event 
    * @param {string} blockStateName 
    * @param {{soundId?:string,debugOn?:boolean}} [opts={}] 
    * @returns {boolean}
    */
    onPlace_block_rotation_bar (event, blockStateName, opts = {}) {
        const player = event.player;
        if (!player || !player.isValid) return false;
        if (!event.block.isValid) return false;

        const { soundId = 'hit.stone', debugOn = false } = opts;

        const { block: newBlock, face: touchedBlockFace, permutationToPlace: old_permutation } = event;
        const itemTypeId = old_permutation.type.id;
        const lastInteractInfo = DynamicPropertyLib.onPlayerInteractWithBlockBeforeEventInfo_get(player, false);
        let debugMsg = `§6§lonPlace-${itemTypeId}:§r in ${lastInteractInfo.blockTypeId} face=${touchedBlockFace} in ${event.dimension.id} §d(Tick:${system.currentTick})`;

        const verifiedMsg = this.lastInteractInfo_verify(lastInteractInfo, itemTypeId, newBlock);
        if (!verifiedMsg.endsWith('Verified')) {
            debugMsg += `\n§cxx> verifyLastInteractInfoRelated failed: ${verifiedMsg}`;
            this.dev.alertError(debugMsg);
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
        if (debugOn) { debugMsg += Blocks.blockPermutationInfo_show(old_permutation, '§6onPlace-permutation§r', true) ?? ''; }
        const grid = new FaceLocationGrid(touchedBlockFaceLocation, touchedBlockFace, touchedBlockLocation, false);

        //where it is different - starts here
        if (debugOn) { debugMsg += grid.blockFaceLocationInfo_show([ 3, 4, 5, 6, 7, 8 ], true); }
        //const grid3 = grid.grid(3);

        const newBlockState = this.bar_gridPositionPtr_get(grid);
        //@ts-ignore
        const currentBlockStateValue = event.permutationToPlace.getState(blockStateName);
        if (!currentBlockStateValue) return false;

        //if no rotation needed
        if (newBlockState === currentBlockStateValue) {
            debugMsg += `\n\n§6No new permutation needed:§b Grid Ptr = §r${newBlockState} `;
            this.dev.alertLog(debugMsg, debugOn);
            return false;
        }

        this.newBlockPermutation_setBlock(newBlock, old_permutation, blockStateName, newBlockState, { soundId, debugOn, debugMsg });
        return true;
    }    
    /**
    * a Mini Block is a 1/27th piece of a block.  all 9 geo positions must be used in your block file
    * Changes cardinal rotation when player touches left/right edge center of block so that above rotation works in block file
    * 
    * @param {BlockComponentPlayerPlaceBeforeEvent} event 
    * @param {number} rows
    * @param {string} blockStateName 
    * @param {{soundId?:string,debugOn?:boolean}} [opts={}] 
    * @returns {boolean}
    */
    onPlace_block_rotation_mini_square (event, rows,blockStateName, opts = {}) {
        const player = event.player;
        if (!player || !player.isValid) return false;
        if (!event.block.isValid) return false;

        const { soundId = 'hit.stone', debugOn = false } = opts;

        const { block: newBlock, face: touchedBlockFace, permutationToPlace: old_permutation } = event;
        const itemTypeId = old_permutation.type.id;
        const lastInteractInfo = DynamicPropertyLib.onPlayerInteractWithBlockBeforeEventInfo_get(player, false);
        let debugMsg = `§6§lonPlace-${itemTypeId}:§r in ${lastInteractInfo.blockTypeId} face=${touchedBlockFace} in ${event.dimension.id} §d(Tick:${system.currentTick})`;

        const verifiedMsg = this.lastInteractInfo_verify(lastInteractInfo, itemTypeId, newBlock);
        if (!verifiedMsg.endsWith('Verified')) {
            debugMsg += `\n§cxx> verifyLastInteractInfoRelated failed: ${verifiedMsg}`;
            this.dev.alertError(debugMsg);
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
        if (debugOn) { debugMsg += Blocks.blockPermutationInfo_show(old_permutation, '§6onPlace-permutation§r', true) ?? ''; }
        const grid = new FaceLocationGrid(touchedBlockFaceLocation, touchedBlockFace, touchedBlockLocation, false);

        //where it is different - starts here
        if (debugOn) { debugMsg += grid.blockFaceLocationInfo_show([ rows-1, rows, rows+1 ], true) ?? ''; }
        const gridN = grid.grid(rows);

        const newBlockState = gridN.x + (rows * gridN.y);
        //@ts-ignore
        const currentBlockStateValue = event.permutationToPlace.getState(blockStateName);
        if (!currentBlockStateValue) return false;

        //if no rotation needed
        if (newBlockState === currentBlockStateValue) {
            debugMsg += `\n\n§6No new permutation needed - Same as default permutation `;
            this.dev.alertLog(debugMsg, debugOn);
            return false;
        }

        //update permutation 
        this.newBlockPermutation_setBlock(newBlock, old_permutation, blockStateName, newBlockState, { soundId, debugOn, debugMsg });
        return true;
    }
}