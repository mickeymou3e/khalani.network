const { ethers, network } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const mailbox = network.config.mailboxAddress;
  const eventHandler = network.config.eventHandler;

  if (!mailbox) {
    throw new Error(
      `Mailbox address is not defined for network: ${network.name}`
    );
  }

  if (!eventHandler) {
    throw new Error(
      `Event Handler address is not defined for network: ${network.name}`
    );
  }

  console.log("Deploying EventVerifier with the account:", deployer.address);
  console.log(
    `Deploying with parameters:\n- Mailbox: ${mailbox}\n- EventHandler: ${eventHandler}`
  );

  const EventVerifier = await ethers.getContractFactory(
    "src/event_system/EventVerifier.sol:EventVerifier"
  );
  const eventVerifier = await EventVerifier.deploy(mailbox, eventHandler);

  await eventVerifier.waitForDeployment();

  console.log("EventVerifier deployed at:", eventVerifier.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
