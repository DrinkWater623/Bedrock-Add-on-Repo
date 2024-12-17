//@ts-check
import { ConsoleAlert, ChatMsg } from "./commonLib/consoleClass";
import { MinecraftItemTypes } from "./commonLib/vanillaData";
//==============================================================================
/**
 *  Owner is to edit this file as needed
 */
//==============================================================================
export const pack = {
    packName: 'Auto Sifters',
    packNameSpace: 'dw623:',
    isLoadAlertsOn: true,
    hasChatCmd: -1,
    isStable: 1,
    alert: "https://github.com/DrinkWater623",
    VanillaOnlySlabPlacement: false
};
//==============================================================================
export const alertLog = new ConsoleAlert(`§d${pack.packName}§r`);
export const chatLog = new ChatMsg(`§b${pack.packName}§r`);
//==============================================================================
export const globals = {       
    mcNameSpace: "minecraft:",
    mcAir: 'minecraft:air',
    keyBlockWords: [ "gravel", "powder", "mud", "sand", "snow" ] //save time
};
//==============================================================================
export const dev = {
    debug: false,
    debugGamePlay: false,
    debugPackLoad: false,
    debugSubscriptions: false,
    debugSlabInteractEvents: true,
    debugSifterOnTickEvents: true,
    allDebug () {
        for (const key in dev) {
            if (key.startsWith('debug') && key.length>'debug'.length)
                dev[ key ] = this.debug;
        }
    },
    allOff () {
        for (const key in dev) {
            if (key.startsWith('debug'))
                dev[ key ] = false;
        }
    },
    allOn () {
        for (const key in dev) {
            if (key.startsWith('debug'))
                dev[ key ] = true;
        }
    },

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
export const watchFor = {
    autoSiftBlockInfo: [
        //a few not gravity, but should be, so treating like they are - cause hey, I can.
        { full: true, gravity: true, name: "gravel", custom: "", minecraft: "", sound: "dig.gravel" },
        { full: true, gravity: true, name: "red_sand", custom: "", minecraft: "", sound: "dig.sand" },
        { full: true, gravity: true, name: "sand", custom: "", minecraft: "", sound: "dig.sand" },
        { full: true, gravity: false, name: "soul_sand", custom: "", minecraft: "", sound: "dig.hay" },
        { full: true, gravity: false, name: "snow", custom: "", minecraft: "", sound: "dig.snow" },
        { full: true, gravity: false, name: "powder_snow", custom: "", minecraft: "", sound: "dig.snow" },
        { full: true, gravity: true, name: "mud", custom: "", minecraft: "", sound: "dig.mud" }
        //TODO: powdered snow... but it has a freeze effect.. see if can mimic       
    ],
    customConcreteSlabInfo: [
        { base: "", height: 0, name: "", typeId: "" }
    ],
    fallThruBlocks: [
        "minecraft:air",
        "minecraft:lava",
        "minecraft:water",
        "minecraft:flowing_lava",
        "minecraft:flowing_water"
    ],
    waterBlocks: [
        "minecraft:water",
        "minecraft:flowing_water"
    ],
    sifterBlocks: [
        pack.packNameSpace + "copper_sifter",
        pack.packNameSpace + "iron_sifter",
        pack.packNameSpace + "diamond_sifter",
        pack.packNameSpace + "netherite_sifter"
    ],
    vanillaSifterBlocks: [ "" ],
    customSiftableBlocks: [ "" ],
    customSiftableBlockInfo: [ {
        //nameSpace: "x",
        base: "x",
        typeIdBase: "x",
        minecraft: "x",
        height: 0,
        name: "x",
        typeId: "x",
        sound: "x"
    } ],

    //nothing can sit on top if on up face and it is slab, meaning it is on bottom
    vanillaItemsPlacementSpecs: [
        { item: "minecraft:cake", minHeight: 1, minWidth: 14, allowedBlockFaceTraits: 'up' },
        { item: "minecraft:sea_pickle", minHeight: 13, minWidth: 13, allowedBlockFaceTraits: 'up' },
        { item: "minecraft:scaffolding", minHeight: 1, minWidth: 15, allowedBlockFaceTraits: 'up' },
        { item: "minecraft:flower_pot", minHeight: 1, minWidth: 10, allowedBlockFaceTraits: 'up' },
        { item: "minecraft:frame", minHeight: 3, minWidth: 3, allowedBlockFaceTraits: '' },
        { item: "minecraft:lever", minHeight: 12, minWidth: 12, allowedBlockFaceTraits: '' },
        { item: "minecraft:lantern", minHeight: 1, minWidth: 9, allowedBlockFaceTraits: 'up,down' },
        { item: "minecraft:torch", minHeight: 9, minWidth: 9, allowedBlockFaceTraits: '' },
        { item: "minecraft:redstone", minHeight: 1, minWidth: 14, allowedBlockFaceTraits: 'up' },
        { item: "minecraft:redstone_torch", minHeight: 9, minWidth: 9, allowedBlockFaceTraits: '' },
        { item: "minecraft:comparator", minHeight: 1, minWidth: 9, allowedBlockFaceTraits: 'up' },
        { item: "minecraft:repeater", minHeight: 1, minWidth: 9, allowedBlockFaceTraits: 'up' },
        { item: "minecraft:tripwire_hook", minHeight: 8, minWidth: 8, allowedBlockFaceTraits: '' }
        //but can be 1 if on up
    ]
    /*
    stuff that is okay, per how on mc slab
    banner
     */
};
//==============================================================================
const vanillaItems = Object.values(MinecraftItemTypes); //.   how to get the values again... not the key
export const lootTableItems = [
    //put these as zero for filters
    { minHeight: 1, typeId: "minecraft:stick", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "sand", "gravel", "concrete" ] },
    { minHeight: 3, typeId: "minecraft:bowl", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:brick", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:flint", blocksNotAllowed: [ "" ], blocksAllowed: [ "gravel", "concrete" ] },
    //food in snow
    { minHeight: 4, typeId: "minecraft:bread", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "snow" ] },
    { minHeight: 4, typeId: "minecraft:baked_potato", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "snow" ] },
    { minHeight: 2, typeId: "minecraft:cookie", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "snow" ] },
    { minHeight: 4, typeId: "minecraft:pumpkin_pie", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "snow" ] },
    { minHeight: 4, typeId: "minecraft:cake", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "snow" ] },
    { minHeight: 1, typeId: "minecraft:dried_kelp", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "sand", "gravel", "concrete" ] },
    //items
    { minHeight: 4, typeId: "minecraft:nether_brick", blocksNotAllowed: [ "" ], blocksAllowed: [ "soul_sand" ] },
    { minHeight: 4, typeId: "minecraft:sea_pickle", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "sand" ] },
    { minHeight: 4, typeId: "minecraft:candle", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "sand", "gravel", "concrete" ] },
    { minHeight: 4, typeId: "minecraft:amethyst_shard", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 6, typeId: "minecraft:honey_bottle", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:flower_pot", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:bucket", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:charcoal", blocksNotAllowed: [ "" ], blocksAllowed: [ "sand", "gravel" ] },
    { minHeight: 4, typeId: "minecraft:coal", blocksNotAllowed: [ "" ], blocksAllowed: [ "sand", "gravel" ] },
    { minHeight: 4, typeId: "minecraft:quartz", blocksNotAllowed: [ "" ], blocksAllowed: [ "soul_sand" ] },
    { minHeight: 2, typeId: "minecraft:prismarine_shard", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "sand" ] },
    { minHeight: 2, typeId: "minecraft:prismarine_crystals", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "sand" ] },
    { minHeight: 4, typeId: "minecraft:nautilus_shell", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "sand" ] },
    { minHeight: 15, typeId: "minecraft:heart_of_the_sea", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "sand" ] },
    { minHeight: 4, typeId: "minecraft:turtle_scute", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "sand" ] },
    { minHeight: 4, typeId: "minecraft:armadillo_scute", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "red_sand" ] },
    { minHeight: 2, typeId: "minecraft:string", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 2, typeId: "minecraft:feather", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "sand", "gravel", "concrete" ] },

    { minHeight: 10, typeId: "minecraft:bubble_column", blocksNotAllowed: [ "" ], blocksAllowed: [ "all" ] },

    { minHeight: 3, typeId: "minecraft:leather", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 3, typeId: "minecraft:rabbit_hide", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "sand" ] },
    { minHeight: 1, typeId: "minecraft:rabbit_foot", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 2, typeId: "minecraft:blaze_rod", blocksNotAllowed: [ "" ], blocksAllowed: [ "soul_sand" ] },
    { minHeight: 2, typeId: "minecraft:breeze_rod", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 2, typeId: "minecraft:echo_shard", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 6, typeId: "minecraft:dragon_breath", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 12, typeId: "minecraft:shulker_shell", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 6, typeId: "minecraft:ender_pearl", blocksNotAllowed: [ "" ], blocksAllowed: [ "soul_sand" ] },
    { minHeight: 6, typeId: "minecraft:ender_eye", blocksNotAllowed: [ "" ], blocksAllowed: [ "soul_sand" ] },
    { minHeight: 4, typeId: "minecraft:nether_star", blocksNotAllowed: [ "" ], blocksAllowed: [ "soul_sand" ] },
    { minHeight: 2, typeId: "minecraft:end_rod", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 2, typeId: "minecraft:lightning_rod", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all", "concrete" ] },
    { minHeight: 2, typeId: "minecraft:paper", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "sand", "gravel" ] },
    { minHeight: 4, typeId: "minecraft:book", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "sand", "gravel", "concrete" ] },
    { minHeight: 4, typeId: "minecraft:writable_book", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "sand", "gravel", "concrete" ] },
    { minHeight: 2, typeId: "minecraft:lever", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "sand", "gravel", "concrete" ] },
    { minHeight: 2, typeId: "minecraft:tripwire_hook", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 12, typeId: "minecraft:daylight_detector", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 8, typeId: "minecraft:repeater", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "sand", "gravel", "concrete" ] },
    { minHeight: 8, typeId: "minecraft:comparator", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "sand", "gravel", "concrete" ] },
    { minHeight: 2, typeId: "minecraft:name_tag", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 2, typeId: "minecraft:chain", blocksNotAllowed: [ "" ], blocksAllowed: [ "all" ] },
    { minHeight: 8, typeId: "minecraft:trial_key", blocksNotAllowed: [ "" ], blocksAllowed: [ "all" ] },
    { minHeight: 8, typeId: "minecraft:ominous_trial_key", blocksNotAllowed: [ "" ], blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:disc_fragment_5", blocksNotAllowed: [ "" ], blocksAllowed: [ "all" ] },

    //nature menu
    { minHeight: 3, typeId: "minecraft:bamboo", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "sand", "snow" ] },
    { minHeight: 3, typeId: "minecraft:sugar_cane", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "sand", "snow" ] },
    { minHeight: 4, typeId: "minecraft:egg", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 2, typeId: "minecraft:kelp", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "sand", "snow" ] },
    { minHeight: 2, typeId: "minecraft:waterlily", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "sand", "snow" ] },
    { minHeight: 10, typeId: "minecraft:deadbush", blocksNotAllowed: [ "" ], blocksAllowed: [ "sand", "red_sand" ] },
    { minHeight: 14, typeId: "minecraft:pointed_dripstone", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "sand" ] },
    { minHeight: 2, typeId: "minecraft:bone", blocksNotAllowed: [ "" ], blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:turtle_egg", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "sand" ] },
    { minHeight: 2, typeId: "minecraft:rotten_flesh", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:nether_wart", blocksNotAllowed: [ "" ], blocksAllowed: [ "soul_sand" ] },
    { minHeight: 4, typeId: "minecraft:chorus_fruit", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "snow" ] },
    { minHeight: 4, typeId: "minecraft:potato", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "snow" ] },
    { minHeight: 4, typeId: "minecraft:poisonous_potato", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "snow" ] },
    { minHeight: 4, typeId: "minecraft:golden_carrot", blocksNotAllowed: [ "" ], blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:carrot", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "snow" ] },
    { minHeight: 4, typeId: "minecraft:apple", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "snow" ] },
    { minHeight: 4, typeId: "minecraft:golden_apple", blocksNotAllowed: [ "" ], blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:enchanted_golden_apple", blocksNotAllowed: [ "" ], blocksAllowed: [ "all" ] },
    { minHeight: 6, typeId: "minecraft:melon_slice", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "snow" ] },
    { minHeight: 6, typeId: "minecraft:glistering_melon_slice", blocksNotAllowed: [ "" ], blocksAllowed: [ "snow" ] },
    { minHeight: 4, typeId: "minecraft:sweet_berries", blocksNotAllowed: [ "" ], blocksAllowed: [ "snow" ] },
    { minHeight: 4, typeId: "minecraft:glow_berries", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:honeycomb", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 2, typeId: "minecraft:ink_sac", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 2, typeId: "minecraft:glow_ink_sac", blocksNotAllowed: [ "" ], blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:small_amethyst_bud", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 8, typeId: "minecraft:medium_amethyst_bud", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 12, typeId: "minecraft:large_amethyst_bud", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:frame", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:glow_frame", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:painting", blocksNotAllowed: [ "" ], blocksAllowed: [ "all" ] },
    { minHeight: 14, typeId: "minecraft:player_head", blocksNotAllowed: [ "" ], blocksAllowed: [ "all" ] },
    { minHeight: 14, typeId: "minecraft:creeper_head", blocksNotAllowed: [ "" ], blocksAllowed: [ "all" ] },
    { minHeight: 14, typeId: "minecraft:zombie_head", blocksNotAllowed: [ "" ], blocksAllowed: [ "all" ] },
    { minHeight: 14, typeId: "minecraft:piglin_head", blocksNotAllowed: [ "" ], blocksAllowed: [ "soul_sand" ] },
    { minHeight: 14, typeId: "minecraft:skeleton_skull", blocksNotAllowed: [ "" ], blocksAllowed: [ "all" ] },
    { minHeight: 8, typeId: "minecraft:goat_horn", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    //items
    { minHeight: 6, typeId: "minecraft:diamond", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 6, typeId: "minecraft:emerald", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 6, typeId: "minecraft:copper_ingot", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 6, typeId: "minecraft:gold_ingot", blocksNotAllowed: [ "" ], blocksAllowed: [ "all" ] },
    { minHeight: 6, typeId: "minecraft:iron_ingot", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 6, typeId: "minecraft:netherite_ingot", blocksNotAllowed: [ "" ], blocksAllowed: [ "soul_sand" ] },
    { minHeight: 4, typeId: "minecraft:netherite_scrap", blocksNotAllowed: [ "" ], blocksAllowed: [ "soul_sand" ] },
    { minHeight: 6, typeId: "minecraft:raw_copper", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 6, typeId: "minecraft:raw_gold", blocksNotAllowed: [ "" ], blocksAllowed: [ "all" ] },
    { minHeight: 6, typeId: "minecraft:raw_iron", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 2, typeId: "minecraft:gold_nugget", blocksNotAllowed: [ "" ], blocksAllowed: [ "all" ] },
    { minHeight: 2, typeId: "minecraft:iron_nugget", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    //tools
    { minHeight: 8, typeId: "minecraft:totem_of_undying", blocksNotAllowed: [ "" ], blocksAllowed: [ "all" ] },
    { minHeight: 8, typeId: "minecraft:turtle_helmet", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "sand" ] },
    { minHeight: 3, typeId: "minecraft:lead", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 3, typeId: "minecraft:clock", blocksNotAllowed: [ "" ], blocksAllowed: [ "all" ] },
    { minHeight: 3, typeId: "minecraft:compass", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 3, typeId: "minecraft:recovery_compass", blocksNotAllowed: [ "" ], blocksAllowed: [ "all" ] },
    { minHeight: 1, typeId: "minecraft:empty_map", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 1, typeId: "minecraft:filled_map", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 12, typeId: "minecraft:saddle", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 14, typeId: "minecraft:wolf_armor", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 8, typeId: "minecraft:trident", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "sand" ] },

    { minHeight: 8, typeId: "minecraft:fire_charge", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 12, typeId: "minecraft:firework_rocket", blocksNotAllowed: [ "" ], blocksAllowed: [ "all" ] },
    { minHeight: 8, typeId: "minecraft:firework_star", blocksNotAllowed: [ "" ], blocksAllowed: [ "all" ] },
    { minHeight: 6, typeId: "minecraft:shears", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 6, typeId: "minecraft:glass_bottle", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 6, typeId: "minecraft:experience_bottle", blocksNotAllowed: [ "" ], blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:spyglass", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 4, typeId: "minecraft:brush", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 14, typeId: "minecraft:mace", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 8, typeId: "minecraft:bundle", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },

    //custom
    { minHeight: 1, typeId: pack.packNameSpace + "emerald_nugget", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 1, typeId: pack.packNameSpace + "diamond_nugget", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 1, typeId: pack.packNameSpace + "netherite_nugget", blocksNotAllowed: [ "" ], blocksAllowed: [ "soul_sand" ] },
    { minHeight: 1, typeId: pack.packNameSpace + "netherite_scrap_piece", blocksNotAllowed: [ "" ], blocksAllowed: [ "soul_sand" ] },
    { minHeight: 6, typeId: pack.packNameSpace + "broken_elytra_left", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] },
    { minHeight: 6, typeId: pack.packNameSpace + "broken_elytra_right", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] }
    // add cooked foods and raw in snow only

];
//=============================================================================
// Update
//==============================================================================
watchFor.autoSiftBlockInfo.forEach(b => {
    b.custom = `${pack.packNameSpace}${b.name}`;
    b.minecraft = `${globals.mcNameSpace}${b.name}`;
});
//==============================================================================
// Append
//==============================================================================
colors.forEach(color => {

    //add colored gravity blocks to main auto sifter list
    const concretePowderBase = color + "_concrete_powder";
    const concretePowderInfo = {
        full: false,
        gravity: true,
        name: concretePowderBase,
        custom: `${pack.packNameSpace}${concretePowderBase}`,
        minecraft: `${globals.mcNameSpace}${concretePowderBase}`,
        height: 16,
        sound: "dig.sand"
    };
    watchFor.autoSiftBlockInfo.push(concretePowderInfo);

    //add concrete slab for each color to concreteSlabs list
    const concreteSlabBase = color + "_concrete_slab";
    for (let i = 1; i <= 16; i++) {
        const concreteSlabInfo = {
            base: concreteSlabBase,
            height: i,
            name: `${concreteSlabBase}_${i}`,
            typeId: `${pack.packNameSpace + concreteSlabBase}_${i}`
        };
        watchFor.customConcreteSlabInfo.push(concreteSlabInfo);
    }

    //loot table stuff with colors
    lootTableItems.push({ minHeight: 8, typeId: globals.mcNameSpace + color + "_bundle", blocksNotAllowed: [ "" ], blocksAllowed: [ "all" ] });
    lootTableItems.push({ minHeight: 8, typeId: globals.mcNameSpace + color + "_candle", blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "sand", "gravel", "concrete" ] });

    watchFor.vanillaItemsPlacementSpecs.push({ item: globals.mcNameSpace + color + "_carpet", minHeight: 0, minWidth: 2, allowedBlockFaceTraits: 'down', disAllowedBlockFaceTraits: '' });
    //candle is complicated
    //one candle is 9, but 2 is 11, but mc can have candles with nothing under them, so ok
});
// simp1le array for easier search
watchFor.vanillaSifterBlocks = watchFor.autoSiftBlockInfo.map(b => b.minecraft);
//==============================================================================
// Adjustments
//==============================================================================
watchFor.autoSiftBlockInfo.forEach(b => {
    const slabBaseName = b.name + '_slab';
    for (let i = 1; i <= 16; i++) {
        const addB = {
            base: slabBaseName,
            typeIdBase: `${pack.packNameSpace}${slabBaseName}`,
            minecraft: `minecraft:${b.name}`,
            height: i,
            name: `${slabBaseName}_${i}`,
            typeId: `${pack.packNameSpace}${slabBaseName}_${i}`,
            sound: b.sound
        };
        watchFor.customSiftableBlockInfo.push(addB);
    }
});
watchFor.customSiftableBlocks = watchFor.customSiftableBlockInfo.map(b => b.typeId);
//==============================================================================
//  Appends for Loot Tables - Loops of Loop-able Stuff
//==============================================================================
//add enchanted books - good ones
//add enchanted tools weapons
vanillaItems.filter(id => id.endsWith('_rail')).forEach(item => {
    watchFor.vanillaItemsPlacementSpecs.push({ item: item, minHeight: 1, minWidth: 12, allowedBlockFaceTraits: 'down', disAllowedBlockFaceTraits: '' });
});

vanillaItems.filter(id => id.endsWith('_sign')).filter(id => !id.endsWith('_hanging_sign')).forEach(item => {
    watchFor.vanillaItemsPlacementSpecs.push({ item: item, minHeight: 4, minWidth: 9, allowedBlockFaceTraits: '' });
});
vanillaItems.filter(id => id.endsWith('_hanging_sign')).forEach(item => {
    watchFor.vanillaItemsPlacementSpecs.push({ item: item, minHeight: 2, minWidth: 1, allowedBlockFaceTraits: 'down' });
});

vanillaItems.filter(id => id.endsWith('_button')).forEach(item => {
    //TODO: note button is a little diff, depends on player cardinal facing direction
    // technically need one pixel line on block, just use 8 until can work that out
    watchFor.vanillaItemsPlacementSpecs.push({ item: item, minHeight: 8, minWidth: 8, allowedBlockFaceTraits: '' });
    lootTableItems.push({ minHeight: 2, typeId: item, blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "sand", "gravel", "concrete" ] });
});
vanillaItems.filter(id => id.endsWith('_pressure_plate')).forEach(item => {
    watchFor.vanillaItemsPlacementSpecs.push({ item: item, minHeight: 1, minWidth: 9, allowedBlockFaceTraits: 'down' });
    lootTableItems.push({ minHeight: 2, typeId: item, blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "sand", "gravel", "concrete" ] });
});
vanillaItems.filter(id => id.endsWith('_seeds')).forEach(item => {
    lootTableItems.push({ minHeight: 1, typeId: item, blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] });
});
vanillaItems.filter(id => id.endsWith('_coral_fan')).forEach(item => {
    lootTableItems.push({ minHeight: 8, typeId: item, blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "sand" ] });
});
vanillaItems.filter(id => id.startsWith('music_disc_')).forEach(item => {
    lootTableItems.push({ minHeight: 3, typeId: item, blocksNotAllowed: [ "" ], blocksAllowed: [ "all" ] });
});
vanillaItems.filter(id => id.endsWith('_smithing_template')).forEach(item => {
    lootTableItems.push({ minHeight: 4, typeId: item, blocksNotAllowed: [ "" ], blocksAllowed: [ "all" ] });
});

[ "_pottery_shard", "_banner_pattern" ].forEach(type => {
    vanillaItems.filter(id => id.endsWith(type)).forEach(item => {
        lootTableItems.push({ minHeight: 3, typeId: item, blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] });
    });
});

[ "_axe", "_pickaxe", "_sword", "_hoe", "_shovel" ].forEach(type => {
    vanillaItems.filter(id => id.endsWith(type) && (id.includes("gold") || id.includes("netherite"))).forEach(item => {
        lootTableItems.push({ minHeight: 12, typeId: item, blocksNotAllowed: [ "" ], blocksAllowed: [ "soul_sand" ] });
    });
    vanillaItems.filter(id => id.endsWith(type) && !(id.includes("gold") || id.includes("netherite"))).forEach(item => {
        lootTableItems.push({ minHeight: 12, typeId: item, blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] });
    });
});
[ "_boots", "_helmet", "_leggings", "_chestplate" ].forEach(type => {
    vanillaItems.filter(id => id.endsWith(type) && (id.includes("gold") || id.includes("netherite"))).forEach(item => {
        lootTableItems.push({ minHeight: 14, typeId: item, blocksNotAllowed: [ "" ], blocksAllowed: [ "soul_sand" ] });
    });
    vanillaItems.filter(id => id.endsWith(type) && !(id.includes("gold") || id.includes("netherite"))).forEach(item => {
        lootTableItems.push({ minHeight: 14, typeId: item, blocksNotAllowed: [ "soul_sand" ], blocksAllowed: [ "all" ] });
    });
});
//==============================================================================
//==============================================================================
//Debug
if (dev.debugPackLoad) {
    const badItems = lootTableItems.filter(item => item.typeId.startsWith(globals.mcNameSpace) && !vanillaItems.includes(item.typeId));
    badItems.forEach(bad => alertLog.error(bad.typeId));

    //vanillaItems.forEach(v => alertLog.log(v))
}
//=============================================================================
// End of File
//=============================================================================