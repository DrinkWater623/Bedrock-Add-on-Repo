// chatCmds.js
// @ts-check
//==============================================================================
// Minecraft
import { system, Player, world } from "@minecraft/server";
import { CustomCommandRegistry, CommandPermissionLevel, CustomCommandStatus, CustomCommandParamType, CustomCommandOrigin } from "@minecraft/server";
// Shared
// Local
import { alertLog, chatLog, pack, packDisplayName } from './settings.js';
//==============================================================================
const debugFunctions = false;
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_about (registry) {
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
//==============================================================================
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
export function registerCustomCommands (registry) {
    alertLog.log('§v* function registerCustomCommands ()', debugFunctions);
    register_about(registry);
}
//==============================================================================
// End of File