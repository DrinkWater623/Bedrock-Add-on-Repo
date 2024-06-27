import { world, Player } from '@minecraft/server';

export function listPlayers (excludePlayer = null) {
    if (!(excludePlayer instanceof Player)) excludePlayer = null;

    //world.sendMessage("§g function listPlayers");

    const players = world.getAllPlayers().filter(p => !Object.is(excludePlayer, p)).map(p => p.name);
    if (players.length == 0) return;

    players.sort();
    let message = "§6\n\nPlayer List:§r";
    for (let i = 0; i < players.length; i++) {
        message += `\n${i} - ${players[ i ]}`;
    }
    message +="\n\n\n"
    world.sendMessage(`${message}`)
}
export function listOtherPlayers (player) {
    if ( player instanceof Player) listPlayers(player);
}

export function spamEmptyLines (numOfLines = 40, chatSend = world) {
    let msg = "";
    for (let i = 0; i < numOfLines; i++) msg += "\n";
    chatSend.sendMessage(msg);
};

/*
listArray (array = {}, chatSend = world) {
    if (!this.debugOn) return;
    if (!Array.isArray(array)) return;
    if (!this.#isValidChatSend(chatSend)) return;

    this.#log(`Array List: (${array.length})`, chatSend);
    for (const key of array) {
        this.#log(`==> ${key}`, chatSend);
    }
};  */