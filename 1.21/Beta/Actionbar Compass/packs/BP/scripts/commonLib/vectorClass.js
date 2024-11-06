//@ts-check
import { round } from './mathClass.js';
//==============================================================================
/**
 *  Created by Created by: https://github.com/DrinkWater623
 * 
 * Change Log
 *      20240826 - Added color to toString if labels
*/
//==============================================================================
/**
 * @param {number} number  
 * @param { number } decimalPlaces 
 * @returns {number}
 * 
*/
// function round (number, decimalPlaces  = 0) {
//     if (decimalPlaces  <= 0) return Math.round(number);
//     let multiplier = parseInt('1' + ('0'.repeat(decimalPlaces )));
//     return Math.round(number * multiplier) / multiplier;
// }
//==============================================================================
export class Vector3Lib {
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
    * @param  { import("@minecraft/server").Vector3 }  vector3
    * @returns { import("@minecraft/server").Vector2 } 
    */
    static toVector2 (vector3) {
        return {
            x: vector3.x,
            y: vector3.y
        };
    }
    //==============================================================================
    /**
    * @param { number } x
    * @param { number } y
    * @param { number } z
    * @returns {  import("@minecraft/server").Vector3 } 
    */
    static toVector3 (x = 0, y = 0, z = 0) {
        return {
            x: x,
            y: y,
            z: z
        };
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