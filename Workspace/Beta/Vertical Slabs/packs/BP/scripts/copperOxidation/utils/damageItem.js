//@ts-check
import { ContainerSlot, GameMode, ItemDurabilityComponent, ItemEnchantableComponent, ItemStack, Player } from "@minecraft/server";

/**
 * 
 * @param {Player} player 
 * @param {ContainerSlot} slot 
 * @param {object} [options]
 * @returns {boolean} Whether the item was successfully damaged
 */
export function damageItem (player, slot, options={ ignoreGameMode: false, ignoreDamageChance: false }) {
    if (!options?.ignoreGameMode && player.getGameMode() === GameMode.creative)
        return false;

    let itemStack = slot.getItem();
    if (!itemStack) return false;

    const durability = itemStack.getComponent("durability");
    if (!durability) return false;

    if (!options.ignoreDamageChance) {
        const enchantable = itemStack.getComponent("enchantable");
        const unbreakingLevel = enchantable?.getEnchantment("unbreaking")?.level;

        const damageChance = durability.getDamageChance(unbreakingLevel) / 100;

        if (Math.random() > damageChance) return false;
    }

    const shouldBreak = durability.damage === durability.maxDurability;

    if (shouldBreak) {
        player.playSound("random.break");
        slot.setItem(undefined);
    } else {
        durability.damage++;
        slot.setItem(itemStack);
    }

    return true;
}
