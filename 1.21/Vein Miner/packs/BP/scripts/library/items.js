import {
    world,
    ItemStack,
    BlockPermutation
} from "@minecraft/server";
import { McDebug } from './McDebug.js';

export function itemHas (item, typeIdRegEx = "", tags = [ "" ], enchantments = {efficiency:3}) {
    if (!(item instanceof ItemStack)) return false;

    //1) TODO: typeIdRegEx

    //2) Tags
    if (tags.length) {
        const itemTags = item.getTags()
        if (itemTags.length == 0) return false
    }

    return true;
}