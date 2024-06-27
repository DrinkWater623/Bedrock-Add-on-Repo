import { world, Block, Player } from '@minecraft/server';
import { McDebug } from './McDebug.js';

const bug = new McDebug(true);
//=============================================================================
// Library
//=============================================================================
// const angleConvert = function (angle = 0) {
//     angle = angle % 360;
//     return angle < 0 ? angle + 360 : angle;
// };
// const angleId = function (angle = 0, numOfAngles = 4) {
//     const retVal = Math.round(angleConvert(angle) / (360 / numOfAngles));
//     return retVal === numOfAngles ? 0 : retVal;
// };
const isPlayerHoldingBlock = function (block, player) {
    if (!(block instanceof Block)) return false;
    if (!(player instanceof Player)) return false;
    const equipment = player.getComponent('equippable');
    const selectedItem = equipment?.getEquipment('Mainhand');
    return selectedItem?.typeId === block.typeId;
};
function bitArrayAdd (numberArray = [], numberToAdd = 0, base = 10, minReturnLength = 1, minBase10Value = (Infinity * -1), maxBase10Value = Infinity) {
    //bug.log(`\n§b* bitArrayAdd (numberToAdd=${numberToAdd}, base=${base}, minReturnLength=${minReturnLength}, minBase10Value=${minBase10Value}, maxBase10Value=${maxBase10Value})`)
    //TODO: Change to a class so validation is ONCE
    if (!Array.isArray(numberArray)) return null;
    if (typeof numberToAdd != "number" || typeof base != "number" || base <= 1) return null;
    
    if (numberArray.length == 0) numberArray.push(0);
    if (typeof minReturnLength != "number" || minReturnLength < 1) minReturnLength = 1;
    
    //validate array is in correct base
    for (let i = 0; i < numberArray.length; i++) {
        if (typeof numberArray[ i ] != "number" || Math.abs(numberArray[ i ]) >= base) return null; // TODO: add new error
    }
    // bug.log("Array Validated")
    // bug.listArray(numberArray)

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
        //TODO: add error if max is infinity
    }
    else if (base10value > maxBase10Value) {
        //TODO: should be a while loop
        let n = maxBase10Value - base10value;
        base10value = minBase10Value + (n - 1);
        //TODO: add error if min is neg infinity
    }

    //convert back to user base as array
    while (base10value) {
        let n = base10value % base;
        numberArray.unshift(n);
        base10value = Math.floor(base10value / base);
    }
    while (numberArray.length < minReturnLength) numberArray.unshift(0);
    // bug.listArray(numberArray,world)
    // bug.log("§2<xit> bitArrayAdd")
    return numberArray;
}
//let testArray = [0];
//for (let i = 0; i < 64; i++) {
//    let temp =testArray.slice();
//    let resultArray = bitArrayAdd(testArray,1,4)
//    console.log(i+1,temp,"=>",resultArray);
//    testArray = resultArray.slice()
//}
//=============================================================================
const numOfAngles = 64;
const angleStateX = 'int:x_id';
const angleStateY = 'int:y_id';
const angleStateZ = 'int:z_id';
//=============================================================================
world.beforeEvents.worldInitialize.subscribe((event) => {
    //1.12.0
    event.blockTypeRegistry.registerCustomComponent(
    //1.13.0 event.blockComponentRegistry.registerCustomComponent(
        "dw623:rotation_angles_components",
        {
            onPlayerInteract: e => {

                const { block, player } = e;
                bug.log(`player is sneaking: ${player.isSneaking}`)
                const blockStates = block.permutation.getAllStates();                

                //TODO: confirm states exist
                const angleIds = [ blockStates[ angleStateX ], blockStates[ angleStateY ], blockStates[ angleStateZ ] ];
                
                //Validate values 0..3
                for (let i = 0; i < 3; i++) {
                    if (typeof angleIds[ i ] != "number" || angleIds[ i ] < 0 || angleIds[ i ] > 3) return;
                }

                if (isPlayerHoldingBlock(block, player)) {                    
                    let newAngleIds = bitArrayAdd(angleIds, (player.isSneaking ? 16 : 1), 4, 3, 0, 63);                    

                    const newBlockPermutation = block.permutation
                        .withState(angleStateX, newAngleIds[ 0 ])
                        .withState(angleStateY, newAngleIds[ 1 ])
                        .withState(angleStateZ, newAngleIds[ 2 ]);
                    //1.13.0
                    //if (!block.trySetPermutation(newBlockPermutation)) {
                        block.setPermutation(newBlockPermutation)
                        bug.log(`New Angle IDs: x:${blockStates[ angleStateX ] * 90}  y:${blockStates[ angleStateY ] * 90}  z:${blockStates[ angleStateZ ] * 90}`,player);
                        // bug.log("trySetPermutation Failed\n§aWanted:", player);
                        // bug.listBlockStates(newBlockPermutation, player);
                        // bug.log("§cBlock Still Has:", player);
                        // bug.listBlockStates(block.permutation, player);
                        // return;
                    //}
                }
                else {
                    //Show xyz of state                   
                    const angleX = blockStates[ angleStateX ] * 90;
                    const angleY = blockStates[ angleStateY ] * 90;
                    const angleZ = blockStates[ angleStateZ ] * 90;
                    player.sendMessage(`Angle IDs: x:${blockStates[ angleStateX ] * 90}  y:${blockStates[ angleStateY ] * 90}  z:${blockStates[ angleStateZ ] * 90}`);
                }
            }
        }
    );
});
//=============================================================================