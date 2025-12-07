// fn-entities.js Wandering Trader Guild
// @ts-check
/* =====================================================================
Copyright (C) 2025 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
Change Log
    20251204 - Created
========================================================================*/
// MC
import { Entity, system } from "@minecraft/server";
// Shared
import { makeRandomName } from "../common-stable/tools/randomNames.js";
import { leavingVerbs, Ticks } from "../common-data/globalConstantsLib.js";
// Local
import { alertLog, pack, traderJobTitles, typeIDPrefix, watchFor } from "../settings";
import { devDebug } from "./fn-debug";
import { toTitleCase } from "../common-stable/tools/stringLib.js";
import { rndInt } from "../common-stable/tools/mathLib.js";
import { DynamicPropertyLib } from "../common-stable/tools/dynamicPropertyClass.js";
//=======================================================================
const unlessLines = [
    'someone feeds me something yummy',
    'someone hooks me up with some snacks',
    'someone sends me an uber eats delivery',
    'someone shares their grub with me',
    'my hunger is satiated',
    'I get something yummy',
    'I get some snacks',
    'I see an uber eats delivery',
    'I get some grub'

];
//=======================================================================
function makeTraderName (overrides = {}) {
    const traderNameConfig = {
        consonants: [ 's', 'z', 'sh', 'ch', 'th', 'f', 'v', 'h', 'l', 'r', 'n', 'm', 'k', 'g', 'gn', 't', 'd', 'w' ],
        vowels: [ 'i', 'e', 'y', 'a', 'o' ],
        formulas: {
            'cvc': 2,
            'cvcv': 2,
            'cvcie': 4,
            'cvcy': 4,
            'cvckie': 2,
            'cvcky': 2,
            'vcv': 2,
            'vcvc': 2,
            'vcvcie': 3,
            'vcvcy': 3
        }
    };
    return makeRandomName(traderNameConfig);
}
//===================================================================
/**
 * Pick a random element from an array.
 * @template T
 * @param {T[]} arr
 * @returns {T | undefined}
 */
function pickRandom (arr) {
    if (!arr.length) return undefined;
    const i = Math.floor(Math.random() * arr.length);
    return arr[ i ];
}
//===================================================================
/**
 * Given an entity typeId, return a pretty random job title.
 * Falls back to cleaned-up typeId if no pool defined.
 * 
 * @param {string} typeId
 * @param {string} typeIDPrefix
 * @returns {string}
 */
function getRandomJobTitle (typeId, typeIDPrefix) {
    // strip prefix: namespace:wandering_doctor -> "doctor"
    const raw = typeId.replace(typeIDPrefix, "");      // e.g. "con_man"
    const key = raw.toLowerCase();

    const pool = traderJobTitles[ key ];

    if (pool && pool.length) {
        //@ts-ignore
        return pickRandom(pool);                        // e.g. "Shady Dealer"
    }

    // fallback: convert "con_man" -> "Con Man"
    const normalized = raw.replace(/[_-]+/g, " ");
    return toTitleCase(normalized);
}
//=======================================================================
/**
 * @summary Process the event/messages passed from the entity itself - called from the subscribe with a one tick delay already
 * @param {Entity} entity 
 * @returns {string}
 */
function nameEntity (entity) {
    if (!entity || !entity.isValid) return '';

    const { typeId } = entity;
    let { nameTag } = entity;
    if (!nameTag) {
        const name = makeTraderName();
        const job = getRandomJobTitle(typeId, typeIDPrefix);

        nameTag = `${name} the ${job}`;
        entity.nameTag = nameTag;

        //save info for later use
        entity.setDynamicProperty('name', name);
        entity.setDynamicProperty('real_job', typeId.replace(typeIDPrefix, ''));
        entity.setDynamicProperty('random_job', job);
        //need a copy with formatting
        entity.setDynamicProperty('nameTag', nameTag);
        alertLog.log(`${nameTag} was named`, devDebug.entityNaming);
    }

    return nameTag;
}
//=======================================================================
/**
 * @param {Entity} entity 
 * @param {string} colorCode
 * @param {string} [nameTag] 
 */
function colorEntityName (entity, colorCode, nameTag) {
    if (!entity || !entity.isValid) return;

    let name = nameTag || entity.nameTag || nameEntity(entity);
    if (!name) return;

    system.runTimeout(() => {
        if (name.includes('§')) {
            name = DynamicPropertyLib.getString(entity, 'nameTag');

            //this should not happen, but can - later just strip codes from it to preserve what a player may have done
            if (!name) name = nameEntity(entity);
        }

        nameTag = `§${colorCode[ 0 ].toLowerCase()}${name}§r`;
        entity.nameTag = nameTag;
        alertLog.log(`${nameTag}'s name was re-colored`, devDebug.entityNaming);
    }, 1);
}
//=======================================================================
/**
 * @param {Entity} entity 
 * @param {number} minutes
 * @param {number} [warnAt] 
 */
function despawnWarningTimer (entity, minutes = 0, warnAt = 1) {
    if (!entity || !entity.isValid) return;
    if (minutes < 1) return;

    const ticks = Ticks.perMinute * (minutes - warnAt);
    if (ticks <= Ticks.perMinute) return; //no time

    system.runTimeout(() => {
        if (entity.isValid) {
            const verb = leavingVerbs[ rndInt(0, leavingVerbs.length - 1) ];
            const unless = unlessLines[ rndInt(0, unlessLines.length - 1) ];
            const cmd = `tellraw @a[r=64] {\"rawtext\":[{\"text\":\"<${entity.nameTag}§r> I am ${verb} in §c${warnAt} minute${warnAt > 1 ? 's' : ''}§r unless ${unless}\"}]}`;
            entity.runCommand(cmd);
            colorEntityName(entity, 'c');

            //2nd warning TODO: test
            if (warnAt > 3) despawnWarningTimer(entity, warnAt, 1);
        }
    }, ticks);

    alertLog.log(`${entity.nameTag}'s warning timer was set`, devDebug.entityTimers);
}
//========================================================================
//=======================================================================
/**
 * @summary Process the event/messages passed from the entity itself - called from the subscribe with a one tick delay already
 * @param {Entity} entity 
 * @param {string} id 
 * @param {string} message 
 * @returns 
 */
export function entityEventProcess (entity, id, message) {
    if (!entity || !entity.isValid) return;

    const { typeId } = entity;
    let nameTag = nameEntity(entity);

    if (id == 'wtg:name_me') {
        return;
    }

    //apply color to name - players will get used to meaning after feeding and seeing the changes
    let prefix = 'wtg:nameColor_';
    if (id.startsWith(prefix)) {
        const colorCode = id.replace(prefix, '');
        colorEntityName(entity, colorCode, nameTag);

        //set a timer to tell players when about to despawn
        if (message == '0') return;
        const minutes = parseInt(message);
        if (Number.isNaN(minutes)) return;
        despawnWarningTimer(entity, minutes, minutes * 0.1);
    }

    return;
}
//========================================================================
//========================================================================
//========================================================================

