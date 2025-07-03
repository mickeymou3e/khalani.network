import { network } from 'hardhat';

import { Output } from '../../../../types';
import { AaveLinearPoolFactoryCreateParameters, ZkSyncAaveLinearPoolFactoryCreateParameters } from './types';
import { getDeploymentsByRuntimeEnv } from '../../../../../../config/src/deployments';
import { Contract, ContractFactory } from 'zksync-web3';
import ZkSyncAaveLinearPoolFactoryJSON from '../../../../../../pool-linear/artifacts-zk/contracts/aave/AaveLinearPoolFactory.sol/AaveLinearPoolFactory.json';
import ZkSyncAaveLinearPoolRebalancerJSON from '../../../../../../pool-linear/artifacts-zk/contracts/aave/AaveLinearPoolRebalancer.sol/AaveLinearPoolRebalancer.json';
import chalk from 'chalk';

async function createZksync({
  name,
  symbol,
  underlyingToken,
  wrappedToken,
  upperTarget,
  swapFeePercentage,
  owner,
  initialLiquidity,
  wallet,
}: ZkSyncAaveLinearPoolFactoryCreateParameters): Promise<
  Output<AaveLinearPoolFactoryCreateParameters, string> | undefined
> {
  const {
    AaveLinearPoolFactory: AaveLinearPoolFactoryAddress,
    Vault,
    BalancerQueries,
  } = getDeploymentsByRuntimeEnv(network.name);

  const aaveLinearPoolRebalancerFactory = new ContractFactory(
    ZkSyncAaveLinearPoolRebalancerJSON.abi,
    ZkSyncAaveLinearPoolRebalancerJSON.bytecode,
    wallet
  );

  let aaveLinearPoolRebalancerAddress;

  try {
    console.log('Deploying AaveLinearPoolRebalancer');

    const aaveLinearPoolRebalancer = await aaveLinearPoolRebalancerFactory.deploy(Vault, BalancerQueries);

    aaveLinearPoolRebalancerAddress = aaveLinearPoolRebalancer.address;
  } catch {
    console.error(chalk.red('AaveLinearPoolRebalancer deploy failed'));
  }

  const AaveLinearPoolFactoryContract = new Contract(
    AaveLinearPoolFactoryAddress,
    ZkSyncAaveLinearPoolFactoryJSON.abi,
    wallet
  );

  console.table({
    name,
    symbol,
    underlyingToken,
    wrappedToken,
    upperTarget: upperTarget.toString(),
    swapFeePercentage: swapFeePercentage.toString(),
    owner,
    aaveLinearPoolRebalancerAddress,
  });

  try {
    await AaveLinearPoolFactoryContract.callStatic.create(
      name,
      symbol,
      underlyingToken,
      wrappedToken,
      upperTarget,
      swapFeePercentage,
      owner,
      aaveLinearPoolRebalancerAddress
    );
  } catch (error) {
    console.error(error);
  }

  const transaction = await AaveLinearPoolFactoryContract.create(
    name,
    symbol,
    underlyingToken,
    wrappedToken,
    upperTarget,
    swapFeePercentage,
    owner,
    aaveLinearPoolRebalancerAddress
  );

  const receipt = await transaction.wait(2);

  const poolCreatedEvents = receipt?.events?.filter((e: { event: string }) => e.event === 'PoolCreated');
  if (poolCreatedEvents && poolCreatedEvents.length > 0 && aaveLinearPoolRebalancerAddress) {
    const poolAddress = poolCreatedEvents[0].args?.pool;

    try {
      const aaveLinearPoolRebalancerContract = new Contract(
        aaveLinearPoolRebalancerAddress,
        ZkSyncAaveLinearPoolRebalancerJSON.abi,
        wallet
      );

      console.log(chalk.yellow('Running initialize function'));

      const handleInitialize = await aaveLinearPoolRebalancerContract.initialize(poolAddress);

      await handleInitialize.wait();

      console.log(chalk.green('Initialization success'));
    } catch (e) {
      console.log(chalk.red('Initialize AaveLinearPoolRebalancer failed'));
    }

    const output: Output<AaveLinearPoolFactoryCreateParameters, string> = {
      transaction: {
        hash: transaction.hash,
        blockNumber: transaction.blockNumber,
      },
      data: {
        AaveLinearPoolFactory: {
          create: {
            input: {
              name,
              symbol,
              underlyingToken,
              wrappedToken,
              upperTarget: upperTarget.toString(),
              swapFeePercentage: swapFeePercentage.toString(),
              owner,
              initialLiquidity,
            },
            output: poolAddress,
          },
        },
      },
    };

    return output;
  }
}

export default createZksync;
