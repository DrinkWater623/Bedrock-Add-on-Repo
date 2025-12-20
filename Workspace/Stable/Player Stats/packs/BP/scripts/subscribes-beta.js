//@ts-check
import { world, system,} from "@minecraft/server";
import { alertLog, dev } from './settings.js';
import { chatSend_before_fn } from './chatCmds-beta.js';

//==============================================================================
/**
 * @summary Beta
 */
export function chatSend () {
    alertLog.success(`§aInstalling Chat Commands (before)§r - §6Beta  §c(Debug Mode)§r`, dev.debugSubscriptions);
    world.beforeEvents.chatSend.subscribe((event) => {
        chatSend_before_fn(event);
    });
}
//==============================================================================