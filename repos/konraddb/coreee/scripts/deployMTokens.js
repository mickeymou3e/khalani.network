const { ethers, network, config } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const mTokenRegistryAddress = network.config.mTokenRegistry;
  const avalancheConfig = config.networks.avalanche;
  const avalancheTokens = avalancheConfig.tokens;
  const ethereumConfig = config.networks.ethereum;
  const ethereumTokens = ethereumConfig.tokens;
  const holeskyConfig = config.networks.holesky;
  const holeskyTokens = holeskyConfig.tokens;

  if (
    !mTokenRegistryAddress ||
    !avalancheTokens ||
    !ethereumTokens ||
    !holeskyTokens
  ) {
    console.error(
      "MToken Registry address or token configuration is missing for the current network."
    );
    process.exit(1);
  }

  console.log(`Deploying MTokens on Khalani with the following parameters:
    - MToken Registry: ${mTokenRegistryAddress}
    - Avalanche Tokens: ${JSON.stringify(avalancheTokens, null, 2)}
    - Ethereum Tokens: ${JSON.stringify(ethereumTokens, null, 2)}
    - Holesky Tokens: ${JSON.stringify(holeskyTokens, null, 2)}
  `);

  const MTOKEN_DETAILS = {
    USDC: { name: "MToken USDC", symbol: "MUSDC" },
    USDT: { name: "MToken USDT", symbol: "MUSDT" },
    DAI: { name: "MToken DAI", symbol: "MDAI" },
    WETH: { name: "MToken WETH", symbol: "MWETH" },
  };

  const MTokenRegistry = await ethers.getContractAt(
    "MTokenRegistry",
    mTokenRegistryAddress
  );

  const avalancheChainId = 43113;
  const ethereumChainId = 11155111;
  const holeskyChainId = 17000;

  // Deploy MTokens for Avalanche tokens
  for (const [tokenSymbol, spokeTokenAddress] of Object.entries(
    avalancheTokens
  )) {
    const { name, symbol } = MTOKEN_DETAILS[tokenSymbol];

    if (!spokeTokenAddress || spokeTokenAddress === "0x") {
      console.log(
        `Skipping ${tokenSymbol} on Avalanche as no valid spoke token address is provided.`
      );
      continue;
    }

    console.log(
      `Deploying MToken for ${tokenSymbol} (${name}) on Avalanche...`
    );

    console.log(`Create mToken function payload:`, {
      name,
      symbol,
      spokeTokenAddress,
      chainId: avalancheChainId,
    });

    const tx = await MTokenRegistry.createMToken(
      name,
      symbol,
      spokeTokenAddress,
      avalancheChainId
    );

    console.log(`Transaction sent for ${tokenSymbol} on Avalanche: ${tx.hash}`);
    const receipt = await tx.wait();

    // Access the logs from the transaction receipt
    const eventLogs = await MTokenRegistry.queryFilter(
      MTokenRegistry.filters.MTokenCreated(),
      receipt.blockNumber,
      receipt.blockNumber
    );

    if (eventLogs.length > 0) {
      const deployedTokenAddress = eventLogs[0].args.mToken;
      console.log(
        `${tokenSymbol} MToken deployed at address: ${deployedTokenAddress} on Khalani (using Avalanche spoke token).`
      );

      // Call getMTokenInfo function to check the deployed MToken information
      const mTokenInfo = await MTokenRegistry.getMTokenInfo(
        deployedTokenAddress
      );
      console.log(`MToken Info for ${tokenSymbol} on Khalani: `, mTokenInfo);
    } else {
      console.log(`No MTokenCreated event found for ${tokenSymbol}.`);
    }
  }

  // Deploy MTokens for Holesky tokens
  for (const [tokenSymbol, spokeTokenAddress] of Object.entries(
    holeskyTokens
  )) {
    const { name, symbol } = MTOKEN_DETAILS[tokenSymbol];

    if (!spokeTokenAddress || spokeTokenAddress === "0x") {
      console.log(
        `Skipping ${tokenSymbol} on Holesky as no valid spoke token address is provided.`
      );
      continue;
    }

    console.log(`Deploying MToken for ${tokenSymbol} (${name}) on Ethereum...`);

    console.log(`Create mToken function payload:`, {
      name,
      symbol,
      spokeTokenAddress,
      chainId: holeskyChainId,
    });

    // Interact with the MTokenRegistry's createMToken function
    const tx = await MTokenRegistry.createMToken(
      name,
      symbol,
      spokeTokenAddress,
      holeskyChainId
    );

    console.log(`Transaction sent for ${tokenSymbol} on Ethereum: ${tx.hash}`);
    const receipt = await tx.wait();

    // Query the event logs for Ethereum
    const eventLogs = await MTokenRegistry.queryFilter(
      MTokenRegistry.filters.MTokenCreated(),
      receipt.blockNumber,
      receipt.blockNumber
    );

    if (eventLogs.length > 0) {
      const deployedTokenAddress = eventLogs[0].args.mToken;
      console.log(
        `${tokenSymbol} MToken deployed at address: ${deployedTokenAddress} on Khalani (using Holesky spoke token).`
      );
    } else {
      console.log(`No MTokenCreated event found for ${tokenSymbol}.`);
    }
  }

  // Deploy MTokens for Ethereum tokens
  // for (const [tokenSymbol, spokeTokenAddress] of Object.entries(
  //   ethereumTokens
  // )) {
  //   const { name, symbol } = MTOKEN_DETAILS[tokenSymbol];

  //   if (!spokeTokenAddress || spokeTokenAddress === "0x") {
  //     console.log(
  //       `Skipping ${tokenSymbol} on Ethereum as no valid spoke token address is provided.`
  //     );
  //     continue;
  //   }

  //   console.log(`Deploying MToken for ${tokenSymbol} (${name}) on Ethereum...`);

  //   console.log(`Create mToken function payload:`, {
  //     name,
  //     symbol,
  //     spokeTokenAddress,
  //     chainId: ethereumChainId,
  //   });

  //   // Interact with the MTokenRegistry's createMToken function
  //   const tx = await MTokenRegistry.createMToken(
  //     name,
  //     symbol,
  //     spokeTokenAddress,
  //     ethereumChainId
  //   );

  //   console.log(`Transaction sent for ${tokenSymbol} on Ethereum: ${tx.hash}`);
  //   const receipt = await tx.wait();

  //   // Query the event logs for Ethereum
  //   const eventLogs = await MTokenRegistry.queryFilter(
  //     MTokenRegistry.filters.MTokenCreated(),
  //     receipt.blockNumber,
  //     receipt.blockNumber
  //   );

  //   if (eventLogs.length > 0) {
  //     const deployedTokenAddress = eventLogs[0].args.mToken;
  //     console.log(
  //       `${tokenSymbol} MToken deployed at address: ${deployedTokenAddress} on Khalani (using Ethereum spoke token).`
  //     );
  //   } else {
  //     console.log(`No MTokenCreated event found for ${tokenSymbol}.`);
  //   }
  // }

  console.log("All MTokens deployed successfully.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
