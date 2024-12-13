//@ts-check
import { Player, ChatSendBeforeEvent } from "@minecraft/server";
import { pack, toggles, chatLog, alertLog, dev } from './settings.js';
import { playerF3Show } from "./fn-stable.js";
//==============================================================================

//==============================================================================
export class PlayerChatCommands {
    constructor(cmdPrefix = ':') {
        this.cmdPrefix = cmdPrefix;
        alertLog.success(`Accepting Chat Commands Prefixed with ${cmdPrefix}`,dev.debugPackLoad || dev.debugChatCmds);
    }
    /**
     * @param {ChatSendBeforeEvent } event
     */
    processEvent (event) {
        if (!(event instanceof ChatSendBeforeEvent)) return false;

        if (event.message == ':?' || event.message == '?') {
            event.sender.sendMessage(`\n\n§gType ${this.cmdPrefix}? to see commands for the §a${pack.packName}§g Add-On`);
            return false;
        }

        if (!event.message.startsWith(this.cmdPrefix)) return false;
        event.cancel;

        let message = event.message.replaceAll(this.cmdPrefix, '').toLowerCase().replaceAll(' ', '');
        chatLog.log(`\n\nProcessing Chat Cmd: (${message})`,dev.debugChatCmds)

        return this.processCommand(event.sender, message);
    }
    /**
    * @param { Player } player
    */
    processCommand (player, command = "") {
        if (!(player instanceof Player)) return false;
        player.sendMessage('\n')
        switch (command) {
            case '':
            case '?': {
                chatLog.log(`cls`);
                chatLog.log(`piwb b4/aft${toggles.piwb_aft || toggles.piwb_b4 ? "/info" : ""} (Player Interact With Block)`);
                chatLog.log(`pbb b4/aft${toggles.pbb_aft || toggles.pbb_b4 ? "/info" : ""} (Player BreaK Block)`);
                player.sendMessage('\n')
                return true;
            }
            case "piwbinfo":
                playerF3Show(player, 'last_playerInteractWithBlock');
                return true;
            case "piwbaft":
                toggles.piwb_aft = !toggles.piwb_aft;
                chatLog.log(`§d* piwb_aft is ${toggles.piwb_aft ? '§aOn' : '§cOff'}`);
                if (toggles.pbb_aft) chatLog.log(`Type ":f3 piwb info" to see information on last block interaction - either b4/aft`);
                player.sendMessage('\n')
                return true;
            case "piwbb4":
                toggles.piwb_b4 = !toggles.piwb_b4;
                chatLog.log(`§d* piwb_b4 is ${toggles.piwb_b4 ? '§aOn' : '§cOff'}`);
                if (toggles.pbb_b4) chatLog.log(`Type ":f3 piwb info" to see information on last block interaction - either b4/aft`);
                player.sendMessage('\n')
                return true;
            case "pbbaft":
                toggles.pbb_aft = !toggles.pbb_aft;
                chatLog.log(`§d* pbb_aft is ${toggles.pbb_aft ? '§aOn' : '§cOff'}`);
                if (toggles.pbb_aft) chatLog.log(`Type ":f3 pbb info" to see information on last block break - either b4/aft`);
                player.sendMessage('\n')
                return true;
            case "pbbb4":
                toggles.pbb_b4 = !toggles.pbb_b4;
                chatLog.log(`§d* pbb_b4 is ${toggles.pbb_b4 ? '§aOn' : '§cOff'}`);
                if (toggles.pbb_b4) chatLog.log(`Type ":f3 pbb info" to see information on last block break - either b4/aft`);
                player.sendMessage('\n')
                return true;
            case "cls": chatLog.log('\n'.repeat(40)); return true;
        }

        return false;
    }
}