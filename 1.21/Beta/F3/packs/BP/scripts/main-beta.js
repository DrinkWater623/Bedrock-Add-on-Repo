//@ts-check
import { world, Player, } from "@minecraft/server";
import { processChatCommand } from './f3_chatCmds-beta.js';
import * as f3 from './f3.js';
import './main.js';
//==============================================================================
//==============================================================================
console.warn("§aInstalling afterEvents.chatSend §6BETA");
world.afterEvents.chatSend.subscribe(({ sender, message }) => {
    const cmdPfx = 'f3 ';
    if (sender instanceof Player && message.toLowerCase().startsWith(cmdPfx))
        processChatCommand(sender, message.toLowerCase().replace(cmdPfx, '').trim().replaceAll("  ", ' '));
});
//==============================================================================
console.warn("§aInstalling beforeEvents.playerInteractWithBlock §6BETA");
world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
    f3.playerInteractWithBlock_save(event);
});
console.warn("§aInstalling afterEvents.playerInteractWithBlock §6BETA");
world.afterEvents.playerInteractWithBlock.subscribe((event) => {
    f3.playerInteractWithBlock_save(event);
});