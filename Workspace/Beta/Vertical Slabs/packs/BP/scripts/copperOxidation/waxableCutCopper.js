//@ts-check
//========================================================================
// Code Credit: QuazChick
// License: MIT
// url: https://github.com/QuazChick/pillars-addon/tree/main/BP/scripts/src/components/cutCopperPillarOxidation
// Converted from TS with: https://transform.tools/typescript-to-javascript
// Altered for my slabs instead of her pillars
//========================================================================
import { BlockComponentPlayerInteractEvent, BlockPermutation, EquipmentSlot } from "@minecraft/server";
import { decrementStack } from "./utils/decrementStack";
import { spawnCopperWaxParticles } from "./utils/spawnCopperWaxParticles";
import { placeBlockEventHandler } from "./utils/placeBlockTry";

const waxMap = {
    "dw623:vertical_cut_copper_slab"             : "dw623:vertical_waxed_cut_copper_slab",
    "dw623:vertical_exposed_cut_copper_slab"     : "dw623:vertical_waxed_exposed_cut_copper_slab",
    "dw623:vertical_weathered_cut_copper_slab"   : "dw623:vertical_waxed_weathered_cut_copper_slab",
    "dw623:vertical_oxidized_cut_copper_slab"    : "dw623:vertical_waxed_oxidized_cut_copper_slab"
};

export const WaxableCutCopperBlockComponent = {
    /**
     * 
     * @param {BlockComponentPlayerInteractEvent} event 
     * @returns 
     */
    onPlayerInteract: event => {
        const { player, block, dimension } = event
        if (!player) return;

        const equippable = player.getComponent("equippable");

        if (!equippable) return;

        let mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);

        if (!mainhand.hasItem() || 
            mainhand.hasTag("minecraft:is_axe")) return;

        if (mainhand.typeId !== "minecraft:honeycomb") {
            placeBlockEventHandler(event,mainhand)
            return;
        }

        dimension.playSound("copper.wax.on", block.location);

        spawnCopperWaxParticles(dimension, block.location, {
            red: 1,
            green: 0.55,
            blue: 0
        });

        const waxedBlockTypeId = waxMap[ block.typeId ];

        if (!waxedBlockTypeId)
            throw new Error(`Could not find waxed block type for '${block.typeId}'.`);

        block.setPermutation(
            BlockPermutation.resolve(
                waxedBlockTypeId,
                block.permutation.getAllStates()
            )
        );

        decrementStack(player, mainhand);
    }
};
