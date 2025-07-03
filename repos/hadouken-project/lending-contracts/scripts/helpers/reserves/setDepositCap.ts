import { sendGnosisSafeTransaction } from '@cli/contracts/common/gnosisSafe';
import { connectToContractsRuntime } from '@scripts/connect';

import { ScriptRunEnvironment } from '@src/types';
import { getConfigInstant } from '@src/utils';
import { BigNumber } from 'ethers';

export async function setDepositCap(
  environment: ScriptRunEnvironment,
  tokenAddress: string,
  amount: BigNumber
) {
  const config = getConfigInstant(environment.chainId, environment.env, true);
  if (!config) throw Error('config not found');
  const poolConfigurator = connectToContractsRuntime(environment).poolConfiguration;

  if (!poolConfigurator) throw Error('poolConfigurator not defined');

  try {
    if (config.isGnosisSafe) {
      const functionData = poolConfigurator.interface.encodeFunctionData('setDepositCap', [
        tokenAddress,
        amount,
      ]);

      await sendGnosisSafeTransaction(environment, poolConfigurator.address, functionData);
    } else {
      const setDepositCapTransaction = await poolConfigurator.setDepositCap(
        tokenAddress,
        amount,
        environment.transactionOverrides
      );
      await setDepositCapTransaction.wait();
    }

    console.log(`(${tokenAddress}): new deposit cap is ${amount}`);
  } catch (e) {
    console.log('error', e);
  }
}
