//subscribes.js Tree Spider
//@ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Change Log:
    20251220 - Created
========================================================================*/
import { world, system } from "@minecraft/server";
//Shared
import { SystemSubscriptions } from "./common-stable/subscriptions/index.js";
//Local
import { alertLog, pack, packDisplayName } from './settings.js';
import { registerCustomCommands } from "./chatCmds.js";
import { arrow_onPlace,bar_onPlace,miniBlock_onPlace } from "./sub_callbacks/blockComponent.js";
import { dev } from "./debug.js";
//==============================================================================
//import { ScoreboardLib } from "./common-stable/scoreboardClass.js";

//==============================================================================
/** The function type subscribe expects. */
// System
/** @typedef {Parameters<typeof system.afterEvents.scriptEventReceive.subscribe>[0]} AfterScriptEventReceiveHandler */
/** @typedef {Parameters<typeof system.beforeEvents.startup.subscribe>[0]} BeforeStartupHandler */
//==============================================================================
const debugOn = false || dev.debugOn;
const systemSubs = new SystemSubscriptions(packDisplayName, true);
//==============================================================================
/** @type {BeforeStartupHandler} */
const onBeforeStartup = (event) => {
    const ccr = event.customCommandRegistry;
    registerCustomCommands(ccr);

    event.blockComponentRegistry.registerCustomComponent(
        'dw623:on_place_arrow', { beforeOnPlayerPlace: e => { arrow_onPlace(e); } }
    );

    event.blockComponentRegistry.registerCustomComponent(
        'dw623:on_place_bar', { beforeOnPlayerPlace: e => { bar_onPlace(e); } }
    );

    event.blockComponentRegistry.registerCustomComponent(
        'dw623:on_place_mini_block', { beforeOnPlayerPlace: e => { miniBlock_onPlace(e); } }
    );
};

//==============================================================================
export function subscriptionsStable () {
    const _name = 'function subscriptionsStable';
    dev.alertLog(`§v* ${_name} ()`, dev.debugFunctions.subscriptionsStable);

    systemSubs.register({        
        beforeStartup: onBeforeStartup
    });


    world.afterEvents.worldLoad.subscribe((event) => {
        pack.worldLoaded = true;
        dev.alertSuccess(`Subscribed to world.afterEvents.worldLoad`, dev.debugEvents.system.afterWorldLoad);

        if (debugOn) {
            entitySubs.register({
                afterEntityDie: onAfterEntityDie,
                //afterEntitySpawn:onAfterEntitySpawn_debug,  redundant but keep code
                beforeEntityRemoved: onBeforeEntityRemoved
            }, dev.debugSubscriptionsOn);
        }
    });

}
//==============================================================================
// End of File
//==============================================================================