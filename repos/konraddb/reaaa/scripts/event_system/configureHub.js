const { ethers, network } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Configuring Hub Chain with deployer:", deployer.address);

  const cfg = network.config;

  if (
    !cfg ||
    !cfg.eventPublisher ||
    !cfg.eventHandler ||
    !cfg.eventProver.holesky
  ) {
    throw new Error("Hub chain configuration is missing critical parameters.");
  }

  console.log("Connecting to Hub contracts...");

  const HubPublisher = await ethers.getContractFactory("HubPublisher");
  const hubPublisher = HubPublisher.attach(cfg.eventPublisher);

  const HubHandler = await ethers.getContractFactory("HubHandler");
  const hubHandler = HubHandler.attach(cfg.eventHandler);

  const withdrawalEventType = ethers.keccak256(
    ethers.toUtf8Bytes(
      "MTokenWithdrawal(address token, uint256 amount, address withdrawer)"
    )
  );

  // =========================
  // Register Producers
  // =========================
  console.log("Registering MTokenCrossChainAdapter on HubPublisher...");
  let tx = await hubPublisher.addProducer(cfg.mTokenCrossChainAdapter);
  await tx.wait();
  console.log("Registered MTokenManager as producer on HubPublisher.");

  //   console.log("Registering MTokenWithdrawal for MTokenManager...");
  //   tx = await hubPublisher.registerEventOnProducer(
  //     cfg.mTokenManager,
  //     withdrawalEventType
  //   );
  //   await tx.wait();
  //   console.log("Registered MTokenWithdrawal type on HubPublisher.");

  // =========================
  // EventProver Registrations
  // =========================
  console.log("Registering proverHubToSpoke on HubPublisher...");
  tx = await hubPublisher.registerEventProver(
    cfg.chainId,
    cfg.eventProver.holesky
  );
  await tx.wait();
  console.log("Registered proverHubToSpoke on HubPublisher.");

  // =========================
  // EventProver Authorizations
  // =========================
  console.log("Authorizing HubPublisher on proverHubToSpoke...");
  const EventProver = await ethers.getContractFactory(
    "src/event_system/EventProver.sol:EventProver"
  );
  const proverHubToSpoke = EventProver.attach(cfg.eventProver.holesky);

  tx = await proverHubToSpoke.addEventPublisher(cfg.eventPublisher);
  await tx.wait();
  console.log(
    "Authorized HubPublisher as event publisher on proverHubToSpoke."
  );

  // =========================
  // Register Processors on Handlers
  // =========================
  console.log("Registering MTokenManager as processor on HubHandler...");
  tx = await hubHandler.registerEventProcessor(cfg.mTokenManager);
  await tx.wait();
  console.log("Registered MTokenManager as processor on HubHandler.");

  console.log(
    "Registering MTokenWithdrawal on HubHandler for MTokenManager...",
    cfg.mTokenManager
  );
  tx = await hubHandler.registerEventType(
    cfg.mTokenManager,
    withdrawalEventType
  );
  await tx.wait();
  console.log("Registered MTokenWithdrawal type on HubHandler.");

  console.log("Hub Chain configuration completed.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during Hub configuration:", error);
    process.exit(1);
  });
