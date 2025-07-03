import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { AddressProvider__factory, AddressProvider } from '../contracts'


import registryDataPerNetworkJSON from './data.json'
import { EthereumNetwork, GodwokenNetwork } from "../types";

import { IRegistryData, IRegistryDataByNetwork } from './types'

export default function(
  signerOrProvider: Signer | Provider,
  networkId: GodwokenNetwork | EthereumNetwork,
): AddressProvider | null {
  const registryDataByNetwork = registryDataPerNetworkJSON as IRegistryDataByNetwork
  const registryData =  registryDataByNetwork[networkId] as IRegistryData
  
  if(!registryData || !registryData.AddressProvider) {
    return null
  }

  return AddressProvider__factory.connect(registryData.AddressProvider, signerOrProvider)
}