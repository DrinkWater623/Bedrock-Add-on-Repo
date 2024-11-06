import { world, BlockPermutation, Player, World } from '@minecraft/server';

//=============================================================================
// For Debugging
export class McDebug {
    constructor(booleanValue = false) {
        this.debugOn = booleanValue;
    }
    //--------------------------------------
    off () { this.debugOn = false; world.sendMessage(`§c${this.constructor.name} OFF"`); }
    on () { this.debugOn = true; world.sendMessage(`"§a${this.constructor.name} On`); }
    toggle () { if (this.debugOn) this.off(); else this.on(); }
    isDebug () { return this.debugOn; }
    //--------------------------------------    
    #isValidChatSend (chatScope) {
        if (chatScope instanceof Player) return true;
        if (chatScope instanceof World) return true;
        return false;
    }
    #log (msg = "", chatSend = world) {
        chatSend?.sendMessage(msg);
    };
    log (msg = "", chatSend = world) {
        if (this.debugOn && this.#isValidChatSend(chatSend))
            this.#log(msg, chatSend);
    };
    listBlockStates (permutation = {}, chatSend = world) {
        if (!this.debugOn) return;
        if (!(permutation instanceof BlockPermutation)) return;
        if (!this.#isValidChatSend(chatSend)) return;

        const states = permutation?.getAllStates();
        if (!states) {
            this.#log("Zero Block States",chatSend)
            return;
        }

        this.listObjectInnards(states, chatSend);
    };
    listObjectInnards (object = {}, chatSend = world) {
        if (!this.debugOn) return;
        if (!(typeof object == "object")) return;
        if (!this.#isValidChatSend(chatSend)) return;

        const entries = Object.entries(object);
        this.#log(`Key-Value List: (${entries.length})`, chatSend);
        for (const [ key, value ] of entries) {
            this.#log(`==> ${key}: ${value}`, chatSend);
        }
    };
    listArray (array = {}, chatSend = world) {
        if (!this.debugOn) return;
        if (!Array.isArray(array)) return;
        if (!this.#isValidChatSend(chatSend)) return;

        this.#log(`Array List: (${array.length})`, chatSend);
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

}
