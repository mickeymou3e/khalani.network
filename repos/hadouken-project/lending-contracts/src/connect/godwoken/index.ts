import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';

import { default as connectAddressProvider } from '../base/addressProvider';

import { Environments } from '../../types/types';
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

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false
) {
  const network = 'godwoken';

  return {
    registry: connectRegistry(signerOrProvider, environment, runTime, network),
    addressProvider: connectAddressProvider(signerOrProvider, environment, runTime, network),
    poolWithoutProxy: connectPool(signerOrProvider, environment, runTime, true, network),
    pool: connectPool(signerOrProvider, environment, runTime, false, network),
    token: connectToken(signerOrProvider),
    mintToken: connectMintToken(signerOrProvider),
    aToken: connectAToken(signerOrProvider),
    aTokenAndRateHelper: connectATokenAndRateHelper(
      signerOrProvider,
      environment,
      runTime,
      network
    ),
    stableAndVariableTokenHelper: connectStableAndVariableTokenHelper(
      signerOrProvider,
      environment,
      runTime,
      network
    ),
    stableDebtToken: connectStableDebtToken(signerOrProvider),
    variableDebtToken: connectVariableDebtToken(signerOrProvider),
    dataProvider: connectDataProvider(signerOrProvider, environment, runTime, network),
    oracleBandProvider: connectOracleBandProvider(signerOrProvider, environment, runTime, network),
    OracleDiaProvider: connectDiaOracleProvider(signerOrProvider, environment, runTime, network),
    diaOracle: connectDiaOracle(signerOrProvider, environment, runTime, network),
    hadoukenOracle: connectHadoukenOracle(signerOrProvider, environment, runTime, network),
    stdReference: connectStdReference(signerOrProvider, environment, runTime, network),
    userBalances: connectUserBalances(signerOrProvider, environment, runTime, network),
    uiHelper: connectUIHelper(signerOrProvider, environment, runTime, network),

    poolConfiguration: connectPoolConfigurator(signerOrProvider, environment, runTime, network),
    rateStrategy: connectRateStrategy(signerOrProvider),
    lendingRateOracle: connectLendingRateOracle(signerOrProvider, environment, runTime, network),

    treasury: connectTreasury(signerOrProvider, environment, runTime, network),
    hadoukenCollector: connectHadoukenCollector(signerOrProvider, environment, runTime, network),
    gnosisSafe: connectGnosisSafe(signerOrProvider, environment, runTime, network),
    wEthGateway: connectWEthGateway(signerOrProvider, environment, runTime, network),
  };
}
