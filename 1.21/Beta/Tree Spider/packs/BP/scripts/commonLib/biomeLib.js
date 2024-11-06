//@ts-check
import { Entity, BiomeTypes } from "@minecraft/server";
//===================================================================
export class BiomeLib {
    //===================================================================
    /**
     * @summary Beta: dimension.findClosestBiome
     * @param {Entity} entity 
     * @returns {string | undefined}
     */
    static getCurrentBiome (entity) {
        const biomes = BiomeLib.getCurrentBiomeArray(entity).sort((a, b) => a.length - b.length).reverse();
        return biomes[ 0 ];
    }
    /**
     * @summary Beta: dimension.findClosestBiome
     * @param {Entity} entity 
     * @returns {string[]}
     */
    static getCurrentBiomeArray (entity) {
        //beta until dimension.findClosestBiome released
        const biomes = BiomeTypes.getAll();
        const { dimension, location } = entity;
        let list = [];
        for (const currentBiome of biomes) {
            // world.sendMessage(currentBiome.id);
            const biome = dimension.findClosestBiome(location, currentBiome.id, { boundingSize: { x: 64, y: 64, z: 64 } });
            if (biome != undefined) list.push(currentBiome.id);
        }
        return list;
    }
    /**
     * @summary Beta: dimension.findClosestBiome
     * @param {Entity} entity 
     * @returns {string}
     */
    static getCurrentBiomeList (entity) {
        return BiomeLib.getCurrentBiomeArray(entity).sort((a, b) => a.length - b.length).reverse().toString();
    }
    //===================================================================
}