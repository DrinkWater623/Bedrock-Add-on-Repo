// @ts-check
//=====================================================================
// Global variables - Part 1
//=====================================================================
const fs = require("fs");
//const fileInfo = require('path');
const { Debug } = require("./js_lib/Debug.js");
const { is, has } = require("./js_lib/shared-classes.js");
const fileIo = require("./js_lib/File_io.js");
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

    blockDotJsonRawData = rawDataFileContent[ 0 ].data;
    if (blockDotJsonRawData.length == 0) return;

    const blockKeys = Object.keys(blockDotJsonRawData);
    excludes = excludedBlocks_get(blockKeys);
    includes = includedBlocks_get(blockKeys, excludes);

    // .filter(k1 => excludes.length == 0 || !excludes.includes(k1))
    // .filter(k2 => includes.length == 0 || includes.includes(k2));

    consoleColor.log(`Block.json ${cmdLineSettingsJson.branch}${excludes.length || includes.length ? ' filtered' : ''} key count`, blockKeys.length);

    blockKeys.forEach((key, i) => {
        //debug.log(key);
        const data = blockDotJsonRawData[ key ];
        if (typeof data == 'object' && !excludes.includes(key)) {
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

            //if(!data.sound) debug.error("No Sound",key)
            if (!data.sound) data.sound = '';

            //initialize with minimum - will be reset later
            data.hardness = 0;
            data.destroy_time=0;
            data.explosion_reistence=0;
            data.tool_type = 'tool';
            data.tool_material_minimum = 'wood'
            data.mine_by_hand=false;
            data.hand_destroy_time = 25;

            blocks.push(data);

        }
    });
    consoleColor.log(`Block.json ${cmdLineSettingsJson.branch} block count`, blocks.length);

    //create algorythem to do counts of types...and more than  ?  get on tag
    //then 2nd tag for group... like tag group for blocks...vs other stuff
    blocks.forEach((data) => {

        //2 words
        //to make sure not slab
        if (!data.tag && [ 'double_slab' ].includes(data.last2Words)) {
            data.tag_group = 'block';
            data.tag = data.last2Words;
        }
        if (!data.tag && data.identifier.includes('double') && data.identifier.endsWith('slab')) {
            data.tag_group = 'block';
            data.tag = 'double_slab';
        }

        if (!data.tag && [ 'shulker_box' ].includes(data.last2Words)) {
            data.tag_group = 'inventory';
            data.tag = data.last2Words;
            data.mine_by_hand=true
            data.tool_type='pickaxe'
        }
        //coral_wall_fan
        if (!data.tag && [ 'coral_fan', 'wall_fan' ].includes(data.last2Words)) {
            data.tag_group = 'plant';
            data.tag = data.last2Words;
        }

        //One word
        if (!data.tag && [ 'calcite', 'path', 'sandstone', 'nylium', 'hyphae', 'stem', 'cobblestone', 'mud', 'block', 'shroomlight', 'seaLantern', 'grate', 'bricks', 'concrete', 'coral', 'log', 'ore', 'planks', 'wood', 'terracotta', "glass", "powder", "wool", 'stone', 'blackstone', 'basalt', 'bedrock', 'tuff', 'ice', 'froglight', 'glowstone', 'copper', 'tiles', 'sand', 'snow', 'soil', 'sponge', 'stonebrick', 'obsidian' ].includes(data.lastWord)) {
            data.tag_group = 'block';
            data.tag = data.wordCount > 1 ? data.lastWord : data.key;
        }
        if (!data.tag &&
            (
                [ 'hanging_sign', '' ].includes(data.sound) ||
                [ 'candle', 'banner', 'sign', 'slab', 'stairs', 'wall', 'gate', 'fence', 'button', "carpet", 'cake', 'pane', 'trapdoor', 'door', 'bulb' ].includes(data.lastWord)
            )
        ) {
            data.tag_group = 'non-block';
            data.tag = data.wordCount > 1 ? data.lastWord : data.key;
            data.mine_by_hand=true
        }

        if (!data.tag &&
            (
                [ 'vines', 'grass' ].includes(data.sound) ||
                [ 'leaves', 'carrots', 'cactus', 'pumpkin', 'orchid', 'tulip', 'daisy', 'lilac', 'grass', 'flower', 'plant', 'sapling', 'sunflower', 'seagrass', 'reeds', 'poppy', "flowered", "bluet", "bamboo", "beetroot", 'dripleaf', 'mushroom', 'tallgrass', 'fungus', 'roots', 'vines', 'vine', 'wheat', 'rose', 'waterlily' ].includes(data.lastWord)
            )
        ) {
            data.tag_group = 'plant';
            data.tag = data.wordCount > 1 ? data.lastWord : data.key;
            data.material = 'organic';
            data.tool_type = 'hoe';
            data.tool_material = 'wood';
            data.mine_by_hand=true
        }
        //job blocks - some settings re-adjusted per material later
        if (!data.tag && [ 'table', 'loom','stonecutter' ].includes(data.lastWord)) {
            data.tag_group = 'job-block';
            data.tag = data.wordCount > 1 ? data.lastWord : data.key;
            data.tool_type = 'axe';
            data.tool_material = 'wood';
            data.mine_by_hand=true
        }        
        if (!data.tag && [ 'chest' ].includes(data.lastWord)) {
            data.tag_group = 'inventory';
            data.tag = data.wordCount > 1 ? data.lastWord : data.key;
            data.tool_type = 'axe';
            data.tool_material = 'wood';
            data.mine_by_hand=true
        }        
    });

    //material TODO: do more - but just worried about slabs for now
    blocks.forEach((data) => {
        if (
            data.sound.includes('wood') ||
            data.identifier.includes('wood') ||
            data.identifier.startsWith('dark_oak') ||
            [ 'acacia', 'birch', 'cherry', 'jungle', 'mangrove', 'oak', 'cherry', 'spruce','warped' ].includes(data.firstWord)
        ) {
            data.material = 'wood';
            data.tool_type = 'axe';
            data.tool_material = 'wood';
        }

        if (data.sound.includes('stone') || data.identifier.includes('stone')) {
            data.material = 'stone';
            data.tool_type = 'pickaxe';
            data.tool_material = 'wood';
            data.hardess = 2
            data.mine_by_hand=false
        }

        if (data.identifier.startsWith('end_stone') || data.identifier.startsWith('end_brick')) {
            data.material = 'stone';
            data.tool_type = 'pickaxe';
            data.tool_material = 'wood';
            data.hardess = 3
            data.hand_destroy_time=15
        }

        if (data.sound.includes('copper') || data.identifier.includes('copper')) {
            data.material = 'metal';
            data.tool_type = 'pickaxe';            
            data.tool_material_minimum='stone'
        }
        if (data.identifier.startsWith('iron')) {
            data.material = 'metal';
            data.tool_type = 'pickaxe';            
            data.tool_material_minimum='stone'
            data.hand_destroy_time=15
            data.hardess=3
        }

        if (data.sound.includes('sand') || data.sound.includes('gravel')) {
            data.material = 'sand';
            data.tool_type = 'shovel';
            data.mine_by_hand=true
            
        }

        //overrides
        if (data.identifier.includes('netherite')) data.material_tier_tags = 'minecraft:diamond_tier_destructible';
        if ([ 'wool', 'carpet', 'leaves', 'vines' ].includes(data.tag)) data.tool_tags = 'minecraft:is_shears_item_destructible';

        //default calculation
        data.destroy_time = data.destroy_time || (1.5 * data.hardness) || 0.05;
        data.explosion_reistence = data.explosion_reistence || data.destroy_time * 3;
        let tool = data.tool_type || 'tool'
        if(tool =='axe') tool='hatchet'
        if(tool =='shovel') tool='digger'        
        data.tool_type_tags = `minecraft:is_${data.tool_type}_item_destructible`;
        data.tool_material_tier_tags = `minecraft:${data.tool_material}_tier_destructible`;
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
function export_blocksDotJson (tag, outpath, blocks) {

    const data = blocks
        .filter(block => { return tag == 'all' || block.tag == tag; })
        .filter(k1 => excludes.length == 0 || !excludes.includes(k1.identifier))
        .filter(k2 => includes.length == 0 || includes.includes(k2.identifier));
    if (data.length == 0) return;

    const dataOutput = { vanilla_123abcxyz789: data };
    let outputStingify = JSON.stringify(dataOutput, null, 4).replace('vanilla_123abcxyz789', `vanilla_${tag}s`);
    let outFileName = `${outpath}/vanilla_${tag}s.json`;

    fs.writeFileSync(outFileName, outputStingify);
    consoleColor.success(`Exported ${data.length} ${tag}s to: ${outFileName}`);
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

    fs.writeFileSync(outFileName, outputStingify);
    consoleColor.success(`Exported ${data.length} ${tag}s to: ${outFileName}`);
}
//=====================================================================
function crossJoins_Get (tag = "slab", blocks) {

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
    const dataCombo = [];

    data1.forEach(b1 => {
        data2
            .filter(b2a => { return b2a.index > b1.index; })
            .forEach(b2 => {
                const identifier = (b1.identifier + '.' + b2.identifier).replaceAll('_' + tag, '') + `.${tag}.combo`;
                dataCombo.push({
                    identifier: identifier,
                    identifierShort: (b1.uniqueShortKey + '.' + b2.uniqueShortKey).replaceAll('_' + tag, '') + `.${tag}.combo`,
                    title: Title(identifier.replace('.', ' & ').replaceAll('_' + tag, '').replaceAll('_', ' ').replaceAll('.', ' ')),
                    sound: b1.sound == b2.sound ? b1.sound :
                        (b1.sound.includes(b2.sound) ? b2.sound :
                            (b2.sound.includes(b1.sound) ? b1.sound : '')),
                    tool_type_tags: b1.tool_type_tags == b2.tool_type_tags ? b1.tool_type_tags : '',
                    tool_material_tier_tags: b1.tool_material_tier_tags == b2.tool_material_tier_tags ? b1.tool_material_tier_tags : '',
                    destroy_time: round((b1.destroy_time + b2.destroy_time) / 2, 1),
                    explosion_reistence: round((b1.explosion_reistence + b2.explosion_reistence) / 2, 1),
                    obj1: {
                        identifier: b1.identifier,
                        identifierShort: b1.uniqueShortKey,
                        textures: b1.textures,
                        textureList: b1.textureList,
                        sound: b1.sound,
                        tool_type_tags: b1.tool_type_tags,
                        tool_material_tier_tags: b1.tool_material_tier_tags,
                        destroy_time: b1.destroy_time,
                        explosion_reistence: b1.explosion_reistence
                    },
                    obj2: {
                        identifier: b2.identifier,
                        identifierShort: b2.uniqueShortKey,
                        textures: b2.textures,
                        textureList: b2.textureList,
                        sound: b2.sound,
                        tool_type_tags: b2.tool_type_tags,
                        tool_material_tier_tags: b2.tool_material_tier_tags,
                        destroy_time: b2.destroy_time,
                        explosion_reistence: b2.explosion_reistence
                    }
                });
            });
    });

    //use one texture

    const dataReturn = dataCombo.filter(k => includes.length == 0 || includes.includes(k.obj1.identifier || includes.includes(k.obj2.identifier)));
    if (debug) dataReturn.forEach(b => { consoleColor.log("Combo Slab :", b.obj1.identifier, "and", b.obj2.identifier); });

    return dataReturn;
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