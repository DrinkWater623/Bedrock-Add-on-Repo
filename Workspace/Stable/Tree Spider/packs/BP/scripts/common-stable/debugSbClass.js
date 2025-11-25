// debugSbClass.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T
URL: https://github.com/DrinkWater623
========================================================================
Change Log:
    20251110 - Created
    20251122 - Fixed multiple Minutes per SB
========================================================================*/
import { system, ScoreboardObjective } from "@minecraft/server";
import { ScoreboardLib } from "./scoreboardClass.js";
import { Ticks } from "../common-data/globalConstantsLib.js";
/** ---------------------------------------------------------------------------
 * Types 
 * ------------------------------------------------------------------------- */
/** Bases a job should run against:
 *  - "*"  → one timer per known base
 *  - string[] → one timer per listed base
 */
/** @typedef {"*" | string[]} JobBases */

/** A registered interval job descriptor. */
/** @typedef {{ 
 * on: boolean,
 * id: string, 
 * bases: JobBases, 
 * fn: () => void, 
 * interval: number }} IntervalJob */

/** ---------------------------------------------------------------------------
 * Small utilities
 * ------------------------------------------------------------------------- */

/**
 * Convert `snake_case` or `with_underscores` to Title Case.
 * @param {string} s
 * @returns {string}
 */
const toTitle = (s) =>
    s.replace(/_/g, " ")
        .split(" ")
        .filter(Boolean)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

/**
 * Clamp to a non-negative integer number of ticks.
 * @param {number} n
 * @returns {number}
 */
const ticks = (n) => Math.max(0, Math.floor(n ?? 0));

/** ---------------------------------------------------------------------------
 * Class
 * ------------------------------------------------------------------------- */

export class DebugScoreboards {
    /**
     * @param {boolean} debugOn                       - initial debug flag
     * @param {string} namePfx                        - scoreboard name prefix (e.g., "dw623:tree_spider")
     * @param {string} [displayPfx]                   - optional display prefix; if omitted it’s derived from `namePfx`
     */
    constructor(debugOn, namePfx, displayPfx) {
    /** @public */ this.debugOn = !!debugOn;
    /** @public */ this.namePfx = namePfx;

        if (displayPfx) {
      /** @public */ this.displayPfx = displayPfx;
        } else {
            const base = namePfx.includes(":") ? namePfx.split(":")[ 1 ] : namePfx;
      /** @public */ this.displayPfx = `§a${toTitle(base)}§6§l`;
        }

    /** @type {Map<string, ScoreboardObjective>} */ this._sbByBase = new Map();     // base(lc) → objective
    /** @type {Map<string, string>}            */ this._sbNameByBase = new Map();    // base(lc) → canonical name
    /** @type {Map<string, string>}            */ this._entryMap = new Map();        // entryKey → pretty label
    /** @type {string[]}                       */ this._bases = [];                  // ordered bases as provided

    /** @type {Map<string, IntervalJob>}       */ this._jobs = new Map();            // jobId → job
    /** @type {Map<string, number[]>}          */ this._runIdsByJobId = new Map();   // jobId → active runInterval ids

    /** Built-in time counter job config */
    /** @public */ this.timeCounterLabel = "§vMinutes";
    /** @public */ this.timeCounterIntervalTicks = Ticks.perMinute; // 1 minute default
    /** @private */ this._timeJobId = "__time__";
    }

    /* ─────────────────────────── Lifecycle / config ───────────────────────── */

    /**
     * Toggle debug. When set to false, all counters stop and any shown UI is hidden.
     * @param {boolean} on
     * @returns {void}
     */
    setDebug (on) {
        const wasOn = this.debugOn;
        this.debugOn = !!on;
        if (wasOn && !this.debugOn) {
            this.countersOff();
            this.hide();
        }
    }

    /**
     * Create (or recreate) scoreboards for bases and optionally install entry labels.
     * Safe to call multiple times.
     * @param {{ bases: string[], entries?: Record<string,string>, reCreate?: boolean }} cfg
     * @returns {void}
     */
    setup (cfg) {
        if (!cfg?.bases?.length) return;
        this._bases = cfg.bases.slice();
        for (const b of this._bases) this.getScoreboard(b, !!cfg.reCreate);
        if (cfg.entries) this.addEntries(cfg.entries);
    }

    /**
     * Add or overwrite multiple entry labels.
     * @param {Record<string, string>} map
     * @returns {void}
     */
    addEntries (map) {
        for (const [ k, v ] of Object.entries(map)) this._entryMap.set(k, v);
    }

    /**
     * Add or overwrite a single entry label.
     * @param {string} entryKey
     * @param {string} label
     * @returns {void}
     */
    setEntry (entryKey, label) { this._entryMap.set(entryKey, label); }

    /**
     * Add a new base and ensure its scoreboard exists immediately.
     * @param {string} baseName
     * @param {boolean} [reCreate=false]
     * @returns {ScoreboardObjective}
     */
    addBase (baseName, reCreate = false) {
        if (!this._bases.includes(baseName)) this._bases.push(baseName);
        return this.getScoreboard(baseName, reCreate);
    }

    /**
     * Get a copy of the current base list.
     * @returns {string[]}
     */
    bases () { return this._bases.slice(); }

    /* ───────────────────────────── Scoreboards ────────────────────────────── */

    /**
     * Ensure a scoreboard for `baseName` exists and return it.
     * If it doesn’t exist (or `reCreate` is true), it will be (re)created.
     * @param {string} baseName
     * @param {boolean} [reCreate=false]
     * @returns {ScoreboardObjective}
     */
    getScoreboard (baseName, reCreate = false) {
        const key = String(baseName).toLowerCase();
        const existing = this._sbByBase.get(key);
        if (existing && existing.isValid && !reCreate) return existing;

        const name = `${this.namePfx}_${key}`;
        const display = `${this.displayPfx} ${baseName}`;
        const sb = ScoreboardLib.create(name, display, reCreate);

        this._sbByBase.set(key, sb);
        this._sbNameByBase.set(key, name);
        return sb;
    }

    /**
     * Get the canonical scoreboard name for a base. Ensures the scoreboard exists.
     * @param {string} baseName
     * @returns {string}
     */
    getScoreboardName (baseName) {
        const key = String(baseName).toLowerCase();
        this.getScoreboard(baseName);
        return /** @type {string} */ (this._sbNameByBase.get(key));
    }

    /* ─────────────────────── Increments / entry labels ────────────────────── */

    /**
     * Resolve an entry key to a label. Falls back to the literal key.
     * @param {string} entryKey
     * @returns {string}
     */
    _label (entryKey) { return this._entryMap.get(entryKey) ?? String(entryKey); }

    /**
     * Increment an entry on the scoreboard for `baseName`.
     * The scoreboard is auto-created if missing.
     * @param {string} baseName
     * @param {string} entryKey
     * @param {number} [by=1]
     * @param {number} [tickDelay=0]
     * @returns {boolean}
     */
    increment (baseName, entryKey, by = 1, tickDelay = 0) {
        if (!this.debugOn) return false;
        const sb = this.getScoreboard(baseName);
        const label = this._label(entryKey);
        const run = () => { if (sb.isValid) sb.addScore(label, by); };
        const d = ticks(tickDelay);
        d > -1 ? system.runTimeout(run, d) : run();
        return true;
    }

    /**
     * Increment the same entry across multiple bases.
     * @param {string[]} baseNames
     * @param {string} entryKey
     * @param {number} [by=1]
     * @param {number} [tickDelay=0]
     * @returns {boolean} true if at least one increment happened
     */
    incrementMany (baseNames, entryKey, by = 1, tickDelay = 0) {
        let ok = false;
        for (const b of baseNames) { ok = this.increment(b, entryKey, by, tickDelay) || ok; }
        return ok;
    }

    /**
     * Increment an entry on the scoreboard for `baseName`.
     * The scoreboard is auto-created if missing.
     * @param {string} baseName
     * @param {string} entryKey
     * @param {number} [to=1]
     * @param {number} [tickDelay=0]
     * @returns {boolean}
     */
    set (baseName, entryKey, to = 1, tickDelay = 0) {
        if (!this.debugOn) return false;
        const sb = this.getScoreboard(baseName);
        const label = this._label(entryKey);
        const run = () => { if (sb.isValid) sb.setScore(label, to); };
        const d = ticks(tickDelay);
        d > 0 ? system.runTimeout(run, d) : run();
        return true;
    }
    //add setMany if ever needed
    /* ────────────────────────── Interval job system ───────────────────────── */

    /**
     * Register or update a generic interval job.
     * Jobs run only while `countersOn()` is in effect.
     * If a job with the same id exists, it is replaced; any running timers
     * for that id are cleared before the new ones start.
     * @param {string} jobId
     * @param {() => void} fn
     * @param {number} intervalTicks
     * @param {JobBases} [bases="*"] - "*" to run once per known base, or a list of specific bases
     * @returns {void}
     */
    registerIntervalJob (jobId, fn, intervalTicks, bases = "*") {
        const job = /** @type {IntervalJob} */ ({
            id: jobId,
            bases,
            fn,
            interval: ticks(intervalTicks),
        });
        this._jobs.set(jobId, job);
        // If jobs are running already, restart this one now.
        if (this._isAnyJobRunning()) this._restartJob(jobId);
    }

    /**
     * Unregister a job and stop its timers (if any).
     * @param {string} jobId
     * @returns {void}
     */
    unregisterIntervalJob (jobId) {
        this._stopJob(jobId);
        this._jobs.delete(jobId);
    }

    /**
     * Enable or disable the built-in time counter job.
     * When enabled, every interval it increments `timeCounterLabel` across all bases.
     * @param {boolean} enable
     * @returns {void}
     */
    enableTimeCounter (enable) {
        if (enable) {
            this.registerIntervalJob(this._timeJobId, () => {
                this.incrementMany(this._bases, this.timeCounterLabel, 1);
            }, this.timeCounterIntervalTicks, [ this._bases[ 0 ] ]);
        } else {
            this.unregisterIntervalJob(this._timeJobId);
        }
    }

    /**
     * Start all registered jobs (including the time counter if enabled).
     * Safe to call multiple times; running jobs won’t duplicate.
     * @returns {void}
     */
    countersOn () {
        if (!this.debugOn) return;
        for (const jobId of this._jobs.keys()) this._restartJob(jobId);
    }

    /**
     * Stop all running jobs (time + custom).
     * @returns {void}
     */
    countersOff () {
        for (const [ jobId, ids ] of this._runIdsByJobId.entries()) {
            for (const id of ids) system.clearRun(id);
            this._runIdsByJobId.set(jobId, []);
        }
    }

    /**
     * @private
     * @returns {boolean} true if any job currently has active runInterval ids
     */
    _isAnyJobRunning () {
        for (const arr of this._runIdsByJobId.values()) if (arr.length) return true;
        return false;
    }

    /**
     * @private
     * Stop timers for a single job id.
     * @param {string} jobId
     * @returns {void}
     */
    _stopJob (jobId) {
        const ids = this._runIdsByJobId.get(jobId);
        if (ids && ids.length) {
            for (const id of ids) system.clearRun(id);
            ids.length = 0;
        }
    }

    /**
     * @private
     * (Re)start one job’s timers immediately if debugging is on.
     * @param {string} jobId
     * @returns {void}
     */
    _restartJob (jobId) {
        // stop existing timers for this job
        this._stopJob(jobId);
        if (!this.debugOn) return;

        const job = this._jobs.get(jobId);
        if (!job || job.interval <= 0) return;

        /** @type {number[]} */
        const runIds = [];

        /**
         * Start one interval timer for a base (used for "*" and for explicit lists).
         * @param {string} _base
         * @returns {number}
         */
        const start = (_base) => system.runInterval(() => {
            if (!this.debugOn) return;
            job.fn();
        }, job.interval);

        if (job.bases === "*") {
            for (const base of this._bases) runIds.push(start(base));
        } else {
            for (const base of job.bases) runIds.push(start(base));
        }
        this._runIdsByJobId.set(jobId, runIds);
    }

    /* ─────────────────────────────── Visibility ───────────────────────────── */

    /**
     * Show a scoreboard in the sidebar. Accepts:
     *  - a base name (e.g., "Stats")
     *  - a canonical scoreboard name
     *  - a ScoreboardObjective instance
     * @param {string | ScoreboardObjective} sbOrBase
     * @param {number} [tickDelay=0]
     * @returns {void}
     */
    show (sbOrBase, tickDelay = 0) {
        if (!this.debugOn) return;
        const d = ticks(tickDelay);

        /** @type {string | ScoreboardObjective} */
        let target = sbOrBase;
        if (typeof sbOrBase === "string") {
            const key = sbOrBase.toLowerCase();
            target = this._sbByBase.get(key) ?? sbOrBase; // base → obj, else treat as canonical name
        }
        ScoreboardLib.sideBar_set(target, d);
    }

    /**
     * Clear sidebar/list if any of our scoreboards is showing.
     * @param {number} [tickDelay=0]
     * @returns {void}
     */
    hide (tickDelay = 0) {
        const ids = new Set(this._bases.map(b => this.getScoreboardName(b)));
        const side = ScoreboardLib.sideBar_query();
        const list = ScoreboardLib.list_query();
        const d = ticks(tickDelay);
        if (side?.isValid && ids.has(side.id)) ScoreboardLib.sideBar_clear(d);
        if (list?.isValid && ids.has(list.id)) ScoreboardLib.list_clear(d);
    }

    /* ─────────────────────────────── Utilities ─────────────────────────────── */

    /**
     * Set all scores to zero on provided bases (or on all known bases if omitted).
     * @param {string[]} [bases]
     * @returns {void}
     */
    zero (bases) {
        const targets = bases?.length ? bases : this._bases;
        for (const b of targets) {
            const sb = this.getScoreboard(b);
            if (sb?.isValid) ScoreboardLib.setZeroAll(sb);
        }
    }

    /**
     * (Re)create one or more bases’ scoreboards.
     * @param {{ bases?: string[], reCreate?: boolean }} [cfg]
     * @returns {void}
     */
    reset (cfg) {
        const targets = cfg?.bases?.length ? cfg.bases : this._bases;
        for (const b of targets) this.getScoreboard(b, !!cfg?.reCreate);
    }
}
