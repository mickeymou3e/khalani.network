const { ethers, config } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Minting tokens with the account:", deployer.address);

  const mintAmount = ethers.parseUnits("1000", 18);

  const ethereumTokens = config.networks.ethereum.tokens;
  const avalancheTokens = config.networks.avalanche.tokens;

  if (!ethereumTokens || !avalancheTokens) {
    console.error(
      "Token configuration for Ethereum or Avalanche is missing in the Hardhat config."
    );
    process.exit(1);
  }

  // Mint tokens on Ethereum
  console.log("Minting tokens on Ethereum...");
  for (const [tokenSymbol, tokenAddress] of Object.entries(ethereumTokens)) {
    if (!tokenAddress || tokenAddress === "0x") {
      console.log(
        `Skipping ${tokenSymbol} on Ethereum as no valid token address is provided.`
      );
      continue;
    }

    console.log(
      `Minting ${ethers.formatUnits(mintAmount, 18)} ${tokenSymbol} to ${
        deployer.address
      } on Ethereum...`
    );

    const ERC20 = await ethers.getContractAt("CustomERC20", tokenAddress);

    const mintTx = await ERC20.mint(deployer.address, mintAmount);
    await mintTx.wait();

    console.log(
      `Minted ${ethers.formatUnits(mintAmount, 18)} ${tokenSymbol} to ${
        deployer.address
      } on Ethereum.`
    );
  }

  // Mint tokens on Avalanche
  console.log("Minting tokens on Avalanche...");
  for (const [tokenSymbol, tokenAddress] of Object.entries(avalancheTokens)) {
    if (!tokenAddress || tokenAddress === "0x") {
      console.log(
        `Skipping ${tokenSymbol} on Avalanche as no valid token address is provided.`
      );
      continue;
    }

    console.log(
      `Minting ${ethers.formatUnits(mintAmount, 18)} ${tokenSymbol} to ${
        deployer.address
      } on Avalanche...`
    );

    const ERC20 = await ethers.getContractAt("CustomERC20", tokenAddress);

    const mintTx = await ERC20.mint(deployer.address, mintAmount);
    await mintTx.wait();

    console.log(
      `Minted ${ethers.formatUnits(mintAmount, 18)} ${tokenSymbol} to ${
        deployer.address
      } on Avalanche.`
    );
  }

  console.log("Minting process completed on both networks.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
