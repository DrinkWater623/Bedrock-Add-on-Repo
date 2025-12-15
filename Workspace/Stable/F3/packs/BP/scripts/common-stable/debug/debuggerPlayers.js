// debuggerPlayers.js
// @ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20250116 - Add Block from Ray Cast if different from View
    20251203 - Relocated
    20251207 - Relocated and renamed
    20251210 - Remove un-needed stuff
    20251213 - Added Events for Player debugging
    20251213b- Convert to console messages only
    20251214 - Better AllOff and AnyOns
========================================================================*/
import { Player } from '@minecraft/server';
// shared
import { Vector3Lib } from '../tools/vectorClass.js';
import { round } from '../tools/mathLib.js';
import { Debugger } from './debuggerClass.js';
//==============================================================================
/** @typedef {import("@minecraft/server").Vector2} Vector2 */
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** @typedef {import("@minecraft/server").VectorXZ} VectorXZ */
//=============================================================================
/*
world.afterEvents.playerEmote.subscribe((ev) => { });
world.afterEvents.playerHotbarSelectedSlotChange.subscribe((ev) => { });
world.afterEvents.playerInputModeChange.subscribe((ev) => { });
world.afterEvents.playerInputPermissionCategoryChange.subscribe((ev) => { });
world.afterEvents.playerInventoryItemChange.subscribe((ev) => { });
world.afterEvents.playerJoin.subscribe((ev) => { });
world.afterEvents.playerSpawn.subscribe((ev) => { });
world.afterEvents.playerSwingStart.subscribe((ev) => { });

world.afterEvents.playerBreakBlock.subscribe((ev) => { });
world.beforeEvents.playerBreakBlock.subscribe((ev) => { });

world.afterEvents.playerGameModeChange.subscribe((ev) => { });
world.beforeEvents.playerGameModeChange.subscribe((ev) => { });

world.afterEvents.playerInteractWithBlock.subscribe((ev) => { });
world.beforeEvents.playerInteractWithBlock.subscribe((ev) => { });

world.afterEvents.playerInteractWithEntity.subscribe((ev) => { });
world.beforeEvents.playerInteractWithEntity.subscribe((ev) => { });

world.afterEvents.playerLeave.subscribe((ev) => { });
world.beforeEvents.playerLeave.subscribe((ev) => { });

world.afterEvents.playerPlaceBlock.subscribe((ev) => { });
world.beforeEvents.playerPlaceBlock.subscribe((ev) => { });
//Player as Entity
world.afterEvents.entityDie.subscribe((ev) => { });
world.afterEvents.entityHealthChanged.subscribe((ev) => { });
world.afterEvents.entityHitBlock.subscribe((ev) => { });
world.afterEvents.entityHitEntity.subscribe((ev) => { });
world.afterEvents.entityHurt.subscribe((ev) => { });
*/
//=============================================================================
// For Debugging
/**
 * Creates a new Debug object
 * @class
 */
export class DebuggerPlayers extends Debugger {
    /**
      * @constructor
      * @param {string} pack_name 
      * @param {boolean} [on=false] - default false
      */
    constructor(pack_name, on = false) {
        super(pack_name, on);

        Object.assign(this.events, {
            afterEntityDie: false,
            afterEntityHealthChanged: false,
            afterEntityHitBlock: false,
            afterEntityHitEntity: false,
            afterEntityHurt: false,
            afterPlayerEmote: false,
            afterPlayerHotbarSelectedSlotChange: false,
            afterPlayerInputModeChange: false,
            afterPlayerInputPermissionCategoryChange: false,
            afterPlayerInventoryItemChange: false,
            afterPlayerJoin: false,
            afterPlayerSpawn: false,
            afterPlayerSwingStart: false,
            afterPlayerUseNameTag: false,
            playerBreakBlock: { before: false, after: false },
            playerGameModeChange: { before: false, after: false },
            playerInteractWithBlock: { before: false, after: false },
            playerInteractWithEntity: { before: false, after: false },
            playerLeave: { before: false, after: false },
            playerPlaceBlock: { before: false, after: false },
        });
        Object.assign(this.customComponents, {
            none: false
        });
    };    
    //--------------------------------------------------------------------------
    /**
     * 
     * @param {Player} player
     * @param {string} title
     * @param {boolean} override
     * @param {string} details 
     */
    playerInfo (player, title = "§ePlayer Info:", override = false, details = '') {
        if (!(override || this.debugOn)) return;
        if (!player.isValid) return;

        const fTitle = (s = '') => { return `§b${s}§r`; };
        if (title) this.log(title, true);

        let msg = '';
        msg = `${fTitle('Player:')} ${player.name} (${player.getGameMode()})`;

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

        // Rest is dependant upon asked for info, if not default all info
        if (!details || details.includes('geo')) {
            msg += `\n\n${fTitle('Location (true):')} ${player.dimension.id} @ ${Vector3Lib.toString(player.location, 1, true)}`;
            msg += `\n${fTitle('Location (ceiling):')} ${player.dimension.id} @ ${Vector3Lib.toString(Vector3Lib.ceiling(player.location), 0, true)}`;
            msg += `\n${fTitle('Location (rounded):')} ${player.dimension.id} @ ${Vector3Lib.toString(Vector3Lib.round(player.location), 0, true)}`;
            msg += `\n${fTitle('Location (floor):')} ${player.dimension.id} @ ${Vector3Lib.toString(Vector3Lib.floor(player.location), 0, true)}`;
            const spawnPoint = player.getSpawnPoint();
            if (spawnPoint) msg += `\n${fTitle('Spawns:')} ${spawnPoint.dimension.id} @ ${Vector3Lib.toString(Vector3Lib.new(spawnPoint.x, spawnPoint.y, spawnPoint.z))}`;
        }

        if (!details || details.includes('view')) {
            const rotation = player.getRotation();
            msg += `\n\n${fTitle('==* getRotation():')}`;
            msg += `\n==> §eHead Tilt §6x:§r ${round(rotation.x, 1)}`;
            const rot8 = y_rotationName(rotation.y, false);
            const rot4 = y_rotationName(rotation.y, true);
            msg += `\n==> §eBody Facing §ay:§r ${rot8} ${rot8 === rot4 ? '' : ' -> §eCardinal:§r ' + rot4}`;

            const entityView = player.getEntitiesFromViewDirection({ maxDistance: 32, ignoreBlockCollision: false });
            if (entityView.length) {
                msg += `\n\n${fTitle('==* getEntitiesFromViewDirection(max=10,ignoreBlockCollision=false)):')} ${entityView.length}`;
                entityView.forEach(e => {
                    msg += `\n==> §eEntity:§r ${e.entity.typeId} ${e.entity.nameTag ? e.entity.nameTag : ''} §e@§r ${Vector3Lib.toString(e.entity.location)} §eDistance:§r ${e.distance}`;
                });
            }
            const blockViewVd = player.getBlockFromViewDirection({ maxDistance: 16, includeLiquidBlocks: true, includePassableBlocks: true });
            if (blockViewVd) {
                msg += `\n\n${fTitle('==* getBlockFromViewDirection(max=16)):')} `;
                this.listObjectInnards(blockViewVd.block);
                //msg += `\n==> §eBlock:§r ${blockViewVd.block.typeId}`;
                //msg += `\n==> §eBlock Location:§r ${Vector3Lib.toString(blockViewVd.block.location,0,true,',')}`;
                msg += `\n==> §eBlock Face:§r ${blockViewVd.face}`;
                msg += `\n==> §eBlock Face Location:§r ${Vector3Lib.toString(blockViewVd.faceLocation, 1, true, ',')}`;

                const pixel = Vector3Lib.truncate({ x: (blockViewVd.faceLocation.x * 15) + 1, y: (blockViewVd.faceLocation.y * 15) + 1, z: (blockViewVd.faceLocation.z * 15) + 1 });
                msg += `\n==> §eBlock Face Pixel:§r ${Vector3Lib.toString(pixel, 0, true, ',')}`;
            }
            const blockViewRay = player.dimension.getBlockFromRay(
                player.location,
                player.getViewDirection(),
                { maxDistance: 16, includeLiquidBlocks: true, includePassableBlocks: true });


            if (blockViewRay && (!blockViewVd || !Vector3Lib.isSameLocation(blockViewVd.block.location, blockViewRay.block.location))) {
                msg += `\n\n${fTitle('==* getBlockFromViewDirection(max=16)):')} `;
                this.listObjectInnards(blockViewRay.block);
                //msg += `\n==> §eBlock:§r ${blockViewVd.block.typeId}`;
                //msg += `\n==> §eBlock Location:§r ${Vector3Lib.toString(blockViewVd.block.location,0,true,',')}`;
                msg += `\n==> §eBlock Face:§r ${blockViewRay.face}`;
                msg += `\n==> §eBlock Face Location:§r ${Vector3Lib.toString(blockViewRay.faceLocation, 1, true, ',')}`;

                const pixel = Vector3Lib.truncate({ x: (blockViewRay.faceLocation.x * 15) + 1, y: (blockViewRay.faceLocation.y * 15) + 1, z: (blockViewRay.faceLocation.z * 15) + 1 });
                msg += `\n==> §eBlock Face Pixel:§r ${Vector3Lib.toString(pixel, 0, true, ',')}`;
            }
        }

        if (!details || details.includes('tag')) {
            const tags = player.getTags();
            if (tags.length) {
                msg += `\n\n${fTitle('Tags:')} ${tags.length}`;
                tags.forEach(v => { msg += `\n==> §etag:§r ${v}`; });
            }
        }

        if (!details || details.includes('dyp')) {
            const dynamics = player.getDynamicPropertyIds();
            if (dynamics.length) {
                msg += `\n\n${fTitle('Dynamic Properties:')} ${dynamics.length}`;
                dynamics.forEach(v => {
                    const data = player.getDynamicProperty(v);
                    if (data)
                        msg += `\n==> §eKey:§r ${v} §eData:§r ${typeof data == 'string' ? v : typeof data == 'object' ? JSON.stringify(data) : data.toString()}`;
                });
            }
        }

        if (!details || details.includes('eff')) {
            const effects = player.getEffects();
            if (effects.length) {
                msg += `\n${fTitle('Effects:')} ${effects.length}`;
                effects.forEach(v => { msg += `\n==> §eEffect:§r ${v}`; });
            }
        }

        this.log(msg, true);

    }
}
/**
 * 
 * @param {number} angle angle in degrees
 * @param {boolean} cardinal NSEW only : default true
 * @returns {string} direction words
 */
function y_rotationName (angle = 0, cardinal = true) {
    const dirs = [ "S", "S W", "W", "N W", "N", "N E", "E", "S E", "S" ];
    const divisor = cardinal ? 4 : 8;
    let dir = Math.round(angle / (360 / divisor));
    if (dir < 0) dir += divisor;
    const text = dirs[ dir ]
        .replace("N", "north")
        .replace("S", "south")
        .replace("E", "east")
        .replace("W", "west")
        .replace(" ", "-");
    return text;
}