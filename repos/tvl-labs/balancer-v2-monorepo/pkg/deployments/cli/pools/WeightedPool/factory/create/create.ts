import { ethers, network } from 'hardhat';
import { WeightedPoolFactory, WeightedPoolFactory__factory } from '@balancer-labs/typechain';

import input from '../input';

import WeightedPoolFactoryAbi from '../abi/WeightedPoolFactory.json';
import { WeightedPoolFactoryCreateParameters } from './types';
import { Output } from '../../../../types';

async function create({
  name,
  symbol,
  tokens,
  weights,
  rateProviders,
  swapFeePercentage,
  delegate,
  initialLiquidity,
}: WeightedPoolFactoryCreateParameters): Promise<Output<WeightedPoolFactoryCreateParameters, string> | undefined> {
  const { WeightedPoolTask } = input;
  const { WeightedPoolFactory: WeightedPoolFactoryAddress } = WeightedPoolTask.output({
    network: network.name,
  });

  const WeightedPoolFactoryContract = (await ethers.getContractAt(
    WeightedPoolFactoryAbi,
    WeightedPoolFactoryAddress
  )) as WeightedPoolFactory;

  try {
    await WeightedPoolFactoryContract.callStatic.create(
      name,
      symbol,
      tokens,
      weights,
      rateProviders,
      swapFeePercentage,
      delegate
    );
  } catch (error) {
    console.error(error);
    process.exit(0);
  }

  const transaction = await WeightedPoolFactoryContract.create(
    name,
    symbol,
    tokens,
    weights,
    rateProviders,
    swapFeePercentage,
    delegate
  );
  const receipt = await transaction.wait(2);

  const poolCreatedEvents = receipt?.events?.filter((e) => e.event === 'PoolCreated');
  if (poolCreatedEvents && poolCreatedEvents.length > 0) {
    const poolAddress = poolCreatedEvents[0].args?.pool;

    const output: Output<WeightedPoolFactoryCreateParameters, string> = {
      transaction: {
        hash: transaction.hash,
        blockNumber: transaction.blockNumber,
      },
      data: {
        WeightedPoolFactory: {
          create: {
            input: {
              name,
              symbol,
              tokens,
              weights: weights.map((weight) => weight.toString()),
              rateProviders,
              swapFeePercentage: swapFeePercentage.toString(),
              delegate,
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

export default create;
