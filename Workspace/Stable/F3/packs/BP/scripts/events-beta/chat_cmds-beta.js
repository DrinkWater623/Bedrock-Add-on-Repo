//@ts-check
import { Player, ChatSendBeforeEvent, world } from "@minecraft/server";
import { pack, toggles, chatLog, alertLog, dev } from '../settings.js';
import { playerF3Show } from "../fn-stable.js";
import { Debug } from "../common-stable/mcDebugClass.js";
//==============================================================================
const debugInfo = new Debug('F3',true,world)
//==============================================================================
export class PlayerChatCommands {
    constructor(cmdPrefix = ':') {
        this.cmdPrefix = cmdPrefix;
        alertLog.success(`Accepting Chat Commands Prefixed with ${cmdPrefix}`, dev.debugPackLoad || dev.debugChatCmds);
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

        let message = event.message.replaceAll(this.cmdPrefix, '').toLowerCase();
        chatLog.log(`\n\nProcessing Chat Cmd: (${message})`, dev.debugChatCmds);

        return this.processCommand(event.sender, message);
    }
    /**
    * @param { Player } player
    */
    processCommand (player, command = "") {
        if (!(player instanceof Player)) return false;
        player.sendMessage('\n');
        switch (command) {
            case '':
            case '?': {
                chatLog.log(`cls`);
                chatLog.log(`piwb b4/aft${toggles.piwb_aft || toggles.piwb_b4 ? "/info" : ""} (Player Interact With Block)`);
                chatLog.log(`pbb b4/aft${toggles.pbb_aft || toggles.pbb_b4 ? "/info" : ""} (Player BreaK Block)`);
                player.sendMessage('\n');
                return true;
            }
            case "cls": chatLog.log('\n'.repeat(40)); return true;
            case "info": debugInfo.playerInfo(player,player,"Info",true); return true;

            case "piwb-info":
            case "piwb_info":
            case "piwb info":
            case "piwbinfo":
                playerF3Show(player, 'last_playerInteractWithBlock');
                return true;
            case "piwb-aft":
            case "piwb_aft":
            case "piwb aft":
            case "piwbaft":
                toggles.piwb_aft = !toggles.piwb_aft;
                chatLog.log(`§d* piwb_aft is ${toggles.piwb_aft ? '§aOn' : '§cOff'}`);
                if (toggles.pbb_aft) chatLog.log(`Type ":f3 piwb info" to see information on last block interaction - either b4/aft`);
                player.sendMessage('\n');
                return true;
            case "piwb-b4":
            case "piwb_b4":
            case "piwb b4":
            case "piwbb4":
                toggles.piwb_b4 = !toggles.piwb_b4;
                chatLog.log(`§d* piwb_b4 is ${toggles.piwb_b4 ? '§aOn' : '§cOff'}`);
                if (toggles.pbb_b4) chatLog.log(`Type ":f3 piwb info" to see information on last block interaction - either b4/aft`);
                player.sendMessage('\n');
                return true;
            case "pbb-aft":
            case "pbb_aft":
            case "pbb aft":
            case "pbbaft":
                toggles.pbb_aft = !toggles.pbb_aft;
                chatLog.log(`§d* pbb_aft is ${toggles.pbb_aft ? '§aOn' : '§cOff'}`);
                if (toggles.pbb_aft) chatLog.log(`Type ":f3 pbb info" to see information on last block break - either b4/aft`);
                player.sendMessage('\n');
                return true;
            case "pbb-b4":
            case "pbb_b4":
            case "pbb b4":
            case "pbbb4":
                toggles.pbb_b4 = !toggles.pbb_b4;
                chatLog.log(`§d* pbb_b4 is ${toggles.pbb_b4 ? '§aOn' : '§cOff'}`);
                if (toggles.pbb_b4) chatLog.log(`Type ":f3 pbb info" to see information on last block break - either b4/aft`);
                player.sendMessage('\n');
                return true;
            case "bv":
                toggles.blockView = !toggles.blockView;
                chatLog.log(`§d* blockView is ${toggles.blockView ? '§aOn' : '§cOff'}`);                
                player.sendMessage('\n');
                return true;
        }

        return false;
    }
}