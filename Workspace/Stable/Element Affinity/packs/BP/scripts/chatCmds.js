// chatCmds.js  F3 Testing Minecraft Bedrock Add-on
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T. (https://www.gnu.org/licenses/gpl-3.0.html)
URL: https://github.com/DrinkWater623
========================================================================
TODO: 
confirm newBlock is one of these canPlaceInBlocks - may not be needed, just because of how placing works, like grass can be replaced
// ========================================================================
Change Log:
    20251219 - Created/Copied
========================================================================*/
// Minecraft
import { Player } from "@minecraft/server";
import { CustomCommandRegistry, CommandPermissionLevel, CustomCommandStatus } from "@minecraft/server";
// Shared
import { PlayerDebug } from "./common-stable/gameObjects/index.js";
// Local
import { pack, packDisplayName } from './settings.js';
import { dev } from "./debug.js";
import { shelter } from "./helpers/shelters.js";
//==============================================================================
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
//==============================================================================
const playerDebug = new PlayerDebug(dev);
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_about (registry) {
   // dev.alertFunctionKey('register_about');
    const cmd = {
        name: `${pack.cmdNameSpace}:about_f3`,
        description: `Info/Help for DW623's ${packDisplayName} add-on`,
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        if (origin.sourceEntity instanceof Player) {
            const msg = `\n${packDisplayName}:                
§r§a${pack.about}
§r§b${pack.devUrl}
§r§c${pack.reportBugs}
`;
            origin.sourceEntity.sendMessage(msg);
        }

        const result = { status: CustomCommandStatus.Success };
        return result;
    });
}

//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_event_player_info (registry) {
   // dev.alertFunctionKey('register_event_player_info');
    const cmd = {
        name: `${pack.cmdNameSpace}:show_player_info`,
        description: "Show Your Info",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        if (origin.sourceEntity instanceof Player) {
            playerDebug.playerInfo(origin.sourceEntity);
        }
        return { status: CustomCommandStatus.Success };
    });
}
//===============================
/* Testing for Elemental Addon */
//===============================
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_un_join (registry) {
   // dev.alertFunctionKey('register_un_join');
    const cmd = {
        name: `${pack.cmdNameSpace}:un_join`,
        description: "Un Join any Element",
        permissionLevel: CommandPermissionLevel.Admin,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        if (origin.sourceEntity instanceof Player) {
            origin.sourceEntity.setDynamicProperty('element', 'none');
        }
        return { status: CustomCommandStatus.Success };
    });
}
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_join_air (registry) {
   // dev.alertFunctionKey('register_join_air');
    const cmd = {
        name: `${pack.cmdNameSpace}:join_air`,
        description: "Join the Air Element",
        permissionLevel: CommandPermissionLevel.Admin,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        if (origin.sourceEntity instanceof Player) {
            origin.sourceEntity.setDynamicProperty('element', 'air');
        }
        return { status: CustomCommandStatus.Success };
    });
}
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_join_earth (registry) {
   // dev.alertFunctionKey('register_join_earth');
    const cmd = {
        name: `${pack.cmdNameSpace}:join_earth`,
        description: "Join the Earth Element",
        permissionLevel: CommandPermissionLevel.Admin,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        if (origin.sourceEntity instanceof Player) {
            origin.sourceEntity.setDynamicProperty('element', 'earth');
        }
        return { status: CustomCommandStatus.Success };
    });
}
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_join_fire (registry) {
   // dev.alertFunctionKey('register_join_fire');
    const cmd = {
        name: `${pack.cmdNameSpace}:join_fire`,
        description: "Join the Fire Element",
        permissionLevel: CommandPermissionLevel.Admin,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        if (origin.sourceEntity instanceof Player) {
            origin.sourceEntity.setDynamicProperty('element', 'fire');
        }
        return { status: CustomCommandStatus.Success };
    });
}
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_join_water (registry) {
   // dev.alertFunctionKey('register_join_water');
    const cmd = {
        name: `${pack.cmdNameSpace}:join_water`,
        description: "Join the Water Element",
        permissionLevel: CommandPermissionLevel.Admin,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        if (origin.sourceEntity instanceof Player) {
            origin.sourceEntity.setDynamicProperty('element', 'water');
        }
        return { status: CustomCommandStatus.Success };
    });
}
//==================================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_house (registry) {
    //// dev.alertFunctionKey('register_house');
    const cmd = {
        name: `${pack.cmdNameSpace}:house`,
        description: "Make a House",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        if (origin.sourceEntity instanceof Player) {
            const player = origin.sourceEntity;
            shelter(player, 'house');
        }
        return { status: CustomCommandStatus.Success };
    });
}
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_shack (registry) {
    //// dev.alertFunctionKey('register_shack');
    const cmd = {
        name: `${pack.cmdNameSpace}:shack`,
        description: "Make a Shack",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        if (origin.sourceEntity instanceof Player) {
            const player = origin.sourceEntity;
            shelter(player, 'shack');
        }
        return { status: CustomCommandStatus.Success };
    });
}
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_starter_house (registry) {
    //// dev.alertFunctionKey('register_starter_house');
    const cmd = {
        name: `${pack.cmdNameSpace}:starter_house`,
        description: "Make a Starter House",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        if (origin.sourceEntity instanceof Player) {
            const player = origin.sourceEntity;
            shelter(player, 'starter');
        }
        return { status: CustomCommandStatus.Success };
    });
}
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_building (registry) {
    //// dev.alertFunctionKey('register_building');
    const cmd = {
        name: `${pack.cmdNameSpace}:building`,
        description: "Make a Building",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        if (origin.sourceEntity instanceof Player) {
            const player = origin.sourceEntity;
            shelter(player, 'building');
        }
        return { status: CustomCommandStatus.Success };
    });
}
//==============================================================================
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
export function registerCustomCommands (registry) {
   // dev.alertFunctionKey('registerCustomCommands');

    register_about(registry);
    register_house(registry);
    register_shack(registry);
    register_building(registry);
    register_starter_house(registry);

    if (!pack.debugOn) return;

    register_join_air(registry);
    register_join_earth(registry);
    register_join_fire(registry);
    register_join_water(registry);
    register_un_join(registry);
    //register_event_player_info(registry);

   // dev.alertFunctionKey('registerCustomCommands', false);
}
//==============================================================================
// End of File