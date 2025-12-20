// BlockFace.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T
URL: https://github.com/DrinkWater623
========================================================================
Change Log:
    20251125 - Created File 
    20251129 - Fixed xDelta and yDelta per Non Absolute and player location - because it was wrong before
    20251204 - Added debug to message   
    20251219 - Fix Face Grid once and for all....

========================================================================*/
//=============================================================================
import { Direction, Player, world } from "@minecraft/server";
// shared
import { AngleMath, Compass, toDirection } from "../tools/rotationLib";
import { round } from "../tools/mathLib";
import { Vector2Lib, Vector3Lib } from "../tools/vectorClass";
import { Blocks } from "./blockLib";
//=============================================================================
/** @typedef {import("@minecraft/server").Vector2} Vector2 */
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** @typedef {import("@minecraft/server").VectorXZ} VectorXZ */
/**
 * @typedef {'north' | 'south' | 'east' | 'west'} CardinalBlockFace
 * 
 * @typedef {'up'|'down'|'north'|'south'|'east'|'west'} BlockFaces
 * @typedef {'Up'|'Down'|'North'|'South'|'East'|'West'} BlockFacesTitle
 * 
 * @typedef {'up' | 'down' |
 *  'north' | 'south' | 'east' | 'west' |
 *  'up-north' | 'up-south' | 'up-east' | 'up-west' |
 *  'down-north' | 'down-south' | 'down-east' | 'down-west' |
 *  'center'} EdgeName
 * 
 * 0..7 grid coordinate (for 2px bands on a 16px face).
 * @typedef {0|1|2|3|4|5|6|7} GridCoord
 */
//=============================================================================
const compass = new Compass();
//=============================================================================
/** @type {Record<string, { face:CardinalBlockFace,left: CardinalBlockFace, right: CardinalBlockFace, opposite: CardinalBlockFace }>} */
const faceHorizontalMap = {
    // Standing at each face, looking at the block:
    // south face -> facing north: left = west, right = east
    north: { face: 'north', left: 'west', right: 'east', opposite: 'south' },

    // north face -> facing south: left = east, right = west
    south: { face: 'south', left: 'east', right: 'west', opposite: 'north' },

    // east face -> facing west: left = south, right = north
    west: { face: 'west', left: 'south', right: 'north', opposite: 'east' },

    // west face -> facing east: left = north, right = south
    east: { face: 'east', left: 'north', right: 'south', opposite: 'west' },
};
//=============================================================================
/**
 * Given a face and a 3×3 local coordinate on that face,
 * return a direction label like "down-east", "up", "west", or "center".
 *
 * (0,0) is the lower-right corner; x increases to the left, y increases upward.
 *
 * @param {CardinalBlockFace} face
 * @param {number} x - 0 = right edge, xyMax = left edge
 * @param {number} y - 0 = bottom edge, xyMax = top edge
 * @param {number} [xyMax=2] - max index; 7 = full 16px face at 2px per band
 * @returns {EdgeName}
 */
export function getHitEdgeName (face, x, y, xyMax = 2) {
    const map = faceHorizontalMap[ face ];
    if (!map) return face;

    /** @type {BlockFaces[]} */
    const parts = [];

    if (y === 0) parts.push('down');
    else if (y === xyMax) parts.push('up');

    // if ([ 'north', 'west' ].includes(face)) {
    //     if (x === 0) parts.push(map.right);
    //     else if (x === xyMax) parts.push(map.left);
    // }
    // else {
        if (x === 0) parts.push(map.left);
        else if (x === xyMax) parts.push(map.right);
    // }

    if (parts.length === 0) return 'center';

    return /** @type {EdgeName} */ (parts.join('-'));
}
//===============================================================================
/**
 * 
 * @param {number} number 
 */
function decimalPart (number) {
    return number - Math.trunc(number);
}
//==============================================================================
export class FaceLocationGrid {
    #og_xDelta = 0;
    #og_yDelta = 0;
    /**
     * 
     * @param {Vector3} faceLocation 
     * @param {BlockFaces | BlockFacesTitle | Direction} blockFace
     * @param {Vector3} blockLocation 
     * @param {boolean} [debug=false] 
     */
    constructor(faceLocation, blockFace, blockLocation, debug = false) {

        this.faceLocation =
            Vector3Lib.new(
                round(decimalPart(faceLocation.x), 2),
                round(decimalPart(faceLocation.y), 2),
                round(decimalPart(faceLocation.z), 2)
            );
        this.blockFace = blockFace.toLowerCase();
        this.xCoordPos = !!(blockLocation.x >= 0);
        this.zCoordPos = !!(blockLocation.z >= 0);
        this.blockLocation = blockLocation;
        //up/down is static   NW corner is zero always
        this.isWall = ![ 'up', 'down' ].includes(this.blockFace);
        if (!this.isWall) { //works for grid now
            this.horizontalDelta = this.faceLocation.x;
            this.verticalDelta = this.faceLocation.z;

            if (this.blockFace == 'down') {
                this.horizontalDelta = 1 - this.horizontalDelta;
                this.verticalDelta = this.verticalDelta;
            }

            if (!this.xCoordPos && this.zCoordPos) {
                this.horizontalDelta = 1 - this.horizontalDelta;
            }
            else if (this.xCoordPos && !this.zCoordPos) {
                this.verticalDelta = 1 - this.verticalDelta;
            }
            else if (!this.xCoordPos && !this.zCoordPos) {
                this.horizontalDelta = 1 - this.horizontalDelta;
                this.verticalDelta = 1 - this.verticalDelta;
            }
            // }
            // else {
            //     this.horizontalDelta = 1 - this.faceLocation.x;
            //     this.verticalDelta = this.faceLocation.z;
            //}
        }
        else {
            this.verticalDelta = this.faceLocation.y;
            if (blockLocation.y < 0) this.verticalDelta = 1 - this.verticalDelta;

            this.horizontalDelta = ([ 'north', 'south' ].includes(this.blockFace))
                ? this.faceLocation.x
                : this.faceLocation.z;

            if (this.xCoordPos && this.zCoordPos && [ 'south', 'west' ].includes(this.blockFace)) this.horizontalDelta = 1 - this.horizontalDelta;
            else if (this.xCoordPos && !this.zCoordPos && [ 'south', 'east' ].includes(this.blockFace)) this.horizontalDelta = 1 - this.horizontalDelta;
            else if (!this.xCoordPos && this.zCoordPos && [ 'north', 'west' ].includes(this.blockFace)) this.horizontalDelta = 1 - this.horizontalDelta;
            else if (!this.xCoordPos && !this.zCoordPos && [ 'north', 'east' ].includes(this.blockFace)) this.horizontalDelta = 1 - this.horizontalDelta;
        }
        console.warn(`§l§6zOG => horizontalDelta: ${this.horizontalDelta}  upDownDelta: ${this.verticalDelta}`);
        this.faceMap = faceHorizontalMap[ this.blockFace ];

        this.hvDelta = Vector2Lib.new(this.horizontalDelta, this.verticalDelta);
        const grid2 = this.grid(2);
        this.verticalHalf = grid2.y;
        this.horizontalHalf = grid2.x;

        if (debug) this.blockFaceLocationInfo_show([ 2, 3, 4, 5, 6, 7, 8 ]);
    }
    /**
     * 
     * @param {number} base 
     * @param {boolean} [inverseX=false] 
     * @returns {Vector2}
     */
    grid (base = 1, inverseX = false) {
        if (base == 0) base = 1;
        const returnVal= Vector2Lib.new(Math.floor(this.horizontalDelta * base), Math.floor(this.verticalDelta * base));        
        return returnVal
    }

    //for up/down can alter to be relative to player rotation
    /**
     * 
     * @param {Player} player 
     */
    adjustUpDownToPlayerRotation (player) {
        if ([ 'up', 'down' ].includes(this.blockFace) &&
            player &&
            player.isValid)
            this.adjustUpDownToPlayerAngle(player.getRotation().y);
    }
    //for up/down can alter to be relative to player rotation
    /**
     * 
     * @param {number} rotationY      
     */
    adjustUpDownToPlayerAngle (rotationY) {
        if (![ 'up', 'down' ].includes(this.blockFace))
            return;

        const direction = compass.degrees[ rotationY ].direction.cardinal.toLowerCase();
        //world.sendMessage(`rotationY=${Math.round(rotationY,1} - -angle = Dir=${direction}`)
        this.adjustUpDownToPlayerDirection(direction);
    }
    //for up/down can alter to be relative to player rotation
    /**
     * 
     * @param {string} direction      
     */
    adjustUpDownToPlayerDirection (direction) {
        if (![ 'up', 'down' ].includes(this.blockFace))
            return;
        world.sendMessage('in here');
        //TODO: figure out later, not needed yet
        //world.sendMessage(`altering for ${direction}`);
        switch (direction) {
            case 'north': [ this.horizontalDelta, this.verticalDelta ] = [ this.#og_xDelta, this.#og_yDelta ];
                break;
            case 'south': [ this.horizontalDelta, this.verticalDelta ] = [ 1 - this.#og_xDelta, 1 - this.#og_yDelta ];
                break;
            case 'west': [ this.horizontalDelta, this.verticalDelta ] = [ 1 - this.#og_yDelta, this.#og_xDelta ];
                break;
            case 'east': [ this.horizontalDelta, this.verticalDelta ] = [ this.#og_yDelta, 1 - this.#og_xDelta ];
                break;
            default:
                return;
        }

        if (this.blockFace == 'down') {
            //reverse for when looking up.  Imagine looking at paper
            this.horizontalDelta = 1 - this.horizontalDelta;
            this.verticalDelta = 1 - this.verticalDelta;
        }

        // reset these vars
        this.hvDelta = Vector2Lib.new(this.horizontalDelta, this.verticalDelta);
        const grid2 = this.grid(2);
        this.verticalHalf = grid2.y;
        this.horizontalHalf = grid2.x;
    }
    /**
     * Return a direction label ("down-east", "up", "west", "center", etc.)
     * using an N×N grid over the face (default 8 bands => 0..7).
     *
     * @param {number} [bands=3] - number of grid bands per side (8 => 0..7 indices)
     * @returns {EdgeName}
     */
    getEdgeName (bands = 3) {
        if (bands < 2) bands = 2;
        const xyMax = bands - 1;

        // We only defined the N S E W mapping so far; skip up/down for now,
        // or you can later decide a scheme for top/bottom edges.
        if (this.blockFace === 'up' || this.blockFace === 'down') {
            return /** @type {EdgeName} */ ('center');
        }

        const g = this.grid(bands); // g.x, g.y in 0..xyMax

        return getHitEdgeName(
            /** @type {CardinalBlockFace} */(this.blockFace),
            g.x,
            g.y,
            xyMax
        );
    }
    /**
    * @param {number[]} [grids=[3]]  
    * @param {boolean} [returnOnly=false] 
    * @returns {string|void}
    */
    blockFaceLocationInfo_show (grids = [ 3 ], returnOnly = false) {

        //const grid = new FaceLocationGrid(faceLocation, blockFace, player, false);
        let msg = '\n§dFaceLocationGrid:';

        msg += `\n==> §bFaceLocation:§r ${Vector3Lib.toString(this.faceLocation, 1, true)} - §bx-Pos:§r${this.xCoordPos} §bz-Pos:§r${this.zCoordPos}`;
        for (let i = 2; i <= 16; i++) {
            if (grids.includes(i)) {
                const subGrid = this.grid(i);
                const touched = subGrid.x + (i * subGrid.y);
                msg += `\n==> §bGrid-${i}:§r ${Vector2Lib.toString(subGrid, 0, true)} / §bTouch ptr:§r ${touched} / §bEdge:§r ${this.getEdgeName(i)}`;
            }
        }

        if (returnOnly) return msg;
        console.warn(msg);
    }
}
//=============================================================================
//End of FIle
//=============================================================================