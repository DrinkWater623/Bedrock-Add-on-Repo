//@ts-check
//File: mcDebugClass.js
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20250116 - Add Block from Ray Cast if different from View
========================================================================*/
import { world, BlockPermutation, Player, World, ItemStack, Block, system } from '@minecraft/server';
import { Vector3Lib as vec3, Vector2Lib, Vector3Lib } from './vectorClass.js';
//=============================================================================
// For Debugging
/**
 * Creates a new Debug object
 * @class
 */
export class Debug {
    /**
     * @constructor
     * @param {string} pack_name 
     * @param {boolean} [on=true] - default true
     * @param {World | Player} [chatScope] - default world
     */
    constructor(pack_name, on = false, chatScope = world) {

        this.pack_name = pack_name;
        this.debugOn = on;
        this.chatSend = chatScope;
    }
    //--------------------------------------
    off () { this.debugOn = false; this.chatSend.sendMessage(`§c${this.constructor.name} OFF"`); }
    on () { this.debugOn = true; this.chatSend.sendMessage(`"§a${this.constructor.name} On`); }
    toggle () { if (this.debugOn) this.off(); else this.on(); }
    isDebug () { return this.debugOn; }
    //--------------------------------------    
    /**
     * 
     * @param {World|Player} [chatScope ]
     */
    #ValidChatSend (chatScope) {
        if (chatScope instanceof Player) if (chatScope.isValid) return chatScope;
        return world;
    }
    /**
     * 
     * @param {string} msg 
     * @param {World|Player} chatSend 
     */
    #log (msg = "", chatSend = this.chatSend) {
        this.#ValidChatSend((chatSend)).sendMessage(msg);
    };
    /**
         * 
         * @param {string} msg 
         */
    consoleError (msg) {
        console.error(`Pack: ${this.pack_name}: Day: ${world.getDay()} @ Tick: ${system.currentTick}: §cError:§r ${msg}`);
    };
    /**
         * 
         * @param {string} msg
         * @param {boolean} override Override debugOn setting - Display anyway 
         */
    consoleLog (msg, override = false) {
        if (override || this.debugOn) console.warn(`Pack: ${this.pack_name}: Day: ${world.getDay()} @ Tick: ${system.currentTick}: Log: ${msg}`);
    };
    /**
         * 
         * @param {string} msg
         * @param {boolean} override Override debugOn setting - Display anyway 
         */
    consoleSuccess (msg, override = false) {
        if (override || this.debugOn) console.warn(`Pack: ${this.pack_name}: Day: ${world.getDay()} @ Tick: ${system.currentTick}: §aSuccess:§r ${msg}`);
    };
    /**
         * 
         * @param {string} msg
         * @param {boolean} override Override debugOn setting - Display anyway 
         */
    consoleWarn (msg, override = false) {
        if (override || this.debugOn) console.warn(`Pack: ${this.pack_name}: Day: ${world.getDay()} @ Tick: ${system.currentTick}: §6Warning:§r ${msg}`);
    };
    /**
     * 
     * @param {string} msg 
     * @param {World|Player} chatSend 
     * @param {boolean} override Override debugOn setting - Display anyway
     */
    error (msg, chatSend = this.chatSend, override = false) {
        if (override || this.debugOn) this.#log(`§cError (${this.pack_name}):§r ${msg}`, chatSend);
    };
    /**
     * 
     * @param {string} msg 
     * @param {World|Player} chatSend 
     * @param {boolean} override Override debugOn setting - Display anyway
     * @param {string} preFormat
     */
    log (msg, chatSend = this.chatSend, override = false,preFormat=`§6Log (${this.pack_name}):§r`) {
        if (override || this.debugOn) this.#log(`${preFormat}${msg}`, chatSend);
    };
    /**
     * 
     * @param {string} msg 
     * @param {World|Player} chatSend 
     * @param {boolean} override Override debugOn setting - Display anyway
     */
    success (msg, chatSend = this.chatSend, override = false) {
        if (override || this.debugOn) this.#log(`§aSuccess (${this.pack_name}):§r ${msg}`, chatSend);
    };
    /**
     * 
     * @param {BlockPermutation} permutation 
     * @param {World|Player} chatSend 
     * @param {string} title 
     * @param {boolean} override
     */
    listBlockStates (permutation, chatSend = this.chatSend, title = "Block States:", override = false) {
        if (override || this.debugOn) {
            const states = permutation?.getAllStates();
            if (!states) {
                this.#log("Zero Block States", chatSend);
                return;
            }

            this.listObjectInnards(states, chatSend = this.chatSend, title);
        }
    };
    /**
     * 
     * @param {Object} object 
     * @param {World|Player} chatSend 
     * @param {string} title 
     * @param {boolean} override
     */
    listObjectInnards (object, chatSend = this.chatSend, title = "Key-Value List:", override = false) {
        if (override || this.debugOn) {
            const entries = Object.entries(object);
            this.#log(`${title} (${entries.length})`, chatSend);
            for (const [ key, value ] of entries) {
                this.#log(`==> ${key}: ${value}`, chatSend);
                if (typeof value == 'object')
                    this.listObjectInnards(value,chatSend,key,override)
            }
        }
    };
    /**
     * 
     * @param {*[]} array 
     * @param {World|Player} chatSend 
     * @param {string} title
     * @param {boolean} override 
     */
    listArray (array, chatSend = this.chatSend, title = "Array List:", override = false) {
        if (override || this.debugOn) {
            this.#log(`${title} (${array.length})`, chatSend);
            for (let i = 0; i < array.length; i++) {
                let msg = i.toString() + ' - ';

                if (typeof array[ i ] === 'object') {
                    this.listObjectInnards(array[ i ], chatSend);
                    //TODO: account for array object
                }
                else
                    msg += array[ i ].toString();

                this.#log(`==> ${msg}`, chatSend);
            }
        }
    };
    /**
     * 
     * @param {ItemStack} item 
     * @param {World|Player} chatSend 
     * @param {string} title 
     * @param {boolean} override
     */
    itemInfo (item, chatSend = this.chatSend, title = "§eItem Info:", override = false) {
        if (override || this.debugOn) {
            if (title) this.#log(title,chatSend);
            this.#log(`==> §aItem typeId:§r ${item.typeId}`);
            const tags = item.getTags();
            const lore = item.getLore();
            const components = item.getComponents().map(c => {return c.typeId});
            const enchants = item.getComponent("enchantable")?.getEnchantments()?.map(a => `==> §bEnchantment type.id:§r ${a.type.id} §bLevel:§r ${a.level} §bof§r ${a.type.maxLevel}`);

            if (enchants && enchants.length) this.listArray(enchants, chatSend, "==> §eEnchantments:§r");
            if(tags.length) this.listArray(tags, chatSend, "==> §eTags:§r");
            if (lore.length) this.listArray(lore, chatSend, "==> §eLore:§r");
            if (components.length) this.listArray(components, chatSend, "==> §eComponents:§r");
            
        }
    };
    /**
     * 
     * @param {Block} block 
     * @param {World|Player} chatSend 
     * @param {string} title 
     * @param {boolean} override
     */
    blockInfo (block, chatSend = this.chatSend, title = "§eBlock Info:", override = false) {
        if (override || this.debugOn) {
            if (title) this.#log(title,chatSend);
            this.#log(`==> §aBlock typeId:§r ${block.typeId}`); //TODO: get display name from vanilla data
            this.#log(`==> §bBlock Location.:§r ${vec3.toString(block.location, 0, true, ',')}`);
            this.#log(`==> §bBlock Center :§r ${vec3.toString(block.center(), 1, true, ',')}`);
            this.blockPermutationInfo(block.permutation, chatSend, `${title} - Permutation`,true);
            //this.listArray(block?.getTags(), chatSend, `${title}-Tags`);  DUPE INFO
            const item = block.getItemStack()
            if (item) this.itemInfo(item,chatSend,`${title} - ItemStack`,true)
        }
    };
    /**
     * 
     * @param {BlockPermutation} permutation 
     * @param {World|Player} chatSend 
     * @param {string} title 
     * @param {boolean} override
     */
    blockPermutationInfo (permutation, chatSend = this.chatSend, title = "§eBlock Permutation Info:", override = false) {
        if (override || this.debugOn) {
            const tags = permutation.getTags();
            const states = permutation.getAllStates();
            
            if (tags.length || states.length) {                
                if (title) this.#log(title,chatSend);
                this.#log(`==> §bBlock Permutation type.id:§r ${permutation.type.id}`);

                if (tags.length) this.listArray(tags, chatSend, "§e==* permutation.getTags():");

                if (states.length) this.listObjectInnards(states, chatSend, "§e==* permutation.getAllStates():");                
            }
        }
    };
    /**
     * 
     * @param {Player} player
     * @param {Player|World} chatSend
     * @param {string} title
     * @param {boolean} override
     * @param {string} details 
     */
    playerInfo (player, chatSend = this.chatSend, title = "§ePlayer Info:", override = false, details = '') {
        if (!(override || this.debugOn)) return;
        if (!player.isValid) return;
        const fTitle = (s = '') => { return `§b${s}§r`; };
        if (title) this.#log(title,chatSend);
        let msg = ''
        msg = `${fTitle('Player:')} ${player.name} (${player.getGameMode()})`;
        //if (!details || details.includes('act'))
        msg += ` ${player.isSneaking ? ' Sneaking' :
            player.isSprinting ? ' Sprinting' :
                player.isFalling ? ' Falling' :
                    player.isClimbing ? ' Climbing' :
                        player.isSleeping ? ' Sleeping' :
                            player.isSwimming ? ' Swimming' :
                                player.isFlying ? ' Flying' :
                                    player.isEmoting ? ' Emoting' :
                                        player.isJumping ? ' Jumping' :
                                            player.getHeadLocation().y == player.location.y ? ' Crawling' : ''
            }`;

        // Rest is dependant upon asked for info, if not default all info
        if (!details || details.includes('geo')) {
            msg += `\n\n${fTitle('Location (true):')} ${player.dimension.id} @ ${vec3.toString(player.location,1,true)}`;
            msg += `\n${fTitle('Location (ceiling):')} ${player.dimension.id} @ ${vec3.toString(vec3.ceiling(player.location),0,true)}`;
            msg += `\n${fTitle('Location (rounded):')} ${player.dimension.id} @ ${vec3.toString(vec3.round(player.location),0,true)}`;
            msg += `\n${fTitle('Location (floor):')} ${player.dimension.id} @ ${vec3.toString(vec3.floor(player.location),0,true)}`;
            const spawnPoint = player.getSpawnPoint();
            if (spawnPoint) msg += `\n${fTitle('Spawns:')} ${spawnPoint.dimension.id} @ ${vec3.toString(vec3.new(spawnPoint.x, spawnPoint.y, spawnPoint.z))}`;
        }

        if (!details || details.includes('view')) {
            const rotation = player.getRotation();
            msg += `\n\n${fTitle('==* getRotation():')}`;
            msg += `\n==> §eHead Tilt §6x:§r ${round(rotation.x, 1)}`;
            const rot8 = y_rotationName(rotation.y,false);
            const rot4 = y_rotationName(rotation.y,true);
            msg += `\n==> §eBody Facing §ay:§r ${rot8} ${rot8 === rot4 ? '' : ' -> §eCardinal:§r ' + rot4}`;

            const entityView = player.getEntitiesFromViewDirection({ maxDistance: 32, ignoreBlockCollision: false });
            if (entityView.length) {
                msg += `\n\n${fTitle('==* getEntitiesFromViewDirection(max=10,ignoreBlockCollision=false)):')} ${entityView.length}`;
                entityView.forEach(e => {
                    msg += `\n==> §eEntity:§r ${e.entity.typeId} ${e.entity.nameTag ? e.entity.nameTag : ''} §e@§r ${vec3.toString(e.entity.location)} §eDistance:§r ${e.distance}`;
                });
            }
            const blockViewVd = player.getBlockFromViewDirection({ maxDistance: 16, includeLiquidBlocks: true, includePassableBlocks: true });
            if (blockViewVd) {
                msg += `\n\n${fTitle('==* getBlockFromViewDirection(max=16)):')} `;
                this.listObjectInnards(blockViewVd.block)
                //msg += `\n==> §eBlock:§r ${blockViewVd.block.typeId}`;
                //msg += `\n==> §eBlock Location:§r ${vec3.toString(blockViewVd.block.location,0,true,',')}`;
                msg += `\n==> §eBlock Face:§r ${blockViewVd.face}`;
                msg += `\n==> §eBlock Face Location:§r ${vec3.toString(blockViewVd.faceLocation, 1, true, ',')}`;

                const pixel = vec3.truncate({x:(blockViewVd.faceLocation.x*15)+1,y:(blockViewVd.faceLocation.y*15)+1,z:(blockViewVd.faceLocation.z*15)+1})
                msg += `\n==> §eBlock Face Pixel:§r ${vec3.toString(pixel, 0, true, ',')}`;
            }
            const blockViewRay = player.dimension.getBlockFromRay(
                player.location,
                player.getViewDirection(),
                { maxDistance: 16, includeLiquidBlocks: true, includePassableBlocks: true });

                
            if (blockViewRay && (!blockViewVd || !Vector3Lib.isSameLocation(blockViewVd.block.location, blockViewRay.block.location))) {
                msg += `\n\n${fTitle('==* getBlockFromViewDirection(max=16)):')} `;
                this.listObjectInnards(blockViewRay.block)
                //msg += `\n==> §eBlock:§r ${blockViewVd.block.typeId}`;
                //msg += `\n==> §eBlock Location:§r ${vec3.toString(blockViewVd.block.location,0,true,',')}`;
                msg += `\n==> §eBlock Face:§r ${blockViewRay.face}`;
                msg += `\n==> §eBlock Face Location:§r ${vec3.toString(blockViewRay.faceLocation, 1, true, ',')}`;

                const pixel = vec3.truncate({x:(blockViewRay.faceLocation.x*15)+1,y:(blockViewRay.faceLocation.y*15)+1,z:(blockViewRay.faceLocation.z*15)+1})
                msg += `\n==> §eBlock Face Pixel:§r ${vec3.toString(pixel, 0, true, ',')}`;
            }
        }

        if (!details || details.includes('tag')) {
            const tags = player.getTags();
            if (tags.length) {
                msg += `\n\n${fTitle('Tags:')} ${tags.length}`;
                tags.forEach(v => { msg += `\n==> §etag:§r ${v}`; });
            }
        }

        if (!details || details.includes('dyp')) {
            const dynamics = player.getDynamicPropertyIds();
            if (dynamics.length) {
                msg += `\n\n${fTitle('Dynamic Properties:')} ${dynamics.length}`;
                dynamics.forEach(v => {
                    const data = player.getDynamicProperty(v);
                    if (data)
                        msg += `\n==> §eKey:§r ${v} §edata:§r ${typeof data == 'string' ? v : typeof data == 'object' ? JSON.stringify(data) : data.toString()}`;
                });
            }
        }

        if (!details || details.includes('eff')) {
            const effects = player.getEffects();
            if (effects.length) {
                msg += `\n${fTitle('Effects:')} ${effects.length}`;
                effects.forEach(v => { msg += `\n==> §eEffect:§r ${v}`; });
            }
        }

        this.#log(msg, chatSend);

    }
}
/**
 * @param {number} number  
 * @param { number } decimalPlaces 
 * @returns {number}
 * 
*/
function round (number, decimalPlaces = 0) {
    if (decimalPlaces <= 0) return Math.round(number);
    let multiplier = parseInt('1' + ('0'.repeat(decimalPlaces)));
    return Math.round(number * multiplier) / multiplier;
}
/**
     * 
     * @param {number} angle angle in degrees
     * @param {boolean} cardinal NSEW only : default true
     * @returns {number} angle 
     */
function rotationCenter (angle = 0, cardinal = true) {
    const divisor = cardinal ? 4 : 8;
    let dir = Math.round(angle / (360 / divisor));
    if (dir < 0) dir += divisor;
    return dir * (cardinal ? 90 : 45);
}
/**
 * 
 * @param {number} angle angle in degrees
 * @param {boolean} cardinal NSEW only : default true
 * @returns {string} direction words
 */
function y_rotationName (angle = 0, cardinal = true) {
    const dirs = [ "S", "S W", "W", "N W", "N", "N E", "E", "S E", "S" ];
    const divisor = cardinal ? 4 : 8;
    let dir = Math.round(angle / (360 / divisor));
    if (dir < 0) dir += divisor;
    const text = dirs[ dir ]
        .replace("N", "north")
        .replace("S", "south")
        .replace("E", "east")
        .replace("W", "west")
        .replace(" ", "-");
    return text;
}