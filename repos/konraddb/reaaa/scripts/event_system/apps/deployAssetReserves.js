const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const eventPublisher = network.config.eventPublisher;
  const eventHandler = network.config.eventHandler;
  const permit2 = network.config.permit2;
  const hubHandler = config.networks.khalani.eventHandler;

  console.log("Deploying AssetReserves with the account:", deployer.address);

  // Deploy AssetReserves on this chain
  const AssetReserves = await ethers.getContractFactory(
    "src/event_system/apps/bridge/AssetReserves.sol:AssetReserves"
  );
  const assetReserves = await AssetReserves.deploy(
    deployer.address,
    eventPublisher,
    eventHandler,
    permit2,
    hubHandler
  );

  await assetReserves.waitForDeployment();

  console.log("AssetReserves deployed at:", assetReserves.target);

  const tokens = network.config.tokens || {};
  for (const [tokenName, tokenAddress] of Object.entries(tokens)) {
    console.log(
      `Adding token ${tokenName} (${tokenAddress}) to AssetReserves...`
    );
    const tx = await assetReserves.addAsset(tokenAddress);
    await tx.wait();
    console.log(`Token ${tokenName} added successfully.`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
