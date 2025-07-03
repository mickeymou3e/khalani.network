import { ContractFactory, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import {
  SwapTemplateBase,
  SwapTemplateBase__factory,
  SwapTemplateBase2__factory,
  SwapTemplateBase3__factory,
  SwapTemplateBase4__factory,
  SwapTemplateBase5__factory,
  SwapTemplateBase6__factory,
  SwapTemplateBase7__factory,
  SwapTemplateBase8__factory,
} from '../contracts'

/**
 * Every base pool (like 3pool) is based on SwapTemplateBase contract which is not actually deployed
 * and used as template/interface for base pool.
 * So we have SwapTemplateBaseN compiled for every possible token's length pool called N-pool
 * We need SwapTemplateBaseN compiled for every pool token's length because compiled contract bytecode is used in web3 Contract
 * to interact with contract on chain.
 * SwapTemplateBase is used only as interface with dynamic length arrays in output/input of contract method's, only abi of
 * SwapTemplateBase is used to produce TypeScript interface
 * @param signerOrProvider 
 * @returns 
 */

interface PoolConnect {
  (address: string, signerOrProvider: Signer | Provider): SwapTemplateBase
}

const poolFactoryStaticConnectByN: { [key: number]: PoolConnect} = {
  2: SwapTemplateBase2__factory.connect as unknown as PoolConnect,
  3: SwapTemplateBase3__factory.connect as unknown as PoolConnect,
  4: SwapTemplateBase4__factory.connect as unknown as PoolConnect,
  5: SwapTemplateBase5__factory.connect as unknown as PoolConnect,
  6: SwapTemplateBase6__factory.connect as unknown as PoolConnect,
  7: SwapTemplateBase7__factory.connect as unknown as PoolConnect,
  8: SwapTemplateBase8__factory.connect as unknown as PoolConnect,
}

export default function(signerOrProvider: Signer | Provider): 
  (poolAddress: string, poolN: number) => SwapTemplateBase {

  return (poolAddress, poolN) => {
    const poolFactoryConnect = poolFactoryStaticConnectByN[poolN]
    return poolFactoryConnect(poolAddress, signerOrProvider) as unknown as SwapTemplateBase
  }
}