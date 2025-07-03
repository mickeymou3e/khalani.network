import type { HardhatRuntimeEnvironment } from "hardhat/types"
import { deploymentManager } from "./utils/deploymentManager"
import { Treasury__factory } from "../typechain-types"

export async function addOperator(operatorAddress: string, hre: HardhatRuntimeEnvironment) {
  const [deployer] = await hre.ethers.getSigners()
  const chainId = await deployer.getChainId()
  const deployments = await deploymentManager.read()

  const treasury = Treasury__factory.connect(deployments[chainId].treasuryProxyAddress, deployer)
  console.log(`Adding new operator role for ${operatorAddress}`)
  const tx = await treasury.addOperator(operatorAddress)

  console.log("Waiting for confirmation")
  const receipt = await tx.wait()

  console.log(receipt)
}
