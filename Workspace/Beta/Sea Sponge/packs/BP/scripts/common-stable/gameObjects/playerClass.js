// playerClass.js
// @ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20250105b - add MainHandItemCount, mainHandRemoveSome
    20251203 - Relocated
    20251204 - Fixed RTP (dimension.id was minecraft:...)
========================================================================*/
import { Player, Block, EquipmentSlot, ItemStack, system, TicksPerSecond } from '@minecraft/server';
import { Vector3Lib, VectorXZLib } from "../tools/vectorClass.js";
//=============================================================================
export class PlayerLib {
    //=============================================================================
    /**
     * @param {Player} player 
     * @returns {boolean}
     */
    static isGameModeAdventure (player) {
        return player?.getGameMode().toLowerCase() === 'adventure' || false;
    };
    /**
     * @param {Player} player 
     * @returns {boolean}
     */
    static isGameModeCreative (player) {
        return player?.getGameMode().toLowerCase() === 'creative' || false;
    };
    /**
      * @param {Player} player 
      * @returns {boolean}
      */
    static isGameModeSpectator (player) {
        return player?.getGameMode().toLowerCase() === 'spectator' || false;
    };
    /**
      * @param {Player} player 
      * @returns {boolean}
      */
    static isGameModeSurvival (player) {
        return player?.getGameMode().toLowerCase() === 'survival' || false;
    };
    //=============================================================================
    //TODO: reverse Params on these 2.  Player should be first
    /**
     * 
     * @param {Block} block 
     * @param {Player} player 
     * @returns {boolean}
     */
    static isPlayerHoldingBlock (block, player) {
        return this.isPlayerHoldingTypeId(block.typeId, player);
    };
    /**
     * 
     * @param {string} typeId 
     * @param {Player} player 
     * @returns {boolean}
     */
    static isPlayerHoldingTypeId (typeId, player) {
        const holding = this.mainHandTypeId(player);
        return (holding ?? "") === typeId;
    };
    //================================================
    /**
     * 
     * @param {Player} player 
     * @returns {ItemStack | undefined}
     */
    static mainHandItemStack (player) {
        const equipment = player.getComponent('equippable');
        const selectedItem = equipment?.getEquipment(EquipmentSlot.Mainhand);
        return selectedItem;
    }
    //================================================
    /**
     * 
     * @param {Player} player 
     * @returns {string | undefined}
     */
    static mainHandTypeId (player) {
        return this.mainHandItemStack(player)?.typeId;
    }
    //TODO: add playerHas
    //================================================
    /**
     * 
     * @param {Player} player 
     * @param {boolean} [overrideCreativeMode=false] 
     * @returns {ItemStack | undefined}
     */
    static mainHandRemoveOne (player, overrideCreativeMode = false) {

        if (!overrideCreativeMode && player.getGameMode().startsWith('c'))
            return;

        const equipment = player.getComponent('equippable');
        if (!equipment)
            return;

        const selectedItem = equipment.getEquipment(EquipmentSlot.Mainhand);
        if (!selectedItem)
            return;

        const newItemStackCount = selectedItem.amount - 1;
        if (newItemStackCount >= 0) {
            system.run(() => {
                if (newItemStackCount == 0) {
                    equipment.setEquipment(EquipmentSlot.Mainhand, undefined);
                }
                else {
                    selectedItem.amount = newItemStackCount;
                }
            });
        }
    }
    //================================================
    /**
     * 
     * @param {Player} player
     * @param {*} removeCount  
     * @param {boolean} [overrideCreativeMode=false] 
     * @returns {ItemStack | undefined}
     */
    static mainHandRemoveSome (player, removeCount = 1, overrideCreativeMode = false) {

        if (!overrideCreativeMode && player.getGameMode().startsWith('c'))
            return;

        const equipment = player.getComponent('equippable');
        if (!equipment)
            return;

        const selectedItem = equipment.getEquipment(EquipmentSlot.Mainhand);
        if (!selectedItem)
            return;

        const newItemStackCount = selectedItem.amount - removeCount;
        if (newItemStackCount >= 0) {
            system.run(() => {
                if (newItemStackCount == 0) {
                    equipment.setEquipment(EquipmentSlot.Mainhand, undefined);
                }
                else {
                    selectedItem.amount = newItemStackCount;
                }
            });
        }
    }
    //==============================================================================
    /**
     * 
     * @param {Player} player 
     * @returns {number}
     */
    static mainHandItemCount (player) {
        const equipment = player.getComponent('equippable');
        if (!equipment)
            return 0;

        const selectedItem = equipment.getEquipment(EquipmentSlot.Mainhand);
        if (!selectedItem)
            return 0;

        return selectedItem.amount;
    }
    //======================
    /**
     * 
     * @param {Player} player 
     * @param {number} radius 
     */
    static randomTP (player, radius = 1000) {

        const { dimension, location } = player;
        if (dimension.id.toLowerCase() !== 'minecraft:overworld') return;

        const xz = VectorXZLib.randomXZ(radius, { center: location, minRadius: Math.floor(radius * .3), avoidZero: true });

        system.run(() => {
            player.teleport({ x: xz.x, y: 250, z: xz.z });
            if (PlayerLib.isGameModeCreative(player)) return;

            player.addEffect("minecraft:levitation", TicksPerSecond * 2, { amplifier: 100, showParticles: true });

            system.runTimeout(() => {
                player.addEffect("minecraft:slow_falling", TicksPerSecond * 5, { amplifier: 100, showParticles: false });
                system.runTimeout(() => {
                    player.addEffect("minecraft:instant_health", TicksPerSecond, { amplifier: 100, showParticles: false });
                    const topBlock = dimension.getTopmostBlock(player.location);
                    if (topBlock && topBlock.isValid) {
                        //TODO:  if lava ??? add water
                        const topBlockLocation = topBlock.location;
                        topBlockLocation.y++;
                        player.teleport(topBlockLocation);
                        
                    }
                    else {
                        player.addEffect("minecraft:slow_falling", TicksPerSecond * 10, { amplifier: 100, showParticles: false });
                        player.addEffect("minecraft:instant_health", TicksPerSecond * 10, { amplifier: 100, showParticles: false });
                    }
                }, TicksPerSecond * 5);
            }, TicksPerSecond * 2);

        });

    }
}