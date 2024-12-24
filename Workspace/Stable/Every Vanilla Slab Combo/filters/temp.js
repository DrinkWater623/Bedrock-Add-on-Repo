//=======================================================================
function includedBlocks_get (excluded = []) {
    const includes = [];
    const keys = Object.keys(rawDataFileContent[ 0 ].data).filter(k => {return !excluded.includes(k)});
    const includeBlocks = cmdLineSettingsJson.includeBlocks || [];
    const includeStartsWith = cmdLineSettingsJson.includeStartsWith || [];
    const includeContains = cmdLineSettingsJson.includeContains || [];
    const includeEndsWith = cmdLineSettingsJson.includeEndsWith || [];

    if (Array.isArray(includeBlocks) && includeBlocks.length) {
        includeBlocks
            .filter(x => { return !!x && typeof x == 'string' && keys.includes(x); })
            .forEach(b => {
                if (!includes.includes(b)) {
                    includes.push(b);
                    consoleColor.log(b, 'included (exact)');
                }
            });
        consoleColor.log(`${includes.length} included blocks (exact)`);
    }

    if (Array.isArray(includeContains) && includeContains.length) {
        let ctr = 0;
        includeContains
            .filter(x => { return !!x && typeof x == 'string'; })
            .forEach(c => {
                keys.filter(k => { return k.includes(c); })
                    .filter(k1 => { return !includes.includes(k1); })
                    .forEach(k2 => {
                        if (!includes.includes(k2)) {
                            includes.push(k2);
                            consoleColor.log(k2, 'included (contains)');
                            ctr++;
                        }
                    });
            });
        consoleColor.log(`${ctr} included blocks (contains)`);
    }

    if (Array.isArray(includeStartsWith) && includeStartsWith.length) {
        let ctr = 0;
        includeStartsWith
            .filter(x => { return !!x && typeof x == 'string'; })
            .forEach(sw => {
                keys.filter(k => { return k.startsWith(sw); })
                    .filter(k1 => { return !includes.includes(k1); })
                    .forEach(k2 => {
                        if (!includes.includes(k2)) {
                            includes.push(k2);
                            consoleColor.log(k2, 'included (starts with)');
                            ctr++;
                        }
                    });
            });
        consoleColor.log(`${ctr} included blocks (starts with)`);
    }

    if (Array.isArray(includeEndsWith) && includeEndsWith.length) {
        let ctr = 0;
        includeEndsWith
            .filter(x => { return !!x && typeof x == 'string'; })
            .forEach(ew => {
                keys.filter(k => { return k.endsWith(ew); })
                    .filter(k1 => { return !includes.includes(k1); })
                    .forEach(k2 => {
                        if (!includes.includes(k2)) {
                            includes.push(k2);
                            consoleColor.log(k2, 'included (ends with)');
                            ctr++;
                        }
                    });
            });
        consoleColor.log(`${ctr} included blocks (ends with)`);
    }

    consoleColor.success(`included blocks Total: ${includes.length}`);
    return includes;
}