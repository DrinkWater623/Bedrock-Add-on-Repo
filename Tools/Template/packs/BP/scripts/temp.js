import {
    world, system
} from "@minecraft/server";
import {
    ActionFormData,
    MessageFormData,
    ModalFormData
} from "@minecraft/server-ui";

world.afterEvents.itemStartUseOn.subscribe((data) => {
    const player = data.source;
    const block = data.block;
    const item = data.itemStack;

    if (block.typeId == "minecraft:lodestone" && item.typeId == "minecraft:lodestone_compass") {
        let pro = "";
        if (world.getDynamicProperty("" + block.location.x + "," + block.location.y + "," + block.location.z + "," + block.dimension.id) != undefined) {
            pro = world.getDynamicProperty("" + block.location.x + "," + block.location.y + "," + block.location.z + "," + block.dimension.id);
        } else {
            pro = "Null";
        }

        if (pro != "Null" && pro.split("/")[6] == "1" && pro.split("/")[4] == player.nameTag || pro != "Null" && pro.split("/")[6] == "0") {
            if (item.getLore().length != 0 && (item.getLore()[1].split("/")[1] != block.location.x || item.getLore()[2].split("/")[1] != block.location.y || item.getLore()[3].split("/")[1] != block.location.z || "minecraft:" + item.getLore()[4].split("/")[1] != block.dimension.id) || item.getLore().length == 0) {
                let inv = player.getComponent("inventory").container;

                let handItem = player.getComponent("equippable").getEquipment("Mainhand");

                let dimType = block.dimension.id.split(":");

                handItem.setLore(["§r§l§3Name:§r§/" + pro.split("/")[5], "§r§l§3X:§r§/" + block.location.x, "§r§l§3Y:§r§/" + block.location.y, "§r§l§3Z:§r§/" + block.location.z, "§r§l§3Dimension:§r§/" + dimType[1], "\n§l§fRight/Hold Click To Use"]);

                inv.setItem(player.selectedSlot, handItem);

                player.runCommandAsync('/titleraw @s actionbar {"rawtext":[{"text":"§r §l§fYou §bHave Linked This §3Compass §bTo This §7Lodestone"}]}');
                block.dimension.runCommandAsync("/particle minecraft:critical_hit_emitter " + block.location.x + " " + (block.location.y + 1.1) + " " + block.location.z);
                block.dimension.runCommandAsync("/particle minecraft:critical_hit_emitter " + block.location.x + " " + (block.location.y) + " " + block.location.z);
            } else {
                player.runCommandAsync('/titleraw @s actionbar {"rawtext":[{"text":"§r §l§fYou §cAlready Linked This §3Compass §cTo This §7Lodestone §c!!"}]}');
                player.runCommandAsync("playsound note.bass @s");
            }
        } else if (pro != "Null") {
            player.runCommandAsync('/titleraw @s actionbar {"rawtext":[{"text":"§r §l§7This Lodestone §cis §fPrivate §cYou Can not Link This §3Compass §cTo it §c!!"}]}');
            player.runCommandAsync("playsound note.bass @s");
            player.runCommandAsync("/replaceitem entity @s slot.weapon.mainhand 0 lodestone_compass 1");
            player.runCommandAsync("/particle minecraft:sculk_sensor_redstone_particle " + block.location.x + " " + (block.location.y + 1.2) + " " + block.location.z);
        }
    }
});