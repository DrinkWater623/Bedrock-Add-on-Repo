//@ts-check
//=========================================================
import { world, system, Player, TicksPerSecond } from "@minecraft/server";
import * as main from './main';
//=========================================================
/**
 * 
 * @param {Player} player 
 */
function compassToggle (player) {
    if (!player.removeTag(main.noCompassTag)) {
        player.addTag(main.noCompassTag);
        player.onScreenDisplay.setActionBar("ActionBar Compass turned §cOff");
    }
    else player.sendMessage("ActionBar Compass turned §aOn");
}
//=========================================================
/**
 * 
 * @param {Player} player 
 */
function xyzToggle (player) {
    if (!player.removeTag(main.xyzTag)) {
        player.addTag(main.xyzTag);
        player.onScreenDisplay.setActionBar("ActionBar XYZ turned §aOn");
    }
    else player.sendMessage("ActionBar XYZ turned §cOff");
}
//=========================================================
/**
 * 
 * @param {Player} player 
 */
function velocityToggle (player) {
    if (!player.removeTag(main.velocityTag)) {
        player.addTag(main.velocityTag);
        player.onScreenDisplay.setActionBar("ActionBar Velocity turned §aOn");
    }
    else player.sendMessage("ActionBar Velocity turned §cOff");
}
//=========================================================
function main_beta () {
    //console.warn('§aInstalling Action Bar Compass - §bChat Commands§r - §6Beta§r');

    world.beforeEvents.chatSend.subscribe((eventObject) => {
        if ([ ":abc",";abc" ].includes(eventObject.message.toLowerCase())) {
            eventObject.cancel = true;
            system.run(() => { compassToggle(eventObject.sender); });
        }
        if ([ ":xyz", ";xyz" ].includes(eventObject.message.toLowerCase())) {
            eventObject.cancel = true;
            system.run(() => { xyzToggle(eventObject.sender); });
        }
        if ([ ":vel", ";vel" ].includes(eventObject.message.toLowerCase())) {
            eventObject.cancel = true;
            system.run(() => { velocityToggle(eventObject.sender); });
        }
    });

    world.afterEvents.playerSpawn.subscribe((event) => {
        system.runTimeout(() => {
            event.player.sendMessage(`Your ActionBar Compass is ${event.player.hasTag(main.noCompassTag) ? "§cOff" : "§aOn"} - §rType §d:abc§r in chat to toggle it §aon/§coff`);
            event.player.sendMessage(`Your ActionBar XYZ is ${event.player.hasTag(main.xyzTag) ? "§aOn" : "§cOff"} - §rType §d:xyz§r in chat to toggle it §aon/§coff`);
            event.player.sendMessage(`Your ActionBar Velocity is ${event.player.hasTag(main.velocityTag) ? "§aOn" : "§cOff"} - §rType §d:vel§r in chat to toggle it §aon/§coff`);
        }, TicksPerSecond * 6);

    });
}
//=========================================================
//dconsole.warn(`§aLoading DW623's Action Bar Compass Add-on§r`);
main_beta();
main.main();
