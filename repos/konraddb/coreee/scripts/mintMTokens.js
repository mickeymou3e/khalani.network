const { ethers, network } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(
    "Minting tokens using MTokenManager with the account:",
    deployer.address
  );

  const mintAmount = ethers.parseEther("1000");
  //NOTE: Pass recipient address
  const recipientAddress = "0x";

  // Get the deployed mTokens from the Hardhat config for the current network
  const mTokens = network.config.mTokens;
  const mTokenManagerAddress = network.config.mTokenManager;

  if (!mTokens || !mTokenManagerAddress) {
    console.error(
      "No mTokens configuration or MTokenManager address found in the Hardhat config."
    );
    process.exit(1);
  }

  // Get MTokenManager contract instance
  const MTokenManager = await ethers.getContractAt(
    "MTokenManager",
    mTokenManagerAddress
  );

  // Mint tokens for all deployed MTokens using MTokenManager
  for (const [networkKey, tokenList] of Object.entries(mTokens)) {
    for (const [tokenSymbol, tokenAddress] of Object.entries(tokenList)) {
      if (!tokenAddress || tokenAddress === "0x") {
        console.log(
          `Skipping ${tokenSymbol} as no valid token address is provided.`
        );
        continue;
      }

      console.log(
        `Minting ${ethers.formatEther(
          mintAmount
        )} ${tokenSymbol}.${networkKey} to ${recipientAddress} using MTokenManager...`
      );

      // Mint tokens using the mintMToken function of MTokenManager
      const mintTx = await MTokenManager.mintMToken(
        recipientAddress,
        tokenAddress,
        mintAmount
      );
      await mintTx.wait();

      console.log(
        `${ethers.formatEther(
          mintAmount
        )} ${tokenSymbol} minted to ${recipientAddress} on ${networkKey} using MTokenManager.`
      );
    }
  }

  console.log("All tokens minted successfully.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
