//@ts-check
import { world, EntityTypes } from "@minecraft/server";
import { dev, pack, alertLog, chatLog, gamePlay } from './settings.js';
import { EntityLib } from './commonLib/entityClass.js';
//==============================================================================
/**
  * alertsOn           other messages for initialization - default true
 */
//==============================================================================
export function main_stable () {
  const debugMsg = pack.isLoadAlertsOn || dev.debugPackLoad;

  const entityList = gamePlay.entityList
    .map(e => 'minecraft:' + e)
    .filter(e => EntityTypes.getAll().map(e => e.id).includes(e));
  if (entityList.length == 0) return;
  const on_tame_event = "minecraft:on_tame";

  alertLog.success(`Installing world.afterEvents.dataDrivenEntityTrigger: ${on_tame_event} `, dev.debugPackLoad);

  world.afterEvents.dataDrivenEntityTrigger.subscribe((event) => {
    //filter by the options to exactly those animals and that event (but this is after)

    //is the component still available?
    const entity = event.entity;
    const tameable_component = "minecraft:tameable";
    const other_component = "minecraft:tamemount";

    //horse like
    if (entity.hasComponent(other_component)) {
      chatLog.success(`${entity.typeId} still has component ${other_component}`);

      if (entity.hasComponent(tameable_component)) chatLog.success(`${entity.typeId} has component ${tameable_component} too`);
      //get nearest player, or mounted, if possible
      const players = EntityLib.closestPlayers(entity, 1, 5);
      if (players.length > 0) {
        entity.setDynamicProperty('tamerName', players[ 0 ].nameTag);
        entity.setDynamicProperty('tamerId', players[ 0 ].id);
        chatLog.success(`Closest Player Name = ${players[ 0 ].nameTag}`);
      }
    }
    //wolf/cat/parrot
    else
      if (entity.hasComponent(tameable_component)) {
        chatLog.success(`${entity.typeId} still has component ${tameable_component}`);

        const tameableObj = entity.getComponent(tameable_component);
        if (tameableObj) {
          const tamer = tameableObj.tamedToPlayer;
          if (tamer) {
            entity.setDynamicProperty('tamerName', tamer.name);
            entity.setDynamicProperty('tamerId', tamer.id);
            chatLog.success(`Tamer Name = ${tamer.name}`);
          }
          else if (tameableObj.tamedToPlayerId) {
            entity.setDynamicProperty('tamerId', tameableObj.tamedToPlayerId);
            chatLog.success(`Tamer ID = ${tameableObj.tamedToPlayerId}`);
          }
          else {
            //get closest player - I guess
            //is a player mounted
            const players = EntityLib.closestPlayers(entity, 1, 5);
            if (players.length > 0) {
              entity.setDynamicProperty('tamerName', players[ 0 ].nameTag);
              entity.setDynamicProperty('tamerId', players[ 0 ].id);
              chatLog.success(`Closest Player Name = ${players[ 0 ].nameTag}`);
            }
          }
        }
      }
      else chatLog.warn(`${entity.typeId} does not have tameable component`);

  }, { "entityTypes": entityList, "eventTypes": [ on_tame_event ] });
}
//==============================================================================