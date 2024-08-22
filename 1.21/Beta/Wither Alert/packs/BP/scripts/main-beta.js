import {subscriptionsActivate} from './subscribe.js';
import {chatSend_before} from './charCommands.js';
import * as gVar from './globalVars.js';
//==============================================================================
//TODO:
//Validate above watchFor so I do not have to keep checking in code 
gVar.watchFor.validated = true;
//==============================================================================
if (gVar.watchFor.validated) {
    subscriptionsActivate();
    chatSend_before ();
}
//==============================================================================
