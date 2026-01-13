// chatCmds.js  After-Life
// @ts-check
/* =====================================================================
Copyright (C) 2026 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T. (https://www.gnu.org/licenses/gpl-3.0.html)
URL: https://github.com/DrinkWater623
========================================================================
TODO: 
confirm newBlock is one of these canPlaceInBlocks - may not be needed, just because of how placing works, like grass can be replaced
// ========================================================================
Change Log:
    20260110 - Created
========================================================================*/
// Minecraft
import { CustomCommandSource, Player, CustomCommandOrigin, system, EffectTypes, world, TicksPerDay } from "@minecraft/server";
import { CustomCommandRegistry, CommandPermissionLevel, CustomCommandStatus } from "@minecraft/server";
// Shared
import { Ticks } from "./common-data/globalConstantsLib.js";
import { EntityFloatingItems, PlayerDebug, Players } from "./common-stable/gameObjects/index.js";
import { DynamicPropertyLib, Vector3Lib } from "./common-stable/tools/index.js";
// Local
import { dev } from "./debug.js";
import { chatLog, dynamicVars, pack, packDisplayName } from './settings.js';
import { launchDeathBots } from "./helpers/deathBot.js";
import { updateAllPlayerStats } from "./helpers/fn-stable.js";


//==============================================================================
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
//==============================================================================
const playerDebug = new PlayerDebug(dev);
//==============================================================================
const dimensionSuffix = (dimensionId = "") => { return dimensionId.replace('minecraft:', '').replace('the_', ''); };
/**
 * 
 * @param {CustomCommandOrigin} origin 
 * @param {string} cmd 
 */
function chatCommandRun (origin, cmd) {
    if (origin.sourceEntity && origin.sourceType == CustomCommandSource.Entity && origin.sourceEntity.isValid) {
        const player = origin.sourceEntity;
        let msg = '';
        if (player instanceof Player) {
            switch (cmd) {
                case 'clearDynamicProperties':
                    player.clearDynamicProperties();
                    msg = `§6§lDynamic Vars Cleared`;
                    break;
                case 'deathStats':
                    updateAllPlayerStats();
                    const players = world.getAllPlayers();
                    const isAdmin = Players.isOp(player);
                    system.runTimeout(() => {
                        let msg = '§c§lDeath Statistics:§r';
                        for (const p of players) {
                            const deaths = DynamicPropertyLib.getNumber(p, dynamicVars.deathCounter);
                            const longestDays = Math.ceil(DynamicPropertyLib.getNumber(p, dynamicVars.longestTicksAlive) / TicksPerDay);
                            const alive = Math.ceil(DynamicPropertyLib.getNumber(p, dynamicVars.aliveTicks) / TicksPerDay);
                            msg += `\n§6${p.name}:§r §cDeaths:§r ${deaths}  §aAlive:§r ${alive} day${alive == 1 ? '' : 's'}`;
                            if (longestDays > alive) msg += `  §dLongest Time Alive:§r ${longestDays} day${alive == 1 ? '' : 's'}`;
                            if (isAdmin) {
                                const dim = DynamicPropertyLib.getString(p, dynamicVars.deathDimension);
                                if (dim) {
                                    const coords = DynamicPropertyLib.getVector(p, dynamicVars.deathCoordinates);
                                    msg += `  §cLast Death Coords:§r (${dim} ${Vector3Lib.toString(coords, 0, true)})`;
                                    if (DynamicPropertyLib.getBoolean(p, dynamicVars.deathMsgWaiting)) msg += '   §cA Death Message is Waiting:§r';
                                }
                            }
                        }
                        player.sendMessage(`§c§lDeath Statistics:§r${msg}`);
                    }, 1);
                    return;
                case 'itemCount':
                    const count=EntityFloatingItems.floatingItemCount(player.dimension, player.location,100,16)
                    player.sendMessage(`Floating Items = ${count}`)
                    break;
                case 'lastDeathCoords_clear':
                    if (player.getDynamicProperty(dynamicVars.deathDimension)) {
                        msg = "* §eClearing your last saved §cDeath§e Coordinates";
                        player.setDynamicProperty(dynamicVars.deathMsgWaiting, false);
                        player.setDynamicProperty(dynamicVars.deathDimension, '');
                    }
                    else
                        msg = "* §cYou have no saved Death Coordinates to clear";
                    break;
                case 'killMe':
                    msg = "* §cKilling you as YOU requested";
                    system.runTimeout(() => {
                        const result = player.kill();
                        if (!result) player.sendMessage("» §3you don't seem to be kill-able right now!");
                    }, 20);
                    break;
                case 'lastDeathCoords_show':
                    let dimension = DynamicPropertyLib.getString(player, dynamicVars.deathDimension);
                    if (dimension) {
                        dimension = dimensionSuffix(dimension);
                        const location = DynamicPropertyLib.getVector(player, dynamicVars.deathCoordinates);
                        msg = `§b*§r Last known §cDeath§g Coordinates: §b${dimension}§r @ ${Vector3Lib.toString(location,0,true)}`;
                    }
                    else
                        msg = "* §cYou have no saved Death Coordinates";
                    break;
                case 'launchDeathBots':
                    launchDeathBots(player.dimension, player.location, player.name);
                    break;
                case 'listDynamicVars':
                    DynamicPropertyLib.show_all(player);
                    break;
                case 'tp-me':
                    const deathDimension = DynamicPropertyLib.getString(player, dynamicVars.deathDimension);

                    if (deathDimension) {
                        const dimension = world.getDimension(deathDimension);
                        const location = DynamicPropertyLib.getVector(player, dynamicVars.deathCoordinates);
                        if (location) {
                            msg = "* §aTP to Last Known Death Coords";
                            system.runTimeout(() => {
                                //TODO:Prep area, make sure clear --cannot test until player is there... so check once TP in case inside a block, need to clear

                                //TODO: give person temp immunity to fire / drowning / falling
                                let effect = EffectTypes.get("night_vision");
                                if (effect) player.addEffect(effect, Ticks.perMinute * 3, { amplifier: 100, showParticles: false });
                                effect = EffectTypes.get("fire_resistance");
                                if (effect) player.addEffect(effect, Ticks.perMinute * 3, { amplifier: 100, showParticles: false });
                                effect = EffectTypes.get("water_breathing");
                                if (effect) player.addEffect(effect, Ticks.perMinute * 3, { amplifier: 100, showParticles: false });
                                effect = EffectTypes.get("slow_falling");
                                if (effect) player.addEffect(effect, Ticks.perMinute * 1, { amplifier: 100, showParticles: false });

                                player.teleport(location, { dimension: dimension });
                                //how many ticks before a player is there?... then test for suffocation or on fire.

                            }, 10);
                        }
                        return true;
                    }
                    else msg = "* §cYou have no saved Death Coordinates to TP to";
                    break;
                default:
                    break;
            }

            if (msg) player.sendMessage(msg);
        }
    }
}
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_about (registry) {
    dev.alertFunctionKey('register_about');
    const cmd = {
        name: `${pack.cmdNameSpace}:about_after_life`,
        description: `Info/Help for DW623's ${packDisplayName} add-on`,
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
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_clear_dvs (registry) {
    dev.alertFunctionKey('register_clear_dvs');
    const cmd = {
        name: `${pack.cmdNameSpace}:clear_dvs`,
        description: "Debug: Clear Dynamic Vars",
        permissionLevel: CommandPermissionLevel.Admin,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        chatCommandRun(origin, 'clearDynamicProperties');
        return { status: CustomCommandStatus.Success };
    });
}
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_clear_last_death_dvs (registry) {
    dev.alertFunctionKey('register_clear_last_death_dvs');
    const cmd = {
        name: `${pack.cmdNameSpace}:clear_last_dvs`,
        description: "Debug: Clear Last Death Dynamic Vars",
        permissionLevel: CommandPermissionLevel.Admin,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        chatCommandRun(origin, 'lastDeathCoords_clear');
        return { status: CustomCommandStatus.Success };
    });
}
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_death_stats (registry) {
    dev.alertFunctionKey('register_death_stats');
    const cmd = {
        name: `${pack.cmdNameSpace}:death_stats`,
        description: "Death Statistics of Online Players",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        chatCommandRun(origin, 'deathStats');
        return { status: CustomCommandStatus.Success };
    });
}
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_item_count (registry) {    
    const cmd = {
        name: `${pack.cmdNameSpace}:item_count`,
        description: "Count floating items",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        chatCommandRun(origin, 'itemCount');
        return { status: CustomCommandStatus.Success };
    });
}
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_kill_me (registry) {
    dev.alertFunctionKey('register_kill_me');
    const cmd = {
        name: `${pack.cmdNameSpace}:clear_dv`,
        description: "Debug: Kill Me",
        permissionLevel: CommandPermissionLevel.Admin,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        chatCommandRun(origin, 'killMe');
        return { status: CustomCommandStatus.Success };
    });
}
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_list_dvs (registry) {
    dev.alertFunctionKey('register_list_dvs');
    const cmd = {
        name: `${pack.cmdNameSpace}:list_dvs`,
        description: "Debug: List Dynamic Vars",
        permissionLevel: CommandPermissionLevel.Admin,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        chatCommandRun(origin, 'listDynamicVars');
        return { status: CustomCommandStatus.Success };
    });
}
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_query (registry) {
    dev.alertFunctionKey('register_query');
    const cmd = {
        name: `${pack.cmdNameSpace}:query`,
        description: "Get Last Known Death Coords",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        chatCommandRun(origin, 'lastDeathCoords_show');
        return { status: CustomCommandStatus.Success };
    });
}
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_spawn_bot (registry) {
    dev.alertFunctionKey('register_spawn_bot');
    const cmd = {
        name: `${pack.cmdNameSpace}:spawn_bot`,
        description: "Spawn a Death-Bot",
        permissionLevel: CommandPermissionLevel.Admin,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        chatCommandRun(origin, 'launchDeathBots');
        return { status: CustomCommandStatus.Success };
    });
}
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_tp_me (registry) {
    dev.alertFunctionKey('register_tp_me');
    const cmd = {
        name: `${pack.cmdNameSpace}:tp_me`,
        description: "Get Last Known Death Coords",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        chatCommandRun(origin, 'tp-me');
        return { status: CustomCommandStatus.Success };
    });
}
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
function register_event_player_info (registry) {
    dev.alertFunctionKey('register_event_player_info');
    const cmd = {
        name: `${pack.cmdNameSpace}:show_player_info`,
        description: "Show Your Info",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    };
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmd, (origin) => {
        if (origin.sourceEntity instanceof Player) {
            playerDebug.playerInfo(origin.sourceEntity);
        }
        return { status: CustomCommandStatus.Success };
    });
}
//==============================================================================
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
export function registerCustomCommands (registry) {
    dev.alertFunctionKey('registerCustomCommands');

    register_about(registry);
    register_query(registry);
    register_tp_me(registry);
    register_death_stats(registry);

    if (pack.debugOn) {
        register_clear_last_death_dvs(registry);
        register_clear_dvs(registry);
        register_item_count(registry);
        register_kill_me(registry);
        register_list_dvs(registry);
        register_spawn_bot(registry);

    }
    dev.alertFunctionKey('registerCustomCommands', false);
}
//==============================================================================
// End of File