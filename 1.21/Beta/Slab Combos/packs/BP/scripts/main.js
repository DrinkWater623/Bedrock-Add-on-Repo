//@ts-check
// beta because of chatSend
import { world, system } from "@minecraft/server";
//==============================================================================
const debug = false;
const debugMsg = function (msg = "", preFormatting = "") { if (debug && msg) world.sendMessage(`${preFormatting}@${system.currentTick}: §cDebug Log:§r ${msg}`); };
//==============================================================================
/**@param {number} number  */
function round (number, place = 0) {
    if (place <= 0) return Math.round(number);
    let multiplier = parseInt('1' + ('0'.repeat(place)));
    return Math.round(number * multiplier) / multiplier;
}
//==============================================================================
/**
* @param { import("@minecraft/server").Vector3 } location
*/
function vector3Msg (location, places = 0, showXYZ = false) {
    let vector = location;
    if (places == 0) vector = vectorFloor(location);
    if (places > 0) vector = vectorRound(location, places);

    if (showXYZ) return `x: ${vector.x}  y: ${vector.y}  z: ${vector.z}`;
    return `${vector.x}, ${vector.y}, ${vector.z}`;
}
//==============================================================================
/**
* @param { import("@minecraft/server").Vector2 } location
*/
function vector2Msg (location, places = 0) {
    if (places < 0) return `${location.x}, ${location.y}}`;
    if (places == 0) return `${Math.floor(location.x)}, ${Math.floor(location.y)}`;
    return `${round(location.x, places)}, ${round(location.y, places)}`;
}
//==============================================================================
/**
* @param { import("@minecraft/server").Vector3 } location1
 @param { import("@minecraft/server").Vector3 } location2
*/
function vectorDelta (location1, location2, places = 0) {
    return {
        x: round(location1.x - location2.x, places),
        y: round(location1.y - location2.y, places),
        z: round(location1.z - location2.z, places)
    };
}
//==============================================================================
/**
* @param { import("@minecraft/server").Vector3 } location
*/
function vectorFloor (location) {
    return {
        x: Math.floor(location.x),
        y: Math.floor(location.y),
        z: Math.floor(location.z)
    };
}
//==============================================================================
/**
* @param { import("@minecraft/server").Vector3 } location
*/
function vectorCeiling (location) {
    return {
        x: Math.ceil(location.x),
        y: Math.ceil(location.y),
        z: Math.ceil(location.z)
    };
}
//==============================================================================
/**
* @param { import("@minecraft/server").Vector3 } location
*/
function vectorRound (location, places = 0) {
    return {
        x: round(location.x, places),
        y: round(location.y, places),
        z: round(location.z, places)
    };
}
function playBlockSound (event) {

}
//==============================================================================
world.beforeEvents.worldInitialize.subscribe((event) => {

    event.blockComponentRegistry.registerCustomComponent(
        "dw623:slab_combo_components",
        {

            // onStepOn: e => {
            //     //if (debug) { debugMsg(`*§a onStepOn: Activated`, "\n\n"); }
            //     playBlockSound(event);

            // },
            // onEntityFallOn: e => {
            //     //if (debug) { debugMsg(`*§a onEntityFallOn: Activated`, "\n\n"); debugMsg(`===> onEntityFallOn: ${e.fallDistance}`); }
            //     playBlockSound(event);
            // },

            beforeOnPlayerPlace: e => {
                if (!e.player) return;

                if (!e.player.isSneaking) return;
                //Special block placement per quad only if sneaking
                /**
                 *      1  *  3
                 *      *  5  *
                 *      7  *  9
                 * only the stars can alternate place
                 * if sneaking the numbered parts get opposite face
                 */

                //@ts-ignore
                if (!e.player.f3) {
                    console.error('§cMissing Object: player.f3');
                    return;
                }
                //@ts-ignore
                if (!e.player.f3.last_playerInteractWithBlock) {
                    console.error('§cMissing Object: player.f3.last_playerInteractWithBlock');
                    return;
                }


                const { block, face, player } = e;
                //@ts-ignore
                const f3 = player.f3.last_playerInteractWithBlock;

                // if (debug && player.isOp()) {
                //     debugMsg(`*§a beforeOnPlayerPlace: Activated`, "\n\n");
                //     debugMsg(`===> put block @: ${vector3Msg(block.location)} on face: ${face}`);
                //     debugMsg(`*§a player.f3.last_playerInteractWithBlock:`);
                //     debugMsg(`===> on block: ${f3.block.typeId} @ ${vector3Msg(f3.block.center(), 1)}`);
                //     debugMsg(`===> block face: ${f3.blockFace} @ ${vector3Msg(f3.faceLocation, 1)}`);
                //     debugMsg(`===> delta onBlock: ${vector3Msg(f3.vectorDelta, -1, true)}`);
                // }

                const switchInfo = {
                    //minus South , Plus North
                    East: { opposite: 'West', delta: 'z', neg: 'South', pos: 'North' },
                    West: { opposite: 'East', delta: 'z', neg: 'South', pos: 'North' },
                    //minus East , Plus West
                    North: { opposite: 'South', delta: 'x', neg: 'East', pos: 'West' },
                    South: { opposite: 'North', delta: 'x', neg: 'East', pos: 'West' },

                    Down: { opposite: 'Up', x: true, z: false, neg: 'East', pos: 'West' },
                    Up: { opposite: 'Down', x: true, z: false, neg: 'East', pos: 'West' }
                };

                let newFace = switchInfo[ face ].opposite;

                if ([ 'Up', 'Down' ].includes(face)) {

                    if (Math.abs(f3.vectorDelta.z) >= 0.4 && Math.abs(f3.vectorDelta.x) < 0.2) {
                        newFace = f3.vectorDelta.z > 0 ? "North" : "South";
                    }
                    if (Math.abs(f3.vectorDelta.x) >= 0.4 && Math.abs(f3.vectorDelta.z) < 0.2) {
                        newFace = f3.vectorDelta.x > 0 ? "West" : "East";
                    }
                }
                else {
                    debugMsg('§b N S E W');
                    if (Math.abs(f3.vectorDelta.y) >= 0.4) {

                        if (([ 'East', 'West' ].includes(face) && Math.abs(f3.vectorDelta.z) < 0.2) ||
                            ([ 'North', 'South' ].includes(face) && Math.abs(f3.vectorDelta.x) < 0.2)) {

                            newFace = f3.vectorDelta.y > 0 ? "Down" : "Up";
                        }
                    }
                    else if (Math.abs(f3.vectorDelta.y) < 0.2) {

                        if ([ 'East', 'West' ].includes(face) && Math.abs(f3.vectorDelta.z) >= 0.4) {
                            newFace = f3.vectorDelta.z > 0 ? switchInfo[ face ].pos : switchInfo[ face ].neg;
                        }
                        else if ([ 'North', 'South' ].includes(face) && Math.abs(f3.vectorDelta.x) >= 0.4) {
                            newFace = f3.vectorDelta.x > 0 ? switchInfo[ face ].pos : switchInfo[ face ].neg;
                        }
                    }
                }

                //set new permutation
                const list = e.permutationToPlace.getAllStates();
                const entries = Object.entries(list);
                for (const [ key, value ] of entries) { debugMsg(`==> ${key}: ${value}`); }
                const permutationToPlace = e.permutationToPlace.withState('minecraft:block_face', newFace.toLowerCase());
                e.cancel = true;
                system.run(() => {
                    debugMsg(`§6New Face is ${newFace}`);
                    player.dimension.setBlockPermutation(block.location, permutationToPlace);
                });
            }
        }
    );
});
world.afterEvents.playerSpawn.subscribe(event => {
    const player = event.player;
    //@ts-ignore    
    if (!player.f3) {
        //if (debug) console.warn('§aCreated player?.f3 object');
        //@ts-ignore
        player.f3 = {};
    }

    //@ts-ignore
    if (!player.f3?.last_playerInteractWithBlock) {
        //if (debug) console.warn('§aCreated player?.f3?.last_playerInteractWithBlock object');
        //@ts-ignore
        event.player.f3.last_playerInteractWithBlock = {
            block: player.dimension.getBlock(event.player.location),
            blockFace: "Up",
            faceLocation: player.location,
            vectorDelta: player.location
        };
    }
});
//==============================================================================
world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
    //Captured Where Clicked on block, IF SNEAKING, due to special block placements
    if (event.player.isValid() && event.player.isSneaking) {

        const { block, faceLocation } = event;
        //@ts-ignore
        Object.assign(event.player.f3.last_playerInteractWithBlock,
            {
                block: block,
                blockFace: event.blockFace,
                faceLocation: vectorRound(faceLocation, 1),
                vectorDelta: vectorDelta(faceLocation, block.center(), 1)
            });
    }
});
//==============================================================================
// world.afterEvents.chatSend.subscribe(  //Chat Command Code Testing
//     (event) => {
//         if (!event.message.startsWith(':')) return;
//         const player = event.sender;
//         if (!(player instanceof Player)) return;

//         const msg = event.message.trim().replaceAll('  ', ' ');
//         const msg_lc = msg.toLowerCase();

//         if (msg_lc === ":cls") { player.sendMessage("\n".repeat(40)); return; }

//         if (msg_lc === ":states") {
//             thisBlockRightHereStates(player);
//             return;
//         }
//     }
// );