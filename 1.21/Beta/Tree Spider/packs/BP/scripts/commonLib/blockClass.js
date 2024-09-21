//@ts-check
// Needs to be beta for BlockVolume
import { Dimension, BlockVolume } from "@minecraft/server";
import { Vector3Lib } from "./vectorClass";

export class BlockLib {

    /**
     * @param {Dimension} dimension  
     * @param {import("@minecraft/server").Vector3} location 
     * @param {number} [radius=1] 
     * @param {{}} filter
     * @param {boolean} [adjacentOnly=false] 
     * @returns {import("@minecraft/server").Vector3[]}
     */
    static blocksAround_locations (dimension, location, radius = 1, filter = {}, adjacentOnly = false) {
        const atBlock = dimension.getBlock(location);
        if (!atBlock) return [];
        if (radius === 0) radius = 1;

        const bottomOffset = atBlock?.offset({ x: radius * -1, y: radius * -1, z: radius * -1 });
        const topOffset = atBlock?.offset({ x: radius, y: radius, z: radius });
        if (!bottomOffset || !topOffset) return [];

        const blockVolumeDef = new BlockVolume(bottomOffset.location, topOffset.location);
        const blockVolumes = dimension.getBlocks(blockVolumeDef, filter, true);

        if (!adjacentOnly) return [ ...blockVolumes.getBlockLocationIterator() ];

        //x or y or z must be the same to be touch a face - plus symbol
        return [ ...blockVolumes.getBlockLocationIterator() ]
            .filter(loc => { return loc.x === atBlock.location.x || loc.y === atBlock.location.y || loc.z === atBlock.location.z; });        
    }
    //=========================================================================
    /**
     * @param {Dimension} dimension  
     * @param {import("@minecraft/server").Vector3} location 
     * @param {number} [radius=1] 
     * @returns {string[]}
     */
    static blocksAround_typeIds (dimension, location, radius = 1, filter = {}) {
        const blockLocations = BlockLib.blocksAround_locations(dimension, location, radius, filter);
        if (blockLocations.length === 0) return [];

        const blockTypeIds = [];

        for (let i = 0; i < blockLocations.length; i++) {
            const block = dimension.getBlock(blockLocations[ i ]);
            if (block) blockTypeIds.push(block.typeId);
        }

        return blockTypeIds;
    }
    //=========================================================================
    /**
     * @param {Dimension} dimension  
     * @param {import("@minecraft/server").Vector3} location 
     * @param {number} [radius=1] 
     * @returns {object[]}
     */
    static blocksAround_object (dimension, location, radius = 1, filter = {}) {
        const blockLocations = BlockLib.blocksAround_locations(dimension, location, radius, filter);
        if (blockLocations.length === 0) return [];

        const blockObjects = [];

        for (let i = 0; i < blockLocations.length; i++) {
            const block = dimension.getBlock(blockLocations[ i ]);
            if (block) blockObjects.push({
                block: block,
                offset: Vector3Lib.delta(location, block.location, 0, false),
                radius: 0
            });
        }

        blockObjects.forEach(b => { b.radius = Math.max(Math.abs(b.offset.x), Math.abs(b.offset.y), Math.abs(b.offset.z)); });
        return blockObjects;
    }
}