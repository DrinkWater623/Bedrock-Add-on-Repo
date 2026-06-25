// chatCmds.js  Tree Spider (refactored to new chatCmds.js format)
// @ts-check
//==============================================================================
// Minecraft
import { system, Player } from "@minecraft/server";
import {
    CustomCommandRegistry,
    CommandPermissionLevel,
    CustomCommandStatus,
    CustomCommandParamType,
} from "@minecraft/server";
// Shared
import { getWorldTime, ScoreboardLib, Vector3Lib, VectorXZLib } from "./common-stable/tools/index.js";
// Local
import { alertLog, chatLog, pack, packDisplayName } from "./settings.js";
import { dev } from "./debug.js";
//==============================================================================

/** Toggle for function-entry logs. */
const debugFunctions = false;

/** Common prefix used in Tree Spider debug messages. */
const msgPfx = pack.cmdNameSpace;

// Enum names (fully qualified)
const queryOnOff = `${pack.cmdNameSpace}:enum_query_on_off`;
const scoreboard_options = `${pack.cmdNameSpace}:scoreboard_options`;

// Common results
const SUCCESS = { status: CustomCommandStatus.Success };
const FAILURE = { status: CustomCommandStatus.Failure };

//==============================================================================
// Central dispatcher: command logic lives here (one switch)
//==============================================================================

/**
 * Central command runner. All registered commands forward here.
 *
 * @param {import("@minecraft/server").CustomCommandOrigin} origin
 * @param {string} cmd
 * @param {...any} args
 * @returns {import("@minecraft/server").CustomCommandResult}
 */
function chatCommandRun (origin, cmd, ...args) {
    if (!(origin.sourceEntity instanceof Player)) return FAILURE;

    /** @type {Player} */
    const player = origin.sourceEntity;

    switch (cmd) {
        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------
        case "about": {
            player.sendMessage(
                `\n${packDisplayName}:\n` +
                `§r§a${pack.about}\n` +
                `§r§b${pack.devUrl}\n` +
                `§r§c${pack.reportBugs}`
            );
            return SUCCESS;
        }

        //--------------------------------------------------------------------------
        // Debug / Admin
        //--------------------------------------------------------------------------
        case "getGeoInfo": {
            player.sendMessage(`§l§gTime: ${getWorldTime().hours}:00`);
            const { dimension, location, name } = player;

            const inBiome = dimension.getBiome(location);
            if (!inBiome) return FAILURE;
            player.sendMessage(`§aYou (${name}) are in the ${inBiome.id} biome`);

            const inBlock = dimension?.getBlock(location);
            if (!inBlock) return FAILURE;

            const onBlock = inBlock.below();
            if (!onBlock) return FAILURE;

            const headLevelBlock = inBlock.above();
            if (!headLevelBlock) return FAILURE;

            system.runTimeout(() => {
                player.sendMessage(`§gStanding on ${onBlock.typeId} @ ${Vector3Lib.toString(onBlock.location, 0, true)}`);
                player.sendMessage(`§e         in ${inBlock.typeId}  @ ${Vector3Lib.toString(inBlock.location, 0, true)}`);
                player.sendMessage(`§f         with a skylight level of ${onBlock.getSkyLightLevel()}`);

                const locationCenter = headLevelBlock.center();

                const topMostBlock = dimension.getTopmostBlock(locationCenter);
                if (topMostBlock) {
                    player.sendMessage(
                        `\n§bTop most block from ${Vector3Lib.toString(locationCenter, 0, true)} is ` +
                        `${topMostBlock.typeId} @ ${Vector3Lib.toString(topMostBlock.location, 0, true)}`
                    );
                }

                const direction = { x: 0, y: 1, z: 0 };
                const rayCastUpBlock = dimension.getBlockFromRay(locationCenter, direction);
                if (rayCastUpBlock) {
                    player.sendMessage(`§vFirst Block above your head is ${rayCastUpBlock.block.typeId}`);
                }

                // Light level grid 3x3 around the block you stand on
                /** @type {number[]} */
                const lightGrid = [];

                for (let i = 0; i < 3; i++) {
                    const block = i === 0 ? onBlock.north() : i === 1 ? onBlock : onBlock.south();
                    if (block) {
                        const west = block.west();
                        const east = block.east();

                        if (west) {
                            const sky = west.getSkyLightLevel();
                            lightGrid.push(typeof sky === "number" ? sky : -2);
                        } else lightGrid.push(-1);

                        {
                            const sky = block.getSkyLightLevel();
                            lightGrid.push(typeof sky === "number" ? sky : -2);
                        }

                        if (east) {
                            const sky = east.getSkyLightLevel();
                            lightGrid.push(typeof sky === "number" ? sky : -2);
                        } else lightGrid.push(-1);
                    } else {
                        lightGrid.push(-1, -1, -1);
                    }
                }

                let msg = `\n§dLight Levels Around §aYou§r`;
                for (let i = 0; i < 3; i++) {
                    msg += `\n`;
                    for (let j = 0; j < 3; j++) {
                        const k = j + i * 3;
                        const val = lightGrid[ k ];
                        msg += `   §${k === 4 ? "a" : "r"}${val >= 0 && val < 10 ? "0" : ""}${val}`;
                    }
                }
                player.sendMessage(msg);
            }, 1);

            return SUCCESS;
        }

        case "delta": {
            /** @type {import("@minecraft/server").Entity[] | undefined} */
            const entities = args[ 0 ];
            if (!entities) return FAILURE;

            const playerLocation = player.location;

            system.run(() => {
                for (const entity of entities) {
                    if (entity?.isValid) {
                        const { location, nameTag } = entity;
                        const delta = `§bClosest Player x: ${Math.round(Math.abs(location.x - playerLocation.x))}, ` +
                            `y:${Math.round(Math.abs(location.y - playerLocation.y))}, ` +
                            `z:${Math.round(Math.abs(location.z - playerLocation.z))}`;

                        if (nameTag) {
                            const msg = `query: §l${nameTag}§r §6@ ${Vector3Lib.toString(location, 0, true)} ${delta}`;
                            chatLog.log(msg);
                        }
                    }
                }
            });

            return SUCCESS;
        }

        case "new_test": {
            const currentLocation = player.location;
            const xz = VectorXZLib.randomXZ(5000, { center: currentLocation, minRadius: 1000, avoidZero: true });
            const entities = player.dimension.getEntities({ families: [ "dw623" ] });

            for (const entity of entities) {
                system.runTimeout(() => { if (entity.isValid) entity.kill(); }, 1);
            }

            system.runTimeout(() => {
                dev.dsb.reset({ bases: [], reCreate: true });
                player.teleport({ x: xz.x, y: 150, z: xz.z });
            }, 5);

            return SUCCESS;
        }

        case "debug": {
            /** @type {string} */
            let arg = args[ 0 ];
            if (!arg) arg = "query";

            let msg = "";
            if (arg === "on") {
                if (!dev.debugOn) {
                    dev.debugOn = true;
                    // TODO: since was off, turn on basic alerts too
                    msg = `debugging is now §aON`;
                    dev.anyOn();
                } else {
                    msg = `debugging is already §aON`;
                }
            } else if (arg === "off") {
                if (dev.debugOn) {
                    dev.debugOn = false;
                    dev.allOff();
                    msg = `debugging is now §cOFF`;
                    dev.anyOn();
                } else {
                    msg = `debugging is already §cOFF`;
                }
            } else {
                msg = `debugging is ${dev.debugOn ? "§aON" : "§cOFF"}`;
            }

            player.sendMessage(`${msgPfx} ${msg}`);
            return SUCCESS;
        }

        // case "debugEntity": {
        //     /** @type {string} */
        //     let arg = args[ 0 ];
        //     if (!arg) arg = "query";

        //     let msg = "";
        //     if (arg === "on") {
        //         if (!(dev.debugOn && dev.watchEntityGoals && dev.watchEntityEvents)) {
        //             dev.debugOn = true;
        //             dev.watchEntityGoals = true;
        //             dev.watchEntityEvents = true;
        //             msg = `debugEntity (Activity/Alert/Load/Spawn) is now §aON`;
        //             dev.anyOn();
        //         } else {
        //             msg = `debugEntity is already on §aON`;
        //         }
        //     } else if (arg === "off") {
        //         if (dev.watchEntityGoals || dev.watchEntityEvents) {
        //             dev.watchEntityGoals = false;
        //             dev.watchEntityEvents = false;
        //             dev.anyOn();
        //             msg = `debugEntity (Activity/Alert/Load/Spawn) is now §cOFF`;
        //             dev.anyOn();
        //         } else {
        //             msg = `debugEntity is already §cOFF`;
        //         }
        //     } else {
        //         if (dev.debugOn) {
        //             msg =
        //                 `debugEntity:\n` +
        //                 `Activity${dev.watchEntityGoals ? "§aON" : "§cOFF"}\n` +
        //                 `Alert:${dev.watchEntityEvents ? "§aON" : "§cOFF"}`;
        //         } else {
        //             msg = `debugging is §cOFF`;
        //         }
        //     }

        //     player.sendMessage(`${msgPfx} ${msg}`);
        //     return SUCCESS;
        // }

        // case "watchEntityGoals": {
        //     /** @type {string} */
        //     let arg = args[ 0 ];
        //     if (!arg) arg = "query";

        //     let msg = "";
        //     if (arg === "on") {
        //         if (!(dev.debugOn && dev.watchEntityGoals)) {
        //             dev.debugOn = true;
        //             dev.watchEntityGoals = true;
        //             msg = `watchEntityGoals is now §aON`;
        //             dev.anyOn();
        //         } else {
        //             msg = `watchEntityGoals is already §aON`;
        //         }
        //     } else if (arg === "off") {
        //         if (dev.watchEntityGoals) {
        //             dev.watchEntityGoals = false;
        //             msg = `watchEntityGoals is now §cOFF`;
        //             dev.anyOn();
        //         } else {
        //             msg = `watchEntityGoals is already §cOFF`;
        //         }
        //     } else {
        //         if (dev.debugOn) {
        //             msg = `watchEntityGoals is ${dev.watchEntityGoals ? "§aON" : "§cOFF"}`;
        //         } else {
        //             msg = `debugging is §cOFF`;
        //         }
        //     }

        //     player.sendMessage(`${msgPfx} ${msg}`);
        //     return SUCCESS;
        // }

        // case "watchEntityEvents": {
        //     /** @type {string} */
        //     let arg = args[ 0 ];
        //     if (!arg) arg = "query";

        //     let msg = "";
        //     if (arg === "on") {
        //         if (!(dev.debugOn && dev.watchEntityEvents)) {
        //             dev.debugOn = true;
        //             dev.watchEntityEvents = true;
        //             msg = `watchEntityEvents is now §aON`;
        //             dev.anyOn();
        //         } else {
        //             msg = `watchEntityEvents is already §aON`;
        //         }
        //     } else if (arg === "off") {
        //         if (dev.watchEntityEvents) {
        //             dev.watchEntityEvents = false;
        //             msg = `watchEntityEvents is now §cOFF`;
        //             dev.anyOn();
        //         } else {
        //             msg = `watchEntityEvents is already §cOFF`;
        //         }
        //     } else {
        //         if (dev.debugOn) {
        //             msg = `watchEntityEvents is ${dev.watchEntityEvents ? "§aON" : "§cOFF"}`;
        //         } else {
        //             msg = `debugging is §cOFF`;
        //         }
        //     }

        //     player.sendMessage(`${msgPfx} ${msg}`);
        //     return SUCCESS;
        // }

        case "scoreboards": {
            /** @type {string} */
            let arg = args[ 0 ];
            if (!arg) arg = "show";

            if (arg === "hide") {
                system.run(() => dev.dsb.hide());
                return SUCCESS;
            }

            if (arg === "reset") {
                const side = ScoreboardLib.sideBar_query()?.id;
                if (side) {
                    system.run(() => {
                        dev.dsb.reset({ bases: [ side ], reCreate: false });
                        system.runTimeout(() => { dev.dsb.show(side); }, 1);
                    });
                } else {
                    chatLog.warn("There is no scoreboard showing, nothing to reset.  §lDid you mean to use reset_all?");
                }
                return SUCCESS;
            }

            if (arg === "reset_all") {
                const side = ScoreboardLib.sideBar_query()?.id;
                system.run(() => {
                    dev.dsb.reset({ bases: [], reCreate: false });
                    system.runTimeout(() => { if (side) dev.dsb.show(side); }, 1);
                });
                return SUCCESS;
            }

            if ([ "ctrs", "deaths", "stats", "actions" ].includes(arg)) {
                system.run(() => {
                    chatLog.log(`Switching to ${dev.dsb.getScoreboardName(arg)}`);
                    dev.dsb.show(arg);
                });
                return SUCCESS;
            }

            if (arg === "zero") {
                const side = ScoreboardLib.sideBar_query()?.id;
                if (side) {
                    system.run(() => {
                        dev.dsb.zero([ side ]);
                        system.runTimeout(() => { dev.dsb.show(side); }, 1);
                    });
                } else {
                    chatLog.warn("There is no scoreboard showing, nothing to zero.  §lDid you mean to use zero_all?");
                }
                return SUCCESS;
            }

            if (arg === "zero_all") {
                system.run(() => dev.dsb.zero([]));
                return SUCCESS;
            }

            // If arg is unknown, just do nothing successfully (original behavior)
            return SUCCESS;
        }

        default:
            return SUCCESS;
    }
}

//==============================================================================
// Registration helpers (new chatCmds.js style)
//==============================================================================

/**
 * Register a command that dispatches into chatCommandRun().
 * Works for commands *with or without parameters*.
 *
 * @param {CustomCommandRegistry} registry
 * @param {string} cmdRunKey
 * @param {import("@minecraft/server").CustomCommand} cmdOpts
 * @param {boolean} [alert=false]
 */
function register_cc (registry, cmdRunKey, cmdOpts, alert = false) {
    if (alert) alertLog.log(`Registered command: ${cmdOpts.name}`, true);

    // Handler args are based on cmdOpts.mandatoryParameters, but JS can accept them loosely.
    registry.registerCommand(cmdOpts, (origin, ...args) => {
        return chatCommandRun(origin, cmdRunKey, ...args);
    });
}

//==============================================================================
// Small helper class: one project-specific place to hold registry + alert policy.
//==============================================================================

class CommandRegistrar {
    /**
     * @param {CustomCommandRegistry} registry
     * @param {{ alert?: boolean }} [opts]
     */
    constructor(registry, opts = {}) {
        /** @type {CustomCommandRegistry} */
        this.registry = registry;
        /** @type {boolean} */
        this.alert = opts.alert ?? false;
    }

    /**
     * Register a command that forwards into chatCommandRun(cmdRunKey, ...args).
     *
     * @param {string} cmdRunKey
     * @param {import("@minecraft/server").CustomCommand} cmdOpts
     */
    add (cmdRunKey, cmdOpts) {
        register_cc(this.registry, cmdRunKey, cmdOpts, this.alert);
    }

    /**
     * Register an enum.
     *
     * @param {string} enumName
     * @param {string[]} values
     */
    addEnum (enumName, values) {
        this.registry.registerEnum(enumName, values);
    }
}

//==============================================================================
// Public entry
//==============================================================================

/**
 * @param {CustomCommandRegistry} registry
 */
export function registerCustomCommands (registry) {
    alertLog.log("§v* function registerCustomCommands ()", debugFunctions);

    const cc = new CommandRegistrar(registry, { alert: false });

    // --- Public -----------------------------------------------------------
    cc.add("about", {
        name: `${pack.cmdNameSpace}:about_tree_spiders`,
        description: `${packDisplayName} Add-on Information`,
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    });

    // --- Debug / Admin ----------------------------------------------------
    // Keeping your original gating behavior: only register these if debugOn is already true.
    if (dev.debugOn) {
        // Register enums first (commands reference these)
        alertLog.log(`Registering Debug enum: ${queryOnOff}`, debugFunctions);
        cc.addEnum(queryOnOff, [ "query", "on", "off" ]);

        alertLog.log(`Registering Debug enum: ${scoreboard_options}`, debugFunctions);
        cc.addEnum(scoreboard_options, [ "hide", "reset", "reset_all", "stats", "ctrs", "actions", "deaths", "zero", "zero_all" ]);

        cc.add("delta", {
            name: `${pack.cmdNameSpace}:delta`,
            description: "Display Delta Distance From You",
            permissionLevel: CommandPermissionLevel.Admin,
            cheatsRequired: false,
            mandatoryParameters: [ { name: "delta_test", type: CustomCommandParamType.EntitySelector } ]
        });

        cc.add("new_test", {
            name: `${pack.cmdNameSpace}:new_test`,
            description: "Kill Entities, New RTP and Reset Scoreboards",
            permissionLevel: CommandPermissionLevel.Admin,
            cheatsRequired: false
        });

        cc.add("getGeoInfo", {
            name: `${pack.cmdNameSpace}:geo`,
            description: "Show Current Location Information",
            permissionLevel: CommandPermissionLevel.Admin,
            cheatsRequired: false
        });

        cc.add("debug", {
            name: `${pack.cmdNameSpace}:debug`,
            description: "Turn on/off/query Debugging",
            permissionLevel: CommandPermissionLevel.Admin,
            cheatsRequired: false,
            mandatoryParameters: [ { name: queryOnOff, type: CustomCommandParamType.Enum } ]
        });

        cc.add("debugEntity", {
            name: `${pack.cmdNameSpace}:debug_entity`,
            description: "Turn on/off/query Entity Activity/Alert/Load Messages and Scoreboards Debugging",
            permissionLevel: CommandPermissionLevel.Admin,
            cheatsRequired: false,
            mandatoryParameters: [ { name: queryOnOff, type: CustomCommandParamType.Enum } ]
        });

        cc.add("watchEntityGoals", {
            name: `${pack.cmdNameSpace}:watch_entity_goals`,
            description: "Turn on/off/query Watching Entity Goals",
            permissionLevel: CommandPermissionLevel.Admin,
            cheatsRequired: false,
            mandatoryParameters: [ { name: queryOnOff, type: CustomCommandParamType.Enum } ]
        });

        cc.add("watchEntityEvents", {
            name: `${pack.cmdNameSpace}:watch_entity_events`,
            description: "Turn on/off/query Watching Entity Events",
            permissionLevel: CommandPermissionLevel.Admin,
            cheatsRequired: false,
            mandatoryParameters: [ { name: queryOnOff, type: CustomCommandParamType.Enum } ]
        });

        cc.add("scoreboards", {
            name: `${pack.cmdNameSpace}:sb`,
            description: "Scoreboards",
            permissionLevel: CommandPermissionLevel.Admin,
            cheatsRequired: false,
            mandatoryParameters: [ { name: scoreboard_options, type: CustomCommandParamType.Enum } ]
        });
    }
}

//==============================================================================
// End of File
