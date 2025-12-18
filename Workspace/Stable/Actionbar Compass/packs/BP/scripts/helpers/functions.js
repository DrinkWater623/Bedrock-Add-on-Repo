// functions.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: MIT
URL: https://github.com/DrinkWater623
========================================================================
Change Log:
    20250109 - ReDone
    20251203 - Updates
========================================================================
*/
import { Player, system, world } from "@minecraft/server";
import { Vector3Lib ,AngleMath, Compass} from "../common-stable/tools/index";
import { chatLog, pack } from "../settings";
//=========================================================
const compass = new Compass();
const abcColors = pack.colors;
const tags = pack.tags;
//=========================================================
/**
 * 
 * @param {Player} player 
 */
function display (player) {

    //broken out for readability

    const vt = !!player.getDynamicProperty(pack.tags.velocityTag);
    const ct = !!player.getDynamicProperty(pack.tags.compassTag);
    const xt = !!player.getDynamicProperty(pack.tags.xyzTag) && !world.gameRules.showCoordinates;

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
            x = '§l' + di.replace('-', abcColors.compass + '-');
        else //endsWith assumed
            x = di.replace('-', abcColors.compass + '§l-');

        text += `${ctr > 0 ? '  |  ' : ''}${abcColors.compass}${x}§r`;
        ctr++;
    }

    if (xt) {
        const location = player.location;
        text += `${ctr > 0 ? '  |  ' : ''}${abcColors.x}${Math.floor(location.x)}  ${abcColors.y}${Math.floor(location.y)}  ${abcColors.z}${Math.floor(location.z)}§r`;
        ctr++;
    }

    text = text.trim();
    if (text && player.isValid) player.onScreenDisplay.setActionBar(text);
}
//=========================================================
/**
 * 
 * @param {Player} player 
 * @param {boolean} ct 
 * @param {boolean} vt 
 * @param {boolean} xt 
 */
function display2 (player, ct, vt, xt) {
    if (!(ct || vt || xt)) return;

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
            x = '§l' + di.replace('-', abcColors.compass + '-');
        else //endsWith assumed
            x = di.replace('-', abcColors.compass + '§l-');

        text += `${ctr > 0 ? '  |  ' : ''}${abcColors.compass}${x}§r`;
        ctr++;
    }

    if (xt) {
        const location = player.location;
        text += `${ctr > 0 ? '  |  ' : ''}${abcColors.x}${Math.floor(location.x)}  ${abcColors.y}${Math.floor(location.y)}  ${abcColors.z}${Math.floor(location.z)}§r`;
        ctr++;
    }

    text = text.trim();
    if (text && player.isValid) player.onScreenDisplay.setActionBar(text);
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
                    .forEach(p => { tagToggle(p, pack.tags.xyzTag, "XYZ Coordinates"); });
            }, 2);
        }
    });
}
//============================================================================
export function runABC1 () {
    let players = world.getAllPlayers()
        .filter(p =>
            // p.hasTag(pack.tags.compassTag) ||
            // (p.hasTag(pack.tags.xyzTag) && !world.gameRules.showCoordinates) ||
            // p.hasTag(pack.tags.velocityTag)
            p.getDynamicProperty(pack.tags.compassTag) ||
            (p.getDynamicProperty(pack.tags.xyzTag) && !world.gameRules.showCoordinates) ||
            p.getDynamicProperty(pack.tags.velocityTag)
        );
    let ctr = 0;
    system.runInterval(() => {
        if (ctr = 5) {
            ctr = 0;
            players = world.getAllPlayers()
                .filter(p =>
                    p.getDynamicProperty(pack.tags.compassTag) ||
                    (p.getDynamicProperty(pack.tags.xyzTag) && !world.gameRules.showCoordinates) ||
                    p.getDynamicProperty(pack.tags.velocityTag)
                );
        }
        players.forEach(p => { display(p); });
        ctr++;
    }, pack.tickDelay);
}
//============================================================================
export function runABC () {
    system.runInterval(() => {
        world.getAllPlayers()
            .map(p => { return { 
                player: p, 
                ct: !!p.getDynamicProperty(tags.compassTag),
                vt: !!p.getDynamicProperty(tags.velocityTag),
                xt: !!p.getDynamicProperty(tags.xyzTag)  && !world.gameRules.showCoordinates
            }; })
            .filter(po => po.ct || po.vt || po.xt)
            .forEach(p => display2(p.player, p.ct, p.vt, p.xt) );
    }, pack.tickDelay);
}
//=============================================================================
// End of File
//=============================================================================