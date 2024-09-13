//@ts-check
import { world, system } from "@minecraft/server";
import { alertLog, dev, watchFor, chatLog } from './settings.js';
import { chatSend_before_fn, chatSend_after_fn } from './chatCmds-beta.js';
import { enterWeb, expandWeb } from './fn-beta.js';
import { placeWeb } from './fn-stable.js';
//==============================================================================
export function chatSend () {
    alertLog.success(`§aInstalling Chat Commands (before)§r - §6Beta  §c(Debug Mode)§r`, dev.debugSubscriptions);
    world.beforeEvents.chatSend.subscribe((event) => {
        chatSend_before_fn(event);
    });

    alertLog.success(`§aInstalling Chat Commands (after)§r - §6Beta  §c(Debug Mode)§r`, dev.debugSubscriptions);
    world.afterEvents.chatSend.subscribe((event) => {
        chatSend_after_fn(event);
    });
}
//==============================================================================
export function afterEvents_scriptEventReceive () {

    alertLog.success("§aInstalling afterEvents.scriptEventReceive §c(Debug Mode)", dev.debugSubscriptions);

    system.afterEvents.scriptEventReceive.subscribe((event) => {
        const { id, message, sourceEntity: entity } = event;

        if (!entity || entity.typeId != watchFor.typeId) return;
        if (!id) return;

        //Only work in overworld
        if (!entity.dimension.id.endsWith('overworld')) {
            chatLog.error(`xx Not in overworld xx}`, dev.debugEntityAlert);
            return;
        }

        if (id.startsWith(watchFor.family)) {
            if (id === `${watchFor.family}:placeWeb`) { placeWeb(entity); return; }
            if (id === `${watchFor.family}:enterWeb`) { enterWeb(entity); return; }
            if (id === `${watchFor.family}:expandWeb`) { expandWeb(entity); return; }
        }
        // const cmd = id.replace(watchFor.family + ':', '');
        // if (cmd === `placeWeb`) { placeWeb(entity); return; }
        // if (cmd === `enterWeb`) { enterWeb(entity); return; }
        // if (cmd === `expandWeb`) { expandWeb(entity); return; }

        if (id === 'debug:EntityAlert' && dev.debugEntityAlert) {
            chatLog.log(message,true)
            return
        }

        if (id === 'debug:GamePlay' && dev.debugGamePlay) {
            chatLog.log(message,true)
            return
        }
    });
}
//==============================================================================