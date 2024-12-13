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
 *      20241207 - Update FaceLocationGrid with override for short blocks
 *      20241208 - Add Vertical and Horizontal Halves, fixed west to  *-1
 *      20241209 - Fixed up/down deltas so grids are correct
 *      20241210 - Fixed FaceLocationGrid to not need block, after new info
 *                 Added rotationToCompassDirection and rotationToCardinalDirection for internal use
 *                 Added ability to change up/down grid per player rotation, if given
*/
//==============================================================================

import { Block, Player, world } from "@minecraft/server";

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
// Move these to other lib
/**
 * 
 * @param {number} rotation 
 * @returns 
 */
function rotationToCompassDirection (rotation) {
    const dirs = [ "S", "S W", "W", "N W", "N", "N E", "E", "S E", "S" ];
    let dir = Math.round((rotation % 360) / 8);
    if (dir < 0) dir += 8;
    return dirs[ dir ]
        .replace("N", "north")
        .replace("S", "south")
        .replace("E", "east")
        .replace("W", "west")
        .replace(" ", "-");
}
//==============================================================================
/**
 * 
 * @param {number} rotation 
 * @returns { 'south' | 'west' | 'north' | 'east'}
 */
function rotationToCardinalDirection (rotation) {
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
     * @param {'up' | 'down' | 'south' | 'north' | 'east' | 'west'} blockFace
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
        this.blockFace = blockFace;

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
        if ([ 'up', 'down' ].includes(this.blockFace) && player && player.isValid()) {
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
            player.isValid())
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

        //const angle = Math.round((rotationY % 360) / 90);
        const direction = rotationToCardinalDirection(rotationY);
        world.sendMessage(`rotationY=${rotationY} - -angle = Dir=${direction}`)
        this.adjustUpDownToPlayerDirection(direction);
    }
    //for up/down can alter to be relative to player rotation
    /**
     * 
     * @param {'up' | 'down' | 'south' | 'north' | 'east' | 'west'} direction      
     */
    adjustUpDownToPlayerDirection (direction) {
        if (![ 'up', 'down' ].includes(this.blockFace))
            return;

        //TODO: figure out later, not needed yet
        world.sendMessage(`altering for ${direction}`)
        switch (direction) {
            case 'north':
                [ this.xDelta, this.yDelta ] = [ this.#og_xDelta, this.#og_yDelta ];
                break;
            case 'south':
                [ this.xDelta, this.yDelta ] = [ 1 - this.#og_xDelta, 1 - this.#og_yDelta ];
                break;
            case 'west':
                [ this.xDelta, this.yDelta ] = [ 1-this.#og_yDelta, this.#og_xDelta ];
                break;
            case 'east':
                [ this.xDelta, this.yDelta ] = [ this.#og_yDelta, 1-this.#og_xDelta ];
                break;
            default:
                return;
        }

        if (this.blockFace =='down') {
            //reverse for when looking up.  Imagine looking at paper
            this.xDelta = 1-this.xDelta
            this.yDelta = 1-this.yDelta
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