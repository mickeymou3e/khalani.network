import { ethers } from 'hardhat';
import * as ValidationLogic_JSON from '../../../artifacts/contracts/protocol/libraries/logic/ValidationLogic.sol/ValidationLogic.json';
import { LendingPoolLibraryAddresses } from '../../../src/typechain/godwoken/factories/LendingPool__factory';
import { ValidationLogic__factory } from '../../../src/typechain/godwoken/factories/ValidationLogic__factory';

import { writeToContractsConfig } from '@scripts/filesManager';
import { LendingPoolLibraries } from '@scripts/types';
import { Deployer, ScriptRunEnvironment } from '@src/types';
import { LendingContracts, delay, getConfigInstant, waitForTx } from '@src/utils';
import { ContractFactory } from 'ethers';

export const deployBaseLibraries = async (
  environment: ScriptRunEnvironment
): Promise<LendingPoolLibraries> => {
  const reserveLibrary = await deployBaseReserveLogicLibrary(environment);

  await delay(environment.delayInMs);

  const genericLibrary = await deployBaseGenericLogicLibrary(environment);

  await delay(environment.delayInMs);

  const validationLibrary = await deployBaseValidationLogicLibrary(
    genericLibrary,
    environment.deployer
  );

  const librariesAddress = {
    reserve: reserveLibrary,
    generic: genericLibrary,
    validation: validationLibrary,
  };

  writeToContractsConfig(
    { libraries: librariesAddress },
    environment.chainId,
    environment.env,
    environment.networkName
  );

  return {
    reserve: reserveLibrary,
    generic: genericLibrary,
    validation: validationLibrary,
  };
};

export const parseLibrariesAddressToContractData = (
  reserveLogicAddress: string,
  validationLogicAddress: string
): LendingPoolLibraryAddresses => {
  return {
    ['contracts/protocol/libraries/logic/ValidationLogic.sol:ValidationLogic']:
      validationLogicAddress,
    ['contracts/protocol/libraries/logic/ReserveLogic.sol:ReserveLogic']: reserveLogicAddress,
  };
};

const deployBaseReserveLogicLibrary = async (environment: ScriptRunEnvironment) => {
  const { deployer, chainId, env } = environment;
  console.log('Deploying Reserve Logic Library');
  const config = getConfigInstant(chainId, env);
  if (!config) throw Error('config not found');
  const reserveLogicFactory = await ethers.getContractFactory(
    LendingContracts.LibraryReserveLogic,
    deployer
  );

  const deployTransaction = reserveLogicFactory.getDeployTransaction({
    gasPrice: config.gasPrice,
    gasLimit: config.gasLimit,
  });

  const reserveLogicGasLimit = await deployer.estimateGas(deployTransaction);
  deployTransaction.gasLimit = reserveLogicGasLimit;

  const receipt = await waitForTx(await deployer.sendTransaction(deployTransaction));

  console.log(`Reserve Logic Library Deployed ${receipt.contractAddress}`);

  return receipt.contractAddress;
};

const deployBaseGenericLogicLibrary = async (environment: ScriptRunEnvironment) => {
  const { deployer, chainId, env } = environment;
  console.log('Deploying Generic Logic Library');
  const config = getConfigInstant(chainId, env);
  if (!config) throw Error('config not found');
  const genericLogicFactory = await ethers.getContractFactory(
    LendingContracts.LibraryGenericLogic,
    environment.deployer
  );

  const deployTransaction = genericLogicFactory.getDeployTransaction({
    gasPrice: config.gasPrice,
    gasLimit: config.gasLimit,
  });

  const genericLogicGasLimit = await deployer.estimateGas(deployTransaction);
  deployTransaction.gasLimit = genericLogicGasLimit;

  const receipt = await waitForTx(await deployer.sendTransaction(deployTransaction));

  console.log(`Generic Logic Library Deployed ${receipt.contractAddress}`);

  return receipt.contractAddress;
};

const deployBaseValidationLogicLibrary = async (
  genericLogicAddress: string,
  deployer: Deployer
) => {
  console.log('Deploying Validation Logic Library');

  const newByteCode = ValidationLogic__factory.linkBytecode({
    ['contracts/protocol/libraries/logic/GenericLogic.sol:GenericLogic']: genericLogicAddress,
  });

  const validationLogicFactory = new ContractFactory(
    ValidationLogic_JSON.abi,
    newByteCode,
    deployer
  ) as ValidationLogic__factory;

  const deployTransaction = validationLogicFactory.getDeployTransaction();

  const validationLogicGasLimit = await deployer.estimateGas(deployTransaction);
  deployTransaction.gasLimit = validationLogicGasLimit;

  const receipt = await waitForTx(await deployer.sendTransaction(deployTransaction));

  console.log(`Validation Logic Library Deployed ${receipt.contractAddress}`);

  return receipt.contractAddress;
};
