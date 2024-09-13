//@ts-check
/**
 * Beta Chat Commands for Wither Alert Addon
 * TODO: User Form for some of this
 */
import { world, system, Player, ChatSendBeforeEvent, ChatSendAfterEvent } from "@minecraft/server";
import { gamePlay, dev, pack, chatLog } from './settings.js';
import { EntityLib } from './commonLib/entityClass.js';
//import { MinecraftEffectTypes } from './commonLib/vanillaData.js';
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
    if (command === "whose") {
        whoOwns(player);
        return;
    }
    world.sendMessage(`§cInvalid Command -> ${gamePlay.commandPrefix} ${command}`);
    commandList(player);
}
//==============================================================================
/**
 * 
 * @param {Player} player 
 */
function commandList (player) {
    world.sendMessage(`\n\n${pack.packName} Commands`);
    world.sendMessage(`* cls - clear chat screen`);
}
//==============================================================================
/**
 * 
 * @param {Player} player 
 */
function whoOwns (player) {
    const list = gamePlay.entityList.map(e => 'minecraft:' + e);
    const see = player.getEntitiesFromViewDirection({
        "maxDistance": 5,
        "excludeFamilies": [ "monster", "chicken", "cow", "pig", "fox", "allay", "villager", "frog", "axolotl", "bat", "wandering_trader" ],
        "ignoreBlockCollision": false,
        "includePassableBlocks": true
    }).filter(e => e.entity.hasComponent("minecraft:is_tamed"));
    if (see.length === 0) return;

    chatLog.success(`Found ${see.length} is_tame's. ${see[ 0 ].entity.typeId}`, dev.debugGamePlay);

    const tamed = see.filter(e => e.entity.hasComponent("minecraft:tameable")); //.filter(e => {list.includes(e.entity.typeId)})
    if (tamed.length === 0) chatLog.warn('None With Tameable Component');
    else {
        chatLog.success(`Found ${tamed.length} tameable. ${tamed[ 0 ].entity.typeId}`, dev.debugGamePlay);
        tamed.forEach(e => {
            const tameableObj = e.entity.getComponent('minecraft:tameable');
            if (tameableObj) {
                const owner = tameableObj.tamedToPlayer;
                const ownerId = tameableObj.tamedToPlayerId;
                if (owner) {
                    chatLog.success(`${e.entity.typeId} tamed by ${owner.name}`);
                    e.entity.setDynamicProperty('tamerName', owner.name);
                    e.entity.setDynamicProperty('tamerId', owner.id);
                }
                else if (ownerId) {
                    chatLog.success(`${e.entity.typeId} tamed by ${ownerId}`);
                    e.entity.setDynamicProperty('tamerId', ownerId);
                }
                else
                    chatLog.error(`${e.entity.typeId} <xx> cannot see tamer/owner name/id`);
            }
            else
                chatLog.error(`${e.entity.typeId} <xx> no minecraft:tameable component`);
        });
    }

    //Dyps
    const hasDyps = see.filter(e => !!e.entity.getDynamicProperty('tamerName')); 
    if(hasDyps.length>0){
        hasDyps.forEach(e => {
            chatLog.success(`dyp tamer = ${e.entity.getDynamicProperty('tamerName')}`)
        })
    }
}