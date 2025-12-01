//subscribes.js
//@ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20251023 - add in stable stuff and update to api 2.0 and move debug-only stuff out
========================================================================*/
import { world, system } from "@minecraft/server";
//Subscriptions
// import { PlayerBreakBlockAfterEvent, PlayerBreakBlockAfterEventSignal } from "@minecraft/server";
// import { PlayerInteractWithBlockAfterEvent, PlayerInteractWithBlockAfterEventSignal } from "@minecraft/server";
// import { PlayerInteractWithBlockBeforeEvent, PlayerInteractWithBlockBeforeEventSignal } from "@minecraft/server";
//import { PlayerPlaceBlockAfterEvent, PlayerPlaceBlockAfterEventSignal } from "@minecraft/server";
//Shared
import {  Vector2Lib, Vector3Lib } from "./common-stable/vectorClass.js";
import { FaceLocationGrid,   } from "./common-stable/blockFace.js";
//Local
import { alertLog, chatLog, pack, watchFor } from './settings.js';
import { devDebug } from "./helpers/fn-debug.js";
import { lightArrow_onPlace ,lightBar_onPlace,lightMiniBlock_onPlace} from "./blockComponent.js";
//==============================================================================
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** The function type subscribe expects. */
//  Blocks
/** @typedef {Parameters<typeof world.beforeEvents.playerInteractWithBlock.subscribe>[0]} BeforePlayerInteractWithBlockHandler */
/** @typedef {Parameters<typeof world.beforeEvents.playerPlaceBlock.subscribe>[0]} BeforePlayerPlaceBlockHandler */
// System
/** @typedef {Parameters<typeof system.beforeEvents.startup.subscribe>[0]} BeforeStartupHandler */

/** The stored handle type (Bedrock returns the function reference). */
//  Blocks
/** @typedef {ReturnType<typeof world.beforeEvents.playerInteractWithBlock.subscribe>} BeforePlayerInteractWithBlockHandle */
/** @typedef {ReturnType<typeof world.beforeEvents.playerPlaceBlock.subscribe>} BeforePlayerPlaceBlockHandle */
// system
/** @typedef {ReturnType<typeof system.beforeEvents.startup.subscribe>} BeforeStartupHandle */

//==============================================================================
const debugOn = false || devDebug.debugOn;
const debugFunctionsOn = false || devDebug.debugFunctionsOn;
const debugSubscriptionsOn = devDebug.debugSubscriptionsOn;
const watchBlockSubscriptions = devDebug.watchBlockSubscriptions;
const watchPlayerActions = devDebug.watchPlayerActions;
//==============================================================================
const blockSubscriptions = {
    _name: 'blockSubscriptions',
    //============
    // To override All
    debugMe: false,
    watchMe: false,
    //============
    beforePlayerInteract: {
        _name: 'blockSubscriptions.beforePlayerInteract',
        _subscription: 'world.beforeEvents.playerInteractWithBlock',
        //============
        // To override This
        debugMe: false,
        watchMe: false,
        //============
        on: false,
        /** @type {BeforePlayerInteractWithBlockHandle | null} */
        handler: null,

        subscribe (debug = false, watch = false) {
            const debugMe = debug || this.debugMe;
            const watchMe = watch || this.watchMe;
            alertLog.log(`* ${this._name}.subscribe ()`, debugFunctionsOn);
            if (this.on) return;

            /** @type {BeforePlayerInteractWithBlockHandler} */
            const fn = (event) => {
                event.cancel = false;
                if (!event.isFirstEvent) return;

                const player = event.player
                if(!player || !player.isValid) return
                
                const itemStack = event.itemStack
                if (!itemStack ) return;
                if (!watchFor.onPlaceBlockList().includes(itemStack.typeId)) return;

                const { block } = event;
                //later verify okay block to place on - maybe

                const { typeId, location } = block;
                const itemStackBlock = itemStack.typeId                
                const faceLocation = event.faceLocation;

                //save this to player for the custom component to verify/use
                player.setDynamicProperty('dw623:lastInteractBlockLocation',location)
                player.setDynamicProperty('dw623:lastInteractFaceLocation',faceLocation)
                player.setDynamicProperty('dw623:lastInteractItemStack',itemStackBlock)                
return
                const locationStr = Vector3Lib.toString(location, 1, true);
                const faceLocationStr = Vector3Lib.toString(faceLocation, 1, true);

                const grid = new FaceLocationGrid(faceLocation,event.blockFace,event.player,true)
                const grid3=grid.grid(3)
                const touched = grid.getEdgeName(3)

                chatLog.log(`
                    \n§aBeforePlayerInteractWithBlock Info§r
                    \nInteract Block: ${typeId} @ ${locationStr}
                    \nItemStack Block: ${itemStackBlock}
                    \nFace: ${event.blockFace} 
                    \nFace Location: ${faceLocationStr}
                    \nFace Grid3: ${Vector2Lib.toString(grid3,0,true)} = ${touched}                    
                `,devDebug.watchBlockSubscriptions);

                //Add Other stuff if needed
                return;
            };

            this.handler = world.beforeEvents.playerInteractWithBlock.subscribe(fn);
            this.on = true;
            alertLog.success(`§aSubscribed to ${this._subscription}`, debugMe);
        },
        unsubscribe () {
            alertLog.warn(`* ${this._name}.unsubscribe ()`);  //Should not happen 
            if (!this.on) return;

            if (this.handler) {
                world.beforeEvents.playerInteractWithBlock.unsubscribe(this.handler);
                this.handler = null;
                alertLog.success(`§aUnsubscribed to ${this._subscription}`);
            }
            this.on = false;
        }
    },    
    // beforePlayerPlace: {
    //     _name: 'beforeEvents.playerPlaceBlock',
    //     _subscription: 'world.beforeEvents.playerPlaceBlock',
    //     //============
    //     // To override ON
    //     debugMe: false,
    //     watchMe: false,
    //     //============
    //     on: false,
    //     /** @type {BeforePlayerPlaceBlockHandle | null} */
    //     handler: null,

    //     subscribe (debug = false, watch = false) {
    //         const debugMe = debug || this.debugMe;
    //         const watchMe = watch || this.watchMe;
    //         alertLog.log(`* ${this._name}.subscribe ()`, debugFunctionsOn);
    //         if (this.on) return;

    //         /** @type {BeforePlayerPlaceBlockHandler} */
    //         const fn = (event) => {

    //             const { block } = event;
    //             if (!block.isValid) return;
    //             const { typeId, location } = block;
    //             const itemStackBlock = event.permutationToPlace.type.id;
    //             if(!watchFor.blockList().includes(itemStackBlock)) return

    //             const faceLocation = event.faceLocation;

    //             const locationStr = Vector3Lib.toString(location, 1, true);
    //             const faceLocationStr = Vector3Lib.toString(faceLocation, 1, true);

    //             const grid = new FaceLocationGrid(faceLocation,event.face,true,event.player)
    //             const grid3=grid.grid(3)
    //             const touched = grid.getEdgeName(3)

    //             chatLog.log(`
    //                 \n§bBeforePlayerPlaceBlock Info§r
    //                 \nInteract Block: ${typeId} @ ${locationStr}
    //                 \nItemStack Block: ${itemStackBlock}
    //                 \nFace: ${event.face}
    //                 \nFace Location: ${faceLocationStr}
    //                 \nFace Grid3: ${Vector2Lib.toString(grid3,0,true)}= ${touched}               
    //             `);
    //         };

    //         this.handler = world.beforeEvents.playerPlaceBlock.subscribe(fn);
    //         this.on = true;
    //         alertLog.success(`§aSubscribed to ${this._name}`, debugMe);
    //     },
    //     unsubscribe () {
    //         alertLog.warn(`* ${this._name}.unsubscribe ()`);  //Should not happen 
    //         if (!this.on) return;

    //         if (this.handler) {
    //             world.beforeEvents.playerPlaceBlock.unsubscribe(this.handler);
    //             this.handler = null;
    //             alertLog.success(`§aUnsubscribed to ${this._subscription}`);
    //             this.on = false;
    //         }
    //     }
    // },
    allOff () {
        alertLog.log(`* const ${this._name}.allOff ()`, debugFunctionsOn);
        this.beforePlayerInteract.unsubscribe();
        //this.beforePlayerPlace.unsubscribe();
    },
    setup (debug = false, watch = false) {
        const debugMe = debug || this.debugMe;
        const watchMe = watch || this.watchMe;
        alertLog.log(`"* const ${this._name}.setup ()"`, debugFunctionsOn);
        this.beforePlayerInteract.subscribe(debugMe, watchMe || watchPlayerActions);
        //this.beforePlayerPlace.subscribe(debugMe, watchMe || watchPlayerActions);
    }
};
//==============================================================================
const systemSubscriptions = {
    _name: 'systemSubscriptions',
    //============
    // To override
    debugMe: false,
    watchMe: false,
    //============            
    beforeStartup: {
        _name: 'systemSubscriptions.beforeStartup',
        _subscription: 'system.beforeEvents.startup',
        //============
        // To override This
        debugMe: false,
        watchMe: false,
        //============
        on: false,
        /** @type {BeforeStartupHandle | null} */
        handler: null,

        subscribe (debug = false, watch = false) {
            const debugMe = debug || this.debugMe;
            const watchMe = watch || this.watchMe;
            alertLog.log(`* ${this._name}.subscribe ()`, debugFunctionsOn);
            if (this.on) return;

            /** @type {BeforeStartupHandler} */
            const fn = (event) => {
                //const ccr = event.customCommandRegistry;
                //registerCustomCommands(ccr);

                event.blockComponentRegistry.registerCustomComponent(
                    'dw623:on_place_arrow', {beforeOnPlayerPlace: e => { lightArrow_onPlace(e)}}                
                )

                event.blockComponentRegistry.registerCustomComponent(
                    'dw623:on_place_bar', {beforeOnPlayerPlace: e => { lightBar_onPlace(e)}}                
                )

                event.blockComponentRegistry.registerCustomComponent(
                    'dw623:on_place_mini_block', {beforeOnPlayerPlace: e => { lightMiniBlock_onPlace(e)}}                
                )
            };

            this.handler = system.beforeEvents.startup.subscribe(fn);
            this.on = true;
            alertLog.success(`§aSubscribed to ${this._subscription}`, debugMe);
        },
        unsubscribe () {
            alertLog.warn(`* ${this._name}.unsubscribe ()`);  //Should not happen 
            if (!this.on) return;

            if (this.handler) {
                system.beforeEvents.startup.unsubscribe(this.handler);
                this.handler = null;
                alertLog.success(`§aUnsubscribed to ${this._subscription}`);
            }
            this.on = false;
        }
    },
    allOff () {
        alertLog.log(`* const ${this._name}.allOff ()`, this.debugMe || debugFunctionsOn);
        //this.afterScriptEvent.unsubscribe();
        this.beforeStartup.unsubscribe();
    },
    setup (debug = false, watch = false) {
        const debugMe = debug || this.debugMe;
        const watchMe = watch || this.watchMe;
        alertLog.log(`"* const ${this._name}.setup ()"`, debugFunctionsOn);
        //this.afterScriptEvent.subscribe(debugMe, watchMe);
        this.beforeStartup.subscribe(debugMe, watchMe);
    }
};
//==============================================================================
export function subscriptionsStable () {
    const _name = 'function subscriptionsStable';
    alertLog.log(`§v* ${_name} ()`, debugFunctionsOn);

    systemSubscriptions.beforeStartup.subscribe()
    blockSubscriptions.setup(debugSubscriptionsOn && watchBlockSubscriptions, watchBlockSubscriptions);

    world.afterEvents.worldLoad.subscribe((event) => {
        pack.worldLoaded = true;

        alertLog.success(`Subscribed to world.afterEvents.worldLoad`, debugSubscriptionsOn);

        if (debugOn) {
        }
    });

    alertLog.log(`'§8x ${_name} ()'`, debugFunctionsOn);
}
//==============================================================================
// End of File
//==============================================================================