//@ts-check
/**
 * Beta Chat Commands for Wither Alert Addon
 * TODO: User Form for some of this
 */
import { world, system, Player, ChatSendBeforeEvent, ChatSendAfterEvent, GameMode } from "@minecraft/server";
import { gamePlay, dev, pack, watchFor } from './settings.js';
//import { EntityLib } from './commonLib/entityClass.js';
import { MinecraftEffectTypes } from './commonLib/vanillaData.js';
import { worldRun } from "./commonLib/runCommandClass.js";
import { ScoreboardLib } from "./commonLib/scoreboardClass.js";
//import { ScoreboardLib } from "./commonLib/scoreboardClass.js";
//==============================================================================
/**
 * 
 * @param {ChatSendBeforeEvent} event 
 */
export function chatSend_before_fn (event) {

    if (!(event.sender instanceof Player)) return;

    if (event.message.toLowerCase().startsWith(gamePlay.commandPrefix)) {

        let command = event.message.toLowerCase().replace(gamePlay.commandPrefix, '').trim().replace("  ", ' ');
        if ([ 'cls', 'debug gp', 'debug ea', 'sb reset', 'sb show', 'sb hide', 'tp ts', 'tp me', 'kill', 'sb remake' ].includes(command)) {
            event.cancel;
            if (dev.debugGamePlay) event.sender.sendMessage(`§9Processing ${pack.packName} Chat Command (before)`);
            processCommand(event.sender, command);
        }
    }
}
//==============================================================================
/**
 * 
 * @param {ChatSendAfterEvent} event 
 */
export function chatSend_after_fn (event) {

    if (!(event.sender instanceof Player)) return;

    //TODO: maybe some boosts

    if (event.message.toLowerCase().startsWith(gamePlay.commandPrefix)) {

        let command = event.message.toLowerCase().replace(gamePlay.commandPrefix, '').trim().replace("  ", ' ');
        if ([ "?", "help" ].includes(command)) {
            if (dev.debugGamePlay) event.sender.sendMessage(`§9Processing ${pack.packName} Command (after)`);
            processCommand(event.sender, command);
        }
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

    if (command === "debug gp") {
        dev.debugGamePlay = !dev.debugGamePlay;
        player.sendMessage(`debugGamePlay is now ${dev.debugGamePlay ? '§aON' : '§cOFF'}`);
        return;
    }

    if (command === "debug ea") {
        dev.debugEntityAlert = !dev.debugEntityAlert;
        player.sendMessage(`debugEntityAlert is now ${dev.debugEntityAlert ? '§aON' : '§cOFF'}`);
        return;
    }

    if (player.isOp()) {

        if (command === "kill") {
            player.sendMessage(`§aCommand to kill ${watchFor.display}s sent`);
            worldRun('kill @e[family=tree_spider]');
            //EntityLib.killLoop(watchFor.family);
            return;
        }

        if (command === 'tp me') {
            player.sendMessage(`§cTP-ing you to the closest ${watchFor.display}`);
            system.runTimeout(() => {
                const gm = player.getGameMode();
                if ([ GameMode.adventure, GameMode.survival ].includes(gm)) {
                    player.addEffect(MinecraftEffectTypes.Slow_Falling, 200, { amplifier: 255, showParticles: true });
                    player.addEffect(MinecraftEffectTypes.Invisibility, 2400, { amplifier: 255, showParticles: true });
                }
                player.dimension.runCommand(`tp @s @e[c=1,family=${watchFor.family}]`);
            }, 2);
            return;
        }

        if (command === 'tp ts') {
            player.sendMessage(`§cTP-ing closest ${watchFor.display} to you`);
            system.runTimeout(() => {
                player.dimension.runCommand(`tp @e[c=1,family=${watchFor.family}] @s`);
            }, 5);
            return;
        }
    }

    if (command === 'sb reset') { ScoreboardLib.setZeroAll(dev.debugScoreboardName); return; }
    if (command === 'sb show') { ScoreboardLib.sideBar_set(dev.debugScoreboardName); return; }
    if (command === 'sb hide') { ScoreboardLib.sideBar_clear(); return; }
    if (command === 'sb remake') {

        system.runInterval(() => {
            ScoreboardLib.delete(dev.debugScoreboardName);
            system.runInterval(() => {
                ScoreboardLib.create(dev.debugScoreboardName, dev.debugScoreboardDisplayName);
                system.runInterval(() => {
                    ScoreboardLib.sideBar_set(dev.debugScoreboardName);
                }, 1);
            }, 1);
        }, 1);

    }

    player.sendMessage(`§cInvalid Command -> ${gamePlay.commandPrefix} ${command}`);
    commandList(player);
}
/**
 * 
 * @param {Player} player 
 */
function commandList (player) {
    world.sendMessage(`\n\n${pack.packName} Commands`);
    world.sendMessage(`* cls - clear chat screen`);
    if (player.isOp()) { player.sendMessage(`* kill - OP only - kill all the ${watchFor.display}s`); }
}
