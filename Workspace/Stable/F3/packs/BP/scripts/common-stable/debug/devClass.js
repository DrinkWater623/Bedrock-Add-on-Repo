// devLib.js
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: M.I.T.
URL: https://github.com/DrinkWater623
========================================================================
 Notes to self: 
    the objects in the child class are really meant for watching the event for a particular object type
    and being able to turn on and off easily without looking through the scripts
    as long as I am consistent about usage and do not do band-aid adhoc alerts here and there

    Also, only use for debugging and dev work.  
    Not meant for game play, build something else for that
========================================================================
Change Log: 
    20251220 - Major Refactor
========================================================================*/
import { ChatMsg, ConsoleAlert } from '../tools/messageLib.js';
import { objectEntries_any_booleans_opts, objectEntries_set_booleans_opts, objectKeysWhereBooleanOpts, booleanKeyExist, readBooleanKey, listObjectInnards, listArray } from "../tools/objects.js";
import { toTitleCase } from '../tools/stringLib.js';
//============================================================================================
//  To keep me honest
/**
 * @typedef {Record<string, boolean>} BooleanMap
 * @typedef {Record<string, BooleanMap>} Boolean2DeepMap
 * @typedef {Partial<Record<ConfigKey, BooleanMap | Boolean2DeepMap>>} DevConfig
 */
/**
 * @typedef {"functions" | "events" | "gameObjects"} ConfigKey
 * @typedef {"debugFunctions" | "debugEvents" | "debugGameObjects"} MapProp
 * @typedef {1 | 2} MapDepth
 * @typedef {[ConfigKey, MapProp, MapDepth]} MapDef
 */

/** @type {MapDef[]} */
const MAP_DEFS = [
    [ "functions", "debugFunctions", 1 ],
    [ "events", "debugEvents", 2 ],
    [ "gameObjects", "debugGameObjects", 2 ],
];

//============================================================================================
// Class For Dev Debugging
//============================================================================================
/* This is important, if you create new groups, must add to gameObjectMap or they will fail */
//============================================================================================
const gameObjMap = {
    block: 'block',
    entity: 'entity',
    item: 'item',
    player: 'player',
    system: "system"
};
/**
 * Debug Everything Visibly a.k.a Do Eventually Verify
 * Creates a new Debugger object
 * @class
 */
export class Dev {
    /**
    * @constructor
    * @param {string} pack_name 
    * @param {boolean} [on = false] 
    */
    constructor(pack_name, on = false) {
        //basic
        this.pack_name = pack_name;
        this.debugOn = false;
        this._masterPackDebugOn = on;  //before you add to the debugs below check this, else it may fail, cause I freeze if OFF
        this._isDead = false;
        //=================================================================================================================
        /* This is how this Dev object sends alerts meant for analyzing and debugging - Custom methods for use available */
        //=================================================================================================================
        this._msgs = {
            alertLog: new ConsoleAlert(`§6§l[Dev]§r ${pack_name}`, on),
            chatLog: new ChatMsg(`§6§l[Dev]§r ${pack_name}`, on)
        };
        //=================================================================================
        /* Derived class to fill in, can be actual function or key, it is how you use it */
        //=================================================================================
        /** @type {BooleanMap} */
        this.debugFunctions = {
            // derived class to add to these, can fill in here with known to always have
            main: false,
            registerCommand: false,
            subscriptionsStable: false,
            subscriptionsBeta: false
        };
        //==================================================================================
        /* Derived class to fill in, can be actual object or group, it is how you use it */
        //==================================================================================
        /**@type {Boolean2DeepMap} */
        this.debugGameObjects = {
            /** @type {BooleanMap} */
            block: {
                block: false,
                //suggestion types
                ores: false,
                logs: false,
                custom: false
            },
            /** @type {BooleanMap} */
            entity: {
                entity: false,
                //suggestion types
                creeper: false,
                monster: false,
                npc: false,
                wandering_trader: false,
                wither: false,
                custom: false
            },
            /** @type {BooleanMap} */
            item: {
                item: false,
                //suggestion types
                illegal: false,
                tool: false,
                weapon: false,
                food: false,
                custom: false
            },
            /** @type {BooleanMap} */
            player: {
                owner: false,
                admin: false,
                moderator: false,
                player: false,
                gameMode: false,
            },
            /** @type {BooleanMap} */
            system: {
                dimension: false,
                gameRules: false,
                system: false,
                world: false,
            },
        };
        //======================================================================================================
        /* All of them - Use set/toggle methods to turn on/off  - update this master if Mojang makes new ones */
        //======================================================================================================
        /**@type {Boolean2DeepMap} */
        this.debugEvents = {
            /** @type {BooleanMap} */
            system: {
                afterWorldLoad: false,
                beforeStartup: false
            },
            /**@type {BooleanMap} */
            block: {
                afterBlockExplode: false,
                afterButtonPush: false,
                afterEntityHitBlock: false,
                afterLeverAction: false,
                afterPistonActivate: false,
                afterPlayerBreakBlock: false,
                afterPlayerInteractWithBlock: false,
                afterPlayerPlaceBlock: false,
                beforePlayerBreakBlock: false,
                beforePlayerInteractWithBlock: false,
                beforePlayerPlaceBlock: false,
                afterPressurePlatePop: false,
                afterPressurePlatePush: false,
                afterTargetBlockHit: false,
                afterTripWireTrip: false,
                //custom components
                onBlockBreak: false,
                onEntityFallOn: false,
                onPlace: false,
                onPlayerBreak: false,
                onPlayerInteract: false,
                onPlayerPlaceBefore: false,
                onRedstoneUpdate_beta: false,
                onRandomTick: false,
                onStepOff: false,
                onStepOn: false,
                onTick: false
            },
            /** @type {BooleanMap} */
            entity: {
                afterEntityDie: false,
                afterEntityHealthChanged: false,
                afterEntityHitBlock: false,
                afterEntityHitEntity: false,
                afterEntityHurt: false,
                afterEntityLoad: false,
                afterEntitySpawn: false,
                afterEntityRemove: false,
                beforeEntityRemove: false,
            },
            /**@type {BooleanMap} */
            item: {
                afterItemCompleteUse: false,
                afterItemReleaseUse: false,
                afterItemStartUse: false,
                afterItemStartUseOn: false,
                afterItemStopUse: false,
                afterItemStopUseOn: false,
                afterItemUseOn: false,
                afterItemUse: false,
                beforeItemUse: false,
                //custom components
                onBeforeDurabilityDamage: false,
                onConsume: false,
                onHitEntity: false,
                onMineBlock: false,
                onUse: false,
                onUseOn: false
            },
            /**@type {BooleanMap} */
            player: {
                // Real Player Only Events
                afterPlayerEmote: false,
                afterPlayerHotbarSelectedSlotChange: false,
                afterPlayerInputModeChange: false,
                afterPlayerInputPermissionCategoryChange: false,
                afterPlayerInventoryItemChange: false,
                afterPlayerJoin: false,
                afterPlayerSpawn: false,
                afterPlayerSwingStart: false,
                afterPlayerUseNameTag: false,
                afterPlayerBreakBlock: false,
                afterPlayerGameModeChange: false,
                afterPlayerInteractWithBlock: false,
                afterPlayerInteractWithEntity: false,
                afterPlayerLeave: false,
                afterPlayerPlaceBlock: false,
                beforePlayerBreakBlock: false,
                beforePlayerGameModeChange: false,
                beforePlayerInteractWithBlock: false,
                beforePlayerInteractWithEntity: false,
                beforePlayerLeave: false,
                beforePlayerPlaceBlock: false,
            }
        };
        //==============================================================================================================================
        /* Always start with everything off / derived class should setup it's own methods to turn stuff on  / this way - no accidents */
        //==============================================================================================================================
        this.allOff();
        //=================================================================
        /* 
            Should NOT use in live Add-on where master switch is OFF 
            You will have to update pack.debugOn in the local settings.js file
            then reload scripts - this is so real game play is not 
            accidentally interrupted by console or chat messages meant 
            for the developer / debugger.
        */
        //=================================================================
        if (!this._masterPackDebugOn) { this._killSwitch(); }
        /** @type {boolean} */

        //Private stuff

    }
    _killSwitch () {
        if (this._masterPackDebugOn) return;
        this.allOff();
        this._isDead = true;
        this.debugOn = false;
        this._msgs.alertLog.on = false;
        this._msgs.chatLog.on = false;
        // Remove everything
        this.debugEvents = {};
        this.debugFunctions = {};
        this.debugGameObjects = {};
        // Lock it up
        Object.freeze(this._msgs.alertLog);
        Object.freeze(this._msgs.chatLog);
        Object.freeze(this._msgs);
        Object.freeze(this.debugEvents);
        Object.freeze(this.debugFunctions);
        Object.freeze(this.debugGameObjects);
        //Object.defineProperty(this, "_masterPackDebugOn", { writable: false });
        Object.freeze(this);
    }
    //==========
    /* Query */
    //==========

    //TODO: add function to list what is on - to be called in command registry

    allOff () {
        if (!this._isActive()) return;
        this.allThisOff(this.debugGameObjects);
        this.allThisOff(this.debugEvents);
        this.allThisOff(this.debugFunctions);
        this.debugOn = false;
        this._msgs.alertLog.on=false
        this._msgs.chatLog.on=false
    }
    /**
    * 
    * @param {object} objectToTurnOff 
    * @returns 
    */
    allThisOff (objectToTurnOff) {
        objectEntries_set_booleans_opts(
            /** @type {Record<string, unknown>} */(objectToTurnOff),
            false,
            { dive: true }
        );
    }
    anyOn () {
        if (!this._isActive()) {
            this.debugOn = false;
            return false;
        }
        //DO not call anyEvents or anyGameObjects... recursion HELL
        this.debugOn =
            this._anyThisOn(this.debugGameObjects) ||
            this._anyThisOn(this.debugEvents) ||
            this._anyThisOn(this.debugFunctions);

        this._msgs.alertLog.on=this.debugOn
        this._msgs.chatLog.on=this.debugOn

        return this.debugOn;
    }
    /**
     * 
     * @param {object} objectToCheck 
     * @returns {boolean}
     */
    _anyThisOn (objectToCheck) {
        return objectEntries_any_booleans_opts(
                /** @type {Record<string, unknown>} */(objectToCheck),
            { dive: true }
        );
    }
    anyEventsOn () {
        if (!this._isActive()) return false;

        const any = this._anyThisOn(this.debugEvents);
        this.debugOn = any ? any : this.anyOn();
        return any;
    }
    anyGameObjectsOn () {
        if (!this._isActive()) return false;

        const any = this._anyThisOn(this.debugGameObjects);
        this.debugOn = any ? any : this.anyOn();
        return any;
    }
    anyFunctionsOn () {
        if (!this._isActive()) return false;

        const any = this._anyThisOn(this.debugFunctions);
        this.debugOn = any ? any : this.anyOn();
        return any;
    }
    //===============
    /* Validations */
    //===============
    _isActive () {
        return this._masterPackDebugOn && !this._isDead;
    }
    /**
   *
   * @param {string} title 
   * @param {Record<string,boolean>} map 
   * @param {string} key
   * @param {boolean} fail 
   * @returns {void}
   */
    _keySuggestion (title, map, key, fail) {
        if (!this._isActive()) return;
        const suggestions = objectKeysWhereBooleanOpts(map, { filterStartsWith: key });
        this._controlLog(`§cUnknown ${title}: ${key}§r` +
            (suggestions.length ? ` §7Did you mean: ${suggestions.join(", ")}§r` : ""),
            true
        );
        if (fail) throw new Error(`§c[Dev]${this.pack_name}:§r §eInvalid ${title} key "§b${key}§r" - Please fix code so you can debug correctly`);
    }
    /**
     * 
     * @param {string} group 
     * @returns 
     */
    _isValidGameObjectGroup (group) {
        if (!this._isActive()) return false;
        if (!Object.hasOwn(gameObjMap, group)) throw new Error(`§c[Dev]${this.pack_name}:§r§eInvalid Game Object Group "§b${group}§r"`);
        return true;
    }
    /**
     * 
     * @param {string} key 
     * @returns 
     */
    _isValidFunctionKey (key) {
        if (!this._isActive()) return false;

        const map = this.debugFunctions;
        const cur = readBooleanKey(map, key);
        if (cur === undefined) { this._keySuggestion(`Function`, map, key, true); return; }

        return true;
    }
    //===============================================================
    /* Lookups per Event or Game Object and/or Game Object + Event */
    //===============================================================
    //---------------------------------------------------------------------------------------------------
    /**
   * Can only work for one level deep
   * @param {string} group 
   * @param {string} eventKey
   * @returns {boolean}
   */
    _isDebugEvent (group, eventKey) {
        if (!this._masterPackDebugOn) return false;
        if (!this._isValidGameObjectGroup(group)) return false;
        const map = this.debugEvents[ group ];
        const val = readBooleanKey(map, eventKey);
        return !!val;
    }
    /**
    * Can only work for one level deep
    * @param {string} group 
    * @param {string} objectKey
    * @returns {boolean}
    */
    _isDebugObject (group, objectKey) {
        if (!this._masterPackDebugOn) return false;
        if (!this._isValidGameObjectGroup(group)) return false;
        const map = this.debugGameObjects[ group ];
        const val = readBooleanKey(map, objectKey);
        return !!val;
    }
    /**
     * Can only work for one level deep
     * @param {string} group 
     * @param {string} objectKey
     * @param {string} eventKey 
     * @returns {boolean}
     */
    _isDebugObjectEvent (group, objectKey, eventKey) {
        if (!this._masterPackDebugOn) return false;
        if (!this._isValidGameObjectGroup(group)) return false;
        if (!objectKey || objectKey == '*') return this._isDebugEvent(group, eventKey);
        if (!eventKey || eventKey == '*') return this._isDebugObject(group, objectKey);
        return this._isDebugEvent(group, eventKey) && this._isDebugObject(group, objectKey);
    }
    //---------------------------------------------------------------------------------------------------
    /**
     * Can only work for one level deep
     * @param {string} eventKey 
     * @returns {boolean}
     */
    isDebugBlockEvent (eventKey,) { return this._isDebugEvent(gameObjMap.block, eventKey); }
    /**
  * Can only work for one level deep
  * @param {string} eventKey 
  * @returns {boolean}
  */
    isDebugEntityEvent (eventKey,) { return this._isDebugEvent(gameObjMap.entity, eventKey); }
    /**
     * Can only work for one level deep
     * @param {string} eventKey 
     * @returns {boolean}
     */
    isDebugItemEvent (eventKey,) { return this._isDebugEvent(gameObjMap.item, eventKey); }
    /**
     * Can only work for one level deep
     * @param {string} eventKey 
     * @returns {boolean}
     */
    isDebugPlayerEvent (eventKey,) { return this._isDebugEvent(gameObjMap.player, eventKey); }
    /**
     * Can only work for one level deep
     * @param {string} eventKey 
     * @returns {boolean}
     */
    isDebugSystemEvent (eventKey,) { return this._isDebugEvent(gameObjMap.system, eventKey); }

    //---------------------------------------------------------------------------------------------------
    /**
     * Can only work for one level deep
     * @param {string} objectKey 
     * @returns {boolean}
     */
    isDebugBlockObject (objectKey,) { return this._isDebugObject(gameObjMap.block, objectKey); }
    /**
  * Can only work for one level deep
  * @param {string} objectKey 
  * @returns {boolean}
  */
    isDebugEntityObject (objectKey,) { return this._isDebugObject(gameObjMap.entity, objectKey); }
    /**
     * Can only work for one level deep
     * @param {string} objectKey 
     * @returns {boolean}
     */
    isDebugItemObject (objectKey,) { return this._isDebugObject(gameObjMap.item, objectKey); }
    /**
     * Can only work for one level deep
     * @param {string} objectKey 
     * @returns {boolean}
     */
    isDebugPlayerObject (objectKey,) { return this._isDebugObject(gameObjMap.player, objectKey); }
    /**
     * Can only work for one level deep
     * @param {string} objectKey 
     * @returns {boolean}
     */
    isDebugSystemObject (objectKey,) { return this._isDebugObject(gameObjMap.system, objectKey); }
    //---------------------------------------------------------------------------------------------------
    /**
    * Can only work for one level deep
    * @param {string} objectKey 
    * @param {string} eventKey 
    * @returns {boolean}
    */
    isDebugBlockObjectEvent (objectKey, eventKey) { return this._isDebugObjectEvent(gameObjMap.block, objectKey, eventKey); }
    /**
     * Can only work for one level deep
     * @param {string} objectKey 
     * @param {string} eventKey 
     * @returns {boolean}
     */
    isDebugEntityObjectEvent (objectKey, eventKey) { return this._isDebugObjectEvent(gameObjMap.entity, objectKey, eventKey); }
    /**
    * Can only work for one level deep
    * @param {string} objectKey 
    * @param {string} eventKey 
    * @returns {boolean}
    */
    isDebugItemObjectEvent (objectKey, eventKey) { return this._isDebugObjectEvent(gameObjMap.item, objectKey, eventKey); }
    /**
    * Can only work for one level deep
    * @param {string} objectKey 
    * @param {string} eventKey 
    * @returns {boolean}
    */
    isDebugPlayerObjectEvent (objectKey, eventKey) { return this._isDebugObjectEvent(gameObjMap.player, objectKey, eventKey); }
    /**
    * Can only work for one level deep
    * @param {string} objectKey 
    * @param {string} eventKey 
    * @returns {boolean}
    */
    isDebugSystemObjectEvent (objectKey, eventKey) { return this._isDebugObjectEvent(gameObjMap.system, objectKey, eventKey); }
    //---------------------------------------------------------------------------------------------------
    /**
     * 
     * @param {string} key 
     * @returns {boolean}
     */
    isDebugFunction (key) {
        if (!this._isValidFunctionKey(key)) return false;
        return !!this.debugFunctions[ key ];
    }
    //===================================================================
    /* Log control/command feedback even if debugOn is currently false */
    //===================================================================
    /**
     * 
     * @param {string} msg 
     * @param {boolean} [send  = true] 
     * @returns 
     */
    _controlError (msg, send = true) {
        if (!this._masterPackDebugOn || !msg) return;
        this._msgs.alertLog.error(msg, send);
    }
    /**
     * 
     * @param {string} msg 
     * @param {boolean} [send  = true] 
     * @returns 
     */
    _controlLog (msg, send = true) {
        if (!this._masterPackDebugOn || !msg) return;
        this._msgs.alertLog.log(msg, send);
    }
    /**
     * 
     * @param {string} msg 
     * @param {boolean} [send  = true] 
     * @returns 
     */
    _controlSuccess (msg, send = true) {
        if (!this._masterPackDebugOn || !msg) return;
        this._msgs.alertLog.success(msg, send);
    }
    /**
     * 
     * @param {string} msg 
     * @param {boolean} [send  = true]
     * @returns 
     */
    _controlWarn (msg, send = true) {
        if (!this._masterPackDebugOn || !msg) return;
        this._msgs.alertLog.warn(msg, send);
    }
    //===============================
    /* General Alerts per Occasion */
    //===============================
    /**
        * @param {string} msg
        * @param {boolean} [send=true] does not matter - remove later
        */
    alertError (msg, send = true) { if (this._masterPackDebugOn) if (this.debugOn && msg) this._msgs.alertLog.error(`${msg}`, true); }
    /**
     * @param {string} msg
     *  @param {boolean} [send=false]
     */
    alertLog (msg, send = false) { if (this._masterPackDebugOn) if (this.debugOn && msg) this._msgs.alertLog.log(msg, send); }
    /**
     * @param {string} msg
     *  @param {boolean} [send=false]
     */
    alertSuccess (msg, send = false) { if (this._masterPackDebugOn) if (this.debugOn && msg) this._msgs.alertLog.success(msg, send); }
    /**
     * @param {string} msg
     * @param {boolean} [send=true] does not matter - remove later
     */
    alertWarn (msg, send = true) { if (this._masterPackDebugOn) if (this.debugOn && msg) this._msgs.alertLog.warn(msg, true); }
    /**
    * 
    * @param {string} FunctionName - The name of the function.
    * @param {boolean} [start = true] 
    * @param {boolean} [alert = false] 
    */
    alertFunction (FunctionName, start = true, alert = false) {
        this.alertLog(`§6§l${start ? '**' : 'xx'}§r function §6${FunctionName}§r()`, (this.debugOn && alert));
    }
    /**
    * 
    * @param {string} functionKey - The name of the function.
    * @param {boolean} [start = true] 
    */
    alertFunctionKey (functionKey, start = true) {
        this.alertFunction(functionKey,start, this.isDebugFunction(functionKey));
    }
    /**
        * @param {string} msg
        * @param {boolean} [send=false] does not matter - remove later
        */
    chatError (msg, send = false) { if (this._masterPackDebugOn) if (this.debugOn && msg) this._msgs.chatLog.error(`${msg}`, true); }
    /**
     * @param {string} msg
     *  @param {boolean} [send=false]
     */
    chatLog (msg, send = false) { if (this._masterPackDebugOn) if (this.debugOn && msg) this._msgs.chatLog.log(msg, true); }
    /**
     * @param {string} msg
     *  @param {boolean} [send=false]
     */
    chatSuccess (msg, send = false) { if (this._masterPackDebugOn) if (this.debugOn && msg) this._msgs.chatLog.success(msg, true); }
    /**
     * @param {string} msg
     * @param {boolean} [send=false] does not matter - remove later
     */
    chatWarn (msg, send = false) { if (this._masterPackDebugOn) if (this.debugOn && msg) this._msgs.chatLog.warn(msg, true); }
    //=================================================
    /* Error Alerts if GameObject and/or Event is on */
    //=================================================
    //-----------------------------------------------------------------------------------------------------------------------------------------------
    /**
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertBlockEventError (eventKey, msg) { this.alertError(msg, this.isDebugBlockEvent(eventKey)); }
    /**
    * @param {string} eventKey 
    * @param {string} msg
    */
    alertEntityEventError (eventKey, msg) { this.alertError(msg, this.isDebugEntityEvent(eventKey)); }
    /**
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertItemEventError (eventKey, msg) { this.alertError(msg, this.isDebugItemEvent(eventKey)); }
    /**
    * @param {string} eventKey 
    * @param {string} msg
    */
    alertPlayerEventError (eventKey, msg) { this.alertError(msg, this.isDebugPlayerEvent(eventKey)); }
    /**
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertSystemEventError (eventKey, msg) { this.alertError(msg, this.isDebugSystemEvent(eventKey)); }
    //-----------------------------------------------------------------------------------------------------------------------------------------------
    /**
     * @param {string} objectKey 
     * @param {string} msg
     */
    alertBlockObjectError (objectKey, msg) { this.alertError(msg, this.isDebugBlockObject(objectKey)); }
    /**
    * @param {string} objectKey 
    * @param {string} msg
    */
    alertEntityObjectError (objectKey, msg) { this.alertError(msg, this.isDebugEntityObject(objectKey)); }
    /**
     * @param {string} objectKey 
     * @param {string} msg
     */
    alertItemObjectError (objectKey, msg) { this.alertError(msg, this.isDebugItemObject(objectKey)); }
    /**
    * @param {string} objectKey 
    * @param {string} msg
    */
    alertPlayerObjectError (objectKey, msg) { this.alertError(msg, this.isDebugPlayerObject(objectKey)); }
    /**
     * @param {string} objectKey 
     * @param {string} msg
     */
    alertSystemObjectError (objectKey, msg) { this.alertError(msg, this.isDebugSystemObject(objectKey)); }
    //-----------------------------------------------------------------------------------------------------------------------------------------------
    /**
     * @param {string} objectKey 
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertBlockObjectEventError (objectKey, eventKey, msg) { { this.alertError(msg, this.isDebugBlockObjectEvent(objectKey, eventKey)); } }
    /**
     * @param {string} objectKey 
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertEntityObjectEventError (objectKey, eventKey, msg) { { this.alertError(msg, this.isDebugEntityObjectEvent(objectKey, eventKey)); } }
    /**
     * @param {string} objectKey 
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertItemObjectEventError (objectKey, eventKey, msg) { { this.alertError(msg, this.isDebugItemObjectEvent(objectKey, eventKey)); } }
    /**
     * @param {string} objectKey 
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertPlayerObjectEventError (objectKey, eventKey, msg) { { this.alertError(msg, this.isDebugPlayerObjectEvent(objectKey, eventKey)); } }
    /**
     * @param {string} objectKey 
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertSystemObjectEventError (objectKey, eventKey, msg) {  { this.alertError(msg,  this.isDebugSystemObjectEvent(objectKey, eventKey)); } }
    //===============================================
    /* Log Alerts if GameObject and/or Event is on */
    //===============================================
    /**
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertBlockEventLog (eventKey, msg) { this.alertLog(msg, this.isDebugBlockEvent(eventKey)); }
    /**
    * @param {string} eventKey 
    * @param {string} msg
    */
    alertEntityEventLog (eventKey, msg) { this.alertLog(msg, this.isDebugEntityEvent(eventKey)); }
    /**
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertItemEventLog (eventKey, msg) { this.alertLog(msg, this.isDebugItemEvent(eventKey)); }
    /**
    * @param {string} eventKey 
    * @param {string} msg
    */
    alertPlayerEventLog (eventKey, msg) { this.alertLog(msg, this.isDebugPlayerEvent(eventKey)); }
    /**
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertSystemEventLog (eventKey, msg) { this.alertLog(msg, this.isDebugSystemEvent(eventKey)); }
    //-----------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------
    /**
     * @param {string} objectKey 
     * @param {string} msg
     */
    alertBlockObjectLog (objectKey, msg) { this.alertLog(msg, this.isDebugBlockObject(objectKey)); }
    /**
    * @param {string} objectKey 
    * @param {string} msg
    */
    alertEntityObjectLog (objectKey, msg) { this.alertLog(msg, this.isDebugEntityObject(objectKey)); }
    /**
     * @param {string} objectKey 
     * @param {string} msg
     */
    alertItemObjectLog (objectKey, msg) { this.alertLog(msg, this.isDebugItemObject(objectKey)); }
    /**
    * @param {string} objectKey 
    * @param {string} msg
    */
    alertPlayerObjectLog (objectKey, msg) { this.alertLog(msg, this.isDebugPlayerObject(objectKey)); }
    /**
     * @param {string} objectKey 
     * @param {string} msg
     */
    alertSystemObjectLog (objectKey, msg) { this.alertLog(msg, this.isDebugSystemObject(objectKey)); }
    //-----------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------
    /**
     * @param {string} objectKey 
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertBlockObjectEventLog (objectKey, eventKey, msg) { { this.alertLog(msg, this.isDebugBlockObjectEvent(objectKey, eventKey)); } }
    /**
     * @param {string} objectKey 
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertEntityObjectEventLog (objectKey, eventKey, msg) { { this.alertLog(msg, this.isDebugEntityObjectEvent(objectKey, eventKey)); } }
    /**
     * @param {string} objectKey 
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertItemObjectEventLog (objectKey, eventKey, msg) { { this.alertLog(msg, this.isDebugItemObjectEvent(objectKey, eventKey)); } }
    /**
     * @param {string} objectKey 
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertPlayerObjectEventLog (objectKey, eventKey, msg) { { this.alertLog(msg, this.isDebugPlayerObjectEvent(objectKey, eventKey)); } }
    /**
     * @param {string} objectKey 
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertSystemObjectEventLog (objectKey, eventKey, msg) {  { this.alertLog(msg,  this.isDebugSystemObjectEvent(objectKey, eventKey)); } }
    //===================================================
    /* Success Alerts if GameObject and/or Event is on */
    //===================================================
    /**
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertBlockEventSuccess (eventKey, msg) { this.alertSuccess(msg, this.isDebugBlockEvent(eventKey)); }
    /**
    * @param {string} eventKey 
    * @param {string} msg
    */
    alertEntityEventSuccess (eventKey, msg) { this.alertSuccess(msg, this.isDebugEntityEvent(eventKey)); }
    /**
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertItemEventSuccess (eventKey, msg) { this.alertSuccess(msg, this.isDebugItemEvent(eventKey)); }
    /**
    * @param {string} eventKey 
    * @param {string} msg
    */
    alertPlayerEventSuccess (eventKey, msg) { this.alertSuccess(msg, this.isDebugPlayerEvent(eventKey)); }
    /**
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertSystemEventSuccess (eventKey, msg) { this.alertSuccess(msg, this.isDebugSystemEvent(eventKey)); }
    //-----------------------------------------------------------------------------------------------------------------------------------------------
    /**
     * @param {string} objectKey 
     * @param {string} msg
     */
    alertBlockObjectSuccess (objectKey, msg) { this.alertSuccess(msg, this.isDebugBlockObject(objectKey)); }
    /**
    * @param {string} objectKey 
    * @param {string} msg
    */
    alertEntityObjectSuccess (objectKey, msg) { this.alertSuccess(msg, this.isDebugEntityObject(objectKey)); }
    /**
     * @param {string} objectKey 
     * @param {string} msg
     */
    alertItemObjectSuccess (objectKey, msg) { this.alertSuccess(msg, this.isDebugItemObject(objectKey)); }
    /**
    * @param {string} objectKey 
    * @param {string} msg
    */
    alertPlayerObjectSuccess (objectKey, msg) { this.alertSuccess(msg, this.isDebugPlayerObject(objectKey)); }
    /**
     * @param {string} objectKey 
     * @param {string} msg
     */
    alertSystemObjectSuccess (objectKey, msg) { this.alertSuccess(msg, this.isDebugSystemObject(objectKey)); }
    //-----------------------------------------------------------------------------------------------------------------------------------------------
    /**
     * @param {string} objectKey 
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertBlockObjectEventSuccess (objectKey, eventKey, msg) { { this.alertSuccess(msg, this.isDebugBlockObjectEvent(objectKey, eventKey)); } }
    /**
     * @param {string} objectKey 
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertEntityObjectEventSuccess (objectKey, eventKey, msg) { { this.alertSuccess(msg, this.isDebugEntityObjectEvent(objectKey, eventKey)); } }
    /**
     * @param {string} objectKey 
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertItemObjectEventSuccess (objectKey, eventKey, msg) { { this.alertSuccess(msg, this.isDebugItemObjectEvent(objectKey, eventKey)); } }
    /**
     * @param {string} objectKey 
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertPlayerObjectEventSuccess (objectKey, eventKey, msg) { { this.alertSuccess(msg, this.isDebugPlayerObjectEvent(objectKey, eventKey)); } }
    /**
     * @param {string} objectKey 
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertSystemObjectEventSuccess (objectKey, eventKey, msg) {  { this.alertSuccess(msg,  this.isDebugSystemObjectEvent(objectKey, eventKey)); } }
    //================================================
    /* Warn Alerts if GameObject and/or Event is on */
    //================================================
    /**
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertBlockEventWarn (eventKey, msg) { this.alertWarn(msg, this.isDebugBlockEvent(eventKey)); }
    /**
    * @param {string} eventKey 
    * @param {string} msg
    */
    alertEntityEventWarn (eventKey, msg) { this.alertWarn(msg, this.isDebugEntityEvent(eventKey)); }
    /**
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertItemEventWarn (eventKey, msg) { this.alertWarn(msg, this.isDebugItemEvent(eventKey)); }
    /**
    * @param {string} eventKey 
    * @param {string} msg
    */
    alertPlayerEventWarn (eventKey, msg) { this.alertWarn(msg, this.isDebugPlayerEvent(eventKey)); }
    /**
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertSystemEventWarn (eventKey, msg) { this.alertWarn(msg, this.isDebugSystemEvent(eventKey)); }
    //-----------------------------------------------------------------------------------------------------------------------------------------------
    /**
     * @param {string} objectKey 
     * @param {string} msg
     */
    alertBlockObjectWarn (objectKey, msg) { this.alertWarn(msg, this.isDebugBlockObject(objectKey)); }
    /**
    * @param {string} objectKey 
    * @param {string} msg
    */
    alertEntityObjectWarn (objectKey, msg) { this.alertWarn(msg, this.isDebugEntityObject(objectKey)); }
    /**
     * @param {string} objectKey 
     * @param {string} msg
     */
    alertItemObjectWarn (objectKey, msg) { this.alertWarn(msg, this.isDebugItemObject(objectKey)); }
    /**
    * @param {string} objectKey 
    * @param {string} msg
    */
    alertPlayerObjectWarn (objectKey, msg) { this.alertWarn(msg, this.isDebugPlayerObject(objectKey)); }
    /**
     * @param {string} objectKey 
     * @param {string} msg
     */
    alertSystemObjectWarn (objectKey, msg) { this.alertWarn(msg, this.isDebugSystemObject(objectKey)); }
    //-----------------------------------------------------------------------------------------------------------------------------------------------
    /**
     * @param {string} objectKey 
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertBlockObjectEventWarn (objectKey, eventKey, msg) { { this.alertWarn(msg, this.isDebugBlockObjectEvent(objectKey, eventKey)); } }
    /**
     * @param {string} objectKey 
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertEntityObjectEventWarn (objectKey, eventKey, msg) { { this.alertWarn(msg, this.isDebugEntityObjectEvent(objectKey, eventKey)); } }
    /**
     * @param {string} objectKey 
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertItemObjectEventWarn (objectKey, eventKey, msg) { { this.alertWarn(msg, this.isDebugItemObjectEvent(objectKey, eventKey)); } }
    /**
     * @param {string} objectKey 
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertPlayerObjectEventWarn (objectKey, eventKey, msg) { { this.alertWarn(msg, this.isDebugPlayerObjectEvent(objectKey, eventKey)); } }
    /**
     * @param {string} objectKey 
     * @param {string} eventKey 
     * @param {string} msg
     */
    alertSystemObjectEventWarn (objectKey, eventKey, msg) {  { this.alertWarn(msg,  this.isDebugSystemObjectEvent(objectKey, eventKey)); } }
    
    //==============
    /* Utilities  */
    //=============
    /**
     * @returns {{
     *   debugOn: boolean,
     *   functions: string[],
     *   events: Record<string, string[]>,
     *   gameObjects: Record<string, string[]>
     * }}
     */
    getOnList () {
        if (!this._isActive()) {
            return { debugOn: false, functions: [], events: {}, gameObjects: {} };
        }

        /** @type {string[]} */
        const functions = [];
        for (const [ k, v ] of Object.entries(this.debugFunctions)) if (v === true) functions.push(k);

        /** @type {Record<string, string[]>} */
        const events = {};
        for (const [ group, map ] of Object.entries(this.debugEvents)) {
            const onKeys = [];
            for (const [ k, v ] of Object.entries(map)) if (v === true) onKeys.push(k);
            if (onKeys.length) events[ group ] = onKeys;
        }

        /** @type {Record<string, string[]>} */
        const gameObjects = {};
        for (const [ group, map ] of Object.entries(this.debugGameObjects)) {
            const onKeys = [];
            for (const [ k, v ] of Object.entries(map)) if (v === true) onKeys.push(k);
            if (onKeys.length) gameObjects[ group ] = onKeys;
        }

        return { debugOn: this.debugOn, functions, events, gameObjects };
    }
    /**
     * Build the ON report as a single multi-line string.
     *
     * @param {{ newline?: "\n" | "\r\n" }} [opts]
     * @returns {string}
     */
    formatOnList (opts = {}) {
        const { newline = "\n" } = opts;

        if (!this._isActive()) return "";

        const state = this.getOnList();
        const lines = [];

        lines.push(`§6§l[Dev]§r ON Report (debugOn=${state.debugOn ? "§aTrue" : "§cFalse"}§r)`);

        if (state.functions.length) {
            lines.push(`§eFunctions§r: ${state.functions.join(", ")}`);
        }

        const eventGroups = Object.keys(state.events);
        if (eventGroups.length) {
            lines.push(`§eEvents§r:`);
            for (const g of eventGroups) lines.push(`  §7- ${g}:§r ${state.events[ g ].join(", ")}`);
        }

        const objGroups = Object.keys(state.gameObjects);
        if (objGroups.length) {
            lines.push(`§eGameObjects§r:`);
            for (const g of objGroups) lines.push(`  §7- ${g}:§r ${state.gameObjects[ g ].join(", ")}`);
        }

        if (
            state.functions.length === 0 &&
            eventGroups.length === 0 &&
            objGroups.length === 0
        ) {
            lines.push("§7(nothing enabled)§r");
        }

        // IMPORTANT: single string payload
        return lines.join(newline);
    }

    /**
     * Log what is currently ON as ONE message (prevents double-spacing).
     *
     * @param {{
     *   dest?: "alert" | "chat" | "console" | "alert+chat",
     *   newline?: "\n" | "\r\n",
     *   send?: boolean
     * }} [opts]
     */
    logOnList (opts = {}) {
        const {
            dest = "alert",
            newline = "\n",
            send = true
        } = opts;

        if (!this._isActive()) return;

        const msg = this.formatOnList({ newline });
        if (!msg) return;

        // One emission, chosen destination(s)
        if (dest === "console") {
            console.log(msg);
            return;
        }

        if (dest === "chat") {
            this._msgs.chatLog.log(msg, send);
            return;
        }

        if (dest === "alert") {
            // Use control log so it prints even if debugOn is currently false
            this._controlLog(msg, send);
            return;
        }

        if (dest === "alert+chat") {
            this._controlLog(msg, send);
            this._msgs.chatLog.log(msg, send);
            return;
        }
    }

    /**
        * List - If the gameObject and/or event is ON (only one *)
        * @param {unknown} input 
        * @param {string} title 
        * @param {string} group
        * @param {string | '*'} eventKey   *=means any
        * @param {string | '*'} objectKey  *=means any       
        */
    listObjectInnardsIf (input, title = "Key-Value List:", group, eventKey, objectKey) {
        if (!this._isActive()) return;
        if (objectKey === "*" && eventKey === "*") { throw new Error(`§c[Dev]${this.pack_name}:listObjectInnardsIf§r §eOnly one of objectKey/eventKey may be "*"§r`); }

        if (!input || typeof input !== 'object' || !this._isValidGameObjectGroup(group)) return;

        let send = (objectKey == '*' || this._isDebugObject(group, objectKey)) &&
            (eventKey == '*' || this._isDebugEvent(group, eventKey));

        if (send) listObjectInnards(input, { title });
    }
    /**
     * List - If the gameObject and/or event is ON (only one *)
     * @param {*[]} array 
     * @param {string} title
     * @param {string} group
     * @param {string | '*'} eventKey   *=means any
     * @param {string | '*'} objectKey  *=means any       
     */
    listArrayIf (array, title = "Array List:", group, eventKey, objectKey) {
        if (!this._isActive()) return;
        if (!array || typeof array !== 'object' || !this._isValidGameObjectGroup(group) || objectKey == eventKey) return;

        let send = (objectKey == '*' || this._isDebugObject(group, objectKey)) &&
            (eventKey == '*' || this._isDebugEvent(group, eventKey));

        if (send) listArray(array, { title });
    }
    /**
     * Resolve an input key to an existing canonical key in `map`, using case-insensitive matching.
     * Optionally add the key if it doesn't exist and doesn't collide case-insensitively.
     *
     * @param {Record<string, boolean>} map
     * @param {string} title
     * @param {string} key
     * @param {{ addIfNew?: boolean, caseInsensitive?: boolean }} [opts]
     * @returns {string} canonical key to use
     */
    _resolveKey (map, title, key, opts = {}) {
        const { addIfNew = false, caseInsensitive = true } = opts;

        if (typeof key !== "string" || !key.length) {
            throw new Error(`${title}: key must be a non-empty string`);
        }

        // Exact match wins
        if (Object.hasOwn(map, key)) return key;

        if (caseInsensitive) {
            const want = key.toLowerCase();

            // Find any existing key whose lowercase matches
            let found = "";
            for (const existing of Object.keys(map)) {
                if (existing.toLowerCase() === want) {
                    if (found) {
                        // This only happens if someone already created two keys differing only by case
                        throw new Error(`${title}: ambiguous case-insensitive match for "${key}" -> "${found}" and "${existing}"`);
                    }
                    found = existing;
                }
            }

            if (found) return found;

            // No match — only allow add if it doesn't collide
            if (addIfNew) {
                // (We already checked no existing lower-match)
                map[ key ] = false; // placeholder; caller will assign actual value
                return key;
            }

            // strict: show suggestions / throw
            this._keySuggestion(title, map, key, true);
            // never returns
        }

        // caseSensitive strict fallback
        if (addIfNew) {
            map[ key ] = false;
            return key;
        }

        this._keySuggestion(title, map, key, true);
        return '';
    }

    //==============================================================================================================================
    /* Update by Set  - use these turn on events in the derived classes to avoid later problems - objects can still be customized */
    //==============================================================================================================================
    /**
     * @param {string} group
     * @param {string} key
     * @param {boolean} [value=true]
     * @param {boolean} [alert=true]
     * @param {{ addIfNew?: boolean, caseInsensitive?: boolean, batchMode?: boolean }} [opts]
     */
    set_Event (group, key, value = true, alert = true, opts = {}) {
        if (!this._isActive()) return;

        const { batchMode = false } = opts;
        if (batchMode) alert = false;

        this._isValidGameObjectGroup(group);

        /** @type {Record<string, boolean>} */
        const map = (this.debugEvents[ group ] ??= {});
        const title = toTitleCase(`${group} Event`);

        const canonical = this._resolveKey(map, title, key, opts);
        const cur = !!map[ canonical ];

        map[ canonical ] = value;

        if (value) { this.debugOn = true; }
        else if (cur) { if (!batchMode) this.anyOn(); }

        if (!batchMode && alert) {
            const iffy = (cur === value) ? "already" : "now turned";
            this._controlLog(`§6${title}§r "${canonical}" is ${iffy} ${value ? "§aOn" : "§cOff"}`, true);
        }
    }
    /**
     * @param {Boolean2DeepMap} events2Deep
     * @param {{ addIfNew?: boolean, caseInsensitive?: boolean }} [opts]
     */
    applyMany_Events (events2Deep, opts = {}) {
        if (!this._isActive()) return;

        const localOpts = { ...opts, batchMode: true };

        for (const [ group, map ] of Object.entries(events2Deep ?? {})) {
            for (const [ k, v ] of Object.entries(map ?? {})) {
                this.set_Event(group, k, !!v, false, localOpts);
            }
        }

        this.anyOn();
    }
    /**
     * @param {string} key
     * @param {boolean} [value=true]
     * @param {boolean} [alert=true]
     * @param {{ addIfNew?: boolean, caseInsensitive?: boolean, batchMode?: boolean }} [opts]
     */
    set_Function (key, value = true, alert = true, opts = {}) {
        if (!this._isActive()) return;

        const { batchMode = false } = opts;
        if (batchMode) alert = false;

        const canonical = this._resolveKey(this.debugFunctions, "Function", key, opts);
        const cur = !!this.debugFunctions[ canonical ];

        this.debugFunctions[ canonical ] = value;

        if (value) { this.debugOn = true; }
        else if (cur) { if (!batchMode) this.anyOn(); }

        // No spam in batch mode
        if (!batchMode && alert) {
            const iffy = (cur === value) ? "already" : "now turned";
            this._controlLog(`§6Function§r "${canonical}" is ${iffy} ${value ? "§aOn" : "§cOff"}`, true);
        }
    }
    /**
     * @param {BooleanMap} funcMap
     * @param {{ addIfNew?: boolean, caseInsensitive?: boolean }} [opts]
     */
    applyMany_Functions (funcMap, opts = {}) {
        if (!this._isActive()) return;

        const localOpts = { ...opts, batchMode: true };

        for (const [ k, v ] of Object.entries(funcMap ?? {})) {
            this.set_Function(k, !!v, false, localOpts);
        }

        // One correct scan per batch
        this.anyOn();
    }
    /**
     * @param {string} group
     * @param {string} key
     * @param {boolean} [value=true]
     * @param {boolean} [alert=true]
     * @param {{ addIfNew?: boolean, caseInsensitive?: boolean, batchMode?: boolean }} [opts]
     */
    set_GameObject (group, key, value = true, alert = true, opts = {}) {
        if (!this._isActive()) return;

        const { batchMode = false } = opts;
        if (batchMode) alert = false;

        this._isValidGameObjectGroup(group);

        /** @type {Record<string, boolean>} */
        const map = (this.debugGameObjects[ group ] ??= {});
        const title = toTitleCase(`${group} Game Object`);

        const canonical = this._resolveKey(map, title, key, opts);
        const cur = !!map[ canonical ];

        map[ canonical ] = value;

        if (value) { this.debugOn = true; }
        else if (cur) { if (!batchMode) this.anyOn(); }

        if (!batchMode && alert) {
            const iffy = (cur === value) ? "already" : "now turned";
            this._controlLog(`§6${title}§r "${canonical}" is ${iffy} ${value ? "§aOn" : "§cOff"}`, true);
        }
    }
    /**
     * @param {Boolean2DeepMap} go2Deep
     * @param {{ addIfNew?: boolean, caseInsensitive?: boolean }} [opts]
     */
    applyMany_GameObjects (go2Deep, opts = {}) {
        if (!this._isActive()) return;

        const localOpts = { ...opts, batchMode: true };

        for (const [ group, map ] of Object.entries(go2Deep ?? {})) {
            for (const [ k, v ] of Object.entries(map ?? {})) {
                this.set_GameObject(group, k, !!v, false, localOpts);
            }
        }

        this.anyOn();
    }
    /**
    * Turn on/off a block event     
    * @param {string} key 
    * @param {boolean} [value = true] 
    * @param {boolean} [alert = true] Tell debugger the new status
    * 
    * Fails if invalid key (for your own good)
    */
    set_blockEvent (key, value = true, alert = true) { this.set_Event(gameObjMap.block, key, value, alert); }
    /**
    * Turn on/off a entity event     
    * @param {string} key 
    * @param {boolean} [value = true] 
    * @param {boolean} [alert = true] Tell debugger the new status
    * 
    * Fails if invalid or key (for your own good)
    */
    set_entityEvent (key, value = true, alert = true) { this.set_Event(gameObjMap.entity, key, value, alert); }
    /**
    * Turn on/off an item event     
    * @param {string} key 
    * @param {boolean} [value = true] 
    * @param {boolean} [alert = true] Tell debugger the new status
    * 
    * Fails if invalid or key (for your own good)
    */
    set_itemEvent (key, value = true, alert = true) { this.set_Event(gameObjMap.item, key, value, alert); }
    /**
    * Turn on/off a player event     
    * @param {string} key 
    * @param {boolean} [value = true] 
    * @param {boolean} [alert = true] Tell debugger the new status
    * 
    * Fails if invalid key (for your own good)
    */
    set_playerEvent (key, value = true, alert = true) { this.set_Event(gameObjMap.player, key, value, alert); }
    /**
    * Turn on/off a system event     
    * @param {string} key 
    * @param {boolean} [value = true] 
    * @param {boolean} [alert = true] Tell debugger the new status
    * 
    * Fails if invalid key (for your own good)
    */
    set_systemEvent (key, value = true, alert = true) { this.set_Event(gameObjMap.system, key, value, alert); }
    /**
    * Turn on/off a block game object     
    * @param {string} key 
    * @param {boolean} [value = true] 
    * @param {boolean} [alert = true] Tell debugger the new status
    * 
    * Fails if invalid key (for your own good)
    */
    set_blockGameObject (key, value = true, alert = true) { this.set_GameObject(gameObjMap.block, key, value, alert); }
    /**
    * Turn on/off a entity game object     
    * @param {string} key 
    * @param {boolean} [value = true] 
    * @param {boolean} [alert = true] Tell debugger the new status
    * 
    * Fails if invalid or key (for your own good)
    */
    set_entityGameObject (key, value = true, alert = true) { this.set_GameObject(gameObjMap.entity, key, value, alert); }
    /**
    * Turn on/off an item game object     
    * @param {string} key 
    * @param {boolean} [value = true] 
    * @param {boolean} [alert = true] Tell debugger the new status
    * 
    * Fails if invalid or key (for your own good)
    */
    set_itemGameObject (key, value = true, alert = true) { this.set_GameObject(gameObjMap.item, key, value, alert); }
    /**
    * Turn on/off a player game object     
    * @param {string} key 
    * @param {boolean} [value = true] 
    * @param {boolean} [alert = true] Tell debugger the new status
    * 
    * Fails if invalid key (for your own good)
    */
    set_playerGameObject (key, value = true, alert = true) { this.set_GameObject(gameObjMap.player, key, value, alert); }
    /**
    * Turn on/off a system game object     
    * @param {string} key 
    * @param {boolean} [value = true] 
    * @param {boolean} [alert = true] Tell debugger the new status
    * 
    * Fails if invalid key (for your own good)
    */
    set_systemGameObject (key, value = true, alert = true) { this.set_GameObject(gameObjMap.system, key, value, alert); }

    //=====================
    /* Update by Toggles */
    //=====================
    /**
     * Toggle on/off a block/entity/item/player/system event
     * @param {string} group 
     * @param {string} key 
     * @param {boolean} [alert = true] Tell use the new status
     * 
     * Fails if invalid group or key (for your own good)
     */
    toggle_Event (group, key, alert = true) {
        if (!this._isActive()) return;
        this._isValidGameObjectGroup(group);

        const title = toTitleCase(`${group} Event "§b${key}§r"`);
        const map = this.debugEvents[ group ];
        const cur = readBooleanKey(map, key);

        if (cur === undefined) {
            this._keySuggestion(title, map, key, true);
            return;
        }

        map[ key ] = !cur;

        // refresh master switch after change
        this.anyOn();

        this._controlLog(`§6${title}§r is now ${!cur ? "§aOn" : "§cOff"}`, alert);

    }
    /**
 * Toggle a function debug key (flat map)
 * @param {string} key
 * @param {boolean} [alert=true]
 */
    toggle_Function (key, alert = true) {
        if (!this._isActive()) return;
        if (!this._isValidFunctionKey(key)) return;

        const map = this.debugFunctions;
        const cur = readBooleanKey(map, key);

        map[ key ] = !cur;
        this.anyOn();

        if (alert) this._controlLog(`§6Function§r "§b${key}§r" is now ${!cur ? "§aOn" : "§cOff"}`, true);
    }
    /**
     * Toggle on/off blocks/entities/items/players/systems @ object level
     * @param {string} group 
     * @param {string} key 
     * @param {boolean} [alert = true] Tells the new status
     * 
     * Fails if invalid group or key (for your own good)
     */
    toggle_GameObject (group, key, alert = true) {
        if (!this._isActive()) return;
        if (!this._isValidGameObjectGroup(group)) return;

        const title = toTitleCase(`${group} Game Object "§b${key}§r"`);
        const map = this.debugGameObjects[ group ];

        const cur = readBooleanKey(map, key);
        if (cur === undefined) {
            this._keySuggestion(title, map, key, true);
            return;
        }

        map[ key ] = !cur;
        this.anyOn();

        this._controlLog(`§6${title}§r is now ${!cur ? '§aOn' : '§cOff'}`, alert);
    }
    /**
    * Toggle on/off a block event     
    * @param {string} key 
    * @param {boolean} [alert = true] Tells the new status
    * 
    * Fails if invalid key (for your own good)
    */
    toggle_blockEvent (key, alert = true) { this.toggle_Event(gameObjMap.block, key, alert); }
    /**
    * Toggle on/off a entity event     
    * @param {string} key 
    * @param {boolean} [alert = true] Tells the new status
    * 
    * Fails if invalid or key (for your own good)
    */
    toggle_entityEvent (key, alert = true) { this.toggle_Event(gameObjMap.entity, key, alert); }
    /**
    * Toggle on/off an item event     
    * @param {string} key 
    * @param {boolean} [alert = true] Tells the new status
    * 
    * Fails if invalid or key (for your own good)
    */
    toggle_itemEvent (key, alert = true) { this.toggle_Event(gameObjMap.item, key, alert); }
    /**
    * Toggle on/off a player event     
    * @param {string} key 
    * @param {boolean} [alert = true] Tells the new status
    * 
    * Fails if invalid key (for your own good)
    */
    toggle_playerEvent (key, alert = true) { this.toggle_Event(gameObjMap.player, key, alert); }
    /**
    * Toggle on/off a system event     
    * @param {string} key 
    * @param {boolean} [alert = true] Tells the new status
    * 
    * Fails if invalid key (for your own good)
    */
    toggle_systemEvent (key, alert = true) { this.toggle_Event(gameObjMap.system, key, alert); }
    /**
       * Toggle on/off a block game object     
       * @param {string} key 
       * @param {boolean} [alert = true] Tells the new status
       * 
       * Fails if invalid key (for your own good)
       */
    toggle_blockGameObject (key, alert = true) { this.toggle_GameObject(gameObjMap.block, key, alert); }
    /**
    * Toggle on/off a entity game object     
    * @param {string} key 
    * @param {boolean} [alert = true] Tells the new status
    * 
    * Fails if invalid or key (for your own good)
    */
    toggle_entityGameObject (key, alert = true) { this.toggle_GameObject(gameObjMap.entity, key, alert); }
    /**
    * Toggle on/off an item game object     
    * @param {string} key 
    * @param {boolean} [alert = true] Tells the new status
    * 
    * Fails if invalid or key (for your own good)
    */
    toggle_itemGameObject (key, alert = true) { this.toggle_GameObject(gameObjMap.item, key, alert); }
    /**
    * Toggle on/off a player game object     
    * @param {string} key 
    * @param {boolean} [alert = true] Tells the new status
    * 
    * Fails if invalid key (for your own good)
    */
    toggle_playerGameObject (key, alert = true) { this.toggle_GameObject(gameObjMap.player, key, alert); }
    /**
    * Toggle on/off a system game object     
    * @param {string} key 
    * @param {boolean} [alert = true] Tells the new status
    * 
    * Fails if invalid key (for your own good)
    */
    toggle_systemGameObject (key, alert = true) { this.toggle_GameObject(gameObjMap.system, key, alert); }
    //=================
    /* Add New Stuff */
    //=================
    /**
     * @param {Record<string, any>} config
     * @param {number} depth
     * @param {string[]} groups
     * @param {boolean} ensureGroups
     * @returns {any}
     */
    _buildOverwritten (config, depth, groups, ensureGroups) {
        if (depth === 1) {
            /** @type {Record<string, boolean>} */
            const out = {};
            for (const [ k, v ] of Object.entries(config ?? {})) out[ k ] = !!v;
            return out;
        }
        /** depth === 2 */
        /** @type {Record<string, Record<string, boolean>>} */
        const out = {};
        for (const [ g, map ] of Object.entries(config ?? {})) {
            out[ g ] = {};
            for (const [ k, v ] of Object.entries(map ?? {})) out[ g ][ k ] = !!v;
        }
        if (ensureGroups) for (const g of groups) out[ g ] ??= {};
        return out;
    }
    /**
     * Overwrite one of the debug maps from a config object.
     *
     * @param {"functions" | "events" | "gameObjects"} which
     * @param {any} config
     * @param {{ ensureGroups?: boolean, caseInsensitive?: boolean, addIfNew?: boolean }} [opts]
     */
    overwrite (which, config, opts = {}) {
        if (!this._isActive()) return;

        const { ensureGroups = true } = opts;
        const groups = [ "block", "item", "entity", "player", "system" ];

        const maps = [
            [ this.debugFunctions, 1 ],
            [ this.debugEvents, 2 ],
            [ this.debugGameObjects, 2 ]
        ];
        if (which === "functions") {
            /** @type {Record<string, boolean>} */
            const out = {};
            for (const [ k, v ] of Object.entries(config ?? {})) out[ k ] = !!v;
            this.debugFunctions = out;
            this.anyOn();
            return;
        }

        if (which === "events") {
            /** @type {Record<string, Record<string, boolean>>} */
            const out = {};
            for (const [ g, map ] of Object.entries(config ?? {})) {
                out[ g ] = {};
                for (const [ k, v ] of Object.entries(map ?? {})) out[ g ][ k ] = !!v;
            }
            if (ensureGroups) for (const g of groups) out[ g ] ??= {};
            this.debugEvents = out;
            this.anyOn();
            return;
        }

        if (which === "gameObjects") {
            /** @type {Record<string, Record<string, boolean>>} */
            const out = {};
            for (const [ g, map ] of Object.entries(config ?? {})) {
                out[ g ] = {};
                for (const [ k, v ] of Object.entries(map ?? {})) out[ g ][ k ] = !!v;
            }
            if (ensureGroups) for (const g of groups) out[ g ] ??= {};
            this.debugGameObjects = out;
            this.anyOn();
            return;
        }

        throw new Error(`overwrite: unknown target "${which}"`);
    }
    /**
     * Configure any/all of the Dev maps using one loop.
     *
     * @param {{
     *   functions?: Record<string, boolean>,
     *   events?: Record<string, Record<string, boolean>>,
     *   gameObjects?: Record<string, Record<string, boolean>>,
     * }} cfg
     *
     * @param {{
     *   style?: "overwrite" | "apply",
     *   ensureGroups?: boolean,
     *   addIfNew?: boolean,
     *   caseInsensitive?: boolean,
     * }} [opts]
     */
    /**
     * Configure any/all of the Dev maps using one loop.
     *
     * @param {DevConfig} cfg
     * @param {{
     *   style?: "overwrite" | "apply",
     *   ensureGroups?: boolean,
     *   addIfNew?: boolean,
     *   caseInsensitive?: boolean,
     * }} [opts]
     */
    configure (cfg, opts = {}) {
        if (!this._isActive()) return;

        const {
            style = "apply",
            ensureGroups = true,
            addIfNew = false,
            caseInsensitive = true,
        } = opts;

        const groups = [ ...new Set(Object.values(gameObjMap)) ];

        for (const [ cfgKey, prop, depth ] of MAP_DEFS) {
            /** @type {BooleanMap | Boolean2DeepMap | undefined} */
            const incoming = cfg[ cfgKey ];
            if (!incoming) continue;

            if (style === "overwrite") {
                this[ prop ] = this._buildOverwritten(incoming, depth, groups, ensureGroups);
                continue;
            }

            // style === "apply"
            if (depth === 1) {
                this.applyMany_Functions(/** @type {BooleanMap} */(incoming), { addIfNew, caseInsensitive });
            } else if (prop === "debugEvents") {
                this.applyMany_Events(/** @type {Boolean2DeepMap} */(incoming), { addIfNew, caseInsensitive });
            } else {
                this.applyMany_GameObjects(/** @type {Boolean2DeepMap} */(incoming), { addIfNew, caseInsensitive });
            }
        }

        this.anyOn();
    }

    /**
     * Register a new function debug key (flat map)
     * @param {string} key
     * @param {boolean} [defaultValue=false]
     * @param {{ allowOverwrite?: boolean }} [opts]
     */
    add_Function (key, defaultValue = false, opts = {}) {
        if (!this._isActive()) return;
        const { allowOverwrite = false } = opts;

        if (typeof key !== "string" || !key.length) throw new Error("add_Function: key must be a non-empty string");
        if (typeof defaultValue !== "boolean") throw new Error("add_Function: defaultValue must be boolean");

        if (!allowOverwrite && Object.hasOwn(this.debugFunctions, key)) return;
        this.debugFunctions[ key ] = defaultValue;
        if (defaultValue) this.debugOn = true;
    }

    /**
     * Register a new event debug key (2-deep map)
     * @param {string} group
     * @param {string} key
     * @param {boolean} [defaultValue=false]
     * @param {{ allowOverwrite?: boolean }} [opts]
     */
    add_Event (group, key, defaultValue = false, opts = {}) {
        if (!this._isActive()) return;
        const { allowOverwrite = false } = opts;

        this._isValidGameObjectGroup(group);

        if (typeof key !== "string" || !key.length) throw new Error("add_Event: key must be a non-empty string");
        if (typeof defaultValue !== "boolean") throw new Error("add_Event: defaultValue must be boolean");

        const map = (this.debugEvents[ group ] ??= {});
        if (!allowOverwrite && Object.hasOwn(map, key)) return;

        map[ key ] = defaultValue;
        if (defaultValue) this.debugOn = true;
    }

    /**
     * Register a new gameObject debug key (2-deep map)
     * @param {string} group
     * @param {string} key
     * @param {boolean} [defaultValue=false]
     * @param {{ allowOverwrite?: boolean }} [opts]
     */
    add_GameObject (group, key, defaultValue = false, opts = {}) {
        if (!this._isActive()) return;
        const { allowOverwrite = false } = opts;

        this._isValidGameObjectGroup(group);

        if (typeof key !== "string" || !key.length) throw new Error("add_GameObject: key must be a non-empty string");
        if (typeof defaultValue !== "boolean") throw new Error("add_GameObject: defaultValue must be boolean");

        const map = (this.debugGameObjects[ group ] ??= {});
        if (!allowOverwrite && Object.hasOwn(map, key)) return;

        map[ key ] = defaultValue;
        if (defaultValue) this.debugOn = true;
    }
    /**
     * 
     * @param {BooleanMap} funcMap 
     * @param {*} opts 
     * @returns 
     */
    addMany_Functions (funcMap, opts = {}) {
        if (!this._isActive()) return;
        for (const [ k, v ] of Object.entries(funcMap ?? {})) {
            this.add_Function(k, !!v, opts);
        }
    }
    /**
     * 
     * @param {Boolean2DeepMap} events2Deep 
     * @param {*} opts 
     * @returns 
     */
    addMany_Events (events2Deep, opts = {}) {
        if (!this._isActive()) return;
        for (const [ group, map ] of Object.entries(events2Deep ?? {})) {
            for (const [ k, v ] of Object.entries(map ?? {})) {
                this.add_Event(group, k, !!v, opts);
            }
        }
    }
    /**
     * 
     * @param {Boolean2DeepMap} go2Deep 
     * @param {*} opts 
     * @returns 
     */
    addMany_GameObjects (go2Deep, opts = {}) {
        if (!this._isActive()) return;
        for (const [ group, map ] of Object.entries(go2Deep ?? {})) {
            for (const [ k, v ] of Object.entries(map ?? {})) {
                this.add_GameObject(group, k, !!v, opts);
            }
        }
    }
};
