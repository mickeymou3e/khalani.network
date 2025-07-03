import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { UserBalances__factory, UserBalances } from '../contracts'


import registryDataPerNetworkJSON from './data.json'
import { EthereumNetwork, GodwokenNetwork } from "../types";

import { IRegistryData, IRegistryDataByNetwork } from './types'

export default function(
  signerOrProvider: Signer | Provider,
  networkId: GodwokenNetwork | EthereumNetwork,
): UserBalances | null {
  const registryDataByNetwork = registryDataPerNetworkJSON as IRegistryDataByNetwork
  const registryData =  registryDataByNetwork[networkId] as IRegistryData

  if(!registryData || !registryData.UserBalances) {
    return null
  }

  return UserBalances__factory.connect(registryData.UserBalances, signerOrProvider)
}