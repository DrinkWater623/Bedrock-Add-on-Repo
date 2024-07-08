//==============================================================================
import { world, system } from "@minecraft/server";
import * as gVar from './globalVars.js';
import * as fn from './functions.js';

//==============================================================================
export function entityDie_after () {
    if (gVar.debug) world.sendMessage("§9entityDie.subscribe");

    gVar.callBacks.entityDie_after.ptr = world.afterEvents.entityDie.subscribe(
        (event) => {

            if (gVar.debug) world.sendMessage(`§9afterEvents.entityDie - id:${event.deadEntity.id} - saved id:${world.getDynamicProperty("deadEntityId")}`);            
            
            if (world.getDynamicProperty("deadEntityId") == event.deadEntity.id) {
                const damager = event.damageSource?.damagingEntity

                world.setDynamicProperty("deadEntityId", 0);
                //Get data saved in the removedEntity beforeEvent - because is undefined in the entityDie afterEvent
                const entityName = world.getDynamicProperty("deadEntityName");
                const entityDimensionId = world.getDynamicProperty("deadEntityDimensionId");
                const entityLocation = world.getDynamicProperty("deadEntityLocation");

                //Note: entity.dimension is not working here - get error.
                let msg = `§gA ${gVar.watchFor.display} Died`;
                if (entityDimensionId && entityLocation) msg += ` @ ${entityDimensionId} ${fn.vector3Msg(entityLocation)}`;
                if (damager && damager.typeId === "minecraft:player") msg += `\n§aKilled by ${damager.nameTag}`;
                if (entityName) msg += `\n§dRest in Peace ${entityName}`;
                world.sendMessage(msg);
            }
            else if (gVar.debug) world.sendMessage(`§cAfterEvents.entityDie - id:${event.deadEntity.id} - saved id:${world.getDynamicProperty("deadEntityId")}`);

        }, gVar.callBacks.entityDie_after.options);

        gVar.callBacks.entityDie_after.on = true; 
}
export function entityRemove_before () {
    if (gVar.debug) world.sendMessage("§9entityRemove.subscribe");

    gVar.callBacks.entityRemove_before.ptr = world.beforeEvents.entityRemove.subscribe((event) => {
        if (event.removedEntity.typeId === gVar.watchFor.typeId) {
            const entity = event.removedEntity;

            if (gVar.debug) world.sendMessage(`§9beforeEvents.entityRemove - id:${entity.id}`);
            //This info is lost in the afterEvent where I need it, so saving it in the before
            world.setDynamicProperty("deadEntityDimensionId", entity.dimension.id.replace("minecraft:", ""));
            world.setDynamicProperty("deadEntityLocation", entity.location);
            world.setDynamicProperty("deadEntityName", entity.nameTag);
            world.setDynamicProperty("deadEntityId", entity.id);            
            entity[ "myVar" ] = 623;
        }
    });
    gVar.callBacks.entityRemove_before.on = true;
}
//==============================================================================
export function entityLoad_after () {

    if (gVar.debug) world.sendMessage("§9entityLoad.subscribe");

    world.afterEvents.entityLoad.subscribe((event) => {

        if (event.entity.typeId === gVar.watchFor.typeId) {
            if (gVar.debug) world.sendMessage("§9afterEvents.entityLoad");

            world.sendMessage(`§bA ${gVar.watchFor.display} Loaded @ ${fn.vector3Msg(event.entity.location)}`);

            system.runTimeout(() => {
                fn.startWatchLoop("entityLoad");
            }, 1);
        }
    });
}
//==============================================================================
export function entitySpawn_after () {

    if (gVar.debug) world.sendMessage("§9entitySpawn.subscribe");

    world.afterEvents.entitySpawn.subscribe((event) => {

        if (event.entity.typeId === gVar.watchFor.typeId) {
            if (gVar.debug) world.sendMessage("§9afterEvents.entitySpawn");

            const entity = event.entity;
            let msg = `§bA ${gVar.watchFor.display} was ${event.cause} @ ${fn.vector3Msg(entity.location)}`;

            //Who is near by - they own it
            if (!entity.nameTag) {

                const players = entity.dimension.getPlayers(
                    {
                        closest: 1 //,                        maxDistance: 15
                    }
                );

                //world.sendMessage(`players.length= ${players.length}`);
                if (players.length) {
                    const closest = players[ 0 ].name;
                    msg += ` by ${closest}`;

                    system.runTimeout(() => {
                        entity.nameTag = `${closest}'s Pet`;
                    }, 1);
                }
            }

            world.sendMessage(msg);
            system.runTimeout(() => {
                fn.startWatchLoop("entitySpawn");
            }, 1);
        }
    });
}
//==============================================================================
export function explosion_after () {
    //FIXME:  I should not need this.... fix code so that the normal ways are captured just fine

    //projectiles are entities, so the explosion comes from them and not main entity
    //wither's thing is wither_skull &

    if (gVar.watchFor.explosiveProjectiles.length) {
        world.afterEvents.explosion.subscribe((event) => {
            const entity = event.source;

            if (entity) {
                //world.sendMessage(entity.typeId);
                if (gVar.watchFor.explosiveProjectiles.includes(entity.typeId) && !world.getDynamicProperty(gVar.watchFor.dynamicPropertyName)) {

                    const entities = fn.getAllEntities({ type: gVar.watchFor.family });
                    if (entities.length) {
                        const msg = `§bA ${gVar.watchFor.display} Explosion Occurred.  Re-Activating Alert`;
                        world.sendMessage(msg);
                        system.runTimeout(() => {
                            fn.startWatchLoop(gVar.watchFor, "explosion");
                        }, 1);
                    }
                }
            }
        });
    }
}