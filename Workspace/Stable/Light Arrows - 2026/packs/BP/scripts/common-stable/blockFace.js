// blockFace.js
// @ts-check
/* =====================================================================
Created by our friend ChatGPT cause I was tired
License: M.I.T
URL: https://github.com/DrinkWater623
========================================================================
Change Log:
    20251125 - Created File    
========================================================================*/
/**
 * @typedef {'north' | 'south' | 'east' | 'west'} BlockSides
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
import { Player } from "@minecraft/server";
// shared
import { rotationToCardinalDirection, Vector2Lib, Vector3Lib } from "./vectorClass";
//=============================================================================
/** @type {Record<BlockSides, { left: 'north'|'south'|'east'|'west', right: 'north'|'south'|'east'|'west' }>} */
const faceHorizontalMap = {
    // Standing at each face, looking at the block:
    // south face -> facing north: left = west, right = east
    north: { left: 'west', right: 'east' },

    // north face -> facing south: left = east, right = west
    south: { left: 'east', right: 'west' },

    // east face -> facing west: left = south, right = north
    west: { left: 'south', right: 'north' },

    // west face -> facing east: left = north, right = south
    east: { left: 'north', right: 'south' },
};
//=============================================================================
/**
 * Given a face and a 3×3 local coordinate on that face,
 * return a direction label like "down-east", "up", "west", or "center".
 *
 * (0,0) is the lower-right corner; x increases to the left, y increases upward.
 *
 * @param {BlockSides} face
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
     * @param {import("./vectorClass").Vector3} faceLocation 
     * @param {BlockFaces | BlockFacesTitle} blockFace
     * @param {boolean} [absolute=false]
     * @param {Player | undefined} [player = undefined]
     * @summary Use Absolute to have the grids not be relative to the face side  
     */
    constructor(faceLocation, blockFace, absolute = false, player = undefined) {
        this.faceLocation =
            Vector3Lib.new(
                decimalPart(faceLocation.x),
                decimalPart(faceLocation.y),
                decimalPart(faceLocation.z)
            );
        this.blockFace = blockFace.toLowerCase();

        if ([ 'up', 'down' ].includes(this.blockFace)) {
            this.xDelta = this.faceLocation.x;
            this.yDelta = this.faceLocation.z;
        }
        else {
            this.yDelta = this.faceLocation.y;
            this.xDelta = ([ 'north', 'south' ].includes(this.blockFace)) ? this.faceLocation.x : this.faceLocation.z;
        }

        if (this.xDelta < 0) this.xDelta = 1 - Math.abs(this.xDelta);
        if (this.yDelta < 0) this.yDelta = 1 - Math.abs(this.yDelta);

        if (!absolute) {
            //These need to be reversed per player facing block
            //for top to bottom and left to right
            if ([ 'east', 'north' ].includes(this.blockFace)) {
                this.xDelta = 1 - this.xDelta;
                this.yDelta = 1 - this.yDelta;
            }
            else if ([ 'west', 'south' ].includes(this.blockFace)) {
                this.yDelta = 1 - this.yDelta;
            }
        }

        this.xyDelta = Vector2Lib.new(this.xDelta, this.yDelta);
        const grid2 = this.grid(2);
        this.verticalHalf = grid2.y;
        this.horizontalHalf = grid2.x;

        this.#og_xDelta = this.xDelta;
        this.#og_yDelta = this.yDelta;

        //auto done, but you can do later
        if ([ 'up', 'down' ].includes(this.blockFace) && player && player.isValid) {
            this.adjustUpDownToPlayerRotation(player);
        }
    }
    /**
     * 
     * @param {number} base 
     * @returns {import("./vectorClass").Vector2}
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
            /** @type {BlockSides} */ (this.blockFace),
            g.x,
            g.y,
            xyMax
        );
    }
}
//=============================================================================
//End of FIle
//=============================================================================