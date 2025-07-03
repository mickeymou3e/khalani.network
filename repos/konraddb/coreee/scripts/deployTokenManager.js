const { ethers, network } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Fetch the AIP Event Publisher address from the config for the current network
  const aipEventPublisherAddress = network.config.aipEventPublisher;
  const aipEventHandlerAddress = network.config.aipEventHandler;

  if (!aipEventPublisherAddress) {
    console.error(
      "AIP Event Publisher address is missing for the current network."
    );
    process.exit(1);
  }

  if (!aipEventHandlerAddress) {
    console.error(
      "AIP Event Handler address is missing for the current network."
    );
    process.exit(1);
  }

  console.log(`Deploying with the following parameters: 
    - AIP Event Publisher: ${aipEventPublisherAddress}
  `);

  // Deploy AuthorizationManager
  console.log("Deploying AuthorizationManager...");
  const AuthorizationManager = await ethers.getContractFactory(
    "AuthorizationManager"
  );
  const authorizationManager = await AuthorizationManager.deploy();
  await authorizationManager.waitForDeployment();
  console.log("AuthorizationManager deployed at:", authorizationManager.target);

  // Deploy MTokenManager
  console.log("Deploying MTokenManager...");
  const MTokenManager = await ethers.getContractFactory("MTokenManager");
  const tokenManager = await MTokenManager.deploy(
    aipEventPublisherAddress // Pass AIPEventPublisher address
  );
  await tokenManager.waitForDeployment();
  console.log("MTokenManager deployed at:", tokenManager.target);

  // Deploy MTokenRegistry
  console.log("Deploying MTokenRegistry...");
  const MTokenRegistry = await ethers.getContractFactory("MTokenRegistry");
  const tokenRegistry = await MTokenRegistry.deploy(tokenManager.target);
  await tokenRegistry.waitForDeployment();
  console.log("MTokenRegistry deployed at:", tokenRegistry.target);

  // Set MTokenRegistry in MTokenManager
  console.log("Setting MTokenRegistry in MTokenManager...");
  const txSetRegistry = await tokenManager.setTokenRegistry(
    tokenRegistry.target
  );
  await txSetRegistry.wait();
  console.log("MTokenRegistry set in MTokenManager.");

  // Add authorized minters
  console.log("Adding authorized minters...");
  const authorizedMinters = [deployer.address, aipEventHandlerAddress];
  for (const minter of authorizedMinters) {
    const tx = await authorizationManager.addAuthorizedMinter(minter);
    await tx.wait();
    console.log(`Authorized minter added: ${minter}`);
  }

  console.log("Deployment and setup completed.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
