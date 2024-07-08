import {    
    ItemStack,
    ItemComponentTypes
} from "@minecraft/server";
import { is } from './McDebug.js';

export class ItemHas {
    static tags (item, tags = []) {
        if (!(item instanceof ItemStack)) return false;
        if (!is.arrayOfStrings(tags)) return false;

        const itemTags = item.getTags();
        return tags.every((tag) => itemTags.include(tag));
    }
    static typeIdPattern (item, typeIdPattern = "") {
        if (!(item instanceof ItemStack)) return false;
        if (!(typeof typeIdPattern)) return false;

        const regEx = new RegExp(typeIdPattern);
        return regEx.test(item.typeId);
    }
    static enchantments (item, enchantments = []) {
        if (!(item instanceof ItemStack)) return false;
        if (!is.arrayOfObjects(enchantments)) return false;

        const itemEnchants = item.getComponents(ItemComponentTypes.Enchantable);
        return enchantments.every((enchant) => itemEnchants.some(v => v.type === enchant.type && v.level >= enchant.level));
    }
}