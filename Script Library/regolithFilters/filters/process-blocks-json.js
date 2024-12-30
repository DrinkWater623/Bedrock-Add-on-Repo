// @ts-check
/*
=====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Intended for use with Regolith
========================================================================
*/
// Global variables - Part 1
//=====================================================================
const fs = require("fs");
//const fileInfo = require('path');
const { Debug } = require("./js_lib/Debug.js");
const { is, has } = require("./js_lib/shared-classes.js");
const fileIo = require("./js_lib/File_io.js");
const { Mining_Speeds } = require("./js_lib/miningSpeeds.js");
const { error } = require("console");
//=====================================================================// Global variables - Part 1
//=====================================================================
var argPath = process.argv[ 1 ];
var argSettings = process.argv[ 2 ];
const cmdLineSettingsJson = JSON.parse(argSettings);
//=====================================================================
//Override set here... or in config
let isDebug = false;
let isDebugMax = false;
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
let dataPath = cmdLineSettingsJson.inputPath || './data/vanilla-data';
const allowedFileList = [
    "blocks.json" //,
    // "mojang-blocks.json",
    // "mojang-items.json"
];
let beta = false;
const blocks = [];
const rawDataFileContent = [];
const outpath = cmdLineSettingsJson.outputPath || `./data/jsonte/vanilla-data`;
let blockDotJsonRawData = [];
let importFileList;
let excludes = [];
let includes = [];
//==============================================================================
/**@param {number} number  */
function round (number, place = 0) {
    if (place <= 0) return Math.round(number);
    let multiplier = parseInt('1' + ('0'.repeat(place)));
    return Math.round(number * multiplier) / multiplier;
}
//==============================================================================
const minecraftColors = [
    "black",
    "blue",
    "brown",
    "cyan",
    "gray",
    "green",
    "light_blue",
    "light_gray",
    "lime",
    "magenta",
    "orange",
    "pink",
    "purple",
    "red",
    "white",
    "yellow",
];
//=======================================================================

//=======================================================================
function readImportFiles () {
    beta = !!cmdLineSettingsJson.beta;
    const branch = cmdLineSettingsJson.branch || 'main';
    if (![ "main", "preview" ].includes(branch)) return false;

    //TODO: user path to the  files
    dataPath = dataPath + '/' + branch;
    const dataFiles = fileIo.fileTreeGet(dataPath, 1000, 'json', debug.debugOn);
    if (!dataFiles.length) return false;

    importFileList = dataFiles
        .filter(f => {
            return allowedFileList.some(s => { return f.parse.base === s; });
        })
        .map(x => x.parse);

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
function excludedBlocks_get (blockKeys) {
    const excludes = [];
    const keys = [ ...blockKeys ];
    const excludeBlocks = cmdLineSettingsJson.excludeBlocks || [];
    const excludeStartsWith = cmdLineSettingsJson.excludeStartsWith || [];
    const excludeContains = cmdLineSettingsJson.excludeContains || [];
    const excludeEndsWith = cmdLineSettingsJson.excludeEndsWith || [];

    if (Array.isArray(excludeBlocks) && excludeBlocks.length) {
        excludeBlocks
            .filter(x => { return !!x && typeof x == 'string' && keys.includes(x); })
            .forEach(b => {
                if (!excludes.includes(b)) {
                    excludes.push(b);
                    consoleColor.log(b, 'excluded (exact)');
                }
            });
        consoleColor.log(`${excludes.length} Excluded blocks (exact)`);
    }

    if (Array.isArray(excludeContains) && excludeContains.length) {
        let ctr = 0;
        excludeContains
            .filter(x => { return !!x && typeof x == 'string'; })
            .forEach(c => {
                keys.filter(k => { return k.includes(c); })
                    .filter(k1 => { return !excludes.includes(k1); })
                    .forEach(k2 => {
                        if (!excludes.includes(k2)) {
                            excludes.push(k2);
                            consoleColor.log(k2, 'excluded (contains)');
                            ctr++;
                        }
                    });
            });
        consoleColor.log(`${ctr} Excluded blocks (contains)`);
    }

    if (Array.isArray(excludeStartsWith) && excludeStartsWith.length) {
        let ctr = 0;
        excludeStartsWith
            .filter(x => { return !!x && typeof x == 'string'; })
            .forEach(sw => {
                keys.filter(k => { return k.startsWith(sw); })
                    .filter(k1 => { return !excludes.includes(k1); })
                    .forEach(k2 => {
                        if (!excludes.includes(k2)) {
                            excludes.push(k2);
                            consoleColor.log(k2, 'excluded (starts with)');
                            ctr++;
                        }
                    });
            });
        consoleColor.log(`${ctr} Excluded blocks (starts with)`);
    }

    if (Array.isArray(excludeEndsWith) && excludeEndsWith.length) {
        let ctr = 0;
        excludeEndsWith
            .filter(x => { return !!x && typeof x == 'string'; })
            .forEach(ew => {
                keys.filter(k => { return k.endsWith(ew); })
                    .filter(k1 => { return !excludes.includes(k1); })
                    .forEach(k2 => {
                        if (!excludes.includes(k2)) {
                            excludes.push(k2);
                            consoleColor.log(k2, 'excluded (ends with)');
                            ctr++;
                        }
                    });
            });
        consoleColor.log(`${ctr} Excluded blocks (ends with)`);
    }

    consoleColor.success(`Excluded blocks Total: ${excludes.length}`);
    return excludes;
}
//=======================================================================
function includedBlocks_get (blockKeys, excluded = []) {
    const includes = [];
    const keys = blockKeys.filter(k => { return !excluded.includes(k); });
    const includeBlocks = cmdLineSettingsJson.includeBlocks || [];
    const includeStartsWith = cmdLineSettingsJson.includeStartsWith || [];
    const includeContains = cmdLineSettingsJson.includeContains || [];
    const includeEndsWith = cmdLineSettingsJson.includeEndsWith || [];


    if (Array.isArray(includeBlocks) && includeBlocks.length) {
        includeBlocks
            .filter(x => { return typeof x == 'string' && keys.includes(x); })
            .forEach(b => {
                if (!includes.includes(b)) {
                    includes.push(b);
                    debug.log(b, 'included (exact)');
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
                            debug.log(k2, 'included (contains)');
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
                            debug.log(k2, 'included (starts with)');
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
                            debug.log(k2, 'included (ends with)');
                            ctr++;
                        }
                    });
            });
        consoleColor.log(`${ctr} included blocks (ends with)`);
    }

    consoleColor.success(`Included blocks Total: ${includes.length}`);
    return includes;
}
//=======================================================================
function processBlocksDotJson () {

    const miningSpeedCalc = new Mining_Speeds(true);
    if (miningSpeedCalc) {
        export_miningSpeeds(miningSpeedCalc);
        //miningSpeedCalc.listBlocks();
    }

    blockDotJsonRawData = rawDataFileContent[ 0 ].data;
    if (blockDotJsonRawData.length == 0) return;

    const blockKeys = Object.keys(blockDotJsonRawData);

    //-----------------------------------------------
    // short lists
    const blockColors = blockKeys.filter(b => b.endsWith("_wool")).map(b2 => b2.replace("_wool", ''));

    const logTypes = blockKeys.filter(b => b.endsWith("_fence")).map(b2 => b2.replace("_fence", ''));
    const oreTypes = blockKeys
        .filter(b2 => !b2.includes('deepslate'))
        .filter(b => b.endsWith("_ore"))
        .map(b2 => b2.replace("_ore", ''));
    oreTypes.push('netherite');

    // ?? stones should have a wall or slab.. I think.. may need to account for more variations
    // ?? copper and resin and sandstone and packed_mud
    const stoneTypes = blockKeys.filter(b => b.endsWith("_wall")).map(b2 => b2.replace("_wall", ''));

    blockKeys
        .filter(b1 => b1.endsWith("_slab"))
        .filter(b2 => !b2.includes("double_"))
        .map(b3 => b3.replace("_slab", ''))
        .filter(b4 => !stoneTypes.includes(b4))
        .filter(b4 => !logTypes.includes(b4))
        .filter(b5 => !oreTypes.includes(b5))
        .forEach(b => { stoneTypes.push(b); });

    blockKeys
        .filter(b1 => b1.endsWith("_stairs"))
        .map(b3 => b3.replace("_stairs", ''))
        .filter(b4 => !stoneTypes.includes(b4))
        .filter(b4 => !logTypes.includes(b4))
        .filter(b4 => !oreTypes.includes(b4))
        .forEach(b => { stoneTypes.push(b); });
    //-----------------------------------------------
    excludes = excludedBlocks_get(blockKeys);
    includes = includedBlocks_get(blockKeys, excludes);

    // .filter(k1 => excludes.length == 0 || !excludes.includes(k1))
    // .filter(k2 => includes.length == 0 || includes.includes(k2));

    consoleColor.log(`Block.json ${cmdLineSettingsJson.branch}${excludes.length || includes.length ? ' filtered' : ''} key count`, blockKeys.length);


    const includeHasSounds = cmdLineSettingsJson.includeHasSounds || [];

    blockKeys.forEach((key, i) => {
        //debug.log(key);

        const bdjData = blockDotJsonRawData[ key ];


        if (typeof bdjData == 'object' && !excludes.includes(key)) {

            //-----------------------------------------------------------------------------
            //Fix Blocks.Json Possible Errors or Reduce Info

            if (Object.hasOwn(bdjData, 'carried_textures') && typeof bdjData.carried_textures == 'string') {

                if (Object.hasOwn(bdjData, 'textures')) {
                    if (typeof bdjData.textures == 'object') {
                        bdjData.textures = bdjData.carried_textures;
                        delete bdjData.carried_textures;
                    }
                }
                else {
                    bdjData.textures = bdjData.carried_textures;
                    delete bdjData.carried_textures;
                }
            }

            if (Object.hasOwn(bdjData, 'sounds') && typeof bdjData.sounds == 'string') {
                bdjData.sound = bdjData.sounds;
                delete bdjData.sounds;
            }

            if (!bdjData.sound) bdjData.sound = '';
            bdjData.flammableLevel = bdjData.sound.endsWith('wood') ? 5 :
                bdjData.sound.startsWith('nether') ? 0 :
                    bdjData.sound.startsWith('crimson') ? 0 :
                        bdjData.sound.startsWith('warped') ? 0 : 1;
            //-----------------------------------------------------------------------------
            const newData = {
                index: i,
                identifier: key,
                uniqueShortKey: '',
                title: Title(key.replaceAll('_', ' ')),
                tag_group: '',
                tag: '',
                geo: ''
            };

            const data = Object.assign(newData, bdjData);
            //TODO: figure out what really using material for... too much... to do with this
            data.material = data.sound;
            if (data.material == 'grass') data.material = 'nature';
            if (data.material == 'anvil') data.material = 'metal';
            if (data.material.endsWith('wood')) data.material = 'wood';
            if (data.material.endsWith('hanging_sign')) data.material = 'wood';
            if (data.material == 'hanging_sign') data.material = 'wood';
            if (data.material == 'decorated_pot') data.material = 'stone';
            //-----------------------------------------------------------------------------

            data.nameParts = key.split('_');
            data.wordCount = data.nameParts.length;

            data.firstWord = data.wordCount > 1 ? data.nameParts[ 0 ] : '';
            data.lastWord = data.wordCount > 1 ? data.nameParts[ data.nameParts.length - 1 ] : '';
            //default
            data.tag = data.wordCount > 1 ? data.lastWord : data.key;

            data.first2Words = data.wordCount > 2 ? data.nameParts[ 0 ] + '_' + data.nameParts[ 1 ] : '';
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
            else {
                data.uniqueShortKey = key;
            }

            const miningSpeedMatch = miningSpeedCalc.findBestMatch(data.identifier);

            if (
                !!miningSpeedMatch &&
                typeof miningSpeedMatch == 'object' &&
                (includeHasSounds.length == 0 || includeHasSounds.includes(data.sound))
            ) {
                try {
                    data.hardness = miningSpeedMatch.hardness;
                    data.tools = miningSpeedMatch.tools;
                    data.tools.match = miningSpeedMatch.block;
                    data.tools.materials = miningSpeedMatch.materials;
                    blocks.push(data);

                    if (!data.identifier.includes(miningSpeedMatch.block) &&
                        !miningSpeedMatch.block.includes(data.identifier) &&
                        !data.identifier.includes('copper')
                    ) {
                        consoleColor.log(`Check MiningSpeed Match: ${data.identifier} as ${miningSpeedMatch.block}`);
                    }

                } catch (error) {
                    consoleColor.log(data.identifier);
                    consoleColor.error('Object Error Found');
                    console.log(miningSpeedMatch);
                    consoleColor.error(error);
                    throw new error("Stopping");
                }
            }
        }
    });
    consoleColor.log(`Block.json ${cmdLineSettingsJson.branch} block count`, blocks.length);
    //-----------------------------------------------------------------------------------
    //create algorythem to do counts of types...and more than  ?  get on tag
    //then 2nd tag for group... like tag group for blocks...vs other stuff
    //-----------------------------------------------------------------------------------
    const firstWords = new Map();
    const lastWords = new Map();
    const first2Words = new Map();
    const last2Words = new Map();
    for (const obj of blocks) {
        let key = obj.firstWord;
        if (key) firstWords.set(key, (firstWords.get(key) || 0) + 1);

        key = obj.lastWord;
        if (key) lastWords.set(key, (lastWords.get(key) || 0) + 1);

        if (obj.wordCount > 2) {
            key = obj.first2Words;
            if (key) first2Words.set(key, (first2Words.get(key) || 0) + 1);

            key = obj.las2tWord;
            if (key) last2Words.set(key, (last2Words.get(key) || 0) + 1);
        }
    }
    //-----------------------------------------------------------------------------------
    blocks.forEach((data) => {

        //2 words
        //to make sure not slab - damn mojand and inconsistencies
        if (data.nameParts.includes('double') && data.lastWord == 'slab') {
            data.tag_group = 'block';
            data.tag = 'double_slab';
            data.geo = 'full_block';
        }
        else if ([ 'concrete_powder' ].includes(data.last2Words)) {
            data.tag_group = 'block';
            data.tag = data.last2Words;
            data.geo = 'full_block';
        }
        else if ([ 'shulker_box' ].includes(data.last2Words)) {
            data.tag_group = 'inventory';
            data.tag = data.last2Words;
            data.geo = 'full_block';
        }
        else if (data.identifier.endsWith('coral_wall_fan')) {
            data.tag_group = 'coral';
            data.tag = 'coral_wall_fan';
            data.geo = 'cross';
        }
        else if ([ 'coral_block', 'coral_fan' ].includes(data.last2Words)) {
            data.tag_group = 'coral';
            data.tag = data.last2Words;
            data.geo = 'cross';
        }
        else if ([ 'candle_cake' ].includes(data.last2Words)) {
            data.tag_group = 'food';
            data.tag = data.last2Words;
            data.geo = 'custom';
        }

        //One word
        if (
            data.identifier.endsWith('light') ||
            data.identifier.endsWith('bricks') ||
            [ 'concrete', 'soil', 'block', 'ore', 'log', 'planks', 'wood', 'terracotta', 'sandstone', 'nylium', 'hyphae', 'stem', 'bricks', "wool" ].includes(data.lastWord)
        ) {
            data.tag_group = 'block';
            data.geo = 'full_block';
        }
        if (
            [ 'calcite', 'path', 'cobblestone', 'mud', 'seaLantern', 'grate', 'coral', "powder", 'stone', 'blackstone', 'basalt', 'bedrock', 'tuff', 'ice', 'froglight', 'glowstone', 'copper', 'tiles', 'sand', 'snow', 'sponge', 'stonebrick', 'obsidian' ].includes(data.identifier)) {
            data.tag_group = 'block';
            data.geo = 'full_block';
        }

        if (!data.tag &&
            (
                data.last2Words == 'hanging_sign'
            )
        ) {
            data.tag_group = 'non-full-block';
            data.tag = data.last2Words;
            data.geo = 'custom';
        }
        if (!data.tag &&
            (
                data.lastWord == 'slab'
            )
        ) {
            data.tag_group = 'non-full-block';
            data.geo = 'half_block';
        }
        //TODO: More breakdowns        
        if (!data.tag &&
            (
                [ 'sign', 'gate', 'fence', 'candle', 'banner', 'stairs', 'wall', 'button', "carpet", 'cake', 'pane', 'trapdoor', 'door', 'bulb' ].includes(data.lastWord)
            )
        ) {
            data.tag_group = 'non-full-block';
            data.geo = 'custom';
        }

        if (!data.tag && (
            [ 'leaves', 'pumpkin', 'cactus' ].includes(data.lastWord)
        )
        ) {
            data.tag_group = 'plant';
            data.material = 'nature';
            data.geo = 'full_block';
        }

        if (!data.tag &&
            (
                [ 'vines', 'grass', 'bamboo' ].includes(data.sound) ||
                [ 'carrots', 'orchid', 'tulip', 'daisy', 'lilac', 'grass', 'flower', 'plant', 'sapling', 'sunflower', 'seagrass', 'reeds', 'poppy', "flowered", "bluet", "bamboo", "beetroot", 'dripleaf', 'mushroom', 'tallgrass', 'fungus', 'roots', 'vines', 'vine', 'wheat', 'rose', 'waterlily' ].includes(data.lastWord)
            )
        ) {
            data.tag_group = 'plant';
            data.material = 'nature';
            data.geo = 'cross';
        }
        //job blocks - some settings re-adjusted per material later
        if ([ 'table', 'loom', 'bookshelf' ].includes(data.lastWord ?? data.identifier)) {
            data.tag_group = 'job-block';
            data.geo = 'full_block';
        }
        if ([ 'brewing_stand', , 'stonecutter', 'anvil', 'cauldron' ].includes(data.lastWord ?? data.identifier)) {
            data.tag_group = 'job-block';
            data.geo = 'custom';
        }

        if (!data.tag && [ 'chest' ].includes(data.lastWord)) {
            data.tag_group = 'inventory';
            data.tag = data.wordCount > 1 ? data.lastWord : data.key;
            data.geo = 'full_block';
        }
    });

    //==============================================================
    //material TODO: do more - but just worried about slabs for now

    blocks.forEach((data) => {
        if (oreTypes.includes(data.firstWord)) {
            data.material = data.firstWord;
        }

        if (
            data.sound == 'stone' ||
            stoneTypes.includes(data.firstWord) ||
            data.nameParts.includes('stone') ||
            data.nameParts.includes('stone') ||
            data.lastWord == '_ore' ||
            data.nameParts.includes('brick')
        ) {
            data.material = 'stone';
        }

        if (data.identifier.startsWith('end_stone') || data.identifier.startsWith('end_brick')) {
            data.material = 'stone';
        }
        if (
            data.identifier.startsWith('wooden') ||
            logTypes.some(logName => data.identifier.startsWith(logName))
        ) {
            data.material = 'wood';
        }

        if (data.sound.includes('copper') ||
            data.identifier.includes('copper') ||
            data.identifier.startsWith('iron')) {
            data.material = 'metal';
        }

        if (data.sound.includes('sand') || data.sound.includes('gravel')) {
            data.material = 'sand';
        }

    });
    //==============================================================
    /* 
    help with harness and destroy
    https://minecraft.wiki/w/Breaking
    */
    blocks.forEach((data) => {
        //mc colors
        data.colored = lastWords[ data.lastWord ] >= blockColors.length &&
            blockColors.some(color => data.identifier.startsWith(color + '_'));

        data.destroy_time = data.tools.base * 2; //made up cause testing times was not working if this is bigger
        data.tool_type = data.tools.best;
        data.mine_by_hand = (data.tools.hand <= data.tools.base);
        data.tool_material_minimum = data.mine_by_hand ? 'wood' : data.tools.materials.least;
        data.explosion_resistence = round(data.destroy_time * 3, 0);
    });

    blocks.forEach((data) => {       //overrides
        if (data.identifier.includes('netherite')) data.material_tier_tags = 'minecraft:diamond_tier_destructible';

        if ([ 'wool', 'carpet', 'leaves', 'vines' ].includes(data.tag)) {
            data.tool_tags = 'minecraft:is_shears_item_destructible';
        }

        //default calculation
        let tool = data.tool_type || 'tool';
        data.tool_type_tags = `minecraft:is_${data.tool_type}_item_destructible`;
        data.tool_material_tier_tags = ([ 'stone', 'diamond', 'iron' ].includes(data.tools.materials.least) ? 'minecraft' : 'dw623') + `:${data.tools.materials.least}_tier_destructible`;

    });

    /**
     *  "tag:minecraft:{{contains(obj1.sound,'wood') || contains(obj2.sound,'wood') ? 'is_hatchet_item_destructible' : 'is_pickaxe_item_destructible'}}": {},
        "tag:minecraft:{{contains(obj1.sound,'wood') || contains(obj2.sound,'wood') ? 'wood_tier_destructible' : 'stone_tier_destructible'}}": {},                
     */

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
function export_miningSpeeds (data) {

    const dataOutput = { mining_speeds: data };
    let outputStingify = JSON.stringify(dataOutput, null, 4);
    let outFileName = `${outpath}/mining_speeds.json`;

    if (fs.existsSync(outFileName)) fs.unlinkSync(outFileName);
    if (!fs.existsSync(outFileName)) {
        fs.writeFileSync(outFileName, outputStingify, { encoding: 'utf8', mode: 0o644, flag: 'w' });
        if (fs.existsSync(outFileName)) {
            consoleColor.success(`Exported mining_speeds to: ${outFileName}`);
        }
        else {
            consoleColor.error(`Did Not Export mining_speeds to: ${outFileName}`);
        }
    }
    else {
        consoleColor.error(`Could Not Delete Old File: ${outFileName}`);
    }
}
//=====================================================================
function export_blocksDotJson (tag, outpath, blocks) {

    const data = blocks
        .filter(block => { return tag == 'all' || block.tag == tag; })
        .filter(k1 => excludes.length == 0 || !excludes.includes(k1.identifier))
        .filter(k2 => includes.length == 0 || includes.includes(k2.identifier));
    if (data.length == 0) return;

    data.forEach(block => {
        block.textureType = typeof block.textures;
    });

    const dataOutput = { vanilla_123abcxyz789: data };
    let outputStingify = JSON.stringify(dataOutput, null, 4).replace('vanilla_123abcxyz789', `vanilla_${tag}s`);
    let outFileName = `${outpath}/vanilla_${tag}s.json`;

    //fs.writeFileSync(outFileName, outputStingify);
    //consoleColor.success(`Exported ${data.length} ${tag}s to: ${outFileName}`);

    if (fs.existsSync(outFileName)) fs.unlinkSync(outFileName);
    if (!fs.existsSync(outFileName)) {
        fs.writeFileSync(outFileName, outputStingify, { encoding: 'utf8', mode: 0o644, flag: 'w' });
        if (fs.existsSync(outFileName)) {
            consoleColor.success(`Exported ${data.length} ${tag}s to: ${outFileName}`);
        }
        else {
            consoleColor.error(`Did Not Export ${data.length} ${tag}s to: ${outFileName}`);
        }
    }
    else {
        consoleColor.error(`Could Not Delete Old File: ${outFileName}`);
    }
}
//=====================================================================
function export_blocksDotJsonSounds (tag, outpath, blocks) {

    const data = blocks
        .filter(block => { return tag == 'all' || block.tag == tag; })
        .filter(block => !!block.sound)
        .filter(k1 => excludes.length == 0 || !excludes.includes(k1.identifier))
        .filter(k2 => includes.length == 0 || includes.includes(k2.identifier));
    if (data.length == 0) return;

    const soundList = [];
    const soundBlocks = [];
    data.forEach(block => {
        if (!soundList.includes(block.sound)) {
            console.log(block.sound);
            soundList.push(block.sound);
        }
    });

    soundList.forEach(sound => {
        const blockListsound = data.filter(block => { return block.sound == sound; }).map(b => b.identifier);
        soundBlocks.push(sound, blockListsound);
    });

    const dataOutput = { vanilla_123abcxyz789: soundBlocks };
    let outputStingify = JSON.stringify(dataOutput, null, 4).replace('vanilla_123abcxyz789', `vanilla_${tag}_sounds`);
    let outFileName = `${outpath}/vanilla_${tag}_sounds.json`;

    fs.unlinkSync(outFileName);
    if (!fs.existsSync(outFileName)) {
        fs.writeFileSync(outFileName, outputStingify, { encoding: 'utf8', mode: 0o644, flag: 'w' });
        if (fs.existsSync(outFileName))
            consoleColor.success(`Exported ${data.length} ${tag}s to: ${outFileName}`);
        else {
            consoleColor.error(`Did Not Export Sounds ${data.length} ${tag}s to: ${outFileName}`);
        }
    }
    else {
        consoleColor.error(`Could Not Delete Old File: ${outFileName}`);
    }
}
//=====================================================================
function crossJoins_Get (tag = "slab", blocks) {
    //this is only for slabs, so it will not need sertain things
    const data1 = blocks
        .filter(block => { return block.tag == tag; });

    if (data1.length == 0) return false;

    data1.forEach(b => {
        if (typeof b.textures == 'object') {
            b.textureList = Object.assign({}, b.textures);
            b.textures = b.textures.up || b.textures.down || b.textures.side;
        }
        else b.textureList = { up: b.textures, down: b.textures, side: b.textures };
    });
    const data2 = data1;
    const dataCombos = [];

    data1.forEach(b1 => {
        data2
            .filter(b2a => { return b2a.index > b1.index; })
            .forEach(b2 => {
                const identifier = (b1.identifier + '.' + b2.identifier).replaceAll('_' + tag, '') + `.${tag}.combo`;
                const combo = {
                    block: {
                        identifier: identifier,
                        identifierShort: (b1.uniqueShortKey + '.' + b2.uniqueShortKey).replaceAll('_' + tag, '') + `.${tag}.combo`,
                        title: Title(identifier.replace('.', ' & ').replaceAll('_' + tag, '').replaceAll('_', ' ').replaceAll('.', ' ')),
                        //since for slabs, will be either wood, stone or metal - stone is default when can't find sameniess
                        sound: b1.sound == b2.sound ? b1.sound :
                            (b1.sound.includes(b2.sound) ? b2.sound :
                                (b2.sound.includes(b1.sound) ? b1.sound :
                                    (b1.sound.length > b2.sound ? b2.sound : b1.sound))),

                        material: b1.material == b2.material ? b1.material :
                            b1.material.includes(b2.material) ? b2.material :
                                b2.material.includes(b1.material) ? b1.material :
                                    [ b1.material, b2.material ].includes('stone'),
                        flammableLevel: Math.floor((b1.flammableLevel + b2.flammableLevel) / 2),
                        tool_type_tags: b1.tool_type_tags == b2.tool_type_tags ? b1.tool_type_tags : '',
                        tool_material_tier_tags: b1.tool_material_tier_tags == b2.tool_material_tier_tags ? b1.tool_material_tier_tags : '',
                        hardness: round((b1.hardness + b2.hardness) / 2, 1),
                        destroy_time: round((b1.destroy_time + b2.destroy_time) / 2, 1),
                        explosion_resistence: round((b1.explosion_resistence + b2.explosion_resistence) / 2, 1),
                    },
                    tools: {
                        //tool material is NOT like block material
                        material: b1.tools.material == b2.tools.material ? b1.tools.material :
                            [ b1.tools.material, b2.tools.material ].includes('hand') ? 'wood' :
                                [ b1.tools.material, b2.tools.material ].includes('wood') ? 'wood' :
                                    [ b1.tool.material, b2.tools.material ].includes('stone') ? 'stone' :
                                        [ b1.tools.material, b2.tools.material ].includes('iron') ? 'iron' :
                                            'diamond',

                        base: round((b1.tools.base + b2.tools.base) / 2, 1),
                        hand: round((b1.tools.hand + b2.tools.hand) / 2, 1),
                        mace: round((b1.tools.mace + b2.tools.mace) / 2, 1),
                        //just need axe and pickaxe for slabs                     

                        wooden_axe: crossJoinTool(b1, b2, 'wooden_axe'),
                        stone_axe: crossJoinTool(b1, b2, 'stone_axe'),
                        iron_axe: crossJoinTool(b1, b2, 'iron_axe'),
                        diamond_axe: crossJoinTool(b1, b2, 'diamond_axe'),
                        netherite_axe: crossJoinTool(b1, b2, 'netherite_axe'),
                        golden_axe: crossJoinTool(b1, b2, 'golden_axe'),

                        wooden_pickaxe: crossJoinTool(b1, b2, 'wooden_pickaxe'),
                        stone_pickaxe: crossJoinTool(b1, b2, 'stone_pickaxe'),
                        iron_pickaxe: crossJoinTool(b1, b2, 'iron_pickaxe'),
                        diamond_pickaxe: crossJoinTool(b1, b2, 'diamond_pickaxe'),
                        netherite_pickaxe: crossJoinTool(b1, b2, 'netherite_pickaxe'),
                        golden_pickaxe: crossJoinTool(b1, b2, 'golden_pickaxe'),
                    },
                    obj1: {
                        identifier: b1.identifier,
                        identifierShort: b1.uniqueShortKey,
                        textures: b1.textures,
                        textureList: b1.textureList,
                        sound: b1.sound,
                        material: b1.material,
                        tool_type_tags: b1.tool_type_tags,
                        tool_material_tier_tags: b1.tool_material_tier_tags,
                        destroy_time: b1.destroy_time,
                        explosion_resistence: b1.explosion_resistence,
                        tools: b1.tools
                    },
                    obj2: {
                        identifier: b2.identifier,
                        identifierShort: b2.uniqueShortKey,
                        textures: b2.textures,
                        textureList: b2.textureList,
                        sound: b2.sound,
                        material: b2.material,
                        tool_type_tags: b2.tool_type_tags,
                        tool_material_tier_tags: b2.tool_material_tier_tags,
                        destroy_time: b2.destroy_time,
                        explosion_resistence: b2.explosion_resistence,
                        tools: b2.tools
                    }
                };

                dataCombos.push(combo);
            });
    });

    //use one texture

    const dataReturn = dataCombos.filter(k => includes.length == 0 || includes.includes(k.obj1.identifier || includes.includes(k.obj2.identifier)));
    if (debug) dataReturn.forEach(b => { consoleColor.log("Combo Slab :", b.obj1.identifier, "and", b.obj2.identifier); });

    return dataReturn;
}
/**
 * 
 * @param {object} b1 
 * @param {object} b2 
 * @param {string} tool
 */
function crossJoinTool (b1, b2, tool) {

    const b1_toolBase = b1.sound.endsWith('wood') ? 'axe' : 'pickaxe';
    const b2_toolBase = b2.sound.endsWith('wood') ? 'axe' : 'pickaxe';

    const words = tool.split('_');

    const b1_tool = words[ 0 ] + '_' + b1_toolBase;
    const b2_tool = words[ 0 ] + '_' + b2_toolBase;
    return round(b1.tools[ b1_tool ] + b1.tools[ b2_tool ] / 2, 1);
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
function Sentence (str) {
    const sentences = str.split('. ');
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
    if (cmdLineSettingsJson.sounds) export_blocksDotJsonSounds('all', outpath, blocks);
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
//============================================================================