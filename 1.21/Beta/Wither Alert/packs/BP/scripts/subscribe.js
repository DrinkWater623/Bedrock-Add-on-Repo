//==============================================================================
import { world, system } from "@minecraft/server";
import * as gVar from './globalVars.js';
import * as fn from './functions.js';
//==============================================================================
const callBacks = {
    entityDie_after: { on: false, ptr: 0, options:  { entityTypes: [ watchFor.typeId ] }  },
    entityRemove_before: { on: false, ptr: 0 }
};
//==============================================================================
export function callBacks_activate () {
    if (!callBacks.entityDie_after.on) {
        if (gVar.debug) world.sendMessage("§9Activating entityDie_after");
        callBacks.entityDie_after.on = true;
        world.afterEvents.entityDie.subscribe(callBacks.entityDie_after.ptr, callBacks.entityDie_after.options);
    }

    if (!callBacks.entityRemove_before.on) {
        if (gVar.debug) world.sendMessage("§9Activating entityRemove_before");
        callBacks.entityRemove_before.on = true;
        world.beforeEvents.entityRemove.subscribe(callBacks.entityRemove_before.ptr);
    }
}
export function callBacks_deactivate () {
    if (callBacks.entityDie_after.on) {
        if (gVar.debug) world.sendMessage("§9De-Activating entityDie_after");
        callBacks.entityDie_after.on = false;
        world.afterEvents.entityDie.unsubscribe(callBacks.entityDie_after.ptr);
    }

    if (callBacks.entityRemove_before.on) {
        if (gVar.debug) world.sendMessage("§9De-Activating entityRemove_before");
        callBacks.entityRemove_before.on = false;
        world.beforeEvents.entityRemove.unsubscribe(callBacks.entityRemove_before.ptr);
    }
}
//==============================================================================
export function subscriptionsActivate(){
    worldInitialize_after();
    entityLoad_after();
    entitySpawn_after();
    entityDie_after();
    entityRemove_before(); 
    explosion_after();
}
//==============================================================================
function entityDie_after () {
    if (gVar.debug) world.sendMessage("§9Installing afterEvents.entityDie.subscribe");

    callBacks.entityDie_after.ptr = world.afterEvents.entityDie.subscribe(
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

        }, callBacks.entityDie_after.options);

        callBacks.entityDie_after.on = true; 
}
function entityRemove_before () {
    if (gVar.debug) world.sendMessage("§9Installing beforeEvents.entityRemove.subscribe");

    callBacks.entityRemove_before.ptr = world.beforeEvents.entityRemove.subscribe((event) => {
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
    callBacks.entityRemove_before.on = true;
}
//==============================================================================
function entityLoad_after () {

    if (gVar.debug) world.sendMessage("§9Installing afterEvents.entityLoad.subscribe");

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
function entitySpawn_after () {

    if (gVar.debug) world.sendMessage("§9Installing afterEvents.entitySpawn.subscribe");

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
function explosion_after () {
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
function worldInitialize_after(){

    if (gVar.debug) world.sendMessage("§9Installing afterEvents.worldInitialize.subscribe");

    world.afterEvents.worldInitialize.subscribe((event) => {
        fn.spamEmptyLines(5, world);
        if (gVar.debug) world.sendMessage("§aWorldInitialize.subscribe Step 0");
        //-----------------------------------------------------
        //setup to capture
        system.runTimeout(() => {
            if (gVar.debug) world.sendMessage("§gInitialize Step 1");
            subscribe.entityRemove_before();
            subscribe.entityDie_after();
        }, 1);
        //turn right back off if alert is not on
        if (!world.getDynamicProperty(gVar.watchFor.dynamicPropertyName))
            system.runTimeout(() => {
                if (gVar.debug) world.sendMessage("§gInitialize Step 2");
                subscribe.callBacks_deactivate();
            }, 2);
        //now this should only be turned on and off ny the startWatchLoop/watchLoop
        //-----------------------------------------------------
        system.runTimeout(() => {
            if (gVar.debug) world.sendMessage("§gInitialize Step 3");
            let timer = 1;

            if (world.getDynamicProperty(gVar.watchFor.dynamicPropertyName)) {
                fn.spamEmptyLines(5, world);
                world.sendMessage("World is Re-Initialized via Script Re-Load");

                world.setDynamicProperty(gVar.watchFor.dynamicPropertyName, false);

                //this gives it time to activate on it's own for explosions
                //Note: this will only be used if a /reload happens, else entityLoad will pick up
                //because over 100-200 ticks until chunk loads when world starts, whereas reload is faster
                system.runTimeout(() => {
                    if (gVar.debug) world.sendMessage("§fInitialize Step 3a");
                    //if nothing else re-activated it, go check myself - direct to watchLoop
                    if (!world.getDynamicProperty(gVar.watchFor.dynamicPropertyName)) {
                        world.sendMessage(`§aChecking...`);
                        fn.watchLoop("worldInitialize");
                    }
                }, gVar.reloadTime);

                timer += gVar.reloadTime;
            }
            else if (gVar.debug) world.sendMessage("§cAlert Not On - so No Step 3a");

            world.setDynamicProperty(gVar.watchFor.dynamicPropertyName, false);

            system.runTimeout(() => {
                if (gVar.debug) world.sendMessage("§gInitialize Step 3b");
                subscribe.entityLoad_after();
                subscribe.entitySpawn_after();

                if (gVar.beta)
                    system.runTimeout(() => {
                        if (gVar.debug) world.sendMessage("§gInitialize Step 4 Beta");
                        beta.chatSend_before();
                    }, TicksPerSecond);
            }, timer);

        }, 3);
    });
}