import { world, system, Player } from '@minecraft/server';
//=============================================================================
world.beforeEvents.chatSend.subscribe((event) => {

    const spamEmptyLines = function (numOfLines = 40, chatSend = world) {   
        chatSend.sendMessage("\n".repeat(numOfLines));
    };

    if (event.message.toLowerCase().startsWith(":cls")) {
        event.cancel = true;       
        if (!(event.sender instanceof Player)) return

        let chatScope = event.sender;
        let cmd = event.message.toLowerCase().replace(" ","");

        if (cmd.startsWith(":clsw")) {chatScope = world; cmd=":cls world"}            

        system.run(() => { 
            spamEmptyLines(40, chatScope);
            chatScope.sendMessage(`> ${cmd}`);
        });
        return;


    }    
});
//=============================================================================