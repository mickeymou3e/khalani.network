const { ethers, network } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy MTokenManager
  console.log("Deploying MTokenManager...");
  const MTokenManager = await ethers.getContractFactory("MTokenManager");
  const tokenManager = await MTokenManager.deploy();
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
  const authorizedMinters = [
    deployer.address,
    network.config.mTokenCrossChainAdapter,
  ];
  for (const minter of authorizedMinters) {
    const tx = await tokenManager.addAuthorizedMinter(minter);
    await tx.wait();
    console.log(`Authorized minter added: ${minter}`);
    const isAuthorizedMinter = await tokenManager.isAuthorizedMinter(minter);
    console.log(
      `Checking if ${minter} is authorized minter`,
      isAuthorizedMinter
    );
  }

  console.log("Deployment and setup completed.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
