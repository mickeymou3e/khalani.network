const { ethers, network } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Configuring system with deployer:", deployer.address);

  const cfg = network.config;
  if (!cfg) {
    throw new Error(`No network configuration found for ${network.name}`);
  }

  const aracdiaChainId = config.networks.khalani.chainId;

  // Addresses
  const spokePublisherAddress = cfg.eventPublisher;
  const hubPublisherAddress = cfg.aipEventPublisher;
  const spokeHandlerAddress = cfg.eventHandler;
  const hubHandlerAddress = cfg.aipEventHandler;
  const proverSpokeToHubAddress = cfg.eventProver.holesky;
  const proverHubToSpokeAddress = cfg.eventProver.khalani;

  // Producers
  const assetReservesAddress = cfg.assetReserves;
  const mTokenManagerAddress = cfg.mTokenManager;

  if (!spokePublisherAddress || !hubPublisherAddress) {
    throw new Error(
      "SpokePublisher or HubPublisher address is missing in the configuration."
    );
  }

  if (!spokeHandlerAddress || !hubHandlerAddress) {
    throw new Error(
      "SpokeHandler or HubHandler address is missing in the configuration."
    );
  }

  if (!proverSpokeToHubAddress || !proverHubToSpokeAddress) {
    throw new Error("EventProver addresses are missing in the configuration.");
  }

  if (!assetReservesAddress || !mTokenManagerAddress) {
    throw new Error(
      "Producer addresses (AssetReserves or MTokenManager) are missing."
    );
  }

  console.log("Connecting to contracts...");

  // Attach to contracts
  const SpokePublisher = await ethers.getContractFactory("SpokePublisher");
  const spokePublisher = SpokePublisher.attach(spokePublisherAddress);

  const HubPublisher = await ethers.getContractFactory("HubPublisher");
  const hubPublisher = HubPublisher.attach(hubPublisherAddress);

  const SpokeHandler = await ethers.getContractFactory("SpokeHandler");
  const spokeHandler = SpokeHandler.attach(spokeHandlerAddress);

  const HubHandler = await ethers.getContractFactory("HubHandler");
  const hubHandler = HubHandler.attach(hubHandlerAddress);

  const EventProver = await ethers.getContractFactory("EventProver");
  const proverSpokeToHub = EventProver.attach(proverSpokeToHubAddress);
  const proverHubToSpoke = EventProver.attach(proverHubToSpokeAddress);

  console.log("Registering producers and event types...");

  // Event types for producers
  const reservesEventType = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes("DEPOSIT_EVENT")
  );

  const withdrawalEventType = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(
      "MTokenWithdrawal(address token, uint256 amount, address withdrawer)"
    )
  );

  // ======================
  // Spoke Chain Producers
  // ======================
  // Register AssetReserves as producer for DEPOSIT_EVENT on the Spoke chain
  let tx = await spokePublisher.addProducer(assetReservesAddress);
  await tx.wait();
  console.log("Registered AssetReserves as producer on SpokePublisher.");

  tx = await spokePublisher.registerEventOnProducer(
    assetReservesAddress,
    reservesEventType
  );
  await tx.wait();
  console.log("Registered DEPOSIT_EVENT on SpokePublisher for AssetReserves.");

  // ======================
  // Hub Chain Producers
  // ======================
  // Register MTokenCrossChainAdapter as producer for MTokenWithdrawal on the Hub chain
  tx = await hubPublisher.addProducer(mTokenCrossChainAdapterAddress);
  await tx.wait();
  console.log(
    "Registered MTokenCrossChainAdapter as producer on HubPublisher."
  );

  tx = await hubPublisher.registerEventOnProducer(
    mTokenCrossChainAdapterAddress,
    withdrawalEventType
  );
  await tx.wait();
  console.log(
    "Registered MTokenWithdrawal on HubPublisher for MTokenCrossChainAdapter."
  );

  // =========================
  // EventProver Registrations
  // =========================
  // Register proverSpokeToHub on SpokePublisher for sending events to the hub chain
  tx = await spokePublisher.registerEventProver(
    aracdiaChainId,
    proverSpokeToHubAddress
  );
  await tx.wait();
  console.log("Registered proverSpokeToHub on SpokePublisher.");

  // Register proverHubToSpoke on HubPublisher for sending events to the spoke chain
  tx = await hubPublisher.registerEventProver(
    cfg.spokeChainId,
    proverHubToSpokeAddress
  );
  await tx.wait();
  console.log("Registered proverHubToSpoke on HubPublisher.");

  // ==========================
  // EventProver Authorization
  // ==========================
  // Authorize SpokePublisher as a publisher on proverSpokeToHub
  tx = await proverSpokeToHub.addEventPublisher(spokePublisherAddress);
  await tx.wait();
  console.log(
    "Authorized SpokePublisher as event publisher on proverSpokeToHub."
  );

  // Authorize HubPublisher as a publisher on proverHubToSpoke
  tx = await proverHubToSpoke.addEventPublisher(hubPublisherAddress);
  await tx.wait();
  console.log(
    "Authorized HubPublisher as event publisher on proverHubToSpoke."
  );

  console.log("Registering processors and event types...");

  // ============================
  // Register Processors on Handlers
  // ============================
  tx = await spokeHandler.registerEventProcessor(assetReservesAddress);
  await tx.wait();
  console.log("Registered AssetReserves as processor on SpokeHandler.");

  tx = await hubHandler.registerEventProcessor(mTokenCrossChainAdapterAddress);
  await tx.wait();
  console.log("Registered MTokenCrossChainAdapter as processor on HubHandler.");

  // ============================
  // Register Event Types on Handlers
  // ============================
  // SpokeHandler handles withdrawal events for AssetReserves
  tx = await spokeHandler.registerEventType(
    assetReservesAddress,
    reservesEventType
  );
  await tx.wait();
  console.log(
    "Registered DEPOSIT_EVENT type on SpokeHandler for AssetReserves."
  );

  // HubHandler handles withdrawal events for MTokenCrossChainAdapter
  tx = await hubHandler.registerEventType(
    mTokenCrossChainAdapterAddress,
    withdrawalEventType
  );
  await tx.wait();
  console.log(
    "Registered MTokenWithdrawal type on HubHandler for MTokenCrossChainAdapter."
  );

  console.log("Configuration complete.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during configuration:", error);
    process.exit(1);
  });
