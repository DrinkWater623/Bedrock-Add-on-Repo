//@ts-check
/*
=====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
*/
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
    20240811 - NAA - Created Basics - will figure out info for sub-packs and scripts later

*/
//=====================================================================
//                              Classes
//=====================================================================
class Debug {
    constructor(booleanValue = true) {
        this.debugOn = booleanValue;
    }
    //--------------------------------------      
    colorsAdded = new Map(
        [
            [ "userExample", 44 ]
        ]
    );
    #colorDefaultAssignments = new Map(
        [
            [ "bold", 97 ],
            [ "error", 91 ],
            [ "highlight", 100 ],
            [ "log", 95 ],
            [ "mute", 90 ],
            [ "success", 92 ],
            [ "tableTitle", 100 ],
            [ "underline", 52 ],
            [ "warn", 103 ]
        ]
    );
    #colorMap = new Map(
        [
            [ "red", 91 ],
            [ "yellow", 93 ],
            [ "green", 92 ],
            [ "blue", 94 ],
            [ "magenta", 95 ],
            [ "cyan", 96 ],
            [ "white", 97 ],
            [ "gray", 90 ],
            [ "black-bg", 40 ],
            [ "red-bg", 41 ],
            [ "yellow-bg", 103 ],
            [ "green-bg", 102 ],
            [ "blue-bg", 104 ],
            [ "magenta-bg", 105 ],
            [ "cyan-bg", 106 ],
            [ "white-bg", 107 ],
            [ "gray-bg", 100 ]
        ]
    );
    #colorReset = '\x1b[0m';
    //--------------------------------------
    off () { this.debugOn = false; this.color("red-bg", this.constructor.name + " OFF"); }
    on () { this.debugOn = true; this.color("green-bg", this.constructor.name + " On"); }
    toggle () { if (this.debugOn) this.off(); else this.on(); }
    isDebug () { return this.debugOn; }
    //--------------------------------------    
    color (colorPtr, arg1, ...argRest) {
        if (this.debugOn && arg1)
            this.#log(colorPtr, arg1, argRest);
    }
    bold (arg1, ...argRest) {
        if (this.debugOn && arg1)
            this.#log("bold", arg1, argRest);
    }
    error (arg1, ...argRest) {
        if (this.debugOn && arg1)
            this.#log("error", arg1, argRest);
    }
    highlight (arg1, ...argRest) {
        if (this.debugOn && arg1)
            this.#log("highlight", arg1, argRest);
    }
    log (arg1, ...argRest) {
        if (this.debugOn && arg1)
            this.#log("log", arg1, argRest);
    }
    mute (arg1, ...argRest) {
        if (this.debugOn && arg1)
            this.#log("mute", arg1, argRest);
    }
    success (arg1, ...argRest) {
        if (this.debugOn && arg1)
            this.#log("success", arg1, argRest);
    }
    table (title, data = [], columns = []) { if (this.debugOn && data.length) this.#table(title, data, columns); }
    underline (arg1, ...argRest) {
        if (this.debugOn && arg1)
            this.#log("underline", arg1, argRest);
    }
    warn (arg1, ...argRest) {
        if (this.debugOn && arg1)
            this.#log("warn", arg1, argRest);
    }
    colorsList () {
        if (this.colorsAdded.size > 0) {
            this.highlight("User Defined Colors (Overrides Defaults)");
            this.colorsAdded.forEach(
                (value, key) => {
                    let colorString = "\x1b[" + value + "m%s";
                    console.log(colorString, "User Defined Color:", key, value, this.#colorReset);
                }
            );
        }

        this.highlight("Default Assignments");
        this.#colorDefaultAssignments.forEach(
            (value, key) => {
                let colorString = "\x1b[" + value + "m%s";
                console.log(colorString, "Color Default Assignments:", key, value, this.#colorReset);
            }
        );

        this.highlight("Colors");
        this.#colorMap.forEach(
            (value, key) => {
                let colorString = "\x1b[" + value + "m%s";
                console.log(colorString, "Color:", key, value, this.#colorReset);
            }
        );
    }
    //--------------------------------------
    #colorNumberGet (color) {

        if (typeof color === "number") return color;

        else if (typeof color === "string") {
            //@ts-ignore
            if (this.colorsAdded.has(color)) return this.colorsAdded.get(color);

            //@ts-ignore
            else if (this.#colorDefaultAssignments.has(color)) return this.#colorDefaultAssignments.get(color);

            //@ts-ignore
            else if (this.#colorMap.has(color)) return this.#colorMap.get(color);

            //@ts-ignore
            else return this.#colorMap.get("gray-bg");
        }

        //@ts-ignore
        else return this.#colorMap.get("gray-bg");
    }
    #log (color, arg1, argsRest) {

        /**
         *   no argsRest and is Array use log-array
         *   same type.... use log-comma
         *   ar1 not array and argsRest is array, unArray i
         */
        if (argsRest === undefined) argsRest = [ "" ];

        if (typeof arg1 === 'undefined') { return; }
        else if (typeof arg1 === 'string') { if (!arg1) return; }
        else if (typeof arg1 === 'object') { if (Object.keys(arg1).length = 0) return; }
        //console.log(arg1)
        //console.log(argsRest)
        var [ arg2 = "", arg3 = "", arg4 = "", arg5 = "", arg6 = "", arg7 = "", arg8 = "", arg9 = "", arg10 = "", arg11 = "", arg12 = "", arg13 = "", arg14 = "", arg15 = "", arg16 = "" ] = argsRest;

        if (argsRest === undefined || argsRest.length === 0) {
            if (Array.isArray(arg1)) this.#log_array(color, arg1);
            else this.#log_comma(color, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg15, arg16);
            return;
        }

        //TODO: if all is array of strings over 15, then concatenate and send
        if (Array.isArray(argsRest) && argsRest.length > 15) {
            //@ts-ignore
            this.#log_comma(color, arg1, argsRest, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg15, arg16);
            return;
        }

        //What is left should be out of array if under 9 elements
        this.#log_comma(color, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg15, arg16);
        return;
    }
    #log_comma (color, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg15, arg16) {
        let isWarning = false;
        let isError = false;
        let colorNumber = this.#colorNumberGet(color);

        if (typeof color === "string") {
            isError = (color === "error");
            isWarning = (color === "warn");
        }

        let colorString = "\x1b[" + colorNumber + "m%s";

        if (isWarning) console.warn(colorString, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg15, arg16, this.#colorReset);
        else if (isError) console.error(colorString, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg15, arg16, this.#colorReset);
        else console.log(colorString, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg15, arg16, this.#colorReset);
    }

    #log_array (color, args = []) {

        if (typeof args === "undefined" || args.length === 0) return;

        if (!Array.isArray(args)) {
            this.#log_comma(color, args);
            return;
        }

        let isWarning = false;
        let isError = false;
        let isSuccess = false;
        let colorNumber = this.#colorNumberGet(color);

        if (typeof color === "string") {
            isError = (color === "error");
            isWarning = (color === "warn");
            isSuccess = (color === "success");
        }

        let colorString = "\x1b[" + colorNumber + "m";

        for (let obj of args) {
            let colorStr = colorString;
            if ([ "boolean", "string" ].includes(typeof obj)) colorStr += '%s';
            else if ([ "bigint", "number" ].includes(typeof obj)) colorStr += '%i';
            else if (typeof obj === "object") colorStr += '%o';

            if (isWarning) console.warn(colorStr, obj, this.#colorReset);
            else if (isError) console.error(colorStr, obj, this.#colorReset);
            else console.log(colorStr, obj, this.#colorReset);
        }
    }
    //TODO: Find out if can add color in table by copying, adding color string and print that
    #table (title, data = [], columns = []) {
        if (typeof title === "string")
            this.#log("tableTitle", title);
        else console.table(title);

        //TODO: Fix for different ways being sent LATER
        //if (typeof data === "string")
        //    if(columns.length)
        //        if (typeof columns === "string")
        //            console.log(data,columns )
        //    else 
        //    else
        //        console.table(data,columns);
        //else console.table(title);
        if (columns.length == 0)
            console.table(data);

        else
            console.table(data, columns);
    }
    //------------------------------------------    
    static color (color, arg1, ...args) { let temp = new Debug(true); temp.color(color, arg1, args.length === 1 ? args[ 0 ] : args); }
    static error (arg1, ...args) { let temp = new Debug(true); temp.error(arg1, args.length === 1 ? args[ 0 ] : args); }
    static highlight (arg1, ...args) { let temp = new Debug(true); temp.highlight(arg1, args.length === 1 ? args[ 0 ] : args); }
    static log (arg1, ...args) { let temp = new Debug(true); temp.log(arg1, args.length === 1 ? args[ 0 ] : args); }
    static mute (arg1, ...args) { let temp = new Debug(true); temp.mute(arg1, args.length === 1 ? args[ 0 ] : args); }
    static table (title, data, columns) { let temp = new Debug(true); temp.table(title, data, columns); }
    static success (arg1, ...args) { let temp = new Debug(true); temp.success(arg1, args.length === 1 ? args[ 0 ] : args); }
    static warn (arg1, ...args) { let temp = new Debug(true); temp.warn(arg1, args.length === 1 ? args[ 0 ] : args); }
}
exports.Debug = Debug;
