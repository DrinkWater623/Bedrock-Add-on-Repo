//@ts-checkts
/*
    Start of a table I will keep for this
    1) Table Data: https://minecraft.wiki/w/Breaking
    2) Fix in Excel
    3) https://tableconvert.com/excel-to-json

    Last Update: 20241227 10:40
*/
function round (number, place = 0) {
    if (place <= 0) return Math.round(number);
    let multiplier = parseInt('1' + ('0'.repeat(place)));
    return Math.round(number * multiplier) / multiplier;
}
//====================================================================================================
const miningSpeedExelData = [
    {
        "block": "allow",
        "hardness": "∞",
        "tool": -1,
        "lowest": "creative",
        "hand": "∞",
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "deny",
        "hardness": "∞",
        "tool": -1,
        "lowest": "creative",
        "hand": "∞",
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "barrier",
        "hardness": "∞",
        "tool": -1,
        "lowest": "creative",
        "hand": "∞",
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "bedrock",
        "hardness": "∞",
        "tool": -1,
        "lowest": "creative",
        "hand": "∞",
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "border",
        "hardness": "∞",
        "tool": -1,
        "lowest": "creative",
        "hand": "∞",
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "command_block",
        "hardness": "∞",
        "tool": -1,
        "lowest": "creative",
        "hand": "∞",
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "chain_command_block",
        "hardness": "∞",
        "tool": -1,
        "lowest": "creative",
        "hand": "∞",
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "repeating_command_block",
        "hardness": "∞",
        "tool": -1,
        "lowest": "creative",
        "hand": "∞",
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "end_gateway",
        "hardness": "∞",
        "tool": -1,
        "lowest": "creative",
        "hand": "∞",
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "end_portal",
        "hardness": "∞",
        "tool": -1,
        "lowest": "creative",
        "hand": "∞",
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "end_portal_frame",
        "hardness": "∞",
        "tool": -1,
        "lowest": "creative",
        "hand": "∞",
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "invisible_bedrock",
        "hardness": "∞",
        "tool": -1,
        "lowest": "creative",
        "hand": "∞",
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "jigsaw_block",
        "hardness": "∞",
        "tool": -1,
        "lowest": "creative",
        "hand": "∞",
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "light",
        "hardness": "∞",
        "tool": -1,
        "lowest": "creative",
        "hand": "∞",
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "moving_piston",
        "hardness": "∞",
        "tool": -1,
        "lowest": "creative",
        "hand": "∞",
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "nether_portal",
        "hardness": "∞",
        "tool": -1,
        "lowest": "creative",
        "hand": "∞",
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "structure_block",
        "hardness": "∞",
        "tool": -1,
        "lowest": "creative",
        "hand": "∞",
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "lava",
        "hardness": 100,
        "tool": -1,
        "lowest": "creative",
        "hand": 150,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "water",
        "hardness": 100,
        "tool": -1,
        "lowest": "creative",
        "hand": 150,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "reinforced_deepslate",
        "hardness": 55,
        "tool": -1,
        "lowest": "creative",
        "hand": 82.5,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "trial_spawner",
        "hardness": 50,
        "tool": -1,
        "lowest": "creative",
        "hand": 250,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "vault",
        "hardness": 50,
        "tool": -1,
        "lowest": "creative",
        "hand": 250,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "netherite_block",
        "hardness": 50,
        "best_tool": "pickaxe",
        "lowest": "diamond",
        "hand": 250,
        "wooden": 125,
        "stone": 62.5,
        "iron": 41.7,
        "diamond": 9.4,
        "netherite": 8.35,
        "golden": 20.85,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "crying_obsidian",
        "hardness": 50,
        "best_tool": "pickaxe",
        "lowest": "diamond",
        "hand": 250,
        "wooden": 125,
        "stone": 62.5,
        "iron": 41.7,
        "diamond": 9.4,
        "netherite": 8.35,
        "golden": 20.85,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "glowing_obsidian",
        "hardness": 35,
        "best_tool": "pickaxe",
        "lowest": "diamond",
        "hand": 175,
        "wooden": 87.5,
        "stone": 43.75,
        "iron": 29.2,
        "diamond": 6.6,
        "netherite": 5.85,
        "golden": 14.6,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "obsidian",
        "hardness": 50,
        "best_tool": "pickaxe",
        "lowest": "diamond",
        "hand": 250,
        "wooden": 125,
        "stone": 62.5,
        "iron": 41.7,
        "diamond": 9.4,
        "netherite": 8.35,
        "golden": 20.85,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "respawn_anchor",
        "hardness": 50,
        "best_tool": "pickaxe",
        "lowest": "diamond",
        "hand": 250,
        "wooden": 125,
        "stone": 62.5,
        "iron": 41.7,
        "diamond": 9.4,
        "netherite": 8.35,
        "golden": 20.85,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "ancient_debris",
        "hardness": 30,
        "best_tool": "pickaxe",
        "lowest": "diamond",
        "hand": 150,
        "wooden": 75,
        "stone": 37.5,
        "iron": 25,
        "diamond": 5.65,
        "netherite": 5,
        "golden": 12.5,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "ender_chest",
        "hardness": 22.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 112.5,
        "wooden": 16.9,
        "stone": 8.45,
        "iron": 5.65,
        "diamond": 4.25,
        "netherite": 3.75,
        "golden": 2.85,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "creaking_heart",
        "hardness": 10,
        "best_tool": "axe",
        "lowest": "wood",
        "hand": 50,
        "wooden": 7.5,
        "stone": 3.75,
        "iron": 2.5,
        "diamond": 1.9,
        "netherite": 1.7,
        "golden": 1.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "hardened_glass",
        "hardness": 10,
        "tool": -1,
        "lowest": "hand",
        "hand": 15,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "hardened_glass_pane",
        "hardness": 10,
        "tool": -1,
        "lowest": "hand",
        "hand": 15,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "hardened_stained_glass",
        "hardness": 10,
        "tool": -1,
        "lowest": "hand",
        "hand": 15,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "hardened_stained_glass_pane",
        "hardness": 10,
        "tool": -1,
        "lowest": "hand",
        "hand": 15,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "heavy_core",
        "hardness": 10,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 50,
        "wooden": 7.5,
        "stone": 3.75,
        "iron": 2.5,
        "diamond": 1.9,
        "netherite": 1.7,
        "golden": 1.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "anvil",
        "hardness": 5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 25,
        "wooden": 3.75,
        "stone": 1.9,
        "iron": 1.25,
        "diamond": 0.95,
        "netherite": 0.85,
        "golden": 0.65,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "bell",
        "hardness": 5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 25,
        "wooden": 3.75,
        "stone": 1.9,
        "iron": 1.25,
        "diamond": 0.95,
        "netherite": 0.85,
        "golden": 0.65,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "coal_block",
        "hardness": 5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 25,
        "wooden": 3.75,
        "stone": 1.9,
        "iron": 1.25,
        "diamond": 0.95,
        "netherite": 0.85,
        "golden": 0.65,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "diamond_block",
        "hardness": 5,
        "best_tool": "pickaxe",
        "lowest": "iron",
        "hand": 25,
        "wooden": 12.5,
        "stone": 6.25,
        "iron": 1.25,
        "diamond": 0.95,
        "netherite": 0.85,
        "golden": 2.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "emerald_block",
        "hardness": 5,
        "best_tool": "pickaxe",
        "lowest": "iron",
        "hand": 25,
        "wooden": 12.5,
        "stone": 6.25,
        "iron": 1.25,
        "diamond": 0.95,
        "netherite": 0.85,
        "golden": 2.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "iron_block",
        "hardness": 5,
        "best_tool": "pickaxe",
        "lowest": "stone",
        "hand": 25,
        "wooden": 12.5,
        "stone": 1.9,
        "iron": 1.25,
        "diamond": 0.95,
        "netherite": 0.85,
        "golden": 2.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "redstone_block",
        "hardness": 5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 25,
        "wooden": 3.75,
        "stone": 1.9,
        "iron": 1.25,
        "diamond": 0.95,
        "netherite": 0.85,
        "golden": 0.65,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "raw_copper_block",
        "hardness": 5,
        "best_tool": "pickaxe",
        "lowest": "stone",
        "hand": 25,
        "wooden": 12.5,
        "stone": 1.9,
        "iron": 1.25,
        "diamond": 0.95,
        "netherite": 0.85,
        "golden": 2.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "raw_gold_block",
        "hardness": 5,
        "best_tool": "pickaxe",
        "lowest": "iron",
        "hand": 25,
        "wooden": 12.5,
        "stone": 6.25,
        "iron": 1.25,
        "diamond": 0.95,
        "netherite": 0.85,
        "golden": 2.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "raw_iron_block",
        "hardness": 5,
        "best_tool": "pickaxe",
        "lowest": "stone",
        "hand": 25,
        "wooden": 12.5,
        "stone": 1.9,
        "iron": 1.25,
        "diamond": 0.95,
        "netherite": 0.85,
        "golden": 2.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "chain",
        "hardness": 5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 25,
        "wooden": 3.75,
        "stone": 1.9,
        "iron": 1.25,
        "diamond": 0.95,
        "netherite": 0.85,
        "golden": 0.65,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "enchanting_table",
        "hardness": 5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 25,
        "wooden": 3.75,
        "stone": 1.9,
        "iron": 1.25,
        "diamond": 0.95,
        "netherite": 0.85,
        "golden": 0.65,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "iron_bars",
        "hardness": 5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 25,
        "wooden": 3.75,
        "stone": 1.9,
        "iron": 1.25,
        "diamond": 0.95,
        "netherite": 0.85,
        "golden": 0.65,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "iron_door",
        "hardness": 5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 25,
        "wooden": 3.75,
        "stone": 1.9,
        "iron": 1.25,
        "diamond": 0.95,
        "netherite": 0.85,
        "golden": 0.65,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "iron_trapdoor",
        "hardness": 5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 25,
        "wooden": 3.75,
        "stone": 1.9,
        "iron": 1.25,
        "diamond": 0.95,
        "netherite": 0.85,
        "golden": 0.65,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "monster_spawner",
        "hardness": 5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 25,
        "wooden": 3.75,
        "stone": 1.9,
        "iron": 1.25,
        "diamond": 0.95,
        "netherite": 0.85,
        "golden": 0.65,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "deepslate_diamond_ore",
        "hardness": 4.5,
        "best_tool": "pickaxe",
        "lowest": "iron",
        "hand": 22.5,
        "wooden": 11.25,
        "stone": 5.65,
        "iron": 1.15,
        "diamond": 0.85,
        "netherite": 0.75,
        "golden": 1.9,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "deepslate_gold_ore",
        "hardness": 4.5,
        "best_tool": "pickaxe",
        "lowest": "iron",
        "hand": 22.5,
        "wooden": 11.25,
        "stone": 5.65,
        "iron": 1.15,
        "diamond": 0.85,
        "netherite": 0.75,
        "golden": 1.9,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "deepslate_iron_ore",
        "hardness": 4.5,
        "best_tool": "pickaxe",
        "lowest": "stone",
        "hand": 22.5,
        "wooden": 11.25,
        "stone": 1.7,
        "iron": 1.15,
        "diamond": 0.85,
        "netherite": 0.75,
        "golden": 1.9,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "deepslate_lapis_lazuli_ore",
        "hardness": 4.5,
        "best_tool": "pickaxe",
        "lowest": "stone",
        "hand": 22.5,
        "wooden": 11.25,
        "stone": 1.7,
        "iron": 1.15,
        "diamond": 0.85,
        "netherite": 0.75,
        "golden": 1.9,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "deepslate_redstone_ore",
        "hardness": 4.5,
        "best_tool": "pickaxe",
        "lowest": "iron",
        "hand": 22.5,
        "wooden": 11.25,
        "stone": 5.65,
        "iron": 1.15,
        "diamond": 0.85,
        "netherite": 0.75,
        "golden": 1.9,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "cobweb",
        "hardness": 4,
        "tool": -1,
        "best_tool": "shears || sword",
        "hand": 20,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": 0.4,
        "sword": 0.4
    },
    {
        "block": "blast_furnace",
        "hardness": 3.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 17.5,
        "wooden": 2.65,
        "stone": 1.35,
        "iron": 0.9,
        "diamond": 0.7,
        "netherite": 0.6,
        "golden": 0.45,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "dispenser",
        "hardness": 3.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 17.5,
        "wooden": 2.65,
        "stone": 1.35,
        "iron": 0.9,
        "diamond": 0.7,
        "netherite": 0.6,
        "golden": 0.45,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "dropper",
        "hardness": 3.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 17.5,
        "wooden": 2.65,
        "stone": 1.35,
        "iron": 0.9,
        "diamond": 0.7,
        "netherite": 0.6,
        "golden": 0.45,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "furnace",
        "hardness": 3.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 17.5,
        "wooden": 2.65,
        "stone": 1.35,
        "iron": 0.9,
        "diamond": 0.7,
        "netherite": 0.6,
        "golden": 0.45,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "lantern",
        "hardness": 3.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 17.5,
        "wooden": 2.65,
        "stone": 1.35,
        "iron": 0.9,
        "diamond": 0.7,
        "netherite": 0.6,
        "golden": 0.45,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "stonecutter",
        "hardness": 3.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 17.5,
        "wooden": 2.65,
        "stone": 1.35,
        "iron": 0.9,
        "diamond": 0.7,
        "netherite": 0.6,
        "golden": 0.45,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "smoker",
        "hardness": 3.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 17.5,
        "wooden": 2.65,
        "stone": 1.35,
        "iron": 0.9,
        "diamond": 0.7,
        "netherite": 0.6,
        "golden": 0.45,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "lodestone",
        "hardness": 3.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 17.5,
        "wooden": 2.65,
        "stone": 1.35,
        "iron": 0.9,
        "diamond": 0.7,
        "netherite": 0.6,
        "golden": 0.45,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "cobbled_deepslate",
        "hardness": 3.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 17.5,
        "wooden": 2.65,
        "stone": 1.35,
        "iron": 0.9,
        "diamond": 0.7,
        "netherite": 0.6,
        "golden": 0.45,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "deepslate_bricks",
        "hardness": 3.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 17.5,
        "wooden": 2.65,
        "stone": 1.35,
        "iron": 0.9,
        "diamond": 0.7,
        "netherite": 0.6,
        "golden": 0.45,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "deepslate_tiles",
        "hardness": 3.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 17.5,
        "wooden": 2.65,
        "stone": 1.35,
        "iron": 0.9,
        "diamond": 0.7,
        "netherite": 0.6,
        "golden": 0.45,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "polished_deepslate",
        "hardness": 3.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 17.5,
        "wooden": 2.65,
        "stone": 1.35,
        "iron": 0.9,
        "diamond": 0.7,
        "netherite": 0.6,
        "golden": 0.45,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "chiseled_deepslate",
        "hardness": 3.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 17.5,
        "wooden": 2.65,
        "stone": 1.35,
        "iron": 0.9,
        "diamond": 0.7,
        "netherite": 0.6,
        "golden": 0.45,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "beacon",
        "hardness": 3,
        "tool": -1,
        "best_tool": "hand",
        "lowest": "hand",
        "hand": 4.5,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "gold_block",
        "hardness": 3,
        "best_tool": "pickaxe",
        "lowest": "iron",
        "hand": 15,
        "wooden": 7.5,
        "stone": 3.75,
        "iron": 0.75,
        "diamond": 0.6,
        "netherite": 0.5,
        "golden": 1.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "lapis_lazuli_block",
        "hardness": 3,
        "best_tool": "pickaxe",
        "lowest": "stone",
        "hand": 15,
        "wooden": 7.5,
        "stone": 1.15,
        "iron": 0.75,
        "diamond": 0.6,
        "netherite": 0.5,
        "golden": 1.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "coal_ore",
        "hardness": 3,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 15,
        "wooden": 2.25,
        "stone": 1.15,
        "iron": 0.75,
        "diamond": 0.6,
        "netherite": 0.5,
        "golden": 0.4,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "copper_block",
        "hardness": 3,
        "best_tool": "pickaxe",
        "lowest": "stone",
        "hand": 15,
        "wooden": 7.5,
        "stone": 1.15,
        "iron": 0.75,
        "diamond": 0.6,
        "netherite": 0.5,
        "golden": 1.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "copper_ore",
        "hardness": 3,
        "best_tool": "pickaxe",
        "lowest": "stone",
        "hand": 15,
        "wooden": 7.5,
        "stone": 1.15,
        "iron": 0.75,
        "diamond": 0.6,
        "netherite": 0.5,
        "golden": 1.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "cut_copper",
        "hardness": 3,
        "best_tool": "pickaxe",
        "lowest": "stone",
        "hand": 15,
        "wooden": 7.5,
        "stone": 1.15,
        "iron": 0.75,
        "diamond": 0.6,
        "netherite": 0.5,
        "golden": 1.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "cut_copper_slab",
        "hardness": 3,
        "best_tool": "pickaxe",
        "lowest": "stone",
        "hand": 15,
        "wooden": 7.5,
        "stone": 1.15,
        "iron": 0.75,
        "diamond": 0.6,
        "netherite": 0.5,
        "golden": 1.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "cut_copper_stairs",
        "hardness": 3,
        "best_tool": "pickaxe",
        "lowest": "stone",
        "hand": 15,
        "wooden": 7.5,
        "stone": 1.15,
        "iron": 0.75,
        "diamond": 0.6,
        "netherite": 0.5,
        "golden": 1.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "dragon_egg",
        "hardness": 3,
        "tool": -1,
        "lowest": "hand",
        "hand": 4.5,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "deepslate",
        "hardness": 3,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 15,
        "wooden": 2.25,
        "stone": 1.15,
        "iron": 0.75,
        "diamond": 0.6,
        "netherite": 0.5,
        "golden": 0.4,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "diamond_ore",
        "hardness": 3,
        "best_tool": "pickaxe",
        "lowest": "iron",
        "hand": 15,
        "wooden": 7.5,
        "stone": 3.75,
        "iron": 0.75,
        "diamond": 0.6,
        "netherite": 0.5,
        "golden": 1.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "emerald_ore",
        "hardness": 3,
        "best_tool": "pickaxe",
        "lowest": "iron",
        "hand": 15,
        "wooden": 7.5,
        "stone": 3.75,
        "iron": 0.75,
        "diamond": 0.6,
        "netherite": 0.5,
        "golden": 1.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "end_stone",
        "hardness": 3,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 15,
        "wooden": 2.25,
        "stone": 1.15,
        "iron": 0.75,
        "diamond": 0.6,
        "netherite": 0.5,
        "golden": 0.4,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "gold_ore",
        "hardness": 3,
        "best_tool": "pickaxe",
        "lowest": "iron",
        "hand": 15,
        "wooden": 7.5,
        "stone": 3.75,
        "iron": 0.75,
        "diamond": 0.6,
        "netherite": 0.5,
        "golden": 1.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "hopper",
        "hardness": 3,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 15,
        "wooden": 2.25,
        "stone": 1.15,
        "iron": 0.75,
        "diamond": 0.6,
        "netherite": 0.5,
        "golden": 0.4,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "iron_ore",
        "hardness": 3,
        "best_tool": "pickaxe",
        "lowest": "stone",
        "hand": 15,
        "wooden": 7.5,
        "stone": 1.15,
        "iron": 0.75,
        "diamond": 0.6,
        "netherite": 0.5,
        "golden": 1.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "lapis_lazuli_ore",
        "hardness": 3,
        "best_tool": "pickaxe",
        "lowest": "stone",
        "hand": 15,
        "wooden": 7.5,
        "stone": 1.15,
        "iron": 0.75,
        "diamond": 0.6,
        "netherite": 0.5,
        "golden": 1.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "lightning_rod",
        "hardness": 3,
        "best_tool": "pickaxe",
        "lowest": "stone",
        "hand": 15,
        "wooden": 7.5,
        "stone": 1.15,
        "iron": 0.75,
        "diamond": 0.6,
        "netherite": 0.5,
        "golden": 1.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "nether_quartz_ore",
        "hardness": 3,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 15,
        "wooden": 2.25,
        "stone": 1.15,
        "iron": 0.75,
        "diamond": 0.6,
        "netherite": 0.5,
        "golden": 0.4,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "observer",
        "hardness": 3,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 15,
        "wooden": 2.25,
        "stone": 1.15,
        "iron": 0.75,
        "diamond": 0.6,
        "netherite": 0.5,
        "golden": 0.4,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "sculk_catalyst",
        "hardness": 3,
        "best_tool": "hoe",
        "lowest": "hand",
        "hand": 4.5,
        "wooden": 2.25,
        "stone": 1.15,
        "iron": 0.75,
        "diamond": 0.6,
        "netherite": 0.5,
        "golden": 0.4,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "sculk_shrieker",
        "hardness": 3,
        "best_tool": "hoe",
        "lowest": "hand",
        "hand": 4.5,
        "wooden": 2.25,
        "stone": 1.15,
        "iron": 0.75,
        "diamond": 0.6,
        "netherite": 0.5,
        "golden": 0.4,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "redstone_ore",
        "hardness": 3,
        "best_tool": "pickaxe",
        "lowest": "iron",
        "hand": 15,
        "wooden": 7.5,
        "stone": 3.75,
        "iron": 0.75,
        "diamond": 0.6,
        "netherite": 0.5,
        "golden": 1.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "wooden_trapdoor",
        "hardness": 3,
        "best_tool": "hoe",
        "lowest": "hand",
        "hand": 4.5,
        "wooden": 2.25,
        "stone": 1.15,
        "iron": 0.75,
        "diamond": 0.6,
        "netherite": 0.5,
        "golden": 0.4,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "wooden_door",
        "hardness": 3,
        "best_tool": "hoe",
        "lowest": "hand",
        "hand": 4.5,
        "wooden": 2.25,
        "stone": 1.15,
        "iron": 0.75,
        "diamond": 0.6,
        "netherite": 0.5,
        "golden": 0.4,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "nether_gold_ore",
        "hardness": 3,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 15,
        "wooden": 2.25,
        "stone": 1.15,
        "iron": 0.75,
        "diamond": 0.6,
        "netherite": 0.5,
        "golden": 0.4,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "conduit",
        "hardness": 3,
        "best_tool": "pickaxe",
        "lowest": "hand",
        "hand": 4.5,
        "wooden": 2.25,
        "stone": 1.15,
        "iron": 0.75,
        "diamond": 0.6,
        "netherite": 0.5,
        "golden": 0.4,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "nether_reactor_core",
        "hardness": 3,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 15,
        "wooden": 2.25,
        "stone": 1.15,
        "iron": 0.75,
        "diamond": 0.6,
        "netherite": 0.5,
        "golden": 0.4,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "usb_charger",
        "hardness": 3,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 15,
        "wooden": 2.25,
        "stone": 1.15,
        "iron": 0.75,
        "diamond": 0.6,
        "netherite": 0.5,
        "golden": 0.4,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "blue_ice",
        "hardness": 2.8,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 14,
        "wooden": 2.1,
        "stone": 1.05,
        "iron": 0.7,
        "diamond": 0.55,
        "netherite": 0.5,
        "golden": 0.35,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "chest",
        "hardness": 2.5,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 3.75,
        "wooden": 1.9,
        "stone": 0.95,
        "iron": 0.65,
        "diamond": 0.5,
        "netherite": 0.45,
        "golden": 0.35,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "compound_creator",
        "hardness": 2.5,
        "best_tool": "pickaxe",
        "lowest": "hand",
        "hand": 12.5,
        "wooden": 1.9,
        "stone": 0.95,
        "iron": 0.65,
        "diamond": 0.5,
        "netherite": 0.45,
        "golden": 0.35,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "crafting_table",
        "hardness": 2.5,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 3.75,
        "wooden": 1.9,
        "stone": 0.95,
        "iron": 0.65,
        "diamond": 0.5,
        "netherite": 0.45,
        "golden": 0.35,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "cartography_table",
        "hardness": 2.5,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 3.75,
        "wooden": 1.9,
        "stone": 0.95,
        "iron": 0.65,
        "diamond": 0.5,
        "netherite": 0.45,
        "golden": 0.35,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "lectern",
        "hardness": 2.5,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 3.75,
        "wooden": 1.9,
        "stone": 0.95,
        "iron": 0.65,
        "diamond": 0.5,
        "netherite": 0.45,
        "golden": 0.35,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "fletching_table",
        "hardness": 2.5,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 3.75,
        "wooden": 1.9,
        "stone": 0.95,
        "iron": 0.65,
        "diamond": 0.5,
        "netherite": 0.45,
        "golden": 0.35,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "smithing_table",
        "hardness": 2.5,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 3.75,
        "wooden": 1.9,
        "stone": 0.95,
        "iron": 0.65,
        "diamond": 0.5,
        "netherite": 0.45,
        "golden": 0.35,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "loom",
        "hardness": 2.5,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 3.75,
        "wooden": 1.9,
        "stone": 0.95,
        "iron": 0.65,
        "diamond": 0.5,
        "netherite": 0.45,
        "golden": 0.35,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "barrel",
        "hardness": 2.5,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 3.75,
        "wooden": 1.9,
        "stone": 0.95,
        "iron": 0.65,
        "diamond": 0.5,
        "netherite": 0.45,
        "golden": 0.35,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "element_constructor",
        "hardness": 2.5,
        "best_tool": "pickaxe",
        "lowest": "hand",
        "hand": 12.5,
        "wooden": 1.9,
        "stone": 0.95,
        "iron": 0.65,
        "diamond": 0.5,
        "netherite": 0.45,
        "golden": 0.35,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "heat_block",
        "hardness": 2.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 12.5,
        "wooden": 1.9,
        "stone": 0.95,
        "iron": 0.65,
        "diamond": 0.5,
        "netherite": 0.45,
        "golden": 0.35,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "lab_table",
        "hardness": 2.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 12.5,
        "wooden": 1.9,
        "stone": 0.95,
        "iron": 0.65,
        "diamond": 0.5,
        "netherite": 0.45,
        "golden": 0.35,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "material_reducer",
        "hardness": 2.5,
        "best_tool": "pickaxe",
        "lowest": "hand",
        "hand": 12.5,
        "wooden": 1.9,
        "stone": 0.95,
        "iron": 0.65,
        "diamond": 0.5,
        "netherite": 0.45,
        "golden": 0.35,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "trapped_chest",
        "hardness": 2.5,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 3.75,
        "wooden": 1.9,
        "stone": 0.95,
        "iron": 0.65,
        "diamond": 0.5,
        "netherite": 0.45,
        "golden": 0.35,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "bamboo_mosaic",
        "hardness": 2,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 3,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "bamboo_block",
        "hardness": 2,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 3,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "bone_block",
        "hardness": 2,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 10,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "brick_stairs",
        "hardness": 2,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 10,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "bricks",
        "hardness": 2,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 10,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "cauldron",
        "hardness": 2,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 10,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "cobblestone",
        "hardness": 2,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 10,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "cobblestone_slab",
        "hardness": 2,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 10,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "cobblestone_stairs",
        "hardness": 2,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 10,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "cobblestone_wall",
        "hardness": 2,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 10,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "polished_blackstone",
        "hardness": 2,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 10,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "grindstone",
        "hardness": 2,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 10,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "shulker_box",
        "hardness": 2,
        "best_tool": "pickaxe",
        "lowest": "hand",
        "hand": 3,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "dyed_shulker_box",
        "hardness": 2,
        "best_tool": "pickaxe",
        "lowest": "hand",
        "hand": 3,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "smooth_stone",
        "hardness": 2,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 10,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "fences",
        "hardness": 2,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 3,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "fence_gates",
        "hardness": 2,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 3,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "jukebox",
        "hardness": 2,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 3,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "campfire",
        "hardness": 2,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 3,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "mossy_cobblestone",
        "hardness": 2,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 10,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "nether_bricks",
        "hardness": 2,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 10,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "red_nether_bricks",
        "hardness": 2,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 10,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "nether_brick_fence",
        "hardness": 2,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 10,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "nether_brick_stairs",
        "hardness": 2,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 10,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "stone_slabs",
        "hardness": 2,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 10,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "logs",
        "hardness": 2,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 3,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "stem",
        "hardness": 2,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 3,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "planks",
        "hardness": 2,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 3,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "purpur_slab",
        "hardness": 2,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 10,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "wooden_slab",
        "hardness": 2,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 3,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "wooden_stairs",
        "hardness": 2,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 3,
        "wooden": 1.5,
        "stone": 0.75,
        "iron": 0.5,
        "diamond": 0.4,
        "netherite": 0.35,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "concrete",
        "hardness": 1.8,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 9,
        "wooden": 1.35,
        "stone": 0.7,
        "iron": 0.45,
        "diamond": 0.35,
        "netherite": 0.3,
        "golden": 0.25,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "andesite",
        "hardness": 1.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 7.5,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "blackstone",
        "hardness": 1.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 7.5,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "amethyst_block",
        "hardness": 1.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 7.5,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "amethyst_cluster",
        "hardness": 1.5,
        "best_tool": "pickaxe",
        "lowest": "hand",
        "hand": 2.25,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "amethyst_bud",
        "hardness": 1.5,
        "best_tool": "pickaxe",
        "lowest": "hand",
        "hand": 2.25,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "budding_amethyst",
        "hardness": 1.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 7.5,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "dripstone_block",
        "hardness": 1.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 7.5,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "pointed_dripstone",
        "hardness": 1.5,
        "best_tool": "pickaxe",
        "lowest": "hand",
        "hand": 2.25,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "polished_blackstone_bricks",
        "hardness": 1.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 7.5,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "gilded_blackstone",
        "hardness": 1.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 7.5,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "infested_deepslate",
        "hardness": 1.5,
        "best_tool": "pickaxe",
        "lowest": "hand",
        "hand": 2.25,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "coral_block",
        "hardness": 1.5,
        "best_tool": "pickaxe",
        "lowest": "hand",
        "hand": 2.25,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "bookshelf",
        "hardness": 1.5,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 2.25,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "chiseled_bookshelf",
        "hardness": 1.5,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 2.25,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "dark_prismarine",
        "hardness": 1.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 7.5,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "diorite",
        "hardness": 1.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 7.5,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "granite",
        "hardness": 1.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 7.5,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "mud_bricks",
        "hardness": 1.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 7.5,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "piston",
        "hardness": 1.5,
        "best_tool": "pickaxe",
        "lowest": "hand",
        "hand": 2.25,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "sticky_piston",
        "hardness": 1.5,
        "best_tool": "pickaxe",
        "lowest": "hand",
        "hand": 2.25,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "piston_head",
        "hardness": 1.5,
        "tool": -1,
        "lowest": "hand",
        "hand": 2.25,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "prismarine",
        "hardness": 1.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 7.5,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "prismarine_bricks",
        "hardness": 1.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 7.5,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "sculk_sensor",
        "hardness": 1.5,
        "best_tool": "hoe",
        "lowest": "hand",
        "hand": 2.25,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "calibrated_sculk_sensor",
        "hardness": 1.5,
        "best_tool": "hoe",
        "lowest": "hand",
        "hand": 2.25,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "stone",
        "hardness": 1.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 7.5,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "stone_bricks",
        "hardness": 1.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 7.5,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "purpur_block",
        "hardness": 1.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 7.5,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "purpur_pillar",
        "hardness": 1.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 7.5,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "purpur_stairs",
        "hardness": 1.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 7.5,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "stone_brick_stairs",
        "hardness": 1.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 7.5,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "tuff",
        "hardness": 1.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 7.5,
        "wooden": 1.15,
        "stone": 0.6,
        "iron": 0.4,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "glazed_terracotta",
        "hardness": 1.4,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 7,
        "wooden": 1.05,
        "stone": 0.55,
        "iron": 0.35,
        "diamond": 0.3,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "stained_terracotta",
        "hardness": 1.25,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 6.25,
        "wooden": 0.95,
        "stone": 0.5,
        "iron": 0.35,
        "diamond": 0.25,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "terracotta",
        "hardness": 1.25,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 6.25,
        "wooden": 0.95,
        "stone": 0.5,
        "iron": 0.35,
        "diamond": 0.25,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "basalt",
        "hardness": 1.25,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 6.25,
        "wooden": 0.95,
        "stone": 0.5,
        "iron": 0.35,
        "diamond": 0.25,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "smooth_basalt",
        "hardness": 1.25,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 6.25,
        "wooden": 0.95,
        "stone": 0.5,
        "iron": 0.35,
        "diamond": 0.25,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "bamboo",
        "hardness": 1,
        "best_tool": "sword",
        "lowest": "hand",
        "hand": 1.5,
        "wooden": 0.75,
        "stone": 0.4,
        "iron": 0.25,
        "diamond": 0.2,
        "netherite": 0.2,
        "golden": 0.15,
        "shears": -1,
        "sword": 0.05
    },
    {
        "block": "banner",
        "hardness": 1,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 1.5,
        "wooden": 0.75,
        "stone": 0.4,
        "iron": 0.25,
        "diamond": 0.2,
        "netherite": 0.2,
        "golden": 0.15,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "ominous_banner",
        "hardness": 1,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 1.5,
        "wooden": 0.75,
        "stone": 0.4,
        "iron": 0.25,
        "diamond": 0.2,
        "netherite": 0.2,
        "golden": 0.15,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "infested_cobblestone",
        "hardness": 1,
        "best_tool": "pickaxe",
        "lowest": "hand",
        "hand": 1.5,
        "wooden": 0.75,
        "stone": 0.4,
        "iron": 0.25,
        "diamond": 0.2,
        "netherite": 0.2,
        "golden": 0.15,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "jack_olantern",
        "hardness": 1,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 1.5,
        "wooden": 0.75,
        "stone": 0.4,
        "iron": 0.25,
        "diamond": 0.2,
        "netherite": 0.2,
        "golden": 0.15,
        "shears": -1,
        "sword": 1
    },
    {
        "block": "melon",
        "hardness": 1,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 1.5,
        "wooden": 0.75,
        "stone": 0.4,
        "iron": 0.25,
        "diamond": 0.2,
        "netherite": 0.2,
        "golden": 0.15,
        "shears": -1,
        "sword": 1
    },
    {
        "block": "mob_head",
        "hardness": 1,
        "tool": -1,
        "lowest": "hand",
        "hand": 1.5,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "packed_mud",
        "hardness": 1,
        "best_tool": "pickaxe",
        "lowest": "hand",
        "hand": 1.5,
        "wooden": 0.75,
        "stone": 0.4,
        "iron": 0.25,
        "diamond": 0.2,
        "netherite": 0.2,
        "golden": 0.15,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "nether_wart_block",
        "hardness": 1,
        "best_tool": "hoe",
        "lowest": "hand",
        "hand": 1.5,
        "wooden": 0.75,
        "stone": 0.4,
        "iron": 0.25,
        "diamond": 0.2,
        "netherite": 0.2,
        "golden": 0.15,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "polished_basalt",
        "hardness": 1.25,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 6.25,
        "wooden": 0.95,
        "stone": 0.5,
        "iron": 0.35,
        "diamond": 0.25,
        "netherite": 0.25,
        "golden": 0.2,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "pumpkin",
        "hardness": 1,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 1.5,
        "wooden": 0.75,
        "stone": 0.4,
        "iron": 0.25,
        "diamond": 0.2,
        "netherite": 0.2,
        "golden": 0.15,
        "shears": -1,
        "sword": 1
    },
    {
        "block": "sign",
        "hardness": 1,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 1.5,
        "wooden": 0.75,
        "stone": 0.4,
        "iron": 0.25,
        "diamond": 0.2,
        "netherite": 0.2,
        "golden": 0.15,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "hanging_sign",
        "hardness": 1,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 1.5,
        "wooden": 0.75,
        "stone": 0.4,
        "iron": 0.25,
        "diamond": 0.2,
        "netherite": 0.2,
        "golden": 0.15,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "shroomlight",
        "hardness": 1,
        "best_tool": "hoe",
        "lowest": "hand",
        "hand": 1.5,
        "wooden": 0.75,
        "stone": 0.4,
        "iron": 0.25,
        "diamond": 0.2,
        "netherite": 0.2,
        "golden": 0.15,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "quartz_block",
        "hardness": 0.8,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 4,
        "wooden": 0.6,
        "stone": 0.3,
        "iron": 0.2,
        "diamond": 0.15,
        "netherite": 0.15,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "note_block",
        "hardness": 0.8,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 1.2,
        "wooden": 0.6,
        "stone": 0.3,
        "iron": 0.2,
        "diamond": 0.15,
        "netherite": 0.15,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "quartz_stairs",
        "hardness": 0.8,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 4,
        "wooden": 0.6,
        "stone": 0.3,
        "iron": 0.2,
        "diamond": 0.15,
        "netherite": 0.15,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "red_sandstone",
        "hardness": 0.8,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 4,
        "wooden": 0.6,
        "stone": 0.3,
        "iron": 0.2,
        "diamond": 0.15,
        "netherite": 0.15,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "red_sandstone_stairs",
        "hardness": 0.8,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 4,
        "wooden": 0.6,
        "stone": 0.3,
        "iron": 0.2,
        "diamond": 0.15,
        "netherite": 0.15,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "sandstone",
        "hardness": 0.8,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 4,
        "wooden": 0.6,
        "stone": 0.3,
        "iron": 0.2,
        "diamond": 0.15,
        "netherite": 0.15,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "sandstone_stairs",
        "hardness": 0.8,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 4,
        "wooden": 0.6,
        "stone": 0.3,
        "iron": 0.2,
        "diamond": 0.15,
        "netherite": 0.15,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "wool",
        "hardness": 0.8,
        "tool": -1,
        "best_tool": "shears",
        "lowest": "hand",
        "hand": 1.2,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": 0.25,
        "sword": -1
    },
    {
        "block": "calcite",
        "hardness": 0.75,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 3.75,
        "wooden": 0.6,
        "stone": 0.3,
        "iron": 0.2,
        "diamond": 0.15,
        "netherite": 0.15,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "infested_stone",
        "hardness": 0.75,
        "best_tool": "pickaxe",
        "lowest": "hand",
        "hand": 1.15,
        "wooden": 0.6,
        "stone": 0.3,
        "iron": 0.2,
        "diamond": 0.15,
        "netherite": 0.15,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "infested_stone_bricks",
        "hardness": 0.75,
        "best_tool": "pickaxe",
        "lowest": "hand",
        "hand": 1.15,
        "wooden": 0.6,
        "stone": 0.3,
        "iron": 0.2,
        "diamond": 0.15,
        "netherite": 0.15,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "mangrove_roots",
        "hardness": 0.7,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 1.05,
        "wooden": 0.55,
        "stone": 0.3,
        "iron": 0.2,
        "diamond": 0.15,
        "netherite": 0.15,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "muddy_mangrove_roots",
        "hardness": 0.7,
        "best_tool": "shovel",
        "lowest": "hand",
        "hand": 1.05,
        "wooden": 0.55,
        "stone": 0.3,
        "iron": 0.2,
        "diamond": 0.15,
        "netherite": 0.15,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "rail",
        "hardness": 0.7,
        "best_tool": "pickaxe",
        "lowest": "hand",
        "hand": 1.05,
        "wooden": 0.55,
        "stone": 0.3,
        "iron": 0.2,
        "diamond": 0.15,
        "netherite": 0.15,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "activator_rail",
        "hardness": 0.7,
        "best_tool": "pickaxe",
        "lowest": "hand",
        "hand": 1.05,
        "wooden": 0.55,
        "stone": 0.3,
        "iron": 0.2,
        "diamond": 0.15,
        "netherite": 0.15,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "detector_rail",
        "hardness": 0.7,
        "best_tool": "pickaxe",
        "lowest": "hand",
        "hand": 1.05,
        "wooden": 0.55,
        "stone": 0.3,
        "iron": 0.2,
        "diamond": 0.15,
        "netherite": 0.15,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "powered_rail",
        "hardness": 0.7,
        "best_tool": "pickaxe",
        "lowest": "hand",
        "hand": 1.05,
        "wooden": 0.55,
        "stone": 0.3,
        "iron": 0.2,
        "diamond": 0.15,
        "netherite": 0.15,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "dirt_path",
        "hardness": 0.65,
        "best_tool": "shovel",
        "lowest": "hand",
        "hand": 1,
        "wooden": 0.5,
        "stone": 0.25,
        "iron": 0.2,
        "diamond": 0.15,
        "netherite": 0.15,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "beehive",
        "hardness": 0.6,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 0.9,
        "wooden": 0.45,
        "stone": 0.25,
        "iron": 0.15,
        "diamond": 0.15,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "clay",
        "hardness": 0.6,
        "best_tool": "shovel",
        "lowest": "hand",
        "hand": 0.9,
        "wooden": 0.45,
        "stone": 0.25,
        "iron": 0.15,
        "diamond": 0.15,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "composter",
        "hardness": 0.6,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 0.9,
        "wooden": 0.45,
        "stone": 0.25,
        "iron": 0.15,
        "diamond": 0.15,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "farmland",
        "hardness": 0.6,
        "best_tool": "shovel",
        "lowest": "hand",
        "hand": 0.9,
        "wooden": 0.45,
        "stone": 0.25,
        "iron": 0.15,
        "diamond": 0.15,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "grass_block",
        "hardness": 0.6,
        "best_tool": "shovel",
        "lowest": "hand",
        "hand": 0.9,
        "wooden": 0.45,
        "stone": 0.25,
        "iron": 0.15,
        "diamond": 0.15,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "gravel",
        "hardness": 0.6,
        "best_tool": "shovel",
        "lowest": "hand",
        "hand": 0.9,
        "wooden": 0.45,
        "stone": 0.25,
        "iron": 0.15,
        "diamond": 0.15,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "honeycomb_block",
        "hardness": 0.6,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.9,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "mycelium",
        "hardness": 0.6,
        "best_tool": "shovel",
        "lowest": "hand",
        "hand": 0.9,
        "wooden": 0.45,
        "stone": 0.25,
        "iron": 0.15,
        "diamond": 0.15,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "sponge",
        "hardness": 0.6,
        "best_tool": "hoe",
        "lowest": "hand",
        "hand": 0.9,
        "wooden": 0.45,
        "stone": 0.25,
        "iron": 0.15,
        "diamond": 0.15,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "wet_sponge",
        "hardness": 0.6,
        "best_tool": "hoe",
        "lowest": "hand",
        "hand": 0.9,
        "wooden": 0.45,
        "stone": 0.25,
        "iron": 0.15,
        "diamond": 0.15,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "brewing_stand",
        "hardness": 0.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 2.5,
        "wooden": 0.4,
        "stone": 0.2,
        "iron": 0.15,
        "diamond": 0.1,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "stone_button",
        "hardness": 0.5,
        "best_tool": "pickaxe",
        "lowest": "hand",
        "hand": 0.75,
        "wooden": 0.4,
        "stone": 0.2,
        "iron": 0.15,
        "diamond": 0.1,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "cake",
        "hardness": 0.5,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.75,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "coarse_dirt",
        "hardness": 0.5,
        "best_tool": "shovel",
        "lowest": "hand",
        "hand": 0.75,
        "wooden": 0.4,
        "stone": 0.2,
        "iron": 0.15,
        "diamond": 0.1,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "concrete_powder",
        "hardness": 0.5,
        "best_tool": "shovel",
        "lowest": "hand",
        "hand": 0.75,
        "wooden": 0.4,
        "stone": 0.2,
        "iron": 0.15,
        "diamond": 0.1,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "dirt",
        "hardness": 0.5,
        "best_tool": "shovel",
        "lowest": "hand",
        "hand": 0.75,
        "wooden": 0.4,
        "stone": 0.2,
        "iron": 0.15,
        "diamond": 0.1,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "dried_kelp_block",
        "hardness": 0.5,
        "best_tool": "hoe",
        "lowest": "hand",
        "hand": 0.75,
        "wooden": 0.4,
        "stone": 0.2,
        "iron": 0.15,
        "diamond": 0.1,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "hay_bale",
        "hardness": 0.5,
        "best_tool": "hoe",
        "lowest": "hand",
        "hand": 0.75,
        "wooden": 0.4,
        "stone": 0.2,
        "iron": 0.15,
        "diamond": 0.1,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "ice",
        "hardness": 0.5,
        "best_tool": "pickaxe",
        "lowest": "hand",
        "hand": 0.75,
        "wooden": 0.4,
        "stone": 0.2,
        "iron": 0.15,
        "diamond": 0.1,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "packed_ice",
        "hardness": 0.5,
        "best_tool": "pickaxe",
        "lowest": "hand",
        "hand": 0.75,
        "wooden": 0.4,
        "stone": 0.2,
        "iron": 0.15,
        "diamond": 0.1,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "frosted_ice",
        "hardness": 0.5,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.75,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "lever",
        "hardness": 0.5,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.75,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "magma_block",
        "hardness": 0.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 2.5,
        "wooden": 0.4,
        "stone": 0.2,
        "iron": 0.15,
        "diamond": 0.1,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "mud",
        "hardness": 0.5,
        "best_tool": "shovel",
        "lowest": "hand",
        "hand": 0.75,
        "wooden": 0.4,
        "stone": 0.2,
        "iron": 0.15,
        "diamond": 0.1,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "target",
        "hardness": 0.5,
        "best_tool": "hoe",
        "lowest": "hand",
        "hand": 0.75,
        "wooden": 0.4,
        "stone": 0.2,
        "iron": 0.15,
        "diamond": 0.1,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "turtle_egg",
        "hardness": 0.5,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.75,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "sniffer_egg",
        "hardness": 0.5,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.75,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "podzol",
        "hardness": 0.5,
        "best_tool": "shovel",
        "lowest": "hand",
        "hand": 0.75,
        "wooden": 0.4,
        "stone": 0.2,
        "iron": 0.15,
        "diamond": 0.1,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "rooted_dirt",
        "hardness": 0.5,
        "best_tool": "shovel",
        "lowest": "hand",
        "hand": 0.75,
        "wooden": 0.4,
        "stone": 0.2,
        "iron": 0.15,
        "diamond": 0.1,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "sand",
        "hardness": 0.5,
        "best_tool": "shovel",
        "lowest": "hand",
        "hand": 0.75,
        "wooden": 0.4,
        "stone": 0.2,
        "iron": 0.15,
        "diamond": 0.1,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "soul_sand",
        "hardness": 0.5,
        "best_tool": "shovel",
        "lowest": "hand",
        "hand": 0.75,
        "wooden": 0.4,
        "stone": 0.2,
        "iron": 0.15,
        "diamond": 0.1,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "soul_soil",
        "hardness": 0.5,
        "best_tool": "shovel",
        "lowest": "hand",
        "hand": 0.75,
        "wooden": 0.4,
        "stone": 0.2,
        "iron": 0.15,
        "diamond": 0.1,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "stone_pressure_plate",
        "hardness": 0.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 2.5,
        "wooden": 0.4,
        "stone": 0.2,
        "iron": 0.15,
        "diamond": 0.1,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "heavy_weighted_pressure_plate",
        "hardness": 0.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 2.5,
        "wooden": 0.4,
        "stone": 0.2,
        "iron": 0.15,
        "diamond": 0.1,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "light_weighted_pressure_plate",
        "hardness": 0.5,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 2.5,
        "wooden": 0.4,
        "stone": 0.2,
        "iron": 0.15,
        "diamond": 0.1,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "wooden_pressure_plate",
        "hardness": 0.5,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 0.75,
        "wooden": 0.4,
        "stone": 0.2,
        "iron": 0.15,
        "diamond": 0.1,
        "netherite": 0.1,
        "golden": 0.1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "cactus",
        "hardness": 0.4,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.6,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "ladder",
        "hardness": 0.4,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 0.6,
        "wooden": 0.3,
        "stone": 0.15,
        "iron": 0.1,
        "diamond": 0.1,
        "netherite": 0.1,
        "golden": 0.05,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "chorus_flower",
        "hardness": 0.4,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 0.6,
        "wooden": 0.3,
        "stone": 0.15,
        "iron": 0.1,
        "diamond": 0.1,
        "netherite": 0.1,
        "golden": 0.05,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "chorus_plant",
        "hardness": 0.4,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 0.6,
        "wooden": 0.3,
        "stone": 0.15,
        "iron": 0.1,
        "diamond": 0.1,
        "netherite": 0.1,
        "golden": 0.05,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "netherrack",
        "hardness": 0.4,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 2,
        "wooden": 0.3,
        "stone": 0.15,
        "iron": 0.1,
        "diamond": 0.1,
        "netherite": 0.1,
        "golden": 0.05,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "nylium",
        "hardness": 0.4,
        "best_tool": "pickaxe",
        "lowest": "wood",
        "hand": 2,
        "wooden": 0.3,
        "stone": 0.15,
        "iron": 0.1,
        "diamond": 0.1,
        "netherite": 0.1,
        "golden": 0.05,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "bee_nest",
        "hardness": 0.3,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 0.45,
        "wooden": 0.25,
        "stone": 0.15,
        "iron": 0.1,
        "diamond": 0.1,
        "netherite": 0.05,
        "golden": 0.05,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "froglight",
        "hardness": 0.3,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.45,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "glass",
        "hardness": 0.3,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.45,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "glass_pane",
        "hardness": 0.3,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.45,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "glowstone",
        "hardness": 0.3,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.45,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "redstone_lamp",
        "hardness": 0.3,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.45,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "sea_lantern",
        "hardness": 0.3,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.45,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "stained_glass",
        "hardness": 0.3,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.45,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "stained_glass_panes",
        "hardness": 0.3,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.45,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "powder_snow",
        "hardness": 0.25,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.4,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "suspicious_gravel",
        "hardness": 0.25,
        "best_tool": "shovel",
        "lowest": "hand",
        "hand": 0.4,
        "wooden": 0.2,
        "stone": 0.1,
        "iron": 0.1,
        "diamond": 0.05,
        "netherite": 0.05,
        "golden": 0.05,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "suspicious_sand",
        "hardness": 0.25,
        "best_tool": "shovel",
        "lowest": "hand",
        "hand": 0.4,
        "wooden": 0.2,
        "stone": 0.1,
        "iron": 0.1,
        "diamond": 0.05,
        "netherite": 0.05,
        "golden": 0.05,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "bed",
        "hardness": 0.2,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.3,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "cocoa",
        "hardness": 0.2,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 0.3,
        "wooden": 0.15,
        "stone": 0.1,
        "iron": 0.05,
        "diamond": 0.05,
        "netherite": 0.05,
        "golden": 0.05,
        "shears": -1,
        "sword": 0.2
    },
    {
        "block": "daylight_detector",
        "hardness": 0.2,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 0.3,
        "wooden": 0.15,
        "stone": 0.1,
        "iron": 0.05,
        "diamond": 0.05,
        "netherite": 0.05,
        "golden": 0.05,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "glow_lichen",
        "hardness": 0.2,
        "best_tool": "shears",
        "lowest": "hand",
        "hand": 0.3,
        "wooden": 0.15,
        "stone": 0.1,
        "iron": 0.05,
        "diamond": 0.05,
        "netherite": 0.05,
        "golden": 0.05,
        "shears": 0.3,
        "sword": 0.2
    },
    {
        "block": "mushroom_blocks",
        "hardness": 0.2,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 0.3,
        "wooden": 0.15,
        "stone": 0.1,
        "iron": 0.05,
        "diamond": 0.05,
        "netherite": 0.05,
        "golden": 0.05,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "leaves",
        "hardness": 0.2,
        "best_tool": "shears",
        "lowest": "hand",
        "hand": 0.3,
        "wooden": 0.15,
        "stone": 0.1,
        "iron": 0.05,
        "diamond": 0.05,
        "netherite": 0.05,
        "golden": 0.05,
        "shears": 0.05,
        "sword": 0.2
    },
    {
        "block": "sculk",
        "hardness": 0.2,
        "best_tool": "hoe",
        "lowest": "hand",
        "hand": 0.3,
        "wooden": 0.15,
        "stone": 0.1,
        "iron": 0.05,
        "diamond": 0.05,
        "netherite": 0.05,
        "golden": 0.05,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "sculk_vein",
        "hardness": 0.2,
        "best_tool": "hoe",
        "lowest": "hand",
        "hand": 0.3,
        "wooden": 0.15,
        "stone": 0.1,
        "iron": 0.05,
        "diamond": 0.05,
        "netherite": 0.05,
        "golden": 0.05,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "snow_block",
        "hardness": 0.2,
        "best_tool": "shovel",
        "lowest": "wood",
        "hand": 1,
        "wooden": 0.15,
        "stone": 0.1,
        "iron": 0.05,
        "diamond": 0.05,
        "netherite": 0.05,
        "golden": 0.05,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "vines",
        "hardness": 0.2,
        "best_tool": "shears",
        "lowest": "hand",
        "hand": 0.3,
        "wooden": 0.15,
        "stone": 0.1,
        "iron": 0.05,
        "diamond": 0.05,
        "netherite": 0.05,
        "golden": 0.05,
        "shears": 0.3,
        "sword": 0.2
    },
    {
        "block": "big_dripleaf",
        "hardness": 0.1,
        "best_tool": "axe",
        "lowest": "hand",
        "hand": 0.15,
        "wooden": 0.1,
        "stone": 0.05,
        "iron": 0.05,
        "diamond": 0.05,
        "netherite": 0.05,
        "golden": 0.05,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "candle",
        "hardness": 0.1,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.15,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "dyed_candle",
        "hardness": 0.1,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.15,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "carpet",
        "hardness": 0.1,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.15,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "moss_block",
        "hardness": 0.1,
        "best_tool": "hoe",
        "lowest": "hand",
        "hand": 0.15,
        "wooden": 0.1,
        "stone": 0.05,
        "iron": 0.05,
        "diamond": 0.05,
        "netherite": 0.05,
        "golden": 0.05,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "moss_carpet",
        "hardness": 0.1,
        "best_tool": "hoe",
        "lowest": "hand",
        "hand": 0.15,
        "wooden": 0.1,
        "stone": 0.05,
        "iron": 0.05,
        "diamond": 0.05,
        "netherite": 0.05,
        "golden": 0.05,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "snow",
        "hardness": 0.1,
        "best_tool": "shovel",
        "lowest": "wood",
        "hand": 0.5,
        "wooden": 0.1,
        "stone": 0.05,
        "iron": 0.05,
        "diamond": 0.05,
        "netherite": 0.05,
        "golden": 0.05,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "air",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "azalea",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "beetroots",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "bubble_column",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "carrots",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "cave_vines",
        "hardness": 0,
        "tool": -1,
        "lowest": "shears",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": 0.05,
        "sword": -1
    },
    {
        "block": "colored_torch",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "coral",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "coral_fan",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "dead_bush",
        "hardness": 0,
        "tool": -1,
        "lowest": "shears",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": 0.05,
        "sword": -1
    },
    {
        "block": "decorated_pot",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "element",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "end_rod",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "fire",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "flower_pot",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "flowers",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "frogspawn",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "fungi",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "grass",
        "hardness": 0,
        "tool": -1,
        "lowest": "shears",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": 0.05,
        "sword": -1
    },
    {
        "block": "hanging_roots",
        "hardness": 0,
        "tool": -1,
        "lowest": "shears",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": 0.05,
        "sword": -1
    },
    {
        "block": "honey_block",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "kelp",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "lily_pad",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "melon_stem",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "mushrooms",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "nether_sprouts",
        "hardness": 0,
        "tool": -1,
        "lowest": "shears",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": 0.05,
        "sword": -1
    },
    {
        "block": "nether_wart",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "pink_petals",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "pitcher_plant",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "potatoes",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "pumpkin_stem",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "redstone_comparator",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "redstone_repeater",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "redstone_torch",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "redstone_dust",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "crimson_roots",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "warped_roots",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "saplings",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "seagrass",
        "hardness": 0,
        "tool": -1,
        "lowest": "shears",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": 0.05,
        "sword": -1
    },
    {
        "block": "scaffolding",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "sea_pickle",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "slime_block",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "small_dripleaf",
        "hardness": 0,
        "tool": -1,
        "lowest": "shears",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": 0.05,
        "sword": -1
    },
    {
        "block": "spore_blossom",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "structure_void",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "sugar_cane",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "sweet_berries",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "tnt",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "torch",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "tripwire",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "tripwire_hook",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "twisting_vines",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "underwater_tnt",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "underwater_torch",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "weeping_vines",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    },
    {
        "block": "wheat",
        "hardness": 0,
        "tool": -1,
        "lowest": "hand",
        "hand": 0.05,
        "wooden": -1,
        "stone": -1,
        "iron": -1,
        "diamond": -1,
        "netherite": -1,
        "golden": -1,
        "shears": -1,
        "sword": -1
    }
];
//====================================================================================================
//Info from Data Above 1st
//====================================================================================================
class Mining_Speeds {
    /**
     * 
     * @param {boolean} includeCreativeOnly 
     */
    constructor(includeCreativeOnly = false) {
        this.debug = true;

        //Initial Data
        const tempData = miningSpeedExelData
            .filter(b => includeCreativeOnly || b.lowest != 'creative');

        //===========
        // Plurals
        //===========
        // add a copy without the plurals - remove ending s and add as entry
        tempData.filter(b =>
            b.block.endsWith('s') &&
            !b.block.endsWith('ss') &&
            !b.block.endsWith('berries') &&
            !b.block.endsWith('cactus') &&
            !b.block.endsWith('debris') &&
            !b.block.endsWith('leaves') &&
            !b.block.endsWith('roots') &&
            !b.block.endsWith('sprouts') &&
            !b.block.endsWith('stairs')
        )
            .forEach(o => {
                const toAdd = { ...o };
                toAdd.block = toAdd.block.substring(0, toAdd.block.length - 1);
                console.log(`Adding Singular: ${toAdd.block}`);
                tempData.push(toAdd);
            });


        //this.#copyEntry(tempData, 'logs', 'log');       
        const likeLogs = [
            'hyphae',
            'wooden_log',
            'wooden_wood',
            'crafter'
        ];

        let lastLog;
        likeLogs.forEach(id => {
            if (!lastLog) lastLog = 'log';
            this.#copyEntry(tempData, lastLog, id);
            lastLog = id;
        });

        // this.#copyEntry(tempData, 'wooden_slab', 'wooden_double_slab');
        //these need to be in there as stone slabs
        this.#copyEntry(tempData, 'end_stone', 'end_stone_brick');
        this.#copyEntry(tempData, 'end_stone_brick', 'end_stone_brick_slab');
        this.#copyEntry(tempData, 'stone_slabs', 'smooth_stone_slab');
        this.#copyEntry(tempData, 'bamboo_block', 'bamboo_slab');
        this.#copyEntry(tempData, 'smooth_stone_slab', 'quartz_slab');
        this.#copyEntry(tempData, 'stone_button', 'wooden_button');
        this.#copyEntry(tempData, 'quartz_slab', 'smooth_quartz_slab');
        this.#copyEntry(tempData, 'sand', 'red_sand');
        this.#copyEntry(tempData, 'granite', 'resin_bricks');
        this.#copyEntry(tempData, 'smooth_quartz_slab', 'stone_brick_slab');
        this.#copyEntry(tempData, 'resin_bricks', 'resin_brick_slab');
        this.#copyEntry(tempData, 'resin_brick_slab', 'resin_stairs');
        this.#copyEntry(tempData, 'resin_stairs', 'resin_wall');
        this.#copyEntry(tempData, 'stone_brick_slab', 'sandstone_slab');
        this.#copyEntry(tempData, 'sandstone_slab', 'red_sandstone_slab');


        this.#copyEntry(tempData, 'fire', 'soul_fire');

        this.#copyEntry(tempData, 'lapis_lazuli_block', 'lapis_block');
        this.#copyEntry(tempData, 'lapis_lazuli_ore', 'lapis_ore');
        this.#copyEntry(tempData, 'sweet_berries', 'sweet_berry_bush');
        this.#copyEntry(tempData, 'dead_bush', 'deadbush');
        this.#copyEntry(tempData, 'note_block', 'noteblock');
        this.#copyEntry(tempData, 'redstone_dust', 'redstone_wire');
        this.#copyEntry(tempData, 'sea_lantern', 'seaLantern');
        this.#copyEntry(tempData, 'lily_pad', 'waterlily');
        this.#copyEntry(tempData, 'frog_spawn', 'frogspawn');

        this.#copyEntry(tempData, 'nether_wart_block', 'warped_wart_block');
        this.#copyEntry(tempData, 'vines', 'pale_hanging_moss');
        this.#copyEntry(tempData, 'mushroom', 'fungus');
        this.#copyEntry(tempData, 'sapling', 'propagule');        

        const flowers = [
            'allium',
            'azure_bluet',
            'dandelion',
            'daisy',
            'plant',
            'fern',
            'lilac',
            'lily_of_the_valley',
            'orchid',
            'peony',
            'poppy',
            'rose',
            'tulip'
        ];
        let lastFlower
        flowers.forEach(flower => { 
            if(!lastFlower) lastFlower='flower'
            this.#copyEntry(tempData, lastFlower, flower); 
            lastFlower=flower
        });

        const heads = [
            'creeper_head',
            'piglin_head',
            'player_head',
            'zombie_head',
            'dragon_head',
            'wither_skeleton_skull'
        ];
        heads.forEach(head => { this.#copyEntry(tempData, 'mob_head', head); });

        const byHand = [
            'frame',
            'frog_spawn',
            'resin_clump',
            'resin_block'
        ];
        byHand.forEach(id => { this.#copyEntry(tempData, 'torch', id); });

        const slabs = tempData.filter(f => f.block.endsWith('_slab')).map(m => m.block);
        slabs.forEach(e => {
            const newSlab = e.replace('_slab', '_double_slab');
            this.#copyEntry(tempData, e, newSlab);
        });

        //===========
        // Wood
        //===========
        // Block list does not list indivial tree versions of blocks - they are considered wooden
        const woodenBlocks = tempData.filter(b => b.block.startsWith('wooden_'));

        //add each tree type... find a way to get from vanilla data lists
        const treeList = [
            "acacia",
            "birch",
            "cherry",
            "dark_oak",
            "jungle",
            "mangrove",
            "oak",
            "pale_oak",
            "spruce",
            "crimson",
            "warped"
        ];

        treeList.forEach(t => {
            woodenBlocks.forEach(b => {
                const toAdd = { ...b };
                toAdd.block = toAdd.block.replace('wooden', t);
                tempData.push(toAdd);
            });
        });

        //TODO:  Other Nether Stuff

        //===========
        // Colored items
        //===========
        const colorBlocks = tempData.filter(b => {
            [
                'banner', 'banners',
                'carpet',
                'candle', 'candle_cake',
                'concrete', 'concrete_powder',
                'glazed_terracotta',
                'shulker_box',
                'stained_glass', 'stained_glass_pane', 'stained_glass_panes',
                'terracotta',
                'wool'
            ].includes(b.block);
        });

        //add each tree type... find a way to get from vanilla data lists
        const colorList = [
            "white",
            "orange",
            "magenta",
            "light_blue",
            "yellow",
            "lime",
            "pink",
            "gray",
            "light_gray",
            "cyan",
            "purple",
            "blue",
            "brown",
            "green",
            "red",
            "black"
        ];

        colorList.forEach(c => {
            colorBlocks.forEach(b => {
                const toAdd = { ...b };
                toAdd.block = c + '_' + toAdd.block;
                if (this.debug) console.log(`Added: ${toAdd.block}`);
                tempData.push(toAdd);
            });
        });

        //===========
        // Final List
        //===========

        //const miningSpeedStageData = tempData.sort((a, b) => a.block.length - b.block.length).reverse();

        //Add Index #, so it can always go in this order for matching
        let ctr = 0;
        tempData.forEach(o => o.index = ctr++);

        // tempData.forEach(o => {
        //     console.log(`${o.index}: ${o.block}`);
        // });       
        //  throw new Error('Force Stop');

        //Configure Data
        this.miningSpeedData = tempData.map(o => {
            return {
                ctr: o.index,
                block: o.block,
                hardness: o.hardness,
                lowest_tool_material: o.lowest,
                materials: {
                    least: o.lowest,
                    base: o.lowest == 'hand' ? o.hand : o.lowest == 'wood' ? o.wooden : o.lowest == 'stone' ? o.stone : o.lowest == 'iron' ? o.iron : o.lowest == 'diamond' ? o.diamond : o.lowest == 'netherite' ? o.netherite : 'creative',
                    hand: o.hand,
                    wooden: o.wooden,
                    stone: o.stone,
                    iron: o.iron,
                    diamond: o.diamond,
                    netherite: o.netherite,
                    golden: o.golden
                },
                //best_tool: o.best_tool ?? "",
                tools: {
                    best: o.best_tool ?? "",
                    material: o.lowest,
                    base: o.lowest == 'hand' ? o.hand : o.lowest == 'wood' ? o.wooden : o.lowest == 'stone' ? o.stone : o.lowest == 'iron' ? o.iron : o.lowest == 'diamond' ? o.diamond : o.lowest == 'netherite' ? o.netherite : 'creative',
                    hand: o.hand,
                    shears: o.shears == -1 ? o.hand : o.shears,
                    //TODO: test mace on stuff
                    mace: o.lowest == 'hand' ? round(o.hand / 2, 2) : round((o.stone + o.iron) / 2, 2),
                    wooden_sword: o.sword > 0 ? o.sword : o.hand,
                    stone_sword: o.sword > 0 ? o.sword : o.hand,
                    iron_sword: o.sword > 0 ? o.sword : o.hand,
                    diamond_sword: o.sword > 0 ? o.sword : o.hand,
                    netherite_sword: o.sword > 0 ? o.sword : o.hand,
                    golden_sword: o.sword > 0 ? o.sword : o.hand,
                }
            };
        });

        this.miningSpeedData.forEach(o => {
            // negative means, how long, but drop nothing   
            let material = o.materials.wooden;
            o.tools.wooden_axe = o.tools.best != 'axe' ? o.tools.hand : material;
            o.tools.wooden_pickaxe = o.tools.best != 'pickaxe' ? o.tools.hand : material;
            o.tools.wooden_shovel = o.tools.best != 'shovel' ? o.tools.hand : material;
            o.tools.wooden_hoe = o.tools.best != 'hoe' ? o.tools.hand : material;

            material = o.materials.stone;
            o.tools.stone_axe = o.tools.best != 'axe' ? o.tools.hand : material;
            o.tools.stone_pickaxe = o.tools.best != 'pickaxe' ? o.tools.hand : material;
            o.tools.stone_shovel = o.tools.best != 'shovel' ? o.tools.hand : material;
            o.tools.stone_hoe = o.tools.best != 'hoe' ? o.tools.hand : material;

            material = o.materials.golden;
            o.tools.golden_axe = o.tools.best != 'axe' ? o.tools.hand : material;
            o.tools.golden_pickaxe = o.tools.best != 'pickaxe' ? o.tools.hand : material;
            o.tools.golden_shovel = o.tools.best != 'shovel' ? o.tools.hand : material;
            o.tools.golden_hoe = o.tools.best != 'hoe' ? o.tools.hand : material;

            material = o.materials.iron;
            o.tools.iron_axe = o.tools.best != 'axe' ? o.tools.hand : material;
            o.tools.iron_pickaxe = o.tools.best != 'pickaxe' ? o.tools.hand : material;
            o.tools.iron_shovel = o.tools.best != 'shovel' ? o.tools.hand : material;
            o.tools.iron_hoe = o.tools.best != 'hoe' ? o.tools.hand : material;

            material = o.materials.diamond;
            o.tools.diamond_axe = o.tools.best != 'axe' ? o.tools.hand : material;
            o.tools.diamond_pickaxe = o.tools.best != 'pickaxe' ? o.tools.hand : material;
            o.tools.diamond_shovel = o.tools.best != 'shovel' ? o.tools.hand : material;
            o.tools.diamond_hoe = o.tools.best != 'hoe' ? o.tools.hand : material;

            material = o.materials.netherite;
            o.tools.netherite_axe = o.tools.best != 'axe' ? o.tools.hand : material;
            o.tools.netherite_pickaxe = o.tools.best != 'pickaxe' ? o.tools.hand : material;
            o.tools.netherite_shovel = o.tools.best != 'shovel' ? o.tools.hand : material;
            o.tools.netherite_hoe = o.tools.best != 'hoe' ? o.tools.hand : material;
        });

        //Special Lists
        //this.copperList=this.miningSpeedData.filter(o => o.block.includes('copper'))
    }
    // End of Constructor
    //=========================================================
    /**
     * @param {object} list 
     * @param {string} from 
     * @param {string} to 
     */
    #copyEntry (list, from, to) {
        const copy = list.filter(o => o.block === from);        
        if (!copy || copy.length == 0) {
            console.log(`from does not exist: ${from}`);
            return;
        }        

        if (list.some(o => o.block === to)) {
            console.log(`to exists: ${to}`);
            return;
        }

        const newRecord = Object.assign({},copy[0])
        console.log(`Copying: ${newRecord.block} to ${to}`);
        newRecord.block = to;
        list.push(newRecord);
    }

    listBlocks (stop = false) {
        this.miningSpeedData.forEach(o => {
            console.log(o.block);
        });
        if (stop)
            throw new Error('Force Stop');
    }
    /**
     * 
     * @param {string} data
     */
    findBestMatch (data) {
        if (!data) return null;

        const keyWords = [
            'copper',
            'bamboo_',
            'bamboo',

            'banner',
            'cake',
            'candle',
            'carpet',
            'comparator',
            'door',
            'egg',
            'fence_gate',
            'fence',
            'flower',
            'frame',
            'fungus',
            'glass',
            'hyphae',
            'ice',
            'leave',
            'light',
            'lily',
            'log',
            'mushroom',
            'plank',
            'propagule',
            'rail',
            'repeater',
            'sapling',
            'shulker',
            'sign',
            'torch',
            'web',

            'andesite',
            'amethyst',
            'cobblestone',
            'basalt',
            'blackstone',
            'campfire',
            'concrete_powder',
            'concrete',
            'coral',
            'deepslate',
            'diorite',
            'dirt',
            'granite',
            'grass',
            'gravel',
            'lantern',
            'mud_brick',
            'mud',
            'nether',
            'nylium',
            'obsidian',
            'prismarine',
            'purpur',
            'quartz',
            'redstone',
            'resin',
            'soul_',
            'sandstone',
            'sand',
            'sculk',
            'snow',
            'sponge',
            'stem',
            'terracotta',
            'tuff',
            'vine',
            'wool',

            'stone_brick',
            'brick',
            'stone',
            'button',
            'pressure_plate',

            "acacia",
            "birch",
            "cherry",
            "crimson",
            "dark_oak",
            "jungle",
            "mangrove",
            "pale_oak",
            "spruce",
            "warped",
            "oak"
        ];
        let list;
        keyWords.forEach(w => {
            if (!list && data.includes(w)) {
                list = this.miningSpeedData.filter(o => o.block.includes(w));
                //if (this.debug) console.log(`Short List: ${w}`);
            }
        });

        if (!list)
            list = this.miningSpeedData;

        return this.#findBestMatch(data, list);
    }
    /**
     * 
     * @param {string} data
     * @param {object} list  
     */
    #findBestMatch (data, list = this.miningSpeedData) {

        if (!data) return null;
        if (data.length > 50) throw new Error('err: too long');

        // remove any name space, incase a typeId
        if (data.includes(':')) {
            data = data.split(':')[ 1 ];
        }
        //if (this.debug) console.log(`Find Match for ${data}`);

        // exact:
        let aMatch = this.#findExactMatch(data);
        if (aMatch)
            return aMatch;

        // endsWith
        aMatch = this.#findEndsWithMatch(data, list);
        if (aMatch)
            return aMatch;

        // startsWith
        aMatch = this.#findStartsWithMatch(data, list);
        if (aMatch)
            return aMatch;

        // includes - middle
        aMatch = this.#findIncludesMatch(data, list);
        if (aMatch)
            return aMatch;

        // Take off front word and start over
        if (data.includes('_')) {
            const dataWords = data.split('_');

            if (dataWords.length == 2) {
                //if (this.debug) console.log(`Each of 2 Words`);

                const matchFront = this.#findBestMatch(dataWords[ 0 ], list);

                if (dataWords[ 1 ] == 'block') //exception
                    return matchFront;

                const matchEnd = this.#findBestMatch(dataWords[ 1 ], list);

                if (!matchFront)
                    return matchEnd;

                if (!matchEnd)
                    return matchFront;

                // Which is better... higher hardness is safer
                if (matchEnd.hardness >= matchFront.hardness)
                    return matchEnd;

                return matchFront;
            }
            else {
                //remove front word and start over
                data = data.substring(dataWords[ 0 ].length + 1);
                return this.#findBestMatch(data, list);
            }
        }

        return null;
    }
    /**
     * delete
     * @param {string} data 
     * @param {string} [replaceWith]
     */
    #replaceWoodName (data, replaceWith = 'wooden') {


        if (replaceWith.length > 0) {
            treeList.forEach(tree => {
                if (data.includes(tree))
                    return data.replace(tree, replaceWith);
            });
        }
        else {
            treeList.forEach(tree => {
                if (data.includes('_' + tree + '_'))
                    return data.replace('_' + tree + '_', '_');

                if (data.includes(tree + '_'))
                    return data.replace(tree + '_', '');

                if (data.includes('_' + tree))
                    return data.replace('_' + tree, '');
            });
        }

        return data;
    }
    /**
     * 
     * @param {string} data 
     */
    #findExactMatch (data, list = this.miningSpeedData) {
        if (!data) return null;
        //if (this.debug) console.log(`Find Exact Match for ${data}`);

        // exact:
        for (let index = 0; index < list.length; index++) {
            const element = list[ index ];
            let name = element.block;

            if (name == data)
                return element;

            //plural problem - if not cleared from main wiki data
            // if (name.endsWith('s') && !name.endsWith('ss')) {
            //     name = name.substring(0, name.length - 1);

            //     if (name == data)
            //         return element;
            // }
        }

        return null;
    }

    /**
     * 
     * @param {string} data 
     */
    #findEndsWithMatch (data, list = this.miningSpeedData) {
        if (!data) return null;
        // if (this.debug) console.log(`Find EndsWith Match for ${data}`);

        // exact:
        for (let index = 0; index < list.length; index++) {
            const element = list[ index ];
            let name = element.block;

            if (name.length <= data.length && data.endsWith(name))
                return element;
            else if (name.length > data.length && name.endsWith(data))
                return element;

            //plural problem - if not cleared from main wiki data
            // if (name.endsWith('s') && !name.endsWith('ss')) {
            //     name = name.substring(0, name.length - 1);

            //     if (name.length <= data.length && data.endsWith(name))
            //         return element;
            //     else if (name.length > data.length && name.endsWith(data))
            //         return element;
            // }

            return null;
        }
    }
    /**
    * 
    * @param {string} data 
    */
    #findStartsWithMatch (data, list = this.miningSpeedData) {
        if (!data) return null;
        //if (this.debug) console.log(`Find StartsWith Match for ${data}`);

        // exact:
        for (let index = 0; index < list.length; index++) {
            const element = list[ index ];
            let name = element.block;

            if (name.length <= data.length && data.startsWith(name))
                return element;
            else if (name.length > data.length && name.startsWith(data))
                return element;

            //plural problem - if not cleared from main wiki data
            // if (name.endsWith('s') && !name.endsWith('ss')) {
            //     name = name.substring(0, name.length - 1);

            //     if (name.length <= data.length && data.startsWith(name))
            //         return element;
            //     else if (name.length > data.length && name.startsWith(data))
            //         return element;
            // }
        }

        return null;
    }

    /**
    * 
    * @param {string} data 
    */
    #findIncludesMatch (data, list = this.miningSpeedData) {
        if (!data) return null;
        //if (this.debug) console.log(`Find Includes Match for ${data}`);

        // exact:
        for (let index = 0; index < list.length; index++) {
            const element = list[ index ];
            let name = element.block;

            if (name.length <= data.length && data.includes(name))
                return element;
            else if (name.length > data.length && name.includes(data))
                return element;

            //plural problem - if not cleared from main wiki data
            // if (name.endsWith('s') && !name.endsWith('ss')) {
            //     name = name.substring(0, name.length - 1);

            //     if (name.length <= data.length && data.includes(name))
            //         return element;
            //     else if (name.length > data.length && name.includes(data))
            //         return element;
            // }
        }

        return null;
    }
}
// const miningSpeeds = miningSpeedData.map(o => {
//     return {
//         ctr           :o.ctr   ,
//         block         :o.block     ,
//         hardness      :o.hardness  ,
//         lowest_tool_material   :o.lowest,
//         tool_material_drop_speeds:{
//             hand     :o.hand      ,
//             wooden   :o.wooden    ,
//             stone    :o.stone     ,
//             iron     :o.iron      ,
//             diamond  :o.diamond   ,
//             netherite:o.netherite ,
//             golden   :o.golden    
//         },
//         best_tool: o.best_tool ?? "",
//         tool_drop_speeds:{
//             shears          :o.shears==-1 ? o.hand : o.shears,
//             mace            :o.lowest=='hand' ? round(o.hand/2,2) : round((o.stone+o.iron)/2,2), 
//             wooden_sword    :o.sword==-1 ? o.hand : o.wooden    * ((o.best_tool ?? "").includes('sword') ? 1 : 2),
//             stone_sword     :o.sword==-1 ? o.hand : o.stone     * ((o.best_tool ?? "").includes('sword') ? 1 : 2),
//             iron_sword      :o.sword==-1 ? o.hand : o.iron      * ((o.best_tool ?? "").includes('sword') ? 1 : 2),
//             diamond_sword   :o.sword==-1 ? o.hand : o.diamond   * ((o.best_tool ?? "").includes('sword') ? 1 : 2),
//             netherite_sword :o.sword==-1 ? o.hand : o.netherite * ((o.best_tool ?? "").includes('sword') ? 1 : 2),
//             golden_sword    :o.sword==-1 ? o.hand : o.golden    * ((o.best_tool ?? "").includes('sword') ? 1 : 2),
//         }    
//     }
// })
//====================================================================================================
//Add Rest of Tools info
//====================================================================================================
// miningSpeeds.forEach(o => {

//     o.tool_drop_speeds.wooden_axe    = o.tool_material_drop_speeds.wooden   ==-1 ? o.tool_material_drop_speeds.hand : o.tool_material_drop_speeds.wooden    * (o.best_tool=='axe' ? 1 : 2);
//     o.tool_drop_speeds.stone_axe     = o.tool_material_drop_speeds.stone    ==-1 ? o.tool_material_drop_speeds.hand : o.tool_material_drop_speeds.stone     * (o.best_tool=='axe' ? 1 : 2);
//     o.tool_drop_speeds.iron_axe      = o.tool_material_drop_speeds.iron     ==-1 ? o.tool_material_drop_speeds.hand : o.tool_material_drop_speeds.iron      * (o.best_tool=='axe' ? 1 : 2);
//     o.tool_drop_speeds.diamond_axe   = o.tool_material_drop_speeds.diamond  ==-1 ? o.tool_material_drop_speeds.hand : o.tool_material_drop_speeds.diamond   * (o.best_tool=='axe' ? 1 : 2);
//     o.tool_drop_speeds.netherite_axe = o.tool_material_drop_speeds.netherite==-1 ? o.tool_material_drop_speeds.hand : o.tool_material_drop_speeds.netherite * (o.best_tool=='axe' ? 1 : 2);
//     o.tool_drop_speeds.golden_axe    = o.tool_material_drop_speeds.golden   ==-1 ? o.tool_material_drop_speeds.hand : o.tool_material_drop_speeds.golden    * (o.best_tool=='axe' ? 1 : 2);

//     o.tool_drop_speeds.wooden_pickaxe    = o.tool_material_drop_speeds.wooden   ==-1 ? o.tool_material_drop_speeds.hand : o.tool_material_drop_speeds.wooden    * (o.best_tool=='pickaxe' ? 1 : 2);
//     o.tool_drop_speeds.stone_pickaxe     = o.tool_material_drop_speeds.stone    ==-1 ? o.tool_material_drop_speeds.hand : o.tool_material_drop_speeds.stone     * (o.best_tool=='pickaxe' ? 1 : 2);
//     o.tool_drop_speeds.iron_pickaxe      = o.tool_material_drop_speeds.iron     ==-1 ? o.tool_material_drop_speeds.hand : o.tool_material_drop_speeds.iron      * (o.best_tool=='pickaxe' ? 1 : 2);
//     o.tool_drop_speeds.diamond_pickaxe   = o.tool_material_drop_speeds.diamond  ==-1 ? o.tool_material_drop_speeds.hand : o.tool_material_drop_speeds.diamond   * (o.best_tool=='pickaxe' ? 1 : 2);
//     o.tool_drop_speeds.netherite_pickaxe = o.tool_material_drop_speeds.netherite==-1 ? o.tool_material_drop_speeds.hand : o.tool_material_drop_speeds.netherite * (o.best_tool=='pickaxe' ? 1 : 2);
//     o.tool_drop_speeds.golden_pickaxe    = o.tool_material_drop_speeds.golden   ==-1 ? o.tool_material_drop_speeds.hand : o.tool_material_drop_speeds.golden    * (o.best_tool=='pickaxe' ? 1 : 2);

//     o.tool_drop_speeds.wooden_shovel    = o.tool_material_drop_speeds.wooden   ==-1 ? o.tool_material_drop_speeds.hand : o.tool_material_drop_speeds.wooden    * (o.best_tool=='shovel' ? 1 : 2);
//     o.tool_drop_speeds.stone_shovel     = o.tool_material_drop_speeds.stone    ==-1 ? o.tool_material_drop_speeds.hand : o.tool_material_drop_speeds.stone     * (o.best_tool=='shovel' ? 1 : 2);
//     o.tool_drop_speeds.iron_shovel      = o.tool_material_drop_speeds.iron     ==-1 ? o.tool_material_drop_speeds.hand : o.tool_material_drop_speeds.iron      * (o.best_tool=='shovel' ? 1 : 2);
//     o.tool_drop_speeds.diamond_shovel   = o.tool_material_drop_speeds.diamond  ==-1 ? o.tool_material_drop_speeds.hand : o.tool_material_drop_speeds.diamond   * (o.best_tool=='shovel' ? 1 : 2);
//     o.tool_drop_speeds.netherite_shovel = o.tool_material_drop_speeds.netherite==-1 ? o.tool_material_drop_speeds.hand : o.tool_material_drop_speeds.netherite * (o.best_tool=='shovel' ? 1 : 2);
//     o.tool_drop_speeds.golden_shovel    = o.tool_material_drop_speeds.golden   ==-1 ? o.tool_material_drop_speeds.hand : o.tool_material_drop_speeds.golden    * (o.best_tool=='shovel' ? 1 : 2);

//     o.tool_drop_speeds.wooden_hoe    = o.tool_material_drop_speeds.wooden   ==-1 ? o.tool_material_drop_speeds.hand : o.tool_material_drop_speeds.wooden    * (o.best_tool=='hoe' ? 1 : 2);
//     o.tool_drop_speeds.stone_hoe     = o.tool_material_drop_speeds.stone    ==-1 ? o.tool_material_drop_speeds.hand : o.tool_material_drop_speeds.stone     * (o.best_tool=='hoe' ? 1 : 2);
//     o.tool_drop_speeds.iron_hoe      = o.tool_material_drop_speeds.iron     ==-1 ? o.tool_material_drop_speeds.hand : o.tool_material_drop_speeds.iron      * (o.best_tool=='hoe' ? 1 : 2);
//     o.tool_drop_speeds.diamond_hoe   = o.tool_material_drop_speeds.diamond  ==-1 ? o.tool_material_drop_speeds.hand : o.tool_material_drop_speeds.diamond   * (o.best_tool=='hoe' ? 1 : 2);
//     o.tool_drop_speeds.netherite_hoe = o.tool_material_drop_speeds.netherite==-1 ? o.tool_material_drop_speeds.hand : o.tool_material_drop_speeds.netherite * (o.best_tool=='hoe' ? 1 : 2);
//     o.tool_drop_speeds.golden_hoe    = o.tool_material_drop_speeds.golden   ==-1 ? o.tool_material_drop_speeds.hand : o.tool_material_drop_speeds.golden    * (o.best_tool=='hoe' ? 1 : 2);
// })
//====================================================================================================
exports.Mining_Speeds = Mining_Speeds;
//====================================================================================================
// End of File
//====================================================================================================
