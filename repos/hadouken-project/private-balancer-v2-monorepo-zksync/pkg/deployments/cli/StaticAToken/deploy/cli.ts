import { ethers, network } from 'hardhat';

import { InitializableAdminUpgradeabilityProxy__factory, StaticATokenLM__factory } from '@balancer-labs/typechain';
import { Cli, Output } from '../../types';

import prompts from 'prompts';
import { save } from '../../../src/utils';

import ZkSyncInitializableAdminUpgradeabilityProxyBytecodeJSON from '../../../../pool-linear/artifacts-zk/contracts/InitializableAdminUpgradeabilityProxy.sol/InitializableAdminUpgradeabilityProxy.json';
import ZkSyncStaticATokenLmJSON from '../../../../pool-linear/artifacts-zk/contracts/StaticATokenLM.sol/StaticATokenLM.json';
import { ContractFactory, Wallet } from 'zksync-web3';

export const deployCli: Cli = async (cliProps) => {
  const deployer = cliProps.environment.deployer;
  const deployerAddress = await deployer.getAddress();

  const { name } = await prompts({
    type: 'text',
    name: 'name',
    message: 'Wrapped token name',
    initial: 'Wrapped h',
  });

  const { symbol } = await prompts({
    type: 'text',
    name: 'symbol',
    message: 'Wrapped token symbol',
    initial: 'h',
  });

  const { lendingPool } = await prompts({
    type: 'text',
    name: 'lendingPool',
    message: 'lending pool address',
  });
  const { aToken } = await prompts({
    type: 'text',
    name: 'aToken',
    message: 'aave token address',
  });

  const { admin } = await prompts({
    type: 'text',
    name: 'admin',
    message: 'admin address',
    initial: deployerAddress,
  });

  const staticATokenFactory = new ContractFactory(
    ZkSyncStaticATokenLmJSON.abi,
    ZkSyncStaticATokenLmJSON.bytecode,
    deployer as Wallet
  );

  const staticATokenTransaction = await staticATokenFactory.deploy();

  const factoryInitializableAdminUpgradeabilityProxy = new ContractFactory(
    ZkSyncInitializableAdminUpgradeabilityProxyBytecodeJSON.abi,
    ZkSyncInitializableAdminUpgradeabilityProxyBytecodeJSON.bytecode,
    deployer as Wallet
  );

  const proxyTransactionDeploy = factoryInitializableAdminUpgradeabilityProxy.getDeployTransaction();

  const proxyTransaction = await (await deployer.sendTransaction(proxyTransactionDeploy)).wait(2);

  const proxyContract = InitializableAdminUpgradeabilityProxy__factory.connect(
    proxyTransaction.contractAddress,
    deployer
  );
  const staticATokenContract = StaticATokenLM__factory.connect(staticATokenTransaction.address, deployer);

  const data = staticATokenContract.interface.encodeFunctionData('initialize', [lendingPool, aToken, name, symbol]);

  await (
    await proxyContract['initialize(address,address,bytes)'](staticATokenTransaction.address, admin, data)
  ).wait(2);

  console.log(`${symbol} deployed with address`, proxyTransaction.contractAddress);

  if (proxyContract.address) {
    save<
      Output<
        {
          name: string;
          symbol: string;
          lendingPool: string;
          aToken: string;
        },
        string
      >
    >(
      {
        transaction: {
          hash: proxyTransaction.transactionHash,
          blockNumber: proxyTransaction.blockNumber,
        },
        data: {
          StaticAToken: {
            deploy: {
              input: {
                name: name as string,
                symbol: symbol as string,
                lendingPool: lendingPool as string,
                aToken: aToken as string,
              },
              output: proxyTransaction.contractAddress,
            },
          },
        },
      },
      symbol,
      __dirname,
      network.name
    );
  }
};
