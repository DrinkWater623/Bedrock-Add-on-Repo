//@ts-check
import { world } from "@minecraft/server";
import { ConsoleAlert, ChatMsg } from "./commonLib/consoleClass";
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
export const globals = {
    autoSiftBlockNameSpace: "sift:",
    autoSiftBlockStateName: "int:y_level",
    mainNameSpace:"dw623:",
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
        { custom: globals.mainNameSpace+"manual_siftable_mud", minecraft: "minecraft:mud", sound: "dig.mud" },
        { custom: globals.mainNameSpace+"manual_siftable_clay", minecraft: "minecraft:clay", sound: "dig.clay" }
    ],
    sifterBlocks: [
        globals.mainNameSpace+"copper_sifter",
        globals.mainNameSpace+"iron_sifter",
        globals.mainNameSpace+"diamond_sifter"
    ]
};
watchFor.shortBlocks = [];
watchFor.autoSiftBlocks.forEach(b => {
    b.custom = `${globals.autoSiftBlockNameSpace}${b.name}`;
    b.minecraft = `minecraft:${b.name}`;

    for (let i = 1; i < 15; i++) {
        const addB = {
            base: b.name,
            height: i,
            name: `${b.name}_${i}`,
            sound: b.sound,
            typeId: `${globals.shortBlockNameSpace}${b.name}_${i}`,
            siftBlockTypeId: `${globals.autoSiftBlockNameSpace}${b.name}`
        };
        watchFor.shortBlocks.push(addB);
    }
});
//==============================================================================
export const alertLog = new ConsoleAlert(`§d${pack.packName}§r`);
export const chatLog = new ChatMsg(`§b${pack.packName}§r`);