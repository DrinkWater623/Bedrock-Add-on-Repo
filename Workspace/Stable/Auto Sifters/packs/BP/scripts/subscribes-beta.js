//@ts-check
import { world } from "@minecraft/server";
import { alertLog, chatLog, dev, watchFor } from './settings.js';
import { SlabBeforeEventData } from "./class/SlabEventDataClass-beta.js";
import { slabEventHandler } from "./events/slabEventHandler-beta.js";
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
export function beforeEvents_playerPlaceBlock_subscribe () {

    //This event is still beta as of 1.21.50
    alertLog.success('Subscribing to§r world.beforeEvents.playerPlaceBlock - §6Beta', dev.debugSubscriptions);

    world.beforeEvents.playerPlaceBlock.subscribe((event) => {
        const debug = dev.debugSlabInteractEvents
        chatLog.send(event.player, '\n§f§lSubscription Activated:§f§l beforeEvents.playerPlaceBlock\n', debug);

        if (watchFor.customConcreteSlabInfo.some(p => p.typeId == event.permutationBeingPlaced.type.id)) {

            const myEvent = new SlabBeforeEventData(event, false);
            if (!myEvent.middle_g4) {
                slabEventHandler(myEvent, debug);
                event.cancel = myEvent.cancel;
                
                if (event.cancel) {
                    chatLog.send(event.player, '\n§a§lBlock should be placed\n', debug);
                    return;
                }
            }

            chatLog.send(event.player, `\n§a§lPassing Event to §f§l${myEvent.itemTyeId} BP\n`, debug);
        }
    });
}
//=============================================================================
// End of File
//=============================================================================