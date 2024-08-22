//@ts-check

/*
    All code written by DrinkWater623 aka Pink Salt 623 aka Nikki DW (BAO)
*/
//=============================================================================
import { world, system, Block, Player, EquipmentSlot } from '@minecraft/server';
const debug = true;
const debugMsg = function (msg = "", preFormatting = "") { if (debug && msg) world.sendMessage(`${preFormatting}@${system.currentTick}: §cDebug Log:§r ${msg}`); };
//=============================================================================
// Library Function that are needed for the subscribes
//=============================================================================
/**
 * 
 * @param {Block} block 
 * @param {Player} player 
 * @returns 
 */
export function isPlayerHoldingBlock (block, player) {
    return isPlayerHoldingTypeId(block.typeId, player);
};
/**
 * 
 * @param {string} typeId 
 * @param {Player} player 
 * @returns boolean
 */
export function isPlayerHoldingTypeId (typeId, player) {
    const equipment = player.getComponent('equippable');
    const selectedItem = equipment?.getEquipment(EquipmentSlot.Mainhand);
    return selectedItem?.typeId === typeId;
};
//=============================================================================
//What I came up with to cycle thru the x.y.z cords that work with the permutations.
//I did not want 1-64, so opted for 3 0-3's and then treated as a base and did conversion math
//Still comes out to 64 permutations, but was easier to do the 90 degree math if represented differently
//=============================================================================
/**
 * 
 * @param {number[]} numberArray 
 * @param {number} numberToAdd 
 * @param {number} base 
 * @param {number} minReturnLength 
 * @param {number} minBase10Value 
 * @param {number} maxBase10Value 
 * @returns number[]
 */
export function bitArrayAdd (numberArray, numberToAdd = 0, base = 10, minReturnLength = 1, minBase10Value = (Infinity * -1), maxBase10Value = Infinity) {

    //TODO: Change to a class so validation is ONCE
    if (minReturnLength < 1) minReturnLength = 1;
    while (numberArray.length < minReturnLength) numberArray.push(0);
    if (base <= 1 || numberToAdd == 0) return numberArray;
    if (numberArray.some(n => Math.abs(n) >= base)) return numberArray;

    //convert to base 10 number
    let base10value = 0;
    let multiplier = 1;
    let ctr = 0;
    while (numberArray.length) {
        const n = numberArray.pop();
        if (n) base10value += n * multiplier;
        multiplier *= base;
        ctr++;
    }

    debugMsg(`§bCurrent base10: ${base10value} (array: ${numberArray.reduce((a, n) => a + n.toString(), '')}) + ${numberToAdd} = ${base10value + numberToAdd}`);
    base10value += numberToAdd;

    //apply defaults of min/max - use this for circling values
    if (base10value > maxBase10Value) {
        let n = (maxBase10Value+1) - base10value ;
        base10value = Math.abs(minBase10Value + n);
        debugMsg(`§6Over ${maxBase10Value} -> New ${base10value}`)
    }
    //should never hit this
    if (base10value < minBase10Value) {
        let n = Math.abs(minBase10Value - base10value);
        base10value = Math.abs(maxBase10Value - (n - 1));
        debugMsg(`§6Under ${minBase10Value} -> New ${base10value}`)
    }

    //convert back to user base as array
    while (base10value) {
        let n = base10value % base;
        numberArray.unshift(n);
        base10value = Math.floor(base10value / base);
    }
    while (numberArray.length < minReturnLength) numberArray.unshift(0);

    debugMsg(`§aReturning (base ${base}) ${numberArray.reduce((a, n) => a + n.toString(), '')}`);
    return numberArray;
}