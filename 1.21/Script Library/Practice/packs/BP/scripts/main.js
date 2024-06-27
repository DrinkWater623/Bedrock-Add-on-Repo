import { world } from "@minecraft/server";

// Subscribe to the itemUseOn event before it happens
world.beforeEvents.itemUseOn.subscribe((event) => {
    const { source, block, itemStack } = event;
    if (!(source instanceof Player)) return;

    if (itemStack.typeId === "minecraft:stick") {
        infoStickOn(block);
        event.cancel = true;
    }   

});
function infoStickOn(block){
    source.sendMessage("You used the stick on " + block.typeId);

}