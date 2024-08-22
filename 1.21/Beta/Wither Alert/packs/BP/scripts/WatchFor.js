//@ts-check
import { world, system, TicksPerSecond ,Player} from "@minecraft/server";
import {callBacks_activate,callBacks_deactivate} from './subscribe.js';
import * as gVar from './globalVars.js';
import * as fn from './functions.js';
//==============================================================================
export const watchFor = {
    validated: false,
    typeId: "minecraft:wither",
    family: "wither",
    display: "Wither",
    dynamicPropertyName: "isWither",
    commandPrefix: ":wither",
    intervalTimer: 400, // = 30 * 20,
    intervalMin: 100,
    intervalMax: (24000 / 4),
    //watchForExplosion: true,
    explosiveProjectiles: [ "minecraft:wither_skull", "minecraft:wither_skull_dangerous" ],
    boostsAllowed: false,
    boostTicks: 7200,
    boostTicksMin: 1200,
    boostTicksMax: 1200 * 20
};
//==============================================================================
export function startWatchLoop (source = "") {
    if (gVar.debug) world.sendMessage(`§9startWatchLoop (${source})`);

    //so only one is looping
    if (!world.getDynamicProperty(gVar.watchFor.dynamicPropertyName)) {
        fn.spamEmptyLines(40, world);
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
    const entities = fn.getAllEntities({ type: gVar.watchFor.family });

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
    fn.listEntities(title, entities, world);

    if (gVar.debug) world.sendMessage("§9Waiting to Loop Again");
    system.runTimeout(() => { watchLoop(source); }, gVar.watchFor.intervalTimer);
}
//==============================================================================
