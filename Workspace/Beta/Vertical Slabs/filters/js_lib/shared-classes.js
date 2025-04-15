//@ts-check
/*
=====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
*/
const fs = require("fs");

//=====================================================================
/*
Information:
    Author:     DrinkWater623/PinkSalt623
    Contact:    Discord/GitHub @DrinkWater623

Change Log:
    
*/
//=====================================================================
class is {

    static boolean (candidate) { return typeof candidate === "boolean"; }
    static function (candidate) { return typeof candidate === "function"; }
    static null (candidate) { return Object.is(candidate, null); }
    static number (candidate) { return typeof candidate === "number" || typeof candidate === "bigint"; }
    static objectObject (candidate) { return candidate && typeof candidate === "object" && is.notArray(candidate); }
    static object (candidate) { return typeof candidate === "object"; }
    static string (candidate) { return typeof candidate === "string"; }
    static symbol (candidate) { return typeof candidate === "symbol"; }
    static undefined (candidate) { return typeof candidate === "undefined"; }
    
    //---------------------------------------------------------------------------
    /**
     * 
     * @param {*} candidate 
     * @returns boolean
     */
    static array (candidate) { return Array.isArray(candidate); }
    /**
     * 
     * @param {*[]} array 
     * @returns boolean
     */
    static arrayOfStrings(array){
        if (Array.isArray(array))
            return array.every((item) => typeof item === "string");    
        return false;
    }
    /**
     * 
     * @param {*[]} array 
     * @returns boolean
     */
    static arrayOfSameTypes(array){
        if (!Array.isArray(array)) return false;
        if (array.length < 2) return true;
        return array.every((item) => typeof item === typeof array[ 0 ]);       
    }
    /**
     * 
     * @param {*[]} array 
     * @returns boolean
     */
    static arrayOfMixedTypes(array) {
        if (!Array.isArray(array)) return false;
        return !is.arrayOfSameTypes(array)
    }
    //---------------------------------------------------------------------------
    /**
     * 
     * @param {string} path 
     * @returns boolean
     */
    static emptyFolder (path) { 
        if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) return !fs.readdirSync(path).length; 
        return true; 
    }
    /**
     * 
     * @param {string} path 
     * @returns boolean
     */
    static file (path) { 
        if (!fs.existsSync(path)) return false; 
        return fs.lstatSync(path).isFile(); 
    }
    /**
     * 
     * @param {string} path 
     * @returns boolean
     */
    static folder (path) { 
        if (!fs.existsSync(path)) return false; 
        return fs.lstatSync(path).isDirectory(); 
    }
    //---------------------------------------------------------------------------
    static notArray (candidate) { return !Array.isArray(candidate); }
    static notBoolean (candidate) { return typeof candidate !== "boolean"; }
    static notFunction (candidate) { return typeof candidate !== "function"; }
    static notNull (candidate) { return !Object.is(candidate, null); }
    static notNumber (candidate) { return typeof candidate !== "number" && typeof candidate !== "bigint"; }
    static notObject (candidate) { return typeof candidate !== "object"; }
    static notString (candidate) { return typeof candidate !== "string"; }
    static notSymbol (candidate) { return typeof candidate !== "symbol"; }
    static notUndefined (candidate) { return typeof candidate !== "undefined"; }
    //---------------------------------------------------------------------------
    static empty (object) {
        //false is not empty, 0 is not empty
        if (Object.is(object, undefined)) return true;
        if (Object.is(object, null)) return true;
        if (is.object(object)) return !!Object.keys(object).length;
        if (is.string(object)) return !!object.length;
        return false;
    }
    static notEmpty (object) {
        //false is not empty, 0 is not empty
        if (Object.is(object, undefined)) return false;
        if (Object.is(object, null)) return false;
        if (is.object(object)) return !Object.keys(object).length;
        if (is.string(object)) return !object.length;
        return true;
    }
    static exact (arg, compareArg) { return arg === compareArg; }
    static notExact (arg, compareArg) { return arg !== compareArg; }
    static equal (arg, compareArg) {
        if (arg == compareArg) return true;
        //if (arg == compareArg) return true;
        //dive deeper
        if (typeof arg !== typeof compareArg) return false;
        if (is.array(arg) !== is.array(compareArg)) return false;

        //arrays
        if (is.array(arg)) {
            if (arg.length != compareArg.length) return false;

            //if either has some objects in the array
            if (arg.some(obj => typeof obj === "object")) return false; //for now
            if (compareArg.some(obj => typeof obj === "object")) return false; //for now

            //what about emptys
            for (let v of arg) if (!compareArg.includes(v)) return false;
            return true;
        }
        // objects - non arrays?   this is more complex - needs more testing and thought
        let argKeys = arg.keys();
        let compareArgKeys = compareArg.keys();
        if (argKeys.length !== compareArgKeys.length) return false;

        //TODO:  way more to compare see the lib tests on objects/maps/?sets
        //trying to get down to if the values are the same, regardless of how stored
        return false;
    }
    static notEqual (arg, compareArg) { return !is.equal(arg, compareArg); }
}
exports.is = is;
class has {
    static key (object = {}, keyName = "") {
        return (typeof object === "object") && Object.hasOwn(object, keyName);
    }
    static keyValue (object = [ {} ], keyName = "", value) {
        if (typeof object !== 'object') return false;
        if (typeof value === 'object') return has.keyValues(object, keyName, value);

        if (!Array.isArray(object)) {
            return Object.hasOwn(object, keyName) && object[ keyName ] === value;
        }
        //Array, so check each object of array until found
        const objList = object
            .filter(obj => typeof obj === 'object')
            .filter(obj => Object.hasOwn(obj, keyName))
            .filter(obj => typeof obj[ keyName ] !== 'object')
            .filter(obj => obj[ keyName ] === value);

        return !!objList.length;
    }
    //TODO:  keyValues NOT DONE - need to .....
    static keyValues (object = [], keyName = "", compareObject = {}) {
        if (typeof object !== 'object') return false;
        if (typeof compareObject !== 'object') return has.keyValue(object, keyName, compareObject);

        if (!Array.isArray(object)) {
            return Object.hasOwn(object, keyName) && object[ keyName ] === compareObject;
        }

        //Array, so check each object of array until found
        const objList = object
            .filter(obj => typeof obj === 'object')
            .filter(obj => Object.hasOwn(obj, keyName))
            .map(obj => obj[ keyName ]);

        if (objList.length == 0) return false;
    }
    static values (object = {}) {
        //false is not empty, 0 is not empty
        if (Object.is(object, undefined)) return true;
        if (Object.is(object, null)) return true;
        if (is.object(object)) return !!Object.keys(object).length;
        if (is.string(object)) return !!object.length;
        return false;
    }
}
exports.has = has;
