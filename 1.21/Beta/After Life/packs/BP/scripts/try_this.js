import { world, system } from '@minecraft/server';

let playerIntervals = {};

// Function to create and assign an interval to a player
function createIntervalForPlayer(playerId) {
    // Only create a new interval if it doesn't already exist for this player
    if (playerIntervals[playerId]) return;

    let runId = system.runInterval(() => {
        let player = world.getEntity(playerId);
        if (player) {
            // Perform player-specific actions, e.g., logging every second
            console.log(`Interval running for player with ID: ${player.id} - ${player.name}`);
        } else {
            // If the player is no longer in the world, clear the interval
            console.log(`Player Gone - Canceling job: ${playerId}`);
            system.clearRun(runId);
            delete playerIntervals[playerId];
        }
    }, 10); // 20 ticks = 1 second

    // Store the player's interval run ID
    playerIntervals[playerId] = runId;
    console.log(`Interval assigned to player ${playerId}`);
}

// Player join event handling
world.afterEvents.playerJoin.subscribe((eventData) => {
    // Assign an interval to the player only if it's not already assigned
    createIntervalForPlayer(eventData.playerId);
});

// Player leave event handling (before the player leaves)
world.beforeEvents.playerLeave.subscribe((eventData) => {
    let player = eventData.player;

    // If the player has an interval running, we stop it and remove it from the list
    if (playerIntervals[player.id]) {
        system.clearRun(playerIntervals[player.id]);
        delete playerIntervals[player.id];
        console.log(`(beforeEvents.playerLeave) Interval stopped for player ${player.id} - ${player.name}`);
    }
});

world.afterEvents.playerLeave.subscribe((eventData) => {    
    console.log(`afterEvents.playerLeave - for player ${eventData.playerId} - ${eventData.playerName}`);    
});