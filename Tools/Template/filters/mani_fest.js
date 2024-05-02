let isDebug = false
/*
Information:
    Author:     DrinkWater623/PinkSalt623
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
                    .Anded default version is [yy,m,d] DW Style
    20240429 - NAA - Added Scripting stuff

To Do:    
    () Make code efficient - Nikki style 
    () Make is so I can have a dev and rel pack icon - prob can use the data section to hold and use by name or settings has filename
    () maybe grab the project and author from config for Meta Data
*/
//=====================================================================
const fs = require("fs");
const myUUID = require("crypto");
let scriptingVersions = "get";
//may put in a try catch


//User Data Get (the settings info from the profile ran)
var settings = process.argv[2];
const jsonObject = JSON.parse(settings);

main();

//Go Home, the show is over
//=======================================================================
function main(){
    // Defaults and Overrides
    masterDefaultSettings();

    //Append Setting Defaults
    const bpSettings = jsonObject.BP;
    if (!("rp_only" in jsonObject)) {
        bpSettings.ModuleType = "data";
        ApplyDefaultSettings(bpSettings, "BP");
    }

    const rpSettings = jsonObject.RP
    if (!("bp_only" in jsonObject)){
        rpSettings.ModuleType = "resources";
        ApplyDefaultSettings(rpSettings, "RP");
    }

    if (jsonObject.dependencies == true) {
        bpSettings.depUUID = rpSettings.UUID
        bpSettings.depVersion = rpSettings.version
        rpSettings.depUUID = bpSettings.UUID
        rpSettings.depVersion = bpSettings.version
    }

    if (isDebug) {
        if (!("rp_only" in jsonObject)) fs.writeFileSync("BP/bpSettings.json", JSON.stringify(bpSettings));
        if (!("bp_only" in jsonObject)) fs.writeFileSync("RP/rpSettings.json", JSON.stringify(rpSettings));
        if (!("rp_only" in jsonObject)) fs.writeFileSync("BP/ConfigSettings.json", JSON.stringify(jsonObject));
    }

    //Build Manifest
    if (!("rp_only" in jsonObject)) buildManifest(bpSettings, "BP");
    if (!("bp_only" in jsonObject)) buildManifest(rpSettings, "RP");
}
// End of Main    
//=======================================================================
// Functions
//=======================================================================
function newUUID() { return myUUID.randomUUID() }
//----------------------------------------------------------------------------
function scriptingVersionsGet(type = "server"){
    /**
     * server, server-ui, common
     * 
     * Umm, BDS and Beta is a different story...will figure out later
     * Note - dependencies in some of the BDS ones
     * 
     * Thanks Hatchi !!!
     */

    let list = ["server","server","common"]
    if(!list.includes(type))
        throw new Error('module types server/server-ui/common only');

    let site = "https://registry.npmjs.org/@minecraft/" + type   

    let localVersions

    /**
     * to try in between promise and response
     let delay = 1000; // Start with a 1-second delay

for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(`This is message ${i + 1}`);
  }, delay);

  delay += 1000; // Increase the delay by 1 second for each iteration
}
     */

    fetch(site)
        .then(response => {    
            if (!response.ok) {throw new Error('Network response was not ok');}    
            return response.json();
        })
        .then(data => {                            
            return data["dist-tags"];
        })
        .then(versions => {            
            scriptingVersions = versions;
            console.log("then scriptingVersions =>",scriptingVersions)
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < 2000);
    
    console.log("Done Waiting",scriptingVersions)

    return 0

}
//----------------------------------------------------------------------------
function masterDefaultSettings(){

    //------------------------------------------------------------------------------------------
    if (("rp_only" in jsonObject) || ("bp_only" in jsonObject)) {

        if (("rp_only" in jsonObject) && ("bp_only" in jsonObject)) {
            delete jsonObject.rp_only;
            delete jsonObject.bp_only
        }
        else {
            jsonObject.dependencies = false ;
            //clear it
            if (("rp_only" in jsonObject) && ("BP" in jsonObject)) delete jsonObject.BP
            if (("bp_only" in jsonObject) && ("RP" in jsonObject)) delete jsonObject.RP
        }
    }
    //------------------------------------------------------------------------------------------
    if (!("scripting" in jsonObject)) { 
        jsonObject.scripting = false 

        if (("BP" in jsonObject)) {
            let list = ["script_entry","scripting_module_name"];
            //,"scripting_version","script_uuid"

            for(let v of list) {
                if (v in jsonObject.BP) {
                    jsonObject.scripting = true;                      
                    break;
                }
            }
        }
    }    
    if (!(jsonObject.scripting === true)) jsonObject.scripting = false;
    //------------------------------------------------------------------------------------------
    if (!("BP" in jsonObject)) { jsonObject.BP = {} };
    if (!("RP" in jsonObject)) { jsonObject.RP = {} }; 
    //------------------------------------------------------------------------------------------
    //after BP exists - set defaults if not listed
    if (jsonObject.scripting){

        let mcPrefix = "@minecraft/"

        let list = {
            script_entry:"scripts/main.js",
            script_uuid:"get",
            scripting_module_name:mcPrefix + "server",
            scripting_version:"get"
        }
        for (const property in list){
            // omitted
            if (!(property in jsonObject.BP)) 
                jsonObject.BP[property] = list[property]

            //if empty
            if(!jsonObject.BP[property]) 
                jsonObject.BP[property] = list[property]
        }

        if (jsonObject.BP.scripting_module_name.substr(0,11) !== mcPrefix)
            throw new Error('scripting_module_name should start with ' + mcPrefix);

        if(jsonObject.BP.scripting_version === "get"){
            jsonObject.BP.scripting_version = "getting from Minecraft"
            let mod = jsonObject.BP.scripting_module_name.substring(mcPrefix.length )

            let list = ["server","server","common"]
            if(!list.includes(mod))
                throw new Error('module types server/server-ui/common only');

            scriptingVersionsGet(mod) 
            console.log("after scriptingVersionsGet =>",scriptingVersions)           
            jsonObject.BP.scripting_version = scriptingVersions.latest            
        }
    }
    else {
        let list = ["script_entry","scripting_module_name","scripting_version","script_uuid"];
    
        for(let v of list) {
            if (v in jsonObject.BP) delete jsonObject.BP[v];
        }
    }
    //------------------------------------------------------------------------------------------
    if (!("dependencies" in jsonObject)) {jsonObject.dependencies = true };

    if (!("getUUIDs" in jsonObject)) 
        jsonObject.getUUIDs = true 
    else if (!(jsonObject.getUUIDs === false)) 
        jsonObject.getUUIDs = true ;
    
}
//=============================================================================================
function buildManifest(pSettings, p) {
    const manifest = {
        "format_version": 2,
        "header": {
            "name": `${pSettings.name}`,
            "description": `${pSettings.description}`,
            "uuid": `${pSettings.UUID}`,
            "version": pSettings.version,
            "min_engine_version": pSettings.min_engine_version
        },
        "modules": [
            {
                "type": `${pSettings.ModuleType}`,
                "description": "_",
                "uuid": `${pSettings.module}`,
                "version": [1, 0, 0]
            }
        ]
    }
    
    if ("script_entry" in pSettings) {
        manifest.modules.push(
            {
                "type": "script",
                "uuid": `${pSettings.script_uuid}`,
                "version": [1, 0, 0],
                "entry": `${pSettings.script_entry}`,
            }
        )
    }

    if ("depUUID" in pSettings) {
        manifest.dependencies = [{
            "uuid": `${pSettings.depUUID}`,
            "version": pSettings.depVersion
        }]
    }

    if ("scripting_module_name" in pSettings) {

        if (!(manifest.dependencies)) manifest.dependencies =[];
        
        console.log ("writing scriptingVersions.latest",scriptingVersions.latest)

        manifest.dependencies.push(
            {
                "module_name": `${pSettings.scripting_module_name}`,
                "version": `${jsonObject.BP.scripting_version}`
            }
        )
    }

    manifest.metadata = {
        "authors": [jsonObject.author || "Add Name Here"],
        "generated_with": {
            "regolith_filter_mani_fest": ["24.5.1"]
        }
    }

    fs.writeFileSync(p + "/manifest.json", JSON.stringify(manifest, null, 4));

} //end of buildManifest

//----------------------------------------------------------------------------
function ApplyDefaultSettings(pSettings, p) {

    const d = new Date();
    const dayOfYear = date => Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const julianBuildDateTime = d.getFullYear().toString() + '.' + dayOfYear(d).toString().padStart(3, "0") + '.' + d.getHours().toString().padStart(2, "0") + '.' + d.getMinutes().toString().padStart(2, "0");


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

    pSettings.description = pSettings.description + "\nBuild Date: " + julianBuildDateTime

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
    //Update UUIDs - since user can use "get" have to do it here
    if (pSettings.UUID == "get") { pSettings.UUID = newUUID() }
    if (pSettings.module == "get") { pSettings.module = newUUID() }
    if ("script_uuid" in pSettings) if (pSettings.script_uuid == "get") { pSettings.script_uuid = newUUID() }
} //end of ApplyDefaultSettings
//============================================================================