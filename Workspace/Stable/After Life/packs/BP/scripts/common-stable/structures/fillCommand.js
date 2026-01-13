// fillCommand.js
// @ts-check
/* =====================================================================
Copyright (C) 2026 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T. 
URL: https://github.com/DrinkWater623
========================================================================
TODO: make a real class =>  version 2

========================================================================
Change Log:
    20260112 - Created
========================================================================*/
// Minecraft
import { Dimension } from "@minecraft/server";
// Shared.
import { worldRun } from "../tools/runJobs.js";
import { Vector3Lib } from "../tools/vectorClass.js";
import { BlockTypeIds } from "../../common-data/BlockTypeIds.js";
// ========================================================================
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
// ========================================================================
export class FillCommand {
    /**
     * 
     * @param {Dimension} dimension 
     * @param {Vector3} locationCenter 
     * @param {number} radius 
     * @param {string} bubbleMaterial 
     * @param {string[]} replaceMaterialPool 
     * 
     */
    static bubble (dimension, locationCenter, radius = 3, bubbleMaterial, replaceMaterialPool) {
        if (!dimension.isChunkLoaded(locationCenter)) return false;
        const defaultMaterial = 'minecraft:glass';
        const material = [ bubbleMaterial, defaultMaterial ];
        //validate materials to avoid a fail
        if (BlockTypeIds.normalizeBlockIdsInPlace(material).length == 0) return false;
        if (BlockTypeIds.normalizeBlockIdsInPlace(replaceMaterialPool).length == 0) return false;

        const locCtr = Vector3Lib.truncate(locationCenter);
        let fillArea = '';
        let xz = radius < 3 ? 3 : Math.trunc(radius);
        let cmd = '';

        fillArea = `${locCtr.x - xz} ${locCtr.y - xz} ${locCtr.z - xz} ${locCtr.x + xz} ${locCtr.y + xz} ${locCtr.z + xz}`;
        for (const m of replaceMaterialPool) {
            cmd = `fill ${fillArea} ${material[ 0 ]} replace ${m} `;
            worldRun(cmd, dimension);
        }
        xz--;
        fillArea = `${locCtr.x - xz} ${locCtr.y - xz} ${locCtr.z - xz} ${locCtr.x + xz} ${locCtr.y + xz} ${locCtr.z + xz}`;
        cmd = `fill ${fillArea} air replace ${material[ 0 ]}`;
        worldRun(cmd, dimension, 1, locCtr);

        return true;
    }
    /**
     * 
     * @param {Dimension} dimension 
     * @param {Vector3} locationCenter 
     * @param {number} radius 
     * @param {string} [material='minecraft:blue_stained_glass'] 
     * 
     */
    static waterBubble (dimension, locationCenter, radius = 3, material = 'minecraft:blue_stained_glass') {
        if (!dimension.isChunkLoaded(locationCenter)) return;
        const defaultMaterial = 'minecraft:blue_stained_glass';
        const materialPool = [ material, defaultMaterial ];
        if (BlockTypeIds.normalizeBlockIdsInPlace(materialPool).length == 0) return false;
        return this.bubble(dimension, locationCenter, radius, materialPool[ 0 ], [ 'air', 'flowing_water', 'water','dirt','sand','gravel','seagrass','magma' ]);

    }
    /**
    * 
    * @param {Dimension} dimension 
    * @param {Vector3} locationCenter 
    * @param {number} radius 
    * @param {string} [material='minecraft:orange_stained_glass'] 
    * 
    */
    static lavaBubble (dimension, locationCenter, radius = 3, material = 'minecraft:orange_stained_glass') {
        if (!dimension.isChunkLoaded(locationCenter)) return;
        const defaultMaterial = 'minecraft:orange_stained_glass';
        const materialPool = [ material, defaultMaterial ];
        if (BlockTypeIds.normalizeBlockIdsInPlace(materialPool).length == 0) return false;
        return this.bubble(dimension, locationCenter, radius, materialPool[ 0 ], [ 'air', 'flowing_lava', 'lava','gravel','cobblestone' ]);

    }
    /**
    * 
    * @param {Dimension} dimension 
    * @param {Vector3} locationCenter 
    * @param {number} radius 
    * @param {string} [material='minecraft:white_stained_glass'] 
    * 
    */
    static powderSnowBubble (dimension, locationCenter, radius = 3, material = 'minecraft:white_stained_glass') {
        if (!dimension.isChunkLoaded(locationCenter)) return;
        const defaultMaterial = 'minecraft:white_stained_glass';
        const materialPool = [ material, defaultMaterial ];
        if (BlockTypeIds.normalizeBlockIdsInPlace(materialPool).length == 0) return false;
        return this.bubble(dimension, locationCenter, radius, materialPool[ 0 ], [ 'air', 'snow', 'powder_snow' ,'snow_layer','dirt']);

    }
        /**
    * 
    * @param {Dimension} dimension 
    * @param {Vector3} locationCenter 
    * @param {number} radius 
    * @param {string} [material='minecraft:glass'] 
    * 
    */
    static airBubble (dimension, locationCenter, radius = 3, material = 'minecraft:glass') {
        if (!dimension.isChunkLoaded(locationCenter)) return;
        const defaultMaterial = 'minecraft:glass';
        const materialPool = [ material, defaultMaterial ];
        if (BlockTypeIds.normalizeBlockIdsInPlace(materialPool).length == 0) return false;
        const replacePool = [ 'air', 
            ...BlockTypeIds.getNaturalColdBlockTypeIds(),
            ...BlockTypeIds.getNaturalDirtyBlockTypeIds(),
            ...BlockTypeIds.getNaturalStoneBlockTypeIds(),
            ...BlockTypeIds.getNaturalBlockTypeIds()
        ]
        return this.bubble(dimension, locationCenter, radius, materialPool[ 0 ], replacePool);

    }

}