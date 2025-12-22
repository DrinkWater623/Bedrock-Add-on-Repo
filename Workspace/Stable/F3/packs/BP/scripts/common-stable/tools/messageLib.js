// messages.js
// @ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20241229 - reOrg and add License
    20241203 - relocate
========================================================================*/
import { Player, World, world } from "@minecraft/server";
//==============================================================================
export class ChatMsg {
    /**
     * 
     * @param {string} packDisplayName 
     */
    constructor(packDisplayName = 'New Pack', on = true) {
        this.packName = packDisplayName;
        this.on = on;
    }
    /**
    * @param {string} msg
    * @param {1|2|3|4} [level=1] 
    */
    alertAdmin (msg = '', level = 1) {
        if (level < 1) level = 1;
        if (level > 4) level = 4;
        const players = world.getAllPlayers().filter(p => { return p.commandPermissionLevel >= level; });
        players.forEach(p => { this.#send(p, msg); });

        //TODO: if no admin on, have msg que to wait until one is on.
    }
    /**
     * 
     * @param {string} msg 
     * @param {boolean} [send=true] 
     * @param {Player|World} to 
     */
    log (msg = '', send = true, to = world) { this.send(to, `${this.packName}: ${msg}`, send); }
    /**
     * 
     * @param {string} msg 
     * @param {boolean} [send=true] 
     * @param {Player|World} to 
     */
    success (msg = '', send = true, to = world) { this.send(to, `${this.packName}: §a§lSuccess:§r ${msg}`, send); }
    /**
     * 
     * @param {string} msg 
     * @param {boolean} [send=true] 
     * @param {Player|World} to 
     */
    warn (msg = '', send = true, to = world) { this.send(to, `${this.packName}: §6§lWarning:§r ${msg}`, send); }
    /**
     * 
     * @param {string} msg 
     * @param {boolean} [send=true] 
     * @param {Player|World} to 
     */
    error (msg = '', send = true, to = world) { this.send(to, `${this.packName}: §c§lError:§r ${msg}`, send); }
    /**
     * @param {Player|World} to 
     * @param {string} msg 
     */
    send (to, msg = '', send = true) { if (to instanceof Player) this.player(to, msg, send); else this.world(msg, send); }
    /**
     * @param {Player} player 
     * @param {string} [msg]
     * @param {boolean}  [send]
     */
    player (player, msg = '', send = true) { if (send && player instanceof Player && player.isValid) this.#send(player, msg); }
    /**
     * @param {string} [msg]
     * @param {boolean}  [send]
     */
    world (msg = '', send = true) { if (send) this.#send(world, msg); }
    /**
     * Should be validated by now
     * @param {Player|World} to 
     * @param {string} msg 
     */
    #send (to, msg) { if (this.on) to.sendMessage(msg); }
};
//==============================================================================
export class ConsoleAlert {
    /**
     * 
     * @param {string} packDisplayName 
     */
    constructor(packDisplayName = 'New Pack', on = true) {
        this.packName = packDisplayName + '§r';
        this.on = on;
    }

    log (msg = '', send = true) { if (this.on && send) console.warn(`${this.packName}: ${msg}`); }
    success (msg = '', send = true) { if (this.on && send) console.warn(`${this.packName}: §a§lSuccess:§r ${msg}`); }
    warn (msg = '', send = true) { if (this.on && send) console.warn(`${this.packName}: §6§lWarning:§r ${msg}`); }
    error (msg = '', send = true) { if (this.on && send) console.error(`${this.packName}: §c§lError:§r ${msg}`); }
};
//=============================================================================