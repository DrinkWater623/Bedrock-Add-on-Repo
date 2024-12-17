//@ts-check
import { MinecraftDimensionTypes, world } from "@minecraft/server";
import { ConsoleAlert, ChatMsg } from "./commonLib/consoleClass";
import { MinecraftBiomeTypes, MinecraftBlockTypes, MinecraftEntityTypes, MinecraftItemTypes } from "./commonLib/vanillaData";
//==============================================================================
/**
 *  Owner is to edit this file as needed
 */
//==============================================================================
export const pack = {
    packName: 'F3 Info',
    isLoadAlertsOn: true,
    hasChatCmd: -1,
    isBeta: -1,
    commandPrefix: "f3:",
    alert: "https://github.com/DrinkWater623"
};
//==============================================================================
export const toggles = {
    //Player Interact With Block
    piwb_b4: false,
    piwb_aft: false,
    //Player Break Block
    pbb_b4: false,
    pbb_aft: false,
    //Player Place Block
    ppb_b4: false, //beta

    //Player Interact With Entity
    piwe_b4: false
};
export const dev = {
    debug: false,
    debugChatCmds: false,
    debugPackLoad: false,
    debugSubscriptions: false,
    debugPlayerLoadSpawn: false
};
//==============================================================================
export const vanillaLists ={
    //biomes:Object.values(MinecraftBiomeTypes),
    blocks: Object.keys(MinecraftBlockTypes).filter(k => typeof MinecraftBlockTypes[k]=='string').map(k => MinecraftBlockTypes[k]),
    //dimensions: Object.values(MinecraftDimensionTypes),
    //entities: Object.values(MinecraftEntityTypes),
    items: Object.keys(MinecraftItemTypes).filter(k => typeof MinecraftBlockTypes[k]=='string').map(k => MinecraftBlockTypes[k])  
}
//==============================================================================
//TODO: have this pack be the death counter for players
//==============================================================================
export const alertLog = new ConsoleAlert(`§d${pack.packName}§r`);
export const chatLog = new ChatMsg(`§b${pack.packName}§r`);