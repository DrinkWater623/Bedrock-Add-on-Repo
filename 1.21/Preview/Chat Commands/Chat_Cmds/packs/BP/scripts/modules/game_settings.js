import {world, system, TicksPerSecond } from '@minecraft/server';


//These function are share between modules
//They are not in lib because they are not general enough

export function gameModeSet (gm = "", player, warn = false) {
    if (player.getGameMode() != gm) system.runTimeout(() => { player.setGameMode(gm); }, TicksPerSecond);
    else if (warn) player?.sendMessage(`§cYou are already in ${gm} mode`);
}

export function timeOfDaySet (tod = 0) {
    system.runTimeout(() => { world.setTimeOfDay(tod); }, TicksPerSecond / 4);
}

export function weatherSet (weather = "", player, warn = false) {

    if (player?.dimension.id != "overworld") {
        if (warn) player?.sendMessage(`§cMust be in the overworld to change the overworld's weather`);
        return;
    }

    if (player?.dimension.getWeather() != weather) 
        system.runTimeout(() => { player.dimension.setWeather(weather); }, TicksPerSecond / 2);
    else if (warn) player?.sendMessage(`§cWeather is already ${weather}`);

}
