import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ContractFactory, Provider, Wallet } from "zksync-web3";
import { getConfig } from "../cli/config";
import { getEnv, updateDeployedContracts } from "../cli/utils";
import { Liquidation__factory } from "../src/contracts/zksync";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  console.log("Deploying liquidation");
  const environment = getEnv(hre.network.name);
  const config = getConfig(environment);

  const privateKey = process.env.ZKSYNC_TESTNET_DEPLOYER;

  const wallet = new Wallet(privateKey);
  const provider = new Provider(config.rpcUrl);
  const walletWithProvider = wallet.connect(provider);

  const liquidationFactory = new ContractFactory(
    Liquidation__factory.abi,
    Liquidation__factory.bytecode,
    walletWithProvider
  );

  const response = await liquidationFactory.deploy(
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

func.tags = ["Liquidation", "ZkSync", "ZkSync-Liquidation"];

export default func;
