//========================================================================
// Code Credit: QuazChick
// License: MIT
// url: https://github.com/QuazChick/pillars-addon/tree/main/BP/scripts/src/components/cutCopperPillarOxidation
// Converted from TS with: https://transform.tools/typescript-to-javascript
//========================================================================import { blockOxidationLevels } from "./blockOxidationLevels";
import { Dimension } from "@minecraft/server";
import { RelativeOxidationLevel } from "./oxidationLevels";
import {blockOxidationLevels} from "./blockOxidationLevels"

const blockCache = {};
/**
 * 
 * @param {Dimension} dimension 
 * @param {import("@minecraft/server").Vector3} location 
 * @returns {block}
 */
function getCachedBlock (dimension, location) {
    let block = dimension.getBlock(location)

    try {
        const locationKey = `${location.x} ${location.y} ${location.z}`;
        if (locationKey in blockCache) {
            block = blockCache[ locationKey ];
        } else {
            block = dimension.getBlock(location);
            if (block) blockCache[ locationKey ] = block;
        }
    } catch { }

    return block;
}
/**
 * 
 * @param {Dimension} dimension 
 * @param {import("@minecraft/server").Vector3} origin 
 * @param {number} relativeTo 
 * @param {number} taxiDistance 
 */
export function* getRelativeOxidationLevels (
    dimension,
    origin,
    relativeTo,
    taxiDistance
) {    

    for (const location of taxiVolume(origin, taxiDistance)) {
        const block = getCachedBlock(dimension, location);
        if (!block?.isValid()) continue; // If the block is in an unloaded chunk, do nothing

        const oxidationLevel = blockOxidationLevels[ block.typeId ];
        if (oxidationLevel === undefined) continue;

        yield oxidationLevel === relativeTo
            ? RelativeOxidationLevel.Equal
            : oxidationLevel > relativeTo
                ? RelativeOxidationLevel.Higher
                : RelativeOxidationLevel.Lower;
    }
}

function* taxiVolume (origin, maxDistance) {

    for (let x = -maxDistance; x <= maxDistance; x++) {
        const distanceY = maxDistance - Math.abs(x);

        for (let y = -distanceY; y <= distanceY; y++) {
            const distanceZ = distanceY - Math.abs(y);

            for (let z = -distanceZ; z <= distanceZ; z++) {
                if (y === 0 && x === 0 && z === 0) continue;

                yield { x: origin.x + x, y: origin.y + y, z: origin.z + z };
            }
        }
    }
}
