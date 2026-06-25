// chatCmds.js  XP Bank
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

// Local
import { alertLog, chatLog, pack, packDisplayName } from "./settings.js";
import { dev } from "./debug.js";
import { getBankXp, safeGetTotalXp, showXpBankMenu } from "./helpers/xpBankForms.js";
import { DynamicPropertyLib } from "./common-stable/tools/dynamicPropertyClass.js";
//==============================================================================
const dv = pack.dvNames;
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
        case "menu":
        case "bank":
        case "?":
        case "$": {
            showXpBankMenu(player);
            return SUCCESS;
        }
        case "wdall": //withdraw all
            {
                const bankXp = getBankXp(player);
                if (bankXp > 0) {
                    player.addExperience(bankXp);
                    DynamicPropertyLib.setNumber(player, dv.xpBalance, 0);
                }
                return SUCCESS;
            }
        case "dpall": //deposit all
            {
                const totalXp = safeGetTotalXp(player) || 0;
                if (totalXp > 0) {
                    DynamicPropertyLib.addNumber(player, dv.xpBalance, totalXp);
                    player.addExperience(-totalXp);
                }
                return SUCCESS;
            }
        //--------------------------------------------------------------------------
        // Debug / Admin
        //--------------------------------------------------------------------------
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

        cc.add("debug", {
            name: `${pack.cmdNameSpace}:debug`,
            description: "Turn on/off/query Debugging",
            permissionLevel: CommandPermissionLevel.Admin,
            cheatsRequired: false,
            mandatoryParameters: [ { name: queryOnOff, type: CustomCommandParamType.Enum } ]
        });
    }
}

//==============================================================================
// End of File
