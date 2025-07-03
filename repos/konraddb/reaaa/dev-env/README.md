# Directions
These steps will allow you to quickly spin up a multichain network locally, where each chain is communicating via hyperlane

## pre-requisites

Then:

1. `make registry`
2. Open a new terminal and `make start-hub`
3. Open a third terminal and `make start-spoke`
4. Return to original terminal and `make deploy`
5. `make deploy-permit2`

Then:
1. `make deploy-contracts-initial` 
   This will log three contract addresses. Make sure to set in `.env.dev` the SPOKE_HANDLER, SPOKE_CHAIN_EVENT_VERIFIER and SPOKE_PUBLISHER env vars within the .env.dev file. Then proceed
2. `make deploy-hub-contracts` this will log the output of the hub chain event verifier. Make sure to set `HUB_CHAIN_EVENT_VERIFIER` in the `.env.dev` before proceeding to the next step
3. `make deploy-spoke-contracts`
