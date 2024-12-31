//========================================================================
// Code Credit: QuazChick
// License: MIT
// url: https://github.com/QuazChick/pillars-addon/tree/main/BP/scripts/src/components/cutCopperPillarOxidation
// Converted from TS with: https://transform.tools/typescript-to-javascript
// Altered for my slabs instead of her pillars
//========================================================================
import { OxidationLevel } from "./oxidationLevels";

export const blockOxidationLevels = {
    "minecraft:copper_block": OxidationLevel.None,
    "minecraft:copper_bulb": OxidationLevel.None,
    "minecraft:copper_grate": OxidationLevel.None,
    "minecraft:copper_door": OxidationLevel.None,
    "minecraft:copper_trapdoor": OxidationLevel.None,
    "minecraft:chiseled_copper": OxidationLevel.None,
    "minecraft:cut_copper": OxidationLevel.None,
    "minecraft:cut_copper_slab": OxidationLevel.None,
    "minecraft:cut_copper_stairs": OxidationLevel.None,
    "dw623:vertical_cut_copper_slab": OxidationLevel.None,
    //
    "minecraft:exposed_copper": OxidationLevel.Exposed,
    "minecraft:exposed_copper_bulb": OxidationLevel.Exposed,
    "minecraft:exposed_copper_grate": OxidationLevel.Exposed,
    "minecraft:exposed_copper_door": OxidationLevel.Exposed,
    "minecraft:exposed_copper_trapdoor": OxidationLevel.Exposed,
    "minecraft:exposed_chiseled_copper": OxidationLevel.Exposed,
    "minecraft:exposed_cut_copper": OxidationLevel.Exposed,
    "minecraft:exposed_cut_copper_slab": OxidationLevel.Exposed,
    "minecraft:exposed_cut_copper_stairs": OxidationLevel.Exposed,
    "dw623:vertical_exposed_cut_copper_slab": OxidationLevel.Exposed,
    //
    "minecraft:weathered_copper": OxidationLevel.Weathered,
    "minecraft:weathered_copper_bulb": OxidationLevel.Weathered,
    "minecraft:weathered_copper_grate": OxidationLevel.Weathered,
    "minecraft:weathered_copper_door": OxidationLevel.Weathered,
    "minecraft:weathered_copper_trapdoor": OxidationLevel.Weathered,
    "minecraft:weathered_chiseled_copper": OxidationLevel.Weathered,
    "minecraft:weathered_cut_copper": OxidationLevel.Weathered,
    "minecraft:weathered_cut_copper_slab": OxidationLevel.Weathered,
    "minecraft:weathered_cut_copper_stairs": OxidationLevel.Weathered,
    "dw623:vertical_weathered_cut_copper_slab": OxidationLevel.Weathered,
    //
    "minecraft:oxidized_copper": OxidationLevel.Oxidized,
    "minecraft:oxidized_copper_bulb": OxidationLevel.Oxidized,
    "minecraft:oxidized_copper_grate": OxidationLevel.Oxidized,
    "minecraft:oxidized_copper_door": OxidationLevel.Oxidized,
    "minecraft:oxidized_copper_trapdoor": OxidationLevel.Oxidized,
    "minecraft:oxidized_chiseled_copper": OxidationLevel.Oxidized,
    "minecraft:oxidized_cut_copper": OxidationLevel.Oxidized,
    "minecraft:oxidized_cut_copper_slab": OxidationLevel.Oxidized,
    "minecraft:oxidized_cut_copper_stairs": OxidationLevel.Oxidized,
    "dw623:vertical_oxidized_cut_copper_slab": OxidationLevel.Oxidized
};
