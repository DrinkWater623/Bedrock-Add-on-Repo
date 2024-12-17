//@ts-check
/**
 * Notes:  This is only called via manifest when Beta Config is used 
 *         This will call the stable portion 1st
 */
import { world } from '@minecraft/server';
import { main_stable, masterDevDebugInitialize } from './main-stable.js';
import { alertLog, pack, dev, toggles } from './settings.js';
import * as piwb from './events-beta/playerInteractWithBlock.js';
import { PlayerChatCommands } from "./events-beta/chat_cmds-beta.js";
//==============================================================================
const chatCmds = new PlayerChatCommands(pack.commandPrefix);
//==============================================================================
function main_beta () {
    alertLog.success(`§aInstalling Chat Commands (before)§r - §6Beta  §c(Debug Mode)§r`, dev.debugSubscriptions);
    world.beforeEvents.chatSend.subscribe((event) => {
        if (chatCmds.processEvent(event)) return;
    });

    alertLog.success("§aInstalling beforeEvents.playerInteractWithBlock §6BETA", dev.debugSubscriptions);
    world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
        if (toggles.piwb_b4)
            piwb.playerInteractWithBlock_both(event);
    });

    alertLog.success("§aInstalling afterEvents.playerInteractWithBlock §6BETA", dev.debugSubscriptions);
    world.afterEvents.playerInteractWithBlock.subscribe((event) => {
        if (toggles.piwb_aft)
            piwb.playerInteractWithBlock_both(event);
    });
}
//==============================================================================
masterDevDebugInitialize();
pack.hasChatCmd = 1;
pack.isBeta = 1;
//==============================================================================
alertLog.log(`§aInstalling Add-on ${pack.packName} - §6Beta ${dev.debugPackLoad ? '§c(Debug Mode)' : ''}`, dev.debugPackLoad);
//==============================================================================
alertLog.log(`§bCalling main_stable()  §c(Debug Mode)`, dev.debugPackLoad);
main_stable();
alertLog.log(`§6Calling main_beta()  §c(Debug Mode)`, dev.debugPackLoad);
main_beta();
//==============================================================================
alertLog.success(`§aInstalled Add-on ${pack.packName} - §6Beta ${dev.debugPackLoad ? '§c(Debug Mode)' : ''}`, pack.isLoadAlertsOn);
//==============================================================================
