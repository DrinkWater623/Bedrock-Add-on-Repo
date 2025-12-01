// chatCmds.js
// @ts-check
//==============================================================================
// Minecraft
import { system, Player, world } from "@minecraft/server";
import { CustomCommandRegistry, CommandPermissionLevel, CustomCommandStatus, CustomCommandParamType, CustomCommandOrigin } from "@minecraft/server";
// Shared
import { Vector3Lib, VectorXZLib } from "./common-stable/vectorClass.js";
// Local
import { alertLog, chatLog, pack } from './settings.js';
import { showCoordsToggle, tagToggle } from "./helpers/functions.js";
//==============================================================================
const debugFunctions = false;
//==============================================================================
//Enum Names
const queryOnOff = `${pack.cmdNameSpace}:enum_query_on_off`;
const scoreboard_options = `${pack.cmdNameSpace}:scoreboard_options`;
//==============================================================================
const SUCCESS = { status: CustomCommandStatus.Success };
const FAILURE = { status: CustomCommandStatus.Failure };
//==============================================================================
function getWorldTime () {
    const daytime = world.getTimeOfDay() + 6000;
    const datetime = new Date(daytime * 3.6 * 1000);
    return { hours: datetime.getHours(), minutes: datetime.getMinutes() };
}
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_about (registry) {
    const cmd = {
        name: `${pack.cmdNameSpace}:about_actionbar_compass`,
        description: "Info/Help for DW623's Actionbar Compass add-on",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false

    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        if (origin.sourceEntity instanceof Player) {

            const about = "Tree Spiders are friendly forest spiders that wander around and make webs.";

            origin.sourceEntity.sendMessage(about);
        }

        const result = { status: CustomCommandStatus.Success };
        return result;
    });
}
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_admin_coord_toggle (registry) {
    const cmd = {
        name: `${pack.cmdNameSpace}:admin_coord_toggle`,
        description: "Admin: Toggle where or not coordinates show",
        permissionLevel: CommandPermissionLevel.Admin,
        cheatsRequired: false
    };

    /** @type {(origin: CustomCommandOrigin, args: number[]) => import("@minecraft/server").CustomCommandResult} */
    const handler = (origin, args) => {
        if (origin.sourceEntity instanceof Player) {
            showCoordsToggle();
        }
        const result = { status: CustomCommandStatus.Success };
        return result;
    };

    registry.registerCommand(cmd, handler);
}
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_compass_toggle (registry) {
    const cmd = {
        name: `${pack.cmdNameSpace}:compass_toggle`,
        description: "Toggle Compass Setting",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    };

    /** @type {(origin: CustomCommandOrigin, args: number[]) => import("@minecraft/server").CustomCommandResult} */
    const handler = (origin, args) => {
        if (origin.sourceEntity instanceof Player) {
            tagToggle(origin.sourceEntity, pack.tags.compassTag, "Compass");
        }
        const result = { status: CustomCommandStatus.Success };
        return result;
    };

    registry.registerCommand(cmd, handler);
}
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_getGeoInfo (registry) {
    const cmd = {
        name: `${pack.cmdNameSpace}:compass_geo`,
        description: "Show Current Location Information",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        if (origin.sourceEntity instanceof Player) {
            const player = origin.sourceEntity;

            system.runTimeout(() => {
                player.sendMessage(`§l§gWorld Time: ${getWorldTime().hours}:00`);
                const { dimension, location, name } = player;

                //TODO:
                //dimension
                //facing, looking at block, looking at entity

                const inBiome = dimension.getBiome(location);
                if (inBiome) player.sendMessage(`§aYou (${name}) are in a ${inBiome.id} biome`);

                const inBlock = dimension?.getBlock(location);
                if (inBlock) {
                    player.sendMessage(`§fSkylight level: ${inBlock.getSkyLightLevel()}`);
                    player.sendMessage(`§e Standing in ${inBlock.typeId}`);
                    const onBlock = inBlock.below();
                    if (onBlock) player.sendMessage(`§e          in ${onBlock.typeId}`);

                }
                //TODO:
                //top most block, if underground
                //add list of close by players
                //list of close monsters
            }, 1);            
        }

        const result = { status: CustomCommandStatus.Success };
        return result;
    });
}
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_velocity_toggle (registry) {

    const cmd = {
        name: `${pack.cmdNameSpace}:velocity_toggle`,
        description: "Toggle Velocity Setting",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    };

    /** @type {(origin: CustomCommandOrigin, args: number[]) => import("@minecraft/server").CustomCommandResult} */
    const handler = (origin, args) => {
        if (origin.sourceEntity instanceof Player) {
            tagToggle(origin.sourceEntity, pack.tags.velocityTag, "Velocity");
        }
        const result = { status: CustomCommandStatus.Success };
        return result;
    };

    registry.registerCommand(cmd, handler);
}
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_xyz_toggle (registry) {

    const cmd = {
        name: `${pack.cmdNameSpace}:xyz_toggle`,
        description: "Toggle XYZ Setting",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    };

    /** @type {(origin: CustomCommandOrigin, args: number[]) => import("@minecraft/server").CustomCommandResult} */
    const handler = (origin, args) => {
        if (origin.sourceEntity instanceof Player) {
            tagToggle(origin.sourceEntity, pack.tags.xyzTag, "XYZ-Geo");
        }
        const result = { status: CustomCommandStatus.Success };
        return result;
    };

    registry.registerCommand(cmd, handler);
}
//==============================================================================
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
export function registerCustomCommands (registry) {
    alertLog.log('§v* function registerCustomCommands ()', debugFunctions);

    register_about(registry);
    register_admin_coord_toggle(registry);
    register_compass_toggle(registry);
    register_xyz_toggle(registry);
    register_velocity_toggle(registry);
    register_getGeoInfo(registry);
}
//==============================================================================
// End of File