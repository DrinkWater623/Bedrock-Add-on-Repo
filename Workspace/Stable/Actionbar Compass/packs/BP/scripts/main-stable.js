//@ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: MIT
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20250109 - ReDone
========================================================================
*/
import { world, system } from "@minecraft/server";
import { alertLog, dev, pack } from "./settings";
import { display, tagHelp, tagToggle } from "./functions";
import { round } from "./common-other/mathLib";
//=============================================================================
export function main_stable () {

    if (pack.hasChatCmd < 0) {
        pack.hasChatCmd = 0;

        if (!pack.gameRuleShowCoordinates && world.gameRules.showCoordinates)
            system.run(() => { world.gameRules.showCoordinates = false; });
    }

    world.afterEvents.playerSpawn.subscribe((event) => {

        const initializedTag = pack.commandPrefix + 'Initialized';
        if (!event.player.hasTag(initializedTag)) {
            system.runTimeout(() => {
                event.player.addTag(initializedTag);

                //everyone starts with this.
                if (pack.newPlayer_Settings.auto_on.compass)
                    event.player.addTag(pack.tags.compassTag);

                if (pack.newPlayer_Settings.auto_on.xyz || world.gameRules.showCoordinates == false) {
                    event.player.addTag(pack.tags.xyzTag);
                }

                if (pack.newPlayer_Settings.auto_on.velocity)
                    event.player.addTag(pack.tags.velocityTag);
            }, round(pack.loadDelay * 0.5, 0));
        }
        else if (!world.gameRules.showCoordinates && !event.player.hasTag(pack.tags.xyzTag))
            tagToggle(event.player, pack.tags.xyzTag, 'XYZ Coordinates')


        if (pack.hasChatCmd == 1) {
            system.runTimeout(() => { tagHelp(event.player); }, pack.loadDelay);
        }
    });

    system.runInterval(() => {
        world.getAllPlayers()
            .filter(p =>
                p.hasTag(pack.tags.compassTag) ||
                p.hasTag(pack.tags.xyzTag) ||
                p.hasTag(pack.tags.velocityTag)
            )
            .forEach(p => { display(p); });
    }, pack.tickDelay);

    if (!pack.isBeta) {// no beta
        dev.anyOn();
        alertLog.success(`§aInstalled Add-on ${pack.packName} - §bStable ${dev.debug ? '§c(Debug Mode)' : ''}`, dev.debugPackLoad || pack.isLoadAlertsOn);
    }
}
//=============================================================================
main_stable();
//=============================================================================
// End of File
//=============================================================================
