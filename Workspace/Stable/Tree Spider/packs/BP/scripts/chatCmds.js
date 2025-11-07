// chatCmds.js
// @ts-check
//==============================================================================
// Minecraft
import { system, Player, Entity } from "@minecraft/server";
import { CustomCommandRegistry, CommandPermissionLevel, CustomCommandStatus, CustomCommandParamType, CustomCommandOrigin } from "@minecraft/server";
// Shared
import { Vector3Lib,VectorXZLib } from "./common-stable/vectorClass.js";
// Local
import { alertLog, chatLog, pack } from './settings.js';
import * as debug from "./helpers/fn-debug.js";
//==============================================================================
const debugFunctions = false;
//==============================================================================
//Enum Names
const queryOnOff = `${pack.fullNameSpace}:enum_query_on_off`;
const scoreboard_options = `${pack.fullNameSpace}:scoreboard_options`;
//==============================================================================
const SUCCESS = { status: CustomCommandStatus.Success };
const FAILURE = { status: CustomCommandStatus.Failure };
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_about (registry) {
    const cmd = {
        name: `${pack.fullNameSpace}:about`,
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
                if (!(debug.devDebug.debugOn && debug.devDebug.watchEntityGoals && debug.devDebug.watchEntityEvents && debug.devDebug.debugLoadAndSpawn)) {
                    debug.devDebug.debugOn = true;
                    debug.devDebug.watchEntityGoals = true;
                    debug.devDebug.watchEntityEvents = true;

                    msg = `debugEntity (Activity/Alert/Load/Spawn) is now §aON`;
                    debug.debugVarChange();
                }
                else
                    msg = `debugEntity is already on §aON`;
            }
            else if (arg == 'off') {
                if ((debug.devDebug.watchEntityGoals || debug.devDebug.watchEntityEvents)) {
                    debug.devDebug.watchEntityGoals = false;
                    debug.devDebug.watchEntityEvents = false;
                    debug.devDebug.anyOn();

                    msg = `debugEntity (Activity/Alert/Load/Spawn) is now §cOFF`;
                    debug.debugVarChange();
                }
                else
                    msg = `debugEntity is already §cOFF`;
            }
            else
            //Query 
            {
                if (debug.devDebug.debugOn)
                    msg = `debugEntity:\nActivity${debug.devDebug.watchEntityGoals ? '§aON' : '§cOFF'}\nAlert:${debug.devDebug.watchEntityEvents ? '§aON' : '§cOFF'}\nLoad/Spawn:${debug.devDebug.debugLoadAndSpawn ? '§aON' : '§cOFF'}`;
                else
                    msg = `debugging is §cOFF`;
            }
            const player = origin.sourceEntity;
            player.sendMessage(`${debug.devDebug.sbBaseDisplay} ${msg}`);
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
function register_watchEntityGoals (registry) {
    alertLog.log('§v* function register_watchEntityGoals ()', debugFunctions);

    const cmd = {
        name: `${pack.fullNameSpace}:watch_entity_goals`,
        description: "Turn on/off/query Watching Entity Goals",
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
                if (!(debug.devDebug.debugOn && debug.devDebug.watchEntityGoals)) {
                    debug.devDebug.debugOn = true;
                    debug.devDebug.watchEntityGoals = true;
                    msg = `watchEntityGoals is now §aON`;
                    debug.debugVarChange();
                }
                else
                    msg = `watchEntityGoals is already §aON`;
            }
            else if (arg == 'off') {
                if (debug.devDebug.watchEntityGoals) {
                    debug.devDebug.watchEntityGoals = false;
                    msg = `watchEntityGoals is now §cOFF`;
                    debug.debugVarChange();
                }
                else
                    msg = `watchEntityGoals is already §cOFF`;
            }
            else
            //Query 
            {
                if (debug.devDebug.debugOn)
                    msg = `watchEntityGoals is ${debug.devDebug.watchEntityGoals ? '§aON' : '§cOFF'}`;
                else
                    msg = `debugging is §cOFF`;
            }
            const player = origin.sourceEntity;
            player.sendMessage(`${debug.devDebug.sbBaseDisplay} ${msg}`);
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
function register_watchEntityEvents (registry) {
    alertLog.log('§v* function register_watchEntityEvents ()', debugFunctions);

    const cmd = {
        name: `${pack.fullNameSpace}:watch_entity_events`,
        description: "Turn on/off/query Watching Entity Events",
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
                if (!(debug.devDebug.debugOn && debug.devDebug.watchEntityEvents)) {
                    debug.devDebug.debugOn = true;
                    debug.devDebug.watchEntityEvents = true;
                    msg = `watchEntityEvents is now §aON`;
                    debug.debugVarChange();
                }
                else
                    msg = `watchEntityEvents is already §aON`;
            }
            else if (arg == 'off') {
                if (debug.devDebug.watchEntityEvents) {
                    debug.devDebug.watchEntityEvents = false;
                    msg = `watchEntityEvents is now §cOFF`;
                    debug.debugVarChange();
                }
                else
                    msg = `watchEntityEvents is already §cOFF`;
            }
            else
            //Query 
            {
                if (debug.devDebug.debugOn)
                    msg = `watchEntityEvents is ${debug.devDebug.watchEntityEvents ? '§aON' : '§cOFF'}`;
                else
                    msg = `debugging is §cOFF`;
            }
            const player = origin.sourceEntity;
            player.sendMessage(`${debug.devDebug.sbBaseDisplay} ${msg}`);
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
                if (!(debug.devDebug.debugOn)) {
                    debug.devDebug.debugOn = true;

                    //TODO: since was off, turn on basic alerts too

                    msg = `debugging is now §aON`;
                    debug.debugVarChange();
                }
                else
                    msg = `debugging is already §aON`;
            }
            else if (arg == 'off') {
                if (debug.devDebug.debugOn) {
                    debug.devDebug.debugOn = false;
                    debug.devDebug.allOff();

                    msg = `debugging is now §cOFF`;
                    debug.debugVarChange();
                }
                else
                    msg = `debugging is already §cOFF`;
            }
            else
            //Query 
            {
                msg = `debugging is ${debug.devDebug.debugOn ? '§aON' : '§cOFF'}`;
            }
            const player = origin.sourceEntity;
            player.sendMessage(`${debug.devDebug.sbBaseDisplay} ${msg}`);
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
function register_delta (registry) {

    const cmd = {
        name: `${pack.fullNameSpace}:delta`,
        description: "Display Delta Distance From You",
        permissionLevel: CommandPermissionLevel.Admin,
        cheatsRequired: false,
        mandatoryParameters: [
            {
                name: "delta_test",
                type: CustomCommandParamType.EntitySelector,
            }
        ]
    };

    /** @type {(origin: CustomCommandOrigin, args: Entity[]) => import("@minecraft/server").CustomCommandResult} */
    const handler = (origin, entities) => {
        if (!(origin.sourceEntity instanceof Player)) return FAILURE;
        if (!entities) return FAILURE;

        const player = origin.sourceEntity;
        const playerLocation = player.location;

        system.run(() => {
            for (const entity of entities) {
                if (entity.isValid) {
                    const { location, nameTag } = entity;
                    const delta = `§bClosest Player x: ${Math.round(Math.abs(location.x - playerLocation.x))}, y:${Math.round(Math.abs(location.y - playerLocation.y))}, z:${Math.round(Math.abs(location.z - playerLocation.z))}`;
                    if (nameTag) {
                        const msg = `query: §l${nameTag}§r §6@ ${Vector3Lib.toString(location, 0, true)} ${delta}`;
                        chatLog.log(msg);
                    }
                }
                //entity.applyImpulse({ x: 0, y: 1, z: 0 });
                //entity.dimension.spawnParticle("minecraft:ominous_spawning_particle", entity.location);
            }
        });

        return SUCCESS;
    };

    registry.registerCommand(cmd, handler);
}
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_random_rtp (registry) {
    const cmd = {
        name: `${pack.fullNameSpace}:rtp`,
        description: "Random TP",
        permissionLevel: CommandPermissionLevel.Admin,
        cheatsRequired: false
    };

    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        if (origin.sourceEntity instanceof Player) {
            const player = origin.sourceEntity;
            const currentLocation = origin.sourceEntity.location;
            const xz = VectorXZLib.randomXZ(5000, { center: currentLocation, minRadius: 1000, avoidZero: true });
            //const z = rtp.randomXZ(5000,{center:currentLocation,minRadius:1000,avoidZero:true})
            system.run(() => {
                player.teleport({ x: xz.x, y: 150, z: xz.z });
            });
        }

        const result = { status: CustomCommandStatus.Success };
        return result;
    });
}
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
 * @param {CustomCommandRegistry} registry 
 */
export function registerCustomCommands (registry) {
    alertLog.log('§v* function registerCustomCommands ()', debugFunctions);

    //Register Enums here
    register_about(registry);
    register_random_rtp(registry)

    if (debug.devDebug.debugOn) {
        register_cls(registry);
        register_delta(registry);

        alertLog.log(`Registering Debug enum: ${queryOnOff}`, debugFunctions);
        registry.registerEnum(queryOnOff, [ "query", "on", "off" ]);

        register_debug(registry);
        register_debugEntity(registry);
        register_watchEntityGoals(registry);
        register_watchEntityEvents(registry);

        alertLog.log(`Registering Debug enum: ${scoreboard_options}`, debugFunctions);
        registry.registerEnum(scoreboard_options, [ "clear", "reset", "show", "reverse", "zero" ]);

        register_scoreboards(registry);
    }

    alertLog.log('§8x function registerCustomCommands ()', debugFunctions);
}
//==============================================================================
// End of File