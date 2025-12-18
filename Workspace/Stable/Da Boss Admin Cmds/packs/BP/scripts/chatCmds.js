// chatCmds.js  Da Boss Admin Cmds
// @ts-check
//==============================================================================
// Minecraft
import { system, Player, world, TimeOfDay } from "@minecraft/server";
import { CustomCommandRegistry, CommandPermissionLevel, CustomCommandStatus, CustomCommandParamType, CustomCommandOrigin } from "@minecraft/server";
// Shared
import { PlayerLib } from "./common-stable/gameObjects/index.js";
import { Vector3Lib } from "./common-stable/tools/vectorClass.js";
// Local
import { alertLog, pack, packDisplayName } from './settings.js';
//==============================================================================
const debugFunctions = false;
//==============================================================================
const SUCCESS = { status: CustomCommandStatus.Success };
const FAILURE = { status: CustomCommandStatus.Failure };
//==============================================================================
function getWorldTime () {
    const daytime = world.getTimeOfDay() + 6000;
    const datetime = new Date(daytime * 3.6 * 1000);
    return { hours: datetime.getHours(), minutes: datetime.getMinutes() };
}
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_about (registry) {
    const cmd = {
        name: `${pack.cmdNameSpace}:about_da_boss_admin_cmds`,
        description: "Just some commands to make my dev testing life easier",
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
function register_cls (registry) {
    const cmd = {
        name: `${pack.cmdNameSpace}:cls`,
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
            let LineCount = args?.length ? args[ 0 ] : 40;
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
//  Time
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_midnight (registry) {
    const cmd = {
        name: `${pack.cmdNameSpace}:midnight`,
        description: "Set Time to Midnight",
        permissionLevel: CommandPermissionLevel.Admin,
        cheatsRequired: false
    };

    /** @type {(origin: CustomCommandOrigin, args: number[]) => import("@minecraft/server").CustomCommandResult} */
    const handler = (origin, args) => {
        if (origin.sourceEntity instanceof Player) {
            system.run(() => {
                world.setAbsoluteTime(TimeOfDay.Midnight);
            });
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
function register_noon (registry) {
    const cmd = {
        name: `${pack.cmdNameSpace}:noon`,
        description: "Set Time to Noon",
        permissionLevel: CommandPermissionLevel.Admin,
        cheatsRequired: false
    };

    /** @type {(origin: CustomCommandOrigin, args: number[]) => import("@minecraft/server").CustomCommandResult} */
    const handler = (origin, args) => {
        if (origin.sourceEntity instanceof Player) {
            system.run(() => {
                world.setAbsoluteTime(TimeOfDay.Noon);
            });
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
function register_getGeoInfo (registry) {
    const cmd = {
        name: `${pack.cmdNameSpace}:geo`,
        description: "Show Current Location Information",
        permissionLevel: CommandPermissionLevel.Admin,
        cheatsRequired: false

    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        if (origin.sourceEntity instanceof Player) {
            const player = origin.sourceEntity;

            if (player && player.isValid) {

                const { dimension, location, name } = player;

                system.run(() => {
                    player.sendMessage(`\n\n§6You: ${name}`);
                    player.sendMessage(`§gWorld Time: ${getWorldTime().hours}:00`);
                    player.sendMessage(`§cDimension: ${dimension.id}`);
                    const inBiome = dimension.getBiome(location);
                    if (inBiome) player.sendMessage(`§aBiome: ${inBiome.id}`);

                    const inBlock = dimension?.getBlock(location);
                    if (!inBlock) return FAILURE;
                    const onBlock = inBlock.below();
                    if (!onBlock) return FAILURE;
                    const headLevelBlock = inBlock.above();
                    if (!headLevelBlock) return FAILURE;

                    system.runTimeout(() => {

                        player.sendMessage(`§gStanding on:§r ${onBlock.typeId} @ ${Vector3Lib.toString(onBlock.location, 0, true)}`);
                        player.sendMessage(`§e         in:§r ${inBlock.typeId}  @ ${Vector3Lib.toString(inBlock.location, 0, true)}`);
                        player.sendMessage(`§fSkylight level:§r ${onBlock.getSkyLightLevel()}`);

                        const locationCenter = headLevelBlock.center();

                        const topMostBlock = dimension.getTopmostBlock(locationCenter);
                        if (topMostBlock) {
                            player.sendMessage(`\n§bTop most block:§r ${topMostBlock.typeId} @ ${Vector3Lib.toString(topMostBlock.location, 0, true)}`);
                        }

                        const direction = { x: 0, y: 1, z: 0 };
                        const rayCastUpBlock = dimension.getBlockFromRay(locationCenter, direction);
                        if (rayCastUpBlock) {
                            player.sendMessage(`§vFirst Block above your head: §r${rayCastUpBlock.block.typeId}`);
                        }

                        //Light level grid 3x3
                        /**@type number[] */
                        const lightGrid = [];
                        //north
                        for (let i = 0; i < 3; i++) {
                            let block = i === 0 ? onBlock.north() : i === 1 ? onBlock : onBlock.south();
                            if (block) {
                                const west = block.west();
                                const east = block.east();

                                if (west) {
                                    const sky = west.getSkyLightLevel();
                                    lightGrid.push(typeof sky === 'number' ? sky : -2);
                                }
                                else lightGrid.push(-1);

                                if (block) {
                                    const sky = block.getSkyLightLevel();
                                    lightGrid.push(typeof sky === 'number' ? sky : -2);
                                }
                                else lightGrid.push(-1);

                                if (east) {
                                    const sky = east.getSkyLightLevel();
                                    lightGrid.push(typeof sky === 'number' ? sky : -2);
                                }
                                else lightGrid.push(-1);
                            }
                            else {
                                lightGrid.push(-1);
                                lightGrid.push(-1);
                                lightGrid.push(-1);
                            }
                        }
                        let msg = `\n§dLight Levels Around §aYou§r`;
                        for (let i = 0; i < 3; i++) {
                            msg += `\n`;
                            for (let j = 0; j < 3; j++) {
                                const k = j + (i * 3);
                                msg += `   §${k == 4 ? 'a' : 'r'}${lightGrid[ k ] >= 0 && lightGrid[ k ] < 10 ? '0' : ''}${lightGrid[ k ]}`;
                            }
                        }
                        player.sendMessage(msg);
                    }, 1);
                });
                //later add entity counts around me
            }
        }

        const result = { status: CustomCommandStatus.Success };
        return result;
    });
}
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_random_tp (registry) {
    //TODO: add diff radius choices
    const cmd = {
        name: `${pack.cmdNameSpace}:rtp`,
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
            if (player && player.isValid)
                system.run(() => {
                    PlayerLib.randomTP(player, 2500);
                });
        }

        const result = { status: CustomCommandStatus.Success };
        return result;
    });
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
    register_cls(registry);
    register_midnight(registry);
    register_noon(registry);
    register_random_tp(registry);
    register_getGeoInfo(registry);
}
//==============================================================================
// End of File