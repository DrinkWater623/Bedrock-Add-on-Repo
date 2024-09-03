//@ts-check
import {
    //system,
    //Player,
    world
} from "@minecraft/server";

//import { Vector3Lib as vec3 } from './commonLib/vectorClass.js';
//import { Debug } from './commonLib/mcDebugClass.js';
import * as f3 from './f3.js';
//==============================================================================
//const debug = new Debug("F3", true, world);
//==============================================================================
/**
 * Capture information on the block interacted with
 * 
 * After events does not give all of the information, so capture to player
 * and info on last interaction can be grabbed by the after event, or itemUseOn
 */

//==============================================================================
console.warn("§aInstalling beforeEvents.playerBreakBlock §gSTABLE");
world.beforeEvents.playerBreakBlock.subscribe((event) => {
    f3.playerBreakBlock_before_show(event);
});
console.warn("§aInstalling afterEvents.playerBreakBlock §gSTABLE");
world.afterEvents.playerBreakBlock.subscribe((event) => {
    f3.playerBreakBlock_after_show(event);
});
//==============================================================================
