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
import { PlayerChatCommands } from "../chat_cmds.js";
//==============================================================================
export const debug = true;
export const debugMsg = function (msg = "", preFormatting = "") { if (debug && msg) world.sendMessage(`${preFormatting}@${system.currentTick}: §cDebug Log:§r ${msg}`); };
//==============================================================================
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