//@ts-check
import { dev, pack, alertLog } from './settings.js';
import * as subs from './subscribes.js';
//==============================================================================
export function main_stable () {

    if (pack.hasChatCmd === -1) // no beta
        alertLog.success(`§aInstalling Add-on ${pack.packName} - §bStable ${pack.isLoadAlertsOn ? '§c(Debug Mode)' : ''}`, dev.debugPackLoad || pack.isLoadAlertsOn);

    subs.beforeEvents_worldInitialize();
    subs.afterEvents_worldInitialize();
    subs.afterEvents_entitySpawn();
    subs.afterEvents_entityLoad();
    subs.beforeEvents_entityRemove();
    subs.afterEvents_entityRemove();
}
//==============================================================================
//Note: any non-obj code (loose) run where this is imported... be mindful
//console.error('§cI should never see this message in main-stable.js')

