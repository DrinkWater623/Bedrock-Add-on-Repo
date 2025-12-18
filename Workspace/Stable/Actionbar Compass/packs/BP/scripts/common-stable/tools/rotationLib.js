 //@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20250110c - Using round with mod instead of floor
========================================================================*/
import { Direction } from "@minecraft/server";
//============================================================================
export class CardinalDirections {
    static North = "North";
    static South = "South";
    static East = "East";
    static West = "West";
    static north = "north";
    static south = "south";
    static east = "east";
    static west = "west";
}
export class IntermediateDirections {
    static North = "North";
    static South = "South";
    static East = "East";
    static West = "West";
    static north = "north";
    static south = "south";
    static east = "east";
    static west = "west";
    static NE = "North-East";
    static SE = "South-East";
    static ne = "north-east";
    static se = "south-east";
    static NW = "North-West";
    static SW = "South-West";
    static nw = "north-west";
    static sw = "south-west";
}
//=============================================================================
export class DirectionNames {
    static intermediate = [
        "S",
        "S W",
        "W",
        "N W",
        "N",
        "N E",
        "E",
        "S E"
    ]
        .map(v => v.replace("N", "North"))
        .map(v => v.replace("S", "South"))
        .map(v => v.replace("E", "East"))
        .map(v => v.replace("W", "West"))
        .map(v => v.replace(" ", "-"));

    static cardinal = this.intermediate.filter(f => !f.includes('-'));
}
//=============================================================================
export class AngleMath {
    //cardinal is assumed if not asked
    static cardinalAngleCount = 4;
    static intermediateAngleCount = 8;
    //=========================================================================
    /**
     * 
     * @param {number} angle 
     * @returns 
     */
    static negativeAngleConvert (angle) {
        return ((angle % 360) + 360) % 360;
    }
    //=========================================================================
    /**
     * 
     * @param {number | IntermediateDirections} angleOrDirection 
     * @param {boolean} isIntermediate 
     * @returns {number}
     */
    static angleId_get (angleOrDirection, isIntermediate = false) {
        const numOfAngles = isIntermediate ? this.intermediateAngleCount : this.cardinalAngleCount;

        if (typeof angleOrDirection == 'number')
            return Math.round(this.negativeAngleConvert(angleOrDirection) / (360 / numOfAngles)) % numOfAngles;
        else {
            let dir = angleOrDirection.toString().toLowerCase();

            for (let i = 0; i < numOfAngles; i++) {
                if (isIntermediate && DirectionNames.intermediate[ i ].toLowerCase() == dir) {
                    return i;
                }
                else if (!isIntermediate && DirectionNames.cardinal[ i ].toLowerCase() == dir) {
                    return i;
                }
            }

            return 0;
        }
    }
    /**
     * 
     * @param {number | IntermediateDirections} angleOrDirection 
     * @returns {number}
     */
    static cardinalAngleId_get (angleOrDirection) {
        return this.angleId_get(angleOrDirection, false);
    }
    /**
     * 
     * @param {number | IntermediateDirections} angleOrDirection 
     * @returns {number}
     */
    static intermediateAngleId_get (angleOrDirection) {
        return this.angleId_get(angleOrDirection, true);
    }
    //=========================================================================    
    /**
     * 
     * @param {number | IntermediateDirections} angleIdOrDirection 
     * @param {boolean} [isIntermediate=false] 
     * @returns {number} angle 0-360
     */
    static angle_get (angleIdOrDirection, isIntermediate = false) {
        let angleId = 0;

        if (typeof angleIdOrDirection == 'number') {
            angleId = angleIdOrDirection;
        }
        else {
            angleId = this.angleId_get(angleIdOrDirection, isIntermediate);
        }

        if (isIntermediate)
            return angleId * 45;
        else
            return angleId * 90;
    }
    /**
     * 
     * @param {number | IntermediateDirections} angleIdOrDirection 
     * @returns {number}
     */
    static cardinalAngle_get (angleIdOrDirection) {
        return this.angle_get(angleIdOrDirection);
    }
    /**
     * 
     * @param {number | IntermediateDirections} angleIdOrDirection 
     * @returns {number}
     */
    static intermediateAngle_get (angleIdOrDirection) {
        return this.angle_get(angleIdOrDirection, true);
    }
    //=========================================================================
    /**
     * 
     * @param {number} angleOrAngleId
     * @param {boolean} [isIntermediate=false] 
     * @param {boolean} [isAngleId=false]  
     * @returns {string}
     */
    static direction_get (angleOrAngleId, isIntermediate = false, isAngleId = false) {

        if (isAngleId) {
            if (isIntermediate) {
                angleOrAngleId = angleOrAngleId % 8; //just in case
                return DirectionNames.intermediate[ angleOrAngleId ];
            }
            else {
                angleOrAngleId = angleOrAngleId % 4;
                return DirectionNames.cardinal[ angleOrAngleId ];
            }
        }
        else {
            
            if (isIntermediate)
                return DirectionNames.intermediate[ this.intermediateAngleId_get(angleOrAngleId) ];
            else return DirectionNames.cardinal[ this.cardinalAngleId_get(angleOrAngleId,) ];
        }
    }
    /**
     * 
     * @param {number} angleOrAngleId
     * @param {boolean} [isAngleId=false]   
     * @returns {string}
     */
    static cardinalDirection_get (angleOrAngleId, isAngleId) {
        return this.direction_get(angleOrAngleId, false, isAngleId);
    }
    /**
     * 
     * @param {number} angleOrAngleId
     * @param {boolean} [isAngleId=false] 
     * @returns {string}
     */
    static intermediateDirection_get (angleOrAngleId, isAngleId) {
        return this.direction_get(angleOrAngleId, true, isAngleId);
    }
    //=========================================================================    
    /**
     * 
     * @param {IntermediateDirections} direction 
     * @param {number} degrees 
     * @param {boolean} [isIntermediate = false]
     * @returns {string}
     */
    static turnedDirection_get (direction, degrees, isIntermediate = false) {
        let newAngle = this.angle_get(direction) + degrees;

        if (isIntermediate)
            return this.intermediateDirection_get(newAngle);
        else
            return this.cardinalDirection_get(newAngle);
    }
    /**
     * 
     * @param {IntermediateDirections} direction
     * @param {number} degrees 
     * @returns {string}
     */
    static turnedCardinalDirection_get (direction, degrees) {
        return this.turnedDirection_get(direction, degrees);
    }
    /**
     * 
     * @param { IntermediateDirections} direction
     * @param {number} degrees 
     * @returns {string}
     */
    static turnedIntermediateDirection_get (direction, degrees) {
        return this.turnedDirection_get(direction, degrees, true);
    }
    //=========================================================================    
}
//========================================================================
// Each degree 0-360
export class Compass {
    constructor() {
        //=====================================================================
        this.degrees = [];
        //Build Base 0-360
        for (let deg = 0; deg <= 360; deg++) {

            this.degrees.push({
                degree: deg,

                isStraight: {
                    cardinal: deg % 90 == 0,
                    intermediate: deg % 45 == 0
                },

                direction: {
                    cardinal: AngleMath.cardinalDirection_get(deg),
                    intermediate: AngleMath.intermediateDirection_get(deg)
                },

                left45: {
                    angle: AngleMath.negativeAngleConvert(deg - 45),
                    cardinalDirection: AngleMath.direction_get(deg - 45, false),
                    intermediateDirection: AngleMath.direction_get(deg - 45, true)
                },
                right45: {
                    angle: AngleMath.negativeAngleConvert(deg + 45),
                    cardinalDirection: AngleMath.direction_get(deg + 45, false),
                    intermediateDirection: AngleMath.direction_get(deg + 45, true)
                },

                left90: {
                    angle: AngleMath.negativeAngleConvert(deg - 90),
                    cardinalDirection: AngleMath.direction_get(deg - 90, false),
                    intermediateDirection: AngleMath.direction_get(deg - 90, true)
                },
                right90: {
                    angle: AngleMath.negativeAngleConvert(deg + 90),
                    cardinalDirection: AngleMath.direction_get(deg + 90, false),
                    intermediateDirection: AngleMath.direction_get(deg + 90, true)
                },

                left135: {
                    angle: AngleMath.negativeAngleConvert(deg - 135),
                    cardinalDirection: AngleMath.direction_get(deg - 135, false),
                    intermediateDirection: AngleMath.direction_get(deg - 135, true)
                },
                right135: {
                    angle: AngleMath.negativeAngleConvert(deg + 135),
                    cardinalDirection: AngleMath.direction_get(deg + 135, false),
                    intermediateDirection: AngleMath.direction_get(deg + 135, true)
                },

                opposite: {
                    angle: AngleMath.negativeAngleConvert(deg + 180),
                    cardinalDirection: AngleMath.direction_get(deg + 180, false),
                    intermediateDirection: AngleMath.direction_get(deg + 180, true)
                },

                left225: {
                    angle: AngleMath.negativeAngleConvert(deg - 225),
                    cardinalDirection: AngleMath.direction_get(deg - 225, false),
                    intermediateDirection: AngleMath.direction_get(deg - 225, true)
                },
                right225: {
                    angle: AngleMath.negativeAngleConvert(deg + 225),
                    cardinalDirection: AngleMath.direction_get(deg + 225, false),
                    intermediateDirection: AngleMath.direction_get(deg + 225, true)
                },

                left270: {
                    angle: AngleMath.negativeAngleConvert(deg - 270),
                    cardinalDirection: AngleMath.direction_get(deg - 270, false),
                    intermediateDirection: AngleMath.direction_get(deg - 270, true)
                },
                right270: {
                    angle: AngleMath.negativeAngleConvert(deg + 270),
                    cardinalDirection: AngleMath.direction_get(deg + 270, false),
                    intermediateDirection: AngleMath.direction_get(deg + 270, true)
                }
            });
        }
        //=====================================================================
        this.cardinal = this.degrees.filter(deg => deg.isStraight.cardinal);
        this.intermediate = this.degrees.filter(deg => deg.isStraight.intermediate);
    }
}
//=============================================================================
export class DirectionInfo {
    /**
     * 
     * @param {4 | 8} numOfAngles 
     */
    constructor(numOfAngles = 4) {

        this.info = [];
        this.numOfAngles = numOfAngles;

        const dirNames = [
            "S",
            "S W",
            "W",
            "N W",
            "N",
            "N E",
            "E",
            "S E"
        ]
            .filter(v => numOfAngles === 4 ? !v.includes(' ') : true)
            .map(v => v.replace("N", "North"))
            .map(v => v.replace("S", "South"))
            .map(v => v.replace("E", "East"))
            .map(v => v.replace("W", "West"))
            .map(v => v.replace(" ", "-"));

        //Build Base
        for (let i = 0; i < numOfAngles; i++) {
            this.info.push({
                oid: i,
                direction: dirNames[ i ],
                angle: i * (numOfAngles === 4 ? 90 : 45),
                isStraight: ((numOfAngles === 4) ? true : ((i % 2) === 0)),
                //filled in below
                opposite: '',
                left45: "",
                left45Angle: 0,
                right45: "",
                right45Angle: 0,
                left90: "",
                left90Angle: 0,
                right90: "",
                right90Angle: 0,
                veeringAngle: 0,
                veeringDirection: "",
                //for a return object
                inputAngle: 0,
                inputAngle360: 0
            });
        }
        //Add Info
        for (let i = 0; i < numOfAngles; i++) {
            this.info[ i ].opposite = this.angleName_get(this.info[ i ].angle - 180);

            if (numOfAngles === 8) {
                let j = i === 0 ? numOfAngles - 1 : i - 1;
                this.info[ i ].left45 = this.info[ j ].direction;
                this.info[ i ].left45Angle = this.info[ j ].angle;

                j = i === numOfAngles - 1 ? 0 : i + 1;
                this.info[ i ].right45 = this.info[ j ].direction;
                this.info[ i ].right45Angle = this.info[ j ].angle;

                j = i <= 1 ? numOfAngles - 2 + i : i - 2;
                this.info[ i ].left90 = this.info[ j ].direction;
                this.info[ i ].left90Angle = this.info[ j ].angle;

                j = i >= numOfAngles - 2 ? i - numOfAngles - 2 : i + 2;
                this.info[ i ].right90 = this.info[ j ].direction;
                this.info[ i ].right90Angle = this.info[ j ].angle;

                if (this.info[ i ].isStraight)
                    this.info[ i ].veeringAngle = this.info[ i ].angle;
                else {
                    let angle4 = Math.round(this.info[ i ].angle / (360 / 4)) % 4;
                    angle4 = (angle4 === 4 ? 0 : angle4) * 90;
                    this.info[ i ].veeringAngle = angle4;
                }
                this.info[ i ].veeringDirection = this.angleName_get(this.info[ i ].veeringAngle);
            }
            else {
                this.info[ i ].veeringAngle = this.info[ i ].angle;
                this.info[ i ].veeringDirection = this.info[ i ].direction;

                let j = i === 0 ? numOfAngles - 1 : i - 1;
                this.info[ i ].left90 = this.info[ j ].direction;
                this.info[ i ].left90Angle = this.info[ j ].angle;

                j = i === numOfAngles - 1 ? 0 : i + 1;
                this.info[ i ].right90 = this.info[ j ].direction;
                this.info[ i ].right90Angle = this.info[ j ].angle;
            }
        }
    }
    /**
     * 
     * @param {number} angle 
     * @returns 
     */
    negativeAngleConvert (angle = 0) {
        angle = angle % 360;
        return angle < 0 ? angle + 360 : angle;
    }
    /**
     * 
     * @param {number} angle 
     * @returns 
     */
    angleId_get (angle = 0) {
        const retVal = Math.round(this.negativeAngleConvert(angle) / (360 / this.numOfAngles)) % this.numOfAngles;
        return retVal === this.numOfAngles ? 0 : retVal;
    }
    /**
     * 
     * @param {number} angle 
     * @returns 
     */
    angleName_get (angle = 0) {
        return this.info[ this.angleId_get(angle) ].direction;
    }
    /**
     * 
     * @param {string | Direction} direction 
     * @returns {string}
     */
    directionOpposite_get (direction = "") {
        direction = direction.toLowerCase();

        for (let i = 0; i < this.numOfAngles; i++) {
            if (this.info[ i ].opposite.toLowerCase() == direction) {
                return this.info[ i ].direction;
            }
        }

        return "";
    }
    /**
     * 
     * @param {string | Direction} direction 
     * @returns 
     */
    directionOject_get (direction = "") {
        direction = direction.toLowerCase();

        for (let i = 0; i < this.numOfAngles; i++) {
            if (this.info[ i ].direction.toLowerCase() == direction) {
                return this.info[ i ];
            }
        }

        return null;
    }
    /**
     * 
     * @param {string | Direction} direction 
     * @returns {number | undefined}
     */
    angle_get (direction = "") {
        direction = direction.toLowerCase();

        for (let i = 0; i < 8; i++) {
            if (this.info[ i ].direction.toLowerCase() == direction) {
                return this.info[ i ].angle;
            }
        }
        return undefined;
    }
    /**
     * 
     * @param {number} angle 
     * @returns {number}
     */
    angleCenter_get (angle = 0) {
        return this.info[ this.angleId_get(angle) ].angle;
    }
    /**
     * 
     * @param {number} angle 
     * @returns {object}
     */
    angleObject_get (angle = 0) {
        const retInfo = this.info[ this.angleId_get(angle) ];

        if (retInfo.isStraight)
            retInfo.veeringAngle = retInfo.angle;
        else {
            let angle4 = Math.round(this.negativeAngleConvert(angle) / (360 / 4)) % 4;
            retInfo.veeringAngle = angle4 * 90;
        }
        retInfo.veeringDirection = this.angleName_get(retInfo.veeringAngle);
        retInfo.inputAngle = angle;
        retInfo.inputAngle360 = this.negativeAngleConvert(angle);
        return retInfo;
    }
}
//============================================================================