//@ts-check
export class DirectionInfo {
    info = [];
    numOfAngles = 0;
    constructor(numOfAngles = 4) {

        //TODO: err if not 4 or 8
        if (numOfAngles < 4) numOfAngles = 4;
        else if (numOfAngles > 8) numOfAngles = 8;
        else if (numOfAngles % 4 > 0) numOfAngles = 4;

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
                isStraight:( (numOfAngles === 4) ? true : ((i % 2) === 0)) 
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
            }
            else {
                let j = i === 0 ? numOfAngles - 1 : i - 1;
                this.info[ i ].left90 = this.info[ j ].direction;
                this.info[ i ].left90Angle = this.info[ j ].angle;

                j = i === numOfAngles - 1 ? 0 : i + 1;
                this.info[ i ].right90 = this.info[ j ].direction;
                this.info[ i ].right90Angle = this.info[ j ].angle;
            }
        }
    }
    negativeAngleConvert (angle = 0) {
        angle = angle % 360;
        return angle < 0 ? angle + 360 : angle;
    }
    angleId_get (angle = 0) {
        const retVal = Math.round(this.negativeAngleConvert(angle) / (360 / this.numOfAngles));
        return retVal === this.numOfAngles ? 0 : retVal;
    }
    angleName_get (angle = 0) {
        return this.info[ this.angleId_get(angle) ].direction;
    }
    directionOpposite_get (direction = "") {
        direction = direction.toLowerCase();

        for (let i = 0; i < this.numOfAngles; i++) {
            if (this.info[ i ].opposite.toLowerCase() == direction) {
                return this.info[ i ].direction;
            }
        }

        return "";
    }
    directionOject_get (direction = "") {
        direction = direction.toLowerCase();

        for (let i = 0; i < this.numOfAngles; i++) {
            if (this.info[ i ].direction.toLowerCase() == direction) {
                return this.info[ i ];
            }
        }

        return null;
    }
    angle_get (direction = "") {
        direction = direction.toLowerCase();

        for (let i = 0; i < 8; i++) {
            if (this.info[ i ].direction.toLowerCase() == direction) {
                return this.info[ i ].angle;
            }
        }
        return undefined;
    }
    angleCenter_get (angle = 0) {
        return this.info[ this.angleId_get(angle) ].angle;
    }
    angleObject_get (angle = 0) {
        const retInfo = this.info[ this.angleId_get(angle) ];

        if (retInfo.isStraight)
            retInfo.veeringAngle = retInfo.angle;
        else {
            let angle4 = Math.round(this.negativeAngleConvert(angle) / (360 / 4));
            angle4 = (angle4 === 4 ? 0 : angle4) * 90;
            retInfo.veeringAngle = angle4;
        }
        retInfo.veeringDirection = this.angleName_get(retInfo.veeringAngle);
        retInfo.inputAngle = angle;
        retInfo.inputAngle360 = this.negativeAngleConvert(angle);
        return retInfo;
    }
}