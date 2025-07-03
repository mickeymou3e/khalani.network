const { ethers, network } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Configuring Hub Chain with deployer: ${deployer.address}`);

  const cfg = network.config;

  // On hub chain, register this adapter as event producer with the hub publisher

  // Connect to HubPublisher contract
  const HubPublisher = await ethers.getContractFactory("HubPublisher");
  const hubPublisher = HubPublisher.attach(cfg.eventPublisher);

  // Calculate DEPOSIT_EVENT type hash
  //TO-DO: change this
  const withdrawalEventType =
    "0x6296643a3091cfe7a4da33c118130fc4f341a6ea0a0a05d2dd5c69f80c911f78";

  // =========================
  // Register Producers
  // =========================
  console.log(
    "Registering MTokenCrossChainAdapter as producer on HubPublisher..."
  );
  let tx = await hubPublisher.addProducer(cfg.mTokenCrossChainAdapter);
  await tx.wait();
  console.log(
    "MTokenCrossChainAdapter registered as producer on HubPublisher."
  );

  console.log("Registering Withdrawal Event type on HubPublisher...");
  tx = await hubPublisher.registerEventOnProducer(
    cfg.mTokenCrossChainAdapter,
    withdrawalEventType
  );
  await tx.wait();
  console.log("Withdrawal Event type registered on HubPublisher.");

  // =========================
  // EventProver Registrations
  // =========================
  console.log("Registering EventProver on HubPublisher...");
  // tx = await hubPublisher.unregisterEventProver(cfg.eventProver.khalani);
  // await tx.wait();
  tx = await hubPublisher.registerEventProver(
    config.networks.holesky.chainId,
    cfg.eventProver.holesky
  );
  await tx.wait();
  console.log(
    `EventProver (to ${config.networks.holesky.chainId}) registered on HubPublisher.`
  );
  tx = await hubPublisher.registerEventProver(
    config.networks.avalanche.chainId,
    cfg.eventProver.avalanche
  );
  await tx.wait();
  console.log(
    `EventProver (to ${config.networks.avalanche.chainId}) registered on HubPublisher.`
  );

  // =========================
  // Authorize HubPublisher as Event Publisher on EventProver
  // =========================
  console.log("Authorizing HubPublisher on EventProver...");
  const EventProver = await ethers.getContractFactory(
    "src/event_system/EventProver.sol:EventProver"
  );
  const proverHubToHolesky = EventProver.attach(cfg.eventProver.holesky);
  const proverHubToAvalanche = EventProver.attach(cfg.eventProver.avalanche);

  tx = await proverHubToHolesky.addEventPublisher(cfg.eventPublisher);
  await tx.wait();
  console.log(
    `HubPublisher authorized as event publisher on EventProver (to holesky).`
  );
  tx = await proverHubToAvalanche.addEventPublisher(cfg.eventPublisher);
  await tx.wait();
  console.log(
    `HubPublisher authorized as event publisher on EventProver (to avalanche).`
  );

  // Add MTokenCrossChainAdapter as authorized minter to mTokenManager
  const MTokenManager = await ethers.getContractFactory("MTokenManager");
  const mTokenManager = MTokenManager.attach(cfg.mTokenManager);
  tx = await mTokenManager.addAuthorizedMinter(cfg.mTokenCrossChainAdapter);
  await tx.wait();
  console.log(`Authorized minter added: ${cfg.mTokenCrossChainAdapter}`);
  const isAuthorizedMinter = await mTokenManager.isAuthorizedMinter(
    cfg.mTokenCrossChainAdapter
  );
  console.log(
    `Checking if ${cfg.mTokenCrossChainAdapter} is authorized minter`,
    isAuthorizedMinter
  );

  // Add Deployer Address as authorized locker to mTokenManager
  tx = await mTokenManager.addAuthorizedLocker(deployer.address);
  await tx.wait();
  console.log(`Authorized locker added: ${deployer.address}`);

  //Set Withdrawal Handler
  console.log("Setting withdrawal handler");
  tx = await mTokenManager.setWithdrawalHandler(
    network.config.mTokenCrossChainAdapter
  );
  await tx.wait();
  console.log("Withdrawal handler set");

  console.log("--- Hub Configuration Completed ---");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during hub chain configuration:", error);
    process.exit(1);
  });
