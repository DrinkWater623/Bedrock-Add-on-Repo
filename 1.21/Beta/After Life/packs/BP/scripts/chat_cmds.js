import { world, system, Player, ChatSendBeforeEvent, TicksPerSecond, EffectTypes,EffectType } from "@minecraft/server";
import * as fn from "./before/functions.js";
import { dimensionSuffix } from './fn-stable.js';
import { debug, debugMsg } from "./before/main.js";
import { Vector3Lib } from "./commonLib/vectorClass.js";
import { chatLog } from "./settings.js";
const TicksPerMinute = TicksPerSecond * 60;
//==============================================================================

export class PlayerChatCommands {
    constructor(cmdPrefix = ':') {
        this.cmdPrefix = cmdPrefix;
    }
    /**
     * @param { import("@minecraft/server").ChatSendBeforeEvent } event
     */
    processEvent (event) {
        if (!(event instanceof ChatSendBeforeEvent)) return false;
        if (!event.message.startsWith(this.cmdPrefix)) return false;
        event.cancel;

        let message = event.message.replaceAll(this.cmdPrefix, '').toLowerCase().replaceAll(' ', '');
        return this.processCommand(event.sender, message);
    }
    /**
    * @param { import("@minecraft/server").Player } player
    */
    processCommand (player, command = "") {
        if (!(player instanceof Player)) return false;

        switch (command) {
            case '':
            case '?':
            case "q":
            case "query": this.#query(player); return true;
            case "clear": this.#clear(player); return true;
            case "cls": fn.clearPlayerChatWindow(player, 40, 10); return true;
            case "killme": if (debug || player.isOp()) { this.#killMe(player); return true; } else return false;
            case "tpme": if (debug || player.isOp()) return this.#tpMe(player); else return false;
        }

        if (player.isOp()) {
            let subCommand = "tpplayer";

            if (command.startsWith(subCommand)) {
                command = command.removeAll(subCommand);

                if (!command || command.startsWith('?')) {
                    const playerList = world.getAllPlayers().filter(p => { p.isValid() && !!p.getDynamicProperty("deathDimension"); });
                    if (!playerList.length) { player.sendMessage("§6No Players with Death Coordinates in the World"); return false; }

                    //TODO: playerList.sort() later in alpha

                    playerList.forEach((p, i) => {
                        let alias = `${i}${p.nameTag.substring(0, 1)}${p.nameTag.substring(-1, 1)}`.toLowerCase();
                        p.indexedAlias = alias;
                        player.sendMessage(`${alias} => ${p.nameTag}`);
                    });

                    return true;
                }

                //tp person in world
                let playerList = world.getAllPlayers().filter(p => { p.isValid() && p.indexedAlias && p.indexedAlias === command; });

                if (playerList.length === 0) {
                    player.sendMessage("§cThat player alias does not exist in the world right now, please get a new list and use the codes to left of player's name");
                    return false;
                }

                if (playerList.length > 1) {
                    console.error("§cPlayer Alias Matching returned a list with more than one match"); //TODO: add alert msg and list them - this should not happen, since indexed
                    return false;
                }

                //ok to tp now - one player match
                return this.#tpMe(playerList[ 0 ]);

            }
        }
        return false;
    }
    /**
     * @param { import("@minecraft/server").Player } player
     */
    #query (player) {
        let dimension = player.getDynamicProperty('deathDimension');
        let msg = "";
        if (dimension) {
            dimension = dimensionSuffix(dimension);
            const location = player.getDynamicProperty('deathCoordinates');
            msg = `* §gLast known §cDeath§g Coordinates: §b${dimension} §a@§g ${Vector3Lib.toString(location)}`;
        }
        else msg = "* §cYou have no saved Death Coordinates";

        chatLog.logsendMessageLater(`\n${msg}\n\n`, player, 10);
    }

    /**
     * @param { import("@minecraft/server").Player } player
     */
    #clear (player) {
        let msg = "";
        //event.cancel;                
        if (player.getDynamicProperty('deathDimension')) {
            msg = "* §eClearing your last saved §cDeath§e Coordinates";
            player.setDynamicProperty('deathMsgWaiting', false);
            player.setDynamicProperty('deathDimension', "");
        }
        else msg = "* §cYou have no saved Death Coordinates to clear";

        fn.sendMessageLater(`\n${msg}\n\n`, player, 5);
    }

    /**
     * @param { import("@minecraft/server").Player } player
     */
    #killMe (player) {
        player.sendMessage("* §cKilling you as YOU requested");
        system.runTimeout(() => {
            const result = player.kill();
            if (!result) player.sendMessage("» §3you don't seem to be killable right now!");
        }, 20);
    }
    /**
    * @param { import("@minecraft/server").Player } player
    */
    #tpMe (player) {
        if (player.isValid() && player.getDynamicProperty('deathDimension')) {
            system.runTimeout(() => {
                const dimension = world.getDimension(player.getDynamicProperty("deathDimension"));
                const location = player.getDynamicProperty('deathCoordinates');

                player.sendMessage("* §aTP to Last Known Death Coords");
                //TODO:Prep area, make sure clear --cannot test until player is there... so check once TP in case inside a block, need to clear
                

                //TODO: give person temp immunity to fire / drowning / falling
                player.addEffect(EffectTypes.get("night_vision"), TicksPerMinute * 3, { amplifier: 100, showParticles: false });
                player.addEffect(EffectTypes.get("fire_resistance"), TicksPerMinute * 3, { amplifier: 100, showParticles: false });
                player.addEffect(EffectTypes.get("water_breathing"), TicksPerMinute * 3, { amplifier: 100, showParticles: false });
                player.addEffect(EffectTypes.get("slow_falling"), TicksPerMinute * 1, { amplifier: 100, showParticles: false });
                player.teleport(location, { dimension: dimension });
                //how many ticks before a player is there?... then test for suffocation or on fire.

            }, 10);
            return true;
        }
        else msg = "* §cYou have no saved Death Coordinates to TP to";

        return false;
    }
}