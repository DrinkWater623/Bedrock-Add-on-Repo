// ccEnums.js
// @ts-check
import { CustomCommandRegistry } from "@minecraft/server";
import { EnumRegistrar } from "./ccEnumRegistry.js";

/** @type {EnumRegistrar | null} */
let REG = null;
/** @type  CustomCommandRegistry[] */
const savedRegistry = [];

/**
 * Ensure the singleton is initialized and has a registry.
 * Safe to call many times; later calls just refresh the registry.
 * @param {CustomCommandRegistry} registry
 * @returns {EnumRegistrar}
 */
export function ensureEnums (registry) {
    if (!REG) {
        REG = new EnumRegistrar(registry);
        savedRegistry.push(registry)
    }
    else REG.setRegistry(registry);
    return REG;
}
export function getRegistry () {
    return savedRegistry[0]
    //return REG?.getRegistry();
}
/** Guard: throw if not initialized yet. */
function assertReady () {
    if (!REG) throw new Error("EnumRegistrar not initialized. Call ensureEnums(registry) first.");
    return REG;
}

/**
 * Add an enum (idempotent). If you pass a registry, it will also initialize if needed.
 * @param {string} name
 * @param {readonly string[]} enumList
 * @param {CustomCommandRegistry} [registry]
 * @returns {boolean} true if newly registered; false if already present
 */
export function addEnum (name, enumList, registry) {
    const r = registry ? ensureEnums(registry) : assertReady();
    return r.add(name, enumList);
}

/** Get an enum list by name. @param {string} name */
export function getEnum (name) {
    return assertReady().get(name);
}

/** Optional: expose the instance (after init). */
export function enums () {
    return assertReady();
}
