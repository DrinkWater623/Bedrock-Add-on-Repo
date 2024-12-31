//@ts-check
//========================================================================
// Code Credit: QuazChick
// License: MIT
// url: https://github.com/QuazChick/pillars-addon/tree/main/BP/scripts/src/components/cutCopperPillarOxidation
// Converted from TS with: https://transform.tools/typescript-to-javascript
// Altered for my slabs instead of her pillars
//========================================================================
import { BlockComponentPlayerInteractEvent, BlockPermutation, EquipmentSlot } from "@minecraft/server";
import { damageItem } from "./utils/damageItem";
import { spawnCopperWaxParticles } from "./utils/spawnCopperWaxParticles";
import { placeBlockEventHandler } from "./utils/placeBlockTry";

const unwaxMap = {
    "dw623:vertical_waxed_cut_copper_slab": "dw623:vertical_cut_copper_slab",
    "dw623:vertical_waxed_exposed_cut_copper_slab": "dw623:vertical_exposed_cut_copper_slab",
    "dw623:vertical_waxed_weathered_cut_copper_slab": "dw623:vertical_weathered_cut_copper_slab",
    "dw623:vertical_waxed_oxidized_cut_copper_slab": "dw623:vertical_oxidized_cut_copper_slab"
};

export const UnwaxableCutCopperBlockComponent = {
    /**
     * 
     * @param {BlockComponentPlayerInteractEvent} event 
     * @returns 
     */
    onPlayerInteract: event => {
        const { player, block, dimension } = event;
        if (!player) return;

        const equippable = player.getComponent("equippable");

        if (!equippable) return;

        let mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);

        if (!mainhand.hasItem() || mainhand.typeId !== "minecraft:honeycomb") return;
        if (!mainhand.hasTag("minecraft:is_axe")) {
            placeBlockEventHandler(event, mainhand);
            return;
        }

        dimension.playSound("copper.wax.off", block.location);

        spawnCopperWaxParticles(dimension, block.location, {
            red: 1,
            green: 1,
            blue: 1
        });

        block.setPermutation(
            BlockPermutation.resolve(
                unwaxMap[ block.typeId ],
                block.permutation.getAllStates()
            )
        );

        damageItem(player, mainhand);
    }
};
