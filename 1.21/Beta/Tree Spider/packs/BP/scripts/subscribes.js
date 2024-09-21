//@ts-check
import { world, system, TicksPerSecond, Entity, ScoreboardObjective } from "@minecraft/server";
import { dev, alertLog, watchFor, pack } from './settings.js';
import { ScoreboardLib } from "./commonLib/scoreboardClass.js";
import { stalledEntityFix, counts } from './fn-stable.js';
import { DynamicPropertyLib } from "./commonLib/dynamicPropertyClass.js";
import { globalConstantsLib } from "./commonLib/globalConstantsClass.js";
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
            if ([ dev.debugScoreboardName,dev.debugBabyScoreboardName, watchFor.scoreboardName, sbName_load, sbName_spawn ].includes(sb.id)) {
                const participants = sb.getParticipants();
                alertLog.success(`Clearing Scoreboard ${sb.displayName}`, dev.debugPackLoad && (dev.debugEntityActivity || dev.debugEntityAlert));
                participants.forEach(p => { system.run(() => { sb.removeParticipant(p); }); });
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

        dev.debugBabyScoreboard = world.scoreboard.getObjective(dev.debugBabyScoreboardName);
        if (!dev.debugBabyScoreboard)
            dev.debugBabyScoreboard = ScoreboardLib.create(dev.debugBabyScoreboardName, dev.debugBabyScoreboardDisplayName);
        //---
        if (dev.debugEntityAlert || dev.debugEntityActivity) {
            dev.debugTimeCountersRunId = ScoreboardLib.systemTimeCountersStart(dev.debugScoreboardName, dev.debugTimers);
            system.runTimeout(() => { system.runInterval(() => { counts(); }, globalConstantsLib.TicksPerMinute); }, TicksPerSecond * 6);
            system.runTimeout(() => { ScoreboardLib.sideBar_set(dev.debugScoreboardName); }, TicksPerSecond * 7);
        }
        else if (dev.debugBabyAlert || dev.debugBabyActivity) {
            dev.debugTimeCountersRunId = ScoreboardLib.systemTimeCountersStart(dev.debugBabyScoreboardName, dev.debugTimers);
            system.runTimeout(() => { system.runInterval(() => { counts(); }, globalConstantsLib.TicksPerMinute); }, TicksPerSecond * 6);
            system.runTimeout(() => { ScoreboardLib.sideBar_set(dev.debugBabyScoreboardName); }, TicksPerSecond * 7);
        }
        else if (dev.debugGamePlay) {
            dev.debugTimeCountersRunId = ScoreboardLib.systemTimeCountersStart(dev.debugScoreboardName, dev.debugTimers);
            system.runTimeout(() => { system.runInterval(() => { counts(); }, globalConstantsLib.TicksPerMinute); }, TicksPerSecond * 6);
            system.runTimeout(() => { ScoreboardLib.sideBar_clear(); }, 4);
        }
        else {
            dev.debugTimeCountersRunId = 0;
            system.runTimeout(() => { ScoreboardLib.sideBar_clear(); }, 4);
        }
        dev.debugTimeCountersOn = !!dev.debugTimeCountersRunId;
        //---
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
        //---
        //Start testing for stalled entities every x min after y delay 
        system.runTimeout(() => {
            system.runInterval(() => { stalledEntityFix(); }, globalConstantsLib.TicksPerMinute * watchFor.stalledCheckInterval);
        }, globalConstantsLib.TicksPerMinute * watchFor.stalledCheckStartDelay);
    });
}
//==============================================================================
export function afterEvents_entityLoad () {
    //Load (195 ticks or so )is after Spawn    
    //if (dev.debugLoadAndSpawn) {
    alertLog.success("§aInstalling afterEvents.entityLoad §c(debug mode : tick scoreboard)", dev.debugSubscriptions);

    world.afterEvents.entityLoad.subscribe((event) => {
        if (event.entity && event.entity.typeId === watchFor.typeId) {
            welcomeBack(event.entity, sb_load);
            system.runTimeout(() => { counts(); }, 1);
        }
    });
    //}
}
//==============================================================================
export function afterEvents_entitySpawn () {
    //Spawn is before Load
    alertLog.success("§aInstalling afterEvents.entitySpawn §c(debug mode : tick scoreboard)", dev.debugSubscriptions);

    world.afterEvents.entitySpawn.subscribe((event) => {
        if (event.entity && event.entity.typeId === watchFor.typeId) {
            welcomeBack(event.entity, sb_spawn);
        }
    });
}
//==============================================================================
export function beforeEvents_entityRemove () {
    // Does NOT mean Died
    alertLog.success("§aInstalling beforeEvents.entityRemove §c(debug mode : tick scoreboard)", dev.debugSubscriptions);

    world.beforeEvents.entityRemove.subscribe((event) => {

        if (event.removedEntity)
            if (event.removedEntity.typeId === watchFor.typeId)
                if (watchFor.scoreboard && watchFor.scoreboard.isValid())
                    system.runTimeout(() => {
                        watchFor.scoreboard?.removeParticipant(event.removedEntity);
                    }, 1);
    });
}
//==============================================================================
export function afterEvents_entityRemove () {

    if (dev.debugEntityActivity || dev.debugEntityAlert || dev.debugGamePlay || dev.debugLoadAndSpawn) {
        alertLog.success("§aInstalling beforeEvents.entityRemove §c(debug mode : tick scoreboard)", dev.debugSubscriptions);
        world.afterEvents.entityRemove.subscribe((event) => {
            system.runTimeout(() => { counts(); }, 1);
        }, { entityTypes: [ watchFor.typeId ] });
    }
}
//==============================================================================
/**
 * 
 * @param {Entity} entity
 * @param {ScoreboardObjective|undefined} sbUpdate  
 */
function welcomeBack (entity, sbUpdate) {
    entity.setDynamicProperty(pack.lastActiveTick, system.currentTick);
    entity.setDynamicProperty(pack.lastWebActivityTick, 0);
    DynamicPropertyLib.add(entity, pack.websCreated, 0);  //initializes if undefined
    if (dev.debugLoadAndSpawn) sbUpdate?.setScore(entity, system.currentTick);
}