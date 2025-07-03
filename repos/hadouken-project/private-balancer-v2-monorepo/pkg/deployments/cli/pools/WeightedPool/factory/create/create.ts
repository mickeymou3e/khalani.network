import { Output } from '../../../../types';
import { WeightedPoolFactoryCreateParameters } from './types';
import { getDeploymentsAddresses } from '../../../../config.command';
import { WeightedPoolFactory__factory } from '@hadouken-project/typechain';
import { randomBytes } from 'ethers/lib/utils';

async function create({
  name,
  symbol,
  tokens,
  weights,
  rateProviders,
  swapFeePercentage,
  delegate,
  initialLiquidity,
  environment,
}: WeightedPoolFactoryCreateParameters): Promise<
  Output<Omit<WeightedPoolFactoryCreateParameters, 'environment'>, string> | undefined
> {
  const { WeightedPoolFactory: WeightedPoolFactoryAddress } = getDeploymentsAddresses(environment.network);

  const WeightedPoolFactoryContract = WeightedPoolFactory__factory.connect(
    WeightedPoolFactoryAddress,
    environment.deployer
  );

  try {
    await WeightedPoolFactoryContract.callStatic.create(
      name,
      symbol,
      tokens,
      weights,
      rateProviders,
      swapFeePercentage,
      delegate,
      randomBytes(32)
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
    delegate,
    randomBytes(32)
  );
  const receipt = await transaction.wait(2);

  const poolCreatedEvents = receipt?.events?.filter((e) => e.event === 'PoolCreated');
  if (poolCreatedEvents && poolCreatedEvents.length > 0) {
    const poolAddress = poolCreatedEvents[0].args?.pool;

    const output: Output<Omit<WeightedPoolFactoryCreateParameters, 'environment'>, string> = {
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
