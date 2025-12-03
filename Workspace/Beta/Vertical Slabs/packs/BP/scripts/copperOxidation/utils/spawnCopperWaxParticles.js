//@ts-check
import { Dimension, MolangVariableMap } from "@minecraft/server";
//=============================================================================
/** @typedef {import("@minecraft/server").Vector2} Vector2 */
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** @typedef {import("@minecraft/server").VectorXZ} VectorXZ */
const padding = 0.05;
const particleAmount = 20;
/**
 * 
 * @param {Dimension} dimension 
 * @param {Vector3} blockLocation 
 * @param {import("@minecraft/server").RGB} color 
 */
export function spawnCopperWaxParticles (dimension, blockLocation, color) {
    for (let i = 0; i < particleAmount; i++) {
        const particleMolang = new MolangVariableMap();

        particleMolang.setColorRGB("variable.color", color);
        particleMolang.setVector3("variable.direction", { x: -1, y: -1, z: -1 });

        dimension.spawnParticle(
            "minecraft:wax_particle",
            getRandomParticleLocation(blockLocation),
            particleMolang
        );
    }
}
/**
 * 
 * @param {Vector3} blockLocation  
 * @returns {Vector3}
 */
function getRandomParticleLocation (blockLocation) {
    const axes = [ "x", "y", "z" ];
    const face = Math.floor(Math.random() * 6);

    const axisIndex = face % 3;
    const axis = axes[ axisIndex ];
    axes.splice(axisIndex, 1);

    const result = { ...blockLocation };

    // Set the coordinate along the chosen axis
    result[ axis ] += face > 2 ? 1 + padding : -padding;

    // Set random coordinates for the other two axes
    for (const axis of axes) result[ axis ] += Math.random();

    return result;
}
