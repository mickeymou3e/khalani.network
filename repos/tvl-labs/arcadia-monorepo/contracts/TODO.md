# Fixes log

## Meta
1. Should document the dependencies of each contract and the deployment order based on deployment-time dependencies
2. Should extract a "post-deployment" setup to a separate script so that changes that affect deployment and post-deployment time logic only requires updates in one place.


### Fix 1: Prevent deposit messages from being relayed to Arcadia when a deposit has not actually occurred
This is enabled becasue anybody has the authority to call event registration methods on the EventProver.

Steps to fix:
[x] Check that all contracts (esp. asset reserves) only use the event publish and not the event prover. 
[x] Add method on event prover to set event publisher
[x] Update scripts and SystemState test file to set event publisher on event prover after event prover --> event publisher has completed
[x] A. Ensure that event publisher uses x-chain-events rather than app specific events
[ ] B. Ensure same thing in event handler
       --> It doesn't, will need to address this. Will address in separate task, since even if fixed, it has equivalent behaviorfor the events we are currently using. 
[ ] C. Associate authorized registerer with an event type on the event publisher. 

Notes during fix:
1. Questioning the design of event system where it is 1:N relationship between publisher and prover. The motivation is that provers (and verifiers) are the integration point between different x-chain protocols. However, people may want to add their own *kind* of events for their AIP App. The event prover deals with xChainEvents, so it is not app-specific. Event publisher deals with app-specific events. This means that app integrations would require registration as a new event publisher on the event prover. This is not ideal because AIP Apps would require doing this for every single prover (if they want to utilize multiple x-chain systems). A better design would be to make the publisher deal with XChainEvents as well, making it the job of the AIP App to correctly encode the app-specific event data. They WILL, then, also need app-specific event handlers. But handler and publisher are singletons. So really, the handler needs to be able to check who to send the event off to. 
    --> This makes cross chain AIP Apps only need to do one thing on spoke and hub chains: integrate with event publisher and integrate with event handler.

Added tasks A and B to the list of steps to fix above.

Confirmed unit tests work
Confirmed deployment to local network works

2. Realized that if event publishers are the integration point, event publisher needs to ensure that only a single caller is the authorized registerer of each event type. Otherwise, the system could still allow deposit events to be relayed if the call is made by a different registerer, so long as that registerer is authorized in the event publisher.

Added task C to the list of steps for this above note.

### Fix 2: Prevent LP Intent DOS'ing 
This is made possible because an LP Intent can be consumed by an output intent with the exact same amount
of tokens. 
It is also possible because the ttl of the output intent is not checked.

Steps to fix:
[x] Add test to intentbook to test zeropct fill reverts
[x] Ensure ttl is checked on output intents and is identical
[x] Ensure ttl change causes revert
[x] Ensure that the intent srcAmount in output is less than the input intent spent



### Fix 3: Ensure No Replays of Events in AIPEventHandler
This is caused by not updating the handled events internal state when event is handled.

Steps to fix:
[x] Update AIP Event handler accordingly
[ ] Add a test that goes through the event lifecycle

### Fix 4: Messages are not effectively relayed between the contracts on the recipient chain
This is caused by the fact that, while the event verifier is called by the hyperlane mailbox, the event verifier does not call out to the event handler.

Right now, the event handler is coupled 1:1 with an event verifier. What we really need is a 1:N relationship between event verifier and event handler.

Steps to fix:
- [ ] Update event handler to maintain a registry of provers
- [ ] Update event handler to maintain a registry of app event processors
- [ ] Update event verifier to call out to the event handler
- [ ] Update event verifier to have handler set in the constructor as an immutable
- [ ] Make asset reserves an application processor and registerer
- [ ] Update tests and deployment scripts to reflect this change
- [ ] Add app specific event *processor*. This enables an N:N relationship between event verifiers and applications and enables event handler to be application agnostic.


Notes:
Currently, AIPEventHandler is coupled 1:1 with asset reserves contracts. Asset reserves are, however, APPLICATION-SPECIFIC. This breaks the application-agnosticism of AIP.

Additionally, this is problematic because Arcadia supports multiple spoke chains and therefore multiple asset reserves contracts. But this is just 

We need to decouple the AIPEventHandler from the asset reserves.
### Fix 5: Ensure that MToken can only be minted when assets are deposited in asset reserve

### Fix 6: Ensure users can redeem receipts for MTokens

### Fix 7: Refund MTokens when an intent is cancelled

### Fix 8: Upscale token deposit amounts (and downscale if necessary)

### Fix 9: Withdraw Mtokens back to spoke chain

### Fix 10: Deposited assets are lost because hey are not associated with correct spoke token address