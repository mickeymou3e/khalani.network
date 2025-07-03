import { ethers, network } from 'hardhat';
import { ComposableStablePoolFactory } from '@balancer-labs/typechain';

import { Output } from '../../../../types';

import { ComposableStablePoolFactoryCreateParameters } from './types';

import ComposableStablePoolFactoryAbi from '../abi/ComposableStablePoolFactory.json';
import { getDeploymentsByRuntimeEnv } from '../../../../../../config/src/deployments';

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
}: ComposableStablePoolFactoryCreateParameters): Promise<
  Output<ComposableStablePoolFactoryCreateParameters, string> | undefined
> {
  const { ComposableStablePoolFactory: ComposableStablePoolFactoryAddress } = getDeploymentsByRuntimeEnv(network.name);

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

  const ComposableStablePoolFactoryContract = (await ethers.getContractAt(
    ComposableStablePoolFactoryAbi,
    ComposableStablePoolFactoryAddress
  )) as ComposableStablePoolFactory;

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
      owner
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
    owner
  );
  const receipt = await transaction.wait(2);

  const poolCreatedEvents = receipt?.events?.filter((e) => e.event === 'PoolCreated');
  if (poolCreatedEvents && poolCreatedEvents.length > 0) {
    const poolAddress = poolCreatedEvents[0].args?.pool;

    const output: Output<ComposableStablePoolFactoryCreateParameters, string> = {
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
