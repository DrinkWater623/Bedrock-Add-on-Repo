//@ts-check
/**
 * Beta Chat Commands for Wither Alert Addon
 * TODO: User Form for some of this
 */
import { world, system, Player, Entity, ChatSendBeforeEvent, ChatSendAfterEvent, GameMode } from "@minecraft/server";
import { dev,  pack } from './settings.js';
import { MinecraftEffectTypes } from './commonLib/vanillaData.js';
import { ScoreboardLib } from "./commonLib/scoreboardClass.js";
import { Vector3Lib } from "./commonLib/vectorClass.js";
import { BiomeLib } from "./commonLib/biomeLib.js";

const cmdList = [
    'cls', '?', 'help' ];
//==============================================================================
/**
 * 
 * @param {ChatSendBeforeEvent} event 
 */
export function chatSend_before_fn (event) {

    if (!(event.sender instanceof Player) ||
        !event.sender.isOp() ||
        !event.message.toLowerCase().startsWith(pack.commandPrefix)) return;

    let command = event.message.toLowerCase().replace(pack.commandPrefix, '').trim().replace("  ", ' ');
    if (cmdList.includes(command)) {
        event.cancel;
        processCommand(event.sender, command);
    }
}
//==============================================================================
/**
 * 
 * @param {Player} player 
 * @param {string} command 
 * @returns 
 */
function processCommand (player, command) {

    //TODO: add hunter tag and give night vision and breathing and stuff....   

    if ([ "?", "help" ].includes(command)) {
        commandList(player);
        return;
    }
    if (command === "cls") {
        player.sendMessage(`${'\n'.repeat(40)}`);
        return;
    }

    if (command === "biomes") {
        system.runTimeout(()=>{
            const biomes = BiomeLib.getCurrentBiomeList(player)
            player.sendMessage(`Biomes: ${biomes.replaceAll(',',', ')}`);

        },4)
        return;
    }

    if (command.startsWith('debug ')) {
        
        return;
    }

    if (command.startsWith('sb ')) {

        if (command === 'sb hide') { ScoreboardLib.sideBar_clear(); return; }

        if (dev.debugScoreboard) {
            if (command === 'sb reset') { ScoreboardLib.setZeroAll(dev.debugScoreboardName); return; }
            if (command === 'sb debug') {                
                ScoreboardLib.sideBar_set(dev.debugScoreboardName);
                return;
            }
        }

        player.sendMessage('§cCommand cannot run because associated Debug Mode is not on');
        return;
    }

    player.sendMessage('§cCommand cannot run because associated Debug Mode is not on');
}
//==============================================================================
function ifNoReasonForScoreBoardToShow () {
    if (!(dev.debugEntityActivity || dev.debugEntityAlert || dev.debugGamePlay))
        ScoreboardLib.sideBar_clear();
}
//==============================================================================
/**
 * 
 * @param {Player} player 
 */
function commandList (player) {

    if (player.isOp()) {
        const cmds = cmdList.sort();
        player.sendMessage(`\n\n${pack.packName} Commands`);
        cmds.forEach(cmd => player.sendMessage(cmd));
    }
}
//==============================================================================
/**
 * 
 * @param {Entity} entity 
 * @param {string} trigger 
 */
function eventTrigger (entity, trigger) {
    if (entity.isValid())
        system.runTimeout(() => {
            system.run(() => { entity.triggerEvent(trigger); });
        }, 1);
}
