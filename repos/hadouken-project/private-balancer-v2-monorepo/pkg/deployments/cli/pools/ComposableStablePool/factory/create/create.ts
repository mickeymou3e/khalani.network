import { ComposableStablePoolFactory__factory } from '@hadouken-project/typechain';
import { Output } from '../../../../types';

import { ComposableStablePoolFactoryCreateParameters } from './types';

import { getDeploymentsAddresses } from '../../../../config.command';
import { randomBytes } from 'crypto';

async function create({
  name,
  symbol,
  tokens,
  rateProviders,
  priceRateCacheDuration,
  amplificationParameter,
  swapFeePercentage,
  exemptFromYieldProtocolFeeFlags,
  owner,
  initialLiquidity,
  environment,
}: ComposableStablePoolFactoryCreateParameters): Promise<
  Output<Omit<ComposableStablePoolFactoryCreateParameters, 'environment'>, string> | undefined
> {
  const { ComposableStablePoolFactory: ComposableStablePoolFactorAddress } = getDeploymentsAddresses(
    environment.network
  );

  const ComposableStablePoolFactoryContract = ComposableStablePoolFactory__factory.connect(
    ComposableStablePoolFactorAddress,
    environment.deployer
  );

  console.table({
    name,
    symbol,
    tokens: tokens.join(', '),
    rateProviders: rateProviders.join(', '),
    priceRateCacheDuration: priceRateCacheDuration.map((duration) => duration.toString()).join(', '),
    amplificationParameter: amplificationParameter.toString(),
    exemptFromYieldProtocolFeeFlags: exemptFromYieldProtocolFeeFlags.join(', '),
    swapFeePercentage: swapFeePercentage.toString(),
    owner,
  });

  try {
    await ComposableStablePoolFactoryContract.callStatic.create(
      name,
      symbol,
      tokens,
      amplificationParameter,
      rateProviders,
      priceRateCacheDuration,
      exemptFromYieldProtocolFeeFlags,
      swapFeePercentage,
      owner,
      randomBytes(32)
    );
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
  const transaction = await ComposableStablePoolFactoryContract.create(
    name,
    symbol,
    tokens,
    amplificationParameter,
    rateProviders,
    priceRateCacheDuration,
    exemptFromYieldProtocolFeeFlags,
    swapFeePercentage,
    owner,
    randomBytes(32)
  );
  const receipt = await transaction.wait(2);

  const poolCreatedEvents = receipt?.events?.filter((e) => e.event === 'PoolCreated');
  if (poolCreatedEvents && poolCreatedEvents.length > 0) {
    const poolAddress = poolCreatedEvents[0].args?.pool;

    const output: Output<Omit<ComposableStablePoolFactoryCreateParameters, 'environment'>, string> = {
      transaction: {
        hash: transaction.hash,
        blockNumber: transaction.blockNumber,
      },
      data: {
        ComposableStablePoolFactory: {
          create: {
            input: {
              name,
              symbol,
              tokens,
              rateProviders: rateProviders,
              priceRateCacheDuration: priceRateCacheDuration.map((duration) => duration.toString()),
              amplificationParameter: amplificationParameter.toString(),
              swapFeePercentage: swapFeePercentage.toString(),
              exemptFromYieldProtocolFeeFlags,
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

export default create;
