// functions.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: MIT
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20250109 - ReDone
========================================================================
*/
import { Player, system, world } from "@minecraft/server";
import { Vector3Lib } from "../common-stable/vectorClass";
import { AngleMath, Compass } from "../common-other/rotationLib";
import { chatLog, pack } from "../settings";
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
    const ct = player.hasTag(pack.tags.compassTag);
    const xt = player.hasTag(pack.tags.xyzTag) && !world.gameRules.showCoordinates;

    let text = '';
    let ctr = 0;

    if (vt) {
        text += `${ctr > 0 ? '  |  ' : ''}${pack.colors.velocity}${Vector3Lib.toString(player.getVelocity(), 1, true)}§r`;
        ctr++;
    }

    if (ct) {
        const y = AngleMath.negativeAngleConvert(Math.floor(player.getRotation().y));
        const o = compass.degrees[ y ];
        const di = o.direction.intermediate;
        const dc = o.direction.cardinal;
        let x = '';
        if (di == dc)
            x = di;
        else if (di.startsWith(dc))
            x = '§l' + di.replace('-', pack.colors.compass + '-');
        else //endsWith assumed
            x = di.replace('-', pack.colors.compass + '§l-');

        text += `${ctr > 0 ? '  |  ' : ''}${pack.colors.compass}${x}§r`;
        ctr++;
    }

    if (xt) {
        text += `${ctr > 0 ? '  |  ' : ''}${pack.colors.x}${Math.floor(player.location.x)}  ${pack.colors.y}${Math.floor(player.location.y)}  ${pack.colors.z}${Math.floor(player.location.z)}§r`;
        ctr++;
    }

    text = text.trim();
    player.onScreenDisplay.setActionBar(text);
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
export function showCoordsToggle () {
    system.run(() => {
        let x = world.gameRules.showCoordinates;
        world.gameRules.showCoordinates = !x;

        if (x) {
            system.runTimeout(() => {
                world.getAllPlayers()
                    .filter(p => !p.hasTag(pack.tags.xyzTag))
                    .forEach(p => {tagToggle(p, pack.tags.xyzTag, "XYZ Coordinates"); });
            }, 2);
        }
    });
}
//=============================================================================
// End of File
//=============================================================================