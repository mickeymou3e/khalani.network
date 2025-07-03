# Hyperlane Cross-Chain Deployment: AIPEventPublisher and EventProvers

This guide provides step-by-step instructions for deploying and registering **AIPEventPublisher** and **EventProvers** across different chains in a cross-chain environment. The **AIPEventPublisher** is deployed on **Khalani (Hub Chain)**, and **EventProvers** are deployed on connected chains like **Ethereum** and **Avalanche**.

## Description:

- The **AIPEventPublisher** contract coordinates cross-chain event dispatching from Khalani to other chains.
- **EventProvers** are deployed on connected chains (Ethereum, Avalanche, etc.) and send cross-chain events to **Khalani**.
- This guide shows how to deploy the **AIPEventPublisher** on Khalani and register **EventProvers** deployed on other chains.

---

## Steps:

Before all make sure that addresses in each script file are latest one.

### 1. Deploy EventVerifier on Khalani and End Chains (Ethereum, Avalanche, etc.)

Deploy the **EventVerifier** on each end chain (Ethereum, Avalanche, etc.) where cross-chain events from Khalani will be verified.

Run the following command for each chain:

```bash
# On Khalani
npx hardhat run scripts/deployEventVerifier.js --network khalani

# On Ethereum Testnet
npx hardhat run scripts/deployEventVerifier.js --network ethereum

# On Avalanche Testnet
npx hardhat run scripts/deployEventVerifier.js --network avalanche
```

### 2. Deploy EventProver on Khalani and End Chains (Ethereum, Avalanche, etc.)

The **EventProver** needs to be deployed on Khalani, Ethereum, Avalanche, and other chains. These EventProvers will dispatch cross-chain events to Khalani.

Run the following command for each chain:

```bash
# On Khalani to Sepolia and Fuji
npx hardhat run scripts/deployEventProver.js --network khalani | <event-verifier-on-sepolia> 11155111
npx hardhat run scripts/deployEventProver.js --network khalani | <event-verifier-on-fuji> 43113

# On Fuji to Sepolia and Khalani
npx hardhat run scripts/deployEventProver.js --network avalanche | <event-verifier-on-ethereum> 11155111
npx hardhat run scripts/deployEventProver.js --network avalanche | <event-verifier-on-khalani> 1098411886

# On Sepolia to Fuji and Khalani
npx hardhat run scripts/deployEventProver.js --network ethereum | <event-verifier-on-avalanche> 43113
npx hardhat run scripts/deployEventProver.js --network ethereum | <event-verifier-on-khalani> 1098411886
```

### 3. Deploy and register AIPEventPublisher on Khalani and End Chains

Once the EventVerifiers and EventProvers are deployed on the end chains, you can deploy the AIPEventPublisher on Khalani (Hub chain). The AIPEventPublisher will coordinate event dispatching from Khalani to these end chains.

```bash
# On Khalani Network
npx hardhat run scripts/deployAIPEventPublisher.js --network khalani

# On Ethereum
npx hardhat run scripts/deployAIPEventPublisher.js --network ethereum

# On Avalanche
npx hardhat run scripts/deployAIPEventPublisher.js --network avalanche
```

In this deployment, make sure to pass the **EventProver** address (for example, Ethereum’s EventProver) as the default EventProver in the constructor.

In the script, use the **registerEventProver** function to add each **EventProver** that was deployed on other chains.

### 4.Deploy TokenRegistry, AuthorizationManager and MTokenManager

```bash
npx hardhat run scripts/deployTokenManager.js --network khalani
```

### 5. Deploy IntentBook on Khalani

Once the **AIPEventPublisher** is deployed and all **EventProvers** are registered, deploy the IntentBook contract on Khalani. The **AIPEventPublisher** address should be passed to the IntentBook contract during deployment.

```bash
# On Khalani Network
npx hardhat run scripts/deployIntentBook.js --network khalani
```

### 6. Deploy ReceiptManager on Khalani

Once the **IntentBook** and **MTokenManager** are deployed, deploy the ReceiptManager contract on Khalani. The **IntentBook** and **MTokenManager** addresses should be passed to the ReceiptManager contract during deployment.

```bash
# On Khalani Network
npx hardhat run scripts/deployReceiptManager.js --network khalani
```

### 7. Deploy AIPEventPublisher on Khalani and End Chains

Deploy the AIPEventPublisher contract on Khalani and End Chains. The **MTokenManager** address should be passed to the AIPEventPublisher contract during deployment. Next **EventVerifier** should be registered.

```bash
# On Khalani Network
npx hardhat run scripts/deployAIPEventHandler.js --network khalani

# On Ethereum
npx hardhat run scripts/deployAIPEventHandler.js --network ethereum

# On Avalanche
npx hardhat run scripts/deployAIPEventHandler.js --network avalanche
```

### 8. Deploy AssetReserves on End Chains

Deploy the AssetReserves contract on End Chains. The **AIPEventPublisher** and **AIPEventHandler** addresses should be passed to the AssetReserves contract during deployment. Next **AssetReserves** should be set in the AIPEventHandler contract. The final step is add tokens to the **AssetReserves** contract for the current network.

```bash
# On Ethereum
npx hardhat run scripts/deployAssetReserves.js --network ethereum

# On Avalanche
npx hardhat run scripts/deployAssetReserves.js --network avalanche
```
