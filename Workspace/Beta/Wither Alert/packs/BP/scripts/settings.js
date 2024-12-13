//@ts-check
import { world } from "@minecraft/server";
/**
 *  Owner is to edit this file as needed
 */
//==============================================================================
export const pack = {
    packName: 'Wither Alert',
    isLoadAlertsOn: true,
    isAlertSystemOn: true,
    hasChatCmd: -1 
};
//==============================================================================
//Change this to change the entity
export const dev = {
    debugAll: false,
    debugCallBackEvents: false,
    debugEntityAlert: true,
    debugGamePlay: true,
    debugPackLoad: false,
    debugSubscriptions: false
};
//==============================================================================
//Change this to change the entity
export const watchFor = {
    typeId: "minecraft:wither",
    family: "wither",
    display: "Wither",
    explosiveProjectiles: [ "minecraft:wither_skull", "minecraft:wither_skull_dangerous" ],
    //watchForExplosion: true,
    validated: false, //Note: this is checked each load - so don't bother tryna trick it, unless you do it in code
    intervalTimer: 400, // = 30 * 20, //Time between Location Alerts when Withers
    intervalMin: 100,
    intervalMax: (24000 / 4)
};
//==============================================================================
//Change this to ...
export const gamePlay = {    
    commandPrefix: "wa:",
    boostsAllowed: false,
    boostTicks: 7200,
    boostTicksMin: 1200,
    boostTicksMax: 1200 * 20
};
//==============================================================================
class ConsoleAlert {
    prefix = `§d${pack.packName}§r`;
    log (msg = '', debug = true) { if (debug) console.warn(`${this.prefix}: ${msg}`); }
    success (msg = '', debug = true) { if (debug) console.warn(`${this.prefix}: §aSuccess: ${msg}`); }
    warn (msg = '', debug = true) { if (debug) console.warn(`${this.prefix}: §6Warning: ${msg}`); }
    error (msg = '', debug = true) { if (debug) console.error(`${this.prefix}: §cError: ${msg}`); }
};
//==============================================================================
class ChatMsg {
    prefix = `§b${pack.packName}§r`;
    log (msg = '', debug = true) { if (debug) world.sendMessage(`${this.prefix}: ${msg}`); }
    success (msg = '', debug = true) { if (debug) world.sendMessage(`${this.prefix}: §aSuccess: ${msg}`); }
    warn (msg = '', debug = true) { if (debug) world.sendMessage(`${this.prefix}: §6Warning: ${msg}`); }
    error (msg = '', debug = true) { if (debug) world.sendMessage(`${this.prefix}: §cError: ${msg}`); }
};
//==============================================================================
export const alertLog = new ConsoleAlert()
export const chatLog = new ChatMsg()