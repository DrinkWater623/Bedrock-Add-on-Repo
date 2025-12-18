// object.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Description:     
    Anything related to objects
========================================================================
Change Log:    
    20251216 - Created and chatty helped me fill it up with what I needed
*/
//==============================================================================
/**
 * @param {Record<string, unknown>} obj
 * @param {string} [filter='']
 * @returns {string[]}
 */
export const objectKeysWhereBoolean = (obj = {}, filter = '') =>
    obj && typeof obj === 'object' && !Array.isArray(obj)
        ? Object.entries(obj)
            .filter(([ k, v ]) => (!filter || k.includes(filter)) && typeof v === 'boolean')
            .map(([ k ]) => k)
        : [];
//==============================================================================
/**
 * @param {Record<string, unknown>} obj
 * @param {{
 *   filter?: string,
 *   filterStartsWith?: string,
 *   filterEndsWith?: string,
 *   filterExact?: string,
 *   value?: boolean
 * }} [opts]
 * @returns {string[]}
 */
export function objectKeysWhereBooleanOpts (obj = {}, opts = {}) {
    const {
        filter = '',
        filterStartsWith = '',
        filterEndsWith = '',
        filterExact = '',
        value
    } = opts;

    if (obj == null || typeof obj !== 'object' || Array.isArray(obj)) return [];

    /** @type {string[]} */
    const out = [];

    for (const [ k, v ] of Object.entries(obj)) {
        if (filter && !k.includes(filter)) continue;
        if (filterStartsWith && !k.startsWith(filterStartsWith)) continue;
        if (filterEndsWith && !k.endsWith(filterEndsWith)) continue;
        if (filterExact && k !== filterExact) continue;

        if (typeof v !== 'boolean') continue;
        if (value !== undefined && v !== value) continue;

        out.push(k);
    }

    return out;
}
//==============================================================================
/**
 * Sets all boolean-valued entries on an object to `toggle` (optionally key-filtered).
 *
 * @param {Record<string, unknown>} targetObject
 * @param {boolean} [toggle=false]
 * @param {string} [filter='']
 * @returns {void}
 */
export function objectEntries_set_booleans (targetObject = {}, toggle = false, filter = '') {
    objectEntries_set_booleans_opts(targetObject, toggle, { filter: filter });
}
//==============================================================================
/**
 * Set boolean-valued entries on an object to `toggle` (optionally key-filtered).
 *
 * @param {Record<string, unknown>} targetObject
 * @param {boolean} [toggle=false]
 * @param {{
 *   filter?: string,
 *   filterStartsWith?: string,
 *   filterEndsWith?: string,
 *   filterExact?: string,
 *   only?: boolean,
 *   dive?: boolean
 * }} [opts]
 * @returns {void}
 */
export function objectEntries_set_booleans_opts (targetObject = {}, toggle = false, opts = {}) {
    if (targetObject == null || typeof targetObject !== "object" || Array.isArray(targetObject)) return;

    const {
        filter = "",
        filterStartsWith = "",
        filterEndsWith = "",
        filterExact = "",
        only,
        dive = false,
    } = opts;

    // Prevent infinite recursion if someone passes an object with cycles
    /** @type {WeakSet<object>} */
    // @ts-expect-error private internal field
    const seen = (opts._seen ??= new WeakSet());
    if (seen.has(targetObject)) return;
    seen.add(targetObject);

    for (const k of Object.keys(targetObject)) {
        if (filterExact && k !== filterExact) continue;
        if (filterStartsWith && !k.startsWith(filterStartsWith)) continue;
        if (filterEndsWith && !k.endsWith(filterEndsWith)) continue;
        if (filter && !k.includes(filter)) continue;

        const v = targetObject[ k ];

        if (typeof v === "boolean") {
            if (only !== undefined && v !== only) continue;
            targetObject[ k ] = toggle;
            continue;
        }

        if (dive && v != null && typeof v === "object" && !Array.isArray(v)) {
            objectEntries_set_booleans_opts(/** @type {Record<string, unknown>} */(v), toggle, opts);
        }
    }
}
//==============================================================================
/**
 * Toggles all boolean-valued entries on an object (optionally key-filtered).
 *
 * @param {Record<string, unknown>} targetObject
 * @param {string} [filter='']
 * @returns {void}
 */
export function objectEntries_toggle_booleans (targetObject = {}, filter = '') {
    objectEntries_toggle_booleans_opts(targetObject, { filter: filter });
}
//==============================================================================
/**
 * @param {Record<string, unknown>} targetObject
 * @param {{
 *   filter?: string,
 *   filterStartsWith?: string,
 *   filterEndsWith?: string,
 *   filterExact?: string,
 *   only?: boolean
 * }} [opts]
 * @returns {void}
 */
export function objectEntries_toggle_booleans_opts (targetObject = {}, opts = {}) {
    const {
        filter = '',
        filterStartsWith = '',
        filterEndsWith = '',
        filterExact = '',
        only
    } = opts;

    if (targetObject == null || typeof targetObject !== 'object' || Array.isArray(targetObject)) return;
    const targetEntries = objectKeysWhereBooleanOpts(targetObject, opts);
    for (const k of targetEntries) {
        // // key filters first
        // if (filterExact && k !== filterExact) continue;
        // if (filterStartsWith && !k.startsWith(filterStartsWith)) continue;
        // if (filterEndsWith && !k.endsWith(filterEndsWith)) continue;
        // if (filter && !k.includes(filter)) continue;

        const v = targetObject[ k ];
        if (typeof v !== 'boolean') continue;
        if (only !== undefined && v !== only) continue;

        targetObject[ k ] = !v;
    }
}
//==============================================================================
/**
 * @typedef {{ before: boolean, after: boolean }} BeforeAfter
 * @typedef {Record<string, boolean | BeforeAfter>} MixedFlagMap
 */
/**
 * @param {unknown} v
 * @returns {v is BeforeAfter}
 */
export function isBeforeAfterBooleanObject (v) {
    if (v == null || typeof v !== "object" || Array.isArray(v)) return false;

    const o = /** @type {Record<string, unknown>} */ (v);

    if (!("before" in o) || !("after" in o)) return false;

    return typeof o.before === "boolean" && typeof o.after === "boolean";
}
/**
 * Shallow-clone a flag map where values are either booleans or {before, after}.
 * This prevents shared nested objects across instances.
 *
 * @param {MixedFlagMap} src
 * @returns {MixedFlagMap}
 */
export function cloneMixedBooleanAfterBeforeFlagMap (src) {
    /** @type {MixedFlagMap} */
    const out = {};

    for (const [ k, v ] of Object.entries(src)) {
        if (typeof v === "boolean") out[ k ] = v;
        else if (typeof v === "object" && isBeforeAfterBooleanObject(v)) out[ k ] = { before: v.before, after: v.after };
        // else: ignore unexpected shapes (or throw if you prefer)
    }

    return out;
}
//==============================================================================
/**
 * Returns true if ANY boolean-valued entry matches `value` (default true),
 * with optional key-filtering and optional deep dive into nested objects.
 *
 * @param {Record<string, unknown>} targetObject
 * @param {{
 *   filter?: string,
 *   filterStartsWith?: string,
 *   filterEndsWith?: string,
 *   filterExact?: string,
 *   value?: boolean,   // default true
 *   dive?: boolean,
 *   _seen?: WeakSet<object>
 * }} [opts]
 * @returns {boolean}
 */
export function objectEntries_any_booleans_opts (targetObject = {}, opts = {}) {
    if (targetObject == null || typeof targetObject !== "object" || Array.isArray(targetObject)) return false;

    const {
        filter = "",
        filterStartsWith = "",
        filterEndsWith = "",
        filterExact = "",
        value = true,
        dive = false,
        _seen
    } = opts;

    // cycle protection
    const seen = _seen ?? new WeakSet();
    if (seen.has(targetObject)) return false;
    seen.add(targetObject);

    for (const k of Object.keys(targetObject)) {
        if (filterExact && k !== filterExact) continue;
        if (filterStartsWith && !k.startsWith(filterStartsWith)) continue;
        if (filterEndsWith && !k.endsWith(filterEndsWith)) continue;
        if (filter && !k.includes(filter)) continue;

        const v = targetObject[ k ];

        if (typeof v === "boolean") {
            if (v === value) return true;
            continue;
        }

        if (dive && v != null && typeof v === "object" && !Array.isArray(v)) {
            if (objectEntries_any_booleans_opts(/** @type {Record<string, unknown>} */(v), { ...opts, _seen: seen })) {
                return true;
            }
        }
    }

    return false;
}
//------------------------------------------------------------------------------
/**
 * Convenience wrapper: any boolean is true?
 * @param {Record<string, unknown>} targetObject
 * @param {string} [filter='']
 * @returns {boolean}
 */
export function objectEntries_any_true (targetObject = {}, filter = "") {
    return objectEntries_any_booleans_opts(targetObject, { filter, value: true });
}
//==============================================================================
/**
 * @typedef {{
 *   title?: string,
 *   maxDepth?: number,
 *   maxEntries?: number,
 *   maxArrayItems?: number,
 *   indent?: string,
 *   showTypes?: boolean,
 *   sortKeys?: boolean
 * }} ListOpts
 */

/**
 * @param {unknown} v
 * @returns {v is Record<string, unknown>}
 */
function isPlainObject (v) {
    return v != null && typeof v === "object" && !Array.isArray(v);
}

/**
 * @param {unknown} v
 * @param {boolean} showTypes
 * @returns {string}
 */
function formatValue (v, showTypes) {
    const t = typeof v;

    if (v === null) return showTypes ? "null (object)" : "null";
    if (t === "string") return JSON.stringify(v);
    if (t === "number" || t === "boolean" || t === "bigint") return showTypes ? `${String(v)} (${t})` : String(v);
    if (t === "undefined") return "undefined";
    if (t === "symbol") return showTypes ? `${String(v)} (symbol)` : String(v);

    if (t === "function") {
        const fn = /** @type {Function} */ (v);
        return showTypes
            ? `[Function${fn.name ? `: ${fn.name}` : ""}] (function)`
            : `[Function${fn.name ? `: ${fn.name}` : ""}]`;
    }

    if (Array.isArray(v)) return showTypes ? `[Array(${v.length})] (object)` : `[Array(${v.length})]`;

    if (v != null && typeof v === "object") {
        const ctor = /** @type {{ constructor?: { name?: string } }} */ (v).constructor;
        const name = ctor?.name && ctor.name !== "Object" ? ctor.name : "Object";
        return showTypes ? `[${name}] (object)` : `[${name}]`;
    }

    return showTypes ? `[${t}]` : `[${t}]`;
}
/**
 * List an array (recursively), returning printable lines.
 *
 * @param {unknown[]} array
 * @param {ListOpts} [opts]
 * @param {WeakSet<object>} [seen]
 * @param {number} [depth]
 * @param {string} [path]
 * @returns {string[]}
 */
export function listArray (array, opts = {}, seen = new WeakSet(), depth = 0, path = "array") {
    const {
        title = "Array List:",
        maxDepth = 6,
        maxArrayItems = 100,
        indent = "  ",
        showTypes = false,
    } = opts;

    /** @type {string[]} */
    const lines = [];

    // depth guard
    if (depth > maxDepth) {
        lines.push(`${title} (maxDepth ${maxDepth} reached at ${path})`);
        return lines;
    }

    lines.push(`${title} (${array.length})`);

    const limit = Math.min(array.length, maxArrayItems);
    for (let i = 0; i < limit; i++) {
        const v = array[ i ];
        const prefix = `${indent.repeat(depth + 1)}[${i}]`;

        if (Array.isArray(v)) {
            lines.push(`${prefix}: ${formatValue(v, showTypes)}`);
            if (seen.has(v)) {
                lines.push(`${indent.repeat(depth + 2)}↳ (cycle detected)`);
            } else {
                seen.add(v);
                lines.push(...listArray(v, { ...opts, title: `${path}[${i}]` }, seen, depth + 1, `${path}[${i}]`));
            }
        } else if (isPlainObject(v)) {
            lines.push(`${prefix}: ${formatValue(v, showTypes)}`);
            if (seen.has(/** @type {object} */(v))) {
                lines.push(`${indent.repeat(depth + 2)}↳ (cycle detected)`);
            } else {
                seen.add(/** @type {object} */(v));
                lines.push(...listObjectInnards(v, { ...opts, title: `${path}[${i}]` }, seen, depth + 1, `${path}[${i}]`));
            }
        } else {
            lines.push(`${prefix}: ${formatValue(v, showTypes)}`);
        }
    }

    if (array.length > limit) {
        lines.push(`${indent.repeat(depth + 1)}… (${array.length - limit} more items)`);
    }

    return lines;
}

/**
 * List an object's key/value innards (recursively), including arrays found inside.
 *
 * @param {unknown} value
 * @param {ListOpts} [opts]
 * @param {WeakSet<object>} [seen]
 * @param {number} [depth]
 * @param {string} [path]
 * @returns {string[]}
 */
export function listObjectInnards (value, opts = {}, seen = new WeakSet(), depth = 0, path = "object") {
    const {
        title = "Key-Value List:",
        maxDepth = 6,
        maxEntries = 200,
        indent = "  ",
        showTypes = false,
        sortKeys = false,
    } = opts;

    /** @type {string[]} */
    const lines = [];

    if (depth > maxDepth) {
        lines.push(`${title} (maxDepth ${maxDepth} reached at ${path})`);
        return lines;
    }

    // If it's an array, delegate
    if (Array.isArray(value)) {
        return listArray(value, { ...opts, title }, seen, depth, path);
    }

    // Primitives / null
    if (value == null || typeof value !== "object") {
        lines.push(`${title}: ${formatValue(value, showTypes)}`);
        return lines;
    }

    // Cycle guard
    if (seen.has(value)) {
        lines.push(`${title} (cycle detected at ${path})`);
        return lines;
    }
    seen.add(value);

    const obj = /** @type {any} */ (value);
    let keys = Object.keys(obj);
    if (sortKeys) keys = keys.sort();

    lines.push(`${title} (${keys.length})`);

    const limit = Math.min(keys.length, maxEntries);
    for (let i = 0; i < limit; i++) {
        const k = keys[ i ];
        const v = obj[ k ];
        const prefix = `${indent.repeat(depth + 1)}${k}`;

        if (Array.isArray(v)) {
            lines.push(`${prefix}: ${formatValue(v, showTypes)}`);
            lines.push(...listArray(v, { ...opts, title: k }, seen, depth + 1, `${path}.${k}`));
        } else if (v != null && typeof v === "object") {
            lines.push(`${prefix}: ${formatValue(v, showTypes)}`);
            lines.push(...listObjectInnards(v, { ...opts, title: k }, seen, depth + 1, `${path}.${k}`));
        } else {
            lines.push(`${prefix}: ${formatValue(v, showTypes)}`);
        }
    }

    if (keys.length > limit) lines.push(`${indent.repeat(depth + 1)}… (${keys.length - limit} more entries)`);
    return lines;
}
//------------------------------------------------------------------------------
// Optional emit-style wrappers (handy for Debugger.log)
//------------------------------------------------------------------------------
/**
 * @param {(line: string) => void} emit
 * @param {Record<string, unknown>} object
 * @param {ListOpts} [opts]
 * @returns {void}
 */
export function emitObjectInnards (emit, object, opts = {}) {
    for (const line of listObjectInnards(object, opts)) emit(line);
}
/**
 * @param {(line: string) => void} emit
 * @param {unknown[]} array
 * @param {ListOpts} [opts]
 * @returns {void}
 */
export function emitArray (emit, array, opts = {}) {
    for (const line of listArray(array, opts)) emit(line);
}
/**
 * @param {Record<string, unknown>} map
 * @param {string} key
 * @returns {boolean}
 */
export function booleanKeyExist (map, key) {
    return Object.prototype.hasOwnProperty.call(map, key) && typeof map[ key ] === "boolean";
}
/**
 * @param {Record<string, unknown>} map
 * @param {string} key
 * @returns {boolean | undefined}
 */
export function readBooleanKey (map, key) {
    const v = map[ key ];
    return typeof v === "boolean" ? v : undefined;
}
