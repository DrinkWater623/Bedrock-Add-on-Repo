//@ts-check
//Will be working ON...
//=========================================================
import { world, system } from "@minecraft/server";
import { Vector3Lib } from "./common-stable/vectorClass";
//=========================================================
//change to dynamic Vars and Forms

export const noCompassTag = "noCompassActionBar";
export const xyzTag = "xyzTag";
export const xyzTagExact = "xyzTagExact";
export const velocityTag = "velocityTag";
//=========================================================
/**
 * 
 * @param {number} angle 
 * @returns {string}
 */
function directionTextGet_Wave (angle = 0) {
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
                const xxt = p.hasTag(xyzTagExact)
                const xt = p.hasTag(xyzTag);

                let text = '';

                if (vt) {
                    text += ` §e${Vector3Lib.toString(p.getVelocity(), 1, true)} ${ct || xt  || xxt ? '|' : ''}`;
                }

                if (ct) {
                    text += ` §6${directionTextGet_Wave(p.getRotation().y)}  ${xt || xxt ? '|' : ''}`;
                }

                if (xxt) {
                    text += `  §a${p.location.x.toFixed(0)}  §d${p.location.y.toFixed(1)}  §g${p.location.z.toFixed(1)}`;
                }
                else if (xt) {
                    text += `  §e${Math.floor(p.location.x)}  §d${Math.floor(p.location.y)}  §b${Math.floor(p.location.z)}`;
                }

                text = text.trim();
                p.onScreenDisplay.setActionBar(text);
            });
    }, 15);
}
//=========================================================
main();