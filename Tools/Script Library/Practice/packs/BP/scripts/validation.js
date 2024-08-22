//==============================================================================
import { world, Player } from "@minecraft/server";
//==============================================================================
function validateWorldOrPlayerObject (object, warn = false, calledFrom = "") {
    if (isPlayer(object)) return true;
    if (isWorld(object)) return true;

    if (warn) {
        let msg = `Object is not a Player or World`;
        if (calledFrom.length) msg += ` - Called from ${calledFrom}`;
        console.warn(msg);
    }
    return false;
}
function isWorld (object, warn = false, calledFrom = "") {
    if (object instanceof world) return true;

    if (warn) {
        let msg = `Object is not a World`;
        if (calledFrom.length) msg += ` - Called from ${calledFrom}`;
        console.warn(msg);
    }
    return false;
}
function isPlayer (object, warn = false, calledFrom = "") {
    if (object instanceof Player) return true;

    if (warn) {
        let msg = `Object is not a Player`;
        if (calledFrom.length) msg += ` - Called from ${calledFrom}`;
        console.warn(msg);
    }
    return false;
}