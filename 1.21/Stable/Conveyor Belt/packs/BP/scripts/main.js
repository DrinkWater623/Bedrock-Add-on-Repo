// @ts-check
/**
 * TODO: To Do List:
 * 
 *      1) which is better high friction or speed effect
 *      2) Can speed effect be less than one second... 
 *      3) will movement look smooth if TP'd
 *      4) what does knockback look like
 *      5) slowness if facing wrong direction, how much to apply and still allow movement
 * 
 */
//==============================================================================
import { world, Player, Block, Entity, system } from "@minecraft/server";
//import { MinecraftEffectTypes } from '@minecraft/vanilla-data';
import { DirectionInfo } from './direction_info.js';
const dirInfo = new DirectionInfo(4);
//==============================================================================
export const debug = false;
export const debugMsg = function (msg = "", preFormatting = "") { if (debug && msg) world.sendMessage(`${preFormatting}@${system.currentTick}: §cDebug Log:§r ${msg}`); };
const alert = "https://github.com/DrinkWater623";
//==============================================================================
function main () {

    //world.afterEvents.worldInitialize
    world.beforeEvents.worldInitialize.subscribe((event) => {

        //still blockTypeRegistry until released them blockComponentRegistry
        event.blockComponentRegistry.registerCustomComponent(
            "ubd:conveyor_belt_block_components",
            {
                onStepOn: e => {
                    if (debug) {
                        debugMsg(`*§a onStepOn: Activated`, "\n\n");
                        if (e.entity) conveyorEventTriggerInfo(e.entity, e.block);
                    }
                },
                onEntityFallOn: e => {
                    if (debug) {
                        debugMsg(`*§a onEntityFallOn: Activated`, "\n\n");
                        debugMsg(`===> onEntityFallOn: ${e.fallDistance}`);
                        if (debug) if (e.entity) conveyorEventTriggerInfo(e.entity, e.block);
                    }
                },
                onTick: e => {
                    const block = e.block;
                    //check ? for which way should be going
                    //for now, it is related to what way the player was facing when put down
                    const locationAbove = block.above(1)?.location;
                    if (locationAbove) {
                        const entitiesAbove = block.dimension.getEntitiesAtBlockLocation(locationAbove);
                        if (entitiesAbove.length) {
                            debugMsg(`===> Entity Above Count: ${entitiesAbove.length}`);
                        }
                    }
                }
                //if (e.player.isSneaking) opi.rotateClockwise(e);
                //else opi.rotateOnPlayerFacing(e);
            }
        );
        event.blockComponentRegistry.registerCustomComponent(
            "ubd:conveyor_belt_slab_components",
            {
                // onStepOn: e => {
                //     if (debug) {
                //         debugMsg(`*§a onStepOn: Activated`, "\n\n");
                //         if (e.entity) conveyorEventTriggerInfo(e.entity, e.block);
                //     }
                //     if (!(e.entity instanceof Entity)) return;
                //     const { block, entity } = e;

                //     const blockMovingDirection = block.permutation.getState("minecraft:cardinal_direction");
                //     const entityFacing = dirInfo.angleName_get(entity?.getRotation().y);
                //     if (entity.isSprinting && entityFacing == blockMovingDirection)
                //         entity.addEffect(MinecraftEffectTypes.Speed, 10, { amplifier: 10, showParticles: false });

                // },
                onTick: e => {
                    const entitiesOnBlock = e.block.dimension.getEntitiesAtBlockLocation(e.block.location);
                    if (entitiesOnBlock.length) {
                        if (e.block.permutation.getState("minecraft:cardinal_direction"))
                            entitiesOnBlock.forEach(entity => { conveyorImpulse(e.block, entity); });
                    }
                }
            });
    });
}
/**
* @param { string } direction
* @param { import("@minecraft/server").Entity } entity
* @param { number } ledge
*/
function isOnLedge (direction, entity, ledge) {
    //block.permutation.getState("minecraft:cardinal_direction"

    const location = entity.location;
    location.x = Math.abs(location.x);
    const xEdge = location.x - Math.floor(location.x);
    location.y = Math.abs(location.y);
    const zEdge = location.z - Math.floor(location.z);
    let edge = false;

    switch (direction) {
        case "north":
        case "south": edge = xEdge < ledge ? true : xEdge > (1 - ledge) ? true : false; break;
        case "west":
        case "east": edge = zEdge < ledge ? true : zEdge > (1 - ledge) ? true : false; break;
        default: break;
    }
    return edge;
}
/**
* @param { import("@minecraft/server").Entity } entity
* @param { import("@minecraft/server").Block } block
*/
function conveyorImpulse (block, entity) {
    const blockMovingDirection = block.permutation.getState("minecraft:cardinal_direction");
    if (!blockMovingDirection) return;

    debugMsg(`${entity.typeId} @ x: ${entity.location.x} y:${entity.location.y}  z:${entity.location.z}`);
    const moveToLocation = entity.location;

    //align center                                
    if (isOnLedge(blockMovingDirection.toString(), entity, 0.30)) {
        switch (blockMovingDirection) {
            case "north":
            case "south": moveToLocation.x = block.location.x + 0.5; break;
            case "west":
            case "east": moveToLocation.z = block.location.z + 0.5; break;
            default: break;
        }
        entity.teleport(moveToLocation);
    }

    //rest is impulse   
    moveToLocation.x = 0;
    moveToLocation.y = entity.typeId === "minecraft:item" ? -0.4 : 0;
    moveToLocation.z = 0;

    //move along in direction
    const distance = entity.typeId === "minecraft:player" ? 0.45 : 0.23;
    switch (blockMovingDirection) {
        case "north": moveToLocation.z = moveToLocation.z - distance; break;
        case "south": moveToLocation.z = moveToLocation.z + distance; break;
        case "west": moveToLocation.x = moveToLocation.x - distance; break;
        case "east": moveToLocation.x = moveToLocation.x + distance; break;
        default: break;
    }

    system.run(() => {
        if (entity instanceof Player) {
            // moveToLocation.x += entity.location.x
            // moveToLocation.y= entity.location.y
            // moveToLocation.z += entity.location.z
            // entity.teleport(moveToLocation,{checkForBlocks:true})
            entity.applyKnockback(moveToLocation.x, moveToLocation.z, 3, 0);
        }
        else
            entity.applyImpulse(moveToLocation);
    });
}
/**
* @param { import("@minecraft/server").Entity } entity
* @param { import("@minecraft/server").Block } block

*/
function conveyorTP (block, entity) {
    const blockMovingDirection = block.permutation.getState("minecraft:cardinal_direction");
    if (!blockMovingDirection) return;

    debugMsg(`${entity.typeId} @ x: ${entity.location.x} y:${entity.location.y}  z:${entity.location.z}`);
    const moveToLocation = entity.location;
    //align center                                
    switch (blockMovingDirection) {
        case "north":
        case "south": moveToLocation.x = block.location.x + 0.5; break;
        case "west":
        case "east": moveToLocation.z = block.location.z + 0.5; break;
        default: break;
    }
    debugMsg(`conveyor aligned @ x: ${moveToLocation.x} y:${moveToLocation.y}  z:${moveToLocation.z}`);
    //move along in direction
    const distance = 0.4;
    switch (blockMovingDirection) {
        case "north": moveToLocation.z = moveToLocation.z - distance; break;
        case "south": moveToLocation.z = moveToLocation.z + distance; break;
        case "west": moveToLocation.x = moveToLocation.x - distance; break;
        case "east": moveToLocation.x = moveToLocation.x + distance; break;
        default: break;
    }
    debugMsg(`move aligned @ x: ${moveToLocation.x} y:${moveToLocation.y}  z:${moveToLocation.z}`);

    entity.teleport(moveToLocation, { checkForBlocks: true });
}
/**
* @param { import("@minecraft/server").Entity } entity
* @param { import("@minecraft/server").Block } block
*/
function conveyorEventTriggerInfo (entity, block) {
    if (!block.isValid()) return;
    if (!entity.isValid()) return;

    const blockMovingDirection = block.permutation.getState("minecraft:cardinal_direction");
    const entityFacingObject = dirInfo.angleObject_get(entity.getRotation().y);
    const entityFacing = entityFacingObject.direction.toLowerCase();

    if (entity instanceof Player || entity.matches({ families: [ "mob" ] })) {

        debugMsg(`===> blockMovingDirection: ${blockMovingDirection}`);
        debugMsg(`===> nameTag: ${entity.nameTag} nameTag: ${entity.typeId}`);
        debugMsg(`===> entityFacing: ${entityFacing}`);

        if (entityFacingObject.opposite.toLowerCase() == blockMovingDirection) {
            debugMsg(`turn around bright eyes`);
        }
    }
    else {
        debugMsg(`===> typeId: ${entity.typeId}`);
    }

    //about the block's surroundings
    const entitiesIn = block.dimension.getEntitiesAtBlockLocation(block.location);
    debugMsg(`===> Entity In Count: ${entitiesIn.length}`);

    const locationAbove = block?.above(1)?.location;
    if (locationAbove) {
        const entitiesAbove = block.dimension.getEntitiesAtBlockLocation(locationAbove);
        debugMsg(`===> Entity Above Count: ${entitiesAbove.length}`);
    }

}
/**
* @param { import("@minecraft/server").Entity } entity
* @param { import("@minecraft/server").Block } block
*/
function conveyorMoveEntity (entity, block) {
    if (!block.isValid()) return;
    if (!entity.isValid()) return;
    //turn entity to face direction it is going
    //apply speed if entity facing the same way as conveyor is going
    //apply slowness if entity facing opposite

    //TODO what if typeId=item
    const blockMovingDirection = block.permutation.getState("minecraft:cardinal_direction");
    if (blockMovingDirection) return;
    const entityFacingObject = dirInfo.angleObject_get(entity.getRotation().y);
    const entityFacing = entityFacingObject.direction.toLowerCase();

    //is next space air or block with no collision (or gravity? too) ?  TP if clear....

    if (entity instanceof Player || entity.matches({ families: [ "mob" ] })) {

        if (entityFacingObject.opposite.toLowerCase() == blockMovingDirection) {
            debugMsg(`turn around bright eyes`);
            //@ts-ignore             
            entity.addEffect(MinecraftEffectTypes.Slowness, 10, { amplifier: 10, showParticles: false });
        }

        //TODO: if player and is sprinting... apply speed
    }

    const nextBlock = blockMovingDirection === 'north' ? block.north() : blockMovingDirection === 'west' ? block.west() : blockMovingDirection === 'south' ? block.south() : block.east();
    if (!(nextBlock instanceof Block)) return;
    //@ts-ignore
    const nextBlockOffset = {
        x: block.x - nextBlock.x,
        y: 1,
        z: block.z - nextBlock.z
    };

    //can entity be moved....

    const locationAbove = block?.above(1)?.location;
    if (locationAbove) {
        const entitiesAbove = block.dimension.getEntitiesAtBlockLocation(locationAbove);
        debugMsg(`===> Entity Above Count: ${entitiesAbove.length}`);
    }

}
//==============================================================================
main();
//==============================================================================