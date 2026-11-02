// debugger-Class.js
// @ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 20250116 - Add Block from Ray Cast if different from View
            20251203 - Relocated
            20251207 - Relocated and renamed
========================================================================*/
import { world,  Player, World,  system } from '@minecraft/server';
//=============================================================================
// For Debugging
/**
 * Creates a new Debug object
 * @class
 */
export class Debugger {
    /**
     * @constructor
     * @param {string} pack_name 
     * @param {boolean} [on=true] - default true
     * @param {World | Player} [chatScope] - default world
     */
    constructor(pack_name, on = false, chatScope = world) {
        this.pack_name = pack_name;
        this.debugOn = on;
        this.chatSend = chatScope;
    }
    //--------------------------------------
    off () { this.debugOn = false; this.chatSend.sendMessage(`§c${this.constructor.name} OFF"`); }
    on () { this.debugOn = true; this.chatSend.sendMessage(`"§a${this.constructor.name} On`); }
    toggle () { if (this.debugOn) this.off(); else this.on(); }
    isDebug () { return this.debugOn; }
    //--------------------------------------    
    /**
     * 
     * @param {World|Player} [chatScope ]
     */
    #ValidChatSend (chatScope) {
        if (chatScope instanceof Player) if (chatScope.isValid) return chatScope;
        return world;
    }
    /**
     * 
     * @param {string} msg 
     * @param {World|Player} chatSend 
     */
    #log (msg = "", chatSend = this.chatSend) {
        this.#ValidChatSend((chatSend)).sendMessage(msg);
    };
    /**
         * 
         * @param {string} msg 
         */
    consoleError (msg) {
        console.error(`Pack: ${this.pack_name}: Day: ${world.getDay()} @ Tick: ${system.currentTick}: §cError:§r ${msg}`);
    };
    /**
         * 
         * @param {string} msg
         * @param {boolean} override Override debugOn setting - Display anyway 
         */
    consoleLog (msg, override = false) {
        if (override || this.debugOn) console.warn(`Pack: ${this.pack_name}: Day: ${world.getDay()} @ Tick: ${system.currentTick}: Log: ${msg}`);
    };
    /**
         * 
         * @param {string} msg
         * @param {boolean} override Override debugOn setting - Display anyway 
         */
    consoleSuccess (msg, override = false) {
        if (override || this.debugOn) console.warn(`Pack: ${this.pack_name}: Day: ${world.getDay()} @ Tick: ${system.currentTick}: §aSuccess:§r ${msg}`);
    };
    /**
         * 
         * @param {string} msg
         * @param {boolean} override Override debugOn setting - Display anyway 
         */
    consoleWarn (msg, override = false) {
        if (override || this.debugOn) console.warn(`Pack: ${this.pack_name}: Day: ${world.getDay()} @ Tick: ${system.currentTick}: §6Warning:§r ${msg}`);
    };
    /**
     * 
     * @param {string} msg 
     * @param {World|Player} chatSend 
     * @param {boolean} override Override debugOn setting - Display anyway
     */
    error (msg, chatSend = this.chatSend, override = false) {
        if (override || this.debugOn) this.#log(`§cError (${this.pack_name}):§r ${msg}`, chatSend);
    };
    /**
     * 
     * @param {string} msg 
     * @param {World|Player} chatSend 
     * @param {boolean} override Override debugOn setting - Display anyway
     * @param {string} preFormat
     */
    log (msg, chatSend = this.chatSend, override = false,preFormat=`§6Log (${this.pack_name}):§r`) {
        if (override || this.debugOn) this.#log(`${preFormat}${msg}`, chatSend);
    };
    /**
     * 
     * @param {string} msg 
     * @param {World|Player} [chatSend] 
     */
    logPlain (msg, chatSend = this.chatSend) {
        this.#ValidChatSend((chatSend)).sendMessage(msg)
    };
    /**
     * 
     * @param {string} msg 
     * @param {World|Player} chatSend 
     * @param {boolean} override Override debugOn setting - Display anyway
     */
    success (msg, chatSend = this.chatSend, override = false) {
        if (override || this.debugOn) this.#log(`§aSuccess (${this.pack_name}):§r ${msg}`, chatSend);
    };
    /**
     * 
     * @param {Object} object 
     * @param {World|Player} chatSend 
     * @param {string} title 
     * @param {boolean} override
     */
    listObjectInnards (object, chatSend = this.chatSend, title = "Key-Value List:", override = false) {
        if (override || this.debugOn) {
            const entries = Object.entries(object);
            this.logPlain(`${title} (${entries.length})`, chatSend);
            for (const [ key, value ] of entries) {
                this.logPlain(`==> ${key}: ${value}`, chatSend);
                if (typeof value == 'object')
                    this.listObjectInnards(value,chatSend,key,override)
            }
        }
    };
    /**
     * 
     * @param {*[]} array 
     * @param {World|Player} chatSend 
     * @param {string} title
     * @param {boolean} override 
     */
    listArray (array, chatSend = this.chatSend, title = "Array List:", override = false) {
        if (override || this.debugOn) {
            this.logPlain(`${title} (${array.length})`, chatSend);
            for (let i = 0; i < array.length; i++) {
                let msg = i.toString() + ' - ';

                if (typeof array[ i ] === 'object') {
                    this.listObjectInnards(array[ i ], chatSend);
                    //TODO: account for array object
                }
                else
                    msg += array[ i ].toString();

                this.logPlain(`==> ${msg}`, chatSend);
            }
        }
    };    
}