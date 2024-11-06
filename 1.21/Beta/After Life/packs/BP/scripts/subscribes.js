//@ts-check
import { world, system, TicksPerSecond, Entity, ScoreboardObjective, EntityInitializationCause, Player } from "@minecraft/server";
import { dev, alertLog, watchFor, dynamicVars, entityEvents, chatLog, pack } from './settings.js';
import { dimensionSuffix } from './fn-stable.js';
import { Vector3Lib } from "./commonLib/vectorClass.js";
import * as bot from "./deathBot.js";
//==============================================================================
export function afterEvents_playerSpawn () {
    //Load (195 ticks or so )is after Spawn    
    //if (dev.debugLoadAndSpawn) {
    alertLog.success("§aInstalling afterEvents.playerSpawn §c(debug mode : tick scoreboard)", dev.debugSubscriptions);

    world.afterEvents.playerSpawn.subscribe((event) => {
        const player = event.player;

        chatLog.log("`* §dafterEvents.playerSpawn: ${player.nameTag}`", dev.debugLoadAndSpawn);
        chatLog.log(`==> deathMsgWaiting: ${!!player.getDynamicProperty(dynamicVars.deathMsgWaiting)}`, dev.debugLoadAndSpawn);
        chatLog.log(`==> event.initialSpawn: ${event.initialSpawn}`, dev.debugLoadAndSpawn);

        if (player.getDynamicProperty(dynamicVars.deathMsgWaiting)) {

            let dimensionId = player.getDynamicProperty(dynamicVars.deathDimension);

            if (dimensionId && typeof dimensionId === "string") {
                dimensionId = dimensionSuffix(dimensionId);

                let msg = "* §gYou last ";
                //msg += event.initialSpawn ? `last  ` : `just `;  BUG - this subscription runs twice with and will not align if they did not respawn - so forget the customization
                msg += `§cDied§g in the ${dimensionId} `;
                //@ts-ignore
                msg += `§a@§g ${Vector3Lib.toString(player.getDynamicProperty(dynamicVars.deathCoordinates))}`;
                msg += "\n§r» Type §a:dcQuery anytime to see it again";

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
    });
}
//==============================================================================
export function afterEvents_entityDie () {

    alertLog.success("§aInstalling afterEvents.entityDie §c(debug mode)", dev.debugSubscriptions);

    world.afterEvents.entityDie.subscribe((event) => {
        const player = event.deadEntity;
        if (!(player instanceof Player)) return;

        alertLog.log(`* §dafterEvents.entityDie: ${player.nameTag}` + "\n".repeat(30)), dev.debugEntityEvent;

        const dimension = player.dimension;
        const location = player.location;

        // this is not done right now, must be in  queue because if you hard exit game instead
        // it does not save the vars, if you select exit game, it does

        player.setDynamicProperty(dynamicVars.deathMsgWaiting, true);
        player.setDynamicProperty(dynamicVars.deathDimension, dimension.id);
        player.setDynamicProperty(dynamicVars.deathCoordinates, location);

        //Moved msg to spawn so it pops up when they spawn, else they have to open chat window to see anything

        //====================================
        // Launch a death bot at that location
        //====================================
        if (!world.gameRules.keepInventory) {
            //Initial protection of items - fingers crosses
            let fillArea = `${location.x - 5} ${location.y - 5} ${location.z - 5} ${location.x + 5} ${location.y + 5} ${location.z + 5}`;
            let command = `fill ${fillArea} water replace lava`;
            dimension.runCommandAsync(command);
            command = `fill ${fillArea} water replace flowing_lava`;
            dimension.runCommandAsync(command);

            fillArea = `${location.x - 2} ${location.y - 2} ${location.z - 2} ${location.x + 2} ${location.y - 1} ${location.z + 2}`;
            command = `fill ${fillArea} air replace glass`;
            dimension.runCommandAsync(command);

            chatLog.player(player,"\n\n*§6Death Bot Launched to Death Coordinates to pick up/hold any items within 10 blocks");

            //TODO: test death by drowning -- what is different
            bot.launchDeathBots(dimension, location, player);
        }
        //else chatLog.player(player,"§6Keep Inventory is On");
    }, { entityTypes: [ watchFor.typeId ] });
}
//==============================================================================