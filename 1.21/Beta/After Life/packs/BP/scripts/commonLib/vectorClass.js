//@ts-check
//==============================================================================
/**
 *  Created by Created by: https://github.com/DrinkWater623
 * 
 * Change Log
 *      20240826 - Added color to toString if labels
 *      20241204 - Add isVector3,new, strip
 *      20241205 - Add FaceLocationGrid Class
 *                 Add Vector2Lib
*/
//==============================================================================

import { Block } from "@minecraft/server";

/**
 * @param {number} number  
 * @param { number } decimalPlaces 
 * @returns {number}
 * 
*/
function round (number, decimalPlaces = 0) {
    if (decimalPlaces <= 0) return Math.round(number);
    let multiplier = parseInt('1' + ('0'.repeat(decimalPlaces)));
    return Math.round(number * multiplier) / multiplier;
}
//==============================================================================
export class Vector3Lib {
    //==============================================================================
    /**
     * 
     * @param {object} vector 
     * @param {boolean} [exact=true] 
     * @returns boolean
     */
    static isVector3 (vector, exact = true) {
        if (typeof vector != 'object') return false;
        if (exact && Object.keys(vector).length > 3) return false;
        if (!Object.hasOwn(vector, 'x')) return false;
        if (!Object.hasOwn(vector, 'y')) return false;
        if (!Object.hasOwn(vector, 'z')) return false;
        const { x, y, z } = vector;
        if (typeof x != 'number') return false;
        if (typeof y != 'number') return false;
        if (typeof z != 'number') return false;

        return true;
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
    * @param  { Object }  vector
    * @returns {  import("@minecraft/server").Vector3 } 
    */
    static toVector3 (vector) {
        const temp = { ...vector };
        if (!Object.hasOwn(temp, 'x')) temp.x = 0;
        if (!Object.hasOwn(temp, 'y')) temp.y = 0;
        if (!Object.hasOwn(temp, 'z')) temp.z = 0;
        if (typeof temp.x != 'number') temp.x = 0;
        if (typeof temp.y != 'number') temp.y = 0;
        if (typeof temp.z != 'number') temp.z = 0;

        return {
            x: temp.x,
            y: temp.y,
            z: temp.z
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
export class FaceLocationGrid {
    //TODO: work out numbers for if face=up/down
    blockLocation;
    faceLocation;
    faceLocationDelta;
    blockFace = "";
    //2 coordinate x/y system now
    xDelta = 0; //point on horizontal line left/right x/z
    yDelta = 0; //point on vertical line up/down
    //but is opposite for up/down and depends on which way the player is facing
    //unless always consider one direction as top
    xyDelta = { x: 0, y: 0 };
    errMsg = "";
    /**
     * 
     * @param {Block} block 
     * @param {import("@minecraft/server").Vector3} faceLocation 
     */
    constructor(block, faceLocation) {
        const centerBlock = block.center();
        this.blockLocation = centerBlock;
        this.faceLocation = faceLocation;

        const delta3 = Vector3Lib.delta(centerBlock, faceLocation, 2, false);
        this.faceLocationDelta = delta3;

        if (Math.abs(delta3.x) > 0.5 || Math.abs(delta3.y) > 0.5 || Math.abs(delta3.z) > 0.5) {
            const errMsg = `faceLocation (${Vector3Lib.toString(faceLocation, 2)}) is not on block (${Vector3Lib.toString(centerBlock, 2)})`;
            throw new Error(errMsg);
        }

        //One should be exactly 0.5 or -0.5        

        if (Math.abs(delta3.x) == 0.5) {
            this.blockFace = delta3.x < 0 ? 'east' : 'west';
        }
        else if (Math.abs(delta3.y) == 0.5) {
            this.blockFace = delta3.y < 0 ? 'down' : 'up';
        }
        else if (Math.abs(delta3.z) == 0.5) {
            this.blockFace = delta3.z < 0 ? 'south' : 'north';
        }
        else {
            this.errMsg = 'Invalid faceLocation, no abs(0.5) coordinate';
            return;
        }

        if ([ 'up', 'down' ].includes(this.blockFace)) {
            this.xDelta = delta3.x;
            this.yDelta = delta3.z;
        }
        else {
            if ([ 'north', 'south' ].includes(this.blockFace)) {
                this.xDelta = delta3.x;
            }
            else {
                this.xDelta = delta3.z;
            }

            if ([ 'south', 'east' ].includes(this.blockFace)) {
                this.xDelta *= -1;
            }

            //convert to 0.01 -> 0.99
            this.xDelta += 0.5;
            this.yDelta = delta3.y + 0.5;
            this.xyDelta = Vector2Lib.new(this.xDelta, this.yDelta);
        }
    }
    /**
     * 
     * @param {number} base 
     * @returns {import("@minecraft/server").Vector2}
     */
    grid (base = 1) {
        if (base == 0) base = 1;

        return {
            x: Math.floor(this.xDelta * base),
            y: Math.floor(this.yDelta * base)
        };
    }
}
export class Vector2Lib {
    //==============================================================================
    /**
     * 
     * @param {object} vector 
     * @param {boolean} [exact=true] 
     * @returns boolean
     */
    static isVector2 (vector, exact = true) {
        if (typeof vector != 'object') return false;
        if (exact && Object.keys(vector).length > 2) return false;
        if (!Object.hasOwn(vector, 'x')) return false;
        if (!Object.hasOwn(vector, 'y')) return false;
        const { x, y } = vector;
        if (typeof x != 'number') return false;
        if (typeof y != 'number') return false;

        return true;
    }
    //==============================================================================
    /**
     * 
     * @param {object} vector 
     * @returns boolean
     */
    static hasVectorXY (vector) {
        if (typeof vector != 'object') return false;
        if (!Object.hasOwn(vector, 'x')) return false;
        if (!Object.hasOwn(vector, 'y')) return false;
        const { x, y } = vector;
        if (typeof x != 'number') return false;
        if (typeof y != 'number') return false;

        return true;
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
    * @param  { Object }  vector
    * @returns { import("@minecraft/server").Vector2 } 
    */
    static toVector2 (vector) {
        const temp = { ...vector };
        if (!Object.hasOwn(temp, 'x')) temp.x = 0;
        if (!Object.hasOwn(temp, 'y')) temp.y = 0;
        if (typeof temp.x != 'number') temp.x = 0;
        if (typeof temp.y != 'number') temp.y = 0;

        return {
            x: temp.x,
            y: temp.y
        };
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