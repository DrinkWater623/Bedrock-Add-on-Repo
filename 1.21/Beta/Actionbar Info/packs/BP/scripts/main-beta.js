//@ts-check
//=========================================================
import { world, system, Player, TicksPerSecond } from "@minecraft/server";
import * as main from './main';
//=========================================================
/**
 * 
 * @param {Player} player 
 * @param {string} tag
 * @param {string} description
 */
function toggle (player,tag,description) {
    if (!player.removeTag(tag)) {
        player.addTag(tag);
        player.onScreenDisplay.setActionBar(`ActionBar ${description} turned §aOn`);
    }
    else player.sendMessage(`ActionBar ${description} turned §cOff`);
}
//=========================================================
function main_beta () {
    //console.warn('§aInstalling Action Bar Compass - §bChat Commands§r - §6Beta§r');

    world.beforeEvents.chatSend.subscribe((eventObject) => {
        //TODO: put data in object and loop
        if ([ ":face",";face" ].includes(eventObject.message.toLowerCase())) {
            eventObject.cancel = true;
            system.run(() => { toggle(eventObject.sender,main.facingTag,"Facing-Direction"); });
        }
        if ([ ":xyz", ";xyz" ].includes(eventObject.message.toLowerCase())) {
            eventObject.cancel = true;
            system.run(() => { toggle(eventObject.sender,main.xyzTag,"XYZ-Geo"); });
        }
        if ([ ":vel", ";vel" ].includes(eventObject.message.toLowerCase())) {
            eventObject.cancel = true;
            system.run(() => { toggle(eventObject.sender,main.velocityTag,"Velocity"); });
        }
        if ([ ":view", ";view" ].includes(eventObject.message.toLowerCase())) {
            eventObject.cancel = true;
            system.run(() => { toggle(eventObject.sender,main.viewTag,"View-Direction"); });
        }
    });

    world.afterEvents.playerSpawn.subscribe((event) => {
        system.runTimeout(() => {
            //TODO: put data in object and loop
            event.player.sendMessage(`Your ActionBar Facing is ${event.player.hasTag(main.facingTag) ? "§cOff" : "§aOn"} - §rType §d:face§r in chat to toggle it §aon/§coff`);
            event.player.sendMessage(`Your ActionBar XYZ is ${event.player.hasTag(main.xyzTag) ? "§aOn" : "§cOff"} - §rType §d:xyz§r in chat to toggle it §aon/§coff`);
            event.player.sendMessage(`Your ActionBar Velocity is ${event.player.hasTag(main.velocityTag) ? "§aOn" : "§cOff"} - §rType §d:vel§r in chat to toggle it §aon/§coff`);
            event.player.sendMessage(`Your ActionBar View Direction is ${event.player.hasTag(main.viewTag) ? "§aOn" : "§cOff"} - §rType §d:view§r in chat to toggle it §aon/§coff`);
        }, TicksPerSecond * 6);

    });
}
//=========================================================
main_beta();
main.main();
