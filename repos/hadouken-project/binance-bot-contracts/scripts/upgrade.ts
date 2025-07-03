import type { HardhatRuntimeEnvironment } from "hardhat/types"
import { deploymentManager } from "./utils/deploymentManager"

export async function upgradeTreasury(treasuryImplementation: string, hre: HardhatRuntimeEnvironment) {
  const [deployer] = await hre.ethers.getSigners()
  const chainId = await deployer.getChainId()
  const deployments = await deploymentManager.read()

  const NewTreasury = await hre.ethers.getContractFactory(treasuryImplementation)
  console.log("Upgrading Treasury...")

  try {
    const upgrade = await hre.upgrades.upgradeProxy(deployments[chainId].treasuryProxyAddress, NewTreasury)
    console.log("Upgraded successfully! Treasury address:", upgrade.address)
  } catch (error) {
    console.error(error)
  }
}
