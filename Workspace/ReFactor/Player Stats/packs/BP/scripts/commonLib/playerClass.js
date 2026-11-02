//@ts-check
/**
 * Created by DrinkWater623
 * 
 * Change Log:
 *  20240831 - Created
 */
import { Player, Block ,EquipmentSlot} from '@minecraft/server';
//=============================================================================
export class PlayerLib {
    //=============================================================================
    /**
     * 
     * @param {Block} block 
     * @param {Player} player 
     * @returns {boolean}
     */
    static isPlayerHoldingBlock (block, player) {
        return PlayerLib.isPlayerHoldingTypeId(block.typeId, player);
    };
    /**
     * 
     * @param {string} typeId 
     * @param {Player} player 
     * @returns {boolean}
     */
    static isPlayerHoldingTypeId (typeId, player) {
        const equipment = player.getComponent('equippable');
        const selectedItem = equipment?.getEquipment(EquipmentSlot.Mainhand);
        return selectedItem?.typeId === typeId;
    };

    //TODO: add playerHas
}