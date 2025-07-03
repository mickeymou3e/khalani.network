import { AaveLinearPoolFactory__factory } from '@hadouken-project/typechain';

import { Output } from '../../../../types';
import { AaveLinearPoolFactoryCreateParameters } from './types';
import { getDeploymentsAddresses } from '../../../../config.command';
import { randomBytes } from 'ethers/lib/utils';

async function create({
  name,
  symbol,
  underlyingToken,
  wrappedToken,
  upperTarget,
  swapFeePercentage,
  owner,
  initialLiquidity,
  environment,
}: AaveLinearPoolFactoryCreateParameters): Promise<
  Output<Omit<AaveLinearPoolFactoryCreateParameters, 'environment'>, string> | undefined
> {
  const { AaveLinearPoolFactory: AaveLinearPoolFactoryAddress } = getDeploymentsAddresses(environment.network);

  const AaveLinearPoolFactoryContract = AaveLinearPoolFactory__factory.connect(
    AaveLinearPoolFactoryAddress,
    environment.deployer
  );
  console.table({
    name,
    symbol,
    underlyingToken,
    wrappedToken,
    upperTarget: upperTarget.toString(),
    swapFeePercentage: swapFeePercentage.toString(),
    owner,
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
      0,
      randomBytes(32)
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
    0,
    randomBytes(32)
  );

  const receipt = await transaction.wait(2);

  const poolCreatedEvents = receipt?.events?.filter((e) => e.event === 'PoolCreated');
  if (poolCreatedEvents && poolCreatedEvents.length > 0) {
    const poolAddress = poolCreatedEvents[0].args?.pool;

    const output: Output<Omit<AaveLinearPoolFactoryCreateParameters, 'environment'>, string> = {
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

  return;
}

export default create;
