//@ts-check
import { Block, BlockPermutation, Direction, EquipmentSlot, Player, system, world } from "@minecraft/server";
import { endsWithNumber, getLastWord, minusLastWord } from "./commonLib/stringLib.js";
import { chatLog, watchFor } from "./settings.js";
import { vanilla_blocks } from "./commonLib/blocks.json.js";
//==============================================================================
/**
 * 
 * @param {string} typeID 
 * @returns {string}
 */
function baseBlockTypeIDFromSlab (typeID) {
    return typeID.split("_slab_", 1)[ 0 ];
}
//==
/**
 * 
 * @param {Block} block 
 * @param {Direction | string} blockFace 
 * @returns {Block | undefined}
 */
export function getAdjacentBlock (block, blockFace, opposite = false,debug = false) {

    if (!block || !block.isValid()) {
        chatLog.error('Invalid Block', debug);
        return undefined;
    }

    blockFace = blockFace.toLowerCase();

    switch (blockFace) {
        case 'below':
        case 'down':
            return opposite ? block.above(1) : block.below(1);
            break;
        case 'above':
        case 'up':
            return  opposite ? block.below(1) : block.above(1);
            break;
        case 'north':
            return opposite ? block.south(1) : block.north(1);
            break;
        case 'south':
            return opposite ? block.north(1) : block.south(1);
            break;
        case 'east':
            return opposite ? block.west(1) : block.east(1);
            break;
        case 'west':
            return opposite ? block.east(1) : block.west(1);
            break;
        default:
            return undefined;
    }
}
//==============================================================================
/**
 * 
 * @param {Block} block
 * @param {string} stateName
 * @param {('string'|'number'|'boolean')} expectedType 
 * @param {boolean} [fail=true]   
 * @returns 
 */
export function getBlockState (block, stateName, expectedType, fail = true) {

    if (!block || !block.isValid()) {
        throw new Error("Invalid Block");
    }

    const stateValue = block.permutation.getState(stateName);
    let errMsg = '';
    if (!stateValue) {
        errMsg = `${block.typeId} is missing valid ${stateName} state`;
    }
    else if (typeof stateValue != expectedType)
        errMsg = `${block.typeId} ${stateName} trait is not a string: ${stateValue}`;

    if (errMsg) {
        if (fail)
            throw new Error(errMsg);

        return undefined;
    }

    return stateValue;
}
//==============================================================================
/**
 * 
 * @param {Block} block 
 * @returns 
 */
export function getDw623SlabBlockFace (block) {

    if (!block || !block.isValid()) {
        throw new Error("Invalid Block");
    }

    const stateName = 'minecraft:block_face';
    const currentBlockFace = getBlockState(block, stateName, 'string', true)?.toString() ?? '';

    if (!"up.down.north.south.east.west".includes(currentBlockFace))
        throw new Error(`§rdw623 Slab ${stateName} trait has invalid (n.s.e.w) value: ${currentBlockFace}`);

    return currentBlockFace;
}
//==============================================================================
/**
 * 
 * @param {string} cardinalDirection 
 * @param {number} leftOrRightEnum
 */
export function getPerpendicularFace (cardinalDirection, leftOrRightEnum = 0) {

    cardinalDirection = cardinalDirection.toLowerCase();
    if ("north.south.east.west".includes(cardinalDirection)) {
        if (leftOrRightEnum == 0)
            switch (cardinalDirection) {
                case 'north':
                    return 'west';
                case 'south':
                    return 'east';
                case 'west':
                    return 'south';
                case 'east':
                    return 'north';
                default:
                    return '';
            }
        else
            switch (cardinalDirection) {
                case 'north':
                    return 'east';
                case 'south':
                    return 'west';
                case 'west':
                    return 'north';
                case 'east':
                    return 'south';
                default:
                    return '';
            }
    }
    else
        return '';
}
/**
 * 
 * @param {string} typeId 
 */
function getLikelyPlaceBlockSound (typeId) {

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

    if (typeId.endsWith('_log') ||
        typeId.endsWith('_plank') ||
        typeId.endsWith('_wood') ||
        typeId.includes('_log_') ||
        typeId.includes('_plank_') ||
        typeId.includes('_wood_') ||
        typeId.includes('acacia_') ||
        typeId.includes('birch_') ||
        typeId.includes(':cherry_') ||
        typeId.includes('jungle_') ||
        typeId.includes('mangrove_') ||
        typeId.includes('oak_') ||
        typeId.includes('spruce_')
    )
        return 'use.wood';

    const base = typeId.split(':')[ 1 ];
    if (Object.keys(vanilla_blocks).includes(base)) {
        const vb = vanilla_blocks[ base ];
        if (vb){
            const sound = vb.sound
            if(sound)
                return sound
        }
    }

    return 'hit.stone';
}
//==============================================================================
/**
 * 
 * @param {Block} block 
 * @param {string} typeId 
 * @param {string} [sound=''] 
 */
export function placeBlock (block, typeId, sound = '') {

    if (block.isValid()) {
        if (!sound)
            sound = getLikelyPlaceBlockSound(typeId);

        system.run(() => {
            block.dimension.playSound(sound,block.location)
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
 * @param {Player} player 
 * @returns 
 */
function mainHandCount (player) {
    const equipment = player.getComponent('equippable');
    if (!equipment)
        return 0;

    const selectedItem = equipment.getEquipment(EquipmentSlot.Mainhand);
    if (!selectedItem)
        return 0;

    return selectedItem.amount;
}
//==============================================================================
/**
 * 
 * @param {Block} block 
 * @param {BlockPermutation} permutation
 */
export function placeBlockPermutation (block, permutation,sound='') {
    if (block.isValid()) {
        if (!sound)
            sound = getLikelyPlaceBlockSound(permutation.type.id);
        
        //chatLog.send(world,`  ==> Sound: §a${sound}`,true)

        system.run(() => { 
            block.dimension.playSound(sound,block.location,{volume:10})
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
 */
export function placeBlockWithStates (block, newTypeId, states) {
    if (Object.keys(states).length == 0) {
        return placeBlock(block, newTypeId);
    }
    else {
        const permutation = BlockPermutation.resolve(newTypeId, states);
        return placeBlockPermutation(block, permutation);
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
export function placeDw623Slab (block, newTypeId, blockFace, airOnly = true, debug = false) {

    if (airOnly && !watchFor.fallThruBlocks.includes(block.typeId)) {
        chatLog.warn(`  ==> Block already in location`, debug);
        return false;
    }

    return replaceDw623Slab(block, newTypeId, blockFace);
}
//==============================================================================
/**
 * 
 * @param {Block} block 
 * @param {string} newTypeId 
 * @param {string} blockFace 
 */
export function replaceDw623Slab (block, newTypeId, blockFace) {
    //const verticalHalf = blockFace=='up' ? 'bottom':'top'
    const newSlabPermutation = BlockPermutation.resolve(newTypeId, { 'minecraft:block_face': blockFace });
    return placeBlockPermutation(block, newSlabPermutation);
}
//==============================================================================
/**
 * 
 * @param {string} typeID 
 * @returns {string}
 */
export function slabTypeIDSansHeight (typeID) {
    if (endsWithNumber(typeID)) {
        return minusLastWord(typeID, '_');
    }
    else {
        return typeID;
    }
}
//==============================================================================
/**
 * 
 * @param {string} typeID 
 * @returns {number}
 */
export function slabTypeIDHeight (typeID) {
    if (endsWithNumber(typeID)) {
        const lastWord = getLastWord(typeID, '_');
        return parseInt(lastWord) ?? 0;
    }
    else
        return 0;
}
//==============================================================================
// End of File
//==============================================================================