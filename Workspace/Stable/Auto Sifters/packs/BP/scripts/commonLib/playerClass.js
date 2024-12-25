//@ts-check
/**
 * Created by DrinkWater623
 * 
 * Change Log:
 *  20240831 - Created
 *  20241206 - Added mainHandTypeId, mainHandItemStack and used those in the other functions
 *  20241209 - Add overrideCreativeMode to mainHandRemoveOne
 */
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
    static mainHandRemoveOne (player,overrideCreativeMode=false) {

        if (!overrideCreativeMode && player.getGameMode().startsWith('c'))
            return

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
}