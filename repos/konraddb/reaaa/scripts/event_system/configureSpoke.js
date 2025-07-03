// scripts/registerEvents.js

const { ethers, network } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Configuring Spoke Chain with deployer:", deployer.address);

  const cfg = network.config;

  if (
    !cfg ||
    !cfg.eventPublisher ||
    !cfg.eventHandler ||
    !cfg.eventProver ||
    !cfg.eventProver.khalani
  ) {
    throw new Error(
      "Spoke chain configuration is missing critical parameters."
    );
  }

  console.log("Connecting to Spoke contracts...");

  const SpokePublisher = await ethers.getContractFactory("SpokePublisher");
  const spokePublisher = SpokePublisher.attach(cfg.eventPublisher);

  const SpokeHandler = await ethers.getContractFactory("SpokeHandler");
  const spokeHandler = SpokeHandler.attach(cfg.eventHandler);

  // Poprawne obliczanie typów zdarzeń
  const reservesEventType = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["address", "bytes32"],
      [
        cfg.assetReserves,
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes("DEPOSIT_EVENT")),
      ]
    )
  );

  // =========================
  // Register Producers
  // =========================
  console.log("Registering AssetReserves on SpokePublisher...");
  let tx = await spokePublisher.addProducer(cfg.assetReserves);
  await tx.wait();
  console.log("Registered AssetReserves as producer on SpokePublisher.");

  console.log("Registering DEPOSIT_EVENT type on SpokePublisher...");
  tx = await spokePublisher.registerEventOnProducer(
    cfg.assetReserves,
    reservesEventType
  );
  await tx.wait();
  console.log("Registered DEPOSIT_EVENT type on SpokePublisher.");

  // =========================
  // EventProver Registrations
  // =========================
  console.log("Registering proverSpokeToHub on SpokePublisher...");
  tx = await spokePublisher.registerEventProver(
    cfg.chainId,
    cfg.eventProver.khalani
  );
  await tx.wait();
  console.log("Registered proverSpokeToHub on SpokePublisher.");

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
  console.log("Authorized SpokePublisher as event publisher on EventProver.");

  // =========================
  // Register Processors on Handlers
  // =========================
  console.log(
    "Registering MTokenCrossChainAdapter as processor on SpokeHandler..."
  );
  tx = await spokeHandler.registerEventProcessor(cfg.mTokenCrossChainAdapter);
  await tx.wait();
  console.log(
    "Registered MTokenCrossChainAdapter as processor on SpokeHandler."
  );

  console.log("Registering DEPOSIT_EVENT on SpokeHandler for AssetReserves...");
  tx = await spokeHandler.registerEventType(
    cfg.mTokenCrossChainAdapter,
    reservesEventType
  );
  await tx.wait();
  console.log("Registered DEPOSIT_EVENT type on SpokeHandler.");

  console.log("Spoke Chain configuration completed.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during Spoke configuration:", error);
    process.exit(1);
  });
