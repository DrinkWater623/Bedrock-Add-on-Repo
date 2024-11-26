//@ts-check
//=============================================================================
/*
    Written By:     "https://github.com/DrinkWater623"
    Last Update:    20241110 - add debug to .player
*/
import { Player, system, World, world } from "@minecraft/server";
//=============================================================================
export class ConsoleAlert {
    /**
     * 
     * @param {string} packDisplayName 
     */
    constructor (packDisplayName = 'New Pack') {
        this.packName = packDisplayName + '§r';
    }

    log (msg = '', debug = true) { if (debug) console.warn(`${this.packName}: ${msg}`); }
    success (msg = '', debug = true) { if (debug) console.warn(`${this.packName}: §aSuccess: ${msg}`); }
    warn (msg = '', debug = true) { if (debug) console.warn(`${this.packName}: §6Warning: ${msg}`); }
    error (msg = '', debug = true) { if (debug) console.error(`${this.packName}: §cError: ${msg}`); }
};
//==============================================================================
export class ChatMsg {
    /**
     * 
     * @param {string} packDisplayName 
     */
    constructor (packDisplayName = 'New Pack') {
        this.packName = packDisplayName;
    }
    log (msg = '', debug = true) { if (debug) world.sendMessage(`${this.packName}: ${msg}`); }
    success (msg = '', debug = true) { if (debug) world.sendMessage(`${this.packName}: §aSuccess: ${msg}`); }
    warn (msg = '', debug = true) { if (debug) world.sendMessage(`${this.packName}: §6Warning: ${msg}`); }
    error (msg = '', debug = true) { if (debug) world.sendMessage(`${this.packName}: §cError: ${msg}`); }
    /**
     * 
     * @param {Player} player 
     * @param {string} [msg]
     * @param {boolean}  [debug]
     */
    player (player,msg = '', debug = true) { if (debug) this.#send(player,`${this.packName}: ${msg}`); }
    //not sure needed to go out a tick or not...
    /**
     * 
     * @param {Player|World} to 
     * @param {string} msg 
     */
    #send(to,msg) {
        system.runTimeout(() => to.sendMessage(msg),1)
    }
};