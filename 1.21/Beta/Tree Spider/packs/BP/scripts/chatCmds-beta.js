//@ts-check
/**
 * Beta Chat Commands for Wither Alert Addon
 * TODO: User Form for some of this
 */
import { world, system, Player, Entity, ChatSendBeforeEvent, ChatSendAfterEvent, GameMode } from "@minecraft/server";
import { gamePlay, dev, pack, watchFor } from './settings.js';
import { MinecraftEffectTypes } from './commonLib/vanillaData.js';
import { ScoreboardLib } from "./commonLib/scoreboardClass.js";
import { counts } from "./fn-stable.js";
const cmdList = [
    'cls', 'count',
    'debug gp', 'debug alert', 'debug activity',
    "replace all",
    "reset log",
    "reset log random",
    "reset leaves",
    "reset leaves random",
    "reset nature",
    "reset nature random",
    "reset web",
    "reset web random",
    'reset wander',
    'sb reset', 'sb show', 'sb hide',
    'sb load', 'sb spawn', 'sb monitor', 'sb debug',
    'tp ts', 'tp all ts',
    'tp me',
    'kill', '?', 'help' ];
//==============================================================================
/**
 * 
 * @param {ChatSendBeforeEvent} event 
 */
export function chatSend_before_fn (event) {

    if (!(event.sender instanceof Player)) return;

    if (event.message.toLowerCase().startsWith(gamePlay.commandPrefix)) {
        let command = event.message.toLowerCase().replace(gamePlay.commandPrefix, '').trim().replace("  ", ' ');
        if (cmdList.includes(command)) {
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
// export function chatSend_after_fn (event) {

//     if (!(event.sender instanceof Player)) return;

//     if (event.message.toLowerCase().startsWith(gamePlay.commandPrefix)) {

//         let command = event.message.toLowerCase().replace(gamePlay.commandPrefix, '').trim().replace("  ", ' ');
//         if ([ "?", "help" ].includes(command)) {
//             if (dev.debugGamePlay) event.sender.sendMessage(`§9Processing ${pack.packName} Command (after)`);
//             processCommand(event.sender, command);
//         }
//     }
// }
//==============================================================================
/**
 * 
 * @param {Player} player 
 * @param {string} command 
 * @returns 
 */
function processCommand (player, command) {

    //TODO: add hunter tag and give night vision and breathing and stuff....
    counts(true);

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

    if (command === "debug alert") {
        dev.debugEntityAlert = !dev.debugEntityAlert;
        player.sendMessage(`debugEntityAlert is now ${dev.debugEntityAlert ? '§aON' : '§cOFF'}`);
        return;
    }
    if (command === "debug activity") {
        dev.debugEntityActivity = !dev.debugEntityActivity;
        player.sendMessage(`debugEntityActivity is now ${dev.debugEntityActivity ? '§aON' : '§cOFF'}`);
        return;
    }

    if (player.isOp()) {

        const entities_all = world.getDimension("overworld").getEntities({ type: watchFor.typeId });

        //system.run(() => { dev.debugScoreboard?.setScore("spiders", entities_all.length); });

        if (entities_all.length === 0) {
            player.sendMessage(`§cNo Loaded entity=${watchFor.display}`);            
            return;
        }


        if (command === "kill") {
            player.sendMessage(`§aCommand to kill loaded ${watchFor.display}s sent`);
            entities_all.forEach(e => { eventTrigger(e, watchFor.despawnEventName); });
            return;
        }

        const entities = entities_all.filter(e => { return !e.hasComponent('minecraft:is_baby'); });
        //system.run(() => { dev.debugScoreboard?.setScore("adult spiders", entities.length); });

        if (entities.length === 0) {
            player.sendMessage(`§cNo Loaded Adult entity=${watchFor.display}`);
            //system.run(() => { dev.debugScoreboard?.setScore("baby spiders", entities_all.length); });
            return;
        }

        //system.run(() => { dev.debugScoreboard?.setScore("baby spiders", entities_all.length - entities.length); });

        if (command === "count") {
            player.sendMessage(`§aUpdating Counts for ${watchFor.display}s`);
            // let webCount = 0;
            // entities.forEach(e => {
            //     const myWebs = e.getDynamicProperty('webs');
            //     if (typeof myWebs == 'number') webCount += myWebs;
            // });
            // system.run(() => { dev.debugScoreboard?.setScore('webs', webCount); });
            return;
        }

        if (command === "replace all") {
            player.sendMessage(`§aCommand to kill loaded ${watchFor.display}s sent`);
            entities.forEach(e => { eventTrigger(e, 'replace_me'); });
            return;
        }
        if (command === "reset log") {
            player.sendMessage(`§aReset loaded ${watchFor.display}s to look for nearest log`);
            entities.forEach(e => { eventTrigger(e, 'look_for_log_nearest_start'); });
            return;
        }

        if (command === "reset log random") {
            player.sendMessage(`§aReset loaded ${watchFor.display}s to look for random log`);
            entities.forEach(e => { eventTrigger(e, 'look_for_log_random_start'); });
            return;
        }

        if (command === "reset leaves") {
            player.sendMessage(`§aReset loaded ${watchFor.display}s to look for nearest leaves`);
            entities.forEach(e => { eventTrigger(e, 'look_for_leaves_nearest_start'); });
            return;
        }

        if (command === "reset leaves random") {
            player.sendMessage(`§aReset loaded ${watchFor.display}s to look for random leaves`);
            entities.forEach(e => { eventTrigger(e, 'look_for_leaves_random_start'); });
            return;
        }
        if (command === "reset nature") {
            player.sendMessage(`§aReset loaded ${watchFor.display}s to look for nearest nature`);
            entities.forEach(e => { eventTrigger(e, 'look_for_nature_nearest_start'); });
            return;
        }

        if (command === "reset nature random") {
            player.sendMessage(`§aReset loaded ${watchFor.display}s to look for random nature`);
            entities.forEach(e => { eventTrigger(e, 'look_for_nature_random_start'); });
            return;
        }

        if (command === "reset web") {
            player.sendMessage(`§aReset loaded ${watchFor.display}s to look for nearest web`);
            entities.forEach(e => { eventTrigger(e, 'look_for_web_nearest_start'); });
            return;
        }

        if (command === "reset web random") {
            player.sendMessage(`§aReset loaded ${watchFor.display}s to look for random web`);
            entities.forEach(e => { eventTrigger(e, 'look_for_web_random_start'); });
            return;
        }

        if (command === "reset wander") {
            player.sendMessage(`§aReset loaded ${watchFor.display}s to wander`);
            entities.forEach(e => { eventTrigger(e, 'wander_around_start'); });
            return;
        }

        if (command.startsWith('tp ')) {

            if (command === 'tp me') {
                player.sendMessage(`§cTP-ing you to the closest ${watchFor.display}`);
                system.runTimeout(() => {
                    const gm = player.getGameMode();
                    if ([ GameMode.adventure, GameMode.survival ].includes(gm)) {
                        player.addEffect(MinecraftEffectTypes.Slow_Falling, 200, { amplifier: 255, showParticles: true });
                        player.addEffect(MinecraftEffectTypes.Invisibility, 2400, { amplifier: 255, showParticles: true });
                    }
                    player.teleport(entities[ 0 ].location);
                }, 10);
                return;
            }

            if (command === 'tp ts') {
                player.sendMessage(`§cTP-ing a ${watchFor.display} to you`);
                system.runTimeout(() => {
                    entities[ Math.trunc(entities.length / 2) ].teleport(player.location);
                }, 10);
                return;
            }

            if (command === 'tp all ts') {
                player.sendMessage(`§cTP-ing a ${watchFor.display} to you`);
                system.runTimeout(() => {
                    entities.forEach(e => { e.teleport(player.location); });
                }, 10);
                return;
            }
        }
    }

    if (command === 'sb reset') { ScoreboardLib.setZeroAll(dev.debugScoreboardName); return; }
    if (command === 'sb show') { ScoreboardLib.sideBar_set(dev.debugScoreboardName); return; }
    if (command === 'sb hide') { ScoreboardLib.sideBar_clear(); return; }
    // if (command === 'sb remake') {

    //     system.runInterval(() => {
    //         ScoreboardLib.delete(dev.debugScoreboardName);
    //         system.runInterval(() => {
    //             ScoreboardLib.create(dev.debugScoreboardName, dev.debugScoreboardDisplayName);
    //             system.runInterval(() => {
    //                 ScoreboardLib.sideBar_set(dev.debugScoreboardName);
    //             }, 1);
    //         }, 1);
    //     }, 1);

    // }


    if (command === 'sb debug') { ScoreboardLib.sideBar_set(dev.debugScoreboardName); return; }
    if (command === 'sb load') { ScoreboardLib.sideBar_set(watchFor.scoreboardName + '_load_tick'); return; }
    if (command === 'sb spawn') { ScoreboardLib.sideBar_set(watchFor.scoreboardName + '_spawn_tick'); return; }
    if (command === 'sb monitor') { ScoreboardLib.sideBar_set(watchFor.scoreboardName); return; }
    // 'sb load', 'sb spawn', 'sb monitor', 'sb debug'

    player.sendMessage(`§cInvalid Command -> ${gamePlay.commandPrefix} ${command}`);
    commandList(player);
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
            system.run(() => { entity.triggerEvent('look_for_web_random_start'); });
        }, 1);
}
