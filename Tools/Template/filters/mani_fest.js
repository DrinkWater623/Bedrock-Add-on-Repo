// @ts-check
let isDebug = true;
let isDebugMax = false;
//WORK IN PROGRESS to Add Multiple servers and scrape for version numbers
//=====================================================================
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
                    Added default version is [yy,m,d] DW Style
    20240429 - NAA - Added Scripting stuff
    20240509 Working on multi @minecraft dependencies
    20240512 - NAA - Ability to grab author from config.json
    20240513 - Naa - Multi-Server

To Do:
    () multi-ser server in settings, take in as array and get versions for each    
    () Make code efficient - Nikki style 
    () Make is so I can have a dev and rel pack icon - prob can use the data section to hold and use by name or settings has filename
    () maybe grab the project and author from config for Meta Data
*/
//=====================================================================
const fs = require("fs");
const myUUID = require("crypto");
//=====================================================================
// Classes
//=====================================================================
class FetchSiteJsonStack{    
    constructor(sites=[]){
        this.fetchStack = sites
        .filter(v=> typeof v === "string")
        .filter(v => v.length > 0)
        .map(site => this.#siteObj(site));
    }    
    promiseStack = [];
    //--------------------------------------
    debugOn = false;
    #colorReset = '\x1b[0m';
    #colorMap = new Map(
        [
            ["bold"     ,97],
            ["error"    ,91],
            ["highlight",47],
            ["log"      ,38],
            ["success"  ,92],
            ["warn"     ,93]
        ]
    )
    #colorString(colorName) {
        return "\x1b[" +this. #colorMap.get(colorName) + "m%s"
    }    
    //--------------------------------------    
    #siteObj(site) {
        return{
            site: site,            
            success: false,
            data:{},
            dataType: "Unknown",
            err: ""
        }
    }
    //add fetchSiteDel....
    fetchAdd(...sites){
        sites
            .filter(v=> typeof v === "string")
            .filter(v => v.length > 0)
            .forEach(site => this.fetchStack.push(this.#siteObj(site)))        
    }  
    #fetchNext(){
        if ( this.fetchStack.length === 0 ) return;

        let errCode = this.#colorString("error");
        let warnCode = this.#colorString("warn");
        let successCode = this.#colorString("success");
        
        let newFetch = this.fetchStack.pop()
        if(typeof newFetch != "object") return;
        
        //should this be b4 the pop?  not sure
        this._preFetchEach(newFetch);
        //because user could alter the object
        if (!("site" in newFetch) || newFetch.site.length === 0) {                
            if(this.fetchStack.length) this.#fetchNext();            
            return;
        }

        if (this.debugOn) console.log(this.#colorString("bold"),"==> Fetching Site:",newFetch.site,this.#colorReset)
        
        fetch(newFetch.site)
            .then(response => {    
                let returnedJson = {}

                if (response.ok) {
                    newFetch.success = true;  
                    //FIXME:              
                    try {
                        returnedJson = response.json();
                        newFetch.dataType = 'json'
                    }
                    catch(err) {                        
                        console.error(this.#colorString("error"),"xx> Not a JSON Site:",newFetch.site,this.#colorReset)                    
                    }
                }
                else {
                    newFetch.success = false;
                    if (this.debugOn) console.warn(this.#colorString("warn"),"xx> Fetch Response Not-Ok");
                }
                return returnedJson;
            })
            .then(data => { //note: keep this part sep from above, works better
                if (newFetch.success)
                    newFetch.data = data;                
            })            
            .catch(error => {
                newFetch.err = error;
                if (this.debugOn) console.error(this.#colorString("error"),"xx> Fetch Error:", error,this.#colorReset)
            })
            .finally(() => {        
                this.promiseStack.push(newFetch);        
                
                this._postPromiseEach();

                if (this.fetchStack.length) 
                    this.#fetchNext();
                else {
                    console.log(this.#colorString("success"),"==> Fetch Stack is Now Empty!");
                    this._postPromiseAll();
                }
            });   
    }
    fetchesStart(){
        if (this.debugOn) console.log("**> fetchStart()")
        if ( this.fetchStack.length > 0 ) 
            this.#fetchNext()
        else 
            console.warn(this.#colorString("warn"),"xx> Fetch List is Empty")
    }
    consoleLogFetchList(){
        if (this.debugOn) console.log(this.#colorString("bold"),"* consoleLogFetchList()","length:",this.fetchStack.length);
        let list = [];
        this.fetchStack.forEach(v => list.push(v.site));
        if (list.length > 0) console.table (list);
        else if (this.debugOn) console.warn(this.#colorString("warn"),"Fetch List is Empty")        
    }          
    consoleLogPromiseList(){
        if (this.debugOn) console.log(this.#colorString("bold"),"* consoleLogPromiseList()","length:",this.promiseStack.length);
        let list = [];
        this.promiseStack.forEach(v => list.push(
            {
                Retrieved: v.success,
                DataType: v.dataType,
                Site: v.site
            }));
        if (list.length > 0) console.table (list); 
        else if (this.debugOn) console.warn(this.#colorString("warn"),"==> Response List is Empty")
    }    
    //for Json Data Only else will fail
    consoleLogPromiseKeys(){
        if (this.debugOn) console.log(this.#colorString("bold"),"* consoleLogPromiseKeys()","length:",this.promiseStack.length);
        if (this.promiseStack.length == 0) {
            if (this.debugOn) console.warn(this.#colorString("warn"),"==> Response List is Empty")
            return;
        }
        for(let i in this.promiseStack) {
            let obj = this.promiseStack[i]
            
            if (obj.success) {            
                console.info(this.#colorString("success"),"Site:",obj.site,this.#colorReset)
                const keys = Object.keys(obj.data);
                console.table(keys);
            }
            else
                console.error(this.#colorString("error"),"Failed Site:",obj.site,"Err:",obj.err,this.#colorReset)
        }        
    }
    //--------------------------------------------------------------
    //Expecting Class user to Overwrite these in their extended copy
    //--------------------------------------------------------------
    /*
    This is called after each fetch is done whether it failed or not.  
    This is how you can use your extend class functions in between fetches
    i.e. you extended the constructor and want to add properties and update them
    i.e. change the fetch stack based on response information
    */
    _preFetchEach(fetchObj){     
        if (this.promiseStack.length === 0) {
            console.warn(this.#colorString("warn"),"* _preFetchEach(fetchObj) is called before every site fetch.")
            console.warn(this.#colorString("warn"),"\tReplace it in your Extended class")
        }
    }
    /*
    This is called after each promise is returned, whether it failed or not.  
    This is how you can use your extend class functions in between fetches
    i.e. you extended the constructor and want to add properties and update them
    i.e. change the fetch stack based on response information
    */
    _postPromiseEach(){     
        if (this.promiseStack.length === 1) {
            console.warn(this.#colorString("warn"),"* _postPromiseEach() is called after the returned promise of every fetch.")
            console.warn(this.#colorString("warn"),"\tReplace it in your Extended class")
        }
    }
    /*
    This is called after last fetch in stack is done.  
    This is how you can continue your node program, making it wait until all the promises are fulfilled
    before it continues to your next function
    */
    _postPromiseAll(){        
        console.warn(this.#colorString("warn"),"* _postPromiseAll() is called after all promises are returned.")
        console.warn(this.#colorString("warn"),"\tReplace it in your Extended class, to keep processing alive in Node JS")
        this.consoleLogPromiseList()
    }
}
//=====================================================================
class McModuleFetchStack extends FetchSiteJsonStack{
    //If I wanted to add to the constructor
    /*
        constructor(sites=[]){
            super(sites);
            this.newVariable = 0;
        }    
    */
    _preFetchEach(){}
    _postPromiseEach(){}
    _postPromiseAll(){                
        mainAfterFetch();
    }
}
let myFetch;
//=====================================================================
class Debug {
    constructor(booleanValue = true){
        this.debugOn = booleanValue;
    }
    //-------------------------------------- 
    //TODO: Add methods to show keys and values   
    colorsAdded = new Map(
        [
            ["userExample"  ,44]
        ]
    )
    #colorDefaultAssignments = new Map(
        [
            ["bold"     ,97],
            ["error"    ,91],
            ["highlight",107],
            ["log"      ,38],
            ["mute"     ,90],
            ["success"  ,92],
            ["underline",52],
            ["warn"     ,93]
        ]
    )     
    #colorMap = new Map(
        [           
            ["red"      ,91],
            ["yellow"   ,93],
            ["green"    ,92],
            ["blue"     ,94],
            ["purple"   ,95],
            ["cyan"     ,96],
            ["white"    ,97],
            ["gray"     ,90],
            ["black-bg"    ,40],
            ["red-bg"      ,41],
            ["yellow-bg"   ,103],
            ["green-bg"    ,102],
            ["blue-bg"     ,104],
            ["magenta-bg"  ,105],
            ["cyan-bg"     ,106],
            ["white-bg"    ,107],
            ["gray-bg"     ,100]
        ]
    )
    #colorReset = '\x1b[0m';
    //--------------------------------------
    off() {this.debugOn = false;}
    on()  {this.debugOn = true;}
    //--------------------------------------
    color(colorPtr,...args) {if (this.debugOn && args.length) this.#log(colorPtr,args)}
    bold(...args)           {if (this.debugOn && args.length) this.#log("bold",args)}
    error(...args)          {if (this.debugOn && args.length) this.#log("error",args)}
    highlight(...args)      {if (this.debugOn && args.length) this.#log("highlight",args)}
    log(...args)            {if (this.debugOn && args.length) this.#log("log",args)}
    mute(...args)           {if (this.debugOn && args.length) this.#log("mute",args)}
    success(...args)        {if (this.debugOn && args.length) this.#log("success",args)}
    underline(...args)      {if (this.debugOn && args.length) this.#log("underline",args)}
    warn(...args)           {if (this.debugOn && args.length) this.#log("warn",args)}
    colorsList() {        
        if (this.colorsAdded.size > 0) {
            this.highlight("User Defined Colors (Overrides Defaults)")
            this.colorsAdded.forEach(
                (value,key) => {
                    let colorString = "\x1b[" + value + "m%s"
                    console.log(colorString,"User Defined Color:",key,value,this.#colorReset)
                }
            )            
        }
        
        this.highlight("Default Assignments")
        this.#colorDefaultAssignments.forEach(
            (value,key) => {
                let colorString = "\x1b[" + value + "m%s"
                console.log(colorString,"Color Default Assignments:",key,value,this.#colorReset)
            }
        )
        
        this.highlight("Colors")
        this.#colorMap.forEach(
            (value,key) => {
                let colorString = "\x1b[" + value + "m%s"
                console.log(colorString,"Color:",key,value,this.#colorReset)
            }
        ) 
    }
    //--------------------------------------
    #colorNumberGet(color) {       

        if (typeof color === "number") return color;
        else
        if (typeof color === "string") {
            //@ts-ignore
            if (this.colorsAdded.has(color)) return  this.colorsAdded.get(color)                            
            //@ts-ignore
            else if (this.#colorDefaultAssignments.has(color)) return this.#colorDefaultAssignments.get(color)
            //@ts-ignore
            else if (this.#colorMap.has(color)) return this.#colorMap.get(color)
            //@ts-ignore
            else return this.#colorMap.get("gray-bg")
        }
        //@ts-ignore
        else return this.#colorMap.get("gray-bg")
    }
    #log(color,args) {
        let isWarning = false;
        let isError = false;
        let isSuccess = false;
        let asTable = false;
        let colorNumber = this.#colorNumberGet(color);

        if (typeof color === "string") {
            isError = (color === "error");
            isWarning = (color === "warn");
            isSuccess = (color === "success");
            asTable = (color === "table");  //force table and table cannot use color anyway
        }

        let colorString = "\x1b[" + colorNumber + "m%s"
        let colorReset = '\x1b[0m';

        while (Array.isArray(args) && args.length === 1) args = args[0];        
        if (asTable) if(typeof args === "string") args = [...args];

        if (Array.isArray(args) || asTable) {
            if(isError)     this.error("Error:");
            if(isWarning)   this.error("Warning:");
            if(isSuccess)   this.error("Success:");
            console.table(args);
        }
        else {
            if (isWarning) console.warn(colorString,args,this.#colorReset)
            else if (isError) console.error(colorString,args,this.#colorReset)
            else console.log(colorString,args,this.#colorReset)
        }
    }       
    //------------------------------------------    
    static error(...args)       {let temp = new Debug(true); temp.error(args)}
    static success(...args)     {let temp = new Debug(true); temp.success(args)}
    static warn(...args)        {let temp = new Debug(true); temp.warn(args)}
    static log(...args)         {let temp = new Debug(true); temp.log(args)}
    static mute(...args)        {let temp = new Debug(true); temp.mute(args)}
    static highlight(...args)   {let temp = new Debug(true); temp.highlight(args)}
    static color(color,...args) {let temp = new Debug(true); temp.color(color,args)}
}
let debug = new Debug(isDebugMax || isDebug);
//My Changed
debug.colorsAdded.set("functionStart",95)
debug.colorsAdded.set("functionEnd",90)
debug.colorsAdded.set("tableTitle",96)
debug.colorsAdded.set("list",36)
debug.colorsAdded.set("log",90)
//=====================================================================
// Global variables
var argPath = process.argv[1];
var argSettings = process.argv[2];
const cmdLineSettingsJson = JSON.parse(argSettings);
var minecraftScrapeData;
var scrapeServer;
let scriptingModuleData
let scriptingModuleList = []
//=======================================================================
function isArrayOfObjects(array) { 
    if (Array.isArray(array))
        return array.every((item) => typeof item === "object"); 

    return false;
}
function isArrayOfStrings(array) { 
    if (Array.isArray(array))
        return array.every((item) => typeof item === "string"); 

    return false
}  
function isArrayOfArrays(array) { 
    if (Array.isArray(array))
        return array.every((item) => Array.isArray(item)); 
    
    return false;
}
function isArrayOfSameTypes(array) { 
    if (!Array.isArray(array)) return false

    let firstType = typeof array[0]
    return array.every((item) => typeof item === firstType); 
}
function isArrayOfMixedTypes(array) { 
    if (!Array.isArray(array)) return false

    return !isArrayOfSameTypes(array); 
}   
//=======================================================================
function newUUID() { return myUUID.randomUUID(); }
//=======================================================================
function isEmptyFolder(path){
    
    if(!fs.existsSync(path)) return true;
    if(!fs.lstatSync(path).isDirectory()) return true;
    
    let fileCount = fs.readdirSync(path).length;
    //if (isDebug) console.log('\x1b[93m%s\x1b[0m',"..Debug..","isEmptyFolder(",path,") => File Count:",fileCount)

    return fileCount == 0 ? true : false;
}
function containFilesWithExt(path,ext){
    if(isEmptyFolder(path)) return false;
    return fs.readdirSync(path).filter(f => f.endsWith("."+ext)).length > 0 ? true : false; 
}
//=======================================================================
function masterDefaultSettings(){
    debug.color("functionStart","* masterDefaultSettings()")    

    //conform - later add FORCE
    cmdLineSettingsJson.bp_only = !!cmdLineSettingsJson.bp_only
    cmdLineSettingsJson.rp_only = !!cmdLineSettingsJson.rp_only
    
    //per User
    if (cmdLineSettingsJson.rp_only && cmdLineSettingsJson.bp_only) {            
        cmdLineSettingsJson.bp_only = false;
        cmdLineSettingsJson.rp_only = false;
    }
    //Change based on conditions
    //Other exists    

    //This may fail if folder does not exist - test and see ts-compiler for upgraded functions
    cmdLineSettingsJson.rp_only = cmdLineSettingsJson.rp_only || isEmptyFolder("BP")
    cmdLineSettingsJson.bp_only = cmdLineSettingsJson.bp_only || isEmptyFolder("RP")    

    //per No files
    if (cmdLineSettingsJson.rp_only && cmdLineSettingsJson.bp_only)
        throw new Error("No Valid Folders BP/RP - Check rp_only/bp_only in config & if Folders have Files/subFolders");
        
    if(cmdLineSettingsJson.bp_only){
        console.log("==> BP manifest only")
        cmdLineSettingsJson.dependencies = false ;
        if("RP" in cmdLineSettingsJson) delete cmdLineSettingsJson.RP
    }
    if(cmdLineSettingsJson.rp_only){
        console.log("==> RP manifest only")
        cmdLineSettingsJson.dependencies = false ;
        cmdLineSettingsJson.scripting = false;
        if("BP" in cmdLineSettingsJson) delete cmdLineSettingsJson.BP
    }
    //user can set to true/false, otherwise assume true if both
    if(!("dependencies" in cmdLineSettingsJson)) cmdLineSettingsJson.dependencies = true;
    //Reasons to cancel/deny
    if(cmdLineSettingsJson.dependencies){
        //later, be able to go get the UUID from those manifest... 
        cmdLineSettingsJson.dependencies = !fs.existsSync("BP/manifest.json") && !fs.existsSync("RP/manifest.json")
        if(!cmdLineSettingsJson.dependencies) Debug.warn("==> Cannot do dependencies if you make your own manifest.json!")
    }
    console.log("==> Dependencies:",cmdLineSettingsJson.dependencies ? "Verified" : "None")
    
    //------------------------------------------------------------------------------------------
    //default to true since it will not override user provided UUIDs, user must specify false to exclude
    cmdLineSettingsJson.getUUIDs =  !!cmdLineSettingsJson.getUUIDs
    //------------------------------------------------------------------------------------------
    if (!cmdLineSettingsJson.rp_only) cmdLineSettingsJson.isScriptingFiles = fs.existsSync("BP/scripts")     
    if (cmdLineSettingsJson.isScriptingFiles) cmdLineSettingsJson.isScriptingFiles = containFilesWithExt("BP/scripts","js");
    if (!cmdLineSettingsJson.rp_only) console.log("==> Scripting Files:",cmdLineSettingsJson.isScriptingFiles ? "Found" : "None")
    //------------------------------------------------------------------------------------------
    cmdLineSettingsJson.author = cmdLineSettingsJson.author || getConfigFileAuthor() || "Add Author Name Here";        
    //------------------------------------------------------------------------------------------
    if (!("BP" in cmdLineSettingsJson)) { cmdLineSettingsJson.BP = {} };
    if (!("RP" in cmdLineSettingsJson)) { cmdLineSettingsJson.RP = {} }; 
    cmdLineSettingsJson.BP.type = "BP"
    cmdLineSettingsJson.RP.type = "RP"    
} //end of masterDefaultSettings
//================================================================================================
function ApplyDefaultSettings(pSettings) {
    debug.color("functionStart","* ApplyDefaultSettings("+pSettings.type+")")

    let p = pSettings.type;
    const d = new Date();
    //@ts-ignore
    const dayOfYear = date => Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const julianBuildDateTime = d.getFullYear().toString() + '.' + dayOfYear(d).toString().padStart(3, "0") + '.' + d.getHours().toString().padStart(2, "0") + '.' + d.getMinutes().toString().padStart(2, "0");

    pSettings.name = pSettings.name || cmdLineSettingsJson.name + " " + p || "My UnNamed Pack " + p
    pSettings.description = pSettings.description || cmdLineSettingsJson.description + " " + p || "This " + p + " pack does amazing things"
    pSettings.description = pSettings.description + "\nBuild Date: " + julianBuildDateTime
    pSettings.version = pSettings.version || cmdLineSettingsJson.version ||  [d.getFullYear() - 2000, d.getMonth() + 1, d.getDate()]
    pSettings.min_engine_version = pSettings.min_engine_version || cmdLineSettingsJson.min_engine_version || "get"
    pSettings.UUID = pSettings.UUID || cmdLineSettingsJson.getUUIDs ? "get" : "<Insert " + p + " UUID Here>"
    pSettings.module = pSettings.UUID || cmdLineSettingsJson.getUUIDs ? "get" : "<Insert " + p + " module UUID Here>"

    //Now every setting needed should exist
    //Update UUIDs - since user can use "get" have to do it here
    if (pSettings.UUID == "get") { 
        console.log("==>",pSettings.type,"New UUID")
        pSettings.UUID = newUUID() 
    }
    if (pSettings.module == "get") { 
        console.log("==>",pSettings.type,"New Module UUID")
        pSettings.module = newUUID() 
    }
    if(pSettings.min_engine_version.startsWith("get")) {
        if (!scriptingModuleList.includes("@minecraft/server")) scriptingModuleList.push("@minecraft/server")
    }
    debug.mute("x ApplyDefaultSettings()")
}//end of ApplyDefaultSettings
//=============================================================================================
function ApplyScriptingSettings(pSettings) {   
    debug.color("functionStart","* ApplyScriptingSettings("+pSettings.type+")") 
    let mcPrefix = "@minecraft/"

    //Verification of files already done
    //-----------------------------------------------------------
    if (!('scripting' in pSettings)) { pSettings.scripting = {}; }

    if (typeof pSettings.scripting === 'boolean') {
        if(pSettings.scripting)  pSettings.scripting = {};
        else {
            cmdLineSettingsJson.isScriptingFiles = false;
            delete pSettings.scripting;
            return;
        }
    }  
    if (typeof pSettings.scripting === 'string') {
        let stringValue = pSettings.scripting

        if(["default","all"].includes(stringValue))  {
            pSettings.scripting = {}
            pSettings.scripting.modules = stringValue;
        }
        else
        if(stringValue.includes("server"))  {
            pSettings.scripting = {}
            pSettings.scripting.modules = [...stringValue];
            debug.log( pSettings.scripting.modules)
        }
        else
        if(stringValue.includes(".js"))  {
            pSettings.scripting = {}
            pSettings.scripting.entry = stringValue;
        }
        else {
            Debug.error("xx> Error: Invalid string for BP.scripting, skipping scripting.","User Value: "+stringValue)
            cmdLineSettingsJson.isScriptingFiles = false;
            delete pSettings.scripting;
            return;
        }
    }  
    else
    if(Array.isArray(pSettings.scripting)){
        const array = [...pSettings.scripting]
        pSettings.scripting = {}
        pSettings.scripting.modules = Object.assign({},array)
    }
    else
    if (typeof pSettings.scripting != 'object') {
        Debug.error("xx> Error: Invalid Value Type: BP.scripting","Value: "+pSettings.scripting)
        cmdLineSettingsJson.isScriptingFiles = false;
        delete pSettings.scripting;
        return
    }
    //-----------------------------------------------------------
    const scriptSettings = pSettings.scripting;
    //-----------------------------------------------------------
    let defaultList = {
        uuid:"get",
        entry:fs.existsSync("BP/scripts/index.js") ? "scripts/index.js" : fs.existsSync("BP/scripts/main.js") ? "scripts/main.js" : false  
    }

    for (const property in defaultList){
        if (!(property in scriptSettings)) scriptSettings[property] = defaultList[property]
        else        
        if(!scriptSettings[property]) scriptSettings[property] = defaultList[property]
    }

    if (scriptSettings.uuid == "get") { 
        console.log("==> New Script UUID")
        scriptSettings.uuid = newUUID() 
    }
    //----------------------------------------------------------- 
    if(!("modules" in scriptSettings)) scriptSettings.modules = "default"  

    if (typeof scriptSettings.modules === "boolean") scriptSettings.modules = "default"  //later false cancels     
    else
    if (typeof scriptSettings.modules === "number") scriptSettings.modules = "default"         
    //----------------------------------------------------------- 
    
    if (typeof scriptSettings.modules == "string") {
        let stringValue = scriptSettings.modules;

        if (stringValue == "default")
            scriptSettings.modules = ["@minecraft/server","@minecraft/server-ui"]
        else
        if (stringValue == "all")
            scriptSettings.modules = ["@minecraft/server","@minecraft/server-ui"]
        else
        if (stringValue == "stable")
            scriptSettings.modules = ["@minecraft/server","@minecraft/server-ui"]
        else
        if (stringValue.includes("server")) {           
            let servers = stringValue.split(",");
            scriptSettings.modules = []
            for (let server of servers) 
                scriptSettings.modules.push({module: server,version : "get"})
        }
        else {
            Debug.error("Invalid Value Type: BP.scripting.modules",stringValue )
            cmdLineSettingsJson.isScriptingFiles = false;
            delete pSettings.scripting;
            return 
        }
    }
    // Reminder: modules is supposed to be an array of objects {module: "server",version : "x-x-x"}
    if (Array.isArray(scriptSettings.modules)){        

        if(isArrayOfMixedTypes(scriptSettings.modules)) {
            //TODO: later see if can deal with this... if string and objects only
            Debug.error("BP.scripting.modules array is of mixed types","Cannot create scripting information",scriptSettings.modules)
            cmdLineSettingsJson.isScriptingFiles = false;
            delete pSettings.scripting;
            return
        }
        else
        if(isArrayOfStrings(scriptSettings.modules)) {
            let modules = [...scriptSettings.modules];
            //TODO: should dedupe and fix words if wrong
            scriptSettings.modules = [];
            modules.forEach(server => scriptSettings.modules.push({module: server,version : "get"}))
        }
        else
        if(!isArrayOfObjects(scriptSettings.modules)) {
            //TODO: later see if can deal with this... if string and objects only
            Debug.error(" BP.scripting.modules s/b array of objects","Cannot create scripting information",scriptSettings.modules)
            cmdLineSettingsJson.isScriptingFiles = false;
            delete pSettings.scripting;
            return
        }
    }
    else
    if (typeof scriptSettings.module == "object"){
        let tempModule = Object.assign({},scriptSettings.modules);
        scriptSettings.modules = [];
        scriptSettings.modules.push(tempModule)
    }
    else {
        Debug.error("BP.scripting.modules s/b array of objects","Cannot create scripting information",scriptSettings.modules)
        cmdLineSettingsJson.isScriptingFiles = false;
        delete pSettings.scripting;
        return
    }
    //---------------------------
    // Validate Array of Objects
    //---------------------------
    for (let mod of scriptSettings.modules) {
        if(!("version" in mod)) mod.version = "get";
        if(!("module" in mod) && "server" in mod) {
            mod.module = mod.server;
            delete mod.version;
        }
        //TODO: also verify typeofs
        if(!("module" in mod)) {
            Debug.error("BP.scripting.modules[] is missing member module","Cannot create scripting information",mod)
            cmdLineSettingsJson.isScriptingFiles = false;
            delete pSettings.scripting;
            return
        }
        //confirm and/or fix - valid servers
        let allowedServerList = ["@minecraft/server","@minecraft/server-ui"]

        if (!allowedServerList.includes(mod.module)) {
            
            if (allowedServerList.includes("@minecraft/" + mod.module)) {
                mod.module = "@minecraft/" + mod.module;      
                mod.valid = true;
            }      
            else
            if (allowedServerList.includes("@minecraft" + +mod.module)) {
                mod.module = "@minecraft" + mod.module;
                mod.valid = true;
            } 
            else
            if (allowedServerList.includes('@'+mod.module)) {
                mod.module = "@" + mod.module;
                mod.valid = true;
            } 
            else            
            {
                Debug.error("Invalid Scripting Module",mod.module)
                mod.valid = false;
            }
        } 
        else mod.valid = true;       
    } // end for loop
        
    //TODO: Dedupe 

    //Add to fetch list
    for (let mod of scriptSettings.modules){
        if (!scriptingModuleList.includes(mod.module)) scriptingModuleList.push(mod.module);
    }
    debug.mute("x ApplyScriptingSettings")
} //end of ApplyScriptingSettings
//=============================================================================================
function buildManifest(pSettings) {
    debug.color("functionStart","* buildManifest("+pSettings.type+")")  

    let p = pSettings.type;
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
                //"description": "_",
                "uuid": `${pSettings.module}`,
                "version": [1, 0, 0]
            }
        ]
    }
    
    if (pSettings.scripting) {
        //@ts-ignore
        let addMod = {
            "type": "script",
            "language":"javascript",
            "uuid": `${pSettings.script_uuid}`, // note this should be one time, if using dynamic properties
            "version": [1, 0, 0],
            "entry": `${pSettings.script_entry}`,
        }
        manifest.modules.push(addMod);
        manifest.capabilities = ["script_eval"];
    }

    if ("depUUID" in pSettings) {
        manifest.dependencies = [{
            "uuid": `${pSettings.depUUID}`,
            "version": pSettings.depVersion
        }]
    }

    if ("scripting_module_name" in pSettings) {
        if (!(manifest.dependencies)) manifest.dependencies = [];  
        manifest.dependencies.push(
            {
                "module_name": `${pSettings.scripting_module_name}`,
                "version": `${pSettings.scripting_version}`
            }
        )
    }

    manifest.metadata = {
        "authors": [pSettings.author || cmdLineSettingsJson.author],
        "generated_with": {
            "regolith_filter_mani_fest": ["24.5.12"]
        }
    }

    fs.writeFileSync(p + "/manifest.json", JSON.stringify(manifest, null, 4));
    Debug.success("==> "+pSettings.type+" manifest.json exported")
    debug.mute("x buildManifest")
} //end of buildManifest
//=======================================================================
function manifests(fromFetch = false){    
    debug.color("functionStart","* Start manifests( fromFetch = "+fromFetch+")")    
    
    /**
     * This is the last main function called.
     * It is either called by main 
     *      or manifestRedirect (because there was an async fetch needed) 
     **/    

    if (!cmdLineSettingsJson.bp_only) buildManifest(cmdLineSettingsJson.RP);    
    if (!cmdLineSettingsJson.rp_only) buildManifest(cmdLineSettingsJson.BP);    

    if(fromFetch) mainAfterFetch() // because of possible async fetch.then

    debug.mute("x manifests()")   
}
//=======================================================================
function manifestRedirect(){
    debug.color("functionStart","* Start manifestRedirect()")    

    const bpSettings = cmdLineSettingsJson.BP;
    const rpSettings = cmdLineSettingsJson.RP;

    if (bpSettings.min_engine_version.startsWith("get") || rpSettings.min_engine_version.startsWith("get")) {

        const versions = minecraftScrapeData.versions        
        const keys = []

        for (let key in versions) {
            if(key.endsWith("stable")) {
                keys.push(key.substring(key.indexOf("beta")+5));                        
            }
        }
        //[x,x,x]
        const orderedKeys = keys.map(v => v.substring(0,v.length-7)).reverse()        

        const settingsList = [bpSettings,rpSettings].filter(json => json.min_engine_version.startsWith("get"))
        for(let json of settingsList) {
            let verNum = 0
            
            if (json.min_engine_version.startsWith("get-")) {
                verNum = json.min_engine_version.replace("get-","")
                if(!isNaN(verNum)){
                    verNum = Number(verNum)
                }
                else {
                    verNum = 0                    
                    Debug.warn("Invalid get-# for stable version","using latest instead",json.type,json.min_engine_version.substring(0,4))
                }
                
                if (verNum >= orderedKeys.length){
                    verNum = orderedKeys.length - 1
                    Debug.warn("get-# exceeds number of stable versions","Using last instead",json.type,json.min_engine_version)
                }
            }
            
            let versionSelected = orderedKeys[verNum].split(".").map(v => Number(v))            
            //console.log(versionSelected)
            json.min_engine_version = versionSelected

            console.log("==>",json.type,"min_engine_version =",json.min_engine_version)
        }        
    }

    if(bpSettings.scripting && bpSettings.scripting_version.startsWith("get")){
        let latest = minecraftScrapeData["dist-tags"].latest
        
        if(bpSettings.scripting_version.startsWith("get-")) {            
            let verNum = bpSettings.scripting_version.replace("get-","");
            let ErrMsg = "";
            //console.log(verNum,Number.isInteger(Number(verNum)),Number.isInteger(1))
            if(!isNaN(verNum)){   
                if(Number.isInteger(verNum)){                    
                    verNum = Number(verNum);  
                    if(verNum > 0) {

                        const array = latest.split(".").map(v => Number(v));
                        let middleNum = array[1] -  verNum;
        
                        if(middleNum >= 1 || middleNum <= array[1]){
                            array[1] = middleNum
                            latest = array.reduce((t,v) => t+"."+v) 
                        }
                        else ErrMsg = "Invalid get-# is out of range for scripting version (between 1 and latest), using latest instead"  
                    }
                    //else zero - do nothing
                }
                else ErrMsg = "Invalid get-# for scripting version (! int), using latest instead";
            }
            else ErrMsg = "Invalid get-# for scripting version (NaN), using latest instead";
            

            if(ErrMsg.length > 0)
                Debug.warn(ErrMsg,bpSettings.type,bpSettings.scripting_version)
        }

        bpSettings.scripting_version = latest;

        // add later, if get-#, to subtract from the middle #.#.#

        console.log("==>",bpSettings.type,"scripting",bpSettings.scripting_version_mod,"version =",bpSettings.scripting_version);
    }

    manifests(true);

    debug.mute("x manifestRedirect()")  
}
//=======================================================================
function minecraft_scrape(){
    debug.color("functionStart","* Start minecraft_scrape()")
    /**
     * server, server-ui   NO common
     * 
     * Umm, BDS and Beta is a different story...will figure out later
     * Note - dependencies in some of the BDS ones
     * 
     * Thanks Hatchi !!!
     */
    scrapeServer = "@minecraft/" + (cmdLineSettingsJson.BP.scripting_version_mod || "server")
    let site = "https://registry.npmjs.org/" + scrapeServer

    console.log("==> scraping site:",site)

    fetch(site)
        .then(response => {    
            if (!response.ok) {throw new Error('Network response was not ok');}    
            return response.json();
        })
        .then(data => {
            Debug.success("==> Data Retrieved")    
            minecraftScrapeData = data;                        
            manifestRedirect();
        })       
        .catch(error => {
            console.error('Fetch error:', error);
        });

    debug.mute("x Out-Of-Sync minecraft_scrape()")
}
//=======================================================================
function jsonParseRemovingComments(text){
    let debugMe = new Debug(false);
    debugMe.underline("* jsonParseRemovingComments()")
    //text is a string, not JSON.. which obviously does not need this function
    let dataString = text;

    //1) Remove all /* */    
    while (dataString.indexOf("/*") >= 0){

        let ptrStart = dataString.indexOf("/*");
        let front = ptrStart <= 0 ? "" : dataString.substring(0,ptrStart-1);

        let back = dataString.substring(ptrStart+2);
        let ptrEnd = back.indexOf("*/");

        if (ptrEnd == -1)
            dataString = front;
        else {
            back = back.substring(ptrEnd+2);
            dataString = front + back;
        }
    }
    // remove //->end of line  ??  char(10 and 13)  ?? or just one or either

    let dataJson;
    let more;
    do {
        more = false;
        try {
            dataJson = JSON.parse(dataString);;
        } catch (err) {
            more = true;
            debugMe.error("err.name: "+err.name,err.message)
            let errTrapArray = [
                "Expected double-quoted property name in JSON at position ",
                "Expected property name or '}' in JSON at position "
            ]
            let errTrap="xxxxx";
            for(let i = 0; i < errTrapArray.length; i++) {
                if(err.message.startsWith(errTrapArray[i])) {
                    errTrap = errTrapArray[i]
                    break
                };
            }

            if (err.message.startsWith(errTrap)) {
                let ptr = parseInt(err.message.substring(errTrap.length))
    
                let front = dataString.substring(0,ptr-1)
                let back = dataString.substring(ptr)
                let ptrEOL = back.indexOf("\n");

                if(ptrEOL >= 0){
                    back = back.substring(ptrEOL+1);
                    dataString = front + back;
                }
                else {
                    dataString = front;
                }                
            }
            else {
                Debug.error("JSON Parse Error Not Configured");
                Debug.error(err.message);
                debugMe.error("x jsonParseRemovingComments()")
                return null;
            }
        }
    }
    while(more);

    debugMe.success("x jsonParseRemovingComments()")
    return dataJson
}
//=======================================================================
function getConfigFileAuthor(){
    let debugMe = new Debug(false);
    debugMe.underline("* getConfigFileAuthor()")
    /*
        Known, this filter is either under 
            ./.regolith or
            ./filters
        of the mail project folder
    */
    let path_1 = "\\.regolith\\cache\\filters\\"
    let path_2 = "\\filters\\"
    let ptr = (argPath.lastIndexOf(path_1) > 0 ? argPath.lastIndexOf(path_1) : argPath.lastIndexOf(path_2)) + 1;

    if (!ptr) {
        Debug.warn("Error: Cannot find path to config.sys to get author, skipping");
        debugMe.error("x getConfigFileAuthor()")
        return null;
    }

    let configPathFilename = argPath.substring(0,ptr) + "config.json";
    let configData;
    try {
        const data = fs.readFileSync(configPathFilename, 'utf8');
        configData = data;
    } catch (err) {
        Debug.warn("Error: Cannot read config.sys to get author, skipping");
        debugMe.warn("x getConfigFileAuthor()")
        return null;
    }

    if(!configData.search("\"author\"")) {
        Debug.warn("Error: Cannot find word author in config.sys to get author, skipping");
        debugMe.warn("x getConfigFileAuthor()")
        return null;
    }

    let configJson
    configJson = jsonParseRemovingComments(configData)
    if(!configJson) {
        Debug.warn("Error: Cannot parse config.sys to get author, skipping");
        debugMe.warn("x getConfigFileAuthor()")
        return null;
    }

    Debug.success("==> found author: "+configJson.author)
    debugMe.success("x getConfigFileAuthor()")

    return configJson.author;
}
//=======================================================================
function main(){    
    debug.color("functionStart","* main()")
debug.off()
    masterDefaultSettings();

    const bpSettings = cmdLineSettingsJson.BP;
    if (!cmdLineSettingsJson.rp_only) {
        bpSettings.ModuleType = "data";
        ApplyDefaultSettings(bpSettings);
        if(cmdLineSettingsJson.isScriptingFiles) ApplyScriptingSettings(bpSettings) 
    }

    const rpSettings = cmdLineSettingsJson.RP
    if (!cmdLineSettingsJson.bp_only) {
        rpSettings.ModuleType = "resources";
        ApplyDefaultSettings(rpSettings);
    }

    if (cmdLineSettingsJson.dependencies) {
        bpSettings.depUUID = rpSettings.UUID
        bpSettings.depVersion = rpSettings.version
        rpSettings.depUUID = bpSettings.UUID
        rpSettings.depVersion = bpSettings.version
    }
    /**
     * TODO:
     * if scriptingModuleList is not empty, 
     *      go fetch
     *      from there call next step to process modules
     *      above process will call 
     */
debug.on()
    if (scriptingModuleList.length) {
        debug.color("tableTitle","* List of Modules to Fetch")
        const siteList = scriptingModuleList.map(v => "https://registry.npmjs.org/" + v)
        myFetch = new McModuleFetchStack(siteList);
        
        //TODO: add readable property to debug to show if on or not, can use to turn on and off stuff
        //like below
        myFetch.debugOn = true;
        myFetch.consoleLogFetchList();
        myFetch.fetchesStart();

        debug.highlight("x fake end of main() due to scripting module fetches")
    }
    else {
        mainAfterFetch();
        debug.success("x main()");
    }
     
    //debug.colorsList()   
}
//=======================================================================
function mainAfterFetch(){
    debug.color("functionStart","* mainAfterFetch()")

    myFetch.consoleLogPromiseList();
    //myFetch.consoleLogPromiseKeys();

    for(let obj of myFetch.promiseStack){
        //console.log(obj.data['dist-tags']);
        obj.moduleVersion = {
            latest: obj.data['dist-tags']['latest'],
            beta: obj.data['dist-tags']['beta'],
            preview: obj.data['dist-tags']['preview']
        }
        obj.stableEngines = Object.keys(obj.data.versions)
            .filter(v => v.endsWith('stable'))
            .map(v => v.substring(v.indexOf("-beta.")+6).replace("-stable",""))
            .sort()
            .reverse();
        obj.betaVersions = Object.keys(obj.data.versions)
            .filter(v => !v.includes('stable') && v.includes('beta') && v.includes('preview') && !v.includes('beta.preview'))
            .map(v => v.substring(v.indexOf("-beta.")+6).replace("-preview",""))
            .sort()
            .reverse();

        //console.table([obj.site,obj.moduleVersion])
        Debug.highlight(obj.site)
        Object.entries(obj.moduleVersion).forEach((value,key) => Debug.color("list",key+": "+value))
        console.table(obj.stableEngines)
        //TODO: decipher later for beta versions
        console.table(obj.betaVersions)
        console.table(Object.keys(obj.data.versions).filter(v => v.includes("preview")))
    }
    
   
    // if (isDebug) {
        // if (!cmdLineSettingsJson.rp_only) fs.writeFileSync("BP/debug.bpSettings.json", JSON.stringify(cmdLineSettingsJson.BP));
        // if (!cmdLineSettingsJson.bp_only) fs.writeFileSync("RP/debug.rpSettings.json", JSON.stringify(cmdLineSettingsJson.RP));

        // if (cmdLineSettingsJson.bp_only || !cmdLineSettingsJson.rp_only) fs.writeFileSync("BP/debug.ConfigSettings.json", JSON.stringify(cmdLineSettingsJson));
        // else
        // if (cmdLineSettingsJson.rp_only) fs.writeFileSync("RP/debug.ConfigSettings.json", JSON.stringify(cmdLineSettingsJson));

        // Debug.success("* Debug Files Exported");
    // }

    Debug.success("x mainAfterFetch()")
}
// End of Main   
//============================================================================
main();
//Go Home, the show is over