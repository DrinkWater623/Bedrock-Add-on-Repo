// chatCmds.js  After-Life
// @ts-check
/* =====================================================================
Copyright (C) 2026 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T. (https://www.gnu.org/licenses/gpl-3.0.html)
URL: https://github.com/DrinkWater623
========================================================================
TODO: 
// ========================================================================
Change Log:
    20260110 - Created
    20260113 - Refactor command registration (register_cc everywhere), add biome_check debug command
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
                case 'about':
                    msg = `\n${packDisplayName}:\n§r§a${pack.about}\n§r§b${pack.devUrl}\n§r§c${pack.reportBugs}`;
                    break;
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
                        player.sendMessage(msg);
                    }, 1);
                    return;
                case 'itemCount':
                    const count = EntityFloatingItems.floatingItemCount(player.dimension, player.location, 100, 16);
                    player.sendMessage(`Floating Items = ${count}`);
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
                        msg = `§b*§r Last known §cDeath§g Coordinates: §b${dimension}§r @ ${Vector3Lib.toString(location, 0, true)}`;
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
                case 'showPlayerInfo':
                    playerDebug.playerInfo(player);
                    break;
                case 'biomeCheck': {
                    // "locationCenter" = the block coordinate you are standing in.
                    const locationCenter = {
                        x: Math.floor(player.location.x),
                        y: Math.floor(player.location.y),
                        z: Math.floor(player.location.z)
                    };

                    const biomeId = player.dimension.getBiome(locationCenter).id;
                    msg = `§6Biome§r @ ${Vector3Lib.toString(locationCenter, 0, true)} = §b${biomeId}`;
                    dev.alertLog(`Biome = ${biomeId}`, true);
                    break;
                }
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
 * @param {string} cmdRunKey 
 * @param {import("@minecraft/server").CustomCommand} cmdOpts 
 * @param {boolean} [alert=false] 
 */
function register_cc (registry, cmdRunKey, cmdOpts, alert = false) {
    if (alert) dev.alertLog(`Registered command: ${cmdOpts.name}`, true);
    /**
     * @returns {import("@minecraft/server").CustomCommandResult}
     */
    registry.registerCommand(cmdOpts, (origin) => {
        chatCommandRun(origin, cmdRunKey);
        return { status: CustomCommandStatus.Success };
    });
}

//==============================================================================
// Small helper class so each project only has to:
//   1) declare command metadata here, and
//   2) implement the logic in chatCommandRun()
class CommandRegistrar {
    /**
     * @param {CustomCommandRegistry} registry
     * @param {{ alert?: boolean }} [opts]
     */
    constructor (registry, opts = {}) {
        /** @type {CustomCommandRegistry} */
        this.registry = registry;
        /** @type {boolean} */
        this.alert = opts.alert ?? false;
    }

    /**
     * Register a command that dispatches into chatCommandRun(cmdRunKey).
     *
     * @param {string} cmdRunKey
     * @param {import("@minecraft/server").CustomCommand} cmdOpts
     */
    add (cmdRunKey, cmdOpts) {
        register_cc(this.registry, cmdRunKey, cmdOpts, this.alert);
    }
}
//==============================================================================
//==============================================================================
/**
 * @param {CustomCommandRegistry} registry 
 */
export function registerCustomCommands (registry) {
    dev.alertFunctionKey('registerCustomCommands');
    const alert = false;
    const cc = new CommandRegistrar(registry, { alert });

    // Public / player-facing
    cc.add('about', {
        name: `${pack.cmdNameSpace}:about_after_life`,
        description: `Info/Help for DW623's ${packDisplayName} add-on`,
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    });

    cc.add('lastDeathCoords_show', {
        name: `${pack.cmdNameSpace}:query`,
        description: "Get Last Known Death Coords",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    });

    cc.add('tp-me', {
        name: `${pack.cmdNameSpace}:tp_me`,
        description: "TP to Last Known Death Coords",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    });

    cc.add('deathStats', {
        name: `${pack.cmdNameSpace}:death_stats`,
        description: "Death Statistics of Online Players",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    });

    cc.add('showPlayerInfo', {
        name: `${pack.cmdNameSpace}:show_player_info`,
        description: "Show Your Info",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false
    });

    // Debug-only commands
    if (pack.debugOn) {
        const permAdmin = CommandPermissionLevel.Admin;

        cc.add('lastDeathCoords_clear', {
            name: `${pack.cmdNameSpace}:clear_last_dvs`,
            description: "Debug: Clear Last Death Dynamic Vars",
            permissionLevel: permAdmin,
            cheatsRequired: false
        });

        cc.add('clearDynamicProperties', {
            name: `${pack.cmdNameSpace}:clear_dvs`,
            description: "Debug: Clear Dynamic Vars",
            permissionLevel: permAdmin,
            cheatsRequired: false
        });

        cc.add('itemCount', {
            name: `${pack.cmdNameSpace}:item_count`,
            description: "Count floating items",
            permissionLevel: CommandPermissionLevel.Any,
            cheatsRequired: false
        });

        cc.add('biomeCheck', {
            name: `${pack.cmdNameSpace}:biome_check`,
            description: "Debug: Show biome at your location",
            permissionLevel: permAdmin,
            cheatsRequired: false
        });

        cc.add('killMe', {
            name: `${pack.cmdNameSpace}:kill_me`,
            description: "Debug: Kill Me",
            permissionLevel: permAdmin,
            cheatsRequired: false
        });

        cc.add('listDynamicVars', {
            name: `${pack.cmdNameSpace}:list_dvs`,
            description: "Debug: List Dynamic Vars",
            permissionLevel: permAdmin,
            cheatsRequired: false
        });

        cc.add('launchDeathBots', {
            name: `${pack.cmdNameSpace}:spawn_bot`,
            description: "Debug: Spawn a Death-Bot",
            permissionLevel: permAdmin,
            cheatsRequired: false
        });
    }
    dev.alertFunctionKey('registerCustomCommands', false);
}
//==============================================================================
// End of File
