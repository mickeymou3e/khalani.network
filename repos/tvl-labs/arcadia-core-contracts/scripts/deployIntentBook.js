const { ethers, network } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Fetch the AIP Event Publisher and MTokenManager addresses from the config for the current network
  const aipEventPublisherAddress = network.config.aipEventPublisher;
  const mTokenManagerAddress = network.config.mTokenManager;

  if (!aipEventPublisherAddress || !mTokenManagerAddress) {
    console.error(
      "AIP Event Publisher or MToken Manager address is missing for the current network."
    );
    process.exit(1);
  }

  console.log(`Deploying with the following parameters: 
    - AIP Event Publisher: ${aipEventPublisherAddress}
    - MToken Manager: ${mTokenManagerAddress}
  `);

  // Deploy libraries
  console.log("Deploying SolutionLib...");
  const SolutionLibFactory = await ethers.getContractFactory("SolutionLib");
  const solutionLib = await SolutionLibFactory.deploy();
  await solutionLib.waitForDeployment();
  console.log("SolutionLib deployed at:", solutionLib.target);

  console.log("Deploying ReceiptLib...");
  const ReceiptLibFactory = await ethers.getContractFactory("ReceiptLib");
  const receiptLib = await ReceiptLibFactory.deploy();
  await receiptLib.waitForDeployment();
  console.log("ReceiptLib deployed at:", receiptLib.target);

  // Deploy IntentBook with the AIPEventPublisher address
  const IntentBook = await ethers.getContractFactory("IntentBook", {
    libraries: {
      SolutionLib: solutionLib.target,
      ReceiptLib: receiptLib.target,
    },
  });
  const intentBook = await IntentBook.deploy(aipEventPublisherAddress, {});
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

  // Set MTokenManager in Intentbook
  console.log("Setting MTokenManager in Intentbook...");
  await intentBook.setTokenManager(mTokenManagerAddress);
  console.log("Intentbook is now linked to MTokenManager.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
