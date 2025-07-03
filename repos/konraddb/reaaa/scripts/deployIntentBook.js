const { ethers, network } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Fetch the AIP Event Publisher and MTokenManager addresses from the config for the current network
  const mTokenManagerAddress = network.config.mTokenManager;
  const medusaDeployerAddress = network.config.medusaDeployer;

  if (!mTokenManagerAddress) {
    console.error(
      "AIP Event Publisher or MToken Manager address is missing for the current network."
    );
    process.exit(1);
  }

  console.log(`Deploying with the following parameters: 
    - MToken Manager: ${mTokenManagerAddress}
  `);

  console.log("Deploying IntentLib...");
  const IntentLibFactory = await ethers.getContractFactory("IntentLib");
  const intentLib = await IntentLibFactory.deploy();
  await intentLib.waitForDeployment();
  console.log("IntentLib deployed at:", intentLib.target);

  console.log("Deploying SolutionLib...");
  const SolutionLibFactory = await ethers.getContractFactory("SolutionLib", {
    libraries: {
      IntentLib: intentLib.target,
    },
  });
  const solutionLib = await SolutionLibFactory.deploy();
  await solutionLib.waitForDeployment();
  console.log("SolutionLib deployed at:", solutionLib.target);

  // Deploy IntentBook with the AIPEventPublisher address
  const IntentBook = await ethers.getContractFactory("IntentBook");
  const intentBook = await IntentBook.deploy(solutionLib.target);
  await intentBook.waitForDeployment();
  console.log("IntentBook deployed at:", intentBook.target);

  // Set IntentBook in MTokenManager
  const MTokenManager = await ethers.getContractAt(
    "MTokenManager",
    mTokenManagerAddress
  );
  console.log("Setting IntentBook in MTokenManager...");
  await MTokenManager.setIntentBook(intentBook.target);
  console.log("MTokenManager is now linked to IntentBook.");
  console.log("Adding authoried minter in MTokenManager...");
  await MTokenManager.addAuthorizedMinter(intentBook.target);
  console.log("Authorized minter added.");

  // Set MTokenManager in Intentbook
  console.log("Setting MTokenManager in Intentbook...");
  await intentBook.setTokenManager(mTokenManagerAddress);
  console.log("Intentbook is now linked to MTokenManager.");

  // Call addPublisher in IntentBook
  console.log("Adding medusa deployer to IntentBook...");
  await intentBook.addPublisher(medusaDeployerAddress);
  console.log(
    `Medusa deployer (${medusaDeployerAddress}) added to IntentBook.`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
