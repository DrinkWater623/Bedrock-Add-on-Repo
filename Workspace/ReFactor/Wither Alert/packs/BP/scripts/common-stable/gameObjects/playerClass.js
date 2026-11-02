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
    20251221 - Added isPlayer and changed filename
    20251231 - Added PlayerDebug Class for playerInfo
========================================================================*/
import { Player, Block, EquipmentSlot, ItemStack, system, TicksPerSecond } from '@minecraft/server';
import { Vector3Lib, VectorXZLib } from "../tools/vectorClass.js";
import { Dev } from '../debug/devClass.js';
import { AngleMath } from '../tools/rotationLib.js';
import { round } from '../tools/mathLib.js';
//import { listObjectInnards } from '../tools/objects.js';
import { Blocks } from './blockLib.js';
//=============================================================================
export class Players {
    //=============================================================================
    /**
     * True only for a *real, currently-valid* Player reference (no ghosts).
     *
     * @param {any} value
     * @returns {boolean}
     */
    static isValid (value) {
        if (value == null) return false;

        const t = typeof value;
        if (t !== "object" && t !== "function") return false;

        try {
            /** @type {any} */
            const v = value;

            // Kill ghost refs first
            if (typeof v.isValid !== "boolean" || v.isValid !== true) return false;

            // Must be player
            if (v.typeId !== "minecraft:player") return false;

            // Sanity checks: avoid plain-object imposters
            if (typeof v.sendMessage !== "function") return false;
            if (typeof v.getComponent !== "function") return false;

            return true;
        } catch {
            return false;
        }
    }
    /**
    * True only for a *real, currently-valid* Player reference (no ghosts).
    *
    * @param {any} value
    * @returns {boolean}
    */
    static isInvalid (value) {
        return !this.isValid(value);
    }
    /**
     * Convenience: returns a valid Player or undefined (never throws).
     *
     * @param {any} value
     * @returns {import("@minecraft/server").Player | undefined}
     */
    static asValidPlayer (value) {
        return this.isValid(value) ? value : undefined;
    }
    /**
     * @param {Player} player 
     * @returns {boolean}
     */
    static isOp (player) {
        return player?.commandPermissionLevel > 1;
    };
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
            if (Players.isGameModeCreative(player)) return;

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
//Common Convenience
/**
* @param {any} input
* @returns {boolean}
*/
export function isPlayer (input) { return Players.isValid(input); }
/**
* @param {any} input
* @returns {boolean}
*/
export function isNotPlayer (input) { return !Players.isValid(input); }

//=============================================================================
export class PlayerDebug {
    /**
   * @param {Dev} dev
   */
    constructor(dev) {
        this.dev = dev;
    }

    /**
     * 
     * @param {Player} player
     * @param {string} title
     * @param {string} details 
     */
    playerInfo (player, title = `§ePlayer ${player.name}'s Info:`, details = '') {
        if (!this.dev.debugOn || !player || !player.isValid) return;

        const fTitle = (s = '') => { return `§6${s}§r`; };
        const field = (s = '') => { return `§b${s}§r`; };
        if (title) this.dev.alertLog(title, true);

        let msg = '';
        msg = `${fTitle('Player:')} ${player.name}`;

        //if (!details || details.includes('act'))
        msg += ` ${player.isSneaking ? ' Sneaking' :
            player.isSprinting ? ' Sprinting' :
                player.isFalling ? ' Falling' :
                    player.isClimbing ? ' Climbing' :
                        player.isSleeping ? ' Sleeping' :
                            player.isSwimming ? ' Swimming' :
                                player.isFlying ? ' Flying' :
                                    player.isEmoting ? ' Emoting' :
                                        player.isJumping ? ' Jumping' :
                                            player.getHeadLocation().y == player.location.y ? ' Crawling' : ''
            }`;
        msg += `\n§bGame Mode:§r ${player.getGameMode()}  |  §bPerm Lvl:§r ${player.playerPermissionLevel}  |  §bCmd Perm Lvl:§r ${player.commandPermissionLevel}`;

        // Rest is dependant upon asked for info, if not default all info
        if (!details || details.includes('geo')) {
            msg += `\n\n${field('Location (true):')} ${player.dimension.id} @ ${Vector3Lib.toString(player.location, 1, true)}`;
            msg +=   `\n${field('Location (ceiling):')} ${player.dimension.id} @ ${Vector3Lib.toString(Vector3Lib.ceiling(player.location), 0, true)}`;
            msg +=   `\n${field('Location (rounded):')} ${player.dimension.id} @ ${Vector3Lib.toString(Vector3Lib.round(player.location), 0, true)}`;
            msg +=   `\n${field('Location (floor):')} ${player.dimension.id} @ ${Vector3Lib.toString(Vector3Lib.floor(player.location), 0, true)}`;
        }
        const spawnPoint = player.getSpawnPoint();
        if (spawnPoint) msg += `\n${field('Spawn Point:')} ${spawnPoint.dimension.id} @ ${Vector3Lib.toString(Vector3Lib.new(spawnPoint.x, spawnPoint.y, spawnPoint.z))}`;
        console.warn(msg);
        msg = '';

        if (!details || details.includes('view')) {
            const rotation = player.getRotation();
            msg += `\n\n${fTitle('==* getRotation():')}`;
            msg += `\n==> §eHead Tilt §6x:§r ${round(rotation.x, 1)}`;
            const rot8 = AngleMath.intermediateDirection_get(rotation.y, false);
            const rot4 = AngleMath.cardinalDirection_get(rotation.y, false);
            msg += `\n==> §eBody Facing §ay:§r ${rot8} ${rot8 === rot4 ? '' : ' -> §eCardinal:§r ' + rot4}`;

            const entityView = player.getEntitiesFromViewDirection({ maxDistance: 32, ignoreBlockCollision: false });
            if (entityView.length) {
                msg += `\n\n${field('==* getEntitiesFromViewDirection(max=10,ignoreBlockCollision=false)):')} ${entityView.length}`;
                entityView.forEach(e => {
                    msg += `\n==> §eEntity:§r ${e.entity.typeId} ${e.entity.nameTag ? e.entity.nameTag : ''} §e@§r ${Vector3Lib.toString(e.entity.location)} §eDistance:§r ${e.distance}`;
                });
            }
            const blockViewVd = player.getBlockFromViewDirection({ maxDistance: 16, includeLiquidBlocks: true, includePassableBlocks: true });
            if (blockViewVd) {
                msg += `\n\n${fTitle('==* getBlockFromViewDirection(max=16)):')} `;
                msg += Blocks.blockInfo_show(blockViewVd.block, '',true);
                msg += `\n==> §bFace:§r ${blockViewVd.face}  |  §bFace Location:§r ${Vector3Lib.toString(blockViewVd.faceLocation, 1, true)}`;

                const pixel = Vector3Lib.truncate({ x: (blockViewVd.faceLocation.x * 15) + 1, y: (blockViewVd.faceLocation.y * 15) + 1, z: (blockViewVd.faceLocation.z * 15) + 1 });
                msg += `\n==> §eBlock Face Pixel:§r ${Vector3Lib.toString(pixel, 0, true, ',')}`;
            }
            const blockViewRay = player.dimension.getBlockFromRay(
                player.location,
                player.getViewDirection(),
                { maxDistance: 16, includeLiquidBlocks: true, includePassableBlocks: true });

            if (blockViewRay && (!blockViewVd || !Vector3Lib.isSameLocation(blockViewVd.block.location, blockViewRay.block.location))) {
                msg += `\n\n${fTitle('==* getBlockFromViewDirection(max=16)):')} `;
                msg += Blocks.blockInfo_show(blockViewRay.block, '',true);
                msg += `\n==> §bFace:§r ${blockViewRay.face}  |  §bFace Location:§r ${Vector3Lib.toString(blockViewRay.faceLocation, 1, true)}`;

                const pixel = Vector3Lib.truncate({ x: (blockViewRay.faceLocation.x * 15) + 1, y: (blockViewRay.faceLocation.y * 15) + 1, z: (blockViewRay.faceLocation.z * 15) + 1 });
                msg += `\n==> §bBlock Face Pixel:§r ${Vector3Lib.toString(pixel, 0, true, ',')}`;
            }
            console.warn(msg);
            msg = '';
        }

        if (!details || details.includes('tag')) {
            const tags = player.getTags();
            if (tags.length) {
                msg += `\n\n${fTitle('Player Tags:')} ${tags.length}`;
                tags.forEach(v => { msg += `\n==> §bTag:§r ${v}`; });
                console.warn(msg);
                msg = '';
            }
        }

        if (!details || details.includes('dyp')) {
            const dynamics = player.getDynamicPropertyIds();
            if (dynamics.length) {
                msg += `\n\n${fTitle('Player Dynamic Properties:')} ${dynamics.length}`;
                dynamics.forEach(v => {
                    const data = player.getDynamicProperty(v);
                    if (data)
                        msg += `\n==> §bKey:§r ${v}    |    §eData:§r ${typeof data == 'string' ? data : typeof data == 'object' ? JSON.stringify(data) : data.toString()}`;
                });
                console.warn(msg);
                msg = '';
            }
        }

        if (!details || details.includes('eff')) {
            const effects = player.getEffects();
            if (effects.length) {
                msg += `\n${fTitle('Effects on Player:')} ${effects.length}`;
                effects.forEach(v => { msg += `\n==> §eEffect:§r ${v}`; });
                console.warn(msg);
                msg = '';
            }
        }

        this.dev.alertLog('-------- End of Report --------', true);
    }
}