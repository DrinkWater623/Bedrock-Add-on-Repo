import {
    world,
    World,
    Player,
    ItemStack,
    Block,
    BlockPermutation,
    PlayerBreakBlockAfterEvent,
    PlayerBreakBlockBeforeEvent,
    PlayerInteractWithBlockAfterEvent,
    PlayerInteractWithBlockBeforeEvent
} from '@minecraft/server';
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
        if (title) this.#log(title, chatSend);
        this.listObjectInnards(states, chatSend = this.chatSend);
    };
    listObjectInnards (object = {}, chatSend = this.chatSend, title = "Key-Value List:") {
        if (!this.debugOn) return;
        if (!(typeof object == "object")) return;

        const entries = Object.entries(object);
        if (title) this.#log(`${title} (${entries.length})`, chatSend);
        for (const [ key, value ] of entries) {
            this.#log(`==> ${key}: ${value}`, chatSend);
        }
    };
    listObjectKeys (object = {}, chatSend = this.chatSend, title = "Key List:") {
        if (!this.debugOn) return;
        if (!(typeof object == "object")) return;

        const keys = Object.keys(object);
        if (title) this.#log(`${title} (${keys.length})`, chatSend);
        for (const key of keys) {
            this.#log(`==> ${key}`, chatSend);
        }
    };
    listArray (array = {}, chatSend = this.chatSend, title = "Array List:") {
        if (!this.debugOn) return;
        if (!Array.isArray(array)) return;

        if (title) this.#log(`${title} (${array.length})`, chatSend);
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
    itemInfo (item, chatSend = this.chatSend, title = "\n§bItem Info") {
        if (title) this.#log(title, chatSend);
        if (!(item instanceof ItemStack)) { this.#log("§cNot an ItemStack", chatSend); return; }

        this.#log(`» item.typeId: ${item.typeId} - item.type.id: ${item.type.id}`);
        this.listArray(item.getTags(), chatSend, "Tags:");
        this.listArray(item.getLore(), chatSend, "Lore:");

        const enchants = item.getComponent("enchantable")?.getEnchantments()?.map(a => `type.id: ${a.type.id} level: ${a.level} of ${a.type.maxLevel}`);
        this.listArray(enchants, chatSend, "Enchantments:");
        this.#log(".", chatSend);
    };
    blockInfo (block, chatSend = this.chatSend, title = "\n§6Block Info") {
        if (title) this.#log(title, chatSend);
        if (!(block instanceof Block)) { this.#log("§cNot a Block", chatSend); return; }

        this.#log(`» block.(xyz): ${block.x}, ${block.y}, ${block.z} - block.location.(xyz): ${block.location.x}, ${block.location.y}, ${block.location.z}`);
        this.#log(`» block.center.(xyz): ${block.center().x}, ${block.center().y}, ${block.center().z}`);
        this.#log(`» block.typeId: ${block.typeId} - block.type.id: ${block.type.id}`);
        this.listArray(block?.getTags(), chatSend, "Block-Tags:");
        this.blockPermutationInfo(block.permutation, chatSend);
        this.#log(".", chatSend);
    };
    blockPermutationInfo (permutation, chatSend = this.chatSend, title = "§eBlock Permutation Info:") {
        if (title) this.#log(title, chatSend);
        if (!(permutation instanceof BlockPermutation)) { this.#log("§cNot a BlockPermutation", chatSend); return; }

        this.#log(`» permutation.type.id: ${permutation.type.id}`);
        this.listArray(permutation.getTags(), chatSend, "permutation.getTags():");
        this.listObjectInnards(permutation.getAllStates(), chatSend, "permutation.getAllStates():");
    };
    blockAndItemStackEventInfo (event, title = "") {
        this.blockAndItemStackInfo(event?.block, event?.itemStack, event?.player, title);
        if (event?.blockFace) this.#log(`blockFace: ${event.blockFace}`, event.player);
    };
    blockAndItemStackInfo (block, item, player, title = "") {
        if (title) this.#log(title, player);
        this.itemInfo(item, player, "§bItem Info");
        this.blockInfo(block, player, "§6Block Info");
    };
    playerBreakBlockAfterEventInfo (event) {
        if (!(event instanceof PlayerBreakBlockAfterEvent)) return;

        this.#log("\n§a* PlayerBreakBlock§gAfterEvent", event.player);
        //Last Info
        this.itemInfo(event.itemStackBeforeBreak, event.player, "§b** Item §eBefore §bBreak");
        this.blockPermutationInfo(event.brokenBlockPermutation, event.player, "§6** Broken Block Permutation");
        //Current Info
        this.itemInfo(event.itemStackAfterBreak, event.player, "§9Item §gAfter §9Break");
        this.blockInfo(event.block, event.player, "§6Block §dAfter §6Break");
    };
    playerBreakBlockBeforeEventInfo (event) {
        if (!(event instanceof PlayerBreakBlockBeforeEvent)) return;
        this.blockAndItemStackEventInfo(event, "\n§a* PlayerBreakBlock§gBeforeEvent");
    };
    //FIXME: possible for itemStack to be null/undefined - adjust
    playerInteractWithBlockAfterEventInfo (event) {
        if (!(event instanceof PlayerInteractWithBlockAfterEvent)) return;
        this.blockAndItemStackEventInfo(event, "\n§a* PlayerInteractWithBlock§gAfterEvent");
    };
    playerInteractWithBlockBeforeEventInfo (event) {
        if (!(event instanceof PlayerInteractWithBlockBeforeEvent)) return;
        this.blockAndItemStackEventInfo(event, "\n§a* PlayerInteractWithBlock§gAfterEvent");
    };
}
export class is {

    static array (candidate) { return Array.isArray(candidate); }
    static arrayOfObjects (candidate) { return Array.isArray(candidate) && candidate.every(o => typeof o === "object"); }
    static arrayOfStrings (candidate) { return Array.isArray(candidate) && candidate.every(s => typeof s === "string"); }
    static boolean (candidate) { return typeof candidate === "boolean"; }
    static function (candidate) { return typeof candidate === "function"; }
    static null (candidate) { return Object.is(candidate, null); }
    static number (candidate) { return typeof candidate === "number" || typeof candidate === "bigint"; }
    static object (candidate) { return typeof candidate === "object"; }
    static string (candidate) { return typeof candidate === "string"; }
    static symbol (candidate) { return typeof candidate === "symbol"; }
    static undefined (candidate) { return typeof candidate === "undefined"; }
    //---------------------------------------------------------------------------
    static notArray (candidate) { return !Array.isArray(candidate); }
    static notBoolean (candidate) { return typeof candidate !== "boolean"; }
    static notFunction (candidate) { return typeof candidate !== "function"; }
    static notNull (candidate) { return !Object.is(candidate, null); }
    static notNumber (candidate) { return typeof candidate !== "number" && typeof candidate !== "bigint"; }
    static notObject (candidate) { return typeof candidate !== "object"; }
    static notString (candidate) { return typeof candidate !== "string"; }
    static notSymbol (candidate) { return typeof candidate !== "symbol"; }
    static notUndefined (candidate) { return typeof candidate !== "undefined"; }

    static empty (object) {
        //false is not empty, 0 is not empty
        if (Object.is(object, undefined)) return true;
        if (Object.is(object, null)) return true;
        if (is.object(object)) return !!Object.keys(object).length;
        if (is.string(object)) return !!object.length;
        return false;
    }
    static notEmpty (object) {
        //false is not empty, 0 is not empty
        if (Object.is(object, undefined)) return false;
        if (Object.is(object, null)) return false;
        if (is.object(object)) return !Object.keys(object).length;
        if (is.string(object)) return !object.length;
        return true;
    }
    static exact (arg, compareArg) { return arg === compareArg; }
    static notExact (arg, compareArg) { return arg !== compareArg; }
    static equal (arg, compareArg) {
        if (arg == compareArg) return true;
        //if (arg == compareArg) return true;

        //dive deeper
        if (typeof arg !== typeof compareArg) return false;
        if (is.array(arg) !== is.array(compareArg)) return false;

        //arrays
        if (is.array(arg)) {
            if (arg.length != compareArg.length) return false;

            //if either has some objects in the array
            if (arg.some(obj => typeof obj === "object")) return false; //for now
            if (compareArg.some(obj => typeof obj === "object")) return false; //for now
            //what about empty
            for (let v of arg) if (!compareArg.includes(v)) return false;
            return true;
        }
        // objects - non arrays?   this is more complex - needs more testing and thought
        let argKeys = arg.keys();
        let compareArgKeys = compareArg.keys();
        if (argKeys.length !== compareArgKeys.length) return false;

        //TODO:  way more to compare see the lib tests on objects/maps/?sets
        //trying to get down to if the values are the same, regardless of how stored

        return false;
    }
    static notEqual (arg, compareArg) { return !is.equal(arg, compareArg); }
}
export class has {
    static key (object = {}, keyName = "") {
        return (typeof object === "object") && Object.hasOwn(object, keyName);
    }
    static keyValue (object = [ {} ], keyName = "", value) {
        if (typeof object !== 'object') return false;
        if (typeof value === 'object') return has.keyValues(object, keyName, value);

        if (!Array.isArray(object)) {
            return Object.hasOwn(object, keyName) && object[ keyName ] === value;
        }
        //Array, so check each object of array until found
        const objList = object
            .filter(obj => typeof obj === 'object')
            .filter(obj => Object.hasOwn(obj, keyName))
            .filter(obj => typeof obj[ keyName ] !== 'object')
            .filter(obj => obj[ keyName ] === value);

        return !!objList.length;
    }
    //TODO:  keyValues NOT DONE - need to .....
    static keyValues (object = [], keyName = "", compareObject = {}) {
        if (typeof object !== 'object') return false;
        if (typeof compareObject !== 'object') return has.keyValue(object, keyName, compareObject);

        if (!Array.isArray(object)) {
            return Object.hasOwn(object, keyName) && object[ keyName ] === compareObject;
        }

        //Array, so check each object of array until found
        const objList = object
            .filter(obj => typeof obj === 'object')
            .filter(obj => Object.hasOwn(obj, keyName))
            .map(obj => obj[ keyName ]);

        if (objList.length == 0) return false;
    }
    static values (object = {}) {
        //false is not empty, 0 is not empty
        if (Object.is(object, undefined)) return true;
        if (Object.is(object, null)) return true;
        if (is.object(object)) return !!Object.keys(object).length;
        if (is.string(object)) return !!object.length;
        return false;
    }
}