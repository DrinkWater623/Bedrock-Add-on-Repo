// dynamicPropertyClass.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T.
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20251024 - Add get boolean value and propertyExists()
    20251207 - add inc/dec
    20251212 - added onPlayerInteractWithBlockBeforeEventInfo_set/get
    20251214 - added onPlayerInteractWithBlockBeforeEventInfo_show
    20251217 - added show_all (with Chatty)
========================================================================*/
import { Entity, Player, PlayerInteractWithBlockBeforeEvent, system, World } from "@minecraft/server";
import { listObjectInnards } from "./objects.js";
import { trimSeparators } from "./stringLib.js";
import { Vector3Lib } from "./vectorClass.js";
//==============================================================================
/** @typedef {import("@minecraft/server").Vector3} Vector3 */
/**
 * @typedef {{
 *   startsWith?: string,
 *   includes?: string,
 *   endsWith?: string,
 *   abbreviate?: boolean,
 *   trimAbbrevSeparators?: boolean, 
 *   keyColor?: string,
 *   valueColor?: string,
 *   titleColor?: string,
 *   resetColor?: string,
 *   indent?: string,
 *   showTypes?: boolean,
 *   sortKeys?: boolean,
 *   maxDepth?: number,
 *   maxEntries?: number,
 *   maxArrayItems?: number
 * }} FilterOpts
 */

//==============================================================================
export class DynamicPropertyLib {
    //=============================================================
    // Core safety guards
    //=============================================================
    /**
     * Determine if the given owner is still safe to access.
     * @param {Entity | World | undefined | null} owner
     * @returns {owner is (Entity | World)}
     */
    static _canReadDP (owner) {
        if (!owner || typeof owner.getDynamicProperty !== "function") return false;
        if ("isValid" in owner && typeof owner.isValid === "boolean") {
            return owner.isValid;
        }
        return true;
    }

    /**
     * Safely read a property, returning `undefined` if not available or owner invalid.
     * @template T
     * @param {Entity | World | undefined | null} owner
     * @param {string} key
     * @returns {T | undefined}
     */
    static _safeGet (owner, key) {
        if (!this._canReadDP(owner)) return undefined;
        try {
            return /** @type {T|undefined} */ (owner.getDynamicProperty(key));
        } catch {
            return undefined;
        }
    }

    /**
     * Safely set a property, returning true if successful.
     * @param {Entity | World | undefined | null} owner
     * @param {string} key
     * @param {any} value
     * @returns {boolean}
     */
    static _safeSet (owner, key, value) {
        if (!this._canReadDP(owner)) return false;
        try {
            owner.setDynamicProperty(key, value);
            return true;
        } catch {
            return false;
        }
    }

    //=============================================================
    // Existence check
    //=============================================================
    /**
     * Check if a dynamic property exists and is accessible.
     * @param {Entity | World | undefined | null} owner
     * @param {string} key
     * @returns {boolean}
     */
    static propertyExists (owner, key) {
        const val = this._safeGet(owner, key);
        return typeof val !== "undefined";
    }

    //=============================================================
    // Getters by type
    //=============================================================
    /**
     * @param {Entity | World | undefined | null} owner
     * @param {string} key
     * @param {number} [defaultValue=0]
     * @returns {number}
     */
    static getNumber (owner, key, defaultValue = 0) {
        const v = this._safeGet(owner, key);
        return typeof v === "number" ? v : defaultValue;
    }

    /**
     * @param {Entity | World | undefined | null} owner
     * @param {string} key
     * @param {boolean} [defaultValue=false]
     * @returns {boolean}
     */
    static getBoolean (owner, key, defaultValue = false) {
        const v = this._safeGet(owner, key);
        return typeof v === "boolean" ? v : defaultValue;
    }

    /**
     * @param {Entity | World | undefined | null} owner
     * @param {string} key
     * @param {string} [defaultValue=""]
     * @returns {string}
     */
    static getString (owner, key, defaultValue = "") {
        const v = this._safeGet(owner, key);
        return typeof v === "string" ? v : defaultValue;
    }

    /**
     * @param {Entity | World | undefined | null} owner
     * @param {string} key
     * @param {Vector3} [defaultValue={x:0,y:0,z:0}]
     * @returns {Vector3}
     */
    static getVector (owner, key, defaultValue = { x: 0, y: 0, z: 0 }) {
        const v = this._safeGet(owner, key);
        if (
            v &&
            typeof v === "object" &&
            "x" in v && "y" in v && "z" in v &&
            typeof v.x === "number" &&
            typeof v.y === "number" &&
            typeof v.z === "number"
        ) {
            return /** @type {Vector3} */ (v);
        }
        return defaultValue;
    }

    //=============================================================
    // Setters by type
    //=============================================================
    /**
     * @param {Entity | World | undefined | null} owner
     * @param {string} key
     * @param {number} value
     * @returns {boolean}
     */
    static setNumber (owner, key, value) {
        return this._safeSet(owner, key, value);
    }

    /**
     * @param {Entity | World | undefined | null} owner
     * @param {string} key
     * @param {boolean} value
     * @returns {boolean}
     */
    static setBoolean (owner, key, value) {
        return this._safeSet(owner, key, value);
    }

    /**
     * @param {Entity | World | undefined | null} owner
     * @param {string} key
     * @param {string} value
     * @returns {boolean}
     */
    static setString (owner, key, value) {
        return this._safeSet(owner, key, value);
    }

    /**
     * @param {Entity | World | undefined | null} owner
     * @param {string} key
     * @param {Vector3} value
     * @returns {boolean}
     */
    static setVector (owner, key, value) {
        return this._safeSet(owner, key, value);
    }

    //=============================================================
    // Arithmetic helpers for numbers
    //=============================================================
    /**
     * Add or subtract a value to an existing numeric DP.
     * @param {Entity | World | undefined | null} owner
     * @param {string} key
     * @param {number} delta
     * @returns {number}
     */
    static addNumber (owner, key, delta) {
        const current = this.getNumber(owner, key, 0);
        const next = current + delta;
        this.setNumber(owner, key, next);
        return next;
    }

    /**
     * Increment a numeric DP by 1.
     * @param {Entity | World | undefined | null} owner
     * @param {string} key
     * @returns {number}
     */
    static increment (owner, key) {
        return this.addNumber(owner, key, 1);
    }

    /**
     * Decrement a numeric DP by 1.
     * @param {Entity | World | undefined | null} owner
     * @param {string} key
     * @returns {number}
     */
    static decrement (owner, key) {
        return this.addNumber(owner, key, -1);
    }

    /**
     * Set numeric DP to the sum of all provided values.
     * @param {Entity | World | undefined | null} owner
     * @param {string} key
     * @param {...number} nums
     * @returns {number}
     */
    static sum (owner, key, ...nums) {
        const total = nums.reduce((a, b) => a + b, 0);
        this.setNumber(owner, key, total);
        return total;
    }
    //=============================================================
    //  Special work-around for missing face location in OnPlace Block Component
    //=============================================================
    /**
    * 
    * @param {PlayerInteractWithBlockBeforeEvent} event 
    * @param {string[]} [blockFilters] 
    * @param {string[]} [itemStackFilters]
    * @param {boolean} [alert=false]
    * @returns 
    */
    static onPlayerInteractWithBlockBeforeEventInfo_set (event, blockFilters, itemStackFilters, alert = false) {
        if (!event.isFirstEvent) return;

        const player = event.player;
        if (!player || !player.isValid) return;

        const { block, itemStack } = event;

        // Filters
        if (itemStack && itemStackFilters && itemStackFilters.length > 0) {
            const typeId = itemStack.typeId;
            if (!typeId || !itemStackFilters.includes(typeId)) {
                player.setDynamicProperty('dw623:lastInteractWithBlockBeforeTick', 0);
                return;
            }
        }

        if (block && blockFilters && blockFilters.length > 0) {
            const typeId = block.typeId;
            if (!typeId || !blockFilters.includes(typeId)) {
                player.setDynamicProperty('dw623:lastInteractWithBlockBeforeTick', 0);
                return;
            }
        }

        //save this to player for the custom component to verify/use
        player.setDynamicProperty('dw623:lastInteractWithBlockBeforeTick', system.currentTick);
        player.setDynamicProperty('dw623:lastInteractWithBlockBeforeBlockTypeId', block.typeId);
        player.setDynamicProperty('dw623:lastInteractWithBlockBeforeBlockLocation', block.location);
        player.setDynamicProperty('dw623:lastInteractWithBlockBeforeBlockFace', event.blockFace);
        player.setDynamicProperty('dw623:lastInteractWithBlockBeforeFaceLocation', event.faceLocation);
        player.setDynamicProperty('dw623:lastInteractWithBlockBeforeItemStackTypeId', itemStack ? itemStack.typeId : '');

        if (alert) this.onPlayerInteractWithBlockBeforeEventInfo_show(player);
    }
    /**
     * 
     * @param {Player} player 
     * @param {boolean} [alert=false] 
     * @returns {{tick:number, blockTypeId:string, blockLocation:Vector3 | undefined, blockFace:string, faceLocation:Vector3 | undefined, itemTypeId:string}}
     * 
     */
    static onPlayerInteractWithBlockBeforeEventInfo_get (player, alert = false) {

        if (!player || !player.isValid)
            return { tick: 0, blockTypeId: '', blockLocation: undefined, blockFace: '', faceLocation: undefined, itemTypeId: '' };

        const returnObj = {
            tick: this.getNumber(player, 'dw623:lastInteractWithBlockBeforeTick'),
            blockTypeId: this.getString(player, 'dw623:lastInteractWithBlockBeforeBlockTypeId'),
            blockLocation: this.getVector(player, 'dw623:lastInteractWithBlockBeforeBlockLocation'),
            blockFace: this.getString(player, 'dw623:lastInteractWithBlockBeforeBlockFace'),
            faceLocation: this.getVector(player, 'dw623:lastInteractWithBlockBeforeFaceLocation'),
            itemTypeId: this.getString(player, 'dw623:lastInteractWithBlockBeforeItemStackTypeId')
        };
        if (alert) this.onPlayerInteractWithBlockBeforeEventInfo_show(player);
        return returnObj;
    }
    /**
     * 
     * @param {Player} player      
     */
    static onPlayerInteractWithBlockBeforeEventInfo_show (player) {

        if (!player || !player.isValid) return;
        this.show_all(
            player,
            '\n§6§lPlayerInteractWithBlockBeforeEvent Info:§r',
            {
                startsWith: 'dw623:lastInteractWithBlockBefore',
                abbreviate: true,
                trimAbbrevSeparators: true
            });
    }
    //=============================================================
    //  let me see it a.k.a. spill your guts
    //=============================================================
    /**
     * 
       * List a player's Dynamic Properties.
       *
       * @param {Player} player
       * @param {string} [title='']
       * @param {FilterOpts} [filterOpts={}]
       * @returns {void}
       */
    static show_all (player, title = "", filterOpts = {}) {
        if (!player || !player.isValid) return;

        const ids = player.getDynamicPropertyIds();
        if (!ids.length) {
            console.warn(`${title ? title + " - " : ""}Player has no Dynamic Properties`);
            return;
        }

        // inside show_all destructure:
        const {
            startsWith = "",
            includes = "",
            endsWith = "",
            abbreviate = false,
            trimAbbrevSeparators = true,
            ...listOpts
        } = filterOpts;

        const filtered = ids.filter((id) => {
            if (startsWith && !id.startsWith(startsWith)) return false;
            if (includes && !id.includes(includes)) return false;
            if (endsWith && !id.endsWith(endsWith)) return false;
            return true;
        });

        if (!filtered.length) {
            console.warn(
                `${title ? title + " - " : ""}No Dynamic Properties matched ` +
                `(startsWith="${startsWith}", includes="${includes}", endsWith="${endsWith}")`
            );
            return;
        }

        // --- abbreviation rules ---
        const canAbbrevPrefix = abbreviate && !!startsWith;
        const canAbbrevSuffix = abbreviate && !startsWith && !!endsWith; // prefer startsWith

        /**
         * @param {string} full
         * @returns {string}
         */
        function abbreviateKey (full) {
            let k = full;

            if (canAbbrevPrefix) k = full.slice(startsWith.length);
            else if (canAbbrevSuffix) k = full.slice(0, full.length - endsWith.length);

            if (trimAbbrevSeparators) k = trimSeparators(k);

            return k || full;
        }

        /** @type {Record<string, unknown>} */
        const out = {};
        for (const id of filtered.sort()) {
            const shortKey = abbreviateKey(id) || id; // avoid empty key
            let value = player.getDynamicProperty(id);
            if (value != null && typeof value == 'object') value = Vector3Lib.toString(value, 1, true);
            out[ shortKey ] = value;
        }

        // Title decoration
        const abbrevHint =
            canAbbrevPrefix ? `${startsWith}*` :
                canAbbrevSuffix ? `*${endsWith}` :
                    "";

        const finalTitle =
            title
                ? (abbrevHint ? `${title} (${abbrevHint})` : title)
                : (abbrevHint
                    ? `Player Dynamic Properties (${abbrevHint}) (${filtered.length}/${ids.length})`
                    : `Player Dynamic Properties (${filtered.length}/${ids.length})`);

        listObjectInnards(out, {
            title: finalTitle,
            showTypes: true,
            sortKeys: true,
            indent: "==> ",
            ...listOpts,
        });
    }
}