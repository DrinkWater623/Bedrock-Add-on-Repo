//@ts-check
/**
 * Created by: https://github.com/DrinkWater623
 */
//==============================================================================
import { Entity, World } from "@minecraft/server";
//=============================================================================
/** @typedef {import("@minecraft/server").Vector2} Vector2 */
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/** @typedef {import("@minecraft/server").VectorXZ} VectorXZ */
//==============================================================================
export class DynamicPropertyLib {

    //======================================  Numbers
    /**
     * 
     * @param {Entity | World} entity
     * @param {string} propertyName
     * @param {number} [qty=0] 
     */
    static add (entity, propertyName, qty = 0) {
        if (entity instanceof World || entity.isValid()) {
            const currentQty = DynamicPropertyLib.getNumber(entity, propertyName);
            entity.setDynamicProperty(propertyName, currentQty + qty);
        }
    }

    /**
     * 
     * @param {Entity[]} entities 
     * @param {string} propertyName
     * @returns {number} 
     */
    static sum (entities = [], propertyName) {
        if (!propertyName) return 0;

        let sum = 0;
        entities.filter(e => e.isValid()).forEach(e => {
            if (e.isValid()) sum += DynamicPropertyLib.getNumber(e, propertyName);
        });

        return sum;
    }

    /**
     * 
     * @param {Entity | World} entity
     * @param {string} propertyName
     * @returns {number} 
     */
    static getNumber (entity, propertyName) {
        if (entity instanceof World || entity.isValid()) {
            const currentQty = entity.getDynamicProperty(propertyName);
            if (!currentQty || typeof currentQty != 'number') {
                entity.setDynamicProperty(propertyName, 0);
                return 0;
            }
            return currentQty;
        }
        else return 0;
    }

    //====================================== Vectors
    /**
     * 
     * @param {Entity} entity
     * @param {string} propertyName
     * @param {Vector3} location
     */
    static setVector (entity, propertyName, location) {
        if (entity.isValid()) {
            entity.setDynamicProperty(propertyName, location);
        }
    }

    /**
     * 
     * @param {Entity} entity
     * @param {string} propertyName
     * @returns {Vector3 | undefined} 
     */
    static getVector (entity, propertyName) {
        if (entity.isValid()) {
            const location = entity.getDynamicProperty(propertyName);
            if (!location || typeof location != 'object') return undefined;
            return location;
        }
        else return undefined;
        //{x:0,y:0,z:0}
    }

    //====================================== Strings
    /**
    * 
    * @param {Entity | World} entity
    * @param {string} propertyName
    * @returns {string} 
    */
    static getString (entity, propertyName) {
        if (entity instanceof World || entity.isValid()) {
            const currentValue = entity.getDynamicProperty(propertyName);
            if (!currentValue || typeof currentValue != 'string') {
                entity.setDynamicProperty(propertyName, '');
                return '';
            }
            return currentValue;
        }
        else return '';
    }
}