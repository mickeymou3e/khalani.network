import { sendGnosisSafeTransaction } from '@cli/contracts/common/gnosisSafe';
import { connectToContractsRuntime } from '@scripts/connect';
import { ScriptRunEnvironment } from '@src/types';
import { getConfigInstant, getContractsConfigInstant } from '@src/utils';

export async function enableStableRate(
  environment: ScriptRunEnvironment,
  tokenAddress: string,
  stableRateEnable: boolean
) {
  const config = getConfigInstant(environment.chainId, environment.env, true);
  const contractsConfig = getContractsConfigInstant(environment.chainId, environment.env, true);
  if (!config) throw Error('config not found');
  if (!contractsConfig) return null;

  const poolConfigurator = connectToContractsRuntime(environment).poolConfiguration;
  if (!poolConfigurator) throw Error('poolConfigurator not found');

  try {
    if (stableRateEnable) {
      if (config.isGnosisSafe) {
        const functionData = poolConfigurator.interface.encodeFunctionData(
          'enableReserveStableRate',
          [tokenAddress]
        );

        await sendGnosisSafeTransaction(environment, poolConfigurator.address, functionData);
      } else {
        const activateTransaction = await poolConfigurator.enableReserveStableRate(
          tokenAddress,
          environment.transactionOverrides
        );
        await activateTransaction.wait();
      }

      console.log(`(${tokenAddress}) stable rate is enable`);
    } else {
      if (config.isGnosisSafe) {
        const functionData = poolConfigurator.interface.encodeFunctionData(
          'disableReserveStableRate',
          [tokenAddress]
        );

        await sendGnosisSafeTransaction(environment, poolConfigurator.address, functionData);
      } else {
        const deactivateTransaction = await poolConfigurator.disableReserveStableRate(
          tokenAddress,
          environment.transactionOverrides
        );
        await deactivateTransaction.wait();
      }

      console.log(`(${tokenAddress}) stable rate is disabled`);
    }
  } catch (e) {
    console.log('error', e);
  }
}
