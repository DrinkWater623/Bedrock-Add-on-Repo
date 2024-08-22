import * as subscribe from './subscribe.js';
//==============================================================================
subscribe.worldInitialize_after();
//==============================================================================
subscribe.chatSend_before()
//==============================================================================
subscribe.entityDie_after();
subscribe.entityLoad_after();
subscribe.entitySpawn_after();
//==============================================================================
/*
    Need world load check for isWither was true when world loaded and if a tracking job was running
*/

