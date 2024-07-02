//==============================================================================
import { world } from "@minecraft/server";
import { McDebug } from '../library/McDebug.js';
//==============================================================================
export function playerBreakBlock_before (event) {
    world.beforeEvents.playerBreakBlock.subscribe((event) => {
        if (!event?.itemStack) return;
        const bug = new McDebug(true, world); // <<< --- turn off when done testing

        function xx (item, typeIdRegEx = "", tags = [ "" ], enchantments = { efficiency: 3 }) {
            if (!(item instanceof ItemStack)) return false;

            return true;
        }

        if (event.itemStack.typeId === "ctd:player_break_block_info") {
            //bug.log("§a* beforeEvents.playerBreakBlock");
            bug.playerBreakBlockBeforeEventInfo(event);
            return;
        }

        //Axe ends with _axe, non-stackable, has enchantable component, has efficiency (any level)
        if (event.itemStack.typeId.endsWith("_axe")) {
            bug.playerBreakBlockBeforeEventInfo(event);
            return;
        }
    });
}