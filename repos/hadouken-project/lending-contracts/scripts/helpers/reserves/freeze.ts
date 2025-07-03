import { sendGnosisSafeTransaction } from '@cli/contracts/common/gnosisSafe';
import { connectToContractsRuntime } from '@scripts/connect';
import { ScriptRunEnvironment } from '@src/types';
import { getConfigInstant, getContractsConfigInstant } from '@src/utils';

export async function freezeReserve(
  environment: ScriptRunEnvironment,
  tokenAddress: string,
  freeze: Boolean
) {
  const config = getConfigInstant(environment.chainId, environment.env, true);
  const contractsConfig = getContractsConfigInstant(environment.chainId, environment.env, true);
  if (!config) throw Error('config not found');
  if (!contractsConfig) return null;

  const poolConfigurator = connectToContractsRuntime(environment).poolConfiguration;
  if (!poolConfigurator) throw Error('pool configurator not found');

  try {
    if (freeze) {
      if (config.isGnosisSafe) {
        const functionData = poolConfigurator.interface.encodeFunctionData('freezeReserve', [
          tokenAddress,
        ]);

        await sendGnosisSafeTransaction(environment, poolConfigurator.address, functionData);
      } else {
        const freezeTransaction = await poolConfigurator.freezeReserve(
          tokenAddress,
          environment.transactionOverrides
        );
        await freezeTransaction.wait();
      }

      console.log(`(${tokenAddress}) is frozen`);
    } else {
      if (config.isGnosisSafe) {
        const functionData = poolConfigurator.interface.encodeFunctionData('unfreezeReserve', [
          tokenAddress,
        ]);

        await sendGnosisSafeTransaction(environment, poolConfigurator.address, functionData);
      } else {
        const unfreezeTransaction = await poolConfigurator.unfreezeReserve(
          tokenAddress,
          environment.transactionOverrides
        );
        await unfreezeTransaction.wait();
      }

      console.log(`(${tokenAddress}) is unfrozen`);
    }
  } catch (e) {
    console.log('error', e);
  }
}
