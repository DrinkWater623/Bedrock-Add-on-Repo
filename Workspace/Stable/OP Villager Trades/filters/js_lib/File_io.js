//@ts-check
/*
=====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Change Log:
    20250414: fix treeGet's onlyExt
*/
const fs = require("fs");
const fileInfo = require('path');
const { is, has } = require("./shared-classes.js");
const { Debug } = require("./Debug.js");
//=====================================================================
const fg_Error = '\x1b[91m%s';
const fg_Success = '\x1b[92m%s';
const fg_Warning = '\x1b[91m%s';
//=====================================================================
/**
 * 
 * @param {string} filePath 
 */
function getFileCreationDate (filePath) {
    try {
        const stats = fs.statSync(filePath);
        return stats.ctime
    } catch (err) {
        console.error(err);
        return undefined
    }    
}
exports.getFileCreationDate = getFileCreationDate;
/**
 * 
 * @param {string} path 
 * @param {string} ext 
 * @returns 
 */
function containFilesWithExt (path, ext) {
    if (is.emptyFolder(path)) return false;
    return fs.readdirSync(path).filter(f => f.endsWith("." + ext)).length > 0 ? true : false;
}
exports.containFilesWithExt = containFilesWithExt;
/**
 * 
 * @param {string} path 
 * @param {number} minFileSize 
 * @param {string} onlyExt 
 * @param {boolean} debug 
 * @returns  {object[]}
 */
function fileTreeGet (path, minFileSize = 0, onlyExt = "", debug = false) {
    return treeGet(path, minFileSize, false, true, onlyExt, debug);
}
exports.fileTreeGet = fileTreeGet;
/**
 * 
 * @param {string}  path 
 * @param {number}  minObjSize 
 * @param {string}  onlyExt 
 * @param {boolean} debug 
 * @returns {object[]}
 */
function folderTreeGet (path, minObjSize = 0, onlyExt = "", debug = false) {
    return treeGet(path, minObjSize, true, false, onlyExt, debug);
}
exports.folderTreeGet = folderTreeGet;
/**
 * 
 * @param {string} path 
 * @param {number} minSize 
 * @param {boolean} folders 
 * @param {boolean} files 
 * @param {string} onlyExt 
 * @param {boolean} debug 
 * @returns  {object[]}
 */
function treeGet (path, minSize = 0, folders = true, files = true, onlyExt = "", debug = false) {

    //TODO:add pattern for folder and for path separately
    if (debug) Debug.log("==> treeGet(" + path + "," + minSize + "," + folders + "," + files + "," + onlyExt + ")");
    let returnList = [];

    if (!folders && !files) return [];

    try {
        fs.readdirSync(path);
    }
    catch {
        console.log(fg_Warning, "xx> Error: Folder =", path, "Does Not Exist, Skipping");
        return [];
    }
    const tempFileList = fs.readdirSync(path);

    for (let f of tempFileList) {
        const fullFileName = (path + '/' + f).replace('//', '/');

        let treeObj =
        {
            fileName: fullFileName,
            parse: fileInfo.parse(fullFileName),
            isFile: !is.folder(fullFileName),
            size: 0,
            date: getFileCreationDate(fullFileName),
            keep: false
        };
        
        if (files && treeObj.isFile) {
            treeObj.size = fs.readFileSync(fullFileName).length;
            treeObj.keep = files && treeObj.size >= minSize && (onlyExt.length == 0 || treeObj.parse.ext == onlyExt);
        }
        else if (!treeObj.isFile) {
            const newSearch = treeGet(fullFileName, minSize, folders, files, onlyExt);
            treeObj.size = newSearch.length;
            for (let i in newSearch) returnList.push(newSearch[ i ]);

            treeObj.keep = folders && treeObj.size >= minSize && (onlyExt.length == 0 || treeObj.parse.ext == onlyExt);
        }

        if (treeObj.keep) returnList.push(treeObj);
    }

    if (debug) Debug.mute("<== treeGet");
    return returnList.filter(obj => obj.keep);
}