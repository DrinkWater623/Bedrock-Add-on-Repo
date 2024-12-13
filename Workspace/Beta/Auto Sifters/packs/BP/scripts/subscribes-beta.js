//@ts-check
import { world } from "@minecraft/server";
import { alertLog, chatLog, dev, globals, pack, watchFor } from './settings.js';
import { SlabBeforeEventData } from "./events/SlabEventDataClass.js";
import { concrete_slabs_playerPlaceOrIntersectBlock_Handler as concrete_slabs_playerPlaceOrInteractBlock_Handler } from "./events/concrete_slabs_events.js";
import { slabTypeIDSansHeight } from "./fn-stable.js";
//==============================================================================
/**
 * @summary Beta
 * 
 * Notes: 
 *      If I cancel the interact on the concrete slabs, then the player place is not activated.
 * 
 *      If a block is in the possible spot for player place block, then it will not activate.
 *      So, in order for the the concrete slabs to stack when a block is in the next block
 *      the interact will have to handle that part....
 * 
 *      Unless I let the interact handle the whole thing.
 */
//==============================================================================
//==============================================================================
export function beforeEvents_playerInteractWithBlock (debug = false) {

    //This event is still beta as of 1.21.50
    alertLog.success('Subscribing to§r world.beforeEvents.playerInteractWithBlock - §6Beta', dev.debugSubscriptions);

    world.beforeEvents.playerInteractWithBlock.subscribe((event) => {

        const holding = event.itemStack?.typeId ?? 'x';

        if (watchFor.customConcreteSlabInfo.some(p => p.typeId == holding)) {

            if (!event.isFirstEvent) {
                chatLog.error('§1§lCancelling further events to see what happens', debug);
                event.cancel = true;
                return;
            }

            chatLog.send(event.player, '\n§e§lActivated: playerInteractWithBlock', debug);

            const myEvent = new SlabBeforeEventData(event, debug);
            const slabFamily = slabTypeIDSansHeight(myEvent.itemTyeId);

            chatLog.send(event.player, `  ==> Block Touched: ${event.block.typeId}`, debug);
            chatLog.send(event.player, `  ==> Item Family: ${slabFamily}`, debug);

            if (event.block.typeId.startsWith(slabFamily)) {
                concrete_slabs_playerPlaceOrInteractBlock_Handler(myEvent, debug);

                if (event.cancel) {
                    chatLog.send(event.player, '\n§a§lBlock should be altered (playerInteractWithBlock)\n', debug);
                    return;
                }
                else {
                    chatLog.send(event.player, '\n§v§lPassing Event to Player Place Block (Still Same Family)', debug);
                    return;
                }
            }

            //if (myEvent.newBlock.typeId == globals.mcAir) {
            chatLog.send(event.player, '\n§v§lPassing Event to Player Place Block (Diff Family)', debug);
            return;
        }
    });
}
//==============================================================================
export function beforeEvents_playerPlaceBlock (debug = false) {

    //This event is still beta as of 1.21.50
    alertLog.success('Subscribing to§r world.beforeEvents.playerPlaceBlock - §6Beta', dev.debugSubscriptions);

    world.beforeEvents.playerPlaceBlock.subscribe((event) => {

        if (watchFor.customConcreteSlabInfo.some(p => p.typeId == event.permutationBeingPlaced.type.id)) {
            chatLog.send(event.player, '\n§b§lActivated: playerPlaceBlock\n', debug);

            const myEvent = new SlabBeforeEventData(event, false);
            if (!myEvent.middle_g4) {
                concrete_slabs_playerPlaceOrInteractBlock_Handler(myEvent, debug);

                if (event.cancel) {
                    chatLog.send(event.player, '\n§a§lBlock should be placed (playerPlaceBlock)\n', debug);
                    return;
                }
            }

            chatLog.send(event.player, `\n§a§lPassing Event to ${myEvent.itemTyeId} BP\n`, debug);
        }
    });
}
//==============================================================================

//==============================================================================
