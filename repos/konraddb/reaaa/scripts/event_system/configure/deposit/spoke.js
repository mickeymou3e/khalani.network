const { ethers, network } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Configuring Spoke Chain with deployer: ${deployer.address}`);

  const cfg = network.config;

  // Connect to SpokePublisher contract
  const SpokePublisher = await ethers.getContractFactory("SpokePublisher");
  const spokePublisher = SpokePublisher.attach(cfg.eventPublisher);

  // Calculate DEPOSIT_EVENT type hash
  const depositEventType =
    "0xa9aadfb3174f3e4169a1420fd724f12d588298c0c9812d43c25077cfe5605315";

  // =========================
  // Register Producers
  // =========================
  console.log("Registering AssetReserves as producer on SpokePublisher...");
  let tx = await spokePublisher.addProducer(cfg.assetReserves);
  await tx.wait();
  console.log("AssetReserves registered as producer on SpokePublisher.");

  console.log("Registering DEPOSIT_EVENT type on SpokePublisher...");
  tx = await spokePublisher.registerEventOnProducer(
    cfg.assetReserves,
    depositEventType
  );
  await tx.wait();
  console.log("DEPOSIT_EVENT type registered on SpokePublisher.");

  // =========================
  // EventProver Registrations
  // =========================
  console.log("Registering EventProver on SpokePublisher...");
  // tx = await spokePublisher.unregisterEventProver(cfg.eventProver.khalani);
  // await tx.wait();
  tx = await spokePublisher.registerEventProver(
    config.networks.khalani.chainId,
    cfg.eventProver.khalani
  );
  await tx.wait();
  console.log("EventProver registered on SpokePublisher.");

  // =========================
  // Authorize SpokePublisher as Event Publisher on EventProver
  // =========================
  console.log("Authorizing SpokePublisher on EventProver...");
  const EventProver = await ethers.getContractFactory(
    "src/event_system/EventProver.sol:EventProver"
  );
  const proverSpokeToHub = EventProver.attach(cfg.eventProver.khalani);

  tx = await proverSpokeToHub.addEventPublisher(cfg.eventPublisher);
  await tx.wait();
  console.log("SpokePublisher authorized as event publisher on EventProver.");

  console.log("--- Spoke Chain Configuration Completed ---");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during spoke chain configuration:", error);
    process.exit(1);
  });
