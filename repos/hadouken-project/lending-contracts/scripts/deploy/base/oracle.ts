import { getMarketConfig } from '@markets/index';
import { ScriptRunEnvironment } from '@src/types';
import { IToken } from '@src/types/types';
import { chunk, getConfigInstant, getContractsConfigInstant, waitForTx } from '@src/utils';
import { ethers } from 'hardhat';

import { connectToContractsRuntime } from '@scripts/connect';

import { getTokensFromConfig, writeToContractsConfig } from '@scripts/filesManager';
import { LendingContracts, delay } from '@src/utils';

export async function deployBasePriceOracle(environment: ScriptRunEnvironment): Promise<{
  hadoukenOracle: string;
  oracleBandProvider: string;
  diaOracleProvider: string;
} | null> {
  try {
    const { env, chainId, deployer, delayInMs } = environment;

    const contractsConfig = getContractsConfigInstant(chainId, env, true);
    if (!contractsConfig) throw Error('contractsConfig not found');
    const tokens = getTokensFromConfig(environment);

    const config = getConfigInstant(chainId, env);
    if (!config) throw Error('config not found');
    let stdReference = contractsConfig.stdReference;

    if (!stdReference || stdReference === '') {
      if (env === 'mainnet') throw Error('mainnet should have stdReference provided');
      stdReference = await deploySTDReference(environment);
    }

    if (!stdReference) throw Error('no stdReference');

    const oracleBandProviderAddress = await deployBandOracleProvider(
      environment,
      stdReference,
      tokens
    );
    console.log(`Oracle Band Provider deployed: ${oracleBandProviderAddress}`);

    console.log('Deploying DIA oracle provider');

    let diaOracle = contractsConfig.diaOracle;

    if (!diaOracle || diaOracle === '') {
      if (env === 'mainnet') throw Error('mainnet should have diaOracle provided');
      diaOracle = await deployDiaV2(environment);
    }

    const oracleDIAProviderAddress = await deployDIAOracleProvider(environment, diaOracle, tokens);
    console.log(`Oracle DIA Provider deployed: ${oracleDIAProviderAddress}`);
    await delay(delayInMs);

    console.log('Deploying Hadouken Oracle');

    const hadoukenOracleFactory = await ethers.getContractFactory(
      LendingContracts.HadoukenOracle,
      deployer
    );

    const deployTransaction = hadoukenOracleFactory.getDeployTransaction(
      oracleBandProviderAddress,
      oracleDIAProviderAddress,
      {
        gasPrice: config.gasPrice,
        gasLimit: config.gasLimit,
      }
    );

    const hadoukenOracleGasLimit = await deployer.estimateGas(deployTransaction);
    deployTransaction.gasLimit = hadoukenOracleGasLimit;

    const hadoukenOracle = await waitForTx(await deployer.sendTransaction(deployTransaction));

    console.log(`Hadouken Oracle deployed: ${hadoukenOracle.contractAddress}`);
    await delay(delayInMs);

    writeToContractsConfig(
      {
        diaOracleProvider: oracleDIAProviderAddress,
        oracleBrandProvider: oracleBandProviderAddress,
        hadoukenOracle: hadoukenOracle.contractAddress,
        stdReference: stdReference,
        diaOracle: diaOracle,
      },
      environment.chainId,
      environment.env,
      environment.networkName
    );

    await delay(delayInMs);
    const addressProvider = connectToContractsRuntime(environment).addressProvider;
    if (!addressProvider) throw Error('address provider not defined');

    await waitForTx(await addressProvider.setPriceOracle(hadoukenOracle.contractAddress));

    console.log('Oracle Prices has been set up successfully');

    const address = await deployLendingRateOracle(environment);

    await delay(delayInMs);

    if (!address) throw new Error('Lending rate oracle deploy problem');

    await waitForTx(await addressProvider.setLendingRateOracle(address));

    writeToContractsConfig(
      {
        lendingRateOracle: address,
      },
      environment.chainId,
      environment.env,
      environment.networkName
    );

    console.log('Set Lending Rate oracle successfully to address provider');

    console.log('initialize lending rate oracle');

    const symbols = Object.keys(contractsConfig.tokens);

    await initializeLendingRateOracle(environment, symbols);

    return {
      hadoukenOracle: hadoukenOracle.contractAddress,
      oracleBandProvider: oracleBandProviderAddress,
      diaOracleProvider: oracleDIAProviderAddress,
    };
  } catch (exc) {
    console.error(exc);
  }

  return null;
}

/** STD Reference for price oracle */
export async function deploySTDReference(environment: ScriptRunEnvironment) {
  const { env, chainId, deployer } = environment;
  const config = getConfigInstant(chainId, env);
  if (!config) throw Error('config not found');
  const stdReferenceMock = await ethers.getContractFactory(LendingContracts.StdReference, deployer);

  const stdReferenceTransaction = stdReferenceMock.getDeployTransaction({
    gasPrice: config.gasPrice,
  });

  const stdReferenceGasLimit = await deployer.estimateGas(stdReferenceTransaction);
  stdReferenceTransaction.gasLimit = stdReferenceGasLimit;

  const stdTransaction = await waitForTx(await deployer.sendTransaction(stdReferenceTransaction));

  return stdTransaction.contractAddress;
}

/** DIA V2 oracle for price oracle */
export async function deployDiaV2(environment: ScriptRunEnvironment) {
  const { env, chainId, deployer } = environment;
  const config = getConfigInstant(chainId, env);
  if (!config) throw Error('config not found');
  const diaV2Mock = await ethers.getContractFactory(LendingContracts.DIAOracleV2, deployer);

  const diaV2OracleTransaction = diaV2Mock.getDeployTransaction({
    gasPrice: config.gasPrice,
  });
  const diaV2Transaction = await waitForTx(await deployer.sendTransaction(diaV2OracleTransaction));

  return diaV2Transaction.contractAddress;
}

export async function deployBandOracleProvider(
  environment: ScriptRunEnvironment,
  bandOracleStdReference: string,
  tokens: IToken[]
): Promise<string> {
  const { env, chainId, deployer } = environment;
  const config = getConfigInstant(chainId, env);
  if (!config) throw Error('config not found');
  const tokenSymbols = tokens.map((x) => x.symbol);
  const tokenAddresses = tokens.map((x) => x.address);

  const oracleBandProviderFactory = await ethers.getContractFactory(
    LendingContracts.OracleBandProvider,
    deployer
  );

  const oracleBandProviderTransaction = oracleBandProviderFactory.getDeployTransaction(
    bandOracleStdReference,
    tokenAddresses,
    tokenSymbols,
    { gasPrice: config.gasPrice, gasLimit: config.gasLimit }
  );

  const bandProviderGasLimit = await deployer.estimateGas(oracleBandProviderTransaction);
  oracleBandProviderTransaction.gasLimit = bandProviderGasLimit;

  const oracleBandProvider = await waitForTx(
    await deployer.sendTransaction(oracleBandProviderTransaction)
  );

  return oracleBandProvider.contractAddress;
}

export async function deployDIAOracleProvider(
  environment: ScriptRunEnvironment,
  diaOracle: string,
  tokens: IToken[]
): Promise<string> {
  const { env, chainId, deployer } = environment;
  const config = getConfigInstant(chainId, env);
  if (!config) throw Error('config not found');
  const tokenSymbols = tokens.map((x) => x.symbol);
  const tokenAddresses = tokens.map((x) => x.address);

  const diaOracleProviderFactory = await ethers.getContractFactory(
    LendingContracts.DIAOracleProvider,
    deployer
  );

  const oracleDIAProviderTransaction = diaOracleProviderFactory.getDeployTransaction(
    diaOracle,
    tokenAddresses,
    tokenSymbols,
    { gasPrice: config.gasPrice, gasLimit: config.gasLimit }
  );

  const diaProviderGasLimit = await deployer.estimateGas(oracleDIAProviderTransaction);
  oracleDIAProviderTransaction.gasLimit = diaProviderGasLimit;

  const diaOracleProvider = await waitForTx(
    await deployer.sendTransaction(oracleDIAProviderTransaction)
  );

  return diaOracleProvider.contractAddress;
}

export async function deployLendingRateOracle(
  environment: ScriptRunEnvironment
): Promise<string | null> {
  console.log('Deploying Lending Rate Oracle');
  const { env, chainId, deployer } = environment;
  const config = getConfigInstant(chainId, env);
  if (!config) throw Error('config not found');
  const LendingRateOracleFactory = await ethers.getContractFactory(
    LendingContracts.LendingRateOracle,
    deployer
  );

  const lendingRateTransaction = LendingRateOracleFactory.getDeployTransaction({
    gasPrice: config.gasPrice,
  });

  try {
    const lendingRateOracleProvider = await waitForTx(
      await deployer.sendTransaction(lendingRateTransaction)
    );

    const address = lendingRateOracleProvider.contractAddress;

    console.log(`Lending Rate Oracle address: ${address}`);

    return address;
  } catch (exc) {
    console.error(exc);
  }

  return null;
}

export const initializeLendingRateOracle = async (
  environment: ScriptRunEnvironment,
  symbols: string[]
) => {
  const config = getContractsConfigInstant(environment.chainId, environment.env, true);
  if (!config) throw Error('config not found');
  const { LendingRateOracleRatesCommon } = getMarketConfig(environment);

  const assetAddresses = symbols.map((symbol) => config.tokens[symbol].address);
  const borrowRates = symbols.map((symbol) => LendingRateOracleRatesCommon[symbol].borrowRate);

  await setOracleBorrowRates({
    addresses: assetAddresses,
    borrowRates: borrowRates,
    environment: environment,
    symbols: symbols,
  });
};

export const setOracleBorrowRates = async ({
  addresses,
  borrowRates,
  symbols,
  environment,
}: {
  addresses: string[];
  borrowRates: string[];
  symbols: string[];
  environment: ScriptRunEnvironment;
}) => {
  if (addresses.length !== borrowRates.length || addresses.length !== symbols.length) {
    throw Error('wrong param numbers in setOracleBorrowRates');
  }

  const config = getConfigInstant(environment.chainId, environment.env);
  if (!config) throw Error('config not found');
  const delayInMs: number = Number(config.delay);

  const contractsConfig = getContractsConfigInstant(environment.chainId, environment.env, true);
  if (!contractsConfig) throw Error('contractsConfig not found');
  const addressProviderContract = connectToContractsRuntime(environment).addressProvider;
  if (!addressProviderContract) throw Error('addressProviderContract not defined');

  const admin = await addressProviderContract.getPoolAdmin();

  const stableAndVariableTokenHelper =
    connectToContractsRuntime(environment).stableAndVariableTokenHelper;

  if (!stableAndVariableTokenHelper) throw Error('stableAndVariableTokenHelper not found');

  const lendingRateOracle = connectToContractsRuntime(environment).lendingRateOracle;
  if (!lendingRateOracle) throw Error('lendingRateOracle not found');

  // Set borrow rates per chunks
  const ratesChunks = 1;
  const chunkedTokens = chunk(addresses, ratesChunks);
  const chunkedRates = chunk(borrowRates, ratesChunks);
  const chunkedSymbols = chunk(symbols, ratesChunks);

  await waitForTx(
    await lendingRateOracle.transferOwnership(
      contractsConfig.stableAndVariableTokensHelper,
      environment.transactionOverrides
    )
  );

  await delay(delayInMs);

  console.log(`- Lending Rate oracle borrow initalization in ${chunkedTokens.length} txs`);
  for (let chunkIndex = 0; chunkIndex < chunkedTokens.length; chunkIndex++) {
    await waitForTx(
      await stableAndVariableTokenHelper.setOracleBorrowRates(
        chunkedTokens[chunkIndex],
        chunkedRates[chunkIndex],
        contractsConfig.lendingRateOracle,
        environment.transactionOverrides
      )
    );

    await delay(delayInMs);
    console.log(`  - Setted Oracle Borrow Rates for: ${chunkedSymbols[chunkIndex].join(', ')}`);
  }

  // Set back ownership
  await waitForTx(
    await stableAndVariableTokenHelper.setOracleOwnership(
      lendingRateOracle.address,
      admin,
      environment.transactionOverrides
    )
  );
  await delay(delayInMs);
};
