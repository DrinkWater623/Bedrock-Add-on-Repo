//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20250110
========================================================================*/
import { Player, system, world } from "@minecraft/server";
import { Vector3Lib } from "./common-stable/vectorClass";
import { round } from "./common-other/mathLib";
import { AngleMath, Compass } from "./common-other/rotationLib";
import { chatLog, debug, pack } from "./settings";
//=========================================================
const compass = new Compass();
//=========================================================
/**
 * 
 * @param {Player} player 
 */
export function display (player) {
    //broken out for readability
    const vt = player.hasTag(pack.tags.velocityTag);
    const vwt = player.hasTag(pack.tags.viewTag);
    const ct = player.hasTag(pack.tags.facingTag);
    const xt = player.hasTag(pack.tags.xyzTag) && !world.gameRules.showCoordinates;
    const xxt = player.hasTag(pack.tags.xyzTagExact) && !world.gameRules.showCoordinates;

    let text = '';
    let ctr = 0;

    if (vt) {
        text += `${ctr > 0 ? '  |  ' : ''}§eSpeed: ${Vector3Lib.toString(player.getVelocity(), 1, true)}`;
        ctr++;
    }

    if (ct) {
        const y = AngleMath.negativeAngleConvert(Math.floor(player.getRotation().y));
        const x = compass.degrees[ y ].direction.intermediate;
        text += `${ctr > 0 ? '  |  ' : ''}§6${x}`;
        ctr++;
    }

    if (vt && ct && xt && vwt) {
        text += '\n';
        ctr = 0;
    }

    if (xt) {
        text += `${ctr > 0 ? '  |  ' : ''}§b${Math.floor(player.location.x)} §d${Math.floor(player.location.y)} §g${Math.floor(player.location.z)}`;
        ctr++;
    }
    else if (xxt) {
        text += `${ctr > 0 ? '  |  ' : ''}§b${player.location.x.toFixed(1)} §d${player.location.y.toFixed(1)} §g${player.location.z.toFixed(1)}`;
        ctr++;
    }

    if (vwt) {
        const vd = player.getViewDirection();
        text += `${ctr > 0 ? '  |  ' : ''}y-angle: ${GetViewAngle(vd.x, vd.y, vd.z)}`;
        ctr++;
    }
    text = text.trim();
    player.onScreenDisplay.setActionBar(text);

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

    return round(Angle * (180 / Math.PI), 0);
}
//=========================================================
/**
 * 
 * @param {Player} player 
 * @param {string} tag
 * @param {string} description
 */
export function tagToggle (player, tag, description) {
    system.run(() => {
        if (!player.removeTag(tag)) {
            player.addTag(tag);
            player.onScreenDisplay.setActionBar(`${pack.packName} ${description} turned §aOn`);
        }
        else chatLog.log(`${description} turned §cOff`, true, player);
    });
}
/**
 * 
 * @param {Player} player 
 */
export function tagHelp (player) {
    system.run(() => {
        chatLog.log(`Current Tick: ${system.currentTick}`)
        chatLog.log(`Type ${pack.commandPrefix}ULCC to toggle Upper Left Corner Coordinates`, player.isOp(), player);
        chatLog.log(`Type ${pack.commandPrefix}? in chat to see this list`, true, player);
        chatLog.log(`Facing is ${player.hasTag(pack.tags.facingTag) ? "§cOff" : "§aOn"} - §rType §d${pack.commandPrefix}face§r in chat to toggle it §aon/§coff`, true, player);
        chatLog.log(`XYZ is ${player.hasTag(pack.tags.xyzTag) ? "§aOn" : "§cOff"} - §rType §d${pack.commandPrefix}xyz§r in chat to toggle it §aon/§coff`, true, player);
        chatLog.log(`Velocity is ${player.hasTag(pack.tags.velocityTag) ? "§aOn" : "§cOff"} - §rType §d${pack.commandPrefix}vel§r in chat to toggle it §aon/§coff`, true, player);
        chatLog.log(`View Direction is ${player.hasTag(pack.tags.viewTag) ? "§aOn" : "§cOff"} - §rType §d${pack.commandPrefix}view§r in chat to toggle it §aon/§coff`, true, player);
    });
}
export function showCoordsToggle () {
    system.run(() => {
        let x = world.gameRules.showCoordinates;
        world.gameRules.showCoordinates = !x;

        if (x) {
            system.runTimeout(() => {
                world.getAllPlayers()
                    .filter(p => !p.hasTag(pack.tags.xyzTag))
                    .forEach(p => { tagToggle(p, pack.tags.xyzTag, "XYZ Coordinates"); });
            }, 2);
        }
    });
}
/**
 * 
 * @param {Player} player 
 */
export function showAngleInfo (player) {
    const angleInfo = compass.degrees[ player.getRotation().y ];
    debug.listObjectInnards(angleInfo, player, "Facing Angle Information", true);
}
//=============================================================================
// End of File
//=============================================================================