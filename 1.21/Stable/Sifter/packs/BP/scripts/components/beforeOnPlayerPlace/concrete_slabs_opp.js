//@ts-check
import { BlockComponentPlayerPlaceBeforeEvent } from "@minecraft/server";
import { watchFor, chatLog, globals } from '../../settings.js';
//==============================================================================
/**
 * 
 * @param {BlockComponentPlayerPlaceBeforeEvent} e 
 * @returns 
 */
export function concrete_slabs_beforeOnPlayerPlace (e) {
    const debug = true;

    chatLog.log(`\n\n§gBlockComponentRegistry§b dw623:concrete_slabs§r beforeOnPlayerPlace :§r
    ==> Block: ${e.block.typeId}
    ==> Face: ${e.face}
    ==> §cDoes not have Face Location - Cannot use`
        , debug
    );

}
//==============================================================================
// End of File
//==============================================================================