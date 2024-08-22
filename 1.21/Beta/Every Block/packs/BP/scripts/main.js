//@ts-check
import { world, Player, } from '@minecraft/server';
import * as vanillaBlocks from './vanillaBlocks.js';

//to stay in chat screen
world.afterEvents.chatSend.subscribe(  //Chat Command Code Testing
    (event) => {
        if (!event.message.startsWith(':')) return;
        const player = event.sender;
        if (!(player instanceof Player)) return;

        const msg = event.message.trim().replaceAll('  ', ' ');
        const msg_lc = msg.toLowerCase();

        if (msg_lc === ":cls") { player.sendMessage("\n".repeat(40)); return; }

        if (msg_lc === ":states") {
            vanillaBlocks.thisBlockRightHereStates(player);
            return;
        }

        if (msg_lc === ":here" || msg_lc === ":info" || msg_lc === ":this") {
            vanillaBlocks.thisBlockRightHere(player);
            return;
        }
        if (msg.startsWith(":info ")) {
            const parts = msg.split(' ');

            if (parts.length == 2) {
                if (!Number.isNaN(parts[ 1 ])) {
                    vanillaBlocks.blockInfoDisplay(player, Number(parts[ 1 ]));
                    return;
                }
            }
            player.sendMessage("§cInvalid Command Format");
            return;
        }

        if (msg.startsWith(":listTags ")) {
            const parts = msg.split(' ');

            if (parts.length == 2) {
                if (!Number.isNaN(parts[ 1 ])) {
                    vanillaBlocks.tagFilter('', '', parts[ 1 ].toLowerCase());
                    return;
                }
            }

            player.sendMessage(`§cInvalid Command Format: usage => ${parts[ 0 ]} <filter>`);
            return;
        }

        if (msg_lc.startsWith(":list ")) {
            const parts = msg.split(' ');

            if (parts.length == 2) {
                if (!Number.isNaN(parts[ 1 ])) {
                    vanillaBlocks.listFilter(parts[ 1 ].toLowerCase());
                    return;
                }
            }
            else if (parts.length == 3) {
                const search = parts[ 1 ];
                if ([ 'ew', 'i', 'sw' ].includes(search) && !Number.isNaN(parts[ 2 ])) {
                    vanillaBlocks.listFilter(parts[ 2 ].toLowerCase(), search);
                    return;
                }
            }

            player.sendMessage(`§cInvalid Command Format: usage => ${parts[ 0 ]} <filter>  or ${parts[ 0 ]} <i/ew/sw> <filter>`);
            return;
        }

        if (msg_lc.startsWith(":tag ")) {
            const parts = msg.split(' ');

            if (parts.length == 2) {
                if (!Number.isNaN(parts[ 1 ])) {
                    vanillaBlocks.tagFilter(parts[ 1 ].toLowerCase());
                    return;
                }
            }
            else if (parts.length == 3) {
                const search = parts[ 1 ];
                if ([ '=', '==', '===', 'ew', 'i', 'sw' ].includes(search) && !Number.isNaN(parts[ 2 ])) {
                    vanillaBlocks.tagFilter(parts[ 2 ].toLowerCase(), search);
                    return;
                }
            }

            player.sendMessage(`§cInvalid Command Format: usage => ${parts[ 0 ]} <filter>  or ${parts[ 0 ]} <=/i/ew/sw> <filter>`);
            return;
        }
        if (msg_lc === ":missing") {
            vanillaBlocks.missingBlockList();
            return;
        }
    }
);
//hopefully to leave chat screen
world.beforeEvents.chatSend.subscribe(  //Chat Command Code Testing
    (event) => {
        if (!event.message.startsWith(':')) return;
        const player = event.sender;
        if (!(player instanceof Player)) return;

        const msg = event.message.trim().replaceAll('  ', ' ');
        const msg_lc = msg.toLowerCase();

        if (msg_lc === ":init".toLowerCase()) {
            event.cancel = true;
            vanillaBlocks.initializeBlocks(player);
            return;
        }

        if (msg_lc === ":count") {
            event.cancel = true;
            player.sendMessage(`§bVanilla Block Count = ${vanillaBlocks.blockCount()}`);
            return;
        }

        if (msg_lc === ":install") { vanillaBlocks.placeBlocks(player); return; }

        if (msg.startsWith(":install ")) {
            const parts = msg.split(' ');
            if ([ 2, 3 ].includes(parts.length))
                if (!Number.isNaN(parts[ 1 ])) {
                    if (parts.length === 3 && !Number.isNaN(parts[ 2 ])) {
                        event.cancel = true;
                        const from = Number(parts[ 1 ]);
                        const to = Number(parts[ 2 ]);
                        vanillaBlocks.placeBlocksRange(player, from, to);
                        return;
                    }
                    else {
                        event.cancel = true;
                        const from = Number(parts[ 1 ]);
                        vanillaBlocks.placeBlocksRange(player, from);
                        return;
                    }
                }

            player.sendMessage("§cInvalid Command Format");
            return;
        }

        if (msg.startsWith(":goto ")) {
            const parts = msg.split(' ');
            if (parts.length == 2) {
                if (!Number.isNaN(parts[ 1 ])) {
                    event.cancel = true;
                    vanillaBlocks.goto(player, Number(parts[ 1 ]));
                    return;
                }
            }

            player.sendMessage("§cInvalid Command Format");
            return;
        }
    }
);