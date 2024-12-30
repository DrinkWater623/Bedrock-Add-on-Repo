//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
import { ItemStack, PlayerInteractWithBlockBeforeEvent, world } from "@minecraft/server";
import { dev, alertLog, chatLog, watchFor } from './settings.js';
import { SlabBeforeEventData } from "./class/SlabEventDataClass.js";
import { block_registerCustomComponents } from "./events/blockComponentRegistry.js";
import { slabEventHandler } from "./events/slabEventHandler.js";
//==============================================================================
export function beforeEvents_worldInitialize_subscribe () {

    alertLog.success("Subscribing to§r world.beforeEvents.worldInitialize - §aStable", dev.debugSubscriptions);

    world.beforeEvents.worldInitialize.subscribe((event) => {
        block_registerCustomComponents(event);
    });
}
//==============================================================================
export function beforeEvents_playerInteractWithBlock_subscribe () {

    //This event is still beta as of 1.21.50
    alertLog.success('Subscribing to§r world.beforeEvents.playerInteractWithBlock - §6Beta', dev.debugSubscriptions);

    world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
        
        if (!event.itemStack)
            return;

        const holdingTypeId = event.itemStack.typeId;
        const blockTypeId = event.block.typeId;

        if (!watchFor.customConcreteSlabInfo.some(p => p.typeId == holdingTypeId || p.typeId == blockTypeId))
            return;

        const debug = dev.debugSlabInteractEvents && event.isFirstEvent;

        const isHoldingSlab = watchFor.customConcreteSlabInfo.some(p => p.typeId == holdingTypeId);
        const isHoldingSpecialItem = isHoldingSlab ? false : watchFor.vanillaItemsPlacementSpecs.some(s => s.item == holdingTypeId);
        
        if(!isHoldingSlab && !isHoldingSpecialItem)
            return

        chatLog.send(event.player, `${'\n'.repeat(2)}${'='.repeat(80)}\n§e§lSubscription Activated:§f§l beforeEvents.playerInteractWithBlock`, debug);

        if (isHoldingSlab) {
            //Do I need this.. test
            if (!event.isFirstEvent) {
                event.cancel = true;
                return;
            }

            chatLog.send(event.player, `§a§lHolding DW623 Slab`, debug);

            HoldingSlabEventWrapper(event, event.itemStack, debug);
            return;
        }

        if (!isHoldingSpecialItem)
            return;

        const isTouchingSlab = watchFor.customConcreteSlabInfo.some(p => p.typeId == blockTypeId);

        // Limit what happens while holding certain items
        if (isTouchingSlab) {
            //Do I need this.. test
            if (!event.isFirstEvent) {
                event.cancel = true;
                return;
            }

            chatLog.send(event.player, `§a§lLimit Special Item Placement`, debug);

            TouchingSlabEventWrapper(event, event.itemStack, debug);
            return;
        }
    });
}
//=============================================================================
/**
 * 
 * @param {PlayerInteractWithBlockBeforeEvent} event 
 * @param {ItemStack} itemStack 
 * @param {boolean} debug 
 * @returns 
 */
function HoldingSlabEventWrapper (event, itemStack, debug) {   

    const myEvent = new SlabBeforeEventData(
        event.player,
        itemStack,
        event.block,
        event.blockFace.toLowerCase(),
        event.faceLocation,
        '',
        debug);

    // chatLog.send(event.player, `  ==> Block Touched: ${blockTypeId}`, debug);
    // chatLog.send(event.player, `  ==> Item Family: ${myEvent.itemFamily}`, debug);

    //if (blockTypeId.startsWith(myEvent.itemFamily)) {
    slabEventHandler(myEvent, debug);
    event.cancel = myEvent.cancel;

    if (event.cancel) {
        chatLog.send(event.player, '\n§a§lBlock should be altered\n', debug);
        return;
    }

    chatLog.send(event.player, `\n§v§lPassing Event to Next Handler\n`, debug);
}
//=============================================================================
/**
 * 
 * @param {PlayerInteractWithBlockBeforeEvent} event 
 * @param {ItemStack} itemStack 
 * @param {boolean} debug 
 * @returns 
 */
function TouchingSlabEventWrapper (event, itemStack, debug) {

    const myEvent = new SlabBeforeEventData(event.player,
        itemStack,
        event.block,
        event.blockFace.toLowerCase(),
        event.faceLocation,
        '',
        debug);

    const { allowedBlockFaceTraits, minHeight, minWidth } = watchFor.vanillaItemsPlacementSpecs.filter(t => t.item == itemStack.typeId)[ 0 ];

    //On correct face?
    if (allowedBlockFaceTraits && !allowedBlockFaceTraits.includes(myEvent.touchFace)) {
        event.cancel = true;
        return;
    }
    if (myEvent.touchBlockHeight < minWidth) {
        event.cancel = true;
        return;
    }
    if (myEvent.touchBlockHeight < minHeight) {
        event.cancel = true;
        return;
    }
}
//=============================================================================
// End of File
//=============================================================================