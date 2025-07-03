import { HardhatRuntimeEnvironment } from "hardhat/types";

module.exports = async (hre: HardhatRuntimeEnvironment) => {
  const {
    getNamedAccounts,
    deployments,
    config,
    hardhatArguments: { network },
  } = hre;
  if (!config || !network) return;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const networkConfig = config.networks[network];
  for (const {
    vaultAddress,
    lendingPoolAddress,
    tokenAddress,
    wrappedHTokenAddress,
    linearPoolAddress,
    poolId,
  } of networkConfig.linearPoolSwapConfigs) {
    await deploy(`LinearPoolSwap_${poolId}`, {
      from: deployer,
      contract: "LinearPoolSwap",
      args: [
        vaultAddress,
        lendingPoolAddress,
        tokenAddress,
        wrappedHTokenAddress,
        linearPoolAddress,
        poolId,
      ],
      log: true,
    });
  }
};
module.exports.tags = ["LinearPoolSwap"];
