//@ts-check
//=====================================================================
const fs = require("fs");
const fileInfo = require('path');
const { is, has } = require("./shared-classes.js");
const { Debug } = require("./Debug.js");
//=====================================================================
const fg_Error = '\x1b[91m%s';
const fg_Success = '\x1b[92m%s';
const fg_Warning = '\x1b[91m%s';
//=====================================================================
function containFilesWithExt (path, ext) {
    if (is.emptyFolder(path)) return false;
    return fs.readdirSync(path).filter(f => f.endsWith("." + ext)).length > 0 ? true : false;
}
exports.containFilesWithExt = containFilesWithExt

function fileTreeGet (path, minFileSize = 0, onlyExt = "", debug = false) {
    return treeGet(path, minFileSize, false, true, onlyExt, debug);
}
exports.fileTreeGet = fileTreeGet

function folderTreeGet (path, minObjSize = 0, onlyExt = "", debug = false) {
    return treeGet(path, minObjSize, true, false, onlyExt, debug);
}
exports.folderTreeGet = folderTreeGet

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
            keep: false
        };

        if (files && treeObj.isFile) {
            treeObj.size = fs.readFileSync(fullFileName).length;
            treeObj.keep = files && treeObj.size >= minSize || (onlyExt.length == 0 || treeObj.parse.ext == onlyExt);
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