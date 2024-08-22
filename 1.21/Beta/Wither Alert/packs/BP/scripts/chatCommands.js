import { world, system, Player, MinecraftEffectTypes } from "@minecraft/server";
import * as gVar from './globalVars.js';
import * as fn from './functions.js';
import * as wf from './WatchFor.js';
//import { MinecraftEffectTypes } from "@minecraft/vanilla-data";
//When chatSend comes out of Beta, move this to where it should be

//==============================================================================
//This is still in beta, so cannot use it for Stable Add-On
export function chatSend_before () {
    if (gVar.debug) world.sendMessage("§dInstalling beforeEvents.chatSend");

    world.beforeEvents.chatSend.subscribe((event) => {
        const player = event.sender;
        if (!(player instanceof Player)) return;

        world.sendMessage(`${player.isOp}`); //to change settings
        //TODO maybe some boosts

        if (event.message.toLowerCase().startsWith(gVar.watchFor.commandPrefix)) {
            player.sendMessage("§9Processing Command");
            let command = event.message.toLowerCase().replace(gVar.watchFor.commandPrefix, '').trim().replace("  ", ' ');

            //TODO: add hunter tag and give night vision and breathing and stuff....

            if (command === "cls") {                
                fn.spamEmptyLines(40, player);
                return;
            }
            if (command === "boosts on" && player.isOp() && !gVar.watchFor.boostsAllowed) {
                gVar.watchFor.boostsAllowed = true;
                world.sendMessage(`§6${gVar.watchFor.display} Hunting Boosts are now §aON`);
                return;
            }
            if (command === "boosts off" && player.isOp() && gVar.watchFor.boostsAllowed) {
                gVar.watchFor.boostsAllowed = false;
                world.sendMessage(`§6${gVar.watchFor.display} Hunting Boosts are now §cOFF`);
                return;
            }

            if (world.getDynamicProperty(gVar.watchFor.dynamicPropertyName)) {

                if (command === "boost me") {
                    if (gVar.watchFor.boostsAllowed) {
                        //add boost time
                        //add boosts allowed
                        event.cancel;
                        const tickTime = gVar.watchFor.boostTicks;
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
                    else player.sendMessage("§cBoosts Are not Allowed right now, an OP has to turn it on.")
                }
                
                if (command === "kill" && player.isOp()) {
                    event.cancel;
                    player.sendMessage(`§aCommand to kill ${gVar.watchFor.display}s sent`);
                    fn.killLoop(wf.watchFor.family);
                    return;
                }

                if (command === "tp2me") {
                    event.cancel;
                    player.sendMessage(`§ctp-ing the ${gVar.watchFor.display}s to you`);
                    system.runTimeout(() => {
                        player.dimension.runCommand(`tp @e[family=${gVar.watchFor.family}] @s`);
                    }, 20);
                    return;
                }

                if (command === "tpme") {
                    event.cancel;
                    player.sendMessage(`§ctp-ing you to the closest ${gVar.watchFor.display}s`);
                    system.runTimeout(() => {                        
                        player.addEffect(MinecraftEffectTypes.Slow_Falling,  200, { amplifier: 255, showParticles: true });
                        if (!gVar.watchFor.boostsAllowed) {}
                            player.sendMessage(`message`)
                        player.addEffect(MinecraftEffectTypes.Invisibility, 2400, { amplifier: 255, showParticles: true });
                        player.dimension.runCommand(`tp @s @e[c=1,family=${gVar.watchFor.family}]`);
                    }, 20);
                    return;
                }

                if (command === "grief off" && world.gameRules.mobGriefing) {
                    event.cancel;
                    system.runTimeout(() => { world.gameRules.mobGriefing = false; }, 10);
                    world.sendMessage(`§aMob Griefing Turned off by ${player.id} due to an active ${gVar.watchFor.display}`);
                    return;
                }
            }

            if (command === "grief on" && !world.gameRules.mobGriefing) {
                event.cancel;
                system.runTimeout(() => { world.gameRules.mobGriefing = true; }, 10);
                world.sendMessage(`§aMob Griefing turned back on by ${player.id}`);
                if (world.getDynamicProperty(gVar.watchFor.dynamicPropertyName)) player.sendMessage(`§6Beware, there is still an active ${gVar.watchFor.display}`);
                return;
            }

            if (command.startsWith("interval")) {

                command.replace("interval", '').trim();

                let parm = command.replace("interval", '').trim();

                if (parm.includes('?')) {
                    event.cancel;
                    player.sendMessage(`§bInterval for Location Messages is ${gVar.watchFor.intervalTimer} ticks or ${gVar.watchFor.intervalTimer / 20} seconds)`);
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
                    event.cancel;
                    let n = Number(parm);
                    n *= multiplier;
                    if (add) gVar.watchFor.intervalTimer += n;
                    else if (minus) gVar.watchFor.intervalTimer -= n;
                    else gVar.watchFor.intervalTimer = n;

                    if (gVar.watchFor.intervalTimer < gVar.watchFor.intervalMin) {
                        gVar.watchFor.intervalTimer = gVar.watchFor.intervalMin;
                        player.sendMessage(`§cInterval cannot go below ${gVar.watchFor.intervalMin} ticks`);
                    }
                    if (gVar.watchFor.intervalTimer > gVar.watchFor.intervalMax) {
                        gVar.watchFor.intervalTimer = gVar.watchFor.intervalMax;
                        player.sendMessage(`§cInterval cannot go above ${gVar.watchFor.intervalMax} ticks = ${gVar.watchFor.intervalMax / 20} seconds = ${gVar.watchFor.intervalMax / (20 * 60)} minutes`);
                    }
                    player.sendMessage(`Interval for Location Messages is §anow ${gVar.watchFor.intervalTimer} ticks or ${gVar.watchFor.intervalTimer / 20} seconds)`);
                }
                else {
                    player.sendMessage("§cInvalid Interval - must equate to a number.  Can use +/- to adjust and end with s/m/h t is default if not indicated");
                }
                return;
            }

            player.sendMessage("§cInvalid Command");
        }
    });
}