const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const MockMailbox = await ethers.getContractFactory("MockMailbox");
  const localDomain = 1098411886;
  const mockMailbox = await MockMailbox.deploy(localDomain);
  await mockMailbox.waitForDeployment();
  const mockMailboxAddress = await mockMailbox.getAddress();
  console.log("MockMailbox deployed to:", mockMailboxAddress);

  const EventVerifier = await ethers.getContractFactory("EventVerifier");
  const eventVerifier = await EventVerifier.deploy(mockMailboxAddress);
  await eventVerifier.waitForDeployment();
  const eventVerifierAddress = await eventVerifier.getAddress();
  console.log("EventVerifier deployed to:", eventVerifierAddress);
  const tx = await mockMailbox.setEventVerifier(eventVerifierAddress);
  await tx.wait();
  console.log("MockMailbox updated with EventVerifier address.");

  const originDomain = 17000; // Example origin domain
  const senderAddress = deployer.address;
  const senderBytes32 = ethers.zeroPadValue(senderAddress, 32);

  const depositEvent = {
    token: "0x4722ce3A7195dEe57CeC78eDf5Ac9c542fbc4626",
    amount: ethers.parseUnits("10", 18),
    depositor: deployer.address,
  };

  const depositEventEncoded = ethers.AbiCoder.defaultAbiCoder().encode(
    ["address", "uint256", "address"],
    [depositEvent.token, depositEvent.amount, depositEvent.depositor]
  );

  const nonce = 1;
  const eventData = ethers.AbiCoder.defaultAbiCoder().encode(
    ["bytes", "uint256"],
    [depositEventEncoded, nonce]
  );

  const DEPOSIT_EVENT = ethers.keccak256(
    ethers.toUtf8Bytes("AssetReserveDeposit")
  );

  const xChainEventTypes = ["address", "uint256", "bytes32", "bytes"];
  const xChainEventValues = [
    deployer.address,
    originDomain,
    DEPOSIT_EVENT,
    eventData,
  ];

  const messageBody = ethers.AbiCoder.defaultAbiCoder().encode(
    xChainEventTypes,
    xChainEventValues
  );

  try {
    console.log("Verifying dispatchMessage call...");

    await mockMailbox.callStatic.dispatchMessage(
      originDomain,
      senderBytes32,
      messageBody
    );

    console.log("dispatchMessage call succeeded.");
  } catch (error) {
    console.error("dispatchMessage call failed:", error.message);
    if (error.data) {
      console.error("Error data:", error.data);
    }
    if (error.reason) {
      console.error("Revert reason:", error.reason);
    }
    throw new Error(
      "Function call verification failed. Please fix the issues before proceeding."
    );
  }

  try {
    console.log("Estimating Gas...");
    const estimatedGas = await mockMailbox.estimateGas.dispatchMessage(
      originDomain,
      senderBytes32,
      messageBody
    );
    console.log(
      "Estimated Gas for dispatchMessage -> handle:",
      estimatedGas.toString()
    );
  } catch (error) {
    console.error("Error estimating gas:", error.message);
    if (error.data) {
      console.error("Error data:", error.data);
    }
    if (error.reason) {
      console.error("Revert reason:", error.reason);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error.message);
    process.exit(1);
  });
