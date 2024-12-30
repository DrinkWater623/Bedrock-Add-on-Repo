//@ts-check
/**
 * Beta Chat Commands for Wither Alert Addon
 * TODO: User Form for some of this
 */
import { world, system, Player, Entity, ChatSendBeforeEvent, ChatSendAfterEvent, GameMode } from "@minecraft/server";
import { dev, entityEvents, pack, watchFor } from './settings.js';
import { counts, stalledEntityCheckAndFix } from "./fn-stable.js";
import { MinecraftEffectTypes } from './common-data/vanillaData.js';
import { ScoreboardLib } from "./common-stable/scoreboardClass.js";
import { Vector3Lib } from "./common-stable/vectorClass.js";
import { BiomeLib } from "./common-beta/biomeLib.js";
//==============================================================================
const cmdList = [
    'cls', 'count','biomes',
    'debug gp', 'debug alert', 'debug activity',
    "replace all",
    "reset log",
    "reset leaves",
    "reset nature",
    "reset web","reset expand",
    'reset wander',
    'sb reset', 'sb show', 'sb hide',
    'sb load', 'sb spawn', 'sb monitor', 'sb debug',
    'stalled', 'stats',
    'tp ts', 'tp all ts',
    'tp me', 'tp me far', 'tp me egg', 'tp me egg far',
    'kill', '?', 'help' ];
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
        if (command === "debug gp") {
            dev.debugGamePlay = !dev.debugGamePlay;
            player.sendMessage(`debugGamePlay is now ${dev.debugGamePlay ? '§aON' : '§cOFF'}`);
            ifNoReasonForScoreBoardToShow();
            return;
        }

        if (command === "debug alert") {
            dev.debugEntityAlert = !dev.debugEntityAlert;
            player.sendMessage(`debugEntityAlert is now ${dev.debugEntityAlert ? '§aON' : '§cOFF'}`);
            ifNoReasonForScoreBoardToShow();
            return;
        }
        if (command === "debug activity") {
            dev.debugEntityActivity = !dev.debugEntityActivity;
            player.sendMessage(`debugEntityActivity is now ${dev.debugEntityActivity ? '§aON' : '§cOFF'}`);
            ifNoReasonForScoreBoardToShow();
            return;
        }

        return;
    }

    if (command.startsWith('sb ')) {

        if (command === 'sb hide') { ScoreboardLib.sideBar_clear(); return; }

        if (dev.debugScoreboard) {
            if (command === 'sb reset') { ScoreboardLib.setZeroAll(dev.debugScoreboardName); return; }
            if (command === 'sb debug') {
                counts(true);
                ScoreboardLib.sideBar_set(dev.debugScoreboardName);
                return;
            }
        }

        if (dev.debugLoadAndSpawn) {
            if (command === 'sb load') { ScoreboardLib.sideBar_set(watchFor.scoreboardName + '_load_tick'); return; }
            if (command === 'sb spawn') { ScoreboardLib.sideBar_set(watchFor.scoreboardName + '_spawn_tick'); return; }
            if (command === 'sb monitor') { ScoreboardLib.sideBar_set(watchFor.scoreboardName); return; }
        }

        player.sendMessage('§cCommand cannot run because associated Debug Mode is not on');
        return;
    }
    const entities_all = world.getDimension("overworld").getEntities({ type: watchFor.typeId });

    if (entities_all.length === 0) {
        player.sendMessage(`§cNo Loaded ${watchFor.display}s to Count`);
        return;
    }
    else {

        const entities_eggs = world.getDimension("overworld").getEntities({ type: watchFor.egg_typeId });

        if (command === "kill eggs") {
            player.sendMessage(`§aCommand to kill loaded ${watchFor.display}s eggs sent`);
            entities_eggs.forEach(e => { eventTrigger(e, entityEvents.despawnEventName); });
            return;
        }

        if (command === "kill") {
            player.sendMessage(`§aCommand to kill loaded ${watchFor.display}s sent`);
            entities_all.forEach(e => { eventTrigger(e, entityEvents.despawnEventName); });
            entities_eggs.forEach(e => { eventTrigger(e, entityEvents.despawnEventName); });
            return;
        }

        const entities = entities_all.filter(e => { return !e.hasComponent('minecraft:is_baby'); });


        if (command === "stats") {
            let msg = '=====================';
            entities.forEach(e => {
                let markVar = e.getComponent('minecraft:mark_variant')?.value;
                if (typeof markVar == 'undefined') markVar=-1
                
                const inBlock = e.dimension.getBlock(e.location)?.typeId || '?'
                msg += `\n==> ${e.nameTag || e.id} @ ${Vector3Lib.toString(e.location, 0, true)} - mv=${markVar} - in block ${inBlock}`;
            });
            player.sendMessage(msg);
            return;
        }


        if (entities.length === 0) {
            player.sendMessage(`§cNo Loaded Adult ${watchFor.display}s`);
            return;
        }

        if (command === "count") {
            player.sendMessage(`§aUpdating Counts for ${watchFor.display}s`);
            counts(true);
            return;
        }

        if (command === "stalled") {
            player.sendMessage(`§aChecking for Stalled ${watchFor.display}s`);
            stalledEntityCheckAndFix();
            return;
        }

        if (command.startsWith('reset ')) { //not really needed after initial testing

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


            if (command === "reset leaves") {
                player.sendMessage(`§aReset loaded ${watchFor.display}s to look for nearest leaves`);
                entities.forEach(e => { eventTrigger(e, 'look_for_leaves_nearest_start'); });
                return;
            }

            if (command === "reset nature") {
                player.sendMessage(`§aReset loaded ${watchFor.display}s to look for nearest nature`);
                entities.forEach(e => { eventTrigger(e, 'look_for_nature_nearest_start'); });
                return;
            }


            if (command === "reset web") {
                player.sendMessage(`§aReset loaded ${watchFor.display}s to look for nearest web`);
                entities.forEach(e => { eventTrigger(e, 'look_for_web_nearest_start'); });
                return;
            }
            if (command === "reset expand") {
                player.sendMessage(`§aReset loaded ${watchFor.display}s to expand web`);
                entities.forEach(e => { eventTrigger(e, 'expand_web'); });
                return;
            }

            if (command === "reset wander") {
                player.sendMessage(`§aReset loaded ${watchFor.display}s to wander`);
                entities.forEach(e => { eventTrigger(e, 'wander_around_start'); });
                return;
            }
        }

        if (command.startsWith('tp ')) {

            if (entities_eggs.length > 0 && command === 'tp me egg far') {
                player.sendMessage(`§cTP-ing you to the closest ${watchFor.display}`);
                system.runTimeout(() => {
                    const gm = player.getGameMode();
                    if ([ GameMode.adventure, GameMode.survival ].includes(gm)) {
                        player.addEffect(MinecraftEffectTypes.Slow_Falling, 200, { amplifier: 255, showParticles: true });
                        player.addEffect(MinecraftEffectTypes.Invisibility, 2400, { amplifier: 255, showParticles: true });
                    }
                    player.teleport(entities_eggs[ entities_eggs.length - 1 ].location);
                }, 10);
                return;
            }

            if (entities_eggs.length > 0 && command === 'tp me egg') {
                player.sendMessage(`§cTP-ing you to the closest ${watchFor.display}`);
                system.runTimeout(() => {
                    const gm = player.getGameMode();
                    if ([ GameMode.adventure, GameMode.survival ].includes(gm)) {
                        player.addEffect(MinecraftEffectTypes.Slow_Falling, 200, { amplifier: 255, showParticles: true });
                        player.addEffect(MinecraftEffectTypes.Invisibility, 2400, { amplifier: 255, showParticles: true });
                    }
                    player.teleport(entities_eggs[ 0 ].location);
                }, 10);
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
                    player.teleport(entities[ 0 ].location);
                }, 10);
                return;
            }

            if (command === 'tp me far') {
                player.sendMessage(`§cTP-ing you to the closest ${watchFor.display}`);
                system.runTimeout(() => {
                    const gm = player.getGameMode();
                    if ([ GameMode.adventure, GameMode.survival ].includes(gm)) {
                        player.addEffect(MinecraftEffectTypes.Slow_Falling, 200, { amplifier: 255, showParticles: true });
                        player.addEffect(MinecraftEffectTypes.Invisibility, 2400, { amplifier: 255, showParticles: true });
                    }
                    player.teleport(entities[ entities.length - 1 ].location);
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

            return;
        }
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
