//@ts-check
import { world } from "@minecraft/server";

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
};