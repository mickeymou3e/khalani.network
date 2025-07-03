const { ethers, network } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const mailbox = network.config.mailboxAddress;
  const interchainGasPaymaster = network.config.interchainGasPaymaster;
  const gasAmountOracle = network.config.gasAmountOracle;

  // Define remote verifier and destinationChainId manually TODO: pull them from configuration
  const remoteVerifier = "0xd478aa347DdE46BE479Ea65F563539D3eB3736Ec"; // Replace with actual verifier address or config
  const destinationChainId = 1098411886; // Replace with actual chain ID

  console.log("Deploying EventProver with the account:", deployer.address);
  console.log(`Deploying with parameters:
    - Mailbox: ${mailbox}
    - Remote Verifier: ${remoteVerifier}
    - Destination Chain ID: ${destinationChainId}
    - IGP: ${interchainGasPaymaster}
    - Gas Amount Oracle: ${gasAmountOracle}
  `);

  // Deploy EventProver on this chain
  const EventProver = await ethers.getContractFactory("EventProver");
  const eventProver = await EventProver.deploy(
    mailbox,
    remoteVerifier,
    destinationChainId,
    interchainGasPaymaster,
    gasAmountOracle
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
