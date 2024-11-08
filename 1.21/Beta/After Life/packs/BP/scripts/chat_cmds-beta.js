import { world, system, Player, ChatSendBeforeEvent, TicksPerSecond, EffectTypes } from "@minecraft/server";
import { dev} from './settings.js';
import { dimensionSuffix,clearPlayerChatWindow,clearWorldChatWindow } from './fn-stable.js';
import { Vector3Lib } from "./commonLib/vectorClass.js";
//==============================================================================
const TicksPerMinute = TicksPerSecond * 60;
//==============================================================================
export class PlayerChatCommands {
    constructor(cmdPrefix = ':') {
        this.cmdPrefix = cmdPrefix;
    }
    /**
     * @param {ChatSendBeforeEvent } event
     */
    processEvent (event) {
        if (!(event instanceof ChatSendBeforeEvent)) return false;
        if (!event.message.startsWith(this.cmdPrefix)) return false;
        event.cancel;

        let message = event.message.replaceAll(this.cmdPrefix, '').toLowerCase().replaceAll(' ', '');
        return this.processCommand(event.sender, message);
    }
    /**
    * @param { Player } player
    */
    processCommand (player, command = "") {
        if (!(player instanceof Player)) return false;

        switch (command) {
            //last death info
            case '':
            case '?':
            case "q":
            case "where": this.#query(player); return true;
            //clear info on last death
            case "clear": this.#clearLastDeathVars(player); return true;
            case "cls": clearPlayerChatWindow(player, 40, 10); return true;
        }

        if (player.isOP() && dev.debug) {
            switch (command) {
                case "cleardv": player.clearDynamicProperties();; return true;
                case "cleardvw": world.clearDynamicProperties();; return true;
                case "killme": this.#killMe(player); return true; 
                case "list": debugDynamicPropertiesList(player); return true;
                case "listw": debugDynamicPropertiesList(world); return true;
                case "summon": this.#spawnBot(player); return true;
                case "tpme": this.#tpMe(player); return true;
            }
        }

        if (player.isOp()) {
            let subCommand = "tpplayer";

            if (command.startsWith(subCommand)) {
                command = command.removeAll(subCommand);

                if (!command || command.startsWith('?')) {
                    const playerList = world.getAllPlayers().filter(p => { p.isValid() && !!p.getDynamicProperty(dynamicVars.deathDimension); });
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
     * @param { Player } player
     */
    #spawnBot(player){
        clearWorldChatWindow();
        player.sendMessage(`debugSpawn currentTick: ${system.currentTick}`);
        launchDeathBots(player.dimension, player.location, player);
    }
    /**
     * @param { Player } player
     */
    #query (player) {
        let dimension = player.getDynamicProperty(dynamicVars.deathDimension);
        let msg = "";
        if (dimension) {
            dimension = dimensionSuffix(dimension);
            const location = player.getDynamicProperty(dynamicVars.deathCoordinates);
            msg = `* §gLast known §cDeath§g Coordinates: §b${dimension} §a@§g ${Vector3Lib.toString(location)}`;
        }
        else msg = "* §cYou have no saved Death Coordinates";

        sendMessageLater(`\n${msg}\n\n`, player, 10);
    }

    /**
     * @param { Player } player
     */
    #clearLastDeathVars (player) {
        let msg = "";
        //event.cancel;                
        if (player.getDynamicProperty(dynamicVars.deathDimension)) {
            msg = "* §eClearing your last saved §cDeath§e Coordinates";
            player.setDynamicProperty(dynamicVars.deathMsgWaiting, false);
            player.setDynamicProperty(dynamicVars.deathDimension, "");
        }
        else msg = "* §cYou have no saved Death Coordinates to clear";

        sendMessageLater(`\n${msg}\n\n`, player, 5);
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
        if (player.isValid() && player.getDynamicProperty(dynamicVars.deathDimension)) {
            system.runTimeout(() => {
                const dimension = world.getDimension(player.getDynamicProperty(dynamicVars.deathDimension));
                const location = player.getDynamicProperty(dynamicVars.deathCoordinates);

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