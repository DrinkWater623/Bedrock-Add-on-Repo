//@ts-check
import { world, system, TicksPerSecond } from "@minecraft/server";
import { dev, alertLog, watchFor } from './settings.js';
import { ScoreboardLib } from "./commonLib/scoreboardClass.js";
import { entityActivityUpdate, timersToggle, stalledEntityFix, counts } from './fn-stable.js';
//==============================================================================
const sbName_load = dev.debugScoreboardName + '_load_tick';
const sbName_spawn = dev.debugScoreboardName + '_spawn_tick';
let sb_load = world.scoreboard.getObjective(sbName_load);
let sb_spawn = world.scoreboard.getObjective(sbName_spawn);
//==============================================================================
export function beforeEvents_worldInitialize () {

    alertLog.success("§aInstalling beforeEvents.worldInitialize §c(debug mode : tick scoreboard)", dev.debugSubscriptions);

    world.beforeEvents.worldInitialize.subscribe((event) => {
        //list of scoreboards to reset
        const scoreboards = world.scoreboard.getObjectives();
        scoreboards.forEach(sb => {
            if ([ dev.debugScoreboardName, watchFor.scoreboardName, sbName_load, sbName_spawn ].includes(sb.id)) {
                const participants = sb.getParticipants();
                world.sendMessage(`clearing sb ${sb.displayName}`);
                participants.forEach(p => {
                    system.run(() => { sb.removeParticipant(p); });
                });
            }
        });
    });
}
//==============================================================================
export function afterEvents_worldInitialize () {

    alertLog.success("§aInstalling afterEvents.worldInitialize §c(debug mode : tick scoreboard)", dev.debugSubscriptions);

    world.afterEvents.worldInitialize.subscribe((event) => {

        //---
        watchFor.scoreboard = world.scoreboard.getObjective(watchFor.scoreboardName);
        if (!watchFor.scoreboard) {
            watchFor.scoreboard = ScoreboardLib.create(watchFor.scoreboardName, watchFor.scoreboardDisplayName);
        }

        //---        
        dev.debugScoreboard = world.scoreboard.getObjective(dev.debugScoreboardName);
        if (!dev.debugScoreboard)
            dev.debugScoreboard = ScoreboardLib.create(dev.debugScoreboardName, dev.debugScoreboardDisplayName);

        // dev.debugScoreboard?.setScore('loadedSpiders', 0);
        // dev.debugScoreboard?.setScore('stalledSpiders', 0);

        //---
        //so I can toggle on/off
        dev.debugTimeCountersRunId = ScoreboardLib.systemTimeCountersStart(dev.debugScoreboardName);
        dev.debugTimeCountersOn = !!dev.debugTimeCountersRunId;
        //TODO: add to chat cmds to toggle;
        if (dev.debugGamePlay || dev.debugEntityAlert || dev.debugEntityActivity)
            system.runTimeout(() => { ScoreboardLib.sideBar_set(dev.debugScoreboardName); }, 5);
        else {
            ScoreboardLib.sideBar_clear();
            timersToggle(); //off
        }

        if (dev.debugLoadAndSpawn) {

            sb_load = world.scoreboard.getObjective(sbName_load);
            if (!sb_load) {
                world.scoreboard.addObjective(sbName_load);
                sb_load = world.scoreboard.getObjective(sbName_load);
            }

            sb_spawn = world.scoreboard.getObjective(sbName_spawn);
            if (!sb_spawn) {
                world.scoreboard.addObjective(sbName_spawn);
                sb_load = world.scoreboard.getObjective(sbName_spawn);
            }
        }

        //Start testing for stalled entities every x min after y delay 
        system.runTimeout(() => {
            system.runInterval(() => { stalledEntityFix(); }, TicksPerSecond * 60 * watchFor.stalledCheckInterval);
        }, TicksPerSecond * 60 * watchFor.stalledCheckStartDelay);

        system.runTimeout(() => { counts(); }, TicksPerSecond * 10);
    });
}
//==============================================================================
export function afterEvents_entityLoad () {
    //Load (195 ticks or so )is after Spawn
    //not needed unless
    if (dev.debugLoadAndSpawn) {
        alertLog.success("§aInstalling afterEvents.entityLoad §c(debug mode : tick scoreboard)", dev.debugSubscriptions);

        world.afterEvents.entityLoad.subscribe((event) => {

            if (!event.entity) return;

            if ([ 'player', watchFor.typeId ].includes(event.entity.typeId))
                if (dev.debugLoadAndSpawn) sb_load?.setScore(event.entity, system.currentTick);

            if (event.entity.typeId === watchFor.typeId) {
                entityActivityUpdate(event.entity);
            }

        });
    }
}
//==============================================================================
export function afterEvents_entitySpawn () {
    //Spawn is before Load
    alertLog.success("§aInstalling afterEvents.entitySpawn §c(debug mode : tick scoreboard)", dev.debugSubscriptions);

    world.afterEvents.entitySpawn.subscribe((event) => {

        if (!event.entity) return;

        if ([ 'player', watchFor.typeId ].includes(event.entity.typeId))
            if (dev.debugLoadAndSpawn) sb_load?.setScore(event.entity, system.currentTick);

        if (event.entity.typeId === watchFor.typeId) entityActivityUpdate(event.entity);

    });
}
//==============================================================================
export function beforeEvents_entityRemove () {

    alertLog.success("§aInstalling beforeEvents.entityRemove §c(debug mode : tick scoreboard)", dev.debugSubscriptions);

    world.beforeEvents.entityRemove.subscribe((event) => {
        //does not mean died 

        if (event.removedEntity)
            if (event.removedEntity.typeId === watchFor.typeId)
                system.run(() => {
                    if (watchFor.scoreboard && watchFor.scoreboard.isValid())
                        watchFor.scoreboard.removeParticipant(event.removedEntity);
                });

    });
}
export function afterEvents_entityRemove () {

    if (dev.debugEntityActivity || dev.debugEntityAlert || dev.debugGamePlay || dev.debugLoadAndSpawn) {
        alertLog.success("§aInstalling beforeEvents.entityRemove §c(debug mode : tick scoreboard)", dev.debugSubscriptions);
        world.afterEvents.entityRemove.subscribe((event) => {
            if (event.typeId === watchFor.typeId) counts();
        });
    }
}
