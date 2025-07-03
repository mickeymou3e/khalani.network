const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const hubHandler = config.networks.khalani.eventHandler;
  const hubChainId = config.networks.khalani.chainId;

  console.log("Deploying SpokePublisher with the account:", deployer.address);

  // Deploy SpokePublisher on this chain
  const SpokePublisher = await ethers.getContractFactory("SpokePublisher");
  const spokePublisher = await SpokePublisher.deploy(hubHandler, hubChainId);

  await spokePublisher.waitForDeployment();

  console.log("SpokePublisher deployed at:", spokePublisher.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
