//@ts-check
import { world } from "@minecraft/server";
import { dev, alertLog } from './settings.js';
import { block_registerCustomComponents } from "./events/blockComponentRegistry.js";
//==============================================================================
export function beforeEvents_worldInitialize () {   

    alertLog.success("Subscribing to§r world.beforeEvents.worldInitialize - §aStable",dev.debugSubscriptions)

    world.beforeEvents.worldInitialize.subscribe((event) => {
        block_registerCustomComponents(event)        
    });
}
//==============================================================================    