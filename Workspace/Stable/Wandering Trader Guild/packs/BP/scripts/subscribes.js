//subscribes.js  Wandering Trader Guild
//@ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T.
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20251203 - Created
    20251204 - Adding script events to provide names
========================================================================*/
import { world, system } from "@minecraft/server";
//Shared
import { SystemSubscriptions } from "./common-stable/subscriptions/systemSubs-stable.js";
//Local
import { alertLog, chatLog, pack, packDisplayName, watchFor } from './settings.js';
import { registerCustomCommands } from "./chatCmds.js";
import { devDebug } from "./helpers/fn-debug.js";
import { entityEventProcess } from "./helpers/fn-entities.js";
//==============================================================================
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
// System
/** @typedef {Parameters<typeof system.afterEvents.scriptEventReceive.subscribe>[0]} AfterScriptEventReceiveHandler */
/** @typedef {Parameters<typeof system.beforeEvents.startup.subscribe>[0]} BeforeStartupHandler */
//==============================================================================
const debugOn = false || devDebug.debugOn;
const debugFunctionsOn = false || devDebug.debugFunctionsOn;
const debugSubscriptionsOn = devDebug.debugSubscriptionsOn;
//==============================================================================
/** @type {AfterScriptEventReceiveHandler} */
const onAfterScriptEventReceive = (event) => {
    const { id, message, sourceEntity: entity } = event;

    if (!entity || !entity.isValid) {
        return;
    };
    if (!watchFor.packEntityList.includes(entity.typeId)) {
        //chatLog.log(`not my e: ${entity.typeId}`)
        return;
    };
    //chatLog.success(`${entity.typeId} - ${event.id}`,debugOn)

    system.runTimeout(() => {
        entityEventProcess(entity, id, message);
    }, 1);
};
//==============================================================================
/** @type {BeforeStartupHandler} */
const onBeforeStartup = (event) => {
    const ccr = event.customCommandRegistry;
    registerCustomCommands(ccr);
};
//==============================================================================
const systemSubs = new SystemSubscriptions(packDisplayName, debugSubscriptionsOn);
//==============================================================================
export function subscriptionsStable () {
    const _name = 'function subscriptionsStable';
    alertLog.log(`§v* ${_name} ()`, debugFunctionsOn);

    systemSubs.register({
        afterScriptEventReceive: onAfterScriptEventReceive,
        beforeStartup: onBeforeStartup
    });

    world.afterEvents.worldLoad.subscribe((event) => {
        pack.worldLoaded = true;
        alertLog.success(`Subscribed to world.afterEvents.worldLoad`, debugSubscriptionsOn);
    });
}
//==============================================================================
// End of File
//==============================================================================