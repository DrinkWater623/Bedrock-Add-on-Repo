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

const stages = [
    "dw623:vertical_cut_copper_slab",
    "dw623:vertical_exposed_cut_copper_slab",
    "dw623:vertical_weathered_cut_copper_slab",
    "dw623:vertical_oxidized_cut_copper_slab"
];

export const ScrapeableCutCopperBlockComponent = {

    /**
     * 
     * @param {BlockComponentPlayerInteractEvent} event 
     * @returns 
     */
    onPlayerInteract: (event) => {
        const { player, block, dimension } = event;
        if (!player) return;

        const equippable = player.getComponent("equippable");

        if (!equippable) return;

        const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);

        if (!mainhand.hasItem() || mainhand.typeId !== "minecraft:honeycomb") return;
        if (!mainhand.hasTag("minecraft:is_axe")) {
            placeBlockEventHandler(event, mainhand);
            return;
        }
        
        const currentStageIndex = stages.indexOf(block.typeId);

        dimension.playSound("scrape", block.location);

        spawnCopperWaxParticles(dimension, block.location, {
            red: 0.5,
            green: 0.8,
            blue: 0.7
        });

        block.setPermutation(
            BlockPermutation.resolve(
                stages[ currentStageIndex - 1 ],
                block.permutation.getAllStates()
            )
        );

        damageItem(player, mainhand);
    }
};
