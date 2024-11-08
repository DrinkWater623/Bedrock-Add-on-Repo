//@ts-check
import { world, system, EntityInitializationCause } from "@minecraft/server";
import { alertLog, dev, watchFor, chatLog, entityEvents, pack } from './settings.js';
import { PlayerChatCommands } from "./chat_cmds-beta.js";
import { clearWorldChatWindow, debugDynamicPropertiesList } from "./fn-stable.js";
import { launchDeathBots } from "./deathBot.js";
var chatCmds = new PlayerChatCommands(pack.commandPrefix);
//==============================================================================
/**
 * @summary Beta
 */
export function chatSend () {
    alertLog.success(`§aInstalling Chat Commands (before)§r - §6Beta  §c(Debug Mode)§r`, dev.debugSubscriptions);
    world.beforeEvents.chatSend.subscribe((event) => {

        if (chatCmds.processEvent(event)) return;
        

        //can add more, if needed
    }
    );
}
//==============================================================================