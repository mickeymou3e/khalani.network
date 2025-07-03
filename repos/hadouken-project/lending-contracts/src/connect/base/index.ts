export * as AddressProviderConnect from './addressProvider';
export * as diaOracleProviderConnect from './diaOracleProvider';
export * as LendingPoolConnect from './pool';
export * as Erc20TestTokenConnect from './tokens/erc20mint';
export * as UiHelperConnect from './uiHelper';
import { Provider } from '@ethersproject/providers';

import { Environments } from '@src/types/types';
import { default as connectDataProvider } from '../base/dataProvider';
import { default as connectDiaOracle } from '../base/diaOracle';
import { default as connectDiaOracleProvider } from '../base/diaOracleProvider';
import { default as connectGnosisSafe } from '../base/gnosisSafe';
import { default as connectHadoukenCollector } from '../base/hadoukenCollector';
import { default as connectHadoukenOracle } from '../base/hadoukenOracle';
import { default as connectLendingRateOracle } from '../base/lendingRateOracle';
import { default as connectOracleBandProvider } from '../base/oracleBandProvider';
import { default as connectPool } from '../base/pool';
import { default as connectPoolConfigurator } from '../base/poolConfigurator';
import { default as connectRateStrategy } from '../base/rateStrategy';
import { default as connectRegistry } from '../base/registry';
import { default as connectStdReference } from '../base/stdReference';
import { default as connectATokenAndRateHelper } from '../base/tokens/aTokenAndRateHelper';
import { default as connectAToken } from '../base/tokens/atoken';
import { Erc20Token as connectToken } from '../base/tokens/erc20';
import { Erc20TestToken as connectMintToken } from '../base/tokens/erc20mint';
import { default as connectStableAndVariableTokenHelper } from '../base/tokens/stableAndVariableTokenHelper';
import { default as connectStableDebtToken } from '../base/tokens/stableDebtToken';
import { default as connectVariableDebtToken } from '../base/tokens/variableDebtToken';
import { default as connectTreasury } from '../base/treasury';
import { default as connectUIHelper } from '../base/uiHelper';
import { default as connectUserBalances } from '../base/userBalances';
import { default as connectWEthGateway } from '../base/wETHGateway';

import { Signer } from 'ethers';
import { default as connectAddressProvider } from '../base/addressProvider';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime: boolean = false
) {
  return {
    registry: connectRegistry(signerOrProvider, environment, runTime),
    addressProvider: connectAddressProvider(signerOrProvider, environment, runTime),
    poolWithoutProxy: connectPool(signerOrProvider, environment, runTime, true),
    pool: connectPool(signerOrProvider, environment, runTime),
    token: connectToken(signerOrProvider),
    mintToken: connectMintToken(signerOrProvider),
    aToken: connectAToken(signerOrProvider),
    aTokenAndRateHelper: connectATokenAndRateHelper(signerOrProvider, environment, runTime),
    stableDebtToken: connectStableDebtToken(signerOrProvider),
    stableAndVariableTokenHelper: connectStableAndVariableTokenHelper(
      signerOrProvider,
      environment,
      runTime
    ),
    variableDebtToken: connectVariableDebtToken(signerOrProvider),
    dataProvider: connectDataProvider(signerOrProvider, environment, runTime),
    oracleBandProvider: connectOracleBandProvider(signerOrProvider, environment, runTime),
    OracleDiaProvider: connectDiaOracleProvider(signerOrProvider, environment, runTime),
    diaOracle: connectDiaOracle(signerOrProvider, environment, runTime),
    hadoukenOracle: connectHadoukenOracle(signerOrProvider, environment, runTime),
    stdReference: connectStdReference(signerOrProvider, environment, runTime),
    userBalances: connectUserBalances(signerOrProvider, environment, runTime),
    uiHelper: connectUIHelper(signerOrProvider, environment, runTime),
    poolConfiguration: connectPoolConfigurator(signerOrProvider, environment, runTime),
    rateStrategy: connectRateStrategy(signerOrProvider),
    lendingRateOracle: connectLendingRateOracle(signerOrProvider, environment, runTime),

    treasury: connectTreasury(signerOrProvider, environment, runTime),
    hadoukenCollector: connectHadoukenCollector(signerOrProvider, environment, runTime),
    gnosisSafe: connectGnosisSafe(signerOrProvider, environment, runTime),
    wEthGateway: connectWEthGateway(signerOrProvider, environment, runTime),
  };
}
