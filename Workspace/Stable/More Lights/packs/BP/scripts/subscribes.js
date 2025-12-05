//subscribes.js
//@ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20251023 - add in stable stuff and update to api 2.0 and move debug-only stuff out
========================================================================*/
import { world, system } from "@minecraft/server";
//Subscriptions
// import { PlayerBreakBlockAfterEvent, PlayerBreakBlockAfterEventSignal } from "@minecraft/server";
// import { PlayerInteractWithBlockAfterEvent, PlayerInteractWithBlockAfterEventSignal } from "@minecraft/server";
// import { PlayerInteractWithBlockBeforeEvent, PlayerInteractWithBlockBeforeEventSignal } from "@minecraft/server";
//import { PlayerPlaceBlockAfterEvent, PlayerPlaceBlockAfterEventSignal } from "@minecraft/server";
//Shared
import { Vector2Lib, Vector3Lib } from "./common-stable/tools/vectorClass.js";
import { FaceLocationGrid, } from "./common-stable/blocks/blockFace.js";
import { PlayerSubscriptions } from "./common-stable/subscriptions/playerSubs-stable.js";
import { SystemSubscriptions } from "./common-stable/subscriptions/systemSubs-stable.js";
//Local
import { alertLog, chatLog, pack, packDisplayName, watchFor } from './settings.js';
import { devDebug } from "./helpers/fn-debug.js";
import { lightArrow_onPlace, lightBar_onPlace, lightMiniBlock_onPlace } from "./blockComponent.js";
import { registerCustomCommands } from "./chatCmds.js";
//==============================================================================
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** The function type subscribe expects. */
//  Blocks
/** @typedef {Parameters<typeof world.beforeEvents.playerInteractWithBlock.subscribe>[0]} BeforePlayerInteractWithBlockHandler */
/** @typedef {Parameters<typeof world.beforeEvents.playerPlaceBlock.subscribe>[0]} BeforePlayerPlaceBlockHandler */
// System
/** @typedef {Parameters<typeof system.beforeEvents.startup.subscribe>[0]} BeforeStartupHandler */
//==============================================================================
const debugOn = false || devDebug.debugOn;
const debugFunctionsOn = false || devDebug.debugFunctionsOn;
const debugSubscriptionsOn = devDebug.debugSubscriptionsOn;
//==============================================================================
const playerSubs = new PlayerSubscriptions(packDisplayName, debugSubscriptionsOn);
const systemSubs = new SystemSubscriptions(packDisplayName, debugSubscriptionsOn);
//==============================================================================
/** @type {BeforeStartupHandler} */
const onBeforeStartup = (event) => {
    const ccr = event.customCommandRegistry;
    registerCustomCommands(ccr);

    event.blockComponentRegistry.registerCustomComponent(
        'dw623:on_place_arrow', { beforeOnPlayerPlace: e => { lightArrow_onPlace(e); } }
    );

    event.blockComponentRegistry.registerCustomComponent(
        'dw623:on_place_bar', { beforeOnPlayerPlace: e => { lightBar_onPlace(e); } }
    );

    event.blockComponentRegistry.registerCustomComponent(
        'dw623:on_place_mini_block', { beforeOnPlayerPlace: e => { lightMiniBlock_onPlace(e); } }
    );
};
//==============================================================================
/** @type {BeforePlayerInteractWithBlockHandler} */
const onBeforePlayerInteract = (event) => {
    event.cancel = false;
    if (!event.isFirstEvent) return;

    const player = event.player;
    if (!player || !player.isValid) return;

    const itemStack = event.itemStack;
    if (!itemStack) return;
    if (!watchFor.onPlaceBlockList().includes(itemStack.typeId)) return;

    const { block } = event;
    //later verify okay block to place on - maybe

    const { typeId, location } = block;
    const itemStackBlock = itemStack.typeId;
    const faceLocation = event.faceLocation;

    //save this to player for the custom component to verify/use
    player.setDynamicProperty('dw623:lastInteractBlockLocation', location);
    player.setDynamicProperty('dw623:lastInteractFaceLocation', faceLocation);
    player.setDynamicProperty('dw623:lastInteractItemStack', itemStackBlock);
    return;   
};
//==============================================================================
export function subscriptionsStable () {
    const _name = 'function subscriptionsStable';
    alertLog.log(`§v* ${_name} ()`, debugFunctionsOn);

    //2 ways to do it.  Use register for bulk tho
    systemSubs.register({ beforeStartup: onBeforeStartup });
    playerSubs.beforePlayerInteractWithBlock.subscribe(onBeforePlayerInteract);

    world.afterEvents.worldLoad.subscribe((event) => {
        pack.worldLoaded = true;
        alertLog.success(`Subscribed to world.afterEvents.worldLoad`, debugSubscriptionsOn);
        if (debugOn) {
        }
    });

    alertLog.log(`'§8x ${_name} ()'`, debugFunctionsOn);
}
//==============================================================================
// End of File
//==============================================================================