import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { getConfig, getContractsConfig } from "../cli/config";
import { getEnv, updateDeployedContracts } from "../cli/utils";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const environment = getEnv(hre.network.name);
  const config = getConfig(environment);
  const contracts = getContractsConfig(environment);

  const contractArtifact = await ethers.getContractFactory("TriCryptoBackstop");

  const backstop = await contractArtifact.deploy(
    config.contracts.swap.triCryptoPool,
    contracts.liquidation
  );

  updateDeployedContracts(environment, "backstop", backstop.address);

  console.log("Backstop deployed:", backstop.address);
};

func.tags = ["Backstop", "Base", "Base-Backstop"];

export default func;
