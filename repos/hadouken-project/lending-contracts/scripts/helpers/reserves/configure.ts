import { sendGnosisSafeTransaction } from '@cli/contracts/common/gnosisSafe';

import { connectToContractsRuntime } from '@scripts/connect';
import { ScriptRunEnvironment } from '@src/types';
import { getConfigInstant } from '@src/utils';
import { BigNumber } from 'ethers';

export async function ConfigureReserve(
  environment: ScriptRunEnvironment,
  tokenAddress: string,
  ltv: BigNumber,
  liquidationThreshold: BigNumber,
  liquidationBonus: BigNumber
) {
  const config = getConfigInstant(environment.chainId, environment.env);
  if (!config) throw Error('config not found');
  const poolConfigurator = connectToContractsRuntime(environment).poolConfiguration;
  if (!poolConfigurator) throw Error('poolConfigurator not defined');

  try {
    if (config.isGnosisSafe) {
      const functionData = poolConfigurator.interface.encodeFunctionData(
        'configureReserveAsCollateral',
        [tokenAddress, ltv, liquidationThreshold, liquidationBonus]
      );

      await sendGnosisSafeTransaction(environment, poolConfigurator.address, functionData);
    } else {
      const transaction = await poolConfigurator.configureReserveAsCollateral(
        tokenAddress,
        ltv,
        liquidationThreshold,
        liquidationBonus,
        environment.transactionOverrides
      );
      await transaction.wait();
    }
  } catch (e) {
    console.log('error', e);
  }
}
