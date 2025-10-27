//@ts-check
import { pack } from './settings.js';
import { subscriptionsBeta } from './subscribes-beta.js';
import { subscriptionsStable } from './subscribes.js';
//==============================================================================
pack.beta = true;
//==============================================================================
subscriptionsStable();
subscriptionsBeta();
//==============================================================================
// End of File