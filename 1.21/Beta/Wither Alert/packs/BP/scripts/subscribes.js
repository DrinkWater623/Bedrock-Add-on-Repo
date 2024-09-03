//@ts-check
/**
 * Separating the Subscriptions from the function callbacks
 */
//==============================================================================
import { world } from "@minecraft/server";
import { watchFor, dev, alertLog } from './settings.js';
import * as events from './callbackEvents.js';
//==============================================================================
const reloadTime = 10;
const debugMsg = dev.debugAll || dev.debugPackLoad || dev.debugSubscriptions;
//==============================================================================

//==============================================================================
export function subscriptionsActivate () {
    worldInitialize_after();
    //these are called in worldInitialize in stages
    // entityLoad_after_sub();
    // entitySpawn_after_sub();
    // entityDie_after_sub();
    // entityRemove_before_sub();
    explosion_after_sub();
}
//==============================================================================
//ptr to callback event is saved and used for unSub / reSub
export function entityDie_after_sub () {
    alertLog.success("§bInstalling afterEvents.entityDie.subscribe", debugMsg);

    events.callBacks.entityDie_after.ptr = world.afterEvents.entityDie.subscribe(
        (event) => { events.entityDie_after_fn(event); },
        events.callBacks.entityDie_after.options
    );

    events.callBacks.entityDie_after.on = true;
}
//==============================================================================
//ptr to callback event is saved and used for unSub / reSub
export function entityRemove_before_sub () {
    alertLog.success("§bInstalling beforeEvents.entityRemove.subscribe", debugMsg);

    events.callBacks.entityRemove_before.ptr = world.beforeEvents.entityRemove.subscribe(
        (event) => { events.entityRemove_before_fn(event); }
    );
    events.callBacks.entityRemove_before.on = true;
}
//==============================================================================
export function entityLoad_after_sub () {

    alertLog.success("§9Installing afterEvents.entityLoad.subscribe", debugMsg);

    world.afterEvents.entityLoad.subscribe(
        (event) => {
            events.entityLoad_after_fn(event);
        });
}
//==============================================================================
export function entitySpawn_after_sub () {

    alertLog.success("§9Installing afterEvents.entitySpawn.subscribe", debugMsg);

    world.afterEvents.entitySpawn.subscribe(
        (event) => {
            events.entitySpawn_after_fn(event);
        });
}
//==============================================================================
//Not exported - only used if watchFor has projectiles to watch as indicator
//Trying to not use so that projectiles do not trigger false-positive.
function explosion_after_sub () {
    //FIXME:  I should not need this.... fix code so that the normal ways are captured just fine

    //projectiles are entities, so the explosion comes from them and not main entity
    //wither's thing is wither_skull &

    if (watchFor.explosiveProjectiles.length) {
        alertLog.success(`§aInstalling afterEvents.explosion.subscribe`, debugMsg);

        world.afterEvents.explosion.subscribe(
            (event) => {
                events.explosion_after_fn(event);
            });
    }
}
//==============================================================================
//==============================================================================
function worldInitialize_after () {

    alertLog.success(`§aInstalling afterEvents.worldInitialize.subscribe`, debugMsg);

    world.afterEvents.worldInitialize.subscribe(
        (event) => {
            events.worldInitialize_after_fn(event);
        });
}