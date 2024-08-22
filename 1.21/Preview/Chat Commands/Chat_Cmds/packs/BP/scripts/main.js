import { world, system, Player } from '@minecraft/server';
import * as cmd from './modules/cmds.js';

//=============================================================================
world.beforeEvents.chatSend.subscribe((event) => {
    // ☠

    if (!(event.sender instanceof Player)) return;

    const message = event.message.trim();

    const playerCmd = ":"; //?
    const adminCmd = ":admin";
    const adminTag = "god";

    if (message.startsWith(adminCmd + ' ')) {
        if (event.sender.isOp() || event.sender.hasTag(adminTag)) {
            let messageCmd = message.substring(adminCmd.length + 1);
            if (cmd.adminCommands(event.sender, messageCmd)) {
                event.cancel = true; //only handle defined commands - let rest pass thru
                return;
            }
        }        
        return;
    }
    else if (message.startsWith(playerCmd) && message.length > 1) {        
        //event.sender.sendMessage("§gProcessing your command");
        let messageCmd = message.substring(playerCmd.length);
        if (cmd.colonCmds(event.sender, messageCmd)) {
            event.cancel = true; //only handle defined commands - let rest pass thru
            return;
        }        
        return;
    }
    else if (!message.includes(' ') && cmd.chatCmds(event.sender, message)) {
        event.cancel = true;
        return;
    }

});
//=============================================================================