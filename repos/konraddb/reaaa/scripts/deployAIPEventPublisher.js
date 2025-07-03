const { ethers, network } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying AIPEventPublisher with the account:",
    deployer.address
  );

  // Define the event provers for each network
  const eventProversConfig = {
    holesky: {
      defaultProver: network.config.eventProver.khalani,
      eventProvers: [
        {
          chainId: 1098411886,
          proverAddress: network.config.eventProver.khalani,
        },
        { chainId: 43113, proverAddress: network.config.eventProver.avalanche },
      ],
    },
    khalani: {
      defaultProver: network.config.eventProver.holesky,
      eventProvers: [
        {
          chainId: 17000,
          proverAddress: network.config.eventProver.holesky,
        },
        { chainId: 43113, proverAddress: network.config.eventProver.avalanche },
      ],
    },
    avalanche: {
      defaultProver: network.config.eventProver.khalani,
      eventProvers: [
        {
          chainId: 17000,
          proverAddress: network.config.eventProver.holesky,
        },
        {
          chainId: 1098411886,
          proverAddress: network.config.eventProver.khalani,
        },
      ],
    },
  };

  const networkName = network.name;
  if (!eventProversConfig[networkName]) {
    console.error(
      "Invalid network. Please choose from khalani, ethereum, or avalanche."
    );
    process.exit(1);
  }

  const defaultEventProver = eventProversConfig[networkName].defaultProver;
  const eventProvers = eventProversConfig[networkName].eventProvers;

  // Deploy AIPEventPublisher with the default EventProver
  const AIPEventPublisher = await ethers.getContractFactory(
    "AIPEventPublisher"
  );
  const aipEventPublisher = await AIPEventPublisher.deploy(defaultEventProver);
  await aipEventPublisher.waitForDeployment();

  console.log(
    `AIPEventPublisher deployed on ${networkName} at:`,
    aipEventPublisher.target
  );

  // Register EventProvers for other chains
  for (const { chainId, proverAddress } of eventProvers) {
    await aipEventPublisher.registerEventProver(chainId, proverAddress);
    console.log(
      `Registered EventProver for chainId ${chainId} on ${networkName}`
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
