//@ts-check
//=========================================================
import { world, system } from "@minecraft/server";
import { Vector3Lib } from "./commonLib/vectorClass";
import { round } from "./commonLib/mathClass";
//=========================================================
export const facingTag = "facingTag";
export const xyzTag = "xyzTag";
export const velocityTag = "velocityTag";
export const viewTag = "viewTag";
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
export function main () {

    system.runInterval(() => {
        world.getAllPlayers()
            .filter(p =>
                p.hasTag(facingTag) ||
                p.hasTag(xyzTag) ||
                p.hasTag(velocityTag) ||
                p.hasTag(viewTag)
            )
            .forEach(p => {
                //broken out for readability
                const vt = p.hasTag(velocityTag);
                const vwt = p.hasTag(viewTag);
                const ct = p.hasTag(facingTag);
                const xt = p.hasTag(xyzTag);

                let text = '';

                if (vt) {
                    text += ` §eVelocity: ${Vector3Lib.toString(p.getVelocity(), 1, true)}  ${ct || xt || vwt ? '|' : ''}`;
                }

                if (ct) {
                    text += ` §6Facing: ${directionTextGet_Wave(p.getRotation().y)}  ${xt ? '|' : ''}`;
                }

                if (vt && ct && xt && vwt) text += '\n';

                if (xt) {
                    text += ` §bGeo: ${p.location.x.toFixed(1)} §d${p.location.y.toFixed(1)} §g${p.location.z.toFixed(1)}  ${xt ? '|' : ''}`;
                }

                if (vwt) {
                    const vd = p.getViewDirection();
                    text += ` Vertical Angle : ${GetViewAngle(vd.x, vd.y, vd.z)}`;
                }
                text = text.trim();
                p.onScreenDisplay.setActionBar(text);
            });
    }, 15);
}
/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {number} z 
 * @returns {number}
 */
function GetViewAngle (x, y, z) {    
    // Get The Horizontal Direction (X, Z) - Ignore Y For Now As It's Up/Down Directions
    const HorizontalDirectionMagnitude = Math.sqrt(x ** 2 + z ** 2);

    // Calculate the launch angle relative to the X-Z plane (ignoring Y direction)
    const Angle = Math.atan2(y, HorizontalDirectionMagnitude);

    return round(Angle * (180 / Math.PI),0);    
}
//=========================================================
main();