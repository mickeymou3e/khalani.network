import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { Registry__factory, Swaps__factory, Registry } from '../contracts'


import registryDataPerNetworkJSON from './data.json'
import { EthereumNetwork, GodwokenNetwork } from "../types";

import { IRegistryData, IRegistryDataByNetwork } from './types'

export default function(
  signerOrProvider: Signer | Provider,
  networkId: GodwokenNetwork | EthereumNetwork,
): Registry | null {
  const registryDataByNetwork = registryDataPerNetworkJSON as IRegistryDataByNetwork
  const registryData =  registryDataByNetwork[networkId] as IRegistryData
  
  if(!registryData || !registryData.Registry) {
    return null
  }

  return Registry__factory.connect(registryData.Registry, signerOrProvider)
}