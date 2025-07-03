import type { HardhatRuntimeEnvironment } from "hardhat/types"
import { deploymentManager } from "./utils/deploymentManager"
import { Treasury__factory } from "../typechain-types"
import { BigNumber } from "ethers"

export async function sendTokens(
  tokenAddress: string,
  amount: string,
  decimals: string,
  recipient: string,
  hre: HardhatRuntimeEnvironment
) {
  const [deployer] = await hre.ethers.getSigners()
  const chainId = await deployer.getChainId()
  const deployments = await deploymentManager.read()

  const treasuryAddress = deployments[chainId].treasuryProxyAddress
  const treasury = Treasury__factory.connect(treasuryAddress, deployer)

  const amountDecimal = BigNumber.from(10).pow(decimals).mul(amount)

  console.log(`Sending ${amountDecimal.toString()} of ${tokenAddress} to ${recipient}`)
  const tx = await treasury.sendToken(tokenAddress, amountDecimal, recipient)

  console.log("Waiting for confirmation")
  const receipt = await tx.wait()

  console.log(receipt)
}
