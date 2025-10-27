//@ts-check
import { Player, Entity, CustomCommandRegistry, CommandPermissionLevel, CustomCommandStatus } from "@minecraft/server";
import { pack } from './settings.js';
import { EntityLib } from "./common-stable/entityClass.js";
import * as debug from "./fn-debug.js";
//==============================================================================
/**
 * 
 * @param {CustomCommandRegistry} registry 
 */
function register_about (registry) {
    const cmd = {
        name: `${pack.commandNamespace}about`,
        description: "Tree Spider Information",
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
 * 
 * @param {CustomCommandRegistry} registry 
 */
function register_cls (registry) {
    const cmd = {
        name: `${pack.commandNamespace}cls`,
        description: "Clear Chat Window",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false

    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        if (origin.sourceEntity instanceof Player)
            origin.sourceEntity.sendMessage(`${'\n'.repeat(40)}`);

        const result = { status: CustomCommandStatus.Success };
        return result;
    });
}
//==============================================================================
/**
 * 
 * @param {CustomCommandRegistry} registry 
 */
function register_debugEntityActivity (registry) {
    const cmd = {
        name: `${pack.commandNamespace}debugEntityActivity`,
        description: "Toggle Entity Activity Messages",
        permissionLevel: CommandPermissionLevel.Owner,
        cheatsRequired: false

    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        if (origin.sourceEntity instanceof Player) {
            debug.dev.debugEntityActivity = !debug.dev.debugEntityActivity;
            const player = origin.sourceEntity;
            player.sendMessage(`debugEntityActivity is now ${debug.dev.debugEntityActivity ? '§aON' : '§cOFF'}`);
            if (!debug.dev.debugEntityActivity) debug.ifNoReasonForScoreBoardToShow();
        }
        const result = { status: CustomCommandStatus.Success };
        return result;
    });
}
//==============================================================================
/**
 * 
 * @param {CustomCommandRegistry} registry 
 */
function register_debugEntityAlert (registry) {
    const cmd = {
        name: `${pack.commandNamespace}debugEntityAlert`,
        description: "Toggle Entity Alert Messages",
        permissionLevel: CommandPermissionLevel.Owner,
        cheatsRequired: false

    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        if (origin.sourceEntity instanceof Player) {
            debug.dev.debugEntityAlert = !debug.dev.debugEntityAlert;
            const player = origin.sourceEntity;
            player.sendMessage(`debugEntityAlert is now ${debug.dev.debugEntityAlert ? '§aON' : '§cOFF'}`);
            if (!debug.dev.debugEntityAlert) debug.ifNoReasonForScoreBoardToShow();
        }
        const result = { status: CustomCommandStatus.Success };
        return result;
    });
}
//==============================================================================
/**
 * 
 * @param {CustomCommandRegistry} registry 
 */
function register_debugGamePlay (registry) {
    const cmd = {
        name: `${pack.commandNamespace}debugGamePlay`,
        description: "Toggle Gameplay Messages",
        permissionLevel: CommandPermissionLevel.Owner,
        cheatsRequired: false

    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        if (origin.sourceEntity instanceof Player) {
            debug.dev.debugGamePlay = !debug.dev.debugGamePlay;
            const player = origin.sourceEntity;
            player.sendMessage(`debugGamePlay is now ${debug.dev.debugGamePlay ? '§aON' : '§cOFF'}`);
            if (!debug.dev.debugGamePlay) debug.ifNoReasonForScoreBoardToShow();
        }
        const result = { status: CustomCommandStatus.Success };
        return result;
    });
}
//==============================================================================
/**
 * 
 * @param {Entity} entity 
 * @param {string} trigger 
 */
function eventTrigger (entity, trigger) {
    EntityLib.eventTrigger(entity, trigger);
}
//==============================================================================
/*
export interface CustomCommand {   
     * @remarks
     * Cheats must be enabled to run this command. Defaults to
     * true.
     *   
    cheatsRequired?: boolean;
    ----------------------------------------------------------   
     * @remarks
     * Command description as seen on the command line.
     *   
    description: string;
    ----------------------------------------------------------   
     * @remarks
     * List of mandatory command parameters.
     *   
    mandatoryParameters?: CustomCommandParameter[];
    ----------------------------------------------------------   
     * @remarks
     * The name of the command. A namespace is required.
     *   
    name: string;
    ----------------------------------------------------------
     * @remarks
     * List of optional command parameters.
     *   
    optionalParameters?: CustomCommandParameter[];
    ----------------------------------------------------------  
     * @remarks
     * The permission level required to execute the command.
     *   
    permissionLevel: CommandPermissionLevel;
} 
*/
//==============================================================================
/**
 * 
 * @param {CustomCommandRegistry} registry 
 */
export function registerCustomCommands (registry) {

    register_cls(registry);
    register_about(registry);

    if (debug.dev.debug) {
        //registry.registerEnum("debugMessageToggle", ["gameplay", "alert", "activity"]);
        register_debugEntityActivity(registry);
        register_debugEntityAlert(registry);
        register_debugGamePlay(registry);
    }

}
//==============================================================================
// End of File