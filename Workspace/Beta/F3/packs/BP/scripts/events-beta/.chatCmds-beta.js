import { world,  Player } from "@minecraft/server";
import { Debug } from '../commonLib/mcDebugClass.js';
import * as f3 from './f3.js';
//==============================================================================
const debug = new Debug("F3", true, world);
//==============================================================================
//This is still in beta, so cannot use it for Stable Add-On
//==============================================================================
/**
 * 
 * @param {Player} player 
 * @param {string} command 
 */
export function processChatCommand (player, command) {
    if (command === "cls") {
        player.sendMessage("\n".repeat(40));
        return;
    }

    //-------------------------------------------------
    if (command === "piwb info") {
        f3.playerF3Show(player, 'last_playerInteractWithBlock');
        return;
    }
    /*const toggles = {
    //TODO:
        ppb_b4: false,
        ppb_aft: false
    };
    */
    if (command.startsWith('piwb_b4')) {
        if (command === "piwb_b4 on") f3.toggles.piwb_b4 = true;
        else if (command === "piwb_b4 off") f3.toggles.piwb_b4 = false;
        else f3.toggles.piwb_b4 = !f3.toggles.piwb_b4;
        debug.log(`§d* piwb_b4 is ${f3.toggles.piwb_b4 ? '§aOn' : '§cOff'}`);
        return;
    }
    if (command.startsWith('piwb_aft')) {
        if (command === "piwb_aft on") f3.toggles.piwb_aft = true;
        else if (command === "piwb_aft off") f3.toggles.piwb_aft = false;
        else f3.toggles.piwb_aft = !f3.toggles.piwb_aft;
        debug.log(`§d* piwb_aft is ${f3.toggles.piwb_aft ? '§aOn' : '§cOff'}`);
        return;
    }
    if (command.startsWith('pbb_b4')) {
        if (command === "pbb_b4 on") f3.toggles.pbb_b4 = true;
        else if (command === "pbb_b4 off") f3.toggles.pbb_b4 = false;
        else f3.toggles.pbb_b4 = !f3.toggles.pbb_b4;
        debug.log(`§d* pbb_b4 is ${f3.toggles.pbb_b4 ? '§aOn' : '§cOff'}`);
        if(f3.toggles.pbb_b4) debug.log(`Type "f3 piwb info" to see information on last block interaction - either b4/aft`)
        return;
    }
    if (command.startsWith('pbb_aft')) {
        if (command === "pbb_aft on") f3.toggles.pbb_aft = true;
        else if (command === "pbb_aft off") f3.toggles.pbb_aft = false;
        else f3.toggles.pbb_aft = !f3.toggles.pbb_aft;
        debug.log(`§d* pbb_aft is ${f3.toggles.pbb_aft ? '§aOn' : '§cOff'}`);
        return;
    }
    //-------------------------------------------------
    if (command.includes("info")) {
        debug.playerInfo(player, world, '', true, command);
        return;
    }

    if (command === "dyps" || command === "dyp") {
        debug.playerInfo(player, world, '', true, 'dyp');
        return;
    }

    if (command === "eff") {
        debug.playerInfo(player, world, '', true, 'eff');
        return;
    }
    if (command === "geo") {
        debug.playerInfo(player, world, '', true, 'geo');
        return;
    }

    if (command === "tags" || command === "tag") {
        debug.playerInfo(player, world, '', true, 'tag');
        return;
    }

    if (command === "view") {
        debug.playerInfo(player, world, '', true, 'view');
        return;
    }

    debug.error("Invalid Command");
}
//==============================================================================
