// @ts-check
/**
 * Notes:  
 * 
 */
//==============================================================================
import { world,  system, Entity, Dimension } from "@minecraft/server";
import * as fn from "./functions.js";
//==============================================================================
/**
* @param { import("@minecraft/server").Dimension } dimension
* @param { import("@minecraft/server").Vector3 } location
* @param { string } botName
* @param { string } addTag
* @param { number } tickDelay
*/
export function launchDeathBot (dimension, location, botName = "Death Container", addTag, tickDelay = 1) {

    const itemList = floatingItems(dimension, location, 0, 10);
    if (!itemList.length) {
        world.sendMessage("* §cNo Items Found");
        return;
    }

    itemList.forEach(item => {
        world.sendMessage(`nameTag: ${item.nameTag}, typeId: ${item.typeId}`)
    })
    
    system.runTimeout(() => {
        const bot = dimension.spawnEntity("dw623:death_bot<ev:is_first_set>", location);
        bot.nameTag = botName;
        if (addTag) bot.addTag(addTag);
    }, tickDelay);
}
/**
* @param { import("@minecraft/server").Entity } bot
*/
function getStuff (bot) {

    world.sendMessage("get stuff");

}
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