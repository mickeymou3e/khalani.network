import { sendGnosisSafeTransaction } from '@cli/contracts/common/gnosisSafe';
import { connectToContractsRuntime } from '@scripts/connect';
import { ScriptRunEnvironment } from '@src/types';
import { addSlippageToValue, getConfigInstant, getContractsConfigInstant } from '@src/utils';

export async function enableReserve(
  environment: ScriptRunEnvironment,
  tokenAddress: string,
  enable: boolean
) {
  const config = getConfigInstant(environment.chainId, environment.env);
  const contractsConfig = getContractsConfigInstant(environment.chainId, environment.env, true);
  if (!config) throw Error('config not found');
  if (!contractsConfig) return null;

  const poolConfigurator = connectToContractsRuntime(environment).poolConfiguration;
  if (!poolConfigurator) throw Error('Pool configurator not defined');

  try {
    if (enable) {
      if (config.isGnosisSafe) {
        const functionData = poolConfigurator.interface.encodeFunctionData('activateReserve', [
          tokenAddress,
        ]);

        await sendGnosisSafeTransaction(environment, poolConfigurator.address, functionData);
      } else {
        const activateTransaction = await poolConfigurator.activateReserve(
          tokenAddress,
          environment.transactionOverrides
        );
        await activateTransaction.wait();
      }

      console.log(`(${tokenAddress}) is activated`);
    } else {
      if (config.isGnosisSafe) {
        const functionData = poolConfigurator.interface.encodeFunctionData('deactivateReserve', [
          tokenAddress,
        ]);

        await sendGnosisSafeTransaction(environment, poolConfigurator.address, functionData);
      } else {
        const estimateGas = await poolConfigurator.estimateGas.deactivateReserve(tokenAddress, {
          gasPrice: 0,
        });

        const deactivateTransaction = await poolConfigurator.deactivateReserve(tokenAddress, {
          gasLimit: addSlippageToValue(estimateGas, 5),
          gasPrice: config.gasPrice,
        });

        await deactivateTransaction.wait();
      }

      console.log(`(${tokenAddress}) is deactivated`);
    }
  } catch (e) {
    console.log('error', e);
  }
}
