import { HardhatRuntimeEnvironment } from 'hardhat/types'

module.exports = async (hre: HardhatRuntimeEnvironment) => {
  const {
    getNamedAccounts,
    deployments,
    config,
    hardhatArguments: { network },
  } = hre
  if (!config || !network) return
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()
  const networkConfig = config.networks[network]
  const { vaultAddress, lendingPoolAddress, pCKBAddress, WCKBAddress } =
    networkConfig.arbitrageSwapConfig
  await deploy('ArbitrageSwap', {
    from: deployer,
    args: [vaultAddress, lendingPoolAddress, pCKBAddress, WCKBAddress],
    log: true,
  })
}
module.exports.tags = ['ArbitrageSwap']
