// fn-debug.js Tree Spiders
//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20251108 
========================================================================*/
import { Block, Direction, Player } from "@minecraft/server";
import { alertLog, chatLog, pack, packDisplayName } from "../settings.js";
import { FaceLocationGrid, } from "../common-stable/blocks/blockFace.js";
import { Vector2Lib, Vector3Lib } from "../common-stable/tools/vectorClass.js";
import { DebuggerBlocks } from "../common-stable/tools/debuggerBlocks.js";

//==============================================================================
/** @typedef {import("@minecraft/server").Vector2} Vector2 */
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** @typedef {import("@minecraft/server").VectorXZ} VectorXZ */
//==============================================================================
// JSDoc Makes the squiggly red lines go away....
//==============================================================================
const debuggerBlocks = new DebuggerBlocks(packDisplayName);
//==============================================================================
/**
 * @param {Player} player 
 * @param {Block} block 
 * @param {Direction} [blockFace] 
 * @param {Vector3} [faceLocation] 
 * @param {string} [title] 
 */
export function blockInfo_show (player, block, blockFace, faceLocation, title = '') {
    const debug = false;
    const info = {};

    if (block) {
        debuggerBlocks.blockInfo(block,player);
        if (block.isValid) {
            info.skyLightLevel = block.getSkyLightLevel();
        }
    }
    if (blockFace && faceLocation) {
        debuggerBlocks.blockFaceLocationInfo(blockFace, faceLocation, player, [ 2, 3, 4, 5, 6, 7, 8 ]);
    }

    chatLog.log(`
\n§a****************************************
§cLight Bar (BeforeOnPlayerPlace) Info§r
§a****************************************
§rInteract Block: §1${interactBlock.typeId}§r @ ${interactBlockLocationStr}  §dFace Loc: ${faceLocationStr}
§rPlayer:  Geo ${Vector3Lib.toString(grid.playerLocation, 0, true)} - Facing: §b${grid.playerCardinalDirection}
§rBlock Face: ${blockFace} - §6as ${grid.blockFace}
        `);
}