import { connectToContractsRuntime } from '@scripts/connect';
import { Cli } from '@src/types';
import { getConfigInstant } from '@src/utils';
import prompts from 'prompts';
import { sendGnosisSafeTransaction } from '../gnosisSafe';

export const ShutdownCli: Cli = async ({ environment, parentCli }) => {
  const pool = connectToContractsRuntime(environment).pool;
  const poolConfiguration = connectToContractsRuntime(environment).poolConfiguration;

  if (!pool) throw Error('pool not found');
  if (!poolConfiguration) throw Error('pool configurator not found');

  const isPoolShutDown = await pool.paused();

  console.log(isPoolShutDown ? 'Pool is currently shut down' : 'Pool is currently turn on');

  const { action } = await prompts(
    {
      type: 'confirm',
      name: 'action',
      message: isPoolShutDown ? 'You want to turn on then pool' : 'You want to shut down the pool?',
    },
    {
      onCancel: () => {
        return parentCli ? parentCli({ environment }) : process.exit(0);
      },
    }
  );

  if (action) {
    const shutDownThePool = !isPoolShutDown;
    shutDownThePool ? console.log('shut down the pool') : console.log('turn on the pool');

    const config = getConfigInstant(environment.chainId, environment.env);
    if (!config) throw Error('config not found');
    const isGnosisSafe = config.isGnosisSafe;

    if (isGnosisSafe) {
      const functionData = poolConfiguration.interface.encodeFunctionData('setPoolPause', [
        shutDownThePool,
      ]);

      await sendGnosisSafeTransaction(environment, poolConfiguration.address, functionData);
    } else {
      const transaction = await poolConfiguration.setPoolPause(shutDownThePool, {
        gasLimit: config.gasLimit,
        gasPrice: config.gasPrice,
      });
      await transaction.wait();
    }
  }
};
