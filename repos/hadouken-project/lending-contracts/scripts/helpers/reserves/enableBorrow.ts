import { sendGnosisSafeTransaction } from '@cli/contracts/common/gnosisSafe';
import { connectToContractsRuntime } from '@scripts/connect';
import { ScriptRunEnvironment } from '@src/types';
import { getConfigInstant, getContractsConfigInstant } from '@src/utils';

export async function enableBorrow(
  environment: ScriptRunEnvironment,
  tokenAddress: string,
  enableBorrow: boolean,
  currentStableRate: boolean
) {
  const config = getConfigInstant(environment.chainId, environment.env);
  const contractsConfig = getContractsConfigInstant(environment.chainId, environment.env, true);
  if (!config) throw Error('config not found');
  if (!contractsConfig) return null;

  const poolConfigurator = connectToContractsRuntime(environment).poolConfiguration;
  if (!poolConfigurator) throw Error('poolConfigurator not found');

  try {
    if (enableBorrow) {
      if (config.isGnosisSafe) {
        const functionData = poolConfigurator.interface.encodeFunctionData(
          'enableBorrowingOnReserve',
          [tokenAddress, currentStableRate]
        );

        await sendGnosisSafeTransaction(environment, poolConfigurator.address, functionData);
      } else {
        const activateTransaction = await poolConfigurator.enableBorrowingOnReserve(
          tokenAddress,
          currentStableRate,
          environment.transactionOverrides
        );
        await activateTransaction.wait();
      }

      console.log(`(${tokenAddress}) borrow is enable`);
    } else {
      if (config.isGnosisSafe) {
        const functionData = poolConfigurator.interface.encodeFunctionData(
          'disableBorrowingOnReserve',
          [tokenAddress]
        );

        await sendGnosisSafeTransaction(environment, poolConfigurator.address, functionData);
      } else {
        const deactivateTransaction = await poolConfigurator.disableBorrowingOnReserve(
          tokenAddress,
          environment.transactionOverrides
        );
        await deactivateTransaction.wait();
      }

      console.log(`(${tokenAddress}) borrow is disabled`);
    }
  } catch (e) {
    console.log('error', e);
  }
}
