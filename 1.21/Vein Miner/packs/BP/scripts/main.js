//from Minecraft
import { world, system, Player } from "@minecraft/server";
//from code
import * as omb from './components/onMinedBlock.js';

const debug = true; // <<< --- turn off when done testing

//start
world.beforeEvents.worldInitialize.subscribe((event) => {

    //crash test dummy code
    if (debug)
        event.itemComponentRegistry
            .registerCustomComponent(
                "ctd:place_entity_inside_block",
                { onMineBlock: e => { omb.ctd_placeEntityTest(e.block, e.minedBlockPermutation, e.source); } }
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