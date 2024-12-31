//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
import { world } from "@minecraft/server";
import { dev, alertLog } from './settings.js';
import { CutCopperOxidationBlockComponent } from "./copperOxidation/oxidizeCutCopper/index.js";
import {ScrapeableCutCopperBlockComponent} from "./copperOxidation/scrapeableCutCopper.js"
import {UnwaxableCutCopperBlockComponent} from "./copperOxidation/unwaxableCutCopper.js"
import {WaxableCutCopperBlockComponent} from "./copperOxidation/waxableCutCopper.js"
//==============================================================================
// export function beforeEvents_playerInteractWithBlock_subscribe () {

//     //This event is still beta as of 1.21.50
//     alertLog.success('Subscribing to§r world.beforeEvents.playerInteractWithBlock', dev.debugSubscriptions);

//     world.beforeEvents.playerInteractWithBlock.subscribe((event) => {

//     });
// }
//=============================================================================
export function beforeEvents_worldInitialize () {
    world.beforeEvents.worldInitialize.subscribe(( event) => {

        event.blockComponentRegistry.registerCustomComponent("dw623:cut_copper_oxidation", CutCopperOxidationBlockComponent);
        event.blockComponentRegistry.registerCustomComponent("dw623:scrapeable_cut_copper", ScrapeableCutCopperBlockComponent);
        event.blockComponentRegistry.registerCustomComponent("dw623:unwaxable_cut_copper", UnwaxableCutCopperBlockComponent);
        event.blockComponentRegistry.registerCustomComponent("dw623:waxable_cut_copper", WaxableCutCopperBlockComponent);
    });
}
// End of File
//=============================================================================