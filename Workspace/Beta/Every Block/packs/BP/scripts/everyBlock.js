//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
import { world, system, Player, ItemStack, BlockPermutation } from '@minecraft/server';
import { MinecraftBlockTypes, MinecraftItemTypes } from './common-data/vanilla-data.js';
//==============================================================================
/**
* @param {string } msg
* @param {string } preFormatting
*/
const chatMsg = function (msg, preFormatting = "") { world.sendMessage(`${preFormatting}@${system.currentTick}: §bLog:§r ${msg}`); };
/**
* @param {string } proc
* @param {string } msg
* @param {string } preFormatting
*/
const warningMsg = function (proc, msg, preFormatting = "") { console.warn(`${preFormatting}@${system.currentTick}: §6* ${proc}():§r ${msg}`); };
/**
* @param {string } proc
* @param {string } msg
* @param {string } preFormatting
*/
const errorMsg = function (proc, msg, preFormatting = "") { console.error(`${preFormatting}@${system.currentTick}: §c* ${proc}():§r ${msg}`); };

//==============================================================================
const xzAdjacentOffsets = [
    //clockwise
    { x: 0, z: -1, dir: 'north' }, //n
    { x: 1, z: -1, dir: 'ne' }, //ne
    { x: 1, z: 0, dir: 'east' }, //e
    { x: 1, z: 1, dir: 'se' }, //se
    { x: 0, z: 1, dir: 'south' }, //s
    { x: -1, z: 1, dir: 'sw' }, //sw
    { x: -1, z: 0, dir: 'west' }, //w
    { x: -1, z: -1, dir: 'nw' }  //nw
];
const yRotations = [
    { x: 30, y: 180 }, //n
    { x: 30, y: -135 },//ne
    { x: 30, y: -90 }, // e
    { x: 30, y: -45 }, //se
    { x: 30, y: 0 },   //s
    { x: 30, y: 45 },  //sw
    { x: 30, y: 90 },   //w
    { x: 30, y: 135 } //nw
];
const waterTypeId = 'minecraft:water'
//==============================================================================
class BlockInfo {
    /**
     * @param { import("@minecraft/server").Vector3 } location
     * @param { number} index
     * @param { string} key
     */
    constructor(index, key, location) {
        this.index = index,
            this.inValid = 0,
            this.displayGroup = 0,
            this.key = key,
            this.typeId = MinecraftBlockTypes[ key ],
            this.name = this.typeId.split(':')[ 1 ],
            this.isAir = false,
            this.isLiquid = false,
            this.isSolid = true,
            this.hasTags = false,
            this.tags = [],
            this.y_offset = ['cactus','waterlily'].includes(this.name) ? 1 : 0,
            this.defaultStates = {},
            /*
            button: facing_direction  Fix LATER            
            */
            this.xyz = location,

            this.isStackable = false,
            this.maxAmount = 1,
            this.hasItemTags = false,
            this.itemTags = [],
            this.placed = false;
    }
    x = () => this.xyz.x;
    y = () => this.xyz.y;
    z = () => this.xyz.z;
}
//has all blocks, custom too... so filter
//Change this... there is a BlockTypes Class, use getAll(), and map id... which is minecraft:typeId
const vbKeys = Object.keys(MinecraftBlockTypes)   
    .filter((k) => { return !k.startsWith("Chemistry"); })
    .filter((k) => { return !k.startsWith("Chemical"); })
    .filter((k) => { return !k.startsWith("Element"); })
    .filter((k) => { return !k.startsWith("InfoUpdate"); })
    .filter((k) => { return !k.startsWith("Reserved"); })
    .filter((k) => { return !k.startsWith("Unknown"); })
    .filter((k) => { return !(k.startsWith("Hard") && k.includes("Glass")); });
//==============================================================================
const vanillaBlocks = {
    initialized: false,
    blocksInGround: false,

    baseDimension: world.getDimension("overworld"),
    baseLocation: { x: 0, y: 0, z: 0 },

    blocks: vbKeys.map((k, i) => {
        const info = new BlockInfo(i, k, { x: 0, y: 0, z: 0 });
        return info;
    }),

    count: () => vanillaBlocks.blocks.length

};
//used in main.  main cannot see vanillaBlocks
export function blockCount () { return vanillaBlocks.count(); }
//==============================================================================
//==============================================================================
//  Fake Class    import * as blocks from 'this file'  to use like a class - I think
//==============================================================================d
/**
* @param { import("@minecraft/server").Player } player
*/
export function initializeBlocks (player) {
    if (!(player instanceof Player)) {
        console.error(`§c* initializeBlocks():§r player is not instanceof Player`);
        return;
    }
    chatMsg(`\n\n§g* Setting Vectors and ItemStack info For ${vanillaBlocks.count()} Blocks`);

    vanillaBlocks.baseDimension = player.dimension;
    const locationStart = player.location;
    system.run(() => { player.dimension.setBlockType({ x: locationStart.x, y: locationStart.y - 1, z: locationStart.z }, 'ctd:every_block'); });

    locationStart.x = Math.floor(locationStart.x);
    locationStart.y = Math.floor(locationStart.y);
    locationStart.z = Math.floor(locationStart.z);

    Object.assign(vanillaBlocks.baseLocation, locationStart);

    const currentLocation = { x: locationStart.x, y: locationStart.y - 1, z: locationStart.z };

    let direction = -1;
    const numberOfBlocksPer = Math.ceil(vanillaBlocks.count() / 8);

    for (let i = 0; i < vanillaBlocks.count(); i++) {

        if (i % numberOfBlocksPer === 0) { //reset
            direction++;
            chatMsg(`§6Group: ${direction} ${xzAdjacentOffsets[ direction ].dir}, Start Index: ${i}`);
            currentLocation.x = locationStart.x;
            currentLocation.z = locationStart.z;

            //pushes out one so no direction touches at the base
            currentLocation.x += xzAdjacentOffsets[ direction ].x;
            currentLocation.z += xzAdjacentOffsets[ direction ].z;
        }

        currentLocation.x += xzAdjacentOffsets[ direction ].x;
        currentLocation.z += xzAdjacentOffsets[ direction ].z;
        const sideKicks = [ { ...currentLocation }, { ...currentLocation } ];

        if (direction % 2 === 0) {  // n,s,e,w
            if (xzAdjacentOffsets[ direction ].x === 0) {
                const leftRight = [ xzAdjacentOffsets[ direction ].z, xzAdjacentOffsets[ direction ].z * -1 ];
                sideKicks.forEach((d, j) => d.x += leftRight[ j ]);
                sideKicks.forEach(d => d.z += xzAdjacentOffsets[ direction ].z);
            }
            else { //z===0
                const leftRight = [ xzAdjacentOffsets[ direction ].x, xzAdjacentOffsets[ direction ].x * -1 ];
                sideKicks.forEach((d, j) => d.z += leftRight[ j ]);
                sideKicks.forEach(d => d.x += xzAdjacentOffsets[ direction ].x);
            }
            sideKicks.unshift({ ...currentLocation });
            currentLocation.x += xzAdjacentOffsets[ direction ].x;
            currentLocation.z += xzAdjacentOffsets[ direction ].z;
        }
        else { //ne,nw,sw,se            
            sideKicks[ 0 ].x += xzAdjacentOffsets[ direction ].x * 2;
            sideKicks[ 1 ].z += xzAdjacentOffsets[ direction ].z * 2;
            sideKicks.unshift({ ...currentLocation });
        }
        if (i + 2 >= vanillaBlocks.count() || (i + 2) % numberOfBlocksPer === 0) sideKicks.pop();
        if (i + 1 >= vanillaBlocks.count() || (i + 1) % numberOfBlocksPer === 0) sideKicks.pop();

        //Sidekicks        
        for (let j = 0; j < sideKicks.length; j++) {
            if (j > 0) i++;
            vanillaBlocks.blocks[ i ].xyz.x = sideKicks[ j ].x;
            vanillaBlocks.blocks[ i ].xyz.y = sideKicks[ j ].y + vanillaBlocks.blocks[ i ].y_offset;
            vanillaBlocks.blocks[ i ].xyz.z = sideKicks[ j ].z;
            vanillaBlocks.blocks[ i ].displayGroup = direction;
            blockItemStackPropertiesGet(i);

            //Test if already there - if so get info
            const block = player.dimension.getBlock(vanillaBlocks.blocks[ i ].xyz);
            if (block && block.typeId === vanillaBlocks.blocks[ i ].typeId) {
                vanillaBlocks.blocks[ i ].placed = true;
                blockBlockPropertiesGet(player, i);
            }
        }
    }

    vanillaBlocks.initialized = true;
    chatMsg(`§a===> Success`);

    //See it blocks were placed before    
}
function blockItemStackPropertiesGet (i = 0) {
    if (i < 0 || i >= vanillaBlocks.count()) return;

    const block = vanillaBlocks.blocks[ i ];

    const typeId = MinecraftItemTypes[ block.key ];
    if (typeId) {
        const item = new ItemStack(typeId);
        if (item) {
            block.isStackable = item.isStackable;
            block.maxAmount = item.maxAmount;
            item.getTags().forEach(t => block.itemTags.push(t));
            block.hasItemTags = !!block.itemTags.length;
        }
    }
}
/**
 * @param { import("@minecraft/server").Player } player
 * @param { number} i
 */
function blockBlockPropertiesGet (player, i) {
    if (!vanillaBlocks.blocks[ i ].placed) {
        errorMsg('blocksInfoOne', 'vanillaBlocks is not initialized/set - call initializeBlocks or setBlocks first');
        return;
    }
    const blockInfo = vanillaBlocks.blocks[ i ];
    if (blockInfo) {
        const block = player.dimension.getBlock(blockInfo.xyz);
        if (block) {
            if (block.typeId === "minecraft:air" && blockInfo.typeId !== block.typeId) {
                let msg = `BLOCK is AIR @ ${blockInfo.x()},${blockInfo.y()},${blockInfo.z()} - index: ${blockInfo.index}`;
                msg += `, key: ${blockInfo.key}`;
                msg += `, typeId: ${blockInfo.typeId}`;
                chatMsg(msg);
            }
            else {

                blockInfo.isAir = block.isAir;
                blockInfo.isLiquid = block.isLiquid;
                blockInfo.isSolid = block.isSolid;
                block.getTags().forEach(tag => blockInfo.tags.push(tag));
                blockInfo.hasTags = !!blockInfo.tags.length;
            }
        }
        else {
            let msg = `NO BLOCK @ ${blockInfo.xyz.x},${blockInfo.xyz.y},${blockInfo.xyz.z} - index: ${blockInfo.index}`;
            msg += `, key: ${blockInfo.key}`;
            msg += `, typeId: ${blockInfo.typeId}`;
            chatMsg(msg);
        }
    }
}
/**
* @param { import("@minecraft/server").Player } player
*/
export function placeBlocks (player) {
    if (!(player instanceof Player)) {
        console.error(`§c*setBlocks():§r player is not instanceof Player`);
        return;
    }
    if (!vanillaBlocks.initialized) initializeBlocks(player);

    placeBlocksRange(player, 0, vanillaBlocks.count() - 1);
}
/** This will set the block and get the block info of the live block
   * @param { import("@minecraft/server").Player } player
   * @param { number} from
   * @param { number} to
   */
export function placeBlocksRange (player, from = 0, to = vanillaBlocks.count() - 1) {
    if (!(player instanceof Player)) {
        errorMsg('placeBlocksRange', `player is not instanceof Player`);
        return;
    }
    if (!vanillaBlocks.initialized) {
        errorMsg('setBlocksRange', 'vanillaBlocks is not initialized/set - call initializeBlocks first');
        return;
    }
    if (from < 0 || from > to || to >= vanillaBlocks.count()) {
        errorMsg('placeBlocksRange', `From (${from}) / To (${to}) : out of range`);
        return;
    }
    chatMsg(`\n\n§g* Placing Vanilla Blocks [${from} - ${to}]`);

    const dimension = vanillaBlocks.baseDimension;
    if (dimension.id != player.dimension.id) player.teleport(vanillaBlocks.baseLocation, { dimension: dimension, rotation: yRotations[ 0 ] });
    const savePlayerLocation = player.location;

    let tickDelay = 0;
    let direction = -1; //just for display

    for (let i = from; i <= to; i++) {

        system.runTimeout(() => {
            const blockInfo = vanillaBlocks.blocks[ i ];
            if (blockInfo) {
                if (direction < blockInfo.displayGroup) {
                    direction = blockInfo.displayGroup;
                    chatMsg(`§6Group: ${direction} ${xzAdjacentOffsets[ direction ].dir}, Start Index: ${i}`);
                }

                let tickDelay2 = 0;

                if (Math.abs(player.location.x - blockInfo.xyz.x) > 32 || Math.abs(player.location.z - blockInfo.xyz.z) > 32) tickDelay2++;
                if (Math.abs(player.location.x - blockInfo.xyz.x) > 16 || Math.abs(player.location.z - blockInfo.xyz.z) > 16) {
                    const location = { ...blockInfo.xyz };
                    location.y += 5;
                    player.teleport(location, { rotation: yRotations[ vanillaBlocks.blocks[ i ].displayGroup ] });
                }
                else {
                    if (vanillaBlocks.blocks[ i ].y_offset === -1) {
                        const newAir = { x: blockInfo.xyz.x, y: blockInfo.xyz.y + 1, z: blockInfo.xyz.z };
                        dimension.setBlockType(newAir, 'minecraft:air');
                        tickDelay2 = 1;
                    }
                }
                system.runTimeout(() => {
                    //Object.keys(blockInfo.defaultStates).length > 0
                    if (blockInfo.name.endsWith('_button')) {
                        const buttonBlock = BlockPermutation.resolve(blockInfo.typeId, { facing_direction: 1 });
                        dimension.setBlockPermutation(blockInfo.xyz, buttonBlock);
                    }
                    else if (['ladder'].includes(blockInfo.name)) {
                        const buttonBlock = BlockPermutation.resolve(blockInfo.typeId, { facing_direction: 2 });
                        dimension.setBlockPermutation(blockInfo.xyz, buttonBlock);
                    }
                    //"direction" = 0, "door_hinge_bit" = false, "open_bit" = true, "upper_block_bit" = false
else if (blockInfo.name.endsWith('_door')) {
    const topDoorBlock = BlockPermutation.resolve(blockInfo.typeId, {
        direction: 0,
        door_hinge_bit: true,
        open_bit: false,
        upper_block_bit: true
    });
    const bottomDoorBlock = BlockPermutation.resolve(blockInfo.typeId, {
        direction: 0,
        door_hinge_bit: true,
        open_bit: false,
        upper_block_bit: false
    });
    dimension.setBlockPermutation({x:blockInfo.xyz.x,y:blockInfo.xyz.y+1,z:blockInfo.xyz.z}, topDoorBlock);
    dimension.setBlockPermutation(blockInfo.xyz, bottomDoorBlock);
}
                    else if (blockInfo.name === 'vine') {
                        const vineBlock = BlockPermutation.resolve(blockInfo.typeId, { vine_direction_bits: 2 });
                        dimension.setBlockPermutation(blockInfo.xyz, vineBlock);
                    }
                    else if (['reeds'].includes(blockInfo.name)) {
                        dimension.setBlockType(blockInfo.xyz,  MinecraftBlockTypes.Water);
                        dimension.setBlockType(blockInfo.xyz,  blockInfo.typeId);
                    }
                    else if (['waterlily'].includes(blockInfo.name)) {
                        dimension.setBlockType({x:blockInfo.xyz.x,y:blockInfo.xyz.y-1,z:blockInfo.xyz.z},  MinecraftBlockTypes.Water);
                        dimension.setBlockType(blockInfo.xyz,  blockInfo.typeId);
                    }
                    else {
                        dimension.setBlockType(blockInfo.xyz, blockInfo.typeId);
                    }

                    blockInfo.placed = true;
                    system.runTimeout(() => { blockBlockPropertiesGet(player, i); }, 1);
                }, tickDelay2);
            }
            else warningMsg('placeBlocksRange', `No block info for index = ${i} - Cannot set block in world`);
        }, tickDelay++);
    }

    system.runTimeout(() => {
        player.teleport(savePlayerLocation);
        vanillaBlocks.blocksInGround = true;
        chatMsg(`§a===> Done Placing\n`);
    }, tickDelay);
}
/**
 * @param { import("@minecraft/server").Player } player
 * @param { number} i
 */
export function goto (player, i) {
    if (i >= vanillaBlocks.count()) {
        player.sendMessage(`§cOnly ${vanillaBlocks.count()} blocks available`);
        return;
    }
    const location = Object.assign({}, vanillaBlocks.blocks[ i ].xyz);
    location.y++;
    const dimension = vanillaBlocks.baseDimension;
    system.run(() => {
        if (dimension.id != player.dimension.id) player.teleport(location, { dimension: dimension });
        else player.teleport(location);
    });
}
/**
 * @param { import("@minecraft/server").Player } player
 * @param { number} i
 */
export function blockInfoDisplay (player, i) {
    if (i >= vanillaBlocks.count()) {
        player.sendMessage(`§cOnly ${vanillaBlocks.count()} blocks available`);
        return;
    }
    const blockInfo = vanillaBlocks.blocks[ i ];
    //vector: ${vector3Msg(blockInfo.xyz)}
    let msg = `§bGrp: ${blockInfo.displayGroup} index: ${blockInfo.index} §r`;
    msg += `\n===> key: §a${blockInfo.key}§r`;
    msg += `\n===> typeId: ${blockInfo.typeId}`;
    msg += `\n===> isAir: ${blockInfo.isAir}`;
    msg += `\n===> isLiquid: ${blockInfo.isLiquid}`;
    msg += `\n===> isSolid: ${blockInfo.isSolid}`;

    msg += `\n===> hasTag: ${blockInfo.hasTags}`;
    if (blockInfo.hasTags) {
        msg += ` => [`;
        blockInfo.tags.forEach((tag, index) => { msg += `${index === 0 ? '' : ','} ${tag}`; });
        msg += ` ]`;
    }
    //Pulled from ItemStack
    msg += `\n===> isStackable: ${blockInfo.isStackable}`;
    if (blockInfo.isStackable) msg += ` => ${blockInfo.maxAmount}`;

    msg += `\n===> hasItemTag: ${blockInfo.hasItemTags}`;
    if (blockInfo.hasItemTags) {
        msg += ` => [`;
        blockInfo.itemTags.forEach((tag, index) => { msg += `${index === 0 ? '' : ','} ${tag}`; });
        msg += ` ]`;
    }
    msg += `\n===> ${xzAdjacentOffsets[ blockInfo.displayGroup ].dir} vector: ${vector3Msg(blockInfo.xyz)} : ${blockInfo.placed ? '§aplaced' : '§6not placed'}`;

    player.sendMessage(`${msg}\n\n`);
}

/**
 * @param { import("@minecraft/server").Player } player
 */
export function thisBlockRightHereStates (player) {

    const playerLocation = player.location;
    playerLocation.y--
    vector3Msg(playerLocation)
    const block = player.dimension.getBlock(playerLocation)
    if (!block) {
        player.sendMessage(`No Block there ${vector3Msg(playerLocation)}`)
        return
    }

    const states = block.permutation.getAllStates()
    if (states.length ==0 ) {
        player.sendMessage(`No States on this block = ${block.typeId}`)
        return
    }

    if (typeof states == 'string')
        player.sendMessage(`${block.typeId} - ${states}`)
    else if (typeof states == 'object') {
        
        const keys = Object.keys(states)
        for (let i = 0 ; i < keys.length; i++) {
            player.sendMessage(`${block.typeId} - ${keys[i]} = ${states[keys[i]]}`)            
        }
    }
}
/**
 * @param { import("@minecraft/server").Player } player
 */
export function thisBlockRightHere (player) {
    //find index to block where I am standing.
    const playerLocation = player.location;
    playerLocation.x = Math.floor(playerLocation.x);
    playerLocation.z = Math.floor(playerLocation.z);

    //chatMsg(`§gLooking for`)

    let index = -1;
    for (let i = 0; i < vanillaBlocks.count(); i++) {
        if (vanillaBlocks.blocks[ i ].x() === playerLocation.x && vanillaBlocks.blocks[ i ].z() === playerLocation.z) {
            index = i;
            break;
        }
    }

    if (index >= 0) {
        blockInfoDisplay(player, index);
    }
    else chatMsg(`§cNo Blocks from the Table are at this location`);
}
/** 
 * @param { string} filter
 * @param { string} search
 */
export function listFilter (filter, search = 'i') {

    let pool = vanillaBlocks.blocks
        .filter(block => { return block.name.includes(filter); })
        .map(block => { return { index: block.index, name: block.name }; });

    if (search == 'ew' && pool.length) {
        const match = pool.filter(b => { return b.name.endsWith(filter); });
        pool = match;
    }
    if (search == 'sw' && pool.length) {
        const match = pool.filter(b => { return b.name.startsWith(filter); });
        pool = match;
    }

    if (!pool.length) { chatMsg(`§cNo Blocks Match (${search}) Filter = "${filter}"`); return; }

    pool.forEach(block => world.sendMessage(`§e${block.index} - §r${block.name}`));
    world.sendMessage(`§a===> ${pool.length} Matches\n\n`);
}
/** 
 * @param { string} filter
 */
export function tagFilter (filter, search = 'i', nameLike = '') {

    const pool = vanillaBlocks.blocks
        .filter(block => { return block.hasTags || block.hasItemTags; })
        .map(b => {
            return {
                index: b.index,
                name: b.name,
                bTags: b.tags,
                iTags: b.itemTags,
                blockTagList: b.tags.join(', '),
                itemTagList: b.itemTags.join(', ')
            };
        });

    if (pool.length === 0) { chatMsg(`§cNo Blocks Have Tags`); return; }

    let tagPool = pool
        .filter(f => { return (!filter.length) || (f.blockTagList.includes(filter) || f.itemTagList.includes(filter)); })
        .map(b => {
            return {
                index: b.index,
                name: b.name,
                bTags: b.bTags,
                iTags: b.iTags,
                blockTagList: b.blockTagList,
                itemTagList: b.itemTagList,
                allTagsList: ((b.blockTagList.length ? '§bBT: ' + b.blockTagList : '') +
                    (b.itemTagList.length ? '  §6IT: ' + b.itemTagList : '')).trim()
            };
        });

    if (tagPool.length === 0) { chatMsg(`§cNo Block Tags Match Filter = "${filter}"`); return; }

    if (nameLike && tagPool.length) {
        const match = tagPool
            .filter(b => { return b.name.includes(nameLike); });
        tagPool = match;
    }
    if (search.startsWith('=') && tagPool.length) {
        const match = tagPool
            .filter(b => { return b.bTags.some(tag => tag == filter) || b.iTags.some(tag => tag == filter); });
        tagPool = match;
    }
    if (search == 'ew' && tagPool.length) {
        const match = tagPool
            .filter(b => { return b.bTags.some(tag => tag.endsWith(filter)) || b.iTags.some(tag => tag.endsWith(filter)); });
        tagPool = match;
    }
    if (search == 'sw' && tagPool.length) {
        const match = tagPool
            .filter(b => { return b.bTags.some(tag => tag.startsWith(filter)) || b.iTags.some(tag => tag.startsWith(filter)); });
        tagPool = match;
    }
    if (tagPool.length === 0) {
        chatMsg(`§cNo Block Tags Match (${search}) Filter = "${filter}"`);
        return;
    }
    tagPool.forEach(block => world.sendMessage(`§e${block.index} - §r${block.name} => ${block.allTagsList}`));
    world.sendMessage(`§a===> ${tagPool.length} Matches\n\n`);
}
export function missingBlockList () {

    if (!vanillaBlocks.initialized) {
        errorMsg('missingBlockList', 'vanillaBlocks is not initialized/set - call initializeBlocks first');
        return;
    }

    let pool = vanillaBlocks.blocks
        .filter(block => { return !block.placed; })
        .map(block => { return { index: block.index, name: block.name }; });

    if (!pool.length) { chatMsg(`§cNo Missing Blocks"`); return; }

    pool.forEach(block => world.sendMessage(`§e${block.index} - §r${block.name}`));
    world.sendMessage(`§a===> ${pool.length} Matches\n\n`);
}
/**
* @param { import("@minecraft/server").Vector3 } location
*/
function vector3Msg (location) {
    return `${Math.floor(location.x)}, ${Math.floor(location.y)}, ${Math.floor(location.z)}`;
}