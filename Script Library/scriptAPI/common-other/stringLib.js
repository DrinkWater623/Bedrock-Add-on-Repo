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