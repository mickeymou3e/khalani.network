import { ethers, network } from 'hardhat';

import { InitializableAdminUpgradeabilityProxy__factory, StaticATokenLM__factory } from '@balancer-labs/typechain';
import { Cli, Output } from '../../types';

import InitializableAdminUpgradeabilityProxyAbiJSON from '../abi/InitializableAdminUpgradeabilityProxy.json';
import StaticATokenLMAbiJSON from '../abi/StaticATokenLM.json';
import InitializableAdminUpgradeabilityProxyBytecodeJSON from '../bytecode/InitializableAdminUpgradeabilityProxy.json';
import StaticATokenLMBytecodeJSON from '../bytecode/StaticATokenLM.json';
import prompts from 'prompts';
import chalk from 'chalk';
import { save } from '../../../src/utils';

export const deployCli: Cli = async (cliProps) => {
  const deployer = cliProps.environment.deployer;
  const deployerAddress = await deployer.getAddress();

  const proxyToken = '0x08A84A0A7F05751Df0d93DE913A3aa4BD2E22154';

  const proxyContract = StaticATokenLM__factory.connect(proxyToken, deployer);

  const symbola = await proxyContract.symbol();
  console.log('proxy', symbola);
  process.exit(0);

  const { name } = await prompts({
    type: 'text',
    name: 'name',
    message: 'name',
  });
  const { symbol } = await prompts({
    type: 'text',
    name: 'symbol',
    message: 'symbol',
  });
  const { lendingPool } = await prompts({
    type: 'text',
    name: 'lendingPool',
    message: 'lending pool',
  });
  const { aToken } = await prompts({
    type: 'text',
    name: 'aToken',
    message: 'aave token',
  });
  const { admin } = await prompts({
    type: 'text',
    name: 'admin',
    message: 'admin',
    initial: deployerAddress,
  });

  // DEPLOY InitializableAdminUpgradeabilityProxy
  const factoryInitializableAdminUpgradeabilityProxy = new ethers.ContractFactory(
    InitializableAdminUpgradeabilityProxyAbiJSON,
    InitializableAdminUpgradeabilityProxyBytecodeJSON.creationCode,
    deployer
  );
  const resultInitializableAdminUpgradeabilityProxy = await factoryInitializableAdminUpgradeabilityProxy.deploy();
  const resultInitializableAdminUpgradeabilityProxyReceipt = await resultInitializableAdminUpgradeabilityProxy.deployTransaction.wait(
    2
  );

  console.log(
    chalk.bgYellow(chalk.black('InitializableAdminUpgradeabilityProxy')),
    ' deployed at',
    chalk.yellow(resultInitializableAdminUpgradeabilityProxy.address)
  );

  // DEPLOY StaticATokenLM
  const factoryStaticTokenLM = new ethers.ContractFactory(
    StaticATokenLMAbiJSON,
    StaticATokenLMBytecodeJSON.creationCode,
    deployer
  );
  const resultStaticATokenLM = await factoryStaticTokenLM.deploy();
  await resultStaticATokenLM.deployTransaction.wait(2);

  console.log(chalk.bgYellow(chalk.black('StaticTokenLM')), ' deployed at', chalk.yellow(resultStaticATokenLM.address));

  const staticATokenLMContract = StaticATokenLM__factory.connect(resultStaticATokenLM.address, deployer);

  const data = staticATokenLMContract.interface.encodeFunctionData('initialize', [lendingPool, aToken, name, symbol]);

  const initializableAdminUpgradeabilityProxyContract = InitializableAdminUpgradeabilityProxy__factory.connect(
    resultInitializableAdminUpgradeabilityProxy.address,
    deployer
  );

  try {
    await initializableAdminUpgradeabilityProxyContract.callStatic['initialize(address,address,bytes)'](
      resultStaticATokenLM.address,
      admin,
      data
    );
  } catch (error) {
    console.error(error);
    process.exit(0);
  }

  const initializeTransaction = await initializableAdminUpgradeabilityProxyContract[
    'initialize(address,address,bytes)'
  ](resultStaticATokenLM.address, admin, data);

  await initializeTransaction.wait(2);

  console.log(
    chalk.bgYellow(chalk.black(`Proxy StaticAToken ${symbol} initialized: `)),
    chalk.yellow(resultInitializableAdminUpgradeabilityProxy.address)
  );

  if (resultInitializableAdminUpgradeabilityProxy.address) {
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
          hash: resultInitializableAdminUpgradeabilityProxyReceipt.transactionHash,
          blockNumber: resultInitializableAdminUpgradeabilityProxyReceipt.blockNumber,
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
              output: resultInitializableAdminUpgradeabilityProxy.address,
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
