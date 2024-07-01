import {
    world,
    Block,
    BlockPermutation 
} from "@minecraft/server";
import { McDebug } from '../library/McDebug.js';

export function blockInfo (block, chatSend = world) {
    if (!(block instanceof Block)) return;

    //debug is assumed on, else why call this function
    const bug = new McDebug(true, chatSend);

    bug.log(`block.(xyz): ${block.x}, ${block.y}, ${block.z} - block.location.(xyz): ${block.location.x}, ${block.location.y}, ${block.location.z}`);
    bug.log(`block.center.(xyz): ${block.center().x}, ${block.center().y}, ${block.center().z}`);
    bug.log(`block.typeId: ${block.typeId} - block.type.id: ${block.type.id}`);
    bug.listArray(block?.getTags(),chatSend,"Block-Tags:")
    blockPermutationInfo(block.permutation,chatSend)
}
export function blockPermutationInfo (permutation, chatSend = world) {
    if (!(permutation instanceof BlockPermutation)) return;

    //debug is assumed on, else why call this function
    const bug = new McDebug(true, chatSend);

    bug.log(`permutation.type.id: ${permutation.type.id}`);    
    bug.listArray(permutation.getTags(),chatSend,"permutation.getTags():")
    bug.listObjectInnards(permutation.getAllStates(),chatSend,"permutation.getAllStates():")
}