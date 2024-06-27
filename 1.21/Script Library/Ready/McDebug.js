import { world, BlockPermutation, Player } from '@minecraft/server';

//=============================================================================
// For Debugging
class McDebug {
    constructor(booleanValue = false) {
        this.debugOn = booleanValue;
    }
    //--------------------------------------
    off () { this.debugOn = false; world.sendMessage(`§c${this.constructor.name} OFF"`); }
    on () { this.debugOn = true; world.sendMessage(`"§a${this.constructor.name} On`); }
    toggle () { if (this.debugOn) this.off(); else this.on(); }
    isDebug () { return this.debugOn; }
    //--------------------------------------    
    #isValidChatSend (chatSend) {
        if (chatSend instanceof Player) return true;
        if (chatSend instanceof world) return true;
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
        if (!(permutation instanceof BlockPermutation)) return;
        if (!(this.debugOn && this.#isValidChatSend(chatSend))) return;

        const states = permutation?.getAllStates();
        if (!states) return;

        const entries = Object.entries(states);
        this.log(`States List: (${entries.length})`, chatSend);
        for (const [ key, value ] of entries) {
            this.#log(`==> ${key}: ${value}`, chatSend);
        }
    };
}
