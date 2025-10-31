//@ts-check
//File: VectorClass.js
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20250116 - Added isSameLocation
========================================================================*/
import { Player, world } from "@minecraft/server";
import { round } from "../common-other/mathLib";
//==============================================================================
//==============================================================================
/**
 * 
 * @param {number} rotation 
 * @returns { 'south' | 'west' | 'north' | 'east'}
 */
export function rotationToCardinalDirection (rotation) {
    let dirs = [ "south", "west", "north", "east", "south" ];
    let dir = Math.round((rotation % 360) / 90);
    if (dir < 0) dir += 4;

    //@ts-ignore    
    return dirs[ dir ];


}
//==============================================================================
//==============================================================================
export class Vector3Lib {
    //==============================================================================
    /**
     * True if `vector` has numeric x, y, z. When `exact` is true, extra props are disallowed.
     * @param {unknown} vector
     * @param {boolean} [exact=true]
     * @returns {vector is import("@minecraft/server").Vector3}
     */
    static isVector3 (vector, exact = true) {
        if (!vector || typeof vector !== 'object') return false;

        // Disallow any extras when exact=true (but allow exactly 3 or fewer keys otherwise)
        if (exact && Object.keys(vector).length !== 3) return false;

        const v = /** @type {Record<string, unknown>} */ (vector);
        return Object.hasOwn(v, 'x') && Object.hasOwn(v, 'y') && Object.hasOwn(v, 'z')
            && typeof v.x === 'number' && Number.isFinite(v.x)
            && typeof v.y === 'number' && Number.isFinite(v.y)
            && typeof v.z === 'number' && Number.isFinite(v.z);
    }
    //==============================================================================
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @returns {import("@minecraft/server").Vector3}
     */
    static new (x = 0, y = 0, z = 0) {
        return {
            x: x,
            y: y,
            z: z
        };
    }
    //==============================================================================
    /**
     * 
     * @param {object} vector
     * @returns boolean
     */
    static strip (vector) {
        return this.toVector3(vector);
    }
    //==============================================================================
    /**
    * @param { import("@minecraft/server").Vector3 } vector
    * @returns { import("@minecraft/server").Vector3 } 
    */
    static abs (vector) {
        return {
            x: Math.abs(vector.x),
            y: Math.abs(vector.y),
            z: Math.abs(vector.z)
        };
    }
    //==============================================================================
    /**
     * 
     * @param {import("@minecraft/server").Vector3} vector_1 
     * @param {import("@minecraft/server").Vector3} vector_2 
     * @param {boolean} [exact=false]
     * @param {number} [exactDecimals=2] 
     * @returns {boolean}
     */
    static isSameLocation (vector_1, vector_2, exact = false, exactDecimals = 2) {

        const v1 = exact ? this.round(vector_1, exactDecimals) : this.floor(vector_1);
        const v2 = exact ? this.round(vector_2, exactDecimals) : this.floor(vector_2);

        if (v1.x != v2.x) return false;
        if (v1.y != v2.y) return false;
        if (v1.z != v2.z) return false;
        return true;

    }
    //==============================================================================
    /**
    * @param { import("@minecraft/server").Vector3 } vector
    * @returns { import("@minecraft/server").Vector3 } 
    */
    static ceiling (vector) {
        return {
            x: Math.ceil(vector.x),
            y: Math.ceil(vector.y),
            z: Math.ceil(vector.z)
        };
    }
    //==============================================================================
    /**
    * @param { import("@minecraft/server").Vector3 } vector1
    * @param { import("@minecraft/server").Vector3 } vector2
    * @param { number } decimalPlaces
    * @param { boolean } abs
    * @returns { import("@minecraft/server").Vector3 } 
    */
    static delta (vector1, vector2, decimalPlaces = 0, abs = false) {
        const xyz = {
            x: round(vector1.x - vector2.x, decimalPlaces),
            y: round(vector1.y - vector2.y, decimalPlaces),
            z: round(vector1.z - vector2.z, decimalPlaces)
        };
        if (abs) return Vector3Lib.abs(xyz);
        return xyz;
    }
    //==============================================================================
    /**
    * @param { import("@minecraft/server").Vector3 } vector
    * @returns { import("@minecraft/server").Vector3 } 
    */
    static floor (vector) {
        return {
            x: Math.floor(vector.x),
            y: Math.floor(vector.y),
            z: Math.floor(vector.z)
        };
    }
    //==============================================================================
    /**
    * @param { import("@minecraft/server").Vector3 } vector
    * @returns { import("@minecraft/server").Vector3 } 
    */
    static round (vector, decimalPlaces = 0) {
        return {
            x: round(vector.x, decimalPlaces),
            y: round(vector.y, decimalPlaces),
            z: round(vector.z, decimalPlaces)
        };
    }
    //==============================================================================
    /**
    * @param { import("@minecraft/server").Vector3 } vector
    * @returns { number[] } 
    */
    static toArray (vector) {
        return [ vector.x, vector.y, vector.z ];
    }
    //==============================================================================
    /**
    * @param { import("@minecraft/server").Vector3 } vector
    * @returns { import("@minecraft/server").Vector3 } 
    */
    //FIXME: this cannot be right.. need to get block, then center
    static toCenter (vector) {
        let xyz = Vector3Lib.truncate(vector);
        return {
            x: Number(xyz.x.toString() + '.5'),
            y: Number(xyz.y.toString() + '.5'),
            z: Number(xyz.z.toString() + '.5')
        };
    }
    //==============================================================================
    /**
    * @param { import("@minecraft/server").Vector3 } vector
    * @param { number } decimalPlaces
    * @param { boolean } showLabels
    * @param { string } delimiter
    * @returns { string }
    */
    static toString (vector, decimalPlaces = 0, showLabels = false, delimiter = ' ') {
        let xyz = { ...vector };
        if (decimalPlaces == 0) xyz = Vector3Lib.floor(vector);
        if (decimalPlaces > 0) xyz = Vector3Lib.round(vector, decimalPlaces);

        let retString;
        if (showLabels) retString = `§6x:§r ${xyz.x}d §ay:§r ${xyz.y}d §ez:§r ${xyz.z}`;
        else retString = `${xyz.x}d${xyz.y}d${xyz.z}`;

        //if (delimiter=='') delimiter=' ' nah let them override this

        return retString.replaceAll('d', delimiter);
    }
    //==============================================================================
    /**
    * @param  { Object }  vector
    * @returns { import("@minecraft/server").Vector2 } 
    */
    static toVector2 (vector) {
        return Vector2Lib.toVector2(vector);
    }
    //==============================================================================
    /**
     * Coerces a value into a Minecraft Vector3. Missing or non-number x/y/z become 0.
     *
     * @param {Partial<{ x: number, y: number, z: number }> | null | undefined} vector
     * @returns {import("@minecraft/server").Vector3}
     */
    static toVector3 (vector) {
        const obj = (vector && typeof vector === 'object')
            ? /** @type {Record<string, unknown>} */ (vector)
            : {};

        const x = Number.isFinite(obj.x) ? /** @type {number} */ (obj.x) : 0;
        const y = Number.isFinite(obj.y) ? /** @type {number} */ (obj.y) : 0;
        const z = Number.isFinite(obj.z) ? /** @type {number} */ (obj.z) : 0;

        return { x, y, z };
    }
    //==============================================================================
    /**
    * @param  { import("@minecraft/server").Vector3 }  vector3
    * @returns { import("@minecraft/server").VectorXZ } 
    */
    static toVectorXz (vector3) {
        return {
            x: vector3.x,
            z: vector3.z
        };
    }
    //==============================================================================
    /**
    * @param { import("@minecraft/server").Vector3 } vector
    * @returns { import("@minecraft/server").Vector3 } 
    */
    static truncate (vector) {
        return {
            x: Math.trunc(vector.x),
            y: Math.trunc(vector.y),
            z: Math.trunc(vector.z)
        };
    }
}
/**
 * 
 * @param {number} number 
 */
function decimalPart (number) {
    return number - Math.trunc(number);
}
export class FaceLocationGrid {
    #og_xDelta = 0;
    #og_yDelta = 0;
    /**
     * 
     * @param {import("@minecraft/server").Vector3} faceLocation 
     * @param {string} blockFace
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
     * @returns {import("@minecraft/server").Vector2}
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
}
export class Vector2Lib {
    //==============================================================================
    /**
     * True if `vector` has numeric x and y. When `exact` is true, extra props are disallowed.
     * @param {unknown} vector
     * @param {boolean} [exact=true]
     * @returns {vector is { x: number, y: number }}
     */
    static isVector2 (vector, exact = true) {
        if (!vector || typeof vector !== 'object') return false;
        if (exact && Object.keys(vector).length !== 2) return false;

        const v = /** @type {Record<string, unknown>} */ (vector);
        return Object.hasOwn(v, 'x') && Object.hasOwn(v, 'y')
            && typeof v.x === 'number' && typeof v.y === 'number';
    }
    //==============================================================================
    /**
     * @param {{ x?: number, y?: number }} vector
    * @returns {boolean}
    */
    static hasVectorXY (vector) {
        if (!vector || typeof vector !== 'object') return false;
        if (!Object.hasOwn(vector, 'x') || !Object.hasOwn(vector, 'y')) return false;
        const { x, y } = vector;
        return typeof x === 'number' && typeof y === 'number';
    }
    //==============================================================================
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @returns {import("@minecraft/server").Vector2}
     */
    static new (x, y) {
        return { x: x, y: y };
    }
    //==============================================================================
    /**
     * 
     * @param {object} vector 
     * @returns {import("@minecraft/server").Vector2}
     */
    static strip (vector) {
        return this.toVector2(vector);
    }
    //==============================================================================
    /**
    * @param { import("@minecraft/server").Vector2 } vector
    * @returns { import("@minecraft/server").Vector2 } 
    */
    static abs (vector) {
        return {
            x: Math.abs(vector.x),
            y: Math.abs(vector.y)
        };
    }

    //==============================================================================
    /**
    * @param { import("@minecraft/server").Vector2 } vector
    * @returns { import("@minecraft/server").Vector2 } 
    */
    static ceiling (vector) {
        return {
            x: Math.ceil(vector.x),
            y: Math.ceil(vector.y)
        };
    }
    //==============================================================================
    /**
    * @param { import("@minecraft/server").Vector2 } vector1
    * @param { import("@minecraft/server").Vector2 } vector2
    * @param { number } decimalPlaces
    * @param { boolean } abs
    * @returns { import("@minecraft/server").Vector2 } 
    */
    static delta (vector1, vector2, decimalPlaces = 0, abs = false) {
        const xy = {
            x: round(vector1.x - vector2.x, decimalPlaces),
            y: round(vector1.y - vector2.y, decimalPlaces)
        };
        if (abs) return Vector2Lib.abs(xy);
        return xy;
    }
    //==============================================================================
    /**
    * @param { import("@minecraft/server").Vector2 } vector
    * @returns { import("@minecraft/server").Vector2 } 
    */
    static floor (vector) {
        return {
            x: Math.floor(vector.x),
            y: Math.floor(vector.y)
        };
    }
    //==============================================================================
    /**
    * @param { import("@minecraft/server").Vector2 } vector
    * @returns { import("@minecraft/server").Vector2 } 
    */
    static round (vector, decimalPlaces = 0) {
        return {
            x: round(vector.x, decimalPlaces),
            y: round(vector.y, decimalPlaces)
        };
    }
    //==============================================================================
    /**
    * @param { import("@minecraft/server").Vector2 } vector
    * @returns { number[] } 
    */
    static toArray (vector) {
        return [ vector.x, vector.y ];
    }
    //==============================================================================
    /**
    * @param { import("@minecraft/server").Vector2 } vector
    * @returns { import("@minecraft/server").Vector2 } 
    */
    static toCenter (vector) {
        let xy = Vector2Lib.truncate(vector);
        return {
            x: Number(xy.x.toString() + '.5'),
            y: Number(xy.y.toString() + '.5')
        };
    }
    //==============================================================================
    /**
    * @param { import("@minecraft/server").Vector2 } vector
    * @param { number } decimalPlaces
    * @param { boolean } showLabels
    * @param { string } delimiter
    * @returns { string }
    */
    static toString (vector, decimalPlaces = 0, showLabels = false, delimiter = ' ') {
        let xy = { ...vector };
        if (decimalPlaces == 0) xy = Vector2Lib.floor(vector);
        if (decimalPlaces > 0) xy = Vector2Lib.round(vector, decimalPlaces);

        let retString;
        if (showLabels) retString = `§6x:§r ${xy.x}d §ay:§r ${xy.y}`;
        else retString = `${xy.x}d${xy.y}`;

        //if (delimiter=='') delimiter=' ' nah let them override this

        return retString.replaceAll('d', delimiter);
    }
    //==============================================================================
    /**
     * Coerces a value into a Minecraft Vector3. Missing or non-number x/y/z become 0.
     *
     * @param {Partial<{ x: number, y: number }> | null | undefined} vector
     * @returns {import("@minecraft/server").Vector2}
     */
    static toVector2 (vector) {
        const obj = (vector && typeof vector === 'object')
            ? /** @type {Record<string, unknown>} */ (vector)
            : {};

        const x = Number.isFinite(obj.x) ? /** @type {number} */ (obj.x) : 0;
        const y = Number.isFinite(obj.y) ? /** @type {number} */ (obj.y) : 0;

        return { x, y };
    }
    //==============================================================================
    /**
    * @param { import("@minecraft/server").Vector2 } vector
    * @returns { import("@minecraft/server").Vector2 } 
    */
    static truncate (vector) {
        return {
            x: Math.trunc(vector.x),
            y: Math.trunc(vector.y)
        };
    }
}