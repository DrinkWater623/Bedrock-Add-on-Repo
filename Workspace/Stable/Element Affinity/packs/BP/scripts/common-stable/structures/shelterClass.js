// shelterClass.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T. 
URL: https://github.com/DrinkWater623
========================================================================
TODO: make a real class =>  version 2

// ========================================================================
Change Log:
    20260102 - Created
    20260104 - moved v1 to own shared file in library
    20260104 - fixed a class usage of Cached Block TypeIds
    20260107 - Fix outside water elevators
========================================================================*/
// Minecraft
import { Dimension, system } from "@minecraft/server";
// Shared.
import { randomArrayString, randomArrayStringExcept } from "../tools/objects.js";
import { isOnlyAirBetweenY } from "../tools/biomeLib.js";
import { worldRun } from "../tools/runJobs.js";
import { airBlock, fallThruBlocks, lavaBlocks, waterBlocks } from "../../common-data/block-data.js";
import { BlockTypeIds } from "../../common-data/BlockTypeIds.js";
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
//==============================================================================

//==============================================================================
/**
 * @param {string} stateName
 * @param {DirTable} table
 * @returns {DirHelper}
 */
function makeDirStateHelper (stateName, table) {
    /**
     * Valid inputs:
     *  - "nw", "ne", "sw", "se"
     *  - "nwi" (inner), "nwo" (outer), etc.
     */
    const re = /^(nw|ne|sw|se)(i|o)?$/;

    return {
        /**
         * @param {string} [d=""]
         * @returns {string} blockstate string or ""
         */
        get (d = "") {
            const d1 = d.trim().toLowerCase();
            const m = re.exec(d1);
            if (!m) return "";

            const dir = m[ 1 ];          // "nw" | "ne" | "sw" | "se"
            const io = m[ 2 ] ?? "o";    // default to outer if omitted

            /** @type {BlockData} */
            const s =
                dir === "nw" ? table.NW :
                    dir === "ne" ? table.NE :
                        dir === "sw" ? table.SW :
                            table.SE;

            const n = io === "i" ? s.inner : s.outer;
            return `["${stateName}"=${n}]`;
        },
    };
}
const vineDirectionBits = makeDirStateHelper("vine_direction_bits", {
    NW: { inner: 6, outer: 9 },
    SE: { inner: 9, outer: 6 },
    SW: { inner: 3, outer: 12 },
    NE: { inner: 12, outer: 3 },
});
const ladderFacingDirection = makeDirStateHelper("facing_direction", {
    NW: { inner: 5, outer: 4 },
    SE: { inner: 4, outer: 5 },
    SW: { inner: 2, outer: 3 },
    NE: { inner: 3, outer: 2 },
});
/** @type {Record<string, DirHelper>} */
const directionStateByType = {
    "minecraft:vine": vineDirectionBits,
    "minecraft:ladder": ladderFacingDirection,
};
/**
 * Safe accessor: returns "" if typeId missing OR d invalid.
 *
 * @param {string} typeId
 * @param {string} d
 * @returns {string}
 */
function getDirState (typeId, d) {
    const helper = directionStateByType[ typeId ];
    if (!helper) return "";
    return helper.get(d); // helper.get already returns "" for invalid d
}
//==============================================================================
/**
 *  Add lights
 * @param {Dimension} dimension 
 * @param {Vector3} locationCenter 
 * @param {ShelterBuildOptions} [opts={}] 
 */
export function shelterBuild (dimension, locationCenter, opts = {}) {

    const {
        floors = 1,
        roomHeight = 9,
        depthWidth = 7,
        floorLight = "",
        ceilingLight = "",
        roofLight = 'minecraft.campfire',
        pyramidRoof = false,
        ...materials
    } = opts;
    const height = (roomHeight * floors) + 1;

    let { x, y, z } = locationCenter;
    x = Math.floor(x);
    y = Math.floor(y);
    z = Math.floor(z);

    const halfLength = Math.ceil(depthWidth / 2);
    let tick = 1;
    let command = '';

    const xWall1 = x - halfLength;
    const xWall2 = x + halfLength;
    const zWall1 = z - halfLength;
    const zWall2 = z + halfLength;
    const yFloor = y - 1;
    const yCeiling = y + height - 1;
    const xCenter = Math.floor(xWall1 + xWall2) / 2;
    const zCenter = Math.floor(zWall1 + zWall2) / 2;
    const corners = {
        NW_negXZ: { x: xWall1, y: yFloor, z: zWall1 },
        NE_posX_negZ: { x: xWall2, y: yFloor, z: zWall1 },
        SW_negX_posZ: { x: xWall1, y: yFloor, z: zWall2 },
        SE_posXZ: { x: xWall2, y: yFloor, z: zWall2 }
    };
    const replaceAllowList = [
        ...BlockTypeIds.getNaturalOverworldAboveZeroStoneBlockTypeIds(),
        ...fallThruBlocks,
        ...BlockTypeIds.getDirtyBlockTypeIds(),
        ...BlockTypeIds.getShortPlantBlockTypeIdSet(),
        ...BlockTypeIds.getTallPlantBlockTypeIds(),
        'sand', 'gravel', 'red_sand','netherrack',
        'minecraft:snow_block', 'minecraft:snow', 'minecraft:ice', 'minecraft:powder_snow' //  leave blue and packed ice, these are valuable
    ];
    BlockTypeIds.normalizeBlockIdsInPlace(replaceAllowList, { verify: true, removeEmpty: true, addNamespace: true });
    //----------
    // Materials
    //----------
    const wallMaterialPool = (materials.materialPool ?? BlockTypeIds.getNaturalOverworldAboveZeroStoneBlockTypeIds()).filter(b => !b.endsWith('_carpet'));
    BlockTypeIds.normalizeBlockIdsInPlace(wallMaterialPool, { addNamespace: true, verify: true, removeEmpty: true });

    /* Make sure no Gravity blocks, carpet or magma */
    const floorMaterialPool = wallMaterialPool
        .filter(b =>
            !BlockTypeIds.getGravityBlockTypeIdSet().has(b) &&
            !fallThruBlocks.includes(b) &&
            !lavaBlocks.includes(b) &&
            !b.includes(':magma')
        );

    const tempMaterial = 'minecraft:allow';
    const defaultWallMaterial = randomArrayString([ 'minecraft:cobblestone_slab', 'minecraft:cobblestone_wall', 'minecraft:sandstone_slab', 'minecraft:sandstone_wall' ]) ?? 'minecraft:cobblestone';
    const defaultFloorMaterial = randomArrayStringExcept([ 'minecraft:cobblestone_slab', 'minecraft:cobblestone', 'minecraft:sandstone_slab', 'minecraft:sandstone' ], [ defaultWallMaterial ]) ?? 'minecraft:cobblestone';
    const default_climbingMaterial = 'minecraft:scaffolding';

    const wallMaterial = randomArrayString(wallMaterialPool) ?? defaultWallMaterial;
    const wallData = BlockTypeIds.getLeafBlockTypeIdSet().has(wallMaterial) ? '["persistent_bit" = true]' : '';

    const floorMaterial = randomArrayStringExcept(floorMaterialPool, [ wallMaterial ]) ?? defaultFloorMaterial;
    const floorData = BlockTypeIds.getLeafBlockTypeIdSet().has(floorMaterial) ? '["persistent_bit" = true]' : '';

    const windowMaterial = randomArrayString(BlockTypeIds.getGlassPaneBlockTypeIds()) ?? 'glass_pane';

    const input_climbingMaterial = randomArrayString(materials.climbingMaterialPool ?? BlockTypeIds.getClimbableBlockTypeIds()) ?? default_climbingMaterial;
    const climbingMaterial = (
        dimension.id == 'nether' && input_climbingMaterial.endsWith('water')
            ? default_climbingMaterial
            : BlockTypeIds.getPartialBlockTypeIdSet().has(wallMaterial) && (input_climbingMaterial.endsWith(':vine') || input_climbingMaterial.endsWith(':ladder'))
                ? default_climbingMaterial
                : BlockTypeIds.getLeafBlockTypeIdSet().has(wallMaterial) ? 'minecraft:vine'
                    : BlockTypeIds.getClimbableBlockTypeIdSet().has(input_climbingMaterial) || waterBlocks.includes(input_climbingMaterial)
                        ? input_climbingMaterial
                        : randomArrayString(BlockTypeIds.getClimbableBlockTypeIds())
    ) ?? default_climbingMaterial;

    const isWaterElevator = !!climbingMaterial && climbingMaterial.endsWith('water');
    const isLadderElevator = !!climbingMaterial && climbingMaterial.endsWith('ladder');
    const isHangingElevator = !!climbingMaterial && (climbingMaterial.endsWith('weeping_vines') || climbingMaterial.endsWith('glow_berries'));
    const isFloorSlabAndTwistingVine = climbingMaterial.endsWith('twisting_vines') && floorMaterial.endsWith('_slab');
    const isWall = floorMaterial.endsWith('_wall');

    console.warn(`BlockTypeIds.getPartialBlockTypeIdSet().has(wallMaterial) (${BlockTypeIds.getPartialBlockTypeIdSet().has(wallMaterial)}) && (input_climbingMaterial.endsWith(':vine') || input_climbingMaterial.endsWith(':ladder')) ${wallMaterial}/${input_climbingMaterial} = ${BlockTypeIds.getPartialBlockTypeIdSet().has(wallMaterial) && (input_climbingMaterial.endsWith(':vine') || input_climbingMaterial.endsWith(':ladder'))}`);
    console.warn(`climbingMaterial.endsWith('weeping_vines') || climbingMaterial.endsWith('glow_berries') (${climbingMaterial}) = ${climbingMaterial.endsWith('weeping_vines') || climbingMaterial.endsWith('glow_berries')}`);
    //----------------------------------------------------------------------------------------------------
    //First Fill -  with keeping what is still there like chests and stuff
    command = `fill ${xWall1} ${yFloor} ${zWall1}  ${xWall2} ${yCeiling} ${zWall2} ${tempMaterial} keep`;
    worldRun(command, dimension, tick, locationCenter);
    tick++;
    //Ceiling Lamp
    command = `fill ${xCenter} ${yCeiling} ${zCenter}  ${xCenter} ${yCeiling} ${zCenter} ${ceilingLight} replace ${tempMaterial}`;
    worldRun(command, dimension, tick, locationCenter);
    //add campfire on roof
    command = `fill ${xCenter} ${yCeiling + 1} ${zCenter}  ${xCenter} ${yCeiling + 1} ${zCenter} campfire keep`;
    worldRun(command, dimension, tick, locationCenter);
    //----------------------------------------------------------------------------------------------------
    /* Clear natural blocks (non-crafted) - avoids messing up unintended blocks like chests / shulkers */
    replaceAllowList.forEach((block) => {
        //Within the structure - clean up natural blocks
        command = `fill ${xWall1} ${yFloor} ${zWall1}  ${xWall2} ${yCeiling} ${zWall2} ${tempMaterial} replace ${block}`;
        worldRun(command, dimension, tick, locationCenter);

        //clear some of the outside area
        const space = 4;
        command = `fill ${xWall1 - space} ${yFloor + 1} ${zWall1 - space}  ${xWall2 + space} ${yCeiling + space} ${zWall2 + space} air replace ${block}`;
        worldRun(command, dimension, tick, locationCenter);
    });
    tick++;

    //space for water to fall in
    if (isWaterElevator) {
        //space for water to fall INSIDE the shelter
        command = `fill ${corners.NW_negXZ.x + 1} ${yFloor} ${corners.NW_negXZ.z + 1}  ${corners.NW_negXZ.x + 1} ${yFloor} ${corners.NW_negXZ.z + 1} air replace ${tempMaterial}`;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${corners.SE_posXZ.x - 1} ${yFloor} ${corners.SE_posXZ.z - 1}  ${corners.SE_posXZ.x - 1} ${yFloor} ${corners.SE_posXZ.z - 1}  air replace ${tempMaterial}`;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${corners.SW_negX_posZ.x + 1} ${yFloor} ${corners.SW_negX_posZ.z - 1}  ${corners.SW_negX_posZ.x + 1} ${yFloor} ${corners.SW_negX_posZ.z - 1} air replace ${tempMaterial}`;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${corners.NE_posX_negZ.x - 1} ${yFloor} ${corners.NE_posX_negZ.z + 1}  ${corners.NE_posX_negZ.x - 1} ${yFloor} ${corners.NE_posX_negZ.z + 1} air replace ${tempMaterial}`;
        worldRun(command, dimension, tick, locationCenter);

        //space for water to fall OUTSIDE the shelter
        command = `fill ${corners.NW_negXZ.x} ${yFloor} ${corners.NW_negXZ.z}  ${corners.NW_negXZ.x} ${yFloor} ${corners.NW_negXZ.z} air replace ${tempMaterial}`;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${corners.SE_posXZ.x} ${yFloor} ${corners.SE_posXZ.z}  ${corners.SE_posXZ.x} ${yFloor} ${corners.SE_posXZ.z}  air replace ${tempMaterial}`;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${corners.SW_negX_posZ.x} ${yFloor} ${corners.SW_negX_posZ.z}  ${corners.SW_negX_posZ.x} ${yFloor} ${corners.SW_negX_posZ.z} air replace ${tempMaterial}`;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${corners.NE_posX_negZ.x} ${yFloor} ${corners.NE_posX_negZ.z}  ${corners.NE_posX_negZ.x} ${yFloor} ${corners.NE_posX_negZ.z} air replace ${tempMaterial}`;
        worldRun(command, dimension, tick, locationCenter);

        //Add lamp below the space
        replaceAllowList.forEach((block) => {
            let newFloor = yFloor - 1;

            //place a light below OUTSIDE
            command = `fill ${corners.NW_negXZ.x} ${newFloor} ${corners.NW_negXZ.z}  ${corners.NW_negXZ.x} ${newFloor} ${corners.NW_negXZ.z} ${ceilingLight} replace ${block}`;
            worldRun(command, dimension, tick, locationCenter);

            command = `fill ${corners.SE_posXZ.x} ${newFloor} ${corners.SE_posXZ.z}  ${corners.SE_posXZ.x} ${newFloor} ${corners.SE_posXZ.z} ${ceilingLight} replace ${block}`;
            worldRun(command, dimension, tick, locationCenter);

            command = `fill ${corners.SW_negX_posZ.x} ${newFloor} ${corners.SW_negX_posZ.z}  ${corners.SW_negX_posZ.x} ${newFloor} ${corners.SW_negX_posZ.z} ${ceilingLight} replace ${block}`;
            worldRun(command, dimension, tick, locationCenter);

            command = `fill ${corners.NE_posX_negZ.x} ${newFloor} ${corners.NE_posX_negZ.z}  ${corners.NE_posX_negZ.x} ${newFloor} ${corners.NE_posX_negZ.z} ${ceilingLight} replace ${block}`;
            worldRun(command, dimension, tick, locationCenter);

            //place a light below inside
            command = `fill ${corners.NW_negXZ.x + 1} ${newFloor} ${corners.NW_negXZ.z + 1}  ${corners.NW_negXZ.x + 1} ${newFloor} ${corners.NW_negXZ.z + 1} ${ceilingLight} replace ${block}`;
            worldRun(command, dimension, tick, locationCenter);

            command = `fill ${corners.SE_posXZ.x - 1} ${newFloor} ${corners.SE_posXZ.z - 1}  ${corners.SE_posXZ.x - 1} ${newFloor} ${corners.SE_posXZ.z - 1} ${ceilingLight} replace ${block}`;
            worldRun(command, dimension, tick, locationCenter);

            command = `fill ${corners.SW_negX_posZ.x + 1} ${newFloor} ${corners.SW_negX_posZ.z - 1}  ${corners.SW_negX_posZ.x + 1} ${newFloor} ${corners.SW_negX_posZ.z - 1} ${ceilingLight} replace ${block}`;
            worldRun(command, dimension, tick, locationCenter);

            command = `fill ${corners.NE_posX_negZ.x - 1} ${newFloor} ${corners.NE_posX_negZ.z + 1}  ${corners.NE_posX_negZ.x - 1} ${newFloor} ${corners.NE_posX_negZ.z + 1} ${ceilingLight} replace ${block}`;
            worldRun(command, dimension, tick, locationCenter);
        });
        tick++;
    }
    if (isWall) {
        console.warn('yep wall - fix floor');
        //Floor 1  has to be all floorMaterial
        command = `fill ${xWall1} ${yFloor} ${zWall1}  ${xWall2} ${yFloor} ${zWall2} ${floorMaterial} ${floorData} replace ${tempMaterial}`;
        worldRun(command, dimension, tick, locationCenter);
    }
    //----------------------------------------------------------------------------------------------------

    //remove inner temp material 
    command = `fill ${xWall1 + 1} ${yFloor + 1} ${zWall1 + 1}  ${xWall2 - 1} ${yCeiling - 1} ${zWall2 - 1} air replace ${tempMaterial}`;
    worldRun(command, dimension, tick, locationCenter);
    tick++;
    //----------------------------------------------------------------------------------------------------
    //in inner-corners, to get to 2nd floor and roof TODO: foolproof, check whole column clear for any
    //count how many,, if none, try center, then one corner in... must be at least one way up
    if (climbingMaterial) {

        let newFloorPlace = isWaterElevator ? yCeiling : yFloor + 1;
        const newCeilPlace = isWaterElevator || isLadderElevator ? yCeiling : yCeiling + 2;

        let newFloorCheck = isWaterElevator ? yFloor : yFloor + 1;
        const newCeilCheck = yCeiling + 2;
        //Prep OUTSIDE Corner - clear it
        command = `fill ${corners.NW_negXZ.x} ${newFloorCheck} ${corners.NW_negXZ.z}  ${corners.NW_negXZ.x} ${newCeilCheck} ${corners.NW_negXZ.z} air replace ${tempMaterial} `;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${corners.SE_posXZ.x} ${newFloorCheck} ${corners.SE_posXZ.z}  ${corners.SE_posXZ.x} ${newCeilCheck} ${corners.SE_posXZ.z} air replace ${tempMaterial} `;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${corners.SW_negX_posZ.x} ${newFloorCheck} ${corners.SW_negX_posZ.z}  ${corners.SW_negX_posZ.x} ${newCeilCheck} ${corners.SW_negX_posZ.z} air replace ${tempMaterial} `;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${corners.NE_posX_negZ.x} ${newFloorCheck} ${corners.NE_posX_negZ.z}  ${corners.NE_posX_negZ.x} ${newCeilCheck} ${corners.NE_posX_negZ.z} air replace ${tempMaterial} `;
        worldRun(command, dimension, tick, locationCenter);

        //Prep INSIDE Ceiling with a hole to get thru.  A trapdoor will be placed above it
        command = `fill ${corners.NW_negXZ.x + 1} ${yCeiling} ${corners.NW_negXZ.z + 1}  ${corners.NW_negXZ.x + 1} ${yCeiling} ${corners.NW_negXZ.z + 1} air replace ${tempMaterial} `;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${corners.SE_posXZ.x - 1} ${yCeiling} ${corners.SE_posXZ.z - 1}  ${corners.SE_posXZ.x - 1} ${yCeiling} ${corners.SE_posXZ.z - 1} air replace ${tempMaterial} `;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${corners.SW_negX_posZ.x + 1} ${yCeiling} ${corners.SW_negX_posZ.z - 1}  ${corners.SW_negX_posZ.x + 1} ${yCeiling} ${corners.SW_negX_posZ.z - 1} air replace ${tempMaterial} `;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${corners.NE_posX_negZ.x - 1} ${yCeiling} ${corners.NE_posX_negZ.z + 1}  ${corners.NE_posX_negZ.x - 1} ${yCeiling} ${corners.NE_posX_negZ.z + 1} air replace ${tempMaterial} `;
        worldRun(command, dimension, tick, locationCenter);

        if (isFloorSlabAndTwistingVine) {
            //["minecraft:vertical_half" = "top"]
            //Inside roof elevator area
            command = `setblock ${corners.NW_negXZ.x + 1}     ${yFloor} ${corners.NW_negXZ.z + 1}      ${floorMaterial} ["minecraft:vertical_half" = "top"] keep`;
            worldRun(command, dimension, tick, locationCenter);
            command = `setblock ${corners.SE_posXZ.x - 1}     ${yFloor} ${corners.SE_posXZ.z - 1}      ${floorMaterial} ["minecraft:vertical_half" = "top"] keep`;
            worldRun(command, dimension, tick, locationCenter);
            command = `setblock ${corners.SW_negX_posZ.x + 1} ${yFloor} ${corners.SW_negX_posZ.z - 1}  ${floorMaterial} ["minecraft:vertical_half" = "top"] keep`;
            worldRun(command, dimension, tick, locationCenter);
            command = `setblock ${corners.NE_posX_negZ.x - 1} ${yFloor} ${corners.NE_posX_negZ.z + 1}  ${floorMaterial} ["minecraft:vertical_half" = "top"] keep`;
            worldRun(command, dimension, tick, locationCenter);
            //Outside roof elevator area
            command = `setblock ${corners.NW_negXZ.x}     ${yFloor} ${corners.NW_negXZ.z}      ${floorMaterial} ["minecraft:vertical_half" = "top"] keep`;
            worldRun(command, dimension, tick, locationCenter);
            command = `setblock ${corners.SE_posXZ.x}     ${yFloor} ${corners.SE_posXZ.z}      ${floorMaterial} ["minecraft:vertical_half" = "top"] keep`;
            worldRun(command, dimension, tick, locationCenter);
            command = `setblock ${corners.SW_negX_posZ.x} ${yFloor} ${corners.SW_negX_posZ.z}  ${floorMaterial}["minecraft:vertical_half" = "top"] keep`;
            worldRun(command, dimension, tick, locationCenter);
            command = `setblock ${corners.NE_posX_negZ.x} ${yFloor} ${corners.NE_posX_negZ.z}  ${floorMaterial} ["minecraft:vertical_half" = "top"] keep`;
            worldRun(command, dimension, tick, locationCenter);
        }
        //Overhead holder of hanging blocks, 3 above ceiling block, newCeilCheck is already 2 above 
        else if (isHangingElevator) {
            console.warn('yep hanging elevator');
            //Inside roof elevator area
            command = `setblock ${corners.NW_negXZ.x + 1}     ${newCeilCheck + 1} ${corners.NW_negXZ.z + 1}      ${floorMaterial} ${floorData} keep`;
            worldRun(command, dimension, tick, locationCenter);
            command = `setblock ${corners.SE_posXZ.x - 1}     ${newCeilCheck + 1} ${corners.SE_posXZ.z - 1}      ${floorMaterial} ${floorData} keep`;
            worldRun(command, dimension, tick, locationCenter);
            command = `setblock ${corners.SW_negX_posZ.x + 1} ${newCeilCheck + 1} ${corners.SW_negX_posZ.z - 1}  ${floorMaterial} ${floorData} keep`;
            worldRun(command, dimension, tick, locationCenter);
            command = `setblock ${corners.NE_posX_negZ.x - 1} ${newCeilCheck + 1} ${corners.NE_posX_negZ.z + 1}  ${floorMaterial} ${floorData} keep`;
            worldRun(command, dimension, tick, locationCenter);
            //Outside roof elevator area
            command = `setblock ${corners.NW_negXZ.x}     ${newCeilCheck + 1} ${corners.NW_negXZ.z}      ${floorMaterial} ${floorData} keep`;
            worldRun(command, dimension, tick, locationCenter);
            command = `setblock ${corners.SE_posXZ.x}     ${newCeilCheck + 1} ${corners.SE_posXZ.z}      ${floorMaterial} ${floorData} keep`;
            worldRun(command, dimension, tick, locationCenter);
            command = `setblock ${corners.SW_negX_posZ.x} ${newCeilCheck + 1} ${corners.SW_negX_posZ.z}  ${floorMaterial} ${floorData} keep`;
            worldRun(command, dimension, tick, locationCenter);
            command = `setblock ${corners.NE_posX_negZ.x} ${newCeilCheck + 1} ${corners.NE_posX_negZ.z}  ${floorMaterial} ${floorData} keep`;
            worldRun(command, dimension, tick, locationCenter);
        }
        else if (isWaterElevator) {
            //build structure around elevator
            const bottom = yFloor + 4;
            const top = yCeiling + 1;
            const wall = wallMaterial.endsWith('_powder') || wallMaterial.endsWith('sand') || wallMaterial.endsWith('gravel') ? 'minecraft:glass' : wallMaterial;

            command = `fill ${corners.NW_negXZ.x - 1} ${bottom} ${corners.NW_negXZ.z}  ${corners.NW_negXZ.x - 1} ${top} ${corners.NW_negXZ.z} ${wallMaterial} ${wallData} keep`;
            worldRun(command, dimension, tick, locationCenter);
            command = `fill ${corners.NW_negXZ.x} ${bottom} ${corners.NW_negXZ.z - 1}  ${corners.NW_negXZ.x} ${top} ${corners.NW_negXZ.z - 1} ${wallMaterial} ${wallData} keep`;
            worldRun(command, dimension, tick, locationCenter);

            command = `fill ${corners.SE_posXZ.x + 1} ${bottom} ${corners.SE_posXZ.z}  ${corners.SE_posXZ.x + 1} ${top} ${corners.SE_posXZ.z} ${wallMaterial} ${wallData} keep`;
            worldRun(command, dimension, tick, locationCenter);
            command = `fill ${corners.SE_posXZ.x} ${bottom} ${corners.SE_posXZ.z + 1}  ${corners.SE_posXZ.x} ${top} ${corners.SE_posXZ.z + 1} ${wallMaterial} ${wallData} keep`;
            worldRun(command, dimension, tick, locationCenter);

            command = `fill ${corners.SW_negX_posZ.x - 1} ${bottom} ${corners.SW_negX_posZ.z}  ${corners.SW_negX_posZ.x - 1} ${top} ${corners.SW_negX_posZ.z} ${wallMaterial} ${wallData} keep`;
            worldRun(command, dimension, tick, locationCenter);
            command = `fill ${corners.SW_negX_posZ.x} ${bottom} ${corners.SW_negX_posZ.z + 1}  ${corners.SW_negX_posZ.x} ${top} ${corners.SW_negX_posZ.z + 1} ${wallMaterial} ${wallData} keep`;
            worldRun(command, dimension, tick, locationCenter);

            command = `fill ${corners.NE_posX_negZ.x + 1} ${bottom} ${corners.NE_posX_negZ.z}  ${corners.NE_posX_negZ.x + 1} ${top} ${corners.NE_posX_negZ.z} ${wallMaterial} ${wallData} keep`;
            worldRun(command, dimension, tick, locationCenter);
            command = `fill ${corners.NE_posX_negZ.x} ${bottom} ${corners.NE_posX_negZ.z - 1}  ${corners.NE_posX_negZ.x} ${top} ${corners.NE_posX_negZ.z - 1} ${wallMaterial} ${wallData} keep`;
            worldRun(command, dimension, tick, locationCenter);
        }
        tick++;
        //In a sys run because of the block checking.  needs to happen after space is clear for a valid check to return
        system.runTimeout(() => {
            let insideElevators = 0;
            const isVine = !!(climbingMaterial && climbingMaterial.endsWith(':vine'));
            //Place Inside Elevators
            let ok = isOnlyAirBetweenY(dimension, corners.NW_negXZ.x + 1, corners.NW_negXZ.z + 1, newFloorCheck, newCeilCheck);
            if (ok) {
                insideElevators++;
                command = `fill ${corners.NW_negXZ.x + 1} ${newFloorPlace} ${corners.NW_negXZ.z + 1}  ${corners.NW_negXZ.x + 1} ${newCeilPlace} ${corners.NW_negXZ.z + 1} ${climbingMaterial} ${getDirState(climbingMaterial, 'nwi')}`;
                worldRun(command, dimension, tick, locationCenter);
            }
            ok = isOnlyAirBetweenY(dimension, corners.SE_posXZ.x - 1, corners.SE_posXZ.z - 1, newFloorCheck, newCeilCheck);
            if (ok) {
                insideElevators++;
                command = `fill ${corners.SE_posXZ.x - 1} ${newFloorPlace} ${corners.SE_posXZ.z - 1}  ${corners.SE_posXZ.x - 1} ${newCeilPlace} ${corners.SE_posXZ.z - 1}  ${climbingMaterial} ${getDirState(climbingMaterial, 'sei')}`;
                worldRun(command, dimension, tick, locationCenter);
            }
            ok = isOnlyAirBetweenY(dimension, corners.SW_negX_posZ.x + 1, corners.SW_negX_posZ.z - 1, newFloorCheck, newCeilCheck);
            if (ok) {
                insideElevators++; newCeilPlace;
                command = `fill ${corners.SW_negX_posZ.x + 1} ${newFloorPlace} ${corners.SW_negX_posZ.z - 1}  ${corners.SW_negX_posZ.x + 1} ${newCeilPlace} ${corners.SW_negX_posZ.z - 1} ${climbingMaterial} ${getDirState(climbingMaterial, 'swi')}`;
                worldRun(command, dimension, tick, locationCenter);
            }
            ok = isOnlyAirBetweenY(dimension, corners.NE_posX_negZ.x - 1, corners.NE_posX_negZ.z + 1, newFloorCheck, newCeilCheck);
            if (ok) {
                insideElevators++;
                command = `fill ${corners.NE_posX_negZ.x - 1} ${newFloorPlace} ${corners.NE_posX_negZ.z + 1}  ${corners.NE_posX_negZ.x - 1} ${newCeilPlace} ${corners.NE_posX_negZ.z + 1} ${climbingMaterial} ${getDirState(climbingMaterial, 'nei')}`;
                worldRun(command, dimension, tick, locationCenter);
            }

            //Outside Elevators in corners
            ok = isOnlyAirBetweenY(dimension, corners.NW_negXZ.x, corners.NW_negXZ.z, newFloorCheck, newCeilCheck, { airTypeIds: [ airBlock, tempMaterial, wallMaterial ] });
            if (ok) {
                command = `fill ${corners.NW_negXZ.x} ${newFloorPlace} ${corners.NW_negXZ.z}  ${corners.NW_negXZ.x} ${newCeilPlace} ${corners.NW_negXZ.z} ${climbingMaterial} ${getDirState(climbingMaterial, 'nwo')}`;
                worldRun(command, dimension, tick, locationCenter);
            }
            ok = isOnlyAirBetweenY(dimension, corners.SE_posXZ.x, corners.SE_posXZ.z, newFloorCheck, newCeilCheck, { airTypeIds: [ airBlock, tempMaterial, wallMaterial ] });
            if (ok) {
                command = `fill ${corners.SE_posXZ.x} ${newFloorPlace} ${corners.SE_posXZ.z}  ${corners.SE_posXZ.x} ${newCeilPlace} ${corners.SE_posXZ.z} ${climbingMaterial} ${getDirState(climbingMaterial, 'seo')}`;
                worldRun(command, dimension, tick, locationCenter);
            }
            ok = isOnlyAirBetweenY(dimension, corners.SW_negX_posZ.x, corners.SW_negX_posZ.z, newFloorCheck, newCeilCheck, { airTypeIds: [ airBlock, tempMaterial, wallMaterial ] });
            if (ok) {
                insideElevators++;
                command = `fill ${corners.SW_negX_posZ.x} ${newFloorPlace} ${corners.SW_negX_posZ.z}  ${corners.SW_negX_posZ.x} ${newCeilPlace} ${corners.SW_negX_posZ.z} ${climbingMaterial} ${getDirState(climbingMaterial, 'swo')}`;
                worldRun(command, dimension, tick, locationCenter);
            }
            ok = isOnlyAirBetweenY(dimension, corners.NE_posX_negZ.x, corners.NE_posX_negZ.z, newFloorCheck, newCeilCheck, { airTypeIds: [ airBlock, tempMaterial, wallMaterial ] });
            if (ok) {
                insideElevators++;
                command = `fill ${corners.NE_posX_negZ.x} ${newFloorPlace} ${corners.NE_posX_negZ.z}  ${corners.NE_posX_negZ.x} ${newCeilPlace} ${corners.NE_posX_negZ.z} ${climbingMaterial} ${getDirState(climbingMaterial, 'neo')}`;
                worldRun(command, dimension, tick, locationCenter);
            }

        }, tick++);
    }

    //1st Floor and Ceiling fill with floor material
    if (wallMaterial !== floorMaterial) {

        //Roof
        command = `fill ${xWall1 + 1} ${yCeiling} ${zWall1 + 1}  ${xWall2 - 1} ${yCeiling} ${zWall2 - 1} ${floorMaterial} ${floorData} replace ${tempMaterial}`;
        worldRun(command, dimension, tick, locationCenter);
        tick++;
    }

    /**
     * 
     * @param {number} newFloor 
     */
    function installWindows (newFloor) {
        command = `fill ${xCenter - 1} ${newFloor} ${zWall1}  ${xCenter + 1} ${newFloor + 1} ${zWall1} ${windowMaterial}  replace ${tempMaterial}`;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${xCenter - 1} ${newFloor} ${zWall2}  ${xCenter + 1} ${newFloor + 1} ${zWall2} ${windowMaterial}  replace ${tempMaterial}`;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${xWall1} ${newFloor} ${zCenter - 1}  ${xWall1 - 1} ${newFloor + 1} ${zCenter + 1} ${windowMaterial}  replace ${tempMaterial}`;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${xWall2} ${newFloor} ${zCenter - 1}  ${xWall2 + 1} ${newFloor + 1} ${zCenter + 1} ${windowMaterial}  replace ${tempMaterial}`;
        worldRun(command, dimension, tick, locationCenter);

    }
    //Windows -- need on every floor
    //if (windowMaterial) installWindow(yFloor + 2);

    /**
     * 
     * @param {number} newFloor 
     */
    function installAdditionalFloor (newFloor) {
        command = `fill ${xCenter} ${newFloor} ${zCenter}  ${xCenter} ${newFloor} ${zCenter} ${ceilingLight} keep`;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${xWall1 + 2} ${newFloor} ${zWall1 + 2}  ${xWall2 - 2} ${newFloor} ${zWall2 - 2} ${floorMaterial} ${floorData} keep`;
        worldRun(command, dimension, tick, locationCenter);

        command = `fill ${xWall1 + 2} ${newFloor} ${zWall1 + 2}  ${xWall2 - 2} ${newFloor} ${zWall2 - 2} ${floorMaterial} ${floorData} replace ${tempMaterial}`;
        worldRun(command, dimension, tick, locationCenter);
    }
    // Add as many extra floors as will fit (each floor consumes 4 blocks of height)
    const FLOOR_STEP = 4;
    const WINDOW_OFFSET = 2;
    // start at your 2nd-floor Y (yFloor2), then keep going up by 4
    for (let yLevel = yFloor; yLevel + FLOOR_STEP <= yCeiling; yLevel += FLOOR_STEP) {
        installAdditionalFloor(yLevel);
        if (windowMaterial) installWindows(yLevel + WINDOW_OFFSET);
    }
    tick++;

    // Last - Place real outer walls replacing temp material... that should be all that is left to replace
    command = `fill ${xWall1} ${yFloor} ${zWall1}  ${xWall2} ${yCeiling} ${zWall2} ${wallMaterial} ${wallData} replace ${tempMaterial}`;
    worldRun(command, dimension, tick, locationCenter);
    tick++;

    // system.runTimeout(() => {
    //     const pos = corners.negXZ;
    //     pos.x++;
    //     pos.z++;
    //     const flr = dimension.getBlock(pos);
    //     if (flr && flr.typeId != floorMaterial) console.warn(`floor block is ${flr.typeId}`);
    // }, ++tick);
}
//==============================================================================
