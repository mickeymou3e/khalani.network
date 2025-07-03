# Contract Deployment, Configuration and Ops Instructions



The scripts located in `/scripts` provide methods for:
1. Deployments
2. Setting and updating contract configurations
3. Running checks on the state of the deployed system
4. Basic maintenance tasks




The scripts are structured like so:

- `BaseScript`
    - `BaseHubScript`
        - `HubDeployCoreProtocol`
        - `HubDeployBaseEventSystem`
        - `HubDeployHyperFlow`
        - `HubDeployHyperFlowBridge`
        - utilities
            - `HubHealthCheck`
            - `HubRotateMedusa`
            - `HubPauseInboundForSpokeChain`
            - `HubPauseBridgeForSpokeChain`
    - `BaseSpokeScript`
        - `SpokeDeployHyperFlow`
        - `SpokeDeployHyperFlowBridge`
        - utilities
            - `SpokeHealthCheck`
            - `SpokeRotateMedusa`
            - `SpokePauseBridge`
            - `SpokeUpdateHyperFlowDestination`
    



**BaseScript**: Contains state variables and utility methods that are useful for all other scripts

**BaseHubScript**: Contains hub-specific state variables that are likely useful across a variety of hub chain ops actvities. For example, it contains a state variable called `spokeChainId`, which is only meaningful in the context of the hub chain when working with a specific spoke chain.

**BaseSpokeScript**: Contains spoke-specific state variables that are likely useful across many different spoke chain ops activities. For example, it contains `assetReserves` address variable, which only 



# Environment and Command for Each Script

## HubDeployCoreProtocol

**Command**: `forge script scripts/HubDeployCoreProtocol.s.sol --rpc-url $RPC_URL --private-key $MEDUSA_KEY`

**Environment Variables**:
- RPC_URL
- MEDUSA_KEY
- MEDUSA
- DEV_CHAIN_ID (or TESTNET_CHAIN_ID or MAINNET_CHAIN_ID)
- DEV_MODE (or TESTNET_MODE or MAINNET_MODE)
- HUB_MAILBOX
- REFUND_AGENT
- REFUND_AGENT_KEY



**Notes**
- To enable dev / testnet / mainnet mode, set the respective mode env var to `1` (e.g., `DEV_MODE=1`). If multiple flags are set, it will treat the least consequential mode as the active one (ie, if dev mode is set, it overrides all other modes; if testnet mode and mainnet mode are set, then testnet will be prioritized)

- By default, if dev mode is active, then this script will deploy a `MockMailbox` to the chain unless `HUB_MAILBOX` env var is set.



## SpokeDeployCoreProtocol

**Command**: `forge script scripts/SpokeDeployCoreProtocol.s.sol --rpc-url $RPC_URL --private-key $MEDUSA_KEY`

**Environment Variables**:
- RPC_URL
- MEDUSA_KEY
- MEDUSA
- REFUND_AGENT
- REFUND_AGENT_KEY
- DEV_CHAIN_ID (or TESTNET_CHAIN_ID or MAINNET_CHAIN_ID)
- DEV_MODE (or TESTNET_MODE or MAINNET_MODE)
- HUB_EVENT_VERIFIER (optional)
- HUB_CHAIN_ID




## HubConnectProverToVerifier

**Command**: `forge script scripts/HubConnectProverToVerifier.s.sol --rpc-url $RPC_URL --private-key $MEDUSA_KEY`

**Environment Variables**: Same as `HubDeployCoreProtocol`