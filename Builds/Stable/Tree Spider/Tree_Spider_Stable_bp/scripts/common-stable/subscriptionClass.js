// subscription.js
// @ts-check

/**
 * Generic Bedrock event subscription wrapper.
 * Stores the handler and (optional) options inside the instance.
 *
 * Works for signals whose subscribe is either:
 *   - subscribe(handler)
 *   - subscribe(handler, options)
 *
 * @template {(...args: any[]) => any} TSubscribe
 * @template THandler = Parameters<TSubscribe>[0]
 * @template [TOptions = Parameters<TSubscribe>[1]]
 */
export class Subscription {
    /**
     * @param {TSubscribe} subscribeFn
     * @param {(h: THandler) => void} unsubscribeFn
     * @param {string} name
     * @param {THandler} handler
     * @param {TOptions} [options]
     * @param {(msg: string) => void} [log]
     */
    constructor(subscribeFn, unsubscribeFn, name, handler, options, log) {
    /** @type {TSubscribe} */ this._subscribe = subscribeFn;
    /** @type {(h: THandler) => void} */ this._unsubscribe = unsubscribeFn;
    /** @type {string} */ this._name = name;
    /** @type {(msg: string) => void} */ this._log = log ?? (() => { });
    /** @type {THandler} */ this._handler = handler;
    /** @type {TOptions | undefined} */ this._options = options;
    /** @type {THandler | null} */ this._installedRef = null; // subscribe returns same fn ref
    /** @type {boolean} */ this.on = false;
    }

    /** Subscribe once using the stored handler/options. */
    subscribe () {
        if (this.on) return;
        // ts-expect-error options may be undefined for no-options signals
        this._installedRef = this._subscribe(this._handler, this._options);
        this.on = true;
        this._log(`Installed ${this._name}`);
    }

    /** Unsubscribe if currently on. */
    unsubscribe () {
        if (!this.on) return;
        if (this._installedRef) this._unsubscribe(this._installedRef);
        this._installedRef = null;
        this.on = false;
        this._log(`Uninstalled ${this._name}`);
    }

    /** Toggle on/off using the stored handler/options. */
    toggle () {
        if (this.on) this.unsubscribe();
        else this.subscribe();
    }
}

/**
 * Convenience factory that infers handler/options types from a Bedrock signal.
 * Instead of indexing TSignal["subscribe"], constrain the shape of `signal`.
 *
 * @template {(...args:any[])=>any} TSubscribe
 * @template THandler = Parameters<TSubscribe>[0]
 * @template [TOptions = Parameters<TSubscribe>[1]]
 * @param {{ subscribe: TSubscribe, unsubscribe: (h: THandler) => void }} signal
 * @param {string} name
 * @param {THandler} handler
 * @param {TOptions} [options]
 * @param {(msg: string) => void} [log]
 */
export function makeSubscription (signal, name, handler, options, log) {
    // bind preserves the signal's `this`
    return new Subscription(
        signal.subscribe.bind(signal),
        signal.unsubscribe.bind(signal),
        name,
        handler,
        options,
        log
    );
}
