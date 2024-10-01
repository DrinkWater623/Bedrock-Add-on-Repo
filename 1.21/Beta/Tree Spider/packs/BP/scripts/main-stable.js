//@ts-check
import { dev, pack, alertLog } from './settings.js';
import * as subs from './subscribes.js';
//==============================================================================
export function main_stable () {

    if (pack.hasChatCmd === -1) // no beta
        alertLog.success(`§aInstalling Add-on ${pack.packName} - §bStable ${pack.isLoadAlertsOn ? '§c(Debug Mode)' : ''}`, dev.debugPackLoad || pack.isLoadAlertsOn);

    //clearing scoreboards
    if (dev.debugGamePlay || dev.debugEntityAlert || dev.debugEntityActivity || dev.debugLoadAndSpawn)
        subs.beforeEvents_worldInitialize();

    //debug scoreboards and stalled interval
    subs.afterEvents_worldInitialize();

    //Re-Inits - the ticks of the entity
    subs.afterEvents_entityLoad();
    subs.afterEvents_entitySpawn();

    if (dev.debugGamePlay || dev.debugEntityActivity || dev.debugEntityAlert)
        subs.afterEvents_entityDie();

    if (dev.debugLoadAndSpawn)
        subs.beforeEvents_entityRemove(); //only involves removing from watchFor scoreboard

    if (dev.debugGamePlay || dev.debugEntityActivity || dev.debugEntityAlert)
        subs.afterEvents_entityRemove();
}
//==============================================================================
//Note: any non-obj code (loose) run where this is imported... be mindful
//console.error('§cI should never see this message in main-stable.js')

