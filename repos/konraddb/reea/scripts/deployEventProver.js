const { ethers, network } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const mailbox = network.config.mailboxAddress;
  const interchainGasPaymaster = network.config.interchainGasPaymaster;

  // Define remote verifier and destinationChainId manually TODO: pull them from configuration
  const remoteVerifier = "0x77FdC0cF50232E5BDf7A000003c1cAaff769Fea5"; // Replace with actual verifier address or config
  const destinationChainId = 17000; // Replace with actual chain ID

  console.log("Deploying EventProver with the account:", deployer.address);
  console.log(`Deploying with parameters:
    - Mailbox: ${mailbox}
    - Remote Verifier: ${remoteVerifier}
    - Destination Chain ID: ${destinationChainId}
    - IGP: ${interchainGasPaymaster}
  `);

  // Deploy EventProver on this chain
  const EventProver = await ethers.getContractFactory("EventProver");
  const eventProver = await EventProver.deploy(
    mailbox,
    remoteVerifier,
    destinationChainId,
    interchainGasPaymaster
  );

  await eventProver.waitForDeployment();

  console.log("EventProver deployed at:", eventProver.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
