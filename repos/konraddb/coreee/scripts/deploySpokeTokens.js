const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const initialSupply = ethers.parseUnits("1000000", 18);
  const chainName = network.config.name;

  // Deploy standard ERC20 tokens with chain-specific name and symbol
  const ERC20 = await ethers.getContractFactory("CustomERC20");

  const usdc = await ERC20.deploy(
    `Test USDC.${chainName}`,
    `tUSDC.${chainName}`
  );
  await usdc.waitForDeployment();
  console.log(`Test USDC.${chainName} deployed at:`, usdc.target);

  const usdt = await ERC20.deploy(
    `Test USDT.${chainName}`,
    `tUSDT.${chainName}`
  );
  await usdt.waitForDeployment();
  console.log(`Test USDT.${chainName} deployed at:`, usdt.target);

  const dai = await ERC20.deploy(`Test DAI.${chainName}`, `tDAI.${chainName}`);
  await dai.waitForDeployment();
  console.log(`Test DAI.${chainName} deployed at:`, dai.target);

  const weth = await ERC20.deploy(
    `Test WETH.${chainName}`,
    `tWETH.${chainName}`
  );
  await weth.waitForDeployment();
  console.log(`Test WETH.${chainName} deployed at:`, weth.target);

  // Mint tokens to the deployer after deployment
  await usdc.mint(deployer.address, initialSupply);
  console.log(
    `Minted ${ethers.formatUnits(initialSupply, 18)} USDC to ${
      deployer.address
    }`
  );

  await usdt.mint(deployer.address, initialSupply);
  console.log(
    `Minted ${ethers.formatUnits(initialSupply, 18)} USDT to ${
      deployer.address
    }`
  );

  await dai.mint(deployer.address, initialSupply);
  console.log(
    `Minted ${ethers.formatUnits(initialSupply, 18)} DAI to ${deployer.address}`
  );

  await weth.mint(deployer.address, initialSupply);
  console.log(
    `Minted ${ethers.formatUnits(initialSupply, 18)} WETH to ${
      deployer.address
    }`
  );

  console.log(`Deployment and minting completed on ${chainName}!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
