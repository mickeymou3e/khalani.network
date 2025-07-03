const { ethers, network } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying ReceiptManager with the account:", deployer.address);

  // Fetch the IntentBook and MTokenManager addresses from the config for the current network
  const intentBookAddress = network.config.intentBook;
  const mTokenManagerAddress = network.config.mTokenManager;

  if (!intentBookAddress || !mTokenManagerAddress) {
    console.error(
      "IntentBook or MToken Manager address is missing for the current network."
    );
    process.exit(1);
  }

  console.log(`Deploying with the following parameters: 
    - IntentBook: ${intentBookAddress}
    - MTokenManager: ${mTokenManagerAddress}
  `);

  // Deploy ReceiptManager with the IntentBook and MTokenManager addresses as arguments
  const ReceiptManager = await ethers.getContractFactory("ReceiptManager");
  const receiptManager = await ReceiptManager.deploy(
    intentBookAddress,
    mTokenManagerAddress
  );
  await receiptManager.waitForDeployment();

  console.log("ReceiptManager deployed at:", receiptManager.target);

  // Set the ReceiptManager in the IntentBook and MTokenManager
  const IntentBook = await ethers.getContractAt(
    "IntentBook",
    intentBookAddress
  );
  const MTokenManager = await ethers.getContractAt(
    "MTokenManager",
    mTokenManagerAddress
  );

  console.log("Setting ReceiptManager in IntentBook...");
  await IntentBook.setReceiptManager(receiptManager.target);
  console.log("ReceiptManager address set in IntentBook");

  console.log("Setting ReceiptManager in MTokenManager...");
  await MTokenManager.setReceiptManager(receiptManager.target);
  console.log("ReceiptManager address set in MTokenManager");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
