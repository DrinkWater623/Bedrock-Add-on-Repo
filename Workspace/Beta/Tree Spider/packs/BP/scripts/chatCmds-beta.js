//@ts-check
import { Player, CustomCommandRegistry, CommandPermissionLevel, CustomCommandStatus } from "@minecraft/server";
import { pack } from './settings.js';
import { BiomeLib } from "./common-beta/biomeLib.js";
import * as debug from "./fn-debug.js";
//==============================================================================
/**
 * 
 * @param {CustomCommandRegistry} registry 
 */
function register_biomes (registry) {
    /**
     * @type import("@minecraft/server").CustomCommand
     */
    const cmd = {
        name: `${pack.commandNamespace}biomes`,
        description: "List of Biomes",
        permissionLevel: CommandPermissionLevel.Owner,
        cheatsRequired: false,
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        if (origin.sourceEntity instanceof Player) {
            const player = origin.sourceEntity;
            const biomes = BiomeLib.getCurrentBiomeList(player);
            if (biomes)
                player.sendMessage(`Biomes: ${biomes.replaceAll(',', ', ')}`);
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
export function registerCustomCommandsBeta (registry) {

    if (debug.dev.debug) {
        //registry.registerEnum("debugMessageToggle", ["gameplay", "alert", "activity"]);
        register_biomes(registry);
    }

}
//==============================================================================
// End of File