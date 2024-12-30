//@ts-check
import {
    PlayerInteractWithBlockBeforeEvent,
    PlayerInteractWithBlockAfterEvent,
    BlockComponentTypes,
    Direction,
    BlockPermutation
} from "@minecraft/server";
import { playerF3Add } from "../fn-stable.js";
import { vanillaLists } from "../settings.js";
import { FaceLocationGrid, Vector2Lib, Vector3Lib } from '../common-stable/vectorClass.js';
//==============================================================================
/**
 * 
 * @param {PlayerInteractWithBlockBeforeEvent | PlayerInteractWithBlockAfterEvent} event 
 */
export function playerInteractWithBlock_both (event) {

    if (!event.isFirstEvent || !event.player.isValid() || !event.block.isValid()) {
        return;
    }

    const { player, block, blockFace, faceLocation, itemStack } = event;

    //@ts-ignore
    const grid = new FaceLocationGrid(faceLocation, blockFace.toLowerCase(), false, player);

    const data = {
        block: block.typeId,
        blockFace: blockFace,
        faceLocation: Vector3Lib.toString(faceLocation, 2, true),
        xyDelta: Vector2Lib.toString(grid.xyDelta, 2, true, ','),
        verticalHalf: grid.verticalHalf == 0 ? 'top' : 'bottom',
        horizontalHalf: grid.horizontalHalf == 0 ? 'left' : 'right'
    };

    block.permutation.getTags().forEach((tag, i) => data[ `blockTag_${i + 1}` ] = tag);

    let i = 1;
    for (const [ bs, value ] of Object.entries(block.permutation.getAllStates())) {
        data[ `${bs.startsWith('minecraft:') ? 'blockTrait' : 'blockState'}_${i++}` ] = `${bs} = ${value}`;
    }

    if (block.getComponent(BlockComponentTypes.Inventory))
        data.isInventoryContainer = true;
    else if (block.getComponent(BlockComponentTypes.RecordPlayer))
        data.isRecordPlayer = true;
    else if (block.getComponent(BlockComponentTypes.Sign))
        data.isSign = true;
    else if (block.getComponent(BlockComponentTypes.Piston))
        data.isPiston = true;
    else if (BlockComponentTypes.PotionContainer && block.getComponent(BlockComponentTypes.PotionContainer))
        data.isPotionContainer = true;

    if (block.type.canBeWaterlogged)
        data.canBeWaterlogged = true;

    const rsp = block.getRedstonePower();
    if (rsp)
        data.redStoneLevel = rsp;

    if (itemStack)
        data.itemHeldIsBlock = vanillaLists.blocks.includes(itemStack.typeId);
    
    if (itemStack && itemStack.typeId != block.typeId) {
        data.isHoldingItem = `${itemStack.amount} ${itemStack.typeId}`;

        if (vanillaLists.items.includes(itemStack.typeId))
            data.itemHeldIsItem = true;


        if (data.itemHeldIsBlock) {
            data.itemHeldIsBlock = true;

            Object.entries((Direction)).forEach(d => {
                if (!block.canPlace(itemStack.typeId, d[ 1 ]))
                    data[ `itemCanPlace_${d[ 0 ]}` ] = false;
            });
        }

        const comps = itemStack.getComponents();
        let i = 1;
        comps.forEach(o => {
            if (o.isValid())
                data[ `itemComponent_${i++}` ] = o.typeId;
        });

        itemStack.getTags().forEach((tag, i) => data[ `itemTag_${i + 1}` ] = tag);

        if (data.itemHeldIsBlock) {
            const tempPermutation = BlockPermutation.resolve(itemStack.typeId);

            i = 1;
            for (const [ bs, value ] of Object.entries(tempPermutation.getAllStates())) {
                data[ `${bs.startsWith('minecraft:') ? 'itemBlockTrait' : 'itemBlockState'}_${i++}` ] = `${bs} = ${value}`;
            }
        }
    }

    playerF3Add(player, 'last_playerInteractWithBlock', data, true);
    player.sendMessage('\n');
}
//==============================================================================