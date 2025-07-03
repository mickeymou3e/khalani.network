import { HardhatRuntimeEnvironment } from "hardhat/types"
import { ethers, upgrades } from "hardhat"
import { Treasury } from "../typechain-types"
import "@openzeppelin/hardhat-upgrades"
import "../type-extensions"
import { Deployment, deploymentManager } from "../scripts/utils/deploymentManager"

module.exports = async (hre: HardhatRuntimeEnvironment) => {
  const {
    config,
    hardhatArguments: { network },
  } = hre
  if (!config || !network) return
  const networkConfig = config.networks[network]
  const { vaultAddress } = networkConfig
  const [deployer] = await ethers.getSigners()
  const chainId = await deployer.getChainId()

  const Treasury = await ethers.getContractFactory("Treasury")
  const treasuryProxy = (await upgrades.deployProxy(Treasury, [vaultAddress], {
    kind: "uups",
    timeout: 0,
  })) as Treasury
  await treasuryProxy.deployed()
  console.log(`treasury Proxy address: ${treasuryProxy.address}`)

  console.log("Saving deployment...")
  const _newDeployment: Deployment = {
    deployer: deployer.address,
    treasuryProxyAddress: treasuryProxy.address,
    vaultAddress,
  }

  await deploymentManager.write(chainId, _newDeployment)
  console.log("Deployment saved.")
}

module.exports.tags = ["Treasury"]
