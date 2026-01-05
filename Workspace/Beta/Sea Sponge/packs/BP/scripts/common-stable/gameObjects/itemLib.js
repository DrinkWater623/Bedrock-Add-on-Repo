// itemLib
// @ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T.
URL: https://github.com/DrinkWater623
========================================================================
Change Log:
    20250105b - Created
    20251203 - Relocated
    20251231 - Renamed
    20260104 - added Items Class - similar to Blocks for the cached list part
========================================================================*/
import { Block, ItemStack, ItemTypes,system } from "@minecraft/server";
import { addNameSpace,  dedupeArrayInPlace } from "../tools/objects.js";
import { mcNameSpace } from "../../common-data/globalConstantsLib.js";
//================================================================================================
export class Items {
    //================================================================================================
    // Cached Sets and Arrays - Built below
    static #validItemTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #validVanillaItemTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #validCustomItemTypeIdSet = /** @type {Set<string> | null} */ (null);

    static #validItemTypeIds = /** @type {string[] | null} */ (null);
    static #validVanillaItemTypeIds = /** @type {string[] | null} */ (null);
    static #validCustomItemTypeIds = /** @type {string[] | null} */ (null);
    //================================================================================================
    /**
     * Cached set of item type ids available in this world.
     * (Includes whatever the world has registered — vanilla + any custom types it exposes.)
     * @returns {Set<string>}
     */
    static getValidItemTypeIdSet () {
        if (!this.#validItemTypeIdSet) {
            this.#validItemTypeIdSet = new Set(ItemTypes.getAll().map(bt => bt.id));
        }
        return this.#validItemTypeIdSet;
    }
    /**
     * Cached set of item type ids available in this world.
     * (Includes whatever the world has registered — vanilla + any custom types it exposes.)
     * @returns {string[]}
     */
    static getValidItemTypeIds () {
        if (!this.#validItemTypeIds) {
            this.#validItemTypeIds = Array.from(this.getValidItemTypeIdSet());
        }
        return this.#validItemTypeIds;
    }
    /**
     * Cached set of item type ids available in this world.
     * @returns {Set<string>}
     */
    static getValidVanillaItemTypeIdSet () {
        if (!this.#validVanillaItemTypeIdSet) {
            this.#validVanillaItemTypeIdSet = new Set(Array.from(this.getValidItemTypeIdSet()).filter(b => b.startsWith(mcNameSpace)));
        }
        return this.#validVanillaItemTypeIdSet;
    }
    /**
    * Cached set of item type ids available in this world.
    * @returns {string[]}
    */
    static getValidVanillaItemTypeIds () {
        if (!this.#validVanillaItemTypeIds) {
            this.#validVanillaItemTypeIds = Array.from(this.getValidVanillaItemTypeIdSet());
        }
        return this.#validVanillaItemTypeIds;
    }
    /**
     * Cached set of item type ids available in this world.
     * @returns {Set<string>}
     */
    static getValidCustomItemTypeIdSet () {
        if (!this.#validCustomItemTypeIdSet) {
            this.#validCustomItemTypeIdSet = new Set(Array.from(this.getValidItemTypeIdSet()).filter(b => !b.startsWith(mcNameSpace)));
        }
        return this.#validCustomItemTypeIdSet;
    }
    /**
    * Cached set of item type ids available in this world.
    * @returns {string[]}
    */
    static getValidCustomItemTypeIds () {
        if (!this.#validCustomItemTypeIds) {
            this.#validCustomItemTypeIds = Array.from(this.getValidCustomItemTypeIdSet());
        }
        return this.#validCustomItemTypeIds;
    }
    //=============
    /* Utilities */
    //=============
    /**
     * @param {string} typeId
     * @returns {boolean}
     */
    static isValidItemTypeId (typeId) {
        return this.getValidItemTypeIdSet().has(typeId);
    }
    /**
     * @param {any} input 
     * @returns 
     */
    static isItem (input) { return (input)?.permutation !== undefined; }
    /**
     * @param {ItemStack} item 
     * @returns {boolean}
     */
    static isValid (item) {
        return !(!item || !this.isValidItemTypeId(item.typeId));
    }
    /**
     * @param {ItemStack} item 
     * @returns {boolean}
     */
    static isInValid (item) {
        return !this.isValid(item);
    }
    /**
     * 
     * @param {ItemStack} item_1 
     * @param {ItemStack} item_2 
     * @returns {boolean}
     */
    static isSameItem (item_1, item_2) {
        if (!this.isValidItemTypeId(item_1.typeId) ) return false;
        if (!this.isValidItemTypeId(item_2.typeId) ) return false;
        return (item_1.typeId == item_2.typeId) 
    }
    //================================================================================================
    /**
     * Normalize ids in-place (optional namespacing) + de-dupe.
     * Your rule: if verify is true, namespacing must be true.
     *
     * @param {string[]} a
     * @param {{ addNamespace?: boolean, verify?: boolean, removeEmpty?: boolean }} [opts]
     * @returns {string[]}
     */
    static normalizeItemIdsInPlace (a, opts = {}) {
        const verify = opts.verify ?? false;
        const addNamespace = (opts.addNamespace ?? true) || verify;
        const removeEmpty = opts.removeEmpty ?? true;

        // One pass: trim + optional removeEmpty + optional namespace
        let w = 0;
        for (let i = 0; i < a.length; i++) {
            let s = String(a[ i ] ?? "").trim();
            if (removeEmpty && !s) continue;
            if (addNamespace) s = addNameSpace(s); // or addNameSpaceInPlace if you prefer two-pass
            if (verify) { if(!this.getValidCustomItemTypeIdSet().has(s)) continue}

            a[ w++ ] = s;
        }
        a.length = w;

        dedupeArrayInPlace(a);

        return a;
    }
    /**
     * Filter invalid ids in-place using current-world registry.
     * @param {string[]} a
     * @returns {string[]}
     */
    static filterValidItemTypeIdsInPlace (a) {
        this.normalizeItemIdsInPlace(a, { addNamespace: true, verify: false, removeEmpty: true });
        return this.purgeInvalidItemTypeIdsInPlace_auto(a);
    }
    /**
     * Purge invalid item typeIds in-place (FAST).
     * Does NOT normalize, namespace, or dedupe.
     *
     * @param {string[]} a
     * @param {Set<string>} validSet  // usually Items.getValidItemTypeIdSet()
     * @returns {string[]} same array instance
     */
    static purgeInvalidItemTypeIdsInPlace (a, validSet) {
        let w = 0;
        for (let r = 0; r < a.length; r++) {
            const id = a[ r ];
            if (validSet.has(id)) a[ w++ ] = id;
        }
        a.length = w;
        return a;
    }
    /**
     * Purge invalid item typeIds in-place (FAST).
     * Uses cached valid set.
     *
     * @param {string[]} a
     * @returns {string[]}
     */
    static purgeInvalidItemTypeIdsInPlace_auto (a) {
        return this.purgeInvalidItemTypeIdsInPlace(a, this.getValidItemTypeIdSet());
    }
    //================================================================================================       
}
//=============================================================================
//==============================================================================
/**
 * 
 * @param {Block} block 
 * @param {string } lootTypeID
 * @param {number} [count=1] 
 * @returns 
 */
export function spawnLoot (block, lootTypeID, count = 1) {
    if (count < 1) return;

    let itemStack = new ItemStack(lootTypeID, count);
    system.run(() => {
        block.dimension.spawnItem(itemStack, block.center());
    })
}
//==============================================================================
// End of File
//==============================================================================