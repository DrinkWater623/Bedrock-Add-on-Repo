// shelter  Element Affinity Minecraft Bedrock Add-on
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T. (https://www.gnu.org/licenses/gpl-3.0.html)
URL: https://github.com/DrinkWater623
========================================================================
TODO: 

// ========================================================================
Change Log:
    20260102 - Created
========================================================================*/
// Minecraft
import { Dimension, Player } from "@minecraft/server";
// Shared.
import { DynamicPropertyLib, randomArrayItem, } from "../common-stable/tools/index.js";
// Local
import { dev } from "../debug.js";
import { Blocks,BlockTypeIds } from "../common-stable/gameObjects/index.js";
import { shelterBuild } from "../common-stable/builders/index.js";
import { ElementBlocks } from "./cachedData.js";
//==============================================================================
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/**
 * @typedef {{ inner: number, outer: number }} BlockData
 * @typedef {{ NW: BlockData, NE: BlockData, SW: BlockData, SE: BlockData }} DirTable
 * @typedef {{ get(d?: string): string }} DirHelper
 */
//=========================================================================================
//  This point and below is just a USER of the above and will later not be in the same file
//  The above will turn into a class or something
//=========================================================================================
/**
 * 
 * @param {Player} player 
 * @param {string} [type='shack'] 
 */
export function shelter (player, type = 'shack') {
    const element = DynamicPropertyLib.getString(player, 'element');

    if (type == 'house') { house(element, player.dimension, player.location, 2, 4, 9, true); return; }
    if (type == 'starter') { house(element, player.dimension, player.location, 2, 4, 7, true); return; }
    if (type == 'building') { house(element, player.dimension, player.location, 4, 6, 11, false); return; }

    shack(element, player.dimension, player.location);
    return;
}
/**
 * @param {string} dimensionId 
 * @param {{ blocks: string[]; ladder: string; light: string; }} [opts={blocks:[''],ladder:'',light:''}] 
 */
function elementNoneMaterials (dimensionId, opts = { blocks: [ '' ], ladder: '', light: '' }) {
    if (dimensionId == 'nether') {
        opts.blocks = [ 'gravel', 'netherrack', 'blackstone', 'magma', 'basalt' ];
        opts.ladder = 'minecraft:twisting_vine';
        opts.light = 'shroomlight';
    }
    else if (dimensionId == 'the_end') {
        opts.blocks = [ 'end_stone', 'purpur_block', 'end_bricks' ];
        opts.ladder = 'minecraft:scaffolding';
        opts.light = 'end-rod';
    }
    else {
        opts.blocks = [ ...BlockTypeIds.getDirtyBlockTypeIds(), 'gravel', 'cobblestone', 'clay_block', ...BlockTypeIds.getLeafBlockTypeIds() ];
        opts.ladder = 'minecraft:ladder';
        opts.light = 'lit_pumpkin';
    }
    Blocks.addSlabVariantsInPlace(opts.blocks, { verify: true });
}
/**
 * 
 * @param {string} element 
 * @param {Dimension} dimension
 * @param {Vector3} locationCenter 
 * @param {number} [stories=2] 
 * @param {number} [roomHeight=4] 
 * @param {number} [roomLength=9] 
 * @param {boolean} [basement=false] 
 *  
 */
export function house (element, dimension, locationCenter, stories = 2, roomHeight = 4, roomLength = 9, basement = false) {
    //other ides - outpost with equipment (buy those)

    const opts = { height: roomHeight * stories + 1, length: roomLength, blocks: [ '' ], ladder: '', light: '' };

    if (element == 'air') {
        opts.blocks = [ ...ElementBlocks.getElementShelterBlockTypeIds('air') ];
        opts.ladder = 'any';
        opts.light = 'end_rod';
    }
    else if (element == 'earth') {
        opts.blocks = [ ...ElementBlocks.getElementShelterBlockTypeIds('earth') ];
        opts.ladder = randomArrayItem([ 'minecraft:scaffolding', 'minecraft:vine', 'minecraft:ladder' ]) ?? 'minecraft:vine';
        opts.light = 'lit_pumpkin';
    }
    else if (element == 'fire') {
        opts.blocks = [ ...ElementBlocks.getElementShelterBlockTypeIds('fire') ];
        opts.ladder = randomArrayItem([ 'twisting_vine', 'weeping_vine' ]) ?? 'twisting_vine';
        opts.light = randomArrayItem([ 'shroomlight', 'glowstone' ]) ?? 'shroomlight';
    }
    else if (element == 'water') {
        opts.blocks = [ ...ElementBlocks.getElementShelterBlockTypeIds('water') ];
        opts.ladder = 'minecraft:flowing_water';
        opts.light = 'sea_lantern';
    }
    else {
        elementNoneMaterials(dimension.id, opts);
    }
    shelterBuild(opts.blocks, opts.ladder, opts.light, dimension, locationCenter, opts.height, opts.length);
}
//==============================================================================
/**
 * 
 * @param {string} element 
 * @param {Dimension} dimension
 * @param {Vector3} locationCenter 
 */
export function shack (element, dimension, locationCenter) {

    const opts = { height: 5, length: 7, blocks: [ '' ], ladder: '', light: '' };

    if (element == 'air') {
        opts.blocks = [ 'minecraft:glass', ...BlockTypeIds.getLeafBlockTypeIds() ];
        opts.ladder = 'any';
        opts.light = 'end_rod';
    }
    else if (element == 'earth') {
        opts.blocks = [ 'clay', 'clay_block', 'gravel', ...BlockTypeIds.getDirtyBlockTypeIds(), ...BlockTypeIds.getNaturalOverworldStoneBlockTypeIds(), ...BlockTypeIds.getLeafBlockTypeIds(), ...BlockTypeIds.getOverworldLogBlockTypeIds() ];
        opts.ladder = 'minecraft:vine';
        opts.light = 'lit_pumpkin';
    }
    else if (element == 'fire') {
        opts.blocks = [ ...BlockTypeIds.getNetherLogBlockTypeIds() ];
        opts.ladder = 'twisting_vine';
        opts.light = 'shroomlight';
    }
    else if (element == 'water') {
        opts.blocks = [ ...BlockTypeIds.getDeadCoralBlockTypeIds() ];
        opts.ladder = 'minecraft:flowing_water';
        opts.light = 'sea_lantern';
    }
    else {
        elementNoneMaterials(dimension.id, opts);
    }

    shelterBuild(opts.blocks, opts.ladder, opts.light, dimension, locationCenter, opts.height, opts.length);
}
//==============================================================================
