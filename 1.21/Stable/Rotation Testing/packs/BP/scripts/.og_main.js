/*
    FOr Rotation Angle Testing Blocks
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
import { world, system, Block, Player } from '@minecraft/server';
//=============================================================================
// Library Function that are needed for the subscribes
//=============================================================================
function isPlayerHoldingBlock (block, player) {
    if (!(player instanceof Player)) return false;

    if ((block instanceof Block)) return isPlayerHoldingTypeId(block.typeId, player);
    if (typeof block == 'string') return isPlayerHoldingTypeId(block, player);

    console.error(`§cisPlayerHoldingBlock() Bad Parm 1 - not Block or String`);
    return false;
};
function isPlayerHoldingTypeId (typeId, player) {
    if (!(player instanceof Player)) return false;

    let identifier = typeId;
    if (typeId instanceof Block) identifier = typeId.typeId;

    const equipment = player.getComponent('equippable');
    const selectedItem = equipment?.getEquipment('Mainhand');
    return selectedItem?.typeId === identifier;
};
//=============================================================================
//What I came up with to cycle thru the x.y.z cords that work with the permutations.
//I did not want 1-64, so opted for 3 0-3's and then treated as a base and did conversion math
//Still comes out to 64 permutations, but was easier to do the 90 degree math if represented differently
//=============================================================================
function bitArrayAdd (numberArray = [], numberToAdd = 0, base = 10, minReturnLength = 1, minBase10Value = (Infinity * -1), maxBase10Value = Infinity) {

    //TODO: Change to a class so validation is ONCE
    if (!Array.isArray(numberArray)) return null;
    if (typeof numberToAdd != "number" || typeof base != "number" || base <= 1) return null;

    if (numberArray.length == 0) numberArray.push(0);
    if (typeof minReturnLength != "number" || minReturnLength < 1) minReturnLength = 1;

    //validate array is in correct base
    for (let i = 0; i < numberArray.length; i++) {
        if (typeof numberArray[ i ] != "number" || Math.abs(numberArray[ i ]) >= base) return null;
    }

    //convert to base 10 number
    let base10value = 0;
    let multiplier = 1;
    let ctr = 0;
    while (numberArray.length) {
        let n = numberArray.pop();
        base10value += n * multiplier;
        multiplier *= base;
        ctr++;
    }

    base10value += numberToAdd;
    //apply defaults of min/max - use this for circling values
    if (base10value < minBase10Value) {
        let n = Math.abs(minBase10Value - base10value);
        base10value = maxBase10Value - (n - 1);
    }
    else if (base10value > maxBase10Value) {
        let n = maxBase10Value - base10value;
        base10value = minBase10Value + (n - 1);
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
        3) Like 2, but function can be in another file or part of a class
        4) There are a few more ways.  It will depend on your preference

        I put it in an ID so I can cancel subscription 
        if block States are not there or the numbers are out of range
*/
//=============================================================================
class cc_rotation_angles_components {
    rotationBlockCustomComponentSubscriptionId =
        world.beforeEvents.worldInitialize.subscribe((event) => {

            event.blockComponentRegistry.registerCustomComponent(
                "dw623:rotation_angles_components",
                {
                    onPlayerInteract: e => {

                        const { block, player } = e;

                        const blockStates = block.permutation.getAllStates();


                        //TODO: confirm states exist
                        const angleIds = [ blockStates[ angleStateX ], blockStates[ angleStateY ], blockStates[ angleStateZ ] ];

                        //Validate values 0..3
                        for (let i = 0; i < 3; i++) {
                            if (typeof angleIds[ i ] != "number" || angleIds[ i ] < 0 || angleIds[ i ] > 3) return;
                        }


                        let isHoldingStick = isPlayerHoldingTypeId('minecraft:stick', player);

                        if (isHoldingStick || isPlayerHoldingBlock(block, player)) {
                            let newAngleIds = bitArrayAdd(angleIds, (isHoldingStick ? 16 : 1), 4, 3, 0, 63);

                            const newBlockPermutation = block.permutation
                                .withState(angleStateX, newAngleIds[ 0 ])
                                .withState(angleStateY, newAngleIds[ 1 ])
                                .withState(angleStateZ, newAngleIds[ 2 ]);

                            system.run(() => {
                                block.setPermutation(newBlockPermutation);
                                player.sendMessage(`§aNew Angles:§r x:${newAngleIds[ 0 ] * 90}  y:${newAngleIds[ 1 ] * 90}  z:${newAngleIds[ 2 ] * 90}`);
                            });
                        }
                        else {
                            const angleX = blockStates[ angleStateX ] * 90;
                            const angleY = blockStates[ angleStateY ] * 90;
                            const angleZ = blockStates[ angleStateZ ] * 90;
                            player.sendMessage(`§6Current Angles:§r x:${blockStates[ angleStateX ] * 90}  y:${blockStates[ angleStateY ] * 90}  z:${blockStates[ angleStateZ ] * 90}`);
                        }
                    }
                }
            );
        });
}
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