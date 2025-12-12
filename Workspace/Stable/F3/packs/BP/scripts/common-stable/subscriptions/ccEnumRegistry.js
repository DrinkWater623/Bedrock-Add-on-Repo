// EnumRegistrar.js
// @ts-check

/** Minimal registry interface. Replace with your actual type if you have one. */
/** @typedef {{ registerEnum(name: string, values: readonly string[]): void }} CustomCommandRegistry */

/**
 * Helper to register string enums with a command registry.
 * - Holds a default registry (optional) so you don't pass it every time.
 * - Idempotent: ignores duplicates by name.
 * - Keeps a map of names -> enumList so you can retrieve later.
 */
export class EnumRegistrar {
  /** @type {CustomCommandRegistry | null} */ #registry = null;
  /** @type {Map<string, readonly string[]>} */ #map = new Map();

    /**
     * @param {CustomCommandRegistry} [registry] Optional default registry held by the instance.
     */
    constructor(registry) {
        if (registry) this.#registry = registry;
    }

    getRegistry () { return this.#registry; }

    /** @param {CustomCommandRegistry} registry */
    setRegistry (registry) { this.#registry = registry; }
    /**
     * Has this enum name already been registered by this instance?
     * @param {string} name
     */
    has (name) { return this.#map.has(name); }

    /** Get the enum list for a name (if registered through this instance). */
    /** @param {string} name @returns {readonly string[] | undefined} */
    get (name) { return this.#map.get(name); }

    /** Snapshot of all names this instance has registered. */
    /** @returns {string[]} */
    listNames () { return Array.from(this.#map.keys()); }

    /** Snapshot of all entries as [name, enumList]. */
    /** @returns {Array<[string, readonly string[]]>} */
    entries () { return Array.from(this.#map.entries()); }

    /** Plain object view (useful for debugging). */
    /** @returns {Record<string, readonly string[]>} */
    toObject () {
        const out = /** @type {Record<string, readonly string[]>} */({});
        for (const [ k, v ] of this.#map) out[ k ] = v;
        return out;
    }

    /**
     * Register an enum if not already registered. Stores the list for retrieval.
     * If this instance has no registry, you must pass one via the parameter.
     *
     * @param {string} name Unique enum name/key.
     * @param {readonly string[]} enumList Values for the enum (tuple or array of strings).
     * @param {CustomCommandRegistry} [registry] Optional registry override for this call.
     * @returns {boolean} true if newly registered; false if it was already present.
     */
    add (name, enumList, registry) {
        if (this.#map.has(name)) return false; // already added

        const reg = registry ?? this.#registry;
        if (!reg) throw new Error("EnumRegistrar: no registry available. Pass one to constructor, setRegistry(), or add(name, list, registry)");

        reg.registerEnum(name, enumList);
        this.#map.set(name, enumList);
        return true;
    }

    /**
     * Update an existing enum name with a new list and re-register it.
     * If not yet present, behaves like add().
     * @param {string} name
     * @param {readonly string[]} enumList
     * @param {CustomCommandRegistry} [registry]
     */
    upsert (name, enumList, registry) {
        const reg = registry ?? this.#registry;
        if (!reg) throw new Error("EnumRegistrar: no registry available for upsert");

        // Bedrock registry has no 'unregister'; re-register will overwrite in most implementations.
        reg.registerEnum(name, enumList);
        this.#map.set(name, enumList);
    }

    /**
     * Register many at once.
     * @param {{ name: string, enumList: readonly string[] }[]} items
     * @param {CustomCommandRegistry} [registry]
     * @returns {{ added: string[]; skipped: string[] }}
     */
    addMany (items, registry) {
    /** @type {string[]} */ const added = [];
    /** @type {string[]} */ const skipped = [];
        for (const { name, enumList } of items) {
            if (this.add(name, enumList, registry)) added.push(name); else skipped.push(name);
        }
        return { added, skipped };
    }
}

/** Shared singleton (optional). */
export const enumRegistrar = new EnumRegistrar();

/* Usage examples:

import { enumRegistrar } from "./EnumRegistrar.js";

// Setup once
enumRegistrar.setRegistry(registry);

// Add single
enumRegistrar.add("dw623:query_on_off", ["Query","Off","On"]);

// Retrieve later
const list = enumRegistrar.get("dw623:query_on_off"); // -> ["Query","Off","On"]

// Batch
enumRegistrar.addMany([
  { name: "dw623:mode",  enumList: ["Easy","Hard"] },
  { name: "dw623:color", enumList: ["Red","Green","Blue"] },
]);

// Update existing
enumRegistrar.upsert("dw623:mode", ["Easy","Normal","Hard"]);
*/
