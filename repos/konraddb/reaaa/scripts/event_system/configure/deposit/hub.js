const { ethers, network } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(
    "Configuring Hub Chain (Khalani) with deployer:",
    deployer.address
  );

  const cfg = network.config;

  // Connect to HubHandler
  const HubHandler = await ethers.getContractFactory("HubHandler");
  const hubHandler = HubHandler.attach(cfg.eventHandler);

  // Register EventVerifier (if not already registered)
  console.log("Registering EventVerifier on HubHandler...");
  const eventVerifierAddress = cfg.eventVerifier;
  let tx = await hubHandler.registerEventVerifier(eventVerifierAddress);
  await tx.wait();
  console.log("EventVerifier registered on HubHandler.");

  // Register DEPOSIT_EVENT type
  const depositEventType =
    "0xa9aadfb3174f3e4169a1420fd724f12d588298c0c9812d43c25077cfe5605315";
  console.log(`Registering DEPOSIT_EVENT type`);
  tx = await hubHandler.registerEventType(
    cfg.mTokenCrossChainAdapter,
    depositEventType
  );
  await tx.wait();
  console.log(`DEPOSIT_EVENT type registered`);

  // Register MTokenCrossChainAdapter as Processor
  console.log(
    "Registering MTokenCrossChainAdapter as processor on HubHandler..."
  );
  tx = await hubHandler.registerEventProcessor(cfg.mTokenCrossChainAdapter);
  await tx.wait();
  console.log("MTokenCrossChainAdapter registered as processor on HubHandler.");

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

  console.log("Hub Chain (Khalani) configuration completed.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during hub chain configuration:", error);
    process.exit(1);
  });
