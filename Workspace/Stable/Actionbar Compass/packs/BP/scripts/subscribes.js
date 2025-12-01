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
import { world, system, TicksPerSecond } from "@minecraft/server";
//Local
import { alertLog, pack } from './settings.js';
import { registerCustomCommands } from "./chatCmds.js";
import { devDebug } from "./helpers/fn-debug.js";
import { display, tagToggle } from "./helpers/functions.js";
//==============================================================================
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** The function type subscribe expects. */
// System
/** @typedef {Parameters<typeof system.beforeEvents.startup.subscribe>[0]} BeforeStartupHandler */
/** @typedef {Parameters<typeof world.afterEvents.playerSpawn.subscribe>[0]} AfterPlayerSpawnHandler */

/** The stored handle type (Bedrock returns the function reference). */
// system
/** @typedef {ReturnType<typeof system.beforeEvents.startup.subscribe>} BeforeStartupHandle */
/** @typedef {ReturnType<typeof world.afterEvents.playerSpawn.subscribe>} AfterPlayerSpawnHandle */

//==============================================================================
const debugOn = false || devDebug.debugOn;
const debugFunctionsOn = false || devDebug.debugFunctionsOn;
const debugSubscriptionsOn = devDebug.debugSubscriptionsOn;
const debugChatCmds = devDebug.debugChatCmds;
const watchPlayerActions = devDebug.watchPlayerActions;
//============================================================================
const worldAfterEventsSubscriptions = {
    _name: 'worldAfterEventsSubscriptions',
    //============
    // To override
    debugMe: false,
    watchMe: false,
    //============           
    playerSpawn: {
        _name: 'worldAfterEventsSubscriptions.playerSpawn',
        _subscription: 'world.afterEvents.playerSpawn',
        //============
        // To override This
        debugMe: false,
        watchMe: false,
        //============
        on: false,
        /** @type {AfterPlayerSpawnHandle | null} */
        handler: null,

        subscribe (debug = false, watch = false) {
            const debugMe = debug || this.debugMe;
            const watchMe = watch || this.watchMe;
            alertLog.log(`* ${this._name}.subscribe ()`, debugFunctionsOn);
            if (this.on) return;

            /** @type {AfterPlayerSpawnHandler} */
            const fn = (event) => {

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
                        if (pack.newPlayer_Settings.auto_on.compass)
                            event.player.addTag(pack.tags.compassTag);

                        if (pack.newPlayer_Settings.auto_on.xyz || world.gameRules.showCoordinates == false) {
                            event.player.addTag(pack.tags.xyzTag);
                        }

                        if (pack.newPlayer_Settings.auto_on.velocity)
                            event.player.addTag(pack.tags.velocityTag);

                    }, pack.loadDelay);
                }
                else if (!world.gameRules.showCoordinates && !event.player.hasTag(pack.tags.xyzTag))
                    tagToggle(event.player, pack.tags.xyzTag, 'XYZ Coordinates');
            };

            this.handler = world.afterEvents.playerSpawn.subscribe(fn);
            this.on = true;
            alertLog.success(`§aSubscribed to ${this._subscription}`, debugMe);
        },
        unsubscribe () {
            alertLog.warn(`* ${this._name}.unsubscribe ()`);  //Should not happen 
            if (!this.on) return;

            if (this.handler) {
                world.afterEvents.playerSpawn.unsubscribe(this.handler);
                this.handler = null;
                alertLog.success(`§aUnsubscribed to ${this._subscription}`);
            }
            this.on = false;
        }
    }
};
//============================================================================
const systemSubscriptions = {
    _name: 'systemSubscriptions',
    //============
    // To override
    debugMe: false,
    watchMe: false,
    //============           
    beforeStartup: {
        _name: 'systemSubscriptions.beforeStartup',
        _subscription: 'system.beforeEvents.startup',
        //============
        // To override This
        debugMe: false,
        watchMe: false,
        //============
        on: false,
        /** @type {BeforeStartupHandle | null} */
        handler: null,

        subscribe (debug = false, watch = false) {
            const debugMe = debug || this.debugMe;
            const watchMe = watch || this.watchMe;
            alertLog.log(`* ${this._name}.subscribe ()`, debugFunctionsOn);
            if (this.on) return;

            /** @type {BeforeStartupHandler} */
            const fn = (event) => {
                const ccr = event.customCommandRegistry;
                registerCustomCommands(ccr);
            };

            this.handler = system.beforeEvents.startup.subscribe(fn);
            this.on = true;
            alertLog.success(`§aSubscribed to ${this._subscription}`, debugMe);
        },
        unsubscribe () {
            alertLog.warn(`* ${this._name}.unsubscribe ()`);  //Should not happen 
            if (!this.on) return;

            if (this.handler) {
                system.beforeEvents.startup.unsubscribe(this.handler);
                this.handler = null;
                alertLog.success(`§aUnsubscribed to ${this._subscription}`);
            }
            this.on = false;
        }
    }
};
//==============================================================================
export function subscriptionsStable () {
    const _name = 'function subscriptionsStable';
    alertLog.log(`§v* ${_name} ()`, debugFunctionsOn);

    systemSubscriptions.beforeStartup.subscribe(debugSubscriptionsOn, false);
    worldAfterEventsSubscriptions.playerSpawn.subscribe();

    world.afterEvents.worldLoad.subscribe((event) => {
        pack.worldLoaded = 1;

        system.runTimeout(() => {
            system.runInterval(() => {
                world.getAllPlayers()
                    .filter(p =>
                        p.hasTag(pack.tags.compassTag) ||
                        p.hasTag(pack.tags.xyzTag) ||
                        p.hasTag(pack.tags.velocityTag)
                    )
                    .forEach(p => { display(p); });
            }, pack.tickDelay);
        }, pack.loadDelay);

    });

    alertLog.success(`Subscribed to world.afterEvents.worldLoad`, debugSubscriptionsOn);
}
//==============================================================================
// End of File
//==============================================================================