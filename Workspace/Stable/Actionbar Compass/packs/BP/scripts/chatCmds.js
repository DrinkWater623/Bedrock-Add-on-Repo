// chatCmds.js
// @ts-check
import { system, Player, Entity, CustomCommandRegistry, CommandPermissionLevel, CustomCommandStatus, CustomCommandParamType, CustomCommandOrigin } from "@minecraft/server";
import { alertLog, pack } from './settings.js';
import * as debug from "./fn-debug.js";
//==============================================================================
const debugFunctions = false;
//==============================================================================
//Enum Names
const queryOnOff = `${pack.fullNameSpace}:enum_query_on_off`;
const scoreboard_options = `${pack.fullNameSpace}:scoreboard_options`;
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_about (registry) {
    const cmd = {
        name: `${pack.fullNameSpace}:about`,
        description: "Compass Information",
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
function register_cls (registry) {
    const cmd = {
        name: `${pack.fullNameSpace}:cls`,
        description: "Clear Chat Window",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false,
        optionalParameters: [
            {
                name: 'LineCount',
                type: CustomCommandParamType.Integer
            }
        ]

    };

    /** @type {(origin: CustomCommandOrigin, args: number[]) => import("@minecraft/server").CustomCommandResult} */
    const handler = (origin, args) => {
        if (origin.sourceEntity instanceof Player) {
            let LineCount = args[ 0 ];
            if (!LineCount) LineCount = 40;
            if (LineCount > 80) LineCount = 80;
            origin.sourceEntity.sendMessage(`${'\n'.repeat(LineCount)}`);
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
function register_debugEntity (registry) {
    alertLog.log('§v* function register_debugEntity ()', debugFunctions);

    const cmd = {
        name: `${pack.fullNameSpace}:debug_entity`,
        description: "Turn on/off/query Entity Activity/Alert/Load Messages and Scoreboards Debugging",
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
        if (origin.sourceEntity instanceof Player) {

            if (!arg) arg = 'query';

            let msg = '';
            if (arg == 'on') {
                if (!(debug.dev.debug && debug.dev.debugEntityActivity && debug.dev.debugEntityAlert && debug.dev.debugLoadAndSpawn)) {
                    debug.dev.debug = true;
                    debug.dev.debugEntityActivity = true;
                    debug.dev.debugEntityAlert = true;
                    debug.dev.debugLoadAndSpawn = true;

                    msg = `debugEntity (Activity/Alert/Load/Spawn) is now §aON`;
                    debug.debugVarChange();
                }
                else
                    msg = `debugEntity is already on §aON`;
            }
            else if (arg == 'off') {
                if ((debug.dev.debugEntityActivity || debug.dev.debugEntityAlert || debug.dev.debugLoadAndSpawn)) {
                    debug.dev.debugEntityActivity = false;
                    debug.dev.debugEntityAlert = false;
                    debug.dev.debugLoadAndSpawn = false;
                    debug.dev.anyOn();

                    msg = `debugEntity (Activity/Alert/Load/Spawn) is now §cOFF`;
                    debug.debugVarChange();
                }
                else
                    msg = `debugEntity is already §cOFF`;
            }
            else
            //Query 
            {
                if (debug.dev.debug)
                    msg = `debugEntity:\nActivity${debug.dev.debugEntityActivity ? '§aON' : '§cOFF'}\nAlert:${debug.dev.debugEntityAlert ? '§aON' : '§cOFF'}\nLoad/Spawn:${debug.dev.debugLoadAndSpawn ? '§aON' : '§cOFF'}`;
                else
                    msg = `debugging is §cOFF`;
            }
            const player = origin.sourceEntity;
            player.sendMessage(`${debug.dev.debugScoreboardBaseDisplay} ${msg}`);
        }
        const result = { status: CustomCommandStatus.Success };
        return result;
    };

    registry.registerCommand(cmd, handler);
}
//==============================================================================
/**
 * 
 * @param {CustomCommandRegistry} registry 
 */
function register_debugEntityActivity (registry) {
    alertLog.log('§v* function register_debugEntityActivity ()', debugFunctions);

    const cmd = {
        name: `${pack.fullNameSpace}:debug_activity`,
        description: "Turn on/off/query Entity Activity Debugging",
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
        if (origin.sourceEntity instanceof Player) {

            if (!arg) arg = 'query';

            let msg = '';
            if (arg == 'on') {
                if (!(debug.dev.debug && debug.dev.debugEntityActivity)) {
                    debug.dev.debug = true;
                    debug.dev.debugEntityActivity = true;
                    msg = `debugEntityActivity is now §aON`;
                    debug.debugVarChange();
                }
                else
                    msg = `debugEntityActivity is already §aON`;
            }
            else if (arg == 'off') {
                if (debug.dev.debugEntityActivity) {
                    debug.dev.debugEntityActivity = false;
                    msg = `debugEntityActivity is now §cOFF`;
                    debug.debugVarChange();
                }
                else
                    msg = `debugEntityActivity is already §cOFF`;
            }
            else
            //Query 
            {
                if (debug.dev.debug)
                    msg = `debugEntityActivity is ${debug.dev.debugEntityActivity ? '§aON' : '§cOFF'}`;
                else
                    msg = `debugging is §cOFF`;
            }
            const player = origin.sourceEntity;
            player.sendMessage(`${debug.dev.debugScoreboardBaseDisplay} ${msg}`);
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
function register_debugEntityAlert (registry) {
    alertLog.log('§v* function register_debugEntityAlert ()', debugFunctions);

    const cmd = {
        name: `${pack.fullNameSpace}:debug_alerts`,
        description: "Turn on/off/query Entity Alert Debugging",
        permissionLevel: CommandPermissionLevel.Admin,
        cheatsRequired: false,
        mandatoryParameters: [
            {
                name: queryOnOff,
                type: CustomCommandParamType.Enum,
            }
        ]
    };

    /** @type {(origin: CustomCommandOrigin, arg: string) => import("@minecraft/server").CustomCommandResult} */
    const handler = (origin, arg) => {
        if (origin.sourceEntity instanceof Player) {
            if (!arg) arg = 'query';
            let msg = '';
            if (arg == 'on') {
                if (!(debug.dev.debug && debug.dev.debugEntityAlert)) {
                    debug.dev.debug = true;
                    debug.dev.debugEntityAlert = true;
                    msg = `debugEntityAlert is now §aON`;
                    debug.debugVarChange();
                }
                else
                    msg = `debugEntityAlert is already §aON`;
            }
            else if (arg == 'off') {
                if (debug.dev.debugEntityAlert) {
                    debug.dev.debugEntityAlert = false;
                    msg = `debugEntityAlert is now §cOFF`;
                    debug.debugVarChange();
                }
                else
                    msg = `debugEntityAlert is already §cOFF`;
            }
            else
            //Query 
            {
                if (debug.dev.debug)
                    msg = `debugEntityAlert is ${debug.dev.debugEntityAlert ? '§aON' : '§cOFF'}`;
                else
                    msg = `debugging is §cOFF`;
            }
            const player = origin.sourceEntity;
            player.sendMessage(`${debug.dev.debugScoreboardBaseDisplay} ${msg}`);
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
function register_debug (registry) {
    alertLog.log('§v* function register_debug ()', debugFunctions);

    const cmd = {
        name: `${pack.fullNameSpace}:debug`,
        description: "Turn on/off/query Debugging",
        permissionLevel: CommandPermissionLevel.Admin,
        cheatsRequired: false,
        mandatoryParameters: [
            {
                name: queryOnOff,
                type: CustomCommandParamType.Enum,
            }
        ]
    };

    /** @type {(origin: CustomCommandOrigin, arg: string) => import("@minecraft/server").CustomCommandResult} */
    const handler = (origin, arg) => {
        if (origin.sourceEntity instanceof Player) {
            if (!arg) arg = 'query';

            let msg = '';
            if (arg == 'on') {
                if (!(debug.dev.debug)) {
                    debug.dev.debug = true;

                    //TODO: since was off, turn on basic alerts too

                    msg = `debugging is now §aON`;
                    debug.debugVarChange();
                }
                else
                    msg = `debugging is already §aON`;
            }
            else if (arg == 'off') {
                if (debug.dev.debug) {
                    debug.dev.debug = false;
                    debug.dev.allOff();

                    msg = `debugging is now §cOFF`;
                    debug.debugVarChange();
                }
                else
                    msg = `debugging is already §cOFF`;
            }
            else
            //Query 
            {
                msg = `debugging is ${debug.dev.debug ? '§aON' : '§cOFF'}`;
            }
            const player = origin.sourceEntity;
            player.sendMessage(`${debug.dev.debugScoreboardBaseDisplay} ${msg}`);
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
// function register_debugUnlock (registry) {

//     const cmd = {
//         name: `${pack.fullNameSpace}:debug_unlock`,
//         description: "Unlock Debugging",
//         permissionLevel: CommandPermissionLevel.Owner,
//         cheatsRequired: false,
//         mandatoryParameters: [
//             {
//                 name: "passCode",
//                 type: CustomCommandParamType.Integer,
//             }
//         ]
//     };

//     /** @type {(origin: CustomCommandOrigin, args: number[]) => import("@minecraft/server").CustomCommandResult} */
//     const handler = (origin, args) => {
//         if (origin.sourceEntity instanceof Player) {

//             if (!(debug.dev.debug || pack.passCodeEntered)) {

//                 const passCode = args[ 0 ];
//                 let msg = '';
//                 if (passCode === pack.debugPassCode) {
//                     pack.passCodeEntered = true;

//                     const lastRegistry = getRegistry();
//                     // or const lastRegistry = ccRegistry[0]  TODO: try this even if other worked
//                     // also if works, try just registry to see if the handler saved it

//                     if (lastRegistry) {
//                         registerCustomCommandsDebug(lastRegistry);
//                         msg = `${debug.dev.debugScoreboardBaseDisplay} debugging is now §aUnlocked`;
//                     }
//                     else {
//                         msg = `${debug.dev.debugScoreboardBaseDisplay} §cError Getting Registry to Register Debug Commands`;
//                     }
//                 }
//                 else {
//                     //Only the owner can run this command, so it ok to point to where the code is
//                     msg = `§cIncorrect Pass Code - Open up script file settings.js to see/change`;
//                 }
//                 const player = origin.sourceEntity;
//                 player.sendMessage(msg);
//             }
//         }
//         const result = { status: CustomCommandStatus.Success };
//         return result;
//     };

//     registry.registerCommand(cmd, handler);
// }
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_scoreboards (registry) {
    alertLog.log('§v* function register_scoreboards ()', debugFunctions);
    const cmd = {
        name: `${pack.fullNameSpace}:scoreboards`,
        description: "Scoreboards",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false,
        mandatoryParameters: [
            {
                name: scoreboard_options,
                type: CustomCommandParamType.Enum,
            }
        ]
    };
    //"Clear","reset", "show", "reverse", "Zero"
    /** @type {(origin: CustomCommandOrigin, args: string) => import("@minecraft/server").CustomCommandResult} */
    const handler = (origin, arg) => {
        if (origin.sourceEntity instanceof Player) {
            if (!arg) arg = 'show';

            const player = origin.sourceEntity;

            if (arg == 'clear') {
                system.run(() => {
                    debug.debugScoreboards.unShow();
                });
            }
            else if (arg == 'reset') {
                system.run(() => {
                    debug.debugScoreboards.resetAll();
                    system.runTimeout(() => {
                        debug.debugScoreboards.show();
                    }, 1);
                });
            }
            else if (arg == 'show') {
                system.run(() => {
                    debug.debugScoreboards.show();
                });
            }
            else if (arg == 'reverse') {
                system.run(() => {
                    debug.debugScoreboards.showReverse();
                });
            }
            else if (arg == 'zero') {
                system.run(() => {
                    debug.debugScoreboards.zeroAll();
                });
            }

        }
        const result = { status: CustomCommandStatus.Success };
        return result;
    };

    registry.registerCommand(cmd, handler);
}
//==============================================================================
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
/**
 * @param {CustomCommandRegistry} registry 
 */
export function registerCustomCommands (registry) {
    alertLog.log('§v* function registerCustomCommands ()', debugFunctions);

    //Register Enums here
    register_about(registry);

    if (debug.dev.debug) {
        register_cls(registry);        

        alertLog.log(`Registering Debug enum: ${queryOnOff}`, debugFunctions);
        registry.registerEnum(queryOnOff, [ "query", "on", "off" ]);

        register_debug(registry);
        register_debugEntity(registry);
        register_debugEntityActivity(registry);
        register_debugEntityAlert(registry);

        alertLog.log(`Registering Debug enum: ${scoreboard_options}`, debugFunctions);
        registry.registerEnum(scoreboard_options, [ "clear", "reset", "show", "reverse", "zero" ]);

        register_scoreboards(registry);
    }

    alertLog.log('§8x function registerCustomCommands ()', debugFunctions);
}
//==============================================================================
// End of File