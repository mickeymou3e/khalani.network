import { sendGnosisSafeTransaction } from '@cli/contracts/common/gnosisSafe';
import { connectToContractsRuntime } from '@scripts/connect';

import { ScriptRunEnvironment } from '@src/types';
import { getConfigInstant, getContractsConfigInstant } from '@src/utils';
import { BigNumber } from 'ethers';

export async function setBorrowCap(
  environment: ScriptRunEnvironment,
  tokenAddress: string,
  amount: BigNumber
) {
  const config = getConfigInstant(environment.chainId, environment.env, true);
  const contractsConfig = getContractsConfigInstant(environment.chainId, environment.env, true);
  if (!config) throw Error('config not found');
  if (!contractsConfig) return null;

  const poolConfigurator = connectToContractsRuntime(environment).poolConfiguration;
  if (!poolConfigurator) throw Error('pool configurator not found');

  try {
    if (config.isGnosisSafe) {
      const functionData = poolConfigurator.interface.encodeFunctionData('setBorrowCap', [
        tokenAddress,
        amount,
      ]);

      await sendGnosisSafeTransaction(environment, poolConfigurator.address, functionData);
    } else {
      const setBorrowCapTransaction = await poolConfigurator.setBorrowCap(
        tokenAddress,
        amount,
        environment.transactionOverrides
      );
      await setBorrowCapTransaction.wait();
    }

    console.log(`(${tokenAddress}): new borrow cap is ${amount}`);
  } catch (e) {
    console.log('error', e);
  }
}
