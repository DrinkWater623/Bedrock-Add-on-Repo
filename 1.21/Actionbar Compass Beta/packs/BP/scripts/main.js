import { world, system, TicksPerSecond } from "@minecraft/server";
/**
 * Default for each player is to show the compass action bar.  Tag disables it
 */
const noCompassTag = "noCompassActionBar";

function compassToggle (player) {   
    if (!player.removeTag(noCompassTag)) {
        player.addTag(noCompassTag);
        player.onScreenDisplay.setActionBar("ActionBar Compass turned §cOff");
    }
    else player.sendMessage("ActionBar Compass turned §aOn");
}

//this one gives same results - user preference
function directionTextGet_Hero (angle = 0) {
    //Thanks Herobrine64
    let display = "";
    if (Math.abs(angle) > 112.5) display += 'north ';
    if (Math.abs(angle) < 67.5) display += 'south ';
    if (angle < 157.5 && angle > 22.5) display += 'west';
    if (angle > -157.5 && angle < -22.5) display += 'east';
    return display.trim().replace(" ", "-");
};

//chose this one so I don't have to look at a lot of numbers
function directionTextGet_Wave (angle = 0) {
    //Thanks WavePlayz
    const s = 360 / 8;    
    const dirs = [
        "S",
        "S W",
        "W",
        "N W",
        "N",
        "N E",
        "E",
        "S E",
        "S" ];

    let dir = Math.round(angle / s);
    if (dir < 0) dir += 8;
    return dirs[ dir ]
        .replace("N", "north")
        .replace("S", "south")
        .replace("E", "east")
        .replace("W", "west")
        .replace(" ", "-");
}
world.beforeEvents.chatSend.subscribe((eventObject) => {
    if ([ ":abc", ":compass", ";abc", ";compass" ].includes(eventObject.message.toLowerCase())) {
        eventObject.cancel = true;
        system.run(() => { compassToggle(eventObject.sender); });
    }
});

world.afterEvents.playerSpawn.subscribe((event) => {
    system.runTimeout(() => {
        event.player.sendMessage(`ActionBar Compass is ${event.player.hasTag(noCompassTag) ? "§cOff" : "§aOn"} - §rType §d:abc§r in chat to toggle it §aon/§coff`);
    }, TicksPerSecond * 6);

});

system.runInterval(() => {
    world.getAllPlayers()
        .filter(p => !p.hasTag(noCompassTag))
        .forEach(p => {
            //broken out for readability
            const degrees = p.getRotation().y;
            const text = directionTextGet_Wave(degrees);
            p.onScreenDisplay.setActionBar(`§6${text}`);
        });
}, 15);