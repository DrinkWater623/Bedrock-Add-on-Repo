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

import { Block } from "@minecraft/server";

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
 *   keyColor?: string,    // default §b
 *   valueColor?: string,  // default §r
 *   titleColor?: string,  // optional, default §e
 *   resetColor?: string   // default §r
 * }} ListOpts
 */
//==============================================================================
/**
 * Internal building blocks - Return an array (recursively), returning printable lines.
 *
 * @param {unknown[]} array
 * @param {ListOpts} [opts]
 * @param {WeakSet<object>} [seen]
 * @param {number} [depth]
 * @param {string} [path]
 * @returns {string[]}
 */
function _getEmitLines_array (array, opts = {}, seen = new WeakSet(), depth = 0, path = "array") {
    const {
        title = "Array List:",
        maxDepth = 6,
        maxArrayItems = 100,
        indent = "  ",
        showTypes = false,

        keyColor = "§b",
        valueColor = "§r",
        titleColor = "§e",
        resetColor = "§r",
    } = opts;

    /** @type {string[]} */
    const lines = [];

    // depth guard
    if (depth > maxDepth) {
        lines.push(`${title} (maxDepth ${maxDepth} reached at ${path})`);
        return lines;
    }
    // right after the depth guard
    if (seen.has(array)) {
        lines.push(`${title} (cycle detected at ${path})`);
        return lines;
    }
    seen.add(array);

    lines.push(`${titleColor}${title}${resetColor} (${array.length})`);

    const limit = Math.min(array.length, maxArrayItems);
    for (let i = 0; i < limit; i++) {
        const v = array[ i ];
        const prefix = `${indent.repeat(depth + 1)}${keyColor}[${i}]${resetColor}`;


        lines.push(`${prefix}: ${valueColor}${formatValue(v, showTypes)}${resetColor}`);

        if (Array.isArray(v)) {
            lines.push(..._getEmitLines_array(v, { ...opts, title: `${path}[${i}]` }, seen, depth + 1, `${path}[${i}]`));
        } else if (isPlainObject(v)) {
            if (seen.has(/** @type {object} */(v))) {
                lines.push(`${indent.repeat(depth + 2)}↳ §6(cycle detected)`);
            } else {
                seen.add(/** @type {object} */(v));
                lines.push(..._getEmitLines_object(v, { ...opts, title: `${path}[${i}]` }, seen, depth + 1, `${path}[${i}]`));
            }
        }
    }

    if (array.length > limit) {
        lines.push(`${indent.repeat(depth + 1)}… (${array.length - limit} more items)`);
    }

    return lines;
}
/**
 * Internal building blocks - Return an object's key/value innards (recursively), including arrays found inside.
 *
 * @param {unknown} input
 * @param {ListOpts} [opts]
 * @param {WeakSet<object>} [seen] @internal
 * @param {number} [depth] @internal
 * @param {string} [path] @internal
 * @returns {string[]}
 */
function _getEmitLines_object (input, opts = {}, seen = new WeakSet(), depth = 0, path = "object") {
    const {
        title = "Key-Value List:",
        maxDepth = 6,
        maxEntries = 200,
        indent = "  ",
        showTypes = false,
        sortKeys = false,

        keyColor = "§b",
        valueColor = "§r",
        titleColor = "§e",
        resetColor = "§r",
    } = opts;

    /** @type {string[]} */
    const lines = [];

    if (depth > maxDepth) {
        lines.push(`${title} (maxDepth ${maxDepth} reached at ${path})`);
        return lines;
    }

    // If it's an array, delegate
    if (Array.isArray(input)) {
        return _getEmitLines_array(input, { ...opts, title }, seen, depth, path);
    }

    // Primitives / null
    if (input == null || typeof input !== "object") {
        lines.push(`${title}: ${formatValue(input, showTypes)}`);
        return lines;
    }

    // Cycle guard
    if (seen.has(input)) {
        lines.push(`${title} (cycle detected at ${path})`);
        return lines;
    }
    seen.add(input);

    const obj = /** @type {any} */ (input);
    let keys = Object.keys(obj);
    if (sortKeys) keys = keys.sort();

    lines.push(`${titleColor}${title}${resetColor} (${keys.length})`);

    const limit = Math.min(keys.length, maxEntries);
    for (let i = 0; i < limit; i++) {
        const k = keys[ i ];
        const v = obj[ k ];
        const prefix = `${indent.repeat(depth + 1)}${keyColor}[${k}]${resetColor}`;

        lines.push(`${prefix}: ${valueColor}${formatValue(v, showTypes)}${resetColor}`);

        if (Array.isArray(v)) {
            lines.push(..._getEmitLines_array(v, { ...opts, title: k }, seen, depth + 1, `${path}.${k}`));
        } else if (isPlainObject(v)) {
            lines.push(..._getEmitLines_object(v, { ...opts, title: k }, seen, depth + 1, `${path}.${k}`));
        }
    }

    if (keys.length > limit) lines.push(`${indent.repeat(depth + 1)}… (${keys.length - limit}§c more entries)`);
    return lines;
}
/**
 * List an array (recursively), returning printable lines.
 * Prints to console.warn (legacy behavior) - Use emitArray for control of output
 *
 * @param {unknown[]} array
 * @param {ListOpts} [opts]
 * @returns {void}
 */
export function listArray (array, opts = {}) {
    emitArray(console.warn, array, opts);
}
/**
 * List an object's key/value innards (recursively), including arrays found inside.
 * Prints to console.warn (legacy behavior) - Use emitObjectInnards for control of output
 *
 * @param {unknown} input
 * @param {ListOpts} [opts]
 * @returns {void}
 */
export function listObjectInnards (input, opts = {}) {
    emitObjectInnards(console.warn, input, opts);
}
//------------------------------------------------------------------------------
// Optional emit-style wrappers (handy for Debugger.log)
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
// Optional emit-style wrappers (handy for Debugger.log)
//------------------------------------------------------------------------------
/**
 * Emit an object's innards as ONE message (tight line spacing).
 *
 * @param {(msg: string) => void} emit
 * @param {unknown} input
 * @param {ListOpts & { leadingNewline?: boolean, newline?: "\n" | "\r\n" }} [opts]
 * @returns {void}
 */
function _emitInnards (emit, input, opts = {}) {
    const {
        leadingNewline = true,
        newline = "\n",
        ...listOpts
    } = opts;

    const lines = Array.isArray(input)
        ? _getEmitLines_array(input, listOpts)
        : _getEmitLines_object(input, listOpts);
        
    if (!lines.length) return;

    // One leading blank line (your request), then join with exactly one newline between lines.
    const msg = (leadingNewline ? newline : "") + lines.join(newline);
    emit(msg);
}
/**
 * Emit an object's innards as ONE message (tight line spacing).
 *
 * @param {(msg: string) => void} emit
 * @param {unknown} input
 * @param {ListOpts & { leadingNewline?: boolean, newline?: "\n" | "\r\n" }} [opts]
 * @returns {void}
 */
export function emitObjectInnards (emit, input, opts = {}) {
    return _emitInnards(emit, input, opts);
}
/**
 * @param {(line: string) => void} emit
 * @param {unknown[]} array
 * @param {ListOpts} [opts]
 * @returns {void}
 */
export function emitArray (emit, array, opts = {}) {
    return _emitInnards(emit, array, opts);
}
/**
 * @param {Record<string|number, unknown>} map
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
