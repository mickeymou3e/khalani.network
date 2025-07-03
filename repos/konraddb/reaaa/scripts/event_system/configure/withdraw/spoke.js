const { ethers, network } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(
    "Configuring Spoke Chain (Khalani) with deployer:",
    deployer.address
  );

  const cfg = network.config;

  // On spoke chain, register asset reserves as an eventProcessor with the spoke chain EventHandler

  // Connect to SpokeHandler
  const SpokeHandler = await ethers.getContractFactory("SpokeHandler");
  const spokeHandler = SpokeHandler.attach(cfg.eventHandler);

  // Register EventVerifier (if not already registered)
  console.log("Registering EventVerifier on SpokeHandler...");
  const eventVerifierAddress = cfg.eventVerifier;
  let tx = await spokeHandler.registerEventVerifier(eventVerifierAddress);
  await tx.wait();
  console.log("EventVerifier registered on SpokeHandler.");

  // Register Withdrawal Event for spoke
  const withdrawalEventType =
    "0x6296643a3091cfe7a4da33c118130fc4f341a6ea0a0a05d2dd5c69f80c911f78";
  console.log(`Registering Withdrawal Event`);
  tx = await spokeHandler.registerEventType(
    cfg.assetReserves,
    withdrawalEventType
  );
  await tx.wait();
  console.log(`Withdrawal Event registered`);

  // Register AssetReserves as Processor
  console.log("Registering AssetReserves as processor on SpokeHandler...");
  tx = await spokeHandler.registerEventProcessor(cfg.assetReserves);
  await tx.wait();
  console.log("AssetReserves registered as processor on SpokeHandler.");

  console.log("Spoke chain configuration completed.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during spoke chain configuration:", error);
    process.exit(1);
  });
