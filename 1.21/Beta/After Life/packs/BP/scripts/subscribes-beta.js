//@ts-check
import { world, system, EntityInitializationCause } from "@minecraft/server";
import { alertLog, dev, watchFor, chatLog, entityEvents } from './settings.js';
import { chatSend_before_fn } from './chatCmds-beta.js';
import { enterWeb, expandWeb } from './fn-beta.js';
import { placeWeb, newEgg, lastTickRegister } from './fn-stable.js';
import { Vector3Lib } from "./commonLib/vectorClass.js";
import { EntityLib } from "./commonLib/entityClass.js";
import { DynamicPropertyLib } from "./commonLib/dynamicPropertyClass.js";
import { BiomeLib } from "./commonLib/biomeLib.js";

//==============================================================================
/**
 * @summary Beta
 */
export function chatSend () {
    alertLog.success(`§aInstalling Chat Commands (before)§r - §6Beta  §c(Debug Mode)§r`, dev.debugSubscriptions);
    world.beforeEvents.chatSend.subscribe((event) => {
        chatSend_before_fn(event);
    });
}
//==============================================================================
/**
 * @summary Beta: enterWeb/expandWeb
 */
export function afterEvents_scriptEventReceive () {

    alertLog.success("§aInstalling afterEvents.scriptEventReceive §c(Debug Mode)", dev.debugSubscriptions);
    
}
//==============================================================================