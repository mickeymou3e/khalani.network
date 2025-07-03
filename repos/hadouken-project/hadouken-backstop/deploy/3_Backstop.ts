import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ContractFactory, Provider, Wallet } from "zksync-web3";
import { getConfig, getContractsConfig } from "../cli/config";
import { getEnv, updateDeployedContracts } from "../cli/utils";
import { TriCryptoBackstop__factory } from "../src/contracts/zksync";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  console.log("Deploying Backstop");
  const environment = getEnv(hre.network.name);
  const config = getConfig(environment);
  const contracts = getContractsConfig(environment);

  const privateKey = process.env.ZKSYNC_TESTNET_DEPLOYER;

  const wallet = new Wallet(privateKey);
  const provider = new Provider(config.rpcUrl);
  const walletWithProvider = wallet.connect(provider);

  const backstopFactory = new ContractFactory(
    TriCryptoBackstop__factory.abi,
    TriCryptoBackstop__factory.bytecode,
    walletWithProvider
  );

  const backstop = await backstopFactory.deploy(
    config.contracts.swap.triCryptoPool,
    contracts.liquidation
  );

  updateDeployedContracts(environment, "backstop", backstop.address);

  console.log("Backstop deployed:", backstop.address);
};

func.tags = ["Backstop", "ZkSync", "ZkSync-Backstop"];

export default func;
