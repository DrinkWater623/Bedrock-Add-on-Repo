//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Last Update: 20241229 - reOrg and add License
========================================================================*/
/**
 * 
 * @param {number[]} numberArray 
 * @param {number} numberToAdd 
 * @param {number} base 
 * @param {number} minReturnLength 
 * @param {number} minBase10Value 
 * @param {number} maxBase10Value 
 * @returns {number[]}
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

    base10value += numberToAdd;

    //apply defaults of min/max - use this for circling values
    if (base10value > maxBase10Value) {
        let n = (maxBase10Value + 1) - base10value;
        base10value = Math.abs(minBase10Value + n);        
    }
    //should never hit this
    if (base10value < minBase10Value) {
        let n = Math.abs(minBase10Value - base10value);
        base10value = Math.abs(maxBase10Value - (n - 1));        
    }

    //convert back to user base as array
    while (base10value) {
        let n = base10value % base;
        numberArray.unshift(n);
        base10value = Math.floor(base10value / base);
    }
    while (numberArray.length < minReturnLength) numberArray.unshift(0);
    
    return numberArray;
}
//=============================================================================
/**
 * @param {number} number  
 * @param { number } decimalPlaces 
 * @returns {number}
 * 
*/
export function round (number, decimalPlaces = 0) {
    if (decimalPlaces <= 0) return Math.round(number);
    let multiplier = parseInt('1' + ('0'.repeat(decimalPlaces)));
    return Math.round(number * multiplier) / multiplier;
}
//=============================================================================
