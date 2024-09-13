//@ts-check
import { world } from "@minecraft/server";
/**
 *  Owner is to edit this file as needed
 */
//==============================================================================
export const pack = {
    packName: 'isTamed Tameable Access',
    isLoadAlertsOn: true,
    hasChatCmd: -1 
};
//==============================================================================
//Change this to change the entity
export const dev = {
    debugAll: false,
    debugCallBackEvents: true,
    debugGamePlay: true,
    debugPackLoad: true,
    debugSubscriptions: true
};
//==============================================================================
//Change this to ...
export const gamePlay = {    
    commandPrefix: "it:",
    entityList:['cat','parrot','wolf','horse','mule','donkey','ocelot'],
    itemTypeId:'stick'
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