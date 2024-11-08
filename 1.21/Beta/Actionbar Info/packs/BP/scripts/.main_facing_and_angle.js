//@ts-check
//=========================================================
import { world, system } from "@minecraft/server";
//=========================================================
/**
 * 
 * @param {number} number 
 * @param {number} decimalPlaces 
 * @returns {number}
 */
function round (number, decimalPlaces  = 0) {
    if (decimalPlaces  <= 0) return Math.round(number);
    let multiplier = parseInt('1' + ('0'.repeat(decimalPlaces )));
    return Math.round(number * multiplier) / multiplier;
}
//=========================================================
/**
 * 
 * @param {number} angle 
 * @returns {string}
 */
function directionTextGet_Wave (angle = 0) {
    //Thanks for the concept help WavePlayz
    const s = 360 / 8;
    const dirs = [ "S", "S W", "W", "N W", "N", "N E", "E", "S E", "S" ];

    let dir = Math.round(angle / s);
    if (dir < 0) dir += 8;
    return dirs[ dir ]
        .replace("N", "north")
        .replace("S", "south")
        .replace("E", "east")
        .replace("W", "west")
        .replace(" ", "-");
}
//=========================================================
/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {number} z 
 * @returns {number}
 */
function GetViewAngleFromCoords (x, y, z) {
    // Get The Horizontal Direction (X, Z) - Ignore Y For Now As It's Up/Down Directions
    const HorizontalDirectionMagnitude = Math.sqrt(x ** 2 + z ** 2);

    // Calculate the launch angle relative to the X-Z plane (ignoring Y direction)
    const Angle = Math.atan2(y, HorizontalDirectionMagnitude);

    return round(Angle * (180 / Math.PI), 0);
}
/**
 * 
 * @param {import("@minecraft/server").Vector3} v3 
 * @returns {number}
 */
function GetViewAngleFromVector3 (v3) {
    return GetViewAngleFromCoords(v3.x,v3.y,v3.z)
}
//=========================================================
export function main () {

    system.runInterval(() => {
        world.getAllPlayers()
            .forEach(p => {
                let text = `§6Facing: ${directionTextGet_Wave(p.getRotation().y)}  |  `;                
                text += ` Vertical Angle : ${GetViewAngleFromVector3(p.getViewDirection())}`;
                p.onScreenDisplay.setActionBar(text);
            });
    }, 15);
}
//=========================================================
main();