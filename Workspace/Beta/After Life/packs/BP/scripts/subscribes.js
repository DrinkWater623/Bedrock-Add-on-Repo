//@ts-check
import { world, system, Player, TicksPerSecond } from "@minecraft/server";
import { dev, alertLog, watchFor, dynamicVars, chatLog, pack } from './settings.js';
import { dimensionSuffix, playerAliveTicksCounterJob, updatePlayerStats } from './fn-stable.js';
import { Vector3Lib } from "./commonLib/vectorClass.js";
import * as bot from "./deathBot.js";
import { BlockLib } from "./commonLib/blockClass.js";
import { DynamicPropertyLib } from "./commonLib/dynamicPropertyClass.js";
//==============================================================================
const debug = dev.debugSubscriptions;
//==============================================================================
export function afterEvents_playerSpawn () {
    //Load (195 ticks or so )is after Spawn        
    alertLog.success("§aInstalling afterEvents.playerSpawn §c(debug mode)", debug);

    world.afterEvents.playerSpawn.subscribe((event) => {
        const player = event.player;

        DynamicPropertyLib.add(player, dynamicVars.firstTick, 0);

        if (dev.debugPlayer && player.isOp()) {
            chatLog.player(player, "`* §dafterEvents.playerSpawn: ${player.nameTag}`");
            chatLog.player(player, `==> event.initialSpawn: ${event.initialSpawn}`);
        }

        if (event.initialSpawn)
            system.runTimeout(() => { playerAliveTicksCounterJob(player); }, TicksPerSecond);

        //First Time Load
        if (DynamicPropertyLib.getNumber(player, dynamicVars.firstTick) == 0) {
            //TODO: add message to player on what to do
        }
        else {
            chatLog.player(player, `==> deathMsgWaiting: ${!!player.getDynamicProperty(dynamicVars.deathMsgWaiting)}`, dev.debugPlayer && player.isOp());

            if (player.getDynamicProperty(dynamicVars.deathMsgWaiting)) {

                let dimensionId = player.getDynamicProperty(dynamicVars.deathDimension);

                if (dimensionId && typeof dimensionId === "string") {
                    dimensionId = dimensionSuffix(dimensionId);

                    let msg = "* §gYou last ";
                    //msg += event.initialSpawn ? `last  ` : `just `;  BUG - this subscription runs twice with and will not align if they did not respawn - so forget the customization
                    msg += `§cDied§g in the ${dimensionId} `;
                    //@ts-ignore
                    msg += `§a@§g ${Vector3Lib.toString(player.getDynamicProperty(dynamicVars.deathCoordinates))}`;
                    msg += "\n§r» Type §aal:where anytime to see it again";

                    //delay a few seconds
                    system.runTimeout(() => { player.sendMessage(`\n\n${msg}\n\n`); }, 40);
                }
                else {
                    var msg =
                        `§c* Death Coordinates are Missing`
                        + `\n§aAlert ${pack.alert} if you continue to see this error`
                        + `\n§e==> afterEvents.playerSpawn: ${player.nameTag}`
                        + `\n§e==> deathMsgWaiting: ${!!player.getDynamicProperty(dynamicVars.deathMsgWaiting)}`
                        + `\n§e==> event.initialSpawn: ${event.initialSpawn}`;
                    alertLog.error(msg);
                }
            }

            player.setDynamicProperty(dynamicVars.deathMsgWaiting, false);
        }
        
        updatePlayerStats(player);
    }); //end-Subscribe
}
//==============================================================================
export function afterEvents_entityDie () {

    alertLog.success("§aInstalling afterEvents.entityDie §c(debug mode)", debug);

    world.afterEvents.entityDie.subscribe((event) => {
        const player = event.deadEntity;
        if (!(player instanceof Player)) return;

        const dimension = player.dimension;
        const location = player.location;
        const deathTick = system.currentTick;

        alertLog.log("\n".repeat(5) + `* §dafterEvents.entityDie: ${player.nameTag} in ${dimension.id} @ ${Vector3Lib.toString(location)}`, dev.debugPlayer);

        // this is not done right now, must be in  queue because if you hard exit game instead
        // it does not save the vars, if you select exit game, it does

        DynamicPropertyLib.add(player, dynamicVars.deathCounter, 1);
        player.setDynamicProperty(dynamicVars.deathMsgWaiting, true);
        player.setDynamicProperty(dynamicVars.deathDimension, dimension.id);
        player.setDynamicProperty(dynamicVars.deathCoordinates, location);

        //calculate ticks between deaths to see if time is better than last record longest alive time

        updatePlayerStats(player);
        player.setDynamicProperty(dynamicVars.aliveTicks, 0);
        player.setDynamicProperty(dynamicVars.lastDeathTick, deathTick);

        //TODO: add other death Counters Here --maybe death by different sources... for fun        


        if (world.gameRules.keepInventory) return; //Nothing to do

        //====================================
        // Launch a death bot at that location
        //====================================
        //Initial protection of items - fingers crosses
        BlockLib.replace(dimension, location, 5, { includeTypes: [ "minecraft:lava", "minecraft:flowing_lava" ] }, "minecraft:water");
        BlockLib.replace(dimension, location, 2, { includeTypes: [ "minecraft:air" ] }, "minecraft:glass");

        //deleted after the above is working
        /*
        let fillArea = `${location.x - 5} ${location.y - 5} ${location.z - 5} ${location.x + 5} ${location.y + 5} ${location.z + 5}`;
        let command = `fill ${fillArea} water replace lava`;
        dimension.runCommandAsync(command);
        command = `fill ${fillArea} water replace flowing_lava`;
        dimension.runCommandAsync(command);

        fillArea = `${location.x - 2} ${location.y - 2} ${location.z - 2} ${location.x + 2} ${location.y - 1} ${location.z + 2}`;
        command = `fill ${fillArea} air replace glass`;
        dimension.runCommandAsync(command);
        */
        chatLog.player(player, "\n\n*§6Death Bot Launched to Death Coordinates to pick up/hold any items within 10 blocks");

        //TODO: test death by drowning -- what is different
        bot.launchDeathBots(dimension, location, player);

        //else chatLog.player(player,"§6Keep Inventory is On");
    }, { entityTypes: [ watchFor.typeId ] });
}
//==============================================================================
//TODO: how used?  forgot
export function afterEvents_scriptEventReceive () {

    alertLog.success("§aInstalling afterEvents.scriptEventReceive §c(Debug Mode)", debug);

    system.afterEvents.scriptEventReceive.subscribe((event) => {
        const { id, message } = event;
        if (id === 'debug:ct') {
            let msg = `currentTick: ${system.currentTick}`;
            if (message && ![ 'null', 'none', 'noMsg' ].includes(message)) msg += `: ${message}`;
            world.sendMessage(msg);
        }
    });
}
//==============================================================================