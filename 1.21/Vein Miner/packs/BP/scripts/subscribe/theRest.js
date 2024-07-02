//==============================================================================
import { world, system, Player } from "@minecraft/server";
import * as ccBlock from '../components/onBlocks.js';
import { McDebug } from '../library/McDebug.js';
//==============================================================================
const bug = new McDebug(true, world); // <<< --- turn off when done testing
//==============================================================================
//Kill the CTDs
world.beforeEvents.chatSend.subscribe((event) => {
    if (!(event.sender instanceof Player)) return;

    //crash test dummy code   
    if (event.message.toLowerCase().startsWith(":kill ctd")) {
        event.cancel;
        system.run(() => {
            event.sender.dimension.runCommand("kill @e[family=ctd]");
        });
        event.sender.sendMessage("§cCrash Test Dummies killed!");
        return;
    }
});
//==============================================================================
//this is not working - no msg
world.beforeEvents.itemUse.subscribe((event) => {
    event.source.sendMessage("§c* beforeEvents.itemUse.subscribe");
    if (!(event.source instanceof Player)) return;

    if (event.itemStack.typeId === "ctd:player_break_block_info") {
        bug.log("§a* ItemUseBeforeEvent - Custom tool: ");
        bug.itemInfo(event.itemStack);

        //stab in the dark
        const blockHit = event.player.getBlockFromViewDirection({ maxDistance: 7 });
        if (blockHit.block) {
            bug.blockInfo(blockHit.block, event.player, "§cBlock-Hit Info");
        }
    }
});
//==============================================================================
world.afterEvents.playerBreakBlock.subscribe((event) => {
    if (!event.itemStackBeforeBreak) return;

    if (event.itemStackBeforeBreak.typeId === "ctd:player_break_block_info") {
        bug.playerBreakBlockAfterEventInfo(event);
        return;
    }
    //Axe ends with _axe, non-stackable, has enchantable component, has efficiency (any level)
    if (event.itemStackBeforeBreak.typeId.endsWith("_axe")) {
        bug.blockPermutationInfo(event.brokenBlockPermutation, event.player, "§a* afterEvents.playerBreakBlock brokenBlockPermutation");
        return;
    }
});
//==============================================================================

// world.beforeEvents.playerBreakBlock.subscribe((event) => {
//     if (!event.itemStack) return;

//     function xx (item, typeIdRegEx = "", tags = [ "" ], enchantments = { efficiency: 3 }) {
//         if (!(item instanceof ItemStack)) return false;

//         return true;
//     }

//     if (event.itemStack.typeId === "ctd:player_break_block_info") {
//         //bug.log("§a* beforeEvents.playerBreakBlock");
//         bug.playerBreakBlockBeforeEventInfo(event);
//         return;
//     }

//     //Axe ends with _axe, non-stackable, has enchantable component, has efficiency (any level)
//     if (event.itemStack.typeId.endsWith("_axe")) {
//         bug.playerBreakBlockBeforeEventInfo(event);
//         return;
//     }
// });
//==============================================================================
//custom components
world.beforeEvents.worldInitialize.subscribe((event) => {

    //crash test dummy code    
    event.itemComponentRegistry
        .registerCustomComponent(
            "ctd:minion_placer_component",
            { onMineBlock: e => { ccBlock.ctd_placeEntityTest(e.block, e.minedBlockPermutation, e.source); } }
        );
    //add-on code
});
//==============================================================================
world.afterEvents.playerInteractWithBlock.subscribe((event) => {

    bug.log(`${event.block.typeId}`);
    //TODO: test if can give anvil a 10% chance to upgrade from very to slight or slight to not damaged
    if (event.block.typeId.includes("minecraft:anvil") &&
        event.itemStack?.hasTag("minecraft:is_tool")
        //TODO: add ors for nametags, books
        //may need to test itemfinishe use... something that means anvil was used at all
    ) {
        bug.playerInteractWithBlockAfterEventInfo(event);
        return;
    }

});
//==============================================================================
