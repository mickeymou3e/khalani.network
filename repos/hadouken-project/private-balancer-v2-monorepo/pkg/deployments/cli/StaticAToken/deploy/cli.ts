import { ethers } from 'hardhat';

import { InitializableAdminUpgradeabilityProxy__factory, StaticATokenLM__factory } from '@hadouken-project/typechain';
import { Cli, Output } from '../../types';

import prompts from 'prompts';

import { save } from '../../utils/save';

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

  const staticATokenFactory = new ethers.ContractFactory(
    StaticATokenLM__factory.abi,
    StaticATokenLM__factory.bytecode,
    deployer
  );

  const staticATokenTransaction = await staticATokenFactory.deploy();

  const factoryInitializableAdminUpgradeabilityProxy = new ethers.ContractFactory(
    InitializableAdminUpgradeabilityProxy__factory.abi,
    InitializableAdminUpgradeabilityProxy__factory.bytecode,
    deployer
  );

  const proxyTransactionDeploy = factoryInitializableAdminUpgradeabilityProxy.getDeployTransaction();

  const proxyTransaction = await (await deployer.sendTransaction(proxyTransactionDeploy)).wait(2);

  const proxyContract = InitializableAdminUpgradeabilityProxy__factory.connect(
    proxyTransaction.contractAddress,
    deployer
  );
  const staticATokenContract = StaticATokenLM__factory.connect(staticATokenTransaction.address, deployer);

  const data = staticATokenContract.interface.encodeFunctionData('initialize', [lendingPool, aToken, name, symbol]);

  const gasLimit = await proxyContract.estimateGas['initialize(address,address,bytes)'](
    staticATokenContract.address,
    admin,
    data
  );

  await (
    await proxyContract['initialize(address,address,bytes)'](staticATokenTransaction.address, admin, data, {
      gasLimit: gasLimit,
    })
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
      cliProps.environment.network
    );
  }
};
