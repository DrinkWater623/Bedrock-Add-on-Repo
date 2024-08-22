//==============================================================================
import { world } from "@minecraft/server";
import { McDebug } from './library/McDebug.js';
import { ItemHas } from './library/item.js';

const bug = new McDebug(false, world); // <<< --- turn off when done testing
//==============================================================================
export function chatSend_before (debug = false) {
    bug.debugOn = debug;

    world.beforeEvents.chatSend.subscribe((event) => {
        if (!(event.sender instanceof Player)) return;

        if (event.message.toLowerCase() === ":debug") {
            event.cancel;
            bug.toggle();
            debug = false;

            event.sender.sendMessage("§6Debug Toggled");
            return;
        }

        if (debug) {
            //crash test dummy code   
            if (event.message.toLowerCase().startsWith(":kill ctd")) {
                event.cancel;
                system.run(() => {
                    event.sender.dimension.runCommand("kill @e[family=ctd]");
                });
                event.sender.sendMessage("§cCrash Test Dummies killed!");
                return;
            }
        }

    });
}
//==============================================================================
export function playerBreakBlock_after (debug = false) {
    bug.debugOn = debug;

    world.afterEvents.playerBreakBlock.subscribe((event) => {
        if (!event.itemStackBeforeBreak) return;

        if (debug) bug.playerBreakBlockAfterEventInfo(event);

        //Axe ends with _axe, non-stackable, has enchantable component, has efficiency (any level)
        if (ItemHas.tags(event.itemStackBeforeBreak, [ "minecraft:is_axe" ])) {

            if (ItemHas.enchantments(event.itemStackBeforeBreak, [ { type: "efficiency", level: 3 } ])) {

                let msg = "";
                if (ItemHas.enchantments(event.itemStackBeforeBreak, [ { type: "silk_touch", level: 1 } ]))
                    msg = "§fYou Used an Efficiency Silk Touch Axe";
                else
                    msg = "§fYou Used an Efficiency Axe";

                event.player.sendMessage(msg);
                return;
            }
        }
    });
}
export function playerBreakBlock_before (debug = false) {
    bug.debugOn = debug;

    world.beforeEvents.playerBreakBlock.subscribe((event) => {
        if (!event?.itemStack) return;

        // function xx (item, typeIdRegEx = "", tags = [ "" ], enchantments = { efficiency: 3 }) {
        // if (!(item instanceof ItemStack)) return false;
        // 
        // return true;
        // }

        if (debug) bug.playerBreakBlockBeforeEventInfo(event);

        //Axe ends with _axe, non-stackable, has enchantable component, has efficiency (any level)
        if (event.itemStack.typeId.endsWith("_axe")) {
            event.player.sendMessage("§fYou Used an Axe");
            return;
        }
    }
    );
}
//==============================================================================
export function playerInteractWithBlock_after (debug = false) {
    bug.debugOn = debug;

    world.afterEvents.playerInteractWithBlock.subscribe((event) => {

        if (debug) bug.playerInteractWithBlockAfterEventInfo(event);

        //TODO: test if can give anvil a 10% chance to upgrade from very to slight or slight to not damaged
        //TODO: add ors for nametags, books

        if (event.block.typeId.includes("minecraft:anvil") &&
            event.itemStack?.hasTag("minecraft:is_tool")
            //may need to test itemfinishe use... something that means anvil was used at all
        ) {
            event.player.sendMessage("§fYou Clicked on Anvil while holding a tool");
            return;
        }

    });
}
//==============================================================================
export function itemUse_before (debug) {
    bug.debugOn = debug;

    world.beforeEvents.itemUse.subscribe((event) => {
        event.source.sendMessage("§c* beforeEvents.itemUse.subscribe");
        if (!(event.source instanceof Player)) return;

        if (debug) {
            bug.itemInfo(event.itemStack, event.source);
            const blockHit = event.source?.getBlockFromViewDirection({ maxDistance: 7 });
            if (blockHit.block) {
                bug.blockInfo(blockHit.block, event.source, "§1Block-Hit Info");
            }
        }

        //stab in the dark
    });
}
//==============================================================================
export function worldInitialize_before (debug) {
    bug.debugOn = debug;
    world.beforeEvents.worldInitialize.subscribe((event) => {

        //crash test dummy code    
        event.itemComponentRegistry
            .registerCustomComponent(
                "ctd:minion_placer_component",
                { onMineBlock: e => { ccBlock.ctd_placeEntityTest(e.block, e.minedBlockPermutation, e.source); } }
            );
        //add-on code
    });
}