//@ts-check
/**
 * Notes:  This is beta until world.beforeEvents.chatSend is released to Stable
 * 
 * TODO: popup menu on command 
 * TODO: Capture interactions, and broadcast when not the owner - or do I lock?
 * TODO: Make sure for TP, space is safe...  where coords are, test for lava in and above and below.
 * TODO: Make sure after TP, if a bot with same tag in area, TP to player, if not right there. ??? maybe
 * TODO: Later UI forms for giving people rights to have death bot, lock bot, five combination to box, tp to coords, etc....
 */
//==============================================================================
import { main_stable } from './main-stable.js';
//==============================================================================
main_stable();