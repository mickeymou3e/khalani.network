const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying SpokeHandler with the account:", deployer.address);

  // Deploy SpokeHandler on this chain
  const SpokeHandler = await ethers.getContractFactory("SpokeHandler");
  const spokeHandler = await SpokeHandler.deploy();

  await spokeHandler.waitForDeployment();

  console.log("SpokeHandler deployed at:", spokeHandler.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
