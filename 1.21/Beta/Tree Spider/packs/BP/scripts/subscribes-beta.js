//@ts-check
import { world, system } from "@minecraft/server";
import { alertLog, dev, watchFor, chatLog } from './settings.js';
import { chatSend_before_fn } from './chatCmds-beta.js';
import { enterWeb, expandWeb } from './fn-beta.js';
import { placeWeb, entityLastActiveTickUpdate } from './fn-stable.js';
//import { ScoreboardLib } from "./commonLib/scoreboardClass.js";
//==============================================================================
export function chatSend () {
    alertLog.success(`§aInstalling Chat Commands (before)§r - §6Beta  §c(Debug Mode)§r`, dev.debugSubscriptions);
    world.beforeEvents.chatSend.subscribe((event) => {
        chatSend_before_fn(event);
    });

    // alertLog.success(`§aInstalling Chat Commands (after)§r - §6Beta  §c(Debug Mode)§r`, dev.debugSubscriptions);
    // world.afterEvents.chatSend.subscribe((event) => {
    //     chatSend_after_fn(event);
    // });
}
//==============================================================================
export function afterEvents_scriptEventReceive () {

    alertLog.success("§aInstalling afterEvents.scriptEventReceive §c(Debug Mode)", dev.debugSubscriptions);

    system.afterEvents.scriptEventReceive.subscribe((event) => {
        const { id, message, sourceEntity: entity } = event;

        if (!entity) return;
        if (![ watchFor.typeId, watchFor.egg_typeId ].includes(entity.typeId)) return;
        if (!id) return;

        //if (id != 'debug:Stick') entityLastActiveTickUpdate(entity);

        if (id.startsWith(watchFor.family)) {
            if (id === `${watchFor.family}:placeWeb`) { placeWeb(entity); return; }
            if (id === `${watchFor.family}:enterWeb`) { enterWeb(entity, message == 'baby' ? true : false); return; }
            if (id === `${watchFor.family}:expandWeb`) { expandWeb(entity); return; }
        }

        if (id.startsWith('register') && id.endsWith('Activity')) entityLastActiveTickUpdate(entity);

        if (id === 'registerSB:EntityActivity') { dev.debugScoreboard?.addScore(message, 1); return; }
        if (id === 'registerSB:BabyActivity') { dev.debugBabyScoreboard?.addScore(message, 1); return; }
        if (id === 'registerSB:Activity') { 
            dev.debugBabyScoreboard?.addScore(message, 1); 
            dev.debugScoreboard?.addScore(message, 1);
            return; 
        }

        //no sb for message after this point - add entity id to message
        const note = `${message} - ${entity.id}`;

        if (id === 'register:Activity') { 
            chatLog.log(note, dev.debugEntityActivity || dev.debugBabyActivity); 
            return; 
        }
        if (id === 'register:EntityActivity') { chatLog.log(note, dev.debugEntityActivity); return; }
        if (id === 'register:BabyActivity') { chatLog.log(note, dev.debugBabyActivity); return; }

        if (id === 'chatOnly:EntityActivity') { chatLog.log(note, dev.debugEntityActivity); return; }
        if (id === 'chatOnly:BabyActivity') { chatLog.log(note, dev.debugBabyActivity); return; }
        if (id === 'chatOnly:EntityAlert') { chatLog.log(note, dev.debugEntityAlert); return; }
        if (id === 'chatOnly:BabyAlert') { chatLog.log(note, dev.debugBabyAlert); return; }
        //Not used for anything yet...
        if (id === 'chatOnly:GamePlay') { chatLog.log(note, dev.debugGamePlay); return; }
        if (id === 'debug:Stick') { chatLog.log(note, true); return; }

        //if (dev.debugEntityActivity || dev.debugEntityAlert || dev.debugGamePlay)
        chatLog.error(`Unhandled Entity JSON Communication:\nId: ${id}\nMessage: ${note}`, true);
    });
}
//==============================================================================