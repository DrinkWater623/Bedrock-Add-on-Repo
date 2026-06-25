// chatCmds.js Actionbar Compass
// @ts-check
//==============================================================================
// Minecraft
import { system, Player, world } from "@minecraft/server";
import { CustomCommandRegistry, CommandPermissionLevel, CustomCommandStatus, CustomCommandOrigin } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
// Shared
// Local
import { alertLog, pack, packDisplayName } from './settings.js';
import { showCoordsToggle, tagToggle } from "./helpers/functions.js";
import { Vector3Lib } from "./common-stable/tools/vectorClass.js";
import { rotationToCardinalDirection } from "./common-stable/tools/rotationLib.js";
import { getWorldTime, round } from "./common-stable/tools/mathLib.js";
//==============================================================================
const debugFunctions = false;
//==============================================================================

//==============================================================================
/**
 * Open a simple settings form that controls the 3 player-tag toggles:
 * - Compass
 * - XYZ
 * - Velocity
 *
 * @param {Player} player
 */
async function show_abc_settings_form (player) {

    const compassTag = pack.tags.compassTag;
    const xyzTag = pack.tags.xyzTag;
    const velocityTag = pack.tags.velocityTag;

    const before = {
        compass: player.hasTag(compassTag),
        xyz: player.hasTag(xyzTag),
        velocity: player.hasTag(velocityTag),
    };

    const form = new ModalFormData()
        .title(`${packDisplayName}: Settings`)
        .toggle("Compass", { defaultValue: before.compass, tooltip: 'NSEW Direction' })
        .toggle("XYZ Coords", { defaultValue: before.xyz, tooltip: 'Location Coordinates' })
        .toggle("Velocity", { defaultValue: before.velocity, tooltip: 'How fast you are going' });

    /** @type {import("@minecraft/server-ui").ModalFormResponse | null} */
    let res = null;

    try {
        if (player.isValid)
            //@ts-ignore
            res = await form.show(player);
    } catch {
        player.sendMessage(`${packDisplayName} §cSettings form failed to open.`);
        return;
    }

    if (!res || res.canceled || !res.formValues) return;

    const [ wantCompass, wantXyz, wantVelocity ] = res.formValues;
    if (
        typeof wantCompass !== "boolean" ||
        typeof wantXyz !== "boolean" ||
        typeof wantVelocity !== "boolean"
    ) return;

    // Only toggle if changed (keeps your existing tagToggle messaging behavior).
    if (wantCompass !== before.compass) tagToggle(player, compassTag, "Compass");
    if (wantXyz !== before.xyz) tagToggle(player, xyzTag, "XYZ-Geo");
    if (wantVelocity !== before.velocity) tagToggle(player, velocityTag, "Velocity");
}
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_about (registry) {
    const cmd = {
        name: `${pack.cmdNameSpace}:about_actionbar_compass`,
        description: `${packDisplayName} Add-on Information`,
        //description: "Info/Help for DW623's Actionbar Compass add-on",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false

    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        if (origin.sourceEntity instanceof Player) {

            origin.sourceEntity.sendMessage(`
\n${packDisplayName}:                
§r§a${pack.about}
§r§b${pack.devUrl}
§r§c${pack.reportBugs}
`);
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
        description: "Admin: Toggle whether or not paper doll coordinates show",
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
        name: `${pack.cmdNameSpace}:here`,
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
                const { dimension, location, name } = player;

                player.sendMessage(`\n\n§bYou:§r ${name}`);
                player.sendMessage(`§gWorld Time:§r ${getWorldTime().hours}:00`);
                player.sendMessage(`§dDimension:§r ${dimension.id}`);
                player.sendMessage(`§bLocation:§r ${Vector3Lib.toString(location, 1, true)}`);

                const inBiome = dimension.getBiome(location);
                if (inBiome) player.sendMessage(`§aBiome:§r ${inBiome.id}`);

                const facingRotation = rotationToCardinalDirection(player.getRotation().y);
                player.sendMessage(`§6Facing:§r ${facingRotation}`);

                const feetBlock = dimension?.getBlock(location)?.above();
                if (feetBlock) {
                    if (feetBlock.typeId == 'minecraft:air') {
                        player.sendMessage(`§eLight Level:§r ${feetBlock.getLightLevel()}) `);
                    }
                    else {
                        const aboveFeetBlock = feetBlock.above()
                        if (aboveFeetBlock && aboveFeetBlock.typeId == 'minecraft:air')
                            player.sendMessage(`§eLight Level:§r ${aboveFeetBlock.getLightLevel()}) `);
                        //player.sendMessage(`§eFeet Block:§r ${feetBlock.typeId} `);
                    }
                }

                //Maybe.... TODO:
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
 * New command: opens a form to set Compass / XYZ / Velocity in one place.
 *
 * @param {CustomCommandRegistry} registry
 */
function register_settings (registry) {
    const cmd = {
        name: `${pack.cmdNameSpace}:set`,
        description: "Open settings form (Compass / XYZ / Velocity)",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    };

    /** @type {(origin: CustomCommandOrigin, args: number[]) => import("@minecraft/server").CustomCommandResult} */
    const handler = (origin, args) => {
        if (origin.sourceEntity instanceof Player) {
            const player = origin.sourceEntity;
            // Next tick is a safe default for UI.
            system.runTimeout(() => {
                void show_abc_settings_form(player);
            }, 1);
        }
        return { status: CustomCommandStatus.Success };
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
    // register_compass_toggle(registry);
    register_getGeoInfo(registry);

    // NEW: /<namespace>:abc
    register_settings(registry);
}
//==============================================================================
// End of File
