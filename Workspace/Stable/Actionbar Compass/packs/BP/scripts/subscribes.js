//subscribes.js
//@ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20251130 - Refactor to new way of doing things
========================================================================*/
import { world, system } from "@minecraft/server";
//Local
import { alertLog, pack, packDisplayName } from './settings.js';
import { registerCustomCommands } from "./chatCmds.js";
import { devDebug } from "./helpers/fn-debug.js";
import { tagToggle,runABC } from "./helpers/functions.js";
import { SystemSubscriptions } from "./common-stable/subscriptions/systemSubs-stable.js";
import { PlayerSubscriptions } from "./common-stable/subscriptions/playerSubs-stable.js";
//==============================================================================
/** The function type subscribe expects. */
// System
/** @typedef {Parameters<typeof system.beforeEvents.startup.subscribe>[0]} BeforeStartupHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerSpawn.subscribe>[0]} AfterPlayerSpawnHandler */
//==============================================================================
const debugOn = false || devDebug.debugOn;
const debugFunctionsOn = false || devDebug.debugFunctionsOn;
const debugSubscriptionsOn = devDebug.debugSubscriptionsOn;
//============================================================================
const systemSubs = new SystemSubscriptions(packDisplayName, debugSubscriptionsOn);
const playerSubs = new PlayerSubscriptions(packDisplayName, debugSubscriptionsOn);
//============================================================================
/** @type {BeforeStartupHandler} */
const onBeforeStartup = (event) => {
    const ccr = event.customCommandRegistry;
    registerCustomCommands(ccr);
};
//============================================================================
/** @type {AfterPlayerSpawnHandler} */
const onPlayerSpawn = (event) => {

    //once
    if (pack.worldLoaded = 1) {
        if (!pack.gameRuleShowCoordinates && world.gameRules.showCoordinates) {
            pack.worldLoaded = 2;
            system.run(() => { world.gameRules.showCoordinates = false; });
        }
    }

    const initializedTag = pack.cmdNameSpace + 'Initialized';
    if (!event.player.hasTag(initializedTag)) {
        system.runTimeout(() => {
            event.player.addTag(initializedTag);

            //everyone starts with this.
            if (pack.newPlayer_Settings.auto_on.compass) {
                event.player.addTag(pack.tags.compassTag);
                event.player.setDynamicProperty(pack.tags.compassTag, true);
            }
            else
                event.player.setDynamicProperty(pack.tags.compassTag, false);

            if (pack.newPlayer_Settings.auto_on.xyz || world.gameRules.showCoordinates == false) {
                event.player.addTag(pack.tags.xyzTag);
                event.player.setDynamicProperty(pack.tags.xyzTag, true);
            }
            else
                event.player.setDynamicProperty(pack.tags.xyzTag, false);

            if (pack.newPlayer_Settings.auto_on.velocity) {
                event.player.addTag(pack.tags.velocityTag);
                event.player.setDynamicProperty(pack.tags.velocityTag, true);
            }
            else
                event.player.setDynamicProperty(pack.tags.velocityTag, false);

        }, pack.loadDelay);
    }
    else if (!world.gameRules.showCoordinates && !event.player.hasTag(pack.tags.xyzTag))
        tagToggle(event.player, pack.tags.xyzTag, 'XYZ Coordinates');
};
//==============================================================================
export function subscriptionsStable () {
    const _name = 'function subscriptionsStable';
    alertLog.log(`§v* ${_name} ()`, debugFunctionsOn);

    systemSubs.beforeStartup.subscribe(onBeforeStartup);
    playerSubs.afterPlayerSpawn.subscribe(onPlayerSpawn);

    world.afterEvents.worldLoad.subscribe((event) => {
        pack.worldLoaded = 1;

        system.runTimeout(() => {
            runABC();
        }, pack.loadDelay);

    });

    alertLog.success(`Subscribed to world.afterEvents.worldLoad`, debugSubscriptionsOn);
}
//==============================================================================
// End of File
//==============================================================================