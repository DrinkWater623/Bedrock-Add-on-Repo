import { world, system, TicksPerSecond } from "@minecraft/server";
import * as gVar from './globalVars.js';
//==============================================================================
function callBacks_activate () {
    if (!gVar.callBacks.entityDie_after.on) {
        if (gVar.debug) world.sendMessage("§9Activating entityDie_after");
        gVar.callBacks.entityDie_after.on = true;
        world.afterEvents.entityDie.subscribe(gVar.callBacks.entityDie_after.ptr, gVar.callBacks.entityDie_after.options);
    }

    if (!gVar.callBacks.entityRemove_before.on) {
        if (gVar.debug) world.sendMessage("§9Activating entityRemove_before");
        gVar.callBacks.entityRemove_before.on = true;
        world.beforeEvents.entityRemove.subscribe(gVar.callBacks.entityRemove_before.ptr);
    }
}
export function callBacks_deactivate () {
    if (gVar.callBacks.entityDie_after.on) {
        if (gVar.debug) world.sendMessage("§9De-Activating entityDie_after");
        gVar.callBacks.entityDie_after.on = false;
        world.afterEvents.entityDie.unsubscribe(gVar.callBacks.entityDie_after.ptr);
    }

    if (gVar.callBacks.entityRemove_before.on) {
        if (gVar.debug) world.sendMessage("§9De-Activating entityRemove_before");
        gVar.callBacks.entityRemove_before.on = false;
        world.beforeEvents.entityRemove.unsubscribe(gVar.callBacks.entityRemove_before.ptr);
    }
}
//==============================================================================
export function startWatchLoop (source = "") {
    if (gVar.debug) world.sendMessage(`§9startWatchLoop (${source})`);

    //so only one is looping
    if (!world.getDynamicProperty(gVar.watchFor.dynamicPropertyName)) {
        spamEmptyLines(40, world);
        callBacks_activate();
        world.setDynamicProperty(gVar.watchFor.dynamicPropertyName, true);
        world.sendMessage(`\n\n§gWither Alert Activated - Watch for Location Messages Every ${Math.floor(gVar.watchFor.intervalTimer / TicksPerSecond)} seconds`);
        watchLoop(source);
    }
    else if (gVar.debug) world.sendMessage("§9Alert is already running");
}
//==============================================================================
export function watchLoop (source = "") {
    if (gVar.debug) world.sendMessage(`§9watchLoop (${source})`);

    //check for the watch Entity    
    const entities = getAllEntities({ type: gVar.watchFor.family });

    if (entities.length === 0) {
        if (gVar.debug) world.sendMessage("§9No Entities Found");
        world.setDynamicProperty(gVar.watchFor.dynamicPropertyName, false);

        system.runTimeout(() => {
            if (!world.getDynamicProperty(gVar.watchFor.dynamicPropertyName)) {
                if (source != "worldInitialize") world.sendMessage(`§aNo More Loaded ${gVar.watchFor.display}s!!!`);
                callBacks_deactivate();
            }
        }, gVar.watchFor.intervalTimer);
        return;
    }
    else if (gVar.debug) world.sendMessage("§9Yes Entities Found");

    if (source === "worldInitialize") {
        const msg = `\n§bContinuing ${gVar.watchFor.display} Alert After /Reload.`;
        world.sendMessage(msg);
        //It does need this one if called from world-initialize after /reload
        world.setDynamicProperty(gVar.watchFor.dynamicPropertyName, true);
        source += '*';
    }

    const title = `§d${entities.length} ${gVar.watchFor.display}${entities.length === 1 ? '' : 's'} §6`;
    listEntities(title, entities, world);

    if (gVar.debug) world.sendMessage("§9Waiting to Loop Again");
    system.runTimeout(() => { watchLoop(source); }, gVar.watchFor.intervalTimer);
}
//==============================================================================
export function getAllEntities (queryOption) {
    const entities = world.getDimension("overworld").getEntities(queryOption);
    world.getDimension("nether").getEntities(queryOption).forEach(e => entities.push(e));
    world.getDimension("the_end").getEntities(queryOption).forEach(e => entities.push(e));
    return entities;
}
//==============================================================================
function listEntities (title, entities = [], chatSend = world) {
    let msg = "";
    msg = title;
    entities.forEach((e, i) => {
        msg += `\n#${i + 1} -${e.nameTag ? ' ' + e.nameTag : ''} @ ${e.dimension.id.replace("minecraft:", '')} ${vector3Msg(e.location)}`;
    });
    msg += "\n\n";
    chatSend.sendMessage(msg);
}
export function spamEmptyLines (numOfLines = 40, chatSend = world) {
    let msg = "";
    for (let i = 0; i < numOfLines; i++) msg += "\n";
    chatSend.sendMessage(msg);
};
//==============================================================================
export function vector3Msg (location = world.getDefaultSpawnLocation()) {
    return `${Math.floor(location.x)}, ${Math.floor(location.y)}, ${Math.floor(location.z)}`;
}