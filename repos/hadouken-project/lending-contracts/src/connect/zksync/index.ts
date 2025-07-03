import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';

import { Environments } from '../../types/types';
import { default as connectAddressProvider } from './addressProvider';
import { default as connectDataProvider } from './dataProvider';
import { default as connectDiaOracle } from './diaOracle';
import { default as connectDiaOracleProvider } from './diaOracleProvider';
import { default as connectGnosisSafe } from './gnosisSafe';
import { default as connectHadoukenCollector } from './hadoukenCollector';
import { default as connectHadoukenOracle } from './hadoukenOracle';
import { default as connectLendingRateOracle } from './lendingRateOracle';
import { default as connectOracleBandProvider } from './oracleBandProvider';
import { default as connectPool } from './pool';
import { default as connectPoolConfigurator } from './poolConfigurator';
import { default as connectRateStrategy } from './rateStrategy';
import { default as connectRegistry } from './registry';
import { default as connectStdReference } from './stdReference';
import { default as connectATokenAndRateHelper } from './tokens/aTokenAndRateHelper';
import { default as connectAToken } from './tokens/atoken';
import { Erc20Token as connectToken } from './tokens/erc20';
import { Erc20TestToken as connectMintToken } from './tokens/erc20test';
import { default as connectStableAndVariableTokenHelper } from './tokens/stableAndVariableTokenHelper';
import { default as connectStableDebtToken } from './tokens/stableDebtToken';
import { default as connectVariableDebtToken } from './tokens/variableDebtToken';
import { default as connectTreasury } from './treasury';
import { default as connectUIHelper } from './uiHelper';
import { default as connectUserBalances } from './userBalances';
import { default as connectWEthGateway } from './wETHGateway';

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
