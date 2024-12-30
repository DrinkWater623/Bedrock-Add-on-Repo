//@ts-check
//=============================================================================
/*
    Written By:     "https://github.com/DrinkWater623"

    Last Update:    20241208 - created
                    20241209 - added endsWithNumber
*/
//=============================================================================
/**
 * 
 * @param {string} text 
 * @returns {boolean}
 */
export function endsWithNumber(text){
    return "0123456789".includes(text.charAt(text.length-1))
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
//=============================================================================
// End of File
//=============================================================================
