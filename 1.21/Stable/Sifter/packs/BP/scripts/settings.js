//@ts-check
import { ConsoleAlert, ChatMsg } from "./commonLib/consoleClass";
import { MinecraftItemTypes } from "./commonLib/vanillaData";
//==============================================================================
/**
 *  Owner is to edit this file as needed
 */
//==============================================================================
export const pack = {
    packName: 'Sift Blocks',
    isLoadAlertsOn: true,
    hasChatCmd: 0,
    alert: "https://github.com/DrinkWater623"
};
//==============================================================================
export const alertLog = new ConsoleAlert(`§d${pack.packName}§r`);
export const chatLog = new ChatMsg(`§b${pack.packName}§r`);
//==============================================================================
export const globals = {
    autoSiftBlockNameSpace: "sift:",
    autoSiftBlockStateName: "int:y_level",
    mainNameSpace: "dw623:",
    shortBlockNameSpace: "short:"
};
export const dynamicVars = {
};
//==============================================================================
export const dev = {
    debug: false,
    debugGamePlay: false,
    debugPackLoad: false,
    debugSubscriptions: false
};
//==============================================================================
const colors = [
    "black",
    "blue",
    "brown",
    "cyan",
    "gray",
    "green",
    "light_blue",
    "light_gray",
    "lime",
    "magenta",
    "orange",
    "pink",
    "purple",
    "red",
    "white",
    "yellow",
];
//==============================================================================
//TODO: have this pack be the death counter for players
export const watchFor = {
    autoSiftBlocks: [
        { name: "gravel", custom: "", minecraft: "", sound: "dig.gravel" },
        { name: "red_sand", custom: "", minecraft: "", sound: "dig.sand" },
        { name: "sand", custom: "", minecraft: "", sound: "dig.sand" },
        { name: "soul_sand", custom: "", minecraft: "", sound: "dig.hay" },
        { name: "snow", custom: "", minecraft: "", sound: "dig.snow" },
        { name: "black_concrete_powder", custom: "", minecraft: "", sound: "dig.sand" },
        { name: "blue_concrete_powder", custom: "", minecraft: "", sound: "dig.sand" },
        { name: "brown_concrete_powder", custom: "", minecraft: "", sound: "dig.sand" },
        { name: "cyan_concrete_powder", custom: "", minecraft: "", sound: "dig.sand" },
        { name: "gray_concrete_powder", custom: "", minecraft: "", sound: "dig.sand" },
        { name: "green_concrete_powder", custom: "", minecraft: "", sound: "dig.sand" },
        { name: "light_blue_concrete_powder", custom: "", minecraft: "", sound: "dig.sand" },
        { name: "light_gray_concrete_powder", custom: "", minecraft: "", sound: "dig.sand" },
        { name: "lime_concrete_powder", custom: "", minecraft: "", sound: "dig.sand" },
        { name: "magenta_concrete_powder", custom: "", minecraft: "", sound: "dig.sand" },
        { name: "orange_concrete_powder", custom: "", minecraft: "", sound: "dig.sand" },
        { name: "pink_concrete_powder", custom: "", minecraft: "", sound: "dig.sand" },
        { name: "purple_concrete_powder", custom: "", minecraft: "", sound: "dig.sand" },
        { name: "red_concrete_powder", custom: "", minecraft: "", sound: "dig.sand" },
        { name: "white_concrete_powder", custom: "", minecraft: "", sound: "dig.sand" },
        { name: "yellow_concrete_powder", custom: "", minecraft: "", sound: "dig.sand" }
    ],
    shortConcreteBlocks: [
        { base: "", name: "black_concrete", typeId: "", height: 16 },
        { base: "", name: "blue_concrete", typeId: "", height: 16 },
        { base: "", name: "brown_concrete", typeId: "", height: 16 },
        { base: "", name: "cyan_concrete", typeId: "", height: 16 },
        { base: "", name: "gray_concrete", typeId: "", height: 16 },
        { base: "", name: "green_concrete", typeId: "", height: 16 },
        { base: "", name: "light_blue_concrete", typeId: "", height: 16 },
        { base: "", name: "light_gray_concrete", typeId: "", height: 16 },
        { base: "", name: "lime_concrete", typeId: "", height: 16 },
        { base: "", name: "magenta_concrete", typeId: "", height: 16 },
        { base: "", name: "orange_concrete", typeId: "", height: 16 },
        { base: "", name: "pink_concrete", typeId: "", height: 16 },
        { base: "", name: "purple_concrete", typeId: "", height: 16 },
        { base: "", name: "red_concrete", typeId: "", height: 16 },
        { base: "", name: "white_concrete", typeId: "", height: 16 },
        { base: "", name: "yellow_concrete", typeId: "", height: 16 }
    ],
    fallThruBlocks: [
        "minecraft:air",
        "minecraft:lava",
        "minecraft:water",
        "minecraft:flowing_lava",
        "minecraft:flowing_water"
    ],
    //another pack for this... crumble/smash
    manualSiftBlocks: [
        //mud and clay are more maliable and can have something hidden inside
        { custom: globals.mainNameSpace + "manual_siftable_mud", minecraft: "minecraft:mud", sound: "dig.mud" },
        { custom: globals.mainNameSpace + "manual_siftable_clay", minecraft: "minecraft:clay", sound: "dig.clay" }
    ],
    sifterBlocks: [
        globals.mainNameSpace + "copper_sifter",
        globals.mainNameSpace + "iron_sifter",
        globals.mainNameSpace + "diamond_sifter"
    ],
    vanillaBlocks: [ "" ],
    allSiftableBlocks: [ "" ],
    shortGravityBlocks: [ {
        nameSpace: "x",
        base: "x",
        height: 0,
        name: "x",
        sound: "x",
        typeId: "x",
        siftBlockTypeId: "x"
    } ],
    sifterBlocks_2: [ "" ]
};
//==============================================================================
// Adjustments
//==============================================================================
// TODO: testing different method to allow for different speeds of the sifters as defined in the BP file
// shifting the sifting to the sifter from the block to see if can work
watchFor.sifterBlocks.forEach(value => watchFor.sifterBlocks_2.push(value + '_2'));
//==============================================================================
watchFor.autoSiftBlocks.forEach(b => {
    b.custom = `${globals.autoSiftBlockNameSpace}${b.name}`;
    b.minecraft = `minecraft:${b.name}`;
    watchFor.vanillaBlocks.push(b.minecraft);

    for (let i = 1; i <= 15; i++) {
        const addB = {
            nameSpace: globals.shortBlockNameSpace,
            base: b.name,
            height: i,
            name: `${b.name}_${i}`,
            sound: b.sound,
            typeId: `${globals.shortBlockNameSpace}${b.name}_${i}`,
            siftBlockTypeId: `${globals.autoSiftBlockNameSpace}${b.name}`
        };
        watchFor.shortGravityBlocks.push(addB);
    }
});
//watchFor.shortGravityBlocks.filter(z => z.base.includes('gravel')).forEach(x => {alertLog.log(x.typeId)})
//==============================================================================
export const lootTableItems = [
    //put these as zero for filters
    { minHeight: 2, typeId: "minecraft:stick", blocksAllowed: [ "sand", "gravel", "concrete" ] },
    { minHeight: 2, typeId: "minecraft:bowl", blocksAllowed: [ "all" ] },
    { minHeight: 3, typeId: "minecraft:brick", blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:flint", blocksAllowed: [ "gravel", "concrete" ] },
    //food in snow
    { minHeight: 4, typeId: "minecraft:bread", blocksAllowed: [ "snow" ] },
    { minHeight: 4, typeId: "minecraft:baked_potato", blocksAllowed: [ "snow" ] },
    { minHeight: 4, typeId: "minecraft:cookie", blocksAllowed: [ "snow" ] },
    { minHeight: 4, typeId: "minecraft:pumpkin_pie", blocksAllowed: [ "snow" ] },
    { minHeight: 4, typeId: "minecraft:cake", blocksAllowed: [ "snow" ] },
    { minHeight: 2, typeId: "minecraft:dried_kelp", blocksAllowed: [ "sand", "gravel", "concrete" ] },
    { minHeight: 4, typeId: "minecraft:bread", blocksAllowed: [ "snow" ] },
    //items
    { minHeight: 3, typeId: "minecraft:nether_brick", blocksAllowed: [ "all" ] },
    { minHeight: 3, typeId: "minecraft:sea_pickle", blocksAllowed: [ "sand" ] },
    { minHeight: 3, typeId: "minecraft:candle", blocksAllowed: [ "sand", "gravel", "concrete" ] },
    { minHeight: 3, typeId: "minecraft:amethyst_shard", blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:honey_bottle", blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:flower_pot", blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:bucket", blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:charcoal", blocksAllowed: [ "sand", "gravel" ] },
    { minHeight: 4, typeId: "minecraft:coal", blocksAllowed: [ "sand", "gravel" ] },
    { minHeight: 4, typeId: "minecraft:quartz", blocksAllowed: [ "all" ] },
    { minHeight: 2, typeId: "minecraft:prismarine_shard", blocksAllowed: [ "sand" ] },
    { minHeight: 2, typeId: "minecraft:prismarine_crystals", blocksAllowed: [ "sand" ] },
    { minHeight: 4, typeId: "minecraft:nautilus_shell", blocksAllowed: [ "sand" ] },
    { minHeight: 15, typeId: "minecraft:heart_of_the_sea", blocksAllowed: [ "sand" ] },
    { minHeight: 4, typeId: "minecraft:turtle_scute", blocksAllowed: [ "sand" ] },
    { minHeight: 4, typeId: "minecraft:armadillo_scute", blocksAllowed: [ "red_sand" ] },
    { minHeight: 2, typeId: "minecraft:string", blocksAllowed: [ "all" ] },
    { minHeight: 2, typeId: "minecraft:feather", blocksAllowed: [ "sand", "gravel", "concrete" ] },
    
    { minHeight: 4, typeId: "minecraft:leather", blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:rabbit_hide", blocksAllowed: [ "sand" ] },
    { minHeight: 2, typeId: "minecraft:rabbit_foot", blocksAllowed: [ "all" ] },
    { minHeight: 2, typeId: "minecraft:blaze_rod", blocksAllowed: [ "all" ] },
    { minHeight: 2, typeId: "minecraft:breeze_rod", blocksAllowed: [ "all" ] },
    { minHeight: 2, typeId: "minecraft:echo_shard", blocksAllowed: [ "all" ] },
    { minHeight: 2, typeId: "minecraft:dragon_breath", blocksAllowed: [ "all" ] },
    { minHeight: 12, typeId: "minecraft:shulker_shell", blocksAllowed: [ "all" ] },
    { minHeight: 6, typeId: "minecraft:ender_pearl", blocksAllowed: [ "sand", "snow" ] },
    { minHeight: 6, typeId: "minecraft:ender_eye", blocksAllowed: [ "sand", "snow" ] },
    { minHeight: 4, typeId: "minecraft:nether_star", blocksAllowed: [ "snow" ] },
    { minHeight: 2, typeId: "minecraft:end_rod", blocksAllowed: [ "all" ] },
    { minHeight: 2, typeId: "minecraft:lightning_rod", blocksAllowed: [ "all", "concrete" ] },
    { minHeight: 2, typeId: "minecraft:paper", blocksAllowed: [ "sand", "gravel" ] },
    { minHeight: 3, typeId: "minecraft:book", blocksAllowed: [ "sand", "gravel", "concrete" ] },
    { minHeight: 3, typeId: "minecraft:writable_book", blocksAllowed: [ "sand", "gravel", "concrete" ] },
    { minHeight: 2, typeId: "minecraft:lever", blocksAllowed: [ "sand", "gravel", "concrete" ] },
    { minHeight: 2, typeId: "minecraft:tripwire_hook", blocksAllowed: [ "all" ] },
    { minHeight: 12, typeId: "minecraft:daylight_detector", blocksAllowed: [ "all" ] },
    { minHeight: 2, typeId: "minecraft:repeater", blocksAllowed: [ "sand", "gravel", "concrete" ] },
    { minHeight: 2, typeId: "minecraft:comparator", blocksAllowed: [ "sand", "gravel", "concrete" ] },
    { minHeight: 2, typeId: "minecraft:name_tag", blocksAllowed: [ "all" ] },
    { minHeight: 2, typeId: "minecraft:chain", blocksAllowed: [ "all" ] },
    { minHeight: 8, typeId: "minecraft:trial_key", blocksAllowed: [ "all" ] },
    { minHeight: 8, typeId: "minecraft:ominous_trial_key", blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:disc_fragment_5", blocksAllowed: [ "all" ] },

    //nature menu
    { minHeight: 3, typeId: "minecraft:bamboo", blocksAllowed: [ "sand", "snow" ] },
    { minHeight: 4, typeId: "minecraft:sugar_cane", blocksAllowed: [ "sand", "snow" ] },
    { minHeight: 4, typeId: "minecraft:egg", blocksAllowed: [ "all" ] },
    { minHeight: 2, typeId: "minecraft:kelp", blocksAllowed: [ "sand", "snow" ] },
    { minHeight: 2, typeId: "minecraft:waterlily", blocksAllowed: [ "sand", "snow" ] },
    { minHeight: 10, typeId: "minecraft:deadbush", blocksAllowed: [ "sand" ] },
    { minHeight: 14, typeId: "minecraft:pointed_dripstone", blocksAllowed: [ "sand" ] },
    { minHeight: 2, typeId: "minecraft:bone", blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:turtle_egg", blocksAllowed: [ "all" ] },
    { minHeight: 2, typeId: "minecraft:rotten_flesh", blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:nether_wart", blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:chorus_fruit", blocksAllowed: [ "snow" ] },
    { minHeight: 4, typeId: "minecraft:potato", blocksAllowed: [ "snow" ] },
    { minHeight: 4, typeId: "minecraft:poisonous_potato", blocksAllowed: [ "snow" ] },
    { minHeight: 4, typeId: "minecraft:golden_carrot", blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:carrot", blocksAllowed: [ "snow" ] },
    { minHeight: 4, typeId: "minecraft:apple", blocksAllowed: [ "snow" ] },
    { minHeight: 4, typeId: "minecraft:golden_apple", blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:enchanted_golden_apple", blocksAllowed: [ "all" ] },
    { minHeight: 6, typeId: "minecraft:melon_slice", blocksAllowed: [ "snow" ] },
    { minHeight: 6, typeId: "minecraft:glistering_melon_slice", blocksAllowed: [ "snow" ] },
    { minHeight: 4, typeId: "minecraft:sweet_berries", blocksAllowed: [ "snow" ] },
    { minHeight: 4, typeId: "minecraft:glow_berries", blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:honeycomb", blocksAllowed: [ "all" ] },
    { minHeight: 3, typeId: "minecraft:ink_sac", blocksAllowed: [ "all" ] },
    { minHeight: 3, typeId: "minecraft:glow_ink_sac", blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:small_amethyst_bud", blocksAllowed: [ "all" ] },
    { minHeight: 8, typeId: "minecraft:medium_amethyst_bud", blocksAllowed: [ "all" ] },
    { minHeight: 12, typeId: "minecraft:large_amethyst_bud", blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:frame", blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:glow_frame", blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:painting", blocksAllowed: [ "all" ] },
    { minHeight: 12, typeId: "minecraft:player_head", blocksAllowed: [ "all" ] },
    { minHeight: 12, typeId: "minecraft:creeper_head", blocksAllowed: [ "all" ] },
    { minHeight: 12, typeId: "minecraft:zombie_head", blocksAllowed: [ "all" ] },
    { minHeight: 12, typeId: "minecraft:piglin_head", blocksAllowed: [ "all" ] },
    { minHeight: 12, typeId: "minecraft:skeleton_skull", blocksAllowed: [ "all" ] },
    { minHeight: 8, typeId: "minecraft:goat_horn", blocksAllowed: [ "all" ] },
    //items
    { minHeight: 6, typeId: "minecraft:diamond", blocksAllowed: [ "all" ] },
    { minHeight: 6, typeId: "minecraft:emerald", blocksAllowed: [ "all" ] },
    { minHeight: 6, typeId: "minecraft:copper_ingot", blocksAllowed: [ "all" ] },
    { minHeight: 6, typeId: "minecraft:gold_ingot", blocksAllowed: [ "all" ] },
    { minHeight: 6, typeId: "minecraft:iron_ingot", blocksAllowed: [ "all" ] },
    { minHeight: 6, typeId: "minecraft:netherite_ingot", blocksAllowed: [ "snow" ] },
    { minHeight: 4, typeId: "minecraft:netherite_scrap", blocksAllowed: [ "all" ] },
    { minHeight: 6, typeId: "minecraft:raw_copper", blocksAllowed: [ "all" ] },
    { minHeight: 6, typeId: "minecraft:raw_gold", blocksAllowed: [ "all" ] },
    { minHeight: 6, typeId: "minecraft:raw_iron", blocksAllowed: [ "all" ] },
    { minHeight: 2, typeId: "minecraft:gold_nugget", blocksAllowed: [ "all" ] },
    { minHeight: 2, typeId: "minecraft:iron_nugget", blocksAllowed: [ "all" ] },
    //tools
    { minHeight: 8, typeId: "minecraft:totem_of_undying", blocksAllowed: [ "all" ] },
    { minHeight: 8, typeId: "minecraft:turtle_helmet", blocksAllowed: [ "all" ] },
    { minHeight: 3, typeId: "minecraft:lead", blocksAllowed: [ "all" ] },
    { minHeight: 3, typeId: "minecraft:clock", blocksAllowed: [ "all" ] },
    { minHeight: 3, typeId: "minecraft:compass", blocksAllowed: [ "all" ] },
    { minHeight: 3, typeId: "minecraft:recovery_compass", blocksAllowed: [ "all" ] },
    { minHeight: 1, typeId: "minecraft:empty_map", blocksAllowed: [ "all" ] },
    { minHeight: 1, typeId: "minecraft:filled_map", blocksAllowed: [ "all" ] },
    { minHeight: 12, typeId: "minecraft:saddle", blocksAllowed: [ "all" ] },
    { minHeight: 14, typeId: "minecraft:wolf_armor", blocksAllowed: [ "all" ] },
    { minHeight: 8, typeId: "minecraft:trident", blocksAllowed: [ "sand" ] },

    { minHeight: 8, typeId: "minecraft:fire_charge", blocksAllowed: [ "all" ] },
    { minHeight: 10, typeId: "minecraft:firework_rocket", blocksAllowed: [ "all" ] },
    { minHeight: 8, typeId: "minecraft:firework_star", blocksAllowed: [ "all" ] },
    { minHeight: 6, typeId: "minecraft:shears", blocksAllowed: [ "all" ] },
    { minHeight: 8, typeId: "minecraft:glass_bottle", blocksAllowed: [ "all" ] },
    { minHeight: 8, typeId: "minecraft:experience_bottle", blocksAllowed: [ "all" ] },
    { minHeight: 8, typeId: "minecraft:spyglass", blocksAllowed: [ "all" ] },
    { minHeight: 8, typeId: "minecraft:brush", blocksAllowed: [ "all" ] },
    { minHeight: 14, typeId: "minecraft:mace", blocksAllowed: [ "all" ] },
    { minHeight: 8, typeId: "minecraft:bundle", blocksAllowed: [ "all" ] },

    //custom
    { minHeight: 2, typeId: globals.mainNameSpace + "emerald_nugget", blocksAllowed: [ "all" ] },
    { minHeight: 2, typeId: globals.mainNameSpace + "diamond_nugget", blocksAllowed: [ "all" ] },
    { minHeight: 2, typeId: globals.mainNameSpace + "netherite_nugget", blocksAllowed: [ "all" ] },
    { minHeight: 2, typeId: globals.mainNameSpace + "netherite_scrap_piece", blocksAllowed: [ "all" ] },
    { minHeight: 8, typeId: globals.mainNameSpace + "broken_elytra_left", blocksAllowed: [ "snow" ] },
    { minHeight: 8, typeId: globals.mainNameSpace + "broken_elytra_right", blocksAllowed: [ "snow" ] }
    // add cooked foods and raw in snow only

];
const vanillaItems = Object.values(MinecraftItemTypes); //.   how to get the values again... not the key
//have to use loot tables for these
//add enchanted books - good ones
//add enchanted tools weapons

colors.forEach(c => {
    lootTableItems.push({ minHeight: 8, typeId: "minecraft:" + c + "_bundle", blocksAllowed: [ "all" ] });
    lootTableItems.push({ minHeight: 8, typeId: "minecraft:" + c + "_candle", blocksAllowed: [ "sand", "gravel", "concrete" ] });
});
vanillaItems.filter(id => id.endsWith('_button')).forEach(item => {
    lootTableItems.push({ minHeight: 2, typeId: item, blocksAllowed: [ "sand", "gravel", "concrete" ] });
});
vanillaItems.filter(id => id.endsWith('_pressure_plate')).forEach(item => {
    lootTableItems.push({ minHeight: 2, typeId: item, blocksAllowed: [ "sand", "gravel", "concrete" ] });
});
vanillaItems.filter(id => id.endsWith('_seeds')).forEach(item => {
    lootTableItems.push({ minHeight: 1, typeId: item, blocksAllowed: [ "all" ] });
});
vanillaItems.filter(id => id.endsWith('_coral_fan')).forEach(item => {
    lootTableItems.push({ minHeight: 8, typeId: item, blocksAllowed: [ "sand" ] });
});
vanillaItems.filter(id => id.startsWith('music_disc_')).forEach(item => {
    lootTableItems.push({ minHeight: 3, typeId: item, blocksAllowed: [ "all" ] });
});
vanillaItems.filter(id => id.endsWith('_goat_horn')).forEach(item => {
    lootTableItems.push({ minHeight: 6, typeId: item, blocksAllowed: [ "all" ] });
});
vanillaItems.filter(id => id.endsWith('_smithing_template')).forEach(item => {
    lootTableItems.push({ minHeight: 4, typeId: item, blocksAllowed: [ "all" ] });
});
vanillaItems.filter(id => id.endsWith('_pottery_shard')).forEach(item => {
    lootTableItems.push({ minHeight: 3, typeId: item, blocksAllowed: [ "all" ] });
});
vanillaItems.filter(id => id.endsWith('_banner_pattern')).forEach(item => {
    lootTableItems.push({ minHeight: 3, typeId: item, blocksAllowed: [ "all" ] });
});
vanillaItems.filter(id => id.endsWith('_axe')).forEach(item => {
    lootTableItems.push({ minHeight: 6, typeId: item, blocksAllowed: [ "all" ] });
});
vanillaItems.filter(id => id.endsWith('_pickaxe')).forEach(item => {
    lootTableItems.push({ minHeight: 6, typeId: item, blocksAllowed: [ "all" ] });
});
vanillaItems.filter(id => id.endsWith('_sword')).forEach(item => {
    lootTableItems.push({ minHeight: 6, typeId: item, blocksAllowed: [ "all" ] });
});
vanillaItems.filter(id => id.endsWith('_hoe')).forEach(item => {
    lootTableItems.push({ minHeight: 6, typeId: item, blocksAllowed: [ "all" ] });
});
vanillaItems.filter(id => id.endsWith('_shovel')).forEach(item => {
    lootTableItems.push({ minHeight: 6, typeId: item, blocksAllowed: [ "all" ] });
});
const badItems = lootTableItems.filter(item => item.typeId.startsWith('minecraft:') && !vanillaItems.includes(item.typeId))
//badItems.forEach(bad => alertLog.log(bad.typeId));

//==============================================================================
watchFor.shortConcreteBlocks.filter(s => s.height = 16).forEach(b => {
    b.base = b.name;
    b.typeId = globals.mainNameSpace + b.name;

    for (let i = 1; i <= 15; i++) {
        const addB = {
            base: b.name,
            height: i,
            name: `${b.name}_${i}`,
            typeId: `${globals.mainNameSpace + b.name}_${i}`
        };
        watchFor.shortConcreteBlocks.push(addB);
    }
});
//==============================================================================


//vanillaItems.forEach(v => alertLog.log(v))