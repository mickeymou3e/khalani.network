const { ethers, network } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const mailbox = network.config.mailboxAddress;
  const interchainGasPaymaster = network.config.interchainGasPaymaster;
  const gasAmountOracle = network.config.gasAmountOracle;
  let destEventVerifiers = [];

  if (network.config.name === "arcadia") {
    destEventVerifiers = [
      {
        address: config.networks.holesky.eventVerifier,
        chainId: config.networks.holesky.chainId,
      },
      {
        address: config.networks.avalanche.eventVerifier,
        chainId: config.networks.avalanche.chainId,
      },
    ];
  } else if (network.config.name === "holesky") {
    destEventVerifiers = [
      {
        address: config.networks.khalani.eventVerifier,
        chainId: config.networks.khalani.chainId,
      },
      {
        address: config.networks.avalanche.eventVerifier,
        chainId: config.networks.avalanche.chainId,
      },
    ];
  } else if (network.config.name === "fuji") {
    destEventVerifiers = [
      {
        address: config.networks.khalani.eventVerifier,
        chainId: config.networks.khalani.chainId,
      },
      {
        address: config.networks.holesky.eventVerifier,
        chainId: config.networks.holesky.chainId,
      },
    ];
  }

  if (!mailbox) {
    throw new Error(
      `Mailbox address is not defined for network: ${network.name}`
    );
  }

  console.log("Deploying EventProver with the account:", deployer.address);
  console.log(`Deploying with parameters:\n- Mailbox: ${mailbox}`);

  for (let index = 0; index < destEventVerifiers.length; index++) {
    const eventVerifier = destEventVerifiers[index];

    const EventProver = await ethers.getContractFactory(
      "src/event_system/EventProver.sol:EventProver"
    );
    const eventProver = await EventProver.deploy(
      mailbox,
      eventVerifier.address,
      eventVerifier.chainId,
      interchainGasPaymaster,
      gasAmountOracle
    );

    await eventProver.waitForDeployment();
    console.log(
      `EventProver for destination chain id ${eventVerifier.chainId} deployed at:`,
      eventProver.target
    );
  }

  console.log("Deployed Event Provers with the account:", deployer.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
