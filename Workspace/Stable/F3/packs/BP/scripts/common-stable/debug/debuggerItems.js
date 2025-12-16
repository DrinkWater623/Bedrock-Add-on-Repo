// debuggerItems.js
// @ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20250116 - Add Block from Ray Cast if different from View
    20251203 - Relocated
    20251207 - Relocated and renamed
    20251213 - Added Events and Custom Components
    20251213b- Convert to console messages only
    20251214 - Better AllOff and AnyOns
========================================================================*/
import { Player, World, ItemStack, world } from '@minecraft/server';
import { Debugger } from './debuggerClass.js';
//=============================================================================
// For Debugging
/**
 * Creates a new Debug object
 * @class
 */
export class DebuggerItems extends Debugger {
    /**
       * @constructor
       * @param {string} pack_name 
       * @param {boolean} [on=false] - default false
       */
    constructor(pack_name, on = false) {
        super(pack_name, on);

        Object.assign(this.events, {
            afterCompleteUse: false,
            afterReleaseUse: false,
            afterStartUse: false,
            afterStartUseOn: false,
            afterStopUse: false,
            afterStopUseOnt: false,
            afterUseOn: false,
            use: { before: false, after: false },
        });
        Object.assign(this.customComponents, {
            onBeforeDurabilityDamage: false,
            onConsume: false,
            onHitEntity: false,
            onMineBlock: false,
            onUse: false,
            onUseOn: false
        });
    };
    //--------------------------------------------------------------------------    
    /**
     * 
     * @param {ItemStack} item      
     * @param {string} title 
     * @param {boolean} override
     */
    itemInfo (item, title = "§eItem Info:", override = false) {
        if (!(override || this.debugOn)) return;

        if (title) this.log(title, true);
        this.log(`==> §aItem typeId:§r ${item.typeId}`);
        const tags = item.getTags();
        const lore = item.getLore();
        const components = item.getComponents().map(c => { return c.typeId; });
        const enchants = item.getComponent("enchantable")?.getEnchantments()?.map(a => `==> §bEnchantment type.id:§r ${a.type.id} §bLevel:§r ${a.level} §bof§r ${a.type.maxLevel}`);

        if (enchants && enchants.length) this.listArray(enchants, "==> §eEnchantments:§r", true);
        if (tags.length) this.listArray(tags, "==> §eTags:§r", true);
        if (lore.length) this.listArray(lore, "==> §eLore:§r", true);
        if (components.length) this.listArray(components, "==> §eComponents:§r", true);
    };
}