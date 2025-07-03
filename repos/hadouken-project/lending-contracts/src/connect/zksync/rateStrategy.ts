import { Provider } from '@ethersproject/providers';

import { Signer } from 'ethers';

import { DefaultReserveInterestRateStrategy } from '@src/typechain/zksync/DefaultReserveInterestRateStrategy';
import { DefaultReserveInterestRateStrategy__factory } from '@src/typechain/zksync/factories/DefaultReserveInterestRateStrategy__factory';

export const rateStrategy = (
  signerOrProvider: Signer | Provider
): ((address: string) => DefaultReserveInterestRateStrategy) => {
  return (address: string) => {
    return DefaultReserveInterestRateStrategy__factory.connect(address, signerOrProvider);
  };
};

export default rateStrategy;
