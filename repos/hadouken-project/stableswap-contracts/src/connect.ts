import connectPools from './pools'
import connectToken, { connectWCKB } from './tokens/godwoken'
import {
  connectAddressProvider,
  connectPoolInfo,
  connectRegistry,
  connectSwaps,
  connectUserBalances
} from './registry'

import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { GodwokenNetwork } from './types';

export default function(
  signerOrProvider: Signer | Provider,
  networkId: GodwokenNetwork
) {
  return {
    pools: connectPools(signerOrProvider),
    token: connectToken(signerOrProvider),
    wCKB: connectWCKB(signerOrProvider, networkId),
    registry: connectRegistry(signerOrProvider, networkId),
    poolInfo: connectPoolInfo(signerOrProvider, networkId),
    addressProvider: connectAddressProvider(signerOrProvider, networkId),
    swaps: connectSwaps(signerOrProvider, networkId),
    userBalances: connectUserBalances(signerOrProvider, networkId),
  }
}
