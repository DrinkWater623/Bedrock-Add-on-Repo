//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
import { Block, BlockPermutation, system } from "@minecraft/server";
import { chatLog } from "./settings.js";
import { blocksDotJson } from "./common-data/blocks.json.js";
import { MinecraftBlockTypes, MinecraftItemTypes } from "./common-data/vanilla-data.js";
import { sound_definitions } from "./common-data/sound_definitions.js";
import { fallThruBlocks, woodenBlocks } from "./common-data/block-data.js";
//==============================================================================
//==============================================================================
/**
 * 
 * @param {string} typeId 
 * @param {string} [soundLike=''] 
 */
function getLikelyPlaceBlockSound (typeId, soundLike = '') {
    const debug=false
    let findSoundForId;

    if (soundLike && soundLike.startsWith('minecraft:'))
        findSoundForId = soundLike.replace('minecraft:', '');
    else if (typeId.startsWith('minecraft:'))
        findSoundForId = typeId.replace('minecraft:', '');

    if (findSoundForId) {
        const foundBlock = blocksDotJson[ findSoundForId ];
        if (foundBlock && foundBlock.sound) {

            let placeSound = 'place.' + foundBlock.sound;
            if (sound_definitions[ placeSound ]) {
                chatLog.success(`Sound: ${placeSound}`,debug)
                return placeSound;
            }

            placeSound = 'block.' + foundBlock.sound+'.place';
            if (sound_definitions[ placeSound ]) {
                chatLog.success(`Sound: ${placeSound}`,debug)
                return placeSound;
            }

            //test one to change
            placeSound = 'dig.' + foundBlock.sound;
            if (sound_definitions[ placeSound ]) {
                chatLog.success(`Sound: ${placeSound}`,debug)
                return placeSound;
            }

            placeSound = 'block.' + foundBlock.sound+'.dig';
            if (sound_definitions[ placeSound ]) {
                chatLog.success(`Sound: ${placeSound}`,debug)
                return placeSound;
            }

            placeSound = 'hit.' + foundBlock.sound;
            if (sound_definitions[ placeSound ]) {
                chatLog.success(`Sound: ${placeSound}`,debug)
                return placeSound;
            }

            placeSound = 'break.' + foundBlock.sound;
            if (sound_definitions[ placeSound ]) {
                chatLog.success(`Sound: ${placeSound}`,debug)
                return placeSound;
            }

            placeSound = 'use.' + foundBlock.sound;
            if (sound_definitions[ placeSound ]) {
                chatLog.success(`Sound: ${placeSound}`,debug)
                return placeSound;
            }

            chatLog.warn('Did not find normal sound for block',debug);
        }
        else chatLog.warn('No MC block given',debug);
    }

    if (woodenBlocks.includes(typeId)) {
        chatLog.warn('In woodBlocks',debug);

        if (typeId.includes('crimson') || typeId.includes('warped'))
            return 'place.nether_wood';

        if (typeId.includes('cherry'))
            return 'place.cherry_wood';

        if (typeId.includes('bamboo'))
            return 'place.bamboo_wood';

        return 'dig.wood';
    }
    /*
        dig.wood
        fall.wood
        "hit.wood"
        "land.wood"
        "step.wood"
        "use.wood"
    
        "break.nether_wood" 
        "fall.nether_wood"
        "hit.nether_wood"
        "place.nether_wood"
        "step.nether_wood"    
        
        "break.cherry_wood" 
        "fall.cherry_wood"
        "hit.cherry_wood"
        "place.cherry_wood"
        "step.cherry_wood"

        "break.bamboo_wood"
        "fall.bamboo_wood"
        "hit.bamboo_wood"
        "place.bamboo_wood"
        "step.bamboo_wood"
    */
    if (typeId.includes('stone'))
        return 'hit.stone';

    if (typeId.includes('soul_sand'))
        return 'use.soul_sand';

    if (typeId.endsWith('_sand') ||
        typeId.includes('_sand_')
    )
        return 'use.sand';

    if (typeId.includes('wool') ||
        typeId.includes('carpet')
    )
        return 'use.cloth';

    if (typeId.includes('gravel'))
        return 'use.gravel';

    if (typeId.includes('powder_snow'))
        return 'place.powder_snow';

    if (typeId.includes('powder'))
        return 'place.sand';

    if (typeId.includes('snow'))
        return 'use.snow';

    const base = typeId.split(':')[ 1 ];
    if (Object.keys(blocksDotJson).includes(base)) {
        const vb = blocksDotJson[ base ];
        if (vb) {
            const sound = vb.sound;
            if (sound)
                return sound;
        }
    }

    chatLog.warn('Using Default Sound',debug);
    return 'hit.stone';
}
//==============================================================================
/**
 * 
 * @param {Block} block 
 * @param {string} typeId 
 * @param {string} [sound=''] 
 * @param {string} [soundLike=''] 
 */
export function placeBlock (block, typeId, sound = '', soundLike = '') {

    if (block.isValid()) {
        if (!sound)
            sound = getLikelyPlaceBlockSound(typeId, soundLike);


        system.run(() => {
            block.dimension.playSound(sound, block.location);
            block.setType(typeId);
        });
        return true;
    }
    else
        return false;
}
//==============================================================================
/**
 * 
 * @param {Block} block 
 * @param {BlockPermutation} permutation
 * @param {string} [sound=''] 
 * @param {string} [soundLike=''] 
 */
export function placeBlockPermutation (block, permutation, sound = '', soundLike = '') {
    if (block.isValid()) {
        if (!sound)
            sound = getLikelyPlaceBlockSound(permutation.type.id,soundLike);

        //chatLog.send(world,`  ==> Sound: §a${sound}`,true)

        system.run(() => {
            block.dimension.playSound(sound, block.location, { volume: 10 });
            block.setPermutation(permutation);
        });

        // TODO:  try????

        return true;
    }
    else
        return false;
}
//==============================================================================
/**
 * 
 * @param {Block} block 
 * @param {string} newTypeId 
 * @param {Object} states 
 * @param {string} [sound=''] 
 * @param {string} [soundLike=''] 
 */
export function placeBlockWithStates (block, newTypeId, states, sound='',soundLike = '') {
    if (Object.keys(states).length == 0) {
        return placeBlock(block, newTypeId,sound,soundLike);
    }
    else {
        const permutation = BlockPermutation.resolve(newTypeId, states);
        return placeBlockPermutation(block, permutation,sound,soundLike);
    }
}
//==============================================================================
/**
 * 
 * @param {Block} block 
 * @param {string} newTypeId 
 * @param {string} blockFace 
 * @param {boolean} airOnly 
 */
export function placeDw623Slab (block, newTypeId, blockFace, airOnly = true, sound='',soundLike='') {

    if (airOnly && !fallThruBlocks.includes(block.typeId)) {
        return false;
    }

    return replaceDw623Slab(block, newTypeId, blockFace,sound,soundLike);
}
//==============================================================================
/**
 * 
 * @param {Block} block 
 * @param {string} newTypeId 
 * @param {string} blockFace
 * @param {string} [sound=''] 
 * @param {string} [soundLike='']  
 */
export function replaceDw623Slab (block, newTypeId, blockFace,sound='',soundLike='') {
    //const verticalHalf = blockFace=='up' ? 'bottom':'top'
    const newSlabPermutation = BlockPermutation.resolve(newTypeId, { 'minecraft:block_face': blockFace });
    return placeBlockPermutation(block, newSlabPermutation,sound,soundLike);
}
//==============================================================================
// End of File
//==============================================================================