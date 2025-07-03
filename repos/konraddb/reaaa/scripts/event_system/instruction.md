# Event System Deployment

This guide provides step-by-step instructions for deploying and registering event system contracts.

## Steps:

Before all make sure that addresses in each script file are latest one.

### 1. Deploy Hub Handler on Khalani and Spoke Handler on Spoke Chains

Run the following command for each chain:

```bash
# On Khalani
npx hardhat run scripts/event_system/handlers/deployHubHandler.js --network khalani

# On Ethereum Testnet
npx hardhat run scripts/event_system/handlers/deploySpokeHandler.js --network holesky

# On Avalanche Testnet
npx hardhat run scripts/event_system/handlers/deploySpokeHandler.js --network avalanche
```

### 2. Deploy EventVerifier on Khalani and Spoke Chains

Run the following command for each chain:

```bash
# On Khalani
npx hardhat run scripts/event_system/verifiers/deployEventVerifier.js --network khalani

# On Ethereum Testnet
npx hardhat run scripts/event_system/verifiers/deployEventVerifier.js --network holesky

# On Avalanche Testnet
npx hardhat run scripts/event_system/verifiers/deployEventVerifier.js --network avalanche
```

### 3. Deploy SpokePublisher and HubPublisher

Run the following command for each chain:

```bash
# On Khalani Network
npx hardhat run scripts/event_system/publishers/deployHubPublisher.js --network khalani

# On Ethereum
npx hardhat run scripts/event_system/publishers/deploySpokePublisher.js --network holesky

# On Avalanche
npx hardhat run scripts/event_system/publishers/deploySpokePublisher.js --network avalanche
```

### 4.Deploy EventProvers

Run the following command for each chain:

```bash
# On Khalani Network
npx hardhat run scripts/event_system/provers/deployEventProver.js --network khalani

# On Ethereum
npx hardhat run scripts/event_system/provers/deployEventProver.js --network holesky

# On Avalanche
npx hardhat run scripts/event_system/provers/deployEventProver.js --network avalanche
```

### 5. Deploy MTokenCrossChainAdapter on Arcadia

Run the following command for Arcadia chain:

```bash
# On Khalani Network
npx hardhat run scripts/event_system/apps/deployMTokenCrossChainAdapter.js --network khalani
```

### 6. Deploy AssetReserves on Spoke Chains

Run the following command for spoke chains:

```bash
# On Holesky Network
npx hardhat run scripts/event_system/apps/deployAssetReserves.js --network holesky

# On Avalanche Network
npx hardhat run scripts/event_system/apps/deployAssetReserves.js --network avalanche
```

npx hardhat run ./scripts/event_system/configure/deposit/hub.js --network khalani
npx hardhat run ./scripts/event_system/configure/deposit/spoke.js --network holesky
npx hardhat run ./scripts/event_system/configure/deposit/spoke.js --network avalanche

npx hardhat run ./scripts/event_system/configure/withdraw/hub.js --network khalani
npx hardhat run ./scripts/event_system/configure/withdraw/spoke.js --network holesky
npx hardhat run ./scripts/event_system/configure/withdraw/spoke.js --network avalanche
