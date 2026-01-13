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
import { Blocks } from "../common-stable/gameObjects/index.js";
import { shelterBuild } from "../common-stable/structures/index.js";
// Local
import { dev } from "../debug.js";
import { ElementBlocks } from "./cachedData.js";
import { BlockTypeIds } from "../common-data/BlockTypeIds.js";
//==============================================================================
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/**
 * @typedef {{ inner: number, outer: number }} BlockData
 * @typedef {{ NW: BlockData, NE: BlockData, SW: BlockData, SE: BlockData }} DirTable
 * @typedef {{ get(d?: string): string }} DirHelper
 */
/** 
 * @typedef {{
 *      floors?:number,
 *      roomHeight?:number,
 *      depthWidth?:number,
 *      basement?:boolean,
 *      pyramidRoof?:boolean,
 *      materialPool?:string[]
 *      climbingMaterialPool?:string[]
 *      floorLight?:string,
 *      ceilingLight?:string,
 *      roofLight?:string
 * }} ShelterBuildOptions
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
 * @param {ShelterBuildOptions} [opts] 
 */
function elementNoneMaterials (dimensionId, opts={}) {
    if (dimensionId == 'nether') {
        opts.materialPool = [ 'gravel', 'netherrack', 'blackstone', 'magma', 'basalt' ];
        opts.climbingMaterialPool = ['minecraft:twisting_vine'];
        opts.ceilingLight = 'shroomlight';
    }
    else if (dimensionId == 'the_end') {
        opts.materialPool = [ 'end_stone', 'purpur_block', 'end_bricks' ];
        opts.climbingMaterialPool = ['minecraft:scaffolding'];
        opts.ceilingLight = 'end-rod';
    }
    else {
        opts.materialPool = [ ...BlockTypeIds.getDirtyBlockTypeIds(), 'gravel', 'cobblestone', 'clay_block', ...BlockTypeIds.getLeafBlockTypeIds() ];
        opts.climbingMaterialPool = ['minecraft:ladder'];
        opts.ceilingLight = 'lit_pumpkin';
    }
    BlockTypeIds.addSlabVariantsInPlace(opts.materialPool, { verify: true });
}
/**
 * 
 * @param {string} element 
 * @param {Dimension} dimension
 * @param {Vector3} locationCenter 
 * @param {number} [floors=2] 
 * @param {number} [roomHeight=4] 
 * @param {number} [depthWidth=9] 
 * @param {boolean} [basement=false] 
 *  
 */
export function house (element, dimension, locationCenter, floors = 2, roomHeight = 4, depthWidth = 9, basement = false) {
    //other ides - outpost with equipment (buy those)

    /** @type {ShelterBuildOptions} */
    const opts = { floors,roomHeight,depthWidth,basement,pyramidRoof:true,roofLight:'minecraft:campfire'};

    if (element == 'air') {
        opts.materialPool = [ ...ElementBlocks.getElementShelterBlockTypeIds('air') ];        
        opts.ceilingLight = 'minecraft:end_rod';
    }
    else if (element == 'earth') {
        opts.materialPool = [ ...ElementBlocks.getElementShelterBlockTypeIds('earth') ];
        opts.climbingMaterialPool = [ 'minecraft:scaffolding', 'minecraft:vine', 'minecraft:ladder' ]
        opts.ceilingLight = 'minecraft:lit_pumpkin';
    }
    else if (element == 'fire') {
        opts.materialPool = [ ...ElementBlocks.getElementShelterBlockTypeIds('fire') ];
        opts.climbingMaterialPool = [ 'twisting_vine', 'weeping_vine' ]
        opts.ceilingLight = randomArrayItem([ 'shroomlight', 'glowstone' ]) ?? 'shroomlight';
    }
    else if (element == 'water') {
        opts.materialPool = [ ...ElementBlocks.getElementShelterBlockTypeIds('water') ];
        opts.climbingMaterialPool = ['minecraft:flowing_water']
        opts.ceilingLight = 'minecraft:sea_lantern';
    }
    else {
        elementNoneMaterials(dimension.id, opts);
    }
    shelterBuild(dimension, locationCenter, opts);
}
//==============================================================================
/**
 * 
 * @param {string} element 
 * @param {Dimension} dimension
 * @param {Vector3} locationCenter 
 */
export function shack (element, dimension, locationCenter) {

    /** @type {ShelterBuildOptions} */
    const opts = { roomHeight: 4, depthWidth: 7 };

    if (element == 'air') {
        opts.materialPool = [ 'minecraft:glass', ...BlockTypeIds.getLeafBlockTypeIds() ];
        opts.ceilingLight = 'end_rod';
    }
    else if (element == 'earth') {
        opts.materialPool = [ 'clay', 'clay_block', 'gravel', ...BlockTypeIds.getDirtyBlockTypeIds(), ...BlockTypeIds.getNaturalOverworldStoneBlockTypeIds(), ...BlockTypeIds.getLeafBlockTypeIds(), ...BlockTypeIds.getOverworldLogBlockTypeIds() ];
        opts.climbingMaterialPool = ['minecraft:vine'];
        opts.ceilingLight = 'lit_pumpkin';
    }
    else if (element == 'fire') {
        opts.materialPool = [ ...BlockTypeIds.getNetherLogBlockTypeIds() ];
        opts.climbingMaterialPool = ['twisting_vine'];
        opts.ceilingLight = 'shroomlight';
    }
    else if (element == 'water') {
        opts.materialPool = [ ...BlockTypeIds.getDeadCoralBlockTypeIds() ];
        opts.climbingMaterialPool = ['minecraft:flowing_water'];
        opts.ceilingLight = 'sea_lantern';
    }
    else {
        elementNoneMaterials(dimension.id, opts);
    }

    shelterBuild(dimension, locationCenter,opts);
}
//==============================================================================
