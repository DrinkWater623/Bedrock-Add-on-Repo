//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: MIT
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20250109 - redo
========================================================================*/
import { world, system } from "@minecraft/server";
import { alertLog, dev, pack } from "./settings";
import { display, tagHelp, tagToggle } from "./functions";
import { round } from "./common-other/mathLib";
//=========================================================
export function main_stable () {
    if (pack.hasChatCmd < 0) {
        pack.hasChatCmd = 0;

        if (!pack.gameRuleShowCoordinates && world.gameRules.showCoordinates)
            system.run(() => { world.gameRules.showCoordinates = false; });
    }

    world.afterEvents.playerSpawn.subscribe((event) => {
        if (event.initialSpawn) {
            const x = event.player.getDynamicProperty(pack.dynamicProperty);
            if (typeof x != 'boolean') {
                system.runTimeout(() => {
                    event.player.setDynamicProperty(pack.dynamicProperty, true);
                    event.player.addTag(pack.tags.facingTag);
                    if (pack.hasChatCmd == 0 || !world.gameRules.showCoordinates)
                        event.player.addTag(pack.tags.xyzTagTag);
                }, round(pack.loadDelay / 2));
            }
            else if (!world.gameRules.showCoordinates && !event.player.hasTag(pack.tags.xyzTag))
                tagToggle(event.player, pack.tags.xyzTag, 'XYZ Coordinates');

            if (pack.hasChatCmd == 1) {
                system.runTimeout(() => { tagHelp(event.player); }, pack.loadDelay);
            }
        }
    });

    system.runInterval(() => {
        world.getAllPlayers()
            .filter(p =>
                p.hasTag(pack.tags.facingTag) ||
                p.hasTag(pack.tags.xyzTag) ||
                p.hasTag(pack.tags.velocityTag) ||
                p.hasTag(pack.tags.viewTag)
            )
            .forEach(p => { display(p); });
    }, pack.tickDelay);

    system.runTimeout(() =>{
        if (!pack.isBeta) {// no beta
            dev.anyOn();
            alertLog.success(`§aInstalled Add-on ${pack.packName} - §bStable ${dev.debug ? '§c(Debug Mode)' : ''}`, dev.debugPackLoad || pack.isLoadAlertsOn);
        }

    },1)
}
//=========================================================
main_stable();
//=============================================================================
// End of File
//=============================================================================
