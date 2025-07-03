# Smart Contracts Deployment Guide

> A step-by-step README for configuring environment and deploying smart contracts using Hyperlane, AWS Secrets Manager, and Uniswap PERMIT2.

---

## 📋 Table of Contents

1. [Environment Variables](#-environment-variables)

   - [Hyperlane (Hub & Spoke)](#hyperlane-hub--spoke)
   - [AWS Secrets Manager](#aws-secrets-manager)
   - [Uniswap PERMIT2](#uniswap-permit2)
   - [Chain IDs](#chain-ids)

2. [Usage](#-usage)

---

## 🔑 Environment Variables

Configure the following sections in your `.env` file.

### Hyperlane (Hub & Spoke)

```env
# Hub chain (Arcadia)
HUB_MAILBOX=<arcadia_mailbox_address>
HUB_IGP=<arcadia_interchainGasPaymaster_address>

# Spoke chain (repeat for each target network)
SPOKE_MAILBOX=<spoke_mailbox_address>
IGP=<spoke_interchainGasPaymaster_address>
```

**How to obtain:**

- **Hub:**:
  View [Arcadia Testnet addresses](https://github.com/hyperlane-xyz/hyperlane-registry/blob/main/chains/arcadiatestnet2/addresses.yaml).
  View [Arcadia Mainnet addresses](https://github.com/hyperlane-xyz/hyperlane-registry/blob/main/chains/arcadia/addresses.yaml).
- **Spoke:** Browse the registry folder for your chain under `hyperlane-registry/chains/<chain-name>/addresses.yaml`.

### AWS Secrets Manager

```env
MEDUSA=<medusa_account_address>
REFUND_AGENT=<refund_agent_address>
MEDUSA_KEY=<aws_secret_name_for_medusa_pk>
PRIVATE_KEY=<aws_secret_name_for_medusa_pk>
```

**How to obtain:**

- Log into AWS Secrets Manager.
- Retrieve the Medusa private key secret:
  **Testnet**: https://us-west-2.console.aws.amazon.com/secretsmanager/secret?name=testnet&region=us-west-2
  **Mainnet**: https://us-west-2.console.aws.amazon.com/secretsmanager/secret?name=Medusa_Keys&region=us-west-2 (check this)

### Uniswap PERMIT2

```env
PERMIT2=<permit2_contract_address>
```

**How to obtain:**

- Visit [Uniswap V4 Deployments](https://docs.uniswap.org/contracts/v4/deployments) and copy the PERMIT2 address for your chain.

### Chain IDs

```env
HUB_CHAIN_ID=<arcadia_chain_id>
SPOKE_CHAIN_ID=<target_spoke_chain_id>
```

**Tips:**

- Hub chain ID:
  **Testnet**: 1098411886
  **Mainnet**: 4278608
- Identify each spoke chain’s ID via its registry folder or chain explorers.

---

## 🎯 Usage

1. **Deploy Core**

   - **Hub**

     ```bash
     forge script ./scripts/HubDeployCoreProtocol.s.sol:HubDeployCoreProtocol \
       --rpc-url <HUB_RPC_URL> \
       --private-key <PRIVATE_KEY> --broadcast
     ```

   - **Spoke**

     ```bash
     forge script ./scripts/SpokeDeployCoreProtocol.s.sol:SpokeDeployCoreProtocol \
       --rpc-url <SPOKE_RPC_URL> \
       --private-key <PRIVATE_KEY> --broadcast
     ```

2. **Deploy Bridge Adapters**

   - **Hub**

     ```bash
     forge script ./scripts/HubDeployHyperFlowBridge.s.sol:HubDeployHyperFlowBridge \
       --rpc-url <HUB_RPC_URL> \
       --private-key <PRIVATE_KEY> --broadcast
     ```

   - **Spoke**

     ```bash
     forge script ./scripts/SpokeDeployHyperFlowBridge.s.sol:SpokeDeployHyperFlowBridge \
       --rpc-url <SPOKE_RPC_URL> \
       --private-key <PRIVATE_KEY> --broadcast
     ```

3. **Wire Provers ↔ Verifiers**

   - **Hub**

     ```bash
     forge script ./scripts/HubConnectProverToVerifier.s.sol:HubConnectProverToVerifier \
       --rpc-url <HUB_RPC_URL> \
       --private-key <PRIVATE_KEY> --broadcast
     ```

   - **Spoke**

     ```bash
     forge script ./scripts/SpokeConnectProverToVerifier.s.sol:SpokeConnectProverToVerifier \
       --rpc-url <SPOKE_RPC_URL> \
       --private-key <PRIVATE_KEY> --broadcast
     ```

4. **Connect Remote Provers**

   - **Hub**

     1. Get EventProver contract address from the broadcast output of `SpokeConnectProverToVerifier.s.sol`
     2. Add this address to your `.env` file as `EVENT_PROVER=<address>`
     3. This step must be repeated for every spoke chain you're connecting

     ```bash
     forge script ./scripts/HubConnectRemoteProver.s.sol:HubConnectRemoteProver \
       --rpc-url <HUB_RPC_URL> \
       --private-key <PRIVATE_KEY> --broadcast
     ```

   - **Spoke**

     1. Get EventProver contract address from the broadcast output of `HubConnectProverToVerifier.s.sol`
     2. Add this address to your `.env` file as `EVENT_PROVER=<address>`

     ```bash
     forge script ./scripts/SpokeConnectRemoteProver.s.sol:SpokeConnectRemoteProver \
       --rpc-url <SPOKE_RPC_URL> \
       --private-key <PRIVATE_KEY> --broadcast
     ```

5. **Register Spoke Bridge Event**

   - **Spoke**

     ```bash
     forge script ./scripts/SpokeBridgeEventRegistration.s.sol:SpokeBridgeEventRegistration \
       --rpc-url <SPOKE_RPC_URL> \
       --private-key <PRIVATE_KEY> --broadcast
     ```

   - **Hub**

     ```bash
     forge script ./scripts/HubBridgeEventRegistration.s.sol:HubBridgeEventRegistration \
       --rpc-url <HUB_RPC_URL> \
       --private-key <PRIVATE_KEY> --broadcast
     ```

6. **Set Default Gas Amounts**

   - **Spoke**

     ```bash
     forge script ./scripts/SpokeSetGasAmount.s.sol:SpokeSetGasAmount \
       --rpc-url <SPOKE_RPC_URL> \
       --private-key <PRIVATE_KEY> --broadcast
     ```

   - **Hub**

     ```bash
     forge script ./scripts/HubSetGasAmount.s.sol:HubSetGasAmount \
       --rpc-url <HUB_RPC_URL> \
       --private-key <PRIVATE_KEY> --broadcast
     ```

7. **Add Spoke Tokens**

   1. Get spoke token address and pass it to env var `ASSET_ADDRESS`

   ```bash
   forge script ./scripts/SpokeAddAsset.s.sol:SpokeAddAsset \
     --rpc-url <SPOKE_RPC_URL> \
     --private-key <PRIVATE_KEY> --broadcast
   ```

8. **Add M-Tokens to Hub**

   1. Get spoke token address and pass it to env var `ASSET_ADDRESS`
   2. Get spoke token chain and pass it to env var `ASSET_CHAIN_ID`
   3. Define token name and pass it to env var `NAME`
   4. Define token symbol and pass it to env var `SYMBOL`

   ```bash
   forge script ./scripts/event_system_new/HubAddMToken.s.sol:HubAddMToken \
     --rpc-url <HUB_RPC_URL> \
     --private-key <PRIVATE_KEY> --broadcast
   ```
