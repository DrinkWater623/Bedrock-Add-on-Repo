// chatCmds.js  Tree SPider
// @ts-check
//==============================================================================
// Minecraft
import { system, Player, Entity, world, TimeOfDay } from "@minecraft/server";
import { CustomCommandRegistry, CommandPermissionLevel, CustomCommandStatus, CustomCommandParamType, CustomCommandOrigin } from "@minecraft/server";
// Shared
import { Vector3Lib, VectorXZLib } from "./common-stable/tools/vectorClass.js";
// Local
import { alertLog, chatLog, gamePlay, pack, packDisplayName } from './settings.js';
import { devDebug } from "./helpers/fn-debug.js";
//==============================================================================
const debugFunctions = false;
const msgPfx = packDisplayName;
//==============================================================================
//Enum Names
const queryOnOff = `${pack.cmdNameSpace}:enum_query_on_off`;
//==============================================================================
const SUCCESS = { status: CustomCommandStatus.Success };
const FAILURE = { status: CustomCommandStatus.Failure };
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_about (registry) {
    const cmd = {
        name: `${pack.cmdNameSpace}:about_tree_spiders`,
        description: "Tree Spider Add-on Information",
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
function register_boosts_toggle (registry) {
    const cmd = {
        name: `${pack.cmdNameSpace}:boosts_toggle`,
        description: "Whether or not players can use boosts for fighting the wither",
        permissionLevel: CommandPermissionLevel.Admin,
        cheatsRequired: false,
        mandatoryParameters: [
            {
                name: queryOnOff,
                type: CustomCommandParamType.Enum,
            }
        ]
    };

    /** @type {(origin: CustomCommandOrigin, args: string) => import("@minecraft/server").CustomCommandResult} */
    const handler = (origin, arg) => {
        const player = origin.sourceEntity;
        if (player && player instanceof Player) {

            if (!arg) arg = 'query';
            const msgPfx = 'Wither fighting boosts are ';
            const query = () => { `${gamePlay.boostsAllowed ? '§aOn' : '§cOff'}`; };

            let msg = '';
            if (arg === 'query') {
                msg = `${msgPfx} ${query()}`;
            }
            else {
                const on = arg === 'on';
                if (gamePlay.boostsAllowed === on)
                    msg = `${msgPfx} already ${query()}`;
                else {
                    gamePlay.boostsAllowed= !on
                    msg = `${msgPfx} now ${query()}`;
                }                
            }
                
    
    player.sendMessage(`${msg}`);
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
function register_griefing_toggle (registry) {
    const cmd = {
        name: `${pack.cmdNameSpace}:griefing_toggle`,
        description: "Whether or not withers can grief",
        permissionLevel: CommandPermissionLevel.Admin,
        cheatsRequired: false,
        mandatoryParameters: [
            {
                name: queryOnOff,
                type: CustomCommandParamType.Enum,
            }
        ]
    };

    /** @type {(origin: CustomCommandOrigin, args: string) => import("@minecraft/server").CustomCommandResult} */
    const handler = (origin, arg) => {
        const player = origin.sourceEntity;
        if (player && player instanceof Player) {

            if (!arg) arg = 'query';
            const msgPfx = 'Mob griefing is ';
            const query = () => { `${world.gameRules.mobGriefing ? '§aOn' : '§cOff'}`; };

            let msg = '';
            if (arg === 'query') {
                msg = `${msgPfx} ${query()}`;
            }
            else {
                const on = arg === 'on';
                if (world.gameRules.mobGriefing === on)
                    msg = `${msgPfx} already ${query()}`;
                else {
                    //TODO: warn if wither is around
                    system.runTimeout(()=>{world.gameRules.mobGriefing = !on},1)
                    msg = `${msgPfx} now ${query()}`;
                }                
            }                
    
    player.sendMessage(`${msg}`);
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

    //Register Enums here
    registry.registerEnum(queryOnOff, [ "query", "on", "off" ]);

    //Commands
    register_about(registry);
    register_boosts_toggle(registry);
    register_griefing_toggle(registry);
    //TODO:
    /*
        Player turn on boosts for self to go fight wither - night vision, speed, health, slow falling / etc
            5 min at a time, and player redoes it when done, if still wither

        Teleport to a wither

        Admin - turn on and off scoreboard
        Admin - message interval
    */


}
//==============================================================================
// End of File