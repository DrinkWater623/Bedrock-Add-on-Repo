//@ts-check
import { world } from "@minecraft/server";
import { ConsoleAlert, ChatMsg } from "./common-stable/tools/messageLib";
import { DebuggerBlocks } from "./common-stable/blocks/debuggerBlocks";
import { DebuggerItems } from "./common-stable/items/debuggerItems";
//==============================================================================
/**
 *  Owner is to edit this file as needed
 */
//==============================================================================
export const pack = {
    packName: 'F3 Testing',

    about: 'Testing for Subscription Events and Custom Components',
    devUrl: 'https://github.com/DrinkWater623',
    reportBugs: 'pinkSalt623@gmail.com',

    isBeta: false,
    worldLoaded: false,
    isLoadAlertsOn: true,
    cmdNameSpace: "f3"
};
//==============================================================================
export const packDisplayName = `§6${pack.packName}§r`;
export const alertLog = new ConsoleAlert(`§d${pack.packName}§r`);
export const chatLog = new ChatMsg(`§b${pack.packName}§r`);
export const debuggerBlocks = new DebuggerBlocks(packDisplayName, true, world);
export const debuggerItems = new DebuggerItems(packDisplayName, true, world);
//==============================================================================
export const watchFor = {
    //--------------
    //TODO: add slab, tiles, etc.. each type of block
    //--------------
    watchArrows: false,
    arrowBlocks: [
        'dw623:bedrock_arrow'
    ],
    //--------------
    watchBars: false,
    barBlocks: [
        'dw623:bedrock_bar'
    ],
    //--------------
    watchMiniBlocks: true,
    miniBlocks: [
        'dw623:bedrock_mini_block'
    ],
    //--------------
};
//==============================================================================
export const toggles = {
    //entities
    ed_aft: false,
    el_aft: false,
    es_aft: false,
    //Player Interact With Block
    piwb_b4: false,
    piwb_aft: false,
    //Player Break Block
    pbb_b4: false,
    pbb_aft: false,
    //Player Place Block
    ppb_b4: false, //beta

    //Player Interact With Entity
    piwe_b4: false,

    blockView: false
};
export const dev = {
    debug: false,
    debugChatCmds: false,
    debugPackLoad: false,
    debugSubscriptions: false,
    debugPlayerLoadSpawn: false,
    debugBlockFunctions: false,
};
