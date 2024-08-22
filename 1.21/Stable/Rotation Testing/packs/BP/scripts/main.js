//@ts-check
/*
    for Rotation Angle Testing Blocks
    All code written and assets created by DrinkWater623 aka Pink Salt 623 aka Nikki DW (BAO)

    Why?  Cause 3D angles confuse me.  So rather than play hit and miss to get them right
          why not just rotate the block, then see what the xyz degrees are...

    Sharing for the 3D challenged like me and learning purposes

    Examples of:
        1) Action Bar Compass, system run every 15 ticks
        2) Custom Component for Blocks
        3) minecraft:full_block geo vs Block Bench build 16x16x16 per face geo
        4) Block Bench box uv geo
        5) Tile (y=2) geo along with 
*/
//=============================================================================
import { world, system, Block } from '@minecraft/server';
import * as fn from './functions';
//=============================================================================
const numOfAngles = 64;
//names of the states in the Block Json
const angleStateX = 'int:x_id';
const angleStateY = 'int:y_id';
const angleStateZ = 'int:z_id';
//=============================================================================
/* 
        This is the code for the custom component

        Many ways to do this.  
        1) Code can be in the event
        2) Code can be in a function, and the subscribe calls it.
        3) Like #2, but function can be in another file or part of a class
        4) There are a few more ways.  It will depend on your preference and coding style

        I put it in an ID so I can cancel subscription 
        if block States are not there or the numbers are out of range
        best to cancel subscription.
*/
//=============================================================================
const blockStatesValidated = new Map();
//=============================================================================
/**
 * 
 * @param {Block} block 
 * @returns {boolean}
 */
function validateBlockStates (block) {
    const typeId = block.typeId;
    const blockStates = block.permutation.getAllStates();
    let mapObj;

    if (blockStatesValidated.has(typeId)) {
        mapObj = blockStatesValidated.get(typeId);
        if (!mapObj.statesExist || !mapObj.withRange) return false;
    }
    else {
        //first time - so check validity of state names in block
        const keys = Object.keys(blockStates);
        if (keys.length < 3 ||
            !keys.includes(angleStateX) ||
            !keys.includes(angleStateY) ||
            !keys.includes(angleStateZ)) {
            blockStatesValidated.set(typeId, { statesExist: false, withRange: false });
            return false;
        }

        //assume values good - will be negated below if not
        blockStatesValidated.set(typeId, { statesExist: true, withRange: true });
    }

    //states exist - check value ranges 0-3 for base4  TODO: test for number tye before this
    const angleIds = [ Number(blockStates[ angleStateX ]), Number(blockStates[ angleStateY ]), Number(blockStates[ angleStateZ ]) ];
    if (angleIds.some(n => Math.abs(n) >= 4)) {
        blockStatesValidated.set(typeId, { statesExist: true, withRange: false });
        return false;
    }

    return true;
}
//=============================================================================
//TODO: test changing a block's Json to be have wrong states to see what happens
const rotationBlockCustomComponentSubscriptionId =
    world.beforeEvents.worldInitialize.subscribe((event) => {

        event.blockComponentRegistry.registerCustomComponent(
            "dw623:rotation_angles_components",
            {
                onPlace: e => {
                    if (!validateBlockStates(e.block)) {
                        //unsubscribe without mercy to avoid world crashing
                        console.error(`§cMissing or Invalid Block State Values on ${e.block.typeId} : Cancelling OnPlayerInteract Subscription`);
                        world.beforeEvents.worldInitialize.unsubscribe(rotationBlockCustomComponentSubscriptionId);
                        return;
                        //if can't do when first called, see about setting an event that can do it
                    }
                },
                onPlayerInteract: e => {

                    const { block, player } = e;
                    if (!player?.isValid()) return;

                    if (!validateBlockStates(block)) {
                        //unsubscribe without mercy to avoid world crashing
                        console.error(`§cMissing or Invalid Block State Values on ${block.typeId} : Cancelling OnPlayerInteract Subscription`);
                        world.beforeEvents.worldInitialize.unsubscribe(rotationBlockCustomComponentSubscriptionId);
                        return;
                    }

                    const blockStates = block.permutation.getAllStates();
                    const angleIds = [ Number(blockStates[ angleStateX ]), Number(blockStates[ angleStateY ]), Number(blockStates[ angleStateZ ]) ];

                    let isHoldingStick = fn.isPlayerHoldingTypeId('minecraft:stick', player);

                    if (isHoldingStick || fn.isPlayerHoldingBlock(block, player)) {
                        let newAngleIds = fn.bitArrayAdd(angleIds, (isHoldingStick ? 16 : 1), 4, 3, 0, 63);

                        const newBlockPermutation = block.permutation
                            .withState(angleStateX, newAngleIds[ 0 ])
                            .withState(angleStateY, newAngleIds[ 1 ])
                            .withState(angleStateZ, newAngleIds[ 2 ]);

                        system.run(() => {
                            block.setPermutation(newBlockPermutation);
                            player.sendMessage(`\n§aNew Angles:§r x: ${newAngleIds[ 0 ] * 90}  y: ${newAngleIds[ 1 ] * 90}  z: ${newAngleIds[ 2 ] * 90}\n`);
                        });
                    }
                    else {
                        player.sendMessage(`\n§6Current Angles:§r x: ${angleIds[ 0 ] * 90}  y: ${angleIds[ 1 ] * 90}  z: ${angleIds[ 2 ] * 90}\n`);
                    }
                }
            }
        );
    });
//=============================================================================
// This is the Action Bar Compass Code - so you know which way you are facing while you test
// Normally I have this as it's own add-on... but this way, others using this do not have to have it.
//=============================================================================
system.runInterval(() => {
    world.getAllPlayers()
        .forEach(p => {
            const dirs = [ "S", "S W", "W", "N W", "N", "N E", "E", "S E", "S" ];
            let dir = Math.round(p.getRotation().y / (360 / 8));
            if (dir < 0) dir += 8;
            const text = dirs[ dir ]
                .replace("N", "north")
                .replace("S", "south")
                .replace("E", "east")
                .replace("W", "west")
                .replace(" ", "-");

            p.onScreenDisplay.setActionBar(`§6${text}`);
        });
}, 15);