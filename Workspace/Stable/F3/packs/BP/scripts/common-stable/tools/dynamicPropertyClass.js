//@ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20251024 - Add get boolean value and propertyExists()
    20251207 - add inc/dec
    20251212 - added onPlayerInteractWithBlockBeforeEventInfo_set/get
    20251214 - added onPlayerInteractWithBlockBeforeEventInfo_show
========================================================================*/
import { Entity, Player, PlayerInteractWithBlockBeforeEvent, system, World, world } from "@minecraft/server";
import { Vector3Lib } from "./vectorClass";
//==============================================================================
/** @typedef {import("@minecraft/server").Vector2} Vector2 */
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** @typedef {import("@minecraft/server").VectorXZ} VectorXZ */
/** @typedef {Parameters<typeof world.beforeEvents.playerInteractWithBlock.subscribe>[0]} BeforePlayerInteractWithBlockHandler */
//==============================================================================
export class DynamicPropertyLib {

    //====================================== Query
    /**
    * 
    * @param {Entity | World} entity
    * @param {string} propertyName
    * @returns {boolean} 
    */
    static propertyExists (entity, propertyName) {
        if (entity instanceof World || entity.isValid) {
            const currentValue = entity.getDynamicProperty(propertyName);
            return (typeof currentValue !== 'undefined');
        }
        else return false;
    }

    //======================================  Numbers
    /**
     * 
     * @param {Entity | World} entity
     * @param {string} propertyName
     * @param {number} [qty=0] 
     */
    static add (entity, propertyName, qty = 0) {
        if (entity instanceof World || entity.isValid) {
            const currentQty = DynamicPropertyLib.getNumber(entity, propertyName);
            entity.setDynamicProperty(propertyName, currentQty + qty);
        }
    }
    /**
         * 
         * @param {Entity | World} entity
         * @param {string} propertyName
         */
    static decrement (entity, propertyName) {
        this.add(entity, propertyName, -1);
    }
    /**
         * 
         * @param {Entity | World} entity
         * @param {string} propertyName
         */
    static increment (entity, propertyName) {
        this.add(entity, propertyName, 1);
    }
    /**
     * 
     * @param {Entity[]} entities 
     * @param {string} propertyName
     * @returns {number} 
     */
    static sum (entities = [], propertyName) {
        if (!propertyName) return 0;

        let sum = 0;
        entities.filter(e => e.isValid).forEach(e => {
            if (e.isValid) sum += DynamicPropertyLib.getNumber(e, propertyName);
        });

        return sum;
    }

    /**
     * 
     * @param {Entity | World} entity
     * @param {string} propertyName
     * @returns {number} 
     */
    static getNumber (entity, propertyName) {
        if (entity instanceof World || entity.isValid) {
            const currentQty = entity.getDynamicProperty(propertyName);
            if (!currentQty || typeof currentQty != 'number') {
                entity.setDynamicProperty(propertyName, 0);
                return 0;
            }
            return currentQty;
        }
        else return 0;
    }

    //====================================== Vectors
    /**
     * 
     * @param {Entity} entity
     * @param {string} propertyName
     * @param {Vector3} location
     */
    static setVector (entity, propertyName, location) {
        if (entity.isValid) {
            entity.setDynamicProperty(propertyName, location);
        }
    }

    /**
     * 
     * @param {Entity} entity
     * @param {string} propertyName
     * @returns {Vector3 | undefined} 
     */
    static getVector (entity, propertyName) {
        if (entity.isValid) {
            const location = entity.getDynamicProperty(propertyName);
            if (!location || typeof location != 'object') return undefined;
            return location;
        }
        else return undefined;
        //{x:0,y:0,z:0}
    }

    //====================================== Strings
    /**
    * 
    * @param {Entity | World} entity
    * @param {string} propertyName
    * @returns {string} 
    */
    static getString (entity, propertyName) {
        if (entity instanceof World || entity.isValid) {
            const currentValue = entity.getDynamicProperty(propertyName);
            if (!currentValue || typeof currentValue != 'string') {
                entity.setDynamicProperty(propertyName, '');
                return '';
            }
            return currentValue;
        }
        else return '';
    }

    //====================================== Bools
    /**
    * 
    * @param {Entity | World} entity
    * @param {string} propertyName
    * @returns {boolean} 
    */
    static getBoolean (entity, propertyName) {
        if (entity instanceof World || entity.isValid) {
            const currentValue = entity.getDynamicProperty(propertyName);
            if (typeof currentValue != 'boolean') {
                entity.setDynamicProperty(propertyName, false);
                return false;
            }
            return currentValue;
        }
        else return false;
    }
    /**
    * 
    * @param {PlayerInteractWithBlockBeforeEvent} event 
    * @param {string[]} [blockFilters] 
    * @param {string[]} [itemStackFilters]
    * @param {boolean} [debug=false]
    * @returns 
    */
    static onPlayerInteractWithBlockBeforeEventInfo_set (event, blockFilters, itemStackFilters, debug = false) {
        if (!event.isFirstEvent) return;

        const player = event.player;
        if (!player || !player.isValid) return;

        const { block, itemStack } = event;

        // Filters
        if (itemStack && itemStackFilters && itemStackFilters.length > 0) {
            const typeId = itemStack.typeId;
            if (!typeId || !itemStackFilters.includes(typeId)) {
                player.setDynamicProperty('dw623:lastInteractWithBlockBeforeTick', 0);
                return;
            }
        }

        if (block && blockFilters && blockFilters.length > 0) {
            const typeId = block.typeId;
            if (!typeId || !blockFilters.includes(typeId)) {
                player.setDynamicProperty('dw623:lastInteractWithBlockBeforeTick', 0);
                return;
            }
        }

        //save this to player for the custom component to verify/use
        player.setDynamicProperty('dw623:lastInteractWithBlockBeforeTick', system.currentTick);
        player.setDynamicProperty('dw623:lastInteractWithBlockBeforeBlockTypeId', block.typeId);
        player.setDynamicProperty('dw623:lastInteractWithBlockBeforeBlockLocation', block.location);
        player.setDynamicProperty('dw623:lastInteractWithBlockBeforeBlockFace', event.blockFace);
        player.setDynamicProperty('dw623:lastInteractWithBlockBeforeFaceLocation', event.faceLocation);
        player.setDynamicProperty('dw623:lastInteractWithBlockBeforeItemStackTypeId', itemStack ? itemStack.typeId : '');

        if (debug)
            system.runTimeout(() => {
                this.onPlayerInteractWithBlockBeforeEventInfo_show(player);
            }, 1);
    }
    /**
     * 
     * @param {Player} player 
     * @param {boolean} [debug=false] 
     * @returns {{tick:number, blockTypeId:string, blockLocation:Vector3 | undefined, blockFace:string, faceLocation:Vector3 | undefined, itemTypeId:string}}
     * 
     */
    static onPlayerInteractWithBlockBeforeEventInfo_get (player, debug=false) {

        if (!player || !player.isValid)
            return { tick: 0, blockTypeId: '', blockLocation: undefined, blockFace: '', faceLocation: undefined, itemTypeId: '' };

        const returnObj = {
            tick: this.getNumber(player, 'dw623:lastInteractWithBlockBeforeTick'),
            blockTypeId: this.getString(player, 'dw623:lastInteractWithBlockBeforeBlockTypeId'),
            blockLocation: this.getVector(player, 'dw623:lastInteractWithBlockBeforeBlockLocation'),
            blockFace: this.getString(player, 'dw623:lastInteractWithBlockBeforeBlockFace'),
            faceLocation: this.getVector(player, 'dw623:lastInteractWithBlockBeforeFaceLocation'),
            itemTypeId: this.getString(player, 'dw623:lastInteractWithBlockBeforeItemStackTypeId')
        };
        if (debug) this.onPlayerInteractWithBlockBeforeEventInfo_show(player);
        return returnObj;
    }
    /**
     * 
     * @param {Player} player      
     */
    static onPlayerInteractWithBlockBeforeEventInfo_show (player) {

        if (!player || !player.isValid) return;

        const show = {
            tick: this.getNumber(player, 'dw623:lastInteractWithBlockBeforeTick'),
            blockTypeId: this.getString(player, 'dw623:lastInteractWithBlockBeforeBlockTypeId'),
            blockLocation: this.getVector(player, 'dw623:lastInteractWithBlockBeforeBlockLocation'),
            blockFace: this.getString(player, 'dw623:lastInteractWithBlockBeforeBlockFace'),
            faceLocation: this.getVector(player, 'dw623:lastInteractWithBlockBeforeFaceLocation'),
            itemTypeId: this.getString(player, 'dw623:lastInteractWithBlockBeforeItemStackTypeId')
        };

        const msg = `\n§6PlayerInteractWithBlockBeforeEvent Info:
§b Tick: §f${show.tick}
§b Block TypeId: §f${show.blockTypeId}
§b Block Location: §f${show.blockLocation ? `${Vector3Lib.toString(show.blockLocation, 0, true)}` : 'undefined'}
§b Block Face: §f${show.blockFace}
§b Face Location: §f${show.faceLocation ? `${Vector3Lib.toString(show.faceLocation, 0, true)}` : 'undefined'}
§b ItemStack TypeId: §f${show.itemTypeId}
`;
        console.warn(msg);
    }
}