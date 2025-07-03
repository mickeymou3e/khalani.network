const { ethers, network } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const aipEventPublisherAddress = network.config.aipEventPublisher;
  const eventHandlerAddress = network.config.aipEventHandler;
  const permit2Address = network.config.permit2;

  if (!aipEventPublisherAddress || !eventHandlerAddress) {
    console.error(
      "AIP Event Publisher or Event Handler address is missing for the current network."
    );
    process.exit(1);
  }

  console.log(`Deploying with the following parameters: 
    - AIP Event Publisher: ${aipEventPublisherAddress}
    - Event Handler: ${eventHandlerAddress}
    - Permit2: ${permit2Address}
  `);

  // Deploy the AssetReserves contract
  console.log("Deploying AssetReserves...");
  const AssetReserves = await ethers.getContractFactory(
    "src/event_system/apps/bridge/AssetReserves.sol:AssetReserves"
  );
  const assetReserves = AssetReserves.attach(network.config.assetReserves);
  // const assetReserves = await AssetReserves.deploy(
  //   deployer.address,
  //   aipEventPublisherAddress,
  //   eventHandlerAddress,
  //   permit2Address
  // );
  // await assetReserves.waitForDeployment();

  // const assetReservesAddress = await assetReserves.getAddress();
  // console.log("AssetReserves deployed at:", assetReservesAddress);

  // console.log(
  //   `Setting AssetReserves in AIPEventHandler at: ${eventHandlerAddress}`
  // );
  // const AIPEventHandler = await ethers.getContractAt(
  //   "AIPEventHandler",
  //   eventHandlerAddress
  // );
  // const txSetAssetReserves = await AIPEventHandler.setAssetReserves(
  //   assetReservesAddress
  // );
  // await txSetAssetReserves.wait();
  // console.log("AssetReserves set in AIPEventHandler successfully.");

  const tokens = network.config.tokens || {};
  for (const [tokenName, tokenAddress] of Object.entries(tokens)) {
    console.log(
      `Adding token ${tokenName} (${tokenAddress}) to AssetReserves...`
    );
    const tx = await assetReserves.addAsset(tokenAddress);
    await tx.wait();
    console.log(`Token ${tokenName} added successfully.`);
  }

  console.log("Deployment and setup of AssetReserves completed.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
