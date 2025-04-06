//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
import { Direction, world } from "@minecraft/server";
import { FaceLocationGrid, Vector2Lib, rotationToCardinalDirection} from "./common-stable/vectorClass.js";
import { alertLog, chatLog, dev, pack, watchFor } from './settings.js';
import { placeDw623Slab } from "./fn-stable.js";
import { mcNameSpace } from "./common-data/globalConstantsLib.js";
import { beforeEvents_playerPlaceBlock } from "./events-beta/playerPlaceBlock.js";
//=============================================================================
export function beforeEvents_playerPlaceBlock_subscribe () {
    //This event is still beta as of 1.21.50
    alertLog.success('Subscribing to§r world.beforeEvents.playerPlaceBlock - §6Beta', dev.debugSubscriptions);

    world.beforeEvents.playerPlaceBlock.subscribe((event) => {
        beforeEvents_playerPlaceBlock(event);
 });
}
//=============================================================================
// End of File
//=============================================================================