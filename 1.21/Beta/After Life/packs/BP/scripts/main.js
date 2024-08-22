// @ts-check
/**
 * Notes:  This is beta until world.beforeEvents.chatSend is released to Stable
 * 
 * TODO: popup menu on command 
 * TODO: Capture interactions, and broadcast when not the owner - or do I lock?
 * TODO: Make sure for TP, space is safe...  where coords are, test for lava in and above and below.
 * TODO: Make sure after TP, if a bot with same tag in area, TP to player, if not right there. ??? maybe
 * TODO: Later UI forms for giving people rights to have death bot, lock bot, five combination to box, tp to coords, etc....
 */
//==============================================================================
import { world, Player, system } from "@minecraft/server";
import * as fn from "./functions.js";
import * as bot from "./deathBot.js";
import { PlayerChatCommands } from "./chat_cmds.js";
//==============================================================================
export const debug = true;
export const debugMsg = function (msg = "", preFormatting = "") { if (debug && msg) world.sendMessage(`${preFormatting}@${system.currentTick}: §cDebug Log:§r ${msg}`); };
function debugDynamicPropertiesList (who = world) {
    if (!debug) return;
    if (!fn.defaultChatSend((who), true)) return;

    let msg = "";
    const list = who.getDynamicPropertyIds();
    if (list.length) {
        msg = `* §aDynamic Properties: ${list.length}§b`;

        list.forEach((id) => {
            const value = who.getDynamicProperty(id);
            msg += `\n${id}: ${who.getDynamicProperty(id)}`;

        });
    }
    else msg = `§cThere are no Dynamic Properties for ${who instanceof Player ? who.nameTag : "the world"}`;

    debugMsg(msg, "\n\n");

}
const alert = "https://github.com/DrinkWater623";
const chatCmds = new PlayerChatCommands(":dc");
//==============================================================================
function main () {
    if (debug)
        system.afterEvents.scriptEventReceive.subscribe((event) => {
            const { id, message } = event;
            if (id === 'debug:ct') {
                let msg = `currentTick: ${system.currentTick}`;
                if (message && ![ 'null', 'none', 'noMsg' ].includes(message)) msg += `: ${message}`;
                world.sendMessage(msg);
            }
        });

    world.afterEvents.entityDie.subscribe(
        (event) => {
            const player = event.deadEntity;
            if (!(player instanceof Player)) return;

            //------------------------------------------------------------------
            //Debug            
            debugMsg(`* §dafterEvents.entityDie: ${player.nameTag}`, "\n".repeat(30));
            //------------------------------------------------------------------

            const dimension = player.dimension;
            const location = player.location;            

            // this is not done right now, must be in  queue because if you hard exit game instead
            // it does not save the vars, if you select exit game, it does

            player.setDynamicProperty('deathMsgWaiting', true);
            player.setDynamicProperty('deathDimension', dimension.id);
            player.setDynamicProperty('deathCoordinates', location);

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

                player.sendMessage("\n\n*§6Death Bot Launched to Death Coordinates to pick up/hold any items within 10 blocks");

                //TODO: test death by drowning -- what is different
                bot.launchDeathBots(dimension, location, player);
            }
            else
                debugMsg("§6Keep Inventory is On");
        }
    );
    //=========================================================================
    world.afterEvents.playerSpawn.subscribe((event) => {
        const player = event.player;

        if (debug) {
            debugMsg(`* §dafterEvents.playerSpawn: ${player.nameTag}`, "\n\n");
            debugMsg(`==> deathMsgWaiting: ${!!player.getDynamicProperty('deathMsgWaiting')}`);
            debugMsg(`==> event.initialSpawn: ${event.initialSpawn}`);
        }

        if (player.getDynamicProperty('deathMsgWaiting')) {

            let dimensionId = player.getDynamicProperty('deathDimension');

            if (dimensionId && typeof dimensionId === "string") {
                dimensionId = fn.dimensionSuffix(dimensionId);

                let msg = "* §gYou last ";
                //msg += event.initialSpawn ? `last  ` : `just `;  BUG - this subscription runs twice with and will not align if they did not respawn - so forget the customization
                msg += `§cDied§g in the ${dimensionId} `;
                //@ts-ignore
                msg += `§a@§g ${fn.vector3ToString(player.getDynamicProperty('deathCoordinates'))}`;
                msg += "\n§r» Type §a:dcQuery anytime to see it again";

                //delay a few seconds
                system.runTimeout(() => { player.sendMessage(`\n\n${msg}\n\n`); }, 40);
            }
            else {
                console.error(
                    `§c* Death Coordinates are Missing`
                    , `\n§aAlert ${alert} if you continue to see this error`
                    , `\n§e==> afterEvents.playerSpawn: ${player.nameTag}`
                    , `\n§e==> deathMsgWaiting: ${!!player.getDynamicProperty('deathMsgWaiting')}`
                    , `\n§e==> event.initialSpawn: ${event.initialSpawn}`
                );
            }
        }

        player.setDynamicProperty('deathMsgWaiting', false);
    });
    //============================================================================
    //Beta as of 20240713
    world.beforeEvents.chatSend.subscribe(
        (event) => {

            if (chatCmds.processEvent(event)) return;
            //@ts-ignore
            if (event.message === ":dpList") { debugDynamicPropertiesList(event.sender); return; }
            if (event.message === ":dpClear") { event.sender.clearDynamicProperties(); return; }

            if (event.message === ":dpListWorld") { debugDynamicPropertiesList(world); return; }
            if (event.message === ":dpClearWorld") { world.clearDynamicProperties(); return; }

            if (event.message === ":debugSpawn") {
                fn.clearWorldChatWindow();
                world.sendMessage(`debugSpawn currentTick: ${system.currentTick}`);
                bot.launchDeathBots(event.sender.dimension, event.sender.location, event.sender);
            }
            //can add more, if needed
        }
    );
}
//==============================================================================
main();
//==============================================================================