// @ts-check
//=====================================================================
// Global variables - Part 1
//=====================================================================
const fs = require("fs");
//const fileInfo = require('path');
const { Debug } = require("./js_lib/Debug");
const { is, has } = require("./js_lib/shared-classes");
const fileIo = require("./js_lib/File_io.js");
//=====================================================================// Global variables - Part 1
//=====================================================================
var argPath = process.argv[ 1 ];
var argSettings = process.argv[ 2 ];
const cmdLineSettingsJson = JSON.parse(argSettings);
//=====================================================================
//Override set here... or in config
let isDebug = false;
let isDebugMax = true;
//=====================================================================
isDebug = isDebug || !!cmdLineSettingsJson.Debug;
isDebugMax = isDebugMax || !!cmdLineSettingsJson.DebugMax;
if (isDebugMax) isDebug = true;
//=====================================================================
// Console Logging
const debug = new Debug(isDebug);
debug.colorsAdded.set("functionStart", 96);
debug.colorsAdded.set("list", 36);
debug.colorsAdded.set("log", 40);
debug.debugOn = isDebug;
//=======================================================================
const debugMax = new Debug(isDebugMax);
debugMax.colorsAdded.set("log", 95);

//=======================================================================
const consoleColor = new Debug(true);
consoleColor.colorsAdded.set("highlight", 93);
consoleColor.colorsAdded.set("possibleWarn", 93);
consoleColor.colorsAdded.set("possibleError", 91);
//=======================================================================
//=======================================================================
let dataPath = './data/vanilla-data/';
const allowedFileList = [
    "blocks.json" //,
    // "mojang-blocks.json",
    // "mojang-items.json"
];
let beta = false;
const blocks = [];
const rawDataFileContent = [];
const outpath = cmdLineSettingsJson.outpath || `./data/jsonte/vanilla-data`;
let importFileList;
//=======================================================================

//=======================================================================
function readImportFiles () {
    beta = !!cmdLineSettingsJson.beta;
    const branch = cmdLineSettingsJson.branch || 'main';
    if (![ "main", "preview" ].includes(branch)) return false;

    //TODO: user path to the  files
    dataPath = dataPath + branch;
    const dataFiles = fileIo.fileTreeGet(dataPath, 1000, 'json', debug.debugOn);
    if (!dataFiles.length) return false;

    importFileList = dataFiles.filter(f => {
        return allowedFileList.some(s => { return f.parse.base === s; });
    }).map(x => x.parse);

    if (!importFileList.length) return false;

    //Read all the data files in
    console.table(importFileList);
    importFileList.forEach((fn) => {
        rawDataFileContent.push({
            file: fn.name,
            fileFullName: `${fn.dir}/${fn.base}`,
            data: fs.readFileSync(`${fn.dir}/${fn.base}`, 'utf8').replaceAll('\n', '').replaceAll('\t', '')
        });
    });

    //convert to object
    rawDataFileContent.forEach(d => { d.data = JSON.parse(d.data); });  //add a try
    return true;
}
//=======================================================================
function processBlocksDotJson () {

    const blockRawData = rawDataFileContent[ 0 ].data;
    if (blockRawData.length == 0) return;
    
    const blockKeys = Object.keys(blockRawData);
    consoleColor.log(`Block.json ${cmdLineSettingsJson.branch} key count`,blockKeys.length)

    blockKeys.forEach((key, i) => {
       //debug.log(key);
        const data = blockRawData[ key ];
        if (typeof data == 'object') {
            data.index = i;
            data.tag_group = '';
            data.tag = '';
            data.identifier = key;
            data.title = Title(key.replace('_', ' '));

            data.nameParts = key.split('_');
            data.wordCount = data.nameParts.length;
            data.firstWord = data.wordCount > 1 ? data.nameParts[ 0 ] : '';
            data.lastWord = data.wordCount > 1 ? data.nameParts[ data.nameParts.length - 1 ] : '';
            data.last2Words = data.wordCount > 2 ? data.nameParts[ data.nameParts.length - 2 ] + '_' + data.nameParts[ data.nameParts.length - 1 ] : '';

            //unique key
            if (data.wordCount > 2) {
                data.uniqueShortKey = data.nameParts[ 0 ] + '_';
                data.nameParts
                    .filter((w, i) => { return i > 0; })
                    .filter((w, i) => { return i < data.wordCount - 2; })
                    .forEach((w) => { data.uniqueShortKey += `${w.substring(0, 1)}${w.length}${w.substr(w.length - 1)}`; });
                data.uniqueShortKey += '_' + data.nameParts[ data.nameParts.length - 1 ];
                if (data.uniqueShortKey.length >= key.length) data.uniqueShortKey = key;
            }
            else data.uniqueShortKey = key;

            blocks.push(data);
        }
    });
    consoleColor.log(`Block.json ${cmdLineSettingsJson.branch} block count`,blocks.length)

    //create algorythem to do counts of types...and more than  ?  get on tag
    //then 2nd tag for group... like tag group for blocks...vs other stuff
    blocks.forEach((data) => {
        //2 words
        if (!data.tag && [ 'double_slab' ].includes(data.last2Words)) {
            data.tag_group = 'block';
            data.tag = data.last2Words;
        }
        if (!data.tag && [ 'shulker_box' ].includes(data.last2Words)) {
            data.tag_group = 'job-block';
            data.tag = data.last2Words;
        }
        //coral_wall_fan
        if (!data.tag && [ 'coral_fan', 'wall_fan' ].includes(data.last2Words)) {
            data.tag_group = 'plant';
            data.tag = data.last2Words;
        }
        if (!data.tag && [ 'double_slab' ].includes(data.last2Words)) {
            data.tag_group = 'non-block';
            data.tag = data.last2Words;
        }

        //One word
        if (!data.tag && [ 'calcite', 'path', 'sandstone', 'nylium', 'hyphae', 'stem', 'cobblestone', 'mud', 'block', 'shroomlight', 'seaLantern', 'grate', 'bricks', 'concrete', 'coral', 'log', 'ore', 'planks', 'wood', 'terracotta', "glass", "powder", "wool", 'stone', 'blackstone', 'basalt', 'bedrock', 'tuff', 'ice', 'froglight', 'glowstone', 'copper', 'tiles', 'sand', 'snow', 'soil', 'sponge', 'stonebrick', 'obsidian' ].includes(data.lastWord)) {
            data.tag_group = 'block';
            data.tag = data.wordCount > 1 ? data.lastWord : data.key;
        }
        if (!data.tag && [ 'candle', 'banner', 'sign', 'slab', 'stairs', 'wall', 'gate', 'fence', 'button', "carpet", 'cake', 'pane', 'trapdoor', 'door', 'bulb' ].includes(data.lastWord)) {
            data.tag_group = 'non-block';
            data.tag = data.wordCount > 1 ? data.lastWord : data.key;
        }
        if (!data.tag && [ 'leaves', 'carrots', 'cactus', 'pumpkin', 'orchid', 'tulip', 'daisy', 'lilac', 'grass', 'flower', 'plant', 'sapling', 'sunflower', 'seagrass', 'reeds', 'poppy', "flowered", "bluet", "bamboo", "beetroot", 'dripleaf', 'mushroom', 'tallgrass', 'fungus', 'roots', 'vines', 'vine', 'wheat', 'rose', 'waterlily' ].includes(data.lastWord)) {
            data.tag_group = 'plant';
            data.tag = data.wordCount > 1 ? data.lastWord : data.key;
        }
        if (!data.tag && [ 'chest', 'table', 'stonecutter', 'nylium', 'hyphae', 'stem', 'cobblestone', 'mud', 'block', 'shroomlight', 'seaLantern', 'grate', 'bricks', 'concrete', 'coral', 'log', 'ore', 'planks', 'wood', 'terracotta', "glass", "powder", "wool", 'stone', 'blackstone', 'basalt', 'bedrock', 'tuff', 'ice', 'froglight', 'glowstone', 'copper', 'tiles', 'sand', 'snow', 'soil', 'sponge', 'stonebrick', 'obsidian' ].includes(data.lastWord)) {
            data.tag_group = 'job-block';
            data.tag = data.wordCount > 1 ? data.lastWord : data.key;
        }
    });

    //heads up on dup keys
    const keyCheck = blocks.map(b => { return b.uniqueShortKey; });

    while (keyCheck.length) {
        const key = keyCheck.pop();
        if (keyCheck.includes(key)) {
            const dups = blocks.filter(b => { return b.uniqueShortKey === key; }).map(b => { return b.name; });
            consoleColor.error('Duplicate Key', key, dups);
        }
    }
}
//=====================================================================
function export_blocksDotJson (tag, outpath, blocks) {

    const data = blocks.filter(block => { return block.tag == tag; });
    if (data.length == 0) return;

    const dataOutput = { vanilla_123abcxyz789: data };
    let outputStingify = JSON.stringify(dataOutput, null, 4).replace('vanilla_123abcxyz789', `vanilla_${tag}s`);
    let outFileName = `${outpath}/vanilla_${tag}s.json`;

    fs.writeFileSync(outFileName, outputStingify);
    consoleColor.success(`Exported ${data.length} ${tag}s to: ${outFileName}`);
}
//=====================================================================
function export_blocksDotJsonSounds (tag, outpath, blocks) {

    const data = blocks.filter(block => { return block.tag == tag; });
    if (data.length == 0) return;

    const sounds = [];
    data.forEach(block => {
        if (!sounds.includes(block.sound)) {
            console.log(block.sound);
            sounds.push(block.sound);
        }
    });


    const dataOutput = { vanilla_123abcxyz789: sounds };
    let outputStingify = JSON.stringify(dataOutput, null, 4).replace('vanilla_123abcxyz789', `vanilla_${tag}_sounds`);
    let outFileName = `${outpath}/vanilla_${tag}_sounds.json`;

    fs.writeFileSync(outFileName, outputStingify);
    consoleColor.success(`Exported ${data.length} ${tag}s to: ${outFileName}`);
}
//=====================================================================
function crossJoins_Get (tag = "slab", blocks) {

    const data1 = blocks.filter(block => { return block.tag == tag; });
    if (data1.length == 0) return false;

    const data2 = data1;
    const dataCombo = [];

    data1.forEach(b1 => {
        data2
            .filter(b2 => { return b2.index > b1.index; })
            .forEach(b2 => {
                const identifier = (b1.identifier + '.' + b2.identifier).replaceAll('_' + tag, '') + `.${tag}.combo`;
                dataCombo.push({
                    identifier: identifier,
                    identifierShort: (b1.uniqueShortKey + '.' + b2.uniqueShortKey).replaceAll('_' + tag, '') + `.${tag}.combo`,
                    title: Title(identifier.replace('.', ' & ').replaceAll('_' + tag, '').replaceAll('_', ' ').replaceAll('.', ' ')),
                    sound: b1.sound == b2.sound ? b1.sound :
                        (b1.sound.includes(b2.sound) ? b2.sound :
                            (b2.sound.includes(b1.sound) ? b1.sound : '')),
                    obj1: {
                        identifier: b1.identifier,
                        identifierShort: b1.uniqueShortKey,
                        textures: b1.textures,
                        sound: b1.sound
                    },
                    obj2: {
                        identifier: b2.identifier,
                        identifierShort: b2.uniqueShortKey,
                        textures: b2.textures,
                        sound: b2.sound
                    }
                });
            });
    });

    return dataCombo;
}
//=====================================================================
function export_crossJoin (tag = "slab", outpath, blocks) {

    const dataCombo = crossJoins_Get(tag, blocks);
    if (!dataCombo) return;

    const dataOutput = { vanilla_123abcxyz789: dataCombo };
    let outputStingify = JSON.stringify(dataOutput, null, 4).replace('vanilla_123abcxyz789', `vanilla_${tag}_combos`);
    let outFileName = `${outpath}/vanilla_${tag}_combos.json`;

    fs.writeFileSync(outFileName, outputStingify);
    consoleColor.success(`Exported ${dataCombo.length} ${tag} Combos to: ${outFileName}`);
}
function Title (str) {
    const sentences = str.split(' ');
    sentences.forEach((sentence, index) => {
        sentences[ index ] = sentence.charAt(0).toUpperCase() + sentence.slice(1);
    });
    return sentences.join(' ');
}
//=====================================================================
function export_crossJoin_slabs (outpath, blocks) {
    const tag = "slab";
    const dataCombo = crossJoins_Get(tag, blocks);
    if (!dataCombo) return;

    const dataOutput = { vanilla_123abcxyz789: dataCombo };
    let outputStingify = JSON.stringify(dataOutput, null, 4).replace('vanilla_123abcxyz789', `vanilla_${tag}_combos`);
    let outFileName = `${outpath}/vanilla_${tag}_combos.json`;

    fs.writeFileSync(outFileName, outputStingify);
    consoleColor.success(`Exported ${dataCombo.length} ${tag} Combos to: ${outFileName}`);
}
//=====================================================================
function Title (str) {
    const sentences = str.split(' ');
    sentences.forEach((sentence, index) => {
        sentences[ index ] = sentence.charAt(0).toUpperCase() + sentence.slice(1);
    });
    return sentences.join(' ');
}
//=====================================================================
//=======================================================================
function main () {
    //debug.on()
    debug.color("functionStart", "* main()");
    debug.log(cmdLineSettingsJson);

    if (!readImportFiles()) return;

    //Blocks.json
    processBlocksDotJson();
    //export files
    if (cmdLineSettingsJson.slabs) export_blocksDotJson('slab', outpath, blocks);
    if (cmdLineSettingsJson.slabCombos) {
        export_crossJoin('slab', outpath, blocks);
        export_blocksDotJsonSounds('slab', outpath, blocks);
    }

    if (cmdLineSettingsJson.logs) export_blocksDotJson('log', outpath, blocks);
    if (cmdLineSettingsJson.planks) export_blocksDotJson('planks', outpath, blocks);
    if (cmdLineSettingsJson.wood) export_blocksDotJson('wood', outpath, blocks);
    if (cmdLineSettingsJson.doubleSlabs) export_blocksDotJson('double_slab', outpath, blocks);
    if (cmdLineSettingsJson.ores) export_blocksDotJson('ore', outpath, blocks);
    if (cmdLineSettingsJson.wool) export_blocksDotJson('wool', outpath, blocks);
    if (cmdLineSettingsJson.glass) export_blocksDotJson('glass', outpath, blocks);
    if (cmdLineSettingsJson.panes) export_blocksDotJson('pane', outpath, blocks);

    //TODO: expand later and add secondary tag for other stuff

    //missing list
    // const missing = blocks.filter(blocks => {return !blocks.tag})
    // console.table(missing)
    //blocks.forEach(b => {        if (!b.tag) console.log(b.name);    });
}
//============================================================================
main();
//============================================================================
//Go Home, the show is over