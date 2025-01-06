//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
/**
 * Beta Chat Commands for Wither Alert Addon
 * TODO: User Form for some of this
 */
import { world, system, Player, ChatSendBeforeEvent, ChatSendAfterEvent } from "@minecraft/server";
import { watchFor, gamePlay, dev, pack } from './settings.js';
import { Entities } from './common-stable/entityClass.js';
import { MinecraftEffectTypes } from './common-data/vanilla-data.js';
//==============================================================================
/**
 * 
 * @param {ChatSendBeforeEvent} event 
 */
export function chatSend_before_fn (event) {

    if (!(event.sender instanceof Player)) return;

    if (event.message.toLowerCase().startsWith(gamePlay.commandPrefix)) {
        event.cancel;
        if (dev.debugGamePlay) event.sender.sendMessage(`§9Processing ${pack.packName} Chat Command (before)`);

        let command = event.message.toLowerCase().replace(gamePlay.commandPrefix, '').trim().replace("  ", ' ');
        processCommand(event.sender, command);
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
        if (dev.debugGamePlay) event.sender.sendMessage(`§9Processing ${pack.packName} Command (after)`);

        let command = event.message.toLowerCase().replace(gamePlay.commandPrefix, '').trim().replace("  ", ' ');
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

    if ([ "?", "cmd", "cmds", "help", "commands", "command" ].includes(command)) {
        commandList(player);
        return;
    }
    if (command === "cls") {
        player.sendMessage(`${'\n'.repeat(40)}`);
        return;
    }
    if (command === "boosts on" && player.isOp() && !gamePlay.boostsAllowed) {
        gamePlay.boostsAllowed = true;
        world.sendMessage(`§6${watchFor.display} Hunting Boosts are now §aON`);
        return;
    }
    if (command === "boosts off" && player.isOp() && gamePlay.boostsAllowed) {
        gamePlay.boostsAllowed = false;
        world.sendMessage(`§6${watchFor.display} Hunting Boosts are now §cOFF`);
        return;
    }

    if (world.getDynamicProperty('isEntityAlive')) {

        if (command === "boost me") {
            if (gamePlay.boostsAllowed) {
                //add boost time
                //add boosts allowed

                const tickTime = watchFor.boostTicks;
                player.addEffect(MinecraftEffectTypes.NightVision, tickTime, { amplifier: 255, showParticles: false });
                player.addEffect(MinecraftEffectTypes.Invisibility, tickTime, { amplifier: 255, showParticles: false });
                player.addEffect(MinecraftEffectTypes.InstantHealth, tickTime, { amplifier: 255, showParticles: false });
                player.addEffect(MinecraftEffectTypes.Saturation, tickTime, { amplifier: 255, showParticles: false });
                player.addEffect(MinecraftEffectTypes.Speed, tickTime, { amplifier: 255, showParticles: false });
                player.addEffect(MinecraftEffectTypes.Fire_Resistance, tickTime, { amplifier: 255, showParticles: false });

                //player.addEffect(MinecraftEffectTypes.Slow_Falling,  tickTime, { amplifier: 255, showParticles: false });
                //player.getEffects();
                return;
            }
            else player.sendMessage("§cBoosts Are not Allowed right now, an OP has to turn it on.");
        }

        if (command === "kill" && player.isOp()) {
            world.sendMessage(`§aCommand to kill ${watchFor.display}s sent`);
            Entities.killLoop(watchFor.family);
            return;
        }

        if (command === `tp 1 ${watchFor.display.toLowerCase()} 2 me`) {
            player.sendMessage(`§ctp-ing the ${watchFor.display}s to you`);
            system.runTimeout(() => {
                player.dimension.runCommand(`tp @e[family=${watchFor.family},c=1] @s`);
            }, 20);
            return;
        }

        if (command === `tp all ${watchFor.display.toLowerCase()}s 2 me`) {
            player.sendMessage(`§ctp-ing the ${watchFor.display}s to you`);
            system.runTimeout(() => {
                player.dimension.runCommand(`tp @e[family=${watchFor.family}] @s`);
            }, 20);
            return;
        }

        if (command === `tp me 2 ${watchFor.display.toLowerCase()}`) {
            player.sendMessage(`§ctp-ing you to the closest ${watchFor.display}`);
            system.runTimeout(() => {
                player.addEffect(MinecraftEffectTypes.Slow_Falling, 200, { amplifier: 255, showParticles: true });
                if (!gamePlay.boostsAllowed) { }
                player.sendMessage(`message`);
                player.addEffect(MinecraftEffectTypes.Invisibility, 2400, { amplifier: 255, showParticles: true });
                player.dimension.runCommand(`tp @s @e[c=1,family=${watchFor.family}]`);
            }, 20);
            return;
        }

        if (command === "grief off" && world.gameRules.mobGriefing) {
            system.runTimeout(() => { world.gameRules.mobGriefing = false; }, 10);
            world.sendMessage(`§aMob Griefing Turned off by ${player.id} due to an active ${watchFor.display}`);
            return;
        }
    }

    if (command === "grief on" && !world.gameRules.mobGriefing) {
        system.runTimeout(() => { world.gameRules.mobGriefing = true; }, 10);
        world.sendMessage(`§aMob Griefing turned back on by ${player.id}`);
        if (world.getDynamicProperty('isEntityAlive')) player.sendMessage(`§6Beware, there is still an active ${watchFor.display}`);
        return;
    }

    if (command.startsWith("interval")) {

        command.replace("interval", '').trim();

        let parm = command.replace("interval", '').trim();

        if (parm.includes('?')) {

            player.sendMessage(`§bInterval for Location Messages is ${gamePlay.intervalTimer} ticks or ${gamePlay.intervalTimer / 20} seconds)`);
            return;
        }

        parm.replace(" ", "")
            .replace("second", 's')
            .replace("minute", 'm')
            .replace("hr", 'h')
            .replace("sec", 's')
            .replace("min", 'm')
            .replace("tick", 't')
            .replace("hour", 'h');

        let multiplier = 1;
        let add = false;
        let minus = false;

        if (parm.includes('h')) { multiplier = 60; parm = parm.replace('h', '').trim(); }
        if (parm.includes('m')) { multiplier = 60; parm = parm.replace('m', '').trim(); }
        if (parm.includes('s')) { multiplier = 20; parm = parm.replace('s', '').trim(); }
        if (parm.includes('t')) { multiplier = 1; parm = parm.replace('t', '').trim(); }
        if (parm.startsWith('-')) { minus = true; parm = parm.replace('-', ''); }
        if (parm.startsWith('+')) { add = true; parm = parm.replace('+', ''); }

        if (!Number.isNaN(parm)) {

            let n = Number(parm);
            n *= multiplier;
            if (add) gamePlay.intervalTimer += n;
            else if (minus) gamePlay.intervalTimer -= n;
            else gamePlay.intervalTimer = n;

            if (gamePlay.intervalTimer < gamePlay.intervalMin) {
                gamePlay.intervalTimer = gamePlay.intervalMin;
                player.sendMessage(`§cInterval cannot go below ${gamePlay.intervalMin} ticks`);
            }
            if (gamePlay.intervalTimer > gamePlay.intervalMax) {
                gamePlay.intervalTimer = gamePlay.intervalMax;
                player.sendMessage(`§cInterval cannot go above ${gamePlay.intervalMax} ticks = ${gamePlay.intervalMax / 20} seconds = ${gamePlay.intervalMax / (20 * 60)} minutes`);
            }
            player.sendMessage(`Interval for Location Messages is §anow ${gamePlay.intervalTimer} ticks or ${gamePlay.intervalTimer / 20} seconds)`);
        }
        else {
            player.sendMessage("§cInvalid Interval - must equate to a number.  Can use +/- to adjust and end with s/m/h t is default if not indicated");
        }
        return;
    }

    world.sendMessage(`§cInvalid Command -> ${gamePlay.commandPrefix} ${command}`);
    commandList(player);
}
/**
 * 
 * @param {Player} player 
 */
function commandList(player){
    world.sendMessage(`\n\n${pack.packName} Commands`);
    if (gamePlay.boostsAllowed) {
        player.sendMessage(`* boosts me - applies temporary effects when there are ${watchFor.display}s`);
    }
    if (player.isOp()) {
        player.sendMessage(`* boosts off - OP only`);
        player.sendMessage(`* boosts on - OP only`);
    }
    world.sendMessage(`* cls - clear chat screen`);
    if (player.isOp()) { player.sendMessage(`* kill - OP only - kill all the ${watchFor.display}s`); }
    world.sendMessage(`* grief off - can only work when there are ${watchFor.display}s`);
    world.sendMessage(`* grief on`);
    world.sendMessage(`* interval ? - get current time between alerts`);
    world.sendMessage(`* interval [-/+]# <t/s/m/h> - adjust/reset current time between alerts`);
    //I have it more spelled out, so there is no mistake in wanted action
    world.sendMessage(`* tp all ${watchFor.display.toLowerCase()}s 2 me - tp them all to you`);
    world.sendMessage(`* tp 1 ${watchFor.display.toLowerCase()} 2 me - tp them all to you`);
    world.sendMessage(`* tp me 2 ${watchFor.display.toLowerCase()} - tp you to closet one`);
}
