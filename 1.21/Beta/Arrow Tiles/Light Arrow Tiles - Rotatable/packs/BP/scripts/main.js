import { world } from '@minecraft/server';
import * as opi from './components/onPlayerInteract.js';

//=============================================================================

world.beforeEvents.worldInitialize.subscribe((event) => {
    event.blockTypeRegistry.registerCustomComponent(
        "dw623:rotate_arrow_tile_components",
        {
            onPlayerInteract: e => {
                /**
                 * Rotation is still influenced by which way the player is facing
                 * to keep it more vanilla
                 * 
                 * another option would just be to have it rotate clockwise 
                 * regardless of where player is facing
                 */

                if (e.player.isSneaking) opi.rotateClockwise(e);
                else opi.rotateOnPlayerFacing(e);
            }
        }
    );
});

//=============================================================================