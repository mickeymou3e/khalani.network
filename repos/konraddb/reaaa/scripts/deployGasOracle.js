const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying GasAmountOracle with the account:", deployer.address);

  // Deploy EventProver on this chain
  const EventProver = await ethers.getContractFactory("GasAmountOracle");
  const eventProver = await EventProver.deploy();

  await eventProver.waitForDeployment();

  console.log("GasAmountOracle deployed at:", eventProver.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
