import { world, system, TicksPerSecond, MinecraftDimensionTypes } from "@minecraft/server";
import * as gVar from './globalVars.js';
import {subscriptionsActivate} from './subscribe.js';


//==============================================================================
//TODO:
//Validate above watchFor so I do not have to keep checking in code 
gVar.watchFor.validated = true;
//test for how many ticks before msg shows up.
//if (gVar.debug) { for (let i = 1; i <= 100; i++) system.runTimeout(() => { world.sendMessage(`${i}`); }, i); }
//==============================================================================
if (gVar.watchFor.validated) {
    subscriptionsActivate();
    //chatSend_before (); still beta as of 1.15.0
}
//==============================================================================
