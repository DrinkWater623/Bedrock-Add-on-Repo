// randomNames.js
// Random Name Generator (Formula-based)
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T.
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20251100 - ChatGPT Created for me
    20251203 - Relocated
========================================================================
Legend:
  c = random consonant
  v = random vowel (a e i o u y)
  k = repeat last consonant token (but do NOT double multi-letter phonemes like 'sh')
  w = repeat last vowel token
Literals (single tokens): y, a, ie (extensible)

Constraints:
  - No cc or vv adjacent in formulas
  - 'k' requires a prior 'c', 'w' requires a prior 'v'
  - Formulas violating these rules are auto-filtered

Extras:
  - Optional 'pronounceable' soft filter with bounded retries
Output:
  - Returns a capitalized name string
*/

export function makeRandomName (custom = {}) {
    const cfg = {
        vowels: [ 'a', 'e', 'i', 'o', 'u', 'y' ],
        consonants: [ 'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'z' ],
        formulas: [
            'cvc', 'cvcy', 'cvcie', 'cvca', 'cvcv',
            'vcv', 'vcvc', 'vcvca', 'vcvcie', 'vcvcy',
            'vckv', 'cvck', 'cvcka', 'cvckie', 'cvcky', 'vckw'
        ],
        literals: { y: 'y', a: 'a', ie: 'ie' },
        enforcePronounceable: true,
        maxAttempts: 20,
        ...custom
    };

    /**
     * 
     * @param {string[]} arr 
     * @returns 
     */
    const pick = arr => arr[ Math.floor(Math.random() * arr.length) ];
    const literalKeysByLen = Object.keys(cfg.literals).sort((a, b) => b.length - a.length);

    /**
     * 
     * @param {string} fmt 
     * @returns 
     */
    const tokenize = (fmt) => {
        const tokens = [];
        for (let i = 0; i < fmt.length; i++) {
            let hit = false;
            for (const L of literalKeysByLen) {
                if (fmt.slice(i, i + L.length) === L) {
                    tokens.push(L); i += L.length - 1; hit = true; break;
                }
            }
            if (!hit) tokens.push(fmt[ i ]); // c v k w or other single chars
        }
        return tokens;
    };

    // Reject cc, vv; reject k before any c; reject w before any v
    /**
     * 
     * @param {string} fmt 
     * @returns 
     */
    const isFormulaAllowed = (fmt) => {
        const t = tokenize(fmt);
        let seenC = false, seenV = false;
        for (let i = 0; i < t.length; i++) {
            const a = t[ i ];
            if (a === 'c') seenC = true;
            if (a === 'v') seenV = true;
            if (a === 'k' && !seenC) return false; // k needs a prior c
            if (a === 'w' && !seenV) return false; // w needs a prior v
            if (i < t.length - 1) {
                const b = t[ i + 1 ];
                if (a === 'c' && b === 'c') return false; // no cc
                if (a === 'v' && b === 'v') return false; // no vv
            }
        }
        return true;
    };

    /**
     * 
     * @param {string[] | Object} formulas 
     * @returns 
     */
    const buildFormulaPool = (formulas) => {
        if (Array.isArray(formulas)) return formulas.filter(isFormulaAllowed);
        const pool = [];
        for (const [ fmt, w = 1 ] of Object.entries(formulas)) {
            if (!isFormulaAllowed(fmt)) continue;
            for (let i = 0; i < w; i++) pool.push(fmt);
        }
        return pool;
    };

    const pool = buildFormulaPool(cfg.formulas);
    if (!pool.length) throw new Error('No valid formulas after constraints.');

    /**
     * 
     * @param {string} fmt 
     * @returns {string}
     */
    const render = (fmt) => {
        const tokens = tokenize(fmt);
        let out = '', lastVowel = '', lastConsonant = '';
        for (const t of tokens) {
            if (t === 'c') {
                const c = pick(cfg.consonants); out += c; lastConsonant = c;
            } else if (t === 'v') {
                const v = pick(cfg.vowels); out += v; lastVowel = v;
            } else if (t === 'k') {
                // Repeat last consonant token only if it's a single letter.
                // If the last consonant is a multi-letter phoneme (e.g., 'sh','ch','th'),
                // avoid doubling it (which would yield 'shsh'). Instead, pick a fresh
                // single-letter consonant and use that.
                if (!lastConsonant) {
                    lastConsonant = pick(cfg.consonants);
                }
                if (lastConsonant.length === 1) {
                    out += lastConsonant;
                } else {
                    const singles = cfg.consonants.filter(c => c.length === 1);
                    const chosen = singles.length ? pick(singles) : pick(cfg.consonants);
                    out += chosen;
                    lastConsonant = chosen;
                }
            } else if (t === 'w') {
                out += lastVowel || (lastVowel = pick(cfg.vowels));
            } else if (t in cfg.literals) {
                //@ts-ignore
                out += cfg.literals[ t ];
            }
        }
        return out.charAt(0).toUpperCase() + out.slice(1);
    };

    /**
     * 
     * @param {string} s 
     * @returns {boolean}
     */
    const looksPronounceable = (s) => {
        if (!cfg.enforcePronounceable) return true;
        const name = s.toLowerCase();
        if (!/[aeiouy]/.test(name)) return false;        // must have a vowel
        if (/(.)\\1\\1/.test(name)) return false;        // no triple repeats
        if (/yy|ww|xx|hh|jj|qq|vv|yh|yj|yc|yg|yq|yv|yx|yw|iw|ih/.test(name)) return false;         // avoid awkward doubles
        if (/ht|hb|hc|hd|hf|hg|hj|hk|hl|hm|hn|hp|hq|hs|hv|hw|hx|hz/.test(name)) return false;         // avoid awkward doubles
        if (/q(?!u)/.test(name)) return false;           // q followed by u
        if (/^(x|q[^u])/.test(name)) return false;       // avoid starting with x or non-qu q
        if (/shsh|chch|thth|phph/.test(name)) return false;   // avoid doubled digraphs
        return true;
    };

    for (let attempt = 0; attempt < cfg.maxAttempts; attempt++) {
        const fmt = pick(pool);
        const candidate = render(fmt);
        if (looksPronounceable(candidate)) return candidate;
    }
    // Fallback: return a render even if heuristics fail (should be rare)
    return render(pick(pool));
}