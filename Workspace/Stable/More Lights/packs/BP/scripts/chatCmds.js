// chatCmds.js
// @ts-check
//==============================================================================
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
        dev.objectType_toggle('arrow',true);
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
        dev.objectType_toggle('bar',true);
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
        dev.objectType_toggle('miniBlock',true);
        return { status: CustomCommandStatus.Success };
    });
}
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_event_beforeItemUse (registry) {
    dev.alertFunction('register_about');
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
        dev.toggle_event('beforeItemUse',true)
        const toggle = !dev.debugEventsWatching.beforeItemUse;

        dev.debugEventsWatching.beforeItemUse = toggle;

        return { status: CustomCommandStatus.Success };
    });
}
//==============================================================================
//==============================================================================
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
export function registerCustomCommands (registry) {
    dev.alertFunction('registerCustomCommands');
    register_about(registry);

    if (pack.debugOn) {
        register_toggle_arrow(registry);
        register_toggle_bar(registry);
        register_toggle_mini_block(registry);
    }
}
//==============================================================================
// End of File