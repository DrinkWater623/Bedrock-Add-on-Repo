//@ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20250116 - reOrg
========================================================================*/
import { BlockComponentRegistry } from "@minecraft/server";
import { CutCopperOxidationBlockComponent } from "../copperOxidation/oxidizeCutCopper/index.js";
import { ScrapeableCutCopperBlockComponent } from "../copperOxidation/scrapeableCutCopper.js";
import { UnwaxableCutCopperBlockComponent } from "../copperOxidation/unwaxableCutCopper.js";
import { WaxableCutCopperBlockComponent } from "../copperOxidation/waxableCutCopper.js";
//=============================================================================
/**
 * 
 * @param {BlockComponentRegistry} event 
 */
export function blockComponentRegistries (event) {
        event.registerCustomComponent("dw623:cut_copper_oxidation", CutCopperOxidationBlockComponent);
        event.registerCustomComponent("dw623:scrapeable_cut_copper", ScrapeableCutCopperBlockComponent);
        event.registerCustomComponent("dw623:unwaxable_cut_copper", UnwaxableCutCopperBlockComponent);
        event.registerCustomComponent("dw623:waxable_cut_copper", WaxableCutCopperBlockComponent);
}
//=============================================================================// End of File
//=============================================================================