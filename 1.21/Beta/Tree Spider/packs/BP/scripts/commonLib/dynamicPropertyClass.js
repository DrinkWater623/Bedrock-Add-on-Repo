import { Entity } from "@minecraft/server";

//@ts-check
export class DynamicPropertyLib {

    /**
     * 
     * @param {Entity} entity
     * @param {string} propertyName
     * @param {number} [qty=0] 
     */
    static add (entity, propertyName, qty = 0) {
        if (entity.isValid()) {
            const currentQty = DynamicPropertyLib.getNumber(entity, propertyName);
            entity.setDynamicProperty(propertyName, currentQty + qty);
        }
    }

    /**
     * 
     * @param {Entity[]} entities 
     * @param {string} propertyName 
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
     * @param {Entity} entity
     * @param {string} propertyName
     * @param {number} [qty=0] 
     */
    static getNumber (entity, propertyName) {
        if (entity.isValid()) {
            const currentQty = entity.getDynamicProperty(propertyName);
            if (!currentQty || typeof currentQty != 'number') {
                entity.setDynamicProperty(propertyName, 0);
                return 0;
            }
            return currentQty;
        } 
        else return 0;
    }
}