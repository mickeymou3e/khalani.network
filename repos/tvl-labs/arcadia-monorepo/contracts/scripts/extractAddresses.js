const fs = require("fs");
const path = require("path");

task(
  "extract-addresses",
  "Extracts contract addresses and saves them to JSON files"
).setAction(async (_, hre) => {
  const config = hre.userConfig.networks;

  function extractContractAddresses(networkConfig) {
    const {
      mailboxAddress,
      eventVerifier,
      aipEventPublisher,
      aipEventHandler,
      interchainGasPaymaster,
      authorizationManager,
      mTokenRegistry,
      mTokenManager,
      intentBook,
      receiptManager,
      assetReserves,
      permit2,
      mTokens,
      tokens,
    } = networkConfig;

    return {
      mailboxAddress,
      eventVerifier,
      aipEventPublisher,
      aipEventHandler,
      interchainGasPaymaster,
      authorizationManager,
      mTokenRegistry,
      mTokenManager,
      intentBook,
      receiptManager,
      assetReserves,
      permit2,
      mTokens,
      tokens,
    };
  }

  const configDir = path.join(__dirname, "../config");
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir);
  }

  for (const [networkName, networkConfig] of Object.entries(config)) {
    const addresses = extractContractAddresses(networkConfig);

    // Write each network's addresses to a JSON file in the config folder
    fs.writeFileSync(
      path.join(configDir, `${networkName}_addresses.json`),
      JSON.stringify(addresses, null, 2)
    );

    console.log(
      `Saved ${networkName} addresses to config/${networkName}_addresses.json`
    );
  }
});

module.exports = {};
