//@ts-check
import { world } from "@minecraft/server";
import { chatSend_before_fn, chatSend_after_fn } from './chatCmds-beta.js';
import { alertLog, pack, dev, chatLog, gamePlay } from './settings.js';
import { main_stable } from './main-stable.js';
import { PlayerLib } from './commonLib/playerClass.js';
//==============================================================================
function main_beta () {
    const debugMsg = pack.isLoadAlertsOn || dev.debugPackLoad || dev.debugSubscriptions;

    alertLog.success(`§aActivating Chat Commands§r - §6Beta§r`, debugMsg);
    world.beforeEvents.chatSend.subscribe(
        (event) => { chatSend_before_fn(event); });

    world.afterEvents.chatSend.subscribe(
        (event) => { chatSend_after_fn(event); });

    //Cannot work, hand or anything already captured.  Sits or mounts
    // world.afterEvents.playerInteractWithEntity.subscribe((event) => {
    //     const { player, target, itemStack } = event;

    //     if (target.isValid() && target.hasComponent('minecraft:is_tame') && target.hasComponent('minecraft:tameable')) {
    //         if (!itemStack || PlayerLib.isPlayerHoldingTypeId(gamePlay.itemTypeId, player)) {
    //             const tameable = target.getComponent('minecraft:tameable')
    //             if (!tameable) return

    //             world.sendMessage(tameable.tamedToPlayerId || 'undefined owner')
    //         }
    //     }
    // });
}
//==============================================================================
pack.hasChatCmd = 1;
alertLog.warn(`§bCalling main_stable()`, dev.debugPackLoad);
main_stable();
alertLog.warn(`§bCalling main_beta()`, dev.debugPackLoad);
main_beta();
