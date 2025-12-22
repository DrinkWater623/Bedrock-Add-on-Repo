//@ts-check
import { world } from "@minecraft/server";
import { ConsoleAlert, ChatMsg } from "./common-stable/tools/messageLib";
//==============================================================================
/**
 *  Owner is to edit this file as needed
 */
//==============================================================================
export const pack = {
    packName: 'F3 Testing',
    debugOn: true, //important - do not release Add-ons with this true, except for F3, as it was meant for debugging only

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
//Non Dev version
export const alertLog = new ConsoleAlert(packDisplayName);
export const chatLog = new ChatMsg(packDisplayName);
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
    onUseBlockAsItemList: [ '' ],
    /**@returns{string[]} */
    onPlaceBlockList () {
        const blocks = [
            ...this.arrowBlocks,
            ...this.barBlocks,
            ...this.miniBlocks
        ];
        return blocks;
    },
    /**@returns{string[]} */
    onBreakBlockList: [ '' ],
    /**@returns{string[]} */
    customItemList: [
        "dw623:light_arrow_template"
    ],
    entityList: [
        "dw623:light_arrow_template"
    ]
    //--------------
};
watchFor.onUseBlockAsItemList = [...watchFor.onPlaceBlockList()];
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