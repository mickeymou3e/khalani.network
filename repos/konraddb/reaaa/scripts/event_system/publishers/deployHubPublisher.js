const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying HubPublisher with the account:", deployer.address);

  // Deploy HubPublisher on this chain
  const HubPublisher = await ethers.getContractFactory("HubPublisher");
  const eventVerifier = await HubPublisher.deploy();

  await eventVerifier.waitForDeployment();

  console.log("HubPublisher deployed at:", eventVerifier.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
