//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20250105a - add MainHandItemCount
========================================================================*/
import { Player, Block, EquipmentSlot, ItemStack, system } from '@minecraft/server';
//=============================================================================
export class PlayerLib {
    //=============================================================================
    //TODO: reverse Params on these 2.  Player should be first
    /**
     * 
     * @param {Block} block 
     * @param {Player} player 
     * @returns {boolean}
     */
    static isPlayerHoldingBlock (block, player) {
        return this.isPlayerHoldingTypeId(block.typeId, player);
    };
    /**
     * 
     * @param {string} typeId 
     * @param {Player} player 
     * @returns {boolean}
     */
    static isPlayerHoldingTypeId (typeId, player) {
        const holding = this.mainHandTypeId(player);
        return (holding ?? "") === typeId;
    };
    //================================================
    /**
     * 
     * @param {Player} player 
     * @returns {ItemStack | undefined}
     */
    static mainHandItemStack (player) {
        const equipment = player.getComponent('equippable');
        const selectedItem = equipment?.getEquipment(EquipmentSlot.Mainhand);
        return selectedItem;
    }
    //================================================
    /**
     * 
     * @param {Player} player 
     * @returns {string | undefined}
     */
    static mainHandTypeId (player) {
        return this.mainHandItemStack(player)?.typeId;
    }
    //TODO: add playerHas
    //================================================
    /**
     * 
     * @param {Player} player 
     * @param {boolean} [overrideCreativeMode=false] 
     * @returns {ItemStack | undefined}
     */
    static mainHandRemoveOne (player, overrideCreativeMode = false) {

        if (!overrideCreativeMode && player.getGameMode().startsWith('c'))
            return;

        const equipment = player.getComponent('equippable');
        if (!equipment)
            return;

        const selectedItem = equipment.getEquipment(EquipmentSlot.Mainhand);
        if (!selectedItem)
            return;

        const newItemStackCount = selectedItem.amount - 1;
        if (newItemStackCount >= 0) {
            system.run(() => {
                if (newItemStackCount == 0) {
                    equipment.setEquipment(EquipmentSlot.Mainhand, undefined);
                }
                else {
                    selectedItem.amount = newItemStackCount;
                }
            });
        }
    }
    //==============================================================================
    /**
     * 
     * @param {Player} player 
     * @returns {number}
     */
    static mainHandItemCount (player) {
        const equipment = player.getComponent('equippable');
        if (!equipment)
            return 0;

        const selectedItem = equipment.getEquipment(EquipmentSlot.Mainhand);
        if (!selectedItem)
            return 0;

        return selectedItem.amount;
    }
}