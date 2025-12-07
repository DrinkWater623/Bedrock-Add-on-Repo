//@ts-check
/* =====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only
URL: https://github.com/DrinkWater623
========================================================================
Change Log: 
    20250603 - Combine
    20251204 - added toTitleCase
========================================================================*/
//=============================================================================
/**
 * 
 * @param {string} text 
 * @returns {boolean}
 */
export function endsWithNumber (text) {
    return "0123456789".includes(text.charAt(text.length - 1));
}
//=============================================================================
/**
 * 
 * @param {string} text 
 * @param {string} delimiter 
 * @returns {string}
 */
export function getLastWord (text, delimiter = ' ') {
    text = text.trim();
    if (!text) return '';

    const words = text.split(delimiter);
    return words[ words.length - 1 ];
}
//=============================================================================
/**
 * 
 * @param {string} text 
 * @param {string} delimiter 
 * @returns {string}
 */
export function minusLastWord (text, delimiter = ' ') {
    text = text.trim();
    if (!text)
        return '';

    const words = text.split(delimiter);
    if (words.length == 1)
        return '';

    words.pop();
    return words.join(delimiter);
}
//========================================================================*/
/**
 * 
 * @param {number} number
 * @returns string 
 */
export function numberWithSuffix (number) {

    const numberString = number.toString();

    if (numberString.endsWith('1')) return numberString + 'st';
    if (numberString.endsWith('2')) return numberString + 'nd';
    if (numberString.endsWith('3')) return numberString + 'rd';

    return numberString + 'th';
}
//=============================================================================
/**
 * Title-case each word in a string.
 * @param {string} str
 * @returns {string}
 */
export function toTitleCase (str) {
    return str
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}
//=============================================================================
// End of File
//=============================================================================
