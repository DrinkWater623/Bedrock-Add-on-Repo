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
 */
//============================================================================================
// Class For Dev Debugging
//============================================================================================
/* This is important, if you create new groups, must add to gameObjectMap or they will fail */
//============================================================================================
const gameObjectMap = {
    block: 'block',
    entity: 'entity',
    item: 'item',
    player: 'player',
    system: "system"
};
/**
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
    /**
   * Can only work for one level deep
   * @param {string} group 
   * @param {string} key
   * @returns {boolean}
   */
    _isDebugEvent (group, key) {
        if (!this._masterPackDebugOn) return false;
        if (!this._isValidGameObjectGroup(group)) return false;
        const map = this.debugEvents[ group ];
        const val = readBooleanKey(map, key);
        return !!val;
    }
    /**
    * Can only work for one level deep
    * @param {string} group 
    * @param {string} key
    * @returns {boolean}
    */
    _isDebugGameObject (group, key) {
        if (!this._masterPackDebugOn) return false;
        if (!this._isValidGameObjectGroup(group)) return false;
        const map = this.debugGameObjects[ group ];
        const val = readBooleanKey(map, key);
        return !!val;
    }
    /**
     * Can only work for one level deep
     * @param {string} group 
     * @param {string|null|undefined} objectKey
     * @param {string} eventKey 
     * @returns {boolean}
     */
    _isDebugGameObjectEvent (group, objectKey, eventKey) {
        if (!this._masterPackDebugOn) return false;
        if (!this._isValidGameObjectGroup(group)) return false;
        if (!objectKey || objectKey == '*') return this._isDebugEvent(group, eventKey);
        return this._isDebugEvent(group, eventKey) && this._isDebugGameObject(group, objectKey);
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
        if (!Object.hasOwn(gameObjectMap, group)) throw new Error(`§c[Dev]${this.pack_name}:§r§eInvalid Game Object Group "§b${group}§r"`);
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
    //=============================================================
    // Lookups per Event or Game Object and/or Game Object + Event
    //=============================================================
    /** Log control/command feedback even if debugOn is currently false */
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
    _controlWarn (msg, send = true) {
        if (!this._masterPackDebugOn || !msg) return;
        this._msgs.alertLog.warn(msg, send);
    }
    /**
     * Can only work for one level deep
     * @param {string} blockKey 
     * @returns {boolean}
     */
    isDebugBlock (blockKey,) { return this._isDebugGameObject(gameObjectMap.block, blockKey); }
    /**
     * Can only work for one level deep
     * @param {string|null|undefined} blockKey 
     * @param {string} eventKey 
     * @returns {boolean}
     */
    isDebugBlockEvent (blockKey, eventKey) { return this._isDebugGameObjectEvent(gameObjectMap.block, blockKey, eventKey); }
    /**
     * Can only work for one level deep
     * @param {string} entityKey 
     * @returns {boolean}
     */
    isDebugEntity (entityKey,) { return this._isDebugGameObject(gameObjectMap.entity, entityKey); }
    /**
    * Can only work for one level deep
    * @param {string|null|undefined} entityKey 
    * @param {string} eventKey 
    * @returns {boolean}
    */
    isDebugEntityEvent (entityKey, eventKey) { return this._isDebugGameObjectEvent(gameObjectMap.entity, entityKey, eventKey); }
    /**
     * Can only work for one level deep
     * @param {string} itemKey 
     * @returns {boolean}
     */
    isDebugItem (itemKey,) { return this._isDebugGameObject(gameObjectMap.item, itemKey); }
    /**
    * Can only work for one level deep
    * @param {string|null|undefined} itemKey 
    * @param {string} eventKey 
    * @returns {boolean}
    */
    isDebugItemEvent (itemKey, eventKey) { return this._isDebugGameObjectEvent(gameObjectMap.item, itemKey, eventKey); }
    /**
     * Can only work for one level deep
     * @param {string} playerKey 
     * @returns {boolean}
     */
    isDebugPlayer (playerKey,) { return this._isDebugGameObject(gameObjectMap.player, playerKey); }
    /**
    * Can only work for one level deep
    * @param {string|null|undefined} playerKey 
    * @param {string} eventKey 
    * @returns {boolean}
    */
    isDebugPlayerEvent (playerKey, eventKey) { return this._isDebugGameObjectEvent(gameObjectMap.player, playerKey, eventKey); }
    /**
     * Can only work for one level deep
     * @param {string} systemKey 
     * @returns {boolean}
     */
    isDebugSystem (systemKey,) { return this._isDebugGameObject(gameObjectMap.system, systemKey); }
    /**
    * Can only work for one level deep
    * @param {string|null|undefined} systemKey 
    * @param {string} eventKey 
    * @returns {boolean}
    */
    isDebugSystemEvent (systemKey, eventKey) { return this._isDebugGameObjectEvent(gameObjectMap.system, systemKey, eventKey); }
    /**
     * 
     * @param {string} key 
     * @returns {boolean}
     */
    isDebugFunction (key) {
        if (!this._isValidFunctionKey(key)) return false;
        return !!this.debugFunctions[ key ];
    }
    //===============================
    /* General Alerts per Occasion */
    //===============================
    /**
        * @param {string} msg
        * @param {boolean} [send=false] does not matter - remove later
        */
    alertError (msg, send = false) { if (this._masterPackDebugOn) if (this.debugOn && msg) this._msgs.alertLog.error(`${msg}`, true); }
    /**
     * @param {string} msg
     *  @param {boolean} [send=false]
     */
    alertLog (msg, send = false) { if (this._masterPackDebugOn) if (this.debugOn && msg) this._msgs.alertLog.log(msg, true); }
    /**
     * @param {string} msg
     *  @param {boolean} [send=false]
     */
    alertSuccess (msg, send = false) { if (this._masterPackDebugOn) if (this.debugOn && msg) this._msgs.alertLog.success(msg, true); }
    /**
     * @param {string} msg
     * @param {boolean} [send=false] does not matter - remove later
     */
    alertWarn (msg, send = false) { if (this._masterPackDebugOn) if (this.debugOn && msg) this._msgs.alertLog.warn(msg, true); }
    /**
    * 
    * @param {string} funcKey - The name of the function.
    * @param {boolean} [start = true] 
    * @param {boolean} [alert = false] 
    */
    alertFunction (funcKey, start = true, alert = false) {
        this.alertLog(`§6§l${start ? '**' : 'xx'}§r function §6${funcKey}§r()`, (this.isDebugFunction(funcKey) && alert));
    }
    //=================================================
    /* Error Alerts if GameObject and/or Event is on */
    //=================================================
    /**
     * @param {string} blockKey 
     * @param {string} msg
     * @param {boolean} [send  = true]
     */
    alertBlockError (blockKey, msg, send = true) { if (this.isDebugBlock(blockKey) && send) { this.alertError(msg, true); } }
    /**
     * @param {string | null | undefined} blockKey 
     * @param {string} eventKey 
     * @param {string} msg
     * @param {boolean} [send=false] 
     */
    alertBlockEventError (blockKey, eventKey, msg, send = true) { if (this.isDebugBlockEvent(blockKey, eventKey) && send) { this.alertError(msg, true); } }
    /**
    * @param {string} entityKey 
    * @param {string} msg
    *  @param {boolean} send 
    */
    alertEntityError (entityKey, msg, send = true) { if (this.isDebugEntity(entityKey) && send) { this.alertError(msg, true); } }
    /**
     * @param {string | null | undefined} entityKey 
     * @param {string} eventKey 
     * @param {string} msg
     * @param {boolean} [send=false] 
     */
    alertEntityEventError (entityKey, eventKey, msg, send = true) { if (this.isDebugEntityEvent(entityKey, eventKey) && send) { this.alertError(msg, true); } }
    /**
     * @param {string} itemKey 
     * @param {string} msg
     *  @param {boolean} send 
     */
    alertItemError (itemKey, msg, send = true) { if (this.isDebugItem(itemKey) && send) { this.alertError(msg, true); } }
    /**
     * @param {string | null | undefined} itemKey 
     * @param {string} eventKey 
     * @param {string} msg
     * @param {boolean} [send=false] 
     */
    alertItemEventError (itemKey, eventKey, msg, send = true) { if (this.isDebugItemEvent(itemKey, eventKey) && send) { this.alertError(msg, true); } }
    /**
    * @param {string} playerKey 
    * @param {string} msg
    *  @param {boolean} send 
    */
    alertPlayerError (playerKey, msg, send = true) { if (this.isDebugPlayer(playerKey) && send) { this.alertError(msg, true); } }
    /**
     * @param {string | null | undefined} playerKey 
     * @param {string} eventKey 
     * @param {string} msg
     * @param {boolean} [send=false] 
     */
    alertPlayerEventError (playerKey, eventKey, msg, send = true) { if (this.isDebugPlayerEvent(playerKey, eventKey) && send) { this.alertError(msg, true); } }
    /**
     * @param {string} systemKey 
     * @param {string} msg
     *  @param {boolean} send 
     */
    alertSystemError (systemKey, msg, send = true) { if (this.isDebugSystem(systemKey) && send) { this.alertError(msg, true); } }
    /**
     * @param {string | null | undefined} systemKey 
     * @param {string} eventKey 
     * @param {string} msg
     * @param {boolean} [send=false] 
     */
    alertSystemEventError (systemKey, eventKey, msg, send = true) { if (this.isDebugSystemEvent(systemKey, eventKey) && send) { this.alertError(msg, true); } }
    //===============================================
    /* Log Alerts if GameObject and/or Event is on */
    //===============================================
    /**
     * @param {string} blockKey 
     * @param {string} msg
     *  @param {boolean} send 
     */
    alertBlockLog (blockKey, msg, send = false) { if (this.isDebugBlock(blockKey)) { this.alertLog(msg, send); } }
    /**
     * @param {string | null | undefined} blockKey 
     * @param {string} eventKey 
     * @param {string} msg
     * @param {boolean} [send = false] 
     */
    alertBlockEventLog (blockKey, eventKey, msg, send = false) { if (this.isDebugBlockEvent(blockKey, eventKey)) { this.alertLog(msg, send); } }
    /**
    * @param {string} entityKey 
    * @param {string} msg
    *  @param {boolean} send 
    */
    alertEntityLog (entityKey, msg, send = false) { if (this.isDebugEntity(entityKey)) { this.alertLog(msg, send); } }
    /**
     * @param {string | null | undefined} entityKey 
     * @param {string} eventKey 
     * @param {string} msg
     * @param {boolean} [send=false] 
     */
    alertEntityEventLog (entityKey, eventKey, msg, send = false) { if (this.isDebugEntityEvent(entityKey, eventKey)) { this.alertLog(msg, send); } }
    /**
     * @param {string} itemKey 
     * @param {string} msg
     *  @param {boolean} send 
     */
    alertItemLog (itemKey, msg, send = false) { if (this.isDebugItem(itemKey)) { this.alertLog(msg, send); } }
    /**
     * @param {string | null | undefined} itemKey 
     * @param {string} eventKey 
     * @param {string} msg
     * @param {boolean} [send=false] 
     */
    alertItemEventLog (itemKey, eventKey, msg, send = false) { if (this.isDebugItemEvent(itemKey, eventKey)) { this.alertLog(msg, send); } }
    /**
    * @param {string} playerKey 
    * @param {string} msg
    *  @param {boolean} send 
    */
    alertPlayerLog (playerKey, msg, send = false) { if (this.isDebugPlayer(playerKey)) { this.alertLog(msg, send); } }
    /**
     * @param {string | null | undefined} playerKey 
     * @param {string} eventKey 
     * @param {string} msg
     * @param {boolean} [send=false] 
     */
    alertPlayerEventLog (playerKey, eventKey, msg, send = false) { if (this.isDebugPlayerEvent(playerKey, eventKey)) { this.alertLog(msg, send); } }
    /**
     * @param {string} systemKey 
     * @param {string} msg
     *  @param {boolean} send 
     */
    alertSystemLog (systemKey, msg, send = false) { if (this.isDebugSystem(systemKey)) { this.alertLog(msg, send); } }
    /**
     * @param {string | null | undefined} systemKey 
     * @param {string} eventKey 
     * @param {string} msg
     * @param {boolean} [send=false] 
     */
    alertSystemEventLog (systemKey, eventKey, msg, send = false) { if (this.isDebugSystemEvent(systemKey, eventKey)) { this.alertLog(msg, send); } }
    //===================================================
    /* Success Alerts if GameObject and/or Event is on */
    //===================================================
    /**
     * @param {string} blockKey 
     * @param {string} msg
     * @param {boolean} [send = false] 
     */
    alertBlockSuccess (blockKey, msg, send = false) { if (this.isDebugBlock(blockKey)) { this.alertSuccess(msg, send); } }
    /**
     * @param {string | null | undefined} blockKey 
     * @param {string} eventKey 
     * @param {string} msg
     * @param {boolean} [send=false] 
     */
    alertBlockEventSuccess (blockKey, eventKey, msg, send = false) { if (this.isDebugBlockEvent(blockKey, eventKey)) { this.alertSuccess(msg, send); } }
    /**
    * @param {string} entityKey 
    * @param {string} msg
    *  @param {boolean} [send = false] 
    */
    alertEntitySuccess (entityKey, msg, send = false) { if (this.isDebugEntity(entityKey)) { this.alertSuccess(msg, send); } }
    /**
     * @param {string | null | undefined} entityKey 
     * @param {string} eventKey 
     * @param {string} msg
     * @param {boolean} [send=false] 
     */
    alertEntityEventSuccess (entityKey, eventKey, msg, send = false) { if (this.isDebugEntityEvent(entityKey, eventKey)) { this.alertSuccess(msg, send); } }
    /**
     * @param {string} itemKey 
     * @param {string} msg
     *  @param {boolean} [send = false] 
     */
    alertItemSuccess (itemKey, msg, send = false) { if (this.isDebugItem(itemKey)) { this.alertSuccess(msg, send); } }
    /**
     * @param {string | null | undefined} itemKey 
     * @param {string} eventKey 
     * @param {string} msg
     * @param {boolean} [send=false] 
     */
    alertItemEventSuccess (itemKey, eventKey, msg, send = false) { if (this.isDebugItemEvent(itemKey, eventKey)) { this.alertSuccess(msg, send); } }
    /**
    * @param {string} playerKey 
    * @param {string} msg
    *  @param {boolean} [send = false] 
    */
    alertPlayerSuccess (playerKey, msg, send = false) { if (this.isDebugPlayer(playerKey)) { this.alertSuccess(msg, send); } }
    /**
     * @param {string | null | undefined} playerKey 
     * @param {string} eventKey 
     * @param {string} msg
     * @param {boolean} [send=false] 
     */
    alertPlayerEventSuccess (playerKey, eventKey, msg, send = false) { if (this.isDebugPlayerEvent(playerKey, eventKey)) { this.alertSuccess(msg, send); } }
    /**
     * @param {string} systemKey 
     * @param {string} msg
     *  @param {boolean} [send = false] 
     */
    alertSystemSuccess (systemKey, msg, send = false) { if (this.isDebugSystem(systemKey)) { this.alertSuccess(msg, send); } }
    /**
     * @param {string | null | undefined} systemKey 
     * @param {string} eventKey 
     * @param {string} msg
     * @param {boolean} [send=false] 
     */
    alertSystemEventSuccess (systemKey, eventKey, msg, send = false) { if (this.isDebugSystemEvent(systemKey, eventKey)) { this.alertSuccess(msg, send); } }
    //================================================
    /* Warn Alerts if GameObject and/or Event is on */
    //================================================
    /**
     * @param {string} blockKey 
     * @param {string} msg
     * @param {boolean} [send = true] 
     */
    alertBlockWarn (blockKey, msg, send = true) { if (this.isDebugBlock(blockKey)) { this.alertWarn(msg, send); } }
    /**
     * @param {string | null | undefined} blockKey 
     * @param {string} eventKey 
     * @param {string} msg
     * @param {boolean} [send = true] 
     */
    alertBlockEventWarn (blockKey, eventKey, msg, send = true) { if (this.isDebugBlockEvent(blockKey, eventKey)) { this.alertWarn(msg, send); } }
    /**
    * @param {string} entityKey 
    * @param {string} msg
    *  @param {boolean} [send = true] 
    */
    alertEntityWarn (entityKey, msg, send = true) { if (this.isDebugEntity(entityKey)) { this.alertWarn(msg, send); } }
    /**
     * @param {string | null | undefined} entityKey 
     * @param {string} eventKey 
     * @param {string} msg
     * @param {boolean} [send = true] 
     */
    alertEntityEventWarn (entityKey, eventKey, msg, send = true) { if (this.isDebugEntityEvent(entityKey, eventKey)) { this.alertWarn(msg, send); } }
    /**
     * @param {string} itemKey 
     * @param {string} msg
     *  @param {boolean} [send = true] 
     */
    alertItemWarn (itemKey, msg, send = true) { if (this.isDebugItem(itemKey)) { this.alertWarn(msg, send); } }
    /**
     * @param {string | null | undefined} itemKey 
     * @param {string} eventKey 
     * @param {string} msg
     * @param {boolean} [send = true] 
     */
    alertItemEventWarn (itemKey, eventKey, msg, send = true) { if (this.isDebugItemEvent(itemKey, eventKey)) { this.alertWarn(msg, send); } }
    /**
    * @param {string} playerKey 
    * @param {string} msg
    *  @param {boolean} [send = true] 
    */
    alertPlayerWarn (playerKey, msg, send = true) { if (this.isDebugPlayer(playerKey)) { this.alertWarn(msg, send); } }
    /**
     * @param {string | null | undefined} playerKey 
     * @param {string} eventKey 
     * @param {string} msg
     * @param {boolean} [send = true] 
     */
    alertPlayerEventWarn (playerKey, eventKey, msg, send = true) { if (this.isDebugPlayerEvent(playerKey, eventKey)) { this.alertWarn(msg, send); } }
    /**
     * @param {string} systemKey 
     * @param {string} msg
     *  @param {boolean} [send = true] 
     */
    alertSystemWarn (systemKey, msg, send = true) { if (this.isDebugSystem(systemKey)) { this.alertWarn(msg, send); } }
    /**
     * @param {string | null | undefined} systemKey 
     * @param {string} eventKey 
     * @param {string} msg
     * @param {boolean} [send = true] 
     */
    alertSystemEventWarn (systemKey, eventKey, msg, send = true) { if (this.isDebugSystemEvent(systemKey, eventKey)) { this.alertWarn(msg, send); } }
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

        let send = (objectKey == '*' || this._isDebugGameObject(group, objectKey)) &&
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

        let send = (objectKey == '*' || this._isDebugGameObject(group, objectKey)) &&
            (eventKey == '*' || this._isDebugEvent(group, eventKey));

        if (send) listArray(array, { title });
    }
    //==============================================================================================================================
    /* Update by Set  - use these turn on events in the derived classes to avoid later problems - objects can still be customized */
    //==============================================================================================================================
    /**
     * Turn on/off a block/entity/item/player/system event
     * @param {string} group 
     * @param {string} key 
     * @param {boolean} [value = true] 
     * @param {boolean} [alert = true] Tell debugger the new status
     * 
     * Fails if invalid group or key (for your own good)
     */
    set_Event (group, key, value = true, alert = true) {
        if (!this._isActive()) return;
        this._isValidGameObjectGroup(group);

        const title = toTitleCase(`${group} Event "§b${key}§r"`);
        const map = this.debugEvents[ group ];

        const cur = readBooleanKey(map, key);
        if (cur === undefined) {
            this._keySuggestion(title, map, key, true);
            return;
        }

        map[ key ] = value;

        // refresh master switch after change
        this.anyOn();

        const iffy = cur === value ? "already" : "now turned";
        this._controlLog(`§6${title}§r is ${iffy} ${value ? "§aOn" : "§cOff"}`, alert);
    }
    /**
     * Turn on/off a function debug key (flat map)
     * @param {string} key
     * @param {boolean} [value=true]
     * @param {boolean} [alert=true]
     */
    set_Function (key, value = true, alert = true) {
        if (!this._isActive()) return;
        if (!this._isValidFunctionKey(key)) return;

        const map = this.debugFunctions;
        const cur = readBooleanKey(map, key);

        const iffy = cur === value ? "already" : "now turned";
        map[ key ] = value;

        // refresh master
        this.anyOn();

        // Use control log so turning OFF the last thing still reports success
        if (alert) this._controlLog(`§6Function§r "§b${key}§r" is ${iffy} ${value ? "§aOn" : "§cOff"}`, true);
    }
    /**
     * Turn on/off blocks/entities/items/players/systems @ object level
     * @param {string} group 
     * @param {string} key 
     * @param {boolean} [value = true] 
     * @param {boolean} [alert = true] Tell debugger the new status
     * 
     * Fails if invalid group or key (for your own good)
     */
    set_GameObject (group, key, value = true, alert = true) {
        if (!this._isActive()) return;
        this._isValidGameObjectGroup(group);

        const title = toTitleCase(`${group} Game Object "§b${key}§r"`);
        const map = this.debugGameObjects[ group ];

        const cur = readBooleanKey(map, key);
        if (cur === undefined) {
            this._keySuggestion(title, map, key, true);
            return;
        }

        map[ key ] = value;
        this.anyOn();

        const iffy = cur == value ? 'already' : 'now turned';
        this._controlLog(`§6${title}§r is ${iffy} ${value ? "§aOn" : "§cOff"}`, alert);
    }
    /**
    * Turn on/off a block event     
    * @param {string} key 
    * @param {boolean} [value = true] 
    * @param {boolean} [alert = true] Tell debugger the new status
    * 
    * Fails if invalid key (for your own good)
    */
    set_blockEvent (key, value = true, alert = false) { this.set_Event(gameObjectMap.block, key, value, alert); }
    /**
    * Turn on/off a entity event     
    * @param {string} key 
    * @param {boolean} [value = true] 
    * @param {boolean} [alert = true] Tell debugger the new status
    * 
    * Fails if invalid or key (for your own good)
    */
    set_entityEvent (key, value = true, alert = true) { this.set_Event(gameObjectMap.entity, key, value, alert); }
    /**
    * Turn on/off an item event     
    * @param {string} key 
    * @param {boolean} [value = true] 
    * @param {boolean} [alert = true] Tell debugger the new status
    * 
    * Fails if invalid or key (for your own good)
    */
    set_itemEvent (key, value = true, alert = true) { this.set_Event(gameObjectMap.item, key, value, alert); }
    /**
    * Turn on/off a player event     
    * @param {string} key 
    * @param {boolean} [value = true] 
    * @param {boolean} [alert = true] Tell debugger the new status
    * 
    * Fails if invalid key (for your own good)
    */
    set_playerEvent (key, value = true, alert = true) { this.set_Event(gameObjectMap.player, key, value, alert); }
    /**
    * Turn on/off a system event     
    * @param {string} key 
    * @param {boolean} [value = true] 
    * @param {boolean} [alert = true] Tell debugger the new status
    * 
    * Fails if invalid key (for your own good)
    */
    set_systemEvent (key, value = true, alert = true) { this.set_Event(gameObjectMap.system, key, value, alert); }
    /**
    * Turn on/off a block game object     
    * @param {string} key 
    * @param {boolean} [value = true] 
    * @param {boolean} [alert = true] Tell debugger the new status
    * 
    * Fails if invalid key (for your own good)
    */
    set_blockGameObject (key, value = true, alert = true) { this.set_GameObject(gameObjectMap.block, key, value, alert); }
    /**
    * Turn on/off a entity game object     
    * @param {string} key 
    * @param {boolean} [value = true] 
    * @param {boolean} [alert = true] Tell debugger the new status
    * 
    * Fails if invalid or key (for your own good)
    */
    set_entityGameObject (key, value = true, alert = true) { this.set_GameObject(gameObjectMap.entity, key, value, alert); }
    /**
    * Turn on/off an item game object     
    * @param {string} key 
    * @param {boolean} [value = true] 
    * @param {boolean} [alert = true] Tell debugger the new status
    * 
    * Fails if invalid or key (for your own good)
    */
    set_itemGameObject (key, value = true, alert = true) { this.set_GameObject(gameObjectMap.item, key, value, alert); }
    /**
    * Turn on/off a player game object     
    * @param {string} key 
    * @param {boolean} [value = true] 
    * @param {boolean} [alert = true] Tell debugger the new status
    * 
    * Fails if invalid key (for your own good)
    */
    set_playerGameObject (key, value = true, alert = true) { this.set_GameObject(gameObjectMap.player, key, value, alert); }
    /**
    * Turn on/off a system game object     
    * @param {string} key 
    * @param {boolean} [value = true] 
    * @param {boolean} [alert = true] Tell debugger the new status
    * 
    * Fails if invalid key (for your own good)
    */
    set_systemGameObject (key, value = true, alert = true) { this.set_GameObject(gameObjectMap.system, key, value, alert); }

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
    toggle_blockEvent (key, alert = true) { this.toggle_Event(gameObjectMap.block, key, alert); }
    /**
    * Toggle on/off a entity event     
    * @param {string} key 
    * @param {boolean} [alert = true] Tells the new status
    * 
    * Fails if invalid or key (for your own good)
    */
    toggle_entityEvent (key, alert = true) { this.toggle_Event(gameObjectMap.entity, key, alert); }
    /**
    * Toggle on/off an item event     
    * @param {string} key 
    * @param {boolean} [alert = true] Tells the new status
    * 
    * Fails if invalid or key (for your own good)
    */
    toggle_itemEvent (key, alert = true) { this.toggle_Event(gameObjectMap.item, key, alert); }
    /**
    * Toggle on/off a player event     
    * @param {string} key 
    * @param {boolean} [alert = true] Tells the new status
    * 
    * Fails if invalid key (for your own good)
    */
    toggle_playerEvent (key, alert = true) { this.toggle_Event(gameObjectMap.player, key, alert); }
    /**
    * Toggle on/off a system event     
    * @param {string} key 
    * @param {boolean} [alert = true] Tells the new status
    * 
    * Fails if invalid key (for your own good)
    */
    toggle_systemEvent (key, alert = true) { this.toggle_Event(gameObjectMap.system, key, alert); }
    /**
       * Toggle on/off a block game object     
       * @param {string} key 
       * @param {boolean} [alert = true] Tells the new status
       * 
       * Fails if invalid key (for your own good)
       */
    toggle_blockGameObject (key, alert = true) { this.toggle_GameObject(gameObjectMap.block, key, alert); }
    /**
    * Toggle on/off a entity game object     
    * @param {string} key 
    * @param {boolean} [alert = true] Tells the new status
    * 
    * Fails if invalid or key (for your own good)
    */
    toggle_entityGameObject (key, alert = true) { this.toggle_GameObject(gameObjectMap.entity, key, alert); }
    /**
    * Toggle on/off an item game object     
    * @param {string} key 
    * @param {boolean} [alert = true] Tells the new status
    * 
    * Fails if invalid or key (for your own good)
    */
    toggle_itemGameObject (key, alert = true) { this.toggle_GameObject(gameObjectMap.item, key, alert); }
    /**
    * Toggle on/off a player game object     
    * @param {string} key 
    * @param {boolean} [alert = true] Tells the new status
    * 
    * Fails if invalid key (for your own good)
    */
    toggle_playerGameObject (key, alert = true) { this.toggle_GameObject(gameObjectMap.player, key, alert); }
    /**
    * Toggle on/off a system game object     
    * @param {string} key 
    * @param {boolean} [alert = true] Tells the new status
    * 
    * Fails if invalid key (for your own good)
    */
    toggle_systemGameObject (key, alert = true) { this.toggle_GameObject(gameObjectMap.system, key, alert); }
    //=================
    /* Add New Stuff */
    //=================
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
        this.anyOn();
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
        this.anyOn();
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
        this.anyOn();
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
