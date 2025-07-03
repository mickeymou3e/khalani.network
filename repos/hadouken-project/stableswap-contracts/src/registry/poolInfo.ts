import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { PoolInfo__factory, PoolInfo } from '../contracts'


import registryDataPerNetworkJSON from './data.json'
import { EthereumNetwork, GodwokenNetwork } from "../types";

import { IRegistryData, IRegistryDataByNetwork } from './types'

export default function(
  signerOrProvider: Signer | Provider,
  networkId: GodwokenNetwork | EthereumNetwork,
):  PoolInfo | null {
  const registryDataByNetwork = registryDataPerNetworkJSON as IRegistryDataByNetwork
  const registryData =  registryDataByNetwork[networkId] as IRegistryData
  
  if(!registryData || !registryData.PoolInfo) {
    return null
  }

  return PoolInfo__factory.connect(registryData.PoolInfo, signerOrProvider)
}