import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { getConfig } from "../cli/config";
import { getEnv, updateDeployedContracts } from "../cli/utils";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const environment = getEnv(hre.network.name);
  const config = getConfig(environment);

  const contractArtifact = await ethers.getContractFactory("Liquidation");

  const response = await contractArtifact.deploy(
    config.contracts.swap.vault,
    config.contracts.lending.lendingPool,
    config.contracts.swap.triCryptoPool,
    config.contracts.swap.ckbPools,
    config.contracts.swap.ethPools,
    config.contracts.swap.usdPools
  );

  updateDeployedContracts(environment, "liquidation", response.address);

  console.log("Liquidation deployed:", response.address);
};

func.tags = ["Liquidation", "Base", "Base-Liquidation"];

export default func;
