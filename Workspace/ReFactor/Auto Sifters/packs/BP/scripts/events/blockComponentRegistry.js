//@ts-check
import { WorldInitializeBeforeEvent } from "@minecraft/server";
//==============================================================================
import { siftable_slabs_onTick } from "../components/onTick/siftable_slabs.js";
import { sifter_query_onTick } from "../components/onTick/sifter_query.js";
import { alertLog, dev } from "../settings.js";
//==============================================================================
/**
 * 
 * @param {WorldInitializeBeforeEvent} event 
 */
export function block_registerCustomComponents (event) {
    const debug = false;
    //====================================================
    alertLog.success("Subscribing to§r blockComponentRegistry for dw623:sifter_query", dev.debugSubscriptions);
    event.blockComponentRegistry.registerCustomComponent(
        "dw623:sifter_query",
        {
            onTick: e => {
                sifter_query_onTick(e);
            }
        }
    );
    //====================================================
    alertLog.success("Subscribing to§r blockComponentRegistry for dw623:siftable_slabs", dev.debugSubscriptions);
    event.blockComponentRegistry.registerCustomComponent(
        "dw623:siftable_slabs",
        {
            onTick: e => {
                siftable_slabs_onTick(e);
            }
        });
    //====================================================
    /*
    event.blockComponentRegistry.registerCustomComponent(
        "dw623:concrete_slabs",
        {
            beforeOnPlayerPlace: e => {
                concrete_slabs_beforeOnPlayerPlace(e);
            }
            ,
            onPlayerInteract: e => {
                concrete_slabs_onPlayerInteract(e);
            }
        }
    );
    */
}
//==============================================================================
// End of File
//==============================================================================