import { world, BlockPermutation, Player, World, ItemStack, Block } from '@minecraft/server';
//=============================================================================
/* Change Log
    20240630 - altered a little to not ask for valid chatSend all the time and 
                added default to constructor and
                own title for lists
                TODO: add playerInfo
*/
//=============================================================================
// For Debugging
export class McDebug {
    constructor(booleanValue = false, chatScope) {

        this.debugOn = booleanValue;
        this.chatSend = (chatScope instanceof Player) ? chatScope : world;

    }
    //--------------------------------------
    off () { this.debugOn = false; world.sendMessage(`§c${this.constructor.name} OFF"`); }
    on () { this.debugOn = true; world.sendMessage(`"§a${this.constructor.name} On`); }
    toggle () { if (this.debugOn) this.off(); else this.on(); }
    isDebug () { return this.debugOn; }
    //--------------------------------------    
    #isValidChatSend (chatScope) {
        if (chatScope instanceof Player) if (chatScope.isValid()) return true;
        if (chatScope instanceof World) return true;
        return false;
    }
    #ValidChatSend (chatScope = null) {
        return this.#isValidChatSend(chatScope) ? chatScope : this.chatSend;
    }
    #log (msg = "", chatSend = this.chatSend) {
        chatSend = this.#ValidChatSend((chatSend));
        chatSend.sendMessage(msg);
    };
    log (msg = "", chatSend = this.chatSend) {
        if (this.debugOn) this.#log(msg, chatSend);
    };
    listBlockStates (permutation = {}, chatSend = this.chatSend, title = "Block States:") {
        if (!this.debugOn) return;
        if (!(permutation instanceof BlockPermutation)) return;

        const states = permutation?.getAllStates();
        if (!states) {
            this.#log("Zero Block States", chatSend, title);
            return;
        }

        this.listObjectInnards(states, chatSend = this.chatSend);
    };
    listObjectInnards (object = {}, chatSend = this.chatSend, title = "Key-Value List:") {
        if (!this.debugOn) return;
        if (!(typeof object == "object")) return;

        const entries = Object.entries(object);
        this.#log(`${title} (${entries.length})`, chatSend);
        for (const [ key, value ] of entries) {
            this.#log(`==> ${key}: ${value}`, chatSend);
        }
    };
    listArray (array = {}, chatSend = this.chatSend, title = "Array List:") {
        if (!this.debugOn) return;
        if (!Array.isArray(array)) return;

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
    };
    itemInfo (item, chatSend = this.chatSend, title = "§eItem Info:") {
        if (!(item instanceof ItemStack)) return;
    
        this.#log(`item.typeId: ${item.typeId} - item.type.id: ${item.type.id}`);
        this.listArray(item.getTags(), chatSend, "Tags:");
        this.listArray(item.getLore(), chatSend, "Lore:");

        const enchants = item.getComponent("enchantable")?.getEnchantments()?.map(a => `type.id: ${a.type.id} level: ${a.level} of ${a.type.maxLevel}`);
        this.listArray(enchants, chatSend, "Enchantments:");
    };
    blockInfo (block, chatSend = this.chatSend, title = "§eBlock Info:") {
        if (!(block instanceof Block)) return;

        this.#log(`block.(xyz): ${block.x}, ${block.y}, ${block.z} - block.location.(xyz): ${block.location.x}, ${block.location.y}, ${block.location.z}`);
        this.#log(`block.center.(xyz): ${block.center().x}, ${block.center().y}, ${block.center().z}`);
        this.#log(`block.typeId: ${block.typeId} - block.type.id: ${block.type.id}`);
        this.listArray(block?.getTags(), chatSend, "Block-Tags:");
        this.blockPermutationInfo(block.permutation, chatSend);
    };
    blockPermutationInfo (permutation, chatSend = this.chatSend,title="§eBlock Permutation Info:") {
        if (!(permutation instanceof BlockPermutation)) return;

        if(title) this.log(title)
        this.#log(`permutation.type.id: ${permutation.type.id}`);
        this.listArray(permutation.getTags(), chatSend, "permutation.getTags():");
        this.listObjectInnards(permutation.getAllStates(), chatSend, "permutation.getAllStates():");
    }
}
