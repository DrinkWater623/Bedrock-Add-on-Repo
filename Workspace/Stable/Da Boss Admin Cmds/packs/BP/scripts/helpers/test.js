// chatCmds.js  Da Boss Admin Cmds
// @ts-check
//==============================================================================
// Minecraft
import { system, Player, TicksPerSecond } from "@minecraft/server";
// Shared
import { VectorXZLib } from "../common-stable/tools/vectorClass.js";
// Local
import { PlayerLib } from "../common-stable/entities/playerClass.js";
//==============================================================================
//figuring out why not working
/**
 * 
 * @param {Player} player 
 * @param {number} radius 
 */
export function randomTP (player, radius = 1000) {
    if (!player || !player.isValid) return

    const { dimension, location } = player;
    if (dimension.id.toLowerCase() !== 'overworld') return;

    const xz = VectorXZLib.randomXZ(radius, { center: location, minRadius: Math.floor(radius * .3), avoidZero: true });

    system.run(() => {
        player.teleport({ x: xz.x, y: 250, z: xz.z });
        if (PlayerLib.isGameModeCreative(player)) return;

        player.addEffect("minecraft:levitation", TicksPerSecond * 2, { amplifier: 100, showParticles: true });

        system.runTimeout(() => {
            player.addEffect("minecraft:slow_falling", TicksPerSecond * 5, { amplifier: 100, showParticles: false });
            system.runTimeout(() => {
                player.addEffect("minecraft:instant_health", TicksPerSecond, { amplifier: 100, showParticles: false });
                const topBlock = dimension.getTopmostBlock(player.location);
                if (topBlock && topBlock.isValid) {
                    //TODO:  if lava ??? add water
                    const topBlockLocation = topBlock.location;
                    topBlockLocation.y++;
                    player.teleport(topBlockLocation);
                }
                else {
                    player.addEffect("minecraft:slow_falling", TicksPerSecond * 10, { amplifier: 100, showParticles: false });
                    player.addEffect("minecraft:instant_health", TicksPerSecond * 10, { amplifier: 100, showParticles: false });
                }
            }, TicksPerSecond * 5);
        }, TicksPerSecond * 2);

    });

}