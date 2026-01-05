// elementBlocks.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T. (https://www.gnu.org/licenses/gpl-3.0.html)
URL: https://github.com/DrinkWater623
========================================================================
TODO: 

// ========================================================================
Change Log:
    20260104 - Created
========================================================================*/
import { Blocks, BlockTypeIds } from "../common-stable/gameObjects/index.js";
// ========================================================================
/**
 * Element-specific block groups (cached + registry-safe).
 * DO NOT call these getters at module top-level during startup.
 */
// ========================================================================
export class ElementBlocks {
    //========================
    // Cached Sets / Arrays
    //========================
    static #airElementShelterBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #airElementShelterBlockTypeIds = /** @type {string[] | null} */ (null);

    static #earthElementShelterBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #earthElementShelterBlockTypeIds = /** @type {string[] | null} */ (null);

    static #fireElementShelterBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #fireElementShelterBlockTypeIds = /** @type {string[] | null} */ (null);

    static #waterElementShelterBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #waterElementShelterBlockTypeIds = /** @type {string[] | null} */ (null);

    //========================
    // AIR
    //========================
    /** @returns {Set<string>} */
    static getAirElementShelterBlockTypeIdSet () {
        if (!this.#airElementShelterBlockTypeIdSet) {
            /** @type {string[]} */
            const a = [
                "purpur", "purpur_pillar", "end_stone", "end_stone_bricks",
                ...BlockTypeIds.getGlassBlockTypeIds(),
                ...BlockTypeIds.getLeafBlockTypeIds(),
            ];

            Blocks.addSlabVariantsInPlace(a, { verify: true, pluralHack: true });

            // De-dupe + keep stable order
            this.#airElementShelterBlockTypeIds = Array.from(new Set(a));
            this.#airElementShelterBlockTypeIdSet = new Set(this.#airElementShelterBlockTypeIds);
        }
        return this.#airElementShelterBlockTypeIdSet;
    }

    /** @returns {string[]} */
    static getAirElementShelterBlockTypeIds () {
        if (!this.#airElementShelterBlockTypeIds) this.#airElementShelterBlockTypeIds = Array.from(this.getAirElementShelterBlockTypeIdSet());
        return this.#airElementShelterBlockTypeIds;
    }

    //========================
    // EARTH
    //========================
    /** @returns {Set<string>} */
    static getEarthElementShelterBlockTypeIdSet () {
        if (!this.#earthElementShelterBlockTypeIdSet) {
            /** @type {string[]} */
            const a = [
                "bone_block", "clay", "clay_block", "dripstone_block", "gravel",
                ...BlockTypeIds.getDirtyBlockTypeIds(),
                ...BlockTypeIds.getNaturalOverworldStoneBlockTypeIds(),
                ...BlockTypeIds.getLeafBlockTypeIds(),
                ...BlockTypeIds.getOverworldLogBlockTypeIds(),
                ...BlockTypeIds.getTerracottaBlockTypeIds(),
            ];

            Blocks.addSlabVariantsInPlace(a, { verify: true, pluralHack: true });

            this.#earthElementShelterBlockTypeIds = Array.from(new Set(a));
            this.#earthElementShelterBlockTypeIdSet = new Set(this.#earthElementShelterBlockTypeIds);
        }
        return this.#earthElementShelterBlockTypeIdSet;
    }

    /** @returns {string[]} */
    static getEarthElementShelterBlockTypeIds () {
        if (!this.#earthElementShelterBlockTypeIds) this.#earthElementShelterBlockTypeIds = Array.from(this.getEarthElementShelterBlockTypeIdSet());
        return this.#earthElementShelterBlockTypeIds;
    }

    //========================
    // FIRE
    //========================
    /** @returns {Set<string>} */
    static getFireElementShelterBlockTypeIdSet () {
        if (!this.#fireElementShelterBlockTypeIdSet) {
            /** @type {string[]} */
            const a = [
                // fire related - best we can do
                "magma", "quartz_block", "gravel",
                ...BlockTypeIds.getNaturalNetherStoneBlockTypeIds(),
                ...BlockTypeIds.getNetherLogBlockTypeIds(),
                // because takes cooking (fire) to make
                ...BlockTypeIds.getCookedBuildingBlockTypeIds(),
            ];

            Blocks.addSlabVariantsInPlace(a, { verify: true, pluralHack: true });

            this.#fireElementShelterBlockTypeIds = Array.from(new Set(a));
            this.#fireElementShelterBlockTypeIdSet = new Set(this.#fireElementShelterBlockTypeIds);
        }
        return this.#fireElementShelterBlockTypeIdSet;
    }

    /** @returns {string[]} */
    static getFireElementShelterBlockTypeIds () {
        if (!this.#fireElementShelterBlockTypeIds) this.#fireElementShelterBlockTypeIds = Array.from(this.getFireElementShelterBlockTypeIdSet());
        return this.#fireElementShelterBlockTypeIds;
    }

    //========================
    // WATER
    //========================
    /** @returns {Set<string>} */
    static getWaterElementShelterBlockTypeIdSet () {
        if (!this.#waterElementShelterBlockTypeIdSet) {
            /** @type {string[]} */
            const a = [
                ...BlockTypeIds.getUnderWaterBlockTypeIds(),
                ...BlockTypeIds.getColdBlockTypeIds(),
                ...BlockTypeIds.getDeadCoralBlockTypeIds(),
                ...BlockTypeIds.getConcreteBlockTypeIds(),
                "mud",
            ];

            // remove ice specifically
            for (let i = a.length - 1; i >= 0; i--) {
                const s = String(a[ i ] ?? "").trim();
                if (s === "minecraft:ice" || s === "ice") a.splice(i, 1);
            }

            Blocks.addSlabVariantsInPlace(a, { verify: true, pluralHack: true });

            // Safety: make sure ice didn’t sneak back via normalization or aliases (paranoia is a virtue)
            const deduped = Array.from(new Set(a)).filter(b => b !== "minecraft:ice");

            this.#waterElementShelterBlockTypeIds = deduped;
            this.#waterElementShelterBlockTypeIdSet = new Set(deduped);
        }
        return this.#waterElementShelterBlockTypeIdSet;
    }

    /** @returns {string[]} */
    static getWaterElementShelterBlockTypeIds () {
        if (!this.#waterElementShelterBlockTypeIds) this.#waterElementShelterBlockTypeIds = Array.from(this.getWaterElementShelterBlockTypeIdSet());
        return this.#waterElementShelterBlockTypeIds;
    }

    //========================
    // Convenience helper
    //========================
    /**
     * @param {"air"|"earth"|"fire"|"water"} element
     * @returns {string[]}
     */
    static getElementShelterBlockTypeIds (element) {
        switch (element) {
            case "air": return this.getAirElementShelterBlockTypeIds();
            case "earth": return this.getEarthElementShelterBlockTypeIds();
            case "fire": return this.getFireElementShelterBlockTypeIds();
            case "water": return this.getWaterElementShelterBlockTypeIds();
        }
    }
}
