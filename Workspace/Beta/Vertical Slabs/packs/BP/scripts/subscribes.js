//@ts-check
import { world } from "@minecraft/server";
import { dev, alertLog, chatLog, watchFor } from './settings.js';
//==============================================================================
export function beforeEvents_playerInteractWithBlock_subscribe () {

    //This event is still beta as of 1.21.50
    alertLog.success('Subscribing to§r world.beforeEvents.playerInteractWithBlock', dev.debugSubscriptions);

    world.beforeEvents.playerInteractWithBlock.subscribe((event) => {

    });
}
//=============================================================================
// End of File
//=============================================================================