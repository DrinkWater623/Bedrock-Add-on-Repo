//@ts-check
import { world } from "@minecraft/server";
import { alertLog, dev } from './settings.js';
import { chatCmds } from "./chat_cmds-beta.js";
//==============================================================================
/**
 * @summary Beta
 */
export function chatSend () {
    alertLog.success(`§aInstalling Chat Commands (before)§r - §6Beta  §c(Debug Mode)§r`, dev.debugSubscriptions);

    world.beforeEvents.chatSend.subscribe((event) => {
        if (chatCmds.processEvent(event)) return;
    });
}
//==============================================================================