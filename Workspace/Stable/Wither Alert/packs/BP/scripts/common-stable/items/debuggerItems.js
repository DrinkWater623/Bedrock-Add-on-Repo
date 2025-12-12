// debugger-Class.js
// @ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 20250116 - Add Block from Ray Cast if different from View
            20251203 - Relocated
            20251207 - Relocated and renamed
========================================================================*/
import {  Player, World, ItemStack  } from '@minecraft/server';
import { Debugger } from '../tools/debuggerClass.js';
//=============================================================================
// For Debugging
/**
 * Creates a new Debug object
 * @class
 */
export class DebuggerItems extends Debugger {       
    /**
     * 
     * @param {ItemStack} item 
     * @param {World|Player} chatSend 
     * @param {string} title 
     * @param {boolean} override
     */
    itemInfo (item, chatSend = this.chatSend, title = "§eItem Info:", override = false) {
        if (override || this.debugOn) {
            if (title) this.logPlain(title,chatSend);
            this.logPlain(`==> §aItem typeId:§r ${item.typeId}`);
            const tags = item.getTags();
            const lore = item.getLore();
            const components = item.getComponents().map(c => {return c.typeId});
            const enchants = item.getComponent("enchantable")?.getEnchantments()?.map(a => `==> §bEnchantment type.id:§r ${a.type.id} §bLevel:§r ${a.level} §bof§r ${a.type.maxLevel}`);

            if (enchants && enchants.length) this.listArray(enchants, chatSend, "==> §eEnchantments:§r");
            if(tags.length) this.listArray(tags, chatSend, "==> §eTags:§r");
            if (lore.length) this.listArray(lore, chatSend, "==> §eLore:§r");
            if (components.length) this.listArray(components, chatSend, "==> §eComponents:§r");
            
        }
    };    
}