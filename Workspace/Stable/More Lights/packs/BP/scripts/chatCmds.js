// chatCmds.js  More Lights Minecraft Bedrock Add-on
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
    20251217 - Add all the commands
========================================================================*/
// Minecraft
import { Player } from "@minecraft/server";
import { CustomCommandRegistry, CommandPermissionLevel, CustomCommandStatus } from "@minecraft/server";
// Local
import { pack, packDisplayName } from './settings.js';
import { dev } from "./debug.js";
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_about (registry) {
    dev.alertFunction('register_about');
    const cmd = {
        name: `${pack.cmdNameSpace}:about_lights`,
        description: "Info/Help for DW623's Actionbar Compass add-on",
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
//=====================================================================================
//          LATER  all this will be moved to F3 addon where I can test this stuff
//=====================================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_toggle_arrow (registry) {
    dev.alertFunction('register_about');
    const cmd = {
        name: `${pack.cmdNameSpace}:toggle_arrow`,
        description: "Toggle on/off watching Arrow Events",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        dev.objectType_toggle('arrow', true);
        return { status: CustomCommandStatus.Success };
    });
}
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_toggle_bar (registry) {
    dev.alertFunction('register_about');
    const cmd = {
        name: `${pack.cmdNameSpace}:toggle_bar`,
        description: "Toggle on/off watching Light Bar Events",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        dev.objectType_toggle('bar', true);
        return { status: CustomCommandStatus.Success };
    });
}
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_toggle_mini_block (registry) {
    dev.alertFunction('register_toggle_miniBlock');
    const cmd = {
        name: `${pack.cmdNameSpace}:toggle_mini_block`,
        description: "Toggle on/off watching Mini Block Events",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        dev.objectType_toggle('miniBlock', true);
        return { status: CustomCommandStatus.Success };
    });
}
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_event_beforeItemUse (registry) {
    dev.alertFunction('register_event_beforeItemUse');
    const cmd = {
        name: `${pack.cmdNameSpace}:toggle_event_beforeItemUse`,
        description: "Toggle on/off watching Item Use Before-Events",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        dev.eventType_toggle('beforeItemUse', true);
        return { status: CustomCommandStatus.Success };
    });
}
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_event_afterItemCompleteUse (registry) {
    dev.alertFunction('register_event_afterItemCompleteUse');
    const cmd = {
        name: `${pack.cmdNameSpace}:toggle_event_afterItemCompleteUse`,
        description: "Toggle on/off watching Item-Complete-Use-On After-Events",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        dev.eventType_toggle('afterItemCompleteUse', true);
        return { status: CustomCommandStatus.Success };
    });
}
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_event_afterItemReleaseUse (registry) {
    dev.alertFunction('register_event_afterItemReleaseUse');
    const cmd = {
        name: `${pack.cmdNameSpace}:toggle_event_afterItemReleaseUse`,
        description: "Toggle on/off watching Item-Release-Use After-Events",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        dev.eventType_toggle('afterItemReleaseUseOn', true);
        return { status: CustomCommandStatus.Success };
    });
}
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_event_afterItemStartUseOn (registry) {
    dev.alertFunction('register_event_afterItemStartUseOn');
    const cmd = {
        name: `${pack.cmdNameSpace}:toggle_event_afterItemStartUseOn`,
        description: "Toggle on/off watching Item-Start-Use-On After-Events",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        dev.eventType_toggle('afterItemStartUseOn', true);
        return { status: CustomCommandStatus.Success };
    });
}
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_event_afterItemStartUse (registry) {
    dev.alertFunction('register_event_afterItemStartUse');
    const cmd = {
        name: `${pack.cmdNameSpace}:toggle_event_afterItemStartUse`,
        description: "Toggle on/off watching Item-Start-Use After-Events",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        dev.eventType_toggle('afterItemStartUseOn', true);
        return { status: CustomCommandStatus.Success };
    });
}
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_event_afterItemStopUseOn (registry) {
    dev.alertFunction('register_event_afterItemStopUseOn');
    const cmd = {
        name: `${pack.cmdNameSpace}:toggle_event_afterItemStopUseOn`,
        description: "Toggle on/off watching Item-Stop-Use-On After-Events",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        dev.eventType_toggle('afterItemStopUseOn', true);
        return { status: CustomCommandStatus.Success };
    });
}
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_event_afterItemStopUse (registry) {
    dev.alertFunction('register_event_afterItemStopUse');
    const cmd = {
        name: `${pack.cmdNameSpace}:toggle_event_afterItemStopUse`,
        description: "Toggle on/off watching Item-Stop-Use After-Events",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        dev.eventType_toggle('afterItemStopUseOn', true);
        return { status: CustomCommandStatus.Success };
    });
}
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_event_on_Place (registry) {
    dev.alertFunction('register_event_on_Place');
    const cmd = {
        name: `${pack.cmdNameSpace}:toggle_event_on_place`,
        description: "Toggle on/off watching On-Place Events",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        dev.eventType_toggle('onPlace', true);
        return { status: CustomCommandStatus.Success };
    });
}
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_event_beforePlayerInteractWithBlock (registry) {
    dev.alertFunction('register_event_beforePlayerInteractWithBlock');
    const cmd = {
        name: `${pack.cmdNameSpace}:toggle_event_before_player_interactWithBlock`,
        description: "Toggle on/off watching Player-Interact_with_Block Before-Events",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        dev.eventType_toggle('beforePlayerInteractWithBlock', true);
        return { status: CustomCommandStatus.Success };
    });
}
//==============================================================================
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
export function registerCustomCommands (registry) {
    dev.alertFunction('registerCustomCommands');
    register_about(registry);

    if (pack.debugOn) {
        register_event_afterItemCompleteUse(registry);
        register_event_afterItemReleaseUse(registry);
        register_event_afterItemStartUse(registry);
        register_event_afterItemStartUseOn(registry);
        register_event_afterItemStopUse(registry);
        register_event_afterItemStopUseOn(registry);
        register_event_beforeItemUse(registry);
        register_event_on_Place(registry);
        register_event_beforePlayerInteractWithBlock(registry);
        register_toggle_arrow(registry);
        register_toggle_bar(registry);
        register_toggle_mini_block(registry);

        /**
         * 
    beforePlayerInteractWithBlock: true,
         */
    }
}
//==============================================================================
// End of File