//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
/**
 * Separating the Subscriptions from the function callbacks
 */
//==============================================================================
import { system, world } from "@minecraft/server";
import { watchFor, dev, alertLog, pack, chatLog } from './settings.js';
import * as events from './callbackEvents.js';
import { Entities } from "./common-stable/entityClass.js";
import { Vector3Lib as vec3 } from './common-stable/tools/vectorClass.js';
import * as watchLoop from './watchLoop.js';
//==============================================================================
const reloadTime = 10;
const debugMsg = dev.debugAll || dev.debugSubscriptions;
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

    world.afterEvents.entityLoad.subscribe((event) => {
        if (event.entity.typeId === watchFor.typeId) {
            const debugMsg = dev.debugEntityAlert || dev.debugCallBackEvents || dev.debugAll;

            chatLog.success("afterEvents.entityLoad", debugMsg);

            world.sendMessage(`§bA ${watchFor.display} Loaded @ ${vec3.toString(event.entity.location, 0, true, ', ')}`);

            system.runTimeout(() => {
                watchLoop.startWatchLoop("entityLoad");
            }, 1);
        }
    });
}
//==============================================================================
export function entitySpawn_after_sub () {

    alertLog.success("§9Installing afterEvents.entitySpawn.subscribe", debugMsg);
    
    world.afterEvents.entitySpawn.subscribe((event) => {
        if (event.entity.typeId === watchFor.typeId) {
            chatLog.log("§9afterEvents.entitySpawn", debugMsg);

            const entity = event.entity;
            let msg = `§bA ${watchFor.display} was ${event.cause} @ ${vec3.toString(entity.location, 0, true)}`;

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
                watchLoop.startWatchLoop("entitySpawn");
            }, 1);
        }
    });
}
//==============================================================================
//Not exported - only used if watchFor has projectiles to watch as indicator
//Trying to not use so that projectiles do not trigger false-positive.
//FIXME:  I should not need this.... fix code so that the normal ways are captured just fine
export function explosion_after_sub () {
    //projectiles are entities, so the explosion comes from them and not main entity
    //wither's thing is wither_skull &

    if (watchFor.explosiveProjectiles.length) {
        alertLog.success(`§aInstalling afterEvents.explosion.subscribe`, debugMsg);

        world.afterEvents.explosion.subscribe((event) => {
            const entity = event.source;

            if (entity) {
                //world.sendMessage(entity.typeId);
                if (watchFor.explosiveProjectiles.includes(entity.typeId) && !world.getDynamicProperty('isEntityAlive')) {

                    const entities = Entities.getAllEntities({ type: watchFor.family });
                    if (entities.length) {
                        const msg = `§bA ${watchFor.display} Explosion Occurred.  Re-Activating Alert System`;
                        world.sendMessage(msg);
                        system.runTimeout(() => {
                            watchLoop.startWatchLoop("explosion");
                        }, 1);
                    }
                }
            }
        });
    }
}
//==============================================================================
export function worldInitialize_before () {
    world.beforeEvents.worldInitialize.subscribe((event) => {
        alertLog.success(`§aInstalling beforeEvents.worldInitialize.subscribe`, debugMsg);
        const dypIds = world.getDynamicPropertyIds();
        if (dypIds.includes('isLoadAlertsOn')) pack.isLoadAlertsOn = !!world.getDynamicProperty('isLoadAlertsOn');
        if (dypIds.includes('isAlertSystemOn')) pack.isAlertSystemOn = !!world.getDynamicProperty('isAlertSystemOn');
        world.setDynamicProperty('isLoadAlertsOn', pack.isLoadAlertsOn);
        world.setDynamicProperty('isAlertSystemOn', pack.isAlertSystemOn);
    });
}//==============================================================================
export function worldInitialize_after () {

    world.afterEvents.worldInitialize.subscribe((event) => {
        alertLog.success(`§aInstalling afterEvents.worldInitialize.subscribe`, debugMsg);
        //-----------------------------------------------------
        //setup to capture
        system.runTimeout(() => {
            entityRemove_before_sub();
            entityDie_after_sub();

            //turn right back off if alert is not on
            if (!world.getDynamicProperty('isEntityAlive'))
                system.runTimeout(() => {
                    alertLog.success("§6WorldInitialize.after.Step 2 - callBacks_deactivate()", debugMsg);
                    events.callBacks_deactivate();
                }, 1);
        }, 1);

        //now this should only be turned on and off by the startWatchLoop/watchLoop
        //-----------------------------------------------------
        system.runTimeout(() => {
            alertLog.success("§fWorldInitialize.after.Initialize Step 3", debugMsg);
            let timer = 1;

            if (world.getDynamicProperty('isEntityAlive')) {
                world.sendMessage('\n'.repeat(5));
                chatLog.success("§aWorld is Re-Initialized via Script Re-Load");

                //reset - so it can be reChecked
                world.setDynamicProperty('isEntityAlive', false);

                //this gives it time to activate on it's own for explosions
                //Note: this will only be used if a /reload happens, else entityLoad will pick up
                //because over 100-200 ticks until chunk loads when world starts, whereas reload is faster
                system.runTimeout(() => {
                    alertLog.success("§fWorldInitialize.after.Initialize Step 3a", debugMsg);
                    //if nothing else re-activated it, go check myself - direct to watchLoop
                    if (!world.getDynamicProperty('isEntityAlive')) {
                        world.sendMessage(`§bChecking for ${watchFor.display}...`);
                        watchLoop.watchLoop("worldInitialize");
                    }
                }, reloadTime);

                timer += reloadTime;
            }
            else alertLog.log("§cAlert Not On - so No WorldInitialize.after.Step 3a", debugMsg);

            world.setDynamicProperty('isEntityAlive', false);

            system.runTimeout(() => {
                entityLoad_after_sub();
                entitySpawn_after_sub();
            }, timer);

        }, 3);
    });
}