import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { Swaps__factory, Swaps } from '../contracts'


import registryDataPerNetworkJSON from './data.json'
import { EthereumNetwork, GodwokenNetwork } from "../types";

import { IRegistryData, IRegistryDataByNetwork } from './types'

export default function(
  signerOrProvider: Signer | Provider,
  networkId: GodwokenNetwork | EthereumNetwork,
): Swaps | null {
  const registryDataByNetwork = registryDataPerNetworkJSON as IRegistryDataByNetwork
  const registryData =  registryDataByNetwork[networkId] as IRegistryData

  if(!registryData || !registryData.Swaps) {
    return null
  }

  return Swaps__factory.connect(registryData.Swaps, signerOrProvider)
}