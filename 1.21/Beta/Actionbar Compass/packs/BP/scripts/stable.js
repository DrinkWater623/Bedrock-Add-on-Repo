import { world, system, TicksPerSecond } from "@minecraft/server";

system.runInterval(() => {
    world.getAllPlayers()
        .forEach(p => {
            const dirs = [ "S", "S W", "W", "N W", "N", "N E", "E", "S E", "S" ];
            let dir = Math.round(p.getRotation().y / (360 / 8));
            if (dir < 0) dir += 8;
            const text = dirs[ dir ]
                .replace("N", "north")
                .replace("S", "south")
                .replace("E", "east")
                .replace("W", "west")
                .replace(" ", "-");

            p.onScreenDisplay.setActionBar(`§6${text}`);
        });
}, 15);