import { TimeOfDay, WeatherType, GameMode } from '@minecraft/server';
import * as game from './game_settings.js';
import * as lib from './lib.js';

export function adminCommands (player, messageCmd) {
    //privilege assumed
    
    if (colonCmds(player,messageCmd.toLowerCase())) return true

    player?.sendMessage(`§bChecking admin commands ${messageCmd}`);
   // let runCommand = "";

    //simple commands
    switch (messageCmd.toLowerCase()) {
        case 'c':
            game.gameModeSet(GameMode.creative, player, true);
            return true;
        case 'spy':
            game.gameModeSet(GameMode.spectator, player, true);
            return true;
        case 'thunder':
            game.weatherSet(WeatherType.Thunder, player, true);
            return true;
    }

    // if (runCommand.length > 0) {
    //     player?.dimension.runCommand(runCommand);
    //     //stuff
    //     return;
    // }

    return false
}
export function colonCmds (player, messageCmd) {

    if (chatCmds(player, messageCmd)) return true

    //player?.sendMessage("§bChecking colon commands ${messageCmd}");

    switch (messageCmd.toLowerCase()) {
        case 'a':
            game.gameModeSet(GameMode.adventure, player, true);
            return true;
        case 'clear':
            game.weatherSet(WeatherType.Clear, player, true);
            return true;        
        case 'day':
            game.timeOfDaySet(TimeOfDay.Day);
            return true;        
        case 'midnight':
            game.timeOfDaySet(TimeOfDay.Midnight);
            return true;
        case 'night':
            game.timeOfDaySet(TimeOfDay.Night);
            return true;
        case 'noon':
            game.timeOfDaySet(TimeOfDay.Noon);
            return true;
        case 'rain':
            game.weatherSet(WeatherType.Rain, player, true);
            return true;
        case 's':
            game.gameModeSet(GameMode.survival, player, true);
            return true;
        case 'sunrise':
            game.timeOfDaySet(TimeOfDay.Sunrise);
            return true;
        case 'sunset':
            game.timeOfDaySet(TimeOfDay.Sunset);
            return true;
    }

    return false;

}
export function chatCmds (player, messageCmd) {

    //player?.sendMessage(`§bChecking chat commands ${messageCmd}`);

    switch (messageCmd.toLowerCase()) {       
        case 'cls':
            lib.spamEmptyLines(40, player);
            return true;
        case 'lop':
            lib.listPlayers(player);
            return true;
        case 'lp':
            lib.listPlayers(null);
            return true;
    }

    return false;
}