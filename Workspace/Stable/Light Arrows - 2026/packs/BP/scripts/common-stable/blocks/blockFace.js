// blockFace.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T
URL: https://github.com/DrinkWater623
========================================================================
Change Log:
    20251125 - Created File 
    20251129 - Fixed xDelta and yDelta per Non Absolute and player location - because it was wrong before   
========================================================================*/
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
/** @typedef {import("@minecraft/server").Vector2} Vector2 */
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** @typedef {import("@minecraft/server").VectorXZ} VectorXZ */
//=============================================================================
import { Direction, Player, world } from "@minecraft/server";
// shared
import { AngleMath, Compass } from "../../common-other/rotationLib";
import { rotationToCardinalDirection, Vector2Lib, Vector3Lib } from "../../common-other/vectorClass";
import { round } from "../../common-other/mathLib";
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

    if (x === 0) parts.push(map.right);
    else if (x === xyMax) parts.push(map.left);

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
     * @param {import("../../common-other/vectorClass").Vector3} faceLocation 
     * @param {BlockFaces | BlockFacesTitle} blockFace
     * @param {Player} player 
     * @param {boolean} [absolute=false] default false - use true to turn off relativity     
     */
    constructor(faceLocation, blockFace, player, absolute = false) {

        this.faceLocation =
            Vector3Lib.new(
                round(decimalPart(faceLocation.x), 2),
                round(decimalPart(faceLocation.y), 2),
                round(decimalPart(faceLocation.z), 2)
            );
        this.blockFace = blockFace.toLowerCase();

        this.playerLocation = Vector3Lib.floor(player.location);
        this.playerRotation = AngleMath.negativeAngleConvert(Math.floor(player.getRotation().y));
        this.playerCardinalDirection = compass.degrees[ this.playerRotation ].direction.cardinal.toLowerCase();
        //world.sendMessage(`${this.playerRotation} - ${this.playerCardinalDirection}`)

        //up/down is static   NW corner is zero always
        this.isWall = ![ 'up', 'down' ].includes(this.blockFace);
        if (!this.isWall) { //works for grid now

            if (this.blockFace == 'up') {
                this.xDelta = this.faceLocation.x;
                this.yDelta = this.faceLocation.z;
            }
            else {
                this.xDelta = 1 - this.faceLocation.x;
                this.yDelta = this.faceLocation.z;
            }            
        }
        else {
            this.yDelta = this.faceLocation.y;
            this.xDelta = ([ 'north', 'south' ].includes(this.blockFace)) ? this.faceLocation.x : this.faceLocation.z;
        }

        this.faceMap = faceHorizontalMap[ this.blockFace ];

        //because depending on + or - coordinates, grid will be off in diff ways
        if (this.isWall && !absolute && this.playerLocation) {

            /**@type {CardinalBlockFace} */
            let bFace = this.faceMap.face;
            let changed = false;
            // if ([ 'up', 'down' ].includes(this.blockFace)) {
            //     bFace = rotationToCardinalDirection(this.playerLocation.y);
            //     bFace = this.faceMap.opposite;
            //     world.sendMessage(`§l§eAs Face ${bFace}`);
            // }

            if (this.playerLocation.x < 0 && this.playerLocation.z < 0) {
                if (bFace == 'east' || bFace == 'north') {
                    this.xDelta = 1 - this.xDelta;
                    changed = true;
                }
            }
            else if (this.playerLocation.x < 0 && this.playerLocation.z > 0) {
                if (bFace == 'north' || bFace == 'west') {
                    this.xDelta = 1 - this.xDelta;
                    changed = true;
                }
            }
            else if (this.playerLocation.x > 0 && this.playerLocation.z > 0) {
                if (bFace == 'south' || bFace == 'west') {
                    this.xDelta = 1 - this.xDelta;
                    changed = true;
                }
            }
            else if (this.playerLocation.x > 0 && this.playerLocation.z < 0) {
                if (bFace == 'south' || bFace == 'east') {
                    this.xDelta = 1 - this.xDelta;
                    changed = true;
                }
            }
            if (changed)
                world.sendMessage(`§l§aNew§r => og xDelta: ${this.xDelta}     og yDelta: ${this.yDelta}
            `);
        }

        this.xyDelta = Vector2Lib.new(this.xDelta, this.yDelta);
        const grid2 = this.grid(2);
        this.verticalHalf = grid2.y;
        this.horizontalHalf = grid2.x;

        this.#og_xDelta = this.xDelta;
        this.#og_yDelta = this.yDelta;

        //auto done, but you can do later
        // if ([ 'up', 'down' ].includes(this.blockFace) && player && player.isValid) {
        //     this.adjustUpDownToPlayerRotation(player);
        // }
    }
    /**
     * 
     * @param {number} base 
     * @returns {Vector2}
     */
    grid (base = 1) {
        if (base == 0) base = 1;
        return Vector2Lib.new(Math.floor(this.xDelta * base), Math.floor(this.yDelta * base));
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

        const direction = rotationToCardinalDirection(rotationY);
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
            case 'north': [ this.xDelta, this.yDelta ] = [ this.#og_xDelta, this.#og_yDelta ];
                break;
            case 'south': [ this.xDelta, this.yDelta ] = [ 1 - this.#og_xDelta, 1 - this.#og_yDelta ];
                break;
            case 'west': [ this.xDelta, this.yDelta ] = [ 1 - this.#og_yDelta, this.#og_xDelta ];
                break;
            case 'east': [ this.xDelta, this.yDelta ] = [ this.#og_yDelta, 1 - this.#og_xDelta ];
                break;
            default:
                return;
        }

        if (this.blockFace == 'down') {
            //reverse for when looking up.  Imagine looking at paper
            this.xDelta = 1 - this.xDelta;
            this.yDelta = 1 - this.yDelta;
        }

        // reset these vars
        this.xyDelta = Vector2Lib.new(this.xDelta, this.yDelta);
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
}
//=============================================================================
//End of FIle
//=============================================================================