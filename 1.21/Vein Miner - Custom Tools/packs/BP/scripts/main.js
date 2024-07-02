//from Minecraft
import { world, system, Player } from "@minecraft/server";
//from code
import * as onBlock from './components/onBlocks.js';

const debug = true; // <<< --- turn off when done testing

//start
world.beforeEvents.worldInitialize.subscribe((event) => {

    //crash test dummy code
    if (debug)
        event.itemComponentRegistry
            .registerCustomComponent(
                "ctd:minion_placer_component",
                { onMineBlock: e => { onBlock.ctd_placeEntityTest(e.block, e.minedBlockPermutation, e.source); } }
            );
    //add-on code
});
//Kill the CTDs
world.beforeEvents.chatSend.subscribe((event) => {
    if (!(event.sender instanceof Player)) return;

    //crash test dummy code
    if (debug) // <<< --- turn off when done testing
        event.sender.sendMessage("hello");
    if (event.message.toLowerCase().startsWith(":kill ctd")) {
        event.cancel;
        system.run(() => {
            event.sender.dimension.runCommand("kill @e[family=ctd]");
        });
        event.sender.sendMessage("§cCrash Test Dummies killed!");
        return;
    }
});
//this is not working - no msg
world.beforeEvents.itemUse.subscribe((event) => {
    event.source.sendMessage("beforeEvents.itemUse")
    if (!(event.source instanceof Player)) return;
    
    if (event.itemStack.typeId === "ctd:wand_test_og_item_use_b4") 
        onBlock.mimicOnItemUse_wand_test_og_item_use_b4(event)
})
world.beforeEvents.playerBreakBlock.subscribe((event) => {
    //event.player.sendMessage("beforeEvents.playerBreakBlock")

    if (event.itemStack.typeId === "ctd:wand_test_og_item_use_b4") 
        onBlock.mimicOnBlockMined_wand_test_og_item_use_b4(event)
    else if (event.itemStack.typeId.endsWith("_axe") )
        onBlock.mimicOnBlockMined_Axe(event)
})
world.afterEvents.playerInteractWithBlock.subscribe((event) => {
    if (event.block.typeId.includes("minecraft:anvil"))
        onBlock.onPlayerInteractWithBlock(event);

})