const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying HubHandler with the account:", deployer.address);

  // Deploy HubHandler on this chain
  const HubHandler = await ethers.getContractFactory("HubHandler");
  const hubHandler = await HubHandler.deploy();

  await hubHandler.waitForDeployment();

  console.log("HubHandler deployed at:", hubHandler.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
