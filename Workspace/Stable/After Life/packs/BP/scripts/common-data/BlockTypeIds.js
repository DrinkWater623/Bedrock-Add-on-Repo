// BlockTypeIds.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T.
URL: https://github.com/DrinkWater623
========================================================================
Change Log:
    20260112 - Move BlockTypeIds out to own file and back to data
*/
//==============================================================================
import { BlockTypes, ItemTypes } from "@minecraft/server";
import { ItemTypeIds } from "../common-stable/gameObjects/itemLib";
import { addNameSpace, dedupeArrayInPlace } from "../common-stable/tools/objects";
import { mcNameSpace } from "./globalConstantsLib";
//==============================================================================
export class BlockTypeIds {
    //========================================
    /* Cached Sets and Arrays - Built below */
    //========================================

    // ALL
    static #validBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #validBlockTypeIds = /** @type {string[] | null} */ (null);

    //Vanilla Only
    static #validVanillaBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #validVanillaBlockTypeIds = /** @type {string[] | null} */ (null);

    //Custom from Add-ons
    static #validCustomBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #validCustomBlockTypeIds = /** @type {string[] | null} */ (null);

    // Dirty / nature
    static #dirtyBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #dirtyBlockTypeIds = /** @type {string[] | null} */ (null);

    static #naturalBlockTypeIds = /** @type {string[] | null} */ (null);
    static #naturalBlockTypeIdSet = /** @type {Set<string> | null} */ (null);

    static #naturalDirtyBlockTypeIds = /** @type {string[] | null} */ (null);
    static #naturalDirtyBlockTypeIdSet = /** @type {Set<string> | null} */ (null);

    static #naturalEndStoneBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #naturalEndStoneBlockTypeIds = /** @type {string[] | null} */ (null);

    static #naturalGravityBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #naturalGravityBlockTypeIds = /** @type {string[] | null} */ (null);

    static #naturalNetherDirtyBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #naturalNetherDirtyBlockTypeIds = /** @type {string[] | null} */ (null);
    static #naturalNetherStoneBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #naturalNetherStoneBlockTypeIds = /** @type {string[] | null} */ (null);

    static #naturalOverworldDirtyBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #naturalOverworldDirtyBlockTypeIds = /** @type {string[] | null} */ (null);

    static #naturalOverworldStoneBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #naturalOverworldStoneBlockTypeIds = /** @type {string[] | null} */ (null);

    static #naturalOverworldAboveZeroStoneBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #naturalOverworldAboveZeroStoneBlockTypeIds = /** @type {string[] | null} */ (null);
    static #naturalOverworldBelowZeroStoneBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #naturalOverworldBelowZeroStoneBlockTypeIds = /** @type {string[] | null} */ (null);

    static #naturalStoneBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #naturalStoneBlockTypeIds = /** @type {string[] | null} */ (null);

    static #shortPlantBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #shortPlantBlockTypeIds = /** @type {string[] | null} */ (null);

    static #tallPlantBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #tallPlantBlockTypeIds = /** @type {string[] | null} */ (null);

    static #coralBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #coralBlockTypeIds = /** @type {string[] | null} */ (null);
    static #deadCoralBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #deadCoralBlockTypeIds = /** @type {string[] | null} */ (null);

    //End of Natural Minecraft - non-crafted blocks
    //==========================================================================================================
    // Climbable Blocks - i.e. vines TODO: natural climbable
    static #climbableBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #climbableBlockTypeIds = /** @type {string[] | null} */ (null);
    static #overworldClimbableBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #overworldClimbableBlockTypeIds = /** @type {string[] | null} */ (null);
    static #netherClimbableBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #netherClimbableBlockTypeIds = /** @type {string[] | null} */ (null);

    // Wood "types" (strings like "oak", "spruce"...)

    // Wood blocks
    static #woodTypeSet = /** @type {Set<string> | null} */ (null);
    static #woodTypes = /** @type {string[] | null} */ (null);
    static #overworldWoodTypeSet = /** @type {Set<string> | null} */ (null);
    static #overworldWoodTypes = /** @type {string[] | null} */ (null);
    static #netherWoodTypeSet = /** @type {Set<string> | null} */ (null);
    static #netherWoodTypes = /** @type {string[] | null} */ (null);
    static #woodenBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #woodenBlockTypeIds = /** @type {string[] | null} */ (null);
    static #overworldWoodenBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #overworldWoodenBlockTypeIds = /** @type {string[] | null} */ (null);
    static #netherWoodenBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #netherWoodenBlockTypeIds = /** @type {string[] | null} */ (null);

    // Nature + misc
    static #gravityBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #gravityBlockTypeIds = /** @type {string[] | null} */ (null);

    static #leafBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #leafBlockTypeIds = /** @type {string[] | null} */ (null);
    static #logBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #logBlockTypeIds = /** @type {string[] | null} */ (null);
    static #saplingBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #saplingBlockTypeIds = /** @type {string[] | null} */ (null);
    static #plankBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #plankBlockTypeIds = /** @type {string[] | null} */ (null);

    // By region
    static #netherLogBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #netherLogBlockTypeIds = /** @type {string[] | null} */ (null);
    static #overworldLogBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #overworldLogBlockTypeIds = /** @type {string[] | null} */ (null);
    static #overworldPlankBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #overworldPlankBlockTypeIds = /** @type {string[] | null} */ (null);
    static #netherPlankBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #netherPlankBlockTypeIds = /** @type {string[] | null} */ (null);

    //==========================
    /* Crafted Building parts */
    //==========================
    static #partialBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #partialBlockTypeIds = /** @type {string[] | null} */ (null);
    static #stairBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #stairBlockTypeIds = /** @type {string[] | null} */ (null);
    static #trapDoorBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #trapDoorBlockTypeIds = /** @type {string[] | null} */ (null);

    //Slabs
    static #validSlabTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #validSlabTypeIds = /** @type {string[] | null} */ (null);
    static #validVanillaSlabTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #validVanillaSlabTypeIds = /** @type {string[] | null} */ (null);

    static #naturalStoneSlabBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #naturalStoneSlabBlockTypeIds = /** @type {string[] | null} */ (null);
    static #naturalEndStoneSlabBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #naturalEndStoneSlabBlockTypeIds = /** @type {string[] | null} */ (null);
    static #naturalNetherStoneSlabBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #naturalNetherStoneSlabBlockTypeIds = /** @type {string[] | null} */ (null);
    static #naturalOverworldStoneSlabBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #naturalOverworldStoneSlabBlockTypeIds = /** @type {string[] | null} */ (null);

    static #naturalColdBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #naturalColdBlockTypeIds = /** @type {string[] | null} */ (null);

    static #naturalOceanFloorBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #naturalOceanFloorBlockTypeIds = /** @type {string[] | null} */ (null);
    static #naturalOceanBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #naturalOceanBlockTypeIds = /** @type {string[] | null} */ (null);

    //Walls
    static #validWallTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #validWallTypeIds = /** @type {string[] | null} */ (null);
    static #validVanillaWallTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #validVanillaWallTypeIds = /** @type {string[] | null} */ (null);

    // Glass / terracotta / coral / concrete
    static #glassBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #glassBlockTypeIds = /** @type {string[] | null} */ (null);
    static #glassPaneBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #glassPaneBlockTypeIds = /** @type {string[] | null} */ (null);

    static #glazedTerracottaBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #glazedTerracottaBlockTypeIds = /** @type {string[] | null} */ (null);
    static #terracottaBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #terracottaBlockTypeIds = /** @type {string[] | null} */ (null);

    static #concreteBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #concreteBlockTypeIds = /** @type {string[] | null} */ (null);
    static #concretePowderBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #concretePowderBlockTypeIds = /** @type {string[] | null} */ (null);

    // Misc building collections
    static #craftedBuildingBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #craftedBuildingBlockTypeIds = /** @type {string[] | null} */ (null);
    static #cookedBuildingBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #cookedBuildingBlockTypeIds = /** @type {string[] | null} */ (null);

    static #oceanBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #oceanBlockTypeIds = /** @type {string[] | null} */ (null);
    static #oceanMonumentBlockTypeIdSet = /** @type {Set<string> | null} */ (null);
    static #oceanMonumentBlockTypeIds = /** @type {string[] | null} */ (null);
    //================================================================================================
    static #autoAliasMap = /** @type {Map<string,string> | null} */ (null);
    //================================================================================================
    /**
     * Cached set of block type ids available in this world.
     * (Includes whatever the world has registered — vanilla + any custom types it exposes.)
     * @returns {Set<string>}
     */
    static getValidBlockTypeIdSet () {
        if (!this.#validBlockTypeIdSet) {
            const itemsFilter = ItemTypeIds.getValidItemTypeIdSet();
            this.#validBlockTypeIdSet = new Set(
                BlockTypes.getAll().map(bt => bt.id)
                    .filter(b => itemsFilter.has(b)));
        }
        return this.#validBlockTypeIdSet;
    }
    /**
     * Cached set of block type ids available in this world.
     * (Includes whatever the world has registered — vanilla + any custom types it exposes.)
     * @returns {string[]}
     */
    static getValidBlockTypeIds () {
        if (!this.#validBlockTypeIds) {
            this.#validBlockTypeIds = Array.from(this.getValidBlockTypeIdSet());
        }
        return this.#validBlockTypeIds;
    }
    /**
     * Cached set of block type ids available in this world.
     * @returns {Set<string>}
     */
    static getValidVanillaBlockTypeIdSet () {
        if (!this.#validVanillaBlockTypeIdSet) {
            this.#validVanillaBlockTypeIdSet = new Set(Array.from(this.getValidBlockTypeIdSet()).filter(b => b.startsWith(mcNameSpace)));
        }
        return this.#validVanillaBlockTypeIdSet;
    }
    /**
    * Cached set of block type ids available in this world.
    * @returns {string[]}
    */
    static getValidVanillaBlockTypeIds () {
        if (!this.#validVanillaBlockTypeIds) {
            this.#validVanillaBlockTypeIds = Array.from(this.getValidVanillaBlockTypeIdSet());
        }
        return this.#validVanillaBlockTypeIds;
    }
    /**
     * Cached set of block type ids available in this world.
     * @returns {Set<string>}
     */
    static getValidCustomBlockTypeIdSet () {
        if (!this.#validCustomBlockTypeIdSet) {
            this.#validCustomBlockTypeIdSet = new Set(Array.from(this.getValidBlockTypeIdSet()).filter(b => !b.startsWith(mcNameSpace)));
        }
        return this.#validCustomBlockTypeIdSet;
    }
    /**
    * Cached set of block type ids available in this world.
    * @returns {string[]}
    */
    static getValidCustomBlockTypeIds () {
        if (!this.#validCustomBlockTypeIds) {
            this.#validCustomBlockTypeIds = Array.from(this.getValidCustomBlockTypeIdSet());
        }
        return this.#validCustomBlockTypeIds;
    }
    //================================================================================================
    /**
     * Cached set of block type ids available in this world.
     * (Includes whatever the world has registered — vanilla + any custom types it exposes.)
     * @returns {Set<string>}
     */
    static getValidSlabTypeIdSet () {
        if (!this.#validSlabTypeIdSet) {
            this.#validSlabTypeIdSet = new Set(Array.from(this.getValidBlockTypeIdSet()).filter(b => b.endsWith('_slab')));
        }
        return this.#validSlabTypeIdSet;
    }
    /**
     * Cached set of block type ids available in this world.
     * (Includes whatever the world has registered — vanilla + any custom types it exposes.)
     * @returns {string[]}
     */
    static getValidSlabTypeIds () {
        if (!this.#validSlabTypeIds) {
            this.#validSlabTypeIds = Array.from(this.getValidSlabTypeIdSet());
        }
        return this.#validSlabTypeIds;
    }
    /**
     * Cached set of block type ids available in this world.
     * (Includes whatever the world has registered — vanilla + any custom types it exposes.)
     * @returns {Set<string>}
     */
    static getValidVanillaSlabTypeIdSet () {
        if (!this.#validVanillaSlabTypeIdSet) {
            this.#validVanillaSlabTypeIdSet = new Set(Array.from(this.getValidSlabTypeIdSet()).filter(b => b.startsWith(mcNameSpace)));
        }
        return this.#validVanillaSlabTypeIdSet;
    }
    /**
    * Cached set of block type ids available in this world.
    * (Includes whatever the world has registered — vanilla + any custom types it exposes.)
    * @returns {string[]}
    */
    static getValidVanillaSlabTypeIds () {
        if (!this.#validVanillaSlabTypeIds) {
            this.#validVanillaSlabTypeIds = Array.from(this.getValidVanillaSlabTypeIdSet());
        }
        return this.#validVanillaSlabTypeIds;
    }
    //================================================================================================
    /**
     * Cached set of block type ids available in this world.
     * (Includes whatever the world has registered — vanilla + any custom types it exposes.)
     * @returns {Set<string>}
     */
    static getValidWallTypeIdSet () {
        if (!this.#validWallTypeIdSet) {
            this.#validWallTypeIdSet = new Set(Array.from(this.getValidBlockTypeIdSet()).filter(b => b.endsWith('_wall')));
        }
        return this.#validWallTypeIdSet;
    }
    /**
     * Cached set of block type ids available in this world.
     * (Includes whatever the world has registered — vanilla + any custom types it exposes.)
     * @returns {string[]}
     */
    static getValidWallTypeIds () {
        if (!this.#validWallTypeIds) {
            this.#validWallTypeIds = Array.from(this.getValidWallTypeIdSet());
        }
        return this.#validWallTypeIds;
    }
    /**
     * Cached set of block type ids available in this world.
     * (Includes whatever the world has registered — vanilla + any custom types it exposes.)
     * @returns {Set<string>}
     */
    static getValidVanillaWallTypeIdSet () {
        if (!this.#validVanillaWallTypeIdSet) {
            this.#validVanillaWallTypeIdSet = new Set(Array.from(this.getValidWallTypeIdSet()).filter(b => b.startsWith(mcNameSpace)));
        }
        return this.#validVanillaWallTypeIdSet;
    }
    /**
    * Cached set of block type ids available in this world.
    * (Includes whatever the world has registered — vanilla + any custom types it exposes.)
    * @returns {string[]}
    */
    static getValidVanillaWallTypeIds () {
        if (!this.#validVanillaWallTypeIds) {
            this.#validVanillaWallTypeIds = Array.from(this.getValidVanillaWallTypeIdSet());
        }
        return this.#validVanillaWallTypeIds;
    }
    //================================================================================================
    // Cached block-data collections
    //================================================================================================

    /**
     * @returns {Set<string>}
     */
    static getClimbableBlockTypeIdSet () {
        if (!this.#climbableBlockTypeIdSet) {
            const vanillaSet = this.getValidVanillaBlockTypeIdSet();
            const a = [
                'minecraft:flowing_water',
                'minecraft:water',
                'minecraft:ladder',
                'minecraft:scaffolding',
                'minecraft:weeping_vines',
                'minecraft:twisting_vines',
                'minecraft:glow_berries',
                'minecraft:vine'
            ].filter(b => vanillaSet.has(b));

            this.#climbableBlockTypeIds = a;
            this.#climbableBlockTypeIdSet = new Set(a);
        }
        return this.#climbableBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getClimbableBlockTypeIds () {
        if (!this.#climbableBlockTypeIds) {
            this.#climbableBlockTypeIds = Array.from(this.getClimbableBlockTypeIdSet());
        }
        return this.#climbableBlockTypeIds;
    }
    /**
     * @returns {Set<string>}
     */
    static getOverworldClimbableBlockTypeIdSet () {
        if (!this.#overworldClimbableBlockTypeIdSet) {
            const base = this.getClimbableBlockTypeIdSet();
            const a = [
                'minecraft:flowing_water',
                'minecraft:water',
                'minecraft:ladder',
                'minecraft:scaffolding',
                'minecraft:glow_berries',
                'minecraft:vine'
            ].filter(b => base.has(b));

            this.#overworldClimbableBlockTypeIds = a;
            this.#overworldClimbableBlockTypeIdSet = new Set(a);
        }
        return this.#overworldClimbableBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getOverworldClimbableBlockTypeIds () {
        if (!this.#overworldClimbableBlockTypeIds) {
            this.#overworldClimbableBlockTypeIds = Array.from(this.getOverworldClimbableBlockTypeIdSet());
        }
        return this.#overworldClimbableBlockTypeIds;
    }
    /**
     * @returns {Set<string>}
     */
    static getNetherClimbableBlockTypeIdSet () {
        if (!this.#netherClimbableBlockTypeIdSet) {
            const base = this.getClimbableBlockTypeIdSet();
            const a = [
                'minecraft:weeping_vines',
                'minecraft:twisting_vines',
            ].filter(b => base.has(b));

            this.#netherClimbableBlockTypeIds = a;
            this.#netherClimbableBlockTypeIdSet = new Set(a);
        }
        return this.#netherClimbableBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNetherClimbableBlockTypeIds () {
        if (!this.#netherClimbableBlockTypeIds) {
            this.#netherClimbableBlockTypeIds = Array.from(this.getNetherClimbableBlockTypeIdSet());
        }
        return this.#netherClimbableBlockTypeIds;
    }

    //=============================================================================
    // All about Wood
    //=============================================================================

    /**
     * @returns {Set<string>}
     */
    static getWoodTypeSet () {
        if (!this.#woodTypeSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const a = vanillaBlocks
                .filter(block => block.endsWith('_planks'))
                .map(s => s.replace('minecraft:', '').replace('_planks', ''));

            this.#woodTypes = a;
            this.#woodTypeSet = new Set(a);
        }
        return this.#woodTypeSet;
    }
    /**
     * @returns {string[]}
     */
    static getWoodTypes () {
        if (!this.#woodTypes) this.#woodTypes = Array.from(this.getWoodTypeSet());
        return this.#woodTypes;
    }

    /**
     * @returns {Set<string>}
     */
    static getOverworldWoodTypeSet () {
        if (!this.#overworldWoodTypeSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const woodTypes = this.getWoodTypeSet();

            const a = vanillaBlocks
                .filter(block => block.endsWith('_log'))
                .map(s => s.replace('minecraft:', '').replace('_log', ''))
                .filter(s => woodTypes.has(s));

            this.#overworldWoodTypes = a;
            this.#overworldWoodTypeSet = new Set(a);
        }
        return this.#overworldWoodTypeSet;
    }
    /**
     * @returns {string[]}
     */
    static getOverworldWoodTypes () {
        if (!this.#overworldWoodTypes) this.#overworldWoodTypes = Array.from(this.getOverworldWoodTypeSet());
        return this.#overworldWoodTypes;
    }

    /**
     * @returns {Set<string>}
     */
    static getNetherWoodTypeSet () {
        if (!this.#netherWoodTypeSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const woodTypes = this.getWoodTypeSet();

            const a = vanillaBlocks
                .filter(block => block.endsWith('_stem'))
                .map(s => s.replace('minecraft:', '').replace('_stem', ''))
                .filter(s => woodTypes.has(s));

            this.#netherWoodTypes = a;
            this.#netherWoodTypeSet = new Set(a);
        }
        return this.#netherWoodTypeSet;
    }
    /**
     * @returns {string[]}
     */
    static getNetherWoodTypes () {
        if (!this.#netherWoodTypes) this.#netherWoodTypes = Array.from(this.getNetherWoodTypeSet());
        return this.#netherWoodTypes;
    }

    /**
     * @returns {Set<string>}
     */
    static getWoodenBlockTypeIdSet () {
        if (!this.#woodenBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const woodTypes = this.getWoodTypes();

            const a = vanillaBlocks
                .filter(blockName => {
                    return blockName.endsWith('_button') ||
                        blockName.endsWith('_trapdoor') ||
                        blockName.endsWith('_door') ||
                        blockName.endsWith('_fence') ||
                        blockName.endsWith('_fence_gate') ||
                        blockName.endsWith('_hanging_sign') ||
                        blockName.endsWith('_standing_sign') ||
                        blockName.endsWith('_wall_sign') ||
                        blockName.endsWith('_hyphae') ||
                        blockName.endsWith('_log') ||
                        blockName.endsWith('_planks') ||
                        blockName.endsWith('_pressure_plate') ||
                        blockName.endsWith('_sign') ||
                        blockName.endsWith('_slab') ||
                        blockName.endsWith('_stairs') ||
                        blockName.endsWith('_stem') ||
                        blockName.endsWith('_hyphae') ||
                        blockName.endsWith('_wood');
                })
                .filter(blockName => {
                    return woodTypes.some(
                        woodType => {
                            blockName.startsWith('minecraft:' + woodType + '_') ||
                                blockName.startsWith('minecraft:' + 'stripped' + woodType + '_');
                        });
                });

            this.#woodenBlockTypeIds = a;
            this.#woodenBlockTypeIdSet = new Set(a);
        }
        return this.#woodenBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getWoodenBlockTypeIds () {
        if (!this.#woodenBlockTypeIds) this.#woodenBlockTypeIds = Array.from(this.getWoodenBlockTypeIdSet());
        return this.#woodenBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getOverworldWoodenBlockTypeIdSet () {
        if (!this.#overworldWoodenBlockTypeIdSet) {
            const woodenBlocks = this.getWoodenBlockTypeIds();
            const overworldWoodTypes = this.getOverworldWoodTypes();

            const a = woodenBlocks
                .filter(blockName => {
                    return overworldWoodTypes.some(
                        woodType => {
                            blockName.startsWith('minecraft:' + woodType + '_') ||
                                blockName.startsWith('minecraft:' + 'stripped' + woodType + '_');
                        });
                });

            this.#overworldWoodenBlockTypeIds = a;
            this.#overworldWoodenBlockTypeIdSet = new Set(a);
        }
        return this.#overworldWoodenBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getOverworldWoodenBlockTypeIds () {
        if (!this.#overworldWoodenBlockTypeIds) this.#overworldWoodenBlockTypeIds = Array.from(this.getOverworldWoodenBlockTypeIdSet());
        return this.#overworldWoodenBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getNetherWoodenBlockTypeIdSet () {
        if (!this.#netherWoodenBlockTypeIdSet) {
            const woodenBlocks = this.getWoodenBlockTypeIds();
            const netherWoodTypes = this.getNetherWoodTypes();

            const a = woodenBlocks
                .filter(blockName => {
                    return netherWoodTypes.some(
                        woodType => {
                            blockName.startsWith('minecraft:' + woodType + '_') ||
                                blockName.startsWith('minecraft:' + 'stripped' + woodType + '_');
                        });
                });

            this.#netherWoodenBlockTypeIds = a;
            this.#netherWoodenBlockTypeIdSet = new Set(a);
        }
        return this.#netherWoodenBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNetherWoodenBlockTypeIds () {
        if (!this.#netherWoodenBlockTypeIds) this.#netherWoodenBlockTypeIds = Array.from(this.getNetherWoodenBlockTypeIdSet());
        return this.#netherWoodenBlockTypeIds;
    }

    //=============================================================================
    // Gravity Blocks - they fall on you
    //=============================================================================
    /**
     * @returns {Set<string>}
     */
    static getNaturalGravityBlockTypeIdSet () {
        if (!this.#naturalGravityBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const a = vanillaBlocks
                .filter(blockName => {
                    return blockName.endsWith(':gravel') ||
                        blockName.endsWith(':red_sand') ||
                        blockName.endsWith(':suspicious_sand') ||
                        blockName.endsWith(':sand');
                });

            this.#naturalGravityBlockTypeIds = a;
            this.#naturalGravityBlockTypeIdSet = new Set(a);
        }
        return this.#naturalGravityBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalGravityBlockTypeIds () {
        if (!this.#naturalGravityBlockTypeIds) this.#naturalGravityBlockTypeIds = Array.from(this.getNaturalGravityBlockTypeIdSet());
        return this.#naturalGravityBlockTypeIds;
    }
    /**
     * @returns {Set<string>}
     */
    static getGravityBlockTypeIdSet () {
        if (!this.#gravityBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const a = vanillaBlocks
                .filter(blockName => { return blockName.endsWith('_concrete_powder'); })
                .concat(this.getNaturalGravityBlockTypeIds());

            this.#gravityBlockTypeIds = a;
            this.#gravityBlockTypeIdSet = new Set(a);
        }
        return this.#gravityBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getGravityBlockTypeIds () {
        if (!this.#gravityBlockTypeIds) this.#gravityBlockTypeIds = Array.from(this.getGravityBlockTypeIdSet());
        return this.#gravityBlockTypeIds;
    }

    //=============================================================================
    // regular tree leaves and stuff
    //=============================================================================
    /**
     * @returns {Set<string>}
     */
    static getLeafBlockTypeIdSet () {
        if (!this.#leafBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const a = vanillaBlocks
                .filter(blockName => { return blockName.endsWith('_leaves'); })
                .concat([ "minecraft:azalea", "minecraft:azalea_leaves_flowered" ]);

            this.#leafBlockTypeIds = a;
            this.#leafBlockTypeIdSet = new Set(a);
        }
        return this.#leafBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getLeafBlockTypeIds () {
        if (!this.#leafBlockTypeIds) this.#leafBlockTypeIds = Array.from(this.getLeafBlockTypeIdSet());
        return this.#leafBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getLogBlockTypeIdSet () {
        if (!this.#logBlockTypeIdSet) {
            const woodenBlocks = this.getWoodenBlockTypeIds();
            const a = woodenBlocks
                .filter(blockName => { return blockName.endsWith('_log') || blockName.endsWith('_stem'); });

            this.#logBlockTypeIds = a;
            this.#logBlockTypeIdSet = new Set(a);
        }
        return this.#logBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getLogBlockTypeIds () {
        if (!this.#logBlockTypeIds) this.#logBlockTypeIds = Array.from(this.getLogBlockTypeIdSet());
        return this.#logBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getSaplingBlockTypeIdSet () {
        if (!this.#saplingBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const a = vanillaBlocks
                .filter(blockName => { return blockName.endsWith('_sapling'); });

            this.#saplingBlockTypeIds = a;
            this.#saplingBlockTypeIdSet = new Set(a);
        }
        return this.#saplingBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getSaplingBlockTypeIds () {
        if (!this.#saplingBlockTypeIds) this.#saplingBlockTypeIds = Array.from(this.getSaplingBlockTypeIdSet());
        return this.#saplingBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getPlankBlockTypeIdSet () {
        if (!this.#plankBlockTypeIdSet) {
            const woodenBlocks = this.getWoodenBlockTypeIds();
            const a = woodenBlocks
                .filter(blockName => { return blockName.endsWith('_planks'); });

            this.#plankBlockTypeIds = a;
            this.#plankBlockTypeIdSet = new Set(a);
        }
        return this.#plankBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getPlankBlockTypeIds () {
        if (!this.#plankBlockTypeIds) this.#plankBlockTypeIds = Array.from(this.getPlankBlockTypeIdSet());
        return this.#plankBlockTypeIds;
    }

    //=============================================================================
    //  by region
    //=============================================================================
    /**
     * @returns {Set<string>}
     */
    static getNetherLogBlockTypeIdSet () {
        if (!this.#netherLogBlockTypeIdSet) {
            const netherWoodenBlocks = this.getNetherWoodenBlockTypeIds();
            const a = netherWoodenBlocks
                .filter(b => { return b.endsWith('_stem') || b.endsWith('_hyphae'); });

            this.#netherLogBlockTypeIds = a;
            this.#netherLogBlockTypeIdSet = new Set(a);
        }
        return this.#netherLogBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNetherLogBlockTypeIds () {
        if (!this.#netherLogBlockTypeIds) this.#netherLogBlockTypeIds = Array.from(this.getNetherLogBlockTypeIdSet());
        return this.#netherLogBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getOverworldLogBlockTypeIdSet () {
        if (!this.#overworldLogBlockTypeIdSet) {
            const overworldWoodenBlocks = this.getOverworldWoodenBlockTypeIds();
            const a = overworldWoodenBlocks
                .filter(b => { return b.endsWith('_log') || b.endsWith('_wood'); });

            this.#overworldLogBlockTypeIds = a;
            this.#overworldLogBlockTypeIdSet = new Set(a);
        }
        return this.#overworldLogBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getOverworldLogBlockTypeIds () {
        if (!this.#overworldLogBlockTypeIds) this.#overworldLogBlockTypeIds = Array.from(this.getOverworldLogBlockTypeIdSet());
        return this.#overworldLogBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getOverworldPlankBlockTypeIdSet () {
        if (!this.#overworldPlankBlockTypeIdSet) {
            const overworldWoodenBlocks = this.getOverworldWoodenBlockTypeIds();
            const a = overworldWoodenBlocks
                .filter(b => { return b.endsWith('_planks'); });

            this.#overworldPlankBlockTypeIds = a;
            this.#overworldPlankBlockTypeIdSet = new Set(a);
        }
        return this.#overworldPlankBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getOverworldPlankBlockTypeIds () {
        if (!this.#overworldPlankBlockTypeIds) this.#overworldPlankBlockTypeIds = Array.from(this.getOverworldPlankBlockTypeIdSet());
        return this.#overworldPlankBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getNetherPlankBlockTypeIdSet () {
        if (!this.#netherPlankBlockTypeIdSet) {
            const netherWoodenBlocks = this.getNetherWoodenBlockTypeIds();
            const a = netherWoodenBlocks
                .filter(b => { return b.endsWith('_planks'); });

            this.#netherPlankBlockTypeIds = a;
            this.#netherPlankBlockTypeIdSet = new Set(a);
        }
        return this.#netherPlankBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNetherPlankBlockTypeIds () {
        if (!this.#netherPlankBlockTypeIds) this.#netherPlankBlockTypeIds = Array.from(this.getNetherPlankBlockTypeIdSet());
        return this.#netherPlankBlockTypeIds;
    }

    //=============================================================================
    // Stairs + trap doors
    //=============================================================================
    /**
     * @returns {Set<string>}
     */
    static getStairBlockTypeIdSet () {
        if (!this.#stairBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const a = vanillaBlocks
                .filter(blockName => { return blockName.endsWith('_stairs'); });

            this.#stairBlockTypeIds = a;
            this.#stairBlockTypeIdSet = new Set(a);
        }
        return this.#stairBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getStairBlockTypeIds () {
        if (!this.#stairBlockTypeIds) this.#stairBlockTypeIds = Array.from(this.getStairBlockTypeIdSet());
        return this.#stairBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getTrapDoorBlockTypeIdSet () {
        if (!this.#trapDoorBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const a = vanillaBlocks
                .filter(blockName => { return blockName.endsWith('trapdoor'); });

            this.#trapDoorBlockTypeIds = a;
            this.#trapDoorBlockTypeIdSet = new Set(a);
        }
        return this.#trapDoorBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getTrapDoorBlockTypeIds () {
        if (!this.#trapDoorBlockTypeIds) this.#trapDoorBlockTypeIds = Array.from(this.getTrapDoorBlockTypeIdSet());
        return this.#trapDoorBlockTypeIds;
    }
    //=============================================================================
    // Partial Blocks - Cannot attach ladders to
    //=============================================================================
    /**
     * @returns {Set<string>}
     */
    static getPartialBlockTypeIdSet () {
        if (!this.#partialBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const a = vanillaBlocks.filter(b => {
                return b.endsWith('_door') ||
                    b.endsWith('_fence') ||
                    b.endsWith('_gate') ||
                    b.endsWith('_slab') ||
                    b.endsWith('_stairs') ||
                    b.endsWith('_trapdoor') ||
                    b.endsWith('_wall')
                    ;
            });

            this.#partialBlockTypeIds = a;
            this.#partialBlockTypeIdSet = new Set(a);
        }
        return this.#partialBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getPartialBlockTypeIds () {
        if (!this.#partialBlockTypeIds) this.#partialBlockTypeIds = Array.from(this.getPartialBlockTypeIdSet());
        return this.#partialBlockTypeIds;
    }
    //=============================================================================
    // Tall nature + dirty blocks
    //=============================================================================
    /**
     * @returns {Set<string>}
     */
    static getShortPlantBlockTypeIdSet () {
        if (!this.#shortPlantBlockTypeIdSet) {
            const vanillaSet = this.getValidVanillaBlockTypeIdSet();
            const vanillaIDs = this.getValidVanillaBlockTypeIds();
            const a = [
                "minecraft:dandelion",
                "minecraft:poppy",
                "minecraft:blue_orchid",
                "minecraft:allium",
                "minecraft:azure_bluet",
                "minecraft:oxeye_daisy",
                "minecraft:cornflower",
                'minecraft:lily_of_the_valley',
                'minecraft:wildflowers',
                'minecraft:pink_petals',
                'minecraft:short_dry_grass',
                'minecraft:fern',
                'minecraft:nether_sprouts',
                ...vanillaIDs.filter(b => b.endsWith('_leaves')),
                ...vanillaIDs.filter(b => b.endsWith('_tulip')),
                ...vanillaIDs.filter(b => b.endsWith('_roots'))
            ].filter(b => vanillaSet.has(b));

            this.#shortPlantBlockTypeIds = a;
            this.#shortPlantBlockTypeIdSet = new Set(a);
        }
        return this.#shortPlantBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getShortPlantBlockTypeIds () {
        if (!this.#shortPlantBlockTypeIds) this.#shortPlantBlockTypeIds = Array.from(this.getShortPlantBlockTypeIdSet());
        return this.#shortPlantBlockTypeIds;
    }
    /**
         * @returns {Set<string>}
         */
    static getTallPlantBlockTypeIdSet () {
        if (!this.#tallPlantBlockTypeIdSet) {
            const vanillaSet = this.getValidVanillaBlockTypeIdSet();
            const a = [
                "minecraft:rose_bush",
                "minecraft:lilac",
                "minecraft:peony",
                "minecraft:sunflower",
                "minecraft:torchflower",
                "minecraft:tall_grass",
                "minecraft:tall_dry_grass",
                'minecraft:large_fern'
            ].filter(b => vanillaSet.has(b));

            this.#tallPlantBlockTypeIds = a;
            this.#tallPlantBlockTypeIdSet = new Set(a);
        }
        return this.#tallPlantBlockTypeIdSet;
    }
    //TODO: add special plants and crops as needed
    /**
     * @returns {string[]}
     */
    static getTallPlantBlockTypeIds () {
        if (!this.#tallPlantBlockTypeIds) this.#tallPlantBlockTypeIds = Array.from(this.getTallPlantBlockTypeIdSet());
        return this.#tallPlantBlockTypeIds;
    }
    /**
     * @returns {Set<string>}
     */
    static getNaturalOverworldDirtyBlockTypeIdSet () {
        if (!this.#naturalOverworldDirtyBlockTypeIdSet) {
            const vanillaSet = this.getValidVanillaBlockTypeIdSet();
            const a = [
                'minecraft:dirt',
                'minecraft:mud',
                'minecraft:packed_mud',
                'minecraft:farmland',
                'minecraft:dirt_path',
                'minecraft:dirt_with_roots',
                'minecraft:rooted_dirt',
                'minecraft:coarse_dirt',
                'minecraft:grass',
                'minecraft:grass_block',
                'minecraft:podzol',
                'minecraft:mycelium',
            ].filter(b => vanillaSet.has(b));

            this.#naturalOverworldDirtyBlockTypeIds = a;
            this.#naturalOverworldDirtyBlockTypeIdSet = new Set(a);
        }
        return this.#naturalOverworldDirtyBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalOverworldDirtyBlockTypeIds () {
        if (!this.#naturalOverworldDirtyBlockTypeIds) this.#naturalOverworldDirtyBlockTypeIds = Array.from(this.getNaturalOverworldDirtyBlockTypeIdSet());
        return this.#naturalOverworldDirtyBlockTypeIds;
    }
    /**
     * @returns {Set<string>}
     */
    static getNaturalNetherDirtyBlockTypeIdSet () {
        if (!this.#naturalNetherDirtyBlockTypeIdSet) {
            const a = [
                'minecraft:crimson_nylium', 'minecraft:warped_nylium'
            ];

            this.#naturalNetherDirtyBlockTypeIds = a;
            this.#naturalNetherDirtyBlockTypeIdSet = new Set(a);
        }
        return this.#naturalNetherDirtyBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalNetherDirtyBlockTypeIds () {
        if (!this.#naturalNetherDirtyBlockTypeIds) this.#naturalNetherDirtyBlockTypeIds = Array.from(this.getNaturalNetherDirtyBlockTypeIdSet());
        return this.#naturalNetherDirtyBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getNaturalDirtyBlockTypeIdSet () {
        if (!this.#naturalDirtyBlockTypeIdSet) {
            const a = [
                ...this.getNaturalOverworldDirtyBlockTypeIds(),
                ...this.getNaturalNetherDirtyBlockTypeIds()
            ];
            this.#naturalDirtyBlockTypeIds = a;
            this.#naturalDirtyBlockTypeIdSet = new Set(a);
        }
        return this.#naturalDirtyBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalDirtyBlockTypeIds () {
        if (!this.#naturalDirtyBlockTypeIds) this.#naturalDirtyBlockTypeIds = Array.from(this.getNaturalDirtyBlockTypeIdSet());
        return this.#naturalDirtyBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getDirtyBlockTypeIdSet () {
        if (!this.#dirtyBlockTypeIdSet) {
            const vanillaSet = this.getValidVanillaBlockTypeIdSet();

            const a = [
                ...this.getNaturalDirtyBlockTypeIds(),
                'minecraft:mud_bricks',
            ].filter(b => vanillaSet.has(b));

            this.#dirtyBlockTypeIds = a;
            this.#dirtyBlockTypeIdSet = new Set(a);
        }
        return this.#dirtyBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getDirtyBlockTypeIds () {
        if (!this.#dirtyBlockTypeIds) this.#dirtyBlockTypeIds = Array.from(this.getDirtyBlockTypeIdSet());
        return this.#dirtyBlockTypeIds;
    }
    /**
    * @returns {Set<string>}
    */
    static getNaturalBlockTypeIdSet () {
        if (!this.#naturalBlockTypeIdSet) {
            const a = [
                //TODO add natural cold
                ...this.getNaturalColdBlockTypeIds(),
                ...this.getNaturalDirtyBlockTypeIds(),
                ...this.getNaturalStoneBlockTypeIds()
            ];
            this.#naturalBlockTypeIds = a;
            this.#naturalBlockTypeIdSet = new Set(a);
        }
        return this.#naturalBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalBlockTypeIds () {
        if (!this.#naturalBlockTypeIds) this.#naturalBlockTypeIds = Array.from(this.getNaturalBlockTypeIdSet());
        return this.#naturalBlockTypeIds;
    }
    //=============================================================================
    // Glass / Terracotta / Coral / Concrete
    //=============================================================================
    /**
     * @returns {Set<string>}
     */
    static getGlassBlockTypeIdSet () {
        if (!this.#glassBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const a = vanillaBlocks
                .filter(blockName => { return blockName.endsWith('_stained_glass'); })
                .concat('glass');

            this.#glassBlockTypeIds = a;
            this.#glassBlockTypeIdSet = new Set(a);
        }
        return this.#glassBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getGlassBlockTypeIds () {
        if (!this.#glassBlockTypeIds) this.#glassBlockTypeIds = Array.from(this.getGlassBlockTypeIdSet());
        return this.#glassBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getGlassPaneBlockTypeIdSet () {
        if (!this.#glassPaneBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds().filter(blockName => { return blockName.endsWith('glass_pane'); });
            const a = vanillaBlocks.filter(b => { return b.endsWith(':glass_pane') || b.endsWith('_stained_glass_pane'); });

            this.#glassPaneBlockTypeIds = a;
            this.#glassPaneBlockTypeIdSet = new Set(a);
        }
        return this.#glassPaneBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getGlassPaneBlockTypeIds () {
        if (!this.#glassPaneBlockTypeIds) this.#glassPaneBlockTypeIds = Array.from(this.getGlassPaneBlockTypeIdSet());
        return this.#glassPaneBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getGlazedTerracottaBlockTypeIdSet () {
        if (!this.#glazedTerracottaBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const a = vanillaBlocks.filter(blockName => { return blockName.endsWith('_glazed_terracotta'); });

            this.#glazedTerracottaBlockTypeIds = a;
            this.#glazedTerracottaBlockTypeIdSet = new Set(a);
        }
        return this.#glazedTerracottaBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getGlazedTerracottaBlockTypeIds () {
        if (!this.#glazedTerracottaBlockTypeIds) this.#glazedTerracottaBlockTypeIds = Array.from(this.getGlazedTerracottaBlockTypeIdSet());
        return this.#glazedTerracottaBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getTerracottaBlockTypeIdSet () {
        if (!this.#terracottaBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const a = vanillaBlocks
                .filter(blockName => { return blockName.endsWith('_terracotta') && !blockName.endsWith('_glazed_terracotta'); })
                .concat('hardened_clay');

            this.#terracottaBlockTypeIds = a;
            this.#terracottaBlockTypeIdSet = new Set(a);
        }
        return this.#terracottaBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getTerracottaBlockTypeIds () {
        if (!this.#terracottaBlockTypeIds) this.#terracottaBlockTypeIds = Array.from(this.getTerracottaBlockTypeIdSet());
        return this.#terracottaBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getCoralBlockTypeIdSet () {
        if (!this.#coralBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const a = vanillaBlocks.filter(blockName => { return blockName.endsWith('_coral_block') && !blockName.startsWith('dead_'); });

            this.#coralBlockTypeIds = a;
            this.#coralBlockTypeIdSet = new Set(a);
        }
        return this.#coralBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getCoralBlockTypeIds () {
        if (!this.#coralBlockTypeIds) this.#coralBlockTypeIds = Array.from(this.getCoralBlockTypeIdSet());
        return this.#coralBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getDeadCoralBlockTypeIdSet () {
        if (!this.#deadCoralBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const a = vanillaBlocks.filter(blockName => { return blockName.endsWith('_coral_block') && blockName.startsWith('dead_'); });

            this.#deadCoralBlockTypeIds = a;
            this.#deadCoralBlockTypeIdSet = new Set(a);
        }
        return this.#deadCoralBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getDeadCoralBlockTypeIds () {
        if (!this.#deadCoralBlockTypeIds) this.#deadCoralBlockTypeIds = Array.from(this.getDeadCoralBlockTypeIdSet());
        return this.#deadCoralBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getConcreteBlockTypeIdSet () {
        if (!this.#concreteBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const a = vanillaBlocks.filter(blockName => { return blockName.endsWith('_concrete'); });

            this.#concreteBlockTypeIds = a;
            this.#concreteBlockTypeIdSet = new Set(a);
        }
        return this.#concreteBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getConcreteBlockTypeIds () {
        if (!this.#concreteBlockTypeIds) this.#concreteBlockTypeIds = Array.from(this.getConcreteBlockTypeIdSet());
        return this.#concreteBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getConcretePowderBlockTypeIdSet () {
        if (!this.#concretePowderBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();
            const a = vanillaBlocks.filter(blockName => { return blockName.endsWith('_concrete_powder'); });

            this.#concretePowderBlockTypeIds = a;
            this.#concretePowderBlockTypeIdSet = new Set(a);
        }
        return this.#concretePowderBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getConcretePowderBlockTypeIds () {
        if (!this.#concretePowderBlockTypeIds) this.#concretePowderBlockTypeIds = Array.from(this.getConcretePowderBlockTypeIdSet());
        return this.#concretePowderBlockTypeIds;
    }

    //=============================================================================
    // Stones (nature tab)
    //=============================================================================
    /**
     * @returns {Set<string>}
     */
    static getNaturalOverworldStoneBlockTypeIdSet () {
        if (!this.#naturalOverworldStoneBlockTypeIdSet) {
            const vanillaSet = this.getValidVanillaBlockTypeIdSet();
            const a = [
                'minecraft:stone',
                'minecraft:andesite',
                'minecraft:diorite',
                'minecraft:granite',
                'minecraft:tuff',
                'minecraft:deepslate',
                'minecraft:calcite',
            ].filter(b => vanillaSet.has(b));

            this.#naturalOverworldStoneBlockTypeIds = a;
            this.#naturalOverworldStoneBlockTypeIdSet = new Set(a);
        }
        return this.#naturalOverworldStoneBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalOverworldStoneBlockTypeIds () {
        if (!this.#naturalOverworldStoneBlockTypeIds) this.#naturalOverworldStoneBlockTypeIds = Array.from(this.getNaturalOverworldStoneBlockTypeIdSet());
        return this.#naturalOverworldStoneBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getNaturalOverworldAboveZeroStoneBlockTypeIdSet () {
        if (!this.#naturalOverworldAboveZeroStoneBlockTypeIdSet) {
            const base = this.getNaturalOverworldStoneBlockTypeIdSet();
            const a = [
                'minecraft:stone',
                'minecraft:andesite',
                'minecraft:diorite',
                'minecraft:granite',
            ].filter(b => base.has(b));

            this.#naturalOverworldAboveZeroStoneBlockTypeIds = a;
            this.#naturalOverworldAboveZeroStoneBlockTypeIdSet = new Set(a);
        }
        return this.#naturalOverworldAboveZeroStoneBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalOverworldAboveZeroStoneBlockTypeIds () {
        if (!this.#naturalOverworldAboveZeroStoneBlockTypeIds) this.#naturalOverworldAboveZeroStoneBlockTypeIds = Array.from(this.getNaturalOverworldAboveZeroStoneBlockTypeIdSet());
        return this.#naturalOverworldAboveZeroStoneBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getNaturalOverworldBelowZeroStoneBlockTypeIdSet () {
        if (!this.#naturalOverworldBelowZeroStoneBlockTypeIdSet) {
            const base = this.getNaturalOverworldStoneBlockTypeIdSet();
            const a = [
                'minecraft:tuff',
                'minecraft:deepslate',
                'minecraft:calcite',
            ].filter(b => base.has(b));

            this.#naturalOverworldBelowZeroStoneBlockTypeIds = a;
            this.#naturalOverworldBelowZeroStoneBlockTypeIdSet = new Set(a);
        }
        return this.#naturalOverworldBelowZeroStoneBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalOverworldBelowZeroStoneBlockTypeIds () {
        if (!this.#naturalOverworldBelowZeroStoneBlockTypeIds) this.#naturalOverworldBelowZeroStoneBlockTypeIds = Array.from(this.getNaturalOverworldBelowZeroStoneBlockTypeIdSet());
        return this.#naturalOverworldBelowZeroStoneBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getNaturalNetherStoneBlockTypeIdSet () {
        if (!this.#naturalNetherStoneBlockTypeIdSet) {
            const vanillaSet = this.getValidVanillaBlockTypeIdSet();
            const a = [
                'minecraft:blackstone',
                'minecraft:basalt',
                'minecraft:netherrack',
                'minecraft:crimson_nylium',
                'minecraft:warped_nylium',
            ].filter(b => vanillaSet.has(b));

            this.#naturalNetherStoneBlockTypeIds = a;
            this.#naturalNetherStoneBlockTypeIdSet = new Set(a);
        }
        return this.#naturalNetherStoneBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalNetherStoneBlockTypeIds () {
        if (!this.#naturalNetherStoneBlockTypeIds) this.#naturalNetherStoneBlockTypeIds = Array.from(this.getNaturalNetherStoneBlockTypeIdSet());
        return this.#naturalNetherStoneBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getNaturalEndStoneBlockTypeIdSet () {
        if (!this.#naturalEndStoneBlockTypeIdSet) {
            const vanillaSet = this.getValidVanillaBlockTypeIdSet();
            const a = [
                'minecraft:end_stone'
            ].filter(b => vanillaSet.has(b));

            this.#naturalEndStoneBlockTypeIds = a;
            this.#naturalEndStoneBlockTypeIdSet = new Set(a);
        }
        return this.#naturalEndStoneBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalEndStoneBlockTypeIds () {
        if (!this.#naturalEndStoneBlockTypeIds) this.#naturalEndStoneBlockTypeIds = Array.from(this.getNaturalEndStoneBlockTypeIdSet());
        return this.#naturalEndStoneBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getNaturalStoneBlockTypeIdSet () {
        if (!this.#naturalStoneBlockTypeIdSet) {
            const a = [
                ...this.getNaturalOverworldStoneBlockTypeIds(),
                ...this.getNaturalNetherStoneBlockTypeIds(),
                ...this.getNaturalEndStoneBlockTypeIds()
            ];

            this.#naturalStoneBlockTypeIds = a;
            this.#naturalStoneBlockTypeIdSet = new Set(a);
        }
        return this.#naturalStoneBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalStoneBlockTypeIds () {
        if (!this.#naturalStoneBlockTypeIds) this.#naturalStoneBlockTypeIds = Array.from(this.getNaturalStoneBlockTypeIdSet());
        return this.#naturalStoneBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getNaturalStoneSlabBlockTypeIdSet () {
        if (!this.#naturalStoneSlabBlockTypeIdSet) {
            const vanillaSet = this.getValidVanillaBlockTypeIdSet();
            const a = this.getNaturalStoneBlockTypeIds()
                .map(b => `${b}_slab`)
                .filter(b => vanillaSet.has(b));

            this.#naturalStoneSlabBlockTypeIds = a;
            this.#naturalStoneSlabBlockTypeIdSet = new Set(a);
        }
        return this.#naturalStoneSlabBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalStoneSlabBlockTypeIds () {
        if (!this.#naturalStoneSlabBlockTypeIds) this.#naturalStoneSlabBlockTypeIds = Array.from(this.getNaturalStoneSlabBlockTypeIdSet());
        return this.#naturalStoneSlabBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getNaturalOverworldStoneSlabBlockTypeIdSet () {
        if (!this.#naturalOverworldStoneSlabBlockTypeIdSet) {
            const vanillaSet = this.getValidVanillaBlockTypeIdSet();
            const a = this.getNaturalOverworldStoneBlockTypeIds()
                .map(b => `${b}_slab`)
                .filter(b => vanillaSet.has(b));

            this.#naturalOverworldStoneSlabBlockTypeIds = a;
            this.#naturalOverworldStoneSlabBlockTypeIdSet = new Set(a);
        }
        return this.#naturalOverworldStoneSlabBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalOverworldStoneSlabBlockTypeIds () {
        if (!this.#naturalOverworldStoneSlabBlockTypeIds) this.#naturalOverworldStoneSlabBlockTypeIds = Array.from(this.getNaturalOverworldStoneSlabBlockTypeIdSet());
        return this.#naturalOverworldStoneSlabBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getNaturalNetherStoneSlabBlockTypeIdSet () {
        if (!this.#naturalNetherStoneSlabBlockTypeIdSet) {
            const vanillaSet = this.getValidVanillaBlockTypeIdSet();
            const a = this.getNaturalNetherStoneBlockTypeIds()
                .map(b => `${b}_slab`)
                .filter(b => vanillaSet.has(b));

            this.#naturalNetherStoneSlabBlockTypeIds = a;
            this.#naturalNetherStoneSlabBlockTypeIdSet = new Set(a);
        }
        return this.#naturalNetherStoneSlabBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalNetherStoneSlabBlockTypeIds () {
        if (!this.#naturalNetherStoneSlabBlockTypeIds) this.#naturalNetherStoneSlabBlockTypeIds = Array.from(this.getNaturalNetherStoneSlabBlockTypeIdSet());
        return this.#naturalNetherStoneSlabBlockTypeIds;
    }

    /**
     * @returns {Set<string>}
     */
    static getNaturalEndStoneSlabBlockTypeIdSet () {
        if (!this.#naturalEndStoneSlabBlockTypeIdSet) {
            const vanillaSet = this.getValidVanillaBlockTypeIdSet();
            const a = this.getNaturalEndStoneBlockTypeIds()
                .map(b => `${b}_slab`)
                .filter(b => vanillaSet.has(b));

            this.#naturalEndStoneSlabBlockTypeIds = a;
            this.#naturalEndStoneSlabBlockTypeIdSet = new Set(a);
        }
        return this.#naturalEndStoneSlabBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalEndStoneSlabBlockTypeIds () {
        if (!this.#naturalEndStoneSlabBlockTypeIds) this.#naturalEndStoneSlabBlockTypeIds = Array.from(this.getNaturalEndStoneSlabBlockTypeIdSet());
        return this.#naturalEndStoneSlabBlockTypeIds;
    }

    //=============================================================================
    /**
     * @returns {Set<string>}
     */
    static getNaturalOceanFloorBlockTypeIdSet () {
        if (!this.#naturalOceanFloorBlockTypeIdSet) {
            const a = [
                'clay_block', 'gravel', 'sand', 'dirt', 'magma',
                ...this.getCoralBlockTypeIds(),
                //...this.getNaturalOverworldAboveZeroStoneBlockTypeIds()  yes but....
            ];
            this.normalizeBlockIdsInPlace(a);
            this.#naturalOceanFloorBlockTypeIds = a;
            this.#naturalOceanFloorBlockTypeIdSet = new Set(a);
        }
        return this.#naturalOceanFloorBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalOceanFloorBlockTypeIds () {
        if (!this.#naturalOceanFloorBlockTypeIds) this.#naturalOceanFloorBlockTypeIds = Array.from(this.getNaturalOceanFloorBlockTypeIdSet());
        return this.#naturalOceanFloorBlockTypeIds;
    }
    /**
     * @returns {Set<string>}
     */
    static getNaturalOceanBlockTypeIdSet () {
        if (!this.#naturalOceanBlockTypeIdSet) {
            const a = [ 'wet_sponge', ...this.getNaturalOceanFloorBlockTypeIds(), ];
            this.normalizeBlockIdsInPlace(a);
            this.#naturalOceanBlockTypeIds = a;
            this.#naturalOceanBlockTypeIdSet = new Set(a);
        }
        return this.#naturalOceanBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalOceanBlockTypeIds () {
        if (!this.#naturalOceanBlockTypeIds) this.#naturalOceanBlockTypeIds = Array.from(this.getNaturalOceanBlockTypeIdSet());
        return this.#naturalOceanBlockTypeIds;
    }
    //=============================================================================
    // Underwater blocks (some with slab variants)
    //=============================================================================
    /**
     * @returns {Set<string>}
     */
    static getOceanMonumentBlockTypeIdSet () {
        if (!this.#oceanMonumentBlockTypeIdSet) {
            const a = [ 'prismarine', 'dark_prismarine', 'prismarine_bricks', 'sea_lantern', 'wet_sponge' ];
            this.normalizeBlockIdsInPlace(a);
            this.#oceanMonumentBlockTypeIds = a;
            this.#oceanMonumentBlockTypeIdSet = new Set(a);
        }
        return this.#oceanMonumentBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getOceanMonumentBlockTypeIds () {
        if (!this.#oceanMonumentBlockTypeIds) this.#oceanMonumentBlockTypeIds = Array.from(this.getOceanMonumentBlockTypeIdSet());
        return this.#oceanMonumentBlockTypeIds;
    }
    /**
     * @returns {Set<string>}
     */
    static getOceanBlockTypeIdSet () {
        if (!this.#oceanBlockTypeIdSet) {
            const a = [
                ...this.getNaturalOceanBlockTypeIds(),
                ...this.getOceanMonumentBlockTypeIds(),
                'sandstone', 'chiseled_sandstone', 'cut_sandstone', 'smooth_sandstone'
            ];
            this.normalizeBlockIdsInPlace(a);
            this.#oceanBlockTypeIds = a;
            this.#oceanBlockTypeIdSet = new Set(a);
        }
        return this.#oceanBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getOceanBlockTypeIds () {
        if (!this.#oceanBlockTypeIds) this.#oceanBlockTypeIds = Array.from(this.getOceanBlockTypeIdSet());
        return this.#oceanBlockTypeIds;
    }

    //=============================================================================
    // Underwater blocks (with slab variants)
    //=============================================================================
    /**
     * @returns {Set<string>}
     */
    static getNaturalColdBlockTypeIdSet () {
        if (!this.#naturalColdBlockTypeIdSet) {
            const a = [
                'minecraft:snow_layer',
                'minecraft:snow_block',
                'minecraft:snow',
                'minecraft:ice',
                'minecraft:powder_snow',
                'minecraft:packed_ice',
                'minecraft:blue_ice'
            ];
            this.normalizeBlockIdsInPlace(a);
            this.#naturalColdBlockTypeIds = a;
            this.#naturalColdBlockTypeIdSet = new Set(a);
        }
        return this.#naturalColdBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getNaturalColdBlockTypeIds () {
        if (!this.#naturalColdBlockTypeIds) this.#naturalColdBlockTypeIds = Array.from(this.getNaturalColdBlockTypeIdSet());
        return this.#naturalColdBlockTypeIds;
    }

    //=============================================================================
    // Crafted / cooked building blocks / sans ores
    //=============================================================================
    /**
     * @returns {Set<string>}
     */
    static getCraftedBuildingBlockTypeIdSet () {
        if (!this.#craftedBuildingBlockTypeIdSet) {
            const vanillaBlocks = this.getValidVanillaBlockTypeIds();

            const a = vanillaBlocks
                .filter(blockName => {
                    return blockName.endsWith('_bricks') ||
                        blockName.endsWith('_pillar') ||
                        blockName.endsWith('_powder') ||
                        blockName.endsWith('_planks') ||
                        blockName.endsWith('_quartz_block') ||
                        blockName.endsWith('_stairs') ||
                        blockName.endsWith(':sandstone') ||
                        blockName.endsWith('_sandstone') ||
                        blockName.endsWith('_slab') ||
                        blockName.endsWith('_tiles') ||
                        blockName.endsWith('_wall');
                })
                .concat([
                    'bricks', 'bone_block', 'packed_mud', 'dark_prismarine'
                    , 'dried_kelp_block', 'hay_block'
                ]);

            this.normalizeBlockIdsInPlace(a, { verify: true, addNamespace: true, removeEmpty: true });

            this.#craftedBuildingBlockTypeIds = a;
            this.#craftedBuildingBlockTypeIdSet = new Set(a);
        }
        return this.#craftedBuildingBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getCraftedBuildingBlockTypeIds () {
        if (!this.#craftedBuildingBlockTypeIds) this.#craftedBuildingBlockTypeIds = Array.from(this.getCraftedBuildingBlockTypeIdSet());
        return this.#craftedBuildingBlockTypeIds;
    }

    /**
     * Directly cooked - not added colors (use ..glass to get those)
     * @returns {Set<string>}
     */
    static getCookedBuildingBlockTypeIdSet () {
        if (!this.#cookedBuildingBlockTypeIdSet) {
            const a = [
                ...this.getGlazedTerracottaBlockTypeIds(),
                'bricks', 'nether_bricks', 'red_nether_bricks',
                'smooth_stone', 'stone', 'smooth_basalt',
                'glass', 'dry_sponge'
            ];
            this.normalizeBlockIdsInPlace(a);
            this.#cookedBuildingBlockTypeIds = a;
            this.#cookedBuildingBlockTypeIdSet = new Set(a);
        }
        return this.#cookedBuildingBlockTypeIdSet;
    }
    /**
     * @returns {string[]}
     */
    static getCookedBuildingBlockTypeIds () {
        if (!this.#cookedBuildingBlockTypeIds) this.#cookedBuildingBlockTypeIds = Array.from(this.getCookedBuildingBlockTypeIdSet());
        return this.#cookedBuildingBlockTypeIds;
    }

    //================================================================================================
    //Utilities
    /**
     * @param {string} typeId
     * @returns {boolean}
     */
    static isValidTypeId (typeId) {
        return this.getValidBlockTypeIdSet().has(typeId);
    }
    //================================================================================================
    // Aliases - cause I can't remember the proper name
    //================================================================================================
    /**
  * Build a map of "shorthand-ish" ids -> real ids from the world's registered types.
  * Collisions are ignored (if two different real ids want the same alias, we skip that alias).
  *
  * @returns {Map<string,string>}
  */
    static getAutoAliasMap () {
        if (this.#autoAliasMap) return this.#autoAliasMap;

        const valid = this.getValidBlockTypeIdSet();
        /** @type {Map<string,string>} */
        const m = new Map();
        /** @type {Set<string>} */
        const collided = new Set();

        /**
         * @param {string} alias
         * @param {string} real
         */
        const addAlias = (alias, real) => {
            if (valid.has(alias)) return;               // alias already valid; don't override
            if (collided.has(alias)) return;            // already known ambiguous
            const prev = m.get(alias);
            if (!prev) m.set(alias, real);
            else if (prev !== real) { m.delete(alias); collided.add(alias); } // ambiguity
        };

        for (const id of valid) {
            // Only auto-alias vanilla namespace (optional; remove this if you want for custom too)
            // if (!id.startsWith("minecraft:")) continue;

            // *_block -> shorthand
            if (id.endsWith("_block")) {
                addAlias(id.slice(0, -6), id); // remove "_block" (underscore included)
            }


            // *_bricks <-> *_brick
            if (id.endsWith("_bricks")) {
                addAlias(id.slice(0, -1), id); // bricks -> brick
            } else if (id.endsWith("_brick")) {
                addAlias(id + "s", id);        // brick -> bricks
            }

            // *_tiles <-> *_tile
            if (id.endsWith("_tiles")) {
                addAlias(id.slice(0, -1), id); // tiles -> tile
            } else if (id.endsWith("_tile")) {
                addAlias(id + "s", id);        // tile -> tiles
            }
        }

        this.#autoAliasMap = m;
        return m;
    }
    /**
     * Coerce an id into a valid id if possible:
     * - if it's already valid, keep it
     * - else try auto-alias fixups
     * - else return "" (invalid)
     *
     * @param {string} typeId
     * @returns {string}
     */
    static coerceToValidTypeId (typeId) {
        const valid = this.getValidBlockTypeIdSet();
        if (valid.has(typeId)) return typeId;

        const alias = this.getAutoAliasMap().get(typeId);
        if (alias && valid.has(alias)) return alias;

        return "";
    }
    //==============================================================================  
    static listValidDifferences () {
        // Item ids (namespaced) -> fast membership checks
        const validItemSet = new Set(ItemTypes.getAll().map(it => it.id));

        // Blocks that do NOT have a matching item id
        const blockNotOnItemList = this.getValidVanillaBlockTypeIds()
            .filter(b => !validItemSet.has(b));

        // ✅ real JS loop (not foreach)
        for (const b of blockNotOnItemList) {
            // do whatever you want here:
            // - emit(b)
            // - console.warn(b)
            // - build a report
            console.warn("Block has no item:", b);
        }

        return blockNotOnItemList;
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
    static normalizeBlockIdsInPlace (a, opts = {}) {
        const verify = opts.verify ?? false;
        const addNamespace = (opts.addNamespace ?? true) || verify;
        const removeEmpty = opts.removeEmpty ?? true;

        // One pass: trim + optional removeEmpty + optional namespace
        let w = 0;
        for (let i = 0; i < a.length; i++) {
            let s = String(a[ i ] ?? "").trim();
            if (removeEmpty && !s) continue;
            if (addNamespace) s = addNameSpace(s); // or addNameSpaceInPlace if you prefer two-pass
            if (verify) {
                const fixed = BlockTypeIds.coerceToValidTypeId(s);
                if (!fixed) continue;    // remove invalid
                s = fixed;
            }

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
    static filterValidBlockTypeIdsInPlace (a) {
        this.normalizeBlockIdsInPlace(a, { addNamespace: true, verify: false, removeEmpty: true });
        return this.purgeInvalidBlockTypeIdsInPlace_auto(a);
    }
    /**
     * Purge invalid block typeIds in-place (FAST).
     * Does NOT normalize, namespace, or dedupe.
     *
     * @param {string[]} a
     * @param {Set<string>} validSet  // usually Blocks.getValidBlockTypeIdSet()
     * @returns {string[]} same array instance
     */
    static purgeInvalidBlockTypeIdsInPlace (a, validSet) {
        let w = 0;
        for (let r = 0; r < a.length; r++) {
            const id = a[ r ];
            if (validSet.has(id)) a[ w++ ] = id;
        }
        a.length = w;
        return a;
    }
    /**
     * Purge invalid block typeIds in-place (FAST).
     * Uses cached valid set.
     *
     * @param {string[]} a
     * @returns {string[]}
     */
    static purgeInvalidBlockTypeIdsInPlace_auto (a) {
        return this.purgeInvalidBlockTypeIdsInPlace(a, BlockTypeIds.getValidBlockTypeIdSet());
    }

    //================================================================================================
    /**
     * Add slab variants in-place.
     * - only adds if valid (via world registry) when verify=true
     * - includes your plural hack: "_bricks" → "_brick_slab" attempt, etc.
     *
     * @param {string[]} a
     * @param {{ verify?: boolean, pluralHack?: boolean }} [opts]
     * @returns {string[]}
     */
    static addSlabVariantsInPlace (a, opts = {}) {
        const verify = opts.verify ?? true;
        const pluralHack = opts.pluralHack ?? true;

        // 1) Normalize ONLY (no validity policing yet)
        this.normalizeBlockIdsInPlace(a, { addNamespace: true, verify: false, removeEmpty: true });

        // 2) Snapshot raw strings for derivation (may contain invalid ids)
        const sourceRaw = a.slice();

        // 3) Police the live array NOW (coerce + drop invalid) so a is always safe
        if (verify) {
            this.normalizeBlockIdsInPlace(a, { addNamespace: true, verify: true, removeEmpty: true });
        }

        const validSlabSet = verify ? BlockTypeIds.getValidSlabTypeIdSet() : null;
        const existing = new Set(a);

        // Use BOTH raw + coerced sources for derivation
        const sources = verify ? [ sourceRaw, a ] : [ sourceRaw ];

        for (const src of sources) {
            for (const b of src) {
                if (!b || b.endsWith("_slab")) continue;

                /** @type {string[]} */
                const candidates = [ `${b}_slab` ];

                // plural hack: bricks -> brick_slab, tiles -> tile_slab, etc.
                if (pluralHack && b.endsWith("s")) {
                    candidates.push(`${b.slice(0, -1)}_slab`);
                }

                // block hack: purpur_block -> purpur_slab, magma_block -> magma_slab, etc.
                if (b.endsWith("_block")) {
                    candidates.push(`${b.slice(0, -6)}_slab`);
                }

                for (const slabId of candidates) {
                    if (existing.has(slabId)) continue;
                    if (validSlabSet && !validSlabSet.has(slabId)) continue;

                    a.push(slabId);
                    existing.add(slabId);
                }
            }
        }

        dedupeArrayInPlace(a);
        return a;
    }
    /**
     * Add wall variants in-place.
     * - only adds if valid (via world registry) when verify=true
     * - includes your plural hack: "_bricks" → "_brick_wall" attempt, etc.
     *
     * @param {string[]} a
     * @param {{ verify?: boolean, pluralHack?: boolean }} [opts]
     * @returns {string[]}
     */
    static addWallVariantsInPlace (a, opts = {}) {
        const verify = opts.verify ?? true;
        const pluralHack = opts.pluralHack ?? true;

        // 1) Normalize ONLY (no validity policing yet)
        this.normalizeBlockIdsInPlace(a, { addNamespace: true, verify: false, removeEmpty: true });

        // 2) Snapshot raw strings for derivation (may contain invalid ids)
        const sourceRaw = a.slice();

        // 3) Police the live array NOW (coerce + drop invalid) so a is always safe
        if (verify) {
            this.normalizeBlockIdsInPlace(a, { addNamespace: true, verify: true, removeEmpty: true });
        }

        const validWallSet = verify ? BlockTypeIds.getValidWallTypeIdSet() : null;
        const existing = new Set(a);

        // Use BOTH raw + coerced sources for derivation
        const sources = verify ? [ sourceRaw, a ] : [ sourceRaw ];

        for (const src of sources) {
            for (const b of src) {
                if (!b || b.endsWith("_wall")) continue;

                /** @type {string[]} */
                const candidates = [ `${b}_wall` ];

                // plural hack: bricks -> brick_wall, tiles -> tile_wall, etc.
                if (pluralHack && b.endsWith("s")) {
                    candidates.push(`${b.slice(0, -1)}_wall`);
                }

                // block hack: purpur_block -> purpur_wall, magma_block -> magma_wall, etc.
                if (b.endsWith("_block")) {
                    candidates.push(`${b.slice(0, -6)}_wall`);
                }

                for (const wallId of candidates) {
                    if (existing.has(wallId)) continue;
                    if (validWallSet && !validWallSet.has(wallId)) continue;

                    a.push(wallId);
                    existing.add(wallId);
                }
            }
        }

        dedupeArrayInPlace(a);
        return a;
    }
}