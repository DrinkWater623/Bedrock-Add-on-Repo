//@ts-check
import { world, system } from "@minecraft/server";
import { dev, alertLog } from './settings.js';
import { ScoreboardLib } from "./commonLib/scoreboardClass.js";
//==============================================================================
export function afterEvents_worldInitialize () {

    alertLog.success("§aInstalling afterEvents.worldInitialize §c(debug mode : tick scoreboard)", dev.debugSubscriptions);

    world.afterEvents.worldInitialize.subscribe((event) => {
        ScoreboardLib.create(dev.debugScoreboardName, dev.debugScoreboardDisplayName);
        
        dev.debugScoreboard = world.scoreboard.getObjective(dev.debugScoreboardName)
        
        system.runTimeout(() => {
            ScoreboardLib.tickCounterStart(dev.debugScoreboardName, 'ticks', 1, 1);
        }, 1);

        if (dev.debugGamePlay || dev.debugEntityAlert)
            system.runTimeout(() => { ScoreboardLib.sideBar_set(dev.debugScoreboardName); }, 5);
        else {ScoreboardLib.sideBar_clear()}

    });
}
//==============================================================================