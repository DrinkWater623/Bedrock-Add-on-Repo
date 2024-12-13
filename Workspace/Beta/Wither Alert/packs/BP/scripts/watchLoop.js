//@ts-check
import { world, system, TicksPerSecond, Player } from "@minecraft/server";
import { callBacks_activate, callBacks_deactivate } from './callbackEvents.js';
import { Entities } from './commonLib/entityClass.js';
import { dev, chatLog } from './settings.js';
//==============================================================================
import { watchFor } from './settings.js';
//==============================================================================
export function startWatchLoop (source = "") {
    if (dev.debugEntityAlert) world.sendMessage(`§9startWatchLoop (${source})`);

    //so only one is looping
    if (!world.getDynamicProperty('isEntityAlive')) {
        world.sendMessage(`${'\n'.repeat(40)}`);
        callBacks_activate();
        world.setDynamicProperty('isEntityAlive', true);
        world.sendMessage(`\n\n§g${watchFor.display} Alert Activated - Watch for Location Messages Every ${Math.floor(watchFor.intervalTimer / TicksPerSecond)} seconds`);
        watchLoop(source);
    }
    else if (dev.debugEntityAlert) world.sendMessage(`§9${watchFor.display} Alert is already running`);
}
//==============================================================================
export function watchLoop (source = "") {
    const debugMsg = dev.debugEntityAlert || dev.debugAll;
    chatLog.log(`§9watchLoop (${source})`, debugMsg);

    //check for the watch Entity    
    const entities = Entities.getAllEntities({ type: watchFor.family });

    if (entities.length === 0) {
        chatLog.success(`§9No ${watchFor.display}s Found`, debugMsg);
        world.setDynamicProperty('isEntityAlive', false);

        system.runTimeout(() => {
            if (!world.getDynamicProperty('isEntityAlive')) {
                if (source != "worldInitialize") world.sendMessage(`§aNo More Loaded ${watchFor.display}s!!!`);
                callBacks_deactivate();
            }
        }, watchFor.intervalTimer);
        return;
    }
    else chatLog.success(`Yes, ${watchFor.display}s Found`, debugMsg);

    if (source === "worldInitialize") {
        const msg = `\n§bContinuing ${watchFor.display} Alert After /Reload.`;
        world.sendMessage(msg);
        //It does need this one if called from world-initialize after /reload
        world.setDynamicProperty('isEntityAlive', true);
        source += '*';
    }

    if (entities.length > 0) {
        const title = `§d${entities.length} ${watchFor.display}${entities.length === 1 ? '' : 's'} §6`;
        Entities.listEntities(title, entities, world);
    }
    chatLog.log("§9Waiting to Loop Again", debugMsg);
    system.runTimeout(() => { watchLoop(source); }, watchFor.intervalTimer);
}
//==============================================================================
