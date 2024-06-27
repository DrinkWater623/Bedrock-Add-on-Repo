let isDebug = false
/*
Information:
    Author:     DrinkWater623
    Contact:    Discord/GitHub @DrinkWater623 

    Purpose:    Create manifest.json from profile settings. 
                Why?  Why not!  Cause I always have to update info when I move it out of Dev.

    Usage:      in Regolith.  Does not validate input.

    Settings:   name,version,min_game_version,description (all have defaults)
                BP/RP{any of the above to override, UUID, module}
                for UUID and module, can use real/fake UUID or the word get to get a real new one

Change Log:    
    20221220 - NAA - Created Basics - will figure out info for sub-packs and scripts later
    20230107 - NAA - Added ,null,4 to stringify to make not all one line
    20230304 - NAA - Added Julian Style Build Date to the Description (make optional Later)
                    .And default version is [yy,m,d] DW Style
    20231118 - NAA - Add Script Modules

To Do:    
    1) Add manifest info for script API
    2) Make code efficient - Nikki style (ummm, after I learn javascript)
    3) Make is so I can have a dev and rel pack icon - prob can use the data section to hold and use by name or settings has filename
    4) maybe grab the project and author from config for Meta Data
    5) look for highest format version for default version
*/
//=====================================================================
//Global Include Like Statements (const <> constant and is still a mystery)

const fs = require("fs");
const myUUID = require("crypto");

//User Data Get (the settings info from the profile ran)
var settings = process.argv[2];
const jsonObject = JSON.parse(settings);

if (!("BP" in jsonObject)) { jsonObject.BP = {} };
if (!("RP" in jsonObject)) { jsonObject.RP = {} }; 
if (!("dependencies" in jsonObject)) { jsonObject.dependencies = true };
if (!("getUUIDs" in jsonObject)) { jsonObject.getUUIDs = true };
if (!(jsonObject.getUUIDs == false)) { jsonObject.getUUIDs = true };

if (("debug" in jsonObject)) {
    for (key in jsonObject){
        console.log("jsonObject-----------------------------------------------------------");
        console.log(key);
        if(typeof jsonObject[key] != "undefined"){
            console.log(typeof jsonObject[key]);
            console.log(jsonObject[key]);
        }
    }
    console.log("end of jsonObject-----------------------------------------------------------");
}

//Append Setting Defaults
const bpSettings = jsonObject.BP;
bpSettings.ModuleType = "data";
ApplyDefaultSettings(bpSettings, "BP");

if ("ScriptAPI" in jsonObject) {
//jsonObject.ScriptAPI = {};
    AddScriptApiDefaultSettings(jsonObject.ScriptAPI,bpSettings);
}

const rpSettings = jsonObject.RP
rpSettings.ModuleType = "resources";
ApplyDefaultSettings(rpSettings, "RP");

if (jsonObject.dependencies == true) {
    bpSettings.depUUID = rpSettings.UUID
    bpSettings.depVersion = rpSettings.version
    rpSettings.depUUID = bpSettings.UUID
    rpSettings.depVersion = bpSettings.version
};

if (isDebug) {
    fs.writeFileSync("BP/bpSettings.json", JSON.stringify(bpSettings));
    fs.writeFileSync("RP/rpSettings.json", JSON.stringify(rpSettings));
    fs.writeFileSync("BP/ConfigSettings.json", JSON.stringify(jsonObject));
};

//Build Manifest
buildManifest(bpSettings, "BP");
buildManifest(rpSettings, "RP");

// End of Main    
//=======================================================================
//Subroutines (and I can't believe they don't officially have them)
//=======================================================================
function buildManifest(pSettings, p) {
    console.log("Building " + `${p}` + " Manifest")
    const manifest = {"format_version": 2}

    manifest.header = {
        "name": `${pSettings.name}`,
        "description": `${pSettings.description}`,
        "uuid": `${pSettings.UUID}`,
        "version": pSettings.version,
        "min_engine_version": pSettings.min_engine_version
    }
    
    manifest.modules = [
        {
            "type": `${pSettings.ModuleType}`,
            "description": "_",
            "uuid": `${pSettings.module}`,
            "version": [1, 0, 0]
        }
    ]
    
    if ("depUUID" in pSettings) {
        manifest.dependencies = [{
            "uuid": `${pSettings.depUUID}`,
            "version": pSettings.depVersion
        }]
    }

    if ("ScriptAPI" in pSettings){        
        console.log("..... with Scripts")
        manifest.modules.push(pSettings.ScriptAPI.module);
        
        if ("capabilities" in pSettings.ScriptAPI) manifest.capabilities = pSettings.ScriptAPI.capabilities;
        
        for(let i = 0; i < pSettings.ScriptAPI.dependencies.length; i++) {
            manifest.dependencies.push(pSettings.ScriptAPI.dependencies[i]);
        }
    }

    manifest.metadata = {
        "authors": ["Add Name Here"],
        "generated_with": {
            "regolith_filter_mani_fest": ["1.0.0"]
        }
    }

    fs.writeFileSync(p + "/manifest.json", JSON.stringify(manifest, null, 4));

} //end of buildManifest
//----------------------------------------------------------------------------
function ApplyDefaultSettings(pSettings, p) {

    const d = new Date();
    const dayOfYear = date => Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const buildDateTime = d.getFullYear().toString() + '.' + (d.getMonth()+1).toString().padStart(2, "0") + d.getDate().toString().padStart(2, "0") + ' @ ' + d.getHours().toString().padStart(2, "0") + '.' + d.getMinutes().toString().padStart(2, "0");


    if (!("name" in pSettings)) {
        if ("name" in jsonObject) {
            pSettings.name = jsonObject.name + " " + p
        }
        else { pSettings.name = "My UnNamed Pack " + p }
    }

    if (!("description" in pSettings)) {
        if ("description" in jsonObject) {
            pSettings.description = jsonObject.description + " " + p
        }
        else { pSettings.description = "This " + p + " pack does amazing things" }
    }

    pSettings.description = pSettings.description + "\nBuild Date/Time: " + buildDateTime

    if (!("version" in pSettings)) {
        if ("version" in jsonObject) {
            pSettings.version = jsonObject.version
        }
        else { pSettings.version = [d.getFullYear() - 2000, d.getMonth() + 1, d.getDate()] }
    }

    if (!("min_engine_version" in pSettings)) {
        if ("min_engine_version" in jsonObject) {
            pSettings.min_engine_version = jsonObject.min_engine_version
        }
        else { pSettings.min_engine_version = [1, 16, 100] }
    }

    if (!("UUID" in pSettings)) {
        if (jsonObject.getUUIDs == false) { pSettings.UUID = "<Insert " + p + " UUID Here>" }
        else { pSettings.UUID = "get" }
    }

    if (!("module" in pSettings)) {
        if (jsonObject.getUUIDs == false) { pSettings.module = "<Insert module UUID Here>" }
        else { pSettings.module = "get" }
    }

    //Now every setting needed should exist

    if (pSettings.UUID == "get") { pSettings.UUID = newUUID() }
    if (pSettings.module == "get") { pSettings.module = newUUID() }

    if (("debug" in pSettings)) {
        for (key in pSettings){
            console.log("pSettings-----------------------------------------------------------");
            console.log(key);
            if(typeof pSettings[key] != "undefined"){
                console.log(typeof pSettings[key]);
                console.log(pSettings[key]);
            }
        }
        console.log("end of pSettings-----------------------------------------------------------");
    }

} //end of ApplyDefaultSettings

function AddScriptApiDefaultSettings(apiSettings,bpSettings){

    //set defaults
    if (!("UUID" in apiSettings)) {
        if (jsonObject.getUUIDs == false) { apiSettings.UUID = "<Insert " + p + " UUID Here>" }
        else { apiSettings.UUID = newUUID() }
    }

    if (!("entry" in apiSettings)) {apiSettings.entry = "Main.js"}

    if (!("script_eval" in apiSettings)) apiSettings.script_eval = false;    

    let serverDefined = false;
    for (key in apiSettings) {
        if (key.startsWith("server")) {
            serverDefined = true;
            break;
        }
    }

    if (!serverDefined) apiSettings.server = "1.7.0"

    if (("debug" in apiSettings)) {
        for (key in apiSettings){
            console.log("apiSettings-----------------------------------------------------------");
            console.log(key);
            if(typeof apiSettings[key] == "undefined"){
                for (subKey in apiSettings[key]){
                    console.log(subKey);                    
                }
            }
            else{
                console.log(typeof apiSettings[key]);
                console.log(apiSettings[key]);
            }
        }
        console.log("end of apiSettings-----------------------------------------------------------");
    }
    //end of defaults    

    if (!apiSettings.entry.startsWith("scripts/")) {
        apiSettings.entry = "scripts/" + apiSettings.entry 
    }   

    const apiData =  {
        "module":{
            "type": "script",
            "language": "javascript",
            "uuid": `${apiSettings.UUID}`,
            "entry": `${apiSettings.entry}`,
            "version": [0, 1, 0]
        }
    }

    if (apiSettings.script_eval == true) { apiData.capabilities =  ["script_eval"] } 
    
    apiData.dependencies = [];
    for (key in apiSettings) {        
        if (key.startsWith("server")) {
            const moduleName = "@minecraft/" + key; 
            const data = {
                "module_name": `${moduleName}`,
                "version": `${apiSettings[key]}`    
            }            
            apiData.dependencies.push(data);
        }
    }   

    bpSettings.ScriptAPI = apiData;
}
//----------------------------------------------------------------------------
function newUUID() { return myUUID.randomUUID() }
//============================================================================