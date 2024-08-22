import { world, system, Dimension, DimensionType } from "@minecraft/server";

const debug = true;

system.afterEvents.scriptEventReceive.subscribe((event) => {
    const { id, message, sourceEntity: entity, sourceType } = event;

    if (id && id === 'onFind:placeWeb') {
        if (!entity || entity.typeId !== 'dw623:tree_spider') return;

        //Only work in overworld
        const  dimension  = entity.dimension;
        if (dimension.id.endsWith('overworld')) {
            if (debug) world.sendMessage('Not in overworld');
            return;
        }

        const location = entity.location;
        const rotation = Math.trunc(((Math.trunc(entity.getRotation().y) + 360) % 360) / 90);
        let webLocationOffset = location;
        let resolved = false;

        //Look Below first.. if grass/fern, default selection
        const blockBelow = dimension.getBlockBelow(location);
        if (blockBelow.typeId.endsWith('fern') ||
            blockBelow.typeId.endsWith('_grass')) {
            //replace block
            webLocationOffset.y--;
            resolved = true;
        }
        else if (blockBelow.typeId.endsWith('_leaves')) {
            //random chance on replace block
            if 
            resolved = true;
        }
        else if (blockBelow.typeId.endsWith('lantern')) {
            //it goes above
            resolved = true;
        }

        //Look around x,z
        if (!resolved) {
            //get block looking at
            const block = entity.getBlockFromViewDirection({
                maxDistance: 1,
                includePassableBlocks: true,
                includeLiquidBlocks: true,
                includeTypes: [
                    "minecraft:acacia_leaves",
                    "minecraft:birch_leaves",
                    "minecraft:cherry_leaves",
                    "minecraft:dark_oak_leaves",
                    "minecraft:jungle_leaves",
                    "minecraft:mangrove_leaves",
                    "minecraft:oak_leaves",
                    "minecraft:spruce_leaves",
                    "minecraft:fern",
                    "minecraft:vine",
                    "minecraft:lantern",
                    "minecraft:soul_lantern",
                    "minecraft:end_rod",
                    "minecraft:short_grass",
                    "minecraft:tall_grass"
                ]
            })?.block;
            if (!block) return; //nothing to do
            resolved = true;

            //if plant - random chance on replace

            //if vine, get leave behind or put in front
        }

        //Place Web
        if (resolved) {
            dimension.setBlockType(webLocationOffset, 'minecraft:web');
            //go home
            entity.triggerEvent('find_flower_timeout');
        }

        const x = sourceEntity.
            world.sendMessage(`y-rotation ${sourceEntity.getRotation().y.toFixed()}`);
    }
});