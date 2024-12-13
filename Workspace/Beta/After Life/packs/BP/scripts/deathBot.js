// @ts-check
/**
 * Notes:  
 * 
 */
//==============================================================================
import { world, system, Dimension, EntityInventoryComponent,Player} from "@minecraft/server";
import { chatLog, dev } from "./settings";
import { sendPlayerMessageLater } from "./fn-stable";
//==============================================================================
const deathBotIdentifier = "dw623:death_bot";
const debug = dev.debugBot
//==============================================================================
/**
* @param { Dimension } dimension
* @param { import("@minecraft/server").Vector3 } location
* @param { Player }  player
*/
export function launchDeathBots (dimension, location, player) {
    if (debug) chatLog.player(player,`*§a launchDeathBots()`);

    const itemCount = floatingItemCount(dimension, location, 0, 10);
    if (itemCount === 0) {
        player.sendMessage("* §cNo Items TO Be Recovered Found");
        return;
    }
    if (debug) chatLog.player(player,`==> itemCount: ${itemCount}`);

    let botCount = Math.ceil(itemCount / 27);
    if (botCount > 9) botCount = 9;
    for (let i = 1; i <= botCount; i++) {
        if (i = 1) launchDeathBot(dimension, location, player, i);
        else
            system.runTimeout(() => {
                launchDeathBot(dimension, location, player, i);
            }, ((i - 1) * 4));
    }
}
/**
* @param { import("@minecraft/server").Dimension } dimension
* @param { import("@minecraft/server").Vector3 } location
* @param { import("@minecraft/server").Player }  player
* @param { number } botNumber
*/
function launchDeathBot (dimension, location, player, botNumber = 0) {
    if (debug) chatLog.player(player,`*§a launchDeathBot (botNumber: ${botNumber})`);

    const botName = `§cDeath Container #${botNumber}:§r\n ${player?.nameTag}`;
    const bot = dimension.spawnEntity(deathBotIdentifier, location);
    bot.nameTag = botName;
    bot.addTag(player.nameTag);
    bot.setDynamicProperty("ownerNameTag", player.nameTag);
    bot.setDynamicProperty("ownerDimension", dimension.id);
    bot.setDynamicProperty("ownerLocation", location);
    //TODO: Player combo lock

    for (let i = 1; i < 5; i++)
        system.runTimeout(() => {
            if (debug) chatLog.player(player,`#${botNumber} script (tick+${i}) tp r=15`);
            bot.dimension.runCommand('tp @e[r=15,type=item] @s');
        }, i + ((i - 1) * 5));
    system.runTimeout(() => {
        if (bot.isValid()) botContainerReport(bot, player, botNumber);
    }, 20);
}
/**
* @param { import("@minecraft/server").Entity } bot
* @param { import("@minecraft/server").Player }  player
* @param { number } botNumber
*/
function botContainerReport (bot, player, botNumber = 1) {
    const container = bot.getComponent(EntityInventoryComponent.componentId)?.container;
    if (!container) return; //report error

    if (container.emptySlotsCount === 27) {
        bot.nameTag = `§aEmpty Container§r\n${bot.getDynamicProperty("ownerNameTag")}`;
        return;
    }
    //report here 
    if (debug) chatLog.player(player,`==> Container Report #${botNumber}`);
    const itemMap = new Map();
    for (let i = 0; i < 27; i++) {
        if (container.getItem[ i ]) {
            const slot = container.getSlot(i);
            const itemName = slot.typeId;
            let count = slot.amount;
            if (itemMap.has(itemName)) { count += itemMap.get(itemName); }
            itemMap.set(itemName, count);
        }
    }
    if (itemMap.size > 0) {
        world.sendMessage("§a123 message");
        system.runTimeout(() => {
            let msg = `§aRetrieved Item List (Death Bot #${botNumber}):§r`;
            itemMap.forEach((v, k) => { msg += `\n\t${v} - ${k}`; });
            sendPlayerMessageLater('\n\n' + msg + '\n\n', player, 1);
        }, 5);
    }
}
//============================================================================================================================
/**
* @param { import("@minecraft/server").Dimension } dimension
* @param { import("@minecraft/server").Vector3 } location
* @return { import("@minecraft/server").Entity[] }
*/
function floatingItems (dimension, location, closest = 99, maxDistance = 32) {
    const queryOptions = {
        location: location,
        type: "item"
    };

    if (closest > 0) queryOptions.closest = closest;
    if (maxDistance > 0) queryOptions.maxDistance = maxDistance;

    const itemList = dimension.getEntities(queryOptions);

    return itemList;
}
/**
* @param { import("@minecraft/server").Dimension } dimension
* @param { import("@minecraft/server").Vector3 } location
* @return { number }
*/
function floatingItemCount (dimension, location, closest = 99, maxDistance = 32) {
    return floatingItems(dimension, location, closest, maxDistance).length;
}