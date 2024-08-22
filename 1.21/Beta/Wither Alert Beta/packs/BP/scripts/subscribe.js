//==============================================================================
import { world, TicksPerSecond } from "@minecraft/server";

const TicksPerDay = 24000; //in beta still
const watchFor = {
    typeId: "minecraft:wither",
    family: "wither",
    display: "Wither",
    dynamicProperty: "isWither",
    commandPrefix: ":wither",
    watchInterval: 300,
    intervalMin: TicksPerSecond,
    intervalMax: (TicksPerDay / 4)
};

function vector3Msg (location = world.getDefaultSpawnLocation()) {
    return `${location.x}, ${location.y}, ${location.z},`;
}
//==============================================================================
export function chatSend_before () {

    world.afterEvents.chatSend.subscribe((event) => {
        if (!(event.sender instanceof Player)) return;

        if (event.message.toLowerCase().startsWith(watchFor.commandPrefix)) {
            const command = event.message.toLowerCase().trim().replace("  ", ' ');

            if (command.startsWith(`${watchFor.commandPrefix} kill`)) {
                //event.cancel;
                killLoop(watchFor.typeId);
                event.sender.sendMessage(`§aCommand to kill ${watchFor.display}s sent`);
                return;
            }

            if (command.startsWith(`${watchFor.commandPrefix} tp2me`)) {
                //event.cancel;
                system.runTimeout(() => {
                    event.sender.dimension.runCommand(`tp @e[family=${watchFor.family}] @s`);
                }, 1);
                return;
            }

            if (command.startsWith(`${watchFor.commandPrefix} grief on`)) {
                //event.cancel;
                if (!world.gameRules.mobGriefing) {
                    system.runTimeout(() => { world.gameRules.mobGriefing = true; }, 1);
                    world.sendMessage(`§aMob Griefing turned back on by ${event.sender.id}`);
                    if (!!world.getEntity(watchFor.typeId).id) world.sendMessage(`§6Beware, there is still an active ${watchFor.display}`);
                }
                return;
            }

            if (command.startsWith(`${watchFor.commandPrefix} grief off`)) {
                //event.cancel;
                if (world.gameRules.mobGriefing) {
                    if (!!world.getEntity(watchFor.typeId).id) {
                        system.runTimeout(() => { world.gameRules.mobGriefing = false; }, 1);
                        world.sendMessage(`§aMob Griefing Turned off by ${event.sender.id} due to an active ${watchFor.display}`);
                    }
                    else
                        event.sender.sendMessage(`§cThere is no active ${watchFor.display} - Cannot alter Game Rules to turn off mob griefing`);
                }
                return;
            }
            if (command.startsWith(`${watchFor.commandPrefix} interval`)) {
                //event.cancel;
                let parm = command.substring(`${watchFor.commandPrefix} interval`.length);

                if (parm.includes('?')) {
                    event.sender.sendMessage(`Interval for Location Messages is ${watchFor.watchInterval} ticks or ${watchFor.watchInterval / 20} seconds)`);
                    return;
                }

                parm.replace(" ", "")
                    .replace("second", 's')
                    .replace("minute", 'm')
                    .replace("hr", 'h')
                    .replace("sec", 's')
                    .replace("min", 'm')
                    .replace("tick", 't')
                    .replace("hour", 'h');

                let multiplier = 1;
                let add = false;
                let minus = false;

                if (parm.includes('h')) { multiplier = 60; parm.replace('h', '').trim(); }
                if (parm.includes('m')) { multiplier = 60; parm.replace('m', '').trim(); }
                if (parm.includes('s')) { multiplier = 20; parm.replace('s', '').trim(); }
                if (parm.includes('t')) { multiplier = 1; parm.replace('t', '').trim(); }
                if (parm.startsWith('-')) { minus = true; parm.replace('-', ''); }
                if (parm.startsWith('+')) { add = true; parm.replace('+', ''); }
                if (Number.isInteger(parm)) {
                    parm *= multiplier;
                    if (add) watchFor.watchInterval += parm;
                    else if (minus) watchFor.watchInterval -= parm;
                    else watchFor.watchInterval = parm;

                    if (watchFor.watchInterval < watchFor.intervalMin) {
                        watchFor.watchInterval = watchFor.intervalMin;
                        event.sender.sendMessage(`Interval cannot go below ${watchFor.intervalMin} ticks`);
                    }
                    if (watchFor.watchInterval > watchFor.intervalMax) {
                        watchFor.watchInterval = watchFor.intervalMax;
                        event.sender.sendMessage(`Interval cannot go above ${watchFor.intervalMax} ticks = ${watchFor.intervalMax / 20} seconds = ${watchFor.intervalMax / (20 * 60)} minutes`);
                    }
                }
                else {
                    event.sender.sendMessage("Invalid Interval - must equate to a number.  Can use +/- to adjust and end with s/m/h t is default if not indicated");
                }
                return;
            }
        }
    });
}
function killLoop (typeId = "") {
    if (
        typeof typeId === "string" &&
        typeId.includes(':')
    ) {
        const entity = world.getEntity(typeId);
        if (entity) {
            system.runTimeout(() => {
                if (entity.isValid()) {
                    entity.kill();   // TODO: capture fails                 
                }
                system.runTimeout(() => { killLoop(typeId); }, 5);
            }, 5);
        }
    }
}
//==============================================================================
export function entityDie_after () {

    world.afterEvents.entityDie.subscribe((event) => {
        if (event.deadEntity.typeId === watchFor.typeId) {

            const entity = event.deadEntity;
            const damager = event.damageSource?.damagingEntity;

            let msg = `A ${watchFor.display} Died @ ${entity.dimension.id} ${vector3Msg(entity.location)}`;
            if (damager && damager.typeId === "minecraft:player") msg += ` - §aKilled by ${damager.id}`;
            world.sendMessage(msg);

            //in case more than one...
            system.runTimeout(() => {
                world.setDynamicProperty(watchFor.dynamicProperty, !!world.getEntity(watchFor.typeId));
            }, 5);
        }
    });
}
//==============================================================================
export function entityLoad_after () {

    world.afterEvents.entityLoad.subscribe((event) => {
        if (event.entity.typeId === watchFor.typeId) {
            const entity = event.entity;
            const location = entity.location;
            let msg = `§cA ${watchFor.display} Loaded @ ${vector3Msg(location)}`;
            world.sendMessage(msg);
            startWatchLoop();
        }
    });
}
//==============================================================================
export function entitySpawn_after () {

    world.afterEvents.entitySpawn.subscribe((event) => {
        if (event.entity.typeId === watchFor.typeId) {

            const entity = event.entity;
            const location = entity.location;
            let msg = `§cA ${watchFor.display} Spawned (${event.cause}) @ ${vector3Msg(location)}`;

            //Who is near by - they own it
            if (entity.nameTag = "") {
                const players = entity.dimension.getPlayers(
                    {
                        closest: 1,
                        maxDistance: 10
                    }
                );

                if (players.length) {
                    const spawner = players[ 0 ].id;
                    msg += ` by ${players[ 0 ].id}`;

                    system.runTimeout(() => {
                        entity.nameTag = `${players[ 0 ].id}'s Pet`;
                    }, 5);
                }
            }

            //Alert World
            world.sendMessage(msg);
            startWatchLoop();
        }
    });
}
//==============================================================================
function startWatchLoop () {

    if (typeof world.getDynamicProperty(watchFor.dynamicProperty) != "boolean") {
        //initialize
        world.setDynamicProperty(watchFor.dynamicProperty, false);
    }

    if (!world.getDynamicProperty(watchFor.dynamicProperty)) {
        world.setDynamicProperty(watchFor.dynamicProperty, true);
        system.runTimeout(() => { watchLoop(); }, watchFor.watchInterval);
    }
}
function watchLoop () {

    const entities = getAllEntities(watchFor.typeId);
    if (entities.length === 0) return;

    let msg = "";
    msg = `§6${entities.length} ${watchFor.display}${entities.length === 1 ? '' : 's'}`;
    entities.forEach((e, i) => {
        msg += `\n#${i} -${e.nameTag ? ' ' + e.nameTag : ''} @ ${e.dimension.id} ${vector3Msg(e.location)}`;
    });

    world.sendMessage(msg);
    system.runTimeout(() => { watchLoop(); }, watchFor.watchInterval);
}

function getAllEntities (typeID) {
    const entities = world.getDimension("overworld").getEntities();
    world.getDimension("nether").getEntities().forEach(e => entities.push(e));
    world.getDimension("the_end").getEntities().forEach(e => entities.push(e));
    return entities;
}
//==============================================================================
export function worldInitialize_after () {
    world.afterEvents.worldInitialize.subscribe((event) => {

        //initialize
        if (typeof world.getDynamicProperty(watchFor.dynamicProperty) != "boolean") {
            world.setDynamicProperty(watchFor.dynamicProperty, false);
        }

        if (world.getDynamicProperty(watchFor.dynamicProperty)) {
            world.setDynamicProperty(watchFor.dynamicProperty, true);
            watchLoop();
        }
    });
}
