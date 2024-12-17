//@ts-check
import { world } from "@minecraft/server";
import { alertLog, dev, pack, toggles } from "./settings.js";
import * as pbb from "./events/playerBreakBlock.js";
import * as f3 from './fn-stable.js';
//==============================================================================
/**
 * Capture information on the block interacted with
 * 
 * After events does not give all of the information, so capture to player
 * and info on last interaction can be grabbed by the after event, or itemUseOn
 */
//==============================================================================
export function masterDevDebugInitialize () {
    if (dev.debug) {
        for (let key in Object.keys(dev)) {
            dev[ key ] = true;
        }
    }
    pack.isLoadAlertsOn = pack.isLoadAlertsOn || dev.debugPackLoad;
}
//==============================================================================
export function main_stable () {
    if (pack.isBeta != 1) {
        pack.isBeta = 0
        masterDevDebugInitialize();
    }

    world.afterEvents.playerSpawn.subscribe((event) => {
        f3.playerF3Initialize(event.player);
    });

    alertLog.success("§aInstalling beforeEvents.playerBreakBlock §gSTABLE", dev.debugSubscriptions);
    world.beforeEvents.playerBreakBlock.subscribe((event) => {
        if (toggles.pbb_b4)
            pbb.playerBreakBlock_before_show(event);
    });

    alertLog.success("§aInstalling afterEvents.playerBreakBlock §gSTABLE", dev.debugSubscriptions);
    world.afterEvents.playerBreakBlock.subscribe((event) => {
        if (toggles.pbb_aft)
            pbb.playerBreakBlock_after_show(event);
    });
    //==============================================================================
}