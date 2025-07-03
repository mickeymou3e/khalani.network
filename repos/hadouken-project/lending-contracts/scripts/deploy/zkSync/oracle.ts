import { getMarketConfig } from '@markets/index';
import { connectToContractsRuntime } from '@scripts/connect';
import { getTokensFromConfig, writeToContractsConfig } from '@scripts/filesManager';
import { ZkSyncDeploymentEnvironment } from '@src/types';
import { IToken } from '@src/types/types';
import {
  LendingContracts,
  chunk,
  delay,
  getConfigInstant,
  getContractsConfigInstant,
  waitForTx,
} from '@src/utils';
import { mapTokenSymbolForOracle } from '../../../cli/contracts/common/oracle/price';

export const deployZkSyncOracle = async (environment: ZkSyncDeploymentEnvironment) => {
  const { env, chainId, delayInMs } = environment;

  const contractsConfig = getContractsConfigInstant(chainId, env, true);
  const config = getConfigInstant(chainId, env, true);

  let stdReference = config?.bandOracleStdReference;
  let diaOracleV2 = config?.diaOracleV2;

  const addressProviderAddress = contractsConfig?.addressProvider;
  if (!addressProviderAddress) {
    console.log('Address provider is not initialized. Aborting oracle deployment.');
    return;
  }

  const addressProvider = connectToContractsRuntime(environment).addressProvider;
  if (!addressProvider) throw Error('addressProvider not found');

  stdReference = await deploySTDReference(environment);

  await delay(delayInMs);

  diaOracleV2 = await deployDiaV2(environment);

  await delay(delayInMs);

  const tokens = getTokensFromConfig(environment);

  const data = await deployPriceOracle(
    environment,
    stdReference,
    diaOracleV2,
    tokens,
    Number(config?.delay)
  );

  if (data === null) throw new Error('price oracle deploy problem');

  const { hadoukenOracle, oracleBandProvider, diaOracleProvider } = data;

  writeToContractsConfig(
    {
      diaOracleProvider: diaOracleProvider,
      oracleBrandProvider: oracleBandProvider,
      hadoukenOracle: hadoukenOracle,
      stdReference: stdReference,
      diaOracle: diaOracleV2,
    },
    environment.chainId,
    environment.env,
    environment.networkName
  );

  await delay(delayInMs);
  await waitForTx(await addressProvider.setPriceOracle(hadoukenOracle));

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
};

async function deploySTDReference(environment: ZkSyncDeploymentEnvironment) {
  const { deployer } = environment;
  const stdReferenceMock = await deployer.loadArtifact(LendingContracts.StdReference);

  const stdTransaction = await deployer.deploy(stdReferenceMock);

  return stdTransaction.address;
}

async function deployDiaV2(environment: ZkSyncDeploymentEnvironment) {
  const { deployer } = environment;
  const diaV2Mock = await deployer.loadArtifact(LendingContracts.DIAOracleV2);

  const diaV2Transaction = await deployer.deploy(diaV2Mock);

  return diaV2Transaction.address;
}

async function deployBandOracleProvider(
  environment: ZkSyncDeploymentEnvironment,
  bandOracleStdReference: string,
  tokens: IToken[]
): Promise<string> {
  const { deployer } = environment;
  const tokenSymbols = tokens.map(({ symbol }) => mapTokenSymbolForOracle(symbol));
  const tokenAddresses = tokens.map(({ address }) => address);

  const oracleBandProviderFactory = await deployer.loadArtifact(
    LendingContracts.OracleBandProvider
  );

  const contract = await deployer.deploy(oracleBandProviderFactory, [
    bandOracleStdReference,
    tokenAddresses,
    tokenSymbols,
  ]);

  return contract.address;
}

async function deployDIAOracleProvider(
  environment: ZkSyncDeploymentEnvironment,
  diaOracle: string,
  tokens: IToken[]
): Promise<string> {
  const { deployer } = environment;
  const tokenSymbols = tokens.map(({ symbol }) => mapTokenSymbolForOracle(symbol));
  const tokenAddresses = tokens.map(({ address }) => address);

  const diaOracleProviderFactory = await deployer.loadArtifact(LendingContracts.DIAOracleProvider);

  const contract = await deployer.deploy(diaOracleProviderFactory, [
    diaOracle,
    tokenAddresses,
    tokenSymbols,
  ]);

  return contract.address;
}

async function deployPriceOracle(
  environment: ZkSyncDeploymentEnvironment,
  bandStdReference: string,
  diaOracle: string,
  tokens: IToken[],
  delayInMs: number
): Promise<{
  hadoukenOracle: string;
  oracleBandProvider: string;
  diaOracleProvider: string;
} | null> {
  try {
    console.log('Deploying Band oracle provider');
    const { deployer } = environment;
    const oracleBandProviderAddress = await deployBandOracleProvider(
      environment,
      bandStdReference,
      tokens
    );
    console.log(`Oracle Band Provider deployed: ${oracleBandProviderAddress}`);

    await delay(delayInMs);

    console.log('Deploying DIA oracle provider');

    const oracleDIAProviderAddress = await deployDIAOracleProvider(environment, diaOracle, tokens);
    console.log(`Oracle DIA Provider deployed: ${oracleDIAProviderAddress}`);
    await delay(delayInMs);

    console.log('Deploying Hadouken Oracle');

    const hadoukenOracleFactory = await deployer.loadArtifact(LendingContracts.HadoukenOracle);

    const contract = await deployer.deploy(hadoukenOracleFactory, [
      oracleBandProviderAddress,
      oracleDIAProviderAddress,
    ]);

    console.log(`Hadouken Oracle deployed: ${contract.address}`);
    await delay(delayInMs);

    return {
      hadoukenOracle: contract.address,
      oracleBandProvider: oracleBandProviderAddress,
      diaOracleProvider: oracleDIAProviderAddress,
    };
  } catch (e) {
    console.error(e);
  }

  return null;
}

async function deployLendingRateOracle(
  environment: ZkSyncDeploymentEnvironment
): Promise<string | null> {
  console.log('Deploying Lending Rate Oracle');
  const { deployer } = environment;

  const LendingRateOracleFactory = await deployer.loadArtifact(LendingContracts.LendingRateOracle);

  const contract = await deployer.deploy(LendingRateOracleFactory);

  return contract.address;
}

export const setOracleBorrowRates = async ({
  addresses,
  borrowRates,
  symbols,
  environment,
}: {
  addresses: string[];
  borrowRates: string[];
  symbols: string[];
  environment: ZkSyncDeploymentEnvironment;
}) => {
  if (addresses.length !== borrowRates.length || addresses.length !== symbols.length) {
    throw Error('wrong param numbers in setOracleBorrowRates');
  }

  const addressProviderContract = connectToContractsRuntime(environment).addressProvider;
  if (!addressProviderContract) throw Error('addressProviderContract not found');

  const lendingRateOracle = connectToContractsRuntime(environment).lendingRateOracle;
  if (!lendingRateOracle) throw Error('lendingRateOracle not found');

  const stableAndVariableTokenHelper =
    connectToContractsRuntime(environment).stableAndVariableTokenHelper;
  if (!stableAndVariableTokenHelper) throw Error('stableAndVariableTokenHelper not found');

  console.log('before get pool admin');
  let admin;
  try {
    admin = await addressProviderContract.getPoolAdmin();
  } catch (e) {
    console.log(
      `you are not a admin, try to bring back admin to deployer - ${environment.address}`
    );

    // Set back ownership
    await waitForTx(
      await stableAndVariableTokenHelper.setOracleOwnership(
        lendingRateOracle.address,
        environment.address
      )
    );

    await delay(environment.delayInMs);

    admin = environment.address;
    console.log('admin bring back', admin);
  }

  console.log('pool admin', admin);

  // Set borrow rates per chunks
  const ratesChunks = 1;
  const chunkedTokens = chunk(addresses, ratesChunks);
  const chunkedRates = chunk(borrowRates, ratesChunks);
  const chunkedSymbols = chunk(symbols, ratesChunks);

  console.log('before transfer ownership');

  await waitForTx(await lendingRateOracle.transferOwnership(stableAndVariableTokenHelper.address));
  await delay(environment.delayInMs);
  console.log('after transfer ownership');

  console.log(`- Lending Rate oracle borrow initalization in ${chunkedTokens.length} txs`);
  for (let chunkIndex = 0; chunkIndex < chunkedTokens.length; chunkIndex++) {
    await waitForTx(
      await stableAndVariableTokenHelper.setOracleBorrowRates(
        chunkedTokens[chunkIndex],
        chunkedRates[chunkIndex],
        lendingRateOracle.address
      )
    );

    await delay(environment.delayInMs);
    console.log(`  - Setted Oracle Borrow Rates for: ${chunkedSymbols[chunkIndex].join(', ')}`);
  }

  // Set back ownership
  await waitForTx(
    await stableAndVariableTokenHelper.setOracleOwnership(lendingRateOracle.address, admin)
  );
  await delay(environment.delayInMs);
};

export const initializeLendingRateOracle = async (
  environment: ZkSyncDeploymentEnvironment,
  symbols: string[]
) => {
  const config = getContractsConfigInstant(environment.chainId, environment.env, true);
  if (!config) throw Error('config not found');
  const { LendingRateOracleRatesCommon } = getMarketConfig(environment);

  const assetAddresses = symbols.map((symbol) => config.tokens[symbol].address);
  const borrowRates = symbols.map((symbol) => LendingRateOracleRatesCommon[symbol].borrowRate);

  console.log('before set borrow rates');

  await setOracleBorrowRates({
    addresses: assetAddresses,
    borrowRates: borrowRates,
    environment: environment,
    symbols: symbols,
  });
};
