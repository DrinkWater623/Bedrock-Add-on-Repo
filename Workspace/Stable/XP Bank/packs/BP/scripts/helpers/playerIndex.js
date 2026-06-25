// playerIndex.js  XP Bank
//@ts-check
/* =====================================================================
Copyright (C) 2026 DrinkWater623/PinkSalt623/Update Block Dev
License: M.I.T.
URL: https://github.com/DrinkWater623
========================================================================
Change Log:
    20260304 - Created (online player index + auto-saver set)
    20260304 - Changed to id-keyed maps (byId + enabledIds + nameToId)
========================================================================*/
import { system } from "@minecraft/server";
import { pack } from "../settings.js";
import { DynamicPropertyLib } from "../common-stable/tools/index.js";

//==============================================================================

/** @typedef {import("@minecraft/server").Player} Player */

/**
 * @typedef {{
 *   id: string,
 *   name: string,
 *   player: Player,
 *   isAutoSaver: boolean,
 *   autoSaveIncrementMin: number,
 *   autoSaveOver: number,
 *   nextSaveTick: number,
 * }} PlayerEntry
 */

const dv = pack.dvNames;
const TICKS_PER_MIN = 20 * 60;

//==============================================================================

/**
 * Ensure defaults exist once per player (based on dv.initialized).
 * Returns true if this call just initialized the player.
 * @param {Player} player
 */
export function ensurePlayerDefaults (player) {
    const initialized = DynamicPropertyLib.getBoolean(player, dv.initialized);
    if (initialized) return false;

    player.setDynamicProperty(dv.initialized, true);
    player.setDynamicProperty(dv.isAuto, false);
    player.setDynamicProperty(dv.autoSaveOver, 10);
    player.setDynamicProperty(dv.autoSaveInc, 5);
    player.setDynamicProperty(dv.xpBalance, 0);

    return true;
}
export function autoSaveIteration () {
    playerIndex.forEachDueAutoSaver((entry) => {
        // run autosave logic for entry.player
        autoSave(entry);
    });
}
/**
 * 
 * @param {PlayerEntry} entry 
 */
export function autoSave (entry) {
    //If called, just do it.
    const now = system.currentTick;

    if (!entry.player.isValid) {
        playerIndex.removeById(entry.player.id);
        return;
    }

    if (!entry.isAutoSaver) {
        playerIndex.autoSaveEnabledIds.delete(entry.player.id);
        return;
    }

    // Schedule next run
    entry.nextSaveTick = now + entry.autoSaveIncrementMin * TICKS_PER_MIN;

    // get current total XP, check if it's over the "over" threshold, and if so, save to bank and remove that XP from player
    const totalXp = entry.player.getTotalXp();
    if (totalXp > entry.autoSaveOver) {
        const toSave = totalXp - entry.autoSaveOver;
        // Save to bank and remove from player (implementation details depend on your bank system)
        // Example:
        const currentBank = DynamicPropertyLib.getNumber(entry.player, dv.xpBalance, 0);
        DynamicPropertyLib.setNumber(entry.player, dv.xpBalance, currentBank + toSave);
        entry.player.addExperience(-toSave);
    }
}
//==============================================================================

class PlayerIndex {
    constructor() {
        /** @type {Map<string, PlayerEntry>} */
        this.byId = new Map();

        /** @type {Map<string, string>} */
        this.nameToId = new Map();

        /** @type {Set<string>} */
        this.autoSaveEnabledIds = new Set();
    }

    /**
     * Upsert/refresh the player entry on spawn/respawn.
     * Reads DVs once and caches them.
     * @param {Player} player
     */
    upsertFromSpawn (player) {
        const id = player.id;
        const name = player.name;

        const isAutoSaver = DynamicPropertyLib.getBoolean(player, dv.isAuto);
        const autoSaveIncrementMin = Math.max(
            1,
            Math.floor(DynamicPropertyLib.getNumber(player, dv.autoSaveInc, 5))
        );
        const autoSaveOver = Math.max(
            0,
            Math.floor(DynamicPropertyLib.getNumber(player, dv.autoSaveOver, 10))
        );

        /** @type {PlayerEntry} */
        const entry = this.byId.get(id) ?? {
            id,
            name,
            player,
            isAutoSaver,
            autoSaveIncrementMin,
            autoSaveOver,
            nextSaveTick: system.currentTick + autoSaveIncrementMin * TICKS_PER_MIN,
        };

        // Refresh live refs + settings
        entry.player = player;
        entry.name = name;
        entry.isAutoSaver = isAutoSaver;
        entry.autoSaveIncrementMin = autoSaveIncrementMin;
        entry.autoSaveOver = autoSaveOver;

        // If autosave just got turned on, ensure nextSaveTick is sensible.
        if (isAutoSaver && entry.nextSaveTick < system.currentTick) {
            //sooner of now or the old nextSaveTick, to avoid accidentally scheduling far in the future if increment was just reduced.
            entry.nextSaveTick = system.currentTick; // + autoSaveIncrementMin * TICKS_PER_MIN;
        }

        // ✅ THIS IS WHERE “this.byId / this.nameToId / this.enabledIds …” GOES
        this.byId.set(id, entry);
        this.nameToId.set(name, id);

        if (isAutoSaver) {
            this.autoSaveEnabledIds.add(id);
        }
        else {
            this.autoSaveEnabledIds.delete(id);
        }

        return entry;
    }

    /**
     * Remove by id (internal helper).
     * @param {string} id
     */
    removeById (id) {
        const entry = this.byId.get(id);
        if (entry) this.nameToId.delete(entry.name);

        this.byId.delete(id);
        this.autoSaveEnabledIds.delete(id);
    }

    /**
     * Remove a player using the leave event (supports id OR name).
     * @param {{playerId?: string, playerName?: string}} event
     */
    removeFromLeave (event) {
        const id = event.playerId ?? (event.playerName ? this.nameToId.get(event.playerName) : undefined);
        if (!id) return;

        this.removeById(id);

        // Optional: also remove by provided name (keeps nameToId clean even if entry wasn't found)
        if (event.playerName) this.nameToId.delete(event.playerName);
    }

    /**
     * Iterate only auto-savers; auto-clean invalid Player refs.
     * Call this from your autosave interval.
     * @param {(entry: PlayerEntry) => void} fn
     */
    forEachDueAutoSaver (fn) {
        const now = system.currentTick;

        for (const id of this.autoSaveEnabledIds) {
            const entry = this.byId.get(id);
            if (!entry) {
                this.autoSaveEnabledIds.delete(id);
                continue;
            }

            // Safety cleanup: player object can become invalid in edge cases.
            if (!entry.player.isValid) {
                this.removeById(id);
                continue;
            }

            if (now < entry.nextSaveTick) continue;

            fn(entry);
        }
    }

    /**
     * Re-sync this player’s cached entry after you changed dynamic props via a command.
     * (Convenience wrapper so command code stays simple.)
     * @param {Player} player
     */
    syncFromCommand (player) {
        return this.upsertFromSpawn(player);
    }

    /**
     * Command helper: enable/disable autosave and immediately reflect it in the runtime index.
     * Also resets schedule when enabling.
     * @param {Player} player
     * @param {boolean} enabled
     */
    cmdSetAutoSaveEnabled (player, enabled) {
        player.setDynamicProperty(dv.isAuto, !!enabled);

        const entry = this.upsertFromSpawn(player);

        // If turning on, start counting from "now" so user sees effect immediately.
        if (enabled) {
            entry.nextSaveTick = system.currentTick + entry.autoSaveIncrementMin * TICKS_PER_MIN;
        }
        return entry;
    }

    /**
     * Command helper: set autosave increment (minutes), clamp, write DP, resync index,
     * and reset schedule to start from now.
     * @param {Player} player
     * @param {number} incMin
     */
    cmdSetAutoSaveIncrement (player, incMin) {
        const clean = Math.max(1, Math.floor(Number(incMin) || 0));
        player.setDynamicProperty(dv.autoSaveInc, clean);

        const entry = this.upsertFromSpawn(player);

        // schedule from now using the new increment
        entry.nextSaveTick = system.currentTick + entry.autoSaveIncrementMin * TICKS_PER_MIN;
        return entry;
    }

    /**
     * Command helper: set autosave "over" threshold, clamp, write DP, resync index.
     * @param {Player} player
     * @param {number} over
     */
    cmdSetAutoSaveOver (player, over) {
        const clean = Math.max(0, Math.floor(Number(over) || 0));
        player.setDynamicProperty(dv.autoSaveOver, clean);

        return this.upsertFromSpawn(player);
    }
}

export const playerIndex = new PlayerIndex();