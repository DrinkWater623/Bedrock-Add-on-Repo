//@ts-check
import { world } from "@minecraft/server";
import { alertLog, dev, watchFor } from './settings.js';
import { PlayerPlaceOrInteractBeforeEventData } from "./events/BlockEventDataClass.js";
import { concrete_slabs_playerPlaceOrIntersectBlock_Handler } from "./events/concrete_slabs_events.js";
//==============================================================================
/**
 * @summary Beta
 */
//==============================================================================
//==============================================================================
export function beforeEvents_playerInteractWithBlock () {

    //This event is still beta as of 1.21.50
    alertLog.success('Subscribing to§r world.beforeEvents.playerInteractWithBlock - §6Beta', dev.debugSubscriptions);

    world.beforeEvents.playerInteractWithBlock.subscribe((event) => {

        const holding = event.itemStack?.typeId ?? 'x';

        if (watchFor.customConcreteSlabInfo.some(p => p.typeId == holding)) {
            event.cancel = true;
            if (event.isFirstEvent) {  
                const myEvent = new PlayerPlaceOrInteractBeforeEventData(event,true);              
                concrete_slabs_playerPlaceOrIntersectBlock_Handler(myEvent)               
            }
        }
        //TODO: add limits to what can attach..
        else if(watchFor.customConcreteSlabInfo.some(p => p.typeId == event.block.typeId)){
            //get block state... if not for items, must match face
            const itemStack = event.itemStack
            if (!itemStack)
                return

            //is block or item?

        }
        
    });
}
//==============================================================================
export function beforeEvents_playerPlaceBlock () {

    //This event is still beta as of 1.21.50
    alertLog.success('Subscribing to§r world.beforeEvents.playerPlaceBlock - §6Beta', dev.debugSubscriptions);

    world.beforeEvents.playerPlaceBlock.subscribe((event) => {

        world.sendMessage('hello')
        world.sendMessage(event.permutationBeingPlaced.type.id)

        if (watchFor.customConcreteSlabInfo.some(p => p.typeId == event.permutationBeingPlaced.type.id)) {
            event.cancel = true;
            const myEvent = new PlayerPlaceOrInteractBeforeEventData(event,true);
            //myEvent.infoShow()
        }
    });
}
//==============================================================================

//==============================================================================
