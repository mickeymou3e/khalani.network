const { ethers, network } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const mailbox = network.config.mailboxAddress;

  if (!mailbox) {
    throw new Error(
      `Mailbox address is not defined for network: ${network.name}`
    );
  }

  console.log("Deploying EventVerifier with the account:", deployer.address);
  console.log(`Deploying with parameters:\n- Mailbox: ${mailbox}`);

  // Deploy EventVerifier on this chain
  const EventVerifier = await ethers.getContractFactory("EventVerifier");
  const eventVerifier = await EventVerifier.deploy(mailbox);

  await eventVerifier.waitForDeployment();

  console.log("EventVerifier deployed at:", eventVerifier.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
