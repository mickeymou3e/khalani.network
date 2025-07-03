const { ethers, network, config } = require("hardhat");
const { ZeroAddress } = require("ethers");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying AIPEventHandler with the account:", deployer.address);

  const mTokenManagerAddress = config.networks.khalani.mTokenManager;
  const eventVerifierAddresses = network.config.eventVerifier || [];
  const isArcadia = network.config.isArcadia || false;

  if (!mTokenManagerAddress) {
    console.error("Missing MTokenManager address in network configuration.");
    process.exit(1);
  }

  console.log(`Deploying with the following parameters:
    - MToken Manager: ${mTokenManagerAddress}
    - Arcadia Hub?: ${isArcadia}
    - Event verifier address: ${eventVerifierAddresses}
  `);

  const AIPEventHandler = await ethers.getContractFactory("AIPEventHandler");
  const aipEventHandler = await AIPEventHandler.deploy(
    mTokenManagerAddress,
    ZeroAddress,
    isArcadia,
    deployer.address
  );
  await aipEventHandler.waitForDeployment();
  console.log("AIPEventHandler deployed at:", aipEventHandler.target);

  console.log("Registering event verifier...");
  const tx = await aipEventHandler.registerEventVerifier(
    eventVerifierAddresses
  );
  await tx.wait();
  console.log(`Event verifier ${eventVerifierAddresses} registered.`);

  console.log(
    "Deployment and event verifier registration completed successfully."
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
