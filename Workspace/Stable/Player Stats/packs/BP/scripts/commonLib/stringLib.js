//@ts-check
//=============================================================================
/* 
Created by: https://github.com/DrinkWater623
*/
//=============================================================================
/**
 * 
 * @param {number} number
 * @returns string 
 */
export function numberWithSuffix(number){

    const numberString = number.toString()

    if (numberString.endsWith('1')) return numberString+'st'
    if (numberString.endsWith('2')) return numberString+'nd'
    if (numberString.endsWith('3')) return numberString+'rd'

    return numberString+'th'
}