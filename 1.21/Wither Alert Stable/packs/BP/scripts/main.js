import { world, TicksPerSecond, system } from "@minecraft/server";
import * as gVar from './globalVars.js';
import * as subscribe from './subscribe.js';
import * as fn from './functions.js';
//import * as beta from './beta.js';
//==============================================================================
//TODO:
//Validate above watchFor so I do not have to keep checking in code 
gVar.watchFor.validated = true;
//test for how many ticks before msg shows up.
//if (gVar.debug) { for (let i = 1; i <= 100; i++) system.runTimeout(() => { world.sendMessage(`${i}`); }, i); }
//==============================================================================
if (gVar.watchFor.validated)
    world.afterEvents.worldInitialize.subscribe((event) => {
        fn.spamEmptyLines(5, world);
        if (gVar.debug) world.sendMessage("§aWorldInitialize.subscribe Step 0");
        //-----------------------------------------------------
        //setup to capture
        system.runTimeout(() => {
            if (gVar.debug) world.sendMessage("§gInitialize Step 1");
            subscribe.entityRemove_before();
            subscribe.entityDie_after();
        }, 1);
        //turn right back off if alert is not on
        if (!world.getDynamicProperty(gVar.watchFor.dynamicPropertyName))
            system.runTimeout(() => {
                if (gVar.debug) world.sendMessage("§gInitialize Step 2");
                fn.callBacks_deactivate();
            }, 2);
        //now this should only be turned on and off ny the startWatchLoop/watchLoop
        //-----------------------------------------------------
        system.runTimeout(() => {
            if (gVar.debug) world.sendMessage("§gInitialize Step 3");
            let timer = 1;

            if (world.getDynamicProperty(gVar.watchFor.dynamicPropertyName)) {
                fn.spamEmptyLines(5, world);
                world.sendMessage("World is Re-Initialized via Script Re-Load");

                world.setDynamicProperty(gVar.watchFor.dynamicPropertyName, false);

                //this gives it time to activate on it's own for explosions
                //Note: this will only be used if a /reload happens, else entityLoad will pick up
                //because over 100-200 ticks until chunk loads when world starts, whereas reload is faster
                system.runTimeout(() => {
                    if (gVar.debug) world.sendMessage("§fInitialize Step 3a");
                    //if nothing else re-activated it, go check myself - direct to watchLoop
                    if (!world.getDynamicProperty(gVar.watchFor.dynamicPropertyName)) {
                        world.sendMessage(`§aChecking...`);
                        fn.watchLoop("worldInitialize");
                    }
                }, gVar.reloadTime);

                timer += gVar.reloadTime;
            }
            else if (gVar.debug) world.sendMessage("§cAlert Not On - so No Step 3a");

            world.setDynamicProperty(gVar.watchFor.dynamicPropertyName, false);

            system.runTimeout(() => {
                if (gVar.debug) world.sendMessage("§gInitialize Step 3b");
                subscribe.entityLoad_after();
                subscribe.entitySpawn_after();
            }, timer);
        }, 3);
    });

//==============================================================================
//subscribe.worldInitialize_after(watchFor);
//==============================================================================
//beta.chatSend_before(watchFor)
//==============================================================================
// subscribe.entityRemove_before(watchFor); // To save entity info
//subscribe.entityDie_after(watchFor);
// subscribe.entityLoad_after(watchFor);
// subscribe.entitySpawn_after(watchFor);
//subscribe.explosion_after(watchFor);
//==============================================================================
/*
    Need world load check for isWither was true when world loaded and if a tracking job was running
*/

