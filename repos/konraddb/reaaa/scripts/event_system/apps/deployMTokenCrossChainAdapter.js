const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const mTokenManager = network.config.mTokenManager;
  const eventPublisher = network.config.eventPublisher;
  const mTokenRegistry = network.config.mTokenRegistry;

  console.log(
    "Deploying MTokenCrossChainAdapter with the account:",
    deployer.address
  );

  // Deploy MTokenCrossChainAdapter on this chain
  const MTokenCrossChainAdapter = await ethers.getContractFactory(
    "MTokenCrossChainAdapter"
  );
  const eventVerifier = await MTokenCrossChainAdapter.deploy(
    mTokenManager,
    eventPublisher,
    mTokenRegistry
  );

  await eventVerifier.waitForDeployment();

  console.log("MTokenCrossChainAdapter deployed at:", eventVerifier.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
