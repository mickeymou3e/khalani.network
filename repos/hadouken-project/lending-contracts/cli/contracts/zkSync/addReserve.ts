import { updateTokensConfigCli } from '@cli/contracts/common/updateTokensConfig';
import { getMarketConfig } from '@markets/index';
import {
  configureZkSyncReservesByHelper,
  initializeZkSyncReservesByHelper,
} from '@scripts/deploy/zkSync/initializePool';
import { initializeLendingRateOracle } from '@scripts/deploy/zkSync/oracle';
import { connectZkSync } from '@src/connect';
import { ScriptRunEnvironment, ZkSyncDeploymentEnvironment } from '@src/types';
import { delay } from '@src/utils';
import { getZkSyncContractsConfigStatic } from '@src/zksync';

export const addReserveCli = async (
  token: { symbol: string; address: string },
  environment: ScriptRunEnvironment
) => {
  const delayTime = Number(environment.delayInMs);
  const marketConfig = getMarketConfig(environment, [token.symbol]);

  const contractsConfig = getZkSyncContractsConfigStatic(environment.env, true);

  const connect = connectZkSync(environment.deployer, environment.env, true);

  const addressProvider = connect.addressProvider;
  if (!addressProvider) {
    throw Error('Address provider not found');
  }

  const symbolNoOrigin = token.symbol.split('.')[0];

  const oracleBandOracleProviderContract = connect.oracleBandProvider;

  if (!oracleBandOracleProviderContract) throw Error('Band oracle not found');

  await oracleBandOracleProviderContract.updateMappings([token.address], [symbolNoOrigin]);

  const diaOracleProviderContract = connect.OracleDiaProvider;

  if (!diaOracleProviderContract) throw Error('Dia oracle not found');

  await diaOracleProviderContract.updateMappings([token.address], [symbolNoOrigin]);

  const dataProvider = connect.dataProvider;

  if (!dataProvider) throw Error('Data provider not found');

  await initializeLendingRateOracle(environment as unknown as ZkSyncDeploymentEnvironment, [
    token.symbol,
  ]);

  const {
    ATokenNamePrefix,
    StableDebtTokenNamePrefix,
    VariableDebtTokenNamePrefix,
    ReserveAssets,
    ReservesConfig,
    IncentivesController,
  } = marketConfig;

  await initializeZkSyncReservesByHelper(
    environment as unknown as ZkSyncDeploymentEnvironment,
    {
      variableTokenAddress: contractsConfig.variableDebtToken,
      aTokenAddress: contractsConfig.aToken,
      stableTokenAddress: contractsConfig.stableDebtToken,
      treasuryAddress: contractsConfig.treasury,
      poolConfigAddress: contractsConfig.poolConfiguratorProxy,
      addressProvider: addressProvider,
      incentivesController: IncentivesController,
      variableDebtTokenNamePrefix: VariableDebtTokenNamePrefix,
      stableDebtTokenNamePrefix: StableDebtTokenNamePrefix,
      tokenAddresses: ReserveAssets,
      reservesParams: ReservesConfig,
      aTokenNamePrefix: ATokenNamePrefix,
    },
    delayTime
  );

  const admin = await addressProvider.getPoolAdmin();

  await configureZkSyncReservesByHelper(
    environment as unknown as ZkSyncDeploymentEnvironment,
    {
      reservesParams: ReservesConfig,
      tokenAddresses: ReserveAssets,
      helpers: dataProvider,
      admin,
    },
    delayTime
  );
  await delay(delayTime);
  console.log('Configured reserves');

  await updateTokensConfigCli(environment);
  await delay(delayTime);
  console.log('Updated lending token addresses');
};
