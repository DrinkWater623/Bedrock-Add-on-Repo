//@ts-check
//=========================================================
import { world, system } from "@minecraft/server";
import { Vector3Lib } from "./common-stable/vectorClass";
//=========================================================
export const noCompassTag = "noCompassActionBar";
export const xyzTag = "xyzTag";
export const velocityTag = "velocityTag";
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
            .filter(p => !p.hasTag(noCompassTag) || p.hasTag(xyzTag))
            .forEach(p => {
                //broken out for readability
                const vt = p.hasTag(velocityTag);
                const ct = !p.hasTag(noCompassTag);
                const xt = p.hasTag(xyzTag);

                let text = '';

                if (vt) {
                    text += ` §e${Vector3Lib.toString(p.getVelocity(), 1, true)} ${ct || xt ? '|' : ''}`;
                }

                if (ct) {
                    text += ` §6${directionTextGet_Wave(p.getRotation().y)}  ${xt ? '|' : ''}`;
                }

                if (xt) {
                    text += `  §b${p.location.x.toFixed(1)} §d${p.location.y.toFixed(1)} §g${p.location.z.toFixed(1)}`;
                }

                text = text.trim();
                p.onScreenDisplay.setActionBar(text);
            });
    }, 15);
}
//=========================================================
main();