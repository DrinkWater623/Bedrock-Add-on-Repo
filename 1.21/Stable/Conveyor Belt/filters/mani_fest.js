// @ts-check
//=====================================================================
// Global variables - Part 1
//=====================================================================
const fs = require("fs");
const fileInfo = require('path');
const myUUID = require("crypto");
const { Debug } = require("./js_lib/Debug.js");
const { is, has } = require("./js_lib/shared-classes.js");
const fileIo = require("./js_lib/File_io.js");
//=====================================================================
const { FetchSiteJsonStack } = require("./js_lib/FetchSiteJsonStack.js");
class McModuleFetchStack extends FetchSiteJsonStack {
    //If I wanted to add to the constructor
    /*
        constructor(sites=[]){
            super(sites);
            this.newVariable = 0;
        }
    */
    _preFetchEach () { }
    _postPromiseEach () { }
    _postPromiseAll () {
        mainAfterFetch();
    }
}
//=====================================================================
var argPath = process.argv[ 1 ];
var argSettings = process.argv[ 2 ];
//=====================================================================
// Global variables - Part 2
//=====================================================================
//const scriptsFolder = "BP/scripts";
let isDebug = false;
let isDebugMax = false;
//=====================================================================
let bpFiles = [];
let rpFiles = [];
// Console Logging
const debug = new Debug(isDebug);
debug.colorsAdded.set("functionStart", 96);
//debug.colorsAdded.set("tableTitle", 96)
debug.colorsAdded.set("list", 36);
debug.colorsAdded.set("log", 40);

const debugMax = new Debug(isDebugMax);
debugMax.colorsAdded.set("log", 95);

const configFileSettings = { settings: {} };
getConfigFileSettings();
//=======================================================================

const cmdLineSettingsJson = mergeDeep(configFileSettings.settings, JSON.parse(argSettings));
debug.log(cmdLineSettingsJson);

//const cmdLineSettingsJson = JSON.parse(argSettings);
//=====================================================================
isDebug = isDebug || !!cmdLineSettingsJson.Debug;
isDebugMax = isDebugMax || !!cmdLineSettingsJson.DebugMax;
if (isDebugMax) isDebug = true;
debug.debugOn = isDebug;

const consoleColor = new Debug(!cmdLineSettingsJson.Silent);
consoleColor.colorsAdded.set("highlight", 93);
consoleColor.colorsAdded.set("possibleWarn", 93);
consoleColor.colorsAdded.set("possibleError", 91);
//=======================================================================
// Above can be shared - but has to be below imprts and stuff
//=======================================================================
let myFetch; //leave as let, defined if use, needs to be global, as will be new Object from Fetch Class

const validScriptModules = [];
validScriptModules.push({ module_name: "@minecraft/server", total: 0 });
validScriptModules.push({ module_name: "@minecraft/server-ui", total: 0 });
validScriptModules.push({ module_name: "@minecraft/common", total: 0 });
validScriptModules.push({ module_name: "minecraft-bedrock-server", total: 0 });
const validVersionNames = [ "get", "stable", "beta", "rc", "preview", "previewbeta", "latest", "latestbeta", "latest_beta", "preview_beta", "latest-beta", "preview-beta" ];
//=====================================================================
//          Function Library
//=====================================================================
/**
 * Deep merge two objects.
 * @param {object} target
 * @param {object} source
 * @returns {object}
 */
function mergeDeep (target, source) {

    if (is.object(target) && is.object(source)) {
        for (const key in source) {
            if (is.object(source[ key ])) {
                if (!target[ key ]) Object.assign(target, { [ key ]: {} });
                mergeDeep(target[ key ], source[ key ]);
            } else {
                Object.assign(target, { [ key ]: source[ key ] });
            }
        }
    }
    return target;
}

function deleteCommentBlockSameLine (string = "") {
    if (typeof string !== "string") return string;

    while (string.search(/\/\*.*\*\//) >= 0) {
        string = string.replace(/\/\*.*\*\//, "");
    }

    return string;
}
function deleteCommentBlockMultiLine (string = "") {
    if (typeof string !== "string") return string;

    /*
    must do one at a time because .replaceAll with /g flag
    takes first / *  and last * / 
    and not the distinct pairs of them
    also
    doesn't work well for when they are in strings like s = `/*`
    */
    const aUID = require("crypto");
    let stopInfiniteLoop = 0;
    const slashStar = aUID.randomUUID();
    const starSlash = aUID.randomUUID();
    const re = new RegExp(slashStar + `.*` + starSlash, "s");
    while (string.search(/\/\*[\s\S]*\*\//) >= 0 && stopInfiniteLoop++ <= 1000) {
        string = string
            .replace("/*", slashStar)
            .replace("*/", starSlash)
            .replace(re, "")
            .replace(slashStar, "/*")
            .replace(starSlash, "*/");
    }
    //console.log(stopInfiniteLoop)
    return string;
}
function deleteCommentBlocks (string = "") {
    if (typeof string !== "string") return string;
    //this order because // can be inside /*  */ and can steal ending */
    string = deleteCommentBlockSameLine(string);
    string = deleteCommentBlockMultiLine(string);
    return string;
}
//=====================================================================
function deleteCommentLines (string = "") {
    if (typeof string !== "string") return string;
    //@ts-ignore   
    return string.replaceAll(/\/\/.*/g, "");
}
//=====================================================================
function deleteComments (string = "") {
    if (typeof string !== "string") return string;
    //this order because // can be inside /*  */ and can steal ending */
    string = deleteCommentBlocks(string);
    string = deleteCommentLines(string);
    return string;
}
function deleteJson (string = "") {
    //everything within {}
    if (typeof string !== "string") return string;
    const re = /\{.*?\}/s;
    while (string.search(re) >= 0) {
        string = string.replace(re, "");
    }
    return string;
}
//=======================================================================
function isArrayOfObjects (array = [ {} ]) {
    if (Array.isArray(array))
        return array.every((item) => typeof item === "object");

    return false;
}
function isArrayOfSomeObjects (array = [ {} ]) {
    if (Array.isArray(array))
        return array.some((item) => typeof item === "object");

    return false;
}
function isArrayOfKeyValuePairs (array = [ {} ]) {
    if (!isArrayOfObjects(array)) return false;
    if (array.some((item) => Array.isArray(item))) return false;
    return true;
}
// @ts-ignore
function arrayDeleteValues (array = [ "" ], value) {
    if (!Array.isArray(array)) return;
    if (isArrayOfSomeObjects(array)) return;

    let i = -1;
    do {
        i = array.indexOf(value);
        if (i >= 0) array.splice(i, 1);
    } while (i >= 0);
}
function arrayDeleteIfKeyExist (array = [ {} ], key = "", debug = false) {
    if (!isArrayOfKeyValuePairs(array)) return;
    let i = 0;
    while (i >= 0 && array.length > 0) {
        i = array.findIndex(obj => key in obj);
        if (i >= 0) {
            if (debug) console.log("debug> Deleting ->", key, "=", array[ i ][ key ]);
            array.splice(i, 1);
        }
    }
}
// @ts-ignore
function arrayDeleteIfKeyValue (array = [ {} ], key = "", value = "", debug = false) {
    if (!isArrayOfKeyValuePairs(array)) return;
    let i = 0;
    while (i >= 0 && array.length > 0) {
        i = array.findIndex(obj => key in obj && obj[ key ] === value);
        if (i >= 0) {
            if (debug) console.log("debug> Deleting ->", key, "=", array[ i ][ key ]);
            array.splice(i, 1);
        }
    }
}
function arrayKeyValueArrayMerge (array = [ {} ], key = "", valueArray = [ "" ], debug = false) {
    if (!isArrayOfKeyValuePairs(array)) return;
    if (!Array.isArray(valueArray)) return;
    if (!valueArray.every(v => typeof v === "string")) return;

    let i = 0;
    while (i >= 0 && array.length > 0) {
        i = array.findIndex(obj => key in obj && !valueArray.includes(obj[ key ]));
        if (i >= 0) {
            if (debug) console.log("debug> Deleting ->", key, "=", array[ i ][ key ]);
            array.splice(i, 1);
        }
    }
}
function arrayDeleteObjectIfKeyNotOnList (objectArray = [ {} ], keyArray = [ "" ], debug = false) {
    if (!isArrayOfKeyValuePairs(objectArray)) return;
    if (!is.arrayOfStrings(keyArray) || is.string(keyArray)) return;

    //@ts-ignore
    if (is.string(keyArray)) keyArray = keyArray.split(",");

    const ctr = objectArray.length;
    for (let i = 0; i < ctr; i++) {
        const obj = objectArray.pop();
        let isValid = false;

        for (let j = 0; j < keyArray.length; j++) {
            //@ts-ignore
            if (Object.hasOwn(obj, keyArray[ j ])) {
                isValid = true;
                break;
            }
        }

        // @ts-ignore
        if (isValid) objectArray.push(obj);
    }
}
function arrayIfKeyExist (array, key) {
    if (!Array.isArray(array)) return false;

    for (let i = 0; i < array.length; i++) {
        if (typeof array[ i ] === "object")
            if (!Array.isArray(array[ i ]))
                if (key in array[ i ]) return true;
    }
    return false;
}
function deDupeStringToArray (str, delimiter = ',') {
    if (Array.isArray(str)) return deDupeNonObjectArray(str);
    if (typeof str !== "string") return str;
    if (!str.length) return [];

    let array;
    array = str.split(delimiter);
    return [ ...new Set(array) ];
}
function deDupeNonObjectArray (array) {
    if (!Array.isArray(array)) return array;
    if (array.some(obj => typeof obj === "object")) return array;
    return [ ...new Set(array) ];
}
//=======================================================================
function newUUID () { return myUUID.randomUUID(); }
//=======================================================================
function objectsMerge (myObject, emulateObject) {
    if (typeof emulateObject != "object" || Array.isArray(emulateObject)) return {};
    if (typeof myObject != "object" || Array.isArray(myObject)) return {};
    return objectKeysMerge(Object.assign({}, emulateObject, myObject), emulateObject);
}
function objectKeysMerge (myObject, emulateObject) {
    if (typeof emulateObject != "object" || Array.isArray(emulateObject)) return {};
    if (typeof myObject != "object" || Array.isArray(myObject)) return {};

    let object = Object.assign({}, myObject);
    const emulateKeys = Object.keys(emulateObject);
    const myInvalidKeys = Object.keys(myObject).filter(key => !emulateKeys.includes(key));

    for (let key of myInvalidKeys) delete object[ key ];

    return object;
}
function stringArraysMerge (myArray, arrayFilter) {
    if (!is.arrayOfStrings(myArray)) return [];
    if (!is.arrayOfStrings(arrayFilter)) return [];
    return myArray.filter(v => arrayFilter.includes(v));
}
//=======================================================================
//   End of Function Library
//=======================================================================

//=======================================================================
//  Related to scraping the import { } from 'minecraft/....'
//=======================================================================
function squishIt (string = "") {
    if (typeof string !== "string") return string;
    //@ts-ignore
    //spaces first
    string = string.replaceAll("\t", " ");
    //@ts-ignore
    string = string.replaceAll("\r", "\n");
    //@ts-ignore
    while (string.includes("  ")) string = string.replaceAll("  ", " ");
    let s = "\n ";
    //@ts-ignore
    while (string.includes(s)) string = string.replaceAll(s, "\n");
    s = " \n";
    //@ts-ignore
    while (string.includes(s)) string = string.replaceAll(s, "\n");
    //@ts-ignore
    while (string.includes("\n\n")) string = string.replaceAll("\n\n", "\n");
    //@ts-ignore
    string = string.replaceAll(`\n"`, `"`);

    return string;
}
function scrapeMinecraftModuleNamesFromJS (jsCode = "") {
    debugMax.color("functionStart", "==> scrapeMinecraftModuleNamesFromJS()");

    jsCode = deleteComments(jsCode);
    if (jsCode.search(/import.*\{.*}.*from.*[@"]minecraft[//-]/s) < 0) return [];

    jsCode = deleteJson(jsCode);
    if (jsCode.search(/import.*from.*[@"]minecraft[//-]/s) < 0) return [];

    //if (jsCode.search(/[@"]minecraft[//-]/) < 0) return []
    //if (!jsCode.includes("import")) return []
    //if (!jsCode.includes("from")) return []

    //@ts-ignore
    jsCode = jsCode.replaceAll(";import", "\nimport");
    //@ts-ignore
    jsCode = jsCode.replaceAll("\timport", "\nimport");
    //@ts-ignore
    jsCode = jsCode.replaceAll(" import", "\nimport");
    jsCode = squishIt(jsCode);
    while (jsCode.includes("\nfrom")) jsCode = jsCode.replace("\nfrom", " from");
    const id = "»import»from»";
    //@ts-ignore
    jsCode = jsCode.replaceAll(/import from/g, id).replaceAll(/[`'";]/g, "");

    //Isolate
    let posFirstID = jsCode.indexOf(id);
    if (posFirstID < 0) return [];
    let posLastID = jsCode.lastIndexOf(id);
    let posNextLF = jsCode.indexOf("\n", posLastID);
    //@ts-ignore
    jsCode = jsCode.substring(posFirstID, posNextLF).replaceAll(" ", "");
    //@ts-ignore
    jsCode = jsCode.replaceAll("\n", ",").replaceAll(id, "");

    const modArray = [ ...new Set(jsCode.split(",").filter(v => v.includes("minecraft"))) ];
    debug.table("Debug: Module Names Found", modArray);
    debugMax.mute("<== scrapeMinecraftModuleNamesFromJS()");
    return modArray;
}
function scrapeScriptsImportFromMinecraftModuleNames () {
    debug.color("functionStart", "==> scrapeScriptsImportFromMinecraftModuleNames()");

    const bpSettings = cmdLineSettingsJson.BP;
    let isValid = false;

    bpSettings.jsModList = [];
    if (bpSettings.jsFileList.length > 0) {
        debug.table("Debug: JS File List to Scrape", bpSettings.jsFileList);

        const stmtList = [];

        for (let fileObj of bpSettings.jsFileList) {
            let fileName = fileObj.fileName;
            debug.log("==> Reading File:", fileName);
            let jsCode = fs.readFileSync(fileObj.fileName, 'utf8');
            const modList = scrapeMinecraftModuleNamesFromJS(jsCode);
            if (modList.length) modList.forEach(v => { if (!stmtList.includes(v)) stmtList.push(v.toLowerCase()); });
        }

        if (stmtList.length) {
            const modNames = validScriptModules.map(obj => obj.module_name);
            bpSettings.jsModList = stringArraysMerge([ ...new Set(stmtList) ], modNames);
            if (bpSettings.jsModList.length) isValid = true;
        }
    }

    if (!isValid)
        //debug.table("Modules Scraped from JS Files", bpSettings.jsModList)
        consoleColor.color("possibleWarn", "==> No Valid Minecraft Modules Scraped from JS Files");

    debugMax.mute("<== scrapeScriptsImportFromMinecraftModuleNames()");
    return isValid;
}
//=======================================================================
function isLiveBehaviorPackFolder () {
    debug.color("functionStart", "==> isLiveBehaviorPackFolder()");

    //Either has scripts or read each json file, strip comments and see if any code inside.. must be at least one.

    if (is.emptyFolder("BP")) { bpFiles = []; return false; }
    bpFiles = fileIo.fileTreeGet("./BP", 0, "", debug.debugOn);

    let fileList = bpFiles
        .filter(obj => obj.fileName != './BP/pack_icon.png') //does not count
        .filter(obj => obj.fileName != './BP/manifest.json') //does not count
        .filter(obj => obj.size > 4);
    if (fileList.length === 0) {
        consoleColor.color("possibleWarn", "==> No Valid Behavior Pack Files");
        return false;
    }

    const bpSettings = cmdLineSettingsJson.BP;

    //Check Script Files
    bpSettings.jsFileList = fileList
        .filter(fileObj => fileObj.parse.dir == './BP/scripts')
        .filter(fileObj => fileObj.parse.ext == '.js')
        .filter(fileObj => fileObj.size > 30);
    //console.table(fileList[0].parse)
    if (bpSettings.jsFileList.length) {
        if (scrapeScriptsImportFromMinecraftModuleNames()) {
            bpSettings.isScriptingFiles = true;
            consoleColor.success("==> Found Valid Scripting Files (w/ Import From minecraft module)");
            return true;
        }
    }
    bpSettings.isScriptingFiles = false;
    delete cmdLineSettingsJson.module_names;
    delete bpSettings.module_names;
    arrayDeleteIfKeyExist(cmdLineSettingsJson.dependencies, "module_name", debug.debugOn);
    arrayDeleteIfKeyExist(bpSettings.dependencies, "module_name", debug.debugOn);

    //Check JSON files TODO:
    fileList = fileList.filter(obj => obj.parse.ext == ".json");
    if (fileList.length) {
        consoleColor.success("==> Found BP JSON Files");
        return true;
    }

    debug.color("possibleWarn", "==> No Valid Behavior Pack Files Found");
    debugMax.mute("<== isLiveBehaviorPackFolder()");
    return false;
}
function isLiveResourcePackFolder () {
    debug.color("functionStart", "==> isLiveResourcePackFolder()");

    //Either has png/tga  or  read each json file, strip comments and see if any code inside.. must be at least one.

    if (is.emptyFolder("RP")) { rpFiles = []; return false; }
    rpFiles = fileIo.fileTreeGet("./RP", 0, "", debug.debugOn);

    let fileList = rpFiles
        .filter(obj => obj.fileName != './RP/pack_icon.png') //does not count 
        .filter(obj => obj.fileName != './RP/manifest.json') //does not count
        .filter(obj => obj.size > 4);
    if (fileList.length === 0) {
        consoleColor.color("possibleWarn", "==> No Valid Resource Pack Files");
        return false;
    }

    //Ok if png or tga files or lang files
    if (fileList.some(obj => obj.parse.dir.startsWith = '/RP/textures/' && [ ".png", ".tga" ].includes(obj.parse.ext))) {
        consoleColor.success("==> Found RP png/tga Files");
        return true;
    }
    if (fileList.some(obj => obj.parse.dir.startsWith = '/RP/texts/' && obj.parse.ext == ".lang")) {
        consoleColor.success("==> Found RP .lang Files");
        return true; //TODO: make sure not emptyish
    }

    //Check JSON files TODO:
    fileList = fileList.filter(obj => obj.parse.ext == ".json");
    if (fileList.length) {
        consoleColor.success("==> Found RP JSON Files");
        return true;
    }

    consoleColor.color("possibleWarn", "==> No Valid Resource Files Files");
    debugMax.mute("<== isLiveResourcePackFolder()");
    return false;
}
//=======================================================================
function verifyConfigPackDependencies () {
    debug.log("==> verifyConfigPackDependencies()");

    debugMax.log("==> Checking for other manifest.json files");
    //TODO: Read those manifest files and incorporate info
    let truthy = (bpFiles.filter(v => v.size > 0 && v.fileName == "./BP/manifest.json").length) ||
        (rpFiles.filter(v => v.size > 0 && v.fileName == "./RP/manifest.json").length);
    cmdLineSettingsJson.packDependencies = !truthy;
    if (!cmdLineSettingsJson.packDependencies)
        consoleColor.warn("==> Cannot do dependencies if you make your own manifest.json!");
    else debugMax.mute("==> No Other manifest.json files");

    debugMax.mute("<== verifyConfigPackDependencies()");
}
//=======================================================================
//not used - delete if delete verifyConfigScripting_Dependencies
function moduleNameFix (module_name = "") {
    if (module_name.length == 0) return "";

    const modNames = validScriptModules.map(obj => obj.module_name);
    if (modNames.includes(module_name)) return module_name;
    for (let mod of modNames) if (mod.endsWith(module_name)) return mod;
    return "";
}
//=======================================================================
function configureScriptingDependencies () {
    debug.log("==> configureScriptingDependencies()");

    const bpSettings = cmdLineSettingsJson.BP;
    if (!bpSettings.isScriptingFiles) return;
    if (!bpSettings.dependencies) bpSettings.dependencies = [];
    //Build list    
    const userUuidObjs = bpSettings.dependencies.filter(obj => Object.hasOwn(obj, "UUID"));
    const userModule_nameObjs = bpSettings.dependencies.filter(obj => Object.hasOwn(obj, "module_name"));
    if (userModule_nameObjs.length) arrayKeyValueArrayMerge(userModule_nameObjs, "module_name", bpSettings.jsModList, debug.debugOn);
    const userModule_nameList = userModule_nameObjs.map(obj => obj.module_name);
    const allowedModObjs = [];
    bpSettings.jsModList.forEach((/** @type {any} */ v) => {
        if (!userModule_nameList.includes(v)) allowedModObjs.push({ module_name: v, version: "get" });
    });

    bpSettings.dependencies = [];
    userUuidObjs.forEach(obj => bpSettings.dependencies.push(obj));
    userModule_nameObjs.forEach(obj => bpSettings.dependencies.push(obj));
    allowedModObjs.forEach(obj => bpSettings.dependencies.push(obj));

    debug.table("Debug: Final BP Dependency List", bpSettings.dependencies);
    debugMax.mute("<== configureScriptingDependencies()");
}
//=======================================================================
function jsonParseRemovingComments (text) {
    debugMax.color("functionStart", "==> jsonParseRemovingComments()");
    //text is a string, not JSON.. which obviously does not need this function
    let dataString = text;

    //1) Remove all /* */  
    dataString = deleteCommentBlocks(dataString);
    //while (dataString.indexOf("/*") >= 0) {
    //
    //    let ptrStart = dataString.indexOf("/*");
    //    let front = ptrStart <= 0 ? "" : dataString.substring(0, ptrStart - 1);
    //
    //    let back = dataString.substring(ptrStart + 2);
    //    let ptrEnd = back.indexOf("*/");
    //
    //    if (ptrEnd == -1)
    //        dataString = front;
    //    else {
    //        back = back.substring(ptrEnd + 2);
    //        dataString = front + back;
    //    }
    //}

    // remove //->end of line  ??  char(10 and 13)  ?? or just one or either

    let dataJson;
    let more;
    do {
        more = false;
        try {
            dataJson = JSON.parse(dataString);;
        } catch (err) {
            more = true;
            //debugMax.error("err.name: "+err.name,err.message)
            let errTrapArray = [
                "Expected double-quoted property name in JSON at position ",
                "Expected property name or '}' in JSON at position "
            ];
            let errTrap = "xxxxx";
            for (let i = 0; i < errTrapArray.length; i++) {
                if (err.message.startsWith(errTrapArray[ i ])) {
                    errTrap = errTrapArray[ i ];
                    break;
                };
            }

            if (err.message.startsWith(errTrap)) {
                let ptr = parseInt(err.message.substring(errTrap.length));

                let front = dataString.substring(0, ptr - 1);
                let back = dataString.substring(ptr);
                let ptrEOL = back.indexOf("\n");

                if (ptrEOL >= 0) {
                    back = back.substring(ptrEOL + 1);
                    dataString = front + back;
                }
                else {
                    dataString = front;
                }
            }
            else {
                Debug.error("JSON Parse Error Not Configured");
                Debug.error(err.message);
                console.log(dataString);
                debugMax.error("<xx jsonParseRemovingComments()");
                return null;
            }
        }
    }
    while (more);

    debugMax.mute("<== jsonParseRemovingComments()");
    return dataJson;
}
//=======================================================================
function getConfigFileSettings () {
    debug.log("==> getConfigFileSettings()");
    /*
        Known, this filter is either under 
            ./.regolith or
            ./filters
        of the mail project folder
    */
    let path_1 = "\\.regolith\\cache\\filters\\";
    let path_2 = "\\filters\\";
    let ptr = (argPath.lastIndexOf(path_1) > 0 ? argPath.lastIndexOf(path_1) : argPath.lastIndexOf(path_2)) + 1;

    if (!ptr) {
        Debug.warn("Error: Cannot find path to config.json");
        debugMax.error("x getConfigFileSettings()");
        return false;
    }

    let configPathFilename = argPath.substring(0, ptr) + "config.json";
    let configData;
    try {
        const data = fs.readFileSync(configPathFilename, 'utf8');
        configData = data;
    } catch (err) {
        Debug.warn("Error: Cannot read config.json, skipping");
        debugMax.warn("x getConfigFile()");
        return false;
    }

    //configData = deleteComments(configData) Do not use... prob with // in $schema withing " "
    let json = jsonParseRemovingComments(configData);
    if (!json) {
        Debug.warn("Error: Cannot parse config.json, skipping");
        debugMax.warn("x getConfigFile()");
        return false;
    }

    configFileSettings.author = json.author;
    if (json.mani_fest) {
        configFileSettings.settings = json.mani_fest;
    }

    debugMax.mute("<== getConfigFile()");

    return true;
}
//=======================================================================
function masterConfigSettingsCheck () {
    debug.color("functionStart", "* masterConfigSettingsCheck()");

    if (!cmdLineSettingsJson.beta && typeof cmdLineSettingsJson.beta != "boolean") cmdLineSettingsJson.beta = false;
    if (!cmdLineSettingsJson.preview && typeof cmdLineSettingsJson.preview != "boolean") cmdLineSettingsJson.preview = false;


    cmdLineSettingsJson.moduleFetchList = [];
    for (let type of [ "BP", "RP" ]) {
        let LC = type.toLowerCase();
        if (has.key(cmdLineSettingsJson, LC) && !has.key(cmdLineSettingsJson, type)) {
            cmdLineSettingsJson[ type ] = cmdLineSettingsJson[ LC ];
            delete cmdLineSettingsJson[ LC ];
        }
        if (!(type in cmdLineSettingsJson) ||
            is.notObject(cmdLineSettingsJson[ type ]) ||
            is.array(cmdLineSettingsJson[ type ])) {
            cmdLineSettingsJson[ type ] = {};
        };
        cmdLineSettingsJson[ type ].type = type;
    }
    //------------------------------------------------------------------------------------------
    cmdLineSettingsJson.author = cmdLineSettingsJson.author || configFileSettings.author || "Add Author Name Here";
    //------------------------------------------------------------------------------------------
    //----------------------------------------
    //Determine if BP and RP Exist
    //----------------------------------------
    cmdLineSettingsJson.bp_only = !!cmdLineSettingsJson.bp_only;
    cmdLineSettingsJson.rp_only = !!cmdLineSettingsJson.rp_only;

    if (cmdLineSettingsJson.rp_only && cmdLineSettingsJson.bp_only) {
        cmdLineSettingsJson.bp_only = false;
        cmdLineSettingsJson.rp_only = false;
    }

    //isLive...PackFolder also gets fills bp/rpFiles arrays
    cmdLineSettingsJson.rp_only = cmdLineSettingsJson.rp_only || !isLiveBehaviorPackFolder();
    cmdLineSettingsJson.bp_only = cmdLineSettingsJson.bp_only || !(isLiveResourcePackFolder());

    //per No files
    if (cmdLineSettingsJson.rp_only && cmdLineSettingsJson.bp_only)
        throw new Error("No Valid Folders BP/RP - Check rp_only/bp_only in config & if Folders have Files/subFolders");

    //----------------------------------------
    //Determine BP and RP Pack Dependency
    //----------------------------------------
    cmdLineSettingsJson.packDependencies = !cmdLineSettingsJson.noPackDependencies; //This is for Auto only...user can manipulate    
    if (cmdLineSettingsJson.bp_only) {
        console.log("==> BP manifest only");
        cmdLineSettingsJson.RP = {};
        cmdLineSettingsJson.packDependencies = false;
    }
    if (cmdLineSettingsJson.rp_only) {
        console.log("==> RP manifest only");
        cmdLineSettingsJson.BP = {};
        cmdLineSettingsJson.packDependencies = false;
        delete cmdLineSettingsJson.dependencies; //because should only be scripting modules anyway
        delete cmdLineSettingsJson.module_names;
    }
    else debugMax.log("==> Both BP / RP");

    //Reasons to cancel/deny
    if (cmdLineSettingsJson.packDependencies) verifyConfigPackDependencies();
    console.log("==> Pack Dependencies:", cmdLineSettingsJson.packDependencies ? "Verified" : "None");

    const bpSettings = cmdLineSettingsJson.BP;
    const rpSettings = cmdLineSettingsJson.RP;
    //----------------------------------------
    // BP and RP User Dependencies
    //----------------------------------------
    if (cmdLineSettingsJson.dependencies) {
        delete cmdLineSettingsJson.dependencies;
        consoleColor.color("possibleWarn", "xx> Ignoring dependencies.  Use BP/RP.dependencies instead");
    }

    if (rpSettings.dependencies) {
        if (is.notObject(rpSettings.dependencies)) delete rpSettings.dependencies;
        else if (!isArrayOfObjects(rpSettings.dependencies)) rpSettings.dependencies = [ rpSettings.dependencies ];

        arrayDeleteObjectIfKeyNotOnList(rpSettings.dependencies, [ "UUID" ]);
    }
    if (bpSettings.dependencies) {

        if (is.notObject(bpSettings.dependencies)) delete bpSettings.dependencies;
        else if (!isArrayOfObjects(bpSettings.dependencies)) bpSettings.dependencies = [ bpSettings.dependencies ];

        arrayDeleteObjectIfKeyNotOnList(bpSettings.dependencies, [ "UUID", "module_name" ]);
    }
    //----------------------------------------
    // Scripting Configure
    //----------------------------------------
    rpSettings.isScriptingFiles = false;
    if (bpSettings.isScriptingFiles) configureScriptingDependencies();

    debugMax.mute("<== masterConfigSettingsCheck()");
} //end of masterConfigSettingsCheck
//=======================================================================
function manifestHeaders_set (pSettings) {
    debug.color("functionStart", "==> manifestHeaders_set(" + pSettings.type + ")");

    const d = new Date();
    const DateTime = [ d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds() ].join('.');

    const packType = ((cmdLineSettingsJson.preview ? " : §cPreview§r" : "") + (cmdLineSettingsJson.beta ? " : §6Beta§r" : " : §aStable§r")).trim();

    const defaultHeader = {
        name: (
            (pSettings.name ||
                cmdLineSettingsJson.name ||
                configFileSettings.name) + ' ' + pSettings.type + ' ' + packType
        ).trim().replace('  ', ' '),
        description: (
            (
                pSettings.description ||
                (cmdLineSettingsJson.description + ' ' + pSettings.type) ||
                "<" + pSettings.type + " pack description here>")
                + (pSettings.isScriptingFiles && cmdLineSettingsJson.beta ? "\n§6Requires Beta API§r" : '')
                + "\n§aBuild Date: " + DateTime + "§r"
                + ` §gby ${pSettings.author || cmdLineSettingsJson.author}§r`
        ).trim().replace('  ', ' '),
        uuid: pSettings.header_uuid || "new",
        version: pSettings.version || cmdLineSettingsJson.version || [ d.getFullYear() - 2000, d.getMonth() + 1, d.getDate() ],
        min_engine_version: pSettings.min_engine_version || 
                            cmdLineSettingsJson.min_engine_version || 
                            configFileSettings.min_engine_version ||
                            "stable"
    };
    const configHeader = {} || pSettings.header;
    pSettings.header = objectsMerge(configHeader, defaultHeader);

    if ([ "get", "new" ].includes(pSettings.header.uuid)) {
        pSettings.header.uuid = newUUID();
        console.log("==> New", pSettings.type, "Header UUID", pSettings.header.uuid);
    }
    if (!cmdLineSettingsJson.moduleFetchList.length)
        if (is.string(pSettings.header.min_engine_version)) {
            debug.log("==> Creating default moduleFetchList for min_engine_version");
            cmdLineSettingsJson.moduleFetchList.push("@minecraft/server");
        }

    debug.color("gray-bg", "Debug:", pSettings.type, "Header");
    debug.log(pSettings.header);
    debugMax.mute("<== manifestHeaders_set()");
}
//=======================================================================
function manifestPackModule_set (pSettings) {
    debug.color("functionStart", "==> manifestPackModule_set(" + pSettings.type + ")");
    //data/resources module only
    const defaultModule = {
        type: pSettings.type == "BP" ? "data" : "resources",
        description: pSettings.type + " Pack",
        uuid: pSettings.module_uuid || "new",
        version: [ 1, 0, 0 ]
    };

    // Modules defined by user
    let configModule = {};
    pSettings.userModules = [];
    let typesAllowed = pSettings.type === "BP" ? [ "data", "script" ] : [ "resources" ];

    if (is.object(pSettings.modules)) {
        let array;

        if (Array.isArray(pSettings.modules)) {
            // TODO:flat map it?  just in case  - but how much tom-foolery do I allow
            array = pSettings.modules.filter(obj => typeof obj == "object" && !Array.isArray(obj));
        }
        else array = [ pSettings.modules ];

        pSettings.userModules = array.filter(obj => typesAllowed.includes(obj.type));
    }

    if (is.object(cmdLineSettingsJson.modules)) {
        let array;

        if (Array.isArray(cmdLineSettingsJson.modules)) {
            // TODO:flat map it?  just in case  - but how much tom-foolery do I allow
            array = cmdLineSettingsJson.modules.filter(obj => typeof obj == "object" && !Array.isArray(obj));
        }
        else array = [ cmdLineSettingsJson.modules ];

        array.filter(obj => typesAllowed.includes(obj.type)).forEach(obj => pSettings.userModules.push(obj));
    }

    if (pSettings.userModules.length > 0) {
        const found = pSettings.userModules.find((obj) => obj.type === defaultModule.type);
        if (found) configModule = Object.assign({}, found);
    }

    //FIXME: what if no data, just scripts ??  Alter for that later - check for json files/folders
    //same for RP - what if no resource folders?

    pSettings.module_pack = objectsMerge(configModule, defaultModule);

    if ([ "get", "new" ].includes(pSettings.module_pack.uuid)) {
        pSettings.module_pack.uuid = newUUID();
        console.log("==>", "New", pSettings.type, defaultModule.type, "module UUID", pSettings.module_pack.uuid);
    }
    debug.color("gray-bg", "Debug:", pSettings.type, "Modules");
    debug.log(pSettings.module_pack);
    debugMax.mute("<== manifestPackModule_set()");
}
//=======================================================================
function manifestScriptModule_set (bpSettings) {
    debug.color("functionStart", "==> manifestScriptModule_set(" + bpSettings.type + ")");

    if (bpSettings.isScriptingFiles) {
        let configScriptModule = {};
        const found = bpSettings.userModules.find((obj) => obj.type === "script");
        if (found) configScriptModule = Object.assign({}, found);

        let defaultScriptModule = {
            description: "BP Scripting API Module",
            type: "script",
            language: "javascript",
            uuid: bpSettings.module_uuid || "get",
            version: [ 1, 0, 0 ],
            entry: !!bpSettings.js ? (`scripts/${bpSettings.js}.js`).replace('.js.js', '.js') :
                is.file("BP/scripts/index.js") ? "scripts/index.js" :
                    is.file("BP/scripts/main.js") ? "scripts/main.js" :
                        "Name/Path of your entry Script File Here"
        };

        bpSettings.module_script = objectsMerge(configScriptModule, defaultScriptModule);

        if ([ "get", "new" ].includes(bpSettings.module_script.uuid)) {
            bpSettings.module_script.uuid = newUUID();
            console.log("==>", "New", bpSettings.type, "script UUID", bpSettings.module_script.uuid);
        }
    }
    debug.color("gray-bg", "Debug: BP Script Module");
    debug.log(bpSettings.module_script);
    debugMax.mute("<== manifestScriptModule_set()");
}
//=======================================================================
function fetchListBuild (bpSettings) {
    debug.color("functionStart", "==> fetchListBuild()");

    //re-grab all modules from dependencies into module_names
    const fetchList = [ "@minecraft/server" ];

    if (bpSettings.dependencies) {
        debug.log("==> Getting Module Names from Dependencies Object");
        bpSettings.dependencies
            .filter(mod => mod.module_name)
            .forEach(mod => { if (!fetchList.includes(mod.module_name)) fetchList.push(mod.module_name); });
    }

    if (is.array(bpSettings.jsModList)) {
        debug.log("==> Getting Module Names from jsModList Array");
        bpSettings.jsModList.forEach(v => { if (!fetchList.includes(v)) fetchList.push(v); });
    }

    fetchList.sort().reverse();
    cmdLineSettingsJson.moduleFetchList = [ ...new Set(fetchList) ];
    debug.table("==> Module Fetch List (Final)", fetchList);

    debugMax.mute("<== fetchListBuild()");
} //end of fetchListBuild
//=======================================================================
function manifestParts_control (pSettings) {
    manifestHeaders_set(pSettings);
    manifestPackModule_set(pSettings);

    if (pSettings.isScriptingFiles) {
        manifestScriptModule_set(pSettings);
        fetchListBuild(pSettings);
    }
}//end of manifestParts_control
//=======================================================================
function manifestBuild (pSettings) {
    debug.color("functionStart", "* buildManifest(" + pSettings.type + ")");

    const manifest = {
        format_version: 2,
        header: pSettings.header,
        modules: [ pSettings.module_pack ]
    };
    if (pSettings.module_script) manifest.modules.push(pSettings.module_script);
    if (pSettings.isScriptingFiles && (pSettings.script_eval || cmdLineSettingsJson.script_eval)) manifest.capabilities = [ "script_eval" ];
    if (pSettings.dependencies?.length) manifest.dependencies = pSettings.dependencies;
    //if (pSettings.dependencies && pSettings.dependencies.length) manifest.dependencies = pSettings.dependencies;

    manifest.metadata = {
        "authors": [ pSettings.author || cmdLineSettingsJson.author ],
        "generated_with": {
            "regolith_filter_mani_fest": [ "24.7.28" ]
        }
    };

    fs.writeFileSync(pSettings.type + "/manifest.json", JSON.stringify(manifest, null, 4));
    Debug.success("==> " + pSettings.type + " manifest.json exported");
    debug.mute("<== buildManifest()");
} //end of buildManifest
//=======================================================================
function main () {
    debug.color("functionStart", "* main()");

    masterConfigSettingsCheck();

    const bpSettings = cmdLineSettingsJson.BP;
    if (!cmdLineSettingsJson.rp_only) {
        bpSettings.ModuleType = "data";
        manifestParts_control(bpSettings);
        if (!bpSettings.dependencies) debug.color("red", "==> No bpSettings.dependencies yet!");
        else debug.log(bpSettings.dependencies);
    }

    const rpSettings = cmdLineSettingsJson.RP;
    if (!cmdLineSettingsJson.bp_only) {
        rpSettings.ModuleType = "resources";
        manifestParts_control(rpSettings);
    }

    if (cmdLineSettingsJson.packDependencies) {
        //TODO: test adding own version for module dep if kept
        debug.log("==> Setting up Pack Dependencies");
        if (!is.object(bpSettings.dependencies)) {
            debug.log("==> Default bpSettings.dependencies created");
            bpSettings.dependencies = [];
        }
        if (!is.object(rpSettings.dependencies)) {
            debug.log("==> Default rpSettings.dependencies created");
            rpSettings.dependencies = [];
        }
        bpSettings.dependencies.splice(0, 0, { "uuid": rpSettings.header.uuid, "version": rpSettings.header.version });
        rpSettings.dependencies.splice(0, 0, { "uuid": bpSettings.header.uuid, "version": bpSettings.header.version });
    }
    //return
    if (cmdLineSettingsJson.moduleFetchList.length) {
        consoleColor.color("yellow", "* Get Minecraft Data");
        const siteList = cmdLineSettingsJson.moduleFetchList.map(v => "https://registry.npmjs.org/" + v);
        myFetch = new McModuleFetchStack(siteList);

        myFetch.debugOn = debug.debugOn;
        if (debugMax.debugOn) {
            debug.highlight("Debug: List of Modules to Fetch");
            myFetch.consoleLogFetchList();
        }
        myFetch.fetchesStart();

        debugMax.color("magenta-bg", "<==> fake end of main() due to scripting module fetches");
    }
    else {
        if (!cmdLineSettingsJson.bp_only) manifestBuild(cmdLineSettingsJson.RP);
        if (!cmdLineSettingsJson.rp_only) manifestBuild(cmdLineSettingsJson.BP);

        if (debug.debugOn) debugExport();

        debug.success("<== main()");
    }
} //end of main
//=======================================================================
function fetchInfoApply () {
    debug.color("functionStart", "==> fetchInfoApply()");
    if (!debug.debugOn) consoleColor.color("yellow", "==> Apply Fetched Data");

    const bpSettings = cmdLineSettingsJson.BP;
    const rpSettings = cmdLineSettingsJson.RP;

    let keyWord = "stable";

    // if (!cmdLineSettingsJson.rp_only && is.string(bpSettings.header.min_engine_version))
    //     bpSettings.header.min_engine_version = bpSettings.header.min_engine_version.replace("get", keyWord);

    // if (!cmdLineSettingsJson.bp_only && is.string(rpSettings.header.min_engine_version))
    //     rpSettings.header.min_engine_version = rpSettings.header.min_engine_version.replace("get", keyWord);

    if ((!cmdLineSettingsJson.rp_only && is.string(bpSettings.header.min_engine_version) && bpSettings.header.min_engine_version.startsWith(keyWord)) || (!cmdLineSettingsJson.bp_only && is.string(rpSettings.header.min_engine_version) && rpSettings.header.min_engine_version.startsWith(keyWord))) {
        const keys = cmdLineSettingsJson.engineGetList;
        //[x,x,x]
        const engineList = keys.map(v => v.split(".").map(v => Number(v)));

        const headersList = [];
        if (!cmdLineSettingsJson.rp_only) headersList.push(bpSettings.header);
        if (!cmdLineSettingsJson.bp_only) headersList.push(rpSettings.header);

        const settingsList = headersList.filter(hdr => hdr.min_engine_version.startsWith(keyWord));
        for (let header of settingsList) {
            let versionsBack = 0;

            if (header.min_engine_version.startsWith(keyWord + '-')) {
                versionsBack = header.min_engine_version.replace(keyWord + '-', "");
                if (!isNaN(versionsBack)) {
                    versionsBack = Number(versionsBack);
                }
                else {
                    versionsBack = 0;
                    consoleColor.warn("Invalid get-# for stable version", "using latest instead", header.name, header.min_engine_version);
                }

                if (versionsBack >= engineList.length) {
                    versionsBack = engineList.length - 1;
                    consoleColor.warn("get-# exceeds number of stable versions", "Using last instead", header.name, header.min_engine_version);
                }
            }
            header.min_engine_version = engineList[ versionsBack ];
            consoleColor.success("==>", header.name, "min_engine_version =", header.min_engine_version);
        }
    }

    const moduleList = bpSettings.moduleVersions//myFetch.promiseStack
        .filter(obj => obj.success);
    // .map(obj => { return { site: obj.site, stable: obj.versions.stable }; });

    //for now just latest... TODO: beta, rc, not latest
    debug.table("Dependency Module List", moduleList);
    for (let needModVersion of bpSettings.dependencies.filter(dependency => "module_name" in dependency && validVersionNames.includes(dependency.version.toLowerCase()))) {

        let found = moduleList.find(mod => mod.module == needModVersion.module_name);
        if (found) {
            console.log("needModVersion", needModVersion);
            switch (needModVersion.version.toLowerCase()) {
                case "latest":
                case "stable": needModVersion.version = found.stable.module; break;
                case "latestbeta":
                case "latest_beta":
                case "latest-beta":
                case "beta": needModVersion.version = found.beta.module; break;
                case "rc":
                case "preview": needModVersion.version = found.preview.module; break;
                case "preview_beta":
                case "preview-beta":
                case "previewbeta": needModVersion.version = found.previewBeta.module; break;
                default:
                    if (cmdLineSettingsJson.preview && cmdLineSettingsJson.beta) { needModVersion.version = found.previewBeta.module; break; }
                    else
                        if (cmdLineSettingsJson.beta) { needModVersion.version = found.beta.module; break; }
                        else
                            if (cmdLineSettingsJson.preview) { needModVersion.version = found.preview.module; break; }
                            else
                                needModVersion.version = found.stable.module; break;
                    break;
            }

            consoleColor.success("==>", needModVersion.module_name, " version:", needModVersion.version);
        }
        else consoleColor.error("xx> Matching Module-Version to Module-Name");
    }
    //TODO:  manifest.json by user can be used as instructions.... read in sections, so it is like a template in a way

    debug.mute("<== fetchInfoApply()");
} // end of fetchInfoApply
//=======================================================================
function mainAfterFetch () {
    debug.color("functionStart", "* mainAfterFetch()");

    //myFetch.consoleLogPromiseList();
    //myFetch.consoleLogPromiseKeys();

    for (let obj of myFetch.promiseStack) {
        consoleColor.log("==> Processing Data for " + obj.site);
        // console.log(obj)
        let distTags = obj.data[ 'dist-tags' ];

        //if (debug.debugOn) 
        //console.log(Object.keys(obj.data.versions).reverse());
        //let latestStableSearch = /^[^a-zA-Z]*$/
        ///[0-9]*\.[0-9]*\.[0-9]*/i;
        let latestBetaSearch = /[0-9]\.[0-9].*-beta\.[0-9]\.[0-9].*stable/i;
        //let previewRcSearch = /[0-9]\.[0-9].*-rc\.[0-9]\.[0-9].*preview*/i;
        //let previewBetaSearch = /[0-9]\.[0-9].*-beta\.[0-9]\.[0-9].*preview*/i;

        const versionList = Object.keys(obj.data.versions);

        //const latestStable = versionList
        //.filter(v => latestStableSearch.test(v))
        // .filter(v => latestStableSearch.test(v))
        // .filter(v => !latestBetaSearch.test(v))
        // .filter(v => !previewRcSearch.test(v))
        // .filter(v => !previewBetaSearch.test(v))
        //.reverse();
        //console.log("Latest Stable", latestStable);

        const latestBeta = versionList.filter(v => latestBetaSearch.test(v)).reverse();

        obj.versions = {
            success: obj.success,
            module: obj.data?.name || obj.data[ "_id" ],
            stable: {
                module: distTags.latest,
                engine: latestBeta.length ? latestBeta[ 0 ].split("-beta.")[ 1 ].split('-')[ 0 ] : false
            },
            beta: {
                module: latestBeta.length ? latestBeta[ 0 ].split("-beta.")[ 0 ] + '-beta' : false,
                engine: latestBeta.length ? latestBeta[ 0 ].split("-beta.")[ 1 ].split('-')[ 0 ] : false
            },
            preview: {
                module: distTags.rc.length ? distTags.rc.split('-rc.')[ 0 ] : false,
                engine: distTags.rc.length ? distTags.rc.split("-rc.")[ 1 ].split('-')[ 0 ] : false
            },
            previewBeta: {
                module: distTags.beta.length ? distTags.beta.split("-beta.")[ 0 ] + '-beta' : false,
                engine: distTags.beta.length ? distTags.beta.split("-beta.")[ 1 ].split('-')[ 0 ] : false
            } //,time: Object.keys(obj.data.time).reverse()
        };
        console.log(obj.versions);

        if (!cmdLineSettingsJson.BP) cmdLineSettingsJson.BP = {};
        if (!cmdLineSettingsJson.BP.moduleVersions) cmdLineSettingsJson.BP.moduleVersions = [];
        cmdLineSettingsJson.BP.moduleVersions.push(obj.versions);

        const engines = Object.keys(obj.data.versions)
            .filter(v => v.endsWith('-stable'))
            .map(v => v.split("-beta.")[ 1 ].replace('-stable', ''))
            .sort()
            .reverse();

        if (!cmdLineSettingsJson.engineGetList)
            if (engines.length)
                cmdLineSettingsJson.engineGetList = engines;
    }
    //console.log(cmdLineSettingsJson.engineGetList);
    debug.table("==> min_engine_versions", cmdLineSettingsJson.engineGetList);

    for (let obj of myFetch.promiseStack) obj.versions.stable.engine = cmdLineSettingsJson.engineGetList[ 0 ];

    fetchInfoApply();

    if (!cmdLineSettingsJson.bp_only) manifestBuild(cmdLineSettingsJson.RP);
    if (!cmdLineSettingsJson.rp_only) manifestBuild(cmdLineSettingsJson.BP);

    if (debug.debugOn) debugExport();

    debugMax.mute("<== mainAfterFetch()");
    const d = new Date();
    consoleColor.success("Time Ended: ", d.toLocaleString('en-US', { timeZoneName: 'short' }));
} // End of mainAfterFetch()
//=======================================================================
function debugExport () {
    if (!cmdLineSettingsJson.rp_only) fs.writeFileSync("BP/debug.bpSettings.json", JSON.stringify(cmdLineSettingsJson.BP));
    if (!cmdLineSettingsJson.bp_only) fs.writeFileSync("RP/debug.rpSettings.json", JSON.stringify(cmdLineSettingsJson.RP));

    if (cmdLineSettingsJson.bp_only || !cmdLineSettingsJson.rp_only) fs.writeFileSync("BP/debug.ConfigSettings.json", JSON.stringify(cmdLineSettingsJson));
    else
        if (cmdLineSettingsJson.rp_only) fs.writeFileSync("RP/debug.ConfigSettings.json", JSON.stringify(cmdLineSettingsJson));

    Debug.success("* Debug Files Exported");
}
//============================================================================


main();
//============================================================================
//Go Home, the show is over