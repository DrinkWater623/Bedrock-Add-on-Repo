// vectorClass.js
// @ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T.
URL: https://github.com/DrinkWater623
========================================================================
Change Log
    20250116 - Added isSameLocation
    20251103 - Added randomVectorImpulseCapped, VectorXZ
    20251125 - Added isAdjacent to V3 - moved face grid to diff file
    20251202 - Moved to common-other as has no real @minecraft imports
========================================================================*/
// Shared
import { rnd, rndInt, clamp, round } from "./mathLib.js";
//==============================================================================
/** @typedef {import("@minecraft/server").Vector2} Vector2 */
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** @typedef {import("@minecraft/server").VectorXZ} VectorXZ */
//==============================================================================
/** @typedef {{ center?: { x: number, z: number }, minRadius?: number, avoidZero?: boolean }} XZOpts */
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
     * @returns {vector is Vector3}
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
     * @returns {Vector3}
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
    * @param { Vector3 } vector
    * @returns { Vector3 } 
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
     * @param {Vector3} vector_1 
     * @param {Vector3} vector_2 
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
    /**
    * @param { Vector3 } vector1
    * @param { Vector3 } vector2
    * @returns { boolean } 
    */
    //==============================================================================
    static isAdjacent (vector1, vector2) {
        const xyz = this.delta(vector1,vector2,0,true)
        return (xyz.x+xyz.y+xyz.z)===1
    }
    //==============================================================================
    /**
    * @param { Vector3 } vector
    * @returns { Vector3 } 
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
    * @param { Vector3 } vector1
    * @param { Vector3 } vector2
    * @param { number } decimalPlaces
    * @param { boolean } abs
    * @returns { Vector3 } 
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
    * @param { Vector3 } vector
    * @returns { Vector3 } 
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
    * @param { Vector3 } vector
    * @returns { Vector3 } 
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
    * @param { Vector3 } vector
    * @returns { number[] } 
    */
    static toArray (vector) {
        return [ vector.x, vector.y, vector.z ];
    }
    //==============================================================================
    /**
    * @param { Vector3 } vector
    * @returns { Vector3 } 
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
    * @param { Vector3 } vector
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
    * @returns { Vector2 } 
    */
    static toVector2 (vector) {
        return Vector2Lib.toVector2(vector);
    }
    //==============================================================================
    /**
     * Coerces a value into a Minecraft Vector3. Missing or non-number x/y/z become 0.
     *
     * @param {Partial<{ x: number, y: number, z: number }> | null | undefined} vector
     * @returns {Vector3}
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
    * @param  { Vector3 }  vector3
    * @returns { VectorXZ } 
    */
    static toVectorXz (vector3) {
        return {
            x: vector3.x,
            z: vector3.z
        };
    }
    //==============================================================================
    /**
    * @param { Vector3 } vector
    * @returns { Vector3 } 
    */
    static truncate (vector) {
        return {
            x: Math.trunc(vector.x),
            y: Math.trunc(vector.y),
            z: Math.trunc(vector.z)
        };
    }
    //=============================================================================
    /**
     * Random impulse vector:
     *  x,z ∈ [0,n1]  (or [-n1,n1] if allowNegativeXZ)
     *  y   ∈ [yMin,n2]  (default yMin = 0.01)
     *
     * @param {number} n1
     * @param {number} n2
     * @param {{ allowNegativeXZ?: boolean, avoidZeroHorizontal?: boolean, decimals?: number, yMin?: number }} [opts]
     * @returns {Vector3}
     */
    static randomVectorImpulseCapped (n1, n2, opts) {

        const allowNeg = !!opts?.allowNegativeXZ;
        const decimals = opts?.decimals ?? 2;

        // Y range: default to [0.01, n2]
        const yMinRaw = opts?.yMin ?? 0.01;
        const yHi = Math.max(yMinRaw, n2);         // ensure upper >= lower
        const yLo = Math.min(yMinRaw, yHi);        // final lower

        const hxMin = allowNeg ? -Math.abs(n1) : 0;
        const hxMax = Math.abs(n1);

        let x = rnd(hxMin, hxMax);
        let z = rnd(hxMin, hxMax);
        let y = rnd(yLo, yHi);

        x = round(clamp(x, hxMin, hxMax), decimals);
        z = round(clamp(z, hxMin, hxMax), decimals);
        y = round(clamp(y, yLo, yHi), decimals);

        if (opts?.avoidZeroHorizontal && Math.abs(x) < 1e-6 && Math.abs(z) < 1e-6) {
            x = round(0.01, decimals);
        }

        return { x, y, z };
    }
}
//==============================================================================
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
     * @returns {Vector2}
     */
    static new (x, y) {
        return { x: x, y: y };
    }
    //==============================================================================
    /**
     * 
     * @param {object} vector 
     * @returns {Vector2}
     */
    static strip (vector) {
        return this.toVector2(vector);
    }
    //==============================================================================
    /**
    * @param { Vector2 } vector
    * @returns { Vector2 } 
    */
    static abs (vector) {
        return {
            x: Math.abs(vector.x),
            y: Math.abs(vector.y)
        };
    }

    //==============================================================================
    /**
    * @param { Vector2 } vector
    * @returns { Vector2 } 
    */
    static ceiling (vector) {
        return {
            x: Math.ceil(vector.x),
            y: Math.ceil(vector.y)
        };
    }
    //==============================================================================
    /**
    * @param { Vector2 } vector1
    * @param { Vector2 } vector2
    * @param { number } decimalPlaces
    * @param { boolean } abs
    * @returns { Vector2 } 
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
    * @param { Vector2 } vector
    * @returns { Vector2 } 
    */
    static floor (vector) {
        return {
            x: Math.floor(vector.x),
            y: Math.floor(vector.y)
        };
    }
    //==============================================================================
    /**
    * @param { Vector2 } vector
    * @returns { Vector2 } 
    */
    static round (vector, decimalPlaces = 0) {
        return {
            x: round(vector.x, decimalPlaces),
            y: round(vector.y, decimalPlaces)
        };
    }
    //==============================================================================
    /**
    * @param { Vector2 } vector
    * @returns { number[] } 
    */
    static toArray (vector) {
        return [ vector.x, vector.y ];
    }
    //==============================================================================
    /**
    * @param { Vector2 } vector
    * @returns { Vector2 } 
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
    * @param { Vector2 } vector
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
     * @returns {Vector2}
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
    * @param { Vector2 } vector
    * @returns { Vector2 } 
    */
    static truncate (vector) {
        return {
            x: Math.trunc(vector.x),
            y: Math.trunc(vector.y)
        };
    }
}
//==============================================================================
export class VectorXZLib {

    /**
     * Pick random X/Z within [-n, n] (inclusive).
     * @param {number} n
     * @param {XZOpts} [opts]
     * @returns {{ x: number, z: number }}
     */
    static randomXZ (n = 5000, opts) {
        const cx = opts?.center?.x ?? 0;
        const cz = opts?.center?.z ?? 0;
        const minR = Math.max(0, opts?.minRadius ?? 0);
        const avoidZero = !!opts?.avoidZero;

        for (let tries = 0; tries < 64; tries++) {
            const x = rndInt(-n, n) + cx;
            const z = rndInt(-n, n) + cz;

            if (avoidZero && x === 0 && z === 0) continue;
            if (minR > 0) {
                const dx = x - cx, dz = z - cz;
                if (Math.hypot(dx, dz) < minR) continue;
            }
            return { x, z };
        }
        // Fallback (very unlikely)
        return { x: cx, z: cz + (avoidZero ? 1 : 0) };
    }
}
//==============================================================================
// End of File
//==============================================================================
